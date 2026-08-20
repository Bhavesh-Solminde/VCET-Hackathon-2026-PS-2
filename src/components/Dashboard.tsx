import { useEffect, useState, useRef } from 'react'
import { Waveform, ShoppingCart, Moon } from '@phosphor-icons/react'
import RequestsChart from './RequestsChart'
import CostChart from './CostChart'
import { useSimulator } from '../context/SimulatorContext'
import {
  SIM_CONFIG, SimMode, generateInitialTimeSeries, nextTimePoint, TimePoint,
} from '../data'

// ─── Scenario strip ──────────────────────────────────────────────────────────

const MODES: { id: SimMode; label: string; sub: string; Icon: any }[] = [
  { id: 'normal',      Icon: Waveform,     label: 'Normal Traffic',      sub: 'steady-state baseline' },
  { id: 'flash-sale',  Icon: ShoppingCart,  label: 'Flash Sale / Spike',  sub: 'high-load event' },
  { id: 'idle',        Icon: Moon,          label: 'Idle Period',          sub: 'off-hours, low traffic' },
]

function ScenarioStrip() {
  const { mode, activateMode } = useSimulator()

  return (
    <div style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
      <div
        className="flex items-center px-5 py-2.5"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <span className="mono text-[10px] tracking-widest uppercase" style={{ color: 'var(--text-3)' }}>
          Scenario Control
        </span>
      </div>
      <div className="grid grid-cols-3">
        {MODES.map((m, i) => {
          const active = mode === m.id
          return (
            <button
              key={m.id}
              onClick={() => activateMode(m.id)}
              className="relative flex items-center gap-3 px-5 py-4 text-left transition-colors duration-100 group"
              style={{
                background: active ? 'var(--accent-dim)' : 'transparent',
                borderRight: i < 2 ? '1px solid var(--border)' : undefined,
              }}
            >
              {active && (
                <span
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: 'var(--accent)' }}
                />
              )}
              <m.Icon
                size={16}
                weight={active ? 'fill' : 'regular'}
                style={{ color: active ? 'var(--accent)' : 'var(--text-3)', flexShrink: 0 }}
              />
              <div>
                <div
                  className="text-xs font-semibold"
                  style={{ color: active ? 'var(--accent)' : 'var(--text-2)' }}
                >
                  {m.label}
                </div>
                <div className="mono text-[10px] mt-0.5" style={{ color: 'var(--text-3)' }}>
                  {m.sub}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Live metrics ─────────────────────────────────────────────────────────────

function useLiveMetrics() {
  const { mode } = useSimulator()
  const cfg = SIM_CONFIG[mode]

  const [m, setM] = useState({
    hit: cfg.hitRatioBase,
    req: cfg.requestsBase,
    mem: cfg.memoryBase,
    sav: cfg.costSavingsBase,
    change: 18.6,
  })
  const [series, setSeries] = useState<TimePoint[]>(() =>
    generateInitialTimeSeries(cfg.requestsBase, cfg.requestsVariance)
  )
  const modeRef = useRef(mode)
  modeRef.current = mode

  useEffect(() => {
    const c = SIM_CONFIG[mode]
    setSeries(generateInitialTimeSeries(c.requestsBase, c.requestsVariance))
    setM({
      hit: c.hitRatioBase,
      req: c.requestsBase,
      mem: c.memoryBase,
      sav: c.costSavingsBase,
      change: mode === 'flash-sale' ? 31.2 : mode === 'idle' ? 8.4 : 18.6,
    })
  }, [mode])

  useEffect(() => {
    const id = setInterval(() => {
      const c = SIM_CONFIG[modeRef.current]
      setM(p => ({
        hit:    Math.max(50, Math.min(99.9, c.hitRatioBase + (Math.random() - 0.5) * 0.4)),
        req:    Math.max(100, Math.round(c.requestsBase + (Math.random() - 0.5) * c.requestsVariance)),
        mem:    Math.max(10, Math.min(99, c.memoryBase + (Math.random() - 0.5) * 3)),
        sav:    Math.round(c.costSavingsBase * (0.97 + Math.random() * 0.06)),
        change: p.change,
      }))
      setSeries(p => [...p.slice(1), nextTimePoint(c.requestsBase, c.requestsVariance)])
    }, 1500)
    return () => clearInterval(id)
  }, [])

  return { m, series }
}

// ─── Metric strip ─────────────────────────────────────────────────────────────

function MetricStrip({ m }: { m: ReturnType<typeof useLiveMetrics>['m'] }) {
  const stats = [
    {
      value: `${m.hit.toFixed(1)}%`,
      label: 'Cache Hit',
      sub: 'ratio',
      color: '#4ade80',
    },
    {
      value: m.req >= 1000 ? `${(m.req / 1000).toFixed(1)}k` : `${m.req}`,
      label: 'Requests',
      sub: 'per second',
      color: 'var(--accent)',
    },
    {
      value: `${m.mem.toFixed(0)}%`,
      label: 'Memory',
      sub: 'utilization',
      color: m.mem > 85 ? '#fb923c' : 'var(--text)',
    },
    {
      value: `$${(m.sav / 1000).toFixed(1)}k`,
      label: 'DB Savings',
      sub: `+${m.change}% vs 24h`,
      color: '#4ade80',
    },
  ]

  return (
    <div style={{ border: '1px solid var(--border)', borderTop: 'none' }}>
      <div className="grid grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="px-5 py-5"
            style={{
              borderRight: i < 3 ? '1px solid var(--border)' : undefined,
            }}
          >
            <div
              className="mono font-semibold tabular-nums"
              style={{ fontSize: '2rem', lineHeight: 1, color: s.color, letterSpacing: '-0.02em' }}
            >
              {s.value}
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="text-[11px] font-semibold" style={{ color: 'var(--text-2)' }}>
                {s.label}
              </span>
              <span className="mono text-[10px]" style={{ color: 'var(--text-3)' }}>
                {s.sub}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Memory bar ───────────────────────────────────────────────────────────────

function MemBar({ pct }: { pct: number }) {
  const color = pct > 85 ? '#fb923c' : pct > 70 ? 'var(--accent)' : '#4ade80'
  return (
    <div
      className="h-0.5 w-full"
      style={{ background: 'var(--border)' }}
    >
      <div
        className="h-full transition-all duration-700"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard({ showSimulator = true }: { showSimulator?: boolean }) {
  const { m, series } = useLiveMetrics()

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      {showSimulator && <ScenarioStrip />}
      <MetricStrip m={m} />
      <MemBar pct={m.mem} />
      <div
        className="grid grid-cols-1 lg:grid-cols-2 mt-5 gap-5"
      >
        <RequestsChart data={series} />
        <CostChart />
      </div>
    </div>
  )
}
