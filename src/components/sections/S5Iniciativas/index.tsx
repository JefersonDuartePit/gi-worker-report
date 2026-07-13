import { motion } from 'framer-motion'
import IniciativasList from './IniciativasList'

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

function S5Iniciativas() {
  return (
    <div className="min-h-screen bg-gi-light py-20 px-12">
      <motion.div variants={sectionVariants} initial="hidden" animate="visible">
        <h2 className="text-4xl font-bold text-gi-navy">Iniciativas de Transformação</h2>
        <p className="text-xl text-gi-text mt-3 mb-12">
          17 iniciativas priorizadas no workshop — filtradas por jornada e persona
        </p>
        <IniciativasList />
      </motion.div>
    </div>
  )
}

export default S5Iniciativas
