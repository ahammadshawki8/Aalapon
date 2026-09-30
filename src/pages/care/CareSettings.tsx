import type { ReactNode } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Phone, Plus } from 'lucide-react'
import { BackBar, CareNav, Screen } from '../../components/ui'
import { caregivers, elder, medicines } from '../../data/mock'

const questions = ['Did you take your medicine?', 'How did you sleep?', 'Have you eaten lunch?', 'Any pain today?']

export default function CareSettings() {
  const [consent, setConsent] = useState({ calls: true, watch: true, video: false, recordings: true })

  return (
    <Screen className="pb-28">
      <BackBar title="Care plan" to="/care" />

      <Group title="Daily call">
        <Row icon={<Clock size={18} />} title="Every day, 9:00 AM" sub="Retries twice if she does not answer" />
        <Row icon={<Phone size={18} />} title={elder.phone} sub="Regular phone call. Works on button phones." />
      </Group>

      <Group title="Questions Aalapon asks">
        <div className="flex flex-wrap gap-2 p-3">
          {questions.map((q) => (
            <span key={q} className="rounded-full bg-paper px-3 py-2 text-sm ring-1 ring-line">{q}</span>
          ))}
          <button className="inline-flex items-center gap-1 rounded-full border border-dashed border-ink-soft/40 px-3 py-2 text-sm text-ink-soft">
            <Plus size={14} /> Add
          </button>
        </div>
      </Group>

      <Group title="Medicines">
        {medicines.map((m) => (
          <Row key={m.id} icon={<span className="text-xs font-bold">{m.time}</span>} title={m.en} sub={m.purposeEn} />
        ))}
      </Group>

      <Group title="Ma's consent">
        {(
          [
            ['calls', 'Daily AI calls'],
            ['recordings', 'Keep call transcripts for 7 days'],
            ['watch', 'Share smartwatch readings'],
            ['video', 'Video signals during video calls'],
          ] as const
        ).map(([k, label]) => (
          <label key={k} className="flex min-h-14 items-center justify-between gap-3 px-4 py-2">
            <span className="text-[15px]">{label}</span>
            <button
              role="switch"
              aria-checked={consent[k]}
              onClick={() => setConsent({ ...consent, [k]: !consent[k] })}
              className={`relative h-8 w-14 shrink-0 rounded-full transition ${consent[k] ? 'bg-moss' : 'bg-line'}`}
            >
              <span className={`absolute top-1 size-6 rounded-full bg-card shadow transition-all ${consent[k] ? 'left-7' : 'left-1'}`} />
            </button>
          </label>
        ))}
      </Group>

      <Group title="Family">
        {caregivers.map((c) => (
          <Row key={c.id} icon={<span className="text-xs font-bold">{c.nameEn.split(' ').map((w) => w[0]).join('')}</span>} title={c.nameEn} sub={`${c.relation}, ${c.place}`} />
        ))}
      </Group>

      <Link to="/" className="mt-6 flex h-12 items-center justify-center rounded-full bg-card font-medium ring-1 ring-line">
        Switch to elder portal
      </Link>
      <CareNav />
    </Screen>
  )
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-5">
      <h2 className="mb-2 px-1 text-sm font-semibold text-ink-soft">{title}</h2>
      <div className="divide-y divide-line rounded-3xl bg-card ring-1 ring-line">{children}</div>
    </section>
  )
}

function Row({ icon, title, sub }: { icon: ReactNode; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sage-soft text-moss">{icon}</span>
      <div>
        <div className="font-semibold leading-tight">{title}</div>
        <div className="text-sm text-ink-soft">{sub}</div>
      </div>
    </div>
  )
}
