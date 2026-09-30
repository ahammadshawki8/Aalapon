import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { Check, ChevronRight, Footprints, HeartPulse, House, Moon, Pause, PhoneCall, PhoneIncoming, Pill, Play, ShoppingBasket, Siren, Stethoscope, UserRound } from 'lucide-react'
import { Card, Screen } from '../../components/ui'
import { MaAvatar, Mark } from '../../components/brand'
import { elder, vitals } from '../../data/mock'
import { timeToBn, toBn, useApp, type CareRequest, type VoiceNote } from '../../state/AppState'

const needs = [
  { type: 'medicine', bn: 'ওষুধ লাগবে', icon: Pill, bg: 'bg-lilac', ink: 'text-lilac-ink' },
  { type: 'food', bn: 'বাজার / খাবার', icon: ShoppingBasket, bg: 'bg-peach', ink: 'text-marigold-deep' },
  { type: 'doctor', bn: 'ডাক্তার দেখাবো', icon: Stethoscope, bg: 'bg-sky', ink: 'text-sky-ink' },
  { type: 'family', bn: 'ছেলেকে ডাকো', icon: UserRound, bg: 'bg-mint', ink: 'text-moss-2' },
] as const

const statusBn: Record<CareRequest['status'], string> = {
  done: 'হয়ে গেছে',
  approval: 'তানভীরের অনুমতির অপেক্ষায়',
  admin: 'ব্যবস্থা করা হচ্ছে',
  sent: 'খবর পাঠানো হয়েছে',
  declined: 'এখন সম্ভব হয়নি',
}

const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার']
const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর']

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'শুভ সকাল'
  if (h < 17) return 'শুভ দুপুর'
  if (h < 20) return 'শুভ সন্ধ্যা'
  return 'শুভ রাত্রি'
}

export default function ElderHome() {
  const { medsTaken, toggleMed, requests, medicines, callTime, voiceNotes } = useApp()
  const now = new Date()
  const next = medicines.find((m) => !medsTaken.includes(m.id))
  const takenCount = medicines.filter((m) => medsTaken.includes(m.id)).length
  const sleepH = Math.floor(vitals.sleepHours)
  const sleepM = Math.round((vitals.sleepHours - sleepH) * 60)

  return (
    <Screen className="bn pb-10">
      <header className="flex items-center gap-3 pt-2 pb-4">
        <MaAvatar size={48} />
        <div className="flex-1 leading-tight">
          <p className="text-[15px] text-ink-soft">{greeting()},</p>
          <h1 className="text-[24px] font-bold">{elder.nameBn}</h1>
        </div>
        <Link to="/" aria-label="প্রধান পাতা" className="press grid size-11 place-items-center rounded-full bg-card shadow-card">
          <House size={20} />
        </Link>
      </header>
      <p className="-mt-1 mb-4 text-[15px] text-ink-soft">
        আজ {days[now.getDay()]}, {toBn(now.getDate())} {months[now.getMonth()]}
      </p>

      <Link to="/elder/call" className="press relative flex items-center gap-4 overflow-hidden rounded-[26px] bg-moss p-4 pl-5 text-white shadow-float">
        <div className="pointer-events-none absolute -bottom-10 -left-8 opacity-10">
          <Mark size={140} a="#fff" b="#fff" lens="#1D3A2E" />
        </div>
        <div className="relative flex-1">
          <div className="text-[21px] font-bold leading-tight">আলাপনের সাথে কথা বলুন</div>
          <div className="mt-1 text-[15px] text-white/70">প্রতিদিন {timeToBn(callTime)} আলাপন কল করে</div>
        </div>
        <span className="relative grid size-16 shrink-0 place-items-center rounded-full bg-marigold text-moss">
          <span className="absolute inset-0 rounded-full bg-marigold animate-ring" />
          <PhoneCall size={26} className="relative" />
        </span>
      </Link>

      {voiceNotes[0] && <VoiceNoteCard note={voiceNotes[0]} />}

      <Card className="mt-3 p-4">
        <div className="flex items-center justify-between">
          <span className="text-[15px] font-semibold text-ink-soft">আজকের ওষুধ</span>
          <span className="flex items-center gap-1.5 text-[14px] text-ink-soft">
            {medicines.map((m) => (
              <span key={m.id} className={`size-2.5 rounded-full ${medsTaken.includes(m.id) ? 'bg-sage' : 'bg-line'}`} />
            ))}
            <span className="ml-1">{toBn(medicines.length)}টির {toBn(takenCount)}টি খাওয়া</span>
          </span>
        </div>
        {next ? (
          <div className="mt-3 flex items-center gap-3">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-lilac text-lilac-ink">
              <Pill size={22} />
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="text-[15px] font-semibold text-moss-3">{next.timeBn}</div>
              <div className="text-[19px] font-bold">{next.purposeBn}</div>
              <div className="truncate text-[14px] text-ink-faint">{next.bn}</div>
            </div>
            <button onClick={() => toggleMed(next.id)} className="press h-12 shrink-0 rounded-full bg-marigold px-5 text-[18px] font-bold text-moss">
              খেয়েছি
            </button>
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-3 text-[18px] font-semibold text-moss-2">
            <span className="grid size-12 place-items-center rounded-2xl bg-sage-soft">
              <Check size={24} />
            </span>
            আজকের সব ওষুধ খাওয়া হয়েছে
          </div>
        )}
        {takenCount > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5 border-t border-line pt-3">
            {medicines
              .filter((m) => medsTaken.includes(m.id))
              .map((m) => (
                <button key={m.id} onClick={() => toggleMed(m.id)} className="flex h-8 items-center gap-1 rounded-full bg-sage-soft px-3 text-[14px] font-medium text-moss-2">
                  <Check size={14} /> {m.timeBn}
                </button>
              ))}
          </div>
        )}
      </Card>

      <h2 className="mt-6 mb-2.5 px-1 text-[18px] font-bold">কী লাগবে, বলুন</h2>
      <div className="grid grid-cols-2 gap-2.5">
        {needs.map(({ type, bn, icon: Icon, bg, ink }) => (
          <Link key={type} to={`/elder/need/${type}`} className={`press ${bg} flex h-[104px] flex-col justify-between rounded-[22px] p-3.5`}>
            <span className={`grid size-10 place-items-center rounded-full bg-white/75 ${ink}`}>
              <Icon size={21} />
            </span>
            <span className="text-[19px] font-bold leading-tight">{bn}</span>
          </Link>
        ))}
      </div>
      <Link to="/elder/need/unwell" className="press mt-2.5 flex h-14 items-center gap-3 rounded-[20px] bg-thread-soft px-3.5 text-thread">
        <span className="grid size-9 place-items-center rounded-full bg-thread text-white">
          <Siren size={18} />
        </span>
        <span className="flex-1 text-[19px] font-bold">শরীর খারাপ লাগছে</span>
        <span className="text-[14px] font-medium opacity-80">সবাইকে খবর দিন</span>
      </Link>

      <Link to="/elder/watch" className="mt-6 mb-2.5 flex items-center justify-between px-1">
        <h2 className="text-[18px] font-bold">ঘড়ি যা বলছে</h2>
        <span className="flex items-center text-[15px] font-medium text-moss-3">বিস্তারিত <ChevronRight size={18} /></span>
      </Link>
      <Link to="/elder/watch" className="press block overflow-hidden rounded-[22px] bg-card shadow-card">
        <div className="grid grid-cols-3 divide-x divide-line py-3.5">
          <Stat icon={<HeartPulse size={18} className="text-thread" />} value={toBn(vitals.heartRate)} label="হৃদস্পন্দন" />
          <Stat icon={<Moon size={18} className="text-lilac-ink" />} value={`${toBn(sleepH)}:${toBn(String(sleepM).padStart(2, '0'))}`} label="ঘণ্টা ঘুম" />
          <Stat icon={<Footprints size={18} className="text-marigold-deep" />} value={toBn(vitals.steps.toLocaleString('en-US'))} label="পদক্ষেপ" />
        </div>
        <div className="flex items-start gap-2.5 bg-sage-soft/70 px-4 py-3 text-[16px] leading-snug text-moss">
          <Mark size={20} />
          <span>কাল রাতে ঘুম কম হয়েছে। আজ দুপুরে একটু বিশ্রাম নিন।</span>
        </div>
      </Link>

      {requests.length > 0 && (
        <>
          <Link to="/elder/requests" className="mt-6 mb-2.5 flex items-center justify-between px-1">
            <h2 className="text-[18px] font-bold">আপনার অনুরোধ</h2>
            <span className="flex items-center text-[15px] font-medium text-moss-3">সব দেখুন <ChevronRight size={18} /></span>
          </Link>
          <Card className="divide-y divide-line">
            {requests.slice(0, 3).map((r) => (
              <div key={r.id} className="flex items-center gap-3 px-4 py-3">
                <span className={`size-2.5 shrink-0 rounded-full ${r.status === 'done' ? 'bg-sage' : r.status === 'declined' ? 'bg-thread' : 'bg-marigold'}`} />
                <span className="flex-1 text-[17px] font-semibold">{r.titleBn}</span>
                <span className="text-right text-[14px] text-ink-soft">{statusBn[r.status]}</span>
              </div>
            ))}
          </Card>
        </>
      )}

      <Link to="/elder/call?mode=incoming" className="mt-8 flex h-11 items-center justify-center gap-2 rounded-full text-[14px] text-ink-faint border border-dashed border-ink-faint/40">
        <PhoneIncoming size={15} /> ডেমো: আলাপন থেকে কল আসা দেখুন
      </Link>
    </Screen>
  )
}

function Stat({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      {icon}
      <span className="text-[22px] font-bold leading-none">{value}</span>
      <span className="text-[13px] text-ink-soft">{label}</span>
    </div>
  )
}

function VoiceNoteCard({ note }: { note: VoiceNote }) {
  const { patch } = useApp()
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audio = useRef<HTMLAudioElement | null>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => {
    window.clearInterval(timer.current)
    audio.current?.pause()
  }, [])

  const finish = () => {
    window.clearInterval(timer.current)
    setPlaying(false)
    setProgress(1)
    patch((s) => ({ voiceNotes: s.voiceNotes.map((v) => (v.id === note.id ? { ...v, played: true } : v)) }))
  }

  const toggle = () => {
    if (playing) {
      audio.current?.pause()
      window.clearInterval(timer.current)
      setPlaying(false)
      return
    }
    setPlaying(true)
    const startAt = progress >= 1 ? 0 : progress
    if (note.dataUrl) {
      if (!audio.current) {
        audio.current = new Audio(note.dataUrl)
        audio.current.onended = finish
        audio.current.ontimeupdate = () => {
          const a = audio.current!
          if (a.duration && isFinite(a.duration)) setProgress(a.currentTime / a.duration)
        }
      }
      if (startAt === 0) audio.current.currentTime = 0
      audio.current.play().catch(() => simulate(startAt))
    } else simulate(startAt)
  }

  const simulate = (from: number) => {
    const total = Math.max(1, note.secs) * 1000
    const t0 = Date.now() - from * total
    timer.current = window.setInterval(() => {
      const p = (Date.now() - t0) / total
      if (p >= 1) finish()
      else setProgress(p)
    }, 100)
  }

  return (
    <div className="mt-3 flex items-center gap-3 rounded-[22px] bg-marigold-soft p-3.5">
      <button onClick={toggle} aria-label={playing ? 'থামান' : 'শুনুন'} className="press grid size-14 shrink-0 place-items-center rounded-full bg-moss text-white">
        {playing ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-0.5" />}
      </button>
      <div className="min-w-0 flex-1">
        <div className="text-[17px] font-bold leading-tight">তানভীরের ভয়েস মেসেজ</div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/80">
          <div className="h-full rounded-full bg-marigold-deep transition-[width] duration-100" style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
        <div className="mt-1 text-[14px] text-ink-soft">{note.played ? 'শোনা হয়েছে' : 'নতুন'}, {toBn(Math.max(1, note.secs))} সেকেন্ড</div>
      </div>
    </div>
  )
}
