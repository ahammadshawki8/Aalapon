import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check, Mic, Pill, ShoppingBasket, Siren, Stethoscope, UserRound } from 'lucide-react'
import { BackBar, Screen } from '../../components/ui'
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
      <Screen className="flex flex-col pb-8">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <span className="grid size-28 place-items-center rounded-full bg-sage text-moss">
            <Check size={56} strokeWidth={2.5} />
          </span>
          <h1 className="mt-6 text-3xl font-bold">{done}</h1>
          <p className="mt-3 max-w-[26ch] text-xl leading-relaxed text-ink-soft">{c.doneBn}</p>
        </div>
        <Link to="/elder" className="flex h-16 items-center justify-center rounded-full bg-moss text-xl font-bold text-card active:scale-[0.98] transition">
          ঠিক আছে
        </Link>
      </Screen>
    )
  }

  return (
    <Screen className="flex flex-col pb-8">
      <BackBar to="/elder" />
      <div className={`${c.bg} mt-3 flex items-center gap-4 rounded-4xl p-5`}>
        <span className="grid size-14 place-items-center rounded-full bg-card/80 text-moss">
          <Icon size={28} />
        </span>
        <h1 className="text-2xl font-bold">{c.titleBn}</h1>
      </div>
      <h2 className="mt-7 text-xl font-semibold">{c.askBn}</h2>
      <div className="mt-3 space-y-3">
        {c.options.map((o) => (
          <button key={o} onClick={() => pick(o)} className="flex min-h-16 w-full items-center rounded-3xl bg-card px-5 text-left text-xl font-semibold ring-1 ring-line active:scale-[0.98] active:bg-sage-soft transition">
            {o}
          </button>
        ))}
      </div>
      <div className="flex-1" />
      <button onClick={() => pick(c.options[0])} className="mt-8 flex flex-col items-center gap-2 self-center">
        <span className="grid size-20 place-items-center rounded-full bg-marigold text-moss shadow-[0_12px_30px_-12px_rgba(242,163,58,0.9)]">
          <Mic size={32} />
        </span>
        <span className="text-lg text-ink-soft">চেপে ধরে মুখে বলুন</span>
      </button>
    </Screen>
  )
}
