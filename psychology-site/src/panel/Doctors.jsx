import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Avatar from '../components/Avatar'
import SlotChips from '../components/SlotChips'
import { useStore } from '../store'
import { DN, PAL, SV, acc, dd, fd, hm, resize } from '../utils'

function Preview({ d }) {
  return (
    <div className="card">
      <h3>زمان‌های آزاد و پر: {d.name}</h3>
      {[...Array(7)].map((_, i) => <p key={i}><b>{fd(dd(i))}</b> <SlotChips d={d} date={dd(i)} /></p>)}
      <p className="m">زمان‌های پررنگ پر هستند.</p>
    </div>
  )
}

function BlogEditor({ d, ed }) {
  const { up } = useStore()
  const nav = useNavigate()
  const [t, setT] = useState(''), [x, setX] = useState(''), [file, setFile] = useState(null), [k, setK] = useState(0)
  const publish = async () => {
    if (!t.trim() || !x.trim()) return alert('عنوان و متن را بنویسید.')
    const img = file ? await resize(file, 600) : ''
    up((s) => { s.docs.find((y) => y.id === d.id).posts.unshift({ id: 'p' + Date.now(), t: t.trim(), x: x.trim(), img, date: dd(0) }) })
    setT(''); setX(''); setFile(null); setK(k + 1)
  }
  return (
    <div className="card">
      <h3>صفحهٔ شخصی: نوشته‌ها و متن‌ها</h3>
      <button onClick={() => nav(`/doctor/${d.id}`)}>مشاهدهٔ صفحهٔ شخصی</button>
      <button onClick={() => nav(`/blog/${d.id}`)}>مشاهدهٔ وبلاگ</button>
      {ed && (
        <>
          <label>عنوان<input value={t} onChange={(e) => setT(e.target.value)} /></label>
          <label>متن<textarea value={x} onChange={(e) => setX(e.target.value)} /></label>
          <label>عکس (اختیاری)<input key={k} type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0] || null)} /></label>
          <button className="pri" onClick={publish}>انتشار</button>
          <hr />
        </>
      )}
      {d.posts.length ? d.posts.map((p) => (
        <div className="post" key={p.id}>
          <b>{p.t}</b> <span className="m">{fd(p.date)}</span>
          {ed && <button className="bad" onClick={() => up((s) => { const y = s.docs.find((z) => z.id === d.id); y.posts = y.posts.filter((q) => q.id !== p.id) })}>حذف</button>}
          <p>{p.x}</p>{p.img && <img src={p.img} alt="" />}
        </div>
      )) : <p className="m">هنوز نوشته‌ای منتشر نشده.</p>}
    </div>
  )
}

function DocEditor({ id }) {
  const { S, up, me } = useStore()
  const d = S.docs.find((x) => x.id === id)
  const a = me.role === 'admin', own = me.doc === id, ed = a || own
  const [f, setF] = useState(() => ({
    name: d.name, spec: d.spec, fee: d.fee, dur: d.dur, brk: d.brk, from: d.from, to: d.to, bio: d.bio, ig: d.ig, col: acc(d),
    phone: d.phone, note: d.note, days: d.days, svc: { ...d.svc }, hol: d.hol.join('\n'), lic: d.lic, deg: d.deg, ver: !!d.ver, on: !!d.on,
  }))
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const chk = (k) => (e) => setF({ ...f, [k]: e.target.checked })

  const save = () => {
    const dur = +f.dur, brk = +f.brk
    if (!(dur > 0) || brk < 0 || hm(f.from) >= hm(f.to)) return alert('مدت جلسه یا ساعت کاری معتبر نیست.')
    up((s) => {
      const x = s.docs.find((y) => y.id === id)
      Object.assign(x, {
        name: f.name, spec: f.spec, bio: f.bio, ig: f.ig.replace(/[^\w.]/g, ''), col: f.col, dur, brk, from: f.from, to: f.to,
        days: f.days, svc: Object.fromEntries(Object.keys(SV).map((k) => [k, f.svc[k] ? 1 : 0])),
        hol: f.hol.split(/[\s,]+/).filter((v) => /^\d{4}-\d\d-\d\d$/.test(v)),
      })
      x.phone = f.phone; x.note = f.note
      if (a) Object.assign(x, { fee: +f.fee, on: f.on ? 1 : 0, ver: f.ver ? 1 : 0, lic: f.lic, deg: f.deg })
      const u = s.users.find((y) => y.doc === id); if (u) u.name = f.name
    })
  }
  const photo = async (e) => {
    const file = e.target.files[0]
    if (file) { const u = await resize(file, 240); up((s) => { s.docs.find((y) => y.id === id).photo = u }) }
  }

  return (
    <>
      <Preview d={d} />
      <div className="card">
        <h3>پروفایل و برنامهٔ کاری</h3>
        {!ed && <p className="m">فقط مشاهده</p>}
        <fieldset disabled={!ed} style={{ border: 0, padding: 0, margin: 0 }}>
          <div className="g2">
            <label>نام<input value={f.name} onChange={set('name')} /></label>
            <label>تخصص<input value={f.spec} onChange={set('spec')} /></label>
            <label>تعرفهٔ جلسه (تومان)<input type="number" value={f.fee} onChange={set('fee')} disabled={!a} /></label>
            <label>مدت جلسه (دقیقه)<input type="number" value={f.dur} onChange={set('dur')} /></label>
            <label>استراحت بین جلسات (دقیقه)<input type="number" value={f.brk} onChange={set('brk')} /></label>
            <label>شروع کار<input type="time" value={f.from} onChange={set('from')} /></label>
            <label>پایان کار<input type="time" value={f.to} onChange={set('to')} /></label>
          </div>
          <div className="row" style={{ alignItems: 'center' }}>
            <Avatar d={d} />
            <label style={{ flex: 1 }}>عکس پروفایل<input type="file" accept="image/*" onChange={photo} /></label>
          </div>
          <label>اینستاگرام (فقط نام کاربری)<input dir="ltr" value={f.ig} onChange={set('ig')} /></label>
          <label>رنگ صفحهٔ شخصی
            <select value={f.col} onChange={set('col')}>{PAL.map((x) => <option key={x[0]} value={x[0]}>{x[1]}</option>)}</select>
          </label>
          <label>دربارهٔ من (در صفحهٔ شخصی نمایش داده می‌شود)<textarea rows="5" value={f.bio} onChange={set('bio')} /></label>
          {(a || own) && (
            <div className="g2">
              <label>تلفن (خصوصی)<input dir="ltr" value={f.phone} onChange={set('phone')} /></label>
              <label>یادداشت داخلی (خصوصی)<input value={f.note} onChange={set('note')} /></label>
            </div>
          )}
          <p>روزهای کاری:<br />
            {[6, 0, 1, 2, 3, 4, 5].map((n) => (
              <label className="in" key={n}>
                <input type="checkbox" checked={f.days.includes(n)} onChange={() => setF({ ...f, days: f.days.includes(n) ? f.days.filter((x) => x !== n) : [...f.days, n] })} />{DN[n]}
              </label>
            ))}
          </p>
          <p>خدمات:<br />
            {Object.keys(SV).map((k) => (
              <label className="in" key={k}>
                <input type="checkbox" checked={!!f.svc[k]} onChange={(e) => setF({ ...f, svc: { ...f.svc, [k]: e.target.checked } })} />{SV[k]}
              </label>
            ))}
          </p>
          <label>روزهای تعطیل (هر خط یک تاریخ میلادی مثل 2026-10-25)<textarea value={f.hol} onChange={set('hol')} /></label>
          {a ? (
            <>
              <div className="g2">
                <label>شمارهٔ پروانه / پروندهٔ نظام<input value={f.lic} onChange={set('lic')} /></label>
                <label>مدرک و رشته<input value={f.deg} onChange={set('deg')} /></label>
              </div>
              <label className="in"><input type="checkbox" checked={f.ver} onChange={chk('ver')} />پروانه و مدارک را بررسی کردم و تأیید می‌کنم</label>
              <label className="in"><input type="checkbox" checked={f.on} onChange={chk('on')} />نمایش در سایت</label>
            </>
          ) : <p className="m">پروانه: {d.lic || 'ثبت نشده'} {d.ver ? '(تأییدشده)' : '(در انتظار تأیید مدیر)'}</p>}
        </fieldset>
        {ed && <button className="pri" onClick={save}>ذخیرهٔ تغییرات</button>}
      </div>
      <BlogEditor d={d} ed={ed} />
    </>
  )
}

export function DocsTab() {
  const { S, me } = useStore()
  const [id, setId] = useState(me.doc || S.docs[0].id)
  return (
    <>
      <div className="card">
        <label>روانشناس
          <select value={id} onChange={(e) => setId(e.target.value)}>{S.docs.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
        </label>
        {me.role === 'head' && <p className="m">شما فقط پروفایل خودتان را می‌توانید ویرایش کنید.</p>}
      </div>
      <DocEditor key={id} id={id} />
    </>
  )
}

export const MySchedule = () => {
  const { me } = useStore()
  return <DocEditor id={me.doc} />
}
