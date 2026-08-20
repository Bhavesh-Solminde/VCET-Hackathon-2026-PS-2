import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import { COST_COMPARISON_DATA } from '../data'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div
      className="px-3 py-2 rounded-lg border text-xs"
      style={{ background: '#0a1628', borderColor: 'rgba(59,130,246,0.3)' }}
    >
      <p className="text-slate-400 mb-2 font-medium">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center justify-between gap-4 mb-1">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm" style={{ background: p.fill }} />
            <span className="text-slate-400">{p.name}</span>
          </span>
          <span className="font-semibold font-mono" style={{ color: p.fill }}>
            ${p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  )
}

const CustomLegend = ({ payload }: any) => (
  <div className="flex items-center justify-center gap-6 mt-3">
    {payload?.map((entry: any) => (
      <div key={entry.value} className="flex items-center gap-2">
        <span className="w-3 h-2.5 rounded-sm" style={{ background: entry.color }} />
        <span className="text-xs text-slate-400">{entry.value}</span>
      </div>
    ))}
  </div>
)

export default function CostChart() {
  return (
    <div
      className="rounded-2xl border p-6"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
    >
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-white">Cache Cost Comparison</h3>
        <p className="text-xs text-slate-500 mt-0.5">Static vs Predictive caching — last 7 days (USD/day)</p>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={COST_COMPARISON_DATA} margin={{ top: 4, right: 4, left: -10, bottom: 0 }} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: '#64748b', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Legend content={<CustomLegend />} />
          <Bar dataKey="static"     name="Static Caching"     fill="#374151" radius={[4,4,0,0]} />
          <Bar dataKey="predictive" name="Predictive Caching" fill="#10b981" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
