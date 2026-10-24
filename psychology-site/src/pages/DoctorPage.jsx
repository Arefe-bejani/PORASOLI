import { useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import Avatar from '../components/Avatar'
import Booking from '../components/Booking'
import { useStore } from '../store'
import { acc, docVisible, num } from '../utils'

export default function DoctorPage() {
  const { id } = useParams()
  const { S, me } = useStore()
  const nav = useNavigate()
  const loc = useLocation()
  const d = S.docs.find((x) => x.id === id)
  const toBook = () => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })
  useEffect(() => { window.scrollTo(0, 0); if (loc.state?.book) setTimeout(toBook, 60) }, [id])

  if (!d || !docVisible(d, me)) return <div className="card">این صفحه در دسترس نیست.</div>
  const c = acc(d)
  return (
    <>
      <div className="hero" style={{ borderTop: `6px solid ${c}` }}>
        <div className="row" style={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="avw"><Avatar d={d} /></span>
          <div style={{ flex: 1 }}>
            <h1>صفحهٔ شخصی دکتر {d.name}</h1>
            <p>{d.spec} {d.deg}</p>
            {d.ver ? <span className="chip">پروانه تأیید شده</span> : null}
            {d.ig && <a className="chip" href={`https://instagram.com/${d.ig}`} target="_blank" rel="noopener noreferrer">اینستاگرام @{d.ig}</a>}
          </div>
        </div>
        <p style={{ marginTop: 12 }}>
          <button className="wb" onClick={toBook}>رزرو نوبت</button>
          <button className="wb" onClick={() => nav(`/blog/${d.id}`)}>وبلاگ من 📖</button>
          <button className="wb" onClick={() => nav(me ? '/panel' : '/')}>بازگشت</button>
        </p>
      </div>
      <div className="card" style={{ borderRight: `6px solid ${c}` }}>
        <h3>دربارهٔ من</h3>
        <p style={{ whiteSpace: 'pre-wrap' }}>{d.bio || 'هنوز چیزی نوشته نشده.'}</p>
      </div>
      <Booking key={d.id} d={d} />
      <div className="card" style={{ border: `1px solid ${c}55` }}>
        <h3>وبلاگ {d.name} 📖</h3>
        <p>{num(d.posts.length)} نوشته{d.posts[0] ? ': ' + d.posts[0].t : ''}</p>
        <button className="pri" style={{ background: c, borderColor: c }} onClick={() => nav(`/blog/${d.id}`)}>بریم تو وبلاگ</button>
      </div>
    </>
  )
}
