import { Link, useParams } from 'react-router-dom'
import { Phone, Video } from 'lucide-react'
import { BackBar, CareNav, Pill, Screen } from '../../components/ui'
import { callScript, calls } from '../../data/mock'
import { MoodDot } from './CareDashboard'

export function CareCalls() {
  return (
    <Screen className="pb-28">
      <BackBar title="Call history" to="/care" />
      <p className="text-sm text-ink-soft">Aalapon calls Ma every morning at 9:00 on her regular phone.</p>
      <div className="mt-4 space-y-2.5">
        {calls.map((c) => (
          <Link key={c.id} to={`/care/calls/${c.id}`} className="flex items-start gap-3 rounded-3xl bg-card p-4 ring-1 ring-line active:scale-[0.99] transition">
            <MoodDot mood={c.mood} />
            <div className="flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-semibold">{c.dayEn}</span>
                <span className="text-xs text-ink-soft">{c.timeEn}, {c.duration}</span>
              </div>
              <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">{c.summaryEn}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {c.tags.map((t) => (
                  <Pill key={t}>{t}</Pill>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
      <CareNav />
    </Screen>
  )
}

export function CareCallDetail() {
  const { id } = useParams()
  const c = calls.find((x) => x.id === id) ?? calls[0]
  const hasTranscript = c.id === 'k1'

  return (
    <Screen className="pb-28">
      <BackBar title={`${c.dayEn}, ${c.timeEn}`} to="/care/calls" />
      <section className="mt-2 rounded-4xl bg-moss p-5 text-card">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-sm text-card/75">
            {c.channelEn === 'Video call' ? <Video size={16} /> : <Phone size={16} />} {c.channelEn}, {c.duration}
          </span>
          <span className="rounded-full bg-card/15 px-2.5 py-1 text-xs">Mood: {c.moodEn}</span>
        </div>
        <h2 className="mt-3 text-sm text-card/70">Summary</h2>
        <p className="mt-1 text-lg leading-snug">{c.summaryEn}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {c.tags.map((t) => (
            <span key={t} className="rounded-full bg-marigold px-2.5 py-1 text-xs font-medium text-moss">{t}</span>
          ))}
        </div>
      </section>

      <h2 className="mt-6 mb-3 text-lg font-semibold">Transcript</h2>
      {hasTranscript ? (
        <div className="space-y-3">
          {callScript.map((t, i) => (
            <div key={i} className={`flex ${t.who === 'ai' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[85%] rounded-3xl px-4 py-3 ${t.who === 'ai' ? 'rounded-tl-lg bg-card ring-1 ring-line' : 'rounded-tr-lg bg-marigold-soft'}`}>
                <div className="text-xs font-medium text-ink-soft">{t.who === 'ai' ? 'Aalapon' : 'Ma'}</div>
                <p className="mt-0.5 text-[15px] leading-relaxed">{t.bn}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-soft">{t.en}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-3xl bg-card p-5 text-sm text-ink-soft ring-1 ring-line">Full transcripts are kept for 7 days. Only the summary is stored for older calls.</p>
      )}
      <CareNav />
    </Screen>
  )
}
