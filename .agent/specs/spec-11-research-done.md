# Spec 11 — Research Done — Ajustes Pós-Apresentação (reunião de 13/07/2026)

**Data:** 2026-07-14
**Fase:** Research
**Fonte primária:** transcrição completa (Tactiq) da reunião "[GI GROUP] Reunião de Apresentação dos Insights Sistêmicos TECH&UX", 13/07/2026, 71min. Cópia local: `.agent/specs/spec-11-transcript.pdf`.
**Documentos de contexto lidos:** `CLAUDE.md`, `docs/CONTEXT.md`, `docs/ARCHITECTURE.md`, `docs/DESIGN-SYSTEM.md` (parcial), `docs/CODING-GUIDELINES.md` (parcial), `docs/PROJECT-STATE.md`, `docs/SPECS.md`, `src/data/sistemas.ts`, `src/data/provocacoes.ts`, `src/data/dores.ts`, `src/data/iniciativas.ts`, `src/data/arquitetura.ts`.

---

## 0. Nota sobre atribuição de falas na transcrição

A transcrição rotula participantes apenas como "Speaker N", sem nomes. Identificação confiável por autoidentificação/menção direta:

- **Speaker 5 = Carol** (autoidentifica-se, é chamada pelo nome durante toda a reunião)
- **Speaker 2 = Jeff** (conduz a apresentação, chamado pelo nome repetidamente)
- **Speaker 3 é reutilizado para duas pessoas diferentes**: **Neto**, de 19:44 a 24:27 (entra na call depois do início, autoidentifica-se, cumprimenta Jansen, é chamado de "Netão" por Jeff aos 22:15, e se despede explicitamente aos 24:20-24:27 — "eu vou sair, tá adiante"); e **Ícaro**, de ~25:50 em diante (chamado por nome/apelido "Ikin" repetidamente, apresenta o protótipo GI Connect).
- Speakers 1 e 4 (prováveis Dani, Leandro, Jansen, Dmitri em alternância) não puderam ser distinguidos com segurança linha a linha — a própria reunião reconhece esse risco (Jeff, 06:40: *"pode ser que a transcrição pegou um nome e às vezes ele dá uma esgoiabada com essas relações de nome"*).

Onde a atribuição exata a um indivíduo específico (fora de Carol/Jeff/Neto/Ícaro) importa para a decisão, isso é sinalizado como incerto abaixo.

---

## 1. IM não é ATS — Spinner vs. Vispira

**Transcrição (08:02, Carol):**
> "O IEM aqui, eu vou pedir só pra gente fazer um ajuste, porque ele não é um ATS, tá? Ele é só parte aqui do Workforce Management como um todo, incluindo a admissão. O ATS hoje oficial é o Vispira, que é a plataforma global."

**Estado atual (`sistemas.ts`, S01):**
```
funcao: 'ATS e admissão digital — candidatura, triagem e gestão de vagas'
```
Isso contradiz diretamente a correção da Carol. `funcao` precisa deixar de descrever o IM como ATS e passar a descrevê-lo como módulo do Workforce Management (incluindo admissão).

**Complicação — Spinner vs. Vispira — RESOLVIDA (confirmação do humano, Jeff, 2026-07-14):**
"Vispira" não existe como sistema — foi erro de transcrição do Tactiq. A fala da Carol (08:02) era sobre o **Spinner**: *"O ATS hoje oficial é o [Spinner], que é a plataforma global."* Não há dois sistemas — é um único sistema, e o registro de `S03` em `sistemas.ts` (Spinner = "ATS global para candidatos (RP global) — controlado pela matriz italiana") está correto e não precisa mudar. A fala não atribuída com segurança aos 38:37 ("no ATS de seleção, no SPINER") é, portanto, consistente com a fala da Carol, não conflitante — ambas se referem ao Spinner como o ATS oficial.

**Recomendação para Plan:** nenhuma mudança necessária em `S03`. A única correção decorrente deste ponto é em `S01` (IM) — remover a descrição de "ATS" do `funcao`, já que o ATS oficial (Spinner) é um sistema à parte, já registrado corretamente.

---

## 2. Zeev/Ziv reprovado em segurança — substituído por "Workflow" (OutSystems)

**Transcrição (08:02-08:47, Carol, respondendo pergunta de Jeff sobre o Ziv):**
> "E o Ziv, ele não, ele reprovou na análise de segurança da informação, então a gente não tem intenção de integrá-lo, tá bom?"

Em seguida, pergunta de Speaker 4 (08:32): *"Carol, só aproveitando, o pessoal que está usando o Ziv vai para onde?"*
**Carol (08:38):**
> "Nós vamos substituir o Ziv por o Workflow, que vai ser o OutSystems. O Fusion vai sair também."

Speaker 4 confirma o entendimento (08:47): *"Que é o que tá em curso, que você já tem protótipos, já tá mais avançado."*

**Estado atual (`sistemas.ts`, S13 — Zeev):**
```
status: 'integra'
confianca: 'inferido'
decisaoProposta: 'Avaliar integração via API com o novo sistema de admissão (OutSystems)...'
```

Isso está desatualizado em dois pontos:
1. `status: 'integra'` contradiz a decisão explícita da Carol — o Ziv **não** será integrado, será **substituído**.
2. `confianca: 'inferido'` deveria subir para `'confirmado'` — é uma resposta direta da dona do sistema (Carol), não uma inferência da Perform IT.

**Novo sistema "Workflow" (OutSystems) sem registro:** não há entrada em `sistemas.ts` para "Workflow" como módulo dentro do OutSystems. Duas opções para o Plan avaliar:
- (a) criar um registro próprio (ex.: `S13B` ou similar) para "Workflow", análogo ao padrão já usado para Fusion (`S03B`) como sistema satélite de outro;
- (b) descrever como um campo/nota dentro de `S12` (OutSystems), já que o texto da Carol trata "Workflow" como um módulo do próprio OutSystems ("o Workflow, que vai ser o OutSystems"), não como sistema à parte.

Nota adicional relevante para `S12`: Carol (10:01) explica que o OutSystems é uma sugestão *global*, já usado por outros países para "admissão, workforce management, portal do cliente", com intenção futura de virar contrato único global — isso amplia o escopo/relevância de `S12` além do que hoje está registrado como "portal de admissão em construção".

---

## 3. Fusion — confirmação direta de saída

**Transcrição (08:38, Carol):** *"O Fusion vai sair também."* (na mesma frase da substituição do Ziv, ver item 2 acima)

**Estado atual (`sistemas.ts`, S03B — Fusion):**
```
status: 'substitui'
confianca: 'inferido'
fonte: '...o status "substitui" é leitura da Perform IT, não decisão da GI...'
```

O `status: 'substitui'` já estava correto, mas a `confianca: 'inferido'` está desatualizada — "O Fusion vai sair também" é confirmação direta e nominal da Carol, não mais inferência. Deveria subir para `'confirmado'`, com `fonte` atualizada citando esta reunião (13/07/2026, 08:38).

---

## 4. Provocações — respostas obtidas na reunião

### P02 — dono técnico da integração IM ↔ folha

**Transcrição (58:34-59:46):** Jeff pergunta quem é responsável pela integração IM↔folha. Carol inicialmente não entende o propósito da pergunta ("Eu tô tentando entender onde a gente se encaixa aqui... porque essa conexão já existe"), Jeff esclarece que é para aprendizado, não para construir algo novo. Carol responde (59:23-59:46):
> "É um RPA, por acaso?" [Speaker 4] — "Não, não. São views. Então, a gente puxa as views de um lado pro outro. Basicamente, eu tô falando, não tô falando de documentação de integração, de API, nada nesse sentido. Mas é o meu próprio time de sistemas que consegue trazer essas informações pra vocês." [Carol]

Isso responde P02 diretamente: o dono técnico é o **próprio time de sistemas da Carol**; o mecanismo hoje é extração de **views** (não API, não RPA), **sem documentação formal de integração**. `contexto` de P02 deveria ser atualizado com essa resposta; a pergunta original ("é possível estender sem aprovação global?") não foi respondida diretamente — Carol não trata isso como dependente do Global, é interno ao seu próprio time — o que sugere que a provocação pode ser considerada resolvida quanto à parte "quem é o dono", mas resta aberta a parte "é possível estender".

### P04 — quais BUs precisam alinhar

**Transcrição (01:00:38, atribuído a Speaker 3 = provavelmente Ícaro, falando em nome do time Care):**
> "Aqui é um time que está envolvido mesmo, Leandro ali representando o SMS, Dani e eu representando o Care, porque dentro do Care já tem Hub e Virtual Hub. Então, a centralização seria do SMS, o resto já está centralizado."

Confirma dado concreto: **Care** (Dani/Ícaro) já está centralizado via Hub/Virtual Hub; **SMS** (Leandro) ainda está descentralizado e é o foco da centralização pendente. `contexto` de P04 deveria incorporar esse detalhamento — a pergunta original era genérica ("quais BUs precisam alinhar"), agora há resposta nominal e concreta.

### P05 — cliente ter acesso ao portal do worker

**Transcrição (01:02:36, Neto — ainda dentro da janela 19:44-24:27? **Não** — checar: esta fala está em 01:02:36, fora da janela em que Speaker 3 = Neto. Neto já havia saído aos 24:27. Portanto esta fala (01:02:36) é atribuída a **Ícaro**, não a Neto.):
> "Aí serão dois portais diferentes, né? Então, assim, são visões totalmente diferentes. A visão do worker é muito de solicitação, do status dele especificamente. E aí tem outro portal, que será o portal do cliente... Sim, a expectativa é de que tenha um portal para o cliente, mas eu entendo que ele não teria acesso ao portal do worker, tá?"

**Carol complementa (01:05:09):**
> "Mas só para deixar todo mundo na mesma página, o portal do cliente do IEM não é o nosso portal do cliente oficial, tá? É uma solução que hoje existe, que está comercializada há muito tempo dentro da GI, mas que ela nasceu com um outro olhar, com um outro viés e não de One GI... a solução portal do cliente, ela está completamente fora do IEM."

Resposta explícita e dupla: (1) não, cliente não terá acesso ao portal do worker — portais separados; (2) o "portal do cliente" que já existe hoje dentro do IEM (mencionado por Dani em 01:03:40 com detalhes de funcionalidades) **não é** o portal do cliente oficial futuro — é uma solução legada com outro propósito. Isso é suficientemente definitivo para tratar como **decisão registrada** em vez de provocação em aberto — recomendação para o Plan.

### P01 — ERP substitui a plataforma de folha?

**Transcrição (57:28-58:32, Carol):**
> "A discussão da substituição da plataforma de folha, ela é complexa, para vocês terem uma ideia hoje, quem gera nota fiscal é a minha plataforma de folha, não faz o menor sentido. Então, começaríamos, sim, ainda conectados a ela, até que nós possamos ter clareza de onde a gente quer chegar do ponto de vista de plataforma de folha. Nós temos agora uma provocação do Global, que é, temos o Navision [transcrito também como "Navija"], que é o nosso ERP, tecnicamente. Mas por que ele não atua como [E]RP? Então, nós estamos, nesse momento, entendendo até que ponto ele consegue atender, até que ponto a gente consegue usar as funcionalidades. O Navision também é uma plataforma global... Está bem embrionário, eu diria."

Novo dado concreto para `contexto` de P01: candidato específico ao substituto é o **Navision** (ERP global do grupo), ainda em avaliação embrionária ("por que ele não atua como ERP?" é a provocação do Global, não decisão). Também confirma que a integração continuará via a plataforma de folha atual no curto prazo — não há substituto definido.

---

## 5. Validação com usuários reais — lacuna não registrada

**Transcrição (36:10-37:33):**

**Carol pergunta (36:10):**
> "Dúvida geral, nós ouvimos o time operacional que está fazendo essa entrega para este worker, mas também algum worker fez parte dessa construção para a gente entender do ponto de vista dele, quais seriam as necessidades?"

**Speaker 4 responde (36:27-37:33):**
> "O nosso escopo estava olhando para o employee barra backoffice, tá bom?... Por enquanto, a gente falou com um worker, tá bom, Carol? A gente falou com um worker... Mas a gente tem essa super oportunidade de validar isso que a gente está trazendo com o Worker. Imagina a gente trazendo esse protótipo e fazer um tempo para uma usabilidade assistida, fazer testes, surveys com o Worker. Então, isso não estava dentro do nosso escopo, mas é super relevante."

Confirma exatamente o que o prompt de entrada já sinalizava: apenas **1 worker** foi ouvido dentro do escopo do workshop; recomendação explícita de **testes de usabilidade assistida e surveys** antes do desenvolvimento real. Esse ponto **não existe hoje** em `provocacoes.ts` (nem em `PROVOCACOES`, nem em `PROXIMOS_PASSOS`).

**Opções para o Plan:**
- Nova provocação em `PROVOCACOES` (ex.: destinatário `ambos`, pergunta sobre plano de validação com usuários reais);
- Item em `PROXIMOS_PASSOS` (mais alinhado ao tom de "próxima ação combinada", já que a reunião trata isso como algo a ser feito, não uma pergunta em aberto para a Carol responder);
- Nota textual na seção do relatório sobre limitações do protótipo.

A reunião também reforça esse ponto no resumo executivo: *"Protótipo ainda não foi validado com ampla base de workers (apenas 1 worker foi ouvido dentro do escopo); recomenda-se testes de usabilidade assistida e surveys com usuários reais."*

---

## 6. Arquitetura (S4 As-is/To-be) — falas do Neto (Speaker 3, 19:44–24:27)

### 6.1 Não aprofundar arquitetura técnica nesta entrega

**Transcrição (19:44-22:07, Neto):**
> "Eu acredito que essa parte de arquitetura, a gente pode entrar um pouco mais no detalhe, até com o nosso arquiteto depois, né? Eu não perderia muito mais tempo aqui, porque, obviamente, arquitetura não vai ser o foco da entrega da jornada como um todo... Eu não entraria aqui em camadas de API, nada disso. Isso aí deixa para um papo mais TI depois, tá bom?"

**Reforçado pela Carol mais tarde (01:05:46):**
> "Boa, acho que vale depois a gente marcar uma agenda específica para falar sobre arquitetura, porque tem bastante item aqui que nós desenhamos já de uma determinada forma, que influencia em estrutura, integração, uma série de coisas..."

Dois participantes pedindo, de forma independente, uma reunião dedicada de arquitetura com o arquiteto de TI. **Recomendação para Plan:** adicionar item em `PROXIMOS_PASSOS` (`provocacoes.ts`) registrando essa reunião dedicada como pendência combinada.

### 6.2 Quatro personas/jornadas oficiais — candidato ausente do diagrama

**Transcrição (19:44-23:29, Neto):**
> "O fato é, eu tenho quatro visões, tá, pessoal... Primeiro, visão worker... Depois eu tenho visão candidato, e aí tem uma linha muito cinza e tênue entre candidato e worker, porque é só uma questão de estado. [A] pessoa é a mesma, ora ela é cliente, perdão, ora ela é candidato, ora ela é worker, né?... Aí a gente tem uma outra linha que é a linha do cliente... E o último é o empregado, que a gente chama de employee... São sempre esses quatro... Essas quatro personas que a gente vai avaliar."
>
> "Porque o worker e o candidato, eles são, no final do dia, um único CPF. Então ele também tem uma conexão com o portal de candidatos, ele vai ter conexão com o portal de vagas, só que a gente não está tratando isso aqui, a gente está considerando o worker a partir do momento que ele está com o Estado contratado nosso." (23:02-23:29)

Confirmado mais tarde por Speaker 4 (51:59): *"O candidato tá fora, você deve ter notado, Carol, o candidato tá fora."*

`DIAGRAMA_TO_BE` (`arquitetura.ts`) tem nós para `worker-tobe`, `colab-gi-tobe` (employee) e `cliente`, mas nenhum nó/nota para `candidato`. A ausência é **intencional e reconhecida por todos os presentes** (Neto explica o motivo, Speaker 4 confirma explicitamente que notaram a ausência) — não é uma omissão silenciosa do lado da Perform IT, é escopo combinado. **Recomendação para Plan:** adicionar nota/legenda no diagrama explicando que candidato está fora de escopo desta fase (mesmo CPF, estado diferente), em vez de deixar a ausência sem explicação — evita a pergunta "cadê o candidato?" de quem vir o relatório sem o contexto da reunião.

### 6.3 Exemplos concretos do que "o worker quer saber" — gaps em `dores.ts`/`iniciativas.ts`

**Transcrição (23:32-23:53, Neto):**
> "O que é a informação que ele consome do nosso back-office? Ele quer saber, por exemplo, sei lá, se... Se ele sofre um acidente de trabalho, ele quer ter uma dúvida ali, como é que ele tem que fazer. Se ele quer marcar uma consulta médica, ele quer consultar o plano dele... Escala, mudou a escala dele, como é que ele é informado."

E antes (23:02): salário, "quando começa" (data de início), férias.

**Cruzamento com dados atuais:**

| Item citado pelo Neto | Coberto hoje? |
|---|---|
| Salário / holerite | Sim — `D10`/`D11`, `I10` ("holerite" no título), `TelaDocumentos` |
| Data de início | Parcialmente — `D01` (status admissional) cobre visibilidade geral, mas não especificamente "quando começa" |
| Férias | Sim — `I10` cita "férias" explicitamente no título |
| **Acidente de trabalho** (orientação/dúvida) | **Não coberto** — nenhuma dor ou iniciativa menciona acidente de trabalho |
| **Consulta a plano médico** | **Não coberto** — nenhuma dor ou iniciativa menciona plano de saúde/consulta médica |
| **Mudança de escala** (notificação) | **Não coberto** — nenhuma dor ou iniciativa menciona escala/turno |

Os três itens em negrito são **gaps genuínos**, não implicitamente cobertos por `I10` ou qualquer outra iniciativa existente — `I10` fala de "dúvidas, holerite, benefícios, férias" de forma genérica, mas nem os workshops (`CONTEXT.md` §5) nem `dores.ts` registram especificamente acidente de trabalho, plano médico ou escala. **Recomendação para Plan:** avaliar se viram novas dores (`D13`, `D14`, `D15`?) vinculadas a `I10`/`I12` (afastamentos), ou apenas uma nota textual reconhecendo que são exemplos do Neto ainda não mapeados no workshop original — importante notar que o próprio Neto qualificou como "chutando aqui, a Dani e o Jansen são os caras pra isso" (23:53), ou seja, nem ele tinha certeza de que esses eram os itens reais — são exemplos ilustrativos, não uma lista validada.

---

## 7. Achados adicionais fora da lista preliminar

### 7.1 Squad Performa IT formalizada + inclusão de UX

Carol (55:17): *"Dentro da Squad e Time da Performa, nós também pedimos um Wax [UX], porque a gente entende que está faltando esse olhar de usuário da ferramenta."* — já consistente com o resumo executivo da própria transcrição ("Squad Performa IT: incluir UX na equipe"). Não contradiz nada em `PROJECT-STATE.md`, é reforço/formalização do que já estava encaminhado. Não requer mudança em `src/data/*`.

### 7.2 Protótipo é "cru" / não exaustivo — onboarding em vídeo como exemplo de gap reconhecido

Speaker 4 (34:24-36:00) reconhece explicitamente que o protótipo/iniciativas não são exaustivos e cita como exemplo concreto de algo não trabalhado no workshop: **onboarding em vídeo / streaming em batches**. Isso é diferente dos gaps do item 6.3 (que vieram de exemplos do Neto sobre "o que o worker quer saber") — este é um gap de *solução*, não de *dor*, citado espontaneamente pelo próprio time da Perform IT como algo do "relatório de imersão" que não chegou a ser discutido no workshop. Vale registrar como nota de transparência se o Plan decidir criar uma seção de "limitações conhecidas do protótipo".

---

## 8. Resumo de decisões que dependem de aprovação humana antes do Plan

1. ~~Como resolver a divergência Spinner vs. Vispira~~ — **RESOLVIDO** (item 1): "Vispira" foi erro de transcrição do Tactiq; o sistema é o Spinner, já registrado corretamente em `S03`. Nenhuma mudança em `S03`; único ajuste decorrente é remover "ATS" de `S01` (IM).
2. Formato do registro para "Workflow" (OutSystems) — entrada própria ou campo dentro de S12 (item 2).
3. Se os gaps de acidente de trabalho / plano médico / escala (item 6.3) viram novas dores formais ou apenas nota textual.
4. Se P05 (cliente no portal) deve ser promovida de provocação para decisão registrada, e como tratar a menção ao "portal do cliente" hoje existente dentro do IEM.
5. Se a validação com usuários (item 5) vira provocação nova ou item de `PROXIMOS_PASSOS`.

---

**Próxima etapa:** aguardar aprovação do humano (Jeff) sobre este research antes de abrir sessão separada de Plan.
