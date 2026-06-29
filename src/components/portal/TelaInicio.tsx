import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import DorTooltip from './DorTooltip'
import ProgressBar from '../ui/ProgressBar'
import Badge from '../ui/Badge'
import Card from '../ui/Card'
import Button from '../ui/Button'
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

const STATUS_BADGE: Record<EtapaAdmissao['status'], { variant: 'concluido' | 'andamento' | 'bloqueado'; label: string }> = {
  concluida: { variant: 'concluido', label: 'Concluída' },
  pendente: { variant: 'andamento', label: 'Em andamento' },
  aguardando: { variant: 'bloqueado', label: 'Aguardando' },
}

function TelaInicio({ onNavigate }: TelaInicioProps) {
  const [etapaAberta, setEtapaAberta] = useState<string | null>(null)
  const concluidas = ETAPAS.filter(e => e.status === 'concluida').length
  const progresso = Math.round((concluidas / ETAPAS.length) * 100)

  function toggleEtapa(label: string) {
    setEtapaAberta(prev => (prev === label ? null : label))
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-base font-bold text-gi-dark">Olá, Ana Silva</h2>
        <p className="text-sm text-gi-charcoal mt-0.5">Acompanhe sua jornada na GI Group</p>
      </div>

      <Card>
        <DorTooltip dorId="D01" iniciativaId="I01">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-gi-dark">Status da admissão</span>
            <span className="text-xs text-gi-blue font-bold">{progresso}%</span>
          </div>
        </DorTooltip>
        <ProgressBar value={progresso} />
        <ul className="mt-3 divide-y divide-gi-border">
          {ETAPAS.map(etapa => {
            const isOpen = etapaAberta === etapa.label
            return (
              <li key={etapa.label}>
                <button
                  onClick={() => toggleEtapa(etapa.label)}
                  className="w-full flex items-center justify-between gap-2 py-2 text-xs text-left"
                >
                  <span className="text-gi-charcoal">{etapa.label}</span>
                  <span className="flex items-center gap-2 shrink-0">
                    <Badge variant={STATUS_BADGE[etapa.status].variant}>{STATUS_BADGE[etapa.status].label}</Badge>
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
                      <div className="text-[11px] text-gi-charcoal pb-2 pl-1 space-y-0.5">
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
      </Card>

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
