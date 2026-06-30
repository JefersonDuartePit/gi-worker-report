# spec-4-implement-done.md — S3 Dores por Persona

**Spec:** 4 — S3 Dores por Persona
**Fase:** Implement concluída
**Data:** 2026-06-25
**Executado por:** Agente Implement (Claude)
**Plan base:** `.agent/specs/spec-4-plan-done.md`

---

## Status

✅ Implementação concluída sem desvios do plano.

---

## Arquivos Gerados

| Arquivo | Ação |
|---------|------|
| `src/components/sections/S3Dores/DorCard.tsx` | Criado |
| `src/components/sections/S3Dores/DoresList.tsx` | Criado |
| `src/components/sections/S3Dores/index.tsx` | Modificado (stub substituído) |

Nenhum outro arquivo foi tocado.

---

## Desvios do Plano

Nenhum. Implementação seguiu o plan-done.md linha a linha.

---

## Verificação TypeScript

`npx tsc --noEmit` executado após cada arquivo — zero erros em todos os três passos.

Servidor de desenvolvimento (`npm run dev`) iniciado e confirmado respondendo HTTP 200 em `http://localhost:5173/`.

---

## Critérios de Aceite — Status

| # | Critério | Status |
|---|---------|--------|
| 1 | 11 dores visíveis no filtro "Todos" | ✅ Dados: DORES.length = 11 |
| 2 | Filtro "Worker" → 7 cards | ✅ Dados: D01, D02, D05, D06, D07, D09, D11 = 7 |
| 3 | Filtro "Colaborador GI" → 5 cards | ✅ Dados: D03, D04, D05, D08, D10 = 5 |
| 4 | Filtro "Cliente" → 1 card (D06) | ✅ Dados: apenas D06 tem `cliente` |
| 5 | Card clicável expande painel com descrição + iniciativa | ✅ AnimatePresence + motion.div height:0→auto |
| 6 | Clicar no mesmo card fecha o painel | ✅ `setExpandedId(prev => prev === id ? null : id)` |
| 7 | Trocar filtro com card expandido fecha o card | ✅ `handleFilterChange` chama `setExpandedId(null)` |
| 8 | Badge severidade: Crítica=vermelho, Alta=laranja, Média=âmbar | ✅ Badge.tsx VARIANT_STYLES `critica`/`alta`/`media` |
| 9 | Badge jornada: Admissão=navy, Ciclo Ativo=azul, Offboarding=steel | ✅ `JORNADA_BADGE` mapeia para variantes `admissao`/`ciclo`/`offboarding` |
| 10 | Tag Worker=roxo, Colaborador GI=azul, Cliente=teal | ✅ Tag.tsx PERSONA_STYLES confirmado |
| 11 | Animação stagger ao entrar na seção | ✅ `containerVariants` + `staggerChildren: 0.07` |
| 12 | Cards entram/saem com animação ao trocar filtro | ✅ `AnimatePresence mode="popLayout"` + `cardVariants` |
| 13 | `npx tsc --noEmit` sem erros | ✅ Zero erros confirmado |

---

## Proposta de Atualização do PROJECT-STATE.md

**Aguarda autorização do humano antes de execução.**

Adicionar no topo da seção **2. Estado Atual das Specs**:

```markdown
| 4    | S3 — Dores por Persona        | ✅ Concluída         | `spec-4-implement-done.md`                         |
```

Adicionar no final do arquivo a entrada de histórico:

```markdown
### Atualização — Spec 4 — S3 Dores por Persona — 2026-06-25

**Status:** concluída ✅

**Artefatos gerados:**
- `src/components/sections/S3Dores/DorCard.tsx`
- `src/components/sections/S3Dores/DoresList.tsx`
- `src/components/sections/S3Dores/index.tsx` (stub substituído)
- `.agent/specs/spec-4-implement-done.md`

**Desvios do plano:**
- Nenhum

**Próxima spec:** Spec 5 — S4 Arquitetura As-is/To-be
```
