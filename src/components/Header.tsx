import { Zap } from 'lucide-react'
import { Tab } from '../App'
import { useSimulator } from '../context/SimulatorContext'
import { SimMode } from '../data'

const TABS: { id: Tab; label: string }[] = [
  { id: 'dashboard',    label: 'Dashboard' },
  { id: 'cache-items',  label: 'Cache Items' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'simulator',    label: 'Simulator' },
]

const MODE_BADGES: Record<SimMode, { label: string; color: string }> = {
  normal:      { label: 'Normal',     color: 'bg-slate-700 text-slate-300' },
  'flash-sale': { label: 'Flash Sale', color: 'bg-orange-500/20 text-orange-400 border border-orange-500/40' },
  idle:         { label: 'Idle',       color: 'bg-slate-600/30 text-slate-400 border border-slate-500/40' },
}

interface HeaderProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const { mode } = useSimulator()
  const badge = MODE_BADGES[mode]

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'rgba(4, 8, 26, 0.92)',
        backdropFilter: 'blur(16px)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30">
              <Zap size={18} className="text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-white tracking-tight">
                  Predictive Caching Engine
                </span>
                {mode !== 'normal' && (
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full font-mono uppercase tracking-wider ${badge.color}`}>
                    {badge.label}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">
                Smart Cache. Lower Costs. Stronger Systems.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-900/60 border border-slate-800/80 rounded-xl p-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
