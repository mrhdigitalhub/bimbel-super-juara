'use client'
import { useState } from 'react'
import Link from 'next/link'

const FREE_DATA = [
  { id: 'bsj-sd1', kelas: 'SD 1', icon: '🌈', warna: 'from-pink-400 to-orange-400', total: 30 },
  { id: 'bsj-sd2', kelas: 'SD 2', icon: '🚀', warna: 'from-blue-400 to-cyan-400', total: 30 },
  { id: 'bsj-sd3', kelas: 'SD 3', icon: '⭐', warna: 'from-purple-400 to-pink-400', total: 30 },
  { id: 'bsj-sd4', kelas: 'SD 4', icon: '🎯', warna: 'from-green-400 to-emerald-500', total: 30 },
  { id: 'bsj-sd5', kelas: 'SD 5', icon: '🔥', warna: 'from-orange-400 to-red-500', total: 30 },
  { id: 'bsj-sd6', kelas: 'SD 6', icon: '👑', warna: 'from-yellow-400 to-amber-500', total: 30 },
]

export default function FreePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-bold mb-3">🎁 GRATIS SELAMANYA</span>
          <h1 className="text-4xl font-black text-slate-800">COBA GRATIS 30 SOAL</h1>
          <p className="text-slate-600 mt-2">3 Mapel x 10 Soal per kelas - No voucher, langsung kerjain!</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FREE_DATA.map((paket) => (
            <Link key={paket.id} href={`/free/${paket.id}`}>
              <div className={`bg-gradient-to-br ${paket.warna} p-[2px] rounded-2xl hover:scale-105 transition-all shadow-lg`}>
                <div className="bg-white rounded-[14px] p-6 h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-4xl">{paket.icon}</div>
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">FREE</span>
                  </div>
                  <h3 className="font-black text-xl text-slate-800">Bimbel {paket.kelas}</h3>
                  <p className="text-sm text-slate-500 mt-1">Matematika, B.Indo, IPA</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-2xl font-black text-slate-800">{paket.total} Soal</span>
                    <span className="bg-slate-800 text-white px-4 py-2 rounded-full text-sm font-bold">Mulai →</span>
                  </div>
                  <div className="mt-3 text-xs text-green-600 font-semibold">✓ 10 MTK + 10 B.Indo + 10 IPA</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 bg-white border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center">
          <h4 className="font-bold text-slate-700">Mau 600 Soal Lengkap?</h4>
          <p className="text-sm text-slate-500 mt-1">Upgrade cuma <span className="font-black text-orange-600">Rp 17RB</span> <span className="line-through text-xs">99RB</span> per kelas - 650 PAS!</p>
          <Link href="/soal" className="inline-block mt-3 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2 rounded-full">Lihat Paket 17RB →</Link>
        </div>
      </div>
    </div>
  )
}
