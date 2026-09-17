-- =====================================================
-- Academia RH - Atualização oficial do preço
-- =====================================================
-- Preço oficial vigente: R$ 289,00 (28900 em centavos).
-- Aplica apenas o preço do evento (events.price), usado na
-- cobrança do Mercado Pago e na validação de valor pago do
-- webhook (confirm_registration). NÃO altera registros
-- históricos de pagamentos já realizados (registrations.amount_paid).

UPDATE events
SET
  price      = 28900,          -- R$ 289,00 em centavos
  updated_at = NOW()
WHERE status = 'active';

-- Seed idempotente para o caso de tabela vazia (mesmo padrão da 002).
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
  28900,
  'active'
WHERE NOT EXISTS (
  SELECT 1 FROM events WHERE status = 'active'
);