import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mic, MicOff, PhoneOff, Volume2 } from 'lucide-react'
import { MaAvatar } from '../../components/brand'
import { elder } from '../../data/mock'
import { fmtSecs } from '../../lib/media'
import { useApp } from '../../state/AppState'

type Phase = 'calling' | 'live' | 'ended'

export default function CareCallMa() {
  const nav = useNavigate()
  const { elderPhone, toast } = useApp()
  const [phase, setPhase] = useState<Phase>('calling')
  const [secs, setSecs] = useState(0)
  const [muted, setMuted] = useState(false)
  const [speaker, setSpeaker] = useState(false)

  useEffect(() => {
    if (phase !== 'calling') return
    const t = setTimeout(() => setPhase('live'), 3200)
    return () => clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'live') return
    const i = setInterval(() => setSecs((s) => s + 1), 1000)
    return () => clearInterval(i)
  }, [phase])

  const end = () => setPhase('ended')

  return (
    <div className="min-h-dvh bg-moss text-white" style={{ backgroundImage: 'radial-gradient(120% 60% at 50% 0%, rgba(244,163,64,0.16), transparent 60%)' }}>
      <div className="mx-auto flex min-h-dvh w-full max-w-[440px] flex-col items-center px-4 pt-[max(env(safe-area-inset-top),24px)] pb-[max(env(safe-area-inset-bottom),24px)]">
        <p className="text-[13px] text-white/60">{phase === 'calling' ? 'Calling' : phase === 'live' ? 'On call' : 'Call ended'}</p>
        <div className="relative mt-10">
          {phase === 'calling' && <span className="absolute inset-0 rounded-full bg-white/20 animate-ring" />}
          <div className="relative rounded-full ring-4 ring-white/15">
            <MaAvatar size={120} />
          </div>
        </div>
        <h1 className="mt-5 text-[26px] font-semibold">Ma</h1>
        <p className="text-[14px] text-white/60">{elder.nameEn}, {elderPhone}</p>
        <p className="mt-3 text-[16px] tabular-nums text-white/85">{phase === 'calling' ? 'Ringing...' : fmtSecs(secs)}</p>

        {phase === 'live' && (
          <p className="mt-6 max-w-[30ch] text-center text-[13px] leading-relaxed text-white/55">
            Aalapon skips tomorrow's small talk about sleep since you checked in, and keeps the medicine questions.
          </p>
        )}

        <div className="flex-1" />

        {phase !== 'ended' ? (
          <div className="grid w-full grid-cols-3 gap-3 px-4">
            <Ctl label={muted ? 'Unmute' : 'Mute'} on={muted} onClick={() => setMuted(!muted)} icon={muted ? <MicOff size={22} /> : <Mic size={22} />} />
            <Ctl label="Speaker" on={speaker} onClick={() => setSpeaker(!speaker)} icon={<Volume2 size={22} />} />
            <button onClick={end} className="press flex flex-col items-center gap-1.5">
              <span className="grid size-16 place-items-center rounded-full bg-thread">
                <PhoneOff size={24} />
              </span>
              <span className="text-[12px] text-white/70">End</span>
            </button>
          </div>
        ) : (
          <div className="w-full space-y-2">
            <button
              onClick={() => {
                toast('Noted. Aalapon will ask about sleep tomorrow.')
                nav('/care')
              }}
              className="press h-12 w-full rounded-full bg-marigold text-[15px] font-semibold text-moss"
            >
              Ask Aalapon to follow up on sleep
            </button>
            <Link to="/care" className="press flex h-12 w-full items-center justify-center rounded-full bg-white/10 text-[15px] font-semibold">
              Done
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function Ctl({ label, on, onClick, icon }: { label: string; on: boolean; onClick: () => void; icon: ReactNode }) {
  return (
    <button onClick={onClick} aria-pressed={on} className="press flex flex-col items-center gap-1.5">
      <span className={`grid size-16 place-items-center rounded-full ${on ? 'bg-white text-moss' : 'bg-white/10'}`}>{icon}</span>
      <span className="text-[12px] text-white/70">{label}</span>
    </button>
  )
}
