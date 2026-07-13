import { FASES } from '../../../data/provocacoes'
import { INICIATIVAS } from '../../../data/iniciativas'
import type { FasePlano, Iniciativa } from '../../../types'

interface FaseCardProps {
  fase: FasePlano
}

function FaseCard({ fase }: FaseCardProps) {
  const iniciativas = fase.iniciativaIds
    .map((id) => INICIATIVAS.find((i) => i.id === id))
    .filter((i): i is Iniciativa => i !== undefined)

  return (
    <div className="flex-1 border border-gi-orbit rounded-xl p-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-bold text-gi-stardust uppercase tracking-wide">
          Fase {fase.numero}
        </span>
        <span className="text-gi-crater text-xs">·</span>
        <span className="text-xs font-bold text-gi-blue uppercase tracking-wide">{fase.periodo}</span>
      </div>
      <h4 className="text-white font-bold text-lg mb-4">{fase.titulo}</h4>
      <ul className="space-y-3">
        {iniciativas.map((i) => (
          <li key={i.id} className="flex items-start gap-2">
            <span className="text-gi-blue text-xs font-bold mt-0.5 flex-shrink-0">{i.id}</span>
            <span className="text-gi-comet text-sm leading-snug">{i.titulo}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function PlanoFaseado() {
  return (
    <div>
      <h3 className="text-2xl font-bold text-white mb-2">Plano faseado recomendado</h3>
      <p className="text-gi-stardust mb-8">17 iniciativas distribuídas em 3 horizontes de entrega</p>
      <div className="flex gap-6">
        {FASES.map((fase) => (
          <FaseCard key={fase.numero} fase={fase} />
        ))}
      </div>
    </div>
  )
}

export default PlanoFaseado
