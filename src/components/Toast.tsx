import { useEffect, useState } from 'react'
import { CheckCircle, X } from '@phosphor-icons/react'
import { useSimulator } from '../context/SimulatorContext'

export default function Toast() {
  const { toast, clearToast } = useSimulator()
  const [show, setShow] = useState(false)

  useEffect(() => { setShow(!!toast) }, [toast])

  if (!toast) return null

  return (
    <div
      className={`transition-all duration-200 ${show ? 'opacity-100' : 'opacity-0'}`}
      style={{
        background: 'var(--accent-dim)',
        borderBottom: '1px solid rgba(129,140,248,0.22)',
      }}
    >
      <div className="max-w-screen-xl mx-auto px-6 h-9 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle size={12} weight="fill" style={{ color: 'var(--accent)', flexShrink: 0 }} />
          <span className="text-xs" style={{ color: 'var(--accent)' }}>{toast}</span>
        </div>
        <button onClick={clearToast} className="transition-opacity hover:opacity-70">
          <X size={12} weight="bold" style={{ color: 'var(--text-3)' }} />
        </button>
      </div>
    </div>
  )
}
