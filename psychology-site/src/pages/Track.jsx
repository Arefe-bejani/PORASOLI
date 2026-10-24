import { useState } from 'react'
import { useStore } from '../store'
import { OST, ST, acc, fd, isUrl, num } from '../utils'

// مراجع با شماره و کد پیگیری، پیام‌های روانشناس، نوبت‌ها و سفارش‌هایش را می‌بیند
export default function Track() {
  const { S } = useStore()
  const [f, setF] = useState({ p: '', c: '' })
  const [who, setWho] = useState(null)
  const dn = (id) => S.docs.find((d) => d.id === id)

  if (!who) {
    return (
      <form className="card" style={{ maxWidth: 400, margin: '30px auto' }} onSubmit={(e) => {
        e.preventDefault()
        const p = f.p.trim()
        if (S.cc[p] && S.cc[p] === f.c.trim()) setWho(p); else alert('شماره یا کد پیگیری درست نیست.')
      }}>
        <h2>پیگیری نوبت، یادداشت‌ها و سفارش‌ها</h2>
        <p className="m">شمارهٔ تماس و کد پیگیری را وارد کنید. کد پیگیری را هنگام اولین ثبت نوبت یا اولین سفارش می‌گیرید.</p>
        <label>شمارهٔ تماس<input dir="ltr" value={f.p} onChange={(e) => setF({ ...f, p: e.target.value })} /></label>
        <label>کد پیگیری<input dir="ltr" value={f.c} onChange={(e) => setF({ ...f, c: e.target.value })} /></label>
        <button className="pri">مشاهده</button>
      </form>
    )
  }
  const N = S.notes.filter((n) => n.phone === who).sort((a, b) => b.date.localeCompare(a.date))
  const A = S.appts.filter((a) => a.phone === who).sort((a, b) => b.date.localeCompare(a.date))
  const O = S.orders.filter((o) => o.phone === who).sort((a, b) => b.id.localeCompare(a.id))
  return (
    <>
      <div className="card">
        <h3>پیام‌های کوچک روانشناس برای تو 💌</h3>
        {N.length ? N.map((n) => (
          <div className="note" key={n.id} style={{ '--c': dn(n.doc) ? acc(dn(n.doc)) : '#1f3a68' }}>
            <p>{n.x}</p><span className="m">از {dn(n.doc)?.name}، {fd(n.date)}</span>
          </div>
        )) : <p className="m">هنوز یادداشتی ثبت نشده.</p>}
      </div>
      <div className="card">
        <h3>نوبت‌های من</h3>
        {A.map((a) => <p key={a.id}>{fd(a.date)}، ساعت {a.time} با {dn(a.doc)?.name} <span className={'s-' + a.st}>{ST[a.st]}</span></p>)}
      </div>
      <div className="card">
        <h3>سفارش‌های فروشگاه</h3>
        {O.length ? O.map((o) => (
          <div className="post" key={o.id}>
            <b>{o.code}</b> <span className="m">{fd(o.date)} | {num(o.total)} تومان | {OST[o.st]}</span>
            <p>{o.items.map((i) => `${i.title} ×${num(i.qty)}`).join('، ')}</p>
            {['paid', 'sent'].includes(o.st) && o.items.filter((i) => i.link && isUrl(i.link)).map((i) => (
              <a key={i.id} className="chip" href={i.link} target="_blank" rel="noopener noreferrer">دانلود: {i.title}</a>
            ))}
          </div>
        )) : <p className="m">سفارشی ثبت نشده.</p>}
        <button onClick={() => setWho(null)}>خروج</button>
      </div>
    </>
  )
}
