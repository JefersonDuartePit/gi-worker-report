# Spec 9 — Research — Navegação Iniciativas → Tela do Portal

**Branch:** `spec/09-portal-navegacao-iniciativas`
**Data:** 2026-07-13
**Fase:** Research (RPI)

---

## 1. Origem da pendência

Pendência registrada em `PROJECT-STATE.md` (Atualização — Spec 7, "Pendência pós-merge") e em `PROJECT-STATE.md` (Atualização — Spec 6, "Pendência pós-merge"):

> Após o merge de `spec/07-portal-do-worker`, revisitar `IniciativasList.tsx` para substituir o `goTo(5)` fixo por navegação para a tela específica de cada iniciativa (`telasRelacionadas[0]`), usando a API interna de `usePortalNav`.

O merge de `spec/07-portal-do-worker` → `main` já foi concluído (PR #10, commit `d8e9bcc`). Esta é a próxima etapa.

## 2. Requisito documentado (não inferido)

`SPECS.md`, Spec 6 — S5 Iniciativas, linha 236:

> "Iniciativas 01, 05, 07, 10, 13 e 17 têm tela relacionada no portal — botão 'Ver tela' abre o portal na tela correspondente."

Não é uma feature nova: é o comportamento original da Spec 6, nunca totalmente implementado — hoje `onVerTela` faz `goTo(5)` fixo (sempre abre o Portal na tela `'inicio'`, independente da iniciativa).

## 3. Estado atual do código

- `IniciativasList.tsx:88` — `onVerTela={() => goTo(5)}`, usa apenas `PresentationContext.goTo(step)` (troca de seção/planeta, não de tela interna do portal).
- `usePortalNav.ts` — hook local, instanciado **dentro** de `PortalShell.tsx:46`. Estado (`screen`) é resetado para `'inicio'` toda vez que `PortalShell` remonta.
- Não existe hoje nenhum canal entre `S5Iniciativas` e `PortalShell` para comunicar "abra o portal, mas na tela X".

## 4. Dados reais (`src/data/iniciativas.ts`)

7 iniciativas têm `telasRelacionadas` (o `SPECS.md` lista 6 — **I14** também tem e não é mencionada no texto da spec, gap de documentação, não bloqueia):

| Iniciativa | `telasRelacionadas` |
|---|---|
| I01 | `['inicio']` |
| I05 | `['documentos']` |
| I07 | `['solicitacoes']` |
| I10 | `['inicio', 'documentos', 'treinamentos', 'desenvolvimento']` |
| I13 | `['rescisao']` |
| I14 | `['rescisao']` |
| I17 | `['inicio']` |

`Iniciativa.telasRelacionadas` é tipado como `string[]` solto em `types/index.ts:21`, não `PortalScreen[]`. Tipar corretamente criaria dependência `types/index.ts → hooks/usePortalNav.ts`, invertendo a camada `data/types → hooks → components` definida em `ARCHITECTURE.md` §4. **Ponto de decisão para o Plan.**

## 5. Restrição arquitetural obrigatória

`CODING-GUIDELINES.md` §6:

> "Estado compartilhado entre seções vai em hooks customizados e, se necessário, em Context. Proibido prop drilling com mais de dois níveis — criar Context ou reestruturar. O Context de apresentação (`PresentationContext`) é o único Context global do projeto."

Conclusão: a tela-alvo do portal **não pode** virar um Context novo. Precisa viajar pelo `PresentationContext` existente (extensão de `PresentationContextValue`) e/ou por elevação (lifting) do estado de `usePortalNav` para `App.tsx`.

## 6. Opções de arquitetura identificadas (decisão fica para o Plan)

1. **Estender `PresentationContextValue`** com `portalTargetScreen` + setter. `PortalShell` passa a ler a tela inicial desse contexto em vez de sempre nascer em `'inicio'`.
2. **Levantar `usePortalNav` para `App.tsx`**, injetar `screen`/`navigate` via prop em `PortalShell`, e expor `navigate` também pelo `PresentationContext` para que `IniciativasList` possa chamá-lo antes do `goTo`.

Ambas respeitam a regra de "único Context global". A diferença é onde a fonte de verdade da tela do portal mora.

## 7. Riscos e gaps de documentação (não bloqueiam, mas registrados)

- `ARCHITECTURE.md` §6 ainda documenta `PortalScreen` com 5 valores (sem `'desenvolvimento'`, adicionado na Spec 7) — doc desatualizada.
- `SPECS.md` Spec 6 não menciona `I14` como tendo tela relacionada, mas o dado existe em `iniciativas.ts`.
- Tipagem de `telasRelacionadas` como `string[]` solto é uma lacuna de type-safety pré-existente (regra "proibido `any`" não é violada, mas a garantia de valores válidos de `PortalScreen` não existe hoje).

## 8. Arquivos envolvidos (mapeamento preliminar — não é a lista final de "Arquivos Permitidos", isso é definido no Plan)

- `src/components/sections/S5Iniciativas/IniciativasList.tsx`
- `src/components/sections/S5Iniciativas/IniciativaCard.tsx` (possivelmente, se a prop mudar de forma)
- `src/components/portal/PortalShell.tsx`
- `src/hooks/usePortalNav.ts`
- `src/App.tsx`
- `src/types/index.ts` (`PresentationContextValue`, possivelmente `Iniciativa.telasRelacionadas`)
- `docs/ARCHITECTURE.md` (atualização de doc, se decidido no Plan)

## 9. Próximo passo

Abrir sessão de **Plan** (sessão isolada, per `CLAUDE.md`), lendo este documento + `CLAUDE.md`, `ARCHITECTURE.md`, `DESIGN-SYSTEM.md`, `CODING-GUIDELINES.md`, `PROJECT-STATE.md`, para decidir entre as opções da seção 6 e produzir `spec-9-plan-done.md`.
