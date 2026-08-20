import { useEffect, useState, useCallback } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from 'lucide-react'
import { BASE_CACHE_ITEMS, CacheItem, CacheStatus, applyModeToItems } from '../data'
import { useSimulator } from '../context/SimulatorContext'

type SortKey = keyof Pick<CacheItem, 'key' | 'accessFrequency' | 'ttlSeconds' | 'status' | 'lastAccessedSeconds'>
type SortDir = 'asc' | 'desc'

const STATUS_STYLE: Record<CacheStatus, string> = {
  hot:     'bg-red-500/15 text-red-400 border border-red-500/30',
  cold:    'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  evicted: 'bg-slate-600/20 text-slate-500 border border-slate-600/30',
}

const STATUS_DOT: Record<CacheStatus, string> = {
  hot:     'bg-red-400',
  cold:    'bg-blue-400',
  evicted: 'bg-slate-600',
}

function SortIcon({ col, active, dir }: { col: string; active: SortKey; dir: SortDir }) {
  if (col !== active) return <ChevronsUpDown size={13} className="text-slate-600" />
  return dir === 'asc'
    ? <ChevronUp size={13} className="text-blue-400" />
    : <ChevronDown size={13} className="text-blue-400" />
}

export default function CacheItems() {
  const { mode } = useSimulator()
  const [items, setItems] = useState<CacheItem[]>(() => applyModeToItems(BASE_CACHE_ITEMS, mode))
  const [filterStatus, setFilterStatus] = useState<CacheStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('accessFrequency')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  useEffect(() => {
    setItems(applyModeToItems(BASE_CACHE_ITEMS, mode))
  }, [mode])

  useEffect(() => {
    const id = setInterval(() => {
      setItems(prev =>
        prev.map(item => {
          if (item.status === 'evicted') return item
          const delta = Math.round((Math.random() - 0.45) * 60)
          return { ...item, accessFrequency: Math.max(1, item.accessFrequency + delta) }
        })
      )
    }, 2500)
    return () => clearInterval(id)
  }, [])

  const handleSort = useCallback((key: SortKey) => {
    setSortKey(prev => {
      if (prev === key) { setSortDir(d => d === 'asc' ? 'desc' : 'asc'); return key }
      setSortDir('desc')
      return key
    })
  }, [])

  const filtered = items
    .filter(i => filterStatus === 'all' || i.status === filterStatus)
    .filter(i => !search || i.key.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const va = a[sortKey], vb = b[sortKey]
      const cmp = typeof va === 'string' ? va.localeCompare(vb as string) : (va as number) - (vb as number)
      return sortDir === 'asc' ? cmp : -cmp
    })

  const counts = items.reduce((acc, i) => ({ ...acc, [i.status]: (acc[i.status] ?? 0) + 1 }), {} as Record<string, number>)

  const FilterBtn = ({ status, label }: { status: CacheStatus | 'all'; label: string }) => (
    <button
      onClick={() => setFilterStatus(status)}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        filterStatus === status
          ? status === 'all'   ? 'bg-blue-600 text-white'
          : status === 'hot'   ? 'bg-red-500/30 text-red-300 border border-red-500/50'
          : status === 'cold'  ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                               : 'bg-slate-600/40 text-slate-300 border border-slate-500/50'
          : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'
      }`}
    >
      {label}{status !== 'all' && counts[status] != null ? ` (${counts[status]})` : status === 'all' ? ` (${items.length})` : ''}
    </button>
  )

  const ColHeader = ({ col, label, className = '' }: { col: SortKey; label: string; className?: string }) => (
    <th
      className={`px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider cursor-pointer select-none hover:text-slate-300 transition-colors ${className}`}
      onClick={() => handleSort(col)}
    >
      <div className="flex items-center gap-1">
        {label}
        <SortIcon col={col} active={sortKey} dir={sortDir} />
      </div>
    </th>
  )

  return (
    <div className="animate-fade-in space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-white">Cache Item Registry</h2>
          <p className="text-xs text-slate-500 mt-0.5">Live updates every 2.5s — frequencies adjust automatically</p>
        </div>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search keys..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs rounded-lg border text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500/60 transition-colors"
            style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <FilterBtn status="all"     label="All" />
        <FilterBtn status="hot"     label="Hot" />
        <FilterBtn status="cold"    label="Cold" />
        <FilterBtn status="evicted" label="Evicted" />
      </div>

      <div
        className="rounded-2xl border overflow-hidden"
        style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(59,130,246,0.1)', background: 'rgba(255,255,255,0.02)' }}>
                <ColHeader col="key"                  label="Cache Key"         className="w-[34%]" />
                <ColHeader col="accessFrequency"      label="Freq"              className="w-[14%]" />
                <ColHeader col="ttlSeconds"           label="TTL"               className="w-[12%]" />
                <ColHeader col="status"               label="Status"            className="w-[14%]" />
                <ColHeader col="lastAccessedSeconds"  label="Last Accessed"     className="w-[16%]" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => (
                <tr
                  key={item.id}
                  className="transition-colors duration-200 hover:bg-white/[0.02]"
                  style={{
                    borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : undefined,
                  }}
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-slate-300 bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/60">
                      {item.key}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-slate-300">
                      {item.accessFrequency.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-mono text-xs ${item.status === 'evicted' ? 'text-slate-600' : 'text-slate-300'}`}>
                      {item.ttl}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full ${STATUS_STYLE[item.status]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[item.status]}`} />
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-500">{item.lastAccessed}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-600 text-sm">
                    No cache items match your filter
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
