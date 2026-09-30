import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Check, Mic, MicOff, Moon, Phone, PhoneOff, Pill, ShoppingBasket, Video, VideoOff, Volume2 } from 'lucide-react'
import { VoiceOrb } from '../../components/ui'
import { MaAvatar, Mark } from '../../components/brand'
import { callScript } from '../../data/mock'
import { toBn, useApp } from '../../state/AppState'
import { useCamera } from '../../lib/media'

type Phase = 'ringing' | 'connecting' | 'live' | 'ended'

const detections = [
  { afterTurn: 1, icon: Moon, bn: 'ঘুম কম হচ্ছে', noteBn: 'তানভীরকে জানানো হবে' },
  { afterTurn: 3, icon: Pill, bn: 'প্রেসারের ওষুধ শেষের পথে', noteBn: 'তানভীরের অনুমতির জন্য পাঠানো হলো' },
  { afterTurn: 5, icon: ShoppingBasket, bn: 'চাল আর ডিম', noteBn: 'অর্ডার হয়ে গেছে, বিকেলে আসবে' },
]

function fmt(sec: number) {
  return toBn(`${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`)
}

export default function ElderCall() {
  const [params] = useSearchParams()
  const nav = useNavigate()
  const { addRequest, agentModes, toast, consent } = useApp()
  const [phase, setPhase] = useState<Phase>(params.get('mode') === 'incoming' ? 'ringing' : 'connecting')
  const [turn, setTurn] = useState(0)
  const [secs, setSecs] = useState(0)
  const [muted, setMuted] = useState(false)
  const [video, setVideo] = useState(false)
  const [speaker, setSpeaker] = useState(false)
  const cam = useCamera(video && phase === 'live')
  const logged = useRef(false)

  useEffect(() => {
    if (phase !== 'connecting') return
    const t = setTimeout(() => setPhase('live'), 1500)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'live') return
    const i = setInterval(() => setSecs((s) => s + 1), 1000)
    return () => clearInterval(i)
  }, [phase])

  useEffect(() => {
    if (phase !== 'live') return
    const t = setTimeout(() => {
      if (turn < callScript.length - 1) setTurn(turn + 1)
      else setPhase('ended')
    }, Math.max(3400, callScript[turn].bn.length * 75))
    return () => clearTimeout(t)
  }, [phase, turn])

  useEffect(() => {
    if (phase !== 'ended' || logged.current) return
    logged.current = true
    if (turn >= 5)
      addRequest({
        kind: 'food',
        titleEn: 'Groceries: rice and eggs',
        titleBn: 'চাল আর ডিম',
        detailEn: 'Ordered from her usual list through the partner grocer. BDT 640, arriving by 5 PM.',
        quoteBn: 'চাল আর ডিম লাগবে।',
        source: 'call',
        status: 'done',
        agentEn: 'Grocery order',
      })
    if (turn >= 3)
      addRequest({
        kind: 'medicine',
        titleEn: 'Refill blood pressure medicine',
        titleBn: 'প্রেসারের ওষুধ',
        detailEn: `Amlodipine 5 mg, 30 tablets from the partner pharmacy. BDT 210.${agentModes.a3 === 'auto' ? ' Ordered automatically.' : ''}`,
        quoteBn: 'ওষুধ প্রায় শেষ হয়ে এসেছে।',
        source: 'call',
        status: agentModes.a3 === 'auto' ? 'done' : 'approval',
        agentEn: 'Medicine refill',
      })
  }, [phase, turn, addRequest, agentModes])

  const current = callScript[turn]
  const prev = turn > 0 ? callScript[turn - 1] : null
  const shown = detections.filter((d) => phase === 'ended' || turn > d.afterTurn)
  const next = () => (turn < callScript.length - 1 ? setTurn(turn + 1) : setPhase('ended'))

  return (
    <div className="bn min-h-dvh bg-moss text-white" style={{ backgroundImage: 'radial-gradient(120% 60% at 50% 0%, rgba(244,163,64,0.18), transparent 60%)' }}>
      <div className="mx-auto flex min-h-dvh w-full max-w-[440px] flex-col px-4 pt-[max(env(safe-area-inset-top),12px)] pb-[max(env(safe-area-inset-bottom),16px)]">
        <div className="flex h-11 items-center justify-between">
          <span className="flex h-8 items-center gap-2 rounded-full bg-white/10 px-3 text-[14px] tabular-nums">
            <span className={`size-2 rounded-full ${phase === 'live' ? 'bg-[#7ee0a1]' : 'bg-marigold'}`} />
            {phase === 'ringing' && 'কল আসছে'}
            {phase === 'connecting' && 'যুক্ত হচ্ছে'}
            {phase === 'live' && fmt(secs)}
            {phase === 'ended' && 'কল শেষ'}
          </span>
          {speaker && phase === 'live' && <span className="flex h-8 items-center rounded-full bg-white/10 px-3 text-[13px]">স্পিকার চালু</span>}
        </div>

        <div className={`flex flex-col items-center ${phase === 'ringing' ? 'pt-14' : 'pt-3'}`}>
          <VoiceOrb size={phase === 'ringing' ? 230 : phase === 'ended' || video ? 130 : 170} active={phase !== 'ended'} speaking={phase === 'live' && current.who === 'ai'} />
          <h1 className="mt-3 text-[30px] font-bold leading-none">আলাপন</h1>
          <p className="mt-2 text-[16px] text-white/65">
            {phase === 'ringing' && 'প্রতিদিনের সকালের কল'}
            {phase === 'connecting' && 'যুক্ত হচ্ছে...'}
            {phase === 'live' && (current.who === 'ai' ? 'আলাপন বলছে' : 'আপনি বলছেন')}
            {phase === 'ended' && `${fmt(secs)} মিনিট কথা হলো`}
          </p>
        </div>

        {phase === 'live' && muted && (
          <div className="mt-4 rounded-2xl bg-thread/25 px-3 py-2 text-center text-[14px] ring-1 ring-thread/40">মাইক বন্ধ। আলাপন আপনার কথা শুনতে পাচ্ছে না।</div>
        )}

        {phase === 'live' && video && (
          <div className="relative mt-4 overflow-hidden rounded-[20px] bg-black/30 ring-1 ring-white/15">
            <video ref={cam.videoRef} autoPlay playsInline muted className={`h-36 w-full -scale-x-100 object-cover ${cam.status === 'on' ? '' : 'hidden'}`} />
            {cam.status !== 'on' && (
              <div className="grid h-36 place-items-center px-6 text-center text-[15px] text-white/70">
                {cam.status === 'starting' ? 'ক্যামেরা চালু হচ্ছে...' : 'ক্যামেরা পাওয়া যায়নি। আলাপন শুধু কণ্ঠে কথা চালিয়ে যাবে।'}
              </div>
            )}
            <span className="absolute left-2 top-2 rounded-full bg-black/50 px-2.5 py-1 text-[12px]">
              {consent.video ? 'ভিডিও চালু, আপনার অনুমতিতে' : 'শুধু আপনি দেখছেন, কিছু রাখা হচ্ছে না'}
            </span>
          </div>
        )}

        {phase === 'live' && (
          <button onClick={next} className="mt-5 text-left" aria-label="পরের কথা">
            {prev && <p className="mb-2 line-clamp-1 px-1 text-[15px] text-white/35">{prev.bn}</p>}
            <div key={turn} className="animate-rise rounded-[22px] bg-white/[0.07] p-4 ring-1 ring-white/10">
              <div className="mb-2 flex items-center gap-2 text-[13px] text-white/55">
                {current.who === 'ai' ? <Mark size={18} a="#F6F3EA" lens="#1D3A2E" /> : <MaAvatar size={18} />}
                {current.who === 'ai' ? 'আলাপন' : 'আপনি'}
              </div>
              <p className={`text-[22px] font-semibold leading-snug ${current.who === 'ai' ? 'text-white' : 'text-marigold'}`}>{current.bn}</p>
              <p className="mt-2 font-sans text-[13px] leading-snug text-white/45">{current.en}</p>
            </div>
          </button>
        )}

        {(phase === 'live' || phase === 'ended') && shown.length > 0 && (
          <div className={`${phase === 'ended' ? 'mt-6' : 'mt-3'} space-y-2`}>
            {phase === 'ended' && <h2 className="mb-2 px-1 text-[18px] font-bold">আলাপন যা করলো</h2>}
            {shown.map((d) => (
              <div key={d.bn} className="animate-rise flex items-center gap-3 rounded-[18px] bg-white/[0.07] px-3 py-2.5 ring-1 ring-white/10">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-marigold text-moss">
                  <d.icon size={17} />
                </span>
                <div className="min-w-0 flex-1 leading-tight">
                  <div className="text-[16px] font-semibold">{d.bn}</div>
                  <div className="truncate text-[13px] text-white/60">{d.noteBn}</div>
                </div>
                <Check size={18} className="text-[#7ee0a1]" />
              </div>
            ))}
          </div>
        )}

        <div className="flex-1" />

        {phase === 'ringing' && (
          <div className="mb-6 grid grid-cols-2 items-end">
            <CallBtn
              label="পরে"
              onClick={() => {
                toast('ঠিক আছে, আলাপন ৩০ মিনিট পরে আবার কল করবে')
                nav('/elder')
              }} className="size-[72px] bg-thread" icon={<PhoneOff size={28} />} />
            <CallBtn label="ধরুন" onClick={() => setPhase('connecting')} className="size-[84px] bg-[#7ee0a1] text-moss" icon={<Phone size={32} />} pulse />
          </div>
        )}

        {(phase === 'live' || phase === 'connecting') && (
          <div className="mt-5 grid grid-cols-4 gap-2">
            <CallBtn small label={muted ? 'মিউট করা' : 'মিউট'} onClick={() => setMuted(!muted)} className={muted ? 'bg-white text-moss' : 'bg-white/10'} icon={muted ? <MicOff size={22} /> : <Mic size={22} />} />
            <CallBtn small label="ভিডিও" onClick={() => setVideo(!video)} className={video ? 'bg-white text-moss' : 'bg-white/10'} icon={video ? <Video size={22} /> : <VideoOff size={22} />} />
            <CallBtn small label="স্পিকার" onClick={() => setSpeaker(!speaker)} className={speaker ? 'bg-white text-moss' : 'bg-white/10'} icon={<Volume2 size={22} />} />
            <CallBtn small label="শেষ" onClick={() => setPhase('ended')} className="bg-thread" icon={<PhoneOff size={22} />} />
          </div>
        )}

        {phase === 'ended' && (
          <Link to="/elder" className="press flex h-14 items-center justify-center rounded-full bg-marigold text-[19px] font-bold text-moss">
            ঠিক আছে
          </Link>
        )}
      </div>
    </div>
  )
}

function CallBtn({ label, onClick, className, icon, small, pulse }: { label: string; onClick?: () => void; className: string; icon: ReactNode; small?: boolean; pulse?: boolean }) {
  return (
    <button onClick={onClick} className="press flex flex-col items-center gap-1.5">
      <span className={`relative grid place-items-center rounded-full ${small ? 'size-14' : ''} ${className}`}>
        {pulse && <span className="absolute inset-0 rounded-full bg-[#7ee0a1] animate-ring" />}
        <span className="relative">{icon}</span>
      </span>
      <span className={small ? 'text-[13px] text-white/70' : 'text-[17px] font-semibold'}>{label}</span>
    </button>
  )
}
