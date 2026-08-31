-- =====================================================
-- Academia RH - Database Schema
-- =====================================================

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT NOT NULL,
  address TEXT,
  capacity INTEGER NOT NULL DEFAULT 50,
  price INTEGER NOT NULL DEFAULT 22990, -- stored in cents (R$ 229.90)
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  amount_paid INTEGER NOT NULL DEFAULT 0, -- stored in cents
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  registration_status TEXT NOT NULL DEFAULT 'pending' CHECK (registration_status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'notified', 'registered')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_stripe_session ON registrations(stripe_checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_registrations_payment_status ON registrations(payment_status);
CREATE INDEX IF NOT EXISTS idx_registrations_registration_status ON registrations(registration_status);
CREATE INDEX IF NOT EXISTS idx_waitlist_event_id ON waitlist(event_id);
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);

-- Function to safely reserve a spot (prevents race conditions)
CREATE OR REPLACE FUNCTION reserve_spot(
  p_event_id UUID,
  p_name TEXT,
  p_email TEXT,
  p_phone TEXT
)
RETURNS JSON AS $$
DECLARE
  v_event RECORD;
  v_confirmed_count INTEGER;
  v_registration_id UUID;
BEGIN
  -- Lock the event row for update to prevent race conditions
  SELECT * INTO v_event
  FROM events
  WHERE id = p_event_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Event not found');
  END IF;

  IF v_event.status != 'active' THEN
    RETURN json_build_object('success', false, 'error', 'Event is not active');
  END IF;

  -- Count confirmed registrations with a lock
  SELECT COUNT(*) INTO v_confirmed_count
  FROM registrations
  WHERE event_id = p_event_id
    AND registration_status = 'confirmed'
    AND payment_status = 'paid';

  IF v_confirmed_count >= v_event.capacity THEN
    RETURN json_build_object('success', false, 'error', 'No spots available', 'spots_left', 0);
  END IF;

  -- Create pending registration
  INSERT INTO registrations (event_id, name, email, phone, payment_status, registration_status)
  VALUES (p_event_id, p_name, p_email, p_phone, 'pending', 'pending')
  RETURNING id INTO v_registration_id;

  RETURN json_build_object(
    'success', true,
    'registration_id', v_registration_id,
    'spots_left', v_event.capacity - v_confirmed_count - 1
  );
END;
$$ LANGUAGE plpgsql;

-- Function to confirm registration (called by webhook)
CREATE OR REPLACE FUNCTION confirm_registration(
  p_session_id TEXT,
  p_payment_intent_id TEXT,
  p_amount_paid INTEGER
)
RETURNS JSON AS $$
DECLARE
  v_registration RECORD;
  v_event RECORD;
BEGIN
  -- Find the registration
  SELECT * INTO v_registration
  FROM registrations
  WHERE stripe_checkout_session_id = p_session_id;

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
    stripe_payment_intent_id = p_payment_intent_id,
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

-- RLS Policies
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Events: public read
CREATE POLICY "Public can read active events"
  ON events FOR SELECT
  USING (status = 'active');

-- Registrations: no public access (server-only via service_role)
CREATE POLICY "No public access to registrations"
  ON registrations FOR ALL
  USING (false);

-- Waitlist: public can insert, no public read
CREATE POLICY "Public can join waitlist"
  ON waitlist FOR INSERT
  WITH CHECK (true);

CREATE POLICY "No public read on waitlist"
  ON waitlist FOR SELECT
  USING (false);

-- =====================================================
-- Seed the event data
-- =====================================================
INSERT INTO events (name, description, event_date, start_time, end_time, location, address, capacity, price, status)
VALUES (
  'Academia RH',
  'Palestra presencial de RH e recrutamento para iniciantes. Uma oportunidade única de aprender na prática como funciona o mundo do RH e recrutamento, com uma profissional experiente da área.',
  '2026-10-03',
  '09:00',
  '12:00',
  'Bauru/SP',
  'Endereço do evento a ser definido - Bauru/SP',
  50,
  22990,
  'active'
)
ON CONFLICT DO NOTHING;
