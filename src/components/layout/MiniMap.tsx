import { PLANETS } from '../../data/planets'

const SUN_CX = 350
const SUN_CY = 240

interface MiniMapProps {
  activeStep: number
  onPlanetClick: (sectionId: string) => void
}

function MiniMap({ activeStep, onPlanetClick }: MiniMapProps) {
  const activePlanet = PLANETS[activeStep]
  const activePlanetId = activePlanet?.id ?? ''

  return (
    <aside className="fixed top-[56px] left-0 w-[200px] h-[calc(100vh-56px)] bg-gi-navy flex flex-col z-40">
      <div className="px-4 py-3 border-b border-white/5">
        <span className="text-[9px] text-gi-orbit uppercase tracking-[2px]">Galáxia</span>
      </div>

      <div className="flex-1 flex items-center justify-center p-3">
        <svg
          viewBox="0 0 700 480"
          className="w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {PLANETS.map((p) => (
              <radialGradient key={p.id} id={`mg-${p.id}`} cx="35%" cy="35%">
                <stop offset="0%" stopColor={p.colorFrom} />
                <stop offset="100%" stopColor={p.colorTo} />
              </radialGradient>
            ))}
            <radialGradient id="mg-sun" cx="35%" cy="35%">
              <stop offset="0%" stopColor="#ffd700" />
              <stop offset="100%" stopColor="#cc4400" />
            </radialGradient>
          </defs>

          {/* Órbitas decorativas */}
          <ellipse
            cx={SUN_CX}
            cy={SUN_CY}
            rx="100"
            ry="50"
            fill="none"
            stroke="#1D57FB"
            strokeOpacity="0.1"
            strokeDasharray="3,5"
          />
          <ellipse
            cx={SUN_CX}
            cy={SUN_CY}
            rx="170"
            ry="85"
            fill="none"
            stroke="#1D57FB"
            strokeOpacity="0.07"
            strokeDasharray="3,5"
          />

          {/* Linhas do sol aos planetas */}
          {PLANETS.map((p) => (
            <line
              key={p.id}
              x1={SUN_CX}
              y1={SUN_CY}
              x2={p.cx}
              y2={p.cy}
              stroke="#1D57FB"
              strokeOpacity={p.id === activePlanetId ? 0.5 : 0.2}
              strokeWidth={p.id === activePlanetId ? 2 : 1}
              strokeDasharray="3,5"
            />
          ))}

          {/* Sol */}
          <circle cx={SUN_CX} cy={SUN_CY} r="18" fill="url(#mg-sun)" />
          <text
            x={SUN_CX}
            y={SUN_CY + 4}
            textAnchor="middle"
            fontSize="12"
            fill="white"
            fontWeight="bold"
          >
            GI
          </text>

          {/* Planetas */}
          {PLANETS.map((p) => {
            const r = p.size / 2
            const isActive = p.id === activePlanetId
            const labelText =
              p.label.length > 10 ? `${p.label.substring(0, 9)}…` : p.label

            return (
              <g
                key={p.id}
                onClick={() => onPlanetClick(p.id)}
                style={{ cursor: 'pointer' }}
              >
                {/* Stroke ring rendered BEFORE main circle so main renders on top */}
                {isActive && (
                  <circle
                    cx={p.cx}
                    cy={p.cy}
                    r={r + 7}
                    fill="none"
                    stroke={p.colorFrom}
                    strokeWidth="2"
                    strokeOpacity="0.5"
                  />
                )}

                {p.hasRing && (
                  <ellipse
                    cx={p.cx}
                    cy={p.cy}
                    rx={r * 1.5}
                    ry={r * 0.35}
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="1.5"
                  />
                )}

                <circle
                  cx={p.cx}
                  cy={p.cy}
                  r={r}
                  fill={`url(#mg-${p.id})`}
                  opacity={isActive ? 1 : 0.85}
                />

                <text
                  x={p.cx}
                  y={p.cy + 4}
                  textAnchor="middle"
                  fontSize={Math.max(8, r * 0.5)}
                  fill="white"
                  fontWeight="bold"
                >
                  {String(p.num).padStart(2, '0')}
                </text>

                <text
                  x={p.cx}
                  y={p.cy + r + 18}
                  textAnchor="middle"
                  fontSize="11"
                  fill={isActive ? '#aaccff' : '#7799bb'}
                  fontWeight={isActive ? 'bold' : 'normal'}
                >
                  {labelText}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </aside>
  )
}

export default MiniMap
