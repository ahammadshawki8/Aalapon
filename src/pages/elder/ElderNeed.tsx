import { useEffect, useState } from 'react'
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

const heard: Record<string, { said: string; option: number }> = {
  medicine: { said: 'প্রেসারের ওষুধটা শেষ হয়ে গেছে', option: 0 },
  food: { said: 'চাল, ডাল আর ডিম লাগবে', option: 0 },
  doctor: { said: 'হাঁটুর ব্যথাটা বেড়েছে, ডাক্তার দেখাতে চাই', option: 0 },
  family: { said: 'তানভীরের সাথে একটু কথা বলতে চাই', option: 0 },
  unwell: { said: 'খুব দুর্বল লাগছে, মাথাও ঘুরছে', option: 2 },
}

export default function ElderNeed() {
  const { type = 'medicine' } = useParams()
  const c = cfg[type] ?? cfg.medicine
  const { addRequest, agentModes } = useApp()
  const [done, setDone] = useState<{ choice: string; msg: string } | null>(null)
  const [voice, setVoice] = useState<'off' | 'listening' | 'heard'>('off')
  const Icon = c.icon
  const h = heard[type] ?? heard.medicine

  useEffect(() => {
    if (voice !== 'listening') return
    const t = setTimeout(() => setVoice('heard'), 2600)
    return () => clearTimeout(t)
  }, [voice])

  const pick = (o: string) => {
    const req = c.req(o)
    const autoAgent = (req.kind === 'medicine' && agentModes.a3 === 'auto') || (req.kind === 'doctor' && agentModes.a4 === 'auto')
    if (autoAgent) {
      addRequest({ ...req, status: 'done', detailEn: `${req.detailEn.split('.')[0]}. Done automatically by the ${req.agentEn.toLowerCase()} agent.` })
      setDone({ choice: o, msg: req.kind === 'medicine' ? 'অর্ডার দেওয়া হয়েছে। আজকেই পৌঁছে যাবে।' : 'সিরিয়াল দেওয়া হয়েছে। আগের দিন মনে করিয়ে দেবো।' })
    } else {
      addRequest(req)
      setDone({ choice: o, msg: c.doneBn })
    }
  }

  if (done) {
    return (
      <Screen className="bn flex flex-col pb-[max(env(safe-area-inset-bottom),20px)]">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <span className="relative grid size-24 place-items-center rounded-full bg-sage-soft text-moss-2">
            <span className="absolute inset-0 rounded-full bg-sage/40 animate-ring" />
            <Check size={48} strokeWidth={2.6} className="relative" />
          </span>
          <h1 className="mt-6 text-[28px] font-bold leading-tight">{done.choice}</h1>
          <p className="mt-2 max-w-[26ch] text-[18px] leading-relaxed text-ink-soft">{done.msg}</p>
        </div>
        <div className="space-y-2">
          <Link to="/elder/requests" className="press flex h-14 items-center justify-center rounded-full bg-card text-[18px] font-semibold shadow-card">
            আমার অনুরোধগুলো দেখুন
          </Link>
          <Link to="/elder" className="press flex h-14 items-center justify-center rounded-full bg-moss text-[19px] font-bold text-white">
            ঠিক আছে
          </Link>
        </div>
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

      {voice === 'off' && (
        <Card className="mt-5 divide-y divide-line overflow-hidden">
          {c.options.map((o) => (
            <button key={o} onClick={() => pick(o)} className="flex min-h-[62px] w-full items-center justify-between px-4 text-left text-[19px] font-semibold active:bg-sage-soft">
              {o}
              <ChevronRight size={20} className="text-ink-faint" />
            </button>
          ))}
        </Card>
      )}

      {voice === 'listening' && (
        <Card className="mt-5 flex flex-col items-center px-4 py-8 text-center">
          <div className="flex h-10 items-center gap-1" aria-hidden>
            {Array.from({ length: 14 }).map((_, i) => (
              <span key={i} className="h-full w-1.5 origin-center rounded-full bg-marigold animate-wave" style={{ animationDelay: `${(i % 5) * 0.13}s` }} />
            ))}
          </div>
          <p className="mt-4 text-[22px] font-bold">শুনছি...</p>
          <p className="text-[16px] text-ink-soft">আপনার মতো করে বলুন</p>
        </Card>
      )}

      {voice === 'heard' && (
        <Card className="mt-5 p-5">
          <p className="text-[15px] text-ink-soft">আপনি বললেন</p>
          <p className="mt-1 text-[22px] font-bold leading-snug">"{h.said}"</p>
          <p className="mt-3 text-[16px] text-ink-soft">
            আলাপন বুঝেছে: <span className="font-semibold text-moss-2">{c.options[h.option]}</span>
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button onClick={() => setVoice('listening')} className="press h-14 rounded-full bg-paper text-[17px] font-semibold">
              আবার বলি
            </button>
            <button onClick={() => pick(c.options[h.option])} className="press h-14 rounded-full bg-moss text-[17px] font-bold text-white">
              হ্যাঁ, পাঠান
            </button>
          </div>
        </Card>
      )}

      <div className="flex-1" />
      {voice === 'off' ? (
        <div className="mt-8 flex flex-col items-center gap-2.5">
          <p className="text-[16px] text-ink-soft">অথবা মুখে বলুন</p>
          <button onClick={() => setVoice('listening')} aria-label="মুখে বলুন" className="press relative grid size-20 place-items-center rounded-full bg-marigold text-moss shadow-[0_14px_30px_-12px_rgba(244,163,64,0.9)]">
            <span className="absolute inset-0 rounded-full bg-marigold/50 animate-ring" />
            <Mic size={30} className="relative" />
          </button>
        </div>
      ) : (
        <button onClick={() => setVoice('off')} className="mt-8 h-12 text-[16px] font-medium text-ink-soft">
          বাতিল, তালিকা থেকে বেছে নেবো
        </button>
      )}
    </Screen>
  )
}
