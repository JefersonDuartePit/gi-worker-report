import { useContext } from 'react'
import { motion } from 'framer-motion'
import { Square, ArrowLeft } from 'lucide-react'
import { PresentationContext } from '../../../App'
import { PROVOCACOES, PROXIMOS_PASSOS } from '../../../data/provocacoes'
import Button from '../../ui/Button'
import logoGI from '../../../assets/logo-gi-group.png'
import logoPerformIT from '../../../assets/logo-perform-it.svg'
import ProvocacaoCard from './ProvocacaoCard'
import PlanoFaseado from './PlanoFaseado'

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

function S7Provocacoes() {
  const { goTo } = useContext(PresentationContext)

  return (
    <div className="min-h-screen bg-gi-navy py-20 px-12">
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto"
      >
        {/* Bloco 1 — Provocações técnicas */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-white mb-2">Provocações técnicas</h2>
          <p className="text-xl text-gi-stardust mb-12">
            6 perguntas que precisam de resposta antes de começar
          </p>
          <div className="grid grid-cols-2 gap-6">
            {PROVOCACOES.map((p) => (
              <ProvocacaoCard key={p.id} provocacao={p} />
            ))}
          </div>
        </div>

        {/* Bloco 2 — Plano faseado */}
        <div className="mb-20">
          <PlanoFaseado />
        </div>

        {/* Bloco 3 — Próximos passos */}
        <div className="mb-20">
          <h3 className="text-2xl font-bold text-white mb-2">Próximos passos imediatos</h3>
          <p className="text-gi-stardust mb-8">4 ações para iniciar ainda neste mês</p>
          <ul className="space-y-4">
            {PROXIMOS_PASSOS.map((passo, idx) => (
              <li key={idx} className="flex items-start gap-4">
                <Square size={20} className="text-gi-blue flex-shrink-0 mt-0.5" />
                <span className="text-white text-base">{passo}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bloco 4 — CTA final */}
        <div className="text-center border-t border-gi-orbit pt-16">
          <div className="flex items-center justify-center gap-6 mb-8">
            <img src={logoGI} alt="GI Group" className="h-8 object-contain" />
            <div className="w-px h-6 bg-white/30" />
            <img src={logoPerformIT} alt="Perform IT" className="h-6 object-contain" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-4">Obrigado pela parceria</h3>
          <p className="text-gi-comet text-lg mb-10 max-w-xl mx-auto">
            Próximo passo: agendar workshop técnico com o squad de TI para validar as integrações
            e definir o MVP do portal do worker.
          </p>
          <Button
            variant="ghost"
            className="text-white hover:text-gi-comet hover:no-underline border border-gi-orbit hover:border-gi-blue"
            onClick={() => goTo(0)}
          >
            <ArrowLeft size={16} />
            Voltar ao início
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default S7Provocacoes
