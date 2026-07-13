import type { DiagramaArq, TipoNoArq, VistaArquitetura } from '../../../types'

interface DiagramaArquiteturaProps {
  diagrama: DiagramaArq
  vista: VistaArquitetura
}

const NO_CLASSES: Record<TipoNoArq, string> = {
  'hub-worker': 'bg-gi-navy text-white rounded-xl px-3 py-2 text-xs font-bold shadow-md w-20 text-center leading-snug',
  'hub-portal': 'bg-gi-blue text-white rounded-xl px-3 py-2 text-xs font-bold shadow-md w-24 text-center leading-snug',
  'canal': 'bg-white text-gi-dark border-2 border-gi-amber rounded-lg px-2 py-1 text-[11px] font-bold w-24 text-center leading-snug',
  'sistema': 'bg-gi-light text-gi-charcoal border border-gi-border rounded-lg px-2 py-1 text-[11px] w-24 text-center leading-snug',
  'automacao': 'bg-white text-gi-dark border-2 border-gi-green rounded-lg px-2 py-1 text-[11px] font-bold w-24 text-center leading-snug',
  'cliente': 'bg-white text-gi-dark border-2 border-gi-steel rounded-lg px-2 py-1 text-[11px] font-bold w-20 text-center leading-snug',
  'intermediario': 'bg-white text-gi-dark border-2 border-gi-red rounded-lg px-2 py-1 text-[11px] font-bold w-28 text-center leading-snug',
}

function DiagramaArquitetura({ diagrama, vista }: DiagramaArquiteturaProps) {
  const noMap = Object.fromEntries(diagrama.nos.map(n => [n.id, n]))

  return (
    <div className="relative w-full h-[500px] select-none">
      {/* SVG overlay — arestas */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {diagrama.arestas.map((aresta, i) => {
          const from = noMap[aresta.from]
          const to = noMap[aresta.to]
          if (!from || !to) return null
          const estilo = aresta.estilo ?? 'solida'
          return (
            <line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              className={estilo === 'solida' ? 'stroke-gi-charcoal' : 'stroke-gi-border'}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              strokeDasharray={estilo === 'tracejada' ? '4 3' : undefined}
            />
          )
        })}
      </svg>

      {/* Nós */}
      {diagrama.nos.map(no => (
        <div
          key={no.id}
          className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 ${NO_CLASSES[no.tipo]}`}
          style={{ left: `${no.x}%`, top: `${no.y}%` }}
          title={no.descricao}
        >
          {no.label}
        </div>
      ))}

      {/* Legenda */}
      <div className="absolute bottom-0 left-0 flex gap-6 text-[10px] text-gi-charcoal">
        <span className="flex items-center gap-1.5">
          <svg width="20" height="8" viewBox="0 0 20 8" aria-hidden="true">
            <line x1="0" y1="4" x2="20" y2="4" className="stroke-gi-charcoal" strokeWidth="1.5" />
          </svg>
          {vista === 'as-is' ? 'conexão direta' : 'integração'}
        </span>
        <span className="flex items-center gap-1.5">
          <svg width="20" height="8" viewBox="0 0 20 8" aria-hidden="true">
            <line x1="0" y1="4" x2="20" y2="4" className="stroke-gi-border" strokeWidth="1.5" strokeDasharray="4 3" />
          </svg>
          {vista === 'as-is' ? 'acesso indireto' : 'automação'}
        </span>
      </div>
    </div>
  )
}

export default DiagramaArquitetura
