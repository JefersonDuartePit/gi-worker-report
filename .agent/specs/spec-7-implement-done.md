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
- Próxima spec: depende da ordem que o humano definir entre Spec 2 (S1 Hero) e demais specs pendentes — note-se que, pelo histórico de commits, as Specs 2–6 já parecem implementadas em branches próprias (`spec/02-s1-hero` a `spec/06-s5-iniciativas`), faltando apenas Spec 8 (S7 Provocações) além desta Spec 7.

## 5. Pendência registrada na Research, não resolvida nesta fase

A discrepância de fase de rollout (Onda 4 vs Fase 1, ver `spec-7-research-done.md` §2) é conteúdo da Spec 8 e não foi tratada aqui.
