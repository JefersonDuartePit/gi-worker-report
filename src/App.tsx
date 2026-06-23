import { createContext, useMemo } from 'react'
import { usePresentation } from './hooks/usePresentation'
import { useActiveSection } from './hooks/useActiveSection'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import Section from './components/layout/Section'
import S1Hero from './components/sections/S1Hero'
import S2Diagnostico from './components/sections/S2Diagnostico'
import S3Dores from './components/sections/S3Dores'
import S4Arquitetura from './components/sections/S4Arquitetura'
import S5Iniciativas from './components/sections/S5Iniciativas'
import S6Portal from './components/sections/S6Portal'
import S7Provocacoes from './components/sections/S7Provocacoes'
import type { PresentationContextValue, SectionMeta } from './types'

export const PresentationContext = createContext<PresentationContextValue>({
  mode: 'exploration',
  currentStep: 0,
  next: () => undefined,
  prev: () => undefined,
  toggle: () => undefined,
  goTo: () => undefined,
})

const SECTIONS: SectionMeta[] = [
  { id: 'hero',        label: 'Contexto',          Component: S1Hero },
  { id: 'diagnostico', label: 'Diagnóstico',        Component: S2Diagnostico },
  { id: 'dores',       label: 'Dores',              Component: S3Dores },
  { id: 'arquitetura', label: 'Arquitetura',         Component: S4Arquitetura },
  { id: 'iniciativas', label: 'Iniciativas',         Component: S5Iniciativas },
  { id: 'portal',      label: 'Portal do Worker',   Component: S6Portal },
  { id: 'provocacoes', label: 'Próximos passos',    Component: S7Provocacoes },
]

const SECTION_IDS = SECTIONS.map((s) => s.id)

export function App() {
  const presentation = usePresentation()
  const { activeId } = useActiveSection(SECTION_IDS)

  const activeLabel = useMemo(
    () => SECTIONS.find((s) => s.id === activeId)?.label ?? '',
    [activeId],
  )

  return (
    <PresentationContext.Provider value={presentation}>
      <Header activeLabel={activeLabel} />
      <Sidebar sections={SECTIONS} activeId={activeId} />
      <main className="ml-[240px] mt-[56px]">
        {SECTIONS.map(({ id, Component }) => (
          <Section key={id} id={id}>
            <Component />
          </Section>
        ))}
      </main>
    </PresentationContext.Provider>
  )
}

export default App
