import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Check, Mic, MicOff, Phone, PhoneOff, ShoppingBasket, Moon, Pill, Video, VideoOff, Volume2 } from 'lucide-react'
import { StitchOrb } from '../../components/ui'
import { callScript } from '../../data/mock'
import { toBn, useApp } from '../../state/AppState'

type Phase = 'ringing' | 'connecting' | 'live' | 'ended'

const detections = [
  { afterTurn: 1, icon: Moon, bn: 'ঘুম কম হচ্ছে', noteBn: 'পরিবারকে জানানো হবে' },
  { afterTurn: 3, icon: Pill, bn: 'প্রেসারের ওষুধ শেষের পথে', noteBn: 'তানভীরের অনুমোদনে পাঠানো হলো' },
  { afterTurn: 5, icon: ShoppingBasket, bn: 'চাল আর ডিম', noteBn: 'অর্ডার দেওয়া হয়েছে' },
]

function fmt(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return toBn(`${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`)
}

export default function ElderCall() {
  const [params] = useSearchParams()
  const nav = useNavigate()
  const { addRequest } = useApp()
  const [phase, setPhase] = useState<Phase>(params.get('mode') === 'incoming' ? 'ringing' : 'connecting')
  const [turn, setTurn] = useState(0)
  const [secs, setSecs] = useState(0)
  const [muted, setMuted] = useState(false)
  const [video, setVideo] = useState(false)
  const logged = useRef(false)

  useEffect(() => {
    if (phase !== 'connecting') return
    const t = setTimeout(() => setPhase('live'), 1600)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'live') return
    const i = setInterval(() => setSecs((s) => s + 1), 1000)
    return () => clearInterval(i)
  }, [phase])

  useEffect(() => {
    if (phase !== 'live') return
    const len = callScript[turn].bn.length
    const t = setTimeout(() => {
      if (turn < callScript.length - 1) setTurn(turn + 1)
      else setPhase('ended')
    }, Math.max(3200, len * 70))
    return () => clearTimeout(t)
  }, [phase, turn])

  useEffect(() => {
    if (phase !== 'ended' || logged.current) return
    logged.current = true
    if (turn >= 5) addRequest({
      kind: 'food',
      titleEn: 'Groceries: rice and eggs',
      titleBn: 'চাল আর ডিম',
      detailEn: 'Ordered from her usual list through the partner grocer. BDT 640, arriving by 5 PM.',
      quoteBn: 'চাল আর ডিম লাগবে।',
      source: 'call',
      status: 'done',
      agentEn: 'Grocery order',
    })
    if (turn >= 3) addRequest({
      kind: 'medicine',
      titleEn: 'Refill blood pressure medicine',
      titleBn: 'প্রেসারের ওষুধ',
      detailEn: 'Amlodipine 5 mg, 30 tablets from the partner pharmacy. BDT 210. Needs your approval.',
      quoteBn: 'ওষুধ প্রায় শেষ হয়ে এসেছে।',
      source: 'call',
      status: 'approval',
      agentEn: 'Medicine refill',
    })
  }, [phase, turn, addRequest])

  const current = callScript[turn]
  const prev = turn > 0 ? callScript[turn - 1] : null
  const shown = detections.filter((d) => phase === 'ended' || turn > d.afterTurn)

  return (
    <div className="min-h-dvh bg-moss text-card">
      <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col px-4 pb-[max(env(safe-area-inset-bottom),20px)] pt-[max(env(safe-area-inset-top),16px)]">
        <div className="flex items-center justify-between py-2">
          <span className="flex items-center gap-2 rounded-full bg-card/10 px-3 py-1.5 text-sm">
            <span className={`size-2 rounded-full ${phase === 'live' ? 'bg-sage' : 'bg-marigold'}`} />
            {phase === 'ringing' && 'কল আসছে'}
            {phase === 'connecting' && 'সংযোগ হচ্ছে'}
            {phase === 'live' && fmt(secs)}
            {phase === 'ended' && 'কল শেষ'}
          </span>
          {video && phase === 'live' && <span className="rounded-full bg-card/10 px-3 py-1.5 text-xs">ভিডিও চালু, আপনার অনুমতিতে</span>}
        </div>

        <div className="flex flex-col items-center pt-4 text-card/80">
          <StitchOrb size={phase === 'ended' ? 140 : phase === 'live' ? 170 : 220} active={phase !== 'ended'} speaking={phase === 'live' && current.who === 'ai'} />
          <h1 className="mt-4 text-3xl font-bold text-card">আলাপন</h1>
          <p className="text-base text-card/70">
            {phase === 'ringing' ? 'আপনার প্রতিদিনের সকালের কল' : phase === 'ended' ? `কথা হলো ${fmt(secs)} মিনিট` : current.who === 'ai' ? 'আলাপন বলছে' : 'আপনি বলছেন'}
          </p>
        </div>

        {phase === 'live' && (
          <button onClick={() => (turn < callScript.length - 1 ? setTurn(turn + 1) : setPhase('ended'))} className="mt-6 flex-1 text-left" aria-label="Next line">
            {prev && <p className="mb-3 line-clamp-2 text-base text-card/45">{prev.bn}</p>}
            <p key={turn} className={`text-[1.55rem] font-semibold leading-snug ${current.who === 'ai' ? 'text-card' : 'text-marigold'}`}>
              {current.bn}
            </p>
            <p className="mt-2 text-sm text-card/50">{current.en}</p>
          </button>
        )}

        {(phase === 'live' || phase === 'ended') && shown.length > 0 && (
          <div className={`${phase === 'ended' ? 'mt-6 flex-1' : 'mt-4'} space-y-2`}>
            {phase === 'ended' && <h2 className="mb-1 text-xl font-semibold">আলাপন যা করলো</h2>}
            {shown.map((d) => (
              <div key={d.bn} className="flex items-center gap-3 rounded-3xl bg-card/10 p-3 ring-1 ring-card/15">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-marigold text-moss">
                  <d.icon size={20} />
                </span>
                <div className="flex-1 leading-snug">
                  <div className="text-base font-semibold">{d.bn}</div>
                  <div className="text-sm text-card/65">{d.noteBn}</div>
                </div>
                <Check size={18} className="text-sage" />
              </div>
            ))}
          </div>
        )}

        {phase !== 'live' && phase !== 'ended' && <div className="flex-1" />}

        {phase === 'ringing' && (
          <div className="mb-4 flex items-end justify-around">
            <button onClick={() => nav('/elder')} className="flex flex-col items-center gap-2">
              <span className="grid size-20 place-items-center rounded-full bg-thread text-card active:scale-95 transition">
                <PhoneOff size={30} />
              </span>
              <span className="text-lg">পরে</span>
            </button>
            <button onClick={() => setPhase('connecting')} className="flex flex-col items-center gap-2">
              <span className="relative grid size-24 place-items-center rounded-full bg-sage text-moss active:scale-95 transition">
                <span className="absolute inset-0 rounded-full bg-sage/60 animate-ring" />
                <Phone size={36} className="relative" />
              </span>
              <span className="text-lg font-semibold">ধরুন</span>
            </button>
          </div>
        )}

        {(phase === 'live' || phase === 'connecting') && (
          <div className="mt-6 mb-2 flex items-center justify-around rounded-full bg-card/10 p-2 ring-1 ring-card/15">
            <button onClick={() => setMuted(!muted)} aria-label={muted ? 'Unmute' : 'Mute'} className="grid size-14 place-items-center rounded-full bg-card/10">
              {muted ? <MicOff /> : <Mic />}
            </button>
            <button onClick={() => setVideo(!video)} aria-label="Video" className={`grid size-14 place-items-center rounded-full ${video ? 'bg-card text-moss' : 'bg-card/10'}`}>
              {video ? <Video /> : <VideoOff />}
            </button>
            <button aria-label="Speaker" className="grid size-14 place-items-center rounded-full bg-card/10">
              <Volume2 />
            </button>
            <button onClick={() => setPhase('ended')} aria-label="End call" className="grid size-16 place-items-center rounded-full bg-thread text-card">
              <PhoneOff />
            </button>
          </div>
        )}

        {phase === 'ended' && (
          <Link to="/elder" className="mt-6 mb-2 flex h-16 items-center justify-center rounded-full bg-marigold text-xl font-bold text-moss active:scale-[0.98] transition">
            ঠিক আছে
          </Link>
        )}
      </div>
    </div>
  )
}
