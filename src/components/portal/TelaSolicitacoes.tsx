import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import DorTooltip from './DorTooltip'
import Badge from '../ui/Badge'
import Card from '../ui/Card'
import Button from '../ui/Button'

interface SolicitacaoIlustrativa {
  ticket: string
  tipo: string
  data: string
  status: 'aberta' | 'em-andamento' | 'concluida'
}

type TipoSolicitacao = 'cadastral' | 'atestado' | 'beneficios' | 'outros'

const TIPOS: { value: TipoSolicitacao; label: string }[] = [
  { value: 'cadastral', label: 'Atualização cadastral' },
  { value: 'atestado', label: 'Envio de atestado' },
  { value: 'beneficios', label: 'Dúvida sobre benefícios' },
  { value: 'outros', label: 'Outros' },
]

const SOLICITACOES: SolicitacaoIlustrativa[] = [
  { ticket: '#3021', tipo: 'Atualização cadastral', data: '26/06/2026', status: 'em-andamento' },
  { ticket: '#3015', tipo: 'Dúvida sobre benefícios', data: '18/06/2026', status: 'concluida' },
  { ticket: '#3002', tipo: 'Envio de atestado médico', data: '09/06/2026', status: 'concluida' },
]

const STATUS_BADGE: Record<SolicitacaoIlustrativa['status'], { variant: 'concluido' | 'andamento'; label: string }> = {
  aberta: { variant: 'andamento', label: 'Aberta' },
  'em-andamento': { variant: 'andamento', label: 'Em andamento' },
  concluida: { variant: 'concluido', label: 'Concluída' },
}

function TelaSolicitacoes() {
  const [modalOpen, setModalOpen] = useState(false)
  const [tipoSelecionado, setTipoSelecionado] = useState<TipoSolicitacao>('cadastral')
  const [showConfirmacao, setShowConfirmacao] = useState(false)

  function handleEnviar() {
    setModalOpen(false)
    setShowConfirmacao(true)
    setTimeout(() => setShowConfirmacao(false), 2500)
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-gi-dark">Solicitações</h2>
          <p className="text-sm text-gi-charcoal mt-0.5">Acompanhe seus chamados em um único lugar</p>
        </div>
        <DorTooltip dorId="D05" iniciativaId="I07">
          <Button variant="primary" onClick={() => setModalOpen(true)}>+ Nova solicitação</Button>
        </DorTooltip>
      </div>

      <div className="space-y-2">
        {SOLICITACOES.map(s => (
          <Card key={s.ticket} className="flex items-center justify-between p-4">
            <div>
              <div className="text-sm font-bold text-gi-dark">{s.tipo}</div>
              <div className="text-xs text-gi-charcoal">{s.ticket} · aberto em {s.data}</div>
            </div>
            <Badge variant={STATUS_BADGE[s.status].variant}>{STATUS_BADGE[s.status].label}</Badge>
          </Card>
        ))}
      </div>

      <AnimatePresence>
        {showConfirmacao && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="text-xs text-gi-green font-bold"
          >
            Solicitação enviada com sucesso.
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl p-6 w-80 shadow-2xl"
            >
              <h3 className="font-bold text-gi-dark mb-4">Nova solicitação</h3>
              <div className="space-y-1.5 mb-4">
                {TIPOS.map(tipo => (
                  <button
                    key={tipo.value}
                    onClick={() => setTipoSelecionado(tipo.value)}
                    className={`w-full text-left text-xs px-3 py-2 rounded-lg border transition-colors ${
                      tipoSelecionado === tipo.value
                        ? 'border-gi-blue bg-blue-50 text-gi-navy font-bold'
                        : 'border-gi-border text-gi-charcoal hover:bg-gi-light'
                    }`}
                  >
                    {tipo.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <Button variant="primary" className="flex-1" onClick={handleEnviar}>Enviar</Button>
                <Button variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Fechar</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TelaSolicitacoes
