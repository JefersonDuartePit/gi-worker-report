import DorTooltip from './DorTooltip'
import ProgressBar from '../ui/ProgressBar'
import Badge from '../ui/Badge'
import Card from '../ui/Card'
import Button from '../ui/Button'
import type { PortalScreen } from '../../hooks/usePortalNav'

interface EtapaAdmissao {
  label: string
  status: 'concluida' | 'pendente' | 'aguardando'
}

interface TelaInicioProps {
  onNavigate: (screen: PortalScreen) => void
}

const ETAPAS: EtapaAdmissao[] = [
  { label: 'Cadastro e documentação', status: 'concluida' },
  { label: 'Assinatura de contrato', status: 'concluida' },
  { label: 'ASO admissional', status: 'concluida' },
  { label: 'Integração com o cliente', status: 'pendente' },
  { label: 'Treinamento inicial', status: 'aguardando' },
]

const STATUS_BADGE: Record<EtapaAdmissao['status'], { variant: 'concluido' | 'andamento' | 'bloqueado'; label: string }> = {
  concluida: { variant: 'concluido', label: 'Concluída' },
  pendente: { variant: 'andamento', label: 'Em andamento' },
  aguardando: { variant: 'bloqueado', label: 'Aguardando' },
}

function TelaInicio({ onNavigate }: TelaInicioProps) {
  const concluidas = ETAPAS.filter(e => e.status === 'concluida').length
  const progresso = Math.round((concluidas / ETAPAS.length) * 100)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-base font-bold text-gi-dark">Olá, Ana Silva</h2>
        <p className="text-sm text-gi-charcoal mt-0.5">Acompanhe sua jornada na GI Group</p>
      </div>

      <DorTooltip dorId="D01" iniciativaId="I01">
        <Card>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-gi-dark">Status da admissão</span>
            <span className="text-xs text-gi-blue font-bold">{progresso}%</span>
          </div>
          <ProgressBar value={progresso} />
          <ul className="mt-3 space-y-1.5">
            {ETAPAS.map(etapa => (
              <li key={etapa.label} className="flex items-center justify-between text-xs">
                <span className="text-gi-charcoal">{etapa.label}</span>
                <Badge variant={STATUS_BADGE[etapa.status].variant}>{STATUS_BADGE[etapa.status].label}</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </DorTooltip>

      <div className="grid grid-cols-2 gap-3">
        <Card variant="muted">
          <div className="text-2xl font-bold text-gi-navy">2</div>
          <div className="text-xs text-gi-charcoal mt-1">Solicitações abertas</div>
        </Card>
        <Card variant="muted">
          <div className="text-2xl font-bold text-gi-navy">3/5</div>
          <div className="text-xs text-gi-charcoal mt-1">Treinamentos concluídos</div>
        </Card>
      </div>

      <DorTooltip dorId="D07" iniciativaId="I10">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gi-blue flex items-center justify-center text-white text-xs font-bold shrink-0">
              MC
            </div>
            <div>
              <div className="text-sm font-bold text-gi-dark">Marina Costa</div>
              <div className="text-xs text-gi-charcoal">Sua analista GI · CARE</div>
            </div>
          </div>
        </Card>
      </DorTooltip>

      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => onNavigate('documentos')}>Ver documentos</Button>
        <Button variant="secondary" onClick={() => onNavigate('solicitacoes')}>Nova solicitação</Button>
      </div>
    </div>
  )
}

export default TelaInicio
