# Roteiro de Apresentação — S4 Arquitetura As-is / To-be

**Tela:** Diagrama comparativo (toggle As-is / To-be) + tabela por jornada
**Duração sugerida:** 3–4 minutos

---

## Abertura — enquadrar como desenho macro

> "Esse diagrama é um desenho macro, não uma especificação técnica. Ele existe pra alinhar direção, não pra travar decisão de integração — os detalhes de cada conexão a gente resolve junto com o time técnico de vocês depois."

Diga isso **antes** de abrir o To-be. Evita que a Carol leia o diagrama como compromisso de arquitetura fechado.

## As-is — 15 segundos, só contextualizar

> "Isso aqui é só pra lembrar o ponto de partida: Colaborador GI no meio de tudo, sistemas isolados, canais duplicados. Já mostramos isso na tela anterior — bora pro To-be."

Não perca tempo aqui, já foi coberto no Diagnóstico.

## To-be — os três grupos, bem separados

### 1. O que é construído do zero
> "O Portal do Worker e a Central de Atendimento Unificada são construção nova — interface, autoatendimento, roteamento de solicitação. Isso não existe hoje em lugar nenhum, é o produto que estamos propondo."

### 2. O que depende de checagem de viabilidade técnica
> "A Camada de API que conecta o Portal à plataforma de folha, ao D4Sign, ao SOC — isso é intenção de arquitetura, não integração fechada. Cada uma dessas conexões precisa passar pelo time técnico de vocês pra confirmar se é viável, com que esforço, e se depende de aprovação do Global. Não é à toa que trouxemos isso como provocação técnica mais adiante."

Aponte a camada de API no diagrama enquanto fala — deixa visível que é uma peça, não um cabo já puxado.

### 3. Onde o OutSystems entra
> "O OutSystems não aparece aqui como algo que a gente vai construir — ele já é decisão de vocês, já em andamento, pro fluxo de admissão. No diagrama, ele está representado como 'Automação Admissão': o Portal não reconstrói isso, ele referencia e, idealmente, consome o que o OutSystems já vai entregar. Essa fronteira entre 'o que o Portal expõe' e 'o que o OutSystems já resolve' é justamente uma das perguntas que deixamos em aberto pra vocês."

Esse é o ponto mais importante da tela — não deixe passar batido. Se a Carol ou o Jansen não perguntarem, pergunte você: "faz sentido essa divisão pra vocês?"

## Pergunta provável

**"Vocês vão construir a integração com a folha agora?"**
→ "Não. O diagrama mostra a intenção da conexão — a viabilidade técnica real depende da resposta de vocês sobre o novo ERP, que é uma das nossas provocações."

## Transição

> "Esse era o desenho de destino. Agora vamos mostrar as 17 iniciativas que preenchem esse caminho, e em que ordem recomendamos implementar."
