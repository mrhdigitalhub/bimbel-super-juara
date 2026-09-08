'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'

export default function FreeKelasPage() {
  const params = useParams()
  const kelas_id = params.kelas_id as string
  const [soals, setSoals] = useState<any[]>([])
  const [idx, setIdx] = useState(0)
  const [jawaban, setJawaban] = useState<{[k:number]:string}>({})
  const [showHasil, setShowHasil] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSoal = async () => {
      const { data } = await supabase
       .from('soal_tka')
       .select('*')
       .eq('kelas_id', kelas_id)
       .eq('is_free', true)
       .order('nomor', { ascending: true })
      if (data) setSoals(data)
      setLoading(false)
    }
    fetchSoal()
  }, [kelas_id])

  if (loading) return <div className="p-10 text-center">Loading {kelas_id}...</div>
  if (!soals.length) return <div className="p-10 text-center">Soal {kelas_id} tidak ditemukan. Cek Supabase soal_tka where kelas_id={kelas_id}</div>

  const s = soals[idx]
  const kunci = (s.jawaban || '').toUpperCase()
  const userJawab = jawaban[idx]
  const isBenar = userJawab === kunci

  return (
    <div className="min-h-screen bg-[#fef9c3] flex justify-center p-4 font-[Nunito]">
      <div className="bg-white max-w-[720px] w-full rounded-[20px] p-7 border-2 border-green-600">
        <div className="flex justify-between mb-3">
          <b>Soal {idx+1}/{soals.length} - {kelas_id} - {s.mapel}</b>
          <span className="bg-green-100 px-3 py-1 rounded-full text-xs font-bold">{Object.keys(jawaban).length} terjawab</span>
        </div>
        <div className="w-full bg-green-50 h-2 rounded-full mb-4">
          <div className="h-full bg-green-600 rounded-full" style={{width: `${((idx+1)/soals.length)*100}%`}}></div>
        </div>
        <div className="text-[19px] font-semibold mb-5">[{s.nomor}] {s.soal}</div>
        <div className="flex flex-col gap-3">
          {['a','b','c','d'].map(k => {
            const opsi = s[`opsi_${k}`]
            if (!opsi) return null
            const K = k.toUpperCase()
            let border = '1.5px solid #d1d5db', bg='white'
            if (showHasil) {
              if (K===kunci) {border='2.5px solid #16a34a'; bg='#dcfce7'}
              else if (K===userJawab) {border='2.5px solid #dc2626'; bg='#fee2e2'}
            } else if (userJawab===K) {border='2.5px solid #2563eb'; bg='#dbeafe'}
            return (
              <button key={K} onClick={()=>{if(showHasil) return; setJawaban({...jawaban,[idx]:K}); setShowHasil(true)}} style={{border, background:bg, padding:'14px 18px', borderRadius:14, textAlign:'left'}}>
                <b>{K}.</b> {opsi} {showHasil && K===kunci && '✅'} {showHasil && K===userJawab && K!==kunci && '❌'}
              </button>
            )
          })}
        </div>
        {showHasil && (
          <div className="mt-4 p-4 rounded-xl" style={{background: isBenar? '#f0fdf4' : '#fef2f2', border: `1.5px solid ${isBenar? '#16a34a' : '#fca5a5'}`}}>
            <div className="font-bold">{isBenar? '🎉 BENAR!' : `❌ SALAH! Jawaban: ${kunci}`}</div>
            <div className="mt-2 text-sm"><b>📚 Pembahasan:</b> {s.pembahasan}</div>
          </div>
        )}
        <div className="flex justify-between mt-6">
          <button disabled={idx===0} onClick={()=>{setIdx(idx-1); setShowHasil(!!jawaban[idx-1])}} className="px-5 py-2 rounded-xl bg-gray-500 text-white disabled:bg-gray-300">Prev</button>
          <button disabled={!userJawab} onClick={()=>{if(idx<soals.length-1){setIdx(idx+1); setShowHasil(!!jawaban[idx+1])} else {alert(`Skor: ${Object.keys(jawaban).filter(i=>jawaban[Number(i)]===soals[Number(i)]?.jawaban?.toUpperCase()).length}/${soals.length}`)}}} className="px-6 py-2 rounded-xl bg-green-600 text-white disabled:bg-gray-300 font-bold">
            {idx===soals.length-1? 'Selesai' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  )
}