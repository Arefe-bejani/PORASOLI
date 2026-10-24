import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'

export default function Login() {
  const { login } = useStore()
  const nav = useNavigate()
  const [code, setCode] = useState('')
  const submit = (e) => {
    e.preventDefault()
    const err = login(code)
    if (err) alert(err); else nav('/panel')
  }
  return (
    <form className="card" style={{ maxWidth: 380, margin: '30px auto' }} onSubmit={submit}>
      <h2>ورود کارکنان</h2>
      <label>کد ورود<input dir="ltr" autoComplete="off" value={code} onChange={(e) => setCode(e.target.value)} /></label>
      <button className="pri">ورود</button>
      <details style={{ marginTop: 10 }} className="m">
        <summary>کدهای نمونه</summary>
        <p>مدیر کل: 16101610<br />دکتر مدیر (پویا رسولی): 1610<br />شیرین ناصرلویی: DOCTOR-3001<br />برزگز: DOCTOR-3002<br />مینا آرمان: DOCTOR-3003</p>
        <p>این کدها اولیه‌اند و پس از تغییر دیگر معتبر نیستند.</p>
      </details>
    </form>
  )
}
