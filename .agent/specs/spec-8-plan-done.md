# spec-8-plan-done.md — S7 Provocações e Próximos Passos

**Spec:** 8 — S7 Provocações e Próximos Passos  
**Fase:** Plan  
**Data:** 2026-06-29  
**Branch:** `spec/08-s7-provocacoes-proximos-passos`

---

## 1. Objetivo

Substituir o stub de `S7Provocacoes` por uma seção completa com 4 blocos sobre fundo `gi-navy`:

| # | Bloco | Componente/Responsável |
|---|-------|------------------------|
| 1 | Provocações técnicas | `ProvocacaoCard.tsx` × 6 |
| 2 | Plano faseado recomendado | `PlanoFaseado.tsx` |
| 3 | Próximos passos imediatos | inline em `index.tsx` |
| 4 | CTA final Perform IT + GI Group | inline em `index.tsx` |

---

## 2. Arquivos Permitidos

| Arquivo | Ação |
|---------|------|
| `src/types/index.ts` | Modificar — adicionar `FasePlano` ao final |
| `src/data/provocacoes.ts` | Modificar — adicionar import de `FasePlano`, `FASES` e `PROXIMOS_PASSOS` |
| `src/components/sections/S7Provocacoes/ProvocacaoCard.tsx` | Criar |
| `src/components/sections/S7Provocacoes/PlanoFaseado.tsx` | Criar |
| `src/components/sections/S7Provocacoes/index.tsx` | Substituir stub completamente |

**Nenhum outro arquivo deve ser tocado.**

---

## 3. Decisões de Design Confirmadas

### 3.1 Paleta — sobre `bg-gi-navy`

| Uso | Classe Tailwind |
|-----|----------------|
| Títulos principais | `text-white` |
| Subtítulos / labels | `text-gi-stardust` |
| Texto corrido | `text-gi-comet` |
| Caption / hint | `text-gi-crater` |
| Bordas de card | `border-gi-orbit` |
| Destaque (IDs, badges) | `text-gi-blue` / `bg-gi-blue` |

### 3.2 Badge de destinatário (implementado como `<span>` local — não usa `ui/Badge.tsx`)

| Valor | Label | Estilo |
|-------|-------|--------|
| `carol` | `Para: Carol · TI` | `bg-gi-blue/20 text-gi-comet border border-gi-blue/30` |
| `jansen` | `Para: Jansen · CEO` | `bg-gi-amber/20 text-gi-amber border border-gi-amber/30` |
| `ambos` | `Para: Carol + Jansen` | `bg-gi-green/20 text-gi-green border border-gi-green/30` |

### 3.3 Títulos das fases do plano faseado (confirmados)

| Fase | Período | Título |
|------|---------|--------|
| 1 | H2 2026 | Centralização imediata |
| 2 | H1 2027 | Integração e automação |
| 3 | H2 2027 | Maturidade e escala |

### 3.4 Logos no CTA final

`logo-gi-group.png` e `logo-perform-it.svg` — ambas disponíveis em `src/assets/`. Usar a mesma estrutura de importação de `S1Hero/index.tsx`.

### 3.5 Botão "Voltar ao início"

Usa `useContext(PresentationContext)` para chamar `goTo(0)` — mesma pattern de `S1Hero` e `IniciativasList`. `PresentationContext` importado de `'../../../App'`.

---

## 4. Implementação — Passo a Passo

### Task 1 — Tipo `FasePlano` e dados estáticos

**Arquivos:**
- Modify: `src/types/index.ts`
- Modify: `src/data/provocacoes.ts`

**Step 1 — Adicionar `FasePlano` ao final de `src/types/index.ts`** (após `ComparativoArq`):

```typescript
export interface FasePlano {
  numero: 1 | 2 | 3
  titulo: string
  periodo: string
  iniciativaIds: string[]
}
```

**Step 2 — Atualizar `src/data/provocacoes.ts`:**

Linha 1 atual:
```typescript
import type { Provocacao } from '../types'
```
→ substituir por:
```typescript
import type { FasePlano, Provocacao } from '../types'
```

Adicionar ao **final** do arquivo (após o array `PROVOCACOES`):

```typescript
export const FASES: FasePlano[] = [
  {
    numero: 1,
    titulo: 'Centralização imediata',
    periodo: 'H2 2026',
    iniciativaIds: ['I01', 'I02', 'I07', 'I10', 'I13', 'I17'],
  },
  {
    numero: 2,
    titulo: 'Integração e automação',
    periodo: 'H1 2027',
    iniciativaIds: ['I03', 'I05', 'I06', 'I08', 'I12', 'I14'],
  },
  {
    numero: 3,
    titulo: 'Maturidade e escala',
    periodo: 'H2 2027',
    iniciativaIds: ['I04', 'I09', 'I11', 'I15', 'I16'],
  },
]

export const PROXIMOS_PASSOS: string[] = [
  'Agenda técnica com squad de TI da Carol para mapeamento de APIs disponíveis',
  'Acesso à pasta gravada do processo de admissão (prometida pela Carol)',
  'Alinhamento de holding com BUs sobre controle centralizado do worker',
  'Definição do escopo do portal do worker dentro do IT Master Plan H2 2026',
]
```

**Step 3 — Verificar:** `npx tsc --noEmit` → sem erros.

**Step 4 — Commit:**
```bash
git add src/types/index.ts src/data/provocacoes.ts
git commit -m "feat(s7): add FasePlano type and phase/next-steps data"
```

---

### Task 2 — `ProvocacaoCard.tsx`

**Arquivo:** criar `src/components/sections/S7Provocacoes/ProvocacaoCard.tsx`

```typescript
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../../lib/utils'
import type { Provocacao } from '../../../types'

interface DestinatarioStyle {
  label: string
  className: string
}

const DESTINATARIO_STYLES: Record<Provocacao['destinatario'], DestinatarioStyle> = {
  carol:  { label: 'Para: Carol · TI',     className: 'bg-gi-blue/20 text-gi-comet border border-gi-blue/30' },
  jansen: { label: 'Para: Jansen · CEO',   className: 'bg-gi-amber/20 text-gi-amber border border-gi-amber/30' },
  ambos:  { label: 'Para: Carol + Jansen', className: 'bg-gi-green/20 text-gi-green border border-gi-green/30' },
}

interface ProvocacaoCardProps {
  provocacao: Provocacao
}

function ProvocacaoCard({ provocacao }: ProvocacaoCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { label, className } = DESTINATARIO_STYLES[provocacao.destinatario]

  return (
    <div className="border border-gi-orbit rounded-xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <span
            className={cn(
              'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide mb-3',
              className,
            )}
          >
            {label}
          </span>
          <p className="text-white text-base font-bold leading-snug">{provocacao.pergunta}</p>
        </div>
        <button
          onClick={() => setIsOpen((o) => !o)}
          className="flex-shrink-0 p-1 text-gi-stardust hover:text-white transition-colors"
          aria-label={isOpen ? 'Fechar contexto' : 'Ver contexto'}
        >
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={18} />
          </motion.div>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="mt-4 pt-4 text-sm text-gi-comet leading-relaxed border-t border-gi-orbit/50">
              {provocacao.contexto}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProvocacaoCard
```

**Verificar:** `npx tsc --noEmit` → sem erros.

**Commit:**
```bash
git add src/components/sections/S7Provocacoes/ProvocacaoCard.tsx
git commit -m "feat(s7): add ProvocacaoCard with accordion context"
```

---

### Task 3 — `PlanoFaseado.tsx`

**Arquivo:** criar `src/components/sections/S7Provocacoes/PlanoFaseado.tsx`

```typescript
import { FASES } from '../../../data/provocacoes'
import { INICIATIVAS } from '../../../data/iniciativas'
import type { FasePlano, Iniciativa } from '../../../types'

interface FaseCardProps {
  fase: FasePlano
}

function FaseCard({ fase }: FaseCardProps) {
  const iniciativas = fase.iniciativaIds
    .map((id) => INICIATIVAS.find((i) => i.id === id))
    .filter((i): i is Iniciativa => i !== undefined)

  return (
    <div className="flex-1 border border-gi-orbit rounded-xl p-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-bold text-gi-stardust uppercase tracking-wide">
          Fase {fase.numero}
        </span>
        <span className="text-gi-crater text-xs">·</span>
        <span className="text-xs font-bold text-gi-blue uppercase tracking-wide">{fase.periodo}</span>
      </div>
      <h4 className="text-white font-bold text-lg mb-4">{fase.titulo}</h4>
      <ul className="space-y-3">
        {iniciativas.map((i) => (
          <li key={i.id} className="flex items-start gap-2">
            <span className="text-gi-blue text-xs font-bold mt-0.5 flex-shrink-0">{i.id}</span>
            <span className="text-gi-comet text-sm leading-snug">{i.titulo}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function PlanoFaseado() {
  return (
    <div>
      <h3 className="text-2xl font-bold text-white mb-2">Plano faseado recomendado</h3>
      <p className="text-gi-stardust mb-8">17 iniciativas distribuídas em 3 horizontes de entrega</p>
      <div className="flex gap-6">
        {FASES.map((fase) => (
          <FaseCard key={fase.numero} fase={fase} />
        ))}
      </div>
    </div>
  )
}

export default PlanoFaseado
```

**Verificar:** `npx tsc --noEmit` → sem erros.

**Commit:**
```bash
git add src/components/sections/S7Provocacoes/PlanoFaseado.tsx
git commit -m "feat(s7): add PlanoFaseado with 3-column phase roadmap"
```

---

### Task 4 — Substituir stub `S7Provocacoes/index.tsx`

**Arquivo:** substituir completamente `src/components/sections/S7Provocacoes/index.tsx`

```typescript
import { useContext } from 'react'
import { motion } from 'framer-motion'
import { Square, ArrowLeft } from 'lucide-react'
import { PresentationContext } from '../../../App'
import { PROVOCACOES, PROXIMOS_PASSOS } from '../../../data/provocacoes'
import Button from '../../ui/Button'
import logoGI from '../../../assets/logo-gi-group.png'
import logoPerformIT from '../../../assets/logo-perform-it.svg'
import ProvocacaoCard from './ProvocacaoCard'
import PlanoFaseado from './PlanoFaseado'

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

function S7Provocacoes() {
  const { goTo } = useContext(PresentationContext)

  return (
    <div className="min-h-screen bg-gi-navy py-20 px-12">
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto"
      >
        {/* Bloco 1 — Provocações técnicas */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-white mb-2">Provocações técnicas</h2>
          <p className="text-xl text-gi-stardust mb-12">
            6 perguntas que precisam de resposta antes de começar
          </p>
          <div className="grid grid-cols-2 gap-6">
            {PROVOCACOES.map((p) => (
              <ProvocacaoCard key={p.id} provocacao={p} />
            ))}
          </div>
        </div>

        {/* Bloco 2 — Plano faseado */}
        <div className="mb-20">
          <PlanoFaseado />
        </div>

        {/* Bloco 3 — Próximos passos */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-white mb-2">Próximos passos imediatos</h3>
          <p className="text-gi-stardust mb-8">4 ações para iniciar ainda neste mês</p>
          <ul className="space-y-4">
            {PROXIMOS_PASSOS.map((passo, idx) => (
              <li key={idx} className="flex items-start gap-4">
                <Square size={20} className="text-gi-blue flex-shrink-0 mt-0.5" />
                <span className="text-white text-base">{passo}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bloco 4 — CTA final */}
        <div className="text-center border-t border-gi-orbit pt-16">
          <div className="flex items-center justify-center gap-6 mb-8">
            <img src={logoGI} alt="GI Group" className="h-8 object-contain" />
            <div className="w-px h-6 bg-white/30" />
            <img src={logoPerformIT} alt="Perform IT" className="h-6 object-contain" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-4">Obrigado pela parceria</h3>
          <p className="text-gi-comet text-lg mb-10 max-w-xl mx-auto">
            Próximo passo: agendar workshop técnico com o squad de TI para validar as integrações
            e definir o MVP do portal do worker.
          </p>
          <Button
            variant="ghost"
            className="text-white hover:text-gi-comet hover:no-underline border border-gi-orbit hover:border-gi-blue"
            onClick={() => goTo(0)}
          >
            <ArrowLeft size={16} />
            Voltar ao início
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default S7Provocacoes
```

**Verificar:** `npx tsc --noEmit && npm run build` → sem erros.

**Commit:**
```bash
git add src/components/sections/S7Provocacoes/index.tsx
git commit -m "feat(s7): implement S7 Provocações e Próximos Passos — 4 blocks"
```

---

## 5. Verificação Final (Implement)

Após concluir os 4 tasks, executar no browser (`npm run dev`):

- [ ] Navegar ao planeta 07 — seção carrega com fundo `gi-navy` e animação `fadeInUp` (400ms)
- [ ] **Bloco 1:** 6 cards em grid 2 colunas; accordion expande/recolhe com Framer Motion (200ms); badges de cor correta por destinatário
- [ ] **Bloco 2:** 3 colunas com fase, período, título e lista de iniciativas; total = 17 (6+6+5)
- [ ] **Bloco 3:** 4 itens com ícone `Square` azul
- [ ] **Bloco 4:** logos GI + Perform IT visíveis; botão "Voltar ao início" navega para S1Hero
- [ ] `npx tsc --noEmit` → 0 erros
- [ ] `npm run build` → dist/ gerado sem erros

---

## 6. Proposta de atualização para `PROJECT-STATE.md` (aguarda autorização do humano)

```markdown
### Atualização — Spec 8 — S7 Provocações e Próximos Passos — 2026-06-29

**Status:** concluída ✅

**Artefatos gerados:**
- `src/types/index.ts` (modificado — `FasePlano` adicionada ao final)
- `src/data/provocacoes.ts` (modificado — `FASES` e `PROXIMOS_PASSOS` adicionados)
- `src/components/sections/S7Provocacoes/ProvocacaoCard.tsx` (criado)
- `src/components/sections/S7Provocacoes/PlanoFaseado.tsx` (criado)
- `src/components/sections/S7Provocacoes/index.tsx` (stub substituído)
- `.agent/specs/spec-8-implement-done.md`

**Desvios do plano:**
- [a preencher durante Implement]

**Próxima spec:** — (S7 é a última seção de conteúdo do relatório)
```
