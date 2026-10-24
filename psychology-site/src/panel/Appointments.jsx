import { useState } from 'react'
import FormDialog from '../components/FormDialog'
import { useStore } from '../store'
import { SV, ST, fd, scope, taken } from '../utils'

export default function Appointments() {
  const { S, up, me } = useStore()
  const [f, setF] = useState('all')
  const [dlg, setDlg] = useState(null)
  const all = me.role !== 'doctor', admin = me.role === 'admin'
  const L = scope(S, me).filter((a) => f === 'all' || a.st === f).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
  const setSt = (id, st) => up((s) => { s.appts.find((a) => a.id === id).st = st })

  const edit = (a) => setDlg({
    title: 'ویرایش / جابجایی نوبت',
    fields: [
      { k: 'name', l: 'مراجع', v: a.name }, { k: 'phone', l: 'شمارهٔ تماس', v: a.phone },
      { k: 'doc', l: 'روانشناس', t: 'select', o: S.docs.map((d) => [d.id, d.name]), v: a.doc },
      { k: 'date', l: 'تاریخ', t: 'date', v: a.date }, { k: 'time', l: 'ساعت', t: 'time', v: a.time },
      { k: 'svc', l: 'نوع جلسه', t: 'select', o: Object.entries(SV), v: a.svc },
      { k: 'st', l: 'وضعیت', t: 'select', o: Object.entries(ST), v: a.st },
    ],
    onSave: (o) => {
      if (['pending', 'confirmed'].includes(o.st) && taken(S, o.doc, o.date, o.time, a.id)) { alert('این زمان برای این روانشناس قبلاً رزرو شده است.'); return false }
      up((s) => Object.assign(s.appts.find((x) => x.id === a.id), o))
    },
  })

  return (
    <div className="card">
      <select style={{ width: 'auto' }} value={f} onChange={(e) => setF(e.target.value)}>
        <option value="all">همهٔ وضعیت‌ها</option>
        {Object.entries(ST).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
      <div className="tw">
        <table>
          <thead><tr><th>تاریخ</th><th>ساعت</th>{all && <th>روانشناس</th>}<th>مراجع</th><th>تماس</th><th>نوع</th><th>وضعیت</th><th></th></tr></thead>
          <tbody>
            {L.length ? L.map((a) => (
              <tr key={a.id}>
                <td>{fd(a.date)}</td><td>{a.time}</td>
                {all && <td>{S.docs.find((d) => d.id === a.doc)?.name}</td>}
                <td>{a.name}</td><td dir="ltr">{a.phone}</td><td>{SV[a.svc]}</td>
                <td className={'s-' + a.st}>{ST[a.st]}</td>
                <td>
                  {a.st === 'pending' && <><button className="ok" onClick={() => setSt(a.id, 'confirmed')}>تأیید</button><button className="bad" onClick={() => setSt(a.id, 'rejected')}>رد</button></>}
                  {all && a.st === 'confirmed' && <button className="bad" onClick={() => setSt(a.id, 'cancelled')}>لغو</button>}
                  {admin && <button onClick={() => edit(a)}>ویرایش / جابجایی</button>}
                </td>
              </tr>
            )) : <tr><td colSpan="8" className="m">نوبتی پیدا نشد.</td></tr>}
          </tbody>
        </table>
      </div>
      {dlg && <FormDialog {...dlg} onClose={() => setDlg(null)} />}
    </div>
  )
}
