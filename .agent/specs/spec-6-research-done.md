# spec-6-research-done.md — S5 Iniciativas

**Spec:** 6 — S5 Iniciativas
**Fase:** Research concluído
**Data:** 2026-06-26
**Branch:** `spec/06-s5-iniciativas`
**Executado por:** Agente Research (Claude)

---

## 1. O que a Spec pede

Fonte: `SPECS.md §Spec 6`

### Conteúdo obrigatório

| Item | Descrição |
|------|-----------|
| 17 cards de iniciativa | Titles fiéis ao documento do workshop, IDs 01–17 visíveis |
| Filtro por jornada | Todos / Admissão / Ciclo Ativo / Offboarding |
| Filtro por persona | Todos / Worker / Colaborador GI / Cliente |
| Card expansível | Clique expande descrição técnica completa e sistema substituído |
| Indicadores de impacto e esforço | Barras visuais (`ProgressBar` existente) |
| Botão "Ver tela" | Para iniciativas com tela relacionada no portal — navega para o planeta S6 |

### Critérios de aceite

- [ ] 17 iniciativas mapeadas com títulos fiéis ao documento do workshop
- [ ] Filtros por jornada e persona funcionais
- [ ] Card expandível com descrição técnica completa
- [ ] Botão "Ver tela" funcional para iniciativas com tela no portal
- [ ] Badges de impacto e esforço visualmente distintos
- [ ] IDs numéricos (01–17) visíveis em cada card

---

## 2. Decisões de Design do Sistema

Fonte: `DESIGN-SYSTEM.md §7`

- **Fundo da seção:** `gi-light` (cinza claro)
- **Tom visual:** "Cards de iniciativas"
- **Seção ocupa:** mínimo 100vh
- **Animações:** Framer Motion, máximo 400ms entrada, 200ms micro-interações
- **Tipografia e cores:** tokens GI — nunca hex hard-coded

---

## 3. Estado atual dos dados

### 3.1 `src/data/iniciativas.ts` — INICIATIVAS

**Já existe e está completo.** 17 iniciativas tipadas e populadas desde a Spec 1. Nenhuma modificação necessária.

### 3.2 `src/types/index.ts` — interface `Iniciativa`

Já existe com todos os campos necessários para a spec:

```typescript
export interface Iniciativa {
  id: string               // 'I01'–'I17' — exibir sem prefixo 'I'
  titulo: string
  descricao: string
  jornada: Jornada
  personas: Persona[]
  doresResolvidas: string[]
  sistemaSubstituido?: string
  esforco: Esforco         // 'baixo' | 'medio' | 'alto'
  impacto: Impacto         // 'baixo' | 'medio' | 'alto'
  telasRelacionadas?: string[]
}
```

**Nenhum tipo novo é necessário.**

### 3.3 Iniciativas com botão "Ver tela"

Regra: exibir botão "Ver tela" quando `telasRelacionadas` existir e for não-vazio.

Iniciativas que satisfazem essa condição nos dados:

| ID | Tela relacionada |
|----|-----------------|
| I01 | `inicio` |
| I05 | `documentos` |
| I07 | `solicitacoes` |
| I10 | `inicio`, `documentos`, `treinamentos` |
| I13 | `rescisao` |
| I14 | `rescisao` |
| I17 | `inicio` |

> **Nota:** SPECS.md lista apenas I01, I05, I07, I10, I13, I17 explicitamente. I14 tem `telasRelacionadas` nos dados desde a Spec 1 — o botão será exibido para ela também (lógica baseada no dado, não na lista hard-coded da spec).

---

## 4. Comportamento dos filtros

**Dois eixos independentes, combinados com lógica AND:**

- Filtro de jornada: `'todos' | 'admissao' | 'ciclo-ativo' | 'offboarding'`
- Filtro de persona: `'todos' | 'worker' | 'colaborador-gi' | 'cliente'`
- Cada eixo tem sua opção "Todos" independente
- Uma iniciativa aparece se satisfaz ambos os filtros ativos simultaneamente
- Ao mudar qualquer filtro, o card expandido fecha (mesma lógica da S3Dores)

**Não exibir contadores por filtro** — com dois eixos simultâneos os contadores seriam confusos (dependem da combinação ativa).

---

## 5. Botão "Ver tela" — decisão arquitetural

**Abordagem escolhida: navegação simples para o planeta S6 Portal.**

O botão usa `PresentationContext.goTo(índice do S6Portal)` para navegar ao planeta do portal. Não há deep-link para tela específica dentro do portal.

**Justificativa:** o objetivo do botão no contexto do relatório executivo é demonstrar que existe uma tela correspondente — não é um fluxo de produto. O usuário chega no portal e navega via sidebar (5 telas, esforço mínimo). Deep-linking exigiria coordenação com a branch `spec/07-portal-do-worker` (arquivos exclusivos), adicionando risco de conflito sem valor proporcional para o público-alvo (Carol e Jansen).

**Implementação:** `PresentationContext` está disponível via `useContext` nos componentes de seção. O índice do planeta S6Portal é a posição 5 no array `SECTIONS` (0-indexed), confirmável em `App.tsx` na fase Plan.

---

## 6. Componentes do design system a reutilizar

| Uso | Componente existente |
|-----|---------------------|
| Badge de jornada | `Badge` — variantes `admissao`, `ciclo`, `offboarding` |
| Tag de persona | `Tag` — variantes `worker`, `colaborador-gi`, `cliente` |
| Indicadores impacto/esforço | `ProgressBar` — já implementado |
| Card clicável/expansível | `Card` — variantes `hoverable`, `highlighted` |
| Animação de entrada | Framer Motion `sectionVariants` — padrão existente |
| Animação de expansão | Framer Motion `AnimatePresence` — padrão do `DorCard` |
| Botão "Ver tela" | `Button` — variante `ghost` ou `secondary` |

**Nenhum componente UI novo a criar.**

---

## 7. Indicadores de impacto e esforço

Os valores `impacto` e `esforco` são `'baixo' | 'medio' | 'alto'`. Mapeamento para `ProgressBar`:

| Valor | % da barra |
|-------|-----------|
| `baixo` | 33% |
| `medio` | 66% |
| `alto` | 100% |

A cor da barra de impacto usa `gi-blue` (padrão do `ProgressBar`). A barra de esforço usa cor diferenciada — `gi-amber` — para distinguir os dois eixos visualmente (implementar via `className` override no container ou inline style no fill, único caso aceitável de valor dinâmico).

> **Nota:** `ProgressBar` atual usa `bg-gi-blue` hard-coded no fill. Para esforço, precisará de uma variação. Abordagem: passar prop `color?: string` no `ProgressBar` ou criar wrapper local no `IniciativaCard`. Decidir na fase Plan.

---

## 8. Matriz impacto × esforço

**Não implementar na Spec 6.** A spec a define como "opcional como visão complementar". As barras nos cards já comunicam os dois eixos. A matriz exigiria componente adicional com posicionamento em grid sem valor proporcional para a apresentação executiva.

---

## 9. Arquivos a criar / modificar

| Operação | Arquivo |
|----------|---------|
| Substituir stub | `src/components/sections/S5Iniciativas/index.tsx` |
| Criar | `src/components/sections/S5Iniciativas/IniciativaCard.tsx` |
| Criar | `src/components/sections/S5Iniciativas/IniciativasList.tsx` |

**Sem alterações** em dados, tipos, ou componentes de outras seções.

### Arquivos explicitamente não tocados

| Arquivo | Motivo |
|---------|--------|
| `src/data/iniciativas.ts` | Já completo — não tocar |
| `src/types/index.ts` | Nenhum tipo novo necessário — não tocar |
| `src/data/dores.ts`, `sistemas.ts`, `arquitetura.ts` | Outras specs |
| `src/components/portal/` | Branch `spec/07` — proibido |
| `src/components/sections/S6Portal/` | Branch `spec/07` — proibido |
| `src/hooks/usePortalNav.ts` | Branch `spec/07` — proibido |

---

## 10. Riscos e observações

| Risco | Severidade | Mitigação |
|-------|-----------|-----------|
| `ProgressBar` não tem prop de cor para a barra de esforço | Baixa | Definir abordagem na fase Plan (prop extra ou wrapper local) |
| Filtro AND pode resultar em zero cards para combinações raras | Baixa | Exibir mensagem "Nenhuma iniciativa encontrada para os filtros selecionados" |
| Navegação para S6Portal via `goTo` depende do índice correto no array `SECTIONS` | Baixa | Confirmar índice em `App.tsx` na fase Plan antes de hardcodar |

---

## 11. Resumo

A Spec 6 implementa a seção **S5 — Iniciativas** com:

1. **Lista filtrada** de 17 iniciativas com dois eixos de filtro (jornada × persona, lógica AND)
2. **Cards expansíveis** com ID numérico, título, descrição, badges, barras de impacto/esforço e sistema substituído
3. **Botão "Ver tela"** para 7 iniciativas com `telasRelacionadas` — navega para o planeta S6 Portal via `PresentationContext.goTo`

**Dados:** já completos em `src/data/iniciativas.ts` — zero modificações.
**Tipos:** já completos em `src/types/index.ts` — zero modificações.
**Novos componentes:** 2 (`IniciativaCard.tsx`, `IniciativasList.tsx`)
**Componente modificado:** 1 (`S5Iniciativas/index.tsx` — stub substituído)

**Sem riscos bloqueantes.** Pronto para iniciar a fase Plan.
