import { createContext, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { usePresentation } from './hooks/usePresentation'
import Header from './components/layout/Header'
import MiniMap from './components/layout/MiniMap'
import SplashScreen from './components/layout/SplashScreen'
import GalaxyMap from './components/layout/GalaxyMap'
import PortalShell from './components/portal/PortalShell'
import S1Hero from './components/sections/S1Hero'
import S2Diagnostico from './components/sections/S2Diagnostico'
import S3Dores from './components/sections/S3Dores'
import S4Arquitetura from './components/sections/S4Arquitetura'
import S5Iniciativas from './components/sections/S5Iniciativas'
import S6Portal from './components/sections/S6Portal'
import S7Provocacoes from './components/sections/S7Provocacoes'
import type { PresentationContextValue, SectionMeta, UiState } from './types'

const PORTAL_SECTION_ID = 'portal'
const PROXIMOS_PASSOS_SECTION_ID = 'provocacoes'

export const PresentationContext = createContext<PresentationContextValue>({
  mode: 'exploration',
  currentStep: 0,
  next: () => undefined,
  prev: () => undefined,
  toggle: () => undefined,
  goTo: () => undefined,
})

// Ordem das specs: S1→S2→S3→S4→S5→S6→S7
const SECTIONS: SectionMeta[] = [
  { id: 'hero',        label: 'Contexto',         Component: S1Hero },
  { id: 'diagnostico', label: 'Diagnóstico',      Component: S2Diagnostico },
  { id: 'dores',       label: 'Dores',            Component: S3Dores },
  { id: 'arquitetura', label: 'Arquitetura',      Component: S4Arquitetura },
  { id: 'iniciativas', label: 'Iniciativas',      Component: S5Iniciativas },
  { id: 'portal',      label: 'Portal do Worker', Component: S6Portal },
  { id: 'provocacoes', label: 'Próximos Passos',  Component: S7Provocacoes },
]

export function App() {
  const presentation = usePresentation()
  const [uiState, setUiState] = useState<UiState>('splash')

  const activeSection = SECTIONS[presentation.currentStep] ?? SECTIONS[0]
  const activeNum = presentation.currentStep + 1

  function handleSplashComplete() {
    setUiState('galaxy')
  }

  function handlePlanetClick(sectionId: string) {
    const index = SECTIONS.findIndex((s) => s.id === sectionId)
    if (index !== -1) {
      presentation.goTo(index)
      setUiState('module')
    }
  }

  function handleGalaxyClick() {
    setUiState('galaxy')
  }

  function handleProximosPassos() {
    handlePlanetClick(PROXIMOS_PASSOS_SECTION_ID)
  }

  const isPortalFullscreen = uiState === 'module' && activeSection.id === PORTAL_SECTION_ID

  return (
    <PresentationContext.Provider value={presentation}>
      <AnimatePresence mode="wait">
        {uiState === 'splash' && (
          <SplashScreen key="splash" onComplete={handleSplashComplete} />
        )}

        {uiState === 'galaxy' && (
          <GalaxyMap
            key="galaxy"
            onPlanetClick={handlePlanetClick}
            activeSectionId={activeSection.id}
          />
        )}

        {isPortalFullscreen && (
          <motion.div
            key="portal-fullscreen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col bg-white"
          >
            <div className="h-6 shrink-0 bg-gi-navy flex items-center justify-between px-3">
              <button
                onClick={handleGalaxyClick}
                className="flex items-center gap-1 text-[11px] text-white/80 hover:text-white transition-colors"
              >
                <ChevronLeft size={11} />
                Voltar
              </button>
              <button
                onClick={handleProximosPassos}
                className="flex items-center gap-1 text-[11px] text-white/80 hover:text-white transition-colors"
              >
                Próximos passos
                <ChevronRight size={11} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <PortalShell fullscreen />
            </div>
          </motion.div>
        )}

        {uiState === 'module' && !isPortalFullscreen && (
          <motion.div
            key="module"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Header
              activeLabel={activeSection.label}
              activeNum={activeNum}
              onGalaxyClick={handleGalaxyClick}
            />

            {presentation.mode === 'exploration' && (
              <MiniMap
                activeSectionId={activeSection.id}
                onPlanetClick={handlePlanetClick}
                mode={presentation.mode}
                onToggleMode={presentation.toggle}
              />
            )}

            <main
              className="mt-[56px] transition-all duration-300"
              style={{ marginLeft: presentation.mode === 'exploration' ? 200 : 0 }}
            >
              <activeSection.Component />
            </main>

            {presentation.mode === 'presentation' && (
              <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
                <button
                  onClick={presentation.prev}
                  disabled={presentation.currentStep === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-gi-navy text-white rounded-lg disabled:opacity-40 hover:bg-gi-blue transition-colors"
                >
                  <ChevronLeft size={16} />
                  Anterior
                </button>
                <span className="text-sm text-gi-charcoal bg-white px-3 py-1 rounded-lg border border-gi-border">
                  {activeNum} / {SECTIONS.length}
                </span>
                <button
                  onClick={presentation.next}
                  disabled={presentation.currentStep === SECTIONS.length - 1}
                  className="flex items-center gap-2 px-4 py-2 bg-gi-navy text-white rounded-lg disabled:opacity-40 hover:bg-gi-blue transition-colors"
                >
                  Próximo
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </PresentationContext.Provider>
  )
}

export default App
