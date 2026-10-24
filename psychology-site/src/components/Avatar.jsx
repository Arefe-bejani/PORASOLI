export default function Avatar({ d }) {
  return d.photo
    ? <img className="av" src={d.photo} alt="" />
    : <span className="av">{(d.name || '؟')[0]}</span>
}
