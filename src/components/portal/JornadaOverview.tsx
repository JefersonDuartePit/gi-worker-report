import { Check } from 'lucide-react'
import type { PortalScreen } from '../../hooks/usePortalNav'

interface JornadaOverviewProps {
  onNavigate: (screen: PortalScreen) => void
}

const CICLO_ATIVO_ATALHOS: { screen: PortalScreen; label: string }[] = [
  { screen: 'documentos', label: 'Documentos' },
  { screen: 'solicitacoes', label: 'Solicitações' },
  { screen: 'treinamentos', label: 'Treinamentos' },
  { screen: 'desenvolvimento', label: 'Desenvolvimento' },
]

function JornadaOverview({ onNavigate }: JornadaOverviewProps) {
  return (
    <div className="bg-white rounded-xl border border-gi-border shadow-sm p-5">
      <p className="text-[10px] font-bold text-gi-charcoal uppercase tracking-widest mb-4">Sua jornada na GI Group</p>

      <div className="flex items-center">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-full bg-gi-green flex items-center justify-center text-white shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-gi-dark">Admissão</span>
        </div>

        <div className="flex-1 h-px bg-gi-border mx-3" />

        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-full bg-gi-blue flex items-center justify-center text-white text-xs font-bold shrink-0">
            2
          </div>
          <span className="text-xs font-bold text-gi-navy">Ciclo ativo</span>
        </div>

        <div className="flex-1 h-px bg-gi-border mx-3" />

        <button
          onClick={() => onNavigate('rescisao')}
          className="flex items-center gap-2 shrink-0 group"
        >
          <div className="w-7 h-7 rounded-full border-2 border-gi-border flex items-center justify-center text-gi-charcoal text-xs font-bold shrink-0 group-hover:border-gi-blue group-hover:text-gi-blue transition-colors">
            3
          </div>
          <span className="text-xs font-bold text-gi-charcoal group-hover:text-gi-blue transition-colors">Offboarding</span>
        </button>
      </div>

      <p className="text-xs text-gi-text mt-4">
        Você está no <span className="font-bold text-gi-navy">ciclo ativo</span> do seu contrato com a Shopee SP. Acesse rapidamente:
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
        {CICLO_ATIVO_ATALHOS.map(atalho => (
          <button
            key={atalho.screen}
            onClick={() => onNavigate(atalho.screen)}
            className="text-xs font-bold text-gi-navy bg-gi-light hover:bg-blue-50 hover:text-gi-blue rounded-lg py-2.5 transition-colors"
          >
            {atalho.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default JornadaOverview
