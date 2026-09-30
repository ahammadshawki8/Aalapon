import { Link } from 'react-router-dom'
import { Check, Footprints, HeartPulse, Moon, PhoneCall, PhoneIncoming, Pill, ShoppingBasket, Stethoscope, UserRound, Siren } from 'lucide-react'
import { Logo, Screen } from '../../components/ui'
import { elder, medicines, vitals } from '../../data/mock'
import { toBn, useApp, type CareRequest } from '../../state/AppState'

export const needs = [
  { type: 'medicine', bn: 'ওষুধ লাগবে', icon: Pill, bg: 'bg-lilac' },
  { type: 'food', bn: 'বাজার / খাবার', icon: ShoppingBasket, bg: 'bg-peach' },
  { type: 'doctor', bn: 'ডাক্তার দেখাবো', icon: Stethoscope, bg: 'bg-sky' },
  { type: 'family', bn: 'ছেলেকে ডাকো', icon: UserRound, bg: 'bg-mint' },
] as const

const statusBn: Record<CareRequest['status'], string> = {
  done: 'সম্পন্ন হয়েছে',
  approval: 'তানভীরের অনুমোদনের অপেক্ষায়',
  admin: 'ব্যবস্থা করা হচ্ছে',
  sent: 'পাঠানো হয়েছে',
  declined: 'এখন সম্ভব হয়নি',
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'শুভ সকাল'
  if (h < 17) return 'শুভ দুপুর'
  if (h < 20) return 'শুভ সন্ধ্যা'
  return 'শুভ রাত্রি'
}

export default function ElderHome() {
  const { medsTaken, toggleMed, requests } = useApp()
  const recent = requests.slice(0, 3)
  const sleepH = Math.floor(vitals.sleepHours)
  const sleepM = Math.round((vitals.sleepHours - sleepH) * 60)

  return (
    <Screen className="pb-10">
      <header className="flex items-center justify-between py-2">
        <Logo />
        <Link to="/" className="rounded-full border border-line bg-card px-4 py-2 text-sm font-medium">
          প্রধান পাতা
        </Link>
      </header>

      <section className="mt-4">
        <p className="text-xl text-ink-soft">{greeting()},</p>
        <h1 className="text-[2.4rem] font-bold leading-tight">{elder.nameBn}</h1>
      </section>

      <Link
        to="/elder/call"
        className="mt-5 flex items-center gap-4 rounded-4xl bg-moss p-5 text-card shadow-[0_18px_40px_-18px_rgba(31,58,46,0.7)] active:scale-[0.98] transition"
      >
        <span className="relative grid size-16 shrink-0 place-items-center rounded-full bg-marigold text-moss">
          <span className="absolute inset-0 rounded-full bg-marigold/50 animate-ring" />
          <PhoneCall size={28} className="relative" />
        </span>
        <span>
          <span className="block text-2xl font-bold leading-tight">আলাপনের সাথে কথা বলুন</span>
          <span className="block text-base text-card/75">পরবর্তী কল: কাল সকাল ৯টা</span>
        </span>
      </Link>

      <section className="mt-7">
        <h2 className="mb-3 text-xl font-semibold">কী লাগবে বলুন</h2>
        <div className="grid grid-cols-2 gap-3">
          {needs.map(({ type, bn, icon: Icon, bg }) => (
            <Link key={type} to={`/elder/need/${type}`} className={`${bg} flex min-h-32 flex-col justify-between rounded-4xl p-4 active:scale-[0.97] transition`}>
              <span className="grid size-12 place-items-center rounded-full bg-card/80 text-moss">
                <Icon size={24} />
              </span>
              <span className="text-xl font-semibold leading-snug">{bn}</span>
            </Link>
          ))}
        </div>
        <Link
          to="/elder/need/unwell"
          className="mt-3 flex items-center gap-4 rounded-4xl border-2 border-thread/40 bg-thread-soft p-4 text-thread active:scale-[0.98] transition"
        >
          <span className="grid size-12 place-items-center rounded-full bg-thread text-card">
            <Siren size={24} />
          </span>
          <span className="text-xl font-semibold">শরীর খারাপ লাগছে</span>
        </Link>
      </section>

      <section className="mt-7">
        <h2 className="mb-3 text-xl font-semibold">আজকের ওষুধ</h2>
        <div className="space-y-2.5">
          {medicines.map((m) => {
            const taken = medsTaken.includes(m.id)
            return (
              <div key={m.id} className="flex items-center gap-3 rounded-3xl bg-card p-3.5 ring-1 ring-line">
                <div className="flex-1">
                  <div className="text-lg font-semibold leading-snug">{m.purposeBn}</div>
                  <div className="text-base font-medium text-moss-2">{m.timeBn}</div>
                  <div className="text-sm text-ink-soft">{m.bn}</div>
                </div>
                <button
                  onClick={() => toggleMed(m.id)}
                  aria-pressed={taken}
                  className={`flex h-14 min-w-28 shrink-0 items-center justify-center gap-1.5 rounded-full px-4 text-lg font-semibold transition active:scale-95 ${
                    taken ? 'bg-sage-soft text-moss' : 'bg-marigold text-moss'
                  }`}
                >
                  {taken && <Check size={20} />}
                  {taken ? 'খাওয়া হয়েছে' : 'খেয়েছি'}
                </button>
              </div>
            )
          })}
        </div>
      </section>

      <section className="mt-7">
        <h2 className="mb-3 text-xl font-semibold">ঘড়ি থেকে আজকের খবর</h2>
        <div className="grid grid-cols-3 gap-2.5">
          <div className="rounded-3xl bg-card p-3 ring-1 ring-line">
            <HeartPulse className="text-thread" size={22} />
            <div className="mt-2 text-2xl font-bold">{toBn(vitals.heartRate)}</div>
            <div className="text-sm text-ink-soft">হৃদস্পন্দন</div>
          </div>
          <div className="rounded-3xl bg-card p-3 ring-1 ring-line">
            <Moon className="text-moss-2" size={22} />
            <div className="mt-2 text-2xl font-bold">
              {toBn(sleepH)}<span className="text-base font-medium">ঘ</span> {toBn(sleepM)}<span className="text-base font-medium">মি</span>
            </div>
            <div className="text-sm text-ink-soft">ঘুম</div>
          </div>
          <div className="rounded-3xl bg-card p-3 ring-1 ring-line">
            <Footprints className="text-[#b9761d]" size={22} />
            <div className="mt-2 text-2xl font-bold">{toBn(vitals.steps.toLocaleString('en-US'))}</div>
            <div className="text-sm text-ink-soft">পদক্ষেপ</div>
          </div>
        </div>
        <p className="mt-2.5 rounded-3xl bg-sage-soft p-3.5 text-base leading-relaxed text-moss">
          কাল রাতে ঘুম একটু কম হয়েছে। আজ দুপুরে একটু বিশ্রাম নিন।
        </p>
      </section>

      {recent.length > 0 && (
        <section className="mt-7">
          <h2 className="mb-3 text-xl font-semibold">আপনার অনুরোধ</h2>
          <div className="space-y-2.5">
            {recent.map((r) => (
              <div key={r.id} className="flex items-center gap-3 rounded-3xl bg-card p-3.5 ring-1 ring-line">
                <span className={`size-3 shrink-0 rounded-full ${r.status === 'done' ? 'bg-sage' : r.status === 'declined' ? 'bg-thread' : 'bg-marigold'}`} />
                <div className="flex-1">
                  <div className="text-lg font-semibold leading-snug">{r.titleBn}</div>
                  <div className="text-base text-ink-soft">{statusBn[r.status]}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <Link
        to="/elder/call?mode=incoming"
        className="mt-8 flex items-center justify-center gap-2 rounded-full border border-dashed border-ink-soft/40 py-3 text-sm text-ink-soft"
      >
        <PhoneIncoming size={16} /> ডেমো: আলাপন থেকে কল আসা দেখুন
      </Link>
    </Screen>
  )
}
