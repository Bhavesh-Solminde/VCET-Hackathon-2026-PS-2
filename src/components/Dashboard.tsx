import { useEffect, useState, useRef } from 'react'
import { Target, Activity, HardDrive, DollarSign, Activity as ActivityIcon, ShoppingCart, Moon } from 'lucide-react'
import MetricCard, { ChangeBadge } from './MetricCard'
import RequestsChart from './RequestsChart'
import CostChart from './CostChart'
import { useSimulator } from '../context/SimulatorContext'
import {
  SIM_CONFIG, SimMode, generateInitialTimeSeries, nextTimePoint, TimePoint,
} from '../data'

// ─── Compact simulator strip ────────────────────────────────────────────────

const SIM_MODES: {
  id: SimMode
  icon: typeof ActivityIcon
  label: string
  blurb: string
  active: { ring: string; bg: string; text: string; dot: string }
  inactive: { text: string }
}[] = [
  {
    id: 'normal',
    icon: Activity,
    label: 'Normal Traffic',
    blurb: 'Steady-state baseline — typical production load',
    active:   { ring: 'ring-blue-500/50',   bg: 'bg-blue-600/20',   text: 'text-blue-300',   dot: 'bg-blue-400' },
    inactive: { text: 'text-slate-400' },
  },
  {
    id: 'flash-sale',
    icon: ShoppingCart,
    label: 'Flash Sale / Spike',
    blurb: 'Viral traffic surge — predictive TTL extension kicks in',
    active:   { ring: 'ring-orange-500/50', bg: 'bg-orange-500/15', text: 'text-orange-300', dot: 'bg-orange-400' },
    inactive: { text: 'text-slate-400' },
  },
  {
    id: 'idle',
    icon: Moon,
    label: 'Idle Period',
    blurb: 'Off-hours mode — aggressive eviction to shrink footprint',
    active:   { ring: 'ring-slate-500/50',  bg: 'bg-slate-600/20',  text: 'text-slate-300',  dot: 'bg-slate-400' },
    inactive: { text: 'text-slate-400' },
  },
]

function SimulatorStrip() {
  const { mode, activateMode } = useSimulator()

  return (
    <div
      className="rounded-2xl border p-5"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Traffic Simulator</h2>
          <p className="text-xs text-slate-500 mt-0.5">Switch scenarios to see the engine respond in real time</p>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 border border-slate-800 px-2 py-1 rounded-md">
          Live
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {SIM_MODES.map(m => {
          const isActive = mode === m.id
          return (
            <button
              key={m.id}
              onClick={() => activateMode(m.id)}
              className={`relative flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-150
                ${isActive
                  ? `ring-1 ${m.active.ring} border-transparent`
                  : 'border-slate-800/70 hover:border-slate-700'
                }`}
              style={{
                background: 'rgba(255,255,255,0.015)',
              }}
            >
              {/* Active glow bg via inline style since Tailwind JIT won't pick dynamic class */}
              {isActive && (
                <span
                  className="absolute inset-0 rounded-xl"
                  style={{ background: m.id === 'normal' ? 'rgba(59,130,246,0.08)' : m.id === 'flash-sale' ? 'rgba(249,115,22,0.08)' : 'rgba(100,116,139,0.08)' }}
                />
              )}

              <div
                className={`relative flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg border ${
                  isActive
                    ? m.id === 'normal'     ? 'bg-blue-500/15 border-blue-500/30'
                    : m.id === 'flash-sale' ? 'bg-orange-500/15 border-orange-500/30'
                                            : 'bg-slate-600/20 border-slate-500/30'
                    : 'bg-slate-800/50 border-slate-700/50'
                }`}
              >
                <m.icon
                  size={17}
                  className={isActive
                    ? m.id === 'normal' ? 'text-blue-400' : m.id === 'flash-sale' ? 'text-orange-400' : 'text-slate-400'
                    : 'text-slate-500'}
                />
              </div>

              <div className="relative flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-xs font-semibold ${isActive ? m.active.text : 'text-slate-300'}`}>
                    {m.label}
                  </span>
                  {isActive && (
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse ${m.active.dot}`} />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{m.blurb}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Live metrics hook ───────────────────────────────────────────────────────

function useLiveMetrics() {
  const { mode } = useSimulator()
  const cfg = SIM_CONFIG[mode]

  const [metrics, setMetrics] = useState({
    hitRatio:      cfg.hitRatioBase,
    requests:      cfg.requestsBase,
    memory:        cfg.memoryBase,
    savings:       cfg.costSavingsBase,
    savingsChange: 18.6,
  })

  const [timeSeries, setTimeSeries] = useState<TimePoint[]>(() =>
    generateInitialTimeSeries(cfg.requestsBase, cfg.requestsVariance)
  )

  const modeRef = useRef(mode)
  modeRef.current = mode

  useEffect(() => {
    const c = SIM_CONFIG[mode]
    setTimeSeries(generateInitialTimeSeries(c.requestsBase, c.requestsVariance))
    setMetrics({
      hitRatio:      c.hitRatioBase,
      requests:      c.requestsBase,
      memory:        c.memoryBase,
      savings:       c.costSavingsBase,
      savingsChange: mode === 'flash-sale' ? 31.2 : mode === 'idle' ? 8.4 : 18.6,
    })
  }, [mode])

  useEffect(() => {
    const id = setInterval(() => {
      const c = SIM_CONFIG[modeRef.current]
      setMetrics(prev => ({
        hitRatio:      Math.max(50, Math.min(99.9, c.hitRatioBase + (Math.random() - 0.5) * 0.4)),
        requests:      Math.max(100, Math.round(c.requestsBase + (Math.random() - 0.5) * c.requestsVariance)),
        memory:        Math.max(10, Math.min(99, c.memoryBase + (Math.random() - 0.5) * 4)),
        savings:       Math.round(c.costSavingsBase + (Math.random() - 0.5) * c.costSavingsBase * 0.05),
        savingsChange: prev.savingsChange,
      }))
      setTimeSeries(prev => [...prev.slice(1), nextTimePoint(c.requestsBase, c.requestsVariance)])
    }, 1500)
    return () => clearInterval(id)
  }, [])

  return { metrics, timeSeries }
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export default function Dashboard({ showSimulator = true }: { showSimulator?: boolean }) {
  const { metrics, timeSeries } = useLiveMetrics()

  return (
    <div className="space-y-5 animate-fade-in">
      {/* 1. Simulator controls — pick a scenario first */}
      {showSimulator && <SimulatorStrip />}

      {/* 2. Key metrics — react immediately to mode */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Target}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
          label="Cache Hit Ratio"
          value={`${metrics.hitRatio.toFixed(1)}%`}
          accentBorder="rgba(16,185,129,0.2)"
          sub={
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-500 text-[11px]">Optimizing continuously</span>
            </div>
          }
        />
        <MetricCard
          icon={Activity}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
          label="Requests / sec"
          value={
            metrics.requests >= 1000
              ? `${(metrics.requests / 1000).toFixed(1)}k`
              : metrics.requests.toLocaleString()
          }
          accentBorder="rgba(59,130,246,0.2)"
          sub={
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-blue-500 text-[11px]">Live traffic</span>
            </div>
          }
        />
        <MetricCard
          icon={HardDrive}
          iconColor={metrics.memory > 85 ? 'text-orange-400' : 'text-violet-400'}
          iconBg={metrics.memory > 85 ? 'bg-orange-500/10' : 'bg-violet-500/10'}
          label="Memory Usage"
          value={`${metrics.memory.toFixed(0)}%`}
          sub={
            <div className="w-full mt-1">
              <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    metrics.memory > 85 ? 'bg-orange-400' : 'bg-violet-500'
                  }`}
                  style={{ width: `${metrics.memory}%` }}
                />
              </div>
            </div>
          }
        />
        <MetricCard
          icon={DollarSign}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
          label="DB Cost Savings"
          value={`$${(metrics.savings / 1000).toFixed(1)}k`}
          accentBorder="rgba(16,185,129,0.2)"
          sub={
            <div className="flex items-center gap-1.5">
              <ChangeBadge value={metrics.savingsChange} />
              <span className="text-slate-500 text-[11px]">vs last 24h</span>
            </div>
          }
        />
      </div>

      {/* 3. Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RequestsChart data={timeSeries} />
        <CostChart />
      </div>
    </div>
  )
}
