import { useContext } from 'react'
import { PresentationContext } from '../../App'

function GalaxyHeader() {
  const { mode, toggle } = useContext(PresentationContext)

  return (
    <div className="relative z-10 flex items-center justify-between px-8 py-4 border-b border-gi-blue/10 bg-galaxy-header">
      <div className="flex items-center gap-3">
        <img
          src="/src/assets/logo-gi-group.png"
          alt="GI Group"
          className="h-7 object-contain"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
        <span className="text-[11px] text-gi-orbit uppercase tracking-[2px]">
          Portal do Worker
        </span>
      </div>

      <p className="text-[13px] text-gi-stardust">
        <strong className="text-white font-bold">Escolha um módulo</strong> para começar
      </p>

      <button
        onClick={toggle}
        className="text-[11px] text-gi-stardust px-3 py-1.5 rounded-lg uppercase tracking-widest border border-gi-blue/25 hover:border-gi-blue/50 hover:text-gi-comet transition-all"
      >
        {mode === 'exploration' ? 'Apresentação' : 'Exploração'}
      </button>
    </div>
  )
}

export default GalaxyHeader
