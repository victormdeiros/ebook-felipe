# Manual do Empregador - E-book

Um site moderno e responsivo para apresentação e distribuição do e-book "Manual do Empregador" de Felipe Lopes Advogados.

## 🚀 Como rodar localmente

### Pré-requisitos
- Node.js 18+ ou Bun
- Git

### Setup rápido

```bash
# Clone o repositório
git clone <seu-repositorio>
cd manual-do-empregador-seguro

# Instale as dependências
npm install
# ou
bun install

# Inicie o servidor de desenvolvimento
npm run dev
# ou
bun run dev
```

O app estará disponível em `http://localhost:8080`

### Variáveis de ambiente

O arquivo `.env.example` já está configurado para rodar completamente localmente sem banco de dados. Se quiser adicionar persistência com Supabase:

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Copie `.env.example` para `.env.local`
3. Preencha as credenciais do Supabase
4. Reinicie o servidor de desenvolvimento

```bash
# .env.local
VITE_SUPABASE_URL=sua-url-supabase
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

## 🛠️ Tecnologias

- **Vite** - Build tool rápido
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - Componentes UI prontos
- **React Router** - Navegação
- **Supabase** - Backend (opcional)
- **Framer Motion** - Animações

## 📦 Scripts disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Pré-visualização do build
- `npm run lint` - Roda ESLint
- `npm run test` - Executa testes
- `npm run test:watch` - Testes em modo watch

## 📁 Estrutura do projeto

```
src/
  ├── components/      # Componentes React
  ├── pages/          # Páginas da aplicação
  ├── lib/            # Utilitários e hooks
  ├── assets/         # Imagens e recursos
  └── App.tsx         # Componente raiz
```

## 🚀 Deploy

Pode fazer deploy em qualquer serviço de hospedagem estática:
- Vercel
- Netlify
- GitHub Pages
- AWS S3
- Firebase Hosting

O comando de build gera os arquivos prontos em `dist/`
