export interface PlanetConfig {
  id: string
  num: number
  label: string
  size: number
  colorFrom: string
  colorTo: string
  hasRing: boolean
  cx: number
  cy: number
  glowColor: string
}

// cx/cy são as coordenadas do centro do planeta em px
// dentro de um container fixo de 700×480px (GalaxyMap)
// id/num/label seguem a ordem horária das specs: S1→S2→S3→S4→S5→S6→S7
export const PLANETS: PlanetConfig[] = [
  {
    id: 'hero',
    num: 1,
    label: 'Contexto',
    size: 44,
    colorFrom: '#6699cc',
    colorTo: '#001144',
    hasRing: false,
    cx: 102,
    cy: 84,
    glowColor: '#2255aa66',
  },
  {
    id: 'diagnostico',
    num: 2,
    label: 'Diagnóstico',
    size: 38,
    colorFrom: '#884455',
    colorTo: '#220011',
    hasRing: false,
    cx: 329,
    cy: 49,
    glowColor: '#88224466',
  },
  {
    id: 'dores',
    num: 3,
    label: 'Dores',
    size: 72,
    colorFrom: '#4488ff',
    colorTo: '#0a2288',
    hasRing: false,
    cx: 604,
    cy: 86,
    glowColor: '#1D57FB88',
  },
  {
    id: 'arquitetura',
    num: 4,
    label: 'Arquitetura',
    size: 34,
    colorFrom: '#556677',
    colorTo: '#111222',
    hasRing: false,
    cx: 663,
    cy: 217,
    glowColor: '#33445566',
  },
  {
    id: 'iniciativas',
    num: 5,
    label: 'Iniciativas',
    size: 58,
    colorFrom: '#448899',
    colorTo: '#001122',
    hasRing: true,
    cx: 571,
    cy: 371,
    glowColor: '#22556688',
  },
  {
    id: 'portal',
    num: 6,
    label: 'Portal do Worker',
    size: 78,
    colorFrom: '#66aaff',
    colorTo: '#003399',
    hasRing: false,
    cx: 179,
    cy: 401,
    glowColor: '#1D57FBaa',
  },
  {
    id: 'provocacoes',
    num: 7,
    label: 'Próximos Passos',
    size: 64,
    colorFrom: '#334488',
    colorTo: '#000830',
    hasRing: true,
    cx: 52,
    cy: 172,
    glowColor: '#00145A88',
  },
]
