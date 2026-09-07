'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminKodePage() {
  const [kodes, setKodes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterKelas, setFilterKelas] = useState('SEMUA')
  const [filterStatus, setFilterStatus] = useState('SEMUA')

  useEffect(()=>{ fetchKode() }, [filterKelas, filterStatus])

  async function fetchKode() {
    setLoading(true)
    let q = supabase.from('kode_akses').select('*').order('created_at',{ascending:false})
    if (filterKelas!=='SEMUA') q = q.eq('paket_kode', filterKelas)
    if (filterStatus!=='SEMUA') q = q.eq('status', filterStatus)
    const {data} = await q.limit(300)
    setKodes(data||[])
    setLoading(false)
  }

  async function updateStatus(id:string, status:string){
    await supabase.from('kode_akses').update({status}).eq('id',id)
    fetchKode()
  }

  function print() { window.print() }

  const total = kodes.length

  return (
    <div className="min-h-screen bg-[#fff5f7] p-4">
      <style>{`@media print {.no-print{display:none} .print-card{break-inside:avoid; border:2px dashed black !important;}}`}</style>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between gap-3 items-center mb-4 no-print">
          <h1 className="text-2xl font-black">🎟️ Admin Voucher - 17RB / KELAS</h1>
          <div className="flex gap-2">
            <Link href="/soal" className="bg-black text-white px-4 py-2 rounded-full text-sm font-bold">Lihat /soal</Link>
            <button onClick={print} className="bg-white border-2 px-4 py-2 rounded-full text-sm font-bold">🖨️ Cetak</button>
          </div>
        </div>

        {/* FILTER */}
        <div className="flex flex-wrap gap-2 mb-4 no-print">
          <select value={filterKelas} onChange={e=>setFilterKelas(e.target.value)} className="border-2 rounded-full px-4 py-2 font-bold bg-white">
            <option value="SEMUA">SEMUA KELAS (650 kode)</option>
            <option value="BSJ-SD1">BSJ-SD1 (100 kode)</option>
            <option value="BSJ-SD2">BSJ-SD2 (100 kode)</option>
            <option value="BSJ-SD3">BSJ-SD3 (100 kode)</option>
            <option value="BSJ-SD4">BSJ-SD4 (100 kode) - PALING LAKU</option>
            <option value="BSJ-SD5">BSJ-SD5 (100 kode) - PALING LAKU</option>
            <option value="BSJ-SD6">BSJ-SD6 (100 kode)</option>
            <option value="BSJ-SD-LENGKAP">BSJ-LENGKAP 3600 soal (50 kode)</option>
          </select>
          <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="border-2 rounded-full px-4 py-2 font-bold bg-white">
            <option value="SEMUA">Status: SEMUA</option>
            <option value="BELUM TERJUAL">BELUM TERJUAL</option>
            <option value="TERJUAL">TERJUAL</option>
            <option value="AKTIF">AKTIF</option>
          </select>
          <div className="bg-white border-2 rounded-full px-4 py-2 font-bold">Total: {total} kode</div>
        </div>

        {loading ? <div className="text-center py-20 font-black">Loading...</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kodes.map(k=>(
              <div key={k.id} className="print-card bg-white rounded-2xl p-4 border-2 shadow-sm relative">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-[10px] font-black bg-black text-white px-2 py-1 rounded-full">{k.paket_kode}</div>
                  <select value={k.status} onChange={e=>updateStatus(k.id, e.target.value)} className={`text-[10px] font-bold px-2 py-1 rounded-full border no-print ${k.status==='BELUM TERJUAL'?'bg-green-50 border-green-300':'bg-blue-50 border-blue-300'}`}>
                    <option>BELUM TERJUAL</option>
                    <option>TERJUAL</option>
                    <option>AKTIF</option>
                  </select>
                  <div className="print:block hidden text-[10px] font-bold border px-2 py-1 rounded-full">{k.status}</div>
                </div>
                <div className="flex gap-2 items-center">
                  <img src="/mrh-logo.png" className="w-8 h-8 object-contain border rounded-lg p-1 bg-white"/>
                  <div className="text-[11px] leading-tight"><b>MRH • BIMBEL SUPER JUARA</b><br/><span className="text-pink-600 font-bold">600 Soal HOTS Siap Juara!</span></div>
                </div>
                <div className="mt-3 text-[12px] font-bold">{k.paket_nama}</div>
                <div className="mt-2 bg-[#fff5f7] border-2 border-dashed border-pink-200 rounded-xl p-2 text-center font-black tracking-widest text-[16px]">{k.kode}</div>
                <div className="mt-2 flex justify-between items-center">
                  <div className="text-[11px]"><span className="line-through text-gray-400">Rp {k.harga_normal?.toLocaleString('id-ID')}</span> <span className="font-black text-pink-600 ml-1">Rp {k.harga?.toLocaleString('id-ID')}</span></div>
                  <div className="text-[10px] text-gray-500">Exp: {new Date(k.expired_at).toLocaleDateString('id-ID')}</div>
                </div>
                <div className="text-[9px] text-gray-400 mt-2 border-t pt-2">Cara pakai: bimbel.mrh-digitalhub.com/soal → Masukkan kode → Langsung belajar 600 soal</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
