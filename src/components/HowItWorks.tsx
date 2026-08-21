import { Globe, ChartBar, Timer, Trash, Lightning, Warning, CheckCircle } from '@phosphor-icons/react'

const STEPS = [
  { Icon: Globe,     label: 'Read request arrives',          detail: 'App layer routes reads through the caching layer first, bypassing the DB.' },
  { Icon: ChartBar,  label: 'Frequency analysis runs',       detail: 'Live access patterns sampled per key every 1.5 seconds.' },
  { Icon: Timer,     label: 'TTL mutated dynamically',       detail: 'Hot keys get extended TTLs. Cold keys get shortened — freeing memory.' },
  { Icon: Trash,     label: 'Cold data evicted immediately', detail: 'Rarely-read keys are flushed to shrink Redis footprint.' },
  { Icon: Lightning, label: 'Cache serves the result',       detail: 'Next read hits cache. DB load drops. Cost falls.' },
]

const COMPARE = [
  {
    title: 'Without PCE',
    Icon: Warning,
    color: 'var(--red)',
    border: 'rgba(244,63,94,0.25)',
    bg: 'var(--red-dim)',
    points: [
      ['Static TTLs', 'fixed expiration, set once and never adjusted'],
      ['Cache bloat', 'everything cached regardless of access patterns'],
      ['DB overload', 'conservative caching floods the primary DB'],
      ['Predictable overspend', 'paying for Redis memory nobody uses'],
    ],
  },
  {
    title: 'With PCE',
    Icon: CheckCircle,
    color: 'var(--accent)',
    border: 'rgba(129,140,248,0.25)',
    bg: 'var(--accent-dim)',
    points: [
      ['Dynamic TTLs', 'extended for hot keys, shortened for cold ones'],
      ['Selective caching', 'only frequently-read data stays in memory'],
      ['DB protection', '92%+ hit ratio keeps primary DB load minimal'],
      ['Right-sized cost', 'smaller footprint, significantly lower monthly bill'],
    ],
  },
]

const NEXT = [
  { label: 'ML Pre-Caching',    detail: 'Warm cache before predicted spikes using historical patterns' },
  { label: 'Multi-Region Sync', detail: 'Consistent hot-key set across global edge nodes' },
  { label: 'Anomaly Detection', detail: 'Flag unusual access patterns before they cause incidents' },
  { label: 'Cost Forecasting',  detail: 'Predict monthly Redis spend from live traffic trends' },
  { label: 'Backend Plugins',   detail: 'Memcached, CDN edge, DynamoDB DAX — swap the backend' },
]

export default function HowItWorks() {
  return (
    <div className="animate-fade-in space-y-10">

      {/* Flow */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Request flow</h2>
          <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
        </div>
        <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          {STEPS.map((s, i) => (
            <div
              key={s.label}
              className="flex items-start gap-5 px-6 py-4"
              style={{
                borderBottom: i < STEPS.length - 1 ? '1px solid var(--border)' : undefined,
                background: i === 4 ? 'var(--accent-dim)' : 'var(--surface-2)',
              }}
            >
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="mono text-[10px] w-4 text-right tabular-nums" style={{ color: 'var(--text-3)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div
                  className="flex items-center justify-center w-7 h-7"
                  style={{
                    background: i === 4 ? 'var(--accent-dim)' : 'var(--surface-3)',
                    border: `1px solid ${i === 4 ? 'rgba(129,140,248,0.35)' : 'var(--border)'}`,
                    borderRadius: 6,
                  }}
                >
                  <s.Icon
                    size={13}
                    weight={i === 4 ? 'fill' : 'regular'}
                    style={{ color: i === 4 ? 'var(--accent)' : 'var(--text-3)' }}
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className="text-xs font-semibold"
                  style={{ color: i === 4 ? 'var(--accent)' : 'var(--text)' }}
                >
                  {s.label}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>{s.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Before / After */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Before and after</h2>
          <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COMPARE.map(col => (
            <div
              key={col.title}
              style={{
                border: `1px solid ${col.border}`,
                background: col.bg,
                borderRadius: 8,
                overflow: 'hidden',
              }}
            >
              <div
                className="flex items-center gap-2 px-5 py-3"
                style={{ borderBottom: `1px solid ${col.border}` }}
              >
                <col.Icon size={13} weight="fill" style={{ color: col.color }} />
                <span className="text-xs font-semibold" style={{ color: col.color }}>{col.title}</span>
              </div>
              <div>
                {col.points.map(([title, desc], i) => (
                  <div
                    key={title}
                    className="px-5 py-3 flex items-start gap-4"
                    style={{ borderBottom: i < col.points.length - 1 ? `1px solid ${col.border}` : undefined }}
                  >
                    <span
                      className="text-xs font-semibold flex-shrink-0"
                      style={{ color: col.color, minWidth: 110 }}
                    >
                      {title}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-3)' }}>{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Planned enhancements</h2>
          <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
        </div>
        <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          {NEXT.map((n, i) => (
            <div
              key={n.label}
              className="flex items-start gap-6 px-5 py-3"
              style={{
                borderBottom: i < NEXT.length - 1 ? '1px solid var(--border)' : undefined,
                background: 'var(--surface-2)',
              }}
            >
              <span
                className="text-xs font-semibold flex-shrink-0"
                style={{ color: 'var(--accent)', minWidth: 140 }}
              >
                {n.label}
              </span>
              <span className="text-xs" style={{ color: 'var(--text-3)' }}>{n.detail}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
