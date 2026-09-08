'use client'
import Link from 'next/link'

const FREE_DATA = [
  { id: 'bsj-sd1', kelas: 'SD 1', icon: '🌈' },
  { id: 'bsj-sd2', kelas: 'SD 2', icon: '🚀' },
  { id: 'bsj-sd3', kelas: 'SD 3', icon: '⭐' },
  { id: 'bsj-sd4', kelas: 'SD 4', icon: '🎯' },
  { id: 'bsj-sd5', kelas: 'SD 5', icon: '🔥' },
  { id: 'bsj-sd6', kelas: 'SD 6', icon: '👑' },
]

export default function FreePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* HEADER - LOGO MRH ASLI DARI PUBLIC + JUDUL + TAGLINE */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#FFF9D6] border-2 border-amber-200 rounded-2xl px-6 py-4 shadow-md flex items-center gap-4 max-w-full">
            <img src="/mrh-logo.png" alt="MRH DigitalHub" className="h-16 md:h-20 w-auto object-contain flex-shrink-0" />
            <div className="hidden md:block h-14 w- bg-amber-300"></div>
            <div className="text-left">
              <div className="text-xl md:text-2xl font-black text-[#0B8A4A] tracking-tight">BIMBEL SUPER JUARA</div>
              <div className="text-xs md:text-sm font-bold text-slate-700 -mt-1">Belajar lebih terarah, Hadapi TKA Lebih Percaya Diri.</div>
              <div className="text- md:text- font-bold text-slate-500 mt-1">MRH DigitalHub • Konsultan | Sertifikasi | DigitalHub</div>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <span className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-1.5 rounded-full text-sm font-black mb-3 shadow">🎁 GRATIS SELAMANYA - NO VOUCHER</span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">COBA GRATIS 30 SOAL</h1>
          <p className="text-slate-600 mt-3 font-medium">Pilih kelas BOS, langsung kerjain! 3 Mapel x 10 Soal - Auto Score!</p>
        </div>

        {/* 6 KOTAK 100% SAMA LIVE - ICON ASLI BUKAN BINATANG, TANPA ANGKA 120/150 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <Link href="/free/bsj-sd1"><div className="bg-gradient-to-br from-pink-400 to-orange-400 p- rounded-2xl hover:scale-[1.03] hover:shadow-xl transition-all duration-300 shadow-lg group"><div className="bg-white rounded- p-6 h-full"><div className="flex justify-between items-start mb-4"><div className="text-4xl group-hover:scale-110 transition-transform">🌈</div><span className="bg-green-500 text-white text- font-black px-2.5 py-1 rounded-full">FREE</span></div><h3 className="font-black text-xl text-slate-800">Bimbel SD 1</h3><p className="text-sm text-slate-500 mt-1">Matematika, B.Indo, IPA</p><div className="mt-5 flex items-center justify-between"><span className="text-2xl font-black text-slate-800">Soal</span><span className="bg-slate-900 group-hover:bg-black text-white px-5 py-2 rounded-full text-sm font-bold">Mulai →</span></div><div className="mt-3 flex items-center gap-2 text- font-bold"><span className="bg-green-50 border border-green-100 text-green-700 px-2 py-1 rounded-full">✓ 10 MTK</span><span className="bg-sky-50 border border-sky-100 text-sky-700 px-2 py-1 rounded-full">✓ 10 B.Indo</span><span className="bg-purple-50 border border-purple-100 text-purple-700 px-2 py-1 rounded-full">✓ 10 IPA</span></div></div></div></Link>
          <Link href="/free/bsj-sd2"><div className="bg-gradient-to-br from-blue-400 to-cyan-400 p- rounded-2xl hover:scale-[1.03] hover:shadow-xl transition-all duration-300 shadow-lg group"><div className="bg-white rounded- p-6 h-full"><div className="flex justify-between items-start mb-4"><div className="text-4xl group-hover:scale-110 transition-transform">🚀</div><span className="bg-green-500 text-white text- font-black px-2.5 py-1 rounded-full">FREE</span></div><h3 className="font-black text-xl text-slate-800">Bimbel SD 2</h3><p className="text-sm text-slate-500 mt-1">Matematika, B.Indo, IPA</p><div className="mt-5 flex items-center justify-between"><span className="text-2xl font-black text-slate-800">Soal</span><span className="bg-slate-900 group-hover:bg-black text-white px-5 py-2 rounded-full text-sm font-bold">Mulai →</span></div><div className="mt-3 flex items-center gap-2 text- font-bold"><span className="bg-green-50 border border-green-100 text-green-700 px-2 py-1 rounded-full">✓ 10 MTK</span><span className="bg-sky-50 border border-sky-100 text-sky-700 px-2 py-1 rounded-full">✓ 10 B.Indo</span><span className="bg-purple-50 border border-purple-100 text-purple-700 px-2 py-1 rounded-full">✓ 10 IPA</span></div></div></div></Link>
          <Link href="/free/bsj-sd3"><div className="bg-gradient-to-br from-purple-400 to-pink-400 p- rounded-2xl hover:scale-[1.03] hover:shadow-xl transition-all duration-300 shadow-lg group"><div className="bg-white rounded- p-6 h-full"><div className="flex justify-between items-start mb-4"><div className="text-4xl group-hover:scale-110 transition-transform">⭐</div><span className="bg-green-500 text-white text- font-black px-2.5 py-1 rounded-full">FREE</span></div><h3 className="font-black text-xl text-slate-800">Bimbel SD 3</h3><p className="text-sm text-slate-500 mt-1">Matematika, B.Indo, IPA</p><div className="mt-5 flex items-center justify-between"><span className="text-2xl font-black text-slate-800">Soal</span><span className="bg-slate-900 group-hover:bg-black text-white px-5 py-2 rounded-full text-sm font-bold">Mulai →</span></div><div className="mt-3 flex items-center gap-2 text- font-bold"><span className="bg-green-50 border border-green-100 text-green-700 px-2 py-1 rounded-full">✓ 10 MTK</span><span className="bg-sky-50 border border-sky-100 text-sky-700 px-2 py-1 rounded-full">✓ 10 B.Indo</span><span className="bg-purple-50 border border-purple-100 text-purple-700 px-2 py-1 rounded-full">✓ 10 IPA</span></div></div></div></Link>
          <Link href="/free/bsj-sd4"><div className="bg-gradient-to-br from-green-400 to-emerald-500 p- rounded-2xl hover:scale-[1.03] hover:shadow-xl transition-all duration-300 shadow-lg group"><div className="bg-white rounded- p-6 h-full"><div className="flex justify-between items-start mb-4"><div className="text-4xl group-hover:scale-110 transition-transform">🎯</div><span className="bg-green-500 text-white text- font-black px-2.5 py-1 rounded-full">FREE</span></div><h3 className="font-black text-xl text-slate-800">Bimbel SD 4</h3><p className="text-sm text-slate-500 mt-1">Matematika, B.Indo, IPA</p><div className="mt-5 flex items-center justify-between"><span className="text-2xl font-black text-slate-800">Soal</span><span className="bg-slate-900 group-hover:bg-black text-white px-5 py-2 rounded-full text-sm font-bold">Mulai →</span></div><div className="mt-3 flex items-center gap-2 text- font-bold"><span className="bg-green-50 border border-green-100 text-green-700 px-2 py-1 rounded-full">✓ 10 MTK</span><span className="bg-sky-50 border border-sky-100 text-sky-700 px-2 py-1 rounded-full">✓ 10 B.Indo</span><span className="bg-purple-50 border border-purple-100 text-purple-700 px-2 py-1 rounded-full">✓ 10 IPA</span></div></div></div></Link>
          <Link href="/free/bsj-sd5"><div className="bg-gradient-to-br from-orange-400 to-red-500 p- rounded-2xl hover:scale-[1.03] hover:shadow-xl transition-all duration-300 shadow-lg group"><div className="bg-white rounded- p-6 h-full"><div className="flex justify-between items-start mb-4"><div className="text-4xl group-hover:scale-110 transition-transform">🔥</div><span className="bg-green-500 text-white text- font-black px-2.5 py-1 rounded-full">FREE</span></div><h3 className="font-black text-xl text-slate-800">Bimbel SD 5</h3><p className="text-sm text-slate-500 mt-1">Matematika, B.Indo, IPA</p><div className="mt-5 flex items-center justify-between"><span className="text-2xl font-black text-slate-800">Soal</span><span className="bg-slate-900 group-hover:bg-black text-white px-5 py-2 rounded-full text-sm font-bold">Mulai →</span></div><div className="mt-3 flex items-center gap-2 text- font-bold"><span className="bg-green-50 border border-green-100 text-green-700 px-2 py-1 rounded-full">✓ 10 MTK</span><span className="bg-sky-50 border border-sky-100 text-sky-700 px-2 py-1 rounded-full">✓ 10 B.Indo</span><span className="bg-purple-50 border border-purple-100 text-purple-700 px-2 py-1 rounded-full">✓ 10 IPA</span></div></div></div></Link>
          <Link href="/free/bsj-sd6"><div className="bg-gradient-to-br from-yellow-400 to-amber-500 p- rounded-2xl hover:scale-[1.03] hover:shadow-xl transition-all duration-300 shadow-lg group"><div className="bg-white rounded- p-6 h-full"><div className="flex justify-between items-start mb-4"><div className="text-4xl group-hover:scale-110 transition-transform">👑</div><span className="bg-green-500 text-white text- font-black px-2.5 py-1 rounded-full">FREE</span></div><h3 className="font-black text-xl text-slate-800">Bimbel SD 6</h3><p className="text-sm text-slate-500 mt-1">Matematika, B.Indo, IPA</p><div className="mt-5 flex items-center justify-between"><span className="text-2xl font-black text-slate-800">Soal</span><span className="bg-slate-900 group-hover:bg-black text-white px-5 py-2 rounded-full text-sm font-bold">Mulai →</span></div><div className="mt-3 flex items-center gap-2 text- font-bold"><span className="bg-green-50 border border-green-100 text-green-700 px-2 py-1 rounded-full">✓ 10 MTK</span><span className="bg-sky-50 border border-sky-100 text-sky-700 px-2 py-1 rounded-full">✓ 10 B.Indo</span><span className="bg-purple-50 border border-purple-100 text-purple-700 px-2 py-1 rounded-full">✓ 10 IPA</span></div></div></div></Link>
        </div>

        {/* BOX BAWAH HIJAU TOSCA #0B8A4A */}
        <div className="mt-10 bg-[#0B8A4A] rounded-2xl p-6 md:p-8 text-center shadow-xl border-2 border-[#0A7A41]">
          <h4 className="font-black text-white text-lg md:text-xl">Mau 600 Soal Lengkap + Pembahasan?</h4>
          <p className="text-sm md:text-base text-green-100 mt-2 font-medium">Upgrade cuma <span className="font-black text-yellow-300 text-lg">Rp 17RB</span> <span className="line-through text-xs text-green-200">99RB</span> per kelas - HEMAT 82%!</p>
          <div className="flex flex-col md:flex-row gap-3 justify-center mt-5">
            <Link href="/soal" className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-all border-2 border-orange-300">Lihat Paket 17RB → 600 Soal</Link>
            <Link href="/" className="inline-block bg-slate-900 text-white font-black px-8 py-3 rounded-full shadow-lg hover:bg-black transition-all border-2 border-slate-700">← Kembali ke Beranda</Link>
          </div>
        </div>

        {/* FOOTER LOGO MRH ASLI DARI PUBLIC */}
        <div className="mt-8 flex justify-center">
          <div className="bg-[#FFF9D6] rounded-full px-5 py-2.5 flex items-center gap-3 border border-amber-100 shadow-sm">
            <img src="/mrh-logo.png" alt="MRH" className="h-7 w-auto object-contain" />
            <span className="text- font-bold text-slate-600">© 2026 BIMBEL SUPER JUARA • MRH DigitalHub</span>
          </div>
        </div>
      </div>
    </div>
  )
}