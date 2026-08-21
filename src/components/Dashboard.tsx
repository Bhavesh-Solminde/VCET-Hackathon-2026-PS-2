import { useEffect, useState, useRef } from 'react'
import { Waveform, ShoppingCart, Moon, ArrowUp } from '@phosphor-icons/react'
import RequestsChart from './RequestsChart'
import CostChart from './CostChart'
import { useSimulator } from '../context/SimulatorContext'
import {
  SIM_CONFIG, SimMode, generateInitialTimeSeries, nextTimePoint, TimePoint,
} from '../data'

// ─── Scenario strip ──────────────────────────────────────────────────────────

const MODES: {
  id: SimMode
  label: string
  sub: string
  detail: string
  Icon: any
  color: string
  dim: string
  border: string
}[] = [
  {
    id: 'normal',
    Icon: Waveform,
    label: 'Normal Traffic',
    sub: 'Steady-state',
    detail: '~8.7k req/s',
    color: 'var(--accent)',
    dim: 'var(--accent-dim)',
    border: 'rgba(129,140,248,0.40)',
  },
  {
    id: 'flash-sale',
    Icon: ShoppingCart,
    label: 'Flash Sale',
    sub: '3x traffic spike',
    detail: '~27.8k req/s',
    color: 'var(--orange)',
    dim: 'var(--orange-dim)',
    border: 'rgba(249,115,22,0.40)',
  },
  {
    id: 'idle',
    Icon: Moon,
    label: 'Idle Period',
    sub: 'Off-hours',
    detail: '~1.3k req/s',
    color: 'var(--blue)',
    dim: 'var(--blue-dim)',
    border: 'rgba(96,165,250,0.40)',
  },
]

function ScenarioStrip() {
  const { mode, activateMode } = useSimulator()

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold" style={{ color: 'var(--text-2)' }}>Scenario Control</span>
        <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {MODES.map(m => {
          const active = mode === m.id
          return (
            <button
              key={m.id}
              onClick={() => activateMode(m.id)}
              className="relative flex items-start gap-3 p-4 text-left transition-all duration-150"
              style={{
                background:   active ? m.dim : 'var(--surface-2)',
                border:       `1px solid ${active ? m.border : 'var(--border)'}`,
                borderRadius: 8,
                boxShadow:    active ? `0 0 0 1px ${m.border}` : 'none',
              }}
            >
              {active && (
                <span
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: m.color, borderRadius: '8px 8px 0 0' }}
                />
              )}
              <div
                className="flex items-center justify-center w-8 h-8 flex-shrink-0 mt-0.5"
                style={{
                  background: active ? m.dim : 'var(--surface-3)',
                  border: `1px solid ${active ? m.border : 'var(--border)'}`,
                  borderRadius: 6,
                }}
              >
                <m.Icon
                  size={15}
                  weight={active ? 'fill' : 'regular'}
                  style={{ color: active ? m.color : 'var(--text-3)' }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold" style={{ color: active ? m.color : 'var(--text)' }}>
                  {m.label}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-3)' }}>{m.sub}</div>
                <div
                  className="mono text-[10px] mt-2 font-medium"
                  style={{ color: active ? m.color : 'var(--text-3)' }}
                >
                  {m.detail}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// $0.000018 per avoided DB query — calibrated so normal mode (8700 req/s × 92.3%) ≈ $12.5k/day
const COST_PER_QUERY = 1.8e-5

function deriveSavings(req: number, hit: number): number {
  return Math.round(req * (hit / 100) * COST_PER_QUERY * 86400)
}

// ─── Live metrics hook ────────────────────────────────────────────────────────

function useLiveMetrics() {
  const { mode } = useSimulator()
  const cfg = SIM_CONFIG[mode]

  const [m, setM] = useState({
    hit: cfg.hitRatioBase,
    req: cfg.requestsBase,
    mem: cfg.memoryBase,
    sav: deriveSavings(cfg.requestsBase, cfg.hitRatioBase),
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
      hit:    c.hitRatioBase,
      req:    c.requestsBase,
      mem:    c.memoryBase,
      sav:    deriveSavings(c.requestsBase, c.hitRatioBase),
      change: mode === 'flash-sale' ? 31.2 : mode === 'idle' ? 8.4 : 18.6,
    })
  }, [mode])

  useEffect(() => {
    const id = setInterval(() => {
      const c = SIM_CONFIG[modeRef.current]
      const newHit = Math.max(50, Math.min(99.9, c.hitRatioBase + (Math.random() - 0.5) * 0.4))
      const newReq = Math.max(100, Math.round(c.requestsBase + (Math.random() - 0.5) * c.requestsVariance))
      setM(p => ({
        hit:    newHit,
        req:    newReq,
        mem:    Math.max(10, Math.min(99, c.memoryBase + (Math.random() - 0.5) * 3)),
        sav:    deriveSavings(newReq, newHit),
        change: p.change,
      }))
      setSeries(p => [...p.slice(1), nextTimePoint(c.requestsBase, c.requestsVariance)])
    }, 1500)
    return () => clearInterval(id)
  }, [])

  return { m, series }
}

// ─── Metric cards ─────────────────────────────────────────────────────────────

function MetricCards({ m }: { m: ReturnType<typeof useLiveMetrics>['m'] }) {
  const memColor = m.mem > 85 ? 'var(--red)' : m.mem > 70 ? 'var(--orange)' : 'var(--text-2)'

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold" style={{ color: 'var(--text-2)' }}>Live Metrics</span>
        <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full pulse-live" style={{ background: 'var(--accent)', flexShrink: 0 }} />
          <span className="mono text-[9px]" style={{ color: 'var(--text-3)' }}>1.5s</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
        {/* Featured: Cache Hit Ratio */}
        <div
          className="relative overflow-hidden px-5 py-5"
          style={{
            background: 'var(--accent-dim)',
            border: '1px solid rgba(129,140,248,0.22)',
            borderRadius: 10,
          }}
        >
          <span className="absolute inset-x-0 top-0 h-[2px]" style={{ background: 'var(--accent)' }} />
          <div
            className="mono font-bold tabular-nums"
            style={{ fontSize: '3rem', lineHeight: 1, color: 'var(--accent)', letterSpacing: '-0.03em' }}
          >
            {m.hit.toFixed(1)}%
          </div>
          <div className="mt-3">
            <div className="text-xs font-semibold" style={{ color: 'var(--text)' }}>Cache Hit Ratio</div>
            <div className="mono text-[10px] mt-0.5" style={{ color: 'var(--text-3)' }}>primary performance indicator</div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <ArrowUp size={9} weight="bold" style={{ color: 'var(--accent)' }} />
            <span className="mono text-[10px] font-semibold" style={{ color: 'var(--accent)' }}>
              {m.change.toFixed(1)}% vs static TTL
            </span>
          </div>
        </div>

        {/* Requests/sec */}
        <div
          className="px-5 py-5"
          style={{
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 10,
          }}
        >
          <div
            className="mono font-bold tabular-nums"
            style={{ fontSize: '2.5rem', lineHeight: 1, color: 'var(--text)', letterSpacing: '-0.03em' }}
          >
            {m.req >= 1000 ? `${(m.req / 1000).toFixed(1)}k` : `${m.req}`}
          </div>
          <div className="mt-3">
            <div className="text-xs font-semibold" style={{ color: 'var(--text-2)' }}>Requests / sec</div>
            <div className="mono text-[10px] mt-0.5" style={{ color: 'var(--text-3)' }}>inbound request rate</div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <span className="w-1.5 h-1.5 rounded-full pulse-live" style={{ background: 'var(--accent)', flexShrink: 0 }} />
            <span className="mono text-[10px]" style={{ color: 'var(--text-3)' }}>live stream</span>
          </div>
        </div>

        {/* Memory */}
        <div
          className="px-5 py-5"
          style={{
            background: m.mem > 85 ? 'var(--red-dim)' : 'var(--surface-2)',
            border: `1px solid ${m.mem > 85 ? 'rgba(248,113,113,0.22)' : 'var(--border)'}`,
            borderRadius: 10,
          }}
        >
          <div
            className="mono font-bold tabular-nums"
            style={{ fontSize: '2.5rem', lineHeight: 1, color: memColor, letterSpacing: '-0.03em' }}
          >
            {m.mem.toFixed(0)}%
          </div>
          <div className="mt-3">
            <div className="text-xs font-semibold" style={{ color: 'var(--text-2)' }}>Memory Utilization</div>
            <div className="mono text-[10px] mt-0.5" style={{ color: 'var(--text-3)' }}>cache pool usage</div>
          </div>
          <div className="mono text-[10px] mt-2 font-medium" style={{ color: memColor }}>
            {m.mem > 85 ? '⚠ eviction pressure' : m.mem > 70 ? '~ approaching threshold' : '✓ healthy'}
          </div>
        </div>
      </div>

      {/* DB Savings — derived from the other two numbers, formula shown */}
      <div
        className="px-5 py-4 flex items-center justify-between gap-4"
        style={{
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          borderRadius: 10,
        }}
      >
        <div className="min-w-0">
          <div className="mono text-[10px] uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-3)' }}>
            DB Savings / Day
          </div>
          <div className="mono text-[11px]" style={{ color: 'var(--text-3)' }}>
            {m.req >= 1000 ? `${(m.req / 1000).toFixed(1)}k` : m.req}&nbsp;req/s
            &nbsp;×&nbsp;{m.hit.toFixed(1)}%&nbsp;hit
            &nbsp;×&nbsp;$0.000018/query
            &nbsp;×&nbsp;86,400&nbsp;s
          </div>
        </div>
        <div
          className="mono font-bold tabular-nums flex-shrink-0"
          style={{ fontSize: '2rem', letterSpacing: '-0.03em', color: 'var(--accent)' }}
        >
          ${(m.sav / 1000).toFixed(1)}k
        </div>
      </div>
    </div>
  )
}

// ─── Memory bar ───────────────────────────────────────────────────────────────

function MemBar({ pct }: { pct: number }) {
  const color = pct > 85 ? 'var(--red)' : pct > 70 ? 'var(--orange)' : 'var(--accent)'
  return (
    <div className="h-1 w-full" style={{ background: 'var(--border)', borderRadius: 2 }}>
      <div
        className="h-full transition-all duration-700"
        style={{ width: `${pct}%`, background: color, borderRadius: 2 }}
      />
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard({ showSimulator = true }: { showSimulator?: boolean }) {
  const { m, series } = useLiveMetrics()

  return (
    <div className="animate-fade-in space-y-6">
      {showSimulator && <ScenarioStrip />}
      <MetricCards m={m} />
      <MemBar pct={m.mem} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RequestsChart data={series} />
        <CostChart />
      </div>
    </div>
  )
}
