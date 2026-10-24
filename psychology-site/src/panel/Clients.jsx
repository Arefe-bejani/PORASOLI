import { useState } from 'react'
import FormDialog from '../components/FormDialog'
import { useStore } from '../store'
import { dd, fd, num, scope } from '../utils'

const EMOJI = ['🌷', '🌟', '💙', '🌈', '☀️', '🍀', '🤗', '✨']

// پیام کوچک روانشناس برای مراجع: فقط روانشناسِ همان مراجع و بعد از بیش از دو جلسهٔ انجام‌شده
function ClientNotes({ phone, back }) {
  const { S, up, me } = useStore()
  const [x, setX] = useState('')
  const canWrite = !!me.doc && S.appts.filter((a) => a.phone === phone && a.doc === me.doc && a.st === 'confirmed' && a.date <= dd(0)).length > 2
  const all = me.role !== 'doctor'
  const N = S.notes.filter((n) => n.phone === phone && (all || n.doc === me.doc)).sort((a, b) => b.date.localeCompare(a.date))
  const add = () => { if (!x.trim()) return; up((s) => { s.notes.push({ id: 'n' + Date.now(), phone, doc: me.doc, date: dd(0), x: x.trim() }) }); setX('') }
  return (
    <div className="card">
      <button onClick={back}>بازگشت</button>
      <h3>یادداشت‌ها برای {S.appts.find((a) => a.phone === phone)?.name}</h3>
      {canWrite ? (
        <>
          <label>پیام کوچک (حداکثر ۱۲۰ حرف، مراجع در سایت می‌بیند)
            <input maxLength={120} value={x} onChange={(e) => setX(e.target.value)} placeholder="مثلاً تا جلسهٔ بعد مراقب خودت باش" />
          </label>
          <p>{EMOJI.map((e) => <button key={e} onClick={() => setX(x + e)}>{e}</button>)}</p>
          <button className="pri" onClick={add}>ثبت یادداشت</button><hr />
        </>
      ) : <p className="m">پیام کوچک فقط توسط روانشناس همین مراجع و بعد از بیش از دو جلسهٔ انجام‌شده نوشته می‌شود.</p>}
      {N.length ? N.map((n) => (
        <div className="post" key={n.id}>
          <b>{S.docs.find((d) => d.id === n.doc)?.name}</b> <span className="m">{fd(n.date)}</span>
          {n.doc === me.doc && <button className="bad" onClick={() => up((s) => { s.notes = s.notes.filter((q) => q.id !== n.id) })}>حذف</button>}
          <p>{n.x}</p>
        </div>
      )) : <p className="m">یادداشتی نیست.</p>}
    </div>
  )
}

export default function Clients() {
  const { S, up, me } = useStore()
  const [cn, setCn] = useState(null)
  const [dlg, setDlg] = useState(null)
  if (cn) return <ClientNotes phone={cn} back={() => setCn(null)} />
  const m = {}
  scope(S, me).forEach((a) => {
    const c = (m[a.phone] = m[a.phone] || { name: a.name, phone: a.phone, n: 0, last: '' })
    if (a.st === 'confirmed') c.n++
    if (a.date > c.last) c.last = a.date
  })
  const edit = (c) => setDlg({
    title: 'ویرایش اطلاعات مراجع',
    fields: [{ k: 'name', l: 'نام', v: c.name }, { k: 'phone', l: 'شمارهٔ تماس', v: c.phone }],
    onSave: (o) => {
      if (!o.name.trim() || !o.phone.trim()) { alert('نام و شماره الزامی است.'); return false }
      up((s) => { s.appts.filter((a) => a.phone === c.phone).forEach((a) => { a.name = o.name; a.phone = o.phone }) })
    },
  })
  return (
    <div className="card tw">
      <table>
        <thead><tr><th>نام</th><th>تماس</th><th>جلسات تأییدشده</th><th>آخرین نوبت</th><th>کد پیگیری</th><th></th></tr></thead>
        <tbody>
          {Object.values(m).map((c) => (
            <tr key={c.phone}>
              <td>{c.name}</td><td dir="ltr">{c.phone}</td><td>{num(c.n)}</td><td>{fd(c.last)}</td><td dir="ltr">{S.cc[c.phone]}</td>
              <td><button onClick={() => setCn(c.phone)}>یادداشت‌ها</button>{me.role === 'admin' && <button onClick={() => edit(c)}>ویرایش</button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {dlg && <FormDialog {...dlg} onClose={() => setDlg(null)} />}
    </div>
  )
}
