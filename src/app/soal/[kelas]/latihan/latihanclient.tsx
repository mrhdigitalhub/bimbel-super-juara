'use client'
import { useState } from 'react'
import Link from 'next/link'

type Soal = {
  kelas: string
  mapel: string
  bab_ke: number
  no_urut: number
  pertanyaan: string
  opsi_a: string
  opsi_b: string
  opsi_c: string
  opsi_d: string
  jawaban: string
  pembahasan: string
}

export default function LatihanClient({ soal, kelas, mapel, bab }: { soal: Soal[], kelas: string, mapel: string, bab: number }) {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<(string|null)[]>(Array(soal.length).fill(null))
  const [step, setStep] = useState<'quiz' | 'finished' | 'score'>('quiz')
  const [selected, setSelected] = useState<string|null>(null)

  const handleSelect = (opsi: string) => {
    if (selected) return
    setSelected(opsi)
    const newAnswers = [...answers]
    newAnswers[current] = opsi
    setAnswers(newAnswers)

    setTimeout(() => {
      setSelected(null)
      if (current < soal.length - 1) {
        setCurrent(c => c + 1)
      } else {
        setStep('finished')
      }
    }, 350)
  }

  const benar = answers.filter((a, i) => a === soal[i]?.jawaban).length
  const skor = Math.round((benar / soal.length) * 100)
  const salahList = soal.map((s, i) => ({ soal: s, idx: i, userAns: answers[i] })).filter(x => x.userAns !== x.soal.jawaban)

  // STEP 2: SELESAI 30 SOAL
  if (step === 'finished') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-3xl mx-auto">
          <Link href={`/soal/${kelas}?mapel=${mapel}`} className="inline-block bg-white border px-4 py-2 rounded-full text-sm font-bold mb-4">← Kembali ke Dashboard {kelas.toUpperCase()} - 30 BAB</Link>
          <div className="bg-white rounded-2xl p-10 border text-center shadow-sm">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-xl font-bold">Selesai!</h1>
            <p className="text-gray-500 mt-2">Kamu sudah mengerjakan {soal.length} soal</p>
            <p className="font-bold mt-2">{kelas.toUpperCase()} - {mapel} BAB {bab} - {soal[0]?.pertanyaan ? '' : ''}</p>
            <button onClick={() => setStep('score')} className="mt-8 w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-full shadow-lg transition">
              Kumpulkan & Lihat Score
            </button>
          </div>
        </div>
      </div>
    )
  }

  // STEP 3: LIHAT SCORE + SALAH + PENJELASAN + 2 TOMBOL KEMBALI
  if (step === 'score') {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-3xl mx-auto">
          <Link href={`/soal/${kelas}?mapel=${mapel}`} className="inline-block bg-white border px-4 py-2 rounded-full text-sm font-bold mb-4">← Kembali ke Dashboard {kelas.toUpperCase()} - 30 BAB</Link>
          
          <div className="bg-white rounded-2xl p-6 border shadow-sm">
            <h1 className="font-bold text-lg">{kelas.toUpperCase()} - {mapel} BAB {bab} - {soal.length} SOAL</h1>
            <div className="mt-4 bg-orange-50 rounded-2xl p-6 text-center">
              <div className="text-5xl font-black text-orange-500">{skor}%</div>
              <div className="mt-2 font-bold">Benar {benar} dari {soal.length} | Salah {salahList.length}</div>
              <div className="text-sm text-gray-500 mt-1">Mapel: {mapel} | BAB {bab}</div>
            </div>
          </div>

          <div className="mt-4 bg-white rounded-2xl p-6 border shadow-sm">
            <h2 className="font-bold">Ringkasan: Jawaban yang salah + penjelasan</h2>
            {salahList.length === 0 ? (
              <div className="text-center py-10"><div className="text-5xl">🌟</div><p className="font-black text-green-600 mt-3">Sempurna! Semua benar!</p></div>
            ) : (
              <div className="mt-4 space-y-5">
                {salahList.map(({ soal: s, userAns }) => (
                  <div key={s.no_urut} className="border-2 border-red-100 bg-red-50/40 rounded-2xl p-5">
                    <div className="flex justify-between"><span className="font-bold">Soal No. {s.no_urut}</span><span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-bold">SALAH</span></div>
                    <p className="mt-3 font-semibold">{s.pertanyaan}</p>
                    <div className="mt-3 space-y-2 text-sm">
                      <p className="bg-white p-3 rounded-xl border">Jawaban kamu: <b>{userAns} - {(s as any)[`opsi_${userAns?.toLowerCase()}`]}</b></p>
                      <p className="bg-green-50 border-green-200 p-3 rounded-xl border">Jawaban benar: <b>{s.jawaban} - {(s as any)[`opsi_${s.jawaban.toLowerCase()}`]}</b></p>
                      <p className="bg-blue-50 border-blue-100 p-3 rounded-xl border"><b>Penjelasan:</b> {s.pembahasan}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8">
              <Link href={`/soal/${kelas}?mapel=${mapel}`} className="text-center bg-gray-100 font-bold py-4 rounded-xl hover:bg-gray-200 transition">Kembali ke Dashboard BAB</Link>
              <Link href={`/kelas/${kelas}`} className="text-center bg-orange-500 text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition">Kembali ke Dashboard Mapel</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // STEP 1: QUIZ 1 SOAL AUTO-NEXT
  const q = soal[current]
  const progress = ((current + 1) / soal.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <Link href={`/soal/${kelas}?mapel=${mapel}`} className="inline-block bg-white border px-4 py-2 rounded-full text-sm font-bold mb-4">← Kembali ke Dashboard {kelas.toUpperCase()} - 30 BAB</Link>
        
        <div className="bg-white rounded-2xl p-4 border shadow-sm mb-4">
          <div className="flex justify-between text-sm font-bold">
            <span>{kelas.toUpperCase()} - {mapel} BAB {bab} - {soal.length} SOAL</span>
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs">{current+1}/{soal.length}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-green-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border shadow-sm">
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-orange-400 text-white rounded flex items-center justify-center font-black text-sm">{q.no_urut}</div>
            <h2 className="flex-1 font-bold">{q.pertanyaan}</h2>
          </div>
          <div className="grid gap-3 mt-6">
            {[
              { k: 'A', v: q.opsi_a },
              { k: 'B', v: q.opsi_b },
              { k: 'C', v: q.opsi_c },
              { k: 'D', v: q.opsi_d },
            ].map(opsi => (
              <button key={opsi.k} onClick={() => handleSelect(opsi.k)} className={`text-left p-4 rounded-xl border-2 font-medium transition-all flex items-center gap-3 ${selected === opsi.k ? 'bg-orange-500 text-white border-orange-500 scale-[1.02] shadow' : 'bg-white border-gray-100 hover:border-orange-300'}`}>
                <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${selected === opsi.k ? 'bg-white text-orange-500' : 'bg-white'}`}>{selected === opsi.k ? '●' : '○'}</span>
                <span><b>{opsi.k}.</b> {opsi.v}</span>
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">Pilih A/B/C/D → langsung lanjut otomatis</p>
        </div>
      </div>
    </div>
  )
}
