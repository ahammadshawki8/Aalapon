import { useState } from 'react'
import { Check, Phone, Pill as PillIcon, ShoppingBasket, Siren, Smartphone, Stethoscope, UserRound, Zap, X } from 'lucide-react'
import { Card, CareNav, PageTitle, Pill, Screen } from '../../components/ui'
import { timeAgo, useApp, type CareRequest } from '../../state/AppState'

const statusMeta: Record<CareRequest['status'], { label: string; tone: 'auto' | 'approve' | 'alert' | 'good' | 'neutral' }> = {
  done: { label: 'Done', tone: 'good' },
  approval: { label: 'Needs your OK', tone: 'approve' },
  admin: { label: 'New agent requested', tone: 'neutral' },
  sent: { label: 'Sent', tone: 'auto' },
  declined: { label: 'Declined', tone: 'alert' },
}

const kindIcon = { medicine: PillIcon, food: ShoppingBasket, doctor: Stethoscope, family: UserRound, unwell: Siren, bill: Zap }
const kindTint = {
  medicine: 'bg-lilac text-lilac-ink',
  food: 'bg-peach text-marigold-deep',
  doctor: 'bg-sky text-sky-ink',
  family: 'bg-mint text-moss-2',
  unwell: 'bg-thread-soft text-thread',
  bill: 'bg-paper text-ink-soft',
}

function Meta({ r }: { r: CareRequest }) {
  return (
    <span className="inline-flex items-center gap-1 text-[12px] text-ink-faint">
      {r.source === 'call' ? <Phone size={11} /> : <Smartphone size={11} />}
      {r.source === 'call' ? 'On the call' : 'From her app'}, {timeAgo(r.at).toLowerCase()}
    </span>
  )
}

export function ApprovalCard({ r }: { r: CareRequest }) {
  const { setStatus } = useApp()
  const Icon = kindIcon[r.kind]
  return (
    <Card className="p-3.5 ring-1 ring-marigold/50">
      <div className="flex gap-3">
        <span className={`grid size-10 shrink-0 place-items-center rounded-[14px] ${kindTint[r.kind]}`}>
          <Icon size={19} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-semibold leading-snug">{r.titleEn}</div>
          <p className="mt-0.5 text-[13px] leading-snug text-ink-soft">{r.detailEn}</p>
          {r.quoteBn && <p className="bn mt-1.5 text-[14px] text-ink/80">"{r.quoteBn}"</p>}
          <div className="mt-1.5">
            <Meta r={r} />
          </div>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={() => setStatus(r.id, 'declined')} className="press flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full bg-paper text-[14px] font-semibold text-ink-soft">
          <X size={16} /> Not now
        </button>
        <button onClick={() => setStatus(r.id, 'done')} className="press flex h-10 flex-[1.4] items-center justify-center gap-1.5 rounded-full bg-moss text-[14px] font-semibold text-white">
          <Check size={16} /> Approve
        </button>
      </div>
    </Card>
  )
}

const filters = [
  { id: 'all', label: 'All' },
  { id: 'approval', label: 'Needs OK' },
  { id: 'done', label: 'Done' },
  { id: 'admin', label: 'New agents' },
] as const

export default function CareRequests() {
  const { requests, reset } = useApp()
  const [f, setF] = useState<(typeof filters)[number]['id']>('all')
  const list = requests.filter((r) => f === 'all' || r.status === f)
  const count = (id: string) => (id === 'all' ? requests.length : requests.filter((r) => r.status === id).length)

  return (
    <Screen className="pb-28">
      <PageTitle title="Requests" sub="What Ma asked for, and what happened next." />

      <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1">
        {filters.map((x) => (
          <button
            key={x.id}
            onClick={() => setF(x.id)}
            className={`press flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[13.5px] font-medium ${f === x.id ? 'bg-ink text-white' : 'bg-card text-ink-soft shadow-card'}`}
          >
            {x.label}
            <span className={`text-[12px] ${f === x.id ? 'text-white/60' : 'text-ink-faint'}`}>{count(x.id)}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-2">
        {list.length === 0 && <Card className="p-6 text-center text-[14px] text-ink-soft">Nothing here yet. Requests from calls and her app show up here.</Card>}
        {list.map((r) => {
          if (r.status === 'approval') return <ApprovalCard key={r.id} r={r} />
          const Icon = kindIcon[r.kind]
          return (
            <Card key={r.id} className="flex gap-3 p-3.5">
              <span className={`grid size-10 shrink-0 place-items-center rounded-[14px] ${kindTint[r.kind]}`}>
                <Icon size={19} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[15px] font-semibold leading-snug">{r.titleEn}</span>
                  <Pill tone={statusMeta[r.status].tone}>{statusMeta[r.status].label}</Pill>
                </div>
                <p className="mt-0.5 text-[13px] leading-snug text-ink-soft">{r.detailEn}</p>
                {r.quoteBn && <p className="bn mt-1.5 text-[14px] text-ink/80">"{r.quoteBn}"</p>}
                <div className="mt-1.5">
                  <Meta r={r} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <button onClick={reset} className="mt-6 h-10 w-full rounded-full text-[13px] text-ink-faint">
        Reset demo data
      </button>
      <CareNav />
    </Screen>
  )
}
