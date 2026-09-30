import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, HeartHandshake, Languages, Moon, Phone, PhoneCall, Smartphone, Users } from 'lucide-react'
import { Logo, Mark } from '../components/brand'

/** A floating element on the hero stage: pops in once, then drifts gently. */
function Float({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const style = { animationDelay: `${delay}ms` } as CSSProperties
  return (
    <div className={`absolute animate-pop ${className}`} style={style}>
      <div className="animate-float" style={{ animationDelay: `${delay * 2}ms` }}>
        {children}
      </div>
    </div>
  )
}

export default function Welcome() {
  return (
    <div
      className="min-h-dvh overflow-x-hidden bg-moss text-white"
      style={{
        backgroundImage:
          'radial-gradient(90% 45% at 50% 22%, rgba(244,163,64,0.28), transparent 70%), radial-gradient(80% 50% at 100% 100%, rgba(63,110,88,0.55), transparent 70%)',
      }}
    >
      <div className="mx-auto flex min-h-dvh w-full max-w-[440px] flex-col px-4 pt-[max(env(safe-area-inset-top),12px)] pb-[max(env(safe-area-inset-bottom),16px)]">
        <header className="flex h-12 items-center justify-between">
          <Logo light />
          <span className="flex h-8 items-center gap-1.5 rounded-full bg-white/10 px-3 text-[12px] font-medium text-white/80 ring-1 ring-white/15">
            <span className="size-1.5 rounded-full bg-[#7ee0a1]" /> AI for Social Good
          </span>
        </header>

        {/* Hero stage: one morning call, shown as it happens */}
        <div className="relative mx-auto mt-8 h-[392px] w-full max-w-[380px]">
          <svg viewBox="0 0 360 360" className="absolute left-1/2 top-[196px] size-[330px] -translate-x-1/2 -translate-y-1/2 animate-spin-slow" aria-hidden>
            <circle cx="180" cy="180" r="170" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="4 8" strokeLinecap="round" />
            <circle cx="180" cy="180" r="124" fill="none" stroke="rgba(244,163,64,0.45)" strokeWidth="1.5" strokeDasharray="10 10" strokeLinecap="round" />
          </svg>
          <div className="absolute left-1/2 top-[196px] size-[184px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.05] ring-1 ring-white/10" />

          <div className="absolute left-1/2 top-[196px] -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <span className="absolute inset-0 rounded-full bg-marigold/40 animate-ring" />
              <span className="absolute inset-0 rounded-full bg-marigold/30 animate-ring [animation-delay:1s]" />
              <div className="relative grid size-[124px] place-items-center rounded-full bg-[#F6F3EA] shadow-[0_20px_60px_-10px_rgba(244,163,64,0.75)] ring-[6px] ring-marigold">
                <Mark size={62} />
                <div className="absolute bottom-[22px] flex h-3.5 items-center gap-[2.5px]" aria-hidden>
                  {[0.2, 0.5, 0.1, 0.7, 0.3].map((d, i) => (
                    <span key={i} className="h-full w-[2.5px] origin-center rounded-full bg-moss-3 animate-wave" style={{ animationDelay: `${d}s` }} />
                  ))}
                </div>
              </div>
              <span className="absolute -bottom-3 left-1/2 flex h-7 -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-white px-2.5 text-[12px] font-semibold text-moss shadow-lg">
                <Phone size={12} className="text-moss-3" /> <span className="bn">মায়ের সাথে কথা চলছে</span> <span className="tabular-nums text-ink-faint">02:14</span>
              </span>
            </div>
          </div>

          <Float className="left-0 top-2" delay={200}>
            <div className="bn max-w-[190px] rounded-[18px] rounded-bl-md bg-[#F6F3EA] px-3 py-2 text-[14px] font-medium leading-snug text-ink shadow-[0_12px_30px_-12px_rgba(0,0,0,0.5)]">
              <div className="mb-0.5 flex items-center gap-1 font-sans text-[10.5px] font-semibold text-moss-3">
                <Mark size={12} /> Aalapon
              </div>
              মা, সকালের ওষুধটা খেয়েছেন?
            </div>
          </Float>

          <Float className="right-0 top-[64px]" delay={700}>
            <div className="bn max-w-[170px] rounded-[18px] rounded-br-md bg-marigold px-3 py-2 text-[14px] font-semibold leading-snug text-moss shadow-[0_12px_30px_-12px_rgba(0,0,0,0.5)]">
              খেয়েছি। তবে রাতে ঘুম হচ্ছে না।
            </div>
          </Float>

          <Float className="left-0 top-[286px]" delay={1200}>
            <div className="flex items-center gap-2 rounded-2xl bg-white/12 px-2.5 py-2 ring-1 ring-white/20 backdrop-blur-md">
              <span className="grid size-8 place-items-center rounded-xl bg-lilac text-lilac-ink">
                <Moon size={16} />
              </span>
              <div className="leading-tight">
                <div className="text-[10.5px] text-white/65">Watch, last night</div>
                <div className="text-[15px] font-semibold">
                  4.8 h <span className="text-[11px] font-medium text-[#ffb4a6]">low</span>
                </div>
              </div>
            </div>
          </Float>

          <Float className="right-0 top-[286px]" delay={1700}>
            <div className="flex items-center gap-2 rounded-2xl bg-white/12 px-2.5 py-2 ring-1 ring-white/20 backdrop-blur-md">
              <span className="grid size-8 place-items-center rounded-xl bg-[#7ee0a1] text-moss">
                <Check size={17} strokeWidth={2.6} />
              </span>
              <div className="leading-tight">
                <div className="text-[10.5px] text-white/65">Agent</div>
                <div className="bn text-[14px] font-semibold">চাল, ডিম অর্ডার হলো</div>
              </div>
            </div>
          </Float>

          <Float className="inset-x-0 bottom-0 mx-auto w-[262px]" delay={2200}>
            <div className="flex items-center gap-2.5 rounded-[16px] bg-white p-2.5 text-ink shadow-[0_18px_40px_-14px_rgba(0,0,0,0.6)]">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-moss text-[11px] font-bold text-white">TA</span>
              <div className="min-w-0 leading-tight">
                <div className="text-[11px] text-ink-faint">Tanvir in Dhaka, just now</div>
                <div className="truncate text-[13px] font-semibold">Ma slept badly 3 nights</div>
              </div>
            </div>
          </Float>
        </div>

        <div className="mt-9 text-center animate-rise [animation-delay:300ms]">
          <h1 className="bn text-[38px] font-bold leading-[1.05] tracking-tight">
            প্রতিটি আলাপই
            <br />
            যত্নের সুযোগ
          </h1>
          <p className="mx-auto mt-3 max-w-[34ch] text-[15px] leading-relaxed text-white/75">
            An AI that calls your parents daily in Bangla, notices what they need, and gets it done.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-1.5">
          {[
            { icon: <Smartphone size={15} />, t: 'Any phone' },
            { icon: <Languages size={15} />, t: 'Speaks Bangla' },
            { icon: <Users size={15} />, t: 'Family in loop' },
          ].map((f) => (
            <div key={f.t} className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-white/[0.07] text-[12px] font-medium text-white/85 ring-1 ring-white/10">
              <span className="text-marigold">{f.icon}</span>
              {f.t}
            </div>
          ))}
        </div>

        <div className="flex-1" />

        <div className="mt-5 space-y-2">
          <Link to="/elder" className="press flex h-[62px] items-center gap-3 rounded-[20px] bg-marigold pl-2 pr-4 text-moss shadow-[0_16px_36px_-16px_rgba(244,163,64,0.9)]">
            <span className="grid size-[46px] place-items-center rounded-[14px] bg-moss text-marigold">
              <PhoneCall size={21} />
            </span>
            <span className="flex-1 leading-tight">
              <span className="bn block text-[19px] font-bold">আমি বাবা / মা</span>
              <span className="block text-[12px] font-medium opacity-75">Open the elder app</span>
            </span>
            <ArrowRight size={20} />
          </Link>
          <Link to="/care" className="press flex h-[62px] items-center gap-3 rounded-[20px] bg-white pl-2 pr-4 text-moss">
            <span className="grid size-[46px] place-items-center rounded-[14px] bg-sage-soft text-moss">
              <HeartHandshake size={21} />
            </span>
            <span className="flex-1 leading-tight">
              <span className="block text-[17px] font-bold">I care for a parent</span>
              <span className="block text-[12px] font-medium text-ink-soft">Open the family app</span>
            </span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  )
}
