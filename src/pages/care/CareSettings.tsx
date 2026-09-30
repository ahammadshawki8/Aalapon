import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Clock, Phone, Plus, Trash2, UserPlus, X } from 'lucide-react'
import { BackBar, Card, CareNav, Field, PrimaryBtn, Screen, Sheet, inputCls } from '../../components/ui'
import { Initials, MaAvatar } from '../../components/brand'
import { elder, type Medicine } from '../../data/mock'
import { timeToBn, timeToEn, useApp, type Consent } from '../../state/AppState'

const purposes = [
  { en: 'Blood pressure', bn: 'প্রেসারের ওষুধ' },
  { en: 'Diabetes', bn: 'ডায়াবেটিসের ওষুধ' },
  { en: 'Heart', bn: 'হার্টের ওষুধ' },
  { en: 'Bone health', bn: 'হাড়ের জন্য' },
  { en: 'Pain', bn: 'ব্যথার ওষুধ' },
  { en: 'Vitamin', bn: 'ভিটামিন' },
  { en: 'Other', bn: 'অন্য ওষুধ' },
]
const suggestedQuestions = ['Did you drink enough water?', 'Did you go for a walk?', 'Did you talk to anyone today?', 'How is your knee today?']

type SheetKind = null | 'time' | 'phone' | 'question' | 'family' | { med: Medicine | null }

export default function CareSettings() {
  const { callTime, elderPhone, questions, medicines, consent, family, patch, toast } = useApp()
  const [sheet, setSheet] = useState<SheetKind>(null)
  const close = () => setSheet(null)

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
        <Row onClick={() => setSheet('time')} icon={<Clock size={17} />} title={`Every day at ${timeToEn(callTime)}`} sub="Tries twice more if she misses it" />
        <Row onClick={() => setSheet('phone')} icon={<Phone size={17} />} title={elderPhone} sub="A normal call, works on button phones" />
      </Group>

      <Group title="Aalapon also asks">
        <div className="flex flex-wrap gap-1.5 p-3">
          {questions.map((q) => (
            <span key={q} className="flex h-8 items-center gap-1 rounded-full bg-paper pl-3 pr-1 text-[13px]">
              {q}
              <button onClick={() => patch((s) => ({ questions: s.questions.filter((x) => x !== q) }))} aria-label={`Remove ${q}`} className="grid size-6 place-items-center rounded-full text-ink-faint hover:bg-line">
                <X size={13} />
              </button>
            </span>
          ))}
          <button onClick={() => setSheet('question')} className="inline-flex h-8 items-center gap-1 rounded-full border border-dashed border-ink-faint/50 px-3 text-[13px] text-ink-soft">
            <Plus size={13} /> Add question
          </button>
        </div>
      </Group>

      <Group title="Medicines">
        {medicines.map((m) => (
          <Row key={m.id} onClick={() => setSheet({ med: m })} icon={<span className="text-[11px] font-bold tabular-nums">{m.time}</span>} title={m.en} sub={m.purposeEn} />
        ))}
        <Row onClick={() => setSheet({ med: null })} icon={<Plus size={17} />} title="Add medicine" sub="Aalapon reminds her and asks if she took it" />
      </Group>

      <Group title="What Ma agreed to share">
        {(
          [
            ['calls', 'Daily AI calls'],
            ['recordings', 'Keep transcripts for 7 days'],
            ['watch', 'Smartwatch readings'],
            ['video', 'Video signals on video calls'],
          ] as [keyof Consent, string][]
        ).map(([k, label]) => (
          <div key={k} className="flex min-h-[52px] items-center justify-between gap-3 px-4">
            <span className="text-[15px]">{label}</span>
            <button
              role="switch"
              aria-checked={consent[k]}
              aria-label={label}
              onClick={() => {
                patch((s) => ({ consent: { ...s.consent, [k]: !s.consent[k] } }))
                toast(`${label}: ${consent[k] ? 'off' : 'on'}`)
              }}
              className={`relative h-[30px] w-[50px] shrink-0 rounded-full transition-colors ${consent[k] ? 'bg-moss-3' : 'bg-line'}`}
            >
              <span className={`absolute top-[3px] size-6 rounded-full bg-white shadow transition-all ${consent[k] ? 'left-[23px]' : 'left-[3px]'}`} />
            </button>
          </div>
        ))}
      </Group>

      <Group title="Family">
        {family.map((c, i) => (
          <div key={c.id} className="flex min-h-[56px] items-center gap-3 px-4 py-2.5">
            <Initials text={c.nameEn.split(' ').map((w) => w[0]).join('').slice(0, 2)} size={36} tone={i ? 'sky' : 'moss'} />
            <div className="flex-1 leading-tight">
              <div className="text-[15px] font-medium">{c.nameEn}</div>
              <div className="text-[12.5px] text-ink-soft">{c.relation}, {c.place}</div>
            </div>
            {i > 0 && (
              <button onClick={() => patch((s) => ({ family: s.family.filter((f) => f.id !== c.id) }))} aria-label={`Remove ${c.nameEn}`} className="grid size-9 place-items-center rounded-full text-ink-faint hover:bg-paper">
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
        <Row onClick={() => setSheet('family')} icon={<UserPlus size={17} />} title="Invite family member" sub="They get updates and can approve requests" />
      </Group>

      <Link to="/" className="mt-6 flex h-11 items-center justify-center text-[14px] font-medium text-moss-3">
        Switch to Ma's app
      </Link>
      <CareNav />

      {sheet === 'time' && <TimeSheet onClose={close} />}
      {sheet === 'phone' && <PhoneSheet onClose={close} />}
      {sheet === 'question' && <QuestionSheet onClose={close} />}
      {sheet === 'family' && <FamilySheet onClose={close} />}
      {sheet && typeof sheet === 'object' && <MedSheet med={sheet.med} onClose={close} />}
    </Screen>
  )
}

function TimeSheet({ onClose }: { onClose: () => void }) {
  const { callTime, patch, toast } = useApp()
  const [t, setT] = useState(callTime)
  return (
    <Sheet open title="Daily call time" onClose={onClose} footer={<PrimaryBtn onClick={() => { patch(() => ({ callTime: t })); toast(`Daily call moved to ${timeToEn(t)}`); onClose() }}>Save</PrimaryBtn>}>
      <Field label="Time">
        <input type="time" value={t} onChange={(e) => setT(e.target.value)} className={inputCls} />
      </Field>
      <div className="flex flex-wrap gap-1.5">
        {['08:00', '09:00', '10:30', '17:00'].map((x) => (
          <button key={x} onClick={() => setT(x)} className={`h-9 rounded-full px-3 text-[13px] font-medium ${t === x ? 'bg-moss text-white' : 'bg-paper'}`}>
            {timeToEn(x)}
          </button>
        ))}
      </div>
      <p className="bn mt-3 text-[14px] text-ink-soft">Ma will see: প্রতিদিন {timeToBn(t)} আলাপন কল করবে</p>
    </Sheet>
  )
}

function PhoneSheet({ onClose }: { onClose: () => void }) {
  const { elderPhone, patch, toast } = useApp()
  const [p, setP] = useState(elderPhone)
  return (
    <Sheet open title="Ma's phone number" onClose={onClose} footer={<PrimaryBtn disabled={p.replace(/\D/g, '').length < 6} onClick={() => { patch(() => ({ elderPhone: p })); toast('Phone number updated'); onClose() }}>Save</PrimaryBtn>}>
      <Field label="Number Aalapon calls">
        <input type="tel" inputMode="tel" value={p} onChange={(e) => setP(e.target.value)} className={inputCls} />
      </Field>
      <p className="text-[13px] text-ink-soft">Any mobile or landline works. A smartphone is not needed.</p>
    </Sheet>
  )
}

function QuestionSheet({ onClose }: { onClose: () => void }) {
  const { questions, patch, toast } = useApp()
  const [q, setQ] = useState('')
  const add = (text: string) => {
    const v = text.trim()
    if (!v || questions.includes(v)) return
    patch((s) => ({ questions: [...s.questions, v] }))
    toast('Aalapon will ask this on her calls')
    onClose()
  }
  return (
    <Sheet open title="Add a question" onClose={onClose} footer={<PrimaryBtn disabled={!q.trim()} onClick={() => add(q)}>Add</PrimaryBtn>}>
      <Field label="What should Aalapon ask?">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Did you eat breakfast?" className={inputCls} onKeyDown={(e) => e.key === 'Enter' && add(q)} />
      </Field>
      <p className="mb-2 text-[13px] text-ink-soft">Suggestions</p>
      <div className="flex flex-wrap gap-1.5">
        {suggestedQuestions.filter((s) => !questions.includes(s)).map((s) => (
          <button key={s} onClick={() => add(s)} className="h-9 rounded-full bg-paper px-3 text-[13px]">
            {s}
          </button>
        ))}
      </div>
    </Sheet>
  )
}

function MedSheet({ med, onClose }: { med: Medicine | null; onClose: () => void }) {
  const { patch, toast } = useApp()
  const [name, setName] = useState(med?.en ?? '')
  const [time, setTime] = useState(med?.time ?? '20:00')
  const [purpose, setPurpose] = useState(med?.purposeEn ?? 'Blood pressure')
  const save = () => {
    const p = purposes.find((x) => x.en === purpose) ?? purposes[purposes.length - 1]
    const next: Medicine = { id: med?.id ?? `m${Date.now()}`, en: name.trim(), bn: med && med.en === name.trim() ? med.bn : name.trim(), purposeEn: p.en, purposeBn: p.bn, time, timeBn: timeToBn(time) }
    patch((s) => ({ medicines: [...s.medicines.filter((m) => m.id !== next.id), next].sort((a, b) => a.time.localeCompare(b.time)) }))
    toast(med ? 'Medicine updated' : 'Medicine added. Ma will see it today.')
    onClose()
  }
  const remove = () => {
    if (!med) return
    patch((s) => ({ medicines: s.medicines.filter((m) => m.id !== med.id), medsTaken: s.medsTaken.filter((id) => id !== med.id) }))
    toast('Medicine removed')
    onClose()
  }
  return (
    <Sheet
      open
      title={med ? 'Edit medicine' : 'Add medicine'}
      onClose={onClose}
      footer={
        <div className="flex gap-2">
          {med && (
            <button onClick={remove} aria-label="Remove medicine" className="press grid size-12 shrink-0 place-items-center rounded-full bg-thread-soft text-thread">
              <Trash2 size={18} />
            </button>
          )}
          <PrimaryBtn disabled={!name.trim()} onClick={save}>{med ? 'Save' : 'Add medicine'}</PrimaryBtn>
        </div>
      }
    >
      <Field label="Name and dose">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Losartan 50 mg" className={inputCls} />
      </Field>
      <Field label="Time">
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputCls} />
      </Field>
      <Field label="What it is for">
        <div className="flex flex-wrap gap-1.5">
          {purposes.map((p) => (
            <button key={p.en} onClick={() => setPurpose(p.en)} className={`h-9 rounded-full px-3 text-[13px] font-medium ${purpose === p.en ? 'bg-moss text-white' : 'bg-paper'}`}>
              {p.en}
            </button>
          ))}
        </div>
      </Field>
      <p className="bn text-[14px] text-ink-soft">Ma will see: {timeToBn(time)}, {purposes.find((x) => x.en === purpose)?.bn}</p>
    </Sheet>
  )
}

function FamilySheet({ onClose }: { onClose: () => void }) {
  const { patch, toast } = useApp()
  const [name, setName] = useState('')
  const [relation, setRelation] = useState('Daughter')
  const [phone, setPhone] = useState('')
  const add = () => {
    patch((s) => ({ family: [...s.family, { id: `f${Date.now()}`, nameEn: name.trim(), nameBn: name.trim(), relation, place: 'Invited', phone }] }))
    toast(`Invite sent to ${name.trim()}`)
    onClose()
  }
  return (
    <Sheet open title="Invite family member" onClose={onClose} footer={<PrimaryBtn disabled={!name.trim() || phone.replace(/\D/g, '').length < 6} onClick={add}>Send invite</PrimaryBtn>}>
      <Field label="Name">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Sadia Ahmed" className={inputCls} />
      </Field>
      <Field label="Relation to Ma">
        <div className="flex flex-wrap gap-1.5">
          {['Daughter', 'Son', 'Grandchild', 'Neighbour', 'Other'].map((r) => (
            <button key={r} onClick={() => setRelation(r)} className={`h-9 rounded-full px-3 text-[13px] font-medium ${relation === r ? 'bg-moss text-white' : 'bg-paper'}`}>
              {r}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Mobile number">
        <input type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" className={inputCls} />
      </Field>
    </Sheet>
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

function Row({ icon, title, sub, onClick }: { icon: ReactNode; title: string; sub: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex min-h-[56px] w-full items-center gap-3 px-4 py-2.5 text-left active:bg-paper">
      <span className="grid size-9 shrink-0 place-items-center rounded-[12px] bg-sage-soft text-moss-2">{icon}</span>
      <div className="flex-1 leading-tight">
        <div className="text-[15px] font-medium">{title}</div>
        <div className="text-[12.5px] text-ink-soft">{sub}</div>
      </div>
      <ChevronRight size={17} className="text-ink-faint" />
    </button>
  )
}
