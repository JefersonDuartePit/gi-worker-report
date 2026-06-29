import DorTooltip from './DorTooltip'
import StatusPill from './StatusPill'

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

const MODULO_PILL: Record<ModuloTreinamento['status'], { variant: 'concluido' | 'andamento' | 'bloqueado' | 'media'; label: string }> = {
  concluido: { variant: 'concluido', label: 'Concluído' },
  'em-andamento': { variant: 'andamento', label: 'Em andamento' },
  bloqueado: { variant: 'bloqueado', label: 'Bloqueado' },
  aguardando: { variant: 'media', label: 'Aguardando data' },
}

const MARCO_PILL: Record<MarcoAcompanhamento['status'], { variant: 'concluido' | 'andamento' | 'bloqueado'; label: string }> = {
  concluido: { variant: 'concluido', label: 'Concluído' },
  'em-andamento': { variant: 'andamento', label: 'Em curso' },
  futuro: { variant: 'bloqueado', label: 'Futuro' },
}

const MARCO_ACCENT: Record<MarcoAcompanhamento['status'], string> = {
  concluido: 'border-t-2 border-t-gi-green',
  'em-andamento': 'border-t-2 border-t-gi-blue',
  futuro: '',
}

function TelaTreinamentos() {
  const concluidos = MODULOS.filter(m => m.status === 'concluido').length
  const progresso = Math.round((concluidos / MODULOS.length) * 100)

  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gi-navy">Treinamentos</h2>
        <p className="text-sm text-gi-text mt-1">Sua trilha de integração na GI Group</p>
      </div>

      <DorTooltip dorId="D06" iniciativaId="I10">
        <div className="bg-white rounded-xl border border-gi-border shadow-sm p-4">
          <div className="flex justify-between items-center mb-1">
            <p className="text-[10px] font-bold text-gi-charcoal uppercase tracking-widest">Progresso da trilha</p>
            <span className="text-xs text-gi-blue font-bold">{progresso}%</span>
          </div>
          <div className="h-1.5 bg-gi-border rounded-full overflow-hidden mb-4">
            <div className="h-full bg-gi-blue rounded-full" style={{ width: `${progresso}%` }} />
          </div>
          <ul className="divide-y divide-gi-border -mx-4">
            {MODULOS.map(modulo => {
              const isBloqueado = modulo.status === 'bloqueado'
              return (
                <li
                  key={modulo.nome}
                  className={`flex items-center justify-between px-4 py-2.5 ${isBloqueado ? 'opacity-50' : ''}`}
                >
                  <div>
                    <div className="text-xs font-bold text-gi-dark">{modulo.nome}</div>
                    <div className="text-gi-charcoal text-[11px]">{modulo.duracao}</div>
                  </div>
                  <StatusPill variant={MODULO_PILL[modulo.status].variant}>{MODULO_PILL[modulo.status].label}</StatusPill>
                </li>
              )
            })}
          </ul>
        </div>
      </DorTooltip>

      <div className="grid grid-cols-3 gap-3">
        {MARCOS.map(marco => (
          <div
            key={marco.dias}
            className={`bg-white rounded-xl border border-gi-border shadow-sm p-3 text-center ${MARCO_ACCENT[marco.status]}`}
          >
            <div className="text-sm font-bold text-gi-navy">{marco.dias} dias</div>
            <div className="text-[10px] text-gi-charcoal mt-0.5">{marco.foco}</div>
            <div className="mt-1.5">
              <StatusPill variant={MARCO_PILL[marco.status].variant}>{MARCO_PILL[marco.status].label}</StatusPill>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TelaTreinamentos
