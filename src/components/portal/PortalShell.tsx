import { usePortalNav } from '../../hooks/usePortalNav'
import type { PortalScreen } from '../../hooks/usePortalNav'
import TelaInicio from './TelaInicio'
import TelaDocumentos from './TelaDocumentos'
import TelaSolicitacoes from './TelaSolicitacoes'
import TelaTreinamentos from './TelaTreinamentos'
import TelaRescisao from './TelaRescisao'
import type { ComponentType } from 'react'

// Para adicionar uma tela:
// 1. Adicione o valor em PortalScreen (src/hooks/usePortalNav.ts)
// 2. Crie o arquivo Tela*.tsx nesta pasta
// 3. Importe acima e adicione no SCREENS_MAP abaixo
// 4. Adicione o item em NAV_ITEMS abaixo
const SCREENS_MAP: Record<PortalScreen, ComponentType> = {
  inicio:       TelaInicio,
  documentos:   TelaDocumentos,
  solicitacoes: TelaSolicitacoes,
  treinamentos: TelaTreinamentos,
  rescisao:     TelaRescisao,
}

interface NavItem {
  screen: PortalScreen
  label: string
  icon: string
}

const NAV_ITEMS: NavItem[] = [
  { screen: 'inicio',       label: 'Início',       icon: '🏠' },
  { screen: 'documentos',   label: 'Documentos',   icon: '📄' },
  { screen: 'solicitacoes', label: 'Solicitações', icon: '💬' },
  { screen: 'treinamentos', label: 'Treinamentos', icon: '📚' },
  { screen: 'rescisao',     label: 'Rescisão',     icon: '📋' },
]

function PortalShell() {
  const { screen, navigate } = usePortalNav()
  const ActiveScreen = SCREENS_MAP[screen]

  return (
    <div className="flex h-[720px] rounded-2xl overflow-hidden border border-gi-border shadow-xl">
      <aside className="w-[220px] bg-gi-navy flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-white/10">
          <div className="text-white font-bold text-sm">GI Worker</div>
          <div className="text-white/50 text-xs mt-0.5">Portal do Colaborador</div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.screen}
              onClick={() => navigate(item.screen)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left ${
                screen === item.screen
                  ? 'bg-white/15 text-white border-l-[3px] border-gi-blue pl-[9px]'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gi-blue flex items-center justify-center text-white text-xs font-bold shrink-0">
              AS
            </div>
            <div>
              <div className="text-white text-xs font-bold leading-tight">Ana Silva</div>
              <div className="text-white/50 text-[10px]">Operadora · Shopee SP</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col bg-[#F8F9FA] overflow-hidden">
        <header className="h-[52px] bg-white border-b border-gi-border flex items-center px-5 shrink-0">
          <span className="text-sm font-bold text-gi-dark">
            {NAV_ITEMS.find(i => i.screen === screen)?.label}
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-[11px] text-gi-charcoal">Dados ilustrativos</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gi-amber inline-block" />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <ActiveScreen />
        </main>
      </div>
    </div>
  )
}

export default PortalShell
