'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function CekSD1() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(()=>{
    async function cek(){
      const { data: free } = await supabase.from('soal').select('id', { count: 'exact' }).eq('kelas','bsj-sd1').eq('is_free', true)
      const { data: bayar } = await supabase.from('soal').select('id', { count: 'exact' }).eq('kelas','bsj-sd1').eq('is_free', false)
      const { count: cFree } = await supabase.from('soal').select('*', { count: 'exact', head: true }).eq('kelas','bsj-sd1').eq('is_free', true)
      const { count: cBayar } = await supabase.from('soal').select('*', { count: 'exact', head: true }).eq('kelas','bsj-sd1').eq('is_free', false)
      const { data: sample } = await supabase.from('soal').select('*').eq('kelas','bsj-sd1').eq('is_free', false).order('no_urut').limit(5)
      setData({ cFree, cBayar, sample })
      setLoading(false)
    }
    cek()
  },[])

  if(loading) return <div className="p-10">Loading cek SD1...</div>

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-black">Cek SD1 - Beda FREE vs BERBAYAR</h1>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-100 border-2 border-green-500 rounded-2xl p-5">
            <div className="text-xs font-bold text-green-700">FREE (is_free=true)</div>
            <div className="text-4xl font-black text-green-800">{data?.cFree}</div>
            <div className="text-xs mt-2">Link: /free/bsj-sd1</div>
            <a href="/free/bsj-sd1" className="mt-3 inline-block bg-green-600 text-white px-4 py-2 rounded-full text-xs font-bold">Buka FREE SD1 →</a>
          </div>
          <div className="bg-orange-100 border-2 border-orange-500 rounded-2xl p-5">
            <div className="text-xs font-bold text-orange-700">BERBAYAR 17RB (is_free=false)</div>
            <div className="text-4xl font-black text-orange-800">{data?.cBayar}</div>
            <div className="text-xs mt-2">Link: /soal/bsj-sd1 atau /premium</div>
            <div className="text-[11px] text-slate-600 mt-1">Harusnya 600 kalau SD1 sudah success</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-5">
          <div className="font-bold mb-3">Sample 5 soal berbayar SD1 (pertama):</div>
          {data?.sample?.map((s:any)=>(
            <div key={s.id} className="text-xs border-b py-2">
              <span className="font-bold">#{s.no_urut} [{s.mapel}]</span> {s.pertanyaan.substring(0,80)}...
            </div>
          ))}
        </div>

        <div className="bg-slate-800 text-white rounded-xl p-4 text-xs">
          <div className="font-bold">Kesimpulan:</div>
          <div>• /free/bsj-sd1 = cuma baca is_free=true (10 soal) → LINK LAMA, TETAP SAMA</div>
          <div>• Soal berbayar = is_free=false (600 soal) → LINK BEDA, nanti di /soal/bsj-sd1</div>
          <div className="mt-2 text-green-300">Kalau cBayar = 600 berarti SD1 sukses masuk DB!</div>
        </div>
      </div>
    </div>
  )
}
