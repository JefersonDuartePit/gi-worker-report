# spec-1-plan-done.md — Spec 1 · Setup e Shell · Plan

**Data de aprovação:** 2026-06-23
**Aprovado por:** Jeferson
**Status:** Pronto para Implement

---

# Spec 1 — Setup e Shell — Implementation Plan

**Goal:** Inicializar o projeto Vite + React + TypeScript e implementar o layout-base (shell, sidebar, header, scroll-anchor) com a identidade visual GI Group, dados estáticos completos e componentes UI atômicos.

**Architecture:** SPA estática sem backend — dados hard-coded em `src/data/`, estado em hooks, renderização pura em componentes. `PresentationContext` é o único Context global; `useActiveSection` detecta seção visível via IntersectionObserver e alimenta a Sidebar. Em modo `presentation`, a Sidebar é oculta e o Header exibe botões anterior/próximo.

**Tech Stack:** React 18, TypeScript 5, Vite 5, Tailwind CSS 3, Framer Motion 11, Lucide React, clsx, tailwind-merge.

## Global Constraints

- TypeScript em todos os arquivos — proibido `.js` no `src/`
- Proibido `any` — usar tipos explícitos ou `unknown`
- Proibido CSS inline estático (`style={{}}`) — apenas Tailwind
- Proibido hex hard-coded em className — usar tokens `gi-*` do tailwind.config.ts
- Proibido prop drilling com mais de 2 níveis — usar Context
- Proibido dados hard-coded dentro de componentes — extrair para `src/data/`
- Proibido arquivos `.css` adicionais além de `src/index.css`
- Proibido fetch ou chamadas de API — projeto 100% estático
- Animações: máximo 400ms para seções, 200ms para micro-interações
- Node.js 18+ necessário; usar `npm` (não `yarn` ou `pnpm`)

## Arquivos Permitidos (criação)

```
package.json
vite.config.ts
tsconfig.json
index.html
tailwind.config.ts
postcss.config.js
src/index.css
src/lib/utils.ts
src/types/index.ts
src/assets/logo-gi-group.png        ← download de URL externa
src/data/sistemas.ts
src/data/dores.ts
src/data/iniciativas.ts
src/data/provocacoes.ts
src/hooks/useActiveSection.ts
src/hooks/usePresentation.ts
src/hooks/usePortalNav.ts
src/components/layout/Sidebar.tsx
src/components/layout/Header.tsx
src/components/layout/Section.tsx
src/components/ui/Badge.tsx
src/components/ui/Card.tsx
src/components/ui/Button.tsx
src/components/ui/Tag.tsx
src/components/ui/Tooltip.tsx       ← stub
src/components/ui/ProgressBar.tsx   ← stub
src/components/sections/S1Hero/index.tsx
src/components/sections/S2Diagnostico/index.tsx
src/components/sections/S3Dores/index.tsx
src/components/sections/S4Arquitetura/index.tsx
src/components/sections/S5Iniciativas/index.tsx
src/components/sections/S6Portal/index.tsx
src/components/sections/S7Provocacoes/index.tsx
src/App.tsx
src/main.tsx
```

## Arquivos Proibidos (não tocar)

- `docs/` — documentação do projeto
- `.agent/specs/spec-1-research-done.md`
- `PROJECT-STATE.md` — atualizado apenas pelo humano ao final do Implement

---

## Task 1: Scaffolding do projeto

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.js`
- Create: `index.html`

**Interfaces:**
- Produces: entrypoint do projeto — `npm install` + `npm run dev` funcionais

- [ ] **Step 1: Criar `package.json`**

```json
{
  "name": "gi-worker-report",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "framer-motion": "^11.3.0",
    "lucide-react": "^0.400.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "recharts": "^2.12.7",
    "tailwind-merge": "^2.4.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.39",
    "tailwindcss": "^3.4.6",
    "typescript": "^5.5.3",
    "vite": "^5.3.4"
  }
}
```

- [ ] **Step 2: Criar `vite.config.ts`**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

- [ ] **Step 3: Criar `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Criar `postcss.config.js`**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 5: Criar `index.html`**

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GI Group — Portal do Worker</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Instalar dependências**

```bash
npm install
```

Expected: `node_modules/` criado sem erros.

- [ ] **Step 7: Commit**

```bash
git add package.json vite.config.ts tsconfig.json postcss.config.js index.html
git commit -m "chore: scaffold Vite + React + TypeScript project"
```

---

## Task 2: Tailwind config + CSS global

**Files:**
- Create: `tailwind.config.ts`
- Create: `src/index.css`

**Interfaces:**
- Produces: tokens `gi-*` disponíveis em todas as classes Tailwind; fonte Lato carregando via Google Fonts

- [ ] **Step 1: Criar `tailwind.config.ts`**

```typescript
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gi: {
          navy:     '#00145A',
          blue:     '#1D57FB',
          text:     '#666666',
          dark:     '#1E1E1E',
          charcoal: '#4B4C4D',
          white:    '#FFFFFF',
          light:    '#EFEFEF',
          muted:    '#E6E9EA',
          border:   '#DBDBDB',
          red:      '#C10731',
          green:    '#49B100',
          amber:    '#FFC300',
          orange:   '#EB6608',
          steel:    '#4E7EB1',
        },
      },
      fontFamily: {
        sans: ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
```

- [ ] **Step 2: Criar `src/index.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Lato', sans-serif;
  background-color: #ffffff;
  color: #666666;
  margin: 0;
  padding: 0;
}
```

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts src/index.css
git commit -m "feat: add Tailwind config with GI Group design tokens"
```

---

## Task 3: Tipos compartilhados + cn() utility

**Files:**
- Create: `src/types/index.ts`
- Create: `src/lib/utils.ts`

**Interfaces:**
- Produces: todos os tipos importáveis de `../../types`; `cn()` importável de `../../lib/utils`

- [ ] **Step 1: Criar `src/types/index.ts`**

```typescript
export type Jornada = 'admissao' | 'ciclo-ativo' | 'offboarding'

export type Persona = 'worker' | 'colaborador-gi' | 'cliente'

export type Esforco = 'baixo' | 'medio' | 'alto'

export type Impacto = 'baixo' | 'medio' | 'alto'

export type StatusSistema = 'usa' | 'integra' | 'substitui' | 'nao-toca'

export interface Iniciativa {
  id: string
  titulo: string
  descricao: string
  jornada: Jornada
  personas: Persona[]
  doresResolvidas: string[]
  sistemaSubstituido?: string
  esforco: Esforco
  impacto: Impacto
  telasRelacionadas?: string[]
}

export interface Dor {
  id: string
  titulo: string
  descricao: string
  personas: Persona[]
  jornada: Jornada
  severidade: 'critica' | 'alta' | 'media'
  iniciativaQueResolve: string
}

export interface Sistema {
  id: string
  nome: string
  funcao: string
  status: StatusSistema
  doresAssociadas: string[]
  restricao?: string
}

export interface Provocacao {
  id: string
  pergunta: string
  contexto: string
  destinatario: 'carol' | 'jansen' | 'ambos'
}

export interface PresentationContextValue {
  mode: 'presentation' | 'exploration'
  currentStep: number
  next: () => void
  prev: () => void
  toggle: () => void
}

export interface SectionMeta {
  id: string
  label: string
  Component: React.ComponentType
}
```

- [ ] **Step 2: Criar `src/lib/utils.ts`**

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 3: Commit**

```bash
git add src/types/index.ts src/lib/utils.ts
git commit -m "feat: add shared types and cn() utility"
```

---

## Task 4: Camada de dados estáticos

**Files:**
- Create: `src/data/sistemas.ts`
- Create: `src/data/dores.ts`
- Create: `src/data/iniciativas.ts`
- Create: `src/data/provocacoes.ts`

**Interfaces:**
- Consumes: `Sistema`, `Dor`, `Iniciativa`, `Provocacao` de `../types`
- Produces: constantes `SISTEMAS`, `DORES`, `INICIATIVAS`, `PROVOCACOES` importáveis de `../../data/*`

- [ ] **Step 1: Criar `src/data/sistemas.ts`**

```typescript
import type { Sistema } from '../types'

export const SISTEMAS: Sistema[] = [
  {
    id: 'S01',
    nome: 'IEM',
    funcao: 'ATS e admissão digital — candidatura, triagem e gestão de vagas',
    status: 'usa',
    doresAssociadas: ['D03'],
    restricao: 'Integração unidirecional com plataforma de folha — sem retorno automatizado',
  },
  {
    id: 'S02',
    nome: 'Plataforma de Folha',
    funcao: 'ERP de folha de pagamento e cadastro de colaboradores',
    status: 'substitui',
    doresAssociadas: ['D03'],
    restricao: 'Substituição prevista para 2027 — não amarrar arquitetura',
  },
  {
    id: 'S03',
    nome: 'Spinner / Fusion',
    funcao: 'ATS global para candidatos — controlado pela matriz italiana',
    status: 'nao-toca',
    doresAssociadas: [],
    restricao: 'Intocável sem aprovação do Global',
  },
  {
    id: 'S04',
    nome: 'Portal do Candidato Global',
    funcao: 'Portal global de candidatura e onboarding de candidatos',
    status: 'nao-toca',
    doresAssociadas: [],
    restricao: 'Intocável sem aprovação do Global',
  },
  {
    id: 'S05',
    nome: 'Blip / WhatsApp',
    funcao: 'Canal de comunicação com workers via chatbot e WhatsApp',
    status: 'substitui',
    doresAssociadas: ['D04', 'D05'],
  },
  {
    id: 'S06',
    nome: 'TomTicket',
    funcao: 'Helpdesk de solicitações — atendimento de dúvidas e chamados do worker',
    status: 'substitui',
    doresAssociadas: ['D05'],
  },
  {
    id: 'S07',
    nome: 'GLPI',
    funcao: 'Helpdesk de TI interno — chamados de suporte técnico',
    status: 'substitui',
    doresAssociadas: [],
  },
  {
    id: 'S08',
    nome: 'VIP',
    funcao: 'Canal de comunicação alternativo — mensagens e notificações',
    status: 'substitui',
    doresAssociadas: ['D05'],
  },
  {
    id: 'S09',
    nome: 'D4Sign / Assinatura Eletrônica',
    funcao: 'Assinatura eletrônica de contratos e documentos rescisórios',
    status: 'integra',
    doresAssociadas: ['D02', 'D10'],
  },
  {
    id: 'S10',
    nome: 'SOC / Medicina do Trabalho',
    funcao: 'Gestão de ASO admissional, demissional e afastamentos médicos',
    status: 'integra',
    doresAssociadas: [],
  },
  {
    id: 'S11',
    nome: 'Ponto Mais',
    funcao: 'Controle de ponto dos workers — registro e tratamento de frequência',
    status: 'integra',
    doresAssociadas: ['D08'],
  },
  {
    id: 'S12',
    nome: 'OutSystems',
    funcao: 'Plataforma low-code — portal de admissão em construção',
    status: 'usa',
    doresAssociadas: [],
  },
]
```

- [ ] **Step 2: Criar `src/data/dores.ts`**

```typescript
import type { Dor } from '../types'

export const DORES: Dor[] = [
  {
    id: 'D01',
    titulo: 'Sem visibilidade do status admissional',
    descricao: 'O worker não sabe em que etapa do processo de admissão está, gerando ansiedade e abandono do funil.',
    personas: ['worker'],
    jornada: 'admissao',
    severidade: 'critica',
    iniciativaQueResolve: 'I01',
  },
  {
    id: 'D02',
    titulo: 'Contrato para assinar sem tempo hábil',
    descricao: 'O worker recebe o contrato minutos antes de precisar assinar, sem tempo para leitura ou dúvidas.',
    personas: ['worker'],
    jornada: 'admissao',
    severidade: 'alta',
    iniciativaQueResolve: 'I05',
  },
  {
    id: 'D03',
    titulo: 'Redigitação de dados entre IEM e plataforma de folha',
    descricao: 'Analistas do CARE inserem manualmente na plataforma de folha os dados já digitados no IEM — triple data entry.',
    personas: ['colaborador-gi'],
    jornada: 'admissao',
    severidade: 'critica',
    iniciativaQueResolve: 'I03',
  },
  {
    id: 'D04',
    titulo: 'WhatsApp pessoal bloqueado por volume',
    descricao: 'Analistas usam WhatsApp pessoal para comunicação com workers. Após 100+ mensagens/dia, o número é bloqueado.',
    personas: ['colaborador-gi'],
    jornada: 'admissao',
    severidade: 'critica',
    iniciativaQueResolve: 'I07',
  },
  {
    id: 'D05',
    titulo: 'Sem canal único de comunicação com o worker',
    descricao: 'Worker e colaborador GI se comunicam por múltiplos canais desconexos — WhatsApp, TomTicket, Blip, VIP — sem histórico unificado.',
    personas: ['worker', 'colaborador-gi'],
    jornada: 'ciclo-ativo',
    severidade: 'critica',
    iniciativaQueResolve: 'I07',
  },
  {
    id: 'D06',
    titulo: 'Sem acompanhamento de onboarding 30/60/90 dias',
    descricao: 'Não há processo estruturado para acompanhar a integração do worker ao cliente nos primeiros 90 dias de contrato.',
    personas: ['worker', 'cliente'],
    jornada: 'ciclo-ativo',
    severidade: 'alta',
    iniciativaQueResolve: 'I10',
  },
  {
    id: 'D07',
    titulo: 'Worker não sabe quem é seu contato GI',
    descricao: 'Durante o contrato ativo, o worker não tem um contato claro e único na GI para tirar dúvidas ou relatar problemas.',
    personas: ['worker'],
    jornada: 'ciclo-ativo',
    severidade: 'alta',
    iniciativaQueResolve: 'I10',
  },
  {
    id: 'D08',
    titulo: 'Controle de afastamentos via planilha manual',
    descricao: 'Afastamentos, licenças e ASOs são controlados em planilhas Excel com PROC-V manuais, sem integração entre SST, Jurídico e Folha.',
    personas: ['colaborador-gi'],
    jornada: 'ciclo-ativo',
    severidade: 'alta',
    iniciativaQueResolve: 'I12',
  },
  {
    id: 'D09',
    titulo: '10 dias sem informação no desligamento',
    descricao: 'Após o aviso de desligamento, o worker fica até 10 dias sem informação sobre o status do processo rescisório.',
    personas: ['worker'],
    jornada: 'offboarding',
    severidade: 'critica',
    iniciativaQueResolve: 'I13',
  },
  {
    id: 'D10',
    titulo: 'Baixa de documentos feita uma a uma',
    descricao: 'Analistas baixam documentos de rescisão individualmente no D4Sign, sem envio em massa ou integração automática.',
    personas: ['colaborador-gi'],
    jornada: 'offboarding',
    severidade: 'alta',
    iniciativaQueResolve: 'I14',
  },
  {
    id: 'D11',
    titulo: 'Sem canal de comunicação pós-desligamento',
    descricao: 'Após o desligamento, o ex-worker não tem canal para acessar holerites, TRCT, FGTS ou esclarecer dúvidas rescisórias.',
    personas: ['worker'],
    jornada: 'offboarding',
    severidade: 'alta',
    iniciativaQueResolve: 'I17',
  },
]
```

- [ ] **Step 3: Criar `src/data/iniciativas.ts`**

```typescript
import type { Iniciativa } from '../types'

export const INICIATIVAS: Iniciativa[] = [
  {
    id: 'I01',
    titulo: 'Portal digital de admissão com rastreio em tempo real de status do candidato',
    descricao: 'Substituir o controle manual de status admissional por um portal com visibilidade em tempo real para o worker e para a operação.',
    jornada: 'admissao',
    personas: ['worker', 'colaborador-gi'],
    doresResolvidas: ['D01'],
    sistemaSubstituido: 'Controle manual de status — planilhas e WhatsApp',
    esforco: 'medio',
    impacto: 'alto',
    telasRelacionadas: ['inicio'],
  },
  {
    id: 'I02',
    titulo: 'Automação do envio e reenvio de link de documentação ao candidato',
    descricao: 'Automatizar o disparo e reenvio de links de documentação admissional, eliminando a dependência de WhatsApp pessoal dos analistas.',
    jornada: 'admissao',
    personas: ['worker', 'colaborador-gi'],
    doresResolvidas: ['D04'],
    sistemaSubstituido: 'Envio manual via WhatsApp pessoal',
    esforco: 'baixo',
    impacto: 'alto',
  },
  {
    id: 'I03',
    titulo: 'Integração IM → plataforma de folha: migração automática sem redigitação (triple data entry)',
    descricao: 'Criar camada de integração iPaaS para migrar dados do IEM para a plataforma de folha automaticamente, eliminando a redigitação manual.',
    jornada: 'admissao',
    personas: ['colaborador-gi'],
    doresResolvidas: ['D03'],
    sistemaSubstituido: 'Redigitação manual entre IEM e plataforma de folha',
    esforco: 'alto',
    impacto: 'alto',
  },
  {
    id: 'I04',
    titulo: 'Dashboard em tempo real de admissões em andamento para a Operação (SMS)',
    descricao: 'Substituir as trocas de e-mail manuais de status por um dashboard com visibilidade em tempo real do funil de admissão para a Operação e clientes.',
    jornada: 'admissao',
    personas: ['colaborador-gi', 'cliente'],
    doresResolvidas: [],
    sistemaSubstituido: 'Trocas de e-mail manuais para status de candidatos',
    esforco: 'medio',
    impacto: 'medio',
  },
  {
    id: 'I05',
    titulo: 'Digitalização e assinatura eletrônica padronizada de contrato (Sign Único)',
    descricao: 'Centralizar o envio e acompanhamento do kit admissional em um único fluxo de assinatura eletrônica, com envio em lote padronizado.',
    jornada: 'admissao',
    personas: ['worker', 'colaborador-gi'],
    doresResolvidas: ['D02'],
    sistemaSubstituido: 'D4Sign + DocSign fragmentados — envio um a um',
    esforco: 'baixo',
    impacto: 'alto',
    telasRelacionadas: ['documentos'],
  },
  {
    id: 'I06',
    titulo: 'Automação de relatório/comunicado de admissões concluídas à Operação',
    descricao: 'Substituir o envio manual de planilhas de status entre CARE e Operação por relatórios automatizados gerados ao final de cada batch admissional.',
    jornada: 'admissao',
    personas: ['colaborador-gi'],
    doresResolvidas: [],
    sistemaSubstituido: 'Planilhas manuais de comunicação CARE-Operação',
    esforco: 'baixo',
    impacto: 'medio',
  },
  {
    id: 'I07',
    titulo: 'Central de atendimento unificada (CARE + SMS) com histórico consolidado e SLA único',
    descricao: 'Substituir WhatsApp pessoal, TomTicket, Blip e VIP por uma central única com histórico consolidado, SLA definido e roteamento automático por tipo de solicitação.',
    jornada: 'ciclo-ativo',
    personas: ['worker', 'colaborador-gi', 'cliente'],
    doresResolvidas: ['D04', 'D05'],
    sistemaSubstituido: 'WhatsApp + TomTicket + Blip + VIP fragmentados',
    esforco: 'alto',
    impacto: 'alto',
    telasRelacionadas: ['solicitacoes'],
  },
  {
    id: 'I08',
    titulo: 'Automação de alertas de vencimento de contratos, férias e renovação de ASOs',
    descricao: 'Criar alertas automáticos de vencimento de contratos, férias vencidas e ASOs expirados, eliminando o controle analógico em planilhas paralelas.',
    jornada: 'ciclo-ativo',
    personas: ['colaborador-gi'],
    doresResolvidas: [],
    sistemaSubstituido: 'Controle analógico em planilhas paralelas',
    esforco: 'medio',
    impacto: 'alto',
  },
  {
    id: 'I09',
    titulo: 'Digitalização e gestão de ponto integrada (parametrização + tratamento + alertas)',
    descricao: 'Substituir planilhas Excel com PROC-V manuais por um módulo de ponto integrado com parametrização de regras, tratamento automático e alertas de inconsistência.',
    jornada: 'ciclo-ativo',
    personas: ['colaborador-gi'],
    doresResolvidas: ['D08'],
    sistemaSubstituido: 'Planilhas Excel com PROC-V manuais para fechamento de ponto',
    esforco: 'alto',
    impacto: 'medio',
  },
  {
    id: 'I10',
    titulo: 'Portal do Worker (autoatendimento: dúvidas, holerite, benefícios, férias)',
    descricao: 'Criar portal de autoatendimento para o worker acessar documentos, holerites, benefícios, férias e acompanhar seu contrato sem depender de chamados.',
    jornada: 'ciclo-ativo',
    personas: ['worker', 'colaborador-gi'],
    doresResolvidas: ['D06', 'D07'],
    sistemaSubstituido: 'Volume de chamados repetitivos — acesso via WhatsApp e e-mail',
    esforco: 'alto',
    impacto: 'alto',
    telasRelacionadas: ['inicio', 'documentos', 'treinamentos'],
  },
  {
    id: 'I11',
    titulo: 'Governança embutida no sistema: bloqueio de ações fora de SLA ou regra trabalhista',
    descricao: 'Implementar regras de negócio e compliance trabalhista diretamente no sistema, bloqueando ações que violem SLAs ou legislação sem depender da memória do analista.',
    jornada: 'ciclo-ativo',
    personas: ['colaborador-gi'],
    doresResolvidas: [],
    esforco: 'alto',
    impacto: 'alto',
  },
  {
    id: 'I12',
    titulo: 'Processo estruturado de gestão de afastamentos com acionamento automatizado',
    descricao: 'Substituir o fluxo manual entre SST, Jurídico e Folha por um processo estruturado com acionamento automático de cada área no momento correto.',
    jornada: 'ciclo-ativo',
    personas: ['worker', 'colaborador-gi'],
    doresResolvidas: ['D08'],
    sistemaSubstituido: 'Fluxo manual entre SST, Jurídico e Folha via planilha e e-mail',
    esforco: 'medio',
    impacto: 'alto',
  },
  {
    id: 'I13',
    titulo: 'Fluxo digital de desligamento com acionamento automático do CARE pelo SMS',
    descricao: 'Substituir a quarteirização manual (SMS → planilha → TomTicket → CARE → CSC) por um fluxo digital que aciona automaticamente o CARE ao receber o aviso de desligamento do SMS.',
    jornada: 'offboarding',
    personas: ['colaborador-gi'],
    doresResolvidas: ['D09'],
    sistemaSubstituido: 'Quarteirização manual: SMS → planilha → TomTicket → CARE → CSC',
    esforco: 'medio',
    impacto: 'alto',
    telasRelacionadas: ['rescisao'],
  },
  {
    id: 'I14',
    titulo: 'Assinatura eletrônica padronizada de TRCT e documentos de rescisão',
    descricao: 'Centralizar o envio e assinatura dos documentos rescisórios em um único fluxo padronizado, com envio em massa e rastreio por worker.',
    jornada: 'offboarding',
    personas: ['worker', 'colaborador-gi'],
    doresResolvidas: ['D10'],
    sistemaSubstituido: 'D4Sign + DocSign fragmentados — baixa e envio um a um',
    esforco: 'baixo',
    impacto: 'alto',
    telasRelacionadas: ['rescisao'],
  },
  {
    id: 'I15',
    titulo: 'GED (gestão eletrônica de documentos) para arquivamento pós-rescisão',
    descricao: 'Criar repositório centralizado de documentos pós-rescisão, eliminando a "arqueologia" em e-mails, pastas locais e WhatsApp.',
    jornada: 'offboarding',
    personas: ['colaborador-gi'],
    doresResolvidas: [],
    sistemaSubstituido: 'Arquivos em e-mails, pastas locais e WhatsApp',
    esforco: 'medio',
    impacto: 'medio',
  },
  {
    id: 'I16',
    titulo: 'Automação de agendamento e controle de exame demissional',
    descricao: 'Automatizar o agendamento do ASO demissional ao receber o aviso de desligamento, eliminando o agendamento um a um via WhatsApp bloqueado.',
    jornada: 'offboarding',
    personas: ['worker', 'colaborador-gi'],
    doresResolvidas: [],
    sistemaSubstituido: 'Agendamento ASO demissional um a um via WhatsApp',
    esforco: 'medio',
    impacto: 'medio',
  },
  {
    id: 'I17',
    titulo: 'Portal do ex-colaborador para autoatendimento pós-desligamento',
    descricao: 'Criar área no portal do worker com acesso pós-desligamento para TRCT, holerites, FGTS e seguro-desemprego, eliminando o uso de WhatsApp pessoal de analistas.',
    jornada: 'offboarding',
    personas: ['worker'],
    doresResolvidas: ['D11'],
    sistemaSubstituido: 'WhatsApp pessoal de analistas para dúvidas pós-desligamento',
    esforco: 'alto',
    impacto: 'alto',
    telasRelacionadas: ['inicio'],
  },
]
```

- [ ] **Step 4: Criar `src/data/provocacoes.ts`**

```typescript
import type { Provocacao } from '../types'

export const PROVOCACOES: Provocacao[] = [
  {
    id: 'P01',
    pergunta: 'O novo ERP substitui a plataforma de folha integralmente ou é complementar?',
    contexto: 'Isso define o que faz sentido construir agora versus o que vai ser refeito com a nova plataforma em 2027. Construir integrações sobre um sistema que vai ser descontinuado é risco alto.',
    destinatario: 'carol',
  },
  {
    id: 'P02',
    pergunta: 'A integração IEM → plataforma de folha hoje — quem é o dono técnico? É possível estender sem aprovação global?',
    contexto: 'A iniciativa I03 (eliminar triple data entry) depende de uma camada de integração. Antes de começar, precisamos saber quem controla esse fluxo e qual o nível de autonomia do Brasil.',
    destinatario: 'carol',
  },
  {
    id: 'P03',
    pergunta: 'O squad de TI tem capacidade para o portal do worker em paralelo com a admissão em OutSystems?',
    contexto: 'Dois projetos de plataforma simultâneos exigem planejamento de capacity. Se houver conflito de prioridade, qual projeto trava?',
    destinatario: 'carol',
  },
  {
    id: 'P04',
    pergunta: 'Quais BUs precisam alinhar antes de centralizar o controle do worker como holding?',
    contexto: 'A solução não pode ser desenhada para uma única BU. Se outras regionais tiverem processos divergentes, o portal do worker vira problema político antes de virar produto.',
    destinatario: 'jansen',
  },
  {
    id: 'P05',
    pergunta: 'O cliente (ex: Shopee) vai ter acesso ao portal do worker para acompanhar status?',
    contexto: 'A visibilidade do cliente foi listada como necessidade no workshop. Mas requer alinhamento comercial — o que o cliente pode ver muda o contrato de serviço, não só a arquitetura.',
    destinatario: 'ambos',
  },
  {
    id: 'P06',
    pergunta: 'Como lidar com o acesso do ex-worker após o desligamento sem criar vínculo trabalhista?',
    contexto: 'O portal pós-desligamento precisa de autenticação e prazo de acesso definidos. Essa é uma questão jurídica antes de técnica — quem define o prazo de retenção de dados do ex-worker?',
    destinatario: 'ambos',
  },
]
```

- [ ] **Step 5: Verificar TypeScript**

```bash
npx tsc --noEmit
```

Expected: sem erros.

- [ ] **Step 6: Commit**

```bash
git add src/data/ src/types/ src/lib/
git commit -m "feat: add static data layer — 12 systems, 11 pains, 17 initiatives, 6 provocations"
```

---

## Task 5: Hooks de navegação e estado

**Files:**
- Create: `src/hooks/useActiveSection.ts`
- Create: `src/hooks/usePresentation.ts`
- Create: `src/hooks/usePortalNav.ts`

**Interfaces:**
- Consumes: `PresentationContextValue` de `../types`
- Produces:
  - `useActiveSection(sectionIds: string[]): { activeId: string }` — exportado de `./useActiveSection`
  - `usePresentation(): PresentationContextValue` — exportado de `./usePresentation`
  - `usePortalNav(): { screen: PortalScreen; navigate: (s: PortalScreen) => void }` — exportado de `./usePortalNav`

- [ ] **Step 1: Criar `src/hooks/useActiveSection.ts`**

```typescript
import { useState, useEffect } from 'react'

export function useActiveSection(sectionIds: string[]) {
  const [activeId, setActiveId] = useState<string>(sectionIds[0] ?? '')

  useEffect(() => {
    if (sectionIds.length === 0) return

    // threshold 0.3 porque seções longas nunca atingem 50% de visibilidade na viewport 1080p
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting)
        if (visible) {
          setActiveId(visible.target.id)
        }
      },
      { threshold: 0.3 },
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sectionIds])

  return { activeId }
}
```

- [ ] **Step 2: Criar `src/hooks/usePresentation.ts`**

```typescript
import { useState } from 'react'
import type { PresentationContextValue } from '../types'

const TOTAL_STEPS = 7

export function usePresentation(): PresentationContextValue {
  const [mode, setMode] = useState<'presentation' | 'exploration'>('exploration')
  const [currentStep, setCurrentStep] = useState(0)

  function next() {
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS - 1))
  }

  function prev() {
    setCurrentStep((s) => Math.max(s - 1, 0))
  }

  function toggle() {
    setMode((m) => (m === 'exploration' ? 'presentation' : 'exploration'))
    setCurrentStep(0)
  }

  return { mode, currentStep, next, prev, toggle }
}
```

- [ ] **Step 3: Criar `src/hooks/usePortalNav.ts`**

```typescript
import { useState } from 'react'

export type PortalScreen = 'inicio' | 'documentos' | 'solicitacoes' | 'treinamentos' | 'rescisao'

export function usePortalNav() {
  const [screen, setScreen] = useState<PortalScreen>('inicio')
  return { screen, navigate: setScreen }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/hooks/
git commit -m "feat: add navigation hooks — useActiveSection, usePresentation, usePortalNav"
```

---

## Task 6: Componentes de layout

**Files:**
- Create: `src/components/layout/Section.tsx`
- Create: `src/components/layout/Sidebar.tsx`
- Create: `src/components/layout/Header.tsx`

**Interfaces:**
- Consumes: `PresentationContext` de `../../App`; `SectionMeta` de `../../types`; `cn` de `../../lib/utils`
- Produces:
  - `Section` — wrapper com `id` para scroll anchor
  - `Sidebar` — nav lateral fixa (props: `sections: SectionMeta[]`, `activeId: string`)
  - `Header` — topbar fixa (props: `activeLabel: string`)

- [ ] **Step 1: Criar `src/components/layout/Section.tsx`**

```typescript
import type { ReactNode } from 'react'

interface SectionProps {
  id: string
  children: ReactNode
  className?: string
}

function Section({ id, children, className }: SectionProps) {
  return (
    <section id={id} className={`min-h-screen ${className ?? ''}`}>
      {children}
    </section>
  )
}

export default Section
```

- [ ] **Step 2: Criar `src/components/layout/Sidebar.tsx`**

```typescript
import { useContext } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PresentationContext } from '../../App'
import type { SectionMeta } from '../../types'
import { cn } from '../../lib/utils'

interface SidebarProps {
  sections: SectionMeta[]
  activeId: string
}

function Sidebar({ sections, activeId }: SidebarProps) {
  const { mode, currentStep, next, prev, toggle } = useContext(PresentationContext)

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  if (mode === 'presentation') {
    return (
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
        <button
          onClick={prev}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-4 py-2 bg-gi-navy text-white rounded-lg disabled:opacity-40 hover:bg-gi-blue transition-colors"
        >
          <ChevronLeft size={16} />
          Anterior
        </button>
        <span className="text-sm text-gi-charcoal">
          {currentStep + 1} / {sections.length}
        </span>
        <button
          onClick={next}
          disabled={currentStep === sections.length - 1}
          className="flex items-center gap-2 px-4 py-2 bg-gi-navy text-white rounded-lg disabled:opacity-40 hover:bg-gi-blue transition-colors"
        >
          Próximo
          <ChevronRight size={16} />
        </button>
      </div>
    )
  }

  return (
    <aside className="fixed top-[56px] left-0 w-[240px] h-[calc(100vh-56px)] bg-gi-navy flex flex-col z-40">
      <nav className="flex-1 py-6 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => scrollTo(section.id)}
                className={cn(
                  'w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all',
                  activeId === section.id
                    ? 'text-gi-blue border-l-[3px] border-gi-blue bg-white/10 pl-[9px]'
                    : 'text-white/80 hover:text-white hover:bg-white/5',
                )}
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <button
          onClick={toggle}
          className="w-full px-3 py-2 text-xs text-white/70 hover:text-white border border-white/20 rounded-lg hover:bg-white/5 transition-all"
        >
          {mode === 'exploration' ? 'Modo Apresentação' : 'Modo Exploração'}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
```

- [ ] **Step 3: Criar `src/components/layout/Header.tsx`**

```typescript
import { useContext } from 'react'
import { Home } from 'lucide-react'
import { PresentationContext } from '../../App'

interface HeaderProps {
  activeLabel: string
}

function Header({ activeLabel }: HeaderProps) {
  const { mode, toggle } = useContext(PresentationContext)

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-[56px] bg-white border-b border-gi-border flex items-center justify-between px-6 z-50">
      <div className="flex items-center gap-3">
        <img
          src="/src/assets/logo-gi-group.png"
          alt="GI Group"
          className="h-8 object-contain"
          onError={(e) => {
            const target = e.currentTarget
            target.style.display = 'none'
            const fallback = target.nextElementSibling as HTMLElement | null
            if (fallback) fallback.style.display = 'block'
          }}
        />
        <span className="hidden text-gi-navy font-bold text-sm">GI Group</span>
        <span className="text-gi-border mx-2">|</span>
        <span className="text-sm text-gi-charcoal">{activeLabel}</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="px-3 py-1.5 text-xs border border-gi-border rounded-lg text-gi-charcoal hover:border-gi-navy hover:text-gi-navy transition-all"
        >
          {mode === 'exploration' ? 'Apresentação' : 'Exploração'}
        </button>
        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gi-blue hover:underline transition-all"
        >
          <Home size={12} />
          Início
        </button>
      </div>
    </header>
  )
}

export default Header
```

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/
git commit -m "feat: add layout components — Section, Sidebar, Header"
```

---

## Task 7: Componentes UI atômicos

**Files:**
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/Card.tsx`
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Tag.tsx`
- Create: `src/components/ui/Tooltip.tsx` (stub)
- Create: `src/components/ui/ProgressBar.tsx` (stub)

**Interfaces:**
- Consumes: `cn` de `../../lib/utils`
- Produces: componentes importáveis de `../ui/*`

- [ ] **Step 1: Criar `src/components/ui/Badge.tsx`**

```typescript
import { cn } from '../../lib/utils'

type BadgeVariant =
  | 'critica'
  | 'alta'
  | 'media'
  | 'andamento'
  | 'concluido'
  | 'bloqueado'
  | 'admissao'
  | 'ciclo'
  | 'offboarding'

interface BadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
  className?: string
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  critica:     'bg-red-100 text-gi-red border border-red-200',
  alta:        'bg-orange-100 text-gi-orange border border-orange-200',
  media:       'bg-amber-100 text-gi-amber border border-amber-200',
  andamento:   'bg-blue-100 text-gi-blue border border-blue-200',
  concluido:   'bg-green-100 text-gi-green border border-green-200',
  bloqueado:   'bg-gray-100 text-gi-charcoal border border-gi-border',
  admissao:    'bg-gi-navy text-white',
  ciclo:       'bg-gi-blue text-white',
  offboarding: 'bg-gi-steel text-white',
}

function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide',
        VARIANT_STYLES[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

export default Badge
```

- [ ] **Step 2: Criar `src/components/ui/Card.tsx`**

```typescript
import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

type CardVariant = 'default' | 'hoverable' | 'highlighted' | 'muted'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  variant?: CardVariant
}

const VARIANT_STYLES: Record<CardVariant, string> = {
  default:     'bg-white border border-gi-border',
  hoverable:   'bg-white border border-gi-border hover:border-gi-blue hover:shadow-sm cursor-pointer',
  highlighted: 'bg-white border-2 border-gi-blue',
  muted:       'bg-gi-light border border-transparent',
}

function Card({ children, className, onClick, variant = 'default' }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn('rounded-xl p-6 transition-all', VARIANT_STYLES[variant], className)}
    >
      {children}
    </div>
  )
}

export default Card
```

- [ ] **Step 3: Criar `src/components/ui/Button.tsx`**

```typescript
import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps {
  children: ReactNode
  variant?: ButtonVariant
  onClick?: () => void
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:   'bg-gi-blue text-white hover:bg-gi-navy disabled:opacity-50',
  secondary: 'border border-gi-navy text-gi-navy hover:bg-gi-light disabled:opacity-50',
  ghost:     'text-gi-blue hover:underline disabled:opacity-50',
}

function Button({
  children,
  variant = 'primary',
  onClick,
  disabled,
  className,
  type = 'button',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all',
        VARIANT_STYLES[variant],
        className,
      )}
    >
      {children}
    </button>
  )
}

export default Button
```

- [ ] **Step 4: Criar `src/components/ui/Tag.tsx`**

```typescript
import type { Persona } from '../../types'
import { cn } from '../../lib/utils'

interface TagProps {
  persona: Persona
  className?: string
}

const PERSONA_STYLES: Record<Persona, string> = {
  'worker':         'bg-purple-100 text-purple-800',
  'colaborador-gi': 'bg-blue-100 text-gi-navy',
  'cliente':        'bg-teal-100 text-teal-800',
}

const PERSONA_LABELS: Record<Persona, string> = {
  'worker':         'Worker',
  'colaborador-gi': 'Colaborador GI',
  'cliente':        'Cliente',
}

function Tag({ persona, className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold',
        PERSONA_STYLES[persona],
        className,
      )}
    >
      {PERSONA_LABELS[persona]}
    </span>
  )
}

export default Tag
```

- [ ] **Step 5: Criar `src/components/ui/Tooltip.tsx` (stub)**

```typescript
import type { ReactNode } from 'react'

interface TooltipProps {
  dorId: string
  iniciativaId: string
  children: ReactNode
}

function Tooltip({ children }: TooltipProps) {
  return <>{children}</>
}

export default Tooltip
```

- [ ] **Step 6: Criar `src/components/ui/ProgressBar.tsx` (stub)**

```typescript
interface ProgressBarProps {
  value: number
  max?: number
  className?: string
}

function ProgressBar({ value, max = 100, className }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className={`h-2 bg-gi-border rounded-full overflow-hidden ${className ?? ''}`}>
      <div className="h-full bg-gi-blue rounded-full" style={{ width: `${pct}%` }} />
    </div>
  )
}

export default ProgressBar
```

- [ ] **Step 7: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add UI atoms — Badge, Card, Button, Tag, Tooltip stub, ProgressBar stub"
```

---

## Task 8: Seções placeholder (S1–S7)

**Files:**
- Create: `src/components/sections/S1Hero/index.tsx`
- Create: `src/components/sections/S2Diagnostico/index.tsx`
- Create: `src/components/sections/S3Dores/index.tsx`
- Create: `src/components/sections/S4Arquitetura/index.tsx`
- Create: `src/components/sections/S5Iniciativas/index.tsx`
- Create: `src/components/sections/S6Portal/index.tsx`
- Create: `src/components/sections/S7Provocacoes/index.tsx`

**Interfaces:**
- Produces: componentes React exportados como default, sem props, importáveis em `App.tsx`

- [ ] **Step 1: Criar `src/components/sections/S1Hero/index.tsx`**

```typescript
function S1Hero() {
  return (
    <div className="min-h-screen bg-gi-navy flex items-center justify-center">
      <h1 className="text-5xl font-bold text-white">S1 — Hero</h1>
    </div>
  )
}
export default S1Hero
```

- [ ] **Step 2: Criar `src/components/sections/S2Diagnostico/index.tsx`**

```typescript
function S2Diagnostico() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <h2 className="text-4xl font-bold text-gi-navy">S2 — Diagnóstico Sistêmico</h2>
    </div>
  )
}
export default S2Diagnostico
```

- [ ] **Step 3: Criar `src/components/sections/S3Dores/index.tsx`**

```typescript
function S3Dores() {
  return (
    <div className="min-h-screen bg-gi-light flex items-center justify-center">
      <h2 className="text-4xl font-bold text-gi-navy">S3 — Dores por Persona</h2>
    </div>
  )
}
export default S3Dores
```

- [ ] **Step 4: Criar `src/components/sections/S4Arquitetura/index.tsx`**

```typescript
function S4Arquitetura() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <h2 className="text-4xl font-bold text-gi-navy">S4 — Arquitetura As-is / To-be</h2>
    </div>
  )
}
export default S4Arquitetura
```

- [ ] **Step 5: Criar `src/components/sections/S5Iniciativas/index.tsx`**

```typescript
function S5Iniciativas() {
  return (
    <div className="min-h-screen bg-gi-light flex items-center justify-center">
      <h2 className="text-4xl font-bold text-gi-navy">S5 — Iniciativas</h2>
    </div>
  )
}
export default S5Iniciativas
```

- [ ] **Step 6: Criar `src/components/sections/S6Portal/index.tsx`**

```typescript
function S6Portal() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <h2 className="text-4xl font-bold text-gi-navy">S6 — Portal do Worker</h2>
    </div>
  )
}
export default S6Portal
```

- [ ] **Step 7: Criar `src/components/sections/S7Provocacoes/index.tsx`**

```typescript
function S7Provocacoes() {
  return (
    <div className="min-h-screen bg-gi-navy flex items-center justify-center">
      <h2 className="text-4xl font-bold text-white">S7 — Provocações e Próximos Passos</h2>
    </div>
  )
}
export default S7Provocacoes
```

- [ ] **Step 8: Commit**

```bash
git add src/components/sections/
git commit -m "feat: add section placeholders S1-S7"
```

---

## Task 9: App.tsx, main.tsx e logo

**Files:**
- Create: `src/App.tsx`
- Create: `src/main.tsx`
- Download: `src/assets/logo-gi-group.png`

**Interfaces:**
- Consumes: todos os componentes, hooks e tipos criados nas tasks anteriores
- Produces: aplicação funcional — `npm run dev` abre no browser com shell completa

- [ ] **Step 1: Baixar logo GI Group**

```bash
curl -L "https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img/https://gigroupholdingsolucoes.com.br/wp-content/uploads/2023/06/logo.png" -o src/assets/logo-gi-group.png
```

Se o download falhar (rede bloqueada), registrar no `implement-done.md` — o Header já tem fallback de texto "GI Group".

- [ ] **Step 2: Criar `src/main.tsx`**

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element not found')

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 3: Criar `src/App.tsx`**

```typescript
import { createContext, useMemo } from 'react'
import { usePresentation } from './hooks/usePresentation'
import { useActiveSection } from './hooks/useActiveSection'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import Section from './components/layout/Section'
import S1Hero from './components/sections/S1Hero'
import S2Diagnostico from './components/sections/S2Diagnostico'
import S3Dores from './components/sections/S3Dores'
import S4Arquitetura from './components/sections/S4Arquitetura'
import S5Iniciativas from './components/sections/S5Iniciativas'
import S6Portal from './components/sections/S6Portal'
import S7Provocacoes from './components/sections/S7Provocacoes'
import type { PresentationContextValue, SectionMeta } from './types'

export const PresentationContext = createContext<PresentationContextValue>({
  mode: 'exploration',
  currentStep: 0,
  next: () => undefined,
  prev: () => undefined,
  toggle: () => undefined,
})

const SECTIONS: SectionMeta[] = [
  { id: 'hero',        label: 'Contexto',          Component: S1Hero },
  { id: 'diagnostico', label: 'Diagnóstico',        Component: S2Diagnostico },
  { id: 'dores',       label: 'Dores',              Component: S3Dores },
  { id: 'arquitetura', label: 'Arquitetura',         Component: S4Arquitetura },
  { id: 'iniciativas', label: 'Iniciativas',         Component: S5Iniciativas },
  { id: 'portal',      label: 'Portal do Worker',   Component: S6Portal },
  { id: 'provocacoes', label: 'Próximos passos',    Component: S7Provocacoes },
]

const SECTION_IDS = SECTIONS.map((s) => s.id)

export function App() {
  const presentation = usePresentation()
  const { activeId } = useActiveSection(SECTION_IDS)

  const activeLabel = useMemo(
    () => SECTIONS.find((s) => s.id === activeId)?.label ?? '',
    [activeId],
  )

  return (
    <PresentationContext.Provider value={presentation}>
      <Header activeLabel={activeLabel} />
      <Sidebar sections={SECTIONS} activeId={activeId} />
      <main className="ml-[240px] mt-[56px]">
        {SECTIONS.map(({ id, Component }) => (
          <Section key={id} id={id}>
            <Component />
          </Section>
        ))}
      </main>
    </PresentationContext.Provider>
  )
}

export default App
```

- [ ] **Step 4: Verificar TypeScript**

```bash
npx tsc --noEmit
```

Expected: sem erros.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/main.tsx src/assets/
git commit -m "feat: wire App.tsx with PresentationContext, Sidebar, Header and section placeholders"
```

---

## Task 10: Verificação final

- [ ] **Step 1: Rodar em desenvolvimento**

```bash
npm run dev
```

Expected: servidor iniciado em `http://localhost:5173/` sem erros no console.

- [ ] **Step 2: Verificar critérios de aceite**

Abrir `http://localhost:5173/` e confirmar:
- [ ] Sidebar fixa à esquerda, fundo azul-marinho, logo GI no topo (ou fallback "GI Group")
- [ ] 7 itens de navegação na sidebar
- [ ] Clicar em item da sidebar faz scroll suave para a seção correspondente
- [ ] Item ativo na sidebar muda conforme scroll (borda azul + destaque)
- [ ] Toggle "Apresentação / Exploração" funcional no Header
- [ ] Toggle "Modo Apresentação" na base da sidebar funcional
- [ ] No modo apresentação: sidebar some, botões anterior/próximo aparecem na base da tela
- [ ] Fonte Lato carregando (verificar no DevTools → Network → Fonts)
- [ ] Sem erros de TypeScript no console

- [ ] **Step 3: Build de produção**

```bash
npm run build
```

Expected: `dist/` gerado sem erros.

- [ ] **Step 4: Commit final**

```bash
git add -A
git commit -m "feat: spec-1 complete — shell, sidebar, header, scroll and static data"
```

---

## Contrato de Output

Ao final da implementação, o repositório deve conter:

| Artefato | Condição de aceite |
|---|---|
| `npm run dev` | Inicia sem erros |
| `npm run build` | Compila sem erros TypeScript |
| Sidebar | Fixa, `gi-navy`, 7 itens, logo no topo |
| Header | Fixo 56px, breadcrumb, toggle de modo |
| Scroll + IntersectionObserver | Item ativo muda em tempo real |
| Modo apresentação | Sidebar oculta, botões anterior/próximo visíveis |
| `src/data/` | 12 sistemas, 11 dores, 17 iniciativas, 6 provocações — tipados, sem `any` |
| `src/types/index.ts` | Todos os tipos do projeto incluindo `PresentationContextValue` e `SectionMeta` |
| `src/components/ui/` | Badge, Card, Button, Tag funcionais; Tooltip e ProgressBar como stubs |
| Seções S1–S7 | Placeholders com fundo correto e título visível |
