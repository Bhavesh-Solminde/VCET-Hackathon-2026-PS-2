import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'
import { COST_COMPARISON_DATA } from '../data'

const Tip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  const saving = payload[0].value - payload[1].value
  const pct = Math.round((saving / payload[0].value) * 100)
  return (
    <div
      className="px-3 py-2.5 mono text-[11px]"
      style={{
        background: 'var(--surface-3)',
        border: '1px solid var(--border-bright)',
        borderRadius: 6,
      }}
    >
      <div className="mb-2 font-semibold text-xs" style={{ color: 'var(--text)' }}>{label}</div>
      <div className="flex justify-between gap-5 mb-1">
        <span style={{ color: 'var(--text-3)' }}>Static</span>
        <span style={{ color: 'var(--text-2)' }}>${payload[0].value.toLocaleString()}</span>
      </div>
      <div className="flex justify-between gap-5 mb-2">
        <span style={{ color: 'var(--accent)' }}>Predictive</span>
        <span style={{ color: 'var(--accent)' }}>${payload[1].value.toLocaleString()}</span>
      </div>
      <div className="pt-2" style={{ borderTop: '1px solid var(--border)', color: 'var(--accent)' }}>
        -{pct}% cost reduction
      </div>
    </div>
  )
}

export default function CostChart() {
  return (
    <div
      className="p-5"
      style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--border)',
        borderRadius: 8,
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Cache Cost</div>
          <div className="mono text-[10px] mt-0.5" style={{ color: 'var(--text-3)' }}>static vs predictive, last 7 days (USD)</div>
        </div>
        <div className="flex items-center gap-4 mono text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2" style={{ background: 'rgba(244,63,94,0.35)', borderRadius: 1 }} />
            <span style={{ color: 'var(--text-3)' }}>Static</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2" style={{ background: 'var(--accent)', borderRadius: 1 }} />
            <span style={{ color: 'var(--accent)' }}>Predictive</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={COST_COMPARISON_DATA} margin={{ top: 4, right: 2, left: -18, bottom: 0 }} barGap={2} barCategoryGap="32%">
          <XAxis
            dataKey="day"
            tick={{ fill: 'var(--text-3)', fontSize: 9, fontFamily: 'JetBrains Mono' }}
            tickLine={false} axisLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--text-3)', fontSize: 9, fontFamily: 'JetBrains Mono' }}
            tickLine={false} axisLine={false}
            tickFormatter={v => `$${v / 1000}k`}
          />
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
          <Bar dataKey="static"     fill="rgba(244,63,94,0.28)" radius={[2,2,0,0]} />
          <Bar dataKey="predictive" fill="var(--accent)"        radius={[2,2,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
