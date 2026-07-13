# Roteiro de Apresentação — S7 Provocações Técnicas

**Tela:** Provocações (6) → CTA final
**Audiência:** Carol (TI) e Jansen (CEO operacional)
**Duração sugerida:** 6–8 minutos — é a tela de fechamento, pode respirar mais que as outras

> Nota (13/07/2026): o bloco de Plano Faseado foi retirado desta tela a pedido do Dimitri (service designer) — ele conduz um plano faseado próprio com o cliente (baseado em risco/capacity/workload), que fecha em reunião separada na sexta-feira. Os dois planos não devem concorrer na mesma apresentação.

---

## Por que essa tela é a mais importante da apresentação

Todas as telas anteriores mostraram o que vocês descobriram. Essa mostra o que vocês **não sabem ainda** — de propósito. É o momento de virar a mesa: em vez de só entregar recomendação, vocês estão pedindo decisão. Isso é o que separa uma consultoria que só relata do parceiro técnico que Jansen e Carol esperam.

**Regra de ouro:** não peça desculpa por ter perguntas em aberto. Enquadre como rigor, não como lacuna.

## Frase de abertura da tela

> "Fechamos o diagnóstico e a proposta. Antes de qualquer coisa avançar, existem 6 perguntas que não podíamos responder sozinhos — porque a resposta está com vocês, não com a gente."

---

## Bloco 1 — As 6 provocações, uma por uma

Não leia a pergunta da tela em voz alta e pare por aí — cada uma precisa de uma frase de "porque isso importa" antes de abrir o card. Ordem sugerida: agrupe as técnicas primeiro (P01, P02, P07), depois as de governança/jurídico (P04, P05, P06).

> Nota: a pergunta de capacidade do squad de TI (antiga P03) foi retirada dessa tela — esse ponto fica pro comercial alinhar direto com o cliente, fora do escopo desse relatório.

### P01 — O novo ERP substitui a plataforma de folha integralmente ou é complementar?
**Antes de ler a pergunta, desambiguar em voz alta — essa é a provocação que mais gera confusão:**
> "Quando falamos em 'novo ERP' aqui, não é o OutSystems e não é o Portal do Worker. É especificamente o sistema que vai substituir a plataforma de folha de vocês — o GINFOR — que a Carol confirmou que muda ano que vem. OutSystems é outra frente, já decidida, pra digitalizar a admissão. Portal do Worker é o que estamos propondo aqui. Os três são coisas diferentes, e essa pergunta é só sobre a primeira."

> "Essa trava a Iniciativa I03 e a Camada de API que mostra holerite e benefícios no Portal. Já sabemos pela nossa conversa de alinhamento que a mudança vem em blocos — o que não sabemos é se construímos pensando em ponte temporária ou em integração definitiva. Se investirmos numa integração com o GINFOR de hoje e ele for substituído por inteiro, esse trabalho é perdido; se o novo sistema for complementar, parte da integração sobrevive à troca."
**Esperado:** decisão binária (substitui / complementa) — não precisa de detalhe técnico agora, só a direção.

### P02 — A integração IM → plataforma de folha: quem é o dono técnico?
> "Vocês já sinalizaram que a integração de candidato passa por uma solução intermediária com o Global. Queremos saber se essa mesma rota serve pra folha, ou se é outro caminho."
**Esperado:** nome de responsável técnico + confirmação se a solução intermediária cobre os dois casos.

### P07 — O rastreio de status do candidato vem via API do OutSystems ou o Portal constrói separado?
> "Essa nasceu de um cruzamento que fizemos com o toolkit de admissão de vocês — ele já lista 'controle de status' como funcionalidade nativa do OutSystems. Se a gente reconstruir isso no Portal, duplica esforço numa frente que vocês pediram pra gente não retrabalhar."
**Esperado:** confirmação técnica — API disponível ou não. Isso muda a estimativa de esforço da Iniciativa I01 na prática.

---

Pausa curta aqui — sinalize a virada de técnico pra governança/jurídico:

> "As próximas três não são sobre sistema — são sobre decisão de negócio e jurídica."

### P04 — Quais BUs precisam alinhar antes de centralizar o controle do worker como holding?
> "É pro Jansen. A diretriz de 'visão de holding, não de BU' já está dada — falta saber quem mais precisa sentar na mesa antes da gente travar arquitetura."
**Esperado:** lista de stakeholders/BUs e se isso bloqueia cronograma ou roda em paralelo.

### P05 — O cliente vai ter acesso ao portal pra acompanhar status?
> "O workshop já registrou essa necessidade. Mas isso muda contrato de serviço, não só tela — por isso é pergunta pros dois."
**Esperado:** sim/não, e se sim, quem no comercial aprova o que aparece pro cliente.

### P06 — Como lidar com acesso do ex-worker sem criar vínculo trabalhista?
> "É jurídica antes de técnica. A gente só desenha o prazo de expiração de conta depois que o jurídico de vocês definir o prazo de retenção."
**Esperado:** um número — prazo definido de acesso pós-desligamento.

---

## Bloco 2 — Fechamento

> "Obrigado pela parceria até aqui. O que a gente leva dessa reunião são as respostas dessas 6 perguntas — é isso que destrava o próximo passo."

Termine com pergunta direta, não com afirmação — força decisão na sala:

> "Dá pra fechar hoje quais dessas 6 vocês respondem agora, e quais precisam de mais tempo?"

---

## Checklist antes de apresentar

- [ ] Ter as 6 provocações na ordem certa decoradas (técnicas primeiro, governança depois)
- [ ] Saber de cor o "esperado" de cada uma — não ler a pergunta e ficar em silêncio esperando resposta
- [ ] Não deixar a reunião terminar sem sair com pelo menos uma resposta concreta de cada bloco (técnico e jurídico/governança)
- [ ] Fechar com a pergunta direta do bloco 2 — não deixar a decisão "pra depois" sem compromisso de data
- [ ] Não mencionar plano faseado/trimestres nesta reunião — isso é conduzido pelo Dimitri, fecha na sexta-feira
