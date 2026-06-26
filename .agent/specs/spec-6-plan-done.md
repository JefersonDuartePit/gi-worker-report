# spec-6-plan-done.md — S5 Iniciativas

**Spec:** 6 — S5 Iniciativas
**Fase:** Plan concluído
**Data:** 2026-06-26
**Branch:** `spec/06-s5-iniciativas`
**Executado por:** Agente Plan (Claude)

---

## 1. Contexto

A seção S5 Iniciativas apresenta as 17 iniciativas priorizadas no workshop do design sprint. Os dados já existem completos em `src/data/iniciativas.ts` desde a Spec 1 — esta spec implementa apenas a camada de renderização. O stub atual em `S5Iniciativas/index.tsx` exibe apenas o título placeholder. A spec exige filtros combinados (jornada × persona), cards expansíveis com indicadores visuais de impacto/esforço, e um botão "Ver tela" para as 7 iniciativas com telas no portal.

---

## 2. Arquivos Permitidos

| Operação | Arquivo |
|----------|---------|
| Substituir stub | `src/components/sections/S5Iniciativas/index.tsx` |
| Criar | `src/components/sections/S5Iniciativas/IniciativaCard.tsx` |
| Criar | `src/components/sections/S5Iniciativas/IniciativasList.tsx` |
| Modificar (prop extra) | `src/components/ui/ProgressBar.tsx` |

**Proibido tocar:**
- `src/data/iniciativas.ts` — dados completos, não modificar
- `src/types/index.ts` — tipos completos, não modificar
- `src/App.tsx` — não requer alteração
- `src/components/portal/` — branch `spec/07`, proibido
- `src/components/sections/S6Portal/` — branch `spec/07`, proibido
- `src/hooks/usePortalNav.ts` — branch `spec/07`, proibido

---

## 3. Decisões arquiteturais

### 3.1 ProgressBar — cor para esforço
`ProgressBar.tsx` tem `bg-gi-blue` hard-coded. Para a barra de esforço (âmbar), adicionar prop `fillClassName?: string` (default `'bg-gi-blue'`). Todos os usos existentes permanecem inalterados.

### 3.2 Botão "Ver tela"
Navega via `PresentationContext.goTo(5)`. S6Portal está no índice 5 do array `SECTIONS` em `App.tsx` (confirmado). Usuário já está no estado `module` ao ver S5, então `goTo(5)` é suficiente — `App.tsx` não precisa ser alterado.

### 3.3 Filtros
Dois eixos independentes (jornada × persona), lógica AND. Estado local em `IniciativasList`. Ao trocar qualquer filtro, o card expandido fecha. Zero resultados → mensagem de estado vazio.

### 3.4 Card expansível
Accordion (um card expandido por vez). Padrão idêntico ao `DorCard.tsx`: `variant={isExpanded ? 'highlighted' : 'hoverable'}`, `AnimatePresence` com `height: 0 → auto`, 300ms.

---

## 4. Implementação — Passo a Passo

### Passo 1 — `src/components/ui/ProgressBar.tsx`

Adicionar `fillClassName?: string` com default `'bg-gi-blue'`:

```typescript
interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  fillClassName?: string
}

function ProgressBar({ value, max = 100, className, fillClassName = 'bg-gi-blue' }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  return (
    <div className={`h-2 bg-gi-border rounded-full overflow-hidden ${className ?? ''}`}>
      <div className={`h-full ${fillClassName} rounded-full`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export default ProgressBar
```

---

### Passo 2 — `src/components/sections/S5Iniciativas/IniciativaCard.tsx`

**Interface de props:**
```typescript
interface IniciativaCardProps {
  iniciativa: Iniciativa
  isExpanded: boolean
  onToggle: (id: string) => void
  onVerTela: () => void
}
```

**Constantes locais (declaradas acima do componente):**
```typescript
const NIVEL_PCT: Record<'baixo' | 'medio' | 'alto', number> = {
  baixo: 33, medio: 66, alto: 100,
}

const NIVEL_LABEL: Record<'baixo' | 'medio' | 'alto', string> = {
  baixo: 'Baixo', medio: 'Médio', alto: 'Alto',
}

const JORNADA_BADGE = {
  admissao: 'admissao',
  'ciclo-ativo': 'ciclo',
  offboarding: 'offboarding',
} as const

const JORNADA_LABEL: Record<Jornada, string> = {
  admissao: 'Admissão',
  'ciclo-ativo': 'Ciclo Ativo',
  offboarding: 'Offboarding',
}
```

**Estrutura do JSX (sempre visível):**
- Linha 1: `span` com ID numérico (`id.replace('I', '')` → `'01'`–`'17'`) + `Badge` de jornada + ícone `ChevronDown`/`ChevronUp` alinhado à direita
- Linha 2: `h3` com título bold (`text-base font-bold text-gi-dark mt-3 mb-3`)
- Linha 3: `Tag` para cada persona (`flex gap-2 flex-wrap`)
- Linha 4: label "Impacto" + `ProgressBar` (fillClassName padrão `bg-gi-blue`) + label Baixo/Médio/Alto
- Linha 5: label "Esforço" + `ProgressBar` (`fillClassName="bg-gi-amber"`) + label Baixo/Médio/Alto

**Estilo do span ID:** `text-xs font-bold text-gi-charcoal bg-gi-muted rounded px-2 py-0.5`

**Linhas das barras (4 e 5):**
```
<div className="mt-4 space-y-2">
  <div>
    <div className="flex justify-between mb-1">
      <span className="text-[11px] font-bold uppercase tracking-wide text-gi-charcoal">Impacto</span>
      <span className="text-[11px] text-gi-charcoal">{NIVEL_LABEL[iniciativa.impacto]}</span>
    </div>
    <ProgressBar value={NIVEL_PCT[iniciativa.impacto]} />
  </div>
  <div>
    <div className="flex justify-between mb-1">
      <span className="text-[11px] font-bold uppercase tracking-wide text-gi-charcoal">Esforço</span>
      <span className="text-[11px] text-gi-charcoal">{NIVEL_LABEL[iniciativa.esforco]}</span>
    </div>
    <ProgressBar value={NIVEL_PCT[iniciativa.esforco]} fillClassName="bg-gi-amber" />
  </div>
</div>
```

**Conteúdo expandido (dentro de `AnimatePresence`):**
```typescript
<motion.div
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: 'auto', opacity: 1 }}
  exit={{ height: 0, opacity: 0 }}
  transition={{ duration: 0.3 }}
  className="overflow-hidden"
>
  <hr className="border-gi-border my-4" />
  <p className="text-sm text-gi-text mb-4">{iniciativa.descricao}</p>
  {iniciativa.sistemaSubstituido && (
    <div className="bg-gi-muted rounded-lg p-3 mb-4">
      <p className="text-[11px] font-bold uppercase tracking-wide text-gi-charcoal mb-1">
        Sistema substituído
      </p>
      <p className="text-sm text-gi-dark">{iniciativa.sistemaSubstituido}</p>
    </div>
  )}
  {iniciativa.telasRelacionadas && iniciativa.telasRelacionadas.length > 0 && (
    <div className="flex justify-end">
      <Button variant="secondary" onClick={(e) => { e.stopPropagation(); onVerTela() }}>
        Ver tela →
      </Button>
    </div>
  )}
</motion.div>
```

> **Atenção:** o click no botão "Ver tela" usa `e.stopPropagation()` para evitar acionar o `onToggle` do card pai.

**Imports necessários:**
```typescript
import { useContext } from 'react'  // não necessário aqui — goTo vem via prop
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Badge from '../../ui/Badge'
import Button from '../../ui/Button'
import Card from '../../ui/Card'
import ProgressBar from '../../ui/ProgressBar'
import Tag from '../../ui/Tag'
import type { Iniciativa, Jornada } from '../../../types'
```

---

### Passo 3 — `src/components/sections/S5Iniciativas/IniciativasList.tsx`

**Tipos locais:**
```typescript
type FilterJornada = 'todos' | Jornada
type FilterPersona = 'todos' | Persona
```

**Estado e contexto:**
```typescript
const [filterJornada, setFilterJornada] = useState<FilterJornada>('todos')
const [filterPersona, setFilterPersona] = useState<FilterPersona>('todos')
const [expandedId, setExpandedId] = useState<string | null>(null)
const { goTo } = useContext(PresentationContext)
```

**Filtragem:**
```typescript
const filtered = INICIATIVAS.filter(i => {
  const jornadaOk = filterJornada === 'todos' || i.jornada === filterJornada
  const personaOk = filterPersona === 'todos' || i.personas.includes(filterPersona as Persona)
  return jornadaOk && personaOk
})
```

**Handlers:**
```typescript
function handleJornadaChange(v: FilterJornada) {
  setFilterJornada(v)
  setExpandedId(null)
}
function handlePersonaChange(v: FilterPersona) {
  setFilterPersona(v)
  setExpandedId(null)
}
function handleToggle(id: string) {
  setExpandedId(prev => prev === id ? null : id)
}
```

**Dados dos filtros (constantes locais):**
```typescript
const JORNADA_OPTIONS: { value: FilterJornada; label: string }[] = [
  { value: 'todos',        label: 'Todos' },
  { value: 'admissao',     label: 'Admissão' },
  { value: 'ciclo-ativo',  label: 'Ciclo Ativo' },
  { value: 'offboarding',  label: 'Offboarding' },
]

const PERSONA_OPTIONS: { value: FilterPersona; label: string }[] = [
  { value: 'todos',          label: 'Todos' },
  { value: 'worker',         label: 'Worker' },
  { value: 'colaborador-gi', label: 'Colaborador GI' },
  { value: 'cliente',        label: 'Cliente' },
]
```

**Estilo dos chips de filtro:**
```typescript
function chipClass(active: boolean) {
  return active
    ? 'bg-gi-navy text-white rounded-full px-4 py-1.5 text-xs font-bold transition-all'
    : 'border border-gi-border text-gi-charcoal rounded-full px-4 py-1.5 text-xs font-bold hover:border-gi-navy hover:text-gi-navy transition-all'
}
```

**Estrutura do JSX:**
```
<div>
  {/* Contador */}
  <p className="text-sm text-gi-charcoal mb-6">
    17 iniciativas · {filtered.length} visíveis
  </p>

  {/* Filtros jornada */}
  <div className="flex gap-3 flex-wrap mb-3">
    {JORNADA_OPTIONS.map(opt => (
      <button key={opt.value} onClick={() => handleJornadaChange(opt.value)}
        className={chipClass(filterJornada === opt.value)}>
        {opt.label}
      </button>
    ))}
  </div>

  {/* Filtros persona */}
  <div className="flex gap-3 flex-wrap mb-10">
    {PERSONA_OPTIONS.map(opt => (
      <button key={opt.value} onClick={() => handlePersonaChange(opt.value)}
        className={chipClass(filterPersona === opt.value)}>
        {opt.label}
      </button>
    ))}
  </div>

  {/* Grid de cards */}
  {filtered.length > 0 ? (
    <div className="grid grid-cols-3 gap-6">
      {filtered.map(i => (
        <IniciativaCard
          key={i.id}
          iniciativa={i}
          isExpanded={expandedId === i.id}
          onToggle={handleToggle}
          onVerTela={() => goTo(5)}
        />
      ))}
    </div>
  ) : (
    <p className="text-sm text-gi-charcoal text-center py-16">
      Nenhuma iniciativa encontrada para os filtros selecionados.
    </p>
  )}
</div>
```

**Imports necessários:**
```typescript
import { useContext, useState } from 'react'
import { PresentationContext } from '../../../App'
import { INICIATIVAS } from '../../../data/iniciativas'
import type { Jornada, Persona } from '../../../types'
import IniciativaCard from './IniciativaCard'
```

---

### Passo 4 — `src/components/sections/S5Iniciativas/index.tsx`

Substituir stub pelo padrão de seção:

```typescript
import { motion } from 'framer-motion'
import IniciativasList from './IniciativasList'

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

function S5Iniciativas() {
  return (
    <div className="min-h-screen bg-gi-light py-20 px-12">
      <motion.div variants={sectionVariants} initial="hidden" animate="visible">
        <h2 className="text-4xl font-bold text-gi-navy">Iniciativas de Transformação</h2>
        <p className="text-xl text-gi-text mt-3 mb-12">
          17 iniciativas priorizadas no workshop — filtradas por jornada e persona
        </p>
        <IniciativasList />
      </motion.div>
    </div>
  )
}

export default S5Iniciativas
```

---

## 5. Verificação obrigatória (Implement deve confirmar cada item)

- [ ] `npx tsc --noEmit` → zero erros
- [ ] `npm run dev` → servidor sobe sem erro
- [ ] Navegar ao planeta Iniciativas → seção renderiza com 17 cards em grid 3 colunas
- [ ] Filtrar "Admissão" → 6 cards (I01–I06); filtrar "Worker" junto → subconjunto correto
- [ ] Limpar filtros → 17 cards reaparecem
- [ ] "Offboarding" + "Cliente" → mensagem de estado vazio (nenhuma iniciativa tem jornada offboarding E persona cliente simultaneamente)
- [ ] Clicar card → expande mostrando descrição, barras impacto (azul) e esforço (âmbar), sistema substituído
- [ ] Clicar card expandido novamente → colapsa
- [ ] Expandir card A → clicar filtro → card A fecha
- [ ] Cards I01, I05, I07, I10, I13, I14, I17 → botão "Ver tela →" aparece no estado expandido
- [ ] Clicar "Ver tela →" em qualquer desses cards → jump para seção Portal do Worker
- [ ] `npm run build` → sem erros

---

## 6. Componentes reutilizados (não criar novos)

| Uso | Componente | Arquivo |
|-----|-----------|---------|
| Badge de jornada | `Badge` | `src/components/ui/Badge.tsx` |
| Tag de persona | `Tag` | `src/components/ui/Tag.tsx` |
| Card expansível | `Card` | `src/components/ui/Card.tsx` |
| Barras impacto/esforço | `ProgressBar` | `src/components/ui/ProgressBar.tsx` |
| Botão "Ver tela" | `Button` | `src/components/ui/Button.tsx` |
| Animação de entrada | `motion` (Framer Motion) | — |
| Animação de expansão | `AnimatePresence` (Framer Motion) | — |
| Ícones chevron | `ChevronDown`, `ChevronUp` (Lucide) | — |
| Navegação para portal | `PresentationContext.goTo` | `src/App.tsx` |
| Dados | `INICIATIVAS` | `src/data/iniciativas.ts` |
