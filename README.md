# Manual do Empregador — E-book

Frontend React/Vite configurado para a Vercel. As rotas `/api/*` usam a API Express no mesmo projeto; dados e PDFs apontam para o Supabase `heusjcoijobbsgzyfupm`.

## Desenvolvimento

Requer Node.js 22 e npm 10 ou superior.

```bash
npm ci
npm ci --prefix server
cp .env.example .env.local
cp server/.env.example server/.env
npm run dev:all
```

O frontend roda em http://localhost:8080 e encaminha `/api` para http://localhost:5000. Configure as variáveis privadas no ambiente do backend. Para carregar `server/.env`, execute a API pelo script `dev:server`, que usa esse diretório.

## Conexão Supabase

A URL, referência, chave pública e nome esperado do bucket estão em `supabase/project.json`, confirmados pelo MCP. A chave pública pode estar no frontend; ela não autoriza operações administrativas.

A API mantém PostgreSQL (`pg`) e as tabelas existentes no schema `ebookfelipelopes`. Ela usa `DATABASE_URL` do novo Supabase, com TLS e verificação de certificado. Copie a connection string exata em **Supabase > Connect**, preferindo o pooler de transações para Vercel. O usuário do pooler deve ser `postgres.heusjcoijobbsgzyfupm`; o host depende da região mostrada no painel. Se necessário, configure `DATABASE_SSL_CA` com o certificado PEM do projeto.

Uploads e links de download usam **Supabase Storage**, bucket `ebook-manual`, prefixo `ebook/`. O contrato atual salva URLs permanentes, portanto espera um bucket público existente. Uploads passam pela API administrativa com `SUPABASE_SECRET_KEY` ou a chave legada `SUPABASE_SERVICE_ROLE_KEY`. Nunca use essas chaves em variáveis `VITE_*`. O limite do PDF é 4 MB para caber no payload da função Vercel.

**O MCP disponível retorna URL e chaves públicas, mas não retorna senha do PostgreSQL nem chaves privadas.** Essas duas credenciais precisam ser preenchidas no ambiente do backend.

Este ajuste não cria tabelas, buckets, usuários ou registros, não copia arquivos e não altera URLs armazenadas em registros antigos. Na inspeção do MCP, o novo projeto não tinha o schema da aplicação nem buckets; por isso os fluxos persistentes só funcionarão quando a estrutura esperada e as credenciais estiverem disponíveis.

## Configuração da Vercel

`vercel.json` configura instalação, build, saída `dist` e o roteamento:

- `/api/*` → função `api/index.ts`, preservando os caminhos usados pela API.
- Demais rotas → `/index.html`, para navegação React por URL direta.

`VITE_API_URL` usa a mesma origem por padrão; defina uma URL explícita apenas para uma API externa. A configuração pública do Supabase tem valores padrão do projeto conectado e pode ser sobrescrita pelas variáveis públicas de `.env.example`.

Configure no backend da Vercel `DATABASE_URL`, `SUPABASE_SECRET_KEY` (ou `SUPABASE_SERVICE_ROLE_KEY`), `ADMIN_AUTH_SECRET`, credenciais Mercado Pago, Resend, `SITE_URL` e `CORS_ORIGIN`. Consulte `server/.env.example`. A porta e os timers do servidor local não são iniciados na Vercel.

Para os e-mails agendados, configure um agendador externo para chamar `GET /api/cron/email-queue` com `Authorization: Bearer <CRON_SECRET>` a cada cinco minutos. Nenhum cron ou deploy remoto foi ativado por este ajuste.

## Workflow e validação

O workflow `.github/workflows/deploy.yml` instala dependências, executa testes e compila frontend/API. Ele **não publica** na Vercel ou Dokku.

A execução manual oferece `check_supabase`, que verifica o banco e os metadados do bucket somente por leitura. Para usá-la, configure os secrets GitHub `SUPABASE_DATABASE_URL`, `SUPABASE_SECRET_KEY` (ou `SUPABASE_SERVICE_ROLE_KEY`) e, se necessário, `SUPABASE_DATABASE_SSL_CA`.

```bash
npm test
npm run test:api
npm run build
# Com as variáveis privadas do novo projeto configuradas:
npm run check:supabase
```

O workflow valida o projeto e não publica nem executa migrações. O build de produção da Vercel (`npm run build:vercel`) aplica as migrations pendentes no Supabase quando `DATABASE_URL` já está configurada. Sem essa conexão, o build só continua se a estrutura `ebookfelipelopes` já existir no projeto `heusjcoijobbsgzyfupm`.

## Login e credenciais

A função carrega `server/dist/index.js` como CommonJS pela entrada ESM de `api/index.ts`. O build inclui a API compilada e `server/package.json`.

O acesso ao painel usa usuário e senha configurados no backend (`ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` e `ADMIN_AUTH_SECRET`). Em **Configurações**, o administrador salva a conexão PostgreSQL, a chave do Storage, o Mercado Pago e o Resend. Esses valores ficam criptografados no Supabase e passam a valer nas próximas requisições, sem novo deploy.

Para gerar a chave do Resend, siga a documentação oficial: [API keys](https://resend.com/docs/dashboard/api-keys/introduction) e [verificação de domínio](https://resend.com/docs/dashboard/domains/introduction).

`npm run test:api` verifica a entrada ESM real do Node, o login por senha e o salvamento das credenciais com o Supabase simulado. Não envia e-mails nem altera o projeto remoto.
