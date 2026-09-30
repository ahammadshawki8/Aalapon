import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check, ChevronRight, Mic, Pill, ShoppingBasket, Siren, Stethoscope, UserRound } from 'lucide-react'
import { BackBar, Card, Screen } from '../../components/ui'
import { useApp, type CareRequest } from '../../state/AppState'

type Cfg = {
  icon: typeof Pill
  bg: string
  titleBn: string
  askBn: string
  options: string[]
  req: (choice: string) => Omit<CareRequest, 'id' | 'at'>
  doneBn: string
}

const cfg: Record<string, Cfg> = {
  medicine: {
    icon: Pill,
    bg: 'bg-lilac',
    titleBn: 'ওষুধ লাগবে',
    askBn: 'কোন ওষুধ লাগবে?',
    options: ['প্রেসারের ওষুধ', 'ডায়াবেটিসের ওষুধ', 'ক্যালসিয়াম'],
    req: (c) => ({ kind: 'medicine', titleEn: `Medicine refill: ${c === 'প্রেসারের ওষুধ' ? 'Amlodipine 5 mg' : c === 'ডায়াবেটিসের ওষুধ' ? 'Metformin 500 mg' : 'Calcium + Vitamin D'}`, titleBn: c, detailEn: 'Requested from the elder app. The pharmacy agent is ready once you approve.', source: 'portal', status: 'approval', agentEn: 'Medicine refill' }),
    doneBn: 'তানভীরের কাছে অনুমোদনের জন্য পাঠানো হয়েছে।',
  },
  food: {
    icon: ShoppingBasket,
    bg: 'bg-peach',
    titleBn: 'বাজার / খাবার',
    askBn: 'কী আনাতে চান?',
    options: ['চাল, ডাল, ডিম', 'সবজি আর মাছ', 'দুপুরের খাবার'],
    req: (c) => ({ kind: 'food', titleEn: 'Groceries ordered', titleBn: c, detailEn: `Ordered "${c}" from her usual list through the partner grocer. Arriving today.`, source: 'portal', status: 'done', agentEn: 'Grocery order' }),
    doneBn: 'অর্ডার দেওয়া হয়েছে। আজকেই পৌঁছে যাবে।',
  },
  doctor: {
    icon: Stethoscope,
    bg: 'bg-sky',
    titleBn: 'ডাক্তার দেখাবো',
    askBn: 'কী সমস্যা হচ্ছে?',
    options: ['হাঁটুতে ব্যথা', 'প্রেসার চেক', 'অন্য সমস্যা'],
    req: (c) => ({ kind: 'doctor', titleEn: 'Doctor appointment', titleBn: `ডাক্তার: ${c}`, detailEn: `She wants to see a doctor for: ${c}. The appointment agent found a slot on Saturday at 11 AM.`, source: 'portal', status: 'approval', agentEn: 'Doctor appointment' }),
    doneBn: 'তানভীরকে জানানো হয়েছে। অনুমতি দিলেই সিরিয়াল দেওয়া হবে।',
  },
  family: {
    icon: UserRound,
    bg: 'bg-mint',
    titleBn: 'কাকে ডাকবো?',
    askBn: 'কার সাথে কথা বলতে চান?',
    options: ['তানভীর', 'নাবিলা'],
    req: (c) => ({ kind: 'family', titleEn: `Asked ${c === 'তানভীর' ? 'Tanvir' : 'Nabila'} to call her`, titleBn: `${c}কে কল`, detailEn: 'A text and a push notification were sent.', source: 'portal', status: 'sent', agentEn: 'Family contact' }),
    doneBn: 'খবর পাঠানো হয়েছে। একটু পরেই কল আসবে।',
  },
  unwell: {
    icon: Siren,
    bg: 'bg-thread-soft',
    titleBn: 'শরীর খারাপ লাগছে',
    askBn: 'কেমন লাগছে?',
    options: ['মাথা ঘুরছে', 'বুকে ব্যথা', 'খুব দুর্বল লাগছে'],
    req: (c) => ({ kind: 'unwell', titleEn: `Feels unwell: ${c === 'মাথা ঘুরছে' ? 'dizzy' : c === 'বুকে ব্যথা' ? 'chest pain' : 'very weak'}`, titleBn: c, detailEn: 'Urgent help agent called every caregiver. If nobody answers in 5 minutes, it calls the neighbour on file.', source: 'portal', status: 'sent', agentEn: 'Urgent help' }),
    doneBn: 'তানভীর আর নাবিলাকে এখনই কল করা হচ্ছে। খুব খারাপ লাগলে ৯৯৯ এ কল করুন।',
  },
}

export default function ElderNeed() {
  const { type = 'medicine' } = useParams()
  const c = cfg[type] ?? cfg.medicine
  const { addRequest } = useApp()
  const [done, setDone] = useState<string | null>(null)
  const Icon = c.icon

  const pick = (o: string) => {
    addRequest(c.req(o))
    setDone(o)
  }

  if (done) {
    return (
      <Screen className="bn flex flex-col pb-[max(env(safe-area-inset-bottom),20px)]">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <span className="relative grid size-24 place-items-center rounded-full bg-sage-soft text-moss-2">
            <span className="absolute inset-0 rounded-full bg-sage/40 animate-ring" />
            <Check size={48} strokeWidth={2.6} className="relative" />
          </span>
          <h1 className="mt-6 text-[28px] font-bold leading-tight">{done}</h1>
          <p className="mt-2 max-w-[26ch] text-[18px] leading-relaxed text-ink-soft">{c.doneBn}</p>
        </div>
        <Link to="/elder" className="press flex h-14 items-center justify-center rounded-full bg-moss text-[19px] font-bold text-white">
          ঠিক আছে
        </Link>
      </Screen>
    )
  }

  return (
    <Screen className="bn flex flex-col pb-[max(env(safe-area-inset-bottom),20px)]">
      <BackBar to="/elder" />
      <div className="flex items-center gap-3.5 pt-1">
        <span className={`${c.bg} grid size-14 place-items-center rounded-[18px] text-moss`}>
          <Icon size={26} />
        </span>
        <div>
          <h1 className="text-[26px] font-bold leading-tight">{c.titleBn}</h1>
          <p className="text-[16px] text-ink-soft">{c.askBn}</p>
        </div>
      </div>
      <Card className="mt-5 divide-y divide-line overflow-hidden">
        {c.options.map((o) => (
          <button key={o} onClick={() => pick(o)} className="flex min-h-[62px] w-full items-center justify-between px-4 text-left text-[19px] font-semibold active:bg-sage-soft">
            {o}
            <ChevronRight size={20} className="text-ink-faint" />
          </button>
        ))}
      </Card>
      <div className="flex-1" />
      <div className="mt-8 flex flex-col items-center gap-2.5">
        <p className="text-[16px] text-ink-soft">অথবা মুখে বলুন</p>
        <button onClick={() => pick(c.options[0])} aria-label="মুখে বলুন" className="press relative grid size-20 place-items-center rounded-full bg-marigold text-moss shadow-[0_14px_30px_-12px_rgba(244,163,64,0.9)]">
          <span className="absolute inset-0 rounded-full bg-marigold/50 animate-ring" />
          <Mic size={30} className="relative" />
        </button>
      </div>
    </Screen>
  )
}
