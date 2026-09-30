import { Link } from 'react-router-dom'
import { Phone, Pill, ShoppingBasket, Siren, Smartphone, Stethoscope, UserRound, Users, Zap } from 'lucide-react'
import { BackBar, Card, Screen } from '../../components/ui'
import { timeAgoBn, useApp, type CareRequest } from '../../state/AppState'

const statusBn: Record<CareRequest['status'], { t: string; c: string }> = {
  done: { t: 'হয়ে গেছে', c: 'bg-sage-soft text-moss-2' },
  approval: { t: 'তানভীরের অনুমতির অপেক্ষায়', c: 'bg-marigold-soft text-marigold-deep' },
  admin: { t: 'ব্যবস্থা করা হচ্ছে', c: 'bg-paper text-ink-soft' },
  sent: { t: 'খবর পাঠানো হয়েছে', c: 'bg-mint text-moss-2' },
  declined: { t: 'এখন সম্ভব হয়নি', c: 'bg-thread-soft text-thread' },
}
const icons = { medicine: Pill, food: ShoppingBasket, doctor: Stethoscope, family: UserRound, unwell: Siren, bill: Zap }
const sourceBn = { call: { t: 'কলে বলেছেন', i: Phone }, portal: { t: 'অ্যাপে চেয়েছেন', i: Smartphone }, family: { t: 'পরিবার থেকে', i: Users } }

export default function ElderRequests() {
  const { requests } = useApp()
  return (
    <Screen className="bn pb-10">
      <BackBar title="আপনার অনুরোধ" to="/elder" />
      {requests.length === 0 ? (
        <Card className="p-6 text-center text-[17px] text-ink-soft">
          এখনো কোনো অনুরোধ নেই।
          <Link to="/elder" className="mt-3 block font-semibold text-moss-3">
            কী লাগবে বলুন
          </Link>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {requests.map((r) => {
            const Icon = icons[r.kind]
            const src = sourceBn[r.source]
            return (
              <Card key={r.id} className="flex gap-3.5 p-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-paper text-moss-2">
                  <Icon size={22} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[19px] font-bold leading-tight">{r.titleBn}</div>
                  <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-[15px] font-semibold ${statusBn[r.status].c}`}>{statusBn[r.status].t}</span>
                  <div className="mt-2 flex items-center gap-1.5 text-[14px] text-ink-faint">
                    <src.i size={14} /> {src.t}, {timeAgoBn(r.at)}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </Screen>
  )
}
