# DEPLOY.md — Deploy no GitHub Pages

> Execute este guia apenas após todas as specs estarem concluídas e o projeto validado visualmente.

---

## Pré-requisitos

- Repositório no GitHub (público ou privado com GitHub Pro/Team)
- Node.js instalado localmente
- Acesso de push à branch `main`

---

## Passo 1 — Configurar o `base` no Vite

O GitHub Pages serve o site em `https://<usuario>.github.io/<nome-do-repo>/`, não na raiz `/`.
Sem esta configuração, os assets (JS, CSS, imagens) não carregam.

Editar `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/gi-worker-report/',
  plugins: [react()],
})
```

> Substituir `gi-worker-report` pelo nome exato do repositório no GitHub se for diferente.

---

## Passo 2 — Escolher o método de deploy

Há dois caminhos. Escolha um.

---

### Opção A — Deploy manual com `gh-pages` (recomendado para relatório pontual)

**Instalar o pacote `gh-pages` como dependência de desenvolvimento:**

```bash
npm install --save-dev gh-pages
```

**Adicionar o script de deploy em `package.json`:**

```json
"scripts": {
  "deploy": "npm run build && npx gh-pages -d dist"
}
```

**Fazer o deploy:**

```bash
npm run deploy
```

O comando vai:
1. Rodar `npm run build` → gerar `dist/`
2. Publicar o conteúdo de `dist/` na branch `gh-pages` do repositório

**Ativar o GitHub Pages no repositório:**

1. Ir em **Settings → Pages**
2. Em **Source**, selecionar **Deploy from a branch**
3. Selecionar branch `gh-pages` / pasta `/ (root)`
4. Clicar em **Save**

O site estará disponível em `https://<usuario>.github.io/gi-worker-report/` em cerca de 1–2 minutos.

---

### Opção B — Deploy automático via GitHub Actions (para atualizações frequentes)

Criar o arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write

    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: dist

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Ativar o GitHub Pages no repositório:**

1. Ir em **Settings → Pages**
2. Em **Source**, selecionar **GitHub Actions**
3. Fazer push para `main` — o workflow dispara automaticamente

---

## Passo 3 — Verificar o deploy

Após o deploy, acessar `https://<usuario>.github.io/gi-worker-report/` e confirmar:

- [ ] Logo GI Group carrega
- [ ] Tela galaxy abre corretamente
- [ ] Navegação entre planetas funciona
- [ ] Todas as seções (S1–S7) renderizam sem erro de console

---

## Observações

**Assets com caminhos absolutos:** o projeto usa Vite para importar imagens (`import logo from './assets/...'`), então os caminhos são resolvidos automaticamente pelo build. Não há necessidade de ajuste manual.

**SPA sem React Router:** este projeto usa navegação por estado interno (galaxy), sem rotas de URL como `/s1`, `/s2`. Portanto não há o problema clássico de 404 em acesso direto a rotas do GitHub Pages.

**Domínio customizado (opcional):** se quiser servir em um domínio próprio (ex: `relatorio.performit.com.br`), criar um arquivo `public/CNAME` com o domínio:
```
relatorio.performit.com.br
```
E configurar o DNS com um registro CNAME apontando para `<usuario>.github.io`.

**Atualizar o deploy após mudanças:**
- Opção A: rodar `npm run deploy` novamente
- Opção B: basta fazer push para `main` — o workflow cuida do resto
