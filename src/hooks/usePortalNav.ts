import { useState } from 'react'

export type PortalScreen =
  | 'inicio'
  | 'documentos'
  | 'solicitacoes'
  | 'treinamentos'
  | 'rescisao'
  | 'desenvolvimento'

export function usePortalNav() {
  const [screen, setScreen] = useState<PortalScreen>('inicio')
  return { screen, navigate: setScreen }
}
