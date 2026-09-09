// src/app/soal/[kelas]/latihan/page.tsx - V3.3 LEADERBOARD SD1-SD6 - SCORE PER 20 + WARNA + SAVE SUPABASE
"use client";
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Soal = {
  id: number;
  kelas: string;
  mapel: string;
  no_urut: number;
  tipe_soal: string;
  pertanyaan: string;
  opsi_a?: string;
  opsi_b?: string;
  opsi_c?: string;
  opsi_d?: string;
  jawaban?: string;
  jawaban_isian?: string;
  kunci_essay?: string;
  pembahasan: string;
  is_free: boolean;
};

export default function LatihanPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const rawKelas = params.kelas as string;
  const mapel = searchParams.get('mapel') || 'IPAS';
  const kelasId = rawKelas?.startsWith("bsj-") ? rawKelas : `bsj-${rawKelas}`;

  const [soal, setSoal] = useState<Soal[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [jawabanUser, setJawabanUser] = useState<Record<string, string>>({});
  const [showHasil, setShowHasil] = useState(false);
  const [showBlockScore, setShowBlockScore] = useState(false);
  const [showFinalScore, setShowFinalScore] = useState(false);
  const [namaSiswa, setNamaSiswa] = useState("");
  const [showNamaModal, setShowNamaModal] = useState(false);
  const [pendingSave, setPendingSave] = useState<{blok:number, range:string, benar:number, total:number, nilai:number} | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const savedNama = localStorage.getItem("bsj_nama_siswa");
    if (savedNama) setNamaSiswa(savedNama);
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase.from('soal').select('*').eq('kelas', kelasId).eq('mapel', mapel).order('no_urut', { ascending: true });
      setSoal((data as Soal[]) || []);
      setLoading(false);
    }
    load();
  }, [kelasId, mapel]);

  function isBenar(s: Soal, userAns: string): boolean {
    if (!userAns) return false;
    if (s.tipe_soal === 'pilihan_ganda') return userAns.toUpperCase() === (s.jawaban || '').toUpperCase();
    if (s.tipe_soal === 'isian' || s.tipe_soal === 'benar_salah') return userAns.trim().toLowerCase() === (s.jawaban_isian || '').trim().toLowerCase();
    if (s.tipe_soal === 'essay') return userAns.trim().length > 10;
    return false;
  }

  function hitungScore(start: number, end: number) {
    let benar = 0; let totalObjektif = 0;
    for (let i = start; i <= end && i < soal.length; i++) {
      const s = soal[i];
      if (s.tipe_soal === 'essay') continue;
      totalObjektif++;
      if (isBenar(s, jawabanUser[String(s.no_urut)] || '')) benar++;
    }
    const nilai = totalObjektif > 0 ? Math.round((benar / totalObjektif) * 100) : 0;
    return { benar, total: totalObjektif, nilai };
  }

  function getAllBlocksScore() {
    const blocks = [];
    for (let b = 0; b < Math.ceil(soal.length / 20); b++) {
      const start = b * 20; const end = Math.min(start + 19, soal.length - 1);
      const sc = hitungScore(start, end);
      blocks.push({ blok: b + 1, range: `${start + 1}-${end + 1}`, ...sc });
    }
    return blocks;
  }

  async function saveScore(blok: number, range: string, benar: number, total: number, nilai: number) {
    if (!namaSiswa.trim()) { setPendingSave({blok, range, benar, total, nilai}); setShowNamaModal(true); return; }
    setSaving(true);
    localStorage.setItem("bsj_nama_siswa", namaSiswa.trim());
    const { error } = await supabase.from('skor_siswa').insert({
      nama_siswa: namaSiswa.trim(),
      kelas: kelasId,
      mapel: mapel,
      blok_ke: blok,
      rentang_soal: range,
      benar, total_soal: total, nilai
    });
    setSaving(false);
    if (!error) { alert(`✅ Skor disimpan! ${namaSiswa} - ${kelasId} ${mapel} ${range} Nilai ${nilai}`); }
    else { alert("Gagal simpan: " + error.message); }
  }

  function confirmNamaAndSave() {
    if (!namaSiswa.trim()) { alert("Isi nama dulu!"); return; }
    setShowNamaModal(false);
    if (pendingSave) { saveScore(pendingSave.blok, pendingSave.range, pendingSave.benar, pendingSave.total, pendingSave.nilai); setPendingSave(null); }
  }

  if (loading) return <div className="p-10 text-center">Loading {kelasId} - {mapel}...</div>;
  if (soal.length === 0) return <div className="p-10 text-center">Belum ada soal untuk {kelasId} - {mapel}</div>;

  if (showFinalScore) {
    const blocks = getAllBlocksScore();
    const totalBenar = blocks.reduce((a, b) => a + b.benar, 0);
    const totalSoalObj = blocks.reduce((a, b) => a + b.total, 0);
    const totalNilai = totalSoalObj > 0 ? Math.round((totalBenar / totalSoalObj) * 100) : 0;
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">🏆 HASIL AKHIR {kelasId} - {mapel}</h1>
        <div className="bg-blue-600 text-white rounded-xl p-6 text-center mb-6">
          <p className="text-sm">TOTAL NILAI</p>
          <p className="text-5xl font-black my-2">{totalNilai}</p>
          <p>{totalBenar} benar dari {totalSoalObj} soal objektif</p>
        </div>
        <div className="mb-4 flex gap-2">
          <input value={namaSiswa} onChange={(e)=>setNamaSiswa(e.target.value)} placeholder="Nama kamu (misal Cika SD3)" className="border-2 p-3 rounded-lg flex-1" />
          <button onClick={()=>saveScore(0, `TOTAL 1-${soal.length}`, totalBenar, totalSoalObj, totalNilai)} disabled={saving} className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold">{saving?"Menyimpan...":"💾 Simpan Skor"}</button>
        </div>
        <div className="grid gap-3 mb-6">
          {blocks.map((b) => (
            <div key={b.blok} className="border rounded-lg p-4 flex justify-between items-center bg-white">
              <div><b>Blok {b.blok}</b> <span className="text-gray-500 text-sm">Soal {b.range}</span></div>
              <div className="flex gap-2 items-center"><div className="text-right"><div className="font-bold text-lg">{b.nilai}</div><div className="text-xs text-gray-500">{b.benar}/{b.total}</div></div><button onClick={()=>saveScore(b.blok, b.range, b.benar, b.total, b.nilai)} className="px-3 py-1 bg-orange-500 text-white rounded text-xs">Simpan</button></div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => { setShowFinalScore(false); setCurrent(0); }} className="flex-1 py-3 bg-gray-800 text-white rounded-lg">Ulangi Latihan</button>
          <a href={`/leaderboard?kelas=${kelasId}&mapel=${mapel}`} className="flex-1 py-3 bg-yellow-400 text-black rounded-lg text-center font-bold">🏅 Lihat Leaderboard</a>
        </div>
        {showNamaModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white p-6 rounded-xl max-w-sm w-full mx-4"><h3 className="font-bold mb-3">Masukkan Nama Kamu</h3><input autoFocus value={namaSiswa} onChange={(e)=>setNamaSiswa(e.target.value)} placeholder="Contoh: Budi SD3" className="border-2 p-3 w-full rounded-lg mb-4" /><div className="flex gap-2"><button onClick={()=>setShowNamaModal(false)} className="flex-1 py-2 border rounded">Batal</button><button onClick={confirmNamaAndSave} className="flex-1 py-2 bg-blue-600 text-white rounded font-bold">Simpan</button></div></div></div>
        )}
      </div>
    );
  }

  const s = soal[current];
  const currentBlockIndex = Math.floor(current / 20);
  const isEndOfBlock = (current + 1) % 20 === 0;
  const isLastSoal = current === soal.length - 1;
  const userAns = jawabanUser[String(s.no_urut)] || '';
  const benar = isBenar(s, userAns);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-2">{kelasId} - {mapel} ({soal.length} Soal) V3 Mixed</h1>
      <div className="flex gap-2 mb-4 text-sm flex-wrap items-center">
        <span className="px-2 py-1 bg-blue-100 rounded">Soal {current + 1}/{soal.length}</span>
        <span className="px-2 py-1 bg-purple-100 rounded">{s.tipe_soal}</span>
        <span className="px-2 py-1 bg-green-100 rounded">{s.is_free ? 'GRATIS' : 'PREMIUM'}</span>
        <span className="px-2 py-1 bg-orange-100 rounded">Blok {currentBlockIndex + 1}</span>
        <input value={namaSiswa} onChange={(e)=>setNamaSiswa(e.target.value)} placeholder="Nama" className="px-2 py-1 border rounded text-sm w-24" />
      </div>

      <div className="border rounded-xl p-6 shadow bg-white">
        <p className="text-lg mb-6 leading-relaxed">{s.pertanyaan}</p>

        {s.tipe_soal === 'pilihan_ganda' && (
          <div className="grid gap-3">
            {[{k:'A',v:s.opsi_a},{k:'B',v:s.opsi_b},{k:'C',v:s.opsi_c},{k:'D',v:s.opsi_d}].map((opt)=>{
              const selected = userAns === opt.k;
              let colorClass = "border-gray-300 bg-white";
              if (selected && !showHasil) colorClass = "bg-blue-500 text-white border-blue-600 font-bold shadow-lg scale-[1.02]";
              if (showHasil && selected) colorClass = benar ? "bg-green-500 text-white border-green-600 font-bold" : "bg-red-500 text-white border-red-600 font-bold";
              if (showHasil && !selected && opt.k === s.jawaban) colorClass = "bg-green-100 border-green-500 text-green-800 font-bold ring-2 ring-green-300";
              return <button key={opt.k} onClick={()=>setJawabanUser({...jawabanUser,[String(s.no_urut)]:opt.k})} className={`text-left border-2 p-3 rounded-lg transition-all ${colorClass}`}><span className="font-bold mr-2">{opt.k}.</span>{opt.v} {selected && !showHasil && "✓"} {showHasil && opt.k===s.jawaban && " - KUNCI"}</button>
            })}
          </div>
        )}

        {s.tipe_soal === 'isian' && (
          <div>
            <input type="text" placeholder="Ketik jawaban..." value={userAns} onChange={(e)=>setJawabanUser({...jawabanUser,[String(s.no_urut)]:e.target.value})} className={`border-2 p-3 w-full rounded-lg outline-none ${showHasil ? (benar?'border-green-500 bg-green-50':'border-red-500 bg-red-50') : 'focus:border-blue-500'}`} />
            {showHasil && <div className={`mt-3 p-3 rounded ${benar?'bg-green-50 text-green-800':'bg-red-50 text-red-800'}`}>{benar?'✅ Benar!':'❌ Salah'} Kunci: <b>{s.jawaban_isian}</b></div>}
          </div>
        )}

        {s.tipe_soal === 'benar_salah' && (
          <div>
            <div className="flex gap-3 mb-3">
              <button onClick={()=>setJawabanUser({...jawabanUser,[String(s.no_urut)]:'Benar'})} className={`px-8 py-3 rounded-full border-2 font-bold ${userAns==='Benar' && !showHasil?'bg-blue-500 text-white border-blue-600':''} ${showHasil && userAns==='Benar' ? (benar?'bg-green-500 text-white':'bg-red-500 text-white'):'bg-white'}`}>Benar</button>
              <button onClick={()=>setJawabanUser({...jawabanUser,[String(s.no_urut)]:'Salah'})} className={`px-8 py-3 rounded-full border-2 font-bold ${userAns==='Salah' && !showHasil?'bg-blue-500 text-white border-blue-600':''} ${showHasil && userAns==='Salah' ? (benar?'bg-green-500 text-white':'bg-red-500 text-white'):'bg-white'}`}>Salah</button>
            </div>
            <textarea placeholder="Tulis alasanmu..." value={jawabanUser[`${s.no_urut}_alasan`]||''} onChange={(e)=>setJawabanUser({...jawabanUser,[`${s.no_urut}_alasan`]:e.target.value})} className="border p-3 w-full rounded-lg h-20" />
            {showHasil && <div className="mt-3 p-3 bg-yellow-50 rounded">Kunci: {s.jawaban_isian}<br/>Alasan: {s.kunci_essay}</div>}
          </div>
        )}

        {s.tipe_soal === 'essay' && (
          <div>
            <textarea placeholder="Jelaskan jawabanmu..." value={userAns} onChange={(e)=>setJawabanUser({...jawabanUser,[String(s.no_urut)]:e.target.value})} className="border-2 p-3 w-full rounded-lg h-32 outline-none focus:border-blue-500" />
            {showHasil && <div className="mt-3 p-3 bg-blue-50 rounded"><b>Poin Kunci:</b><br/>{s.kunci_essay}</div>}
          </div>
        )}

        {showHasil && <div className="mt-6 p-4 bg-gray-50 rounded-lg border"><p className="font-bold">Pembahasan:</p><p>{s.pembahasan}</p></div>}
      </div>

      {showBlockScore && (
        <div className="mt-6 border-2 border-orange-300 bg-orange-50 rounded-xl p-4">
          <h3 className="font-bold mb-2">📊 Nilai Blok {currentBlockIndex + 1} (Soal {currentBlockIndex*20+1}-{currentBlockIndex*20+20})</h3>
          {(()=>{const sc=hitungScore(currentBlockIndex*20, currentBlockIndex*20+19); return <div className="flex justify-between items-center"><span>{sc.benar} benar / {sc.total} soal = </span><span className="font-black text-2xl">{sc.nilai}</span><button onClick={()=>saveScore(currentBlockIndex+1, `${currentBlockIndex*20+1}-${currentBlockIndex*20+20}`, sc.benar, sc.total, sc.nilai)} className="px-4 py-2 bg-green-600 text-white rounded font-bold">💾 Simpan Skor</button></div>;})()}
          <button onClick={()=>setShowBlockScore(false)} className="mt-2 text-sm underline">Tutup</button>
        </div>
      )}

      <div className="flex justify-between mt-6 gap-2">
        <button disabled={current===0} onClick={()=>{setCurrent(current-1); setShowHasil(false); setShowBlockScore(false);}} className="px-4 py-2 border rounded disabled:opacity-30">← Sebelumnya</button>
        <div className="flex gap-2">
          <button onClick={()=>setShowHasil(!showHasil)} className={`px-4 py-2 rounded font-bold ${showHasil?'bg-gray-800 text-white':'bg-yellow-400'}`}>{showHasil?'Sembunyikan':'Lihat Kunci'}</button>
          {isEndOfBlock && !isLastSoal && <button onClick={()=>{const sc=hitungScore(currentBlockIndex*20, current); setShowBlockScore(true);}} className="px-4 py-2 bg-orange-500 text-white rounded font-bold">Nilai Blok {currentBlockIndex+1}</button>}
          {isLastSoal && <button onClick={()=>setShowFinalScore(true)} className="px-4 py-2 bg-blue-600 text-white rounded font-bold">Lihat Total Nilai 🏆</button>}
        </div>
        <button disabled={current===soal.length-1} onClick={()=>{if((current+1)%20===0){setShowBlockScore(true);} setCurrent(current+1); setShowHasil(false);}} className="px-4 py-2 border rounded disabled:opacity-30">Selanjutnya →</button>
      </div>

      <div className="mt-6 flex gap-1 flex-wrap">
        {soal.map((_, idx)=>{const isNewBlock=idx%20===0; return <div key={idx} className="flex items-center">{isNewBlock && idx!==0 && <div className="w-2 h-6 bg-orange-300 mx-1 rounded"/>}<button onClick={()=>{setCurrent(idx); setShowHasil(false);}} className={`w-8 h-8 text-xs rounded border ${idx===current?'bg-black text-white font-bold':jawabanUser[String(soal[idx].no_urut)]?'bg-blue-500 text-white':'bg-white'}`}>{idx+1}</button></div>})}
      </div>

      {showNamaModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white p-6 rounded-xl max-w-sm w-full mx-4"><h3 className="font-bold mb-3">Masukkan Nama Kamu untuk Simpan Skor</h3><input autoFocus value={namaSiswa} onChange={(e)=>setNamaSiswa(e.target.value)} placeholder="Contoh: Budi SD3" className="border-2 p-3 w-full rounded-lg mb-4" /><div className="flex gap-2"><button onClick={()=>setShowNamaModal(false)} className="flex-1 py-2 border rounded">Batal</button><button onClick={confirmNamaAndSave} className="flex-1 py-2 bg-blue-600 text-white rounded font-bold">Simpan</button></div></div></div>
      )}
    </div>
  );
}
