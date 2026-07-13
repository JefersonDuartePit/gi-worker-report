import type { FasePlano, Provocacao } from '../types'

export const PROVOCACOES: Provocacao[] = [
  {
    id: 'P01',
    pergunta: 'O novo ERP substitui a plataforma de folha integralmente ou é complementar?',
    contexto: 'Isso define o que faz sentido construir agora versus o que vai ser refeito com a nova plataforma em 2027. Construir integrações sobre um sistema que vai ser descontinuado é risco alto.',
    destinatario: 'carol',
  },
  {
    id: 'P02',
    pergunta: 'A integração IEM → plataforma de folha hoje — quem é o dono técnico? É possível estender sem aprovação global?',
    contexto: 'A iniciativa I03 (eliminar triple data entry) depende de uma camada de integração. Antes de começar, precisamos saber quem controla esse fluxo e qual o nível de autonomia do Brasil.',
    destinatario: 'carol',
  },
  {
    id: 'P03',
    pergunta: 'O squad de TI tem capacidade para o portal do worker em paralelo com a admissão em OutSystems?',
    contexto: 'Dois projetos de plataforma simultâneos exigem planejamento de capacity. Se houver conflito de prioridade, qual projeto trava?',
    destinatario: 'carol',
  },
  {
    id: 'P04',
    pergunta: 'Quais BUs precisam alinhar antes de centralizar o controle do worker como holding?',
    contexto: 'A solução não pode ser desenhada para uma única BU. Se outras regionais tiverem processos divergentes, o portal do worker vira problema político antes de virar produto.',
    destinatario: 'jansen',
  },
  {
    id: 'P05',
    pergunta: 'O cliente (ex: Shopee) vai ter acesso ao portal do worker para acompanhar status?',
    contexto: 'A visibilidade do cliente foi listada como necessidade no workshop. Mas requer alinhamento comercial — o que o cliente pode ver muda o contrato de serviço, não só a arquitetura.',
    destinatario: 'ambos',
  },
  {
    id: 'P06',
    pergunta: 'Como lidar com o acesso do ex-worker após o desligamento sem criar vínculo trabalhista?',
    contexto: 'O portal pós-desligamento precisa de autenticação e prazo de acesso definidos. Essa é uma questão jurídica antes de técnica — quem define o prazo de retenção de dados do ex-worker?',
    destinatario: 'ambos',
  },
]

export const FASES: FasePlano[] = [
  {
    numero: 1,
    titulo: 'Centralização imediata',
    periodo: 'H2 2026',
    iniciativaIds: ['I01', 'I02', 'I07', 'I10', 'I13', 'I17'],
  },
  {
    numero: 2,
    titulo: 'Integração e automação',
    periodo: 'H1 2027',
    iniciativaIds: ['I03', 'I05', 'I06', 'I08', 'I12', 'I14'],
  },
  {
    numero: 3,
    titulo: 'Maturidade e escala',
    periodo: 'H2 2027',
    iniciativaIds: ['I04', 'I09', 'I11', 'I15', 'I16'],
  },
]

export const PROXIMOS_PASSOS: string[] = [
  'Agenda técnica com squad de TI da Carol para mapeamento de APIs disponíveis',
  'Acesso à pasta gravada do processo de admissão (prometida pela Carol)',
  'Alinhamento de holding com BUs sobre controle centralizado do worker',
  'Definição do escopo do portal do worker dentro do IT Master Plan H2 2026',
]
