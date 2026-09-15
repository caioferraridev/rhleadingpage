-- =====================================================
-- Academia RH - Email notifications
-- Tabela de controle dos emails enviados aos inscritos.
-- Garante idempotência: nenhum email duplicado por
-- (registration_id, type, scheduled_for).
-- =====================================================

CREATE TABLE IF NOT EXISTS email_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  type TEXT NOT NULL,
  scheduled_for DATE NOT NULL,
  sent_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sending', 'sent', 'failed')),
  provider_message_id TEXT,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_email_notifications UNIQUE (registration_id, type, scheduled_for)
);

CREATE INDEX IF NOT EXISTS idx_email_notifications_status_scheduled
  ON email_notifications(status, scheduled_for);

CREATE INDEX IF NOT EXISTS idx_email_notifications_registration
  ON email_notifications(registration_id);