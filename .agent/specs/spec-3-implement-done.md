# spec-3-implement-done.md — S2 Diagnóstico Sistêmico

**Spec:** 3 — S2 Diagnóstico Sistêmico
**Fase:** Implement concluída
**Data:** 2026-06-25
**Executado por:** Agente Implement (Claude)

---

## Status

✅ Concluída — todos os critérios de aceite verificados.

---

## Artefatos Gerados

| Arquivo | Ação |
|---------|------|
| `src/types/index.ts` | Modificado — `problema: string` e `decisaoProposta: string` adicionados à interface `Sistema` |
| `src/data/sistemas.ts` | Modificado — 12 sistemas enriquecidos com `problema` e `decisaoProposta` |
| `src/components/sections/S2Diagnostico/SistemaCard.tsx` | Criado — card com tooltip inline ao hover |
| `src/components/sections/S2Diagnostico/MapaSistemas.tsx` | Criado — grid de 4 quadrantes com filtro |
| `src/components/sections/S2Diagnostico/index.tsx` | Modificado — stub substituído pela seção completa |

---

## Commits

```
fc922fb feat(s2): extend Sistema type with problema and decisaoProposta fields
4d6d887 feat(s2): create SistemaCard with inline hover tooltip
3b8dd35 feat(s2): create MapaSistemas with 4-quadrant grid and filter
b36e88e feat(s2): implement S2 Diagnóstico Sistêmico section
```

---

## Critérios de Aceite — Verificação

| # | Critério | Resultado |
|---|----------|-----------|
| 1 | 4 quadrantes com cores corretas | ✅ Usa=azul, Integra=steel, Substitui=âmbar, Não Toca=vermelho |
| 2 | 12 sistemas distribuídos (Usa=2, Integra=3, Substitui=5, Não Toca=2) | ✅ Playwright: 12 `.group` elements |
| 3 | Tooltip ao hover: Função + Problema + Decisão | ✅ Playwright: `Função:` visível no hover |
| 4 | Filtro por quadrante (não-selecionados → 30% opacidade) | ✅ Visual: Integra/Substitui/Não Toca visivelmente dimmed ao selecionar Usa |
| 5 | Animação stagger de entrada | ✅ `containerVariants` e `cardContainerVariants` implementados |
| 6 | Badge "Intocável" em S03 (Spinner/Fusion) e S04 (Portal do Candidato Global) | ✅ Visual: 2 badges visíveis |
| 7 | `npx tsc --noEmit` sem erros | ✅ Limpo em todos os 4 commits |
| 8 | `bg-white min-h-screen` layout | ✅ Fundo branco, tela cheia confirmado no screenshot |

---

## Desvios do Plano

### Desvio 1 — Correção de conflito Framer Motion / CSS opacity

**Contexto:** O plano especificou `isDimmed && 'opacity-30'` como classe Tailwind na `motion.div` dos quadrantes. Após implementação, o dimming dos quadrantes não era visível: a animação de entrada do Framer Motion (`quadranteVariants` → `opacity: 1`) aplica um `style` inline que sobrescreve a classe CSS.

**Solução adotada:** Substituída a classe `opacity-30` por `animate={{ opacity: isDimmed ? 0.3 : 1 }}` diretamente na `motion.div`, delegando o controle de opacidade ao Framer Motion. O resultado visual é idêntico ao especificado no plano.

**Arquivo afetado:** `src/components/sections/S2Diagnostico/MapaSistemas.tsx`

**Natureza:** Correção técnica — o intento do plano foi preservado, apenas o mecanismo mudou.

---

## Proposta de Atualização do PROJECT-STATE.md

Adicionar a seguinte entrada na seção de histórico e atualizar a tabela de specs:

### Tabela de Specs (seção 2)

Alterar linha da Spec 3:
```
| 3    | S2 — Diagnóstico Sistêmico    | ⬜ Pendente          | —  |
```
Para:
```
| 3    | S2 — Diagnóstico Sistêmico    | ✅ Concluída         | `spec-3-implement-done.md` |
```

### Entrada no histórico (seção 6)

```markdown
### Atualização — Spec 3 — S2 Diagnóstico Sistêmico — 2026-06-25

**Status:** concluída ✅

**Artefatos gerados:**
- `src/types/index.ts` (modificado — novos campos `problema` e `decisaoProposta`)
- `src/data/sistemas.ts` (modificado — 12 sistemas enriquecidos)
- `src/components/sections/S2Diagnostico/SistemaCard.tsx`
- `src/components/sections/S2Diagnostico/MapaSistemas.tsx`
- `src/components/sections/S2Diagnostico/index.tsx`
- `.agent/specs/spec-3-implement-done.md`

**Desvios do plano:**
- `MapaSistemas.tsx`: substituída a classe `opacity-30` por `animate={{ opacity: isDimmed ? 0.3 : 1 }}` na `motion.div` dos quadrantes, para contornar conflito entre Framer Motion inline style e Tailwind CSS. Resultado visual idêntico ao especificado.

**Próxima spec:** Spec 4 — S3 Dores por Persona
```

---

## Aguardando autorização do humano para atualizar PROJECT-STATE.md.
