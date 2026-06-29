import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import DorTooltip from './DorTooltip'
import JornadaOverview from './JornadaOverview'
import StatCard from './StatCard'
import StatusPill from './StatusPill'
import type { PortalScreen } from '../../hooks/usePortalNav'

interface EtapaAdmissao {
  label: string
  status: 'concluida' | 'pendente' | 'aguardando'
  data: string
  responsavel: string
}

interface TelaInicioProps {
  onNavigate: (screen: PortalScreen) => void
}

const ETAPAS: EtapaAdmissao[] = [
  { label: 'Cadastro e documentação', status: 'concluida', data: '02/06/2026', responsavel: 'Você' },
  { label: 'Assinatura de contrato', status: 'concluida', data: '04/06/2026', responsavel: 'Você' },
  { label: 'ASO admissional', status: 'concluida', data: '05/06/2026', responsavel: 'Clínica Vita SP' },
  { label: 'Integração com o cliente', status: 'pendente', data: 'previsto p/ 30/06/2026', responsavel: 'Shopee SP · RH' },
  { label: 'Treinamento inicial', status: 'aguardando', data: 'previsto p/ 02/07/2026', responsavel: 'GI Group · CARE' },
]

const STATUS_PILL: Record<EtapaAdmissao['status'], { variant: 'concluido' | 'andamento' | 'bloqueado'; label: string }> = {
  concluida: { variant: 'concluido', label: 'Concluída' },
  pendente: { variant: 'andamento', label: 'Em andamento' },
  aguardando: { variant: 'bloqueado', label: 'Aguardando' },
}

function TelaInicio({ onNavigate }: TelaInicioProps) {
  const [historicoAberto, setHistoricoAberto] = useState(false)
  const [etapaAberta, setEtapaAberta] = useState<string | null>(null)

  function toggleEtapa(label: string) {
    setEtapaAberta(prev => (prev === label ? null : label))
  }

  return (
    <div className="p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gi-navy">Olá, Ana Silva</h2>
        <p className="text-sm text-gi-text mt-1">Acompanhe sua jornada na GI Group</p>
      </div>

      <JornadaOverview onNavigate={onNavigate} />

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Solicitações abertas" value={2} sub="1 em andamento, 1 aberta" accent="blue" />
        <StatCard label="Treinamentos" value="3/5" sub="concluídos da trilha atual" accent="green" />
      </div>

      <DorTooltip dorId="D07" iniciativaId="I10">
        <div className="bg-white rounded-xl border border-gi-border shadow-sm p-4">
          <p className="text-[10px] font-bold text-gi-charcoal uppercase tracking-widest mb-3">Seu contato GI</p>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gi-blue flex items-center justify-center text-white text-xs font-bold shrink-0">
              MC
            </div>
            <div>
              <div className="text-sm font-bold text-gi-dark">Marina Costa</div>
              <div className="text-xs text-gi-text">Sua analista GI · CARE</div>
            </div>
          </div>
        </div>
      </DorTooltip>

      <div className="bg-white rounded-xl border border-gi-border shadow-sm">
        <button
          onClick={() => setHistoricoAberto(prev => !prev)}
          className="w-full flex items-center justify-between p-4 text-left"
        >
          <DorTooltip dorId="D01" iniciativaId="I01">
            <span className="text-sm font-bold text-gi-dark">Histórico da admissão</span>
          </DorTooltip>
          <ChevronDown
            className={`w-4 h-4 text-gi-charcoal transition-transform ${historicoAberto ? 'rotate-180' : ''}`}
          />
        </button>
        <AnimatePresence>
          {historicoAberto && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <ul className="px-4 pb-4 divide-y divide-gi-border">
                {ETAPAS.map(etapa => {
                  const isOpen = etapaAberta === etapa.label
                  return (
                    <li key={etapa.label}>
                      <button
                        onClick={() => toggleEtapa(etapa.label)}
                        className="w-full flex items-center justify-between gap-2 py-2.5 text-left"
                      >
                        <span className="text-xs text-gi-text">{etapa.label}</span>
                        <span className="flex items-center gap-2 shrink-0">
                          <StatusPill variant={STATUS_PILL[etapa.status].variant}>
                            {STATUS_PILL[etapa.status].label}
                          </StatusPill>
                          <ChevronDown
                            className={`w-3.5 h-3.5 text-gi-charcoal transition-transform ${isOpen ? 'rotate-180' : ''}`}
                          />
                        </span>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="text-[11px] text-gi-charcoal pb-2.5 space-y-0.5">
                              <div>Data: {etapa.data}</div>
                              <div>Responsável: {etapa.responsavel}</div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  )
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default TelaInicio
