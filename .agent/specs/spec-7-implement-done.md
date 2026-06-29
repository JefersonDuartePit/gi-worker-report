# spec-7-implement-done.md — Spec 7 · S6 Portal do Worker · Implement

**Data:** 2026-06-29
**Fase:** Implement (concluída)
**Branch:** spec/07-portal-do-worker
**Fonte:** `.agent/specs/spec-7-plan-done.md`

---

## 1. O que foi implementado

Refeito integralmente o Portal do Worker mockado, seguindo `spec-7-plan-done.md`, com 6 telas navegáveis (5 originais + `TelaDesenvolvimento`, nova).

**Arquivos criados/alterados:**
- `src/data/dores.ts` — adicionado `D12` (sem registro centralizado de feedback/advertência).
- `src/data/iniciativas.ts` — `I10.doresResolvidas` e `I10.telasRelacionadas` atualizados para incluir `D12`/`desenvolvimento`.
- `src/hooks/usePortalNav.ts` — `PortalScreen` estendido com `'desenvolvimento'`.
- `src/components/portal/TelaInicio.tsx` — reescrito: barra de progresso de admissão com etapas, métricas resumidas, bloco de contato GI permanente (D07/I10) e atalhos rápidos via prop `onNavigate`.
- `src/components/portal/TelaDocumentos.tsx` — reescrito: lista de 4 documentos ilustrativos com status e botão de download.
- `src/components/portal/TelaSolicitacoes.tsx` — reescrito: lista de solicitações, modal de nova solicitação com 4 tipos, animado via Framer Motion (`AnimatePresence`), confirmação visual ao enviar.
- `src/components/portal/TelaTreinamentos.tsx` — reescrito: trilha de onboarding com progresso, módulos com 4 estados, marcadores 30/60/90 dias.
- `src/components/portal/TelaRescisao.tsx` — reescrito: indicador "Dia 3 de 10", timeline de etapas, botão de contato.
- `src/components/portal/TelaDesenvolvimento.tsx` — **novo**: timeline de feedback/advertência (D12/I10), somente leitura.
- `src/components/portal/PortalShell.tsx` — `SCREENS_MAP`/`NAV_ITEMS` estendidos para 6 telas; `TelaInicio` renderizada com `onNavigate={navigate}`.
- `src/components/portal/DorTooltip.tsx` — sem alteração (já atendia ao contrato).
- `src/components/sections/S6Portal/index.tsx` — sem alteração.

## 2. Desvios do plano

Nenhum desvio de conteúdo. Um ajuste técnico não previsto no plano: `SCREENS_MAP` foi tipado como `Partial<Record<PortalScreen, ComponentType>>` em vez de `Record<PortalScreen, ComponentType>`, porque `TelaInicio` passou a exigir a prop `onNavigate` — ela é renderizada por um branch condicional separado em `PortalShell`, fora do mapa genérico. As demais 5 telas continuam no mapa sem props.

## 3. Verificações

- `npx tsc --noEmit` → sem erros (zero uso de `any`).
- `npm run build` → sucesso (`dist/assets/index-DiV_Jhrt.js` 313.54 kB, `index-CLx6gAlt.css` 16.25 kB).
- `npm run dev` → servidor respondeu HTTP 200 em `http://localhost:5174/`.
- **Não verificado visualmente em navegador** — não há ferramenta de screenshot/browser disponível neste ambiente. Recomenda-se abrir `npm run dev` e navegar manualmente pelas 6 telas antes de considerar a spec encerrada para apresentação ao cliente.

## 4. Proposta de atualização do PROJECT-STATE.md

Conforme `CLAUDE.md` §5.3, esta atualização precisa de autorização explícita do humano antes de ser aplicada:

- Spec 7 (S6 — Portal do Worker) passa de "⬜ Pendente" para "✅ Concluída", artefatos: `spec-7-research-done.md`, `spec-7-plan-done.md`, `spec-7-implement-done.md`.
- Nota de desvio: escopo expandido para 6 telas (5 do `SPECS.md` original + `TelaDesenvolvimento`, aprovada em sessão de Research a partir de transcrições de reunião com a Carol). Sugerir atualização de `SPECS.md` Spec 7 para refletir a 6ª tela.
- Nova dor `D12` adicionada a `src/data/dores.ts` (fora do conjunto original de 11 dores documentado em `CONTEXT.md` §5).
- A linha "Próxima etapa: merge de `spec/07-portal-do-worker` → main" já registrada em `PROJECT-STATE.md` (vinda de `origin/main`) permanece como o próximo passo real — esta branch está pronta para esse PR após a revisão visual mencionada na §3.

## 5. Pendência registrada na Research, não resolvida nesta fase

A discrepância de fase de rollout (Onda 4 vs Fase 1, ver `spec-7-research-done.md` §2) é conteúdo da Spec 8 e não foi tratada aqui.

## 6. Atualização pós-implementação (mesma sessão) — merge + ajustes pedidos pelo usuário

Após o Implement inicial, o usuário pediu 3 ajustes adicionais, tratados na mesma sessão:

1. **Merge de `origin/main` neste branch.** Descoberta: as Specs 2–6 e 8 (Contexto/Hero, Diagnóstico, Dores, Arquitetura, Iniciativas, Provocações) já estavam implementadas e mergeadas em `main` pelo time, via PRs — este branch havia sido criado antes disso e só tinha Spec 1 + Portal. `git merge origin/main` foi executado sem conflitos. Isso trouxe também uma mudança de navegação feita pelo time: o `Sidebar` antigo foi substituído por uma navegação "Galáxia" (`GalaxyMap`/`Planet`/`planets.ts`), com `App.tsx` controlando estados `splash` → `galaxy` → `module`.
2. **Ícones do portal:** `NAV_ITEMS` em `PortalShell.tsx` usava emojis; substituídos por ícones `lucide-react` (`Home`, `FileText`, `MessageSquare`, `BookOpen`, `ClipboardList`, `TrendingUp`), consistente com `ARCHITECTURE.md` (lucide-react é a biblioteca de ícones do projeto). Também removido um emoji decorativo do texto de saudação em `TelaInicio`.
3. **Modo de protótipo em tela cheia:** ao entrar na seção `portal` (clique no planeta, MiniMap, ou navegação sequencial), `App.tsx` agora renderiza um layout dedicado fora do `Header`/`MiniMap` padrão: uma barra superior de 24px (`bg-gi-navy`) com botão "Voltar" (volta para a Galáxia) à esquerda e "Próximos passos" (navega direto para a seção Provocações) à direita, e abaixo o `PortalShell` em modo `fullscreen` (nova prop), ocupando 100% da viewport restante. `PortalShell` ganhou a logo real da GI Group (`logo-gi-group.png`) no topo da sidebar do protótipo, antes só havia o texto "GI Worker".

**Arquivos adicionais alterados nesta atualização:**
- `src/App.tsx` — nova branch de renderização fullscreen para a seção `portal`.
- `src/components/portal/PortalShell.tsx` — prop `fullscreen`, logo GI, ícones lucide.
- `src/components/portal/TelaInicio.tsx` — remoção de emoji na saudação.

**Verificações repetidas após o merge e os ajustes:** `npx tsc --noEmit` e `npm run build` sem erros.

**Não verificado:** comportamento visual do modo fullscreen em navegador real (sem ferramenta de screenshot disponível neste ambiente) — recomenda-se validação manual antes do PR para `main`.
