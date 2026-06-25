# AGENTS.md — GI Group · Portal do Worker

**Versão:** 1.0
**Status:** Em desenvolvimento

---

## 1. Sobre Este Documento

Este documento define o modelo de operação dos agentes neste projeto. Deve ser lido em conjunto com `CLAUDE.md`, que é o entrypoint obrigatório de toda sessão.

Define:
- O modelo RPI e suas regras de sessão
- As regras de fronteira de arquivos
- O contrato de handoff entre fases
- Os prompts de entrada para cada spec e fase

---

## 2. Modelo de Operação — RPI

O agente opera exclusivamente no modelo **Research → Plan → Implement**.

```
Research  →  Plan  →  Implement
   ↓            ↓           ↓
aprova       aprova      humano atualiza
humano       humano      PROJECT-STATE.md
```

**Regra fundamental:** cada fase é uma sessão separada. Nunca comprimir duas fases em uma sessão.

---

## 3. Detalhamento das Fases

### 3.1 Research

**Objetivo:** mapear tudo que é necessário para implementar a spec — o que está definido, o que está em aberto e o que precisa ser investigado.

**Processo:**
1. Ler todos os documentos listados no contexto mínimo (ver seção 5)
2. Ler documentos adicionais indicados no prompt de entrada da sessão
3. Mapear decisões aplicáveis, referências, pendências e riscos
4. Listar todos os componentes, hooks e arquivos de dados que serão necessários
5. Apresentar resumo ao humano e aguardar aprovação explícita
6. Somente após aprovação: gerar o arquivo `.agent/specs/spec-[N]-research-done.md`

**Output:** `.agent/specs/spec-[N]-research-done.md`

**O arquivo deve conter:**
- Contexto levantado e decisões aplicáveis com referência ao documento de origem
- Lista de componentes, hooks e arquivos de dados necessários
- Pendências identificadas e como foram resolvidas
- Riscos identificados
- O que o agente de Plan precisará saber

---

### 3.2 Plan

**Objetivo:** produzir um plano de implementação sem ambiguidades, que o agente de Implement possa seguir à risca sem tomar nenhuma decisão nova.

**Processo:**
1. Ler `.agent/specs/spec-[N]-research-done.md` como principal fonte de contexto
2. Ler os documentos do contexto mínimo de Plan (ver seção 5)
3. Elaborar o plano passo a passo
4. Apresentar o plano completo ao humano e aguardar aprovação explícita
5. Somente após aprovação: gerar o arquivo `.agent/specs/spec-[N]-plan-done.md`

**Cada passo do plano deve especificar:**
- Path completo do arquivo a criar ou modificar
- O que implementar naquele arquivo e como (sem ambiguidades)
- Dependências entre passos (ex: "passo 3 depende do passo 1")
- Decisão técnica envolvida com referência ao documento que a sustenta

**O Plan não pode ser finalizado com nenhuma dúvida em aberto.** Se algo não estiver 100% claro, perguntar antes de continuar.

**Output:** `.agent/specs/spec-[N]-plan-done.md`

**O arquivo deve obrigatoriamente conter as seções:**

```markdown
## Arquivos Permitidos
Lista exata de arquivos que este agente pode criar ou modificar.

## Arquivos Proibidos
Lista de arquivos que este agente NÃO pode tocar sob nenhuma circunstância.

## Passos de Implementação
Passo a passo detalhado.

## Contrato de Output
O que este agente deve entregar ao terminar.
```

---

### 3.3 Implement

**Objetivo:** executar o plano aprovado sem desvios.

**Processo:**
1. Ler `.agent/specs/spec-[N]-plan-done.md` como única fonte de verdade
2. Executar cada passo exatamente como descrito
3. Se surgir algo não previsto no plano: **parar, apontar o problema e aguardar orientação**
4. Não tomar nenhuma decisão nova durante a implementação

**Ao finalizar:**
1. Gerar `.agent/specs/spec-[N]-implement-done.md` com:
   - Lista de todos os arquivos criados ou modificados com paths completos
   - Qualquer desvio em relação ao plano e o motivo
   - Estado final da spec
2. **NÃO atualizar `PROJECT-STATE.md`** — apenas o humano atualiza

---

## 4. Regras de Fronteira de Arquivos

### Declaração no plan-done.md

Todo plan-done.md deve conter seções **"Arquivos Permitidos"** e **"Arquivos Proibidos"** com listas explícitas.

O agente de Implement não pode tocar em nenhum arquivo que não esteja na lista de permitidos, mesmo que julgue necessário.

### Regra do PROJECT-STATE.md

`PROJECT-STATE.md` nunca é modificado pelo agente. Apenas o humano o atualiza, após revisar o `implement-done.md`.

### Regra dos documentos de governança

Os arquivos `CLAUDE.md`, `CONTEXT.md`, `ARCHITECTURE.md`, `DESIGN-SYSTEM.md`, `CODING-GUIDELINES.md`, `PROJECT-STATE.md`, `SPECS.md` e `AGENTS.md` nunca são modificados pelo agente, exceto se o humano pedir explicitamente uma atualização de documentação como tarefa específica.

---

## 5. Contexto Mínimo por Fase

| Fase      | Documentos obrigatórios                                                                                    |
| --------- | ---------------------------------------------------------------------------------------------------------- |
| Research  | CLAUDE.md, CONTEXT.md, ARCHITECTURE.md, DESIGN-SYSTEM.md, CODING-GUIDELINES.md, PROJECT-STATE.md, SPECS.md |
| Plan      | CLAUDE.md, ARCHITECTURE.md, DESIGN-SYSTEM.md, CODING-GUIDELINES.md, PROJECT-STATE.md, `spec-[N]-research-done.md` |
| Implement | CLAUDE.md, `spec-[N]-plan-done.md`, PROJECT-STATE.md                                                      |

---

## 6. Prompts de Entrada por Spec e Fase

### Spec 1 — Setup e Shell

**Research:**
```
Você é o agente responsável pela Spec 1 — Setup e Shell.
Sua tarefa agora é a fase de RESEARCH.

Leia os seguintes documentos nesta ordem:
1. CLAUDE.md
2. CONTEXT.md
3. ARCHITECTURE.md
4. DESIGN-SYSTEM.md
5. CODING-GUIDELINES.md
6. PROJECT-STATE.md
7. SPECS.md (seção Spec 1)

Execute a fase de Research conforme as regras do AGENTS.md.
Foco especial em: estrutura de pastas, configuração do Tailwind com tokens GI Group, tipos compartilhados e arquitetura de navegação por scroll.
Ao finalizar, gere .agent/specs/spec-1-research-done.md.
```

**Plan:**
```
Você é o agente responsável pela Spec 1 — Setup e Shell.
Sua tarefa agora é a fase de PLAN.

Leia os seguintes documentos nesta ordem:
1. CLAUDE.md
2. ARCHITECTURE.md
3. DESIGN-SYSTEM.md
4. CODING-GUIDELINES.md
5. PROJECT-STATE.md
6. .agent/specs/spec-1-research-done.md

Execute a fase de Plan conforme as regras do AGENTS.md.
O plano deve incluir Arquivos Permitidos, Arquivos Proibidos, Passos de Implementação e Contrato de Output.
Ao finalizar, gere .agent/specs/spec-1-plan-done.md.
```

**Implement:**
```
Você é o agente responsável pela Spec 1 — Setup e Shell.
Sua tarefa agora é a fase de IMPLEMENT.

Leia os seguintes documentos nesta ordem:
1. CLAUDE.md
2. PROJECT-STATE.md
3. .agent/specs/spec-1-plan-done.md

Execute exatamente o plano aprovado.
Não modifique nenhum arquivo fora da lista de Arquivos Permitidos.
Se surgir qualquer situação não prevista no plano, pare e reporte antes de continuar.
Ao finalizar, gere .agent/specs/spec-1-implement-done.md. Não atualize PROJECT-STATE.md.
```

---

### Spec 2 — S1 Hero

**Research:**
```
Você é o agente responsável pela Spec 2 — S1 Hero.
Sua tarefa agora é a fase de RESEARCH.

Leia os seguintes documentos nesta ordem:
1. CLAUDE.md
2. CONTEXT.md
3. ARCHITECTURE.md
4. DESIGN-SYSTEM.md
5. CODING-GUIDELINES.md
6. PROJECT-STATE.md
7. SPECS.md (seção Spec 2)
8. .agent/specs/spec-1-implement-done.md

Execute a fase de Research conforme as regras do AGENTS.md.
Foco especial em: identidade visual do hero (fundo navy, texto branco), animações de entrada, métricas com contador animado e integração com o hook useActiveSection.
Ao finalizar, gere .agent/specs/spec-2-research-done.md.
```

**Plan:**
```
Você é o agente responsável pela Spec 2 — S1 Hero.
Sua tarefa agora é a fase de PLAN.

Leia os seguintes documentos nesta ordem:
1. CLAUDE.md
2. ARCHITECTURE.md
3. DESIGN-SYSTEM.md
4. CODING-GUIDELINES.md
5. PROJECT-STATE.md
6. .agent/specs/spec-2-research-done.md

Execute a fase de Plan conforme as regras do AGENTS.md.
Ao finalizar, gere .agent/specs/spec-2-plan-done.md.
```

**Implement:**
```
Você é o agente responsável pela Spec 2 — S1 Hero.
Sua tarefa agora é a fase de IMPLEMENT.

Leia os seguintes documentos nesta ordem:
1. CLAUDE.md
2. PROJECT-STATE.md
3. .agent/specs/spec-2-plan-done.md

Execute exatamente o plano aprovado.
Não modifique nenhum arquivo fora da lista de Arquivos Permitidos.
Ao finalizar, gere .agent/specs/spec-2-implement-done.md. Não atualize PROJECT-STATE.md.
```

---

### Spec 3 — S2 Diagnóstico Sistêmico

**Research:**
```
Você é o agente responsável pela Spec 3 — S2 Diagnóstico Sistêmico.
Sua tarefa agora é a fase de RESEARCH.

Leia os seguintes documentos nesta ordem:
1. CLAUDE.md
2. CONTEXT.md
3. ARCHITECTURE.md
4. DESIGN-SYSTEM.md
5. CODING-GUIDELINES.md
6. PROJECT-STATE.md
7. SPECS.md (seção Spec 3)
8. .agent/specs/spec-1-implement-done.md

Execute a fase de Research conforme as regras do AGENTS.md.
Foco especial em: estrutura dos 4 quadrantes, dados de src/data/sistemas.ts, comportamento de hover/tooltip e filtro por quadrante.
Ao finalizar, gere .agent/specs/spec-3-research-done.md.
```

**Plan:**
```
Você é o agente responsável pela Spec 3 — S2 Diagnóstico Sistêmico.
Sua tarefa agora é a fase de PLAN.

Leia os seguintes documentos nesta ordem:
1. CLAUDE.md
2. ARCHITECTURE.md
3. DESIGN-SYSTEM.md
4. CODING-GUIDELINES.md
5. PROJECT-STATE.md
6. .agent/specs/spec-3-research-done.md

Execute a fase de Plan conforme as regras do AGENTS.md.
Ao finalizar, gere .agent/specs/spec-3-plan-done.md.
```

**Implement:**
```
Você é o agente responsável pela Spec 3 — S2 Diagnóstico Sistêmico.
Sua tarefa agora é a fase de IMPLEMENT.

Leia os seguintes documentos nesta ordem:
1. CLAUDE.md
2. PROJECT-STATE.md
3. .agent/specs/spec-3-plan-done.md

Execute exatamente o plano aprovado.
Não modifique nenhum arquivo fora da lista de Arquivos Permitidos.
Ao finalizar, gere .agent/specs/spec-3-implement-done.md. Não atualize PROJECT-STATE.md.
```

---

### Spec 4 — S3 Dores por Persona

*(seguir o mesmo padrão de prompts das specs anteriores, com foco em: filtros de persona, cards expandíveis e dados de src/data/dores.ts)*

---

### Spec 5 — S4 Arquitetura As-is/To-be

*(seguir o mesmo padrão, com foco em: diagrama SVG/React interativo, toggle as-is/to-be e tabela comparativa)*

---

### Spec 6 — S5 Iniciativas

*(seguir o mesmo padrão, com foco em: filtros duplos jornada+persona, card expansível, botão "Ver tela" integrado ao portal)*

---

### Spec 7 — S6 Portal do Worker

*(seguir o mesmo padrão, com foco em: shell do portal, 5 telas de alta fidelidade, tooltips de dor e modal de solicitação)*

---

### Spec 8 — S7 Provocações e Próximos Passos

*(seguir o mesmo padrão, com foco em: cards de provocação por destinatário, plano faseado visual e CTA de encerramento)*

---

## 7. Paralelização

Specs podem ser paralelizadas se:
- A Spec anterior estiver com implement-done.md gerado
- Os arquivos que as specs usam não se sobrepõem
- O humano autorizar explicitamente

Specs que **não podem** rodar em paralelo:
- Spec 1 deve estar 100% concluída antes de qualquer outra

Specs que **podem** rodar em paralelo (após Spec 1 concluída):
- Spec 2 (Hero) e Spec 3 (Diagnóstico)
- Spec 4 (Dores) e Spec 5 (Arquitetura)
- **Spec 7 (Portal) e qualquer outra spec** — ver seção 7.1 abaixo

### 7.1 Spec 7 — Status de paralelização

**Spec 7 está em desenvolvimento paralelo ativo na branch `spec/07-portal-do-worker`.**

A dependência original (dados de Specs 4 e 6) foi resolvida na Spec 1: `DORES` e `INICIATIVAS` já existem em `src/data/` desde o início. Não há bloqueio técnico.

**Arquivos exclusivos da Spec 7** — nenhum agente de outra spec deve tocar:

```
src/components/portal/          ← pasta exclusiva da Spec 7
src/components/sections/S6Portal/index.tsx
src/hooks/usePortalNav.ts
.agent/specs/spec-7-research-done.md
.agent/specs/spec-7-plan-done.md
```

**Para agentes de Specs 2–6 e 8:** a seção `S6Portal` existe como placeholder na main. Deixar intacta. O merge da branch `spec/07-portal-do-worker` será limpo por design — os arquivos da Spec 7 não se sobrepõem com nenhuma outra spec.
