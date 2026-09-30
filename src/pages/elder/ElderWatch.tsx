import type { ReactNode } from 'react'
import { Droplets, Footprints, HeartPulse, Moon, ShieldCheck } from 'lucide-react'
import { BackBar, Card, Screen } from '../../components/ui'
import { vitals } from '../../data/mock'
import { toBn, useApp } from '../../state/AppState'

const daysBn = ['বৃহঃ', 'শুক্র', 'শনি', 'রবি', 'সোম', 'মঙ্গল', 'বুধ']

export default function ElderWatch() {
  const { consent, patch, toast } = useApp()
  const sleepH = Math.floor(vitals.sleepHours)
  const sleepM = Math.round((vitals.sleepHours - sleepH) * 60)
  const maxSleep = 8

  return (
    <Screen className="bn pb-10">
      <BackBar title="ঘড়ির খবর" to="/elder" />

      <Card className="p-4">
        <div className="flex items-center gap-2 text-[16px] font-semibold text-lilac-ink">
          <Moon size={20} /> রাতের ঘুম
        </div>
        <div className="mt-1 text-[34px] font-bold leading-tight">
          {toBn(sleepH)} ঘণ্টা {toBn(sleepM)} মিনিট
        </div>
        <p className="text-[17px] leading-snug text-ink-soft">গত কয়েক রাত ঘুম কম হচ্ছে। দুপুরে একটু বিশ্রাম নিন, রাতে চা কম খান।</p>
        <div className="mt-4 flex h-28 items-end gap-2">
          {vitals.sleepWeek.map((v, i) => (
            <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
              <div className={`w-full rounded-lg ${v < 5 ? 'bg-thread/80' : 'bg-[#9C8BD6]/70'}`} style={{ height: `${(v / maxSleep) * 100}%` }} />
              <span className={`text-[13px] ${i === 6 ? 'font-bold text-ink' : 'text-ink-faint'}`}>{daysBn[i]}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-2.5 grid grid-cols-2 gap-2.5">
        <Tile icon={<HeartPulse size={20} />} tint="text-thread" title="হৃদস্পন্দন" value={toBn(vitals.heartRate)} unit="প্রতি মিনিটে" note="স্বাভাবিক আছে" />
        <Tile icon={<Droplets size={20} />} tint="text-sky-ink" title="অক্সিজেন" value={`${toBn(vitals.spo2)}%`} unit="রক্তে" note="ভালো আছে" />
        <Tile icon={<Footprints size={20} />} tint="text-marigold-deep" title="আজ হেঁটেছেন" value={toBn(vitals.steps.toLocaleString('en-US'))} unit="পদক্ষেপ" note={`লক্ষ্য ${toBn('3,000')}`} />
        <Tile icon={<ShieldCheck size={20} />} tint="text-moss-3" title="ঘড়ি" value="যুক্ত" unit="" note="৬ মিনিট আগে আপডেট" />
      </div>

      <Card className="mt-2.5 flex items-center justify-between gap-3 p-4">
        <div className="leading-snug">
          <div className="text-[17px] font-bold">পরিবারের সাথে শেয়ার</div>
          <div className="text-[15px] text-ink-soft">{consent.watch ? 'তানভীর আর নাবিলা দেখতে পারছেন' : 'এখন কেউ দেখতে পারছেন না'}</div>
        </div>
        <button
          role="switch"
          aria-checked={consent.watch}
          aria-label="পরিবারের সাথে শেয়ার"
          onClick={() => {
            patch((s) => ({ consent: { ...s.consent, watch: !s.consent.watch } }))
            toast(consent.watch ? 'শেয়ার বন্ধ করা হলো' : 'শেয়ার চালু করা হলো')
          }}
          className={`relative h-9 w-16 shrink-0 rounded-full transition-colors ${consent.watch ? 'bg-moss-3' : 'bg-line'}`}
        >
          <span className={`absolute top-1 size-7 rounded-full bg-white shadow transition-all ${consent.watch ? 'left-8' : 'left-1'}`} />
        </button>
      </Card>
      <p className="mt-3 px-1 text-[14px] leading-relaxed text-ink-faint">এই তথ্য শুধু খেয়াল রাখার জন্য, এটা ডাক্তারের পরীক্ষা নয়। শরীর খারাপ লাগলে ডাক্তার দেখান।</p>
    </Screen>
  )
}

function Tile({ icon, tint, title, value, unit, note }: { icon: ReactNode; tint: string; title: string; value: string; unit: string; note: string }) {
  return (
    <Card className="p-4">
      <div className={`flex items-center gap-1.5 text-[15px] font-semibold ${tint}`}>
        {icon}
        <span className="text-ink-soft">{title}</span>
      </div>
      <div className="mt-2 text-[26px] font-bold leading-none">{value}</div>
      {unit && <div className="text-[14px] text-ink-faint">{unit}</div>}
      <div className="mt-1.5 text-[15px] font-medium text-moss-2">{note}</div>
    </Card>
  )
}
