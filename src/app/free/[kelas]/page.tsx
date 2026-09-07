'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

const MAPEL = ['Semua', 'Matematika', 'B.Indonesia', 'IPA']

function generateFreeSoal(kelas: string) {
  const soals: any[] = []
  const bank: any = {
    'Matematika': [
      { q: '125 + 378 = ?', o: ['493','503','513','523'], k: 'B', p: '125+378=503' },
      { q: '7 x 8 = ?', o: ['54','56','58','64'], k: 'B', p: '7x8=56' },
      { q: '1000 - 456 = ?', o: ['544','554','644','454'], k: 'A', p: '1000-456=544' },
      { q: '1/2 + 1/4 = ?', o: ['2/6','3/4','1/6','2/4'], k: 'B', p: '3/4' },
      { q: 'Keliling persegi sisi 6cm = ?', o: ['12','18','24','36'], k: 'C', p: '4×6=24cm' },
      { q: '25 x 4 = ?', o: ['100','80','90','110'], k: 'A', p: '100' },
      { q: 'Bil genap setelah 19?', o: ['20','21','19','18'], k: 'A', p: '20' },
      { q: '3 jam = ... menit', o: ['60','120','180','90'], k: 'C', p: '180' },
      { q: 'Luas p=8 l=5?', o: ['13','40','26','20'], k: 'B', p: '40' },
      { q: '100:4 = ?', o: ['20','25','30','40'], k: 'B', p: '25' },
    ],
    'B.Indonesia': [
      { q: 'Antonim rajin?', o: ['malas','giat','tekun','pintar'], k: 'A', p: 'rajin vs malas' },
      { q: 'Kalimat tanya?', o: ['Saya pergi','Siapa namamu?','Hari cerah','Dia cantik'], k: 'B', p: 'pakai ?' },
      { q: 'Sinonim senang?', o: ['sedih','gembira','marah','takut'], k: 'B', p: 'gembira' },
      { q: 'Huruf kapital untuk?', o: ['nama orang','kata biasa','sifat','kerja'], k: 'A', p: 'nama orang' },
      { q: 'Ide pokok disebut?', o: ['gagasan utama','judul','kesimpulan','ringkasan'], k: 'A', p: 'gagasan utama' },
      { q: 'Kata meja termasuk?', o: ['kerja','sifat','benda','ganti'], k: 'C', p: 'benda' },
      { q: 'Tanda titik di?', o: ['akhir','tengah','awal','sembarang'], k: 'A', p: 'akhir kalimat' },
      { q: 'Cerita hewan?', o: ['fabel','legenda','mitos','saga'], k: 'A', p: 'fabel' },
      { q: 'Lawan besar?', o: ['tinggi','kecil','panjang','lebar'], k: 'B', p: 'kecil' },
      { q: 'Subjek: Ibu memasak?', o: ['memasak','di dapur','Ibu','di'], k: 'C', p: 'Ibu' },
    ],
    'IPA': [
      { q: 'Menyerap air?', o: ['daun','batang','akar','bunga'], k: 'C', p: 'akar' },
      { q: 'Bertelur?', o: ['kucing','ayam','sapi','kambing'], k: 'B', p: 'ayam' },
      { q: 'Benda cair?', o: ['batu','air','kayu','besi'], k: 'B', p: 'air' },
      { q: 'Untuk melihat?', o: ['telinga','mata','hidung','lidah'], k: 'B', p: 'mata' },
      { q: 'Planet kita?', o: ['Mars','Bumi','Venus','Jupiter'], k: 'B', p: 'Bumi' },
      { q: 'Fotosintesis di?', o: ['akar','daun','batang','bunga'], k: 'B', p: 'daun' },
      { q: 'Sumber energi terbesar?', o: ['bulan','matahari','lampu','api'], k: 'B', p: 'matahari' },
      { q: 'Kaki 4?', o: ['ayam','kucing','ular','ikan'], k: 'B', p: 'kucing' },
      { q: 'Membeku jadi?', o: ['uap','es','cair','gas'], k: 'B', p: 'es' },
      { q: 'Bunga indah?', o: ['akar','mahkota','batang','daun'], k: 'B', p: 'mahkota' },
    ]
  }
  let id=1
  ;['Matematika','B.Indonesia','IPA'].forEach((m)=>{
    for(let i=0;i<10;i++){
      const d=bank[m][i]
      soals.push({ id:id++, mapel:m, kelas, pertanyaan:d.q, opsi:[`A. ${d.o[0]}`,`B. ${d.o[1]}`,`C. ${d.o[2]}`,`D. ${d.o[3]}`], jawaban:d.k, pembahasan:d.p })
    }
  })
  return soals
}

export default function FreeKelasPage() {
  const params = useParams()
  const kelasParam = (params?.kelas as string) || 'bsj-sd2'
  const kelasDisplay = kelasParam.replace('bsj-','').toUpperCase()
  const [filterMapel, setFilterMapel] = useState('Semua')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState<Record<number,string>>({})
  const [showPembahasan, setShowPembahasan] = useState<Record<number,boolean>>({})
  const [soalList] = useState(()=> generateFreeSoal(kelasDisplay))
  const filtered = filterMapel==='Semua' ? soalList : soalList.filter((s:any)=> s.mapel===filterMapel)
  const current = filtered[currentIdx]
  useEffect(()=>{ setCurrentIdx(0) },[filterMapel])
  const totalJawab = Object.keys(selected).length
  const totalBenar = soalList.filter((s:any)=> selected[s.id]===s.jawaban).length
  const score = totalJawab>0 ? Math.round((totalBenar/soalList.length)*100) : 0
  const handlePilih = (huruf:string)=>{ if(!current) return; setSelected(prev=> ({...prev, [current.id]:huruf})) }
  const isSelected = (huruf:string)=> current && selected[current.id]===huruf
  const hasAnswered = current && !!selected[current.id]
  const isBenar = hasAnswered && selected[current.id]===current.jawaban
  if(!current) return <div className="p-10 text-center">Loading...</div>
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Link href="/free" className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow text-sm font-bold text-slate-700">← Dashboard FREE</Link>
          <img src="/mrh-logo.png" alt="MRH" className="h-10 object-contain" />
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black">🎁 FREE {kelasDisplay} - 30 SOAL</span>
          <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-bold">Score: {totalBenar}/{soalList.length} ({score}%)</span>
        </div>
        <div className="bg-white rounded-full h-2.5 mb-2 overflow-hidden shadow-inner"><div className="h-full bg-gradient-to-r from-green-400 to-emerald-600 transition-all" style={{width:`${(totalJawab/soalList.length)*100}%`}}></div></div>
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">{soalList.map((s:any)=>{ const a=!!selected[s.id]; const c=selected[s.id]===s.jawaban; return <div key={s.id} className={`min-w-[8px] h-2 rounded-full ${!a ? 'bg-slate-300' : c ? 'bg-green-500' : 'bg-red-500'}`}></div> })}</div>
        <div className="bg-white rounded-2xl shadow p-3 mb-4 flex flex-wrap gap-2">
          {MAPEL.map((m)=>(
            <button key={m} onClick={()=> setFilterMapel(m)} className={`px-4 py-2 rounded-full text-sm font-bold border ${filterMapel===m ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'}`}>{m} ({m==='Semua'?soalList.length:10})</button>
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{current.mapel} • Soal {currentIdx+1}/{filtered.length}</span>
            {hasAnswered && <span className={`text-xs font-black px-3 py-1 rounded-full ${isBenar ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{isBenar ? '✓ Benar' : '✗ Salah'} - Kunci {current.jawaban}</span>}
          </div>
          <h2 className="text-[17px] font-bold text-slate-800 mb-5">{currentIdx+1}. {current.pertanyaan}</h2>
          <div className="space-y-3 mb-6">
            {current.opsi.map((o:string,i:number)=>{
              const huruf=o.charAt(0)
              const terpilih=isSelected(huruf)
              const isKunci=current.jawaban===huruf
              const sudah=hasAnswered
              let cls="bg-slate-50 border-slate-200 hover:bg-slate-100"
              if(terpilih && !sudah) cls="bg-indigo-50 border-indigo-500 ring-2 ring-indigo-200 font-bold"
              if(sudah){ if(terpilih && isKunci) cls="bg-green-100 border-green-500 text-green-900 font-black ring-2 ring-green-300"; else if(terpilih && !isKunci) cls="bg-red-100 border-red-400 text-red-900 font-bold"; else if(!terpilih && isKunci) cls="bg-green-50 border-green-400 text-green-800 font-bold"; else cls="bg-slate-50 border-slate-200 opacity-60" }
              return (<button key={i} onClick={()=> handlePilih(huruf)} className={`w-full text-left p-4 rounded-xl border-2 text-[15px] transition-all ${cls}`}><div className="flex items-center gap-3"><div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border ${terpilih ? 'bg-slate-900 text-white border-slate-900' : 'bg-white'}`}>{huruf}</div><span className="flex-1">{o.substring(2)}</span></div></button>)
            })}
          </div>
          <div className="flex flex-wrap gap-2">
            <button disabled={!hasAnswered} onClick={()=> setShowPembahasan(p=> ({...p, [current.id]:!p[current.id]}))} className={`px-5 py-2.5 rounded-full font-bold text-sm ${!hasAnswered ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600 text-white shadow'}`}>{!hasAnswered ? 'Pilih jawaban dulu BOS' : showPembahasan[current.id] ? 'Sembunyikan' : 'Lihat Jawaban & Pembahasan'}</button>
            <button disabled={currentIdx===0} onClick={()=> setCurrentIdx(currentIdx-1)} className="px-5 py-2.5 rounded-full bg-slate-200 font-bold text-sm disabled:opacity-40">← Prev</button>
            <button disabled={currentIdx===filtered.length-1} onClick={()=> setCurrentIdx(currentIdx+1)} className="px-5 py-2.5 rounded-full bg-slate-900 text-white font-bold text-sm disabled:opacity-40">Next →</button>
          </div>
          {hasAnswered && showPembahasan[current.id] && (<div className={`mt-5 rounded-xl p-4 text-sm border-2 ${isBenar ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}><div className="font-black">Pembahasan:</div><div className="mt-1">{current.pembahasan}</div><div className="mt-3 flex gap-4 text-xs"><span>Jawaban kamu: <b className={isBenar ? 'text-green-700':'text-red-600'}>{selected[current.id]}</b></span><span>Kunci: <b>{current.jawaban}</b></span></div></div>)}
        </div>
        <div className="bg-slate-900 rounded-2xl p-5 text-white flex justify-between items-center">
          <div><div className="font-black">Progress FREE {kelasDisplay} - Score {score}%</div><div className="text-sm text-slate-300">{totalBenar} benar dari {totalJawab} dijawab</div></div>
          <img src="/mrh-logo.png" alt="MRH" className="h-8 object-contain bg-[#FFF9D6] rounded-full p-1" />
        </div>
      </div>
    </div>
  )
}
