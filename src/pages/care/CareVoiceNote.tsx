import { useNavigate } from 'react-router-dom'
import { Check, Mic, RotateCcw, Send, Square } from 'lucide-react'
import { BackBar, Card, PrimaryBtn, Screen } from '../../components/ui'
import { fmtSecs, useRecorder } from '../../lib/media'
import { timeAgo, useApp } from '../../state/AppState'

export default function CareVoiceNote() {
  const nav = useNavigate()
  const { voiceNotes, patch, toast } = useApp()
  const r = useRecorder(60)

  const send = () => {
    patch((s) => ({
      voiceNotes: [{ id: `v${Date.now()}`, from: 'Tanvir', at: Date.now(), secs: Math.max(1, r.secs), dataUrl: r.dataUrl, played: false }, ...s.voiceNotes].slice(0, 5),
    }))
    toast('Sent. Ma will see it on her home screen.')
    nav('/care')
  }

  return (
    <Screen className="flex flex-col pb-[max(env(safe-area-inset-bottom),20px)]">
      <BackBar title="Voice note for Ma" to="/care" />
      <p className="px-1 text-[14px] leading-relaxed text-ink-soft">
        Record a short message. It appears on Ma's home screen, and Aalapon plays it at the start of her next call if she has not heard it.
      </p>

      <Card className="mt-5 flex flex-col items-center px-4 py-8">
        <div className="relative">
          {r.status === 'recording' && <span className="absolute inset-0 rounded-full bg-thread/30 animate-ring" />}
          <button
            onClick={r.status === 'recording' ? r.stop : r.start}
            aria-label={r.status === 'recording' ? 'Stop recording' : 'Start recording'}
            className={`press relative grid size-24 place-items-center rounded-full text-white ${r.status === 'recording' ? 'bg-thread' : 'bg-moss'}`}
          >
            {r.status === 'recording' ? <Square size={30} fill="currentColor" /> : <Mic size={34} />}
          </button>
        </div>
        <div className="mt-4 text-[28px] font-semibold tabular-nums">{fmtSecs(r.secs)}</div>
        <div className="mt-1 text-[13px] text-ink-soft">
          {r.status === 'idle' && 'Tap to record, up to 1 minute'}
          {r.status === 'recording' && (r.simulated ? 'Recording (demo mode, no microphone)' : 'Recording...')}
          {r.status === 'done' && 'Ready to send'}
        </div>
        {r.status === 'recording' && (
          <div className="mt-4 flex h-8 items-center gap-1" aria-hidden>
            {Array.from({ length: 18 }).map((_, i) => (
              <span key={i} className="h-full w-1 origin-center rounded-full bg-thread/70 animate-wave" style={{ animationDelay: `${(i % 6) * 0.12}s` }} />
            ))}
          </div>
        )}
        {r.status === 'done' && r.dataUrl && <audio controls src={r.dataUrl} className="mt-4 w-full" />}
      </Card>

      {r.status === 'done' && (
        <div className="mt-4 flex gap-2">
          <button onClick={r.reset} className="press flex h-12 flex-1 items-center justify-center gap-1.5 rounded-full bg-card font-semibold text-ink-soft shadow-card">
            <RotateCcw size={16} /> Redo
          </button>
          <PrimaryBtn onClick={send} className="flex-[2]">
            <Send size={16} /> Send to Ma
          </PrimaryBtn>
        </div>
      )}

      {voiceNotes.length > 0 && (
        <>
          <h2 className="mb-2 mt-7 px-1 text-[15px] font-semibold">Sent</h2>
          <Card className="divide-y divide-line">
            {voiceNotes.map((v) => (
              <div key={v.id} className="flex items-center gap-3 px-4 py-3">
                <span className="grid size-9 place-items-center rounded-full bg-sage-soft text-moss-2">
                  <Mic size={16} />
                </span>
                <div className="flex-1 leading-tight">
                  <div className="text-[14px] font-medium">{fmtSecs(v.secs)} voice note</div>
                  <div className="text-[12px] text-ink-soft">{timeAgo(v.at)}</div>
                </div>
                <span className={`flex items-center gap-1 text-[12px] font-semibold ${v.played ? 'text-moss-3' : 'text-ink-faint'}`}>
                  {v.played && <Check size={13} />} {v.played ? 'Ma listened' : 'Not heard yet'}
                </span>
              </div>
            ))}
          </Card>
        </>
      )}
    </Screen>
  )
}
