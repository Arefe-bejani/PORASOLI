import { useState } from 'react'
import { PT, num } from '../utils'
import { useStore } from '../store'

export function Cover({ p }) {
  return p.cover ? <img className="cover" src={p.cover} alt="" /> : <div className="cover">{p.type === 'book' ? '📘' : '📄'}</div>
}

export default function Shop() {
  const { S, cart, setCart } = useStore()
  const [type, setType] = useState('all')
  const [q, setQ] = useState('')
  const L = S.products.filter((p) => (type === 'all' || p.type === type) && p.title.includes(q.trim()))
  const inCart = (id) => cart.find((c) => c.id === id)?.qty || 0
  const out = (p) => p.format === 'physical' && p.stock - inCart(p.id) <= 0
  const add = (p) => setCart((c) => c.some((x) => x.id === p.id)
    ? c.map((x) => (x.id === p.id ? { ...x, qty: x.qty + 1 } : x))
    : [...c, { id: p.id, qty: 1 }])

  return (
    <>
      <h2>فروشگاه کتاب و جزوه</h2>
      <div className="card row" style={{ flexWrap: 'wrap', alignItems: 'center' }}>
        {[['all', 'همه'], ...Object.entries(PT)].map(([k, v]) => (
          <button key={k} className={type === k ? 'pri' : ''} onClick={() => setType(k)}>{k === 'all' ? v : v + '‌ها'}</button>
        ))}
        <input style={{ flex: 1, minWidth: 160 }} placeholder="جستجوی عنوان" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="grid">
        {L.map((p) => (
          <div className="card" key={p.id}>
            <Cover p={p} />
            <h3>{p.title}</h3>
            <p className="m">{S.docs.find((d) => d.id === p.author)?.name || 'انتشارات سایت'}</p>
            <p><span className="chip">{PT[p.type]}</span><span className="chip">{p.format === 'digital' ? 'دیجیتال' : 'چاپی'}</span></p>
            <p>{p.desc}</p>
            <p className="price">{num(p.price)} تومان</p>
            <button className="pri" disabled={out(p)} onClick={() => add(p)}>{out(p) ? 'ناموجود' : 'افزودن به سبد'}</button>
          </div>
        ))}
        {!L.length && <p className="m">محصولی پیدا نشد.</p>}
      </div>
    </>
  )
}
