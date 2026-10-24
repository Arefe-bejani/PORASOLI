import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Avatar from '../components/Avatar'
import { useStore } from '../store'
import { acc, docVisible, fd, num } from '../utils'

function PostCard({ p, c, big, open, toggle }) {
  const long = p.x.length >= 160
  const mins = Math.max(1, Math.round(p.x.split(/\s+/).length / 150))
  return (
    <div className="card" style={{ borderTop: `6px solid ${c}` }}>
      {p.img
        ? <img src={p.img} alt="" style={{ width: '100%', maxHeight: big ? 320 : 180, objectFit: 'cover', borderRadius: 14 }} />
        : <div className="ph" style={{ background: `${c}22`, color: c }}>✍️</div>}
      <h3>{p.t}</h3>
      <p className="m">{fd(p.date)} | {num(mins)} دقیقه مطالعه</p>
      <p style={{ whiteSpace: 'pre-wrap' }}>{open || !long ? p.x : p.x.slice(0, 150) + '...'}</p>
      {long && <button onClick={toggle}>{open ? 'بستن' : 'ادامهٔ مطلب'}</button>}
    </div>
  )
}

export default function BlogPage() {
  const { id } = useParams()
  const { S, me } = useStore()
  const nav = useNavigate()
  const [open, setOpen] = useState(null)
  const d = S.docs.find((x) => x.id === id)
  useEffect(() => window.scrollTo(0, 0), [id])
  if (!d || !docVisible(d, me)) return <div className="card">این صفحه در دسترس نیست.</div>
  const c = acc(d), P = d.posts
  return (
    <div className="blog">
      <div className="hero" style={{ borderTop: `6px solid ${c}` }}>
        <div className="row" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="avw"><Avatar d={d} /></span>
          <div style={{ flex: 1 }}><h1>وبلاگ {d.name}</h1><p>نوشته‌ها و حرف‌هایی که دوست دارم با شما در میان بگذارم</p></div>
        </div>
        <p style={{ marginTop: 12 }}>
          <button className="wb" onClick={() => nav(`/doctor/${d.id}`)}>بازگشت به صفحهٔ دکتر</button>
          <button className="wb" onClick={() => nav(`/doctor/${d.id}`, { state: { book: true } })}>رزرو نوبت</button>
        </p>
      </div>
      {P.length ? (
        <>
          <div style={{ marginBottom: 12 }}>
            <PostCard p={P[0]} c={c} big open={open === P[0].id} toggle={() => setOpen(open === P[0].id ? null : P[0].id)} />
          </div>
          <div className="grid">
            {P.slice(1).map((p) => <PostCard key={p.id} p={p} c={c} open={open === p.id} toggle={() => setOpen(open === p.id ? null : p.id)} />)}
          </div>
        </>
      ) : <div className="card">هنوز نوشته‌ای منتشر نشده است.</div>}
    </div>
  )
}
