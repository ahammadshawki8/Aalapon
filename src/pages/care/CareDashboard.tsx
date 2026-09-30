import { Link } from 'react-router-dom'
import { ChevronRight, Droplets, Footprints, HeartPulse, Moon, Phone, Settings } from 'lucide-react'
import { CareNav, Pill, Ring, Screen } from '../../components/ui'
import { calls, elder, insights, medicines, vitals, wellbeing } from '../../data/mock'
import { useApp } from '../../state/AppState'
import { ApprovalCard } from './CareRequests'

export default function CareDashboard() {
  const { requests, medsTaken } = useApp()
  const waiting = requests.filter((r) => r.status === 'approval')
  const top = insights[0]

  return (
    <Screen className="pb-28">
      <header className="flex items-center justify-between py-2">
        <div>
          <p className="text-sm text-ink-soft">Good morning,</p>
          <h1 className="text-2xl font-bold leading-tight">Tanvir</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/care/settings" aria-label="Settings" className="grid size-11 place-items-center rounded-full border border-line bg-card">
            <Settings size={20} />
          </Link>
          <Link to="/" aria-label="Switch portal" className="grid size-11 place-items-center rounded-full bg-moss text-sm font-semibold text-card">
            TA
          </Link>
        </div>
      </header>

      <section className="mt-4 rounded-4xl bg-card p-5 ring-1 ring-line">
        <div className="flex items-center gap-4">
          <Ring value={wellbeing.score}>
            <div>
              <div className="text-4xl font-bold leading-none">{wellbeing.score}</div>
              <div className="mt-1 text-[11px] text-ink-soft">wellbeing</div>
            </div>
          </Ring>
          <div className="flex-1">
            <div className="text-lg font-semibold leading-tight">{elder.shortEn}, {elder.nameEn}</div>
            <div className="text-sm text-ink-soft">{elder.age}, {elder.placeEn}</div>
            <div className="mt-2">
              <Pill tone="approve">{wellbeing.labelEn}</Pill>
            </div>
            <div className="mt-1.5 text-xs text-ink-soft">{wellbeing.trendEn}</div>
          </div>
        </div>
        <div className="stitch mt-5 text-line" />
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-ink-soft">
            Last call <span className="font-semibold text-ink">{calls[0].dayEn}, {calls[0].timeEn}</span>
          </span>
          <span className="text-ink-soft">
            Mood <span className="font-semibold text-ink">{calls[0].moodEn}</span>
          </span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <a href="tel:+8801700000000" className="flex h-12 items-center justify-center gap-2 rounded-full bg-moss font-semibold text-card active:scale-[0.98] transition">
            <Phone size={18} /> Call Ma
          </a>
          <Link to={`/care/calls/${calls[0].id}`} className="flex h-12 items-center justify-center rounded-full bg-paper font-semibold ring-1 ring-line active:scale-[0.98] transition">
            Today's call
          </Link>
        </div>
      </section>

      <Link to="/care/insights" className="mt-4 block rounded-4xl bg-marigold-soft p-5 active:scale-[0.99] transition">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-[#8a5410]">Wellbeing update</span>
          <ChevronRight size={18} className="text-[#8a5410]" />
        </div>
        <h2 className="mt-1 text-xl font-bold leading-snug">{top.titleEn}</h2>
        <p className="mt-1.5 text-[15px] leading-relaxed text-ink/80">{top.bodyEn}</p>
        {top.quoteBn && <p className="mt-3 rounded-2xl bg-card/70 px-3.5 py-2.5 text-[15px]">"{top.quoteBn}"</p>}
        <p className="mt-3 text-sm font-semibold text-moss">{top.actionEn}</p>
      </Link>

      {waiting.length > 0 && (
        <section className="mt-6">
          <div className="mb-2.5 flex items-baseline justify-between">
            <h2 className="text-lg font-semibold">Waiting for you</h2>
            <Link to="/care/requests" className="text-sm font-medium text-moss-2">All requests</Link>
          </div>
          <div className="space-y-2.5">
            {waiting.slice(0, 2).map((r) => (
              <ApprovalCard key={r.id} r={r} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-6">
        <div className="mb-2.5 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">From her watch</h2>
          <Link to="/care/health" className="text-sm font-medium text-moss-2">{vitals.syncedEn}</Link>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <Vital icon={HeartPulse} color="text-thread" bg="bg-thread-soft" label="Heart rate" value={`${vitals.heartRate}`} unit="bpm" />
          <Vital icon={Droplets} color="text-[#3b6f96]" bg="bg-sky" label="Blood oxygen" value={`${vitals.spo2}`} unit="%" />
          <Vital icon={Moon} color="text-[#6a55a3]" bg="bg-lilac" label="Sleep" value={`${vitals.sleepHours}`} unit="h" warn />
          <Vital icon={Footprints} color="text-[#9a5a14]" bg="bg-peach" label="Steps" value={vitals.steps.toLocaleString('en-US')} unit="" />
        </div>
      </section>

      <section className="mt-6">
        <h2 className="mb-2.5 text-lg font-semibold">Medicines today</h2>
        <div className="rounded-4xl bg-card p-2 ring-1 ring-line">
          {medicines.map((m, i) => {
            const taken = medsTaken.includes(m.id)
            return (
              <div key={m.id} className={`flex items-center gap-3 p-3 ${i > 0 ? 'border-t border-line' : ''}`}>
                <div className="w-12 text-sm font-semibold text-ink-soft">{m.time}</div>
                <div className="flex-1">
                  <div className="font-semibold leading-tight">{m.en}</div>
                  <div className="text-sm text-ink-soft">{m.purposeEn}</div>
                </div>
                <Pill tone={taken ? 'good' : 'neutral'}>{taken ? 'Taken' : 'Not yet'}</Pill>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-2.5 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Recent calls</h2>
          <Link to="/care/calls" className="text-sm font-medium text-moss-2">See all</Link>
        </div>
        <div className="space-y-2.5">
          {calls.slice(0, 3).map((c) => (
            <Link key={c.id} to={`/care/calls/${c.id}`} className="flex items-start gap-3 rounded-3xl bg-card p-4 ring-1 ring-line active:scale-[0.99] transition">
              <MoodDot mood={c.mood} />
              <div className="flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold">{c.dayEn}</span>
                  <span className="text-xs text-ink-soft">{c.timeEn}, {c.duration}</span>
                </div>
                <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">{c.summaryEn}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <CareNav />
    </Screen>
  )
}

function Vital({ icon: Icon, color, bg, label, value, unit, warn }: { icon: typeof Moon; color: string; bg: string; label: string; value: string; unit: string; warn?: boolean }) {
  return (
    <Link to="/care/health" className="rounded-3xl bg-card p-4 ring-1 ring-line">
      <div className="flex items-center justify-between">
        <span className={`grid size-9 place-items-center rounded-full ${bg} ${color}`}>
          <Icon size={18} />
        </span>
        {warn && <Pill tone="alert">Low</Pill>}
      </div>
      <div className="mt-3 text-[1.7rem] font-bold leading-none">
        {value}
        <span className="ml-1 text-sm font-medium text-ink-soft">{unit}</span>
      </div>
      <div className="mt-1 text-sm text-ink-soft">{label}</div>
    </Link>
  )
}

export function MoodDot({ mood }: { mood: number }) {
  const c = mood >= 4 ? 'bg-sage' : mood === 3 ? 'bg-marigold' : 'bg-thread'
  return <span className={`mt-1.5 size-3 shrink-0 rounded-full ${c}`} aria-label={`Mood ${mood} of 5`} />
}
