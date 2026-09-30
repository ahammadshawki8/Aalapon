import { useState } from 'react'
import { Check, Phone, Smartphone, X } from 'lucide-react'
import { CareNav, Pill, Screen } from '../../components/ui'
import { timeAgo, useApp, type CareRequest } from '../../state/AppState'

const statusMeta: Record<CareRequest['status'], { label: string; tone: 'auto' | 'approve' | 'alert' | 'good' | 'neutral' }> = {
  done: { label: 'Done by agent', tone: 'good' },
  approval: { label: 'Needs your approval', tone: 'approve' },
  admin: { label: 'New agent requested', tone: 'neutral' },
  sent: { label: 'Sent', tone: 'auto' },
  declined: { label: 'Declined', tone: 'alert' },
}

function Source({ r }: { r: CareRequest }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-ink-soft">
      {r.source === 'call' ? <Phone size={12} /> : <Smartphone size={12} />}
      {r.source === 'call' ? 'Said on call' : 'Tapped in app'}, {timeAgo(r.at)}
    </span>
  )
}

export function ApprovalCard({ r }: { r: CareRequest }) {
  const { setStatus } = useApp()
  return (
    <div className="rounded-3xl bg-card p-4 ring-2 ring-marigold/60">
      <div className="flex items-center justify-between gap-2">
        <Pill tone="approve">{r.agentEn}</Pill>
        <Source r={r} />
      </div>
      <h3 className="mt-2.5 text-lg font-semibold leading-snug">{r.titleEn}</h3>
      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{r.detailEn}</p>
      {r.quoteBn && <p className="mt-2.5 rounded-2xl bg-paper px-3 py-2 text-[15px]">"{r.quoteBn}"</p>}
      <div className="mt-3.5 grid grid-cols-2 gap-2.5">
        <button onClick={() => setStatus(r.id, 'declined')} className="flex h-12 items-center justify-center gap-1.5 rounded-full bg-paper font-semibold ring-1 ring-line active:scale-[0.98] transition">
          <X size={18} /> Decline
        </button>
        <button onClick={() => setStatus(r.id, 'done')} className="flex h-12 items-center justify-center gap-1.5 rounded-full bg-moss font-semibold text-card active:scale-[0.98] transition">
          <Check size={18} /> Approve
        </button>
      </div>
    </div>
  )
}

const filters = [
  { id: 'all', label: 'All' },
  { id: 'approval', label: 'To approve' },
  { id: 'done', label: 'Done' },
  { id: 'admin', label: 'New agents' },
] as const

export default function CareRequests() {
  const { requests, reset } = useApp()
  const [f, setF] = useState<(typeof filters)[number]['id']>('all')
  const list = requests.filter((r) => f === 'all' || r.status === f)

  return (
    <Screen className="pb-28">
      <header className="py-2">
        <h1 className="text-2xl font-bold">Requests</h1>
        <p className="text-sm text-ink-soft">What Ma asked for, and what the agents did about it.</p>
      </header>

      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
        {filters.map((x) => (
          <button
            key={x.id}
            onClick={() => setF(x.id)}
            className={`h-10 shrink-0 rounded-full px-4 text-sm font-medium transition ${f === x.id ? 'bg-marigold text-moss' : 'bg-card ring-1 ring-line'}`}
          >
            {x.label}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2.5">
        {list.length === 0 && <p className="rounded-3xl bg-card p-6 text-center text-ink-soft ring-1 ring-line">Nothing here. New requests from calls and the app show up here.</p>}
        {list.map((r) =>
          r.status === 'approval' ? (
            <ApprovalCard key={r.id} r={r} />
          ) : (
            <div key={r.id} className="rounded-3xl bg-card p-4 ring-1 ring-line">
              <div className="flex items-center justify-between gap-2">
                <Pill tone={statusMeta[r.status].tone}>{statusMeta[r.status].label}</Pill>
                <Source r={r} />
              </div>
              <h3 className="mt-2.5 font-semibold leading-snug">{r.titleEn}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{r.detailEn}</p>
              {r.quoteBn && <p className="mt-2.5 rounded-2xl bg-paper px-3 py-2 text-[15px]">"{r.quoteBn}"</p>}
              <p className="mt-2.5 text-xs text-ink-soft">Agent: {r.agentEn}</p>
            </div>
          ),
        )}
      </div>

      <button onClick={reset} className="mt-6 w-full rounded-full border border-dashed border-ink-soft/40 py-3 text-sm text-ink-soft">
        Reset demo data
      </button>
      <CareNav />
    </Screen>
  )
}
