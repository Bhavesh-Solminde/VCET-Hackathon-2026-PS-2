import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { SimMode } from '../data'

interface SimulatorContextType {
  mode: SimMode
  activateMode: (mode: SimMode) => void
  toast: string | null
  clearToast: () => void
}

const SimulatorContext = createContext<SimulatorContextType | null>(null)

export function SimulatorProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<SimMode>('normal')
  const [toast, setToast] = useState<string | null>(null)

  const activateMode = useCallback((newMode: SimMode) => {
    setMode(newMode)
    const labels: Record<SimMode, string> = {
      normal: 'Normal Traffic mode active — baseline metrics restored',
      'flash-sale': 'Flash Sale / Spike mode active — high-load simulation running',
      idle: 'Idle Period mode active — low traffic, aggressive eviction',
    }
    setToast(labels[newMode])
    setTimeout(() => setToast(null), 4000)
  }, [])

  const clearToast = useCallback(() => setToast(null), [])

  return (
    <SimulatorContext.Provider value={{ mode, activateMode, toast, clearToast }}>
      {children}
    </SimulatorContext.Provider>
  )
}

export function useSimulator() {
  const ctx = useContext(SimulatorContext)
  if (!ctx) throw new Error('useSimulator must be inside SimulatorProvider')
  return ctx
}
