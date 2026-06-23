# Galaxy Layout — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o layout sidebar/scroll do Portal do Worker por uma experiência de galáxia — mapa de planetas como navegação, mini-mapa orbital na sidebar, splash screen e transições suaves com Framer Motion.

**Architecture:** O app passa a ter 3 estados de UI (`splash | galaxy | module`) controlados em `App.tsx`. O estado ativo e a seção atual derivam de `PresentationContext.currentStep`. Os 7 módulos do relatório são planetas configurados em `src/data/planets.ts`; cada componente de layout consome essa config.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Framer Motion 11, Lucide React

## Global Constraints

- TypeScript em todos os arquivos — nenhum `any`
- CSS inline (`style={{}}`) permitido apenas para valores computados dinamicamente de dados (posição, tamanho, cor dos planetas)
- Cores estáticas sempre via tokens Tailwind (`gi-navy`, `gi-blue`, etc.) — nunca hex hard-coded em `className`
- Todas animações via Framer Motion — duração máxima 500ms
- `AnimatePresence` obrigatório para elementos que entram/saem do DOM
- Dados hard-coded proibidos dentro de componentes — usar `src/data/`
- Sem prop drilling > 2 níveis — usar `PresentationContext`
- Arquivo de seção da sidebar: `Sidebar.tsx` será **deletado**
- Hook `useActiveSection.ts` será **deletado**

---

### Task 1: Tokens de cor e classes de fundo espacial

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/index.css`

**Interfaces:**
- Produces: classes Tailwind `text-gi-stardust`, `text-gi-crater`, `text-gi-nebula`, `text-gi-comet`, `bg-gi-space`; classes CSS `.bg-galaxy-sky`, `.bg-splash-sky`

- [ ] **Step 1: Adicionar tokens de cor em `tailwind.config.ts`**

Substituir o conteúdo completo do arquivo:

```typescript
import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gi: {
          navy:      '#00145A',
          blue:      '#1D57FB',
          text:      '#666666',
          dark:      '#1E1E1E',
          charcoal:  '#4B4C4D',
          white:     '#FFFFFF',
          light:     '#EFEFEF',
          muted:     '#E6E9EA',
          border:    '#DBDBDB',
          red:       '#C10731',
          green:     '#49B100',
          amber:     '#FFC300',
          orange:    '#EB6608',
          steel:     '#4E7EB1',
          // Galaxy palette
          space:     '#000820',
          stardust:  '#8899cc',
          nebula:    '#7799bb',
          comet:     '#aaccff',
          crater:    '#445566',
          orbit:     '#3355aa',
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

- [ ] **Step 2: Adicionar utilitários de fundo espacial em `src/index.css`**

Adicionar ao final do arquivo:

```css
@layer utilities {
  .bg-galaxy-sky {
    background-image:
      radial-gradient(1px 1px at 8% 12%, rgba(255,255,255,0.40), transparent),
      radial-gradient(1.5px 1.5px at 20% 35%, rgba(255,255,255,0.27), transparent),
      radial-gradient(1px 1px at 38% 8%, rgba(255,255,255,0.33), transparent),
      radial-gradient(1px 1px at 52% 62%, rgba(255,255,255,0.20), transparent),
      radial-gradient(2px 2px at 67% 22%, rgba(255,255,255,0.27), transparent),
      radial-gradient(1px 1px at 78% 68%, rgba(255,255,255,0.13), transparent),
      radial-gradient(1.5px 1.5px at 88% 42%, rgba(255,255,255,0.33), transparent),
      radial-gradient(1px 1px at 12% 78%, rgba(255,255,255,0.20), transparent),
      radial-gradient(1px 1px at 58% 88%, rgba(255,255,255,0.27), transparent),
      radial-gradient(1.5px 1.5px at 33% 92%, rgba(255,255,255,0.13), transparent),
      radial-gradient(1px 1px at 82% 12%, rgba(255,255,255,0.27), transparent),
      radial-gradient(1.5px 1.5px at 62% 28%, rgba(255,255,255,0.20), transparent),
      radial-gradient(1px 1px at 25% 55%, rgba(255,255,255,0.27), transparent),
      radial-gradient(1px 1px at 94% 72%, rgba(255,255,255,0.13), transparent),
      radial-gradient(2px 2px at 5% 35%, rgba(255,255,255,0.27), transparent),
      radial-gradient(1px 1px at 71% 5%, rgba(255,255,255,0.33), transparent),
      radial-gradient(1px 1px at 44% 95%, rgba(255,255,255,0.13), transparent),
      radial-gradient(ellipse at 50% 60%, #00145A 0%, #000820 50%, #000000 100%);
  }

  .bg-splash-sky {
    background-image:
      radial-gradient(1px 1px at 10% 15%, rgba(255,255,255,0.33), transparent),
      radial-gradient(1px 1px at 25% 40%, rgba(255,255,255,0.27), transparent),
      radial-gradient(1.5px 1.5px at 40% 10%, rgba(255,255,255,0.40), transparent),
      radial-gradient(1px 1px at 55% 60%, rgba(255,255,255,0.20), transparent),
      radial-gradient(1px 1px at 70% 25%, rgba(255,255,255,0.33), transparent),
      radial-gradient(2px 2px at 80% 70%, rgba(255,255,255,0.13), transparent),
      radial-gradient(1px 1px at 90% 45%, rgba(255,255,255,0.27), transparent),
      radial-gradient(1px 1px at 15% 75%, rgba(255,255,255,0.20), transparent),
      radial-gradient(1.5px 1.5px at 60% 85%, rgba(255,255,255,0.33), transparent),
      radial-gradient(1px 1px at 35% 90%, rgba(255,255,255,0.13), transparent),
      radial-gradient(1px 1px at 85% 15%, rgba(255,255,255,0.27), transparent),
      radial-gradient(1px 1px at 48% 50%, rgba(255,255,255,0.07), transparent),
      radial-gradient(1.5px 1.5px at 92% 88%, rgba(255,255,255,0.20), transparent),
      radial-gradient(1px 1px at 5% 55%, rgba(255,255,255,0.27), transparent),
      radial-gradient(1px 1px at 73% 5%, rgba(255,255,255,0.33), transparent),
      radial-gradient(ellipse at center, #00145A 0%, #000820 60%, #000000 100%);
  }
}
```

- [ ] **Step 3: Verificar build**

```
npm run build
```

Esperado: sem erros TypeScript, build completo.

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.ts src/index.css
git commit -m "feat: add galaxy color tokens and space background utilities"
```

---

### Task 2: Tipos, dados dos planetas e hook

**Files:**
- Modify: `src/types/index.ts`
- Create: `src/data/planets.ts`
- Modify: `src/hooks/usePresentation.ts`

**Interfaces:**
- Produces:
  - `UiState = 'splash' | 'galaxy' | 'module'`
  - `PresentationContextValue.goTo(step: number): void`
  - `PlanetConfig` interface
  - `PLANETS: PlanetConfig[]` — 7 entradas, ids coincidem exatamente com `SECTIONS` em `App.tsx`

- [ ] **Step 1: Adicionar `UiState` e `goTo` em `src/types/index.ts`**

Adicionar logo após os tipos existentes e atualizar `PresentationContextValue`:

```typescript
export type UiState = 'splash' | 'galaxy' | 'module'
```

Substituir a interface `PresentationContextValue` existente:

```typescript
export interface PresentationContextValue {
  mode: 'presentation' | 'exploration'
  currentStep: number
  next: () => void
  prev: () => void
  toggle: () => void
  goTo: (step: number) => void
}
```

- [ ] **Step 2: Criar `src/data/planets.ts`**

```typescript
export interface PlanetConfig {
  id: string
  num: number
  label: string
  size: number
  colorFrom: string
  colorTo: string
  hasRing: boolean
  cx: number
  cy: number
  glowColor: string
}

// cx/cy são as coordenadas do centro do planeta em px
// dentro de um container fixo de 700×480px (GalaxyMap)
export const PLANETS: PlanetConfig[] = [
  {
    id: 'hero',
    num: 1,
    label: 'Contexto',
    size: 44,
    colorFrom: '#6699cc',
    colorTo: '#001144',
    hasRing: false,
    cx: 102,
    cy: 84,
    glowColor: '#2255aa66',
  },
  {
    id: 'diagnostico',
    num: 2,
    label: 'Diagnóstico',
    size: 64,
    colorFrom: '#334488',
    colorTo: '#000830',
    hasRing: true,
    cx: 52,
    cy: 172,
    glowColor: '#00145A88',
  },
  {
    id: 'dores',
    num: 3,
    label: 'Dores',
    size: 38,
    colorFrom: '#884455',
    colorTo: '#220011',
    hasRing: false,
    cx: 329,
    cy: 49,
    glowColor: '#88224466',
  },
  {
    id: 'arquitetura',
    num: 4,
    label: 'Arquitetura',
    size: 72,
    colorFrom: '#4488ff',
    colorTo: '#0a2288',
    hasRing: false,
    cx: 604,
    cy: 86,
    glowColor: '#1D57FB88',
  },
  {
    id: 'iniciativas',
    num: 5,
    label: 'Iniciativas',
    size: 58,
    colorFrom: '#448899',
    colorTo: '#001122',
    hasRing: true,
    cx: 571,
    cy: 371,
    glowColor: '#22556688',
  },
  {
    id: 'portal',
    num: 6,
    label: 'Portal do Worker',
    size: 78,
    colorFrom: '#66aaff',
    colorTo: '#003399',
    hasRing: false,
    cx: 179,
    cy: 401,
    glowColor: '#1D57FBaa',
  },
  {
    id: 'provocacoes',
    num: 7,
    label: 'Próximos Passos',
    size: 34,
    colorFrom: '#556677',
    colorTo: '#111222',
    hasRing: false,
    cx: 663,
    cy: 217,
    glowColor: '#33445566',
  },
]
```

- [ ] **Step 3: Adicionar `goTo` em `src/hooks/usePresentation.ts`**

Substituir o conteúdo completo:

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

  function goTo(step: number) {
    setCurrentStep(Math.min(Math.max(step, 0), TOTAL_STEPS - 1))
  }

  return { mode, currentStep, next, prev, toggle, goTo }
}
```

- [ ] **Step 4: Verificar build**

```
npm run build
```

Esperado: sem erros. O TypeScript vai reclamar que `goTo` está ausente no valor default do Context em `App.tsx` — isso é esperado; será corrigido na Task 8.

- [ ] **Step 5: Commit**

```bash
git add src/types/index.ts src/data/planets.ts src/hooks/usePresentation.ts
git commit -m "feat: add UiState type, planet data config and goTo to usePresentation"
```

---

### Task 3: Componente Planet

**Files:**
- Create: `src/components/ui/Planet.tsx`

**Interfaces:**
- Consumes: `PlanetConfig` de `src/data/planets.ts`
- Produces: `<Planet planet={p} isActive={bool} onClick={fn} />`

- [ ] **Step 1: Criar `src/components/ui/Planet.tsx`**

```typescript
import { motion } from 'framer-motion'
import type { PlanetConfig } from '../../data/planets'

interface PlanetProps {
  planet: PlanetConfig
  isActive: boolean
  onClick: () => void
}

function Planet({ planet, isActive, onClick }: PlanetProps) {
  const { num, label, size, colorFrom, colorTo, hasRing, cx, cy, glowColor } = planet
  const spread = isActive ? size * 0.5 : size * 0.3

  return (
    <motion.button
      style={{
        position: 'absolute',
        left: cx - size / 2,
        top: cy - size / 2,
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle at 35% 30%, ${colorFrom}, ${colorTo})`,
        boxShadow: `0 0 ${spread}px ${glowColor}`,
        border: isActive ? `2px solid ${colorFrom}88` : '2px solid transparent',
        zIndex: 8,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      aria-label={`Módulo ${num} — ${label}`}
    >
      <span
        style={{
          fontSize: Math.max(8, size * 0.18),
          fontWeight: 700,
          color: 'rgba(255,255,255,0.85)',
          pointerEvents: 'none',
        }}
      >
        {String(num).padStart(2, '0')}
      </span>

      {hasRing && (
        <div
          style={{
            position: 'absolute',
            width: size * 1.5,
            height: size * 0.35,
            borderRadius: '50%',
            border: '1.5px solid rgba(255,255,255,0.2)',
            transform: 'rotateX(70deg)',
            pointerEvents: 'none',
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          bottom: -(size * 0.55 + 4),
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 10,
          color: isActive ? '#aaccff' : '#7799bb',
          whiteSpace: 'nowrap',
          fontWeight: isActive ? 700 : 400,
          letterSpacing: 0.5,
          pointerEvents: 'none',
        }}
      >
        {label}
      </div>
    </motion.button>
  )
}

export default Planet
```

- [ ] **Step 2: Verificar build**

```
npm run build
```

Esperado: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/Planet.tsx
git commit -m "feat: add Planet component with hover animation and ring support"
```

---

### Task 4: SplashScreen

**Files:**
- Create: `src/components/layout/SplashScreen.tsx`

**Interfaces:**
- Consumes: nada externo
- Produces: `<SplashScreen onComplete={fn} />` — auto-avança após 2500ms ou no click

- [ ] **Step 1: Criar `src/components/layout/SplashScreen.tsx`**

```typescript
import { useEffect } from 'react'
import { motion } from 'framer-motion'

interface SplashScreenProps {
  onComplete: () => void
}

function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-splash-sky cursor-pointer"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      onClick={onComplete}
    >
      <div className="relative z-10 flex flex-col items-center gap-5 text-center">
        <img
          src="/src/assets/logo-gi-group.png"
          alt="GI Group"
          className="h-10 object-contain"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />

        <div className="w-px h-8 bg-gradient-to-b from-transparent via-gi-steel to-transparent" />

        <h1 className="text-3xl font-bold text-white tracking-wide">Portal do Worker</h1>

        <p className="text-sm text-gi-stardust uppercase tracking-[3px]">
          Diagnóstico &amp; Transformação Digital · 2026
        </p>

        <motion.div
          className="mt-8 w-12 h-12 rounded-full border-2 border-gi-blue/30"
          animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        <p className="text-[11px] text-gi-crater uppercase tracking-widest">
          Clique para iniciar
        </p>
      </div>
    </motion.div>
  )
}

export default SplashScreen
```

- [ ] **Step 2: Verificar build**

```
npm run build
```

Esperado: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/SplashScreen.tsx
git commit -m "feat: add SplashScreen with auto-advance and fade-out animation"
```

---

### Task 5: GalaxyHeader e GalaxyMap

**Files:**
- Create: `src/components/layout/GalaxyHeader.tsx`
- Create: `src/components/layout/GalaxyMap.tsx`

**Interfaces:**
- Consumes:
  - `PresentationContext` (`mode`, `toggle`)
  - `PLANETS: PlanetConfig[]` de `src/data/planets.ts`
  - `<Planet>` de `src/components/ui/Planet.tsx`
- Produces:
  - `<GalaxyHeader />` — sem props
  - `<GalaxyMap onPlanetClick={(id: string) => void} activeSectionId={string} />`

- [ ] **Step 1: Criar `src/components/layout/GalaxyHeader.tsx`**

```typescript
import { useContext } from 'react'
import { PresentationContext } from '../../App'

function GalaxyHeader() {
  const { mode, toggle } = useContext(PresentationContext)

  return (
    <div className="relative z-10 flex items-center justify-between px-8 py-4 border-b border-gi-blue/10 bg-galaxy-header">
      <div className="flex items-center gap-3">
        <img
          src="/src/assets/logo-gi-group.png"
          alt="GI Group"
          className="h-7 object-contain"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
        <span className="text-[11px] text-gi-orbit uppercase tracking-[2px]">
          Portal do Worker
        </span>
      </div>

      <p className="text-[13px] text-gi-stardust">
        <strong className="text-white font-bold">Escolha um módulo</strong> para começar
      </p>

      <button
        onClick={toggle}
        className="text-[11px] text-gi-stardust px-3 py-1.5 rounded-lg uppercase tracking-widest border border-gi-blue/25 hover:border-gi-blue/50 hover:text-gi-comet transition-all"
      >
        {mode === 'exploration' ? 'Apresentação' : 'Exploração'}
      </button>
    </div>
  )
}

export default GalaxyHeader
```

Nota: `bg-galaxy-header` precisa ser adicionado ao `tailwind.config.ts`. Adicionar em `backgroundImage`:

```typescript
backgroundImage: {
  'galaxy-header': 'linear-gradient(to bottom, rgba(0, 8, 32, 0.67), transparent)',
},
```

- [ ] **Step 2: Adicionar `backgroundImage` ao `tailwind.config.ts`**

Adicionar a chave `backgroundImage` dentro de `theme.extend`, após `fontFamily`:

```typescript
      backgroundImage: {
        'galaxy-header': 'linear-gradient(to bottom, rgba(0, 8, 32, 0.67), transparent)',
      },
```

O arquivo final de `tailwind.config.ts` deve ter as seções `colors`, `fontFamily` e `backgroundImage` dentro de `theme.extend`.

- [ ] **Step 3: Criar `src/components/layout/GalaxyMap.tsx`**

```typescript
import { motion } from 'framer-motion'
import { PLANETS } from '../../data/planets'
import Planet from '../ui/Planet'
import GalaxyHeader from './GalaxyHeader'

const CONTAINER_W = 700
const CONTAINER_H = 480
const SUN_CX = 350
const SUN_CY = 240

interface GalaxyMapProps {
  onPlanetClick: (sectionId: string) => void
  activeSectionId: string
}

function GalaxyMap({ onPlanetClick, activeSectionId }: GalaxyMapProps) {
  return (
    <motion.div
      className="flex flex-col min-h-screen relative bg-galaxy-sky"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <GalaxyHeader />

      <div className="relative z-5 flex-1 flex items-center justify-center">
        <div className="relative" style={{ width: CONTAINER_W, height: CONTAINER_H }}>

          {/* Orbit rings decorativas */}
          {[
            { w: 200, h: 100 },
            { w: 340, h: 160 },
            { w: 520, h: 240 },
          ].map(({ w, h }) => (
            <div
              key={`${w}x${h}`}
              className="absolute rounded-full pointer-events-none border border-gi-blue/10"
              style={{
                width: w,
                height: h,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotateX(70deg)',
                borderStyle: 'dashed',
              }}
            />
          ))}

          {/* SVG: linhas tracejadas do sol aos planetas */}
          <svg
            className="absolute inset-0 pointer-events-none"
            style={{ zIndex: 3 }}
            viewBox={`0 0 ${CONTAINER_W} ${CONTAINER_H}`}
            xmlns="http://www.w3.org/2000/svg"
          >
            {PLANETS.map((p) => (
              <line
                key={p.id}
                x1={SUN_CX}
                y1={SUN_CY}
                x2={p.cx}
                y2={p.cy}
                stroke="#1D57FB"
                strokeOpacity={p.id === activeSectionId ? 0.45 : 0.18}
                strokeWidth={p.id === activeSectionId ? 1.5 : 1}
                strokeDasharray="4,6"
              />
            ))}
          </svg>

          {/* Sol */}
          <div
            className="absolute flex items-center justify-center z-10 rounded-full"
            style={{
              width: 56,
              height: 56,
              left: SUN_CX - 28,
              top: SUN_CY - 28,
              background: 'radial-gradient(circle at 35% 35%, #ffd700, #ff8800, #cc4400)',
              boxShadow: '0 0 30px rgba(255,136,0,0.4), 0 0 60px rgba(255,68,0,0.2)',
            }}
          >
            <span className="text-white font-bold text-[9px]">GI</span>
          </div>

          {/* Planetas */}
          {PLANETS.map((planet) => (
            <Planet
              key={planet.id}
              planet={planet}
              isActive={planet.id === activeSectionId}
              onClick={() => onPlanetClick(planet.id)}
            />
          ))}
        </div>
      </div>

      <p className="relative z-10 text-center pb-4 text-[11px] text-gi-crater uppercase tracking-widest">
        ↑ clique em qualquer planeta para pousar
      </p>
    </motion.div>
  )
}

export default GalaxyMap
```

- [ ] **Step 4: Verificar build**

```
npm run build
```

Esperado: sem erros.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/GalaxyHeader.tsx src/components/layout/GalaxyMap.tsx tailwind.config.ts
git commit -m "feat: add GalaxyHeader and GalaxyMap with planet navigation"
```

---

### Task 6: MiniMap

**Files:**
- Create: `src/components/layout/MiniMap.tsx`

**Interfaces:**
- Consumes:
  - `PresentationContext` (`mode`, `toggle`)
  - `PLANETS: PlanetConfig[]` de `src/data/planets.ts`
- Produces: `<MiniMap activeSectionId={string} onPlanetClick={(id: string) => void} />`

- [ ] **Step 1: Criar `src/components/layout/MiniMap.tsx`**

O SVG usa o mesmo sistema de coordenadas do `GalaxyMap` (viewBox `0 0 700 480`), deixando o SVG escalar proporcionalmente para caber na sidebar de 200px.

```typescript
import { useContext } from 'react'
import { PresentationContext } from '../../App'
import { PLANETS } from '../../data/planets'

const SUN_CX = 350
const SUN_CY = 240

interface MiniMapProps {
  activeSectionId: string
  onPlanetClick: (id: string) => void
}

function MiniMap({ activeSectionId, onPlanetClick }: MiniMapProps) {
  const { mode, toggle } = useContext(PresentationContext)

  return (
    <aside className="fixed top-[56px] left-0 w-[200px] h-[calc(100vh-56px)] bg-gi-navy flex flex-col z-40">
      <div className="px-4 py-3 border-b border-white/5">
        <span className="text-[9px] text-gi-orbit uppercase tracking-[2px]">Galáxia</span>
      </div>

      <div className="flex-1 flex items-center justify-center p-3">
        <svg
          viewBox="0 0 700 480"
          className="w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {PLANETS.map((p) => (
              <radialGradient key={p.id} id={`mg-${p.id}`} cx="35%" cy="35%">
                <stop offset="0%" stopColor={p.colorFrom} />
                <stop offset="100%" stopColor={p.colorTo} />
              </radialGradient>
            ))}
            <radialGradient id="mg-sun" cx="35%" cy="35%">
              <stop offset="0%" stopColor="#ffd700" />
              <stop offset="100%" stopColor="#cc4400" />
            </radialGradient>
          </defs>

          {/* Órbitas decorativas */}
          <ellipse cx={SUN_CX} cy={SUN_CY} rx="100" ry="50" fill="none" stroke="#1D57FB" strokeOpacity="0.1" strokeDasharray="3,5" />
          <ellipse cx={SUN_CX} cy={SUN_CY} rx="170" ry="85" fill="none" stroke="#1D57FB" strokeOpacity="0.07" strokeDasharray="3,5" />

          {/* Linhas do sol aos planetas */}
          {PLANETS.map((p) => (
            <line
              key={p.id}
              x1={SUN_CX} y1={SUN_CY}
              x2={p.cx} y2={p.cy}
              stroke="#1D57FB"
              strokeOpacity={p.id === activeSectionId ? 0.5 : 0.2}
              strokeWidth={p.id === activeSectionId ? 2 : 1}
              strokeDasharray="3,5"
            />
          ))}

          {/* Sol */}
          <circle cx={SUN_CX} cy={SUN_CY} r="18" fill="url(#mg-sun)" />
          <text x={SUN_CX} y={SUN_CY + 4} textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">GI</text>

          {/* Planetas */}
          {PLANETS.map((p) => {
            const r = p.size / 2
            const isActive = p.id === activeSectionId
            const labelText = p.label.length > 10 ? `${p.label.substring(0, 9)}…` : p.label

            return (
              <g
                key={p.id}
                onClick={() => onPlanetClick(p.id)}
                style={{ cursor: 'pointer' }}
              >
                {isActive && (
                  <circle
                    cx={p.cx} cy={p.cy}
                    r={r + 7}
                    fill="none"
                    stroke={p.colorFrom}
                    strokeWidth="2"
                    strokeOpacity="0.5"
                  />
                )}

                {p.hasRing && (
                  <ellipse
                    cx={p.cx} cy={p.cy}
                    rx={r * 1.5} ry={r * 0.35}
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="1.5"
                  />
                )}

                <circle
                  cx={p.cx} cy={p.cy}
                  r={r}
                  fill={`url(#mg-${p.id})`}
                  opacity={isActive ? 1 : 0.85}
                />

                <text
                  x={p.cx} y={p.cy + 4}
                  textAnchor="middle"
                  fontSize={Math.max(8, r * 0.5)}
                  fill="white"
                  fontWeight="bold"
                >
                  {String(p.num).padStart(2, '0')}
                </text>

                <text
                  x={p.cx}
                  y={p.cy + r + 18}
                  textAnchor="middle"
                  fontSize="11"
                  fill={isActive ? '#aaccff' : '#7799bb'}
                  fontWeight={isActive ? 'bold' : 'normal'}
                >
                  {labelText}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="px-3 pb-4">
        <button
          onClick={toggle}
          className="w-full py-2 text-[10px] text-gi-stardust uppercase tracking-widest rounded-lg border border-white/10 hover:bg-white/5 transition-all"
        >
          {mode === 'exploration' ? 'Apresentação' : 'Exploração'}
        </button>
      </div>
    </aside>
  )
}

export default MiniMap
```

- [ ] **Step 2: Verificar build**

```
npm run build
```

Esperado: sem erros.

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/MiniMap.tsx
git commit -m "feat: add MiniMap orbital sidebar with SVG planet navigation"
```

---

### Task 7: Header atualizado

**Files:**
- Modify: `src/components/layout/Header.tsx`

**Interfaces:**
- Consumes: `PresentationContext` (`mode`, `toggle`)
- Produces: `<Header activeLabel={string} activeNum={number} onGalaxyClick={() => void} />`

- [ ] **Step 1: Substituir `src/components/layout/Header.tsx`**

```typescript
import { useContext } from 'react'
import { ChevronLeft } from 'lucide-react'
import { PresentationContext } from '../../App'

interface HeaderProps {
  activeLabel: string
  activeNum: number
  onGalaxyClick: () => void
}

function Header({ activeLabel, activeNum, onGalaxyClick }: HeaderProps) {
  const { mode, toggle } = useContext(PresentationContext)
  const numFormatted = String(activeNum).padStart(2, '0')

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
        <span className="text-sm text-gi-charcoal">
          <span className="text-gi-steel">{numFormatted}</span>
          {' · '}
          {activeLabel}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="px-3 py-1.5 text-xs border border-gi-border rounded-lg text-gi-charcoal hover:border-gi-navy hover:text-gi-navy transition-all"
        >
          {mode === 'exploration' ? 'Apresentação' : 'Exploração'}
        </button>
        <button
          onClick={onGalaxyClick}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gi-blue text-white rounded-lg hover:bg-gi-navy transition-all"
        >
          <ChevronLeft size={12} />
          Galáxia
        </button>
      </div>
    </header>
  )
}

export default Header
```

- [ ] **Step 2: Verificar build**

```
npm run build
```

Esperado: sem erros (App.tsx ainda usa a assinatura antiga — o erro vai aparecer lá, não aqui).

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Header.tsx
git commit -m "feat: update Header with module number, remove Home button, add Galáxia button"
```

---

### Task 8: App.tsx — fio condutor e remoção de arquivos legados

**Files:**
- Modify: `src/App.tsx`
- Delete: `src/components/layout/Sidebar.tsx`
- Delete: `src/hooks/useActiveSection.ts`

**Interfaces:**
- Consumes: todos os componentes criados nas tasks anteriores
- Produces: app funcionando nos 3 estados: splash → galaxy → module

- [ ] **Step 1: Substituir `src/App.tsx`**

```typescript
import { createContext, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { usePresentation } from './hooks/usePresentation'
import Header from './components/layout/Header'
import MiniMap from './components/layout/MiniMap'
import SplashScreen from './components/layout/SplashScreen'
import GalaxyMap from './components/layout/GalaxyMap'
import S1Hero from './components/sections/S1Hero'
import S2Diagnostico from './components/sections/S2Diagnostico'
import S3Dores from './components/sections/S3Dores'
import S4Arquitetura from './components/sections/S4Arquitetura'
import S5Iniciativas from './components/sections/S5Iniciativas'
import S6Portal from './components/sections/S6Portal'
import S7Provocacoes from './components/sections/S7Provocacoes'
import type { PresentationContextValue, SectionMeta, UiState } from './types'

export const PresentationContext = createContext<PresentationContextValue>({
  mode: 'exploration',
  currentStep: 0,
  next: () => undefined,
  prev: () => undefined,
  toggle: () => undefined,
  goTo: () => undefined,
})

const SECTIONS: SectionMeta[] = [
  { id: 'hero',        label: 'Contexto',        Component: S1Hero },
  { id: 'diagnostico', label: 'Diagnóstico',     Component: S2Diagnostico },
  { id: 'dores',       label: 'Dores',           Component: S3Dores },
  { id: 'arquitetura', label: 'Arquitetura',     Component: S4Arquitetura },
  { id: 'iniciativas', label: 'Iniciativas',     Component: S5Iniciativas },
  { id: 'portal',      label: 'Portal do Worker',Component: S6Portal },
  { id: 'provocacoes', label: 'Próximos Passos', Component: S7Provocacoes },
]

export function App() {
  const presentation = usePresentation()
  const [uiState, setUiState] = useState<UiState>('splash')

  const activeSection = SECTIONS[presentation.currentStep] ?? SECTIONS[0]
  const activeNum = presentation.currentStep + 1

  function handleSplashComplete() {
    setUiState('galaxy')
  }

  function handlePlanetClick(sectionId: string) {
    const index = SECTIONS.findIndex((s) => s.id === sectionId)
    if (index !== -1) {
      presentation.goTo(index)
      setUiState('module')
    }
  }

  function handleGalaxyClick() {
    setUiState('galaxy')
  }

  return (
    <PresentationContext.Provider value={presentation}>
      <AnimatePresence mode="wait">
        {uiState === 'splash' && (
          <SplashScreen key="splash" onComplete={handleSplashComplete} />
        )}

        {uiState === 'galaxy' && (
          <GalaxyMap
            key="galaxy"
            onPlanetClick={handlePlanetClick}
            activeSectionId={activeSection.id}
          />
        )}

        {uiState === 'module' && (
          <motion.div
            key="module"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Header
              activeLabel={activeSection.label}
              activeNum={activeNum}
              onGalaxyClick={handleGalaxyClick}
            />

            {presentation.mode === 'exploration' && (
              <MiniMap
                activeSectionId={activeSection.id}
                onPlanetClick={handlePlanetClick}
              />
            )}

            <main
              className="mt-[56px] transition-all duration-300"
              style={{ marginLeft: presentation.mode === 'exploration' ? 200 : 0 }}
            >
              <activeSection.Component />
            </main>

            {presentation.mode === 'presentation' && (
              <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
                <button
                  onClick={presentation.prev}
                  disabled={presentation.currentStep === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-gi-navy text-white rounded-lg disabled:opacity-40 hover:bg-gi-blue transition-colors"
                >
                  <ChevronLeft size={16} />
                  Anterior
                </button>
                <span className="text-sm text-gi-charcoal bg-white px-3 py-1 rounded-lg border border-gi-border">
                  {activeNum} / {SECTIONS.length}
                </span>
                <button
                  onClick={presentation.next}
                  disabled={presentation.currentStep === SECTIONS.length - 1}
                  className="flex items-center gap-2 px-4 py-2 bg-gi-navy text-white rounded-lg disabled:opacity-40 hover:bg-gi-blue transition-colors"
                >
                  Próximo
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </PresentationContext.Provider>
  )
}

export default App
```

Nota: `marginLeft: 200` usa inline style com valor numérico calculado em função de estado (`presentation.mode`) — isso é um valor dinâmico, portanto inline style é permitido conforme CODING-GUIDELINES §5.

- [ ] **Step 2: Deletar arquivos legados**

```bash
rm src/components/layout/Sidebar.tsx
rm src/hooks/useActiveSection.ts
rm src/components/layout/Section.tsx
```

`Section.tsx` era usado como wrapper de scroll-navigation e deixa de existir no novo modelo — o `<Component />` de cada módulo é renderizado diretamente.

- [ ] **Step 3: Verificar build sem erros**

```
npm run build
```

Esperado: sem erros TypeScript. Se houver imports de `Sidebar` ou `useActiveSection` em outros arquivos além de `App.tsx`, removê-los também.

- [ ] **Step 4: Testar visualmente no browser**

```
npm run dev
```

Verificar:
1. Abre em `http://localhost:5173` — splash screen aparece com fundo espacial, logo GI, título, anel pulsante
2. Após 2.5s (ou click): dissolve para o mapa da galáxia com 7 planetas e linhas tracejadas
3. Hover em qualquer planeta: escala para 1.1x suavemente
4. Click em um planeta: fade para o estado do módulo com header + mini-mapa orbital + conteúdo
5. Mini-mapa: mostra todos os planetas com labels visíveis; planeta ativo tem glow + anel extra
6. Botão "← Galáxia" no header: volta para o mapa completo com fade
7. Botão "Apresentação": oculta mini-mapa, expande conteúdo, mostra nav Anterior/Próximo no rodapé
8. Nav Anterior/Próximo: navega entre módulos, atualiza mini-mapa ao voltar para Exploração

- [ ] **Step 5: Commit final**

```bash
git add src/App.tsx
git commit -m "feat: wire galaxy layout — splash, galaxy map and module states with AnimatePresence"
```

---

## Arquivos Criados

| Arquivo | Status |
|---------|--------|
| `src/data/planets.ts` | Novo |
| `src/components/ui/Planet.tsx` | Novo |
| `src/components/layout/SplashScreen.tsx` | Novo |
| `src/components/layout/GalaxyHeader.tsx` | Novo |
| `src/components/layout/GalaxyMap.tsx` | Novo |
| `src/components/layout/MiniMap.tsx` | Novo |

## Arquivos Modificados

| Arquivo | O que muda |
|---------|-----------|
| `tailwind.config.ts` | 6 novos tokens de cor + `backgroundImage.galaxy-header` |
| `src/index.css` | Classes `.bg-galaxy-sky` e `.bg-splash-sky` |
| `src/types/index.ts` | `UiState` type + `goTo` em `PresentationContextValue` |
| `src/hooks/usePresentation.ts` | Função `goTo` |
| `src/components/layout/Header.tsx` | Novo prop `activeNum`, prop `onGalaxyClick`, botão "← Galáxia" |
| `src/App.tsx` | Estados `uiState`, `AnimatePresence`, sem `useActiveSection` |

## Arquivos Deletados

| Arquivo | Motivo |
|---------|--------|
| `src/components/layout/Sidebar.tsx` | Substituído por `GalaxyMap` + `MiniMap` |
| `src/hooks/useActiveSection.ts` | Seção ativa agora deriva de `currentStep` via click no planeta |
| `src/components/layout/Section.tsx` | Wrapper de scroll-navigation; módulos renderizados diretamente |
