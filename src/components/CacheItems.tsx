import { useEffect, useState, useCallback } from 'react'
import { ArrowUp, ArrowDown, ArrowsDownUp, MagnifyingGlass } from '@phosphor-icons/react'
import { BASE_CACHE_ITEMS, CacheItem, CacheStatus, applyModeToItems } from '../data'
import { useSimulator } from '../context/SimulatorContext'

type SortKey = keyof Pick<CacheItem, 'key' | 'accessFrequency' | 'ttlSeconds' | 'status' | 'lastAccessedSeconds'>
type SortDir = 'asc' | 'desc'

const STATUS: Record<CacheStatus, { label: string; color: string }> = {
  hot:     { label: 'HOT', color: 'var(--red)'   },
  cold:    { label: 'CLD', color: 'var(--blue)'  },
  evicted: { label: 'EVT', color: 'var(--text-3)' },
}

function SortBtn({ col, active, dir }: { col: string; active: SortKey; dir: SortDir }) {
  if (col !== active) return <ArrowsDownUp size={11} style={{ color: 'var(--text-3)' }} />
  return dir === 'asc'
    ? <ArrowUp size={11} style={{ color: 'var(--accent)' }} />
    : <ArrowDown size={11} style={{ color: 'var(--accent)' }} />
}

export default function CacheItems() {
  const { mode } = useSimulator()
  const [items, setItems] = useState<CacheItem[]>(() => applyModeToItems(BASE_CACHE_ITEMS, mode))
  const [filter, setFilter] = useState<CacheStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('accessFrequency')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  useEffect(() => { setItems(applyModeToItems(BASE_CACHE_ITEMS, mode)) }, [mode])

  useEffect(() => {
    const id = setInterval(() => {
      setItems(prev => prev.map(item =>
        item.status === 'evicted' ? item
          : { ...item, accessFrequency: Math.max(1, item.accessFrequency + Math.round((Math.random() - 0.45) * 55)) }
      ))
    }, 2500)
    return () => clearInterval(id)
  }, [])

  const toggleSort = useCallback((key: SortKey) => {
    setSortKey(prev => {
      if (prev === key) { setSortDir(d => d === 'asc' ? 'desc' : 'asc'); return key }
      setSortDir('desc'); return key
    })
  }, [])

  const visible = items
    .filter(i => filter === 'all' || i.status === filter)
    .filter(i => !search || i.key.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const va = a[sortKey], vb = b[sortKey]
      const cmp = typeof va === 'string' ? (va as string).localeCompare(vb as string) : (va as number) - (vb as number)
      return sortDir === 'asc' ? cmp : -cmp
    })

  const counts = items.reduce((acc, i) => ({ ...acc, [i.status]: (acc[i.status] ?? 0) + 1 }), {} as Record<string, number>)

  const Th = ({ col, label }: { col: SortKey; label: string }) => (
    <th
      className="px-4 py-2.5 text-left cursor-pointer select-none"
      onClick={() => toggleSort(col)}
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <div className="flex items-center gap-1 mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>
        {label} <SortBtn col={col} active={sortKey} dir={sortDir} />
      </div>
    </th>
  )

  return (
    <div className="animate-fade-in">
      {/* Toolbar */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3"
        style={{ border: '1px solid var(--border)', borderBottom: 'none', background: 'var(--surface)' }}
      >
        <div className="flex items-center gap-1">
          {(['all', 'hot', 'cold', 'evicted'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="mono text-[10px] px-2.5 py-1 uppercase tracking-wider transition-colors"
              style={{
                color:      filter === s ? (s === 'all' ? 'var(--text)' : STATUS[s as CacheStatus]?.color ?? 'var(--text)') : 'var(--text-3)',
                background: filter === s ? 'var(--surface-2)' : 'transparent',
                border:     `1px solid ${filter === s ? 'var(--border-bright)' : 'transparent'}`,
              }}
            >
              {s === 'all' ? `all (${items.length})` : `${STATUS[s].label} (${counts[s] ?? 0})`}
            </button>
          ))}
        </div>

        <div className="relative">
          <MagnifyingGlass
            size={11}
            style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }}
          />
          <input
            type="text"
            placeholder="filter keys..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="mono text-[11px] pl-7 pr-3 py-1.5 w-48 focus:outline-none"
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ border: '1px solid var(--border)' }} className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead style={{ background: 'var(--surface)' }}>
            <tr>
              <Th col="key"                 label="Key"         />
              <Th col="accessFrequency"     label="Freq"        />
              <Th col="ttlSeconds"          label="TTL"         />
              <Th col="status"              label="Status"      />
              <Th col="lastAccessedSeconds" label="Last Access" />
            </tr>
          </thead>
          <tbody>
            {visible.map((item, i) => (
              <tr
                key={item.id}
                className="transition-colors group"
                style={{
                  borderBottom: i < visible.length - 1 ? '1px solid var(--border-dim)' : undefined,
                }}
              >
                <td className="px-4 py-2.5">
                  <span className="mono text-[11px]" style={{ color: 'var(--text-2)' }}>{item.key}</span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="mono text-[11px] tabular-nums" style={{ color: 'var(--text)' }}>
                    {item.accessFrequency.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className="mono text-[11px]"
                    style={{ color: item.status === 'evicted' ? 'var(--text-3)' : 'var(--text-2)' }}
                  >
                    {item.ttl}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span
                    className="mono text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: STATUS[item.status].color }}
                  >
                    {STATUS[item.status].label}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="mono text-[11px]" style={{ color: 'var(--text-3)' }}>
                    {item.lastAccessed}
                  </span>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center mono text-[11px]" style={{ color: 'var(--text-3)' }}>
                  no items match filter
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div
        className="px-4 py-2 mono text-[10px]"
        style={{ border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-3)' }}
      >
        {visible.length} / {items.length} keys shown - frequencies update every 2.5s
      </div>
    </div>
  )
}
