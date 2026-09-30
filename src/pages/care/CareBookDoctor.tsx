import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, MapPin, Stethoscope } from 'lucide-react'
import { BackBar, Card, Field, PrimaryBtn, Screen, inputCls } from '../../components/ui'
import { useApp } from '../../state/AppState'

const doctors = [
  { id: 'd1', name: 'Dr. Farhana Rahman', field: 'Orthopedics, knee and joints', place: 'Shastho Clinic, Mymensingh', fee: 800 },
  { id: 'd2', name: 'Dr. Kamal Hossain', field: 'General medicine', place: 'City Care Centre, Mymensingh', fee: 600 },
]
const slots = ['Sat, 11:00 AM', 'Sat, 4:30 PM', 'Sun, 10:00 AM', 'Mon, 6:00 PM']

export default function CareBookDoctor() {
  const nav = useNavigate()
  const { addRequest, toast } = useApp()
  const [doc, setDoc] = useState(doctors[0].id)
  const [slot, setSlot] = useState(slots[0])
  const [reason, setReason] = useState('Knee pain when climbing stairs, for about a week')
  const [remind, setRemind] = useState(true)
  const d = doctors.find((x) => x.id === doc)!

  const book = () => {
    addRequest({
      kind: 'doctor',
      titleEn: `Doctor visit booked: ${slot}`,
      titleBn: 'ডাক্তারের সিরিয়াল দেওয়া হয়েছে',
      detailEn: `${d.name}, ${d.place}. Reason: ${reason}.${remind ? ' Aalapon will tell Ma today and remind her the day before.' : ''}`,
      source: 'family',
      status: 'done',
      agentEn: 'Doctor appointment',
    })
    toast('Booked. Ma will hear about it on her next call.')
    nav('/care/requests')
  }

  return (
    <Screen className="pb-[max(env(safe-area-inset-bottom),20px)]">
      <BackBar title="Book a doctor visit" to="/care/insights" />

      <h2 className="mb-2 px-1 text-[13px] font-semibold text-ink-soft">Doctor</h2>
      <div className="space-y-2">
        {doctors.map((x) => (
          <button key={x.id} onClick={() => setDoc(x.id)} aria-pressed={doc === x.id} className={`press flex w-full items-start gap-3 rounded-[20px] bg-card p-3.5 text-left shadow-card ${doc === x.id ? 'ring-2 ring-moss-3' : ''}`}>
            <span className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-sky text-sky-ink">
              <Stethoscope size={19} />
            </span>
            <div className="flex-1">
              <div className="text-[15px] font-semibold">{x.name}</div>
              <div className="text-[13px] text-ink-soft">{x.field}</div>
              <div className="mt-1 flex items-center gap-1 text-[12px] text-ink-faint">
                <MapPin size={12} /> {x.place}, BDT {x.fee}
              </div>
            </div>
            {doc === x.id && <Check size={18} className="text-moss-3" />}
          </button>
        ))}
      </div>

      <h2 className="mb-2 mt-5 px-1 text-[13px] font-semibold text-ink-soft">Time</h2>
      <div className="grid grid-cols-2 gap-2">
        {slots.map((s) => (
          <button key={s} onClick={() => setSlot(s)} aria-pressed={slot === s} className={`press h-11 rounded-[14px] text-[14px] font-medium ${slot === s ? 'bg-moss text-white' : 'bg-card shadow-card'}`}>
            {s}
          </button>
        ))}
      </div>

      <Card className="mt-5 p-4">
        <Field label="Reason for the visit">
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} className={`${inputCls} h-auto py-3`} />
        </Field>
        <label className="flex items-center justify-between gap-3">
          <span className="text-[14px]">Aalapon tells Ma and reminds her the day before</span>
          <input type="checkbox" checked={remind} onChange={(e) => setRemind(e.target.checked)} className="size-5 accent-[#1D3A2E]" />
        </label>
      </Card>

      <PrimaryBtn onClick={book} disabled={!reason.trim()} className="mt-5">
        Book {slot}
      </PrimaryBtn>
      <p className="mt-2 text-center text-[12px] text-ink-faint">Demo booking. No real appointment is made.</p>
    </Screen>
  )
}
