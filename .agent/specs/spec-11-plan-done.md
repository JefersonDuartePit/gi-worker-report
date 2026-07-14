# Spec 11 — Plan — Ajustes Pós-Apresentação (reunião de 13/07/2026)

**Branch:** `spec/11-ajustes-pos-apresentacao`
**Fase:** Plan (RPI)
**Lê:** `spec-11-research-done.md`, `CLAUDE.md`, `ARCHITECTURE.md`, `DESIGN-SYSTEM.md`, `CODING-GUIDELINES.md`, `PROJECT-STATE.md`

---

## Contexto

O research (`spec-11-research-done.md`) mapeou 8 pontos da reunião de apresentação dos
insights sistêmicos (13/07/2026) que exigem ajuste nos dados do relatório, e listou 4
decisões em aberto que dependiam de aprovação humana antes deste plano. Todas as 4 foram
resolvidas com o humano (Jeff) nesta sessão de Plan:

| # | Decisão | Resolução |
|---|---|---|
| 1 | Formato do registro do "Workflow" (OutSystems) | **Nota dentro de S12** — não cria entrada própria (`S13B`); Carol trata "Workflow" como módulo do próprio OutSystems, não sistema separado. |
| 2 | Gaps do Neto (acidente de trabalho / plano médico / mudança de escala) | **Nota textual**, não dores formais — são exemplos ilustrativos não validados ("chutando", nas palavras do próprio Neto). Local: item novo em `PROXIMOS_PASSOS`. |
| 3 | P05 (cliente no portal) | **Mantida em `PROVOCACOES`** (não removida/promovida), com `contexto` atualizado para registrar a resposta definitiva dada na reunião. |
| 4 | Validação com usuários reais (item 5 do research) | **Não registrar em `src/data/`** — confirmado explicitamente pelo humano que este ponto fica de fora desta spec. |

Um quinto ponto (nota/legenda no `DIAGRAMA_TO_BE` explicando a ausência do nó `candidato`)
já estava sem ambiguidade quanto ao **requisito**, mas exige uma decisão de mecanismo
técnico: `DiagramaArq` (`src/types/index.ts`) não tem hoje um campo para texto livre de
legenda, e o componente que renderiza o diagrama (`DiagramaArquitetura.tsx`) não sabe
exibir esse tipo de nota. Adicionar a legenda portanto exige tocar `src/types/index.ts` e
`src/components/sections/S4Arquitetura/DiagramaArquitetura.tsx`, além de `arquitetura.ts` —
fora do conjunto original de "arquivos de dados". Isso é necessário para que a nota seja
**visível no relatório** (e não apenas um campo morto nos dados) e está incluído no plano
abaixo como extensão mínima e localizada (um campo opcional + um parágrafo condicional).

Todo o restante do plano toca exclusivamente `src/data/sistemas.ts`,
`src/data/provocacoes.ts` e `src/data/arquitetura.ts`. `src/data/dores.ts` e
`src/data/iniciativas.ts` **não são tocados** — decorrência direta das decisões 2 e 4
acima (nenhuma dor nova, nenhuma iniciativa nova).

---

## Passo a passo

### 1. `src/data/sistemas.ts` — S01 (IM): remover descrição de "ATS"

Linha 7. Carol corrigiu (08:02): o IM não é ATS, é módulo do Workforce Management
(incluindo admissão). O ATS oficial é o Spinner (`S03`, já registrado corretamente — sem
mudança).

```typescript
// Antes
funcao: 'ATS e admissão digital — candidatura, triagem e gestão de vagas',

// Depois
funcao: 'Módulo de admissão digital do Workforce Management — candidatura, triagem e gestão de vagas (não é ATS; o ATS oficial é o Spinner, S03)',
```

Nenhum outro campo de `S01` muda (`status`, `doresAssociadas`, `restricao`, `problema`,
`decisaoProposta`, `confianca`, `fonte` ficam como estão).

### 2. `src/data/sistemas.ts` — S13 (Zeev): substituição confirmada, não integração

Linhas 152-161. Carol (08:38): "Nós vamos substituir o Ziv por o Workflow, que vai ser o
OutSystems." É resposta direta e nominal da dona do sistema — `confianca` sobe para
`'confirmado'`. `status: 'integra'` contradiz a decisão — muda para `'substitui'`.

Consequência direta (não estava no texto literal da reunião, mas é necessária para manter
os dados internamente consistentes — sinalizado aqui explicitamente, não decidido em
silêncio): `decisaoProposta` hoje diz "Avaliar integração via API..." — texto que descreve
exatamente a hipótese que a Carol descartou. Precisa ser reescrito para refletir
substituição pelo módulo Workflow (ver decisão 1 da tabela acima).

```typescript
// Antes
status: 'integra',
doresAssociadas: [],
problema: 'Consolidação manual de informações de agendamento entre IM, Zeev, e-mail e Teams — sem visão única (identificado no Toolkit de Mapeamento do Processo de Admissão).',
decisaoProposta: 'Avaliar integração via API com o novo sistema de admissão (OutSystems) para centralizar o registro de agendamento.',
confianca: 'inferido',
fonte: 'Sistema identificado apenas no Toolkit de Admissão — não há decisão da GI sobre o destino do Zeev. Status "integra" e decisão proposta são hipótese da Perform IT, ainda sem validação.',

// Depois
status: 'substitui',
doresAssociadas: [],
problema: 'Consolidação manual de informações de agendamento entre IM, Zeev, e-mail e Teams — sem visão única (identificado no Toolkit de Mapeamento do Processo de Admissão).',
decisaoProposta: 'Substituído pelo Workflow, módulo do OutSystems (S12) — reprovado na análise de segurança da informação, sem intenção de integração.',
confianca: 'confirmado',
fonte: 'Carol confirmou diretamente na reunião de apresentação dos insights sistêmicos (13/07/2026, 08:02-08:47): "ele reprovou na análise de segurança da informação, então a gente não tem intenção de integrá-lo (...) Nós vamos substituir o Ziv por o Workflow, que vai ser o OutSystems."',
```

`nome` (`'Zeev'`) e `id` (`'S13'`) não mudam.

### 3. `src/data/sistemas.ts` — S03B (Fusion): confirmação direta de saída

Linhas 41-50. Carol (08:38, mesma fala do item 2): "O Fusion vai sair também." Confirmação
direta e nominal — `confianca` sobe para `'confirmado'`. `status: 'substitui'` já estava
correto, não muda. `problema` e `decisaoProposta` já estão consistentes com a saída
confirmada — não mudam.

```typescript
// Antes
confianca: 'inferido',
fonte: 'O Toolkit de Admissão só aponta a duplicidade Fusion × IM como gap, sem recomendar substituição — o status "substitui" é leitura da Perform IT, não decisão da GI. Poderia ser "integra" dependendo do que a Carol validar.',

// Depois
confianca: 'confirmado',
fonte: 'Carol confirmou diretamente na reunião de apresentação dos insights sistêmicos (13/07/2026, 08:38): "O Fusion vai sair também" (mesma fala em que confirmou a substituição do Zeev pelo Workflow).',
```

### 4. `src/data/sistemas.ts` — S12 (OutSystems): escopo global + módulo Workflow

Linhas 141-150. Dois achados da reunião ampliam o registro de `S12`:

- Carol (08:38) trata "Workflow" (substituto do Zeev, decisão 1 da tabela acima) como
  módulo dentro do próprio OutSystems.
- Carol (10:01): o OutSystems é sugestão *global*, já usado por outros países para
  "admissão, workforce management, portal do cliente", com intenção futura de contrato
  único global.

```typescript
// Antes
funcao: 'Plataforma low-code — portal de admissão em construção',
status: 'usa',
doresAssociadas: [],
problema: 'Plataforma em construção — portal de admissão em implantação, ainda sem entrar em produção.',
decisaoProposta: 'Usar como pilar do portal de admissão digital; não retrabalhar — referência de contexto.',
confianca: 'confirmado',
fonte: 'Carol confirmou na reunião de 16/06/2026 que a intenção é trazer a admissão para o workflow novo dentro de OutSystems; o Toolkit de Admissão confirma a plataforma já em desenvolvimento.',

// Depois
funcao: 'Plataforma low-code — portal de admissão em construção; inclui o módulo Workflow, que substitui o Zeev (S13)',
status: 'usa',
doresAssociadas: [],
problema: 'Plataforma em construção — portal de admissão em implantação, ainda sem entrar em produção. Sugestão do Global: plataforma já usada por outros países também para workforce management e portal do cliente, com intenção futura de contrato único global — escopo potencialmente maior do que hoje mapeado.',
decisaoProposta: 'Usar como pilar do portal de admissão digital, incluindo o módulo Workflow (substituto do Zeev); avaliar expansão futura para workforce management e portal do cliente conforme direção do Global — não retrabalhar agora, referência de contexto.',
confianca: 'confirmado',
fonte: 'Carol confirmou na reunião de 16/06/2026 que a intenção é trazer a admissão para o workflow novo dentro de OutSystems. Na reunião de apresentação dos insights sistêmicos (13/07/2026): (08:38) confirmou que o Zeev será substituído pelo Workflow, módulo do OutSystems; (10:01) confirmou que o OutSystems é sugestão global, já usado por outros países para "admissão, workforce management, portal do cliente", com intenção futura de contrato único global.',
```

`nome` (`'OutSystems'`) e `id` (`'S12'`) não mudam. Nenhuma entrada nova é criada em
`SISTEMAS` (decisão 1 da tabela).

### 5. `src/data/provocacoes.ts` — P01: candidato Navision

Linha 7 (`contexto`). Carol (57:28-58:32) deu um dado concreto novo: o Global sinalizou o
Navision (ERP global do grupo) como candidato embrionário à substituição/complemento da
plataforma de folha.

```typescript
// Antes
contexto: 'Isso define o que faz sentido construir agora versus o que vai ser refeito com a nova plataforma em 2027. Construir integrações sobre um sistema que vai ser descontinuado é risco alto. Na reunião de Alinhamento TI (16/06/2026), Carol confirmou que a mudança da plataforma de folha está prevista para o próximo ano e que a migração ocorrerá "em blocos" (incremental, não big-bang) — mas não especificou se é substituição total ou complementar. Isso ainda é a lacuna real da pergunta.',

// Depois
contexto: 'Isso define o que faz sentido construir agora versus o que vai ser refeito com a nova plataforma em 2027. Construir integrações sobre um sistema que vai ser descontinuado é risco alto. Na reunião de Alinhamento TI (16/06/2026), Carol confirmou que a mudança da plataforma de folha está prevista para o próximo ano e que a migração ocorrerá "em blocos" (incremental, não big-bang) — mas não especificou se é substituição total ou complementar. Na reunião de apresentação dos insights sistêmicos (13/07/2026, 57:28-58:32), Carol detalhou que hoje quem gera nota fiscal ainda é a plataforma de folha atual, e que o Global sinalizou o Navision (ERP global do grupo) como candidato à substituição — mas ainda "bem embrionário", sem clareza de até que ponto suas funcionalidades atendem. No curto prazo, a integração continua via a plataforma de folha atual.',
```

### 6. `src/data/provocacoes.ts` — P02: dono técnico confirmado (views, sem API)

Linha 13 (`contexto`). Carol (59:23-59:46) respondeu diretamente: dono técnico é o próprio
time de sistemas dela; mecanismo hoje é extração de views (não API, não RPA), sem
documentação formal de integração. A parte "é possível estender sem aprovação global?" não
foi respondida diretamente.

```typescript
// Antes
contexto: 'A iniciativa I03 (eliminar triple data entry) depende de uma camada de integração. Antes de começar, precisamos saber quem controla esse fluxo e qual o nível de autonomia do Brasil. Na reunião de 16/06/2026, Carol adiantou que a integração de dados de candidato "talvez não venha diretamente do Spinner" — a GI está construindo uma solução intermediária com o Global para ganhar mais autonomia local. Vale confirmar se essa solução intermediária também cobre a integração com a plataforma de folha.',

// Depois
contexto: 'A iniciativa I03 (eliminar triple data entry) depende de uma camada de integração. Antes de começar, precisamos saber quem controla esse fluxo e qual o nível de autonomia do Brasil. Na reunião de 16/06/2026, Carol adiantou que a integração de dados de candidato "talvez não venha diretamente do Spinner" — a GI está construindo uma solução intermediária com o Global para ganhar mais autonomia local. Vale confirmar se essa solução intermediária também cobre a integração com a plataforma de folha. Respondido parcialmente na reunião de apresentação dos insights sistêmicos (13/07/2026, 59:23-59:46): o dono técnico é o próprio time de sistemas da Carol; hoje a integração acontece via extração de views (não API, não RPA), sem documentação formal. A parte "é possível estender sem aprovação global?" não foi respondida diretamente — Carol não tratou isso como dependente do Global, mas também não confirmou viabilidade de extensão.',
```

### 7. `src/data/provocacoes.ts` — P04: Care centralizado, SMS pendente

Linha 20 (`contexto`). Speaker 3 (provavelmente Ícaro, falando por Care e citando Leandro
por SMS) deu resposta nominal e concreta (01:00:38): Care já centralizado via Hub/Virtual
Hub; SMS ainda descentralizado, é o foco pendente.

```typescript
// Antes
contexto: 'A solução não pode ser desenhada para uma única BU. Se outras regionais tiverem processos divergentes, o portal do worker vira problema político antes de virar produto.',

// Depois
contexto: 'A solução não pode ser desenhada para uma única BU. Se outras regionais tiverem processos divergentes, o portal do worker vira problema político antes de virar produto. Na reunião de apresentação dos insights sistêmicos (13/07/2026, 01:00:38), o time Care (representado por Ícaro, citando também Dani e Leandro por SMS) detalhou: o Care já está centralizado via Hub/Virtual Hub; a centralização pendente é especificamente do SMS (Leandro), ainda descentralizado.',
```

### 8. `src/data/provocacoes.ts` — P05: resposta definitiva (portais separados)

Linha 26 (`contexto`). Neto (01:02:36) e Carol (01:05:09) responderam de forma definitiva:
não, cliente não terá acesso ao portal do worker — são portais separados; e o "portal do
cliente" hoje existente dentro do IEM **não é** o portal do cliente oficial futuro (solução
legada, com outro propósito, fora do IEM oficial).

```typescript
// Antes
contexto: 'A visibilidade do cliente foi listada como necessidade no workshop. Mas requer alinhamento comercial — o que o cliente pode ver muda o contrato de serviço, não só a arquitetura.',

// Depois
contexto: 'A visibilidade do cliente foi listada como necessidade no workshop. Mas requer alinhamento comercial — o que o cliente pode ver muda o contrato de serviço, não só a arquitetura. Respondido de forma definitiva na reunião de apresentação dos insights sistêmicos (13/07/2026): não, portais separados — a visão do worker é de solicitação e status individual; o portal do cliente é uma visão à parte (01:02:36). Carol esclareceu ainda (01:05:09) que o "portal do cliente" hoje existente dentro do IEM não é o portal do cliente oficial futuro — é uma solução comercial legada, com outro propósito, completamente fora do IEM oficial. Resta em aberto o alinhamento comercial de exatamente quais dados o futuro portal do cliente oficial poderá expor.',
```

`pergunta` e `destinatario` de P05 não mudam — permanece em `PROVOCACOES` (decisão 3 da
tabela acima).

### 9. `src/data/provocacoes.ts` — `PROXIMOS_PASSOS`: dois itens novos

Linhas 63-68. Dois pontos da reunião viram itens de próximos passos (não provocações, não
dores):

- Agenda dedicada de arquitetura com o arquiteto de TI — pedida independentemente por Neto
  (19:44-22:07) e reforçada por Carol (01:05:46).
- Validação dos exemplos do Neto (acidente de trabalho, consulta a plano médico, mudança de
  escala) — decisão 2 da tabela acima: são exemplos ilustrativos ("chutando", nas palavras
  do próprio Neto), não dados validados do workshop original; precisam ser confirmados com
  Dani/Jansen antes de virarem dores formais em `dores.ts`.

```typescript
// Antes
export const PROXIMOS_PASSOS: string[] = [
  'Agenda técnica com squad de TI da Carol para mapeamento de APIs disponíveis',
  'Acesso à pasta gravada do processo de admissão (prometida pela Carol)',
  'Alinhamento de holding com BUs sobre controle centralizado do worker',
  'Definição do escopo do portal do worker dentro do IT Master Plan H2 2026',
]

// Depois
export const PROXIMOS_PASSOS: string[] = [
  'Agenda técnica com squad de TI da Carol para mapeamento de APIs disponíveis',
  'Acesso à pasta gravada do processo de admissão (prometida pela Carol)',
  'Alinhamento de holding com BUs sobre controle centralizado do worker',
  'Definição do escopo do portal do worker dentro do IT Master Plan H2 2026',
  'Agenda dedicada de arquitetura com o arquiteto de TI da GI, para aprofundar decisões de estrutura e integração (pedido por Neto e reforçado pela Carol na reunião de 13/07/2026)',
  'Validar com Dani/Jansen se os exemplos citados pelo Neto na reunião de 13/07/2026 (dúvidas de acidente de trabalho, consulta a plano médico, mudança de escala) são necessidades reais do worker antes de formalizá-las como dores no relatório — hoje são exemplos ilustrativos não validados pelo workshop original',
]
```

### 10. `src/types/index.ts` — `DiagramaArq`: campo opcional `nota`

Linhas 104-107. Adicionar campo opcional de texto livre para legenda/nota do diagrama:

```typescript
// Antes
export interface DiagramaArq {
  nos: NoArq[]
  arestas: ArestaArq[]
}

// Depois
export interface DiagramaArq {
  nos: NoArq[]
  arestas: ArestaArq[]
  nota?: string
}
```

### 11. `src/data/arquitetura.ts` — `DIAGRAMA_TO_BE`: nota sobre ausência do candidato

Após a chave `arestas` de `DIAGRAMA_TO_BE` (linha 262, antes do `}` de fechamento em 263).
Neto (19:44-23:29) e Speaker 4 (51:59) confirmaram que a ausência do nó `candidato` é
intencional e reconhecida por todos — worker e candidato são o mesmo CPF, diferindo apenas
por estado; o to-be considera o worker a partir do estado "contratado".

```typescript
// Antes (fim de DIAGRAMA_TO_BE)
    { from: 'api-layer', to: 'soc-tobe', estilo: 'solida' },
  ],
}

// Depois
    { from: 'api-layer', to: 'soc-tobe', estilo: 'solida' },
  ],
  nota: 'O nó "Candidato" foi omitido intencionalmente. Worker e candidato são o mesmo CPF, diferindo apenas por estado — este to-be considera o worker a partir do momento em que o estado é "contratado". A conexão com portal de candidatos e portal de vagas está fora do escopo desta fase (confirmado na reunião de apresentação dos insights sistêmicos, 13/07/2026).',
}
```

`DIAGRAMA_AS_IS` e `COMPARATIVO_ARQ` não mudam.

### 12. `src/components/sections/S4Arquitetura/DiagramaArquitetura.tsx` — renderizar a nota

Após o bloco `{/* Legenda */}` (linhas 63-77), adicionar um parágrafo condicional que só
aparece quando `diagrama.nota` existir (isto é, apenas no to-be):

```typescript
// Depois da div da Legenda (fecha em linha 77), antes do fechamento da div raiz (linha 78)
      {diagrama.nota && (
        <p className="absolute bottom-0 right-0 max-w-xs text-right text-[10px] text-gi-charcoal italic">
          {diagrama.nota}
        </p>
      )}
```

Posicionamento `absolute bottom-0 right-0` espelha o padrão já usado pela `{/* Legenda */}`
(`absolute bottom-0 left-0`) na mesma linha de base, sem sobrepor — legenda à esquerda,
nota à direita. Estilo (`text-[10px] text-gi-charcoal`) segue a escala tipográfica de
"microtexto/caption" já definida em `DESIGN-SYSTEM.md` §3.

---

## Arquivos Permitidos

- `src/data/sistemas.ts`
- `src/data/provocacoes.ts`
- `src/data/arquitetura.ts`
- `src/types/index.ts` (apenas o campo opcional `nota` em `DiagramaArq`, passo 10)
- `src/components/sections/S4Arquitetura/DiagramaArquitetura.tsx` (apenas o parágrafo
  condicional de nota, passo 12)

Nenhum outro arquivo deve ser modificado nesta spec — em particular, **não tocar**
`src/data/dores.ts` nem `src/data/iniciativas.ts` (decisões 2 e 4 da tabela acima: nenhuma
dor ou iniciativa nova nesta spec).

---

## Verificação

1. `npx tsc --noEmit` — sem erros de tipo (nenhum `any` introduzido; `nota?: string` é
   opcional, não quebra `DIAGRAMA_AS_IS` que não o define).
2. `npm run build` — build de produção sem erros.
3. Revisão de código linha a linha conferindo cada campo alterado contra o texto exato
   listado nos passos 1-11 acima (substituição do Claude Browser por esta verificação, per
   `CLAUDE.md` §8 — limitação confirmada nas Specs 9 e 10).
4. Confirmar visualmente com o humano (Jeff), fora do ambiente de automação: no módulo
   Arquitetura (planeta 04), alternar para a vista "to-be" e verificar que a nota sobre o
   candidato aparece no canto inferior direito do diagrama, sem sobrepor a legenda
   existente nem os nós.

---

## Próximo passo

Abrir sessão de **Implement** (sessão isolada, per `CLAUDE.md`), lendo `CLAUDE.md`, este
documento (`spec-11-plan-done.md`) e `PROJECT-STATE.md`, para implementar exatamente o
passo a passo acima.
