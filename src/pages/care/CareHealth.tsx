import type { ReactNode } from 'react'
import { Droplets, Footprints, HeartPulse, Info, Moon, Watch } from 'lucide-react'
import { Bars, CareNav, Pill, Screen } from '../../components/ui'
import { vitals } from '../../data/mock'

export default function CareHealth() {
  return (
    <Screen className="pb-28">
      <header className="py-2">
        <h1 className="text-2xl font-bold">Health</h1>
        <p className="text-sm text-ink-soft">From Ma's smartwatch. Aalapon also asks about these on her calls.</p>
      </header>

      <section className="mt-3 flex items-center gap-3 rounded-3xl bg-card p-4 ring-1 ring-line">
        <span className="grid size-11 place-items-center rounded-full bg-moss text-marigold">
          <Watch size={20} />
        </span>
        <div className="flex-1">
          <div className="font-semibold leading-tight">Ma's watch</div>
          <div className="text-sm text-ink-soft">Connected via Health Connect, {vitals.syncedEn.toLowerCase()}</div>
        </div>
        <Pill tone="good">Consent on</Pill>
      </section>

      <Metric icon={Moon} tint="bg-lilac text-[#6a55a3]" period="Sleep, last night" value={`${vitals.sleepHours} h`} note="Under 5 hours on 3 of the last 4 nights" alert>
        <Bars values={vitals.sleepWeek} max={9} labels={vitals.weekLabels} highlight={6} warnBelow={5} color="bg-[#b8a6e0]" />
      </Metric>

      <Metric icon={Footprints} tint="bg-peach text-[#9a5a14]" period="Steps, today" value={vitals.steps.toLocaleString('en-US')} note="Down 40% from last week, she mentioned knee pain">
        <Bars values={vitals.stepsWeek.map((s) => Math.round(s / 100) / 10)} max={4} labels={vitals.weekLabels} highlight={6} color="bg-[#f3b27d]" />
        <p className="mt-2 text-xs text-ink-soft">Thousands of steps per day</p>
      </Metric>

      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <Small icon={HeartPulse} tint="bg-thread-soft text-thread" title="Resting heart rate" value={`${vitals.restingHr}`} unit="bpm" note="Normal for her" />
        <Small icon={Droplets} tint="bg-sky text-[#3b6f96]" title="Blood oxygen" value={`${vitals.spo2}`} unit="%" note="Alert if under 92%" />
      </div>

      <p className="mt-5 flex gap-2 rounded-3xl bg-card/60 p-4 text-xs leading-relaxed text-ink-soft ring-1 ring-line">
        <Info size={16} className="mt-0.5 shrink-0" />
        Watch readings help you notice changes early. They are not a diagnosis. Ma can turn off any reading at any time.
      </p>
      <CareNav />
    </Screen>
  )
}

function Metric({ icon: Icon, tint, period, value, note, alert, children }: { icon: typeof Moon; tint: string; period: string; value: string; note: string; alert?: boolean; children: ReactNode }) {
  return (
    <section className="mt-3 rounded-4xl bg-card p-5 ring-1 ring-line">
      <div className="flex items-center gap-3">
        <span className={`grid size-10 place-items-center rounded-full ${tint}`}>
          <Icon size={20} />
        </span>
        <div className="flex-1">
          <div className="text-sm text-ink-soft">{period}</div>
          <div className="text-2xl font-bold leading-tight">{value}</div>
        </div>
        {alert && <Pill tone="alert">Low</Pill>}
      </div>
      <p className="mt-2 text-sm text-ink/80">{note}</p>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function Small({ icon: Icon, tint, title, value, unit, note }: { icon: typeof Moon; tint: string; title: string; value: string; unit: string; note: string }) {
  return (
    <div className="rounded-3xl bg-card p-4 ring-1 ring-line">
      <span className={`grid size-9 place-items-center rounded-full ${tint}`}>
        <Icon size={18} />
      </span>
      <div className="mt-3 text-[1.7rem] font-bold leading-none">
        {value}
        <span className="ml-1 text-sm font-medium text-ink-soft">{unit}</span>
      </div>
      <div className="mt-1 text-sm font-medium leading-tight">{title}</div>
      <div className="text-xs text-ink-soft">{note}</div>
    </div>
  )
}
