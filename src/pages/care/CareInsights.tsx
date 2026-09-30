import { Info } from 'lucide-react'
import { Bars, CareNav, Pill, Screen } from '../../components/ui'
import { insights, vitals, wellbeing } from '../../data/mock'

const toneMap = {
  alert: { pill: 'alert' as const, label: 'Check in', bg: 'bg-card ring-2 ring-thread/30' },
  watch: { pill: 'approve' as const, label: 'Keep an eye', bg: 'bg-card ring-1 ring-line' },
  good: { pill: 'good' as const, label: 'Good news', bg: 'bg-sage-soft' },
}

export default function CareInsights() {
  return (
    <Screen className="pb-28">
      <header className="py-2">
        <h1 className="text-2xl font-bold">Insights</h1>
        <p className="text-sm text-ink-soft">Patterns Aalapon noticed across calls and her watch.</p>
      </header>

      <section className="mt-3 rounded-4xl bg-card p-5 ring-1 ring-line">
        <div className="flex items-baseline justify-between">
          <h2 className="font-semibold">Mood from calls, this week</h2>
          <span className="text-xs text-ink-soft">1 low to 5 happy</span>
        </div>
        <div className="mt-4">
          <Bars values={wellbeing.moodWeek} max={5} labels={vitals.weekLabels} highlight={6} warnBelow={3} color="bg-marigold" />
        </div>
      </section>

      <div className="mt-4 space-y-3">
        {insights.map((i) => {
          const t = toneMap[i.tone]
          return (
            <article key={i.id} className={`rounded-4xl p-5 ${t.bg}`}>
              <div className="flex items-center justify-between">
                <Pill tone={t.pill}>{t.label}</Pill>
                <span className="text-xs text-ink-soft">{i.whenEn}</span>
              </div>
              <h3 className="mt-2.5 text-lg font-bold leading-snug">{i.titleEn}</h3>
              <p className="mt-1 text-[15px] leading-relaxed text-ink/80">{i.bodyEn}</p>
              {i.quoteBn && <p className="mt-3 rounded-2xl bg-paper px-3.5 py-2.5 text-[15px]">"{i.quoteBn}"</p>}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {i.evidence.map((e) => (
                  <span key={e} className="rounded-full border border-line px-2.5 py-1 text-xs text-ink-soft">{e}</span>
                ))}
              </div>
              {i.actionEn && <p className="mt-3 text-sm font-semibold text-moss">{i.actionEn}</p>}
            </article>
          )
        })}
      </div>

      <p className="mt-5 flex gap-2 rounded-3xl bg-card/60 p-4 text-xs leading-relaxed text-ink-soft ring-1 ring-line">
        <Info size={16} className="mt-0.5 shrink-0" />
        Insights are wellbeing updates, not a medical diagnosis. Each one shows the calls and readings it came from. For health concerns, please talk to a doctor.
      </p>
      <CareNav />
    </Screen>
  )
}
