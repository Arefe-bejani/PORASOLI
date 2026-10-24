// ثابت‌ها و توابع کمکی مشترک
export const R = { admin: 'مدیر کل', head: 'دکتر مدیر', doctor: 'روانشناس' }
export const ST = { pending: 'در انتظار', confirmed: 'تأیید شده', rejected: 'ردشده', cancelled: 'لغوشده' }
export const SV = { online: 'آنلاین', inperson: 'حضوری', couple: 'زوج‌درمانی' }
export const DN = { 6: 'شنبه', 0: 'یکشنبه', 1: 'دوشنبه', 2: 'سه‌شنبه', 3: 'چهارشنبه', 4: 'پنجشنبه', 5: 'جمعه' }
export const OST = { pending: 'در انتظار پرداخت', paid: 'پرداخت‌شده', sent: 'ارسال‌شده', cancelled: 'لغوشده' }
export const PT = { book: 'کتاب', note: 'جزوه' }
export const PAL = [
  ['#1f3a68', 'سرمه‌ای'], ['#2f6f73', 'سبز دودی'], ['#3d6a9e', 'آبی فولادی'],
  ['#6b5b7b', 'ارغوانی'], ['#8a6d3b', 'طلایی مات'], ['#475569', 'طوسی'],
]

const pad = (n) => String(n).padStart(2, '0')
export const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const dd = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return iso(d) }
export const fd = (s) => s ? new Date(s + 'T12:00').toLocaleDateString('fa-IR', { weekday: 'short', month: 'short', day: 'numeric' }) : ''
export const num = (n) => (+n || 0).toLocaleString('fa-IR')
export const hm = (t) => { const [a, b] = t.split(':'); return +a * 60 + +b }
export const mh = (m) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`
export const c5 = () => String(10000 + Math.floor(Math.random() * 90000))
export const gen = () => 'K-' + Math.random().toString(36).slice(2, 8).toUpperCase()
export const isUrl = (u) => /^https?:\/\//.test(u)

export const acc = (d) =>
  d.col && PAL.some((x) => x[0] === d.col)
    ? d.col
    : PAL[[...d.id].reduce((s, c) => s + c.charCodeAt(0), 0) % PAL.length][0]

// ساعت‌های قابل رزرو یک روز براساس برنامهٔ دکتر
export function slots(d, date) {
  const day = new Date(date + 'T12:00').getDay()
  if (!d.days.includes(day) || d.hol.includes(date)) return []
  const end = hm(d.to), out = []
  for (let m = hm(d.from); m + d.dur <= end; m += d.dur + d.brk) out.push(mh(m))
  return out
}
export const taken = (S, doc, date, time, skip) =>
  S.appts.some((a) => a.id !== skip && a.doc === doc && a.date === date && a.time === time && ['pending', 'confirmed'].includes(a.st))

export const scope = (S, me) => (me.role === 'doctor' ? S.appts.filter((a) => a.doc === me.doc) : S.appts)
export const docVisible = (d, me) => (d.on && d.ver) || (me && (me.role === 'admin' || me.doc === d.id))

export const mkDoc = (name, lic = '', deg = '') => ({
  id: 'd' + Date.now(), name, spec: 'روانشناس', bio: '', phone: '', note: '', fee: 1000000, dur: 45, brk: 15,
  days: [6, 0, 1, 2, 3], from: '09:00', to: '17:00', hol: [], svc: { online: 1, inperson: 1, couple: 0 },
  on: 1, ig: '', photo: '', posts: [], lic, deg, ver: 0, col: '',
})

// کوچک‌کردن عکس قبل از ذخیره (برای اینکه حافظهٔ مرورگر پر نشود)
export const resize = (file, w) => new Promise((res) => {
  const r = new FileReader()
  r.onload = () => {
    const i = new Image()
    i.onload = () => {
      const k = Math.min(1, w / i.width), c = document.createElement('canvas')
      c.width = i.width * k; c.height = i.height * k
      c.getContext('2d').drawImage(i, 0, 0, c.width, c.height)
      res(c.toDataURL('image/jpeg', 0.8))
    }
    i.src = r.result
  }
  r.readAsDataURL(file)
})
