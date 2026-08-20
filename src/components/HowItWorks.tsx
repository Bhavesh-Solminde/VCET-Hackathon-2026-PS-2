import { Globe, ChartBar, Timer, Trash, Lightning, Warning, CheckCircle } from '@phosphor-icons/react'

const STEPS = [
  { Icon: Globe,     label: 'Read request arrives',          detail: 'App layer sends a read to the caching layer first, not the DB.' },
  { Icon: ChartBar,  label: 'Frequency analysis runs',       detail: 'Live read patterns sampled every 1.5 seconds per key.' },
  { Icon: Timer,     label: 'TTL mutated dynamically',       detail: 'Hot keys get extended TTLs. Cold keys get shortened.' },
  { Icon: Trash,     label: 'Cold data evicted immediately', detail: 'Rarely-read keys are flushed to free Redis memory.' },
  { Icon: Lightning, label: 'Cache serves optimized data',   detail: 'Next request hits cache. DB is never touched.' },
]

const COMPARE = [
  {
    title: 'Before',
    Icon: Warning,
    color: 'var(--red)',
    points: [
      ['Static TTLs', 'fixed expiration, set once and forgotten'],
      ['Cache bloat', 'everything cached regardless of access frequency'],
      ['DB overload', 'conservative caching floods primary DB with reads'],
      ['Predictable overspend', 'paying for Redis memory no one uses'],
    ],
  },
  {
    title: 'After',
    Icon: CheckCircle,
    color: 'var(--accent)',
    points: [
      ['Dynamic TTLs', 'extended for hot keys, shortened for cold ones'],
      ['Selective caching', 'only frequently-read data stays in memory'],
      ['DB protection', '92%+ hit ratio keeps primary DB load low'],
      ['Right-sized cost', 'smaller cache footprint, lower monthly bill'],
    ],
  },
]

const NEXT = [
  { label: 'ML Pre-Caching',    detail: 'Warm cache before predicted spikes using historical patterns' },
  { label: 'Multi-Region Sync', detail: 'Consistent hot-key set across global edge nodes' },
  { label: 'Anomaly Detection', detail: 'Flag unusual access patterns before they cause incidents' },
  { label: 'Cost Forecasting',  detail: 'Predict monthly Redis spend from live traffic trends' },
  { label: 'Backend Plugins',   detail: 'Memcached, CDN edge, DynamoDB DAX - swap the backend' },
]

export default function HowItWorks() {
  return (
    <div className="animate-fade-in space-y-10">

      {/* Flow */}
      <section>
        <div className="mb-5">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Request flow</h2>
          <p className="mono text-[11px] mt-1" style={{ color: 'var(--text-3)' }}>
            how a read request moves through the predictive layer
          </p>
        </div>
        <div style={{ border: '1px solid var(--border)' }}>
          {STEPS.map((s, i) => (
            <div
              key={s.label}
              className="flex items-start gap-5 px-6 py-4"
              style={{ borderBottom: i < STEPS.length - 1 ? '1px solid var(--border-dim)' : undefined }}
            >
              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="mono text-[10px] w-4 text-right" style={{ color: 'var(--text-3)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <s.Icon
                  size={15}
                  weight={i === 4 ? 'fill' : 'regular'}
                  style={{ color: i === 4 ? 'var(--accent)' : 'var(--text-3)' }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold" style={{ color: 'var(--text)' }}>{s.label}</div>
                <div className="mono text-[11px] mt-0.5" style={{ color: 'var(--text-3)' }}>{s.detail}</div>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-shrink-0 self-center">
                  <div style={{ width: 1, height: 16, background: 'var(--border)', display: 'none' }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Before / After */}
      <section>
        <div className="mb-5">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Before and after</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COMPARE.map(col => (
            <div key={col.title} style={{ border: '1px solid var(--border)' }}>
              <div
                className="flex items-center gap-2 px-5 py-3"
                style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}
              >
                <col.Icon size={13} weight="fill" style={{ color: col.color }} />
                <span className="text-xs font-semibold" style={{ color: col.color }}>{col.title}</span>
              </div>
              <div>
                {col.points.map(([title, desc], i) => (
                  <div
                    key={title}
                    className="px-5 py-3 flex items-start gap-4"
                    style={{ borderBottom: i < col.points.length - 1 ? '1px solid var(--border-dim)' : undefined }}
                  >
                    <span
                      className="mono text-[11px] font-semibold flex-shrink-0 pt-px"
                      style={{ color: col.color, minWidth: 90 }}
                    >
                      {title}
                    </span>
                    <span className="mono text-[11px]" style={{ color: 'var(--text-3)' }}>{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section>
        <div className="mb-5">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Planned enhancements</h2>
        </div>
        <div style={{ border: '1px solid var(--border)' }}>
          {NEXT.map((n, i) => (
            <div
              key={n.label}
              className="flex items-start gap-6 px-5 py-3"
              style={{ borderBottom: i < NEXT.length - 1 ? '1px solid var(--border-dim)' : undefined }}
            >
              <span className="mono text-xs font-semibold flex-shrink-0" style={{ color: 'var(--text-2)', minWidth: 140 }}>
                {n.label}
              </span>
              <span className="mono text-[11px]" style={{ color: 'var(--text-3)' }}>{n.detail}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
