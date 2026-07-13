# spec-4-plan-done.md — S3 Dores por Persona

**Spec:** 4 — S3 Dores por Persona
**Fase:** Plan concluída
**Data:** 2026-06-25
**Executado por:** Agente Plan (Claude)
**Research base:** `.agent/specs/spec-4-research-done.md`

---

## Arquivos Permitidos na Implementação

| Arquivo | Ação |
|---------|------|
| `src/components/sections/S3Dores/index.tsx` | Modificar (substituir stub) |
| `src/components/sections/S3Dores/DorCard.tsx` | Criar |
| `src/components/sections/S3Dores/DoresList.tsx` | Criar |

**Nenhum outro arquivo deve ser tocado.**
Dados (`dores.ts`, `iniciativas.ts`) e tipos (`index.ts`) já estão completos — somente leitura.

---

## Ordem de Implementação

```
Passo 1 → DorCard.tsx      (componente folha, sem dependências internas)
Passo 2 → DoresList.tsx    (depende de DorCard)
Passo 3 → index.tsx        (depende de DoresList — substitui stub)
```

---

## Passo 1 — Criar `src/components/sections/S3Dores/DorCard.tsx`

### Imports

```typescript
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Badge from '../../ui/Badge'
import Card from '../../ui/Card'
import Tag from '../../ui/Tag'
import { INICIATIVAS } from '../../../data/iniciativas'
import type { Dor, Jornada } from '../../../types'
```

### Interface de props

```typescript
interface DorCardProps {
  dor: Dor
  isExpanded: boolean
  onToggle: (id: string) => void
}
```

### Constantes locais

```typescript
const SEVERIDADE_LABEL: Record<'critica' | 'alta' | 'media', string> = {
  critica: 'Crítica',
  alta: 'Alta',
  media: 'Média',
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

> **Nota técnica:** `JORNADA_BADGE` é declarado `as const` para que os valores literais
> satisfaçam o tipo `BadgeVariant` de `Badge.tsx` sem necessidade de importar o tipo
> (que não está exportado do Badge). Isso evita tocar em Badge.tsx.

### JSX do componente

```tsx
function DorCard({ dor, isExpanded, onToggle }: DorCardProps) {
  const iniciativa = INICIATIVAS.find(i => i.id === dor.iniciativaQueResolve)
  const Icon = isExpanded ? ChevronUp : ChevronDown

  return (
    <Card
      variant={isExpanded ? 'highlighted' : 'hoverable'}
      onClick={() => onToggle(dor.id)}
      className="cursor-pointer"
    >
      {/* Linha superior: badges + ícone de expansão */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-2 flex-wrap">
          <Badge variant={dor.severidade}>{SEVERIDADE_LABEL[dor.severidade]}</Badge>
          <Badge variant={JORNADA_BADGE[dor.jornada]}>{JORNADA_LABEL[dor.jornada]}</Badge>
        </div>
        <Icon className="w-4 h-4 text-gi-charcoal flex-shrink-0" />
      </div>

      {/* Título */}
      <h3 className="text-base font-bold text-gi-dark mb-3">{dor.titulo}</h3>

      {/* Tags de persona */}
      <div className="flex gap-2 flex-wrap">
        {dor.personas.map(p => (
          <Tag key={p} persona={p} />
        ))}
      </div>

      {/* Painel expandido */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <hr className="border-gi-border my-4" />
            <p className="text-sm text-gi-text mb-4">{dor.descricao}</p>
            {iniciativa && (
              <div className="bg-gi-light rounded-lg p-3">
                <p className="text-[11px] font-bold uppercase tracking-wide text-gi-charcoal mb-1">
                  Iniciativa que resolve
                </p>
                <p className="text-sm font-bold text-gi-navy">
                  {iniciativa.id} — {iniciativa.titulo}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

export default DorCard
```

### Mitigação do conflito Framer Motion / Tailwind

O painel expandido usa `height: 0 → 'auto'` diretamente no `motion.div` via prop `animate`
do Framer Motion — nunca via classe Tailwind. Isso evita o conflito documentado na Spec 3
onde `opacity-30` era sobrescrito pelo inline style do Framer Motion.

---

## Passo 2 — Criar `src/components/sections/S3Dores/DoresList.tsx`

### Imports

```typescript
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../../../lib/utils'
import { DORES } from '../../../data/dores'
import type { Persona } from '../../../types'
import DorCard from './DorCard'
```

### Tipos e constantes locais

```typescript
type FilterPersona = 'todos' | Persona

interface FilterOption {
  value: FilterPersona
  label: string
  count: number
}

const FILTER_OPTIONS: FilterOption[] = [
  { value: 'todos', label: 'Todos', count: DORES.length },
  {
    value: 'worker',
    label: 'Worker',
    count: DORES.filter(d => d.personas.includes('worker')).length,
  },
  {
    value: 'colaborador-gi',
    label: 'Colaborador GI',
    count: DORES.filter(d => d.personas.includes('colaborador-gi')).length,
  },
  {
    value: 'cliente',
    label: 'Cliente',
    count: DORES.filter(d => d.personas.includes('cliente')).length,
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}
```

> Contagens fixas em tempo de módulo (não em render) — os dados são estáticos.

### Estado e lógica

```typescript
const [activeFilter, setActiveFilter] = useState<FilterPersona>('todos')
const [expandedId, setExpandedId] = useState<string | null>(null)

const doresFiltradas =
  activeFilter === 'todos'
    ? DORES
    : DORES.filter(d => d.personas.includes(activeFilter))

function handleFilterChange(value: FilterPersona) {
  setActiveFilter(value)
  setExpandedId(null)   // fecha card expandido ao trocar filtro
}

function handleToggle(id: string) {
  setExpandedId(prev => (prev === id ? null : id))
}
```

### JSX

```tsx
function DoresList() {
  // ... estado e lógica acima

  return (
    <div>
      {/* Botões de filtro */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {FILTER_OPTIONS.map(({ value, label, count }) => (
          <button
            key={value}
            onClick={() => handleFilterChange(value)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-bold transition-all border',
              activeFilter === value
                ? 'bg-gi-navy text-white border-gi-navy'
                : 'bg-white text-gi-charcoal border-gi-border hover:border-gi-navy hover:text-gi-navy',
            )}
          >
            {label}{' '}
            <span className="font-normal">({count})</span>
          </button>
        ))}
      </div>

      {/* Lista de cards */}
      <motion.div
        className="grid grid-cols-1 gap-4 max-w-3xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {doresFiltradas.map(dor => (
            <motion.div
              key={dor.id}
              variants={cardVariants}
              layout
              exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
            >
              <DorCard
                dor={dor}
                isExpanded={expandedId === dor.id}
                onToggle={handleToggle}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default DoresList
```

---

## Passo 3 — Substituir `src/components/sections/S3Dores/index.tsx`

```tsx
import { motion } from 'framer-motion'
import DoresList from './DoresList'

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

function S3Dores() {
  return (
    <div className="min-h-screen bg-gi-light py-20 px-12">
      <motion.div variants={sectionVariants} initial="hidden" animate="visible">
        <h2 className="text-4xl font-bold text-gi-navy">Dores por Persona</h2>
        <p className="text-xl text-gi-text mt-3 mb-12">
          11 dores identificadas no design sprint — organizadas por quem sofre
        </p>
        <DoresList />
      </motion.div>
    </div>
  )
}

export default S3Dores
```

---

## Verificação Pós-Implementação

```bash
npx tsc --noEmit    # deve retornar sem erros
npm run dev         # abrir http://localhost:5173/
```

**Checklist de aceite:**

| # | Critério | Como verificar |
|---|---------|---------------|
| 1 | 11 dores visíveis no filtro "Todos" | Contar cards na tela |
| 2 | Filtro "Worker" → 7 cards | Clicar e contar |
| 3 | Filtro "Colaborador GI" → 5 cards | Clicar e contar |
| 4 | Filtro "Cliente" → 1 card (D06) | Clicar e verificar |
| 5 | Card clicável expande painel com descrição + iniciativa | Clicar em qualquer card |
| 6 | Clicar no mesmo card fechado o painel | Clicar duas vezes |
| 7 | Trocar filtro com card expandido fecha o card | Expandir D01, clicar "Worker" |
| 8 | Badge severidade: Crítica=vermelho, Alta=laranja | Inspecionar visualmente |
| 9 | Badge jornada: Admissão=navy, Ciclo Ativo=azul, Offboarding=steel | Inspecionar |
| 10 | Tag Worker=roxo, Colaborador GI=azul, Cliente=teal | Inspecionar |
| 11 | Animação stagger ao entrar na seção | Navegar para S3 |
| 12 | Cards entram/saem com animação ao trocar filtro | Trocar filtro |
| 13 | `npx tsc --noEmit` sem erros | Terminal |
