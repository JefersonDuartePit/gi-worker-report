export type Jornada = 'admissao' | 'ciclo-ativo' | 'offboarding'

export type Persona = 'worker' | 'colaborador-gi' | 'cliente'

export type Esforco = 'baixo' | 'medio' | 'alto'

export type Impacto = 'baixo' | 'medio' | 'alto'

export type StatusSistema = 'usa' | 'integra' | 'substitui' | 'nao-toca'

// 'confirmado': decisão ou classificação dita literalmente pela Carol/GI em reunião ou documento oficial
// 'documentado': derivado do workshop ou de documentos internos da GI, sem citação direta da Carol
// 'inferido': leitura/hipótese da Perform IT sem decisão da GI por trás — sujeito a validação
export type ConfiancaClassificacao = 'confirmado' | 'documentado' | 'inferido'

export interface Iniciativa {
  id: string
  titulo: string
  descricao: string
  jornada: Jornada
  personas: Persona[]
  doresResolvidas: string[]
  sistemaSubstituido?: string
  esforco: Esforco
  impacto: Impacto
  telasRelacionadas?: string[]
}

export interface Dor {
  id: string
  titulo: string
  descricao: string
  personas: Persona[]
  jornada: Jornada
  severidade: 'critica' | 'alta' | 'media'
  iniciativaQueResolve: string
}

export interface Sistema {
  id: string
  nome: string
  funcao: string
  status: StatusSistema
  doresAssociadas: string[]
  restricao?: string
  problema: string
  decisaoProposta: string
  confianca: ConfiancaClassificacao
  fonte: string
}

export interface Provocacao {
  id: string
  pergunta: string
  contexto: string
  destinatario: 'carol' | 'jansen' | 'ambos'
}

export type UiState = 'splash' | 'galaxy' | 'module'

export interface PresentationContextValue {
  mode: 'presentation' | 'exploration'
  currentStep: number
  next: () => void
  prev: () => void
  toggle: () => void
  goTo: (step: number) => void
  portalTargetScreen: string | null
  setPortalTargetScreen: (screen: string | null) => void
}

export interface SectionMeta {
  id: string
  label: string
  Component: React.ComponentType
}

export type VistaArquitetura = 'as-is' | 'to-be'

export type TipoNoArq =
  | 'hub-worker'
  | 'hub-portal'
  | 'canal'
  | 'sistema'
  | 'automacao'
  | 'cliente'
  | 'intermediario'

export interface NoArq {
  id: string
  label: string
  tipo: TipoNoArq
  descricao: string
  x: number  // posição em % do container (0–100), centro do nó
  y: number  // posição em % do container (0–100), centro do nó
}

export interface ArestaArq {
  from: string
  to: string
  estilo?: 'solida' | 'tracejada'
}

export interface DiagramaArq {
  nos: NoArq[]
  arestas: ArestaArq[]
}

export interface ComparativoArq {
  jornada: Jornada
  asIs: string
  toBe: string
}

export interface FasePlano {
  numero: 1 | 2 | 3
  titulo: string
  periodo: string
  iniciativaIds: string[]
}
