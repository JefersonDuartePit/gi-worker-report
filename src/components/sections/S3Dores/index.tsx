import { motion } from 'framer-motion'
import DoresList from './DoresList'

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

function S3Dores() {
  return (
    <div className="min-h-screen bg-gi-light py-20 px-12">
      <motion.div variants={sectionVariants} initial="hidden" animate="visible">
        <h2 className="text-4xl font-bold text-gi-navy">Dores por Persona</h2>
        <p className="text-xl text-gi-text mt-3 mb-12">
          11 dores identificadas no design sprint — organizadas por quem sofre
        </p>
        <DoresList />
      </motion.div>
    </div>
  )
}

export default S3Dores
