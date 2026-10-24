import { useStore } from '../store'
import { slots, taken } from '../utils'

// ساعت‌های یک روز؛ اگر onPick داده شود قابل انتخاب است، وگرنه فقط نمایش
export default function SlotChips({ d, date, sel, onPick }) {
  const { S } = useStore()
  const L = slots(d, date)
  if (!L.length) return <span className="m">تعطیل</span>
  return L.map((t) =>
    taken(S, d.id, date, t)
      ? <button key={t} className="chip bk" disabled>{t}</button>
      : <button key={t} className={'chip ' + (sel === t ? 'pri' : '')} disabled={!onPick} onClick={() => onPick && onPick(t)}>{t}</button>
  )
}
