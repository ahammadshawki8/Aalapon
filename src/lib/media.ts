import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Records a short voice note with the microphone when the browser allows it.
 * If there is no microphone or permission is denied, it falls back to a timed
 * simulation so the demo flow still works end to end.
 */
export function useRecorder(maxSecs = 60) {
  const [status, setStatus] = useState<'idle' | 'recording' | 'done'>('idle')
  const [secs, setSecs] = useState(0)
  const [dataUrl, setDataUrl] = useState<string | undefined>()
  const [simulated, setSimulated] = useState(false)
  const rec = useRef<MediaRecorder | null>(null)
  const stream = useRef<MediaStream | null>(null)
  const timer = useRef<number | undefined>(undefined)

  const cleanup = () => {
    window.clearInterval(timer.current)
    stream.current?.getTracks().forEach((t) => t.stop())
    stream.current = null
  }

  useEffect(() => cleanup, [])

  const stop = useCallback(() => {
    window.clearInterval(timer.current)
    if (rec.current && rec.current.state !== 'inactive') rec.current.stop()
    else {
      cleanup()
      setStatus('done')
    }
  }, [])

  const start = useCallback(async () => {
    setSecs(0)
    setDataUrl(undefined)
    setStatus('recording')
    timer.current = window.setInterval(() => {
      setSecs((s) => {
        if (s + 1 >= maxSecs) stop()
        return s + 1
      })
    }, 1000)
    try {
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') throw new Error('unsupported')
      const s = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.current = s
      const chunks: Blob[] = []
      const r = new MediaRecorder(s)
      r.ondataavailable = (e) => e.data.size && chunks.push(e.data)
      r.onstop = () => {
        const blob = new Blob(chunks, { type: r.mimeType || 'audio/webm' })
        const reader = new FileReader()
        reader.onload = () => setDataUrl(reader.result as string)
        reader.readAsDataURL(blob)
        cleanup()
        setStatus('done')
      }
      r.start()
      rec.current = r
      setSimulated(false)
    } catch {
      rec.current = null
      setSimulated(true)
    }
  }, [maxSecs, stop])

  const reset = useCallback(() => {
    cleanup()
    setStatus('idle')
    setSecs(0)
    setDataUrl(undefined)
  }, [])

  return { status, secs, dataUrl, simulated, start, stop, reset }
}

/** Live front-camera preview for the video call toggle. */
export function useCamera(on: boolean) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [status, setStatus] = useState<'off' | 'starting' | 'on' | 'unavailable'>('off')

  useEffect(() => {
    if (!on) {
      setStatus('off')
      return
    }
    let stream: MediaStream | null = null
    let cancelled = false
    setStatus('starting')
    ;(async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error('unsupported')
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
        if (cancelled) return stream.getTracks().forEach((t) => t.stop())
        if (videoRef.current) videoRef.current.srcObject = stream
        setStatus('on')
      } catch {
        if (!cancelled) setStatus('unavailable')
      }
    })()
    return () => {
      cancelled = true
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [on])

  return { videoRef, status }
}

export function fmtSecs(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
