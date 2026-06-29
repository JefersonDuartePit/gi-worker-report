import DorTooltip from './DorTooltip'
import ProgressBar from '../ui/ProgressBar'
import Badge from '../ui/Badge'
import Card from '../ui/Card'
import Button from '../ui/Button'

interface EtapaRescisao {
  label: string
  status: 'concluida' | 'em-andamento' | 'futura'
}

const DIA_ATUAL = 3
const DIAS_TOTAL = 10

const ETAPAS: EtapaRescisao[] = [
  { label: 'Aviso de desligamento recebido', status: 'concluida' },
  { label: 'Cálculo do TRCT', status: 'em-andamento' },
  { label: 'Assinatura dos documentos', status: 'futura' },
  { label: 'Documentos disponibilizados', status: 'futura' },
]

const STATUS_BADGE: Record<EtapaRescisao['status'], { variant: 'concluido' | 'andamento' | 'bloqueado'; label: string }> = {
  concluida: { variant: 'concluido', label: 'Concluída' },
  'em-andamento': { variant: 'andamento', label: 'Em andamento' },
  futura: { variant: 'bloqueado', label: 'Futura' },
}

function TelaRescisao() {
  return (
    <div className="p-6 space-y-4">
      <DorTooltip dorId="D09" iniciativaId="I13">
        <Card>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-gi-dark">Processo de rescisão</span>
            <span className="text-xs text-gi-charcoal">Dia {DIA_ATUAL} de {DIAS_TOTAL}</span>
          </div>
          <ProgressBar value={DIA_ATUAL} max={DIAS_TOTAL} />
          <p className="text-xs text-gi-charcoal mt-2">Previsão de disponibilização dos documentos: dia 10</p>
        </Card>
      </DorTooltip>

      <div className="space-y-2">
        {ETAPAS.map(etapa => (
          <Card key={etapa.label} className="flex items-center justify-between p-4">
            <span className="text-sm font-bold text-gi-dark">{etapa.label}</span>
            <Badge variant={STATUS_BADGE[etapa.status].variant}>{STATUS_BADGE[etapa.status].label}</Badge>
          </Card>
        ))}
      </div>

      <Button variant="secondary">Falar com o time GI</Button>
    </div>
  )
}

export default TelaRescisao
