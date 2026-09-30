import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Clock, Phone, Plus } from 'lucide-react'
import { BackBar, Card, CareNav, Screen } from '../../components/ui'
import { Initials, MaAvatar } from '../../components/brand'
import { caregivers, elder, medicines } from '../../data/mock'

const questions = ['Did you take your medicine?', 'How did you sleep?', 'Have you eaten lunch?', 'Any pain today?']

export default function CareSettings() {
  const [consent, setConsent] = useState({ calls: true, watch: true, video: false, recordings: true })

  return (
    <Screen className="pb-28">
      <BackBar title="Care plan" to="/care" />

      <div className="flex items-center gap-3 px-1 pb-2">
        <MaAvatar size={52} />
        <div className="leading-tight">
          <div className="text-[18px] font-semibold">{elder.nameEn}</div>
          <div className="text-[13px] text-ink-soft">{elder.phoneType}</div>
        </div>
      </div>

      <Group title="Daily call">
        <Row icon={<Clock size={17} />} title="Every day at 9:00 AM" sub="Tries twice more if she misses it" chevron />
        <Row icon={<Phone size={17} />} title={elder.phone} sub="A normal call, works on button phones" chevron />
      </Group>

      <Group title="Aalapon also asks">
        <div className="flex flex-wrap gap-1.5 p-3">
          {questions.map((q) => (
            <span key={q} className="rounded-full bg-paper px-3 py-1.5 text-[13px]">{q}</span>
          ))}
          <button className="inline-flex items-center gap-1 rounded-full border border-dashed border-ink-faint/50 px-3 py-1.5 text-[13px] text-ink-soft">
            <Plus size={13} /> Add question
          </button>
        </div>
      </Group>

      <Group title="Medicines">
        {medicines.map((m) => (
          <Row key={m.id} icon={<span className="text-[11px] font-bold tabular-nums">{m.time}</span>} title={m.en} sub={m.purposeEn} chevron />
        ))}
      </Group>

      <Group title="What Ma agreed to share">
        {(
          [
            ['calls', 'Daily AI calls'],
            ['recordings', 'Keep transcripts for 7 days'],
            ['watch', 'Smartwatch readings'],
            ['video', 'Video signals on video calls'],
          ] as const
        ).map(([k, label]) => (
          <div key={k} className="flex min-h-[52px] items-center justify-between gap-3 px-4">
            <span className="text-[15px]">{label}</span>
            <button
              role="switch"
              aria-checked={consent[k]}
              aria-label={label}
              onClick={() => setConsent({ ...consent, [k]: !consent[k] })}
              className={`relative h-[30px] w-[50px] shrink-0 rounded-full transition-colors ${consent[k] ? 'bg-moss-3' : 'bg-line'}`}
            >
              <span className={`absolute top-[3px] size-6 rounded-full bg-white shadow transition-all ${consent[k] ? 'left-[23px]' : 'left-[3px]'}`} />
            </button>
          </div>
        ))}
      </Group>

      <Group title="Family">
        {caregivers.map((c, i) => (
          <Row key={c.id} icon={<Initials text={c.nameEn.split(' ').map((w) => w[0]).join('')} size={36} tone={i ? 'sky' : 'moss'} />} bare title={c.nameEn} sub={`${c.relation}, ${c.place}`} />
        ))}
      </Group>

      <Link to="/" className="mt-6 flex h-11 items-center justify-center text-[14px] font-medium text-moss-3">
        Switch to Ma's app
      </Link>
      <CareNav />
    </Screen>
  )
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-5">
      <h2 className="mb-1.5 px-1 text-[13px] font-semibold text-ink-soft">{title}</h2>
      <Card className="divide-y divide-line overflow-hidden">{children}</Card>
    </section>
  )
}

function Row({ icon, title, sub, chevron, bare }: { icon: ReactNode; title: string; sub: string; chevron?: boolean; bare?: boolean }) {
  return (
    <div className="flex min-h-[56px] items-center gap-3 px-4 py-2.5">
      {bare ? icon : <span className="grid size-9 shrink-0 place-items-center rounded-[12px] bg-sage-soft text-moss-2">{icon}</span>}
      <div className="flex-1 leading-tight">
        <div className="text-[15px] font-medium">{title}</div>
        <div className="text-[12.5px] text-ink-soft">{sub}</div>
      </div>
      {chevron && <ChevronRight size={17} className="text-ink-faint" />}
    </div>
  )
}
