
"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// STEP 5 - V4 30 SOAL PER BAB: 15 PG HOTS + 8 SINGKAT + 7 URAIAN
export default function LatihanV4() {
  const params = useParams();
  const searchParams = useSearchParams();
  const kelas = params.kelas as string; // bsj-sd3
  const mapel = searchParams.get("mapel") || "Matematika";
  const babParam = parseInt(searchParams.get("bab") || "1");

  const [namaSiswa, setNamaSiswa] = useState("");
  const [babKe, setBabKe] = useState(babParam);
  const [namaBab, setNamaBab] = useState("Loading...");
  const [soalList, setSoalList] = useState<any[]>([]);
  const [jawaban, setJawaban] = useState<Record<number,string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(()=>{
    const saved = localStorage.getItem("bsj_nama_siswa");
    if(saved) setNamaSiswa(saved);
  },[]);

  useEffect(()=>{
    async function load(){
      setLoading(true);
      // Ambil nama bab dari master_bab
      const { data: master } = await supabase.from("master_bab").select("nama_bab").eq("kelas", kelas).eq("mapel", mapel).eq("bab_ke", babKe).single();
      if(master) setNamaBab(master.nama_bab);

      // Ambil soal 30 per bab
      const { data } = await supabase.from("soal").select("*").eq("kelas", kelas).eq("mapel", mapel).eq("bab_ke", babKe).order("nomor", {ascending:true}).limit(30);
      setSoalList(data||[]);
      setLoading(false);
    }
    load();
  },[kelas, mapel, babKe]);

  const hitungNilai = () => {
    let benarPG=0, benarSingkat=0, benarUraian=0;
    let totalPG=0, totalSingkat=0, totalUraian=0;
    soalList.forEach(s=>{
      const j = (jawaban[s.nomor]||"").toLowerCase().trim();
      const kunci = (s.kunci||"").toLowerCase().trim();
      const isBenar = j && (j===kunci || kunci.includes(j) || j.includes(kunci));
      if(s.tipe_soal==='pg_hots'){ totalPG++; if(isBenar) benarPG++; }
      if(s.tipe_soal==='essay_singkat'){ totalSingkat++; if(isBenar) benarSingkat++; }
      if(s.tipe_soal==='essay_uraian'){ totalUraian++; if(isBenar) benarUraian++; }
    });
    const poin = benarPG*2 + benarSingkat*3 + benarUraian*6;
    const maxPoin = totalPG*2 + totalSingkat*3 + totalUraian*6;
    const nilai = maxPoin ? Math.round(poin/maxPoin*100) : 0;
    return {benarPG, totalPG, benarSingkat, totalSingkat, benarUraian, totalUraian, poin, maxPoin, nilai};
  };

  const handleSave = async () => {
    if(!namaSiswa){ alert("Isi Nama Siswa dulu Bos!"); return; }
    const {nilai, poin} = hitungNilai();
    setSaving(true);
    localStorage.setItem("bsj_nama_siswa", namaSiswa);
    const { error } = await supabase.from("skor_siswa").insert({
      nama_siswa: namaSiswa,
      kelas, mapel,
      bab_ke: babKe,
      nama_bab: namaBab,
      skor: nilai,
      poin,
      total_soal: 30,
      tipe: `BAB-${babKe}-30soal`
    });
    setSaving(false);
    if(error) alert("Gagal: "+error.message);
    else { alert(`✅ Skor Bab ${babKe} disimpan! Nilai ${nilai}`); window.location.href="/leaderboard"; }
  };

  if(loading) return <div className="p-8">Loading Bab {babKe}...</div>;

  const {nilai, benarPG, totalPG, benarSingkat, totalSingkat, benarUraian, totalUraian} = hitungNilai();

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* HEADER BAB */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-4 mb-4">
        <h1 className="text-xl font-bold">{kelas.toUpperCase()} - {mapel} - BAB {babKe}: {namaBab} (30 Soal) V4</h1>
        <p className="text-sm mt-1">Petunjuk: 15 PG HOTS (2 poin) + 8 Essay Singkat (3 poin) + 7 Uraian Panjang (6 poin) = 100</p>
        <div className="mt-3 flex gap-2">
          {Array.from({length:10},(_,i)=>i+1).map(b=>(
            <button key={b} onClick={()=>{setBabKe(b); window.history.replaceState(null,"",`?mapel=${mapel}&bab=${b}`)}} className={`px-2 py-1 rounded text-xs ${b===babKe?'bg-white text-orange-600':'bg-orange-300'}`}>Bab {b}</button>
          ))}
        </div>
      </div>

      {/* NAMA BESAR + DISKET BESAR */}
      <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-4 mb-6 flex flex-col md:flex-row justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-bold">👤 Nama:</span>
          <input value={namaSiswa} onChange={e=>setNamaSiswa(e.target.value)} placeholder="Ketik nama lengkap siswa" className="border-2 border-orange-400 rounded-lg px-4 py-2 w-64 text-base" />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold">Nilai: {nilai}</span>
          <button onClick={handleSave} disabled={saving} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold">💾 {saving?'Menyimpan...':'Simpan Nilai Bab '+babKe}</button>
        </div>
      </div>

      {/* LIST SOAL 30 */}
      <div className="space-y-6">
        {soalList.map((s,idx)=>{
          const isPG = s.tipe_soal==='pg_hots';
          return (
            <div key={s.nomor} className="border rounded-xl p-4 bg-white">
              <div className="flex gap-2 mb-2">
                <span className="bg-gray-900 text-white px-2 py-0.5 rounded text-xs">Soal {idx+1}/30</span>
                <span className={`px-2 py-0.5 rounded text-xs ${isPG?'bg-blue-100':'bg-green-100'}`}>{s.tipe_soal}</span>
                <span className="text-xs text-gray-500">{s.skor_poin} poin</span>
              </div>
              <p className="font-medium mb-3">{s.pertanyaan}</p>
              {isPG ? (
                <div className="grid gap-2">
                  {['A','B','C','D'].map(op=>(
                    <button key={op} onClick={()=>setJawaban({...jawaban,[s.nomor]:op})} className={`text-left border rounded-lg p-2 ${jawaban[s.nomor]===op?'bg-orange-100 border-orange-400':''}`}>
                      {op}. {s[`opsi_${op.toLowerCase()}`]||s[`opsi${op}`]||'-'}
                    </button>
                  ))}
                </div>
              ) : (
                <textarea value={jawaban[s.nomor]||''} onChange={e=>setJawaban({...jawaban,[s.nomor]:e.target.value})} placeholder={s.tipe_soal==='essay_singkat'?'Jawab singkat 1-2 kalimat':'Uraikan 3-5 kalimat dengan alasan'} className="w-full border-2 rounded-lg p-3 min-h-[80px]" />
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-8 bg-gray-900 text-white rounded-xl p-4 flex justify-between">
        <div>PG: {benarPG}/{totalPG} | Singkat: {benarSingkat}/{totalSingkat} | Uraian: {benarUraian}/{totalUraian} | Nilai: {nilai}</div>
        <button onClick={handleSave} className="bg-green-500 px-4 py-1 rounded">💾 Simpan</button>
      </div>
    </div>
  )
}
