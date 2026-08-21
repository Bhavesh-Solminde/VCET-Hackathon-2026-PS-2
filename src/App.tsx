import { useState } from 'react'
import { SimulatorProvider } from './context/SimulatorContext'
import Header from './components/Header'
import Toast from './components/Toast'
import Dashboard from './components/Dashboard'
import CacheItems from './components/CacheItems'
import HowItWorks from './components/HowItWorks'
import Simulator from './components/Simulator'

export type Tab = 'dashboard' | 'cache-items' | 'how-it-works' | 'simulator'

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <Toast />
      <main className="max-w-screen-xl mx-auto px-6 py-8">
        {activeTab === 'dashboard'    && <Dashboard />}
        {activeTab === 'cache-items'  && <CacheItems />}
        {activeTab === 'how-it-works' && <HowItWorks />}
        {activeTab === 'simulator'    && (
          <div className="space-y-10">
            <Simulator />
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-base font-semibold text-white whitespace-nowrap">Live Dashboard</h2>
                <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
              </div>
              <Dashboard showSimulator={false} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <SimulatorProvider>
      <AppContent />
    </SimulatorProvider>
  )
}
