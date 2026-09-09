'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const PAKET_INFO: any = {
  'BSJ-SD1': { kelas: 'sd1', nama: 'Kelas 1 SD', total: 600, tag: 'Pemula', warna: 'from-pink-200 to-pink-100' },
  'BSJ-SD2': { kelas: 'sd2', nama: 'Kelas 2 SD', total: 600, tag: 'Populer', warna: 'from-blue-200 to-blue-100' },
  'BSJ-SD3': { kelas: 'sd3', nama: 'Kelas 3 SD', total: 600, tag: 'Favorit', warna: 'from-yellow-200 to-yellow-100' },
  'BSJ-SD4': { kelas: 'sd4', nama: 'Kelas 4 SD', total: 600, tag: 'Aktif', warna: 'from-green-200 to-green-100' },
  'BSJ-SD5': { kelas: 'sd5', nama: 'Kelas 5 SD', total: 600, tag: 'Baru', warna: 'from-purple-200 to-purple-100' },
  'BSJ-SD6': { kelas: 'sd6', nama: 'Kelas 6 SD', total: 600, tag: 'Juara', warna: 'from-orange-200 to-orange-100' },
}
const MAPEL = [
  { nama: 'Agama & Budi Pekerti', icon: '🕌', soal: 120 },
  { nama: 'PPKn / Pancasila', icon: '🇮🇩', soal: 120 },
  { nama: 'B. Indonesia', icon: '📚', soal: 120 },
  { nama: 'Matematika', icon: '🔢', soal: 120 },
  { nama: 'IPAS', icon: '🔬', soal: 120 },
]

export default function RedeemPage() {
  const [kode, setKode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<any>(null)
  const router = useRouter()

  const handleRedeem = async (e: any) => {
    e.preventDefault()
    setError(''); setLoading(true)
    const input = kode.trim().toUpperCase()
    const { data } = await supabase.from('kode_akses').select('*').eq('kode', input).single()
    if (!data) { setError(`Kode ${input} tidak ditemukan`); setLoading(false); return }
    if (data.status === 'TERPAKAI') { setError(`Kode ${input} sudah dipakai`); setLoading(false); return }
    const paketKode = (data.paket_kode || 'BSJ-SD2').toUpperCase()
    const paket = PAKET_INFO[paketKode]
    if (!paket) { setError(`Paket ${paketKode} tidak valid`); setLoading(false); return }
    await supabase.from('kode_akses').update({ status: 'TERPAKAI', used_at: new Date().toISOString() }).eq('kode', input)
    setSuccess({ kode: input, paketKode,...paket }); setLoading(false)
    localStorage.setItem('bsj_kode_aktif', input); localStorage.setItem('bsj_kelas_aktif', paket.kelas)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-green-50 p-4">
      <div className="max-w-2xl mx-auto pt-6 pb-4 text-center">
        <div className="inline-flex w-16 h-16 rounded-2xl bg-white shadow-lg border-2 border-yellow-200 text-2xl items-center justify-center mb-3">🏆</div>
        <h1 className="text-2xl font-black text-slate-800">REDEEM KODE AKSES</h1>
        <p className="text-sm font-bold text-slate-500">Bimbel Super Juara - 600 Soal - 5 Mapel</p>
      </div>
      <div className="max-w-md mx-auto bg-white rounded- shadow-xl border-2 border-slate-100 p-6">
        {!success? (
          <form onSubmit={handleRedeem} className="space-y-4">
            <input value={kode} onChange={e=>setKode(e.target.value)} placeholder="BSJ-044B44" className="w-full px-4 py-4 rounded-xl border-2 border-slate-200 bg-yellow-50/50 font-mono font-black text-lg uppercase text-center outline-none focus:border-blue-400" />
            {error && <div className="p-3 rounded-xl bg-red-50 border-2 border-red-200 text-xs font-bold text-red-700 text-center">❌ {error}</div>}
            <button disabled={loading} className="w-full py-4 rounded-xl bg-blue-600 text-white font-black shadow-lg">{loading? 'CEK...' : '🔓 CEK & MULAI BELAJAR'}</button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <div className="text-5xl">🎉</div><h2 className="font-black">KODE VALID! {success.kode}</h2>
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${success.warna} border-2`}>{success.nama} - {success.total} Soal</div>
            <div className="grid gap-2">{MAPEL.map(m=><div key={m.nama} className="flex justify-between p-3 rounded-xl bg-slate-50 border text-xs font-bold"><span>{m.icon} {m.nama}</span><span>{m.soal} soal</span></div>)}</div>
            <button onClick={()=>router.push(`/soal/${success.kelas}`)} className="w-full py-4 rounded-xl bg-green-600 text-white font-black">🚀 MULAI 600 SOAL →</button>
          </div>
        )}
        <div className="mt-6 text-center text- font-bold text-slate-400">SD1-SD6 • 5 Mapel • 600 Soal • Rp17.000 • 90 Hari</div>
      </div>
    </div>
  )
}