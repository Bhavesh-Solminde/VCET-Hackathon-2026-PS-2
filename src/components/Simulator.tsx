import { Activity, ShoppingCart, Moon } from 'lucide-react'
import { SimMode } from '../data'
import { useSimulator } from '../context/SimulatorContext'

const MODES: {
  id: SimMode
  icon: typeof Activity
  label: string
  tagline: string
  description: string
  effects: string[]
  accent: string
  accentBg: string
  accentBorder: string
  accentGlow: string
}[] = [
  {
    id: 'normal',
    icon: Activity,
    label: 'Normal Traffic',
    tagline: 'Steady-state baseline',
    description: 'Simulates typical production traffic with moderate read patterns and a healthy mix of hot, cold, and evicted cache items.',
    effects: [
      '~8,700 requests/second',
      '68% memory utilization',
      '92% cache hit ratio',
      'Balanced hot/cold distribution',
    ],
    accent: 'text-blue-400',
    accentBg: 'bg-blue-500/10',
    accentBorder: 'border-blue-500/30',
    accentGlow: 'rgba(59,130,246,0.15)',
  },
  {
    id: 'flash-sale',
    icon: ShoppingCart,
    label: 'Flash Sale / Spike',
    tagline: 'High-load event simulation',
    description: 'Simulates a flash sale or viral traffic spike. The predictive engine detects the surge and automatically extends TTLs for popular products, preventing DB overload.',
    effects: [
      '~27,800+ requests/second',
      '87% memory utilization',
      '95% cache hit ratio',
      'Most items promoted to Hot',
    ],
    accent: 'text-orange-400',
    accentBg: 'bg-orange-500/10',
    accentBorder: 'border-orange-500/30',
    accentGlow: 'rgba(249,115,22,0.12)',
  },
  {
    id: 'idle',
    icon: Moon,
    label: 'Idle Period',
    tagline: 'Low-traffic overnight mode',
    description: 'Simulates off-hours low traffic. The engine aggressively evicts cold items to shrink the Redis footprint and reduce costs while the system is quiet.',
    effects: [
      '~1,300 requests/second',
      '28% memory utilization',
      '84% cache hit ratio',
      'Aggressive eviction of cold items',
    ],
    accent: 'text-slate-400',
    accentBg: 'bg-slate-600/10',
    accentBorder: 'border-slate-600/30',
    accentGlow: 'rgba(100,116,139,0.08)',
  },
]

export default function Simulator() {
  const { mode: activeMode, activateMode } = useSimulator()

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-base font-semibold text-white">Traffic Simulator</h2>
        <p className="text-xs text-slate-500 mt-1">
          Activate a scenario to see how the Predictive Caching Engine responds in real time.
          Dashboard and Cache Items update immediately.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {MODES.map(m => {
          const isActive = activeMode === m.id
          return (
            <div
              key={m.id}
              className={`relative rounded-2xl border p-6 transition-all duration-200 cursor-pointer hover:scale-[1.01] ${m.accentBorder} ${isActive ? 'ring-1 ring-offset-0' : ''}`}
              style={{
                background: isActive ? `rgba(10,22,40,0.97)` : 'var(--bg-card)',
                borderColor: isActive ? undefined : 'var(--border)',
                boxShadow: isActive ? `0 0 40px ${m.accentGlow}, 0 4px 24px rgba(0,0,0,0.4)` : '0 4px 16px rgba(0,0,0,0.2)',
              }}
              onClick={() => activateMode(m.id)}
            >
              {isActive && (
                <div className="absolute top-4 right-4 flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${m.id === 'normal' ? 'bg-blue-400' : m.id === 'flash-sale' ? 'bg-orange-400' : 'bg-slate-400'}`} />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Active</span>
                </div>
              )}

              <div className={`flex items-center justify-center w-12 h-12 rounded-xl border mb-4 ${m.accentBg} ${m.accentBorder}`}>
                <m.icon size={22} className={m.accent} />
              </div>

              <h3 className="text-sm font-bold text-white mb-0.5">{m.label}</h3>
              <p className={`text-xs font-medium mb-3 ${m.accent}`}>{m.tagline}</p>
              <p className="text-xs text-slate-500 leading-relaxed mb-5">{m.description}</p>

              <div className="space-y-2 mb-5">
                {m.effects.map(e => (
                  <div key={e} className="flex items-center gap-2 text-xs text-slate-400">
                    <div className={`w-1 h-1 rounded-full flex-shrink-0 ${m.id === 'normal' ? 'bg-blue-500' : m.id === 'flash-sale' ? 'bg-orange-500' : 'bg-slate-500'}`} />
                    {e}
                  </div>
                ))}
              </div>

              <button
                onClick={e => { e.stopPropagation(); activateMode(m.id) }}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 border ${
                  isActive
                    ? `${m.accentBg} ${m.accent} ${m.accentBorder}`
                    : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:bg-slate-700/60 hover:text-slate-200'
                }`}
                style={isActive ? { boxShadow: `0 0 20px ${m.accentGlow}` } : undefined}
              >
                {isActive ? 'Currently Active' : `Activate ${m.label}`}
              </button>
            </div>
          )
        })}
      </div>

    </div>
  )
}
