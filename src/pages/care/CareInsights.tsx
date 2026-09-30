import type React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BellRing, Check, Info, Phone, Plus, Send, Stethoscope } from 'lucide-react'
import { Bars, Card, CareNav, PageTitle, Screen } from '../../components/ui'
import { MaAvatar } from '../../components/brand'
import { insights, vitals, wellbeing } from '../../data/mock'
import { useApp } from '../../state/AppState'

const toneMap = {
  alert: { dot: 'bg-thread', label: 'Check in' },
  watch: { dot: 'bg-marigold', label: 'Keep an eye on' },
  good: { dot: 'bg-sage', label: 'Good news' },
}

export default function CareInsights() {
  const [open, setOpen] = useState<string | null>(insights[0].id)
  const { reminders, questions, patch, toast, addRequest } = useApp()
  const eveningQ = 'Did you take your evening calcium?'
  const btn = 'press flex h-10 items-center justify-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold'
  const actions: Record<string, React.ReactNode> = {
    i1: (
      <>
        <Link to="/care/call" className={`${btn} bg-moss text-white`}>
          <Phone size={14} /> Call Ma
        </Link>
        <button
          onClick={() => {
            const on = reminders.includes('i1')
            patch((s) => ({ reminders: on ? s.reminders.filter((x) => x !== 'i1') : [...s.reminders, 'i1'] }))
            toast(on ? 'Reminder removed' : 'We will remind you at 8:00 PM')
          }}
          className={`${btn} ${reminders.includes('i1') ? 'bg-sage-soft text-moss-2' : 'bg-paper text-ink'}`}
        >
          {reminders.includes('i1') ? <Check size={14} /> : <BellRing size={14} />} {reminders.includes('i1') ? 'Reminder at 8 PM' : 'Remind me at 8 PM'}
        </button>
      </>
    ),
    i2: (
      <Link to="/care/book-doctor" className={`${btn} bg-moss text-white`}>
        <Stethoscope size={14} /> Book a doctor visit
      </Link>
    ),
    i3: questions.includes(eveningQ) ? (
      <span className={`${btn} bg-sage-soft text-moss-2`}>
        <Check size={14} /> Evening check added
      </span>
    ) : (
      <button
        onClick={() => {
          patch((s) => ({ questions: [...s.questions, eveningQ] }))
          toast('Aalapon will ask about it every evening')
        }}
        className={`${btn} bg-moss text-white`}
      >
        <Plus size={14} /> Ask her every evening
      </button>
    ),
    i4: reminders.includes('i4') ? (
      <span className={`${btn} bg-sage-soft text-moss-2`}>
        <Check size={14} /> Sent to Nabila
      </span>
    ) : (
      <button
        onClick={() => {
          patch((s) => ({ reminders: [...s.reminders, 'i4'] }))
          addRequest({ kind: 'family', titleEn: 'Asked Nabila to call Ma', titleBn: 'নাবিলা কল করবে', detailEn: 'Tanvir asked Nabila to give Ma a call this week.', source: 'family', status: 'sent', agentEn: 'Family contact' })
          toast('Nabila got a message to call Ma')
        }}
        className={`${btn} bg-moss text-white`}
      >
        <Send size={14} /> Ask Nabila to call
      </button>
    ),
  }
  return (
    <Screen className="pb-28">
      <PageTitle title="Insights" sub="Patterns Aalapon noticed across calls and her watch." />

      <Card className="p-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[15px] font-semibold">Mood on calls</h2>
          <span className="text-[12px] text-ink-faint">Last 7 days, 1 to 5</span>
        </div>
        <div className="mt-3">
          <Bars values={wellbeing.moodWeek} max={5} labels={vitals.weekLabels} warnBelow={3} color="#F4A340" />
        </div>
      </Card>

      <div className="mt-3 space-y-2">
        {insights.map((i) => {
          const t = toneMap[i.tone]
          const isOpen = open === i.id
          return (
            <Card key={i.id} className="overflow-hidden">
              <button onClick={() => setOpen(isOpen ? null : i.id)} aria-expanded={isOpen} className="flex w-full items-start gap-3 p-4 text-left">
                <span className={`mt-1.5 size-2.5 shrink-0 rounded-full ${t.dot}`} />
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-2 text-[12px] text-ink-faint">
                    <span className="font-semibold">{t.label}</span>
                    <span>{i.whenEn}</span>
                  </div>
                  <h3 className="mt-0.5 text-[16px] font-semibold leading-snug">{i.titleEn}</h3>
                  {!isOpen && <p className="mt-0.5 line-clamp-1 text-[13px] text-ink-soft">{i.bodyEn}</p>}
                </div>
              </button>
              {isOpen && (
                <div className="animate-rise -mt-2 px-4 pb-4 pl-[38px]">
                  <p className="text-[14px] leading-relaxed text-ink/80">{i.bodyEn}</p>
                  {i.quoteBn && (
                    <div className="mt-2.5 flex items-center gap-2.5 rounded-2xl bg-paper p-2.5">
                      <MaAvatar size={24} />
                      <p className="bn text-[15px] leading-snug">"{i.quoteBn}"</p>
                    </div>
                  )}
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {i.evidence.map((e) => (
                      <span key={e} className="rounded-full bg-paper px-2.5 py-1 text-[11.5px] text-ink-soft">{e}</span>
                    ))}
                  </div>
                  {i.actionEn && <p className="mt-2.5 text-[13px] font-semibold text-moss-3">{i.actionEn}</p>}
                  {actions[i.id] && <div className="mt-3 flex flex-wrap gap-2">{actions[i.id]}</div>}
                </div>
              )}
            </Card>
          )
        })}
      </div>

      <p className="mt-4 flex gap-2 px-1 text-[12px] leading-relaxed text-ink-faint">
        <Info size={14} className="mt-0.5 shrink-0" />
        Wellbeing updates, not a medical diagnosis. Each one shows the calls and readings it came from.
      </p>
      <CareNav />
    </Screen>
  )
}
