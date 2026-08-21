import { useEffect, useState, useCallback } from 'react'
import { ArrowUp, ArrowDown, ArrowsDownUp, MagnifyingGlass } from '@phosphor-icons/react'
import { BASE_CACHE_ITEMS, CacheItem, CacheStatus, applyModeToItems } from '../data'
import { useSimulator } from '../context/SimulatorContext'

type SortKey = keyof Pick<CacheItem, 'key' | 'accessFrequency' | 'ttlSeconds' | 'status' | 'lastAccessedSeconds'>
type SortDir = 'asc' | 'desc'

const STATUS: Record<CacheStatus, { label: string; color: string; bg: string; rowBg: string }> = {
  hot:     { label: 'HOT', color: 'var(--red)',    bg: 'rgba(244,63,94,0.18)',  rowBg: 'rgba(244,63,94,0.05)' },
  cold:    { label: 'CLD', color: 'var(--blue)',   bg: 'rgba(96,165,250,0.18)', rowBg: 'rgba(96,165,250,0.04)' },
  evicted: { label: 'EVT', color: 'var(--text-3)', bg: 'rgba(60,60,80,0.20)',   rowBg: 'transparent' },
}

function SortBtn({ col, active, dir }: { col: string; active: SortKey; dir: SortDir }) {
  if (col !== active) return <ArrowsDownUp size={10} style={{ color: 'var(--text-3)', flexShrink: 0 }} />
  return dir === 'asc'
    ? <ArrowUp size={10} style={{ color: 'var(--accent)', flexShrink: 0 }} />
    : <ArrowDown size={10} style={{ color: 'var(--accent)', flexShrink: 0 }} />
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
      className="px-4 py-3 text-left cursor-pointer select-none"
      onClick={() => toggleSort(col)}
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <div className="flex items-center gap-1.5 mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-3)' }}>
        {label} <SortBtn col={col} active={sortKey} dir={sortDir} />
      </div>
    </th>
  )

  return (
    <div className="animate-fade-in space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          {(['all', 'hot', 'cold', 'evicted'] as const).map(s => {
            const isAll = s === 'all'
            const st = isAll ? null : STATUS[s]
            const active = filter === s
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className="mono text-[10px] px-3 py-1.5 font-medium uppercase tracking-wider transition-all duration-100"
                style={{
                  borderRadius: 4,
                  background: active ? (isAll ? 'var(--surface-3)' : st!.bg) : 'var(--surface-2)',
                  color:       active ? (isAll ? 'var(--text)' : st!.color) : 'var(--text-3)',
                  border:      `1px solid ${active ? (isAll ? 'var(--border-bright)' : 'transparent') : 'var(--border)'}`,
                }}
              >
                {s === 'all' ? `all · ${items.length}` : `${STATUS[s].label} · ${counts[s] ?? 0}`}
              </button>
            )
          })}
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
            className="mono text-[11px] pl-7 pr-3 py-1.5 w-48 focus:outline-none transition-colors"
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 4,
              color: 'var(--text)',
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          border: '1px solid var(--border)',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead style={{ background: 'var(--surface-2)' }}>
              <tr>
                <Th col="key"                 label="Key"         />
                <Th col="accessFrequency"     label="Frequency"   />
                <Th col="ttlSeconds"          label="TTL"         />
                <Th col="status"              label="Status"      />
                <Th col="lastAccessedSeconds" label="Last Access" />
              </tr>
            </thead>
            <tbody>
              {visible.map((item, i) => {
                const st = STATUS[item.status]
                return (
                  <tr
                    key={item.id}
                    style={{
                      background: st.rowBg,
                      borderBottom: i < visible.length - 1 ? '1px solid var(--border)' : undefined,
                    }}
                  >
                    <td className="px-4 py-2.5">
                      <span className="mono text-[11px]" style={{ color: 'var(--text-2)' }}>{item.key}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="mono text-xs tabular-nums font-medium" style={{ color: 'var(--text)' }}>
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
                        className="mono text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5"
                        style={{
                          color: st.color,
                          background: st.bg,
                          borderRadius: 3,
                        }}
                      >
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="mono text-[11px]" style={{ color: 'var(--text-3)' }}>
                        {item.lastAccessed}
                      </span>
                    </td>
                  </tr>
                )
              })}
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
          style={{
            borderTop: '1px solid var(--border)',
            background: 'var(--surface-2)',
            color: 'var(--text-3)',
          }}
        >
          {visible.length} / {items.length} keys · frequencies update every 2.5s
        </div>
      </div>
    </div>
  )
}
