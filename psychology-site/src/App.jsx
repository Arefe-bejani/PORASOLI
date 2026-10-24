import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import { useStore } from './store'
import { R } from './utils'
import Home from './pages/Home'
import DoctorPage from './pages/DoctorPage'
import BlogPage from './pages/BlogPage'
import Login from './pages/Login'
import Track from './pages/Track'
import Shop from './pages/Shop'
import Cart from './pages/Cart'
import Panel from './panel/Panel'

function Header() {
  const { me, logout, cart } = useStore()
  const nav = useNavigate()
  const count = cart.reduce((s, c) => s + c.qty, 0)
  return (
    <header>
      <b className="brand">نوبت‌دهی روانشناسی</b>
      <Link className="hb" to="/">رزرو نوبت</Link>
      <Link className="hb" to="/shop">فروشگاه</Link>
      <Link className="hb" to="/cart">سبد خرید{count ? ` (${count.toLocaleString('fa-IR')})` : ''}</Link>
      <Link className="hb" to="/track">پیگیری</Link>
      {me
        ? <>
            <Link className="hb" to="/panel">پنل: {me.name} ({R[me.role]})</Link>
            <button className="hb" onClick={() => { logout(); nav('/') }}>خروج</button>
          </>
        : <Link className="hb" to="/login">ورود کارکنان</Link>}
    </header>
  )
}

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctor/:id" element={<DoctorPage />} />
          <Route path="/blog/:id" element={<BlogPage />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/track" element={<Track />} />
          <Route path="/login" element={<Login />} />
          <Route path="/panel/:tab?" element={<Panel />} />
          <Route path="*" element={<div className="card">صفحه پیدا نشد.</div>} />
        </Routes>
      </main>
    </>
  )
}
