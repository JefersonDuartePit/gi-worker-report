import DorTooltip from './DorTooltip'
import StatusPill from './StatusPill'

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

const STATUS_PILL: Record<EtapaRescisao['status'], { variant: 'concluido' | 'andamento' | 'bloqueado'; label: string }> = {
  concluida: { variant: 'concluido', label: 'Concluída' },
  'em-andamento': { variant: 'andamento', label: 'Em andamento' },
  futura: { variant: 'bloqueado', label: 'Futura' },
}

function TelaRescisao() {
  const progresso = Math.round((DIA_ATUAL / DIAS_TOTAL) * 100)

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gi-navy">Rescisão</h2>
        <p className="text-sm text-gi-text mt-1">Acompanhe o seu processo de desligamento</p>
      </div>

      <DorTooltip dorId="D09" iniciativaId="I13">
        <div className="bg-white rounded-xl border border-gi-border shadow-sm p-4">
          <div className="flex justify-between items-center mb-1">
            <p className="text-[10px] font-bold text-gi-charcoal uppercase tracking-widest">Processo de rescisão</p>
            <span className="text-xs text-gi-charcoal font-medium">Dia {DIA_ATUAL} de {DIAS_TOTAL}</span>
          </div>
          <div className="h-1.5 bg-gi-border rounded-full overflow-hidden">
            <div className="h-full bg-gi-blue rounded-full" style={{ width: `${progresso}%` }} />
          </div>
          <p className="text-xs text-gi-text mt-3">Previsão de disponibilização dos documentos: 04/07/2026</p>
        </div>
      </DorTooltip>

      <div className="bg-white rounded-xl border border-gi-border shadow-sm divide-y divide-gi-border">
        {ETAPAS.map(etapa => (
          <div key={etapa.label} className="flex items-center justify-between p-4">
            <div>
              <div className="text-sm font-bold text-gi-dark">{etapa.label}</div>
              <div className="text-[11px] text-gi-charcoal mt-0.5">{etapa.data}</div>
            </div>
            <StatusPill variant={STATUS_PILL[etapa.status].variant}>{STATUS_PILL[etapa.status].label}</StatusPill>
          </div>
        ))}
      </div>

      <DorTooltip dorId="D09" iniciativaId="I14">
        <button className="flex items-center gap-1.5 text-xs font-medium text-gi-charcoal border border-gi-border bg-white px-3 py-1.5 rounded-lg hover:bg-gi-light transition-colors">
          Falar com o time GI
        </button>
      </DorTooltip>
    </div>
  )
}

export default TelaRescisao
