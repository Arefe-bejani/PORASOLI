import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../store'
import Appointments from './Appointments'
import Clients from './Clients'
import { DocsTab, MySchedule } from './Doctors'
import Products from './Products'
import { Accounts, MyAccount, Orders, Reports, SmsSettings } from './Tabs'

// تب‌هایی که هر نقش می‌بیند
const tabsFor = (me) => {
  const a = me.role === 'admin', h = me.role === 'head'
  return [
    ['appts', 'نوبت‌ها'],
    a || h ? ['docs', 'روانشناسان'] : ['sched', 'پروفایل و برنامهٔ من'],
    ['clients', 'مراجعین'],
    ['rep', 'گزارش‌ها'],
    ['shop', 'کتاب‌ها و جزوه‌ها'],
    ...(a ? [['orders', 'سفارش‌های فروشگاه'], ['accts', 'حساب‌ها و نقش‌ها'], ['sms', 'پیامک یادآوری']] : h ? [['accts', 'اعضا']] : []),
    ['acc', 'حساب من'],
  ]
}

const banner = (me) => {
  const f = me.name.split(' ')[0]
  return {
    admin: `سلام ${f}، تو مدیر کل سایت هستی و به همهٔ بخش‌ها دسترسی داری: نوبت‌ها، حساب‌ها و نقش‌ها، تعرفه‌ها، پروفایل روانشناس‌ها، فروشگاه و پیامک یادآوری.`,
    head: `سلام ${f}، تو مدیر سایت هستی. نوبت‌ها، برنامه و گزارش همهٔ روانشناس‌ها را می‌بینی، نوبت‌ها را تأیید، رد یا لغو می‌کنی و بر کار اعضا و یادداشت‌های مراجعین نظارت داری. تعرفه‌ها، ساخت حساب، سفارش‌ها و پیامک فقط دست مدیر کل است.`,
    doctor: `سلام ${f}، این پنل مخصوص توست: نوبت‌ها، زمان‌های آزاد، ساعت کاری، خدمات، مراجعین، گزارش و کتاب‌ها و جزوه‌های خودت.`,
  }[me.role]
}

const VIEWS = { appts: Appointments, docs: DocsTab, sched: MySchedule, clients: Clients, rep: Reports, shop: Products, orders: Orders, accts: Accounts, sms: SmsSettings, acc: MyAccount }

export default function Panel() {
  const { me } = useStore()
  const { tab } = useParams()
  const nav = useNavigate()
  if (!me) return <Navigate to="/login" replace />
  const T = tabsFor(me)
  const cur = T.some((t) => t[0] === tab) ? tab : 'appts'
  const View = VIEWS[cur]
  return (
    <>
      <div className="card" style={{ borderColor: 'var(--pri)' }}>{banner(me)}</div>
      <div className="tabs">
        {T.map(([k, l]) => <button key={k} className={cur === k ? 'pri' : ''} onClick={() => nav('/panel/' + k)}>{l}</button>)}
      </div>
      <View />
    </>
  )
}
