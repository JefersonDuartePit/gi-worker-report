# spec-7-research-done.md — Spec 7 · S6 Portal do Worker · Research (Redo)

**Data:** 2026-06-29
**Fase:** Research (concluída — versão expandida, substitui a versão de 2026-06-23)
**Branch:** spec/07-portal-do-worker
**Próxima fase:** Plan (artefato: spec-7-plan-done.md, a ser escrito do zero numa sessão separada)

---

## 0. Por que esta versão existe

A Spec 7 já havia sido implementada (commit `fbed9dd`) num único commit que misturou Research + Plan + Implement, violando a regra de sessões separadas do `CLAUDE.md`, sem gerar `spec-7-implement-done.md`. O usuário decidiu refazer a Spec 7 integralmente, mas reaproveitando e expandindo a pesquisa de negócio original (que continua válida — nada mudou em `CONTEXT.md`, `ARCHITECTURE.md`, `DESIGN-SYSTEM.md` ou nos dados de `src/data/`).

Esta versão incorpora achados de 3 transcrições de reunião fornecidas pelo usuário:
1. `[GI Group] Centralização CARE & SMS — Alinhamento TI.txt` (16/06/2026)
2. `[GI Group] Resultados Preliminares Centralização.txt` (26/06/2026)
3. `[Gi Group] Alinhamento Entregáveis TechUX.txt` (19/06/2026)

E registra **2 decisões de escopo aprovadas pelo usuário** nesta sessão:
1. Nova 6ª tela — `TelaDesenvolvimento` (feedback/acompanhamento/advertências do worker).
2. Bloco de contato GI permanente na `TelaInicio` (resolve D07).

---

## 1. O que é a Spec 7 e por que ela existe

A Spec 7 implementa a **S6 — Portal do Worker**, a seção mais importante do relatório interativo para o público-alvo (Carol e Jansen da GI Group). É aqui que a proposta de transformação digital deixa de ser abstrata e se torna um produto navegável e tangível.

O objetivo não é entregar código de produção — é construir um **protótipo de alta fidelidade** que demonstra, com clareza executiva, como o worker vivenciaria o portal proposto. Cada elemento interativo revela a dor que resolve (via tooltip), criando uma conexão direta entre o diagnóstico sistêmico (seções anteriores) e a solução proposta.

A transcrição de 19/06 confirma essa natureza: o protótipo é uma ferramenta de blueprint/venda ("se a gente conseguir transformar esse nosso protótipo já num produtinho pra vender, é certeza, é bala, eles vão adorar"), não um produto real — reforça `ARCHITECTURE.md` §10.

---

## 2. Contexto de negócio relevante para o designer

### Por que o portal existe?

O worker temporário da GI Group hoje:
- Não sabe em que etapa da admissão está (D01)
- Não tem canal único para tirar dúvidas durante o contrato (D05)
- Não sabe quem é seu contato na GI (D07)
- Fica 10 dias sem informação no desligamento (D09)
- Não tem acesso fácil a documentos pós-contrato (D11)

O portal resolve essas dores com telas navegáveis. Cada tela corresponde a uma dor específica — os tooltips deixam isso explícito para o público do relatório.

### Persona principal: Ana Silva

O portal usa dados ilustrativos de "Ana Silva, Operadora, Shopee SP". Ela representa o worker típico: baixa familiaridade digital, acessa informações via celular, precisa de respostas rápidas e linguagem simples. O design deve ser humano, nunca burocrático.

### Achados das transcrições de reunião

**Reunião 16/06 (Alinhamento TI — Carol/Jansen):**
- Carol detalha os pontos funcionais esperados do portal: comunicação e atendimento centralizados (substituindo VIP, TomTicket, GLPI, Blip/WhatsApp), onboarding com acompanhamento 30/60/90 dias, treinamentos (trilhas obrigatórias dentro do portal), solicitações operacionais (atualização cadastral, atestado, dúvidas gerais), desligamento/pós-desligamento, e **gestão de desenvolvimento** (registro de feedback, acompanhamento e advertências formais) — este último ponto não estava nas 5 telas do `SPECS.md` original. **Decisão aprovada nesta sessão: nova 6ª tela `TelaDesenvolvimento`.**
- Carol enfatiza repetidamente que o worker não sabe quem é seu contato GI durante o contrato ativo ("no fim do dia, quem cuida deste colaborador é uma pessoa GI. Quem é essa pessoa?"). Mapeado à dor D07, mas sem elemento visual dedicado nas telas atuais. **Decisão aprovada nesta sessão: bloco de contato GI permanente na `TelaInicio`.**
- Confirmação explícita: controle de **ponto/jornada fica fora do escopo do portal** ("eu colocaria fora, porque tem a ferramenta de ponto que a gente tem que fechar").
- Confirma restrições já documentadas em `CONTEXT.md`: portais globais intocáveis, IA requer aprovação, nomes genéricos para sistemas a substituir (GINFOR/IEM → "plataforma de folha"/"workforce management").
- Confirma que admissão é usada como referência de contexto, sem retrabalho — squad da Carol é o braço executivo de implantação.

**Reunião 26/06 (Resultados Preliminares):**
- Confirma a arquitetura do relatório em 7 seções (Hero, diagnóstico com 4 categorias de sistema via tooltip, dores por persona com link para iniciativa, arquitetura as-is/to-be, iniciativas com `impacto`/`esforço` e vínculo a telas, portal do worker, provocações).
- Confirma que cada iniciativa é amarrada a uma tela navegável do portal — valida a arquitetura já existente de `telasRelacionadas` em `INICIATIVAS`.
- **Pendência não bloqueante identificada:** propõe um rollout em 4 ondas que coloca "Portal do Worker" na **Onda 4 (última)**, por dependência tecnológica — conflita com `SPECS.md` Spec 8, que lista a iniciativa 10 (Portal do Worker) na **Fase 1 (H2 2026)**. Afeta o conteúdo da Spec 8 (Provocações), não a Spec 7. Registrado aqui apenas para rastreabilidade.

**Reunião 19/06 (Alinhamento Entregáveis TechUX):**
- Confirma escopo: cliente deu liberdade total para a visão ideal do portal, sem amarrar aos sistemas atuais — objetivo é um "super app" com módulos incrementais, servindo de blueprint para aprovação orçamentária e implantação faseada (H1 prioritário).
- Confirma que o relatório é dividido em 7 sessões, com co-criação das telas do portal entre Jeff e Ícaro.
- Contexto interno de esforço/horas — não afeta o conteúdo funcional da Spec 7.

---

## 3. Dados disponíveis — já existem no projeto desde a Spec 1

### `src/data/dores.ts` — exporta `DORES: Dor[]`

11 dores mapeadas com campos: `id`, `titulo`, `descricao`, `personas`, `jornada`, `severidade`, `iniciativaQueResolve`

Dores diretamente relevantes para o portal:
| ID | Título | Tela que resolve |
|----|--------|-----------------|
| D01 | Sem visibilidade do status admissional | TelaInicio |
| D05 | Sem canal único de comunicação | TelaSolicitacoes |
| D06 | Sem acompanhamento de onboarding 30/60/90 dias | TelaTreinamentos |
| D07 | Worker não sabe quem é seu contato GI | TelaInicio (bloco de contato — novo) |
| D09 | 10 dias sem informação no desligamento | TelaRescisao |
| D11 | Sem canal de comunicação pós-desligamento | TelaDocumentos |

**Pendência:** não há dor mapeada para "falta de registro de desenvolvimento/advertência" (tela nova `TelaDesenvolvimento`). Decisão de adicionar `D12` ou deixar a tela sem `DorTooltip` fica para a fase de Plan.

### `src/data/iniciativas.ts` — exporta `INICIATIVAS: Iniciativa[]`

17 iniciativas mapeadas. As relacionadas ao portal:
| ID | Título resumido | tela relacionada (telasRelacionadas) |
|----|----------------|--------------------------------------|
| I01 | Portal digital de admissão | inicio |
| I05 | Assinatura eletrônica Sign Único | documentos |
| I07 | Central de atendimento unificada | solicitacoes |
| I10 | Portal do Worker (autoatendimento) | inicio, documentos, treinamentos |
| I13 | Fluxo digital de desligamento | rescisao |
| I14 | Assinatura TRCT eletrônica | rescisao |
| I17 | Portal do ex-colaborador pós-desligamento | inicio |

---

## 4. Código existente relevante para o portal

### `src/hooks/usePortalNav.ts` — já existe

```typescript
export type PortalScreen = 'inicio' | 'documentos' | 'solicitacoes' | 'treinamentos' | 'rescisao'

export function usePortalNav() {
  const [screen, setScreen] = useState<PortalScreen>('inicio')
  return { screen, navigate: setScreen }
}
```

**Precisa ser estendido** com `'desenvolvimento'` na fase de Plan, para suportar a 6ª tela aprovada nesta sessão.

### `src/components/sections/S6Portal/index.tsx` — será atualizado

Ponto único de acoplamento com o app principal — deve permanecer mínimo.

### `src/components/ui/ProgressBar.tsx`, `Badge.tsx`, `Card.tsx`, `Button.tsx` — já existem

Design system completo disponível em `src/components/ui/`.

---

## 5. Tipos TypeScript disponíveis

Todos em `src/types/index.ts`:

```typescript
type Jornada = 'admissao' | 'ciclo-ativo' | 'offboarding'
type Persona = 'worker' | 'colaborador-gi' | 'cliente'
interface Dor { id, titulo, descricao, personas, jornada, severidade, iniciativaQueResolve }
interface Iniciativa { id, titulo, descricao, jornada, personas, doresResolvidas, esforco, impacto, telasRelacionadas? }
```

---

## 6. Design system do portal

```
Background app:    #F8F9FA  (quase branco — levemente cinza)
Sidebar do portal: #00145A  (gi-navy)
Topbar do portal:  branco com borda gi-border
Cards internos:    branco com borda #E0E4E8
Destaque/progresso: #1D57FB (gi-blue)
Status concluído:  #49B100  (gi-green)
Status pendente:   #FFC300  (gi-amber)
Status bloqueado:  #DBDBDB  (gi-border)
```

Fonte: Lato 12–14px (menores que o relatório — simula interface real).

Shell do portal: altura fixa `720px`, `rounded-2xl`, borda `border-gi-border`, `shadow-xl`.

---

## 7. Telas especificadas — 6 telas (5 originais do SPECS.md + 1 nova aprovada nesta sessão)

### Tela 1: Início (TelaInicio.tsx)
**Dor resolvida:** D01, D07 (novo — bloco de contato GI)
**Iniciativa:** I01, I10

- Barra de progresso da admissão (etapas concluídas/pendentes/aguardando)
- Métricas resumidas: solicitações abertas, treinamentos concluídos
- Atalhos rápidos para as outras telas
- **Novo:** bloco permanente com nome/cargo do contato GI responsável pela Ana Silva, com `DorTooltip` ligado a D07/I10

### Tela 2: Documentos (TelaDocumentos.tsx)
**Dor resolvida:** D11
**Iniciativa:** I05, I10

- Lista de documentos disponíveis: contrato, holerites, ASO, informe IR
- Status de cada documento: assinado, disponível, pendente
- Botão de download (visual — não funcional)

### Tela 3: Solicitações (TelaSolicitacoes.tsx)
**Dor resolvida:** D05
**Iniciativa:** I07

- Lista de solicitações abertas com status e número de ticket
- Botão "Nova solicitação" com modal de abertura
- Tipos: atualização cadastral, envio de atestado, dúvida sobre benefícios, outros

### Tela 4: Treinamentos (TelaTreinamentos.tsx)
**Dor resolvida:** D06
**Iniciativa:** I10

- Trilha de onboarding com progresso visual
- Módulos: concluídos, em andamento, bloqueados, aguardando data
- Marcadores de 30, 60 e 90 dias

### Tela 5: Rescisão (TelaRescisao.tsx)
**Dor resolvida:** D09
**Iniciativa:** I13, I14

- Status: "Dia 3 de 10" com barra de progresso
- Timeline das etapas do processo de desligamento
- Previsão de disponibilização dos documentos
- Botão de contato com o time GI

### Tela 6: Desenvolvimento (TelaDesenvolvimento.tsx) — NOVA

**Dor resolvida:** nenhuma mapeada formalmente ainda (pendência — ver §9)
**Origem:** pedido explícito de Carol na reunião de 16/06

- Timeline cronológica de feedback e advertências formais do worker
- Diferenciação visual entre feedback (neutro/positivo) e advertência (severidade alta)
- Somente leitura — sem ação de criação/edição no protótipo

---

## 8. Decisão arquitetural: DorTooltip isolado no portal

`src/components/ui/Tooltip.tsx` permanece como stub para outras specs. O portal usa seu próprio `DorTooltip.tsx` em `src/components/portal/`, específico para tooltips de dor+iniciativa — evita conflito de merge e pode ser refatorado livremente.

---

## 9. Pendências para a fase de Plan

| Pendência | Detalhe |
|---|---|
| `usePortalNav.ts` precisa de `'desenvolvimento'` | Extensão do tipo `PortalScreen` — decisão técnica de Plan |
| `TelaDesenvolvimento` sem dor mapeada | Decidir: criar `D12` em `dores.ts`, ou deixar a tela sem `DorTooltip` como exceção |
| `SPECS.md` não lista a 6ª tela | Documento de specs funcionais deveria ser atualizado pelo humano — fora do escopo de edição desta sessão |
| Conflito de fase de rollout (Onda 4 vs Fase 1) | Pendência da Spec 8 (Provocações), não bloqueia a Spec 7 |

---

## 10. O que o agente de Plan precisará saber

1. **Liberdade total em `src/components/portal/`** — pode criar, renomear, remover qualquer arquivo nessa pasta.
2. **`usePortalNav.ts` é extensível** — deve estar nos Arquivos Permitidos; precisa do novo screen `'desenvolvimento'`.
3. **DorTooltip vai dentro de `portal/`**, não em `ui/`.
4. **`S6Portal/index.tsx` é o único ponto de acoplamento** com o app principal — deve ser mínimo.
5. **6 telas no total**, não 5 — incluir `TelaDesenvolvimento`.
6. **`TelaInicio` precisa do bloco de contato GI permanente**, distinto dos tooltips de hover.
7. **Nenhum dado hard-coded fora do padrão do projeto** — usar `DORES` e `INICIATIVAS` de `src/data/` via `DorTooltip` onde houver dor mapeada; dados ilustrativos sem dor mapeada (ex: feedback/advertência) podem ser hard-coded localmente na tela, seguindo o padrão das demais telas.
8. O `plan-done.md` deve conter **receitas de extensão** (como adicionar/remover telas), não só passos lineares.
9. Este `research-done.md` está estruturado por funcionalidade (Propósito, Entradas, Saídas, Regras de Negócio, Critérios de Aceite) — ver as seções de cada tela no plano de Research desta sessão para o detalhamento completo por tela (registrado também na conversa que gerou este artefato).
