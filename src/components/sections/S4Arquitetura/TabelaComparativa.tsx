import { UserPlus, Briefcase, LogOut } from 'lucide-react'
import { COMPARATIVO_ARQ } from '../../../data/arquitetura'
import type { Jornada } from '../../../types'

type JornadaConfig = {
  label: string
  Icon: React.ComponentType<{ className?: string }>
  iconClass: string
}

const JORNADA_CONFIG: Record<Jornada, JornadaConfig> = {
  admissao: { label: 'Admissão', Icon: UserPlus, iconClass: 'text-gi-blue' },
  'ciclo-ativo': { label: 'Ciclo Ativo', Icon: Briefcase, iconClass: 'text-gi-navy' },
  offboarding: { label: 'Offboarding', Icon: LogOut, iconClass: 'text-gi-steel' },
}

function TabelaComparativa() {
  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold text-gi-navy mb-6">O que muda em cada jornada</h3>
      <div className="rounded-xl overflow-hidden border border-gi-border">
        {/* Cabeçalho */}
        <div className="grid grid-cols-[180px_1fr_1fr] text-xs font-bold uppercase tracking-wide">
          <div className="px-6 py-4 bg-gi-navy text-white">Jornada</div>
          <div className="px-6 py-4 bg-gi-charcoal text-white border-l border-white/10">As-is — hoje</div>
          <div className="px-6 py-4 bg-gi-blue text-white border-l border-white/10">To-be — Portal</div>
        </div>

        {/* Linhas */}
        {COMPARATIVO_ARQ.map((item, index) => {
          const { label, Icon, iconClass } = JORNADA_CONFIG[item.jornada]
          const rowBg = index % 2 === 0 ? 'bg-white' : 'bg-gi-light'
          return (
            <div key={item.jornada} className={`grid grid-cols-[180px_1fr_1fr] ${rowBg}`}>
              <div className="px-6 py-5 flex items-center gap-2 border-b border-gi-border">
                <Icon className={`w-4 h-4 flex-shrink-0 ${iconClass}`} />
                <span className="text-sm font-bold text-gi-dark">{label}</span>
              </div>
              <div className="px-6 py-5 border-l border-b border-gi-border">
                <p className="text-sm text-gi-text leading-relaxed">{item.asIs}</p>
              </div>
              <div className="px-6 py-5 border-l border-b border-gi-border">
                <p className="text-sm text-gi-navy font-medium leading-relaxed">{item.toBe}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TabelaComparativa
