# spec-2-implement-done.md — Spec 2 · S1 Hero

**Data:** 2026-06-25
**Fase:** Implement concluída
**Branch:** spec/02-s1-hero
**Commit:** ffc6227

---

## O que foi feito

Substituído o placeholder de `src/components/sections/S1Hero/index.tsx` pelo componente completo conforme `spec-2-plan-done.md`:

- `useCountUp` — hook RAF-based animando de 0 ao valor-alvo em 800ms
- `MetricCounter` — card de métrica com contador animado (valor + sufixo + label)
- `S1Hero` — seção completa com:
  - Logo GI Group + separador vertical + Logo Perform IT
  - Título "Centralização CARE & SMS / Jornada do Worker" (text-5xl bold)
  - Subtítulo gi-stardust + linha de data/versão gi-crater
  - 3 cards de métrica: 5 dias / 3 jornadas / 17 iniciativas
  - Botão CTA "Iniciar a leitura" chamando `presentation.next()`
  - Animação fadeInUp de entrada (400ms via Framer Motion)

---

## Desvios do plano

**1 desvio — arquivo extra criado:** `src/vite-env.d.ts`

- **Causa:** o projeto não possuía `/// <reference types="vite/client" />`, boilerplate padrão do Vite para declarar tipos de imports de assets estáticos (`.png`, `.svg`). Sem ele, `npx tsc --noEmit` retornava TS2307 para `logo-gi-group.png` e `logo-perform-it.svg`.
- **Autorização:** explícita pelo humano (opção A) durante a implementação.
- **Impacto:** nenhum sobre lógica ou UI — é apenas uma declaração de tipos. Resolve também qualquer futura importação de asset estático nas Specs 3–8.
- **Nota:** o fallback `?url` sugerido no plan-done.md não seria suficiente — o problema afetava `.png` também e a ausência das declarations bloquearia qualquer asset import no projeto.

---

## Verificações

| Verificação | Resultado |
|---|---|
| `npx tsc --noEmit` | ✅ 0 erros |
| `npm run build` | ✅ dist/ gerado (274 KB JS, 18 KB CSS) |
| TypeScript reconhece imports `.png` e `.svg` | ✅ via vite-env.d.ts |

> Verificação visual (`npm run dev`) não executada nesta sessão — requer browser. O build sem erros e o TypeScript limpo confirmam corretude estrutural.

---

## Proposta de atualização do PROJECT-STATE.md

Ao autorizar, o agente atualizará `PROJECT-STATE.md` adicionando a seguinte entrada na seção 6 (Histórico de Atualizações) e atualizando a tabela da seção 2:

**Tabela de specs (seção 2):** alterar linha da Spec 2 de `⬜ Pendente` para `✅ Concluída` com artefato `spec-2-implement-done.md`.

**Entrada a adicionar na seção 6:**

```markdown
### Atualização — Spec 2 — S1 Hero — 2026-06-25

**Status:** concluída ✅

**Artefatos gerados:**
- `src/components/sections/S1Hero/index.tsx`
- `src/vite-env.d.ts` (boilerplate Vite ausente desde Spec 1 — adicionado com autorização explícita)
- `.agent/specs/spec-2-implement-done.md`

**Desvios do plano:**
- `src/vite-env.d.ts` criado além dos arquivos permitidos — necessário para resolver imports de assets estáticos (.png, .svg); autorizado pelo humano durante a implementação.

**Próxima spec:** Spec 3 — S2 Diagnóstico Sistêmico
```
