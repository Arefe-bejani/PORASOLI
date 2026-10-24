import { Link, useNavigate } from 'react-router-dom'
import Avatar from '../components/Avatar'
import Chips from '../components/Chips'
import { useStore } from '../store'
import { acc, num } from '../utils'

const INFO = [
  ['روانشناسی یعنی چه؟', 'روانشناسی علم مطالعهٔ فکر، احساس و رفتار آدم‌هاست. روانشناس کمک می‌کند خودت و الگوهایی که تکرار می‌کنی را بهتر بشناسی.'],
  ['کِی سراغ مشاوره برویم؟', 'لازم نیست حالت خیلی بد باشد. استرس زیاد، دلشوره، ناراحتیِ کم‌نشدنی، مشکل در رابطه یا تصمیم سخت، همه دلیل خوبی‌اند.'],
  ['جلسهٔ اول چطور است؟', 'بیشتر آشنایی است. روانشناس سؤال می‌پرسد، تو هر قدر راحتی می‌گویی و با هم هدف مشخص می‌کنید.'],
  ['روانشناس یا روانپزشک؟', 'روانشناس با گفتگو و روش‌های درمانی کار می‌کند. روانپزشک پزشک است و می‌تواند دارو تجویز کند. گاهی هر دو با هم کمک می‌کنند.'],
  ['محرمانگی', 'آنچه در جلسه می‌گویی محرمانه است، مگر در موارد خیلی خاص مثل خطر جدی برای جان خودت یا دیگران.'],
  ['کارهای کوچک روزانه', 'خواب منظم، چند دقیقه حرکت، نوشتن احساس‌ها و حرف زدن با یک آدم مطمئن کمک می‌کند. این‌ها جایگزین درمان نیستند.'],
]

export default function Home() {
  const { S } = useStore()
  const nav = useNavigate()
  return (
    <>
      <div className="grid">
        {S.docs.filter((d) => d.on && d.ver).map((d) => (
          <div className="card" key={d.id} style={{ borderTop: `6px solid ${acc(d)}` }}>
            <Link to={`/doctor/${d.id}`} className="row lnk" style={{ alignItems: 'center' }}>
              <Avatar d={d} />
              <div><h3>{d.name}</h3><p className="m">{d.spec}</p><p className="m">صفحهٔ شخصی را ببین</p></div>
            </Link>
            <p className="m">پروانه تأیید شده</p>
            <p><Chips d={d} /></p>
            <p className="m">تعرفهٔ هر جلسه: {num(d.fee)} تومان</p>
            <button className="pri" onClick={() => nav(`/doctor/${d.id}`, { state: { book: true } })}>رزرو نوبت</button>
            <button onClick={() => nav(`/blog/${d.id}`)}>وبلاگ 📖</button>
          </div>
        ))}
      </div>

      <h2>روانشناسی به زبان ساده</h2>
      <div className="stack">
        {INFO.map(([t, x]) => <div className="card info" key={t}><h3>{t}</h3><p>{x}</p></div>)}
      </div>
      <div className="card" style={{ background: '#fff5f5', borderColor: '#f3c9c9' }}>
        <b>اگر در بحران هستی و فکر آسیب به خودت یا دیگران داری،</b> همین الان با اورژانس ۱۱۵ یا اورژانس اجتماعی ۱۲۳ تماس بگیر یا به یک آدم نزدیک بگو.
      </div>
    </>
  )
}
