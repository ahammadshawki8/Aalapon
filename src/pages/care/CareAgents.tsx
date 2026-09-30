import { useState } from 'react'
import { Bell, CircleDashed, Pill as PillIcon, ShieldCheck, ShoppingBasket, Siren, Stethoscope, UserRound } from 'lucide-react'
import { Card, CareNav, PageTitle, Screen } from '../../components/ui'
import { agents, newAgentRequests, type AgentDef } from '../../data/mock'

const icons = { phone: UserRound, basket: ShoppingBasket, pill: PillIcon, doctor: Stethoscope, bell: Bell, alert: Siren }
const tints = { phone: 'bg-mint text-moss-2', basket: 'bg-peach text-marigold-deep', pill: 'bg-lilac text-lilac-ink', doctor: 'bg-sky text-sky-ink', bell: 'bg-sage-soft text-moss-2', alert: 'bg-thread-soft text-thread' }

const flow = [
  { t: 'Ma asks', d: 'On the call or in her app' },
  { t: 'Aalapon understands', d: 'The need and how urgent it is' },
  { t: 'An agent acts', d: 'On its own, or after your OK' },
]

export default function CareAgents() {
  const [modes, setModes] = useState<Record<string, AgentDef['autonomy']>>(Object.fromEntries(agents.map((a) => [a.id, a.autonomy])))

  return (
    <Screen className="pb-28">
      <PageTitle title="Agents" sub="Helpers that turn Ma's requests into action. You choose which ones ask first." />

      <div className="grid grid-cols-3 gap-1.5 rounded-[22px] bg-moss p-1.5 text-white">
        {flow.map((s, i) => (
          <div key={s.t} className="rounded-[16px] bg-white/[0.06] p-2.5">
            <span className="grid size-6 place-items-center rounded-full bg-marigold text-[12px] font-bold text-moss">{i + 1}</span>
            <div className="mt-2 text-[13px] font-semibold leading-tight">{s.t}</div>
            <div className="mt-0.5 text-[11.5px] leading-snug text-white/55">{s.d}</div>
          </div>
        ))}
      </div>

      <h2 className="mb-2 mt-6 px-1 text-[15px] font-semibold">Active agents</h2>
      <Card className="divide-y divide-line overflow-hidden">
        {agents.map((a) => {
          const Icon = icons[a.icon]
          const mode = modes[a.id]
          return (
            <div key={a.id} className="p-3.5">
              <div className="flex items-start gap-3">
                <span className={`grid size-10 shrink-0 place-items-center rounded-[14px] ${tints[a.icon]}`}>
                  <Icon size={19} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[15px] font-semibold">{a.nameEn}</span>
                    <span className="text-[11.5px] text-ink-faint">{a.runsEn}</span>
                  </div>
                  <p className="mt-0.5 text-[13px] leading-snug text-ink-soft">{a.descEn}</p>
                  {a.icon !== 'alert' ? (
                    <div className="mt-2.5 inline-grid grid-cols-2 rounded-full bg-paper p-0.5" role="radiogroup" aria-label={`${a.nameEn} mode`}>
                      {(['auto', 'approve'] as const).map((m) => (
                        <button
                          key={m}
                          role="radio"
                          aria-checked={mode === m}
                          onClick={() => setModes({ ...modes, [a.id]: m })}
                          className={`h-8 rounded-full px-3 text-[12.5px] font-medium transition ${mode === m ? 'bg-white text-ink shadow-card' : 'text-ink-faint'}`}
                        >
                          {m === 'auto' ? 'Runs on its own' : 'Ask me first'}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 flex items-center gap-1.5 text-[12px] font-medium text-thread">
                      <ShieldCheck size={13} /> Always on, calls every caregiver at once
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </Card>

      <h2 className="mb-2 mt-6 px-1 text-[15px] font-semibold">No agent yet</h2>
      {newAgentRequests.map((n) => (
        <div key={n.id} className="rounded-[22px] border border-dashed border-ink-faint/40 p-4">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-ink-soft">
            <CircleDashed size={14} /> {n.statusEn}
          </div>
          <h3 className="mt-1.5 text-[16px] font-semibold">{n.titleEn}</h3>
          <p className="bn mt-1 text-[15px] text-ink/80">"{n.fromBn}"</p>
          <p className="mt-2 text-[13px] leading-snug text-ink-soft">
            Nothing can do this yet, so Aalapon asked the admin team. Once approved and built from vetted connectors, every family gets it.
          </p>
        </div>
      ))}
      <CareNav />
    </Screen>
  )
}
