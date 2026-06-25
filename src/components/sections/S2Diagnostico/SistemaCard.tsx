import { cn } from '../../../lib/utils'
import Badge from '../../ui/Badge'
import Card from '../../ui/Card'
import type { Sistema } from '../../../types'

interface SistemaCardProps {
  sistema: Sistema
}

function SistemaCard({ sistema }: SistemaCardProps) {
  return (
    <div className="relative group">
      <div
        className={cn(
          'absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 z-50',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none',
        )}
      >
        <div className="bg-gi-dark text-white rounded-lg p-3 text-xs shadow-lg">
          <p className="mb-1.5">
            <span className="font-bold">Função: </span>
            {sistema.funcao}
          </p>
          <p className="mb-1.5">
            <span className="font-bold">Problema: </span>
            {sistema.problema}
          </p>
          <p>
            <span className="font-bold">Decisão: </span>
            {sistema.decisaoProposta}
          </p>
        </div>
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-4 border-transparent border-t-gi-dark" />
      </div>

      <Card variant="hoverable" className="p-4">
        {sistema.status === 'nao-toca' && (
          <Badge variant="bloqueado" className="mb-2">Intocável</Badge>
        )}
        <h4 className="text-sm font-bold text-gi-dark leading-tight">{sistema.nome}</h4>
        <p className="text-xs text-gi-text mt-1 line-clamp-2">{sistema.funcao}</p>
      </Card>
    </div>
  )
}

export default SistemaCard
