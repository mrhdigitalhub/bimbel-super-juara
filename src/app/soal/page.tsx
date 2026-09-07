'use client'
import { useState } from 'react'

export default function SoalPage(){
const [kode,setKode]=useState('')
const kelas=[
 {id:'BSJ-SD1',nama:'Kelas 1 SD',tag:'Pemula',warna:'bg-pink-100 text-pink-700'},
 {id:'BSJ-SD2',nama:'Kelas 2 SD',tag:'Populer',warna:'bg-blue-100 text-blue-700'},
 {id:'BSJ-SD3',nama:'Kelas 3 SD',tag:'Populer',warna:'bg-green-100 text-green-700'},
 {id:'BSJ-SD4',nama:'Kelas 4 SD',tag:'PALING LAKU',warna:'bg-yellow-100 text-yellow-700'},
 {id:'BSJ-SD5',nama:'Kelas 5 SD',tag:'PALING LAKU',warna:'bg-orange-100 text-orange-700'},
 {id:'BSJ-SD6',nama:'Kelas 6 SD',tag:'U/S/USBN',warna:'bg-purple-100 text-purple-700'},
]
const WA_ADMIN='6281770220059' // WA Admin MRH DigitalHub - Update dari BOS!
return (
<div className="min-h-screen bg-[#FFF7F5] py-4 px-4">
<div className="max-w-6xl mx-auto">
<div className="flex justify-between items-center mb-6">
<div className="flex items-center gap-2">
<img src="/mrh-logo.png" className="h-8 object-contain" alt="MRH"/>
<span className="font-black">BIMBEL SUPER JUARA</span>
</div>
{/* ADMIN DIHAPUS - Sesuai request BOS No.2 */}
</div>

{/* KOTAK HIJAU TOSKA - Fix Photo5 BOS! */}
<div className="bg-[#0F766E] rounded-[24px] p-8 text-white mb-8 shadow-xl">
<h2 className="text-3xl font-black">Punya Kode Voucher?</h2>
<p className="text-white/80 mt-2 text-sm">Masukkan kode BSJ-SD4-XXXX untuk buka 600 soal HOTS</p>
<div className="flex gap-3 mt-6">
<input value={kode} onChange={e=>setKode(e.target.value)} placeholder="BSJ-SD4-XXXX" className="flex-1 bg-white text-black rounded-full px-6 py-3 font-bold outline-none"/>
<button className="bg-[#EC4899] hover:bg-[#DB2777] text-white px-8 py-3 rounded-full font-black">BUKA</button>
</div>
</div>

<div className="flex justify-between items-center mb-4">
<h2 className="font-black text-xl">Pilih Kelas - Cuma 17RB! 🔥</h2>
<span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Promo: 99RB → 17RB (Diskon 82%)</span>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-5">
{kelas.map(k=>(
<div key={k.id} className="bg-white rounded-2xl p-5 shadow-sm border">
<div className="flex justify-between mb-3"><span className={`text-[10px] font-black px-2 py-1 rounded-full ${k.warna}`}>{k.tag}</span><span className="text-[10px] text-slate-400 font-bold">{k.id}</span></div>
<h3 className="font-black text-lg">{k.nama}</h3>
<p className="text-xs text-slate-500 mt-1">600 Soal HOTS • 3 Mapel • Kunci + Pembahasan</p>
<p className="text-xs line-through text-slate-400 mt-3">Rp 99.000</p>
<p className="text-2xl font-black text-[#EC4899]">Rp 17.000 <span className="text-xs text-green-600">Hemat 82%</span></p>

{/* TOMBOL BIRU TOSKA + WA ADMIN 081770220059 - Fix Photo4 & Photo5 BOS! */}
<a href={`https://wa.me/${WA_ADMIN}?text=Halo%20Admin%20MRH%20DigitalHub%2C%20saya%20mau%20beli%20${k.id}%20-%2017RB%20BOS!%20Mohon%20info%20pembayaran.`} target="_blank"
className="mt-4 block text-center bg-[#0E7490] hover:bg-[#0C6580] text-white py-3 rounded-full font-black text-sm transition-all">
Beli {k.id} - 17RB
</a>

<p className="text-[10px] text-center text-slate-400 mt-2">Voucher: {k.id}-XXXX • 600 soal</p>
</div>
))}
</div>

<div className="mt-10 text-center text-[10px] text-slate-500">© 2026 BIMBEL SUPER JUARA • MRH DigitalHub • WA: 0817-7022-0059</div>
</div>
</div>
)
}
