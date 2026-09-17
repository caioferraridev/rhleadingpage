-- =====================================================
-- Academia RH - Hardening de segurança
-- 1) Token de confirmação de alta entropia (anti-enumeração)
-- 2) Tabela de rate limit (anti-abuso, anti brute-force)
-- 3) RLS na tabela email_notifications
-- 4) confirm_registration: valida valor pago e capacidade
-- =====================================================

-- 1) Confirmation token: segredo por inscrição usado na página /sucesso.
-- O collection_id/payment_id do Mercado Pago é sequencial e NÃO deve ser
-- usado como chave pública de lookup (permite enumeração de inscritos).
ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS confirmation_token TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_confirmation_token
  ON registrations(confirmation_token)
  WHERE confirmation_token IS NOT NULL;

-- 2) Rate limit por chave (IP/email/etc.). Acesso somente via service_role.
CREATE TABLE IF NOT EXISTS api_rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE api_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No public access to api_rate_limits"
  ON api_rate_limits FOR ALL
  USING (false);

-- 3) RLS na tabela de notificações de email: contém e-mails e erros internos
-- e deve ser acessível somente pelo servidor (service_role).
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No public access to email_notifications"
  ON email_notifications FOR ALL
  USING (false);

-- 4) confirm_registration endurecida:
--   - Idempotente (registro já confirmado vira no-op).
--   - Valida o valor pago contra o preço oficial do evento (nunca confia no cliente).
--   - Registro cancelado (pending expirado) só é confirmado se ainda houver vaga,
--     evitando overbooking além da capacidade.
--   - Lock da linha do evento serializa as checagens de capacidade.
CREATE OR REPLACE FUNCTION confirm_registration(
  p_payment_id TEXT,
  p_amount_paid INTEGER
)
RETURNS JSON AS $$
DECLARE
  v_registration RECORD;
  v_event RECORD;
  v_confirmed_count INTEGER;
BEGIN
  -- Encontra a inscrição pelo payment_id, com fallback pelo preference_id
  -- apenas quando o payment_id ainda não foi atrelado à inscrição.
  SELECT * INTO v_registration
  FROM registrations
  WHERE mercadopago_payment_id = p_payment_id
     OR mercadopago_preference_id = p_payment_id
  ORDER BY CASE WHEN mercadopago_payment_id = p_payment_id THEN 0 ELSE 1 END
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Registration not found');
  END IF;

  -- Idempotente: já confirmado.
  IF v_registration.registration_status = 'confirmed' THEN
    RETURN json_build_object('success', true, 'message', 'Already confirmed');
  END IF;

  -- Lock da linha do evento: serializa reservas/confirmações concorrentes.
  SELECT * INTO v_event
  FROM events
  WHERE id = v_registration.event_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Event not found');
  END IF;

  -- O valor pago deve ser o valor oficial do evento (obtido do provider,
  -- nunca do cliente).
  IF p_amount_paid IS NULL OR p_amount_paid < v_event.price THEN
    RETURN json_build_object('success', false, 'error', 'Amount mismatch');
  END IF;

  -- Inscrição cancelada (pending expirado) só pode ser confirmada se ainda
  -- houver capacidade. Garante que o banco nunca ultrapasse 50 confirmados.
  IF v_registration.registration_status = 'cancelled' THEN
    SELECT COUNT(*) INTO v_confirmed_count
    FROM registrations
    WHERE event_id = v_registration.event_id
      AND registration_status = 'confirmed'
      AND payment_status = 'paid';

    IF v_confirmed_count >= v_event.capacity THEN
      RETURN json_build_object('success', false, 'error', 'No spots available');
    END IF;
  END IF;

  UPDATE registrations
  SET
    mercadopago_payment_id = COALESCE(v_registration.mercadopago_payment_id, p_payment_id),
    amount_paid = p_amount_paid,
    payment_status = 'paid',
    registration_status = 'confirmed',
    updated_at = NOW()
  WHERE id = v_registration.id;

  RETURN json_build_object(
    'success', true,
    'registration_id', v_registration.id,
    'event_name', v_event.name,
    'event_date', v_event.event_date,
    'event_start_time', v_event.start_time,
    'event_location', v_event.location
  );
END;
$$ LANGUAGE plpgsql;