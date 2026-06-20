# WhatsApp AI

App de chat com IA no estilo WhatsApp, similar a PolyBuzz.ai e Character AI.

## Estrutura

```
chat-ia-nomeprovisorio/
├── apps/
│   ├── web/          # Frontend React + Vite + Tailwind
│   └── api/          # Backend FastAPI (Python)
├── supabase/         # Migrations e config Supabase
└── package.json      # Monorepo root
```

## Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Supabase Auth
- **Backend:** FastAPI, Groq API (Llama 3), Supabase (PostgreSQL)
- **Infra:** pnpm monorepo, Turbo

## Como rodar

### Backend

```bash
cd apps/api
.venv\Scripts\activate      # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

### Frontend

```bash
cd apps/web
pnpm install
pnpm dev
```

Acesse http://localhost:5173

## Criar um Bot

1. Faça login com email/senha
2. Clique em **+ Novo Bot**
3. Preencha nome, gênero, tom (amigável/sério/engraçado), estilo (formal/informal), história e saudação
4. Clique em **Criar Bot**
5. Clique no bot na lista para conversar

A IA responderá conforme a personalidade definida.

## Variáveis de Ambiente

### Frontend (`apps/web/.env`)

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

### Backend (`apps/api/.env`)

```
GROQ_API_KEY=sua-chave-groq
```
