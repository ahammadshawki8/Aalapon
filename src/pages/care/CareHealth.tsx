import type { ReactNode } from 'react'
import { Droplets, Footprints, HeartPulse, Info, Moon, Watch } from 'lucide-react'
import { Bars, Card, CareNav, PageTitle, Pill, Screen, Spark } from '../../components/ui'
import { vitals } from '../../data/mock'
import { useApp } from '../../state/AppState'

export default function CareHealth() {
  const { consent } = useApp()
  return (
    <Screen className="pb-28">
      <PageTitle title="Health" sub="From Ma's watch. Aalapon asks about changes on her next call." />

      <Card className="flex items-center gap-3 p-3.5">
        <span className="grid size-10 place-items-center rounded-[14px] bg-moss text-marigold">
          <Watch size={19} />
        </span>
        <div className="flex-1 leading-tight">
          <div className="text-[15px] font-semibold">Ma's watch</div>
          <div className="text-[12.5px] text-ink-soft">Health Connect, {vitals.syncedEn.toLowerCase()}</div>
        </div>
        <Pill tone={consent.watch ? 'good' : 'alert'}>{consent.watch ? 'Sharing on' : 'Paused by Ma'}</Pill>
      </Card>

      <Metric icon={<Moon size={16} />} tint="bg-lilac text-lilac-ink" label="Sleep, last night" value={`${vitals.sleepHours}`} unit="hours" note="Under 5 hours on 3 of the last 4 nights" flag>
        <Bars values={vitals.sleepWeek} max={8} labels={vitals.weekLabels} warnBelow={5} color="#9C8BD6" />
      </Metric>

      <Metric icon={<Footprints size={16} />} tint="bg-peach text-marigold-deep" label="Steps, today" value={vitals.steps.toLocaleString('en-US')} unit="steps" note="Down 40% from last week. She mentioned knee pain.">
        <Bars values={vitals.stepsWeek.map((s) => Math.round(s / 100) / 10)} max={3.6} labels={vitals.weekLabels} color="#F4A340" unit="k" />
      </Metric>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <Small icon={<HeartPulse size={15} />} tint="text-thread" label="Resting heart rate" value={`${vitals.restingHr}`} unit="bpm" note="Steady" data={vitals.hrWeek} color="#CF523C" />
        <Small icon={<Droplets size={15} />} tint="text-sky-ink" label="Blood oxygen" value={`${vitals.spo2}`} unit="%" note="Alerts under 92%" data={vitals.spo2Week} color="#2F628C" />
      </div>

      <p className="mt-4 flex gap-2 px-1 text-[12px] leading-relaxed text-ink-faint">
        <Info size={14} className="mt-0.5 shrink-0" />
        Watch readings help you notice changes early. They are not a diagnosis. Ma can stop sharing any reading at any time.
      </p>
      <CareNav />
    </Screen>
  )
}

function Metric({ icon, tint, label, value, unit, note, flag, children }: { icon: ReactNode; tint: string; label: string; value: string; unit: string; note: string; flag?: boolean; children: ReactNode }) {
  return (
    <Card className="mt-2 p-4">
      <div className="flex items-start gap-3">
        <span className={`grid size-9 shrink-0 place-items-center rounded-[12px] ${tint}`}>{icon}</span>
        <div className="flex-1">
          <div className="text-[12.5px] font-medium text-ink-soft">{label}</div>
          <div className="text-[26px] font-semibold leading-tight tracking-tight">
            {value} <span className="text-[13px] font-medium text-ink-faint">{unit}</span>
          </div>
        </div>
        {flag && <Pill tone="alert">Low</Pill>}
      </div>
      <p className="mt-1 text-[13px] text-ink-soft">{note}</p>
      <div className="mt-3">{children}</div>
    </Card>
  )
}

function Small({ icon, tint, label, value, unit, note, data, color }: { icon: ReactNode; tint: string; label: string; value: string; unit: string; note: string; data: number[]; color: string }) {
  return (
    <Card className="p-3.5">
      <div className={`flex items-center gap-1.5 text-[12px] font-medium ${tint}`}>
        {icon}
        <span className="text-ink-soft">{label}</span>
      </div>
      <div className="mt-2 text-[24px] font-semibold leading-none tracking-tight">
        {value}
        <span className="ml-0.5 text-[13px] font-medium text-ink-faint">{unit}</span>
      </div>
      <div className="mt-2 flex items-end justify-between">
        <span className="text-[11.5px] text-ink-faint">{note}</span>
        <Spark values={data} w={48} h={18} color={color} fill={false} />
      </div>
    </Card>
  )
}
