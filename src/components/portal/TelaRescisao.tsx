import DorTooltip from './DorTooltip'
import ProgressBar from '../ui/ProgressBar'
import Badge from '../ui/Badge'
import Card from '../ui/Card'
import Button from '../ui/Button'

interface EtapaRescisao {
  label: string
  data: string
  status: 'concluida' | 'em-andamento' | 'futura'
}

const DIA_ATUAL = 3
const DIAS_TOTAL = 10

const ETAPAS: EtapaRescisao[] = [
  { label: 'Aviso de desligamento recebido', data: '24/06/2026', status: 'concluida' },
  { label: 'Cálculo do TRCT', data: 'em andamento', status: 'em-andamento' },
  { label: 'Exame demissional (ASO)', data: 'previsto p/ 29/06/2026', status: 'futura' },
  { label: 'Assinatura dos documentos', data: 'previsto p/ 02/07/2026', status: 'futura' },
  { label: 'Documentos disponibilizados', data: 'previsto p/ 04/07/2026', status: 'futura' },
]

const STATUS_BADGE: Record<EtapaRescisao['status'], { variant: 'concluido' | 'andamento' | 'bloqueado'; label: string }> = {
  concluida: { variant: 'concluido', label: 'Concluída' },
  'em-andamento': { variant: 'andamento', label: 'Em andamento' },
  futura: { variant: 'bloqueado', label: 'Futura' },
}

function TelaRescisao() {
  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-base font-bold text-gi-dark">Rescisão</h2>
        <p className="text-sm text-gi-charcoal mt-0.5">Acompanhe o seu processo de desligamento</p>
      </div>

      <DorTooltip dorId="D09" iniciativaId="I13">
        <Card>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-gi-dark">Processo de rescisão</span>
            <span className="text-xs text-gi-charcoal">Dia {DIA_ATUAL} de {DIAS_TOTAL}</span>
          </div>
          <ProgressBar value={DIA_ATUAL} max={DIAS_TOTAL} />
          <p className="text-xs text-gi-charcoal mt-2">Previsão de disponibilização dos documentos: 04/07/2026</p>
        </Card>
      </DorTooltip>

      <div className="space-y-2">
        {ETAPAS.map(etapa => (
          <Card key={etapa.label} className="flex items-center justify-between p-4">
            <div>
              <div className="text-sm font-bold text-gi-dark">{etapa.label}</div>
              <div className="text-[11px] text-gi-charcoal mt-0.5">{etapa.data}</div>
            </div>
            <Badge variant={STATUS_BADGE[etapa.status].variant}>{STATUS_BADGE[etapa.status].label}</Badge>
          </Card>
        ))}
      </div>

      <DorTooltip dorId="D09" iniciativaId="I14">
        <Button variant="secondary">Falar com o time GI</Button>
      </DorTooltip>
    </div>
  )
}

export default TelaRescisao
