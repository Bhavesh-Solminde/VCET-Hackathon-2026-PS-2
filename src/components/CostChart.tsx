import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { COST_COMPARISON_DATA } from '../data'

const Tip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  const saving = payload[0].value - payload[1].value
  const pct = Math.round((saving / payload[0].value) * 100)
  return (
    <div className="px-3 py-2 mono text-[11px]" style={{ background: 'var(--surface-2)', border: '1px solid var(--border-bright)' }}>
      <div className="mb-1.5 font-semibold" style={{ color: 'var(--text)' }}>{label}</div>
      <div className="flex justify-between gap-6 mb-0.5">
        <span style={{ color: 'var(--text-3)' }}>Static</span>
        <span style={{ color: 'var(--text-2)' }}>${payload[0].value.toLocaleString()}</span>
      </div>
      <div className="flex justify-between gap-6 mb-1">
        <span style={{ color: 'var(--accent)' }}>Predictive</span>
        <span style={{ color: 'var(--accent)' }}>${payload[1].value.toLocaleString()}</span>
      </div>
      <div className="pt-1.5" style={{ borderTop: '1px solid var(--border)', color: '#4ade80' }}>
        -{pct}% cost
      </div>
    </div>
  )
}

export default function CostChart() {
  return (
    <div style={{ border: '1px solid var(--border)' }} className="p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-xs font-semibold" style={{ color: 'var(--text)' }}>Cache Cost Comparison</div>
          <div className="mono text-[10px] mt-0.5" style={{ color: 'var(--text-3)' }}>static vs predictive, last 7 days (USD)</div>
        </div>
        <div className="flex items-center gap-4 mono text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2" style={{ background: 'var(--surface-3)' }} />
            <span style={{ color: 'var(--text-3)' }}>Static</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2" style={{ background: 'var(--accent)' }} />
            <span style={{ color: 'var(--accent)' }}>Predictive</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={COST_COMPARISON_DATA} margin={{ top: 2, right: 2, left: -18, bottom: 0 }} barGap={2} barCategoryGap="35%">
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
          <Tooltip content={<Tip />} cursor={{ fill: 'rgba(255,255,255,0.025)' }} />
          <Bar dataKey="static"     fill="var(--surface-3)" radius={[1,1,0,0]} />
          <Bar dataKey="predictive" fill="var(--accent)"    radius={[1,1,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
