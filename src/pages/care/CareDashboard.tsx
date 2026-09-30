import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Droplets, Footprints, HeartPulse, MessageCircle, Moon, Phone, Play, Settings, Sparkles } from 'lucide-react'
import { Card, CareNav, Pill, Screen, SectionHead, Spark } from '../../components/ui'
import { MaAvatar } from '../../components/brand'
import { calls, elder, insights, vitals, wellbeing } from '../../data/mock'
import { useApp } from '../../state/AppState'
import { ApprovalCard } from './CareRequests'

export default function CareDashboard() {
  const { requests, medsTaken, medicines, callTime } = useApp()
  const waiting = requests.filter((r) => r.status === 'approval')
  const top = insights[0]
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

  const timeline: { time: string; title: string; sub: string; state: 'done' | 'next' | 'later' }[] = [
    ...medicines.map((m) => ({
      time: m.time,
      title: m.en,
      sub: medsTaken.includes(m.id) ? `Taken, ${m.purposeEn.toLowerCase()}` : m.purposeEn,
      state: (medsTaken.includes(m.id) ? 'done' : 'later') as 'done' | 'later',
    })),
    { time: callTime, title: 'Daily call with Aalapon', sub: 'Tired, slept badly, asked for groceries', state: 'done' as const },
  ].sort((a, b) => a.time.localeCompare(b.time))
  const firstLater = timeline.findIndex((t) => t.state === 'later')
  if (firstLater >= 0) timeline[firstLater].state = 'next'

  return (
    <Screen className="pb-28">
      <header className="flex items-center justify-between pt-3 pb-4">
        <div>
          <p className="text-[13px] font-medium text-ink-faint">{today}</p>
          <h1 className="mt-1 text-[28px] font-semibold leading-none tracking-tight">Ma's day</h1>
        </div>
        <Link to="/care/settings" aria-label="Care plan and settings" className="press grid size-11 place-items-center rounded-full bg-card shadow-card">
          <Settings size={19} />
        </Link>
      </header>

      <section className="relative overflow-hidden rounded-[26px] bg-moss p-4 text-white shadow-float">
        <div className="flex items-center gap-3">
          <MaAvatar size={46} ring />
          <div className="flex-1 leading-tight">
            <div className="text-[16px] font-semibold">{elder.nameEn}</div>
            <div className="text-[13px] text-white/60">{elder.age}, {elder.placeEn}</div>
          </div>
          <span className="flex h-7 items-center gap-1.5 rounded-full bg-marigold px-2.5 text-[12px] font-semibold text-moss">Check in today</span>
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[52px] font-semibold leading-none tracking-tight">{wellbeing.score}</span>
              <span className="text-[14px] text-white/55">/100</span>
            </div>
            <div className="mt-1.5 text-[13px] text-white/70">Wellbeing score, down 9 this week</div>
          </div>
          <Spark values={wellbeing.scoreWeek} w={120} h={44} color="#F4A340" />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Link to="/care/call" className="press flex h-11 items-center justify-center gap-1.5 rounded-full bg-marigold text-[14px] font-semibold text-moss">
            <Phone size={16} /> Call
          </Link>
          <Link to={`/care/calls/${calls[0].id}`} className="press flex h-11 items-center justify-center gap-1.5 rounded-full bg-white/10 text-[14px] font-semibold">
            <Play size={15} /> Last call
          </Link>
          <Link to="/care/voice-note" className="press flex h-11 items-center justify-center gap-1.5 rounded-full bg-white/10 text-[14px] font-semibold">
            <MessageCircle size={16} /> Voice note
          </Link>
        </div>
      </section>

      <Link to="/care/insights" className="press mt-3 block rounded-[22px] bg-marigold-soft p-4">
        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-marigold-deep">
          <Sparkles size={14} /> Wellbeing update
          <ChevronRight size={16} className="ml-auto" />
        </div>
        <h2 className="mt-1.5 text-[18px] font-semibold leading-snug">{top.titleEn}</h2>
        <p className="mt-1 text-[14px] leading-relaxed text-ink/75">{top.bodyEn}</p>
        {top.quoteBn && (
          <div className="mt-3 flex items-center gap-2.5 rounded-2xl bg-white/70 p-2.5">
            <MaAvatar size={26} />
            <p className="bn text-[15px] leading-snug">"{top.quoteBn}"</p>
          </div>
        )}
      </Link>

      {waiting.length > 0 && (
        <>
          <SectionHead title={`Needs your OK (${waiting.length})`} action="All requests" to="/care/requests" />
          <div className="space-y-2">
            {waiting.slice(0, 1).map((r) => (
              <ApprovalCard key={r.id} r={r} />
            ))}
          </div>
        </>
      )}

      <SectionHead title="From her watch" action={vitals.syncedEn} to="/care/health" />
      <div className="grid grid-cols-2 gap-2">
        <Vital icon={<Moon size={15} />} tint="text-lilac-ink" label="Sleep" value={`${vitals.sleepHours}`} unit="h" data={vitals.sleepWeek} color="#CF523C" flag="Low" />
        <Vital icon={<Footprints size={15} />} tint="text-marigold-deep" label="Steps" value={vitals.steps.toLocaleString('en-US')} data={vitals.stepsWeek} color="#F4A340" />
        <Vital icon={<HeartPulse size={15} />} tint="text-thread" label="Heart rate" value={`${vitals.heartRate}`} unit="bpm" data={vitals.hrWeek} color="#3F6E58" />
        <Vital icon={<Droplets size={15} />} tint="text-sky-ink" label="Blood oxygen" value={`${vitals.spo2}`} unit="%" data={vitals.spo2Week} color="#2F628C" />
      </div>

      <SectionHead title="Today" action="Call history" to="/care/calls" />
      <Card className="px-4 py-3">
        {timeline.map((t, i) => (
          <div key={t.time + t.title} className="flex gap-3">
            <span className="w-11 pt-0.5 text-[13px] font-semibold tabular-nums text-ink-soft">{t.time}</span>
            <div className="flex flex-col items-center">
              <span className={`mt-1 size-3 shrink-0 rounded-full ${t.state === 'done' ? 'bg-sage' : t.state === 'next' ? 'bg-marigold ring-4 ring-marigold-soft' : 'border-2 border-line bg-white'}`} />
              {i < timeline.length - 1 && <span className="my-1 w-px flex-1 bg-line" />}
            </div>
            <div className={`flex-1 pb-3.5 ${t.state === 'later' ? 'opacity-60' : ''}`}>
              <div className="text-[15px] font-semibold leading-tight">{t.title}</div>
              <div className="mt-0.5 text-[13px] text-ink-soft">{t.state === 'next' ? `Next up, ${t.sub.toLowerCase()}` : t.sub}</div>
            </div>
          </div>
        ))}
      </Card>

      <CareNav />
    </Screen>
  )
}

function Vital({ icon, tint, label, value, unit, data, color, flag }: { icon: ReactNode; tint: string; label: string; value: string; unit?: string; data: number[]; color: string; flag?: string }) {
  return (
    <Link to="/care/health" className="press rounded-[20px] bg-card p-3.5 shadow-card">
      <div className="flex items-center justify-between">
        <span className={`flex items-center gap-1.5 text-[12.5px] font-medium ${tint}`}>
          {icon}
          <span className="text-ink-soft">{label}</span>
        </span>
        {flag && <Pill tone="alert">{flag}</Pill>}
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <div className="text-[24px] font-semibold leading-none tracking-tight">
          {value}
          {unit && <span className="ml-0.5 text-[13px] font-medium text-ink-faint">{unit}</span>}
        </div>
        <Spark values={data} w={56} h={22} color={color} fill={false} />
      </div>
    </Link>
  )
}

export function MoodDot({ mood }: { mood: number }) {
  const c = mood >= 4 ? 'bg-sage' : mood === 3 ? 'bg-marigold' : 'bg-thread'
  return <span className={`mt-1.5 size-2.5 shrink-0 rounded-full ${c}`} aria-label={`Mood ${mood} of 5`} />
}
