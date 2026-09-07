'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type Soal = {
  id: string
  kelas: string
  mapel: string
  pertanyaan: string
  opsi_a: string
  opsi_b: string
  opsi_c: string
  opsi_d: string
  jawaban: string
  pembahasan: string
  no_urut: number
}

export default function FreeKelasSupabasePage() {
  const params = useParams()
  const kelasParam = (params.kelas as string) || 'bsj-sd1'
  const kelasDisplay = kelasParam.replace('bsj-', '').toUpperCase()
  
  const [soalList, setSoalList] = useState<Soal[]>([])
  const [loading, setLoading] = useState(true)
  const [filterMapel, setFilterMapel] = useState('Semua')
  const [idx, setIdx] = useState(0)
  const [show, setShow] = useState(false)

  useEffect(() => {
    async function fetchSoal() {
      setLoading(true)
      const { data, error } = await supabase
        .from('soal')
        .select('*')
        .eq('kelas', kelasParam)
        .eq('is_free', true)
        .order('no_urut', { ascending: true })
      
      if (!error && data) {
        setSoalList(data)
      }
      setLoading(false)
    }
    fetchSoal()
  }, [kelasParam])

  useEffect(()=>{ setIdx(0); setShow(false) }, [filterMapel, kelasParam])

  const filtered = filterMapel==='Semua' ? soalList : soalList.filter(s=>s.mapel===filterMapel)
  const current = filtered[idx]

  const countMapel = (m:string)=> soalList.filter(s=>s.mapel===m).length

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-3"></div>
          <div className="text-sm text-slate-600">Loading {kelasDisplay} dari Supabase...</div>
        </div>
      </div>
    )
  }

  if (soalList.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center shadow">
          <div className="text-4xl mb-3">😅</div>
          <div className="font-bold">Belum ada soal untuk {kelasDisplay}</div>
          <div className="text-sm text-slate-500 mt-1">Pastikan SQL 60 soal sudah di-run di Supabase</div>
          <Link href="/free" className="mt-4 inline-block bg-slate-800 text-white px-6 py-2 rounded-full text-sm font-bold">← Kembali ke FREE</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/free" className="text-sm text-slate-600 hover:text-slate-900">← Kembali</Link>
          <div className="bg-green-600 text-white px-4 py-1.5 rounded-full text-xs font-black">🎁 FREE {kelasDisplay} - {soalList.length} SOAL REAL dari DB</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border">
          <div className="flex flex-wrap gap-2 mb-5">
            <button onClick={()=>setFilterMapel('Semua')} className={`px-4 py-2 rounded-full text-xs font-bold border ${filterMapel==='Semua'?'bg-slate-800 text-white':'bg-white'}`}>Semua ({soalList.length})</button>
            <button onClick={()=>setFilterMapel('Matematika')} className={`px-4 py-2 rounded-full text-xs font-bold border ${filterMapel==='Matematika'?'bg-blue-600 text-white':'bg-white text-blue-600 border-blue-200'}`}>🔢 Matematika ({countMapel('Matematika')})</button>
            <button onClick={()=>setFilterMapel('Bahasa Indonesia')} className={`px-4 py-2 rounded-full text-xs font-bold border ${filterMapel==='Bahasa Indonesia'?'bg-emerald-600 text-white':'bg-white text-emerald-600 border-emerald-200'}`}>📝 B.Indo ({countMapel('Bahasa Indonesia')})</button>
            <button onClick={()=>setFilterMapel('IPA')} className={`px-4 py-2 rounded-full text-xs font-bold border ${filterMapel==='IPA'?'bg-purple-600 text-white':'bg-white text-purple-600 border-purple-200'}`}>🔬 IPA ({countMapel('IPA')})</button>
          </div>

          <div className="text-[11px] text-slate-400 mb-2 font-mono">SOAL {idx+1}/{filtered.length} • {current?.mapel} • #{current?.no_urut}</div>
          <h2 className="text-[17px] font-bold text-slate-800 leading-relaxed mb-5">{current?.no_urut}. {current?.pertanyaan}</h2>

          <div className="space-y-2.5 mb-6">
            {[
              {key:'A', text: current?.opsi_a},
              {key:'B', text: current?.opsi_b},
              {key:'C', text: current?.opsi_c},
              {key:'D', text: current?.opsi_d},
            ].map((o)=>(
              <div key={o.key} className={`p-3.5 rounded-xl border text-[14px] flex items-start gap-2 ${show && o.key===current?.jawaban?'bg-green-50 border-green-500 font-bold text-green-800':'bg-slate-50 border-slate-200'}`}>
                <span className="font-bold">{o.key}.</span><span>{o.text}</span>
                {show && o.key===current?.jawaban && <span className="ml-auto text-[11px] bg-green-600 text-white px-2 py-0.5 rounded-full">KUNCI</span>}
              </div>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap">
            <button onClick={()=>setShow(!show)} className="px-6 py-2.5 rounded-full bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700">{show?'Sembunyikan Jawaban':'Lihat Jawaban & Pembahasan'}</button>
            <button disabled={idx===0} onClick={()=>{setIdx(idx-1); setShow(false)}} className="px-5 py-2.5 rounded-full bg-slate-200 text-slate-700 font-bold text-sm disabled:opacity-30">← Prev</button>
            <button disabled={idx===filtered.length-1} onClick={()=>{setIdx(idx+1); setShow(false)}} className="px-5 py-2.5 rounded-full bg-slate-800 text-white font-bold text-sm disabled:opacity-30">Next →</button>
          </div>

          {show && (
            <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-4 text-[13px]">
              <div className="font-black text-amber-800">Pembahasan:</div>
              <div className="mt-1 text-slate-700">{current?.pembahasan}</div>
              <div className="mt-3 inline-block bg-green-600 text-white px-3 py-1 rounded-full font-black text-xs">Kunci: {current?.jawaban}</div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border p-4 text-[12px] text-slate-500 mb-6">
          <div className="font-bold text-slate-700 mb-1">✅ Data real dari Supabase:</div>
          <div>• Kelas: {kelasParam}</div>
          <div>• Total: {soalList.length} soal (3 MTK + 3 B.Indo + 4 IPA)</div>
          <div>• Filter aktif: {filterMapel} ({filtered.length} soal)</div>
          <div>• Status: is_free = true</div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white text-center shadow-lg">
          <div className="font-black text-[18px]">Suka yang FREE {kelasDisplay}? Upgrade biar makin Juara!</div>
          <div className="text-sm mt-1 opacity-90">10 soal FREE vs 100 soal lengkap + pembahasan video</div>
          <Link href="/soal" className="inline-block mt-4 bg-white text-orange-600 font-black px-8 py-3 rounded-full text-sm">Upgrade 17RB → 600 Soal Lengkap</Link>
        </div>
      </div>
    </div>
  )
}
