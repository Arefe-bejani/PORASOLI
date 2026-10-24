import { useState } from 'react'

// پنجرهٔ فرم عمومی. fields: [{k,l,t:'text|number|date|time|select|textarea',o:[[value,label]],v}]
// اگر onSave مقدار false برگرداند پنجره باز می‌ماند.
export default function FormDialog({ title, fields, onSave, onClose }) {
  const [v, setV] = useState(() => Object.fromEntries(fields.map((f) => [f.k, f.v ?? ''])))
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value })
  const submit = (e) => { e.preventDefault(); if (onSave(v) !== false) onClose() }
  return (
    <div className="overlay" onClick={onClose}>
      <form className="dlg" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h3>{title}</h3>
        {fields.map((f) => (
          <label key={f.k}>{f.l}
            {f.t === 'select'
              ? <select value={v[f.k]} onChange={set(f.k)}>{f.o.map((o) => <option key={o[0]} value={o[0]}>{o[1]}</option>)}</select>
              : f.t === 'textarea'
                ? <textarea value={v[f.k]} onChange={set(f.k)} />
                : <input type={f.t || 'text'} value={v[f.k]} onChange={set(f.k)} />}
          </label>
        ))}
        <div className="row"><button className="pri">ذخیره</button><button type="button" onClick={onClose}>انصراف</button></div>
      </form>
    </div>
  )
}
