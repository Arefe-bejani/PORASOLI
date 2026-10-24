import { SV } from '../utils'

export default function Chips({ d }) {
  return Object.keys(SV).filter((k) => d.svc[k]).map((k) => <span className="chip" key={k}>{SV[k]}</span>)
}
