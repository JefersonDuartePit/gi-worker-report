import { useState } from 'react'

export type PortalScreen =
  | 'inicio'
  | 'documentos'
  | 'solicitacoes'
  | 'treinamentos'
  | 'rescisao'
  | 'desenvolvimento'

const PORTAL_SCREENS: PortalScreen[] = [
  'inicio', 'documentos', 'solicitacoes', 'treinamentos', 'rescisao', 'desenvolvimento',
]

export function isPortalScreen(value: string): value is PortalScreen {
  return (PORTAL_SCREENS as string[]).includes(value)
}

export function usePortalNav() {
  const [screen, setScreen] = useState<PortalScreen>('inicio')
  return { screen, navigate: setScreen }
}
