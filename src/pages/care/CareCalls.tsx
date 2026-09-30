import { Link, useParams } from 'react-router-dom'
import { ChevronRight, Phone, Video } from 'lucide-react'
import { BackBar, Card, CareNav, Screen } from '../../components/ui'
import { MaAvatar, Mark } from '../../components/brand'
import { callScript, calls } from '../../data/mock'
import { MoodDot } from './CareDashboard'

export function CareCalls() {
  return (
    <Screen className="pb-28">
      <BackBar title="Call history" to="/care" />
      <p className="px-1 pb-3 text-[13px] text-ink-soft">Aalapon calls Ma at 9:00 every morning on her regular phone.</p>
      <Card className="divide-y divide-line overflow-hidden">
        {calls.map((c) => (
          <Link key={c.id} to={`/care/calls/${c.id}`} className="flex items-start gap-3 px-4 py-3.5 active:bg-paper">
            <MoodDot mood={c.mood} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[15px] font-semibold">{c.dayEn}</span>
                <span className="text-[12px] tabular-nums text-ink-faint">{c.timeEn}, {c.duration}</span>
              </div>
              <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-ink-soft">{c.summaryEn}</p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {c.tags.map((t) => (
                  <span key={t} className="rounded-full bg-paper px-2 py-0.5 text-[11px] font-medium text-ink-soft">{t}</span>
                ))}
              </div>
            </div>
            <ChevronRight size={18} className="mt-0.5 text-ink-faint" />
          </Link>
        ))}
      </Card>
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
      <section className="rounded-[24px] bg-moss p-4 text-white">
        <div className="flex items-center justify-between text-[12.5px] text-white/65">
          <span className="flex items-center gap-1.5">
            {c.channelEn === 'Video call' ? <Video size={14} /> : <Phone size={14} />} {c.channelEn}, {c.duration}
          </span>
          <span className="rounded-full bg-white/10 px-2.5 py-1">Mood: {c.moodEn}</span>
        </div>
        <p className="mt-3 text-[17px] font-medium leading-snug">{c.summaryEn}</p>
        <div className="mt-3 flex flex-wrap gap-1">
          {c.tags.map((t) => (
            <span key={t} className="rounded-full bg-marigold px-2.5 py-1 text-[11.5px] font-semibold text-moss">{t}</span>
          ))}
        </div>
      </section>

      <h2 className="mt-6 mb-3 px-1 text-[15px] font-semibold">Transcript</h2>
      {hasTranscript ? (
        <div className="space-y-2.5">
          {callScript.map((t, i) => (
            <div key={i} className={`flex items-end gap-2 ${t.who === 'ai' ? '' : 'flex-row-reverse'}`}>
              {t.who === 'ai' ? <Mark size={24} /> : <MaAvatar size={24} />}
              <div className={`max-w-[80%] rounded-[20px] px-3.5 py-2.5 ${t.who === 'ai' ? 'rounded-bl-md bg-card shadow-card' : 'rounded-br-md bg-marigold-soft'}`}>
                <p className="bn text-[15px] leading-snug">{t.bn}</p>
                <p className="mt-1 text-[12px] leading-snug text-ink-soft">{t.en}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="p-4 text-[13px] text-ink-soft">Full transcripts are kept for 7 days. Older calls keep only the summary.</Card>
      )}
      <CareNav />
    </Screen>
  )
}
