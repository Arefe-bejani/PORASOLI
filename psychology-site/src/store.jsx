import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { seed } from './seed'

const KEY = 'psy_react_v1'
const CART = 'psy_cart_v1'
const read = (k, fb) => { try { return JSON.parse(localStorage.getItem(k)) ?? fb } catch { return fb } }
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch { /* حافظه پر است */ } }

const Ctx = createContext(null)
export const useStore = () => useContext(Ctx)

export function StoreProvider({ children }) {
  const [S, setS] = useState(() => read(KEY, null) || seed())
  const [meId, setMeId] = useState(null)
  const [cart, setCart] = useState(() => read(CART, []))

  useEffect(() => write(KEY, S), [S])
  useEffect(() => write(CART, cart), [cart])

  // up((s)=>{...}) یک کپی از state می‌سازد، تغییر را روی آن اعمال می‌کند و ذخیره می‌کند
  const up = useCallback((fn) => setS((p) => { const n = structuredClone(p); fn(n); return n }), [])
  const me = useMemo(() => S.users.find((u) => u.id === meId && u.active) || null, [S.users, meId])

  const login = (code) => {
    const u = S.users.find((x) => x.code === code.trim())
    if (!u) return 'کد ورود نامعتبر است.'
    if (!u.active) return 'این حساب غیرفعال است.'
    setMeId(u.id)
    return null
  }
  const logout = () => setMeId(null)

  return <Ctx.Provider value={{ S, up, me, login, logout, cart, setCart }}>{children}</Ctx.Provider>
}
