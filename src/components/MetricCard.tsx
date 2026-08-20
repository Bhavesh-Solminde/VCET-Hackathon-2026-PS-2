import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { ReactNode } from 'react'

interface MetricCardProps {
  icon: LucideIcon
  iconColor: string
  iconBg: string
  label: string
  value: string
  sub?: ReactNode
  accentBorder?: string
}

export default function MetricCard({
  icon: Icon,
  iconColor,
  iconBg,
  label,
  value,
  sub,
  accentBorder,
}: MetricCardProps) {
  return (
    <div
      className="relative rounded-2xl p-5 border transition-all duration-200 hover:scale-[1.01]"
      style={{
        background: 'var(--bg-card)',
        borderColor: accentBorder ?? 'var(--border)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${iconBg}`}>
          <Icon size={20} className={iconColor} />
        </div>
      </div>
      <p className="text-3xl font-bold text-white tracking-tight mb-1">{value}</p>
      <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-2">{label}</p>
      {sub && <div className="text-xs text-slate-400">{sub}</div>}
    </div>
  )
}

interface ChangeBadgeProps {
  value: number
  suffix?: string
}
export function ChangeBadge({ value, suffix = '%' }: ChangeBadgeProps) {
  const positive = value >= 0
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
        positive
          ? 'bg-emerald-500/15 text-emerald-400'
          : 'bg-red-500/15 text-red-400'
      }`}
    >
      {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
      {positive ? '+' : ''}{value}{suffix}
    </span>
  )
}
