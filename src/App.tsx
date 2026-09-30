import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AppStateProvider } from './state/AppState'
import Welcome from './pages/Welcome'
import ElderHome from './pages/elder/ElderHome'
import ElderCall from './pages/elder/ElderCall'
import ElderNeed from './pages/elder/ElderNeed'
import CareDashboard from './pages/care/CareDashboard'
import CareInsights from './pages/care/CareInsights'
import CareRequests from './pages/care/CareRequests'
import CareAgents from './pages/care/CareAgents'
import CareHealth from './pages/care/CareHealth'
import CareSettings from './pages/care/CareSettings'
import { CareCallDetail, CareCalls } from './pages/care/CareCalls'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <AppStateProvider>
      <HashRouter>
        <ScrollTop />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/elder" element={<ElderHome />} />
          <Route path="/elder/call" element={<ElderCall />} />
          <Route path="/elder/need/:type" element={<ElderNeed />} />
          <Route path="/care" element={<CareDashboard />} />
          <Route path="/care/insights" element={<CareInsights />} />
          <Route path="/care/requests" element={<CareRequests />} />
          <Route path="/care/agents" element={<CareAgents />} />
          <Route path="/care/health" element={<CareHealth />} />
          <Route path="/care/settings" element={<CareSettings />} />
          <Route path="/care/calls" element={<CareCalls />} />
          <Route path="/care/calls/:id" element={<CareCallDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AppStateProvider>
  )
}
