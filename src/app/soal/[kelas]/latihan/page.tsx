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

export default function SoalFreeStylePremium() {
  const params = useParams()
  const kelasParam = (params.kelas as string) || 'bsj-sd1'
  const kelasDisplay = kelasParam.replace('bsj-','').toUpperCase()
  const isPremium = true // ini untuk /soal/ (600), kalau /free/ ganti false

  const [soalList, setSoalList] = useState<Soal[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('Semua')
  const [idx, setIdx] = useState(0)
  const [show, setShow] = useState(false)
  const [jawab, setJawab] = useState('')

  useEffect(()=>{
    async function load(){
      setLoading(true)
      // PREMIUM = is_free=false 600 soal, FREE = is_free=true 10 soal
      const { data } = await supabase.from('soal').select('*').eq('kelas', kelasParam).eq('is_free', false).order('no_urut')
      if(data) setSoalList(data)
      setLoading(false)
    }
    load()
  },[kelasParam])

  useEffect(()=>{ setIdx(0); setShow(false); setJawab('') },[filter])

  const mapels = Array.from(new Set(soalList.map(s=>s.mapel)))
  const filtered = filter==='Semua' ? soalList : soalList.filter(s=>s.mapel===filter)
  const cur = filtered[idx]
  const counts: any = { Semua: soalList.length }
  mapels.forEach(m=> counts[m]=soalList.filter(s=>s.mapel===m).length)

  if(loading) return <div className="min-h-screen bg-white flex items-center justify-center text-sm">Loading {kelasDisplay} {soalList.length || 600} soal...</div>

  return (
    <div className="min-h-screen bg-[#f8fafc] py-6 px-4 text-slate-900">
      <div className="max-w-3xl mx-auto">
        {/* HEADER ala FREE */}
        <div className="flex justify-between items-center mb-4">
          <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">← Kembali</Link>
          <div className="bg-green-600 text-white px-4 py-1.5 rounded-full text-[11px] font-black">
            📚 {isPremium ? `PREMIUM ${kelasDisplay} - ${soalList.length} SOAL REAL dari DB` : `FREE ${kelasDisplay} - 10 SOAL REAL dari DB`}
          </div>
        </div>

        {/* CARD UTAMA ala FREE */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-slate-800 p-5">
          {/* Filter Mapel */}
          <div className="flex flex-wrap gap-2 mb-4">
            {['Semua', ...mapels].map(m=>{
              const isActive = filter===m
              return (
                <button key={m} onClick={()=>setFilter(m)} className={`px-4 py-2 rounded-full text-xs font-bold border ${isActive?'bg-slate-900 text-white border-slate-900':'bg-white border-slate-200'} ${m==='Matematika' && !isActive?'text-blue-600 bg-blue-50':''} ${m.includes('Indo') && !isActive?'text-amber-700 bg-amber-50':''} ${m==='IPA' && !isActive?'text-purple-700 bg-purple-50':''}`}>
                  {m==='Semua'?`Semua (${counts[m]})`: `${m==='Matematika'?'📘': m.includes('Indo')?'📖':'🔬'} ${m} (${counts[m]})`}
                </button>
              )
            })}
          </div>

          <div className="text-[10px] text-slate-500 font-mono mb-2">SOAL {idx+1}/{filtered.length} • {cur?.mapel} • #{cur?.no_urut} • PREMIUM</div>
          
          <h2 className="text-[15px] font-bold leading-relaxed mb-5 text-slate-800">
            {cur?.no_urut}. {cur?.pertanyaan}
          </h2>

          <div className="space-y-2.5 mb-6">
            {[
              {k:'A', t:cur?.opsi_a},
              {k:'B', t:cur?.opsi_b},
              {k:'C', t:cur?.opsi_c},
              {k:'D', t:cur?.opsi_d},
            ].map(o=>{
              const isCorrect = o.k===cur?.jawaban
              const isSelected = jawab===o.k
              return (
                <button key={o.k} onClick={()=>!jawab && setJawab(o.k)}
                  className={`w-full text-left p-3.5 rounded-xl border text-[13px] flex gap-2 transition-all
                    ${!jawab?'bg-slate-50 border-slate-200 hover:bg-slate-100':''}
                    ${jawab && isCorrect?'bg-green-50 border-green-500 font-bold':''}
                    ${jawab && isSelected && !isCorrect?'bg-red-50 border-red-500 font-bold':''}
                    ${jawab && !isSelected && !isCorrect?'bg-slate-50 border-slate-200 opacity-60':''}
                  `}>
                  <span className="font-bold">{o.k}.</span><span>{o.t}</span>
                  {jawab && isCorrect && <span className="ml-auto bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full">KUNCI</span>}
                </button>
              )
            })}
          </div>

          <div className="flex gap-2">
            <button onClick={()=>setShow(!show)} className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs">
              {show?'Sembunyikan':'Lihat Jawaban & Pembahasan'}
            </button>
            <button disabled={idx===0} onClick={()=>{setIdx(idx-1); setShow(false); setJawab('')}} className="px-5 py-2.5 rounded-full bg-slate-100 text-slate-500 font-bold text-xs disabled:opacity-30">← Prev</button>
            <button disabled={idx===filtered.length-1} onClick={()=>{setIdx(idx+1); setShow(false); setJawab('')}} className="px-5 py-2.5 rounded-full bg-slate-800 text-white font-bold text-xs disabled:opacity-30">Next →</button>
          </div>

          {show && (
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-[13px]">
              <div className="font-black text-amber-800 text-xs">PEMBAHASAN:</div>
              <div className="mt-1 text-slate-700">{cur?.pembahasan}</div>
              <div className="mt-3 flex gap-2">
                <span className="bg-green-600 text-white px-3 py-1 rounded-full font-black text-[11px]">KUNCI: {cur?.jawaban}</span>
                <span className="bg-slate-800 text-white px-3 py-1 rounded-full text-[11px]">#{cur?.no_urut} • {cur?.mapel}</span>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER ala FREE */}
        <div className="mt-4 bg-white rounded-xl border-2 border-slate-700 p-4 text-[11px] font-mono">
          <div className="font-bold text-green-700">✅ Data real dari Supabase:</div>
          <div className="mt-1 text-slate-600 space-y-0.5">
            <div>• Kelas: {kelasParam}</div>
            <div>• Total: {soalList.length} soal ({mapels.map(m=>`${counts[m]} ${m}`).join(' + ')})</div>
            <div>• Filter: {filter} ({filtered.length} soal)</div>
            <div>• Status: is_free = false (PREMIUM 17RB)</div>
            <div>• Style: Disamakan dengan FREE biar seragam ✅</div>
          </div>
        </div>

        {/* DASHBOARD MINI */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {mapels.map(m=>(
            <div key={m} className="bg-white border rounded-xl p-3 text-center">
              <div className="text-[10px] text-slate-500">{m}</div>
              <div className="text-lg font-black">{counts[m]}</div>
              <div className="w-full bg-slate-200 h-1 rounded-full mt-1"><div className="bg-blue-500 h-1 rounded-full" style={{width:'100%'}}></div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
