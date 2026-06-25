import { useContext, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { PresentationContext } from '../../../App'
import logoGI from '../../../assets/logo-gi-group.png'
import logoPerformIT from '../../../assets/logo-perform-it.svg'

interface Metric {
  value: number
  suffix: string
  label: string
}

interface MetricCounterProps {
  metric: Metric
}

const METRICS: Metric[] = [
  { value: 5,  suffix: ' dias',        label: 'de design sprint' },
  { value: 3,  suffix: ' jornadas',    label: 'mapeadas end-to-end' },
  { value: 17, suffix: ' iniciativas', label: 'estruturadas e priorizadas' },
]

function useCountUp(target: number, duration = 800) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let current = 0
    const increment = target / (duration / 16)
    let raf: number
    function tick() {
      current = Math.min(current + increment, target)
      setCount(Math.round(current))
      if (current < target) {
        raf = requestAnimationFrame(tick)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return count
}

function MetricCounter({ metric }: MetricCounterProps) {
  const count = useCountUp(metric.value)
  return (
    <div className="flex flex-col items-center px-10 py-6 border-r border-white/20 last:border-r-0">
      <div className="text-5xl font-bold text-white">
        {count}
        <span className="text-2xl text-gi-comet ml-1">{metric.suffix}</span>
      </div>
      <div className="text-sm text-gi-stardust mt-2">{metric.label}</div>
    </div>
  )
}

function S1Hero() {
  const { next } = useContext(PresentationContext)

  return (
    <motion.div
      className="min-h-screen bg-gi-navy flex flex-col items-center justify-center px-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-8 mb-14">
        <img src={logoGI} alt="GI Group" className="h-10 object-contain" />
        <div className="w-px h-8 bg-white/30" />
        <img src={logoPerformIT} alt="Perform IT" className="h-8 object-contain" />
      </div>

      <div className="text-center mb-12 max-w-3xl">
        <h1 className="text-5xl font-bold text-white leading-tight mb-4">
          Centralização CARE & SMS<br />Jornada do Worker
        </h1>
        <p className="text-xl text-gi-stardust">
          Diagnóstico sistêmico e propostas de transformação digital
        </p>
        <p className="text-sm text-gi-crater mt-3">
          Junho 2026 · v1.0 · Perform IT
        </p>
      </div>

      <div className="flex items-stretch bg-white/5 border border-white/10 rounded-xl mb-12">
        {METRICS.map((metric) => (
          <MetricCounter key={metric.label} metric={metric} />
        ))}
      </div>

      <button
        onClick={next}
        className="flex items-center gap-2 px-6 py-3 bg-gi-blue text-white rounded-lg font-bold hover:bg-white hover:text-gi-navy transition-colors duration-200"
      >
        Iniciar a leitura
        <ChevronRight size={18} />
      </button>
    </motion.div>
  )
}

export default S1Hero
