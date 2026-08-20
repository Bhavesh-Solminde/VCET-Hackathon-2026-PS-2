export type CacheStatus = 'hot' | 'cold' | 'evicted'
export type SimMode = 'normal' | 'flash-sale' | 'idle'

export interface CacheItem {
  id: string
  key: string
  accessFrequency: number
  ttl: string
  ttlSeconds: number
  status: CacheStatus
  lastAccessed: string
  lastAccessedSeconds: number
}

export interface DashboardMetrics {
  cacheHitRatio: number
  requestsPerSec: number
  memoryUsage: number
  costSavings: number
  costSavingsChange: number
}

export interface TimePoint {
  time: string
  value: number
}

export const SIM_CONFIG: Record<SimMode, {
  requestsBase: number
  requestsVariance: number
  memoryBase: number
  hitRatioBase: number
  costSavingsBase: number
  hotBias: number
}> = {
  normal: {
    requestsBase: 8700,
    requestsVariance: 900,
    memoryBase: 68,
    hitRatioBase: 92.3,
    costSavingsBase: 12500,
    hotBias: 0,
  },
  'flash-sale': {
    requestsBase: 27800,
    requestsVariance: 3200,
    memoryBase: 87,
    hitRatioBase: 95.1,
    costSavingsBase: 38400,
    hotBias: 2,
  },
  idle: {
    requestsBase: 1300,
    requestsVariance: 300,
    memoryBase: 28,
    hitRatioBase: 84.6,
    costSavingsBase: 3200,
    hotBias: -2,
  },
}

export const BASE_CACHE_ITEMS: CacheItem[] = [
  { id: '1',  key: 'product:1234',              accessFrequency: 4821, ttl: '2h',      ttlSeconds: 7200,  status: 'hot',     lastAccessed: '2s ago',  lastAccessedSeconds: 2 },
  { id: '2',  key: 'user:session:98a2',          accessFrequency: 3102, ttl: '30m',     ttlSeconds: 1800,  status: 'hot',     lastAccessed: '5s ago',  lastAccessedSeconds: 5 },
  { id: '3',  key: 'category:electronics',       accessFrequency: 2876, ttl: '1h',      ttlSeconds: 3600,  status: 'hot',     lastAccessed: '12s ago', lastAccessedSeconds: 12 },
  { id: '4',  key: 'product:featured:homepage',  accessFrequency: 2341, ttl: '3h',      ttlSeconds: 10800, status: 'hot',     lastAccessed: '3s ago',  lastAccessedSeconds: 3 },
  { id: '5',  key: 'config:feature:flags',       accessFrequency: 1893, ttl: '1h 20m',  ttlSeconds: 4800,  status: 'hot',     lastAccessed: '8s ago',  lastAccessedSeconds: 8 },
  { id: '6',  key: 'inventory:bulk:2024',        accessFrequency: 1654, ttl: '45m',     ttlSeconds: 2700,  status: 'hot',     lastAccessed: '18s ago', lastAccessedSeconds: 18 },
  { id: '7',  key: 'user:profile:4421',          accessFrequency: 892,  ttl: '15m',     ttlSeconds: 900,   status: 'cold',    lastAccessed: '2m ago',  lastAccessedSeconds: 120 },
  { id: '8',  key: 'api:rate:limit:v2',          accessFrequency: 734,  ttl: '5m',      ttlSeconds: 300,   status: 'cold',    lastAccessed: '4m ago',  lastAccessedSeconds: 240 },
  { id: '9',  key: 'session:token:b3f9',         accessFrequency: 621,  ttl: '10m',     ttlSeconds: 600,   status: 'cold',    lastAccessed: '6m ago',  lastAccessedSeconds: 360 },
  { id: '10', key: 'product:reviews:1234',       accessFrequency: 489,  ttl: '8m',      ttlSeconds: 480,   status: 'cold',    lastAccessed: '8m ago',  lastAccessedSeconds: 480 },
  { id: '11', key: 'category:fashion',           accessFrequency: 312,  ttl: '5m',      ttlSeconds: 300,   status: 'cold',    lastAccessed: '12m ago', lastAccessedSeconds: 720 },
  { id: '12', key: 'geo:region:us-east-1',       accessFrequency: 187,  ttl: '4m',      ttlSeconds: 240,   status: 'cold',    lastAccessed: '18m ago', lastAccessedSeconds: 1080 },
  { id: '13', key: 'user:prefs:9901',            accessFrequency: 87,   ttl: 'Expired', ttlSeconds: 0,     status: 'evicted', lastAccessed: '45m ago', lastAccessedSeconds: 2700 },
  { id: '14', key: 'report:weekly:q3',           accessFrequency: 43,   ttl: 'Expired', ttlSeconds: 0,     status: 'evicted', lastAccessed: '1h ago',  lastAccessedSeconds: 3600 },
  { id: '15', key: 'tmp:export:csv:772',         accessFrequency: 12,   ttl: 'Expired', ttlSeconds: 0,     status: 'evicted', lastAccessed: '2h ago',  lastAccessedSeconds: 7200 },
  { id: '16', key: 'analytics:daily:2024-01-15', accessFrequency: 8,    ttl: 'Expired', ttlSeconds: 0,     status: 'evicted', lastAccessed: '3h ago',  lastAccessedSeconds: 10800 },
  { id: '17', key: 'search:query:legacy',        accessFrequency: 3,    ttl: 'Expired', ttlSeconds: 0,     status: 'evicted', lastAccessed: '5h ago',  lastAccessedSeconds: 18000 },
  { id: '18', key: 'tmp:session:expired:cc01',   accessFrequency: 1,    ttl: 'Expired', ttlSeconds: 0,     status: 'evicted', lastAccessed: '6h ago',  lastAccessedSeconds: 21600 },
]

export const COST_COMPARISON_DATA = [
  { day: 'Mon', static: 4200, predictive: 2100 },
  { day: 'Tue', static: 3800, predictive: 1890 },
  { day: 'Wed', static: 5100, predictive: 2320 },
  { day: 'Thu', static: 4600, predictive: 2010 },
  { day: 'Fri', static: 6200, predictive: 2680 },
  { day: 'Sat', static: 3400, predictive: 1540 },
  { day: 'Sun', static: 2900, predictive: 1280 },
]

export function generateInitialTimeSeries(baseValue: number, variance: number): TimePoint[] {
  const points: TimePoint[] = []
  const now = Date.now()
  for (let i = 59; i >= 0; i--) {
    const noise = (Math.random() - 0.5) * variance * 2
    const ts = new Date(now - i * 1500)
    points.push({
      time: ts.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      value: Math.max(100, Math.round(baseValue + noise)),
    })
  }
  return points
}

export function nextTimePoint(baseValue: number, variance: number): TimePoint {
  const noise = (Math.random() - 0.5) * variance * 2
  return {
    time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    value: Math.max(100, Math.round(baseValue + noise)),
  }
}

export function applyModeToItems(items: CacheItem[], mode: SimMode): CacheItem[] {
  const bias = SIM_CONFIG[mode].hotBias
  return items.map(item => {
    const freqMultiplier = mode === 'flash-sale' ? 3.1 : mode === 'idle' ? 0.2 : 1
    const newFreq = Math.round(item.accessFrequency * freqMultiplier * (0.9 + Math.random() * 0.2))

    let newStatus: CacheStatus = item.status
    if (mode === 'flash-sale') {
      if (item.status === 'cold' && item.accessFrequency > 400) newStatus = 'hot'
      if (item.status === 'evicted' && Math.random() > 0.7) newStatus = 'cold'
    } else if (mode === 'idle') {
      if (item.status === 'hot' && item.accessFrequency < 2000) newStatus = 'cold'
      if (item.status === 'cold' && Math.random() > 0.5) newStatus = 'evicted'
    }

    const ttl = newStatus === 'evicted' ? 'Expired'
      : newStatus === 'hot' && mode === 'flash-sale'
        ? extendTTL(item.ttl)
        : newStatus === 'hot' ? item.ttl
        : shrinkTTL(item.ttl)

    return { ...item, accessFrequency: newFreq, status: newStatus, ttl }
  })
}

function extendTTL(ttl: string): string {
  const map: Record<string, string> = { '15m': '45m', '30m': '1h', '45m': '1h 30m', '1h': '2h', '2h': '3h', '3h': '4h', '5m': '20m', '8m': '25m', '10m': '30m' }
  return map[ttl] ?? ttl
}

function shrinkTTL(ttl: string): string {
  const map: Record<string, string> = { '2h': '20m', '1h 20m': '10m', '1h': '8m', '45m': '5m', '30m': '4m', '15m': '2m', '5m': '1m', '3h': '30m', '4h': '45m' }
  return map[ttl] ?? ttl
}
