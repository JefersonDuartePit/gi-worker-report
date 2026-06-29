import { motion } from 'framer-motion'
import MapaSistemas from './MapaSistemas'

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

function S2Diagnostico() {
  return (
    <div className="min-h-screen bg-white py-20 px-12">
      <motion.div variants={sectionVariants} initial="hidden" animate="visible">
        <h2 className="text-4xl font-bold text-gi-navy">Diagnóstico Sistêmico</h2>
        <p className="text-xl text-gi-text mt-3 mb-12">
          Mapeamento dos sistemas atuais da GI Group
        </p>
        <MapaSistemas />
      </motion.div>
    </div>
  )
}

export default S2Diagnostico
