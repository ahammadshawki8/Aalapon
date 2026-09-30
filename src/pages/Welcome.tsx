import { Link } from 'react-router-dom'
import { ChevronRight, HeartHandshake, Phone } from 'lucide-react'
import { Logo, Screen, StitchOrb } from '../components/ui'

export default function Welcome() {
  return (
    <Screen tone="moss" className="flex flex-col pb-8 text-card">
      <header className="flex items-center justify-between py-2">
        <Logo light />
        <span className="rounded-full border border-card/20 px-3 py-1 text-xs text-card/80">Demo</span>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center py-6 text-card/80">
        <StitchOrb size={230} active speaking />
      </div>

      <div className="space-y-3">
        <h1 className="text-[2.6rem] font-bold leading-[1.05] tracking-tight">
          প্রতিটি আলাপই
          <br />
          যত্নের সুযোগ।
        </h1>
        <p className="max-w-[34ch] text-base text-card/75">
          Aalapon calls your parents every day in Bangla, listens, remembers, and turns what they say into help.
        </p>
      </div>

      <div className="mt-8 space-y-3">
        <Link
          to="/elder"
          className="flex items-center gap-4 rounded-4xl bg-marigold p-4 text-moss active:scale-[0.98] transition"
        >
          <span className="grid size-14 place-items-center rounded-full bg-moss text-marigold">
            <Phone size={24} />
          </span>
          <span className="flex-1">
            <span className="block text-xl font-bold leading-tight">আমি বাবা / মা</span>
            <span className="block text-sm font-medium opacity-80">Elder portal, in Bangla</span>
          </span>
          <ChevronRight />
        </Link>
        <Link
          to="/care"
          className="flex items-center gap-4 rounded-4xl bg-card/10 p-4 ring-1 ring-card/20 active:scale-[0.98] transition"
        >
          <span className="grid size-14 place-items-center rounded-full bg-card text-moss">
            <HeartHandshake size={24} />
          </span>
          <span className="flex-1">
            <span className="block text-xl font-bold leading-tight">I care for a parent</span>
            <span className="block text-sm text-card/70">Caregiver portal</span>
          </span>
          <ChevronRight />
        </Link>
      </div>
      <p className="mt-6 text-center text-xs text-card/55">Works on any phone. Even a button phone gets the daily call.</p>
    </Screen>
  )
}
