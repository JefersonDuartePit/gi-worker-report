# spec-3-plan-done.md — S2 Diagnóstico Sistêmico

**Spec:** 3 — S2 Diagnóstico Sistêmico
**Fase:** Plan concluído
**Data:** 2026-06-25
**Aprovado por:** Jeff

---

## Objetivo

Implementar a seção S2 do relatório: mapa interativo dos sistemas atuais da GI Group
organizados em 4 quadrantes (Usa / Integra / Substitui / Não Toca), com tooltips de
detalhamento ao hover e filtro por quadrante.

---

## Arquivos Permitidos

| Arquivo | Ação |
|---------|------|
| `src/types/index.ts` | Modificar — adicionar `problema: string` e `decisaoProposta: string` à interface `Sistema` |
| `src/data/sistemas.ts` | Modificar — enriquecer os 12 sistemas com os 2 novos campos |
| `src/components/sections/S2Diagnostico/index.tsx` | Modificar — implementar seção completa |
| `src/components/sections/S2Diagnostico/SistemaCard.tsx` | Criar — card com tooltip inline |
| `src/components/sections/S2Diagnostico/MapaSistemas.tsx` | Criar — grid de 4 quadrantes com filtro |

**Não tocar:**
- `src/components/ui/Tooltip.tsx` — reservado para Spec 7
- `src/components/portal/` — exclusivo da branch `spec/07-portal-do-worker`
- Qualquer arquivo fora desta lista

---

## Restrições Globais

- Proibido `any` em TypeScript
- Proibido `style={{}}` para valores estáticos — Tailwind apenas
- Proibido hex hard-coded — usar tokens `gi-*` do `tailwind.config.ts`
- Proibido dados dentro de componentes — tudo em `src/data/`
- Animações: máximo 400ms, Framer Motion apenas

---

## Task 1: Estender a camada de dados

Tasks 1A e 1B devem ser feitas em conjunto: adicionar campos obrigatórios à interface
causa erros de TypeScript em `sistemas.ts` até que os dados sejam também atualizados.

**Arquivos:**
- Modificar: `src/types/index.ts`
- Modificar: `src/data/sistemas.ts`

**Produz:** Tipo `Sistema` com `problema: string` e `decisaoProposta: string`; todos os 12 `SISTEMAS` populados.

- [ ] **Passo 1: Adicionar campos à interface `Sistema`**

Em `src/types/index.ts`, substituir a interface `Sistema` existente:

```typescript
export interface Sistema {
  id: string
  nome: string
  funcao: string
  status: StatusSistema
  doresAssociadas: string[]
  restricao?: string
  problema: string
  decisaoProposta: string
}
```

- [ ] **Passo 2: Substituir `src/data/sistemas.ts` com os dados enriquecidos**

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
    problema: 'Integração unidirecional com a plataforma de folha — dados não retornam automaticamente após admissão.',
    decisaoProposta: 'Integrar via iPaaS quando OutSystems assumir o portal de admissão.',
  },
  {
    id: 'S02',
    nome: 'Plataforma de Folha',
    funcao: 'ERP de folha de pagamento e cadastro de colaboradores',
    status: 'substitui',
    doresAssociadas: ['D03'],
    restricao: 'Substituição prevista para 2027 — não amarrar arquitetura',
    problema: 'ERP legado sem API robusta; redigitação manual de dados do IEM; substituição prevista para 2027.',
    decisaoProposta: 'Substituir por plataforma moderna — não amarrar arquitetura neste sistema.',
  },
  {
    id: 'S03',
    nome: 'Spinner / Fusion',
    funcao: 'ATS global para candidatos — controlado pela matriz italiana',
    status: 'nao-toca',
    doresAssociadas: [],
    restricao: 'Intocável sem aprovação do Global',
    problema: 'Controlado pela matriz italiana — qualquer alteração exige aprovação global.',
    decisaoProposta: 'Manter intocável; construir integração intermediária quando aprovado pelo Global.',
  },
  {
    id: 'S04',
    nome: 'Portal do Candidato Global',
    funcao: 'Portal global de candidatura e onboarding de candidatos',
    status: 'nao-toca',
    doresAssociadas: [],
    restricao: 'Intocável sem aprovação do Global',
    problema: 'Controlado pelo Global — Brasil não tem autonomia sobre o processo de candidatura.',
    decisaoProposta: 'Manter intocável; focar no ciclo ativo e offboarding onde há autonomia local.',
  },
  {
    id: 'S05',
    nome: 'Blip / WhatsApp',
    funcao: 'Canal de comunicação com workers via chatbot e WhatsApp',
    status: 'substitui',
    doresAssociadas: ['D04', 'D05'],
    problema: 'Canais pessoais dos analistas bloqueados por volume (>100 msgs/dia); sem histórico consolidado.',
    decisaoProposta: 'Substituir pelo Portal do Worker com central de atendimento unificada (I07).',
  },
  {
    id: 'S06',
    nome: 'TomTicket',
    funcao: 'Helpdesk de solicitações — atendimento de dúvidas e chamados do worker',
    status: 'substitui',
    doresAssociadas: ['D05'],
    problema: 'Usado para tudo — inclusive processos que deveriam ser workflows automatizados.',
    decisaoProposta: 'Substituir pela central de atendimento unificada com SLA único (I07).',
  },
  {
    id: 'S07',
    nome: 'GLPI',
    funcao: 'Helpdesk de TI interno — chamados de suporte técnico',
    status: 'substitui',
    doresAssociadas: [],
    problema: 'Helpdesk de TI separado do TomTicket — mesma fragmentação, canais duplicados.',
    decisaoProposta: 'Consolidar no helpdesk único; GLPI mantido apenas para suporte técnico interno.',
  },
  {
    id: 'S08',
    nome: 'VIP',
    funcao: 'Canal de comunicação alternativo — mensagens e notificações',
    status: 'substitui',
    doresAssociadas: ['D05'],
    problema: 'Mais um canal de comunicação sem integração — aumenta a dispersão da informação.',
    decisaoProposta: 'Substituir pelo Portal do Worker como canal único de comunicação.',
  },
  {
    id: 'S09',
    nome: 'D4Sign / Assinatura Eletrônica',
    funcao: 'Assinatura eletrônica de contratos e documentos rescisórios',
    status: 'integra',
    doresAssociadas: ['D02', 'D10'],
    problema: 'Baixa de documentos feita um a um, manualmente — sem envio em lote.',
    decisaoProposta: 'Integrar para assinatura padronizada em lote (I05 — admissão; I14 — rescisão).',
  },
  {
    id: 'S10',
    nome: 'SOC / Medicina do Trabalho',
    funcao: 'Gestão de ASO admissional, demissional e afastamentos médicos',
    status: 'integra',
    doresAssociadas: [],
    problema: 'Sistema completamente isolado — sem integração com folha ou fluxo de admissão.',
    decisaoProposta: 'Integrar para automação de agendamento e controle de ASO (I16).',
  },
  {
    id: 'S11',
    nome: 'Ponto Mais',
    funcao: 'Controle de ponto dos workers — registro e tratamento de frequência',
    status: 'integra',
    doresAssociadas: ['D08'],
    problema: 'Integração com plataforma de folha incompleta — fechamento de ponto ainda manual.',
    decisaoProposta: 'Integrar para tratamento e fechamento automatizado de frequência (I09).',
  },
  {
    id: 'S12',
    nome: 'OutSystems',
    funcao: 'Plataforma low-code — portal de admissão em construção',
    status: 'usa',
    doresAssociadas: [],
    problema: 'Plataforma em construção — portal de admissão em implantação, ainda sem entrar em produção.',
    decisaoProposta: 'Usar como pilar do portal de admissão digital; não retrabalhar — referência de contexto.',
  },
]
```

- [ ] **Passo 3: Verificar TypeScript**

```bash
npx tsc --noEmit
```

Esperado: sem erros.

- [ ] **Passo 4: Commit**

```bash
git add src/types/index.ts src/data/sistemas.ts
git commit -m "feat(s2): extend Sistema type with problema and decisaoProposta fields"
```

---

## Task 2: Criar `SistemaCard.tsx`

**Arquivo:** Criar `src/components/sections/S2Diagnostico/SistemaCard.tsx`

**Consome:** `Sistema` (Task 1), `Card` (`ui/Card.tsx` variante `hoverable`), `Badge` (`ui/Badge.tsx` variante `bloqueado`), `cn` (`lib/utils.ts`)

**Produz:** Componente `SistemaCard` — `interface SistemaCardProps { sistema: Sistema }`

Especificações:
- Card usa `Card` com `variant="hoverable"` e `className="p-4"` (override do padding padrão)
- Tooltip posicionado acima do card com `bottom-full mb-2`; escondido por padrão, visível no hover do grupo
- Tooltip: `bg-gi-dark text-white rounded-lg p-3 text-xs shadow-lg`
- Seta do tooltip: triângulo CSS com `border-t-gi-dark` apontando para baixo
- Badge "Intocável" (`variant="bloqueado"`) apenas quando `sistema.status === 'nao-toca'`
- `pointer-events-none` no tooltip para evitar flickering
- `z-50` no tooltip (Framer Motion transforms criam novos stacking contexts)

- [ ] **Passo 1: Criar o arquivo**

```typescript
import { cn } from '../../../lib/utils'
import Badge from '../../ui/Badge'
import Card from '../../ui/Card'
import type { Sistema } from '../../../types'

interface SistemaCardProps {
  sistema: Sistema
}

function SistemaCard({ sistema }: SistemaCardProps) {
  return (
    <div className="relative group">
      <div
        className={cn(
          'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 z-50',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none',
        )}
      >
        <div className="bg-gi-dark text-white rounded-lg p-3 text-xs shadow-lg">
          <p className="mb-1.5">
            <span className="font-bold">Função: </span>
            {sistema.funcao}
          </p>
          <p className="mb-1.5">
            <span className="font-bold">Problema: </span>
            {sistema.problema}
          </p>
          <p>
            <span className="font-bold">Decisão: </span>
            {sistema.decisaoProposta}
          </p>
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-4 border-transparent border-t-gi-dark" />
      </div>

      <Card variant="hoverable" className="p-4">
        {sistema.status === 'nao-toca' && (
          <Badge variant="bloqueado" className="mb-2">Intocável</Badge>
        )}
        <h4 className="text-sm font-bold text-gi-dark leading-tight">{sistema.nome}</h4>
        <p className="text-xs text-gi-text mt-1 line-clamp-2">{sistema.funcao}</p>
      </Card>
    </div>
  )
}

export default SistemaCard
```

- [ ] **Passo 2: Verificar TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Passo 3: Commit**

```bash
git add src/components/sections/S2Diagnostico/SistemaCard.tsx
git commit -m "feat(s2): create SistemaCard with inline hover tooltip"
```

---

## Task 3: Criar `MapaSistemas.tsx`

**Arquivo:** Criar `src/components/sections/S2Diagnostico/MapaSistemas.tsx`

**Consome:** `SISTEMAS` (Task 1), `StatusSistema` (tipos), `SistemaCard` (Task 2), `cn`

**Produz:** Componente `MapaSistemas` — sem props

Especificações:
- Barra de filtros: botão "Todos" + um botão por quadrante
  - Ativo: `bg-gi-navy text-white border-gi-navy`
  - Inativo "Todos": `bg-white text-gi-charcoal border-gi-border hover:border-gi-navy hover:text-gi-navy`
  - Inativo quadrante: mostra cor do quadrante como texto + `border-gi-border hover:border-gi-navy hover:text-gi-navy`
- Grid de 4 colunas; colunas não-selecionadas ficam com `opacity-30` quando filtro ativo
- Stagger de entrada: `containerVariants` staggers quadrantes em 0.1s; `cardContainerVariants` staggers cards em 0.05s
- Tipo local `Quadrante` declarado acima do componente

Distribuição dos sistemas:
- Usa (gi-blue, bg-blue-50): S01, S12 → 2 sistemas
- Integra (gi-steel, bg-slate-50): S09, S10, S11 → 3 sistemas
- Substitui (gi-amber, bg-amber-50): S02, S05, S06, S07, S08 → 5 sistemas
- Não Toca (gi-red, bg-red-50): S03, S04 → 2 sistemas

- [ ] **Passo 1: Criar o arquivo**

```typescript
import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../../lib/utils'
import { SISTEMAS } from '../../../data/sistemas'
import type { StatusSistema } from '../../../types'
import SistemaCard from './SistemaCard'

type FilterStatus = StatusSistema | 'todos'

interface Quadrante {
  status: StatusSistema
  label: string
  headerClass: string
  borderClass: string
  bgClass: string
}

const QUADRANTES: Quadrante[] = [
  {
    status: 'usa',
    label: 'Usa',
    headerClass: 'text-gi-blue',
    borderClass: 'border-gi-blue',
    bgClass: 'bg-blue-50',
  },
  {
    status: 'integra',
    label: 'Integra',
    headerClass: 'text-gi-steel',
    borderClass: 'border-gi-steel',
    bgClass: 'bg-slate-50',
  },
  {
    status: 'substitui',
    label: 'Substitui',
    headerClass: 'text-gi-amber',
    borderClass: 'border-gi-amber',
    bgClass: 'bg-amber-50',
  },
  {
    status: 'nao-toca',
    label: 'Não Toca',
    headerClass: 'text-gi-red',
    borderClass: 'border-gi-red',
    bgClass: 'bg-red-50',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const quadranteVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const cardContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

function MapaSistemas() {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('todos')

  return (
    <div>
      <div className="flex gap-3 mb-8 flex-wrap">
        <button
          onClick={() => setActiveFilter('todos')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-bold transition-all border',
            activeFilter === 'todos'
              ? 'bg-gi-navy text-white border-gi-navy'
              : 'bg-white text-gi-charcoal border-gi-border hover:border-gi-navy hover:text-gi-navy',
          )}
        >
          Todos
        </button>
        {QUADRANTES.map(({ status, label, headerClass }) => (
          <button
            key={status}
            onClick={() => setActiveFilter(status)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-bold transition-all border',
              activeFilter === status
                ? 'bg-gi-navy text-white border-gi-navy'
                : cn('bg-white border-gi-border hover:border-gi-navy hover:text-gi-navy', headerClass),
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <motion.div
        className="grid grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {QUADRANTES.map(({ status, label, headerClass, borderClass, bgClass }) => {
          const sistemas = SISTEMAS.filter((s) => s.status === status)
          const isDimmed = activeFilter !== 'todos' && activeFilter !== status

          return (
            <motion.div
              key={status}
              variants={quadranteVariants}
              className={cn(
                'rounded-xl border-2 p-4 transition-opacity duration-300',
                bgClass,
                borderClass,
                isDimmed && 'opacity-30',
              )}
            >
              <h3 className={cn('text-xs font-bold uppercase tracking-widest mb-4', headerClass)}>
                {label}{' '}
                <span className="font-normal normal-case tracking-normal text-gi-charcoal">
                  ({sistemas.length})
                </span>
              </h3>
              <motion.div
                className="flex flex-col gap-3"
                variants={cardContainerVariants}
                initial="hidden"
                animate="visible"
              >
                {sistemas.map((sistema) => (
                  <motion.div key={sistema.id} variants={cardVariants}>
                    <SistemaCard sistema={sistema} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}

export default MapaSistemas
```

- [ ] **Passo 2: Verificar TypeScript**

```bash
npx tsc --noEmit
```

- [ ] **Passo 3: Commit**

```bash
git add src/components/sections/S2Diagnostico/MapaSistemas.tsx
git commit -m "feat(s2): create MapaSistemas with 4-quadrant grid and filter"
```

---

## Task 4: Implementar `S2Diagnostico/index.tsx`

**Arquivo:** Modificar `src/components/sections/S2Diagnostico/index.tsx`

**Consome:** `MapaSistemas` (Task 3), `motion` de `framer-motion`

**Produz:** Componente `S2Diagnostico` — export default, sem props

Especificações:
- Background: `bg-white` (DESIGN-SYSTEM.md §7)
- Altura mínima: `min-h-screen`
- Padding: `py-20 px-12`
- Título: `text-4xl font-bold text-gi-navy` — "Diagnóstico Sistêmico"
- Subtítulo: `text-xl text-gi-text mt-3 mb-12` — "Mapeamento dos sistemas atuais da GI Group"
- Animação de entrada: `fadeInUp` 400ms

- [ ] **Passo 1: Substituir o stub**

Substituir o conteúdo completo de `src/components/sections/S2Diagnostico/index.tsx`:

```typescript
import { motion } from 'framer-motion'
import MapaSistemas from './MapaSistemas'

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

function S2Diagnostico() {
  return (
    <div className="min-h-screen bg-white py-20 px-12">
      <motion.div variants={sectionVariants} initial="hidden" animate="visible">
        <h2 className="text-4xl font-bold text-gi-navy">Diagnóstico Sistêmico</h2>
        <p className="text-xl text-gi-text mt-3 mb-12">
          Mapeamento dos sistemas atuais da GI Group
        </p>
        <MapaSistemas />
      </motion.div>
    </div>
  )
}

export default S2Diagnostico
```

- [ ] **Passo 2: Verificar TypeScript**

```bash
npx tsc --noEmit
```

Esperado: sem erros.

- [ ] **Passo 3: Verificar no browser**

```bash
npm run dev
```

Abrir http://localhost:5173, clicar no Planeta 02 (Diagnóstico) no mapa da galáxia e verificar:

- [ ] Fundo branco, altura mínima de tela
- [ ] Título "Diagnóstico Sistêmico" em navy, subtítulo em gi-text
- [ ] 4 quadrantes com cores corretas: Usa=azul, Integra=steel, Substitui=âmbar, Não Toca=vermelho
- [ ] Contagem de sistemas por quadrante: Usa=2, Integra=3, Substitui=5, Não Toca=2 (total=12)
- [ ] Badge "Intocável" em S03 (Spinner/Fusion) e S04 (Portal do Candidato Global)
- [ ] Hover em qualquer card exibe tooltip com Função + Problema + Decisão
- [ ] Filtros funcionais: clicar em "Usa" deixa Integra, Substitui, Não Toca em 30% de opacidade
- [ ] Animação de entrada: quadrantes surgem em stagger ao carregar a seção

- [ ] **Passo 4: Commit**

```bash
git add src/components/sections/S2Diagnostico/index.tsx
git commit -m "feat(s2): implement S2 Diagnóstico Sistêmico section"
```

---

## Critérios de Aceite

| # | Critério | Verificação |
|---|----------|-------------|
| 1 | 4 quadrantes com cores corretas | Visual — dev server |
| 2 | 12 sistemas distribuídos (Usa=2, Integra=3, Substitui=5, Não Toca=2) | Visual — contar cards |
| 3 | Tooltip ao hover: Função + Problema + Decisão | Hover em qualquer card |
| 4 | Filtro por quadrante (não-selecionados → 30% opacidade) | Clicar cada filtro |
| 5 | Animação stagger de entrada (quadrantes e cards) | Entrar na seção |
| 6 | Badge "Intocável" em S03 e S04 | Visual check |
| 7 | `npx tsc --noEmit` sem erros | Terminal |
| 8 | `bg-white min-h-screen` layout | Visual — fundo branco, tela cheia |
