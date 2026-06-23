import { useState } from 'react'
import type { PresentationContextValue } from '../types'

const TOTAL_STEPS = 7

export function usePresentation(): PresentationContextValue {
  const [mode, setMode] = useState<'presentation' | 'exploration'>('exploration')
  const [currentStep, setCurrentStep] = useState(0)

  function next() {
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS - 1))
  }

  function prev() {
    setCurrentStep((s) => Math.max(s - 1, 0))
  }

  function toggle() {
    setMode((m) => (m === 'exploration' ? 'presentation' : 'exploration'))
    setCurrentStep(0)
  }

  return { mode, currentStep, next, prev, toggle }
}
