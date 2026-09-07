'use client'
import Link from 'next/link'

const FREE_DATA = [
  { id: 'bsj-sd1', kelas: 'SD 1', icon: '🌈', warna: 'from-pink-400 to-orange-400', total: 30, desc: 'Matematika, B.Indo, IPA' },
  { id: 'bsj-sd2', kelas: 'SD 2', icon: '🚀', warna: 'from-blue-400 to-cyan-400', total: 30, desc: 'Matematika, B.Indo, IPA' },
  { id: 'bsj-sd3', kelas: 'SD 3', icon: '⭐', warna: 'from-purple-400 to-pink-400', total: 30, desc: 'Matematika, B.Indo, IPA' },
  { id: 'bsj-sd4', kelas: 'SD 4', icon: '🎯', warna: 'from-green-400 to-emerald-500', total: 30, desc: 'Matematika, B.Indo, IPA' },
  { id: 'bsj-sd5', kelas: 'SD 5', icon: '🔥', warna: 'from-orange-400 to-red-500', total: 30, desc: 'Matematika, B.Indo, IPA' },
  { id: 'bsj-sd6', kelas: 'SD 6', icon: '👑', warna: 'from-yellow-400 to-amber-500', total: 30, desc: 'Matematika, B.Indo, IPA' },
]

export default function FreePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* LOGO MRH HEADER */}
        <div className="flex flex-col items-center mb-8">
          <img src="/logo-mrh-transparan.png" alt="MRH DigitalHub" className="h-20 md:h-24 object-contain mb-3" onError={(e) => (e.currentTarget.style.display='none')} />
          <div className="bg-white border border-slate-200 rounded-full px-4 py-1 flex items-center gap-2 shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-slate-600">MRH DigitalHub • Bimbel Super Juara</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <span className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-1.5 rounded-full text-sm font-black mb-3 shadow">🎁 GRATIS SELAMANYA - NO VOUCHER</span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">COBA GRATIS 30 SOAL</h1>
          <p className="text-slate-600 mt-3 font-medium">Pilih kelas BOS, langsung kerjain! 3 Mapel x 10 Soal - Auto Score!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FREE_DATA.map((paket) => (
            <Link key={paket.id} href={`/free/${paket.id}`}>
              <div className={`bg-gradient-to-br ${paket.warna} p-[2px] rounded-2xl hover:scale-[1.03] hover:shadow-xl transition-all duration-300 shadow-lg group`}>
                <div className="bg-white rounded-[14px] p-6 h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-50 to-transparent rounded-full -mr-10 -mt-10"></div>
                  <div className="relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-4xl group-hover:scale-110 transition-transform">{paket.icon}</div>
                      <span className="bg-green-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full tracking-wider">FREE</span>
                    </div>
                    <h3 className="font-black text-xl text-slate-800">Bimbel {paket.kelas}</h3>
                    <p className="text-sm text-slate-500 mt-1 font-medium">{paket.desc}</p>
                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-2xl font-black text-slate-800">{paket.total} Soal</span>
                      <span className="bg-slate-900 group-hover:bg-black text-white px-5 py-2 rounded-full text-sm font-bold transition-colors">Mulai →</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-green-600 font-bold">
                      <span className="bg-green-50 px-2 py-1 rounded-full">✓ 10 MTK</span>
                      <span className="bg-blue-50 px-2 py-1 rounded-full">✓ 10 B.Indo</span>
                      <span className="bg-purple-50 px-2 py-1 rounded-full">✓ 10 IPA</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 bg-white border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center shadow-sm">
          <h4 className="font-black text-slate-800 text-lg">Mau 600 Soal Lengkap + Pembahasan Video?</h4>
          <p className="text-sm text-slate-600 mt-1">Upgrade cuma <span className="font-black text-orange-600 text-lg">Rp 17RB</span> <span className="line-through text-xs text-slate-400">Rp 99RB</span> per kelas - HEMAT 82%!</p>
          <Link href="/soal" className="inline-block mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-black px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-all">Lihat Paket 17RB → 600 Soal</Link>
          <div className="mt-3 text-[11px] text-slate-400 font-medium">By MRH DigitalHub • Konsultan | Sertifikasi | DigitalHub • Bersinergi Bertransformasi Industri Modern</div>
        </div>

        <div className="mt-8 flex justify-center">
          <img src="/logo-mrh-transparan.png" alt="MRH" className="h-12 object-contain opacity-80" onError={(e) => (e.currentTarget.style.display='none')} />
        </div>
      </div>
    </div>
  )
}
