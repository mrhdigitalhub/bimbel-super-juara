
"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LatihanV4() {
  const params = useParams();
  const searchParams = useSearchParams();
  const kelas = (params.kelas as string) || "bsj-sd3";
  const mapel = searchParams.get("mapel") || "Matematika";
  const babParam = parseInt(searchParams.get("bab") || "1");

  const [namaSiswa, setNamaSiswa] = useState("");
  const [babKe, setBabKe] = useState(babParam);
  const [namaBab, setNamaBab] = useState("Loading...");
  const [soalList, setSoalList] = useState<any[]>([]);
  const [jawaban, setJawaban] = useState<Record<string,string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(()=>{
    const saved = typeof window !== 'undefined' ? localStorage.getItem("bsj_nama_siswa") : null;
    if(saved) setNamaSiswa(saved);
  },[]);

  useEffect(()=>{
    async function load(){
      setLoading(true);
      try {
        const { data: master } = await supabase.from("master_bab").select("nama_bab").eq("kelas", kelas).eq("mapel", mapel).eq("bab_ke", babKe).maybeSingle();
        if(master?.nama_bab) setNamaBab(master.nama_bab);
        else setNamaBab(`Bab ${babKe}`);

        const { data, error } = await supabase.from("soal").select("*").eq("kelas", kelas).eq("mapel", mapel).eq("bab_ke", babKe).order("id", {ascending:true}).limit(30);
        if(error) console.log(error);
        setSoalList(data||[]);
      } catch(e){ console.log(e); }
      setLoading(false);
    }
    load();
  },[kelas, mapel, babKe]);

  const hitungNilai = () => {
    let benarPG=0, benarSingkat=0, benarUraian=0;
    let totalPG=0, totalSingkat=0, totalUraian=0;
    soalList.forEach((s:any)=>{
      const idKey = String(s.id);
      const j = (jawaban[idKey]||"").toLowerCase().trim();
      const kunci = (s.kunci||s.jawaban||"").toLowerCase().trim();
      const isBenar = j && kunci && (j===kunci || kunci.includes(j) || j.includes(kunci));
      if(s.tipe_soal==='pg_hots'){ totalPG++; if(isBenar) benarPG++; }
      else if(s.tipe_soal==='essay_singkat'){ totalSingkat++; if(isBenar) benarSingkat++; }
      else if(s.tipe_soal==='essay_uraian'){ totalUraian++; if(isBenar) benarUraian++; }
    });
    const poin = benarPG*2 + benarSingkat*3 + benarUraian*6;
    const maxPoin = totalPG*2 + totalSingkat*3 + totalUraian*6 || 1;
    const nilai = Math.round(poin/maxPoin*100);
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
      total_soal: soalList.length,
      tipe: `BAB-${babKe}-30soal`
    });
    setSaving(false);
    if(error) alert("Gagal simpan: "+error.message);
    else { alert(`✅ Skor Bab ${babKe} ${namaBab} disimpan! Nilai ${nilai}`); window.location.href="/leaderboard"; }
  };

  if(loading) return <div className="p-8 text-center">Loading Bab {babKe} {namaBab}...</div>;

  const stat = hitungNilai();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-4 mb-4">
        <h1 className="text-xl font-bold uppercase">{kelas} - {mapel} - BAB {babKe}: {namaBab} (30 Soal) V4 FIXED</h1>
        <p className="text-sm mt-1">Petunjuk: 15 PG HOTS (2p) + 8 Singkat (3p) + 7 Uraian (6p) = 100 | Total soal di DB: {soalList.length}</p>
        <div className="mt-3 flex gap-2 flex-wrap">
          {Array.from({length:10},(_,i)=>i+1).map(b=>(
            <button key={b} onClick={()=>{setBabKe(b); if(typeof window!=='undefined') window.history.replaceState(null,"",`?mapel=${encodeURIComponent(mapel)}&bab=${b}`)}} className={`px-3 py-1 rounded text-xs font-bold ${b===babKe?'bg-white text-orange-600':'bg-orange-300 text-white'}`}>Bab {b}</button>
          ))}
        </div>
      </div>

      <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-4 mb-6 flex flex-col md:flex-row justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-bold">👤 Nama:</span>
          <input value={namaSiswa} onChange={e=>setNamaSiswa(e.target.value)} placeholder="Ketik nama lengkap siswa" className="border-2 border-orange-400 rounded-lg px-4 py-2 w-64 text-base font-bold" />
        </div>
        <div className="flex items-center gap-3">
          <span className="font-bold">Nilai: {stat.nilai}</span>
          <button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold">💾 {saving?'Menyimpan...':'Simpan Nilai Bab '+babKe}</button>
        </div>
      </div>

      <div className="space-y-6">
        {soalList.map((s:any,idx:number)=>{
          const isPG = s.tipe_soal==='pg_hots';
          const idKey = String(s.id);
          return (
            <div key={s.id} className="border rounded-xl p-4 bg-white shadow-sm">
              <div className="flex gap-2 mb-2">
                <span className="bg-gray-900 text-white px-2 py-0.5 rounded text-xs">Soal {idx+1}/{soalList.length}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${isPG?'bg-blue-100 text-blue-700':'bg-green-100 text-green-700'}`}>{s.tipe_soal}</span>
                <span className="text-xs text-gray-500">{s.skor_poin} poin</span>
                <span className="text-xs text-gray-400">ID:{s.id}</span>
              </div>
              <p className="font-medium mb-3 whitespace-pre-wrap">{s.pertanyaan || s.soal || '-'}</p>
              {isPG ? (
                <div className="grid gap-2">
                  {['A','B','C','D'].map(op=>{
                    const opsiText = s[`opsi_${op.toLowerCase()}`] || s[`opsi${op}`] || s[`pilihan_${op.toLowerCase()}`] || '-';
                    return (
                    <button key={op} onClick={()=>setJawaban({...jawaban,[idKey]:op})} className={`text-left border rounded-lg p-3 ${jawaban[idKey]===op?'bg-orange-100 border-orange-400 border-2':''}`}>
                      <b>{op}.</b> {opsiText}
                    </button>
                  )})}
                </div>
              ) : (
                <textarea value={jawaban[idKey]||''} onChange={e=>setJawaban({...jawaban,[idKey]:e.target.value})} placeholder={s.tipe_soal==='essay_singkat'?'Jawab singkat 1-2 kalimat':'Uraikan 3-5 kalimat dengan alasan'} className="w-full border-2 rounded-lg p-3 min-h-[80px]" />
              )}
            </div>
          )
        })}
      </div>

      {soalList.length===0 && <div className="p-8 bg-red-50 border border-red-200 rounded-xl">Belum ada soal untuk Bab {babKe} {namaBab}. Cek master_bab dan tabel soal. Kelas={kelas} Mapel={mapel} Bab={babKe}</div>}

      <div className="mt-8 bg-gray-900 text-white rounded-xl p-4 flex flex-col md:flex-row justify-between gap-2">
        <div className="text-sm">PG: {stat.benarPG}/{stat.totalPG} | Singkat: {stat.benarSingkat}/{stat.totalSingkat} | Uraian: {stat.benarUraian}/{stat.totalUraian} | Nilai: {stat.nilai} | Poin: {stat.poin}/{stat.maxPoin}</div>
        <button onClick={handleSave} className="bg-green-500 px-6 py-2 rounded font-bold">💾 Simpan Leaderboard</button>
      </div>
    </div>
  )
}
