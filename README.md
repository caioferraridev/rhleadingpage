# Academia RH — Landing Page de Vendas para Evento Presencial

Aplicação web completa e pronta para produção para venda de inscrições da palestra presencial **Academia RH** (Bauru/SP). Construída com **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Supabase** (banco de dados + segurança RLS) e **Stripe** (checkout + webhook).

---

## ✨ Funcionalidades

- **Landing Page de alta conversão** (mobile first, responsiva, com CTA fixo no mobile).
- **Stripe Checkout** integrado (coleta nome, e-mail e telefone antes de redirecionar).
- **Webhook Stripe** com validação de assinatura e **processamento idempotente**.
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
| Pagamento     | Stripe Checkout + Stripe Webhooks            |
| Animações     | framer-motion (opcional), transitions CSS    |
| Ícones        | lucide-react                                 |

---

## 📁 Estrutura do projeto

```
academia-rh/
├── supabase/
│   └── migrations/
│       └── 001_initial.sql          # Tabelas, RLS, funções RPC e seed
├── public/
│   └── images/
│       ├── speaker.svg              # Placeholder da palestrante
│       └── og-image.svg             # Imagem para redes sociais
└── src/
    ├── app/
    │   ├── api/
    │   │   ├── checkout/route.ts    # Cria Checkout Session (reserva segura)
    │   │   ├── webhook/route.ts     # Recebe eventos do Stripe (idempotente)
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
    │   ├── stripe.ts                # Cliente Stripe
    │   ├── supabase/                # client.ts (anon) e server.ts (service role)
    │   ├── hooks/use-event-availability.ts
    │   └── utils.ts                 # Formatação de preço/data
    └── types/
        └── database.ts              # Tipos TypeScript das tabelas
```

---

## ⚙️ Pré-requisitos

- Node.js 18.18+ (recomendado 20+)
- Conta no [Supabase](https://supabase.com) (gratuita para começar)
- Conta no [Stripe](https://stripe.com) (modo teste para começar)

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
4. No painel do Supabase, abra **SQL Editor** e execute o arquivo:
   ```
   supabase/migrations/001_initial.sql
   ```
   Este script cria as tabelas `events`, `registrations` e `waitlist`, os índices, as políticas de RLS, as funções `reserve_spot` e `confirm_registration` (que garantem o controle de vagas), e insere o evento inicial.

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

## 💳 Como configurar o Stripe

1. Crie uma conta no [Stripe](https://stripe.com). Use o **modo de teste** para desenvolvimento.
2. No dashboard: **Developers → API keys**.
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → `STRIPE_SECRET_KEY` (⚠️ apenas para o servidor)
3. Configure o **webhook**:
   - **Developers → Webhooks → Add endpoint**
   - URL (local em dev): `http://localhost:3000/api/webhook`
   - (Para testar localmente use o [Stripe CLI](https://stripe.com/docs/stripe-cli) com `stripe listen --forward-to localhost:3000/api/webhook`)
   - Eventos a escutar: **`checkout.session.completed`**
4. Ao criar o webhook, você receberá o **Webhook signing secret** (`whsec_...`) → `STRIPE_WEBHOOK_SECRET`.

---

## 🔑 Variáveis de ambiente

Preencha o `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxx

# Admin
ADMIN_PASSWORD=uma-senha-forte-aqui

# URL da aplicação (use a URL do deploy em produção)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> ⚠️ **Nunca** exponha `SUPABASE_SERVICE_ROLE_KEY` ou `STRIPE_SECRET_KEY` no frontend. Elas são usadas apenas em API Routes / server components.

---

## ▶️ Como rodar localmente

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

Para testar o fluxo completo de pagamento localmente, use o Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

O Stripe CLI exibirá um `whsec_...` que você deve colocar em `STRIPE_WEBHOOK_SECRET`.

---

## ☁️ Como fazer deploy

### Vercel (recomendado)

1. Publica o repositório no GitHub.
2. No [Vercel](https://vercel.com), importe o repositório.
3. Adicione todas as variáveis do `.env.local` em **Settings → Environment Variables** (incluindo as de produção).
4. Deploy!

- **Importante para produção**: use as variáveis de produção do Supabase e do Stripe (mode live).
- O webhook no Stripe deve apontar para a URL de produção: `https://SEU-DOMINIO/api/webhook`.

### Docker / servidor próprio

```bash
npm run build
npm start
```

---

## ✏️ Como alterar data, preço, capacidade e informações do evento

Existem **duas camadas de configuração**:

### 1. Banco de dados (`events` table) — valores dinâmicos

O **preço**, a **capacidade**, a **data**, o **horário**, o **local** e o **endereço** usados na conversão (preço e vagas mostrados na página e cobrados no Stripe) vêm do banco.

Atualize-os direto na tabela `events` (via SQL Editor do Supabase ou pelo painel):

```sql
UPDATE events
SET
  price      = 22990,          -- R$ 229,90 em centavos
  capacity   = 50,             -- novas vagas
  event_date = '2026-10-03',   -- data do evento
  start_time = '09:00',
  end_time   = '12:00',
  location   = 'Bauru/SP',
  address    = 'Endereço completo',
  status     = 'active'
WHERE status = 'active';
```

> O preço é armazenado em **centavos** (ex.: `22990` = R$ 229,90). O Stripe também cobra em centavos.

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
    → se houver vaga: cria Stripe Checkout Session
    → reDireciona para o Stripe Checkout
  → usuário paga
  → Stripe dispara webhook checkout.session.completed
  → /api/webhook valida assinatura e chama confirm_registration (idempotente)
  → Supabase marca inscrição como "confirmed" + registra payment_intent
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

- Secret keys somente no servidor (`STRIPE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`).
- Webhook validado por `stripe.webhooks.constructEvent`.
- Webhook idempotente (`.since`/função RPC que não duplica).
- Controle de vagas com `SELECT ... FOR UPDATE` no PostgreSQL (sem race condition).
- RLS ativa no Supabase; operações sensíveis só por server components / API routes.
- Página `/admin` protegida por senha (`ADMIN_PASSWORD`).

---

## 🧪 Teste manual rápido

1. Configure Supabase + Stripe (modo teste).
2. `npm run dev` e acesse `http://localhost:3000`.
3. Clique em "QUERO GARANTIR MINHA VAGA", preencha o formulário.
4. Você será redirecionado ao Checkout do Stripe (use o cartão de teste `4242 4242 4242 4242`).
5. Após pagar, o webhook confirma a inscrição e você verá `/sucesso`.
6. Acesse a listagem em `http://localhost:3000/admin` (use a senha configurada).
7. Para testar o esgotamento: reduza `capacity` para `1` na tabela `events` e observe a página mudar para "VAGAS ESGOTADAS" com a opção de lista de espera.

---

## 📝 Licença

Projeto de uso comercial para a Academia RH. Gerencie as credenciais e o conteúdo conforme sua necessidade.
