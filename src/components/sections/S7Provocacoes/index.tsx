import { useContext } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { PresentationContext } from '../../../App'
import { PROVOCACOES } from '../../../data/provocacoes'
import Button from '../../ui/Button'
import logoGI from '../../../assets/logo-gi-group.png'
import logoPerformIT from '../../../assets/logo-perform-it.svg'
import ProvocacaoCard from './ProvocacaoCard'

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
            {PROVOCACOES.length} perguntas que precisam de resposta antes de começar
          </p>
          <div className="grid grid-cols-2 gap-6">
            {PROVOCACOES.map((p) => (
              <ProvocacaoCard key={p.id} provocacao={p} />
            ))}
          </div>
        </div>

        {/* Bloco 2 — Plano faseado removido a pedido do Dimitri (service designer),
            call de Alinhamento Pré-Apresentação de 13/07/2026: ele conduz um plano
            faseado próprio com o cliente (baseado em risco/capacity/workload), que
            fecha em reunião separada na sexta-feira — os dois planos não devem
            concorrer na mesma apresentação. Componente PlanoFaseado mantido no
            projeto, apenas não renderizado aqui. */}

        {/* Bloco 4 — CTA final */}
        <div className="text-center border-t border-gi-orbit pt-16">
          <div className="flex items-center justify-center gap-6 mb-8">
            <img src={logoGI} alt="GI Group" className="h-8 object-contain" />
            <div className="w-px h-6 bg-white/30" />
            <img src={logoPerformIT} alt="Perform IT" className="h-6 object-contain" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-4">Obrigado pela parceria</h3>

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
