import { Waveform, ShoppingCart, Moon } from '@phosphor-icons/react'
import { SimMode, SIM_CONFIG } from '../data'
import { useSimulator } from '../context/SimulatorContext'

const MODES: {
  id: SimMode
  Icon: any
  label: string
  desc: string
  effects: [string, string][]
}[] = [
  {
    id: 'normal',
    Icon: Waveform,
    label: 'Normal Traffic',
    desc: 'Steady-state production. A healthy mix of hot and cold keys with typical access patterns. The engine runs maintenance-mode eviction.',
    effects: [
      ['Requests/sec', '~8,700'],
      ['Memory',       '68%'],
      ['Hit ratio',    '92.3%'],
      ['Est. savings', '$12.5k/day'],
    ],
  },
  {
    id: 'flash-sale',
    Icon: ShoppingCart,
    label: 'Flash Sale / Spike',
    desc: 'Viral event or scheduled sale. Read volume spikes 3x. The engine detects frequency surge and extends TTLs on product keys to prevent DB collapse.',
    effects: [
      ['Requests/sec', '~27,800'],
      ['Memory',       '87%'],
      ['Hit ratio',    '95.1%'],
      ['Est. savings', '$38.4k/day'],
    ],
  },
  {
    id: 'idle',
    Icon: Moon,
    label: 'Idle Period',
    desc: 'Off-hours, overnight, or post-event quiet window. The engine aggressively shrinks the cache footprint by evicting cold data, cutting Redis cost.',
    effects: [
      ['Requests/sec', '~1,300'],
      ['Memory',       '28%'],
      ['Hit ratio',    '84.6%'],
      ['Est. savings', '$3.2k/day'],
    ],
  },
]

export default function Simulator() {
  const { mode: active, activateMode } = useSimulator()

  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Traffic Scenarios</h2>
        <p className="mono text-[11px] mt-1" style={{ color: 'var(--text-3)' }}>
          Activate a scenario. Dashboard and Cache Items reflect the change immediately.
        </p>
      </div>

      {/* Comparison table */}
      <div style={{ border: '1px solid var(--border)', overflowX: 'auto' }}>
        <table className="w-full min-w-[500px]">
          <thead>
            <tr style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
              <th className="px-5 py-3 text-left mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-3)', width: '28%' }}>
                Metric
              </th>
              {MODES.map(m => (
                <th
                  key={m.id}
                  className="px-5 py-3 text-left"
                  style={{
                    borderLeft: '1px solid var(--border)',
                    background: active === m.id ? 'var(--accent-dim)' : undefined,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <m.Icon
                      size={13}
                      weight={active === m.id ? 'fill' : 'regular'}
                      style={{ color: active === m.id ? 'var(--accent)' : 'var(--text-3)' }}
                    />
                    <span
                      className="text-[11px] font-semibold"
                      style={{ color: active === m.id ? 'var(--accent)' : 'var(--text-2)' }}
                    >
                      {m.label}
                    </span>
                    {active === m.id && (
                      <span className="mono text-[9px] px-1.5 py-0.5 font-semibold uppercase tracking-wider" style={{ background: 'var(--accent)', color: '#000', borderRadius: 2 }}>
                        active
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MODES[0].effects.map(([metric], ri) => (
              <tr
                key={metric}
                style={{ borderBottom: ri < MODES[0].effects.length - 1 ? '1px solid var(--border-dim)' : undefined }}
              >
                <td className="px-5 py-3 mono text-[11px]" style={{ color: 'var(--text-3)' }}>{metric}</td>
                {MODES.map(m => (
                  <td
                    key={m.id}
                    className="px-5 py-3"
                    style={{
                      borderLeft: '1px solid var(--border)',
                      background: active === m.id ? 'var(--accent-dim)' : undefined,
                    }}
                  >
                    <span
                      className="mono text-xs font-semibold tabular-nums"
                      style={{ color: active === m.id ? 'var(--text)' : 'var(--text-3)' }}
                    >
                      {m.effects[ri][1]}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
            {/* Activate row */}
            <tr style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
              <td className="px-5 py-3 mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>
                Activate
              </td>
              {MODES.map(m => (
                <td
                  key={m.id}
                  className="px-5 py-3"
                  style={{ borderLeft: '1px solid var(--border)' }}
                >
                  <button
                    onClick={() => activateMode(m.id)}
                    className="mono text-[10px] px-3 py-1.5 uppercase tracking-wider font-semibold transition-all"
                    style={{
                      background: active === m.id ? 'var(--accent)' : 'var(--surface-2)',
                      color: active === m.id ? '#000' : 'var(--text-3)',
                      border: `1px solid ${active === m.id ? 'var(--accent)' : 'var(--border)'}`,
                      borderRadius: 2,
                    }}
                  >
                    {active === m.id ? 'running' : 'activate'}
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Active mode description */}
      {MODES.filter(m => m.id === active).map(m => (
        <div
          key={m.id}
          style={{ border: '1px solid var(--border-bright)', background: 'var(--surface)' }}
          className="px-5 py-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full pulse-amber" style={{ background: 'var(--accent)', flexShrink: 0 }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>{m.label}</span>
          </div>
          <p className="mono text-[11px] leading-relaxed" style={{ color: 'var(--text-2)' }}>{m.desc}</p>
        </div>
      ))}
    </div>
  )
}
