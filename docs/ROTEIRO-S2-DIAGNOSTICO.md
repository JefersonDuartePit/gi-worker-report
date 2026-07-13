# Roteiro de Apresentação — S2 Diagnóstico Sistêmico

**Tela:** Mapa de Sistemas (4 quadrantes: Usa / Integra / Substitui / Não Toca)
**Audiência:** Carol (TI) e Jansen (CEO operacional) — plateia técnica e executiva ao mesmo tempo
**Duração sugerida:** 4–6 minutos

---

## 1. Objetivo da tela na narrativa

Essa é a primeira tela de conteúdo depois da abertura, e o papel dela é um só: **provar que vocês entenderam a bagunça antes de propor qualquer solução.** Ainda não é hora de mostrar o Portal — é hora de mostrar que o diagnóstico foi feito com rigor, sistema por sistema, e que cada classificação tem uma razão de existir. Isso compra credibilidade pro resto da apresentação.

Não abra falando de solução. Abra falando do estado atual.

---

## 2. Frase de abertura (ao entrar na tela)

> "Antes de mostrar o que propomos, queremos mostrar o que mapeamos. Esse é o retrato de todos os sistemas que hoje tocam a jornada do worker — 15 no total — organizados em quatro grupos: os que continuam como estão, os que vão ganhar integração, os que devem ser substituídos, e os que são intocáveis por decisão do Global."

Deixe a tela parada 2-3 segundos antes de continuar — dá tempo da Carol reconhecer os próprios sistemas na tela.

---

## 3. Como navegar ao vivo

- Comece com **"Todos"** selecionado, pra dar a visão geral de fragmentação.
- Clique no filtro de cada quadrante conforme for falando dele — os outros ficam esmaecidos, reforça o foco visual.
- Passe o mouse sobre 1–2 sistemas por quadrante pra abrir o tooltip (Função / Problema / Decisão) — não leia o tooltip inteiro em voz alta, use como apoio visual enquanto você fala o resumo.

---

## 4. Quadrante por quadrante

### Não Toca (2 sistemas: Spinner, Portal do Candidato Global)

> "Esses dois estão aqui porque a própria Carol nos disse, na nossa reunião de alinhamento, que são sistemas globais — controlados pela matriz italiana, fora do nosso escopo de mexer sem aprovação. Não é uma suposição nossa: foi você, Carol, que definiu essa fronteira, e por isso desenhamos a arquitetura toda respeitando ela."

Ponto forte: citar que a restrição veio da própria Carol reforça que vocês ouviram, não estão flexibilizando escopo por conta própria.

### Substitui (7 sistemas: Plataforma de Folha, Fusion, Blip/WhatsApp, TomTicket, GLPI, VIP, DocSign)

> "Esse é o quadrante mais carregado, e não por acaso — é onde mora a fragmentação de comunicação que vocês descreveram: quatro canais diferentes pro worker falar com a GI, dois sistemas fazendo a mesma assinatura eletrônica, um ERP de folha com prazo de troca já confirmado."

Se pausar em um sistema, pause no **Blip/WhatsApp/TomTicket/GLPI/VIP** — é o grupo que mais conecta com a dor que a Carol trouxe pessoalmente na reunião ("fragmentação na comunicação com o worker, múltiplos canais e sistemas"). Cite a frase dela se quiser reforçar.

### Integra (5 sistemas: IM, D4Sign, SOC, Ponto Mais, Zeev)

> "Esses cinco não desaparecem — continuam existindo, só que hoje operam isolados, e a proposta é conectá-los via API numa camada única, em vez de cada um seguir sendo alimentado manualmente."

Cuidado ao falar do **IM**: ele mudou de classificação recentemente (era "sem mudança prevista", agora é "integra"), porque o toolkit de admissão mostra que o OutSystems vai orquestrar por cima dele, não substituí-lo. Se a Carol perguntar por que o IM não está em "substitui", essa é a resposta.

### Usa (1 sistema: OutSystems)

> "E aqui está o único sistema que classificamos como 'sem mudança de rota' — porque a decisão já está tomada e em andamento por vocês. O OutSystems é o pilar da nova admissão, e por isso tratamos ele como referência de contexto, não como algo pra redesenhar."

Esse é o momento de reforçar que vocês respeitaram o limite combinado: "admissão sem retrabalho".

---

## 5. Sistemas que pedem cuidado extra ao falar

Internamente, dois sistemas (Fusion e Zeev) têm classificação marcada como "inferência da Perform IT" — não é algo que a Carol confirmou, é leitura de vocês em cima do toolkit de admissão. Isso **não aparece na tela**, mas você deve saber na hora de responder:

- **Fusion:** se perguntarem por que ele não está mais junto do Spinner como "intocável" — explique que na reunião a Carol nomeou só "RP global" como restrito, sem citar o Fusion, e que o toolkit aponta duplicidade dele com o IM. Termine com uma pergunta aberta pra ela: "faz sentido tratarmos o Fusion como candidato à consolidação, ou ele também tem alguma trava que não mapeamos?"
- **Zeev:** se perguntarem o que é esse sistema (é pouco conhecido fora do time de SST) — explique que veio do toolkit de mapeamento de admissão, usado pra agendar exames, e que a proposta de integração ainda é hipótese de vocês, não validada.

Não precisa levantar isso proativamente — só tenha a resposta pronta se vier a pergunta.

---

## 6. Perguntas prováveis e como responder

**"Por que 15 sistemas e não os 12 que a gente mapeou no workshop?"**
→ "Cruzamos o mapeamento do workshop com o toolkit de admissão que vocês compartilharam e com a nossa conversa de alinhamento. Três sistemas apareceram nessa checagem — Zeev, DocSign e o Fusion como entrada separada do Spinner — e achamos importante deixar isso rastreável em vez de simplificar."

**"O GINFOR vai sumir ou continuar existindo de outro jeito?"**
→ Ponte direta pra Provocação P01: "Essa é exatamente uma das perguntas que trouxemos pra vocês — sabemos que a plataforma de folha vai mudar em blocos no próximo ano, mas não sabemos se o novo sistema substitui tudo ou convive com o atual. Queremos fechar isso com vocês antes de desenhar a integração."

**"Isso já reflete o que conversamos na reunião de TI?"**
→ "Sim — usamos a transcrição da nossa conversa como fonte pra várias dessas classificações, principalmente as restrições de sistemas intocáveis."

---

## 7. Frase de transição para a próxima tela (S3 Dores)

> "Esse mapa mostra o *onde* — onde a fragmentação mora tecnicamente. Agora vamos mostrar o *pra quem* — quem sente essa fragmentação no dia a dia, e como isso aparece nas três personas que vocês nos ajudaram a mapear."

---

## 8. Checklist rápido antes de apresentar

- [ ] Testar o filtro dos 4 quadrantes ao vivo antes da reunião (garantir que a animação de esmaecimento está suave)
- [ ] Decorar os 2 sistemas "Não Toca" e a frase da Carol de origem
- [ ] Ter a resposta do IM pronta (mudou de "usa" pra "integra")
- [ ] Ter a resposta de Fusion e Zeev pronta, só se perguntarem
- [ ] Não ler os tooltips em voz alta — usar como apoio visual, não como script
