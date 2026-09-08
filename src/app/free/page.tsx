'use client'
import Image from 'next/image'
import Link from 'next/link'

const WA_LINK = "https://wa.me/6281770220059?text=Halo%20Kak%20MRH%20DigitalHub%2C%20saya%20mau%20pesan%20Paket%20Bimbel%20Super%20Juara%2017RB%20%F0%9F%9A%80"

const FREE_DATA = [
  { id: 'bsj-sd1', kelas: 'SD 1', icon: '🌈', grad: 'from-pink-400 to-orange-400', border: 'border-pink-300' },
  { id: 'bsj-sd2', kelas: 'SD 2', icon: '🚀', grad: 'from-blue-400 to-cyan-400', border: 'border-blue-300' },
  { id: 'bsj-sd3', kelas: 'SD 3', icon: '⭐', grad: 'from-purple-400 to-pink-400', border: 'border-purple-300' },
  { id: 'bsj-sd4', kelas: 'SD 4', icon: '🎯', grad: 'from-green-400 to-emerald-500', border: 'border-green-300' },
  { id: 'bsj-sd5', kelas: 'SD 5', icon: '🔥', grad: 'from-orange-400 to-red-500', border: 'border-orange-300', baru: true },
  { id: 'bsj-sd6', kelas: 'SD 6', icon: '👑', grad: 'from-yellow-400 to-amber-500', border: 'border-yellow-300', baru: true },
]

export default function FreePage() {
  return (
    <div className="min-h-screen bg-[#f8f7ff] font-[Nunito] flex flex-col">
      {/* HEADER MRH */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h- flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            {/* LOGO MRH RESMI DARI PUBLIC */}
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm flex items-center justify-center">
              <img src="/mrh-logo.png" alt="MRH Logo" className="w-full h-full object-contain p-1" onError={(e:any)=>{e.target.style.display='none'; e.target.nextSibling.style.display='flex'}} />
              <span className="hidden w-full h-full bg-gradient-to-br from-orange-400 to-amber-500 text-white font-black items-center justify-center text-">MRH</span>
            </div>
            <div className="leading-tight">
              <div className="font-black text- text-slate-800 tracking-tight">Bimbel Super Juara</div>
              <div className="text- font-semibold text-slate-500">Bimbel TKA SD Terlengkap - Persiapan Masa Depan</div>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/" className="text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5">Home</Link>
            <span className="text-sm font-bold text-white bg-slate-900 px-3 py-1.5 rounded-full">Soal Gratis</span>
            <a href={WA_LINK} target="_blank" className="text-sm font-bold bg-orange-500 text-white px-4 py-1.5 rounded-full hover:bg-orange-600">Paket 17RB</a>
            <span className="bg-green-100 text-green-700 text- font-bold px-3 py-1 rounded-full border border-green-200">🎁 GRATIS SELAMANYA - 175 SOAL</span>
          </div>
        </div>
      </header>

      {/* BREADCRUMB + BACK */}
      <div className="max-w-6xl mx-auto w-full px-4 mt-4">
        <div className="flex items-center gap-2 text- font-semibold text-slate-500">
          <Link href="/" className="inline-flex items-center gap-1 bg-white border border-slate-200 px-3 py-1 rounded-full hover:bg-slate-50">
            <span>⬅️</span> Back ke Home
          </Link>
          <span className="mx-1">/</span>
          <Link href="/" className="hover:text-slate-800">Home</Link>
          <span>/</span>
          <span className="text-slate-800 font-bold">Soal Gratis</span>
          <span>/</span>
          <span className="text-slate-800">SD1-SD6</span>
        </div>
      </div>

      {/* MAIN */}
      <main className="max-w-6xl mx-auto w-full px-4 py-6 flex-1">
        <div className="text-center mb-8">
          <div className="inline-flex md:hidden bg-green-100 text-green-700 text- font-bold px-3 py-1 rounded-full border border-green-200 mb-3">🎁 GRATIS SELAMANYA - 175 SOAL</div>
          <h1 className="text- md:text- font-black text-slate-900 leading-none">COBA GRATIS 30 SOAL</h1>
          <p className="mt-2 text- font-semibold text-slate-600">Pend. Agama & Budi Pekerti, PPKn, B.Indonesia, Matematika, IPAS</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FREE_DATA.map((p) => (
            <Link key={p.id} href={`/free/${p.id}`}>
              <div className={`bg-gradient-to-br ${p.grad} p- rounded-2xl hover:scale-[1.02] transition-all shadow-[0_8px_24px_rgba(0,0,0,0.08)]`}>
                <div className="bg-white rounded- p-5 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <div className="text- leading-none">{p.icon}</div>
                    <div className="flex gap-1">
                      <span className="bg-green-500 text-white text- font-black px-2 py-1 rounded-full">FREE</span>
                      {p.baru && <span className="bg-slate-900 text-white text- font-black px-2 py-1 rounded-full">BARU MASUK</span>}
                    </div>
                  </div>
                  <h3 className="font-black text- text-slate-900">Bimbel {p.kelas}</h3>
                  <p className="mt-1 text- font-bold text-slate-500 leading-[1.35] line-clamp-2 min-h-">
                    Pend. Agama & Budi Pekerti, Pend. Pancasila/PPKn, B. Indonesia, Matematika, IPAS
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="bg-slate-900 text-white text- font-black px-3 py-1 rounded-full">30 soal</span>
                    <span className="bg-slate-100 text-slate-600 text- font-mono px-2 py-1 rounded-full">{p.id} • is_free=true</span>
                  </div>
                  <div className="mt-4">
                    <span className="w-full inline-flex justify-center bg-slate-900 text-white text- font-black px-4 py-2.5 rounded-full">Mulai →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* FOOTER + CTA */}
      <footer className="mt-10 bg-slate-900 rounded-t- text-white">
        <div className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white flex items-center justify-center">
                <img src="/mrh-logo.png" alt="MRH" className="w-full h-full object-contain p-1" />
              </div>
              <div>
                <div className="font-black text-">MRH DigitalHub</div>
                <div className="text- text-slate-300 font-semibold -mt-1">Cetak Generasi Juara</div>
              </div>
            </div>
            <p className="mt-3 text- text-slate-300 leading-[1.5]">Bimbel TKA SD/MI terlengkap. Soal sesuai kisi-kisi resmi, pembahasan detail, akses selamanya.</p>
          </div>
          <div className="text- font-semibold text-slate-300">
            <div className="font-black text-white mb-2">Navigasi</div>
            <div className="flex flex-col gap-1.5">
              <Link href="/" className="hover:text-white">Tentang Kami</Link>
              <Link href="/free" className="hover:text-white">Cara Kerja Soal Gratis</Link>
              <a href={WA_LINK} target="_blank" className="hover:text-white">Paket 17RB - 600 Soal</a>
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            <a href={WA_LINK} target="_blank" className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-black text- px-5 py-3 rounded-full transition">
              🚀 Lanjut Pesan Paket 17RB →
            </a>
            <Link href="/" className="inline-flex items-center justify-center gap-2 bg-transparent border border-white/30 hover:bg-white/10 text-white font-bold text- px-5 py-2.5 rounded-full">
              ⬅️ Back ke Home
            </Link>
            <div className="text- text-slate-400 mt-1">Chat langsung WA: 081770220059 • Respon cepat 24 jam</div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-3 text- text-slate-400 font-semibold flex justify-between">
            <span>© 2026 MRH DigitalHub - Bimbel Super Juara</span>
            <span>bimbel-super-juara.vercel.app</span>
          </div>
        </div>
      </footer>

      {/* MOBILE STICKY CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 px-3 py-2.5 flex gap-2">
        <Link href="/" className="flex-1 bg-slate-100 text-slate-800 font-bold text- px-3 py-3 rounded-full text-center">⬅️ Back</Link>
        <a href={WA_LINK} target="_blank" className="flex-[2] bg-orange-500 text-white font-black text- px-3 py-3 rounded-full text-center">🚀 Pesan Paket 17RB</a>
      </div>
      <div className="md:hidden h-" />
    </div>
  )
}