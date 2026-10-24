import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store'
import { c5, num } from '../utils'

export default function Cart() {
  const { S, up, cart, setCart } = useStore()
  const [f, setF] = useState({ name: '', phone: '', address: '' })
  const [done, setDone] = useState(null)
  const items = cart.map((c) => ({ ...c, p: S.products.find((p) => p.id === c.id) })).filter((x) => x.p)
  const total = items.reduce((s, x) => s + x.p.price * x.qty, 0)
  const physical = items.some((x) => x.p.format === 'physical')
  const setQty = (id, q) => setCart((c) => c.map((x) => (x.id === id ? { ...x, qty: Math.max(0, q) } : x)).filter((x) => x.qty > 0))

  const order = (e) => {
    e.preventDefault()
    const p = f.phone.trim()
    if (!f.name.trim() || !p) return alert('نام و شمارهٔ تماس را وارد کنید.')
    if (physical && !f.address.trim()) return alert('برای محصول چاپی، آدرس لازم است.')
    const bad = items.find((x) => x.p.format === 'physical' && x.qty > x.p.stock)
    if (bad) return alert(`موجودی «${bad.p.title}» کافی نیست.`)
    const fresh = !S.cc[p], code = fresh ? c5() : S.cc[p], oc = 'ORD-' + c5()
    // TODO: اینجا قبل از ثبت سفارش، کاربر باید به درگاه پرداخت (مثل زرین‌پال) هدایت شود.
    up((s) => {
      if (fresh) s.cc[p] = code
      items.forEach((x) => { if (x.p.format === 'physical') s.products.find((y) => y.id === x.p.id).stock -= x.qty })
      s.orders.push({
        id: 'o' + Date.now(), code: oc, date: new Date().toISOString().slice(0, 10), name: f.name.trim(), phone: p,
        address: f.address.trim(), total, st: 'pending',
        items: items.map((x) => ({ id: x.p.id, title: x.p.title, price: x.p.price, qty: x.qty, link: x.p.format === 'digital' ? x.p.link : '' })),
      })
    })
    setCart([]); setDone({ oc, code, fresh })
  }

  if (done) {
    return (
      <div className="card ok">
        <h3>سفارش شما ثبت شد</h3>
        <p>شمارهٔ سفارش: <b>{done.oc}</b></p>
        <p>{done.fresh ? <>کد پیگیری شما: <b>{done.code}</b> (نگهش دارید)</> : 'برای پیگیری از کد پیگیری قبلی‌تان استفاده کنید.'}</p>
        <p className="m">در این نسخهٔ نمونه پرداخت آنلاین وصل نیست؛ سفارش «در انتظار پرداخت» ثبت شده است.</p>
        <Link to="/track">پیگیری سفارش</Link>
      </div>
    )
  }
  if (!items.length) return <div className="card">سبد خرید خالی است. <Link to="/shop">رفتن به فروشگاه</Link></div>
  return (
    <>
      <h2>سبد خرید</h2>
      <div className="card tw">
        <table>
          <tbody>
            {items.map((x) => (
              <tr key={x.p.id}>
                <td>{x.p.title}</td>
                <td>{num(x.p.price)}</td>
                <td><span className="qty"><button onClick={() => setQty(x.p.id, x.qty - 1)}>−</button>{num(x.qty)}<button onClick={() => setQty(x.p.id, x.qty + 1)}>+</button></span></td>
                <td>{num(x.p.price * x.qty)}</td>
              </tr>
            ))}
            <tr><th colSpan="3">جمع کل (تومان)</th><th>{num(total)}</th></tr>
          </tbody>
        </table>
      </div>
      <form className="card" onSubmit={order}>
        <h3>مشخصات خریدار</h3>
        <div className="g2">
          <label>نام و نام خانوادگی<input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
          <label>شمارهٔ تماس<input dir="ltr" inputMode="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></label>
        </div>
        {physical && <label>آدرس برای ارسال<textarea value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} /></label>}
        <button className="pri">ثبت سفارش</button>
      </form>
    </>
  )
}
