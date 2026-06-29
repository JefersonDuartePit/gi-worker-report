import DorTooltip from './DorTooltip'
import Badge from '../ui/Badge'
import Card from '../ui/Card'

interface RegistroDesenvolvimento {
  data: string
  tipo: 'feedback' | 'advertencia'
  titulo: string
  descricao: string
}

const REGISTROS: RegistroDesenvolvimento[] = [
  {
    data: '12/05/2026',
    tipo: 'feedback',
    titulo: 'Elogio da liderança Shopee SP',
    descricao: 'Reconhecimento por pontualidade e proatividade no turno da manhã.',
  },
  {
    data: '28/04/2026',
    tipo: 'feedback',
    titulo: 'Avaliação de 60 dias',
    descricao: 'Desempenho dentro do esperado, sem pontos de atenção.',
  },
  {
    data: '03/03/2026',
    tipo: 'advertencia',
    titulo: 'Advertência verbal — atraso recorrente',
    descricao: 'Registro formal após 3 atrasos no mesmo mês, conforme política da operação.',
  },
]

const TIPO_BADGE: Record<RegistroDesenvolvimento['tipo'], { variant: 'concluido' | 'critica'; label: string }> = {
  feedback: { variant: 'concluido', label: 'Feedback' },
  advertencia: { variant: 'critica', label: 'Advertência' },
}

function TelaDesenvolvimento() {
  return (
    <div className="p-6 space-y-4">
      <DorTooltip dorId="D12" iniciativaId="I10">
        <div>
          <h2 className="text-base font-bold text-gi-dark">Desenvolvimento</h2>
          <p className="text-sm text-gi-charcoal mt-0.5">Seu histórico de feedback e acompanhamento</p>
        </div>
      </DorTooltip>

      <div className="space-y-2">
        {REGISTROS.map(registro => (
          <Card key={`${registro.data}-${registro.titulo}`} className="p-4">
            <div className="flex items-center justify-between mb-1">
              <Badge variant={TIPO_BADGE[registro.tipo].variant}>{TIPO_BADGE[registro.tipo].label}</Badge>
              <span className="text-[11px] text-gi-charcoal">{registro.data}</span>
            </div>
            <div className="text-sm font-bold text-gi-dark mt-1">{registro.titulo}</div>
            <p className="text-xs text-gi-charcoal mt-1">{registro.descricao}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default TelaDesenvolvimento
