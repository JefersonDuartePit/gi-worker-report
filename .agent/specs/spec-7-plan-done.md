# spec-7-plan-done.md — Spec 7 · S6 Portal do Worker · Plan (Redo)

**Data:** 2026-06-29
**Fase:** Plan (concluída — substitui a versão de 2026-06-23)
**Branch:** spec/07-portal-do-worker
**Fonte:** `.agent/specs/spec-7-research-done.md` (versão expandida)
**Próxima fase:** Implement (sessão separada, artefato: `spec-7-implement-done.md`)

---

## 1. Objetivo desta fase

Desenhar a implementação técnica das 6 telas do Portal do Worker (5 originais + `TelaDesenvolvimento`, aprovada na fase de Research) e resolver as 2 pendências técnicas deixadas pelo Research:

1. `usePortalNav.ts` precisa do screen `'desenvolvimento'`.
2. `TelaDesenvolvimento` precisa de uma dor mapeada para usar `DorTooltip` (ou ficar como exceção).

**Decisão tomada nesta fase:** criar `D12` em `src/data/dores.ts`, referenciando a iniciativa `I10` (Portal do Worker — autoatendimento), que já é a iniciativa "guarda-chuva" do portal e já referencia múltiplas telas em `telasRelacionadas`. Isso mantém o padrão do projeto (toda tela com `DorTooltip` aponta para uma dor real) sem inventar uma nova iniciativa.

```typescript
// src/data/dores.ts — novo registro
{
  id: 'D12',
  titulo: 'Sem registro centralizado de feedback e desenvolvimento do worker',
  descricao: 'Feedbacks, acompanhamentos e advertências formais do worker ficam dispersos entre lideranças de operação e GI, sem canal único de consulta.',
  personas: ['worker', 'colaborador-gi'],
  jornada: 'ciclo-ativo',
  severidade: 'media',
  iniciativaQueResolve: 'I10',
}
```

```typescript
// src/data/iniciativas.ts — I10.telasRelacionadas atualizado
telasRelacionadas: ['inicio', 'documentos', 'treinamentos', 'desenvolvimento']
```

---

## 2. Arquivos Permitidos

| Arquivo | Ação |
|---|---|
| `src/hooks/usePortalNav.ts` | editar (estender `PortalScreen`) |
| `src/data/dores.ts` | editar (adicionar `D12`) |
| `src/data/iniciativas.ts` | editar (atualizar `telasRelacionadas` de `I10`) |
| `src/components/portal/PortalShell.tsx` | reescrever |
| `src/components/portal/DorTooltip.tsx` | manter como está (já atende ao contrato) |
| `src/components/portal/TelaInicio.tsx` | reescrever |
| `src/components/portal/TelaDocumentos.tsx` | reescrever |
| `src/components/portal/TelaSolicitacoes.tsx` | reescrever |
| `src/components/portal/TelaTreinamentos.tsx` | reescrever |
| `src/components/portal/TelaRescisao.tsx` | reescrever |
| `src/components/portal/TelaDesenvolvimento.tsx` | criar (novo) |
| `src/components/sections/S6Portal/index.tsx` | manter (já integra `PortalShell`, sem mudança estrutural) |

Nenhum outro arquivo deve ser tocado. `src/components/ui/*` e `src/types/index.ts` são reutilizados sem alteração.

---

## 3. `usePortalNav.ts` — extensão

```typescript
import { useState } from 'react'

export type PortalScreen =
  | 'inicio'
  | 'documentos'
  | 'solicitacoes'
  | 'treinamentos'
  | 'rescisao'
  | 'desenvolvimento'

export function usePortalNav() {
  const [screen, setScreen] = useState<PortalScreen>('inicio')
  return { screen, navigate: setScreen }
}
```

---

## 4. `PortalShell.tsx` — atualização do mapa de telas e navegação

Mantém a estrutura atual (sidebar 220px `gi-navy`, topbar com selo "Dados ilustrativos", shell 720px `rounded-2xl`), apenas estendendo `SCREENS_MAP` e `NAV_ITEMS` com a 6ª tela:

```typescript
const SCREENS_MAP: Record<PortalScreen, ComponentType> = {
  inicio:          TelaInicio,
  documentos:      TelaDocumentos,
  solicitacoes:    TelaSolicitacoes,
  treinamentos:    TelaTreinamentos,
  rescisao:        TelaRescisao,
  desenvolvimento: TelaDesenvolvimento,
}

const NAV_ITEMS: NavItem[] = [
  { screen: 'inicio',          label: 'Início',          icon: '🏠' },
  { screen: 'documentos',      label: 'Documentos',      icon: '📄' },
  { screen: 'solicitacoes',    label: 'Solicitações',    icon: '💬' },
  { screen: 'treinamentos',    label: 'Treinamentos',    icon: '📚' },
  { screen: 'rescisao',        label: 'Rescisão',        icon: '📋' },
  { screen: 'desenvolvimento', label: 'Desenvolvimento', icon: '📈' },
]
```

Resto do componente (estado ativo, troca de tela, header com nome da tela) permanece igual ao padrão já validado.

---

## 5. `TelaInicio.tsx`

### Interface local
```typescript
interface EtapaAdmissao {
  label: string
  status: 'concluida' | 'pendente' | 'aguardando'
}

interface ContatoGI {
  nome: string
  cargo: string
  iniciais: string
}
```

### Conteúdo
- Saudação "Olá, Ana" + subtítulo de contexto.
- `ProgressBar` com progresso ilustrativo (ex.: 4 de 5 etapas = 80%).
- Lista de `EtapaAdmissao[]` com `Badge` de status (`concluido`/`andamento`/`bloqueado`).
- Cards de métricas resumidas (solicitações abertas, treinamentos concluídos) — números ilustrativos.
- **Novo:** bloco de contato GI permanente, fora de qualquer tooltip — `Card` com iniciais em avatar, nome, cargo, envolvido por `DorTooltip dorId="D07" iniciativaId="I10"`. O tooltip aparece apenas no hover; o bloco em si é sempre visível.
- Atalhos rápidos (botões `secondary`) que chamam `onNavigate('documentos')`, etc.

**Nota de arquitetura:** como `CODING-GUIDELINES.md` proíbe prop drilling acima de 2 níveis, e aqui é apenas 1 nível (`PortalShell` → `TelaInicio`), passar `onNavigate: (screen: PortalScreen) => void` como prop é aceitável e evita acoplar a tela ao hook `usePortalNav` diretamente.

---

## 6. `TelaDocumentos.tsx`

### Interface local
```typescript
interface DocumentoIlustrativo {
  nome: string
  status: 'assinado' | 'disponivel' | 'pendente'
}
```

### Conteúdo
- Header com `DorTooltip dorId="D11" iniciativaId="I05"`.
- Lista de 4 documentos ilustrativos (Contrato, Holerite — mês atual, ASO Admissional, Informe de Rendimentos) com `Badge` por status e `Button variant="ghost"` "Baixar" (sem ação real).

---

## 7. `TelaSolicitacoes.tsx`

### Interface local
```typescript
interface SolicitacaoIlustrativa {
  ticket: string
  tipo: string
  status: 'aberta' | 'em-andamento' | 'concluida'
}

type TipoSolicitacao = 'cadastral' | 'atestado' | 'beneficios' | 'outros'
```

### Conteúdo
- Header com `DorTooltip dorId="D05" iniciativaId="I07"` + `Button variant="primary"` "Nova solicitação".
- Lista de solicitações ilustrativas com `Badge` de status.
- Modal (estado local `isModalOpen`, Framer Motion `scale 0.95→1`, 200ms) com seleção dos 4 tipos (`cadastral`, `atestado`, `beneficios`, `outros`) e botão "Enviar" que fecha o modal e mostra confirmação via estado local (`showConfirmacao`), sem persistir dado.

---

## 8. `TelaTreinamentos.tsx`

### Interface local
```typescript
interface ModuloTreinamento {
  nome: string
  status: 'concluido' | 'em-andamento' | 'bloqueado' | 'aguardando'
}

interface MarcoAcompanhamento {
  dias: 30 | 60 | 90
  status: 'concluido' | 'em-andamento' | 'futuro'
}
```

### Conteúdo
- `ProgressBar` da trilha geral com `DorTooltip dorId="D06" iniciativaId="I10"`.
- Lista de módulos com `Badge` por status; módulos `bloqueado` renderizados sem `onClick`/`cursor-pointer`.
- 3 marcadores 30/60/90 dias em linha, com `Badge` de estágio.

---

## 9. `TelaRescisao.tsx`

### Interface local
```typescript
interface EtapaRescisao {
  label: string
  status: 'concluida' | 'em-andamento' | 'futura'
}
```

### Conteúdo
- Indicador "Dia 3 de 10" com `ProgressBar value={3} max={10}` e `DorTooltip dorId="D09" iniciativaId="I13"`.
- Timeline de etapas (Aviso recebido → Cálculo TRCT → Assinatura → Documentos disponíveis) com `Badge` por status.
- `Button variant="secondary"` "Falar com o time GI" (ilustrativo).

---

## 10. `TelaDesenvolvimento.tsx` (novo)

### Interface local
```typescript
interface RegistroDesenvolvimento {
  data: string
  tipo: 'feedback' | 'advertencia'
  titulo: string
  descricao: string
}
```

### Conteúdo
- Header com `DorTooltip dorId="D12" iniciativaId="I10"` (dor nova).
- Timeline cronológica (`Card` por item) com 3–4 registros ilustrativos misturando `feedback` e `advertencia`.
- `Badge variant="concluido"` para `feedback`, `Badge variant="critica"` para `advertencia` — diferenciação visual clara.
- Somente leitura: nenhum botão de ação (reflete a visão do worker, que apenas consulta seu histórico).

---

## 11. Receita de extensão (adicionar/remover telas)

1. Adicionar o novo valor em `PortalScreen` (`src/hooks/usePortalNav.ts`).
2. Criar `Tela*.tsx` em `src/components/portal/`.
3. Importar e registrar em `SCREENS_MAP` e `NAV_ITEMS` dentro de `PortalShell.tsx`.
4. Se a tela tiver tooltip de dor, garantir que a `Dor` e a `Iniciativa` referenciadas existam em `src/data/`.

---

## 12. Critérios de aceite (consolidado do Research, por tela)

Ver `spec-7-research-done.md` §7 para os critérios detalhados de cada tela. Resumo dos pontos centrais a validar no Implement:

- 6 telas navegáveis via sidebar, sem reload.
- Topbar com selo "Dados ilustrativos" em todas as telas.
- `TelaInicio` com bloco de contato GI permanente + tooltip D07.
- `TelaDesenvolvimento` com tooltip D12 (novo) e diferenciação visual feedback/advertência.
- Modal de nova solicitação funcional (abre, lista 4 tipos, fecha com confirmação).
- `npx tsc --noEmit` sem erros (zero `any`).
- `npm run build` sem erros.

---

## 13. Ordem de implementação sugerida

1. `src/data/dores.ts` (adicionar D12) + `src/data/iniciativas.ts` (atualizar I10).
2. `src/hooks/usePortalNav.ts` (estender `PortalScreen`).
3. `TelaInicio.tsx`, `TelaDocumentos.tsx`, `TelaSolicitacoes.tsx`, `TelaTreinamentos.tsx`, `TelaRescisao.tsx` (recriar seguindo os contratos acima).
4. `TelaDesenvolvimento.tsx` (novo).
5. `PortalShell.tsx` (atualizar mapas e wiring de `onNavigate`).
6. Verificar `S6Portal/index.tsx` — não deve precisar de alteração.
7. Rodar `npx tsc --noEmit` e `npm run build`.
