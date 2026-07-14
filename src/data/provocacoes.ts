import type { FasePlano, Provocacao } from '../types'

export const PROVOCACOES: Provocacao[] = [
  {
    id: 'P01',
    pergunta: 'O novo ERP substitui a plataforma de folha integralmente ou é complementar?',
    contexto: 'Isso define o que faz sentido construir agora versus o que vai ser refeito com a nova plataforma em 2027. Construir integrações sobre um sistema que vai ser descontinuado é risco alto. Na reunião de Alinhamento TI (16/06/2026), Carol confirmou que a mudança da plataforma de folha está prevista para o próximo ano e que a migração ocorrerá "em blocos" (incremental, não big-bang) — mas não especificou se é substituição total ou complementar. Na reunião de apresentação dos insights sistêmicos (13/07/2026, 57:28-58:32), Carol detalhou que hoje quem gera nota fiscal ainda é a plataforma de folha atual, e que o Global sinalizou o Navision (ERP global do grupo) como candidato à substituição — mas ainda "bem embrionário", sem clareza de até que ponto suas funcionalidades atendem. No curto prazo, a integração continua via a plataforma de folha atual.',
    destinatario: 'carol',
  },
  {
    id: 'P02',
    pergunta: 'A integração IM → plataforma de folha hoje — quem é o dono técnico? É possível estender sem aprovação global?',
    contexto: 'A iniciativa I03 (eliminar triple data entry) depende de uma camada de integração. Antes de começar, precisamos saber quem controla esse fluxo e qual o nível de autonomia do Brasil. Na reunião de 16/06/2026, Carol adiantou que a integração de dados de candidato "talvez não venha diretamente do Spinner" — a GI está construindo uma solução intermediária com o Global para ganhar mais autonomia local. Vale confirmar se essa solução intermediária também cobre a integração com a plataforma de folha. Respondido parcialmente na reunião de apresentação dos insights sistêmicos (13/07/2026, 59:23-59:46): o dono técnico é o próprio time de sistemas da Carol; hoje a integração acontece via extração de views (não API, não RPA), sem documentação formal. A parte "é possível estender sem aprovação global?" não foi respondida diretamente — Carol não tratou isso como dependente do Global, mas também não confirmou viabilidade de extensão.',
    destinatario: 'carol',
  },
  {
    id: 'P04',
    pergunta: 'Quais BUs precisam alinhar antes de centralizar o controle do worker como holding?',
    contexto: 'A solução não pode ser desenhada para uma única BU. Se outras regionais tiverem processos divergentes, o portal do worker vira problema político antes de virar produto. Na reunião de apresentação dos insights sistêmicos (13/07/2026, 01:00:38), o time Care (representado por Ícaro, citando também Dani e Leandro por SMS) detalhou: o Care já está centralizado via Hub/Virtual Hub; a centralização pendente é especificamente do SMS (Leandro), ainda descentralizado.',
    destinatario: 'jansen',
  },
  {
    id: 'P05',
    pergunta: 'O cliente (ex: Shopee) vai ter acesso ao portal do worker para acompanhar status?',
    contexto: 'A visibilidade do cliente foi listada como necessidade no workshop. Mas requer alinhamento comercial — o que o cliente pode ver muda o contrato de serviço, não só a arquitetura. Respondido de forma definitiva na reunião de apresentação dos insights sistêmicos (13/07/2026): não, portais separados — a visão do worker é de solicitação e status individual; o portal do cliente é uma visão à parte (01:02:36). Carol esclareceu ainda (01:05:09) que o "portal do cliente" hoje existente dentro do IEM não é o portal do cliente oficial futuro — é uma solução comercial legada, com outro propósito, completamente fora do IEM oficial. Resta em aberto o alinhamento comercial de exatamente quais dados o futuro portal do cliente oficial poderá expor.',
    destinatario: 'ambos',
  },
  {
    id: 'P06',
    pergunta: 'Como lidar com o acesso do ex-worker após o desligamento sem criar vínculo trabalhista?',
    contexto: 'O portal pós-desligamento precisa de autenticação e prazo de acesso definidos. Essa é uma questão jurídica antes de técnica — quem define o prazo de retenção de dados do ex-worker?',
    destinatario: 'ambos',
  },
  {
    id: 'P07',
    pergunta: 'O rastreio de status do candidato (Iniciativa I01) deve vir via API do OutSystems, ou o Portal do Worker precisa construir essa visibilidade de forma independente?',
    contexto: 'O Toolkit de Mapeamento do Processo de Admissão já lista "envio automático de link" e "controle de status" como funcionalidades nativas do novo fluxo em OutSystems, com responsabilidade "Local (IM e Outsystems)". Se o Portal do Worker reconstruir essa visibilidade do zero, corremos o risco de duplicar um esforço que a própria diretriz de "admissão sem retrabalho" (reunião de 16/06/2026) deveria evitar. Precisamos saber se o Portal apenas consome essa informação via API do OutSystems (esforço baixo) ou se precisa de solução própria — o que muda a estimativa de esforço de I01, hoje classificada como "médio".',
    destinatario: 'carol',
  },
]

export const FASES: FasePlano[] = [
  {
    numero: 1,
    titulo: 'Centralização imediata',
    periodo: 'Q3 2026',
    iniciativaIds: ['I01', 'I02', 'I07', 'I10', 'I13', 'I17'],
  },
  {
    numero: 2,
    titulo: 'Integração e automação',
    periodo: 'Q4 2026',
    iniciativaIds: ['I03', 'I05', 'I06', 'I08', 'I12', 'I14'],
  },
  {
    numero: 3,
    titulo: 'Governança e controle',
    periodo: 'Q1 2027',
    iniciativaIds: ['I04', 'I09', 'I11', 'I15', 'I16'],
  },
]

export const PROXIMOS_PASSOS: string[] = [
  'Agenda técnica com squad de TI da Carol para mapeamento de APIs disponíveis',
  'Acesso à pasta gravada do processo de admissão (prometida pela Carol)',
  'Alinhamento de holding com BUs sobre controle centralizado do worker',
  'Definição do escopo do portal do worker dentro do IT Master Plan H2 2026',
  'Agenda dedicada de arquitetura com o arquiteto de TI da GI, para aprofundar decisões de estrutura e integração (pedido por Neto e reforçado pela Carol na reunião de 13/07/2026)',
  'Validar com Dani/Jansen se os exemplos citados pelo Neto na reunião de 13/07/2026 (dúvidas de acidente de trabalho, consulta a plano médico, mudança de escala) são necessidades reais do worker antes de formalizá-las como dores no relatório — hoje são exemplos ilustrativos não validados pelo workshop original',
]
