'use client'
import Link from 'next/link'

const FREE_DATA = [
  { id: 'bsj-sd1', kelas: 'SD 1', icon: '🌈', warna: 'from-pink-400 to-orange-400', border: 'border-orange-200' },
  { id: 'bsj-sd2', kelas: 'SD 2', icon: '🚀', warna: 'from-blue-400 to-cyan-400', border: 'border-sky-200' },
  { id: 'bsj-sd3', kelas: 'SD 3', icon: '⭐', warna: 'from-purple-400 to-pink-400', border: 'border-purple-200' },
  { id: 'bsj-sd4', kelas: 'SD 4', icon: '🎯', warna: 'from-green-400 to-emerald-500', border: 'border-emerald-200' },
  { id: 'bsj-sd5', kelas: 'SD 5', icon: '🔥', warna: 'from-orange-400 to-red-500', border: 'border-orange-200' },
  { id: 'bsj-sd6', kelas: 'SD 6', icon: '👑', warna: 'from-yellow-400 to-amber-500', border: 'border-amber-200' },
]

export default function FreePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* HEADER - FIX LOGO DOUBLE TERPOTONG - PAKAI 1 LOGO UTUH DARI PUBLIC */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#FFF9D6] border-2 border-amber-200 rounded-2xl px-4 py-3 shadow-md">
            <img 
              src="/mrh-logo.png" 
              alt="MRH DigitalHub - Bimbel Super Juara" 
              className="h-[68px] md:h-[84px] w-auto max-w-[90vw] object-contain"
            />
          </div>
        </div>

        {/* JUDUL */}
        <div className="text-center mb-8">
          <span className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-1.5 rounded-full text-sm font-black mb-3 shadow">🎁 GRATIS SELAMANYA - NO VOUCHER</span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">COBA GRATIS 30 SOAL</h1>
          <p className="text-slate-600 mt-3 font-medium">Pilih kelas BOS, langsung kerjain! 3 Mapel x 10 Soal - Auto Score!</p>
        </div>

        {/* GRID KELAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FREE_DATA.map((paket:any) => (
            <Link key={paket.id} href={`/free/${paket.id}`}>
              <div className={`bg-gradient-to-br ${paket.warna} p-[2px] rounded-2xl hover:scale-[1.03] hover:shadow-xl transition-all duration-300 shadow-lg group`}>
                <div className="bg-white rounded-[14px] p-6 h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-4xl group-hover:scale-110 transition-transform">{paket.icon}</div>
                    <span className="bg-green-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full">FREE</span>
                  </div>
                  <h3 className="font-black text-xl text-slate-800">Bimbel {paket.kelas}</h3>
                  <p className="text-sm text-slate-500 mt-1">Matematika, B.Indo, IPA</p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-2xl font-black text-slate-800">{paket.total} Soal</span>
                    <span className="bg-slate-900 group-hover:bg-black text-white px-5 py-2 rounded-full text-sm font-bold">Mulai →</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-green-600 font-bold">
                    <span className="bg-green-50 px-2 py-1 rounded-full">✓ 10 MTK</span>
                    <span className="bg-blue-50 px-2 py-1 rounded-full">✓ 10 B.Indo</span>
                    <span className="bg-purple-50 px-2 py-1 rounded-full">✓ 10 IPA</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* TOMBOL LIHAT PAKET - DIKEMBALIKAN BOS! */}
        <div className="mt-10 bg-white border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center shadow-sm">
          <h4 className="font-black text-slate-800 text-lg">Mau 600 Soal Lengkap + Pembahasan?</h4>
          <p className="text-sm text-slate-600 mt-1">Upgrade cuma <span className="font-black text-orange-600 text-lg">Rp 17RB</span> <span className="line-through text-xs">99RB</span> per kelas - HEMAT 82%!</p>
          <div className="flex flex-col md:flex-row gap-3 justify-center mt-5">
            <Link href="/soal" className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white font-black px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-all">
              Lihat Paket 17RB → 600 Soal
            </Link>
            <Link href="/" className="inline-block bg-slate-900 text-white font-black px-8 py-3 rounded-full shadow-lg hover:bg-black transition-all">
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>

        {/* FOOTER - FIX LOGO TIDAK DOUBLE, PAKAI PUBLIC */}
        <div className="mt-8 flex justify-center">
          <div className="bg-[#FFF9D6] rounded-full px-5 py-2.5 flex items-center gap-3 border border-amber-100 shadow-sm">
            <img src="/mrh-logo.png" alt="MRH" className="h-7 w-auto object-contain" />
            <span className="text-[11px] font-bold text-slate-600">© 2026 BIMBEL SUPER JUARA • MRH DigitalHub</span>
          </div>
        </div>

      </div>
    </div>
  )
}
