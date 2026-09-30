import { useState } from 'react'
import { Bell, Pill as PillIcon, ShieldCheck, ShoppingBasket, Siren, Stethoscope, UserRound } from 'lucide-react'
import { CareNav, Pill, Screen } from '../../components/ui'
import { agents, newAgentRequests, type AgentDef } from '../../data/mock'

const icons = { phone: UserRound, basket: ShoppingBasket, pill: PillIcon, doctor: Stethoscope, bell: Bell, alert: Siren }

const flow = [
  { t: 'Ma asks for something', d: 'On the call, or by tapping in her app' },
  { t: 'Aalapon understands the need', d: 'What she wants, how urgent it is' },
  { t: 'An agent that can do it?', d: 'Yes: it runs, or waits for your approval' },
  { t: 'No agent yet?', d: 'The admin reviews a request to create one' },
]

export default function CareAgents() {
  const [modes, setModes] = useState<Record<string, AgentDef['autonomy']>>(Object.fromEntries(agents.map((a) => [a.id, a.autonomy])))

  return (
    <Screen className="pb-28">
      <header className="py-2">
        <h1 className="text-2xl font-bold">Agents</h1>
        <p className="text-sm text-ink-soft">Helpers that act on what Ma asks for. You decide which ones need your approval.</p>
      </header>

      <section className="mt-3 rounded-4xl bg-moss p-5 text-card">
        <h2 className="font-semibold">How a request becomes help</h2>
        <ol className="mt-4 space-y-0">
          {flow.map((s, i) => (
            <li key={s.t} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold ${i === 3 ? 'bg-card/15 text-card' : 'bg-marigold text-moss'}`}>{i + 1}</span>
                {i < flow.length - 1 && <span className="my-1 w-0.5 flex-1 border-l-2 border-dashed border-card/30" />}
              </div>
              <div className="pb-4">
                <div className="font-semibold leading-tight">{s.t}</div>
                <div className="text-sm text-card/65">{s.d}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <h2 className="mt-6 mb-2.5 text-lg font-semibold">Active agents</h2>
      <div className="space-y-2.5">
        {agents.map((a) => {
          const Icon = icons[a.icon]
          const mode = modes[a.id]
          return (
            <div key={a.id} className="rounded-3xl bg-card p-4 ring-1 ring-line">
              <div className="flex items-start gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-sage-soft text-moss">
                  <Icon size={20} />
                </span>
                <div className="flex-1">
                  <div className="font-semibold leading-tight">{a.nameEn}</div>
                  <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">{a.descEn}</p>
                  <p className="mt-1 text-xs text-ink-soft">{a.runsEn}</p>
                </div>
              </div>
              {a.icon !== 'alert' ? (
                <div className="mt-3 grid grid-cols-2 rounded-full bg-paper p-1" role="radiogroup" aria-label={`${a.nameEn} mode`}>
                  {(['auto', 'approve'] as const).map((m) => (
                    <button
                      key={m}
                      role="radio"
                      aria-checked={mode === m}
                      onClick={() => setModes({ ...modes, [a.id]: m })}
                      className={`h-10 rounded-full text-sm font-medium transition ${mode === m ? 'bg-card shadow-sm ring-1 ring-line' : 'text-ink-soft'}`}
                    >
                      {m === 'auto' ? 'Runs on its own' : 'Ask me first'}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-soft">
                  <ShieldCheck size={14} /> Always on. Calls every caregiver at once.
                </p>
              )}
            </div>
          )
        })}
      </div>

      <h2 className="mt-6 mb-2.5 text-lg font-semibold">New agents requested</h2>
      {newAgentRequests.map((n) => (
        <div key={n.id} className="rounded-3xl border-2 border-dashed border-ink-soft/30 p-4">
          <Pill>{n.statusEn}</Pill>
          <h3 className="mt-2.5 font-semibold">{n.titleEn}</h3>
          <p className="mt-2 rounded-2xl bg-card px-3 py-2 text-[15px]">"{n.fromBn}"</p>
          <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
            No agent can do this yet. Aalapon sent the request to the admin team. Once approved and built from vetted connectors, it becomes available to every family.
          </p>
        </div>
      ))}
      <CareNav />
    </Screen>
  )
}
