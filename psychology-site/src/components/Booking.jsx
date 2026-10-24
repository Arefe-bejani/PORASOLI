import { useState } from 'react'
import { useStore } from '../store'
import { SV, acc, c5, dd, fd, num, taken } from '../utils'
import Chips from './Chips'
import SlotChips from './SlotChips'

export default function Booking({ d }) {
  const { S, up } = useStore()
  const svcs = Object.keys(SV).filter((k) => d.svc[k])
  const [date, setDate] = useState(dd(0))
  const [slot, setSlot] = useState(null)
  const [f, setF] = useState({ name: '', phone: '', svc: svcs[0] || 'online' })
  const [msg, setMsg] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const n = f.name.trim(), p = f.phone.trim()
    if (!n || !p) return alert('نام و شمارهٔ تماس را وارد کنید.')
    if (taken(S, d.id, date, slot)) { setSlot(null); return alert('این زمان همین الان رزرو شد. زمان دیگری انتخاب کنید.') }
    const fresh = !S.cc[p], code = fresh ? c5() : S.cc[p]
    up((s) => {
      if (fresh) s.cc[p] = code
      s.appts.push({ id: 'a' + Date.now(), doc: d.id, date, time: slot, name: n, phone: p, svc: f.svc, st: 'pending' })
    })
    setSlot(null); setF({ ...f, name: '', phone: '' })
    setMsg('درخواست نوبت ثبت شد.' + (fresh ? ` کد پیگیری شما: ${code} (برای دیدن یادداشت‌ها و سفارش‌ها نگهش دارید).` : ' برای دیدن یادداشت‌ها از کد پیگیری قبلی‌تان استفاده کنید.') + ' پس از تأیید روانشناس، پیامک دریافت می‌کنید.')
  }

  return (
    <div className="card" id="book" style={{ borderTop: `6px solid ${acc(d)}` }}>
      {msg && <p className="ok">{msg}</p>}
      <h3>رزرو نوبت با {d.name}</h3>
      <p className="m">تعرفهٔ هر جلسه: {num(d.fee)} تومان</p>
      <p><Chips d={d} /></p>
      <div className="tabs">
        {[...Array(10)].map((_, i) => dd(i)).map((x) => (
          <button key={x} className={x === date ? 'pri' : ''} onClick={() => { setDate(x); setSlot(null) }}>{fd(x)}</button>
        ))}
      </div>
      <SlotChips d={d} date={date} sel={slot} onPick={setSlot} />
      <p className="m">زمان‌های پررنگ رزرو شده‌اند.</p>
      {slot && (
        <form onSubmit={submit}>
          <hr />
          <h3>رزرو {fd(date)}، ساعت {slot}</h3>
          <div className="g2">
            <label>نام و نام خانوادگی<input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
            <label>شمارهٔ تماس<input dir="ltr" inputMode="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></label>
            <label>نوع جلسه
              <select value={f.svc} onChange={(e) => setF({ ...f, svc: e.target.value })}>
                {svcs.map((k) => <option key={k} value={k}>{SV[k]}</option>)}
              </select>
            </label>
          </div>
          <button className="pri">ثبت درخواست نوبت</button>
        </form>
      )}
    </div>
  )
}
