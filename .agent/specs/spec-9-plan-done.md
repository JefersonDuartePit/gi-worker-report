# Spec 9 — Plan — Navegação Iniciativas → Tela do Portal

**Branch:** `spec/09-portal-navegacao-iniciativas`
**Fase:** Plan (RPI)
**Lê:** `spec-9-research-done.md`, `CLAUDE.md`, `ARCHITECTURE.md`, `CODING-GUIDELINES.md`, `PROJECT-STATE.md`

---

## Contexto

Pendência registrada desde a Spec 6 e reconfirmada no merge da Spec 7 (`PROJECT-STATE.md`,
"Pendência pós-merge"): o botão "Ver tela →" de cada iniciativa em `IniciativasList.tsx`
sempre executa `goTo(5)`, que apenas troca a seção ativa da apresentação para o planeta
"Portal do Worker" — mas o Portal sempre abre na tela `'inicio'`, porque `usePortalNav`
é instanciado localmente dentro de `PortalShell` e não recebe nenhuma informação de qual
tela deveria ser exibida.

O requisito documentado (`SPECS.md`, Spec 6 — S5 Iniciativas) é que iniciativas com
`telasRelacionadas` abram o Portal diretamente na tela correspondente
(`telasRelacionadas[0]`). Hoje isso nunca acontece.

A pendência é puramente de "fiação" entre duas partes já existentes e corretas:
`IniciativasList` (sabe qual tela quer) e `PortalShell`/`usePortalNav` (sabe navegar
internamente). Falta um canal entre elas.

## Decisão de arquitetura

`CODING-GUIDELINES.md` §6 permite apenas um Context global (`PresentationContext`) e proíbe
prop drilling com mais de 2 níveis. As duas opções levantadas no research:

1. **Estender `PresentationContextValue`** com um campo de "tela-alvo do portal" + setter.
2. **Levantar `usePortalNav` para `App.tsx`** e passar `screen`/`navigate` via prop para
   `PortalShell` nos dois pontos onde ele é renderizado (`App.tsx` fullscreen e
   `S6Portal/index.tsx`), expondo `navigate` também pelo Context.

**Escolhida: Opção 1.** Justificativa:

- É a mudança mínima — adiciona 1 par de campos ao Context já existente, sem alterar a
  árvore de props de `PortalShell` nem seu comportamento de "sempre nasce em `'inicio'`"
  quando aberto sem tela-alvo (útil e correto: navegação manual pelo MiniMap/planeta deve
  continuar abrindo em `'inicio'`).
- A Opção 2 exigiria threading de `screen`/`navigate` por prop em dois pontos de uso de
  `PortalShell` (`App.tsx` e `S6Portal/index.tsx`) só para resolver um caso de navegação
  que só acontece em um desses pontos — mais código para o mesmo resultado.
- Mantém a regra de "único Context global": não cria um Context novo, apenas estende o
  existente.
- **Evita inverter a camada `data/types → hooks → components`** (`ARCHITECTURE.md` §4):
  o novo campo do Context é tipado como `string | null`, no mesmo padrão já usado por
  `Iniciativa.telasRelacionadas?: string[]` (`types/index.ts:21`) — não importa
  `PortalScreen` de `hooks/usePortalNav.ts` dentro de `types/index.ts`. A validação do
  valor contra os `PortalScreen` conhecidos acontece na camada de hooks (`usePortalNav.ts`),
  via um type guard novo, não na camada de tipos.

Fora de escopo (não implementar, apenas registrado): `docs/ARCHITECTURE.md` §6 ainda lista
`PortalScreen` com 5 valores (falta `'desenvolvimento'`, adicionado na Spec 7) e `SPECS.md`
não menciona `I14` como tendo tela relacionada. São gaps de documentação pré-existentes e
não bloqueiam esta spec — não serão corrigidos aqui.

---

## Passo a passo

### 1. `src/hooks/usePortalNav.ts` — type guard de validação

Adicionar, após a definição de `PortalScreen`:

```typescript
const PORTAL_SCREENS: PortalScreen[] = [
  'inicio', 'documentos', 'solicitacoes', 'treinamentos', 'rescisao', 'desenvolvimento',
]

export function isPortalScreen(value: string): value is PortalScreen {
  return (PORTAL_SCREENS as string[]).includes(value)
}
```

### 2. `src/hooks/usePresentation.ts` — estado da tela-alvo do portal

Adicionar estado e retorná-lo junto ao restante do hook:

```typescript
const [portalTargetScreen, setPortalTargetScreen] = useState<string | null>(null)
// ...
return { mode, currentStep, next, prev, toggle, goTo, portalTargetScreen, setPortalTargetScreen }
```

### 3. `src/types/index.ts` — estender `PresentationContextValue`

Adicionar dois campos à interface existente (linha 54-61):

```typescript
export interface PresentationContextValue {
  mode: 'presentation' | 'exploration'
  currentStep: number
  next: () => void
  prev: () => void
  toggle: () => void
  goTo: (step: number) => void
  portalTargetScreen: string | null
  setPortalTargetScreen: (screen: string | null) => void
}
```

### 4. `src/App.tsx` — valor default do Context

Atualizar o `createContext<PresentationContextValue>({ ... })` (linha 22-29) para incluir
os dois novos campos no objeto default:

```typescript
export const PresentationContext = createContext<PresentationContextValue>({
  mode: 'exploration',
  currentStep: 0,
  next: () => undefined,
  prev: () => undefined,
  toggle: () => undefined,
  goTo: () => undefined,
  portalTargetScreen: null,
  setPortalTargetScreen: () => undefined,
})
```

Nenhuma outra mudança em `App.tsx` — `usePresentation()` já retorna o objeto completo que
é passado como `value` do Provider, então os novos campos já fluem automaticamente.

### 5. `src/components/sections/S5Iniciativas/IniciativasList.tsx` — disparar a tela-alvo

- Importar `type { Iniciativa }` de `'../../../types'` (junto ao import existente de
  `Jornada, Persona`).
- Trocar `const { goTo } = useContext(PresentationContext)` por
  `const { goTo, setPortalTargetScreen } = useContext(PresentationContext)`.
- Adicionar a função (antes do `return`):

```typescript
function handleVerTela(iniciativa: Iniciativa) {
  const targetScreen = iniciativa.telasRelacionadas?.[0]
  if (targetScreen) {
    setPortalTargetScreen(targetScreen)
  }
  goTo(5)
}
```

- Trocar `onVerTela={() => goTo(5)}` por `onVerTela={() => handleVerTela(i)}` no `.map`.

Nenhuma mudança em `IniciativaCard.tsx` — a prop `onVerTela: () => void` não muda de forma.

### 6. `src/components/portal/PortalShell.tsx` — consumir a tela-alvo no mount

- Importar `useContext, useEffect` de `'react'` (adicionar aos imports existentes).
- Importar `PresentationContext` de `'../../App'`.
- Importar `isPortalScreen` de `'../../hooks/usePortalNav'` (junto ao import existente de
  `usePortalNav`/`PortalScreen`).
- Dentro do componente, após `const { screen, navigate } = usePortalNav()`:

```typescript
const { portalTargetScreen, setPortalTargetScreen } = useContext(PresentationContext)

useEffect(() => {
  if (portalTargetScreen && isPortalScreen(portalTargetScreen)) {
    navigate(portalTargetScreen)
  }
  if (portalTargetScreen !== null) {
    setPortalTargetScreen(null)
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [portalTargetScreen])
```

Efeito roda uma vez por montagem de `PortalShell` (o componente é desmontado/remontado a
cada abertura/fechamento do modo fullscreen via `AnimatePresence` em `App.tsx`), navega
para a tela-alvo se houver uma pendente, e limpa o valor do Context logo em seguida — assim
uma reabertura futura do Portal sem passar por "Ver tela" continua nascendo em `'inicio'`.

---

## Arquivos Permitidos

- `src/hooks/usePortalNav.ts`
- `src/hooks/usePresentation.ts`
- `src/types/index.ts`
- `src/App.tsx`
- `src/components/sections/S5Iniciativas/IniciativasList.tsx`
- `src/components/portal/PortalShell.tsx`

Nenhum outro arquivo deve ser modificado nesta spec (inclui `IniciativaCard.tsx`,
`S6Portal/index.tsx`, `docs/ARCHITECTURE.md`, `docs/SPECS.md` — fora de escopo, ver seção
"Decisão de arquitetura" acima).

---

## Verificação

1. `npx tsc --noEmit` — sem erros de tipo (nenhum `any` introduzido).
2. `npm run build` — build de produção sem erros.
3. `npm run dev` e validação manual no navegador:
   - Ir até a seção Iniciativas (planeta 5), expandir I01 → "Ver tela →" deve abrir o
     Portal na tela **Início**.
   - Expandir I05 → "Ver tela →" deve abrir o Portal na tela **Documentos**.
   - Expandir I07 → tela **Solicitações**.
   - Expandir I10 → primeira tela da lista, **Início** (`telasRelacionadas[0]`).
   - Expandir I13 ou I14 → tela **Rescisão**.
   - Expandir I17 → tela **Início**.
   - Fechar o Portal ("Voltar") e reabrir via clique direto no planeta Portal (sem passar
     por Iniciativas) → deve abrir em **Início** (comportamento default preservado).
   - Dentro do Portal, navegar manualmente pela sidebar/bottom nav entre telas → deve
     continuar funcionando normalmente (sem regressão).

---

## Próximo passo

Abrir sessão de **Implement** (sessão isolada, per `CLAUDE.md`), lendo `CLAUDE.md`, este
documento (`spec-9-plan-done.md`) e `PROJECT-STATE.md`, para implementar exatamente o
passo a passo acima.
