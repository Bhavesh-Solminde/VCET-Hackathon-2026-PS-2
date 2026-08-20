import { Globe, BarChart2, Clock, Trash2, Zap, AlertCircle, CheckCircle2, TrendingDown } from 'lucide-react'

const FLOW_STEPS = [
  {
    icon: Globe,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    label: 'User Traffic',
    desc: 'Read requests arrive from application layer',
  },
  {
    icon: BarChart2,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10 border-violet-500/20',
    label: 'Traffic Analysis',
    desc: 'Live read-frequency patterns analyzed continuously',
  },
  {
    icon: Clock,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
    label: 'Dynamic TTL Mutation',
    desc: 'Hot items get extended TTLs, cold items shrink',
  },
  {
    icon: Trash2,
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
    label: 'Evict Rare Items',
    desc: 'Cold data instantly evicted to free cache space',
  },
  {
    icon: Zap,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
    label: 'Optimized Cache',
    desc: 'Self-tuned cache — no manual rules needed',
  },
]

const COMPARISON = [
  {
    title: 'Before',
    icon: AlertCircle,
    iconColor: 'text-red-400',
    bg: 'bg-red-500/5',
    borderColor: 'rgba(239,68,68,0.2)',
    points: [
      { label: 'Static TTLs', detail: 'Fixed expiration rules set manually' },
      { label: 'Cache Bloat', detail: 'Everything cached indiscriminately' },
      { label: 'DB Overload', detail: 'Too little caching = repeated DB reads' },
      { label: 'Overspend', detail: 'Paying for Redis memory nobody uses' },
    ],
  },
  {
    title: 'Our Solution',
    icon: Zap,
    iconColor: 'text-blue-400',
    bg: 'bg-blue-500/5',
    borderColor: 'rgba(59,130,246,0.3)',
    points: [
      { label: 'Live Frequency Analysis', detail: 'Reads patterns every 1.5s' },
      { label: 'Dynamic TTL Extension', detail: 'Hot items auto-extended up to 4h' },
      { label: 'Instant Cold Eviction', detail: 'Rare data freed immediately' },
      { label: 'Self-Tuning Loop', detail: 'No manual config changes needed' },
    ],
    highlight: true,
  },
  {
    title: 'Result',
    icon: CheckCircle2,
    iconColor: 'text-emerald-400',
    bg: 'bg-emerald-500/5',
    borderColor: 'rgba(16,185,129,0.2)',
    points: [
      { label: '92%+ Hit Ratio', detail: 'Fewer primary DB reads' },
      { label: '40-60% Cost Cut', detail: 'Smaller, smarter cache footprint' },
      { label: 'Spike Resilience', detail: 'Traffic surges absorbed cleanly' },
      { label: 'Zero Config Drift', detail: 'Adapts automatically 24/7' },
    ],
  },
]

const ROADMAP = [
  { icon: '🧠', label: 'ML Pre-Caching', desc: 'Warm cache before expected spikes (flash sales, launches)' },
  { icon: '🌍', label: 'Multi-Region Sync', desc: 'Consistent cache across global edge nodes' },
  { icon: '🔍', label: 'Anomaly Detection', desc: 'Flag unusual access patterns in real time' },
  { icon: '💰', label: 'Cost Forecasting', desc: 'Predict monthly cloud spend from traffic trends' },
  { icon: '🔌', label: 'Pluggable Backends', desc: 'Memcached, CDN edge, DynamoDB DAX support' },
]

export default function HowItWorks() {
  return (
    <div className="animate-fade-in space-y-10">
      {/* Flow diagram */}
      <section>
        <div className="mb-6">
          <h2 className="text-base font-semibold text-white">System Flow</h2>
          <p className="text-xs text-slate-500 mt-1">How predictive caching works end-to-end</p>
        </div>
        <div
          className="rounded-2xl border p-8"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {FLOW_STEPS.map((step, i) => (
              <div key={step.label} className="flex flex-col md:flex-row items-center gap-4 flex-1 min-w-0">
                <div className="flex flex-col items-center text-center min-w-[120px]">
                  <div className={`flex items-center justify-center w-14 h-14 rounded-2xl border mb-3 ${step.bg}`}>
                    <step.icon size={24} className={step.color} />
                  </div>
                  <p className="text-xs font-semibold text-slate-200 mb-1">{step.label}</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed px-1">{step.desc}</p>
                </div>
                {i < FLOW_STEPS.length - 1 && (
                  <div className="hidden md:flex flex-col items-center flex-shrink-0 mx-2">
                    <div className="flex items-center gap-1">
                      <div className="w-6 h-px bg-slate-700" />
                      <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-slate-600" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / Solution / Result */}
      <section>
        <div className="mb-6">
          <h2 className="text-base font-semibold text-white">Before vs Solution vs Result</h2>
          <p className="text-xs text-slate-500 mt-1">The problem we solve and the outcomes we deliver</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COMPARISON.map(col => (
            <div
              key={col.title}
              className="rounded-2xl border p-6"
              style={{
                background: col.bg,
                borderColor: col.borderColor,
                boxShadow: col.highlight ? '0 0 40px rgba(59,130,246,0.08)' : undefined,
              }}
            >
              <div className="flex items-center gap-2.5 mb-5">
                <col.icon size={18} className={col.iconColor} />
                <span className="text-sm font-semibold text-white">{col.title}</span>
              </div>
              <div className="space-y-3">
                {col.points.map(pt => (
                  <div key={pt.label} className="flex items-start gap-2.5">
                    <div className="w-1 h-1 rounded-full bg-slate-600 mt-2 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-300">{pt.label}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{pt.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section>
        <div className="mb-6">
          <h2 className="text-base font-semibold text-white">What's Next</h2>
          <p className="text-xs text-slate-500 mt-1">Planned enhancements for the full product</p>
        </div>
        <div
          className="rounded-2xl border p-6"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {ROADMAP.map(item => (
              <div
                key={item.label}
                className="p-4 rounded-xl border transition-colors hover:border-blue-500/30"
                style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}
              >
                <div className="text-xl mb-2">{item.icon}</div>
                <p className="text-xs font-semibold text-slate-200 mb-1">{item.label}</p>
                <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
