# spec-5-plan-done.md — S4 Arquitetura As-is / To-be

**Spec:** 5 — S4 Arquitetura As-is / To-be
**Fase:** Plan concluído
**Data:** 2026-06-26
**Branch:** `spec/05-s4-arquitetura-as-is-to-be`

---

## Arquivos Permitidos (únicos que o Implement pode tocar)

| Arquivo | Ação |
|---------|------|
| `src/types/index.ts` | Modificar — APENAS ADICIONAR ao final |
| `src/data/arquitetura.ts` | Criar |
| `src/components/sections/S4Arquitetura/DiagramaArquitetura.tsx` | Criar |
| `src/components/sections/S4Arquitetura/TabelaComparativa.tsx` | Criar |
| `src/components/sections/S4Arquitetura/index.tsx` | Modificar (substituir stub) |
| `.agent/specs/spec-5-implement-done.md` | Criar ao finalizar |

**Proibido tocar:** `src/data/sistemas.ts`, `src/data/dores.ts`, `src/data/iniciativas.ts`, qualquer arquivo de S1/S2/S3/S5/S6/S7, e os arquivos exclusivos da branch `spec/07-portal-do-worker` (`src/components/portal/`, `src/components/sections/S6Portal/`, `src/hooks/usePortalNav.ts`).

---

## Restrições Inegociáveis

- `any` proibido — usar tipos explícitos
- `style={{}}` apenas para valores dinâmicos impossíveis em Tailwind (posição % dos nós)
- Cores apenas via tokens GI em Tailwind — nunca hex hard-coded em `className`
- Para atributos SVG (`stroke`, `strokeDasharray`, `strokeWidth`): usar `className` com `stroke-*` Tailwind quando possível; atributos nativos para valores numéricos de SVG
- Animação de entrada da seção: máx. 400ms; transição de toggle: 150ms
- `vectorEffect="non-scaling-stroke"` em todas as `<line>` SVG (evita distorção com `preserveAspectRatio="none"`)

---

## Ordem de Implementação

1. `src/types/index.ts` — adicionar tipos
2. `src/data/arquitetura.ts` — criar dados
3. `DiagramaArquitetura.tsx` — criar componente de diagrama
4. `TabelaComparativa.tsx` — criar componente de tabela
5. `S4Arquitetura/index.tsx` — substituir stub

Verificar `npx tsc --noEmit` após cada arquivo. Commitar após cada task.

---

## Task 1: Adicionar tipos em `src/types/index.ts`

Adicionar exatamente este bloco ao **final** do arquivo, após o último export existente:

```typescript
export type VistaArquitetura = 'as-is' | 'to-be'

export type TipoNoArq =
  | 'hub-worker'
  | 'hub-portal'
  | 'canal'
  | 'sistema'
  | 'automacao'
  | 'cliente'
  | 'intermediario'

export interface NoArq {
  id: string
  label: string
  tipo: TipoNoArq
  descricao: string
  x: number  // posição em % do container (0–100), centro do nó
  y: number  // posição em % do container (0–100), centro do nó
}

export interface ArestaArq {
  from: string
  to: string
  estilo?: 'solida' | 'tracejada'
}

export interface DiagramaArq {
  nos: NoArq[]
  arestas: ArestaArq[]
}

export interface ComparativoArq {
  jornada: Jornada
  asIs: string
  toBe: string
}
```

Commit: `feat(s4): add architecture diagram types to types/index.ts`

---

## Task 2: Criar `src/data/arquitetura.ts`

```typescript
import type { DiagramaArq, ComparativoArq } from '../types'

export const DIAGRAMA_AS_IS: DiagramaArq = {
  nos: [
    {
      id: 'worker',
      label: 'Worker',
      tipo: 'hub-worker',
      descricao: 'Colaborador temporário — ponto central de sofrimento na jornada',
      x: 50,
      y: 52,
    },
    {
      id: 'colab-gi',
      label: 'Colaborador GI',
      tipo: 'intermediario',
      descricao: 'Intermediário manual de todos os fluxos — gargalo operacional',
      x: 50,
      y: 28,
    },
    {
      id: 'blip',
      label: 'Blip / WhatsApp',
      tipo: 'canal',
      descricao: 'Canal de atendimento via chatbot e WhatsApp corporativo',
      x: 18,
      y: 8,
    },
    {
      id: 'tomticket',
      label: 'TomTicket',
      tipo: 'canal',
      descricao: 'Sistema de tickets de atendimento ao worker',
      x: 34,
      y: 4,
    },
    {
      id: 'glpi',
      label: 'GLPI',
      tipo: 'canal',
      descricao: 'Helpdesk para solicitações internas',
      x: 50,
      y: 4,
    },
    {
      id: 'vip',
      label: 'VIP',
      tipo: 'canal',
      descricao: 'Plataforma de comunicação com clientes',
      x: 66,
      y: 8,
    },
    {
      id: 'email',
      label: 'E-mail',
      tipo: 'canal',
      descricao: 'Canal de comunicação por e-mail',
      x: 82,
      y: 12,
    },
    {
      id: 'whatsapp-pessoal',
      label: 'WhatsApp Pessoal',
      tipo: 'canal',
      descricao: 'Canal informal direto — worker contacta colaborador GI pessoalmente',
      x: 14,
      y: 38,
    },
    {
      id: 'iem',
      label: 'IEM',
      tipo: 'sistema',
      descricao: 'Sistema de gestão de contratação temporária',
      x: 12,
      y: 72,
    },
    {
      id: 'folha',
      label: 'Plataforma de Folha',
      tipo: 'sistema',
      descricao: 'Processamento de folha de pagamento — substituição prevista',
      x: 30,
      y: 83,
    },
    {
      id: 'd4sign',
      label: 'D4Sign',
      tipo: 'sistema',
      descricao: 'Assinatura eletrônica de documentos',
      x: 50,
      y: 87,
    },
    {
      id: 'soc',
      label: 'SOC / Medicina',
      tipo: 'sistema',
      descricao: 'Gestão de saúde ocupacional e medicina do trabalho',
      x: 68,
      y: 83,
    },
    {
      id: 'ponto-mais',
      label: 'Ponto Mais',
      tipo: 'sistema',
      descricao: 'Controle de ponto e gestão de jornada',
      x: 84,
      y: 72,
    },
    {
      id: 'spinner',
      label: 'Spinner / Fusion',
      tipo: 'sistema',
      descricao: 'ERP global — intocável, sem integração local',
      x: 84,
      y: 42,
    },
    {
      id: 'portal-global',
      label: 'Portal Candidato Global',
      tipo: 'sistema',
      descricao: 'Portal global de candidatos — intocável, fora do escopo',
      x: 14,
      y: 60,
    },
  ],
  arestas: [
    { from: 'worker', to: 'colab-gi', estilo: 'solida' },
    { from: 'colab-gi', to: 'blip', estilo: 'solida' },
    { from: 'colab-gi', to: 'tomticket', estilo: 'solida' },
    { from: 'colab-gi', to: 'glpi', estilo: 'solida' },
    { from: 'colab-gi', to: 'vip', estilo: 'solida' },
    { from: 'colab-gi', to: 'email', estilo: 'solida' },
    { from: 'worker', to: 'whatsapp-pessoal', estilo: 'solida' },
    { from: 'colab-gi', to: 'iem', estilo: 'tracejada' },
    { from: 'colab-gi', to: 'folha', estilo: 'tracejada' },
    { from: 'colab-gi', to: 'd4sign', estilo: 'tracejada' },
    { from: 'colab-gi', to: 'soc', estilo: 'tracejada' },
    { from: 'colab-gi', to: 'ponto-mais', estilo: 'tracejada' },
  ],
}

export const DIAGRAMA_TO_BE: DiagramaArq = {
  nos: [
    {
      id: 'portal-worker',
      label: 'Portal do Worker',
      tipo: 'hub-portal',
      descricao: 'Canal único e centralizado para toda a jornada do worker',
      x: 50,
      y: 42,
    },
    {
      id: 'worker-tobe',
      label: 'Worker',
      tipo: 'hub-worker',
      descricao: 'Autonomia completa via portal único — sem intermediação',
      x: 50,
      y: 10,
    },
    {
      id: 'colab-gi-tobe',
      label: 'Colaborador GI',
      tipo: 'intermediario',
      descricao: 'Visão unificada no painel — sem intermediação manual',
      x: 18,
      y: 18,
    },
    {
      id: 'cliente',
      label: 'Cliente',
      tipo: 'cliente',
      descricao: 'Dashboard de visibilidade direta — indicadores em tempo real',
      x: 82,
      y: 18,
    },
    {
      id: 'api-layer',
      label: 'Camada de API',
      tipo: 'sistema',
      descricao: 'Integração agnóstica — conecta portal a qualquer sistema',
      x: 50,
      y: 68,
    },
    {
      id: 'auto-admissao',
      label: 'Automação Admissão',
      tipo: 'automacao',
      descricao: 'Fluxo digital automático de admissão sem redigitação',
      x: 22,
      y: 52,
    },
    {
      id: 'auto-alertas',
      label: 'Alertas Automáticos',
      tipo: 'automacao',
      descricao: 'Notificações proativas para worker, cliente e GI',
      x: 78,
      y: 52,
    },
    {
      id: 'folha-gen',
      label: 'Plataforma de Folha',
      tipo: 'sistema',
      descricao: 'Sistema genérico de folha — substituível sem impacto no portal',
      x: 12,
      y: 83,
    },
    {
      id: 'wfm',
      label: 'Workforce Mgmt',
      tipo: 'sistema',
      descricao: 'Gestão de força de trabalho e escalas',
      x: 30,
      y: 88,
    },
    {
      id: 'ats-iem',
      label: 'ATS / IEM',
      tipo: 'sistema',
      descricao: 'Sistema de contratação temporária integrado',
      x: 50,
      y: 90,
    },
    {
      id: 'd4sign-tobe',
      label: 'D4Sign',
      tipo: 'sistema',
      descricao: 'Assinatura eletrônica integrada ao fluxo de admissão',
      x: 68,
      y: 88,
    },
    {
      id: 'soc-tobe',
      label: 'SOC / Ponto',
      tipo: 'sistema',
      descricao: 'Medicina do trabalho e controle de ponto integrados',
      x: 84,
      y: 82,
    },
  ],
  arestas: [
    { from: 'worker-tobe', to: 'portal-worker', estilo: 'solida' },
    { from: 'colab-gi-tobe', to: 'portal-worker', estilo: 'solida' },
    { from: 'cliente', to: 'portal-worker', estilo: 'solida' },
    { from: 'portal-worker', to: 'api-layer', estilo: 'solida' },
    { from: 'portal-worker', to: 'auto-admissao', estilo: 'tracejada' },
    { from: 'portal-worker', to: 'auto-alertas', estilo: 'tracejada' },
    { from: 'api-layer', to: 'folha-gen', estilo: 'solida' },
    { from: 'api-layer', to: 'wfm', estilo: 'solida' },
    { from: 'api-layer', to: 'ats-iem', estilo: 'solida' },
    { from: 'api-layer', to: 'd4sign-tobe', estilo: 'solida' },
    { from: 'api-layer', to: 'soc-tobe', estilo: 'solida' },
  ],
}

export const COMPARATIVO_ARQ: ComparativoArq[] = [
  {
    jornada: 'admissao',
    asIs: 'Documentos enviados por WhatsApp pessoal. Status invisível para o worker. Redigitação manual entre sistemas. Prazos perdidos sem notificação.',
    toBe: 'Fluxo digital centralizado no Portal. Rastreio em tempo real. Integração automática IEM → Folha. Alertas proativos de pendências.',
  },
  {
    jornada: 'ciclo-ativo',
    asIs: 'Atendimento fragmentado em 4+ canais (WhatsApp, TomTicket, GLPI, VIP). Sem histórico unificado. Holerite e ponto gerenciados por planilha.',
    toBe: 'Central de atendimento unificada com SLA. Autoatendimento no Portal (holerite, ponto, férias). Alertas automáticos de vencimento de contrato.',
  },
  {
    jornada: 'offboarding',
    asIs: 'Processo 100% manual via planilha e TomTicket. Worker fica até 10 dias sem informação sobre status do desligamento.',
    toBe: 'Fluxo digital automatizado. Worker acompanha status em tempo real. Documentos de rescisão disponíveis via Portal.',
  },
]
```

Commit: `feat(s4): add static architecture diagram and comparison data`

---

## Task 3: Criar `src/components/sections/S4Arquitetura/DiagramaArquitetura.tsx`

**Técnica de renderização:**
- Container: `div` com `relative w-full h-[500px] select-none`
- SVG overlay: `<svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">`
- Nós: `div` com `absolute -translate-x-1/2 -translate-y-1/2 z-10`, `style={{ left: '{no.x}%', top: '{no.y}%' }}`
- Legenda: `div absolute bottom-0 left-0` com mini SVGs inline para exemplificar sólida/tracejada

**Classes por tipo de nó (`NO_CLASSES`):**

```
hub-worker:    'bg-gi-navy text-white rounded-xl px-3 py-2 text-xs font-bold shadow-md w-20 text-center leading-snug'
hub-portal:    'bg-gi-blue text-white rounded-xl px-3 py-2 text-xs font-bold shadow-md w-24 text-center leading-snug'
canal:         'bg-white text-gi-dark border-2 border-gi-amber rounded-lg px-2 py-1 text-[11px] font-bold w-24 text-center leading-snug'
sistema:       'bg-gi-light text-gi-charcoal border border-gi-border rounded-lg px-2 py-1 text-[11px] w-24 text-center leading-snug'
automacao:     'bg-white text-gi-dark border-2 border-gi-green rounded-lg px-2 py-1 text-[11px] font-bold w-24 text-center leading-snug'
cliente:       'bg-white text-gi-dark border-2 border-gi-steel rounded-lg px-2 py-1 text-[11px] font-bold w-20 text-center leading-snug'
intermediario: 'bg-white text-gi-dark border-2 border-gi-red rounded-lg px-2 py-1 text-[11px] font-bold w-28 text-center leading-snug'
```

**Arquivo completo:**

```typescript
import type { DiagramaArq, TipoNoArq, VistaArquitetura } from '../../../types'

interface DiagramaArquiteturaProps {
  diagrama: DiagramaArq
  vista: VistaArquitetura
}

const NO_CLASSES: Record<TipoNoArq, string> = {
  'hub-worker': 'bg-gi-navy text-white rounded-xl px-3 py-2 text-xs font-bold shadow-md w-20 text-center leading-snug',
  'hub-portal': 'bg-gi-blue text-white rounded-xl px-3 py-2 text-xs font-bold shadow-md w-24 text-center leading-snug',
  'canal': 'bg-white text-gi-dark border-2 border-gi-amber rounded-lg px-2 py-1 text-[11px] font-bold w-24 text-center leading-snug',
  'sistema': 'bg-gi-light text-gi-charcoal border border-gi-border rounded-lg px-2 py-1 text-[11px] w-24 text-center leading-snug',
  'automacao': 'bg-white text-gi-dark border-2 border-gi-green rounded-lg px-2 py-1 text-[11px] font-bold w-24 text-center leading-snug',
  'cliente': 'bg-white text-gi-dark border-2 border-gi-steel rounded-lg px-2 py-1 text-[11px] font-bold w-20 text-center leading-snug',
  'intermediario': 'bg-white text-gi-dark border-2 border-gi-red rounded-lg px-2 py-1 text-[11px] font-bold w-28 text-center leading-snug',
}

function DiagramaArquitetura({ diagrama, vista }: DiagramaArquiteturaProps) {
  const noMap = Object.fromEntries(diagrama.nos.map(n => [n.id, n]))

  return (
    <div className="relative w-full h-[500px] select-none">
      {/* SVG overlay — arestas */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {diagrama.arestas.map((aresta, i) => {
          const from = noMap[aresta.from]
          const to = noMap[aresta.to]
          if (!from || !to) return null
          const estilo = aresta.estilo ?? 'solida'
          return (
            <line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              className={estilo === 'solida' ? 'stroke-gi-charcoal' : 'stroke-gi-border'}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              strokeDasharray={estilo === 'tracejada' ? '4 3' : undefined}
            />
          )
        })}
      </svg>

      {/* Nós */}
      {diagrama.nos.map(no => (
        <div
          key={no.id}
          className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 ${NO_CLASSES[no.tipo]}`}
          style={{ left: `${no.x}%`, top: `${no.y}%` }}
          title={no.descricao}
        >
          {no.label}
        </div>
      ))}

      {/* Legenda */}
      <div className="absolute bottom-0 left-0 flex gap-6 text-[10px] text-gi-charcoal">
        <span className="flex items-center gap-1.5">
          <svg width="20" height="8" viewBox="0 0 20 8" aria-hidden="true">
            <line x1="0" y1="4" x2="20" y2="4" className="stroke-gi-charcoal" strokeWidth="1.5" />
          </svg>
          {vista === 'as-is' ? 'conexão direta' : 'integração'}
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="20" height="8" viewBox="0 0 20 8" aria-hidden="true">
            <line x1="0" y1="4" x2="20" y2="4" className="stroke-gi-border" strokeWidth="1.5" strokeDasharray="4 3" />
          </svg>
          {vista === 'as-is' ? 'acesso indireto' : 'automação'}
        </span>
      </div>
    </div>
  )
}

export default DiagramaArquitetura
```

Commit: `feat(s4): add DiagramaArquitetura component with SVG edges`

---

## Task 4: Criar `src/components/sections/S4Arquitetura/TabelaComparativa.tsx`

```typescript
import { UserPlus, Briefcase, LogOut } from 'lucide-react'
import { COMPARATIVO_ARQ } from '../../../data/arquitetura'
import type { Jornada } from '../../../types'

type JornadaConfig = {
  label: string
  Icon: React.ComponentType<{ className?: string }>
  iconClass: string
}

const JORNADA_CONFIG: Record<Jornada, JornadaConfig> = {
  admissao: { label: 'Admissão', Icon: UserPlus, iconClass: 'text-gi-blue' },
  'ciclo-ativo': { label: 'Ciclo Ativo', Icon: Briefcase, iconClass: 'text-gi-navy' },
  offboarding: { label: 'Offboarding', Icon: LogOut, iconClass: 'text-gi-steel' },
}

function TabelaComparativa() {
  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold text-gi-navy mb-6">O que muda em cada jornada</h3>
      <div className="rounded-xl overflow-hidden border border-gi-border">
        {/* Cabeçalho */}
        <div className="grid grid-cols-[180px_1fr_1fr] text-xs font-bold uppercase tracking-wide">
          <div className="px-6 py-4 bg-gi-navy text-white">Jornada</div>
          <div className="px-6 py-4 bg-gi-charcoal text-white border-l border-white/10">As-is — hoje</div>
          <div className="px-6 py-4 bg-gi-blue text-white border-l border-white/10">To-be — Portal</div>
        </div>

        {/* Linhas */}
        {COMPARATIVO_ARQ.map((item, index) => {
          const { label, Icon, iconClass } = JORNADA_CONFIG[item.jornada]
          const rowBg = index % 2 === 0 ? 'bg-white' : 'bg-gi-light'
          return (
            <div key={item.jornada} className={`grid grid-cols-[180px_1fr_1fr] ${rowBg}`}>
              <div className="px-6 py-5 flex items-center gap-2 border-b border-gi-border">
                <Icon className={`w-4 h-4 flex-shrink-0 ${iconClass}`} />
                <span className="text-sm font-bold text-gi-dark">{label}</span>
              </div>
              <div className="px-6 py-5 border-l border-b border-gi-border">
                <p className="text-sm text-gi-text leading-relaxed">{item.asIs}</p>
              </div>
              <div className="px-6 py-5 border-l border-b border-gi-border">
                <p className="text-sm text-gi-navy font-medium leading-relaxed">{item.toBe}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TabelaComparativa
```

Commit: `feat(s4): add TabelaComparativa component`

---

## Task 5: Substituir `src/components/sections/S4Arquitetura/index.tsx`

```typescript
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { VistaArquitetura } from '../../../types'
import { DIAGRAMA_AS_IS, DIAGRAMA_TO_BE } from '../../../data/arquitetura'
import DiagramaArquitetura from './DiagramaArquitetura'
import TabelaComparativa from './TabelaComparativa'

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

function S4Arquitetura() {
  const [vista, setVista] = useState<VistaArquitetura>('as-is')

  return (
    <div className="min-h-screen bg-white py-20 px-12">
      <motion.div variants={sectionVariants} initial="hidden" animate="visible">
        <h2 className="text-4xl font-bold text-gi-navy">Arquitetura As-is / To-be</h2>
        <p className="text-xl text-gi-text mt-3 mb-10">
          Como a jornada do worker funciona hoje — e como deveria funcionar com o Portal
        </p>

        {/* Toggle */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setVista('as-is')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              vista === 'as-is'
                ? 'bg-gi-navy text-white'
                : 'bg-white text-gi-charcoal border border-gi-border hover:border-gi-navy'
            }`}
          >
            As-is — Estado atual
          </button>
          <button
            onClick={() => setVista('to-be')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              vista === 'to-be'
                ? 'bg-gi-blue text-white'
                : 'bg-white text-gi-charcoal border border-gi-border hover:border-gi-blue'
            }`}
          >
            To-be — Visão futura
          </button>
        </div>

        {/* Diagrama */}
        <div className="rounded-xl border border-gi-border p-6 bg-white shadow-sm">
          <p className="text-sm text-gi-charcoal mb-6">
            {vista === 'as-is'
              ? 'O worker depende do Colaborador GI para tudo — sem integração, sem visibilidade, sem autonomia.'
              : 'O Portal do Worker centraliza todos os canais. Worker e Cliente têm autonomia. Colaborador GI tem visão consolidada.'}
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={vista}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <DiagramaArquitetura
                diagrama={vista === 'as-is' ? DIAGRAMA_AS_IS : DIAGRAMA_TO_BE}
                vista={vista}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Tabela comparativa */}
        <TabelaComparativa />
      </motion.div>
    </div>
  )
}

export default S4Arquitetura
```

Commit: `feat(s4): implement S4 Arquitetura As-is/To-be section`

---

## Critérios de Aceite

- [ ] Toggle As-is/To-be funcional com animação de fade 150ms
- [ ] Diagrama As-is: Worker central (navy), Colaborador GI como gargalo (vermelho), 6 canais (âmbar) no topo, 5 sistemas (cinza) no fundo com tracejado, Spinner e Portal Global isolados sem arestas
- [ ] Diagrama To-be: Portal do Worker central (azul), 3 atores conectados acima, Camada de API com 5 sistemas integrados abaixo, 2 automações (verde) nos flancos
- [ ] Tabela comparativa com 3 linhas (Admissão, Ciclo Ativo, Offboarding), 2 colunas de conteúdo, cabeçalho tricolor, ícones Lucide
- [ ] `npx tsc --noEmit` sem erros
- [ ] `npm run build` sem erros
- [ ] S1, S2, S3 sem regressão
- [ ] Nenhum arquivo fora da lista de Arquivos Permitidos foi tocado
