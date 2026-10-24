// داده‌های اولیهٔ نمونه. در نسخهٔ واقعی این‌ها از سرور/پایگاه داده می‌آیند.
import { dd } from './utils'

const D = (o) => ({ note: '', dur: 45, brk: 15, hol: [], ig: '', photo: '', posts: [], ver: 1, on: 1, col: '', deg: '', lic: 'نمونه', ...o })
const post = (id, t, x, n) => ({ id, t, x, img: '', date: dd(n) })

export const seed = () => ({
  users: [
    { id: 'u0', name: 'عارف', role: 'admin', code: '16101610', active: 1 },
    { id: 'u1', name: 'شیرین ناصرلویی', role: 'doctor', code: 'DOCTOR-3001', doc: 'd1', active: 1 },
    { id: 'u2', name: 'پویا رسولی', role: 'head', code: '1610', doc: 'd2', active: 1 },
    { id: 'u3', name: 'برزگز', role: 'doctor', code: 'DOCTOR-3002', doc: 'd3', active: 1 },
    { id: 'u4', name: 'مینا آرمان', role: 'doctor', code: 'DOCTOR-3003', doc: 'd4', active: 1 },
  ],
  docs: [
    D({ id: 'd1', name: 'شیرین ناصرلویی', spec: 'روانشناس بالینی، زوج‌درمانی', bio: 'سال‌ها تجربهٔ کار با زوج‌ها و خانواده‌ها.', phone: '09120000001', fee: 1200000, days: [6, 0, 1, 2, 3], from: '09:00', to: '17:00', svc: { online: 1, inperson: 1, couple: 1 },
      posts: [post('pd1', 'چرا از گفتن «نه» می‌ترسیم؟', 'گفتن «نه» مهارتی است که تمرین می‌خواهد. از جملهٔ کوتاه و مؤدبانه شروع کن و به خودت اجازه بده که ناراحتی کوتاه طرف مقابل را تحمل کنی. با تکرار، آسان‌تر می‌شود و رابطه‌ها هم صادقانه‌تر.', -2)] }),
    D({ id: 'd2', name: 'پویا رسولی', spec: 'مشاورهٔ فردی و نوجوان', bio: 'مشاوره برای اضطراب، تحصیل و تغییرهای دوران نوجوانی.', phone: '09120000002', fee: 900000, days: [6, 0, 2, 4], from: '09:00', to: '15:00', svc: { online: 1, inperson: 1, couple: 0 },
      posts: [post('pd2', 'سه کار کوچک برای شب‌های پراسترس', 'قبل از خواب صفحه‌ها را کنار بگذار، نگرانی‌هایت را روی کاغذ بنویس و چند نفس آرام و عمیق بکش. نوشتن، ذهن را از تکرار فکرها سبک می‌کند.', -2)] }),
    D({ id: 'd3', name: 'برزگز', spec: 'روان‌درمانی شناختی-رفتاری', bio: 'درمان افسردگی و اضطراب با رویکرد شناختی-رفتاری.', phone: '09120000003', fee: 1000000, days: [0, 1, 2, 3, 4], from: '10:00', to: '18:00', svc: { online: 1, inperson: 0, couple: 0 },
      posts: [post('pd3', 'افکار منفی، حقیقت نیستند', 'فکرها فقط فکرند، نه واقعیت. وقتی فکر سختی آمد، از خودت بپرس: شواهدش چیست؟ یک نگاه دیگر به ماجرا چه می‌تواند باشد؟ این تمرین ساده پایهٔ درمان شناختی-رفتاری است.', -2)] }),
    D({ id: 'd4', name: 'مینا آرمان', spec: 'روان‌درمانی کودک و خانواده', bio: 'کار با کودکان، والدین و خانواده‌ها با رویکرد بازی‌درمانی و گفتگو.', phone: '09120000004', fee: 950000, days: [6, 1, 3, 4], from: '08:00', to: '14:00', svc: { online: 1, inperson: 1, couple: 0 }, deg: 'کارشناسی ارشد روان‌شناسی کودک',
      posts: [post('pd4', 'بازی، زبان کودکان است', 'کودک احساس‌هایش را بیشتر با بازی نشان می‌دهد تا با حرف. وقتی با فرزندت بازی می‌کنی، بهتر می‌فهمی چه چیزی نگرانش می‌کند.', -3)] }),
  ],
  appts: [
    { id: 'a1', doc: 'd1', date: dd(1), time: '10:00', name: 'مریم احمدی', phone: '09131112233', svc: 'couple', st: 'confirmed' },
    { id: 'a2', doc: 'd1', date: dd(1), time: '11:00', name: 'رضا کریمی', phone: '09141112233', svc: 'inperson', st: 'pending' },
    { id: 'a3', doc: 'd2', date: dd(2), time: '10:00', name: 'نگار صادقی', phone: '09151112233', svc: 'online', st: 'pending' },
    { id: 'a4', doc: 'd3', date: dd(2), time: '12:00', name: 'مریم احمدی', phone: '09131112233', svc: 'online', st: 'confirmed' },
    { id: 'a5', doc: 'd2', date: dd(-3), time: '09:00', name: 'سارا موسوی', phone: '09161112233', svc: 'inperson', st: 'confirmed' },
    ...[21, 14, 7].map((n, i) => ({ id: 'a' + (6 + i), doc: 'd1', date: dd(-n), time: '10:00', name: 'مریم احمدی', phone: '09131112233', svc: 'couple', st: 'confirmed' })),
  ],
  notes: [],
  cc: { '09131112233': '48213', '09141112233': '55102', '09151112233': '33871', '09161112233': '72046' },
  sms: { on: 1, hrs: 24, tpl: 'سلام {نام}، یادآوری نوبت شما با {دکتر} در {تاریخ} ساعت {ساعت}.' },
  products: [
    { id: 'p1', title: 'راهنمای عملی مدیریت اضطراب', type: 'book', format: 'physical', price: 180000, stock: 25, author: 'd3', cover: '', link: '', desc: 'تمرین‌های ساده برای کم کردن دلشوره در زندگی روزمره.' },
    { id: 'p2', title: 'جزوهٔ مهارت‌های ارتباطی زوجین', type: 'note', format: 'digital', price: 60000, stock: 0, author: 'd1', cover: '', link: 'https://example.com/sample.pdf', desc: 'خلاصهٔ مهارت‌های گفتگو، گوش دادن و حل اختلاف.' },
    { id: 'p3', title: 'کتاب کار خودشناسی', type: 'book', format: 'physical', price: 140000, stock: 40, author: 'd2', cover: '', link: '', desc: 'تمرین‌های نوشتاری برای شناخت ارزش‌ها و هدف‌ها.' },
    { id: 'p4', title: 'جزوهٔ آشنایی با درمان شناختی-رفتاری', type: 'note', format: 'digital', price: 45000, stock: 0, author: 'd3', cover: '', link: 'https://example.com/sample.pdf', desc: 'مقدمه‌ای ساده بر افکار، احساس و رفتار.' },
    { id: 'p5', title: 'کتاب بازی‌درمانی برای والدین', type: 'book', format: 'physical', price: 160000, stock: 15, author: 'd4', cover: '', link: '', desc: 'بازی‌هایی برای نزدیک‌تر شدن به دنیای کودک.' },
  ],
  orders: [],
})
