import { useEffect } from 'react'
import { motion } from 'framer-motion'

interface SplashScreenProps {
  onComplete: () => void
}

function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-splash-sky cursor-pointer"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      onClick={onComplete}
    >
      <div className="relative z-10 flex flex-col items-center gap-5 text-center">
        <img
          src="/src/assets/logo-gi-group.png"
          alt="GI Group"
          className="h-10 object-contain"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />

        <div className="w-px h-8 bg-gradient-to-b from-transparent via-gi-steel to-transparent" />

        <h1 className="text-3xl font-bold text-white tracking-wide">Portal do Worker</h1>

        <p className="text-sm text-gi-stardust uppercase tracking-[3px]">
          Diagnóstico &amp; Transformação Digital · 2026
        </p>

        <motion.div
          className="mt-8 w-12 h-12 rounded-full border-2 border-gi-blue/30"
          animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        <p className="text-[11px] text-gi-crater uppercase tracking-widest">
          Clique para iniciar
        </p>
      </div>
    </motion.div>
  )
}

export default SplashScreen
