import { motion } from 'framer-motion'
import { PLANETS } from '../../data/planets'
import Planet from '../ui/Planet'
import GalaxyHeader from './GalaxyHeader'

const CONTAINER_W = 700
const CONTAINER_H = 480
const SUN_CX = 350
const SUN_CY = 240

interface GalaxyMapProps {
  onPlanetClick: (sectionId: string) => void
  activeSectionId: string
}

function GalaxyMap({ onPlanetClick, activeSectionId }: GalaxyMapProps) {
  return (
    <motion.div
      className="flex flex-col min-h-screen relative bg-galaxy-sky"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <GalaxyHeader />

      <div className="relative flex-1 flex items-center justify-center z-[5]">
        <div className="relative" style={{ width: CONTAINER_W, height: CONTAINER_H }}>

          {/* Orbit rings decorativas */}
          {[
            { w: 200, h: 100 },
            { w: 340, h: 160 },
            { w: 520, h: 240 },
          ].map(({ w, h }) => (
            <div
              key={`${w}x${h}`}
              className="absolute rounded-full pointer-events-none border border-gi-blue/10"
              style={{
                width: w,
                height: h,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) rotateX(70deg)',
                borderStyle: 'dashed',
              }}
            />
          ))}

          {/* SVG: linhas tracejadas do sol aos planetas */}
          <svg
            className="absolute inset-0 pointer-events-none z-[3]"
            viewBox={`0 0 ${CONTAINER_W} ${CONTAINER_H}`}
            xmlns="http://www.w3.org/2000/svg"
          >
            {PLANETS.map((p) => (
              <line
                key={p.id}
                x1={SUN_CX}
                y1={SUN_CY}
                x2={p.cx}
                y2={p.cy}
                stroke="#1D57FB"
                strokeOpacity={p.id === activeSectionId ? 0.45 : 0.18}
                strokeWidth={p.id === activeSectionId ? 1.5 : 1}
                strokeDasharray="4,6"
              />
            ))}
          </svg>

          {/* Sol */}
          <div
            className="absolute flex items-center justify-center z-10 rounded-full"
            style={{
              width: 56,
              height: 56,
              left: SUN_CX - 28,
              top: SUN_CY - 28,
              background: 'radial-gradient(circle at 35% 35%, #ffd700, #ff8800, #cc4400)',
              boxShadow: '0 0 30px rgba(255,136,0,0.4), 0 0 60px rgba(255,68,0,0.2)',
            }}
          >
            <span className="text-white font-bold text-[9px]">GI</span>
          </div>

          {/* Planetas */}
          {PLANETS.map((planet) => (
            <Planet
              key={planet.id}
              planet={planet}
              isActive={planet.id === activeSectionId}
              onClick={() => onPlanetClick(planet.id)}
            />
          ))}
        </div>
      </div>

      <p className="relative z-10 text-center pb-4 text-[11px] text-gi-crater uppercase tracking-widest">
        ↑ clique em qualquer planeta para pousar
      </p>
    </motion.div>
  )
}

export default GalaxyMap
