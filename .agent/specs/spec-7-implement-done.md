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

## 7. Segunda rodada de ajustes (mesma sessão) — refinamento visual e funcional do protótipo

O usuário revisou o resultado e apontou 5 problemas concretos, todos corrigidos:

1. **Tooltips clipados/atrás de outros elementos.** Causa raiz: `DorTooltip` usava `position: absolute` dentro de containers com `overflow-hidden`/`overflow-y-auto` (ex.: `<main>` do `PortalShell`), então o tooltip era cortado pelo ancestral com overflow, independente do `z-index`. Correção: `DorTooltip` agora calcula a posição via `getBoundingClientRect()` no hover e renderiza o tooltip com `createPortal` direto em `document.body`, com `position: fixed` e `z-[9999]` — fica sempre na camada mais alta, sem ser cortado por nenhum ancestral.
2. **Tooltip nem sempre no elemento certo.** Em várias telas o `DorTooltip` envolvia só o título da seção, não o elemento funcional que de fato resolve a dor. Movido para envolver: a lista de documentos (`TelaDocumentos`), o botão "Nova solicitação" (`TelaSolicitacoes`), o card da trilha de treinamento (`TelaTreinamentos`), e adicionado um segundo tooltip (I14) no botão "Falar com o time GI" (`TelaRescisao`).
3. **Logo "dentro de um container azul" malfeito.** Removida a logo da GI Group + texto duplicado "GI Worker" / "Portal do Colaborador" empilhados. O usuário forneceu um SVG de logo dedicado ao produto (`logo-worker-portal.svg`, salvo em `src/assets/`); `PortalShell` agora usa só esse SVG (branco, já compatível com o fundo `gi-navy` da sidebar) com um subtítulo único e discreto abaixo.
4. **Status de admissão não era clicável.** `TelaInicio` agora tem cada etapa da admissão como um item expansível (ícone `ChevronDown` que gira, animação de altura via Framer Motion) revelando data prevista/realizada e responsável — torna a jornada navegável, não apenas decorativa.
5. **Pouco dado mock.** Conteúdo ilustrativo expandido em todas as telas: `TelaDocumentos` (4→6 documentos com categoria e data), `TelaSolicitacoes` (2→3 tickets com datas), `TelaTreinamentos` (módulos com duração, marcos 30/60/90 com "foco"), `TelaRescisao` (4→5 etapas com datas), `TelaDesenvolvimento` (3→4 registros com "registrado por"), `TelaInicio` (etapas de admissão com data e responsável).

**Arquivo de asset novo:** `src/assets/logo-worker-portal.svg`.

**Arquivos alterados nesta rodada:** `DorTooltip.tsx`, `PortalShell.tsx`, `TelaInicio.tsx`, `TelaDocumentos.tsx`, `TelaSolicitacoes.tsx`, `TelaTreinamentos.tsx`, `TelaRescisao.tsx`, `TelaDesenvolvimento.tsx`.

**Verificações:** `npx tsc --noEmit` e `npm run build` sem erros após cada arquivo alterado.

**Ainda não verificado:** validação visual em navegador real (sem ferramenta de screenshot neste ambiente) — o comportamento de posicionamento do tooltip via `getBoundingClientRect` deveria ser confirmado manualmente, especialmente no modo fullscreen.

**Pendência explícita não resolvida:** o pedido "parece que precisa refazer tudo do zero pra ter concisão" e "não vejo o estilo do site [gigroupholding.com] refletido" foram tratados como uma lista de problemas concretos e corrigidos pontualmente, não como um redesenho completo via novo ciclo Research→Plan. Se o usuário ainda achar a experiência inconsistente após essas correções, uma nova sessão de Research dedicada à revisão visual do protótipo é o caminho recomendado pelo `CLAUDE.md`.

## 8. Terceira rodada — refatoração visual e de arquitetura de informação completa

A correção pontual da rodada 2 não foi suficiente. O usuário apontou que o problema era estrutural: arquitetura de informação genérica (telas organizadas por funcionalidade, não por jornada), hierarquia visual rasa (tudo `text-xs`/`text-sm` sem escala real), e uso de padrões visuais inventados (borda lateral no item ativo do menu) que não existem nem na referência nem no site real. O usuário forneceu uma referência adicional (`src/ref/Portal da GI/`, um export Figma Make) e pediu para usá-la como base de execução visual — mas deixou claro que a persona/funcionalidade dela (painel interno de analista CARE para acompanhar admissão) **não** deve ser migrada; só os padrões de UI.

**Pesquisa feita antes de redesenhar:**
- `curl` direto em `gigroupholding.com` (não só `WebFetch`, que não enxerga CSS) → confirmou `#00145A` e `#1D57FB` como as cores reais mais usadas (já corretas no projeto), fonte Lato/Roboto (já correta), mas revelou `border-radius` real de ~8px e `box-shadow` suave e difuso (`0 2px 45px rgba(169,169,169,.5)`) — bem mais discreto que o `shadow-xl`/`rounded-2xl` que estávamos usando.
- `WebFetch` em `gigroupholding.com/our-company/` → confirmou narrativa story-first, hierarquia tipográfica forte (títulos grandes vs. corpo pequeno), espaçamento generoso entre seções, uso de timeline cronológica como dispositivo narrativo.
- Explorado `src/ref/Portal da GI/` (agente dedicado) → extraído o padrão real de componentes: `StatCard` (fundo branco, `shadow-sm`, acento de borda **superior** colorido, não preenchimento), `StatusBadge` (pílula com ponto colorido), sidebar com estado ativo = **só troca de fundo** (`bg-[#1d293d]`, sem borda/contorno), topbar com ícone + título + separador + meta.

**Mudanças estruturais:**
1. **`docs/DESIGN-SYSTEM.md` §8 reescrita** com: princípio de IA (jornada > funcionalidades), paleta/sombra corrigidas (`shadow-sm`, nunca `shadow-xl`/`2xl`), escala tipográfica real do portal, especificação dos componentes `StatCard`/`StatusPill`/sidebar/topbar, proibição explícita de acento de borda lateral em item ativo.
2. **Novos componentes isolados em `src/components/portal/`:** `StatusPill.tsx` (pílula + ponto, substitui o uso de `ui/Badge` no portal), `StatCard.tsx` (métrica com acento de borda superior), `JornadaOverview.tsx` (**novo** — stepper de 3 estágios Admissão → Ciclo Ativo → Offboarding, clicável, com atalhos diretos para Documentos/Solicitações/Treinamentos/Desenvolvimento). Este último resolve diretamente "não está claro as jornadas aqui" / "maior visão 360 dos fluxos".
3. **`PortalShell.tsx` reescrito:** removida a borda lateral azul do item ativo do menu (agora só `bg-white/10`, igual à referência); logo do portal sem mais nenhum texto redundante embaixo; topbar interna no padrão ícone+título+separador+meta; sombra do shell trocada de `shadow-xl`/`rounded-2xl` para `shadow-sm`/`rounded-xl`.
4. **Todas as 6 telas reescritas** usando `StatusPill`/`StatCard`, hierarquia tipográfica real (`text-xl font-bold text-gi-navy` para título de tela, `text-[10px] uppercase tracking-widest` para labels, `text-3xl font-bold` para métricas), cards `shadow-sm` em vez de bordas planas sem elevação.
5. **`TelaInicio.tsx`** agora abre com `JornadaOverview` antes de qualquer métrica — a admissão (antes a única coisa visível) passou a ser um card secundário colapsável ("Histórico da admissão"), porque ela é só uma etapa já concluída, não o centro da experiência do ciclo ativo.

**Problema de infraestrutura encontrado e corrigido:** `src/ref/Portal da GI/` é um app standalone completo (com suas próprias dependências shadcn/radix) que estava sendo capturado pelo `tsc`/Tailwind do projeto principal (`tsconfig.json` incluía `src` sem exclusão), quebrando o type-check com dezenas de erros de módulo não encontrado. Corrigido com `"exclude": ["src/ref"]` em `tsconfig.json` e um glob negativo (`'!./src/ref/**'`) em `tailwind.config.ts`.

**Arquivos novos:** `src/components/portal/StatusPill.tsx`, `StatCard.tsx`, `JornadaOverview.tsx`.
**Arquivos reescritos:** `PortalShell.tsx` e as 6 `Tela*.tsx`.
**Arquivos de config corrigidos:** `tsconfig.json`, `tailwind.config.ts`.
**Documentação atualizada:** `docs/DESIGN-SYSTEM.md` §8.

**Verificação:** `npx tsc --noEmit` e `npm run build` sem erros (1920 módulos, bundle 370KB/114KB gzip).

**Ainda não verificado:** renderização real em navegador. O `JornadaOverview` e os novos cards não foram visualmente confirmados — esta é a maior lacuna de verificação até agora, dado que toda a sessão foi sobre qualidade visual.
