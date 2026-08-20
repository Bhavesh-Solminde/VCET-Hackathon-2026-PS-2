import { useEffect, useState } from 'react'
import { CheckCircle2, X } from 'lucide-react'
import { useSimulator } from '../context/SimulatorContext'

export default function Toast() {
  const { toast, clearToast } = useSimulator()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (toast) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }, [toast])

  if (!toast) return null

  return (
    <div
      className={`fixed top-20 right-6 z-50 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
    >
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl max-w-sm"
        style={{
          background: 'rgba(10, 22, 40, 0.97)',
          borderColor: 'rgba(16, 185, 129, 0.4)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(16,185,129,0.2)',
        }}
      >
        <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
        <p className="text-sm text-slate-200 flex-1">{toast}</p>
        <button
          onClick={clearToast}
          className="text-slate-500 hover:text-slate-300 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
