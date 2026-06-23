# CLAUDE.md — GI Group · Portal do Worker

> **Este é o entrypoint obrigatório de toda sessão de agente.**
> Leia este documento antes de qualquer ação — planejamento, sugestão ou implementação.

---

## 1. O Projeto

O **Portal do Worker GI Group** é um relatório interativo em React que apresenta, de forma executiva e navegável, o diagnóstico sistêmico e as propostas de transformação digital para a jornada do colaborador temporário (worker) da GI Group Holding Brasil.

O relatório é entregue como um site estático — uma SPA em React — com identidade visual da GI Group, navegação lateral fixa, telas navegáveis do portal proposto e provocações técnicas fundamentadas no design sprint realizado pela Perform IT.

O público primário é a responsável técnica de TI da GI Group (Carol) e o CEO operacional (Jansen). O público secundário é o time interno da Perform IT (service designer, Jefferson — arquiteto de soluções).

---

## 2. Documentos do Projeto — Leitura Obrigatória por Ordem

| Ordem | Documento              | O que define                                              |
| ----- | ---------------------- | --------------------------------------------------------- |
| 1     | `CLAUDE.md`            | Este documento — entrypoint e regras de operação          |
| 2     | `CONTEXT.md`           | Contexto de negócio, personas, dores e iniciativas        |
| 3     | `ARCHITECTURE.md`      | Stack, estrutura de pastas, decisões técnicas             |
| 4     | `DESIGN-SYSTEM.md`     | Tokens visuais, componentes, padrões de UI                |
| 5     | `CODING-GUIDELINES.md` | Convenções de código, proibições, padrões obrigatórios    |
| 6     | `PROJECT-STATE.md`     | Estado atual do projeto, specs concluídas e em andamento  |
| 7     | `SPECS.md`             | Especificações funcionais de cada seção do relatório      |
| 8     | `AGENTS.md`            | Modelo RPPI, regras de sessão e prompts por fase          |

O agente só deve ler documentos além desses se o arquivo `plan-done.md` da sua spec listar explicitamente.

**Nenhuma decisão de produto ou técnica deve ser inferida.** Se a informação não estiver documentada, parar e perguntar antes de prosseguir.

---

## 3. Modelo de Operação — RPI (Research → Plan → Implement)

O agente opera exclusivamente no modelo **Research → Plan → Implement**.

**Regra fundamental de sessão:** cada fase do RPI é uma sessão separada e isolada.

```
Sessão 1 — Research
        ↓ lê todos os documentos da seção 2
        ↓ mapeia decisões, referências, riscos e pendências da spec
        ↓ apresenta resumo ao humano e aguarda aprovação
        ↓ gera .agent/specs/spec-[N]-research-done.md

Sessão 2 — Plan
        ↓ lê .agent/specs/spec-[N]-research-done.md
        ↓ elabora plano passo a passo sem ambiguidades
        ↓ apresenta plano ao humano e aguarda aprovação
        ↓ gera .agent/specs/spec-[N]-plan-done.md

Sessão 3 — Implement
        ↓ lê .agent/specs/spec-[N]-plan-done.md como única fonte de verdade
        ↓ implementa exatamente o que está no plano
        ↓ se algo não previsto surgir: para, reporta, aguarda orientação
        ↓ gera .agent/specs/spec-[N]-implement-done.md
        ↓ humano atualiza PROJECT-STATE.md
```

**Nunca comprimir duas fases em uma sessão. Nunca.**

---

## 4. Artefatos Obrigatórios por Etapa

Todos os artefatos ficam na pasta `.agent/specs/`.

| Etapa     | Arquivo obrigatório                           |
| --------- | --------------------------------------------- |
| Research  | `.agent/specs/spec-[N]-research-done.md`      |
| Plan      | `.agent/specs/spec-[N]-plan-done.md`          |
| Implement | `.agent/specs/spec-[N]-implement-done.md`     |

---

## 5. Regras Inegociáveis

1. **Nunca misturar fases** — Research não planeja. Plan não implementa. Implement não decide.
2. **Nunca modificar arquivo fora da lista de Arquivos Permitidos** do plan-done.md.
3. **Nunca atualizar `PROJECT-STATE.md`** — apenas o humano atualiza.
4. **Nunca inferir requisitos** — se não está documentado, perguntar.
5. **Nunca criar componentes de UI do zero** quando o design system já define o equivalente.
6. **Nunca usar `any`** em TypeScript — sem exceção.
7. **Se surgir algo não previsto durante Implement:** parar imediatamente, descrever o problema e aguardar orientação.

---

## 6. Prompt de Entrada Obrigatório

Toda sessão começa com o humano informando:

- Qual spec o agente está executando (ex: `Spec 2 — Diagnóstico Sistêmico`)
- Qual fase do RPI (`Research`, `Plan` ou `Implement`)
- Quais documentos adicionais ler além dos da seção 2

O agente não deve assumir nada além do que está no prompt de entrada e nos documentos listados.

---

## 7. Contexto Mínimo por Fase

| Fase      | Documentos obrigatórios                                                                          |
| --------- | ------------------------------------------------------------------------------------------------ |
| Research  | CLAUDE.md, CONTEXT.md, ARCHITECTURE.md, DESIGN-SYSTEM.md, CODING-GUIDELINES.md, PROJECT-STATE.md, SPECS.md |
| Plan      | CLAUDE.md, ARCHITECTURE.md, DESIGN-SYSTEM.md, CODING-GUIDELINES.md, PROJECT-STATE.md, `.agent/specs/spec-[N]-research-done.md` |
| Implement | CLAUDE.md, `.agent/specs/spec-[N]-plan-done.md`, PROJECT-STATE.md                               |
