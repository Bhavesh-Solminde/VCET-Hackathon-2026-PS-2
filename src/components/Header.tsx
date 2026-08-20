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

const MODE_LABEL: Record<SimMode, string> = {
  normal:       'NORMAL',
  'flash-sale': 'FLASH SALE',
  idle:         'IDLE',
}

interface HeaderProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  const { mode } = useSimulator()

  return (
    <header
      className="sticky top-0 z-50"
      style={{ background: 'rgba(13,13,13,0.96)', borderBottom: '1px solid var(--border)', backdropFilter: 'blur(12px)' }}
    >
      <div className="max-w-screen-xl mx-auto px-6 h-[60px] flex items-center justify-between">

        {/* Wordmark */}
        <div className="flex items-center gap-2.5">
          <Lightning size={16} weight="fill" style={{ color: 'var(--accent)' }} />
          <span className="mono text-sm font-semibold tracking-tight" style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}>
            PCE
          </span>
          <span
            className="mono text-[10px] px-1.5 py-0.5 rounded"
            style={{
              background: mode === 'flash-sale' ? 'rgba(251,146,60,0.15)' : 'var(--surface-2)',
              color: mode === 'flash-sale' ? '#fb923c' : 'var(--text-3)',
              border: `1px solid ${mode === 'flash-sale' ? 'rgba(251,146,60,0.3)' : 'var(--border)'}`,
            }}
          >
            {MODE_LABEL[mode]}
          </span>
        </div>

        {/* Tabs */}
        <nav className="flex items-center gap-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative px-4 py-1.5 text-xs font-medium transition-colors duration-100"
              style={{ color: activeTab === tab.id ? 'var(--text)' : 'var(--text-3)' }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-[1px]"
                  style={{ background: 'var(--accent)' }}
                />
              )}
            </button>
          ))}
        </nav>

      </div>
    </header>
  )
}
