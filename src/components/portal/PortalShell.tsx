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
import logoGI from '../../assets/logo-gi-group.png'

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

  return (
    <div
      className={
        fullscreen
          ? 'flex h-full w-full overflow-hidden'
          : 'flex h-[720px] rounded-2xl overflow-hidden border border-gi-border shadow-xl'
      }
    >
      <aside className="w-[220px] bg-gi-navy flex flex-col shrink-0">
        <div className="px-5 py-4 border-b border-white/10">
          <img src={logoGI} alt="GI Group" className="h-6 object-contain mb-2" />
          <div className="text-white font-bold text-sm">GI Worker</div>
          <div className="text-white/50 text-xs mt-0.5">Portal do Colaborador</div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.screen}
                onClick={() => navigate(item.screen)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left ${
                  screen === item.screen
                    ? 'bg-white/15 text-white border-l-[3px] border-gi-blue pl-[9px]'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </button>
            )
          })}
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
          {screen === 'inicio' ? <TelaInicio onNavigate={navigate} /> : ActiveScreen && <ActiveScreen />}
        </main>
      </div>
    </div>
  )
}

export default PortalShell
