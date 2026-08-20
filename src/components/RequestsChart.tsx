import { useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'
import { TimePoint } from '../data'

const Tip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div
      className="px-3 py-2 mono text-xs"
      style={{ background: 'var(--surface-2)', border: '1px solid var(--border-bright)' }}
    >
      <div style={{ color: 'var(--text-3)' }}>{label}</div>
      <div style={{ color: 'var(--accent)' }}>{payload[0].value.toLocaleString()} /s</div>
    </div>
  )
}

export default function RequestsChart({ data }: { data: TimePoint[] }) {
  const pts = useMemo(() => data.slice(-40), [data])

  return (
    <div style={{ border: '1px solid var(--border)' }} className="p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-xs font-semibold" style={{ color: 'var(--text)' }}>Requests / sec</div>
          <div className="mono text-[10px] mt-0.5" style={{ color: 'var(--text-3)' }}>live stream, 1.5s interval</div>
        </div>
        <div className="flex items-center gap-1.5 mono text-[10px]" style={{ color: 'var(--text-3)' }}>
          <span className="w-1.5 h-1.5 rounded-full pulse-amber" style={{ background: 'var(--accent)' }} />
          LIVE
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={pts} margin={{ top: 2, right: 2, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="ambGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#f59e0b" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            tick={{ fill: 'var(--text-3)', fontSize: 9, fontFamily: 'JetBrains Mono' }}
            tickLine={false} axisLine={false} interval={9}
          />
          <YAxis
            tick={{ fill: 'var(--text-3)', fontSize: 9, fontFamily: 'JetBrains Mono' }}
            tickLine={false} axisLine={false}
            tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<Tip />} cursor={{ stroke: 'var(--border-bright)', strokeWidth: 1 }} />
          <Area
            type="monotone" dataKey="value"
            stroke="#f59e0b" strokeWidth={1.5}
            fill="url(#ambGrad)" dot={false}
            activeDot={{ r: 3, fill: '#f59e0b', stroke: 'var(--bg)', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
