import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type RequestStatus = 'done' | 'approval' | 'admin' | 'declined' | 'sent'
export type RequestSource = 'call' | 'portal'

export type CareRequest = {
  id: string
  kind: 'medicine' | 'food' | 'doctor' | 'family' | 'unwell' | 'bill'
  titleEn: string
  titleBn: string
  detailEn: string
  quoteBn?: string
  source: RequestSource
  status: RequestStatus
  agentEn: string
  at: number
}

type State = {
  requests: CareRequest[]
  medsTaken: string[]
}

type Ctx = State & {
  addRequest: (r: Omit<CareRequest, 'id' | 'at'>) => void
  setStatus: (id: string, status: RequestStatus) => void
  toggleMed: (id: string) => void
  reset: () => void
}

const KEY = 'aalapon-demo-v2'
const now = Date.now()

const seed: State = {
  medsTaken: ['m1'],
  requests: [
    {
      id: 'r1',
      kind: 'bill',
      titleEn: 'Pay the electricity bill',
      titleBn: 'বিদ্যুৎ বিল',
      detailEn: 'No agent can do this yet. A request to create one was sent to the Aalapon admin.',
      quoteBn: 'বিদ্যুৎ বিলটা দিয়ে দিতে পারবে?',
      source: 'call',
      status: 'admin',
      agentEn: 'New agent needed',
      at: now - 1000 * 60 * 60 * 26,
    },
    {
      id: 'r2',
      kind: 'family',
      titleEn: 'Asked Nabila to call her',
      titleBn: 'নাবিলাকে কল',
      detailEn: 'Nabila got a text and called back at 7:40 PM.',
      quoteBn: 'নাবিলার সাথে একটু কথা বলতে ইচ্ছা করছে।',
      source: 'portal',
      status: 'done',
      agentEn: 'Family contact',
      at: now - 1000 * 60 * 60 * 44,
    },
  ],
}

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as State
  } catch {
    /* storage unavailable */
  }
  return seed
}

const AppCtx = createContext<Ctx | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* storage unavailable */
    }
  }, [state])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY && e.newValue) {
        try {
          setState(JSON.parse(e.newValue) as State)
        } catch {
          /* ignore */
        }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const addRequest = useCallback((r: Omit<CareRequest, 'id' | 'at'>) => {
    setState((s) => ({
      ...s,
      requests: [{ ...r, id: `r${Date.now()}${Math.round(Math.random() * 999)}`, at: Date.now() }, ...s.requests.filter((x) => x.titleEn !== r.titleEn)],
    }))
  }, [])

  const setStatus = useCallback((id: string, status: RequestStatus) => {
    setState((s) => ({ ...s, requests: s.requests.map((r) => (r.id === id ? { ...r, status } : r)) }))
  }, [])

  const toggleMed = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      medsTaken: s.medsTaken.includes(id) ? s.medsTaken.filter((m) => m !== id) : [...s.medsTaken, id],
    }))
  }, [])

  const reset = useCallback(() => setState(seed), [])

  const value = useMemo(() => ({ ...state, addRequest, setStatus, toggleMed, reset }), [state, addRequest, setStatus, toggleMed, reset])

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppCtx)
  if (!ctx) throw new Error('useApp must be used inside AppStateProvider')
  return ctx
}

export function timeAgo(at: number) {
  const m = Math.round((Date.now() - at) / 60000)
  if (m < 1) return 'Just now'
  if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} h ago`
  const d = Math.round(h / 24)
  return d === 1 ? 'Yesterday' : `${d} days ago`
}

const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']
export function toBn(n: number | string) {
  return String(n).replace(/[0-9]/g, (d) => bnDigits[Number(d)])
}
