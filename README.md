# Academia RH — Landing Page de Vendas para Evento Presencial

Aplicação web completa e pronta para produção para venda de inscrições da palestra presencial **Academia RH** (Bauru/SP). Construída com **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Supabase** (banco de dados + segurança RLS) e **Mercado Pago** (checkout + webhook).

---

## ✨ Funcionalidades

- **Landing Page de alta conversão** (mobile first, responsiva, com CTA fixo no mobile).
- **Mercado Pago Checkout Pro** integrado (coleta nome, e-mail e telefone antes de redirecionar).
- **Webhook Mercado Pago** com validação (assinatura opcional + consulta ao pagamento na API) e **processamento idempotente**.
- **Controle seguro das 50 vagas**: a reserva é feita no backend via uma **função RPC do PostgreSQL com `SELECT ... FOR UPDATE`** que bloqueia a linha do evento, evitando **race conditions** (duas pessoas comprando a última vaga ao mesmo tempo).
- **Estados dinâmicos de vagas**: Disponível → Últimas vagas → Esgotado.
- **Lista de espera** quando as 50 vagas estiverem preenchidas.
- **Página `/admin` protegida** por senha para ver inscritos, lista de espera e status dos pagamentos.
- **Páginas `/sucesso` e `/cancelado`**.
- **SEO** completo (metadados, Open Graph, Twitter Card, sitemap, robots.txt, favicon, JSON-LD).
- Todos os textos, valores, datas e fotos **centralizados e facilmente editáveis**.

---

## 🧱 Stack

| Camada        | Tecnologia                                   |
|---------------|----------------------------------------------|
| Frontend      | Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript |
| Banco de dados| Supabase (PostgreSQL) + Row Level Security   |
| Pagamento     | Mercado Pago Checkout Pro + Webhooks          |
| Animações     | transitions CSS                               |
| Ícones        | lucide-react                                 |

---

## 📁 Estrutura do projeto

```
academia-rh/
├── supabase/
│   └── migrations/
│       ├── 001_initial.sql                # Tabelas, RLS, funções RPC e seed
│       ├── 002_fix_event_details.sql      # Corrige data/horário do evento no banco
│       └── 003_stripe_to_mercadopago.sql  # Migra colunas Stripe → Mercado Pago
├── public/
│   └── images/
│       ├── speaker.svg              # Placeholder da palestrante
│       └── og-image.svg             # Imagem para redes sociais
└── src/
    ├── app/
    │   ├── api/
    │   │   ├── checkout/route.ts    # Cria preferência Mercado Pago (reserva segura)
    │   │   ├── webhook/route.ts     # Recebe notificações do Mercado Pago (idempotente)
    │   │   ├── waitlist/route.ts    # Entra na lista de espera
    │   │   ├── availability/route.ts# Retorna vagas disponíveis
    │   │   ├── registration/route.ts# Consulta inscrição (página /sucesso)
    │   │   └── admin/route.ts       # Dados administrativos protegidos
    │   ├── admin/page.tsx           # Painel administrativo (protegido)
    │   ├── sucesso/page.tsx         # Página de sucesso
    │   ├── cancelado/page.tsx       # Página de cancelamento
    │   ├── layout.tsx               # Layout + metadados SEO
    │   ├── page.tsx                 # Landing Page (server component)
    │   ├── sitemap.ts
    │   └── robots.ts
    ├── components/
    │   ├── layout/                  # Header, Footer
    │   ├── sections/                # Hero, About, WhoFor, Speaker, EventInfo, Registration, FAQ
    │   ├── ui/                      # Button, Card, Section
    │   ├── checkout-form.tsx
    │   ├── waitlist-form.tsx
    │   └── mobile-sticky-cta.tsx
    ├── lib/
    │   ├── event-config.ts          # ⚙️ CONFIGURAÇÃO CENTRAL DO EVENTO
    │   ├── mercadopago.ts           # Cliente Mercado Pago (somente servidor)
    │   ├── supabase/                # server.ts (service role)
    │   ├── hooks/use-event-availability.ts
    │   └── utils.ts                 # Formatação de preço/data
    └── types/
        └── database.ts              # Tipos TypeScript das tabelas
```

---

## ⚙️ Pré-requisitos

- Node.js 18.18+ (recomendado 20+)
- Conta no [Supabase](https://supabase.com) (gratuita para começar)
- Conta no [Mercado Pago](https://www.mercadopago.com.br) para desenvolvedores (Access Token)

---

## 🚀 Como instalar

```bash
# 1. Clone o projeto e entre na pasta
cd academia-rh

# 2. Instale as dependências
npm install

# 3. Crie o arquivo de variáveis de ambiente
cp .env.example .env.local
```

---

## 🗄️ Como configurar o Supabase

1. Crie um projeto no [Supabase](https://supabase.com/dashboard).
2. Anote a **Project URL** e a **anon key** (Settings → API).
3. Acesse **Settings → API → Project API keys** e copie também a **`service_role` key** (⚠️ guarde com segurança, nunca use no frontend).
4. No painel do Supabase, abra **SQL Editor** e execute as migrações em ordem:
   ```
   supabase/migrations/001_initial.sql
   supabase/migrations/002_fix_event_details.sql
   supabase/migrations/003_stripe_to_mercadopago.sql
   ```
   Os scripts criam as tabelas `events`, `registrations` e `waitlist`, os índices, as políticas de RLS, as funções `reserve_spot` e `confirm_registration` (que garantem o controle de vagas), inserem o evento inicial e migram os campos de pagamento para o Mercado Pago.

> **Alternativa via CLI (opcional):**
> ```bash
> npx supabase login
> npx supabase db push
> ```

### Sobre as funções RPC (controle de vagas)

A função `reserve_spot` é a peça-chave do controle de vagas:

```sql
SELECT * INTO v_event FROM events WHERE id = p_event_id FOR UPDATE;
```

Ao travar a linha do evento com `FOR UPDATE`, somente uma transação por vez consegue checar a disponibilidade e fazer a reserva. Isso **garante que a capacidade de 50 participantes nunca seja ultrapassada**, mesmo com duas pessoas comprando a última vaga ao mesmo tempo.

A função `confirm_registration` marca a inscrição como confirmada e é **idempotente** (se o webhook checar duas vezes, não cria duplicidade).

### Segurança (RLS)

- `events`: leitura pública apenas de eventos ativos.
- `registrations`: **nenhum acesso público** (somente o servidor via service role).
- `waitlist`: inserção pública permitida; leitura apenas pelo servidor.

O cliente (frontend) **nunca** consegue alterar vagas, preço, status de pagamento ou capacidade — essas operações são exclusivas das funções RPC chamadas pelo servidor.

---

## 💳 Como configurar o Mercado Pago

1. Crie uma conta no [Mercado Pago Developers](https://www.mercadopago.com.br/developers).
2. No dashboard: **Suas integrações → Credenciais**.
   - Copie o **Access Token** → `MERCADOPAGO_ACCESS_TOKEN` (⚠️ apenas para o servidor).
   - Tokens de teste começam com `TEST-`; tokens de produção com `APP_USR-`.
3. Configure o **webhook**:
   - **Suas integrações → Webhooks → Adicionar webhook**
   - URL (local em dev): `http://localhost:3000/api/webhook`
   - Evento: **Pagamentos** (`payment.created`, `payment.updated`)
   - (Para testar localmente use o [ngrok](https://ngrok.com) ou outro túnel apontando para `localhost:3000/api/webhook`, ou configure as URLs de retorno do Checkout Pro)
4. **Opcional (recomendado):** na seção **Integração → Configurações**, ative as **Notificações assinadas** e copie o **Secret Signature** → `MERCADOPAGO_WEBHOOK_SECRET`. Sem ele, o webhook ainda funciona validando o pagamento na API do Mercado Pago.

---

## 🔑 Variáveis de ambiente

Preencha o `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=TEST-xxxx  # ou APP_USR-xxxx em produção
MERCADOPAGO_WEBHOOK_SECRET=          # opcional: secret signature para assinar webhooks

# Admin
ADMIN_PASSWORD=uma-senha-forte-aqui

# URL da aplicação (use a URL do deploy em produção)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> ⚠️ **Nunca** exponha `SUPABASE_SERVICE_ROLE_KEY` ou `MERCADOPAGO_ACCESS_TOKEN` no frontend. Elas são usadas apenas em API Routes / server components.

---

## ▶️ Como rodar localmente

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Para testar o fluxo completo de pagamento localmente, use um túnel HTTPS (ex.: [ngrok](https://ngrok.com)) apontando para `http://localhost:3000`, configure `NEXT_PUBLIC_APP_URL` com a URL do túnel e registre `https://SEU-TUNNEL/api/webhook` como webhook de pagamentos no painel do Mercado Pago (ou use as credenciais de teste `TEST-...`).

---

## ☁️ Como fazer deploy

### Vercel (recomendado)

1. Publica o repositório no GitHub.
2. No [Vercel](https://vercel.com), importe o repositório.
3. Adicione todas as variáveis do `.env.local` em **Settings → Environment Variables** (incluindo as de produção).
4. Deploy!

- **Importante para produção**: use as variáveis de produção do Supabase e o Access Token **`APP_USR-`** do Mercado Pago.
- O webhook no Mercado Pago deve apontar para a URL de produção: `https://SEU-DOMINIO/api/webhook`.

### Docker / servidor próprio

```bash
npm run build
npm start
```

---

## ✏️ Como alterar data, preço, capacidade e informações do evento

Existem **duas camadas de configuração**:

### 1. Banco de dados (`events` table) — valores dinâmicos

O **preço**, a **capacidade**, a **data**, o **horário**, o **local** e o **endereço** usados na conversão (preço e vagas mostrados na página e cobrados no Mercado Pago) vêm do banco.

Atualize-os direto na tabela `events` (via SQL Editor do Supabase ou pelo painel):

```sql
UPDATE events
SET
  price      = 22990,          -- R$ 229,90 em centavos
  capacity   = 50,
  event_date = '2026-10-17',
  start_time = '08:00',
  end_time   = '13:00',
  location   = 'Universidade Anhembi Morumbi — Bauru',
  address    = 'Rua Vereador Joaquim da Silva Martha, 14-55, Vila Santa Tereza, Bauru - SP',
  status     = 'active'
WHERE status = 'active';
```

> O preço é armazenado em **centavos** no banco (ex.: `22990` = R$ 229,90). O Mercado Pago recebe o valor convertido para reais (`229.90`).

### 2. `src/lib/event-config.ts` — conteúdo estático da página

Textos, nome da palestrante, bio, destaques, benefícios, público-alvo e **links para as fotos** ficam centralizados em `src/lib/event-config.ts`. Edite esse único arquivo para alterar o conteúdo exibido na página.

### Como trocar a foto da palestrante

1. Suba a nova foto na pasta `public/images/` (ex.: `public/images/palestrante.jpg`).
2. Atualize o campo `speaker.imageUrl` em `src/lib/event-config.ts`:
   ```ts
   speaker: {
     imageUrl: "/images/palestrante.jpg",
   }
   ```

> Para produção, a imagem deve estar na pasta `public/` do servidor ou em um storage/CDN (ex.: um bucket acessível). Por padrão, usamos um **placeholder SVG** (`/images/speaker.svg`) para você não ficar sem visual enquanto não define a foto.

### Como alterar textos da Home

Todos os blocos (benefícios, "para quem é", FAQ, urgência) estão em `src/lib/event-config.ts` e nos componentes de `src/components/sections/`. Edite esses arquivos — nada de valores espalhados pelo projeto.

---

## 🔁 Fluxo completo do usuário

```
Landing Page
  → clica em "QUERO GARANTIR MINHA VAGA"
  → preenche nome/e-mail/telefone
  → API /api/checkout consulta Supabase (RPC reserve_spot, com lock)
    → se houver vaga: cria preferência no Mercado Pago (Checkout Pro)
    → redireciona para o init_point do Mercado Pago
  → usuário paga no Mercado Pago
  → Mercado Pago envia webhook (payment) para /api/webhook
  → /api/webhook consulta o pagamento na API (fonte da verdade) e chama confirm_registration (idempotente)
  → Supabase marca inscrição como "confirmed" + registra payment_id
  → usuário cai em /sucesso (lê status real via /api/registration)

Quando chega em 50 vagas:
  → página mostra "50/50 VAGAS PREENCHIDAS"
  → CTA vira "ENTRAR NA LISTA DE ESPERA"
  → preenche formulário → salvo na tabela waitlist
```

---

## 🛠️ Comandos úteis

```bash
npm run dev      # ambiente de desenvolvimento
npm run build    # build de produção
npm run start    # serve a build de produção
npm run lint     # verifica lint
```

---

## 🔒 Segurança implementada

- Secret keys somente no servidor (`MERCADOPAGO_ACCESS_TOKEN`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`).
- Webhook valida a autenticidade (assinatura quando configurada) e **sempre consulta o pagamento na API do Mercado Pago** antes de confirmar.
- Webhook idempotente (função RPC que não duplica inscrição).
- Controle de vagas com `SELECT ... FOR UPDATE` no PostgreSQL (sem race condition).
- RLS ativa no Supabase; operações sensíveis só por server components / API routes.
- Página `/admin` protegida por senha (`ADMIN_PASSWORD`).

---

## 🧪 Teste manual rápido

1. Configure Supabase + Mercado Pago (Access Token de teste `TEST-`).
2. `npm run dev` e acesse `http://localhost:3000`.
3. Clique em "QUERO GARANTIR MINHA VAGA", preencha o formulário.
4. Você será redirecionado ao Checkout do Mercado Pago (use os cartões de teste: `5031 4332 1540 6351`).
5. Após pagar, o webhook confirma a inscrição e você verá `/sucesso`.
6. Acesse a listagem em `http://localhost:3000/admin` (use a senha configurada).
7. Para testar o esgotamento: reduza `capacity` para `1` na tabela `events` e observe a página mudar para "VAGAS ESGOTADAS" com a opção de lista de espera.

---

## 📝 Licença

Projeto de uso comercial para a Academia RH. Gerencie as credenciais e o conteúdo conforme sua necessidade.
