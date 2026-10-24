import { useState } from 'react'
import FormDialog from '../components/FormDialog'
import { Cover } from '../pages/Shop'
import { useStore } from '../store'
import { PT, isUrl, num, resize } from '../utils'

// مدیر همهٔ محصول‌ها را می‌بیند؛ هر روانشناس فقط کتاب و جزوه‌های خودش را
export default function Products() {
  const { S, up, me } = useStore()
  const [dlg, setDlg] = useState(null)
  const admin = me.role === 'admin'
  const L = S.products.filter((p) => admin || p.author === me.doc)

  const open = (p) => setDlg({
    title: p ? 'ویرایش محصول' : 'محصول جدید',
    fields: [
      { k: 'title', l: 'عنوان', v: p?.title }, { k: 'type', l: 'نوع', t: 'select', o: Object.entries(PT), v: p?.type || 'book' },
      { k: 'format', l: 'شکل', t: 'select', o: [['physical', 'چاپی (ارسال پستی)'], ['digital', 'دیجیتال (فایل)']], v: p?.format || 'physical' },
      { k: 'price', l: 'قیمت (تومان)', t: 'number', v: p?.price }, { k: 'stock', l: 'موجودی (برای چاپی)', t: 'number', v: p?.stock ?? 0 },
      { k: 'link', l: 'لینک دانلود (برای دیجیتال)', v: p?.link }, { k: 'desc', l: 'توضیح', t: 'textarea', v: p?.desc },
      ...(admin ? [{ k: 'author', l: 'نویسنده', t: 'select', o: [['', 'انتشارات سایت'], ...S.docs.map((d) => [d.id, d.name])], v: p?.author || '' }] : []),
    ],
    onSave: (o) => {
      if (!o.title.trim() || !(+o.price > 0)) { alert('عنوان و قیمت معتبر لازم است.'); return false }
      if (o.link && !isUrl(o.link)) { alert('لینک باید با http یا https شروع شود.'); return false }
      const v = { title: o.title.trim(), type: o.type, format: o.format, price: +o.price, stock: +o.stock || 0, link: o.link.trim(), desc: o.desc, author: admin ? o.author : me.doc }
      up((s) => { if (p) Object.assign(s.products.find((x) => x.id === p.id), v); else s.products.push({ id: 'p' + Date.now(), cover: '', ...v }) })
    },
  })
  const cover = async (p, e) => {
    const f = e.target.files[0]
    if (f) { const u = await resize(f, 400); up((s) => { s.products.find((x) => x.id === p.id).cover = u }) }
  }
  const del = (p) => { if (confirm(`«${p.title}» حذف شود؟`)) up((s) => { s.products = s.products.filter((x) => x.id !== p.id) }) }

  return (
    <div className="card">
      <button className="pri" onClick={() => open()}>محصول جدید</button>
      <div className="tw">
        <table>
          <thead><tr><th></th><th>عنوان</th><th>نوع</th><th>قیمت</th><th>موجودی</th><th></th></tr></thead>
          <tbody>
            {L.map((p) => (
              <tr key={p.id}>
                <td style={{ width: 70 }}><div style={{ width: 60 }}><Cover p={p} /></div></td>
                <td>{p.title}</td><td>{PT[p.type]} {p.format === 'digital' ? '(دیجیتال)' : '(چاپی)'}</td>
                <td>{num(p.price)}</td><td>{p.format === 'digital' ? '-' : num(p.stock)}</td>
                <td>
                  <button onClick={() => open(p)}>ویرایش</button>
                  <label className="fileBtn">جلد<input type="file" accept="image/*" onChange={(e) => cover(p, e)} /></label>
                  <button className="bad" onClick={() => del(p)}>حذف</button>
                </td>
              </tr>
            ))}
            {!L.length && <tr><td colSpan="6" className="m">محصولی ثبت نشده.</td></tr>}
          </tbody>
        </table>
      </div>
      {dlg && <FormDialog {...dlg} onClose={() => setDlg(null)} />}
    </div>
  )
}
