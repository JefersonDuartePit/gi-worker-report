import { motion } from 'framer-motion'
import type { PlanetConfig } from '../../data/planets'

interface PlanetProps {
  planet: PlanetConfig
  isActive: boolean
  onClick: () => void
}

function Planet({ planet, isActive, onClick }: PlanetProps) {
  const { num, label, size, colorFrom, colorTo, hasRing, cx, cy, glowColor } = planet
  const spread = isActive ? size * 0.5 : size * 0.3

  return (
    <motion.button
      style={{
        position: 'absolute',
        left: cx - size / 2,
        top: cy - size / 2,
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle at 35% 30%, ${colorFrom}, ${colorTo})`,
        boxShadow: `0 0 ${spread}px ${glowColor}`,
        border: isActive ? `2px solid ${colorFrom}88` : '2px solid transparent',
        zIndex: 8,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      aria-label={`Módulo ${num} — ${label}`}
    >
      <span
        style={{
          fontSize: Math.max(8, size * 0.18),
          fontWeight: 700,
          color: 'rgba(255,255,255,0.85)',
          pointerEvents: 'none',
        }}
      >
        {String(num).padStart(2, '0')}
      </span>

      {hasRing && (
        <div
          style={{
            position: 'absolute',
            width: size * 1.5,
            height: size * 0.35,
            borderRadius: '50%',
            border: '1.5px solid rgba(255,255,255,0.2)',
            transform: 'rotateX(70deg)',
            pointerEvents: 'none',
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          bottom: -(size * 0.55 + 4),
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: 10,
          color: isActive ? '#aaccff' : '#7799bb',
          whiteSpace: 'nowrap',
          fontWeight: isActive ? 700 : 400,
          letterSpacing: 0.5,
          pointerEvents: 'none',
        }}
      >
        {label}
      </div>
    </motion.button>
  )
}

export default Planet
