'use client'
import { useState } from 'react'
import Link from 'next/link'

const FREE_DATA = [
  { id: 'bsj-sd1', kelas: 'SD 1', icon: '🌈', warna: 'from-pink-400 to-orange-400', total: 30 },
  { id: 'bsj-sd2', kelas: 'SD 2', icon: '🚀', warna: 'from-blue-400 to-cyan-400', total: 30 },
  { id: 'bsj-sd3', kelas: 'SD 3', icon: '⭐', warna: 'from-purple-400 to-pink-400', total: 30 },
  { id: 'bsj-sd4', kelas: 'SD 4', icon: '🎯', warna: 'from-green-400 to-emerald-500', total: 30 },
  { id: 'bsj-sd5', kelas: 'SD 5', icon: '🔥', warna: 'from-orange-400 to-red-500', total: 30, baru: true },
  { id: 'bsj-sd6', kelas: 'SD 6', icon: '👑', warna: 'from-yellow-400 to-amber-500', total: 30, baru: true },
]

export default function FreePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <span className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-bold mb-3">🎁 GRATIS SELAMANYA - 175 SOAL</span>
          <h1 className="text-4xl font-black text-slate-800">COBA GRATIS 30 SOAL</h1>
          <p className="text-slate-600 mt-2">Pend. Agama & Budi Pekerti, PPKn, B.Indonesia, Matematika, IPAS</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FREE_DATA.map((paket) => (
            <Link key={paket.id} href={`/free/${paket.id}`}>
              <div className={`bg-gradient-to-br ${paket.warna} p-[2px] rounded-2xl hover:scale-105 transition-all shadow-lg`}>
                <div className="bg-white rounded-[14px] p-6 h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-4xl">{paket.icon}</div>
                    <div className="flex gap-1">
                      <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">FREE</span>
                      {paket.baru && <span className="bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-full">BARU MASUK</span>}
                    </div>
                  </div>
                  <h3 className="font-black text-xl text-slate-800">Bimbel {paket.kelas}</h3>
                  <p className="text-[11px] font-semibold text-slate-500 leading-[1.4] mt-1 line-clamp-2">
                    Pend. Agama & Budi Pekerti, Pend. Pancasila/PPKn, B. Indonesia, Matematika, IPAS
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full">{paket.total} soal</span>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-mono px-2 py-1 rounded-full">{paket.id} • is_free=true</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <span className="flex-1 bg-slate-800 text-white text-center px-4 py-2 rounded-full text-sm font-bold">Mulai →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}