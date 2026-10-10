# API — Manual do Empregador

API Express usada pelo frontend da Vercel. Dados usam PostgreSQL do projeto Supabase `heusjcoijobbsgzyfupm`; PDFs usam Supabase Storage.

## Ambiente

Copie `.env.example` para `.env` neste diretório e preencha:

- `DATABASE_URL`: connection string do novo Supabase, obtida em **Connect**. Prefira o pooler de transações para Vercel, com usuário `postgres.heusjcoijobbsgzyfupm`.
- `DATABASE_SSL_CA`: certificado PEM do projeto se exigido para verificação TLS.
- `SUPABASE_SECRET_KEY` ou `SUPABASE_SERVICE_ROLE_KEY`: credencial privada para uploads e URLs assinadas de Storage.
- `ADMIN_AUTH_SECRET`, `MP_ACCESS_TOKEN`, `MP_PUBLIC_KEY`, `RESEND_API_KEY`, `EMAIL_FROM`, `SITE_URL` e `CORS_ORIGIN`: configuração das integrações existentes.
- `CRON_SECRET`: autenticação do agendador externo.

O MCP não fornece a senha do banco nem a chave privada. Não configure essas credenciais no frontend.

## Execução

```bash
npm ci
npm run dev
npm run build
npm run check:supabase
```

`check:supabase` faz apenas consultas ao banco e leitura dos metadados de Storage. Não cria nem migra nada.

Na Vercel, `api/index.ts` exporta a aplicação; não abre porta, não serve o frontend e não inicia timers. O servidor local continua ouvindo na porta 5000.

A fila de e-mails depende de um agendador externo chamando `GET /api/cron/email-queue` com `Authorization: Bearer <CRON_SECRET>`. O scheduler local continua funcionando com o servidor persistente.

O bucket esperado é `ebook-manual`, público, com prefixo `ebook/`. Uploads administrativos aceitam PDF até 4 MB. Nenhum bucket ou objeto é criado durante a configuração.

As tabelas continuam no schema `ebookfelipelopes`. Os scripts SQL históricos não são executados no build ou no workflow; o ajuste não transfere dados nem cria estrutura no projeto remoto.
