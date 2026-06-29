import DorTooltip from './DorTooltip'
import ProgressBar from '../ui/ProgressBar'
import Badge from '../ui/Badge'
import Card from '../ui/Card'

interface ModuloTreinamento {
  nome: string
  duracao: string
  status: 'concluido' | 'em-andamento' | 'bloqueado' | 'aguardando'
}

interface MarcoAcompanhamento {
  dias: 30 | 60 | 90
  status: 'concluido' | 'em-andamento' | 'futuro'
  foco: string
}

const MODULOS: ModuloTreinamento[] = [
  { nome: 'Boas-vindas à GI Group', duracao: '15 min', status: 'concluido' },
  { nome: 'Segurança do trabalho', duracao: '40 min', status: 'concluido' },
  { nome: 'Proteção de dados (LGPD)', duracao: '20 min', status: 'em-andamento' },
  { nome: 'Procedimentos do cliente Shopee SP', duracao: '30 min', status: 'aguardando' },
  { nome: 'Avaliação de período de experiência', duracao: '10 min', status: 'bloqueado' },
]

const MARCOS: MarcoAcompanhamento[] = [
  { dias: 30, status: 'concluido', foco: 'Integração e rotina' },
  { dias: 60, status: 'em-andamento', foco: 'Autonomia operacional' },
  { dias: 90, status: 'futuro', foco: 'Avaliação de desempenho' },
]

const MODULO_BADGE: Record<ModuloTreinamento['status'], { variant: 'concluido' | 'andamento' | 'bloqueado' | 'media'; label: string }> = {
  concluido: { variant: 'concluido', label: 'Concluído' },
  'em-andamento': { variant: 'andamento', label: 'Em andamento' },
  bloqueado: { variant: 'bloqueado', label: 'Bloqueado' },
  aguardando: { variant: 'media', label: 'Aguardando data' },
}

const MARCO_BADGE: Record<MarcoAcompanhamento['status'], { variant: 'concluido' | 'andamento' | 'bloqueado'; label: string }> = {
  concluido: { variant: 'concluido', label: 'Concluído' },
  'em-andamento': { variant: 'andamento', label: 'Em curso' },
  futuro: { variant: 'bloqueado', label: 'Futuro' },
}

function TelaTreinamentos() {
  const concluidos = MODULOS.filter(m => m.status === 'concluido').length
  const progresso = Math.round((concluidos / MODULOS.length) * 100)

  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-base font-bold text-gi-dark">Treinamentos</h2>
        <p className="text-sm text-gi-charcoal mt-0.5">Sua trilha de integração na GI Group</p>
      </div>

      <DorTooltip dorId="D06" iniciativaId="I10">
        <Card>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-gi-dark">Progresso da trilha</span>
            <span className="text-xs text-gi-blue font-bold">{progresso}%</span>
          </div>
          <ProgressBar value={progresso} />
          <ul className="mt-3 space-y-2">
            {MODULOS.map(modulo => {
              const isBloqueado = modulo.status === 'bloqueado'
              return (
                <li
                  key={modulo.nome}
                  className={`flex items-center justify-between text-xs ${isBloqueado ? 'opacity-50' : ''}`}
                >
                  <div>
                    <div className="text-gi-dark font-bold">{modulo.nome}</div>
                    <div className="text-gi-charcoal text-[11px]">{modulo.duracao}</div>
                  </div>
                  <Badge variant={MODULO_BADGE[modulo.status].variant}>{MODULO_BADGE[modulo.status].label}</Badge>
                </li>
              )
            })}
          </ul>
        </Card>
      </DorTooltip>

      <div className="flex gap-2">
        {MARCOS.map(marco => (
          <Card key={marco.dias} variant="muted" className="flex-1 text-center p-3">
            <div className="text-sm font-bold text-gi-navy">{marco.dias} dias</div>
            <div className="text-[10px] text-gi-charcoal mt-0.5">{marco.foco}</div>
            <Badge variant={MARCO_BADGE[marco.status].variant} className="mt-1.5">
              {MARCO_BADGE[marco.status].label}
            </Badge>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default TelaTreinamentos
