# spec-2-research-done.md — Spec 2 · S1 Hero

**Data:** 2026-06-25
**Fase:** Research concluída
**Próxima fase:** Plan

---

## 1. Objetivo da Spec

Implementar a seção de abertura (Hero) do relatório interativo. Primeira seção com conteúdo real — o "cartão de visitas" executivo do projeto para Carol e Jansen.

---

## 2. Conteúdo Especificado (SPECS.md)

- Logo GI Group + logo Perform IT
- Título principal: "Centralização CARE & SMS — Jornada do Worker"
- Subtítulo: "Diagnóstico sistêmico e propostas de transformação digital"
- Data e versão do relatório
- 3 métricas de impacto com contador animado
- CTA "Iniciar a leitura" → navega para S2
- Fundo: `gi-navy`, texto branco
- Ocupa 100vh
- Animação de entrada (Framer Motion, fadeInUp)

---

## 3. Decisões Técnicas Mapeadas

### 3.1 Componente existente

`src/components/sections/S1Hero/index.tsx` — placeholder vazio (div com título). Será substituído integralmente.

### 3.2 Arquitetura de navegação (adaptação necessária)

A SPECS.md diz "CTA scroll para S2". No Galaxy Layout, **não existe scroll** — a seção ativa muda via `usePresentation.goTo(step)`. O CTA deve chamar `goTo(1)` via `PresentationContext`, navegando para S2 Diagnóstico (step 1).

Padrão de acesso ao context:
```typescript
const { goTo } = useContext(PresentationContext)
// CTA: onClick={() => goTo(1)}
```

### 3.3 Contador animado de métricas

A SPECS.md define "contador animado ao entrar na viewport". No Galaxy Layout, a seção é montada no DOM quando o usuário clica no planeta — não existe scroll. O contador deve ser acionado no **mount do componente** (`useEffect` com `useState` para valor atual, incrementando de 0 até o valor alvo via `requestAnimationFrame` ou Framer Motion `useMotionValue` + `animate`).

### 3.4 Assets disponíveis

- `src/assets/logo-gi-group.png` — ✅ presente
- Logo Perform IT — ❌ **ausente** (ver Pendência #1)

### 3.5 Dados para as métricas

Os dados do design sprint estão documentados em CONTEXT.md:
- Workshop: **5 dias**
- Macrojornadas: **3** (admissão, ciclo ativo, offboarding)
- Iniciativas: **ver Pendência #2**

Não é necessário criar arquivo em `src/data/` para o Hero — as métricas são constantes da própria seção (3 valores estáticos). Ficam como constantes locais no arquivo `index.tsx`.

---

## 4. Pendências que requerem decisão do humano

### Pendência #1 — Logo Perform IT ✅ Resolvida

Logo fornecida pelo humano como SVG (fill branco — adequado para fundo `gi-navy`).
Salva em `src/assets/logo-perform-it.svg`.

### Pendência #2 — Número de iniciativas na métrica do Hero ✅ Resolvida

**Decisão:** usar **17 iniciativas mapeadas**.
Documentos corrigidos: ARCHITECTURE.md, SPECS.md, PROJECT-STATE.md.

---

## 5. Arquivos que serão modificados na fase Implement

| Arquivo | Ação |
|---------|------|
| `src/components/sections/S1Hero/index.tsx` | Substituir placeholder pelo componente completo |
| `src/assets/logo-perform-it.*` | Criar (se Pendência #1 → Opção A) |

Nenhum arquivo em `src/data/`, `src/types/` ou `src/hooks/` precisa ser criado ou modificado.

---

## 6. Riscos e Observações

- **Sem dependências novas** — tudo usa Framer Motion e Tailwind já instalados.
- **PresentationContext** — o contexto já existe e está tipado em `src/types/index.ts` (`PresentationContextValue`). O Hero precisa consumir apenas `goTo`.
- **Sem ScrollIntoView** — a lógica de "scroll suave" da spec original não se aplica no Galaxy Layout. O CTA usa `goTo(1)` puro.
- **100vh garantido** — `min-h-screen` já está no placeholder; manter no componente final.
