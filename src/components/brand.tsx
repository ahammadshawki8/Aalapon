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

/** Ma's monogram: "মা" set in Anek Bangla on a warm marigold gradient. Used wherever Rahima Khatun appears. */
export function MaAvatar({ size = 48, ring = false }: { size?: number; ring?: boolean }) {
  return (
    <span
      role="img"
      aria-label="Rahima Khatun"
      className={`bn relative grid shrink-0 place-items-center overflow-hidden rounded-full font-bold text-moss ${ring ? 'ring-2 ring-white' : ''}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        background: 'radial-gradient(120% 120% at 30% 20%, #FFE9C7 0%, #F8C77E 55%, #F4A340 100%)',
        boxShadow: 'inset 0 -2px 6px rgba(154,90,14,0.18)',
      }}
    >
      <span className="relative leading-none" style={{ marginTop: size * 0.06 }}>
        মা
      </span>
    </span>
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
