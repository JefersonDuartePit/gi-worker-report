# Spec 9 — Implement — Navegação Iniciativas → Tela do Portal

**Branch:** `spec/09-portal-navegacao-iniciativas`
**Fase:** Implement (RPI)
**Executou:** `.agent/specs/spec-9-plan-done.md` (passo a passo integral, sem desvios)

---

## Resultado

Implementado exatamente o passo a passo do plano. `IniciativasList.tsx` agora informa
ao `PortalShell` qual tela abrir via um canal novo no `PresentationContextValue`
(`portalTargetScreen` / `setPortalTargetScreen`), consumido no mount do `PortalShell`
via `useEffect`. Navegação manual (planeta Portal direto, sidebar/bottom nav) continua
nascendo/operando em `'inicio'` sem alteração de comportamento.

## Arquivos modificados

* `src/hooks/usePortalNav.ts` — adicionado array `PORTAL_SCREENS` e type guard `isPortalScreen(value: string): value is PortalScreen`.
* `src/hooks/usePresentation.ts` — adicionado estado `portalTargetScreen` (`string | null`) e setter, incluídos no retorno do hook.
* `src/types/index.ts` — `PresentationContextValue` estendida com `portalTargetScreen: string | null` e `setPortalTargetScreen: (screen: string | null) => void`.
* `src/App.tsx` — valor default do `createContext<PresentationContextValue>` atualizado com os dois novos campos. Nenhuma outra mudança.
* `src/components/sections/S5Iniciativas/IniciativasList.tsx` — importa `type { Iniciativa }`; consome `setPortalTargetScreen` do Context; nova função `handleVerTela(iniciativa)` que seta `portalTargetScreen` (via `telasRelacionadas?.[0]`) antes de `goTo(5)`; `onVerTela` do `.map` trocado para `() => handleVerTela(i)`.
* `src/components/portal/PortalShell.tsx` — importa `useContext, useEffect`, `PresentationContext` e `isPortalScreen`; `useEffect` de mount que navega para `portalTargetScreen` (se válido) e limpa o valor do Context em seguida.

Nenhum arquivo fora da lista de "Arquivos Permitidos" do plano foi tocado (confirmado
via `git status --short`).

## Desvios do plano

Nenhum. Implementação segue o passo a passo do `spec-9-plan-done.md` linha a linha.

## Verificação

1. **`npx tsc --noEmit`** — ✅ sem erros de tipo, nenhum `any` introduzido.
2. **`npm run build`** — ✅ build de produção sem erros (bundle 374.20 kB / 115.03 kB gzip).
3. **Validação manual no navegador** — ⚠️ **parcial / inconclusiva por limitação de ambiente**.
   O Browser pane desta sessão marca a aba como `document.hidden = true` (backgrounded),
   o que faz o Chromium suspender o pipeline de pintura/compositor. Como o app usa
   `AnimatePresence mode="wait"` (Framer Motion) para as transições `splash → galaxy →
   module`, a transição inicial nunca chega a pintar visualmente nessa aba, embora o
   estado React interno avance corretamente (confirmado inspecionando a fiber do React:
   `uiState` mudou de `'splash'` para `'galaxy'` após disparar o `onClick` da splash,
   via `props.onClick()` extraído do fiber). Esse comportamento é anterior a esta spec —
   não foi introduzido pelas mudanças acima — e está isolado à camada de transição de
   tela cheia, não ao Context/hooks alterados aqui.

   Dado o bloqueio de pintura, não foi possível validar visualmente os 7 casos da seção
   "Verificação" do plano (I01→Início, I05→Documentos, I07→Solicitações, I10→Início,
   I13/I14→Rescisão, I17→Início, reabertura via planeta→Início, navegação manual
   sem regressão) diretamente no navegador nesta sessão.

   **Verificação alternativa realizada:** revisão de código linha a linha dos 6
   arquivos alterados contra o plano, e conferência dos dados-fonte
   (`src/data/iniciativas.ts`) confirmando que `telasRelacionadas[0]` de cada
   iniciativa citada no plano corresponde exatamente à tela esperada:
   - I01 → `['inicio']` → Início
   - I05 → `['documentos']` → Documentos
   - I07 → `['solicitacoes']` → Solicitações
   - I10 → `['inicio', 'documentos', 'treinamentos', 'desenvolvimento']` → Início (primeiro item)
   - I13 → `['rescisao']` → Rescisão
   - I14 → `['rescisao']` → Rescisão
   - I17 → `['inicio']` → Início

   **Recomendação:** validar manualmente em navegador real (fora deste ambiente de
   automação) antes do merge para `main`, seguindo os 8 casos da seção "Verificação"
   de `spec-9-plan-done.md`.

## Próximo passo

Validação manual em navegador real (recomendada antes do merge), depois merge de
`spec/09-portal-navegacao-iniciativas` → `main`.
