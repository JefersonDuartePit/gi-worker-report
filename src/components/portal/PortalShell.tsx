import { usePortalNav } from '../../hooks/usePortalNav'
import type { PortalScreen } from '../../hooks/usePortalNav'
import TelaInicio from './TelaInicio'
import TelaDocumentos from './TelaDocumentos'
import TelaSolicitacoes from './TelaSolicitacoes'
import TelaTreinamentos from './TelaTreinamentos'
import TelaRescisao from './TelaRescisao'
import TelaDesenvolvimento from './TelaDesenvolvimento'
import { Home, FileText, MessageSquare, BookOpen, ClipboardList, TrendingUp } from 'lucide-react'
import type { ComponentType } from 'react'
import logoWorker from '../../assets/logo-worker-portal.svg'

interface PortalShellProps {
  fullscreen?: boolean
}

// Para adicionar uma tela:
// 1. Adicione o valor em PortalScreen (src/hooks/usePortalNav.ts)
// 2. Crie o arquivo Tela*.tsx nesta pasta
// 3. Importe acima e adicione no SCREENS_MAP abaixo
// 4. Adicione o item em NAV_ITEMS abaixo
const SCREENS_MAP: Partial<Record<PortalScreen, ComponentType>> = {
  documentos: TelaDocumentos,
  solicitacoes: TelaSolicitacoes,
  treinamentos: TelaTreinamentos,
  rescisao: TelaRescisao,
  desenvolvimento: TelaDesenvolvimento,
}

interface NavItem {
  screen: PortalScreen
  label: string
  icon: ComponentType<{ className?: string }>
}

const NAV_ITEMS: NavItem[] = [
  { screen: 'inicio', label: 'Início', icon: Home },
  { screen: 'documentos', label: 'Documentos', icon: FileText },
  { screen: 'solicitacoes', label: 'Solicitações', icon: MessageSquare },
  { screen: 'treinamentos', label: 'Treinamentos', icon: BookOpen },
  { screen: 'rescisao', label: 'Rescisão', icon: ClipboardList },
  { screen: 'desenvolvimento', label: 'Desenvolvimento', icon: TrendingUp },
]

function PortalShell({ fullscreen = false }: PortalShellProps) {
  const { screen, navigate } = usePortalNav()
  const ActiveScreen = SCREENS_MAP[screen]
  const activeItem = NAV_ITEMS.find(i => i.screen === screen)
  const ActiveIcon = activeItem?.icon

  return (
    <div
      className={
        fullscreen
          ? 'flex h-full w-full overflow-hidden'
          : 'flex h-[720px] rounded-xl overflow-hidden border border-gi-border shadow-sm'
      }
    >
      <aside className="w-[220px] bg-gi-navy flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-white/10">
          <img src={logoWorker} alt="GI Worker" className="h-[18px] object-contain" />
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.screen}
                onClick={() => navigate(item.screen)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                  screen === item.screen
                    ? 'bg-white/10 text-white'
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="font-medium tracking-[-0.01em]">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="shrink-0 border-t border-white/10 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gi-blue flex items-center justify-center text-white text-xs font-bold shrink-0">
              AS
            </div>
            <div className="min-w-0">
              <p className="text-white text-[13px] font-medium leading-tight truncate">Ana Silva</p>
              <p className="text-white/50 text-[11px] leading-tight">Operadora · Shopee SP</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col bg-gi-light overflow-hidden">
        <header className="h-12 bg-white border-b border-gi-border flex items-center px-5 shrink-0 gap-3">
          {ActiveIcon && <ActiveIcon className="w-4 h-4 text-gi-charcoal" />}
          <span className="text-[14px] font-semibold text-gi-navy">{activeItem?.label}</span>
          <span className="text-gi-border">|</span>
          <span className="text-xs text-gi-charcoal">dados ilustrativos para fins de demonstração</span>
        </header>
        <main className="flex-1 overflow-y-auto">
          {screen === 'inicio' ? <TelaInicio onNavigate={navigate} /> : ActiveScreen && <ActiveScreen />}
        </main>
      </div>
    </div>
  )
}

export default PortalShell
