import type { ReactNode } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { ArrowLeft, Bot, House, Inbox, Lightbulb, Watch } from 'lucide-react'
import { useApp } from '../state/AppState'

export function Screen({ children, className = '', tone = 'paper' }: { children: ReactNode; className?: string; tone?: 'paper' | 'moss' }) {
  return (
    <div className={tone === 'moss' ? 'bg-moss min-h-dvh' : 'min-h-dvh'}>
      <div className={`mx-auto w-full max-w-[480px] min-h-dvh px-4 pt-[max(env(safe-area-inset-top),16px)] ${className}`}>{children}</div>
    </div>
  )
}

export function BackBar({ title, to, right }: { title?: string; to?: string; right?: ReactNode }) {
  const nav = useNavigate()
  return (
    <div className="flex items-center gap-3 py-2">
      <button
        aria-label="Back"
        onClick={() => (to ? nav(to) : nav(-1))}
        className="grid size-11 place-items-center rounded-full border border-line bg-card text-ink active:scale-95 transition"
      >
        <ArrowLeft size={20} />
      </button>
      {title && <h1 className="flex-1 text-lg font-semibold">{title}</h1>}
      {right}
    </div>
  )
}

/** Signature element: concentric running-stitch rings, like a nakshi kantha motif. */
export function StitchOrb({ size = 220, active = false, speaking = false }: { size?: number; active?: boolean; speaking?: boolean }) {
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }} aria-hidden>
      {active && (
        <>
          <span className="absolute inset-[18%] rounded-full bg-marigold/40 animate-ring" />
          <span className="absolute inset-[18%] rounded-full bg-marigold/30 animate-ring [animation-delay:0.8s]" />
        </>
      )}
      <svg viewBox="0 0 200 200" className={`absolute inset-0 ${active ? 'animate-spin-slow' : ''}`}>
        <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="6 7" strokeLinecap="round" />
        <circle cx="100" cy="100" r="78" fill="none" stroke="#F2A33A" strokeWidth="2.5" strokeDasharray="10 8" strokeLinecap="round" />
        <circle cx="100" cy="100" r="62" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="3 6" strokeLinecap="round" />
      </svg>
      <div
        className={`relative rounded-full bg-marigold shadow-[0_0_60px_rgba(242,163,58,0.55)] transition-transform duration-300 ${speaking ? 'animate-breathe' : ''}`}
        style={{ width: size * 0.42, height: size * 0.42 }}
      >
        <svg viewBox="0 0 100 100" className="absolute inset-0 text-moss">
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="2.5" strokeDasharray="4 5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <svg viewBox="0 0 64 64" className="size-9" aria-hidden>
        <rect width="64" height="64" rx="18" fill={light ? '#FBFBF6' : '#1F3A2E'} />
        <circle cx="32" cy="32" r="18" fill="none" stroke="#F2A33A" strokeWidth="3" strokeDasharray="5 4" strokeLinecap="round" />
        <circle cx="32" cy="32" r="9" fill="#F2A33A" />
      </svg>
      <div className="leading-none">
        <div className={`text-xl font-bold ${light ? 'text-card' : 'text-moss'}`}>আলাপন</div>
        <div className={`text-[11px] font-medium ${light ? 'text-card/70' : 'text-ink-soft'}`}>Aalapon</div>
      </div>
    </div>
  )
}

const careTabs = [
  { to: '/care', label: 'Home', icon: House, end: true },
  { to: '/care/insights', label: 'Insights', icon: Lightbulb },
  { to: '/care/requests', label: 'Requests', icon: Inbox },
  { to: '/care/agents', label: 'Agents', icon: Bot },
  { to: '/care/health', label: 'Health', icon: Watch },
]

export function CareNav() {
  const { requests } = useApp()
  const pending = requests.filter((r) => r.status === 'approval').length
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 pb-safe">
      <div className="mx-auto max-w-[480px] px-4 pb-3">
        <div className="flex items-center justify-between rounded-full bg-card/95 p-1.5 shadow-[0_10px_30px_-10px_rgba(31,58,46,0.35)] ring-1 ring-line backdrop-blur">
          {careTabs.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `relative flex h-12 flex-1 items-center justify-center gap-1.5 rounded-full text-sm font-medium transition ${
                  isActive ? 'bg-moss text-card flex-[1.6]' : 'text-ink-soft'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} strokeWidth={2} />
                  {isActive && <span>{label}</span>}
                  {!isActive && <span className="sr-only">{label}</span>}
                  {label === 'Requests' && pending > 0 && (
                    <span className="absolute right-2 top-1.5 grid size-5 place-items-center rounded-full bg-thread text-[11px] font-semibold text-card">{pending}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}

export function Bars({ values, max, highlight, labels, color = 'bg-sage', warnBelow }: { values: number[]; max: number; highlight?: number; labels?: string[]; color?: string; warnBelow?: number }) {
  return (
    <div>
      <div className="flex h-28 items-end gap-2">
        {values.map((v, i) => {
          const warn = warnBelow !== undefined && v < warnBelow
          return (
            <div key={i} className="flex flex-1 flex-col items-center justify-end gap-1 h-full">
              <span className={`text-[11px] ${i === highlight ? 'font-semibold text-ink' : 'text-ink-soft'}`}>{v}</span>
              <div
                className={`w-full rounded-full ${warn ? 'bg-thread/80' : color} ${i === highlight ? 'ring-2 ring-moss ring-offset-2 ring-offset-card' : ''}`}
                style={{ height: `${Math.max(8, (v / max) * 100)}%` }}
              />
            </div>
          )
        })}
      </div>
      {labels && (
        <div className="mt-2 flex gap-2">
          {labels.map((l, i) => (
            <span key={i} className="flex-1 text-center text-[11px] text-ink-soft">{l}</span>
          ))}
        </div>
      )}
    </div>
  )
}

export function Ring({ value, size = 132, stroke = 12, children }: { value: number; size?: number; stroke?: number; children?: ReactNode }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#DFE8D3" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#F2A33A"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${(value / 100) * c} ${c}`}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  )
}

export function Pill({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'auto' | 'approve' | 'alert' | 'good' }) {
  const tones = {
    neutral: 'bg-paper text-ink-soft',
    auto: 'bg-mint text-moss',
    approve: 'bg-marigold-soft text-[#8a5410]',
    alert: 'bg-thread-soft text-thread',
    good: 'bg-sage-soft text-moss',
  }
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>{children}</span>
}
