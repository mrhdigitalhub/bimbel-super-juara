'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function SoalPage() {
  const [kode, setKode] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const router = useRouter()

  const pakets = [
    { id:'BSJ-SD1', kelas:'Kelas 1 SD', soal:600, harga:17000, coret:99000, warna:'bg-pink-100', laku:'Pemula' },
    { id:'BSJ-SD2', kelas:'Kelas 2 SD', soal:600, harga:17000, coret:99000, warna:'bg-blue-100', laku:'Populer' },
    { id:'BSJ-SD3', kelas:'Kelas 3 SD', soal:600, harga:17000, coret:99000, warna:'bg-green-100', laku:'Populer' },
    { id:'BSJ-SD4', kelas:'Kelas 4 SD', soal:600, harga:17000, coret:99000, warna:'bg-yellow-100', laku:'🔥 PALING LAKU' },
    { id:'BSJ-SD5', kelas:'Kelas 5 SD', soal:600, harga:17000, coret:99000, warna:'bg-orange-100', laku:'🔥 PALING LAKU' },
    { id:'BSJ-SD6', kelas:'Kelas 6 SD', soal:600, harga:17000, coret:99000, warna:'bg-purple-100', laku:'🏆 US/USBN' },
  ]

  async function cekKode() {
    if (!kode) return setMsg('Masukkan kode voucher dulu bos!')
    setLoading(true)
    setMsg('')
    const { data, error } = await supabase.from('kode_akses').select('*').eq('kode', kode.trim().toUpperCase()).single()
    if (error || !data) {
      setMsg('❌ Kode tidak ditemukan! Cek lagi BSJ-SD4-XXXX')
      setLoading(false)
      return
    }
    if (data.status === 'AKTIF' || data.status === 'TERJUAL') {
      // sudah terjual tapi tetep boleh dipakai
      localStorage.setItem('bsj_kode', data.kode)
      localStorage.setItem('bsj_paket', data.paket_kode)
      router.push(`/soal/${data.paket_kode.toLowerCase()}`)
      return
    }
    // update jadi AKTIF
    await supabase.from('kode_akses').update({ status:'AKTIF', used_at: new Date().toISOString() }).eq('id', data.id)
    localStorage.setItem('bsj_kode', data.kode)
    localStorage.setItem('bsj_paket', data.paket_kode)
    setMsg(`✅ Berhasil! Paket ${data.paket_kode} aktif! Redirect...`)
    router.push(`/soal/${data.paket_kode.toLowerCase()}`)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#fff5f7]">
      {/* HEADER */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-5 py-4 flex justify-between items-center">
          <div className="flex gap-2 items-center"><img src="/mrh-logo.png" className="w-8 h-8"/><b className="font-black">BIMBEL SUPER JUARA</b></div>
          <Link href="/admin/kode" className="text-xs bg-black text-white px-3 py-1.5 rounded-full">Admin</Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 py-8">
        {/* REDEEM */}
        <div className="bg-black text-white rounded-[24px] p-6 md:p-8 mb-8">
          <h1 className="text-2xl md:text-3xl font-black">Punya Kode Voucher?</h1>
          <p className="text-white/70 mt-2 text-sm">Masukkan kode BSJ-SD4-XXXX untuk buka 600 soal HOTS</p>
          <div className="flex gap-2 mt-4">
            <input value={kode} onChange={e=>setKode(e.target.value.toUpperCase())} placeholder="BSJ-SD4-XXXX" className="flex-1 bg-white text-black font-black tracking-widest rounded-full px-5 py-3 outline-none"/>
            <button onClick={cekKode} disabled={loading} className="bg-pink-500 hover:bg-pink-600 text-white font-black px-6 py-3 rounded-full">{loading?'...':'BUKA'}</button>
          </div>
          {msg && <div className="mt-3 text-sm bg-white/10 rounded-xl p-3">{msg}</div>}
        </div>

        {/* HARGA 17RB */}
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-2xl font-black">Pilih Kelas - Cuma 17RB! 🔥</h2>
          <div className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">Promo: 99RB → 17RB (Diskon 82%)</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pakets.map(p=>(
            <div key={p.id} className={`bg-white rounded-[20px] p-5 border-2 ${p.id==='BSJ-SD4'||p.id==='BSJ-SD5'?'border-black shadow-lg':'border-transparent shadow-sm'}`}>
              <div className="flex justify-between"><span className={`text-[10px] font-bold px-2 py-1 rounded-full ${p.warna}`}>{p.laku}</span><span className="text-[10px] text-gray-400 font-bold">{p.id}</span></div>
              <div className="font-black text-[20px] mt-3">{p.kelas}</div>
              <div className="text-sm text-gray-500">{p.soal} Soal HOTS • 3 Mapel • Kunci + Pembahasan</div>
              <div className="mt-4">
                <div className="text-xs line-through text-gray-400">Rp {p.coret.toLocaleString('id-ID')}</div>
                <div className="flex items-baseline gap-2"><div className="text-[28px] font-black text-pink-600">Rp {p.harga.toLocaleString('id-ID')}</div><div className="text-xs font-bold text-green-600">Hemat 82%</div></div>
              </div>
              <Link href={`https://wa.me/628xxxx?text=Mau%20beli%20${p.id}%20Rp%2017rb`} className="mt-4 block text-center bg-black text-white font-black py-3 rounded-full">Beli {p.id} - 17RB</Link>
              <div className="text-[10px] text-gray-400 mt-2 text-center">Voucher: {p.id}-XXXX • 600 soal</div>
            </div>
          ))}
        </div>

        {/* BUNDLE */}
        <div className="bg-gradient-to-br from-black to-gray-800 text-white rounded-[24px] p-6 mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <div className="text-xs bg-white text-black px-3 py-1 rounded-full inline-block font-black">💎 PALING HEMAT</div>
            <div className="font-black text-2xl mt-2">Paket Lengkap Kelas 1-6 • 3600 Soal</div>
            <div className="text-white/60 text-sm">6 kelas x 600 soal = 3600 soal HOTS. Sekali beli untuk 6 tahun!</div>
          </div>
          <div className="text-right">
            <div className="text-sm line-through text-white/50">Rp 199.000</div>
            <div className="text-3xl font-black">Rp 99.000</div>
            <Link href="https://wa.me/628xxxx?text=Mau%20paket%20lengkap%2099rb" className="mt-2 inline-block bg-white text-black font-black px-6 py-2.5 rounded-full">Beli Lengkap - 99RB</Link>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">FREE Tester: 30 soal (3 mapel x 10) akan dibuat terpisah ya bos!</div>
      </div>
    </div>
  )
}
