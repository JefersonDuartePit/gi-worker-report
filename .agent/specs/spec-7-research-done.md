# spec-7-research-done.md — Spec 7 · S6 Portal do Worker · Research

**Data:** 2026-06-23
**Fase:** Research (concluída)
**Branch:** spec/07-portal-do-worker
**Próxima fase:** Plan (artefato: spec-7-plan-done.md)

---

## 1. O que é a Spec 7 e por que ela existe

A Spec 7 implementa a **S6 — Portal do Worker**, a seção mais importante do relatório interativo para o público-alvo (Carol e Jansen da GI Group). É aqui que a proposta de transformação digital deixa de ser abstrata e se torna um produto navegável e tangível.

O objetivo não é entregar código de produção — é construir um **protótipo de alta fidelidade** que demonstra, com clareza executiva, como o worker vivenciaria o portal proposto. Cada elemento interativo revela a dor que resolve (via tooltip), criando uma conexão direta entre o diagnóstico sistêmico (seções anteriores) e a solução proposta.

---

## 2. Contexto de negócio relevante para o designer

### Por que o portal existe?

O worker temporário da GI Group hoje:
- Não sabe em que etapa da admissão está (D01)
- Não tem canal único para tirar dúvidas durante o contrato (D05)
- Não sabe quem é seu contato na GI (D07)
- Fica 10 dias sem informação no desligamento (D09)
- Não tem acesso fácil a documentos pós-contrato (D11)

O portal resolve essas dores com 5 telas navegáveis. Cada tela corresponde a uma dor específica — os tooltips deixam isso explícito para o público do relatório.

### Persona principal: Ana Silva

O portal usa dados ilustrativos de "Ana Silva, Operadora, Shopee SP". Ela representa o worker típico: baixa familiaridade digital, acessa informações via celular, precisa de respostas rápidas e linguagem simples. O design deve ser humano, nunca burocrático.

---

## 3. Dados disponíveis — já existem no projeto desde a Spec 1

> **Dependência resolvida:** AGENTS.md §7 diz que Spec 7 depende de dados de Spec 4 (dores) e Spec 6 (iniciativas). Esses dados foram criados na Spec 1 e já estão disponíveis no projeto.

### `src/data/dores.ts` — exporta `DORES: Dor[]`

11 dores mapeadas com campos: `id`, `titulo`, `descricao`, `personas`, `jornada`, `severidade`, `iniciativaQueResolve`

Dores diretamente relevantes para o portal:
| ID | Título | Tela que resolve |
|----|--------|-----------------|
| D01 | Sem visibilidade do status admissional | TelaInicio |
| D05 | Sem canal único de comunicação | TelaSolicitacoes |
| D06 | Sem acompanhamento de onboarding 30/60/90 dias | TelaTreinamentos |
| D07 | Worker não sabe quem é seu contato GI | TelaInicio |
| D09 | 10 dias sem informação no desligamento | TelaRescisao |
| D11 | Sem canal de comunicação pós-desligamento | TelaDocumentos |

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

**O designer pode e deve modificar este arquivo** para adicionar ou remover telas.

### `src/components/sections/S6Portal/index.tsx` — será atualizado

Atualmente é um placeholder. Será substituído pela integração com `PortalShell`.

### `src/components/ui/ProgressBar.tsx` — já existe

```typescript
interface ProgressBarProps {
  value: number
  max?: number
  className?: string
}
```

Pode ser usado diretamente nas telas.

### `src/components/ui/Badge.tsx`, `Card.tsx`, `Button.tsx` — todos existem

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

O portal usa uma identidade visual derivada da GI Group, adaptada para um produto digital de uso direto do worker.

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

## 7. Telas especificadas (SPECS.md Spec 7) — guia de conteúdo para o designer

### Tela 1: Início (TelaInicio.tsx)
**Dor resolvida:** D01 — Sem visibilidade do status admissional
**Iniciativa:** I01, I10

Conteúdo sugerido pelo cliente (SPECS.md):
- Barra de progresso da admissão (etapas concluídas/pendentes/aguardando)
- Métricas resumidas: solicitações abertas, treinamentos concluídos
- Atalhos rápidos para as outras telas
- Nome e saudação para Ana Silva

### Tela 2: Documentos (TelaDocumentos.tsx)
**Dor resolvida:** D11 — Sem canal de acesso a documentos pós-contrato
**Iniciativa:** I05, I10

Conteúdo sugerido:
- Lista de documentos disponíveis: contrato, holerites, ASO, informe IR
- Status de cada documento: assinado, disponível, pendente
- Botão de download (visual — não funcional)

### Tela 3: Solicitações (TelaSolicitacoes.tsx)
**Dor resolvida:** D05 — Sem canal único de comunicação
**Iniciativa:** I07

Conteúdo sugerido:
- Lista de solicitações abertas com status e número de ticket
- Botão "Nova solicitação" com modal de abertura
- Tipos: atualização cadastral, envio de atestado, dúvida sobre benefícios, outros

### Tela 4: Treinamentos (TelaTreinamentos.tsx)
**Dor resolvida:** D06 — Sem acompanhamento de onboarding 30/60/90 dias
**Iniciativa:** I10

Conteúdo sugerido:
- Trilha de onboarding com progresso visual
- Módulos: concluídos, em andamento, bloqueados, aguardando data
- Marcadores de 30, 60 e 90 dias

### Tela 5: Rescisão (TelaRescisao.tsx)
**Dor resolvida:** D09 — 10 dias sem informação no desligamento
**Iniciativa:** I13, I14

Conteúdo sugerido:
- Status: "Dia 3 de 10" com barra de progresso
- Timeline das etapas do processo de desligamento
- Previsão de disponibilização dos documentos
- Botão de contato com o time GI

---

## 8. Decisão arquitetural: DorTooltip isolado no portal

### O problema

`src/components/ui/Tooltip.tsx` é atualmente um stub. Spec 3 (Diagnóstico Sistêmico) também precisará de tooltips. Se duas branches implementarem `ui/Tooltip.tsx` em paralelo, haverá merge conflict.

### A solução

O portal terá seu próprio `DorTooltip.tsx` dentro de `src/components/portal/`. Ele:
- É específico para tooltips de dor+iniciativa (domínio exclusivo do portal)
- Não conflita com implementações futuras de `ui/Tooltip.tsx`
- Pode ser descartado ou refatorado sem afetar o restante do projeto

`src/components/ui/Tooltip.tsx` permanece como stub — outra spec pode implementá-lo sem conflito.

---

## 9. Contrato de isolamento — como a integração futura funcionará

O portal vive inteiramente em `src/components/portal/`. O único arquivo fora dessa pasta que a Spec 7 toca é `src/components/sections/S6Portal/index.tsx`.

Quando a branch `main` for atualizada com as Specs 2–6:
- Specs 2–6 tocam `S1Hero/`, `S2Diagnostico/`, `S3Dores/`, `S4Arquitetura/`, `S5Iniciativas/`, `S7Provocacoes/`
- Spec 7 toca `S6Portal/` e `portal/`
- **Zero sobreposição de arquivos** — merge limpo garantido

O merge será: `git merge spec/07-portal-do-worker` na main (ou PR). Nenhum conflito esperado.

---

## 10. Pendências — todas resolvidas

| Pendência | Resolução |
|---|---|
| Dependência de dados de Spec 4 e 6 | Dados já existem desde Spec 1 — nenhuma dependência real |
| Tooltip pode conflitar com Spec 3 | DorTooltip criado dentro de portal/ — isolado |
| Designer pode querer adicionar telas | usePortalNav.ts está nos Arquivos Permitidos — pode ser modificado livremente |
| Portal deve parecer produto real | Design system do portal documentado acima com cores específicas |

---

## 11. O que o agente de Plan precisará saber

1. **Liberdade total em `src/components/portal/`** — designer pode criar, renomear, remover qualquer arquivo nessa pasta
2. **`usePortalNav.ts` é extensível** — deve estar nos Arquivos Permitidos para que o designer possa adicionar/remover screens
3. **DorTooltip vai dentro de `portal/`**, não em `ui/`
4. **`S6Portal/index.tsx` é o único ponto de acoplamento** com o app principal — deve ser mínimo
5. **Scaffold instructivo**: cada arquivo gerado deve ter comentários de orientação sobre o que construir e por quê
6. **Nenhum dado hard-coded nas telas** — usar `DORES` e `INICIATIVAS` de `src/data/` via DorTooltip
7. O plan-done.md deve conter **receitas de extensão** (como adicionar/remover telas), não só passos lineares
