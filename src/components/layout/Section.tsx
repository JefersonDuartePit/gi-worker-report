import type { ReactNode } from 'react'

interface SectionProps {
  id: string
  children: ReactNode
  className?: string
}

function Section({ id, children, className }: SectionProps) {
  return (
    <section id={id} className={`min-h-screen ${className ?? ''}`}>
      {children}
    </section>
  )
}

export default Section
