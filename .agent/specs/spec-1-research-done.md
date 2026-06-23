# spec-1-research-done.md — Spec 1 · Setup e Shell · Research

**Data:** 2026-06-23
**Fase:** Research (concluída)
**Próxima fase:** Plan

---

## 1. Contexto levantado e decisões aplicáveis

### Stack tecnológica (ARCHITECTURE.md §2, PROJECT-STATE.md §5)

| Pacote | Versão | Uso |
|---|---|---|
| react + react-dom | 18.x | Framework |
| typescript | 5.x | Linguagem |
| vite | 5.x | Build tool |
| tailwindcss | 3.x | Estilização |
| framer-motion | 11.x | Animações |
| recharts | 2.x | Gráficos (specs posteriores) |
| lucide-react | latest | Ícones |
| clsx | latest | Classes condicionais |
| tailwind-merge | latest | Resolução de conflitos Tailwind |

**devDependencies necessárias (padrão Vite + Tailwind):**
- `@vitejs/plugin-react`
- `@types/react`, `@types/react-dom`
- `autoprefixer`, `postcss`

### Decisões de arquitetura aplicáveis (ARCHITECTURE.md, CODING-GUIDELINES.md)

- Três camadas: `data/` → `hooks/` → `components/` — sem inversão
- Apenas `src/index.css` — nenhum arquivo `.css` adicional
- Proibido `any`, CSS inline estático, hex hard-coded em className
- Dados estáticos em `src/data/` como constantes UPPER_SNAKE_CASE
- `PresentationContext` é o único Context global
- Estado local apenas para micro-interações de UI (hover, tooltip open/close)

### cn() utility (CODING-GUIDELINES.md §5 — decisão confirmada pelo humano)

Criar `src/lib/utils.ts` com helper `cn()` = `clsx` + `tailwind-merge`. Resolve conflitos de classes Tailwind em componentes que aceitam `className` como prop.

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

---

## 2. Tokens Tailwind — paleta completa GI Group (DESIGN-SYSTEM.md §2)

```typescript
// tailwind.config.ts — extend.colors.gi
{
  navy:    '#00145A',   // sidebar, hero bg, títulos de seção
  blue:    '#1D57FB',   // nav ativo, CTAs, item ativo (borda 3px)
  text:    '#666666',   // corpo de texto
  dark:    '#1E1E1E',   // títulos escuros
  charcoal:'#4B4C4D',  // subtítulos, labels
  white:   '#FFFFFF',
  light:   '#EFEFEF',   // seções S3, S5 (fundo alternado)
  muted:   '#E6E9EA',   // superfícies secundárias
  border:  '#DBDBDB',   // bordas padrão
  red:     '#C10731',   // badge crítica, alerta
  green:   '#49B100',   // badge concluído
  amber:   '#FFC300',   // badge pendente
  orange:  '#EB6608',   // badge alta prioridade
  steel:   '#4E7EB1',   // elementos secundários, badge offboarding
}
```

Fonte: Lato 400/700 via Google Fonts — import em `src/index.css`.

---

## 3. Tipos compartilhados (src/types/index.ts)

Documentados integralmente em ARCHITECTURE.md §7. Adicionar `PresentationContextValue` (tipo compartilhado entre App, Header e Sidebar — confirmado pelo humano):

```typescript
// union types
export type Jornada = 'admissao' | 'ciclo-ativo' | 'offboarding'
export type Persona = 'worker' | 'colaborador-gi' | 'cliente'
export type Esforco = 'baixo' | 'medio' | 'alto'
export type Impacto = 'baixo' | 'medio' | 'alto'
export type StatusSistema = 'usa' | 'integra' | 'substitui' | 'nao-toca'

// interfaces de dados
export interface Iniciativa { ... }   // ARCHITECTURE.md §7
export interface Dor { ... }          // ARCHITECTURE.md §7
export interface Sistema { ... }      // ARCHITECTURE.md §7
export interface Provocacao { ... }   // ARCHITECTURE.md §7

// tipo do Context global (adicionado — não constava no ARCHITECTURE.md)
export interface PresentationContextValue {
  mode: 'presentation' | 'exploration'
  currentStep: number
  next: () => void
  prev: () => void
  toggle: () => void
}
```

---

## 4. Arquitetura de navegação por scroll (ARCHITECTURE.md §5, CODING-GUIDELINES.md §9)

- `useActiveSection.ts` usa IntersectionObserver com `threshold: 0.3`
  - Razão documentada: seções longas nunca atingem 50% de visibilidade na viewport 1080p
- Cada `<Section>` recebe um `id` que é o anchor de scroll
- `useActiveSection` retorna `activeId: string` e `setActiveId`
- Sidebar recebe `activeId` para destacar o item correspondente
- Clique na sidebar executa `element.scrollIntoView({ behavior: 'smooth' })`

**Mapeamento seções → IDs → labels sidebar (DESIGN-SYSTEM.md §6.2 + §7):**

| Componente | id (anchor) | Label sidebar | Fundo seção |
|---|---|---|---|
| S1Hero | `hero` | Contexto | `gi-navy` |
| S2Diagnostico | `diagnostico` | Diagnóstico | `gi-white` |
| S3Dores | `dores` | Dores | `gi-light` |
| S4Arquitetura | `arquitetura` | Arquitetura | `gi-white` |
| S5Iniciativas | `iniciativas` | Iniciativas | `gi-light` |
| S6Portal | `portal` | Portal do Worker | `gi-white` |
| S7Provocacoes | `provocacoes` | Próximos passos | `gi-navy` |

---

## 5. Sidebar (DESIGN-SYSTEM.md §6.2)

- Largura: 240px, `position: fixed`, `top: 56px` (abaixo do Header), `height: calc(100vh - 56px)`
- Fundo: `bg-gi-navy`
- Texto: branco
- Item ativo: `text-gi-blue border-l-[3px] border-gi-blue bg-white/10`
- Logo GI Group no topo — arquivo: `src/assets/logo-gi-group.png`
  - URL de origem: `https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img/https://gigroupholdingsolucoes.com.br/wp-content/uploads/2023/06/logo.png`
  - O agente de Implement faz o download do arquivo para `src/assets/logo-gi-group.png`
- Toggle "Apresentação / Exploração" na **base** da sidebar (DESIGN-SYSTEM.md §6.2 — confirmado pelo humano: aparece nos dois locais)
- Em modo `presentation`: sidebar oculta — apenas botões anterior/próximo visíveis

---

## 6. Header / Topbar (DESIGN-SYSTEM.md §6.3)

- Altura: 56px, `position: fixed`, `top: 0`, largura total
- Fundo: `bg-white`, borda inferior: `border-b border-gi-border`
- Esquerda: breadcrumb da seção ativa (label da sidebar)
- Direita: toggle modo apresentação/exploração + botão "Voltar ao início"
- Toggle aparece tanto no Header quanto na sidebar (confirmado pelo humano)

---

## 7. Hook usePresentation (ARCHITECTURE.md §4.2)

```typescript
// src/hooks/usePresentation.ts
export function usePresentation(): PresentationContextValue {
  const [mode, setMode] = useState<'presentation' | 'exploration'>('exploration')
  const [currentStep, setCurrentStep] = useState(0)

  const TOTAL_STEPS = 7

  function next() { setCurrentStep(s => Math.min(s + 1, TOTAL_STEPS - 1)) }
  function prev() { setCurrentStep(s => Math.max(s - 1, 0)) }
  function toggle() {
    setMode(m => m === 'exploration' ? 'presentation' : 'exploration')
    setCurrentStep(0)
  }

  return { mode, currentStep, next, prev, toggle }
}
```

Default: modo `'exploration'`. Em modo `presentation`, `currentStep` determina qual seção está ativa.

---

## 8. App.tsx — estrutura (ARCHITECTURE.md §8)

```typescript
// src/App.tsx
const SECTIONS = [
  { id: 'hero',        label: 'Contexto',         Component: S1Hero },
  { id: 'diagnostico', label: 'Diagnóstico',       Component: S2Diagnostico },
  { id: 'dores',       label: 'Dores',             Component: S3Dores },
  { id: 'arquitetura', label: 'Arquitetura',        Component: S4Arquitetura },
  { id: 'iniciativas', label: 'Iniciativas',        Component: S5Iniciativas },
  { id: 'portal',      label: 'Portal do Worker',  Component: S6Portal },
  { id: 'provocacoes', label: 'Próximos passos',   Component: S7Provocacoes },
]

export const PresentationContext = createContext<PresentationContextValue>(...)

export function App() {
  const presentation = usePresentation()
  const { activeId } = useActiveSection()
  return (
    <PresentationContext.Provider value={presentation}>
      <Header activeLabel={...} />
      <Sidebar sections={SECTIONS} activeId={activeId} />
      <main className="ml-[240px] mt-[56px]">
        {SECTIONS.map(section => (
          <Section key={section.id} id={section.id}>
            <section.Component />
          </Section>
        ))}
      </main>
    </PresentationContext.Provider>
  )
}
```

---

## 9. Dados a popular na Spec 1 (SPECS.md Spec 1)

### src/data/sistemas.ts — 12 sistemas (dados de SPECS.md Spec 3)

| ID | Nome | Status |
|---|---|---|
| S01 | IEM | `usa` / `integra` |
| S02 | Plataforma de Folha (GINFOR) | `substitui` |
| S03 | Spinner/Fusion (RP Global) | `nao-toca` |
| S04 | Portal do Candidato Global | `nao-toca` |
| S05 | Blip/WhatsApp | `substitui` |
| S06 | TomTicket | `substitui` |
| S07 | GLPI | `substitui` |
| S08 | VIP | `substitui` |
| S09 | D4Sign / Assinatura Eletrônica | `integra` |
| S10 | SOC / Medicina do Trabalho | `integra` |
| S11 | Ponto Mais | `integra` |
| S12 | OutSystems | `usa` |

### src/data/dores.ts — 11 dores (dados de SPECS.md Spec 4)

D01–D11 com campos: `id`, `titulo`, `descricao`, `personas`, `jornada`, `severidade`, `iniciativaQueResolve`

### src/data/iniciativas.ts — 17 iniciativas (dados de CONTEXT.md §5 + SPECS.md Spec 6)

I01–I17 com campos completos da interface `Iniciativa`

### src/data/provocacoes.ts — provocações (dados de SPECS.md Spec 8)

5–7 provocações com `destinatario: 'carol' | 'jansen' | 'ambos'`

---

## 10. Componentes UI a criar na Spec 1 (SPECS.md Spec 1 + ARCHITECTURE.md §3)

| Arquivo | Spec | Fonte de spec |
|---|---|---|
| `src/components/ui/Badge.tsx` | Implementar completo | DESIGN-SYSTEM.md §5.1 |
| `src/components/ui/Card.tsx` | Implementar completo | DESIGN-SYSTEM.md §5.2 |
| `src/components/ui/Button.tsx` | Implementar completo | DESIGN-SYSTEM.md §5.3 |
| `src/components/ui/Tag.tsx` | Implementar completo | DESIGN-SYSTEM.md §5.4 |
| `src/components/ui/Tooltip.tsx` | **Stub vazio** (confirmado pelo humano P4) | ARCHITECTURE.md §3 |
| `src/components/ui/ProgressBar.tsx` | **Stub vazio** (confirmado pelo humano P4) | ARCHITECTURE.md §3 |

---

## 11. Lista completa de arquivos a criar

```
package.json
vite.config.ts
tsconfig.json
index.html
tailwind.config.ts
postcss.config.js
src/index.css
src/lib/utils.ts                              ← cn() helper (decisão P3)
src/types/index.ts
src/assets/logo-gi-group.png                  ← download da URL fornecida
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
src/components/ui/Tooltip.tsx                 ← stub
src/components/ui/ProgressBar.tsx             ← stub
src/components/sections/S1Hero/index.tsx      ← placeholder
src/components/sections/S2Diagnostico/index.tsx
src/components/sections/S3Dores/index.tsx
src/components/sections/S4Arquitetura/index.tsx
src/components/sections/S5Iniciativas/index.tsx
src/components/sections/S6Portal/index.tsx
src/components/sections/S7Provocacoes/index.tsx
src/App.tsx
src/main.tsx
```

Total: 34 arquivos novos.

---

## 12. Pendências resolvidas

| Pendência | Resolução |
|---|---|
| P1 — Logo GI Group | URL fornecida pelo humano. Implement faz download para `src/assets/logo-gi-group.png` |
| P2 — Toggle de modo | Aparece nos dois locais: base da sidebar E lado direito do Header |
| P3 — cn() utility | `clsx` + `tailwind-merge` em `src/lib/utils.ts` (sugestão aprovada) |
| P4 — Tooltip e ProgressBar | Criar como stubs na Spec 1 |
| P5 — PresentationContextValue | Adicionar em `src/types/index.ts` |

---

## 13. Riscos residuais

| Risco | Status |
|---|---|
| Logo pode não carregar (rede bloqueada durante Implement) | Mitigação: agente salva localmente no Implement; fallback: texto "GI Group" como SVG |
| tailwind-merge pode ter conflito de versão com Tailwind 3.x | Baixo — tailwind-merge 2.x é compatível com Tailwind 3 |

---

## 14. O que o agente de Plan precisará saber

1. **`src/lib/utils.ts`** é um arquivo novo não listado no ARCHITECTURE.md — deve constar nos Arquivos Permitidos do plan-done.md
2. **Logo:** download de URL externa durante Implement — o plan-done.md deve incluir passo explícito de download
3. **Toggle duplo:** Sidebar e Header devem compartilhar o mesmo handler `toggle()` do `PresentationContext` — não duplicar estado
4. **`useActiveSection`** deve ser consumido no `App.tsx` e o `activeId` passado como prop para `Sidebar` e `Header` (breadcrumb)
5. **Modo presentation:** quando `mode === 'presentation'`, a `Sidebar` deve estar oculta (`hidden`) e o `Header` deve exibir botões anterior/próximo
6. **Stubs** de `Tooltip.tsx`, `ProgressBar.tsx` e seções S1–S7 devem exportar um componente funcional React válido (não arquivo vazio) para não quebrar os imports no `App.tsx`
7. **Dados populados:** os arquivos de `src/data/` devem ter todos os itens completos (12 sistemas, 11 dores, 17 iniciativas, 5–7 provocações) — não criar placeholders
8. **`PROJECT-STATE.md`** será atualizado pelo agente ao final do Implement, mediante autorização explícita do humano (regra atualizada em CLAUDE.md §5.3)
