import { Lightning } from '@phosphor-icons/react'
import { Tab } from '../App'
import { useSimulator } from '../context/SimulatorContext'
import { SimMode } from '../data'

const TABS: { id: Tab; label: string }[] = [
  { id: 'dashboard',    label: 'Dashboard'    },
  { id: 'cache-items',  label: 'Cache Items'  },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'simulator',    label: 'Simulator'    },
]

const MODE_META: Record<SimMode, { label: string; color: string; bg: string; border: string }> = {
  normal:       { label: 'Normal',    color: 'var(--accent)',  bg: 'var(--accent-dim)',  border: 'rgba(129,140,248,0.30)' },
  'flash-sale': { label: 'Flash Sale',color: 'var(--orange)', bg: 'var(--orange-dim)',  border: 'rgba(251,146,60,0.30)'  },
  idle:         { label: 'Idle',      color: 'var(--blue)',   bg: 'var(--blue-dim)',    border: 'rgba(56,189,248,0.30)'  },
}

interface HeaderProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const { mode } = useSimulator()
  const meta = MODE_META[mode]

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(9,9,15,0.94)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <div className="max-w-screen-xl mx-auto px-6 h-[58px] flex items-center justify-between gap-6">

        {/* Brand */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div
            className="flex items-center justify-center w-7 h-7"
            style={{ background: 'var(--accent-dim)', border: '1px solid rgba(129,140,248,0.35)', borderRadius: 6 }}
          >
            <Lightning size={13} weight="fill" style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <div className="font-semibold text-sm" style={{ color: 'var(--text)', letterSpacing: '-0.01em', lineHeight: 1 }}>
              PCE
            </div>
            <div className="mono text-[9px] mt-0.5" style={{ color: 'var(--text-3)', letterSpacing: '0.05em' }}>
              PREDICTIVE CACHE
            </div>
          </div>
          {/* Mode chip */}
          <span
            className="mono text-[9px] font-semibold px-2 py-0.5 uppercase tracking-wider"
            style={{
              color: meta.color,
              background: meta.bg,
              border: `1px solid ${meta.border}`,
              borderRadius: 4,
            }}
          >
            {meta.label}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="px-3.5 py-1.5 text-xs font-medium transition-all duration-150"
                style={{
                  borderRadius: 20,
                  background:   isActive ? 'var(--accent)' : 'transparent',
                  color:        isActive ? '#03090a' : 'var(--text-3)',
                  fontWeight:   isActive ? 600 : 400,
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
