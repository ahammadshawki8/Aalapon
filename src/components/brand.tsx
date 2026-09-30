import { useId } from 'react'

/**
 * Aalapon mark: two speech bubbles leaning into each other. Two voices, one conversation.
 * The overlap forms a leaf-shaped lens, the moment where listening turns into care.
 */
export function Mark({ size = 36, a = '#1D3A2E', b = '#F4A340', lens = '#FFF3DF' }: { size?: number; a?: string; b?: string; lens?: string }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <defs>
        <clipPath id={`l${id}`}>
          <circle cx="18.5" cy="21" r="13.5" />
        </clipPath>
      </defs>
      <circle cx="18.5" cy="21" r="13.5" fill={a} />
      <path d="M9.2 30.6 L6 40.5 L16.4 34.2 Z" fill={a} strokeLinejoin="round" />
      <circle cx="29.5" cy="24" r="13.5" fill={b} />
      <path d="M38.8 33.6 L43 42.5 L32 37.4 Z" fill={b} />
      <circle cx="29.5" cy="24" r="13.5" fill={lens} clipPath={`url(#l${id})`} />
    </svg>
  )
}

export function Logo({ light = false, size = 34 }: { light?: boolean; size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <Mark size={size} a={light ? '#F6F3EA' : '#1D3A2E'} lens={light ? '#1D3A2E' : '#FFF3DF'} />
      <div className="leading-none">
        <div className={`bn text-[1.35rem] font-bold tracking-tight ${light ? 'text-white' : 'text-moss'}`}>আলাপন</div>
        <div className={`mt-0.5 text-[10px] font-medium tracking-[0.08em] ${light ? 'text-white/60' : 'text-ink-faint'}`}>aalapon</div>
      </div>
    </div>
  )
}

/** Hand-drawn portrait of Rahima Khatun: grey hair, green sari drawn over the head, round glasses. */
export function MaAvatar({ size = 48, ring = false }: { size?: number; ring?: boolean }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={ring ? 'rounded-full ring-2 ring-white' : 'rounded-full'} role="img" aria-label="Rahima Khatun">
      <defs>
        <clipPath id={`c${id}`}>
          <circle cx="32" cy="32" r="32" />
        </clipPath>
      </defs>
      <g clipPath={`url(#c${id})`}>
        <rect width="64" height="64" fill="#FDE7D4" />
        <path d="M6 66 C8 48 18 42 32 42 C46 42 56 48 58 66 Z" fill="#2F5645" />
        <path d="M20 66 C22 54 26 48 32 48 C38 48 42 54 44 66 Z" fill="#E9DCC6" />
        <rect x="28" y="36" width="8" height="9" rx="3" fill="#B97C58" />
        <ellipse cx="32" cy="29" rx="10.5" ry="12" fill="#C98B64" />
        <path d="M21.6 27 C22.4 19.5 27 17 32 17 C37 17 41.6 19.5 42.4 27 C39 23.4 35.6 22.6 32 22.6 C28.4 22.6 25 23.4 21.6 27 Z" fill="#ECEBE6" />
        <path d="M17 44 C15 30 19 12 32 11.5 C45 12 49 30 47 44 C45.5 36 44 28 42.8 25 C41 18 37 15.5 32 15.5 C27 15.5 23 18 21.2 25 C20 28 18.5 36 17 44 Z" fill="#3F6E58" />
        <path d="M17.6 41 C16.5 30 20 14 32 13.4 C44 14 47.5 30 46.4 41" fill="none" stroke="#F4A340" strokeWidth="1.4" strokeDasharray="2.2 2" />
        <circle cx="27.8" cy="29.5" r="3.4" fill="none" stroke="#3A2A22" strokeWidth="1.2" />
        <circle cx="36.2" cy="29.5" r="3.4" fill="none" stroke="#3A2A22" strokeWidth="1.2" />
        <path d="M31.2 29.3 L32.8 29.3" stroke="#3A2A22" strokeWidth="1.2" />
        <circle cx="27.8" cy="29.8" r="0.9" fill="#3A2A22" />
        <circle cx="36.2" cy="29.8" r="0.9" fill="#3A2A22" />
        <path d="M29 35.4 Q32 37.6 35 35.4" fill="none" stroke="#7C4A33" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="25.4" cy="33.8" r="1.6" fill="#E08D78" opacity="0.5" />
        <circle cx="38.6" cy="33.8" r="1.6" fill="#E08D78" opacity="0.5" />
      </g>
    </svg>
  )
}

export function Initials({ text, size = 40, tone = 'moss' }: { text: string; size?: number; tone?: 'moss' | 'sky' }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full font-semibold ${tone === 'moss' ? 'bg-moss text-white' : 'bg-sky text-sky-ink'}`}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {text}
    </span>
  )
}
