import { Waveform, ShoppingCart, Moon, CheckCircle } from '@phosphor-icons/react'
import { SimMode, SIM_CONFIG } from '../data'
import { useSimulator } from '../context/SimulatorContext'

const MODES: {
  id: SimMode
  Icon: any
  label: string
  desc: string
  color: string
  dim: string
  border: string
  effects: [string, string][]
}[] = [
  {
    id: 'normal',
    Icon: Waveform,
    label: 'Normal Traffic',
    color: 'var(--accent)',
    dim: 'var(--accent-dim)',
    border: 'rgba(129,140,248,0.35)',
    desc: 'Steady-state production. Healthy mix of hot and cold keys. The engine runs maintenance-mode eviction and baseline TTL extension.',
    effects: [
      ['Requests/sec',  '~8,700'],
      ['Memory usage',  '68%'],
      ['Cache hit',     '92.3%'],
      ['Est. savings',  '$12.5k/day'],
    ],
  },
  {
    id: 'flash-sale',
    Icon: ShoppingCart,
    label: 'Flash Sale / Spike',
    color: 'var(--orange)',
    dim: 'var(--orange-dim)',
    border: 'rgba(249,115,22,0.35)',
    desc: 'Viral event or scheduled sale. Read volume spikes 3x. TTLs extended on hot product keys to prevent DB saturation.',
    effects: [
      ['Requests/sec',  '~27,800'],
      ['Memory usage',  '87%'],
      ['Cache hit',     '95.1%'],
      ['Est. savings',  '$41k/day'],
    ],
  },
  {
    id: 'idle',
    Icon: Moon,
    label: 'Idle Period',
    color: 'var(--blue)',
    dim: 'var(--blue-dim)',
    border: 'rgba(96,165,250,0.35)',
    desc: 'Off-hours, overnight, or post-event window. Engine aggressively shrinks footprint by evicting cold data. Redis cost falls.',
    effects: [
      ['Requests/sec',  '~1,300'],
      ['Memory usage',  '28%'],
      ['Cache hit',     '84.6%'],
      ['Est. savings',  '$1.7k/day'],
    ],
  },
]

export default function Simulator() {
  const { mode: active, activateMode } = useSimulator()

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-base font-semibold" style={{ color: 'var(--text)' }}>Traffic Scenarios</h2>
        <p className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>
          Activate a scenario. Dashboard and Cache Items reflect the change live.
        </p>
      </div>

      {/* Comparison table */}
      <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="w-full min-w-[520px]">
            <thead>
              <tr style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
                <th className="px-5 py-4 text-left mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-3)', width: '26%' }}>
                  Metric
                </th>
                {MODES.map(m => (
                  <th
                    key={m.id}
                    className="px-5 py-4 text-left"
                    style={{
                      borderLeft: '1px solid var(--border)',
                      background: active === m.id ? m.dim : undefined,
                      borderTop: active === m.id ? `2px solid ${m.color}` : '2px solid transparent',
                    }}
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <m.Icon
                        size={14}
                        weight={active === m.id ? 'fill' : 'regular'}
                        style={{ color: active === m.id ? m.color : 'var(--text-3)', flexShrink: 0 }}
                      />
                      <span
                        className="text-xs font-semibold"
                        style={{ color: active === m.id ? m.color : 'var(--text-2)' }}
                      >
                        {m.label}
                      </span>
                      {active === m.id && (
                        <span
                          className="mono text-[9px] px-1.5 py-0.5 font-semibold uppercase tracking-wider"
                          style={{ background: m.color, color: '#03090a', borderRadius: 3 }}
                        >
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
                  style={{ borderBottom: ri < MODES[0].effects.length - 1 ? '1px solid var(--border)' : undefined }}
                >
                  <td className="px-5 py-3 mono text-[11px]" style={{ color: 'var(--text-3)' }}>{metric}</td>
                  {MODES.map(m => (
                    <td
                      key={m.id}
                      className="px-5 py-3"
                      style={{
                        borderLeft: '1px solid var(--border)',
                        background: active === m.id ? m.dim : undefined,
                      }}
                    >
                      <span
                        className="mono text-sm font-semibold tabular-nums"
                        style={{ color: active === m.id ? m.color : 'var(--text-3)' }}
                      >
                        {m.effects[ri][1]}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
              {/* Activate row */}
              <tr style={{ borderTop: '1px solid var(--border)', background: 'var(--surface-2)' }}>
                <td className="px-5 py-3.5 mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>
                  Activate
                </td>
                {MODES.map(m => (
                  <td
                    key={m.id}
                    className="px-5 py-3.5"
                    style={{ borderLeft: '1px solid var(--border)' }}
                  >
                    <button
                      onClick={() => activateMode(m.id)}
                      className="text-xs px-4 py-1.5 font-semibold transition-all duration-150 flex items-center gap-1.5"
                      style={{
                        background:   active === m.id ? m.color : 'var(--surface-3)',
                        color:        active === m.id ? '#03090a' : 'var(--text-2)',
                        border:       `1px solid ${active === m.id ? m.color : 'var(--border)'}`,
                        borderRadius: 5,
                      }}
                    >
                      {active === m.id && <CheckCircle size={11} weight="fill" />}
                      {active === m.id ? 'Running' : 'Activate'}
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Active mode description */}
      {MODES.filter(m => m.id === active).map(m => (
        <div
          key={m.id}
          className="px-5 py-4 flex items-start gap-4"
          style={{
            background: m.dim,
            border: `1px solid ${m.border}`,
            borderRadius: 8,
          }}
        >
          <div
            className="flex items-center justify-center w-9 h-9 flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${m.border}`, borderRadius: 7 }}
          >
            <m.Icon size={16} weight="fill" style={{ color: m.color }} />
          </div>
          <div>
            <div className="text-sm font-semibold mb-1" style={{ color: m.color }}>{m.label}</div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>{m.desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
