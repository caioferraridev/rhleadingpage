-- =====================================================
-- Academia RH - Correção dos dados oficiais do evento
-- =====================================================
-- Corrige o registro existente na tabela events que ainda
-- contenha a data/horário antigos (2026-10-03, 09:00-12:00).
-- A migração 001_initial usa ON CONFLICT DO NOTHING, então
-- registros já criados precisam desta atualização explícita.

UPDATE events
SET
  event_date = '2026-10-17',
  start_time = '08:00',
  end_time   = '13:00',
  location   = 'Universidade Anhembi Morumbi — Bauru',
  address    = 'Rua Vereador Joaquim da Silva Martha, 14-55, Vila Santa Tereza, Bauru - SP',
  price      = 22990,          -- R$ 229,90 em centavos
  capacity   = 50,
  status     = 'active',
  updated_at = NOW()
WHERE status = 'active';

-- Garante que também exista o registro ativo com os dados corretos
-- quando a tabela estiver vazia (seed idempotente).
INSERT INTO events (name, description, event_date, start_time, end_time, location, address, capacity, price, status)
SELECT
  'Academia RH',
  'Academia RH é um espaço de desenvolvimento e capacitação para profissionais e empresas que desejam aprender, praticar e transformar a gestão de pessoas. Na Academia RH, conhecimento vira prática, profissionais ganham segurança e empresas constroem resultados melhores por meio das pessoas.',
  '2026-10-17',
  '08:00',
  '13:00',
  'Universidade Anhembi Morumbi — Bauru',
  'Rua Vereador Joaquim da Silva Martha, 14-55, Vila Santa Tereza, Bauru - SP',
  50,
  22990,
  'active'
WHERE NOT EXISTS (
  SELECT 1 FROM events WHERE status = 'active'
);