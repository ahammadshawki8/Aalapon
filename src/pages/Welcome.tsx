import { Link } from 'react-router-dom'
import { ChevronRight, HeartHandshake, PhoneCall } from 'lucide-react'
import { Logo, MaAvatar, Mark } from '../components/brand'

export default function Welcome() {
  return (
    <div className="min-h-dvh overflow-x-hidden bg-moss text-white">
      <div className="mx-auto flex min-h-dvh w-full max-w-[440px] flex-col px-5 pt-[max(env(safe-area-inset-top),16px)] pb-[max(env(safe-area-inset-bottom),20px)]">
        <header className="flex h-12 items-center">
          <Logo light />
        </header>

        <div className="relative mt-6 flex-1">
          <div className="pointer-events-none absolute -right-16 -top-6 opacity-[0.07]">
            <Mark size={260} a="#ffffff" b="#ffffff" lens="#1D3A2E" />
          </div>

          <div className="relative animate-rise">
            <div className="flex w-fit items-center gap-2.5 rounded-full bg-white/10 py-1.5 pl-1.5 pr-4 ring-1 ring-white/10">
              <MaAvatar size={28} />
              <span className="bn text-[14px] text-white/85">সকাল ৯টা, মায়ের সাথে আলাপ চলছে</span>
            </div>
            <h1 className="bn mt-6 text-[44px] font-bold leading-[1.02] tracking-tight">
              প্রতিটি আলাপই
              <br />
              যত্নের সুযোগ।
            </h1>
            <p className="mt-4 max-w-[32ch] text-[15px] leading-relaxed text-white/70">
              An AI companion that calls your parents every day in Bangla, notices what they need, and gets it done.
            </p>
          </div>

          <div className="relative mt-7 rounded-[20px] bg-white p-3.5 text-ink shadow-[0_24px_48px_-20px_rgba(0,0,0,0.5)] animate-rise [animation-delay:120ms]">
            <div className="flex items-center gap-2 text-[12px] text-ink-faint">
              <Mark size={16} />
              <span className="font-semibold text-ink-soft">Aalapon</span>
              <span className="ml-auto">now</span>
            </div>
            <p className="mt-1.5 text-[14px] font-semibold leading-snug">Ma mentioned poor sleep 3 times this week.</p>
            <p className="text-[13px] leading-snug text-ink-soft">Her watch agrees. Consider checking in tonight.</p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[22px] bg-white/[0.06] ring-1 ring-white/10">
          <Link to="/elder" className="press flex items-center gap-3.5 p-3.5">
            <span className="grid size-12 place-items-center rounded-2xl bg-marigold text-moss">
              <PhoneCall size={22} />
            </span>
            <span className="flex-1">
              <span className="bn block text-[19px] font-semibold leading-tight">আমি বাবা / মা</span>
              <span className="block text-[13px] text-white/60">Elder app, in Bangla</span>
            </span>
            <ChevronRight size={20} className="text-white/50" />
          </Link>
          <div className="mx-3.5 h-px bg-white/10" />
          <Link to="/care" className="press flex items-center gap-3.5 p-3.5">
            <span className="grid size-12 place-items-center rounded-2xl bg-white text-moss">
              <HeartHandshake size={22} />
            </span>
            <span className="flex-1">
              <span className="block text-[17px] font-semibold leading-tight">I care for a parent</span>
              <span className="block text-[13px] text-white/60">Family app</span>
            </span>
            <ChevronRight size={20} className="text-white/50" />
          </Link>
        </div>
        <p className="mt-4 text-center text-[12px] text-white/45">Works on any phone. Even a button phone gets the daily call.</p>
      </div>
    </div>
  )
}
