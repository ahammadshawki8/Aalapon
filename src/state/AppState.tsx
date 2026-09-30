import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { agents, caregivers as seedFamily, elder, medicines as seedMeds, type Medicine } from '../data/mock'

export type RequestStatus = 'done' | 'approval' | 'admin' | 'declined' | 'sent'
export type RequestSource = 'call' | 'portal' | 'family'

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

export type VoiceNote = { id: string; from: string; at: number; secs: number; dataUrl?: string; played: boolean }
export type FamilyMember = { id: string; nameEn: string; nameBn: string; relation: string; place: string; phone?: string }
export type Consent = { calls: boolean; recordings: boolean; watch: boolean; video: boolean }

type State = {
  requests: CareRequest[]
  medsTaken: string[]
  medicines: Medicine[]
  callTime: string
  elderPhone: string
  questions: string[]
  consent: Consent
  agentModes: Record<string, 'auto' | 'approve'>
  voiceNotes: VoiceNote[]
  reminders: string[]
  family: FamilyMember[]
}

type Ctx = State & {
  addRequest: (r: Omit<CareRequest, 'id' | 'at'>) => void
  setStatus: (id: string, status: RequestStatus) => void
  toggleMed: (id: string) => void
  patch: (fn: (s: State) => Partial<State>) => void
  reset: () => void
  toast: (msg: string) => void
  toastMsg: string | null
}

const KEY = 'aalapon-demo-v3'
const now = Date.now()

const seed: State = {
  medsTaken: ['m1'],
  medicines: seedMeds,
  callTime: '09:00',
  elderPhone: elder.phone,
  questions: ['Did you take your medicine?', 'How did you sleep?', 'Have you eaten lunch?', 'Any pain today?'],
  consent: { calls: true, recordings: true, watch: true, video: false },
  agentModes: Object.fromEntries(agents.map((a) => [a.id, a.autonomy])),
  voiceNotes: [],
  reminders: [],
  family: seedFamily,
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
    if (raw) return { ...seed, ...(JSON.parse(raw) as Partial<State>) }
  } catch {
    /* storage unavailable */
  }
  return seed
}

const AppCtx = createContext<Ctx | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(load)
  const [toastMsg, setToastMsg] = useState<string | null>(null)
  const toastTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* storage full or unavailable: the demo keeps working in memory */
    }
  }, [state])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY && e.newValue) {
        try {
          setState({ ...seed, ...(JSON.parse(e.newValue) as Partial<State>) })
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

  const patch = useCallback((fn: (s: State) => Partial<State>) => setState((s) => ({ ...s, ...fn(s) })), [])

  const toast = useCallback((msg: string) => {
    setToastMsg(msg)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToastMsg(null), 2800)
  }, [])

  const reset = useCallback(() => setState(seed), [])

  const value = useMemo(
    () => ({ ...state, addRequest, setStatus, toggleMed, patch, reset, toast, toastMsg }),
    [state, addRequest, setStatus, toggleMed, patch, reset, toast, toastMsg],
  )

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

export function timeAgoBn(at: number) {
  const m = Math.round((Date.now() - at) / 60000)
  if (m < 1) return 'এইমাত্র'
  if (m < 60) return `${toBn(m)} মিনিট আগে`
  const h = Math.round(m / 60)
  if (h < 24) return `${toBn(h)} ঘণ্টা আগে`
  const d = Math.round(h / 24)
  return d === 1 ? 'গতকাল' : `${toBn(d)} দিন আগে`
}

/** "14:30" -> "দুপুর ২:৩০", "09:00" -> "সকাল ৯টা" */
export function timeToBn(t: string) {
  const [hh, mm] = t.split(':').map(Number)
  const period = hh >= 4 && hh < 12 ? 'সকাল' : hh >= 12 && hh < 16 ? 'দুপুর' : hh >= 16 && hh < 18 ? 'বিকাল' : hh >= 18 && hh < 20 ? 'সন্ধ্যা' : 'রাত'
  const h12 = hh % 12 === 0 ? 12 : hh % 12
  return mm ? `${period} ${toBn(h12)}:${toBn(String(mm).padStart(2, '0'))}` : `${period} ${toBn(h12)}টা`
}

/** "14:30" -> "2:30 PM" */
export function timeToEn(t: string) {
  const [hh, mm] = t.split(':').map(Number)
  const h12 = hh % 12 === 0 ? 12 : hh % 12
  return `${h12}:${String(mm).padStart(2, '0')} ${hh < 12 ? 'AM' : 'PM'}`
}
