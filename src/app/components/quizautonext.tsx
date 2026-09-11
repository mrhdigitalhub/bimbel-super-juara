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

export default function QuizAutoNext({ soal, kelas, mapel, bab }: { soal: Soal[], kelas: string, mapel: string, bab: string }) {
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
        setStep('finished') // selesai 30 soal
      }
    }, 350)
  }

  const benar = answers.filter((a, i) => a === soal[i]?.jawaban).length
  const skor = Math.round((benar / soal.length) * 100)
  const salahList = soal.map((s, i) => ({ soal: s, idx: i, userAns: answers[i] })).filter(x => x.userAns !== x.soal.jawaban)

  // STEP 2: SELESAI 30 SOAL - TOMBOL SCORE
  if (step === 'finished') {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center p-4">
        <div className="bg-white rounded-[32px] p-10 shadow-sm border border-orange-100 text-center max-w-md w-full">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-xl font-bold text-gray-800">Selesai!</h1>
          <p className="text-gray-500 mt-2">Kamu sudah mengerjakan {soal.length} soal</p>
          <p className="font-bold mt-2 text-orange-600">BAB {bab} - {soal[0]?.mapel || mapel}</p>
          <button onClick={() => setStep('score')} className="mt-8 w-full bg-gradient-to-r from-orange-400 to-pink-400 text-white font-black py-4 rounded-2xl shadow-lg hover:scale-[1.02] transition">
            Lihat Score
          </button>
        </div>
      </div>
    )
  }

  // STEP 3: KLIK SCORE - MUNCUL YANG SALAH + PENJELASAN + TOMBOL KEMBALI
  if (step === 'score') {
    return (
      <div className="min-h-screen bg-[#FFF8F0] p-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-[32px] p-8 shadow-sm border text-center">
            <h1 className="text-2xl font-black text-gray-800">Hasil BAB {bab} - {soal[0]?.mapel || mapel}</h1>
            <div className="mt-6 bg-orange-50 rounded-2xl p-6">
              <div className="text-5xl font-black text-orange-500">{skor}%</div>
              <div className="mt-2 font-bold text-gray-700">Benar {benar} dari {soal.length} | Salah {salahList.length}</div>
              <div className="text-sm text-gray-500 mt-1">Mapel: {decodeURIComponent(mapel)} | BAB {bab}</div>
            </div>
          </div>

          <div className="mt-6 bg-white rounded-[32px] p-6 shadow-sm border">
            <h2 className="font-bold">Jawaban yang salah + penjelasan:</h2>
            {salahList.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-5xl">🌟</div>
                <p className="font-black text-green-600 mt-3">Sempurna! Semua benar!</p>
              </div>
            ) : (
              <div className="mt-4 space-y-5">
                {salahList.map(({ soal: s, userAns }) => (
                  <div key={s.no_urut} className="border-2 border-red-100 bg-red-50/40 rounded-2xl p-5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold">Soal No. {s.no_urut}</span>
                      <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-bold">SALAH</span>
                    </div>
                    <p className="mt-3 font-semibold">{s.pertanyaan}</p>
                    <div className="mt-3 space-y-2 text-sm">
                      <p className="bg-white p-3 rounded-xl border">Jawaban kamu: <b>{userAns} - {s[`opsi_${userAns?.toLowerCase()}` as keyof Soal] as string}</b></p>
                      <p className="bg-green-50 border-green-200 p-3 rounded-xl border">Jawaban benar: <b>{s.jawaban} - {s[`opsi_${s.jawaban.toLowerCase()}` as keyof Soal] as string}</b></p>
                      <p className="bg-blue-50 border-blue-100 p-3 rounded-xl border"><b>Penjelasan:</b> {s.pembahasan}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TOMBOL KEMBALI */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8">
              <Link href={`/kelas/${kelas}/${encodeURIComponent(mapel)}`} className="text-center bg-gray-100 font-bold py-4 rounded-2xl hover:bg-gray-200 transition">
                Kembali ke Dashboard BAB
              </Link>
              <Link href={`/kelas/${kelas}`} className="text-center bg-orange-500 text-white font-bold py-4 rounded-2xl hover:bg-orange-600 transition">
                Kembali ke Dashboard Mapel
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // STEP 1: QUIZ
  const q = soal[current]
  const progress = ((current + 1) / soal.length) * 100

  return (
    <div className="min-h-screen bg-[#FFF8F0] p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between text-sm font-bold text-gray-600">
          <span>Soal {current + 1}/{soal.length}</span>
          <span>{kelas.toUpperCase()} - {decodeURIComponent(mapel)} - BAB {bab}</span>
        </div>
        <div className="h-3 bg-white rounded-full mt-2 overflow-hidden border">
          <div className="h-full bg-gradient-to-r from-orange-400 to-pink-400 transition-all" style={{ width: `${progress}%` }} />
        </div>

        <div className="bg-white rounded-[28px] p-6 md:p-8 shadow-sm border border-orange-100 mt-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center font-black text-orange-600">{q.no_urut}</div>
            <h2 className="flex-1 font-bold text-lg">{q.pertanyaan}</h2>
          </div>
          <div className="grid gap-3 mt-6">
            {[
              { k: 'A', v: q.opsi_a },
              { k: 'B', v: q.opsi_b },
              { k: 'C', v: q.opsi_c },
              { k: 'D', v: q.opsi_d },
            ].map(opsi => (
              <button key={opsi.k} onClick={() => handleSelect(opsi.k)} className={`text-left p-4 rounded-2xl border-2 font-medium transition-all ${selected === opsi.k ? 'bg-orange-500 text-white border-orange-500 scale-[1.02] shadow-lg' : 'bg-white border-gray-100 hover:border-orange-200 hover:bg-orange-50'}`}>
                <span className={`inline-flex w-8 h-8 rounded-full items-center justify-center mr-3 font-black text-sm ${selected === opsi.k ? 'bg-white text-orange-500' : 'bg-orange-100 text-orange-600'}`}>{opsi.k}</span>
                {opsi.v}
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">Pilih → langsung next otomatis (score murni di akhir)</p>
        </div>
      </div>
    </div>
  )
}
