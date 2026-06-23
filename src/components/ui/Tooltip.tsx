import type { ReactNode } from 'react'

interface TooltipProps {
  dorId: string
  iniciativaId: string
  children: ReactNode
}

function Tooltip({ children }: TooltipProps) {
  return <>{children}</>
}

export default Tooltip
