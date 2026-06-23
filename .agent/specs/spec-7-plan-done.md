# spec-7-plan-done.md — Spec 7 · S6 Portal do Worker · Plan

**Data:** 2026-06-23
**Fase:** Plan (aprovado)
**Branch:** spec/07-portal-do-worker
**Status:** Pronto para Implement

---

## Visão geral

A Spec 7 entrega o portal do worker como protótipo navegável de alta fidelidade dentro do relatório interativo. O portal vive em `src/components/portal/` — completamente isolado do restante do app. O ponto de integração com o relatório é apenas `src/components/sections/S6Portal/index.tsx`.

**Este plano é intencionalamente flexível.** O designer tem liberdade total sobre o conteúdo visual, a quantidade de telas e a estrutura interna do portal. As seções de "Receitas" abaixo explicam como exercer essa liberdade sem quebrar a integração com o app principal.

---

## Arquivos Permitidos

O designer pode criar, modificar ou remover qualquer arquivo nesta lista:

```
# Portal — liberdade total nesta pasta
src/components/portal/PortalShell.tsx
src/components/portal/DorTooltip.tsx
src/components/portal/TelaInicio.tsx
src/components/portal/TelaDocumentos.tsx
src/components/portal/TelaSolicitacoes.tsx
src/components/portal/TelaTreinamentos.tsx
src/components/portal/TelaRescisao.tsx
# ↑ pode criar novos arquivos Tela*.tsx, subcomponentes, helpers, etc.

# Ponto de integração com o app principal
src/components/sections/S6Portal/index.tsx

# Hook de navegação interna — pode adicionar/remover screens
src/hooks/usePortalNav.ts

# Artefato de conclusão (gerar ao final)
.agent/specs/spec-7-implement-done.md
```

---

## Arquivos Proibidos

Não tocar nesses arquivos sob nenhuma circunstância:

```
src/App.tsx
src/components/layout/
src/components/sections/S1Hero/
src/components/sections/S2Diagnostico/
src/components/sections/S3Dores/
src/components/sections/S4Arquitetura/
src/components/sections/S5Iniciativas/
src/components/sections/S7Provocacoes/
src/components/ui/Tooltip.tsx    ← stub preservado para outra spec
src/data/                        ← dados são somente leitura
src/types/index.ts               ← tipos compartilhados
docs/
PROJECT-STATE.md
```

---

## Passos de Implementação

### Passo 1 — DorTooltip.tsx

**Arquivo:** `src/components/portal/DorTooltip.tsx`
**Por quê primeiro:** é uma dependência das telas. Todas as telas que precisam de tooltip vão importá-lo.

O DorTooltip é um wrapper que mostra um card flutuante ao hover, revelando qual dor um elemento resolve e qual iniciativa corresponde. Ele busca os dados em `DORES` e `INICIATIVAS` pelo ID.

```typescript
import { useState } from 'react'
import type { ReactNode } from 'react'
import { DORES } from '../../data/dores'
import { INICIATIVAS } from '../../data/iniciativas'

interface DorTooltipProps {
  dorId: string
  iniciativaId: string
  children: ReactNode
}

function DorTooltip({ dorId, iniciativaId, children }: DorTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dor = DORES.find(d => d.id === dorId)
  const iniciativa = INICIATIVAS.find(i => i.id === iniciativaId)

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {children}
      {isOpen && dor && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64 bg-gi-navy text-white rounded-lg p-3 shadow-lg text-xs pointer-events-none">
          <div className="font-bold text-gi-amber mb-1">{dor.id} — {dor.titulo}</div>
          <div className="text-white/80 text-[11px] mb-2">{dor.descricao}</div>
          {iniciativa && (
            <div className="text-white/60 text-[10px] border-t border-white/20 pt-2">
              ↳ Resolve via {iniciativa.id}: {iniciativa.titulo.slice(0, 60)}…
            </div>
          )}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-gi-navy" />
        </div>
      )}
    </div>
  )
}

export default DorTooltip
```

---

### Passo 2 — PortalShell.tsx

**Arquivo:** `src/components/portal/PortalShell.tsx`
**Por quê:** é o container principal. Define a estrutura visual do portal (sidebar + topbar + área de conteúdo) e gerencia qual tela está ativa.

**Como funciona:**
- `usePortalNav()` retorna `{ screen, navigate }` — o estado da tela ativa
- `SCREENS_MAP` mapeia cada `PortalScreen` para seu componente
- `NAV_ITEMS` define os itens da sidebar (label, ícone, screen key)

```typescript
import { usePortalNav } from '../../hooks/usePortalNav'
import type { PortalScreen } from '../../hooks/usePortalNav'
import TelaInicio from './TelaInicio'
import TelaDocumentos from './TelaDocumentos'
import TelaSolicitacoes from './TelaSolicitacoes'
import TelaTreinamentos from './TelaTreinamentos'
import TelaRescisao from './TelaRescisao'
import type { ComponentType } from 'react'

// Para adicionar uma tela:
// 1. Adicione o valor em PortalScreen (src/hooks/usePortalNav.ts)
// 2. Crie o arquivo Tela*.tsx nesta pasta
// 3. Importe acima e adicione no SCREENS_MAP abaixo
// 4. Adicione o item em NAV_ITEMS abaixo
const SCREENS_MAP: Record<PortalScreen, ComponentType> = {
  inicio:       TelaInicio,
  documentos:   TelaDocumentos,
  solicitacoes: TelaSolicitacoes,
  treinamentos: TelaTreinamentos,
  rescisao:     TelaRescisao,
}

interface NavItem {
  screen: PortalScreen
  label: string
  icon: string
}

// Edite a lista de itens da sidebar aqui — ordem, ícones e labels
const NAV_ITEMS: NavItem[] = [
  { screen: 'inicio',       label: 'Início',       icon: '🏠' },
  { screen: 'documentos',   label: 'Documentos',   icon: '📄' },
  { screen: 'solicitacoes', label: 'Solicitações', icon: '💬' },
  { screen: 'treinamentos', label: 'Treinamentos', icon: '📚' },
  { screen: 'rescisao',     label: 'Rescisão',     icon: '📋' },
]

function PortalShell() {
  const { screen, navigate } = usePortalNav()
  const ActiveScreen = SCREENS_MAP[screen]

  return (
    <div className="flex h-[720px] rounded-2xl overflow-hidden border border-gi-border shadow-xl">
      {/* Sidebar do portal */}
      <aside className="w-[220px] bg-gi-navy flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-white/10">
          <div className="text-white font-bold text-sm">GI Worker</div>
          <div className="text-white/50 text-xs mt-0.5">Portal do Colaborador</div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.screen}
              onClick={() => navigate(item.screen)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left ${
                screen === item.screen
                  ? 'bg-white/15 text-white border-l-[3px] border-gi-blue pl-[9px]'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gi-blue flex items-center justify-center text-white text-xs font-bold shrink-0">
              AS
            </div>
            <div>
              <div className="text-white text-xs font-bold leading-tight">Ana Silva</div>
              <div className="text-white/50 text-[10px]">Operadora · Shopee SP</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Área de conteúdo */}
      <div className="flex-1 flex flex-col bg-[#F8F9FA] overflow-hidden">
        <header className="h-[52px] bg-white border-b border-gi-border flex items-center px-5 shrink-0">
          <span className="text-sm font-bold text-gi-dark">
            {NAV_ITEMS.find(i => i.screen === screen)?.label}
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-[11px] text-gi-charcoal">Dados ilustrativos</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gi-amber inline-block" />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <ActiveScreen />
        </main>
      </div>
    </div>
  )
}

export default PortalShell
```

---

### Passo 3 — Telas scaffold (5 arquivos)

Cada tela começa com comentários explicando:
- Qual dor ela resolve (com ID e título da SPECS.md)
- Qual iniciativa corresponde
- O que o cliente pediu que aparecesse nessa tela

O conteúdo visual é deixado para o designer construir.

**Passo 3.1 — TelaInicio.tsx**

```typescript
// =============================================================
// TELA: INÍCIO
// Resolve: D01 — Sem visibilidade do status admissional
//          D07 — Worker não sabe quem é seu contato GI
// Iniciativas: I01 (portal de admissão), I10 (portal do worker)
//
// O que mostrar (SPECS.md Spec 7):
// ✦ Status da admissão com barra de progresso
// ✦ Etapas (concluídas ✓, em andamento ◉, aguardando ○)
// ✦ Métricas: solicitações abertas, treinamentos concluídos
// ✦ Atalhos rápidos para outras telas
//
// Como usar DorTooltip:
//   <DorTooltip dorId="D01" iniciativaId="I01">
//     <ProgressBar value={60} />
//   </DorTooltip>
// =============================================================

import DorTooltip from './DorTooltip'
import ProgressBar from '../ui/ProgressBar'

function TelaInicio() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-base font-bold text-gi-dark">Olá, Ana Silva 👋</h2>
        <p className="text-sm text-gi-charcoal mt-0.5">Acompanhe sua jornada na GI Group</p>
      </div>

      {/* Construa o conteúdo da tela aqui */}
      {/* Exemplo de uso do DorTooltip: */}
      <DorTooltip dorId="D01" iniciativaId="I01">
        <div className="bg-white rounded-xl border border-gi-border p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-gi-dark">Status da admissão</span>
            <span className="text-xs text-gi-blue font-bold">60%</span>
          </div>
          <ProgressBar value={60} />
          <p className="text-xs text-gi-charcoal mt-2">Documentação pendente · Passo 3 de 5</p>
        </div>
      </DorTooltip>

      <p className="text-xs text-gi-charcoal italic">
        → Continue construindo esta tela com cards, métricas e atalhos.
      </p>
    </div>
  )
}

export default TelaInicio
```

**Passo 3.2 — TelaDocumentos.tsx**

```typescript
// =============================================================
// TELA: DOCUMENTOS
// Resolve: D11 — Sem canal de acesso a documentos pós-contrato
// Iniciativas: I05 (assinatura eletrônica), I10 (portal do worker)
//
// O que mostrar (SPECS.md Spec 7):
// ✦ Lista de documentos disponíveis (contrato, holerites, ASO, informe IR)
// ✦ Status de cada documento: assinado ✓, disponível ↓, pendente ○
// ✦ Botão de download (visual — não funcional)
// =============================================================

import DorTooltip from './DorTooltip'

function TelaDocumentos() {
  return (
    <div className="p-6 space-y-4">
      <DorTooltip dorId="D11" iniciativaId="I05">
        <div>
          <h2 className="text-base font-bold text-gi-dark">Meus Documentos</h2>
          <p className="text-sm text-gi-charcoal mt-0.5">Acesse e baixe seus documentos</p>
        </div>
      </DorTooltip>

      <p className="text-xs text-gi-charcoal italic">
        → Construa aqui a lista de documentos com status e botões de download.
      </p>
    </div>
  )
}

export default TelaDocumentos
```

**Passo 3.3 — TelaSolicitacoes.tsx**

```typescript
// =============================================================
// TELA: SOLICITAÇÕES
// Resolve: D05 — Sem canal único de comunicação com o worker
// Iniciativa: I07 — Central de atendimento unificada CARE + SMS
//
// O que mostrar (SPECS.md Spec 7):
// ✦ Lista de solicitações abertas com status e número de ticket
// ✦ Botão "Nova solicitação" com modal de abertura
// ✦ Tipos de solicitação: atualização cadastral, atestado, benefícios, outros
//
// Dica de modal: use useState para controlar abertura
//   const [modalOpen, setModalOpen] = useState(false)
// =============================================================

import { useState } from 'react'
import DorTooltip from './DorTooltip'

function TelaSolicitacoes() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <DorTooltip dorId="D05" iniciativaId="I07">
          <h2 className="text-base font-bold text-gi-dark">Solicitações</h2>
        </DorTooltip>
        <button
          onClick={() => setModalOpen(true)}
          className="px-3 py-1.5 bg-gi-blue text-white text-xs font-bold rounded-lg hover:bg-gi-navy transition-colors"
        >
          + Nova solicitação
        </button>
      </div>

      <p className="text-xs text-gi-charcoal italic">
        → Construa aqui a lista de solicitações e implemente o modal aberto por {'"'}Nova solicitação{'"'}.
      </p>

      {/* Modal — implemente o conteúdo */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-2xl">
            <h3 className="font-bold text-gi-dark mb-4">Nova solicitação</h3>
            <p className="text-sm text-gi-charcoal">Construa o formulário aqui.</p>
            <button
              onClick={() => setModalOpen(false)}
              className="mt-4 w-full py-2 text-sm text-gi-charcoal border border-gi-border rounded-lg hover:bg-gi-light"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default TelaSolicitacoes
```

**Passo 3.4 — TelaTreinamentos.tsx**

```typescript
// =============================================================
// TELA: TREINAMENTOS
// Resolve: D06 — Sem acompanhamento de onboarding 30/60/90 dias
// Iniciativa: I10 — Portal do Worker (autoatendimento)
//
// O que mostrar (SPECS.md Spec 7):
// ✦ Trilha de onboarding com progresso visual
// ✦ Módulos: concluídos ✓, em andamento ◉, bloqueados 🔒, aguardando data 📅
// ✦ Marcadores de 30, 60 e 90 dias
// =============================================================

import DorTooltip from './DorTooltip'

function TelaTreinamentos() {
  return (
    <div className="p-6 space-y-4">
      <DorTooltip dorId="D06" iniciativaId="I10">
        <h2 className="text-base font-bold text-gi-dark">Treinamentos</h2>
      </DorTooltip>

      <p className="text-xs text-gi-charcoal italic">
        → Construa aqui a trilha de onboarding com os marcos de 30/60/90 dias.
      </p>
    </div>
  )
}

export default TelaTreinamentos
```

**Passo 3.5 — TelaRescisao.tsx**

```typescript
// =============================================================
// TELA: RESCISÃO
// Resolve: D09 — 10 dias sem informação no desligamento
// Iniciativas: I13 (fluxo de desligamento), I14 (assinatura TRCT)
//
// O que mostrar (SPECS.md Spec 7):
// ✦ Status: "Dia 3 de 10" com barra de progresso temporal
// ✦ Timeline das etapas do processo de desligamento
// ✦ Previsão de disponibilização dos documentos rescisórios
// ✦ Botão de contato com o time GI
// =============================================================

import DorTooltip from './DorTooltip'
import ProgressBar from '../ui/ProgressBar'

function TelaRescisao() {
  return (
    <div className="p-6 space-y-4">
      <DorTooltip dorId="D09" iniciativaId="I13">
        <div className="bg-white rounded-xl border border-gi-border p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-gi-dark">Processo de rescisão</span>
            <span className="text-xs text-gi-charcoal">Dia 3 de 10</span>
          </div>
          <ProgressBar value={30} />
        </div>
      </DorTooltip>

      <p className="text-xs text-gi-charcoal italic">
        → Construa aqui a timeline das etapas e a previsão de documentos.
      </p>
    </div>
  )
}

export default TelaRescisao
```

---

### Passo 4 — Atualizar S6Portal/index.tsx

**Arquivo:** `src/components/sections/S6Portal/index.tsx`
**Por quê:** conecta o portal ao relatório. Este é o único ponto de integração — manter mínimo e estável.

```typescript
import PortalShell from '../../components/portal/PortalShell'

function S6Portal() {
  return (
    <div className="min-h-screen bg-white py-16 px-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-gi-navy">Portal do Worker</h2>
          <p className="text-xl text-gi-text mt-3">
            Protótipo navegável de alta fidelidade. Passe o mouse sobre os elementos
            destacados para ver qual dor cada funcionalidade resolve.
          </p>
        </div>
        <PortalShell />
      </div>
    </div>
  )
}

export default S6Portal
```

---

### Passo 5 — Verificação

```bash
npx tsc --noEmit
npm run dev
```

Verificar:
- [ ] Seção S6 Portal visível no relatório (scroll ou sidebar)
- [ ] Portal renderiza com sidebar e topbar corretos
- [ ] Navegação entre as 5 telas funcional
- [ ] DorTooltip aparece ao hover nos elementos marcados
- [ ] Sem erros TypeScript
- [ ] Sem erros no console do browser

---

## Receitas de Extensão

### Como adicionar uma nova tela

**Exemplo: adicionar tela "Benefícios"**

1. Edite `src/hooks/usePortalNav.ts`:
```typescript
// Adicione 'beneficios' ao tipo
export type PortalScreen = 'inicio' | 'documentos' | 'solicitacoes' | 'treinamentos' | 'rescisao' | 'beneficios'
```

2. Crie `src/components/portal/TelaBeneficios.tsx` (seguindo o padrão das outras telas)

3. Em `PortalShell.tsx`, adicione o import e o entry no SCREENS_MAP e NAV_ITEMS:
```typescript
import TelaBeneficios from './TelaBeneficios'

const SCREENS_MAP = {
  // ... existentes ...
  beneficios: TelaBeneficios,
}

const NAV_ITEMS = [
  // ... existentes ...
  { screen: 'beneficios', label: 'Benefícios', icon: '💊' },
]
```

TypeScript vai apontar erro se você esquecer de adicionar em algum dos 3 lugares — isso é intencional.

---

### Como remover uma tela

**Exemplo: remover tela "Rescisão"**

1. Delete `src/components/portal/TelaRescisao.tsx`
2. Remova `'rescisao'` de `PortalScreen` em `usePortalNav.ts`
3. Remova o import e o entry de `SCREENS_MAP` e `NAV_ITEMS` no `PortalShell.tsx`

TypeScript vai mostrar exatamente onde precisa ser removido.

---

### Como criar subcomponentes internos ao portal

Crie qualquer arquivo dentro de `src/components/portal/`. Exemplos:
- `src/components/portal/DocumentoItem.tsx` — card de documento
- `src/components/portal/SolicitacaoModal.tsx` — modal separado
- `src/components/portal/StatusBadge.tsx` — badge de status do portal

Esses arquivos ficam **dentro do portal** e não afetam o restante do app.

---

### Como usar DorTooltip

```tsx
// Envolva qualquer elemento com DorTooltip para mostrar a dor que resolve
<DorTooltip dorId="D01" iniciativaId="I01">
  <seu-elemento-aqui />
</DorTooltip>

// IDs disponíveis em src/data/dores.ts (D01–D11)
// IDs disponíveis em src/data/iniciativas.ts (I01–I17)
// DorTooltip busca os dados automaticamente pelo ID
```

---

### Como acessar os dados de dores e iniciativas

```typescript
import { DORES } from '../../data/dores'
import { INICIATIVAS } from '../../data/iniciativas'

// Filtrar iniciativas de uma tela específica
const iniciativasDoPortal = INICIATIVAS.filter(i =>
  i.telasRelacionadas?.includes('inicio')
)

// Buscar uma dor por ID
const dorD01 = DORES.find(d => d.id === 'D01')
```

---

## Contrato de Output

Ao finalizar a implementação, gere `.agent/specs/spec-7-implement-done.md` com:

```markdown
# spec-7-implement-done.md

## Arquivos criados/modificados
- [lista completa com paths]

## Telas implementadas
- [ ] TelaInicio — D01
- [ ] TelaDocumentos — D11
- [ ] TelaSolicitacoes — D05
- [ ] TelaTreinamentos — D06
- [ ] TelaRescisao — D09
- [ ] (telas adicionais, se criadas)

## DorTooltips implementados
- [lista de elementos que receberam tooltip]

## Desvios do plano
- [descrever ou "nenhum"]

## Estado final
- [ ] npx tsc --noEmit — sem erros
- [ ] npm run dev — portal navegável na seção S6
- [ ] Modal de nova solicitação funcional
```

**Não atualizar PROJECT-STATE.md** — apenas o humano (Jeferson) atualiza após revisar.
