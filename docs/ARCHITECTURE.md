# ARCHITECTURE.md — GI Group · Portal do Worker

**Versão:** 1.0
**Status:** Em desenvolvimento

---

## 1. Visão Geral

O relatório interativo é uma **SPA (Single Page Application) em React**, entregue como site estático. Não há backend próprio — todos os dados são estáticos e incorporados no código.

O artefato final é um único arquivo `index.html` + assets gerados pelo build do React (Vite), que pode ser aberto localmente em qualquer navegador ou hospedado em qualquer servidor estático (GitHub Pages, Vercel, Netlify).

---

## 2. Stack Tecnológica

| Camada            | Tecnologia          | Versão      |
| ----------------- | ------------------- | ----------- |
| Framework         | React               | 18.x        |
| Linguagem         | TypeScript          | 5.x         |
| Build tool        | Vite                | 5.x         |
| Estilização       | Tailwind CSS        | 3.x         |
| Ícones            | Lucide React        | latest      |
| Animações         | Framer Motion       | 11.x        |
| Gráficos          | Recharts            | 2.x         |
| Fonte             | Google Fonts (Lato) | —           |

---

## 3. Estrutura de Pastas

> **Galaxy Layout (2026-06-23):** estrutura atualizada para refletir o layout galáxia. Arquivos marcados com `†` são novos; marcados com `✕` foram removidos.

```
gi-worker-report/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/                  # Logos, imagens estáticas
│   ├── components/
│   │   ├── layout/
│   │   │   ├── SplashScreen.tsx † # Tela de abertura (estado splash)
│   │   │   ├── GalaxyMap.tsx    † # Mapa de planetas (estado galaxy)
│   │   │   ├── GalaxyHeader.tsx † # Header do estado galaxy
│   │   │   ├── MiniMap.tsx      † # Sidebar mini-mapa orbital (estado module)
│   │   │   ├── Header.tsx         # Topbar do estado module
│   │   │   ├── Sidebar.tsx      ✕ # Removido — substituído por GalaxyMap + MiniMap
│   │   │   └── Section.tsx      ✕ # Removido — módulos renderizados diretamente
│   │   ├── ui/                  # Componentes atômicos do design system
│   │   │   ├── Planet.tsx       † # Esfera de planeta reutilizável
│   │   │   ├── Badge.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Tag.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   └── ProgressBar.tsx
│   │   ├── sections/            # Uma pasta por seção do relatório
│   │   │   ├── S1Hero/
│   │   │   ├── S2Diagnostico/
│   │   │   ├── S3Dores/
│   │   │   ├── S4Arquitetura/
│   │   │   ├── S5Iniciativas/
│   │   │   ├── S6Portal/
│   │   │   └── S7Provocacoes/
│   │   └── portal/              # Telas do portal do worker (alta fidelidade)
│   │       ├── PortalShell.tsx  # Shell com sidebar + topbar do portal
│   │       ├── TelaInicio.tsx
│   │       ├── TelaDocumentos.tsx
│   │       ├── TelaSolicitacoes.tsx
│   │       ├── TelaTreinamentos.tsx
│   │       └── TelaRescisao.tsx
│   ├── data/                    # Dados estáticos do relatório
│   │   ├── planets.ts           † # Config dos 7 planetas (id, tamanho, cor, posição)
│   │   ├── sistemas.ts          # Mapa de sistemas (as-is)
│   │   ├── dores.ts             # Dores por persona
│   │   ├── iniciativas.ts       # As 17 iniciativas
│   │   └── provocacoes.ts       # Perguntas e próximos passos
│   ├── hooks/
│   │   ├── usePresentation.ts   # Modo apresentação vs exploração + goTo(step)
│   │   ├── usePortalNav.ts      # Navegação interna do portal mockado
│   │   └── useActiveSection.ts  ✕ # Removido — seção ativa via planeta clicado
│   ├── types/
│   │   └── index.ts             # Interfaces e tipos (inclui UiState)
│   ├── App.tsx                  # Root — estados splash/galaxy/module + AnimatePresence
│   ├── main.tsx                 # Entrypoint React
│   └── index.css                # Tailwind base + .bg-galaxy-sky + .bg-splash-sky
├── index.html
├── tailwind.config.ts           # Tokens GI Group + galaxy palette (space, stardust…)
├── tsconfig.json
└── vite.config.ts
```

---

## 4. Arquitetura de Componentes

O projeto segue uma arquitetura em três camadas:

```
data/ (estático)
      ↓
hooks/ (lógica de estado e navegação)
      ↓
components/ (renderização)
```

### 4.1 Camada de dados (`src/data/`)

Arquivos TypeScript com dados estáticos exportados como constantes. Nenhuma chamada de API — tudo em memória.

```typescript
// src/data/iniciativas.ts
export const INICIATIVAS: Iniciativa[] = [
  {
    id: 'I01',
    titulo: 'Portal de admissão com rastreio em tempo real',
    jornada: 'admissao',
    personas: ['worker', 'colaborador-gi'],
    doresResolvidas: ['D01', 'D03'],
    sistemaSubstituido: 'Planilha de controle de status',
    esforco: 'medio',
    impacto: 'alto',
  },
  // ...
]
```

### 4.2 Camada de hooks (`src/hooks/`)

Encapsulam todo estado e lógica de navegação. Nenhum componente tem estado local além do necessário para micro-interações.

```typescript
// src/hooks/usePresentation.ts
export function usePresentation() {
  const [mode, setMode] = useState<'presentation' | 'exploration'>('exploration')
  const [currentStep, setCurrentStep] = useState(0)
  // ...
  return { mode, currentStep, next, prev, toggle }
}
```

### 4.3 Camada de componentes (`src/components/`)

Apenas renderização. Sem fetch, sem lógica de negócio, sem estado além de micro-interações de UI (hover, open/close de tooltip).

---

## 5. Navegação — Galaxy Layout

O relatório usa **navegação por estado de UI**, não scroll. A seção ativa é determinada pelo planeta clicado no mapa da galáxia.

```typescript
// src/App.tsx — fluxo de navegação
function handlePlanetClick(sectionId: string) {
  const index = SECTIONS.findIndex((s) => s.id === sectionId)
  presentation.goTo(index)   // atualiza currentStep
  setUiState('module')       // transita para estado module
}
```

O `currentStep` em `usePresentation` é a fonte de verdade para a seção ativa. `useActiveSection` (Intersection Observer) foi removido.

No **modo apresentação**, a sidebar MiniMap some e a navegação é feita por botões Anterior/Próximo flutuantes no rodapé. No **modo exploração**, o MiniMap orbital está visível e o usuário pode pular para qualquer planeta.

---

## 6. Portal do Worker (Mockado)

As telas do portal são componentes React estáticos com dados hard-coded ilustrativos. Não há integração com backend.

O `PortalShell` é um componente que renderiza uma shell de aplicativo (sidebar + topbar) e troca o conteúdo interno com base no estado de navegação gerenciado pelo `usePortalNav`.

```typescript
// src/hooks/usePortalNav.ts
type PortalScreen = 'inicio' | 'documentos' | 'solicitacoes' | 'treinamentos' | 'rescisao'

export function usePortalNav() {
  const [screen, setScreen] = useState<PortalScreen>('inicio')
  return { screen, navigate: setScreen }
}
```

Cada tela do portal inclui **tooltips de dor** — ao hover em elementos específicos, aparece um tooltip mostrando qual dor aquele elemento resolve e qual iniciativa ele representa.

---

## 7. Tipos Compartilhados

```typescript
// src/types/index.ts

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
```

---

## 8. Modo Apresentação vs Exploração

O toggle de modo é global, controlado pelo `usePresentation` no `App.tsx` e passado via Context.

```typescript
// src/App.tsx — estrutura atual (Galaxy Layout)
export function App() {
  const presentation = usePresentation()
  const [uiState, setUiState] = useState<UiState>('splash')
  const activeSection = SECTIONS[presentation.currentStep]

  return (
    <PresentationContext.Provider value={presentation}>
      <AnimatePresence mode="wait">
        {uiState === 'splash' && <SplashScreen onComplete={() => setUiState('galaxy')} />}
        {uiState === 'galaxy' && <GalaxyMap onPlanetClick={handlePlanetClick} ... />}
        {uiState === 'module' && (
          <>
            <Header ... onGalaxyClick={() => setUiState('galaxy')} />
            {presentation.mode === 'exploration' && <MiniMap ... />}
            <main><activeSection.Component /></main>
            {presentation.mode === 'presentation' && <PresentationNav />}
          </>
        )}
      </AnimatePresence>
    </PresentationContext.Provider>
  )
}
```

---

## 9. Build e Entrega

```bash
# Instalar dependências
npm install

# Desenvolvimento local
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview
```

O output de `npm run build` é a pasta `dist/` — um site estático pronto para ser aberto localmente ou hospedado em qualquer CDN/servidor.

---

## 10. Princípios Arquiteturais

### Dados estáticos como fonte de verdade
Toda informação do relatório vive em `src/data/`. Alterar o conteúdo do relatório = editar os arquivos de data, não os componentes.

### Componentes sem lógica de negócio
Componentes em `src/components/` apenas renderizam. Toda lógica fica nos hooks.

### Identidade visual via tokens
Cores, tipografia e espaçamentos vêm dos tokens do `tailwind.config.ts` mapeados para a identidade da GI Group. Nenhum valor de cor hard-coded nos componentes.

### Portal como mockup navegável
As telas do portal são protótipos de alta fidelidade, não implementação real. O objetivo é demonstrar a visão do produto, não entregar o produto.
