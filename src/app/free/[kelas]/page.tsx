'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

const MAPEL = ['Semua', 'Matematika', 'B.Indonesia', 'IPA']
const MAPEL_ICON: any = { 'Matematika': '🔢', 'B.Indonesia': '📝', 'IPA': '🔬' }

function generateFreeSoal(kelas: string) {
  const soals: any[] = []
  const mapels = ['Matematika', 'B.Indonesia', 'IPA']
  let id = 1
  // Soal real SD2 contoh (bisa BOS ganti dengan data real dari file SQL BOS)
  const bankContoh: any = {
    'Matematika': [
      { q: 'Hasil dari 125 + 378 = ?', opsi: ['493','503','513','523'], kunci: 'B', bahas: '125+378 = 503' },
      { q: '7 x 8 = ?', opsi: ['54','56','58','64'], kunci: 'B', bahas: '7x8=56' },
      { q: '1000 - 456 = ?', opsi: ['544','554','644','454'], kunci: 'A', bahas: '1000-456=544' },
      { q: '1/2 + 1/4 = ?', opsi: ['2/6','3/4','1/6','2/4'], kunci: 'B', bahas: '1/2+1/4=3/4' },
      { q: 'Keliling persegi sisi 6 cm = ?', opsi: ['12 cm','18 cm','24 cm','36 cm'], kunci: 'C', bahas: 'K=4×s=24cm' },
      { q: '25 x 4 = ?', opsi: ['100','80','90','110'], kunci: 'A', bahas: '25×4=100' },
      { q: 'Bilangan genap setelah 19 adalah?', opsi: ['20','21','19','18'], kunci: 'A', bahas: 'Genap setelah 19 adalah 20' },
      { q: '3 jam = ... menit', opsi: ['60','120','180','90'], kunci: 'C', bahas: '3×60=180 menit' },
      { q: 'Luas persegi panjang p=8, l=5 adalah?', opsi: ['13','40','26','20'], kunci: 'B', bahas: 'L=p×l=40' },
      { q: '100 : 4 = ?', opsi: ['20','25','30','40'], kunci: 'B', bahas: '100:4=25' },
    ],
    'B.Indonesia': [
      { q: 'Antonim kata "rajin" adalah?', opsi: ['malas','giat','tekun','pintar'], kunci: 'A', bahas: 'Antonim rajin = malas' },
      { q: 'Kalimat yang menggunakan tanda tanya adalah?', opsi: ['Saya pergi','Siapa namamu?','Hari ini cerah','Dia cantik'], kunci: 'B', bahas: 'Kalimat tanya pakai ?' },
      { q: 'Sinonim "senang" adalah?', opsi: ['sedih','gembira','marah','takut'], kunci: 'B', bahas: 'Sinonim senang = gembira' },
      { q: 'Huruf kapital dipakai untuk?', opsi: ['nama orang','kata biasa','sifat','kerja'], kunci: 'A', bahas: 'Awal nama orang pakai kapital' },
      { q: 'Ide pokok paragraf disebut?', opsi: ['gagasan utama','judul','kesimpulan','ringkasan'], kunci: 'A', bahas: 'Ide pokok = gagasan utama' },
      { q: 'Kata "meja" termasuk kata?', opsi: ['kerja','sifat','benda','ganti'], kunci: 'C', bahas: 'Meja = kata benda' },
      { q: 'Tanda titik dipakai di?', opsi: ['akhir kalimat','tengah','awal','sembarang'], kunci: 'A', bahas: 'Titik di akhir kalimat' },
      { q: 'Cerita tentang hewan disebut?', opsi: ['fabel','legenda','mitos','saga'], kunci: 'A', bahas: 'Fabel = cerita hewan' },
      { q: 'Lawan kata "besar" adalah?', opsi: ['tinggi','kecil','panjang','lebar'], kunci: 'B', bahas: 'Besar vs kecil' },
      { q: '"Ibu memasak di dapur" subjeknya?', opsi: ['memasak','di dapur','Ibu','di'], kunci: 'C', bahas: 'Subjek = Ibu' },
    ],
    'IPA': [
      { q: 'Bagian tumbuhan yang menyerap air?', opsi: ['daun','batang','akar','bunga'], kunci: 'C', bahas: 'Akar menyerap air' },
      { q: 'Hewan yang berkembang biak bertelur?', opsi: ['kucing','ayam','sapi','kambing'], kunci: 'B', bahas: 'Ayam bertelur' },
      { q: 'Benda cair contohnya?', opsi: ['batu','air','kayu','besi'], kunci: 'B', bahas: 'Air = benda cair' },
      { q: 'Panca indra untuk melihat?', opsi: ['telinga','mata','hidung','lidah'], kunci: 'B', bahas: 'Mata untuk melihat' },
      { q: 'Planet tempat kita tinggal?', opsi: ['Mars','Bumi','Venus','Jupiter'], kunci: 'B', bahas: 'Kita tinggal di Bumi' },
      { q: 'Fotosintesis terjadi di?', opsi: ['akar','daun','batang','bunga'], kunci: 'B', bahas: 'Fotosintesis di daun' },
      { q: 'Sumber energi terbesar?', opsi: ['bulan','matahari','lampu','api'], kunci: 'B', bahas: 'Matahari sumber energi' },
      { q: 'Hewan berkaki 4?', opsi: ['ayam','kucing','ular','ikan'], kunci: 'B', bahas: 'Kucing kaki 4' },
      { q: 'Wujud air saat membeku jadi?', opsi: ['uap','es','cair','gas'], kunci: 'B', bahas: 'Membeku jadi es' },
      { q: 'Bagian bunga yang indah?', opsi: ['akar','mahkota','batang','daun'], kunci: 'B', bahas: 'Mahkota bunga indah' },
    ]
  }

  mapels.forEach((m) => {
    const bank = bankContoh[m] || []
    for (let i = 0; i < 10; i++) {
      const data = bank[i] || { q: `Soal ${i+1} ${m} ${kelas}`, opsi: ['A','B','C','D'], kunci: 'A', bahas: 'Pembahasan' }
      soals.push({
        id: id++,
        mapel: m,
        kelas: kelas,
        pertanyaan: data.q,
        opsi: [
          `A. ${data.opsi[0]}`,
          `B. ${data.opsi[1]}`,
          `C. ${data.opsi[2]}`,
          `D. ${data.opsi[3]}`,
        ],
        jawaban: data.kunci,
        pembahasan: data.bahas
      })
    }
  })
  return soals
}

export default function FreeKelasPage() {
  const params = useParams()
  const kelasParam = (params?.kelas as string) || 'bsj-sd2'
  const kelasDisplay = kelasParam.replace('bsj-', '').toUpperCase().replace('SD','SD ')
  
  const [filterMapel, setFilterMapel] = useState('Semua')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState<Record<number, string>>({})
  const [showPembahasan, setShowPembahasan] = useState<Record<number, boolean>>({})
  const [soalList] = useState(() => generateFreeSoal(kelasDisplay))

  const filtered = filterMapel === 'Semua' ? soalList : soalList.filter((s:any) => s.mapel === filterMapel)
  const current = filtered[currentIdx]

  useEffect(() => { setCurrentIdx(0) }, [filterMapel])

  const totalJawab = Object.keys(selected).length
  const totalBenar = soalList.filter((s:any) => selected[s.id] === s.jawaban).length
  const score = totalJawab > 0 ? Math.round((totalBenar / soalList.length) * 100) : 0

  const handlePilih = (huruf: string) => {
    if (!current) return
    setSelected(prev => ({ ...prev, [current.id]: huruf }))
  }

  const isSelected = (huruf: string) => current && selected[current.id] === huruf
  const hasAnswered = current && !!selected[current.id]
  const isBenar = hasAnswered && selected[current.id] === current.jawaban

  if (!current) return <div className="p-10 text-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header dengan Logo MRH */}
        <div className="flex items-center justify-between mb-4">
          <Link href="/free" className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow text-sm font-bold text-slate-700 hover:bg-slate-50">
            <span>←</span> Dashboard FREE
          </Link>
          <img src="/logo-mrh-transparan.png" alt="MRH" className="h-10 object-contain" onError={(e)=> (e.currentTarget.style.display='none')} />
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black">🎁 FREE {kelasDisplay} - 30 SOAL</span>
          <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-bold">Score: {totalBenar}/{soalList.length} ({score}%) • {totalJawab} dijawab</span>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-full h-2.5 mb-2 overflow-hidden shadow-inner">
          <div className="h-full bg-gradient-to-r from-green-400 to-emerald-600 transition-all duration-500" style={{ width: `${(totalJawab / soalList.length) * 100}%` }}></div>
        </div>
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {soalList.map((s:any) => {
            const answered = !!selected[s.id]
            const correct = selected[s.id] === s.jawaban
            return <div key={s.id} className={`min-w-[8px] h-2 rounded-full ${!answered ? 'bg-slate-300' : correct ? 'bg-green-500' : 'bg-red-500'}`}></div>
          })}
        </div>

        {/* Filter */}
        <div className="bg-white rounded-2xl shadow p-3 mb-4 flex flex-wrap gap-2">
          {MAPEL.map((m) => (
            <button key={m} onClick={() => setFilterMapel(m)}
              className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${filterMapel === m ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'}`}>
              {m !== 'Semua' ? `${MAPEL_ICON[m]||''} ${m}` : m} ({m==='Semua'? soalList.length:10})
            </button>
          ))}
        </div>

        {/* Card Soal */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-slate-100">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{current.mapel} • Soal {currentIdx+1}/{filtered.length}</span>
            {hasAnswered && (
              <span className={`text-xs font-black px-3 py-1 rounded-full ${isBenar ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {isBenar ? '✓ Benar' : '✗ Salah'} - Kunci {current.jawaban}
              </span>
            )}
          </div>
          
          <h2 className="text-[17px] font-bold text-slate-800 mb-5 leading-relaxed">{currentIdx+1}. {current.pertanyaan}</h2>

          <div className="space-y-3 mb-6">
            {current.opsi.map((o:string, i:number) => {
              const huruf = o.charAt(0)
              const terpilih = isSelected(huruf)
              const isKunci = current.jawaban === huruf
              const sudah = hasAnswered
              let cls = "bg-slate-50 border-slate-200 hover:bg-slate-100"
              if (terpilih && !sudah) cls = "bg-indigo-50 border-indigo-500 ring-2 ring-indigo-200 font-bold"
              if (sudah) {
                if (terpilih && isKunci) cls = "bg-green-100 border-green-500 text-green-900 font-black ring-2 ring-green-300"
                else if (terpilih && !isKunci) cls = "bg-red-100 border-red-400 text-red-900 font-bold"
                else if (!terpilih && isKunci) cls = "bg-green-50 border-green-400 text-green-800 font-bold"
                else cls = "bg-slate-50 border-slate-200 opacity-60"
              }
              return (
                <button key={i} onClick={() => handlePilih(huruf)} className={`w-full text-left p-4 rounded-xl border-2 text-[15px] transition-all ${cls}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border ${terpilih ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700'}`}>{huruf}</div>
                    <span className="flex-1">{o.substring(2)}</span>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="flex flex-wrap gap-2">
            <button disabled={!hasAnswered} onClick={()=> setShowPembahasan(p=> ({...p, [current.id]: !p[current.id]}))} className={`px-5 py-2.5 rounded-full font-bold text-sm ${!hasAnswered ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600 text-white shadow'}`}>
              {!hasAnswered ? 'Pilih jawaban dulu BOS' : showPembahasan[current.id] ? 'Sembunyikan Pembahasan' : 'Lihat Jawaban & Pembahasan'}
            </button>
            <button disabled={currentIdx===0} onClick={()=> setCurrentIdx(currentIdx-1)} className="px-5 py-2.5 rounded-full bg-slate-200 font-bold text-sm disabled:opacity-40">← Prev</button>
            <button disabled={currentIdx===filtered.length-1} onClick={()=> setCurrentIdx(currentIdx+1)} className="px-5 py-2.5 rounded-full bg-slate-900 text-white font-bold text-sm disabled:opacity-40">Next →</button>
          </div>

          {hasAnswered && showPembahasan[current.id] && (
            <div className={`mt-5 rounded-xl p-4 text-sm border-2 ${isBenar ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
              <div className="font-black">Pembahasan {current.mapel}:</div>
              <div className="mt-1">{current.pembahasan}</div>
              <div className="mt-3 flex gap-4 text-xs">
                <span>Jawaban kamu: <b className={isBenar ? 'text-green-700':'text-red-600'}>{selected[current.id]} {isBenar ? '(BENAR)' : '(SALAH)'}</b></span>
                <span>Kunci: <b>{current.jawaban}</b></span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-5 text-white flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <div className="font-black">Progress Free {kelasDisplay} - Score {score}%</div>
            <div className="text-sm text-slate-300">{totalBenar} benar dari {totalJawab} dijawab • Total {soalList.length} soal</div>
          </div>
          <Link href="/soal" className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2.5 rounded-full font-black text-sm">Upgrade 17RB → 600 Soal</Link>
        </div>

        <div className="mt-6 text-center">
          <img src="/logo-mrh-transparan.png" alt="MRH DigitalHub" className="h-10 mx-auto object-contain opacity-90" onError={(e)=> (e.currentTarget.style.display='none')} />
          <div className="text-[10px] text-slate-400 mt-2">Bimbel Super Juara by MRH DigitalHub • Konsultan | Sertifikasi | DigitalHub</div>
        </div>
      </div>
    </div>
  )
}
