import type { ReactNode } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ChevronLeft, House, Inbox, Sparkles, Watch, Workflow } from 'lucide-react'
import { useApp } from '../state/AppState'
import { Mark } from './brand'

export function Screen({ children, className = '', dark = false }: { children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <div className={dark ? 'min-h-dvh bg-moss text-white' : 'min-h-dvh'}>
      <div className={`mx-auto w-full max-w-[440px] min-h-dvh px-4 pt-[max(env(safe-area-inset-top),12px)] ${className}`}>{children}</div>
    </div>
  )
}

export function BackBar({ title, to, right }: { title?: string; to?: string; right?: ReactNode }) {
  const nav = useNavigate()
  return (
    <div className="sticky top-0 z-20 -mx-4 flex h-14 items-center gap-2 bg-paper/85 px-4 backdrop-blur-md">
      <button aria-label="Back" onClick={() => (to ? nav(to) : nav(-1))} className="press -ml-1.5 grid size-11 place-items-center rounded-full text-ink hover:bg-black/5">
        <ChevronLeft size={24} />
      </button>
      {title && <h1 className="flex-1 truncate text-[17px] font-semibold">{title}</h1>}
      {right}
    </div>
  )
}

export function PageTitle({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) {
  return (
    <header className="flex items-end justify-between gap-3 pt-3 pb-4">
      <div>
        <h1 className="text-[28px] font-semibold leading-none tracking-tight">{title}</h1>
        {sub && <p className="mt-2 text-[14px] leading-snug text-ink-soft">{sub}</p>}
      </div>
      {right}
    </header>
  )
}

export function SectionHead({ title, action, to }: { title: string; action?: string; to?: string }) {
  return (
    <div className="mb-2 mt-6 flex items-baseline justify-between px-1">
      <h2 className="text-[15px] font-semibold text-ink">{title}</h2>
      {action && to && (
        <Link to={to} className="text-[13px] font-medium text-moss-3">
          {action}
        </Link>
      )}
    </div>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[22px] bg-card shadow-card ${className}`}>{children}</div>
}

/** Voice presence on the call screen: the brand mark breathing inside soft rings, with a live waveform. */
export function VoiceOrb({ size = 200, active = false, speaking = false }: { size?: number; active?: boolean; speaking?: boolean }) {
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }} aria-hidden>
      {active && (
        <>
          <span className="absolute inset-[22%] rounded-full bg-marigold/25 animate-ring" />
          <span className="absolute inset-[22%] rounded-full bg-marigold/20 animate-ring [animation-delay:1s]" />
        </>
      )}
      <span className="absolute inset-[6%] rounded-full bg-white/[0.04] ring-1 ring-white/10" />
      <span className="absolute inset-[18%] rounded-full bg-white/[0.06] ring-1 ring-white/10" />
      <div className={`relative grid place-items-center rounded-full bg-[#F6F3EA] shadow-[0_0_80px_rgba(244,163,64,0.35)] ${speaking ? 'animate-breathe' : ''}`} style={{ width: size * 0.46, height: size * 0.46 }}>
        <Mark size={size * 0.28} />
      </div>
      <div className={`absolute bottom-[4%] flex h-6 items-center gap-[3px] transition-opacity duration-300 ${speaking ? 'opacity-100' : 'opacity-0'}`}>
        {[0.2, 0.5, 0.1, 0.7, 0.3, 0.6, 0.15].map((d, i) => (
          <span key={i} className="h-full w-[3px] origin-center rounded-full bg-marigold animate-wave" style={{ animationDelay: `${d}s` }} />
        ))}
      </div>
    </div>
  )
}

const careTabs = [
  { to: '/care', label: 'Today', icon: House, end: true },
  { to: '/care/insights', label: 'Insights', icon: Sparkles },
  { to: '/care/requests', label: 'Requests', icon: Inbox },
  { to: '/care/agents', label: 'Agents', icon: Workflow },
  { to: '/care/health', label: 'Health', icon: Watch },
]

export function CareNav() {
  const { requests } = useApp()
  const pending = requests.filter((r) => r.status === 'approval').length
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line/70 bg-white/90 backdrop-blur-xl pb-safe">
      <div className="mx-auto flex max-w-[440px] px-2">
        {careTabs.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className="press flex h-[60px] flex-1 flex-col items-center justify-center gap-1">
            {({ isActive }) => (
              <>
                <span className={`relative grid h-7 w-12 place-items-center rounded-full transition-colors ${isActive ? 'bg-moss text-white' : 'text-ink-faint'}`}>
                  <Icon size={18} strokeWidth={isActive ? 2.2 : 1.9} />
                  {label === 'Requests' && pending > 0 && (
                    <span className="absolute -right-0.5 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-thread px-1 text-[10px] font-bold text-white ring-2 ring-white">{pending}</span>
                  )}
                </span>
                <span className={`text-[11px] ${isActive ? 'font-semibold text-ink' : 'font-medium text-ink-faint'}`}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export function Spark({ values, w = 72, h = 24, color = '#F4A340', fill = true }: { values: number[]; w?: number; h?: number; color?: string; fill?: boolean }) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const pts = values.map((v, i) => [(i / (values.length - 1)) * w, h - 3 - ((v - min) / span) * (h - 6)])
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
  const last = pts[pts.length - 1]
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden className="overflow-visible">
      {fill && <path d={`${d} L${w} ${h} L0 ${h} Z`} fill={color} opacity="0.14" />}
      <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="2.6" fill={color} stroke="white" strokeWidth="1.2" />
    </svg>
  )
}

export function Bars({ values, max, labels, color = '#A7C095', warnBelow, warnColor = '#CF523C', unit = '' }: { values: number[]; max: number; labels: string[]; color?: string; warnBelow?: number; warnColor?: string; unit?: string }) {
  const last = values.length - 1
  return (
    <div>
      <div className="flex h-24 items-end gap-1.5">
        {values.map((v, i) => {
          const warn = warnBelow !== undefined && v < warnBelow
          return (
            <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              {i === last && <span className="text-[11px] font-semibold text-ink">{v}{unit}</span>}
              <div className="w-full max-w-7 rounded-[7px]" style={{ height: `${Math.max(6, (v / max) * 100)}%`, background: warn ? warnColor : color, opacity: i === last ? 1 : 0.55 }} />
            </div>
          )
        })}
      </div>
      <div className="mt-1.5 flex gap-1.5">
        {labels.map((l, i) => (
          <span key={i} className={`flex-1 text-center text-[10px] ${i === last ? 'font-semibold text-ink' : 'text-ink-faint'}`}>{l}</span>
        ))}
      </div>
    </div>
  )
}

export function Pill({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'auto' | 'approve' | 'alert' | 'good' | 'dark' }) {
  const tones = {
    neutral: 'bg-paper text-ink-soft',
    auto: 'bg-mint text-moss-2',
    approve: 'bg-marigold-soft text-marigold-deep',
    alert: 'bg-thread-soft text-thread',
    good: 'bg-sage-soft text-moss-2',
    dark: 'bg-white/12 text-white',
  }
  return <span className={`inline-flex h-6 items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-[11.5px] font-semibold ${tones[tone]}`}>{children}</span>
}

export function IconDot({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`grid size-9 shrink-0 place-items-center rounded-full ${className}`}>{children}</span>
}
