# IS_MI

App React de monitorização de feedback académico, otimizada para deploy em **Cloudflare Workers**.

## Desenvolvimento local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy para Cloudflare Workers

1. Autenticar no Cloudflare:

```bash
npx wrangler login
```

2. Fazer deploy:

```bash
npm run deploy
```

## Notas de otimização para Workers

- Build com Vite e minificação por esbuild.
- Servir assets estáticos através do binding `ASSETS` no Worker.
- Fallback para `index.html` para suportar rotas de SPA.
- Parser de Excel com `import("xlsx")` sob demanda (lazy load), evitando script externo em runtime.
