import { useState } from 'react'
import FormDialog from '../components/FormDialog'
import { useStore } from '../store'
import { OST, R, fd, gen, mkDoc, num } from '../utils'

export function Reports() {
  const { S, me } = useStore()
  const L = me.role === 'doctor' ? S.docs.filter((d) => d.id === me.doc) : S.docs
  const T = [0, 0, 0, 0]
  const rows = L.map((d) => {
    const p = S.appts.filter((a) => a.doc === d.id)
    const c = p.filter((a) => a.st === 'confirmed').length, w = p.filter((a) => a.st === 'pending').length
    const x = p.filter((a) => ['rejected', 'cancelled'].includes(a.st)).length, inc = c * d.fee
    T[0] += c; T[1] += w; T[2] += x; T[3] += inc
    return <tr key={d.id}><td>{d.name}</td><td>{num(c)}</td><td>{num(w)}</td><td>{num(x)}</td><td>{num(inc)}</td></tr>
  })
  return (
    <div className="card tw">
      <table>
        <thead><tr><th>روانشناس</th><th>جلسات تأییدشده</th><th>در انتظار</th><th>ردشده / لغوشده</th><th>درآمد (تومان)</th></tr></thead>
        <tbody>
          {rows}
          {L.length > 1 && <tr><th>جمع</th><th>{num(T[0])}</th><th>{num(T[1])}</th><th>{num(T[2])}</th><th>{num(T[3])}</th></tr>}
        </tbody>
      </table>
      <p className="m">درآمد = تعداد جلسات تأییدشده × تعرفه.</p>
    </div>
  )
}

const codeOk = (S, c, id) => c.length >= 4 && !S.users.some((u) => u.id !== id && u.code === c)

export function Accounts() {
  const { S, up, me } = useStore()
  const [dlg, setDlg] = useState(null)
  const admin = me.role === 'admin'

  const add = () => setDlg({
    title: 'حساب جدید',
    fields: [
      { k: 'name', l: 'نام', v: '' }, { k: 'role', l: 'نقش', t: 'select', o: Object.entries(R), v: 'doctor' },
      { k: 'code', l: 'کد ورود (حداقل ۴ کاراکتر)', v: gen() },
      { k: 'lic', l: 'شمارهٔ پروانه / پروندهٔ نظام روان‌شناسی (برای روانشناس الزامی است)', v: '' }, { k: 'deg', l: 'مدرک و رشته', v: '' },
    ],
    onSave: (o) => {
      if (!o.name.trim() || !codeOk(S, o.code)) { alert('نام یا کد ورود معتبر نیست.'); return false }
      if (o.role !== 'admin' && !o.lic.trim()) { alert('برای روانشناس، شمارهٔ پروانه الزامی است.'); return false }
      up((s) => {
        const u = { id: 'u' + Date.now(), name: o.name.trim(), role: o.role, code: o.code, active: 1 }
        if (u.role !== 'admin') { const d = mkDoc(u.name, o.lic.trim(), o.deg.trim()); s.docs.push(d); u.doc = d.id }
        s.users.push(u)
      })
    },
  })
  const edit = (u) => setDlg({
    title: 'ویرایش حساب',
    fields: [{ k: 'name', l: 'نام', v: u.name }, { k: 'role', l: 'نقش', t: 'select', o: Object.entries(R), v: u.role }, { k: 'code', l: 'کد ورود', v: u.code }],
    onSave: (o) => {
      if (!o.name.trim() || !codeOk(S, o.code, u.id)) { alert('نام یا کد ورود معتبر نیست.'); return false }
      if (u.id === me.id && o.role !== u.role) { alert('نقش حساب خودتان را نمی‌توانید تغییر دهید.'); return false }
      up((s) => {
        const x = s.users.find((y) => y.id === u.id)
        Object.assign(x, { name: o.name.trim(), role: o.role, code: o.code })
        if (x.role !== 'admin' && !x.doc) { const d = mkDoc(x.name); s.docs.push(d); x.doc = d.id }
      })
    },
  })
  const toggle = (u) => {
    if (u.id === me.id) return alert('حساب خودتان را نمی‌توانید غیرفعال کنید.')
    up((s) => { const x = s.users.find((y) => y.id === u.id); x.active = x.active ? 0 : 1 })
  }
  return (
    <div className="card">
      {admin && <button className="pri" onClick={add}>حساب جدید</button>}
      <div className="tw">
        <table>
          <thead><tr><th>نام</th><th>نقش</th>{admin && <th>کد ورود</th>}<th>وضعیت</th><th></th></tr></thead>
          <tbody>
            {S.users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td><td>{R[u.role]}</td>{admin && <td dir="ltr">{u.code}</td>}<td>{u.active ? 'فعال' : 'غیرفعال'}</td>
                <td>{admin && <><button onClick={() => edit(u)}>ویرایش</button><button onClick={() => toggle(u)}>{u.active ? 'غیرفعال کن' : 'فعال کن'}</button></>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {dlg && <FormDialog {...dlg} onClose={() => setDlg(null)} />}
    </div>
  )
}

export function SmsSettings() {
  const { S, up } = useStore()
  const [s, setS] = useState(S.sms)
  // فقط تنظیمات ذخیره می‌شود؛ ارسال واقعی پیامک نیاز به سرور و سرویس پیامکی دارد
  return (
    <div className="card">
      <h3>پیامک یادآوری</h3>
      <label className="in"><input type="checkbox" checked={!!s.on} onChange={(e) => setS({ ...s, on: e.target.checked ? 1 : 0 })} />ارسال یادآوری فعال باشد</label>
      <label>چند ساعت قبل از نوبت<input type="number" value={s.hrs} onChange={(e) => setS({ ...s, hrs: e.target.value })} /></label>
      <label>متن پیامک (متغیرها: {'{نام} {دکتر} {تاریخ} {ساعت}'})<textarea value={s.tpl} onChange={(e) => setS({ ...s, tpl: e.target.value })} /></label>
      <button className="pri" onClick={() => { up((x) => { x.sms = { on: s.on, hrs: +s.hrs || 24, tpl: s.tpl } }); alert('تنظیمات پیامک ذخیره شد.') }}>ذخیره</button>
    </div>
  )
}

export function MyAccount() {
  const { S, up, me } = useStore()
  const [dlg, setDlg] = useState(null)
  const change = () => setDlg({
    title: 'تغییر نام و رمز ورود',
    fields: [{ k: 'name', l: 'نام', v: me.name }, { k: 'code', l: 'رمز ورود جدید', v: me.code }],
    onSave: (o) => {
      if (!o.name.trim() || !codeOk(S, o.code, me.id)) { alert('نام یا رمز معتبر نیست. رمز باید حداقل ۴ کاراکتر و یکتا باشد.'); return false }
      up((s) => Object.assign(s.users.find((u) => u.id === me.id), { name: o.name.trim(), code: o.code }))
    },
  })
  return (
    <div className="card">
      <h3>{me.name}</h3><p>نقش: {R[me.role]}</p>
      <button className="pri" onClick={change}>تغییر نام و رمز ورود</button>
      {dlg && <FormDialog {...dlg} onClose={() => setDlg(null)} />}
    </div>
  )
}

// سفارش‌های فروشگاه (فقط مدیر کل)
export function Orders() {
  const { S, up } = useStore()
  const setSt = (o, st) => up((s) => {
    const x = s.orders.find((y) => y.id === o.id)
    // لغو سفارش، موجودی کالاهای چاپی را برمی‌گرداند
    if (st === 'cancelled' && x.st !== 'cancelled') x.items.forEach((i) => { const p = s.products.find((q) => q.id === i.id); if (p && p.format === 'physical') p.stock += i.qty })
    x.st = st
  })
  const L = [...S.orders].sort((a, b) => b.id.localeCompare(a.id))
  return (
    <div className="card tw">
      <table>
        <thead><tr><th>کد</th><th>تاریخ</th><th>خریدار</th><th>اقلام</th><th>مبلغ</th><th>وضعیت</th></tr></thead>
        <tbody>
          {L.map((o) => (
            <tr key={o.id}>
              <td>{o.code}</td><td>{fd(o.date)}</td>
              <td>{o.name}<br /><span dir="ltr" className="m">{o.phone}</span>{o.address && <><br /><span className="m">{o.address}</span></>}</td>
              <td>{o.items.map((i) => `${i.title} ×${num(i.qty)}`).join('، ')}</td><td>{num(o.total)}</td>
              <td>
                <select value={o.st} disabled={o.st === 'cancelled'} onChange={(e) => setSt(o, e.target.value)}>
                  {Object.entries(OST).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </td>
            </tr>
          ))}
          {!L.length && <tr><td colSpan="6" className="m">هنوز سفارشی ثبت نشده.</td></tr>}
        </tbody>
      </table>
    </div>
  )
}
