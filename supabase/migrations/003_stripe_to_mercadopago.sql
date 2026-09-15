-- =====================================================
-- Academia RH - Migrate Stripe → Mercado Pago
-- =====================================================
-- This migration replaces Stripe-specific columns with
-- Mercado Pago columns and updates the RPC functions.

-- 1. Add new columns
ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS mercadopago_payment_id TEXT,
  ADD COLUMN IF NOT EXISTS mercadopago_preference_id TEXT;

-- 2. Migrate data from old Stripe columns (if they exist)
--    Only runs if the old columns are present and have data.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'registrations' AND column_name = 'stripe_checkout_session_id'
  ) THEN
    UPDATE registrations
    SET mercadopago_preference_id = stripe_checkout_session_id
    WHERE stripe_checkout_session_id IS NOT NULL
      AND mercadopago_preference_id IS NULL;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'registrations' AND column_name = 'stripe_payment_intent_id'
  ) THEN
    UPDATE registrations
    SET mercadopago_payment_id = stripe_payment_intent_id
    WHERE stripe_payment_intent_id IS NOT NULL
      AND mercadopago_payment_id IS NULL;
  END IF;
END $$;

-- 3. Drop old Stripe columns
ALTER TABLE registrations DROP COLUMN IF EXISTS stripe_checkout_session_id;
ALTER TABLE registrations DROP COLUMN IF EXISTS stripe_payment_intent_id;

-- 4. Create indexes
CREATE INDEX IF NOT EXISTS idx_registrations_mercadopago_payment_id
  ON registrations(mercadopago_payment_id);
CREATE INDEX IF NOT EXISTS idx_registrations_mercadopago_preference_id
  ON registrations(mercadopago_preference_id);

-- 5. Drop old Stripe index
DROP INDEX IF EXISTS idx_registrations_stripe_session;

-- 6. Replace confirm_registration RPC for Mercado Pago
CREATE OR REPLACE FUNCTION confirm_registration(
  p_payment_id TEXT,
  p_amount_paid INTEGER
)
RETURNS JSON AS $$
DECLARE
  v_registration RECORD;
  v_event RECORD;
BEGIN
  -- Find by Mercado Pago payment ID (idempotent)
  SELECT * INTO v_registration
  FROM registrations
  WHERE mercadopago_payment_id = p_payment_id;

  IF NOT FOUND THEN
    -- Fallback: find by preference_id
    SELECT * INTO v_registration
    FROM registrations
    WHERE mercadopago_preference_id = p_payment_id;
  END IF;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Registration not found');
  END IF;

  -- Idempotent: already confirmed
  IF v_registration.registration_status = 'confirmed' THEN
    RETURN json_build_object('success', true, 'message', 'Already confirmed');
  END IF;

  -- Update registration
  UPDATE registrations
  SET
    mercadopago_payment_id = COALESCE(v_registration.mercadopago_payment_id, p_payment_id),
    amount_paid = p_amount_paid,
    payment_status = 'paid',
    registration_status = 'confirmed',
    updated_at = NOW()
  WHERE id = v_registration.id;

  -- Get event info for response
  SELECT * INTO v_event
  FROM events
  WHERE id = v_registration.event_id;

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