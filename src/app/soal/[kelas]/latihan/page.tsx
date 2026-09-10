
"use client";
import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// Buat supabase langsung di sini, tanpa import @/lib (anti-error Vercel)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function LatihanContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const kelas = (params?.kelas as string) || "bsj-sd3";
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
    const s = localStorage.getItem("bsj_nama_siswa");
    if(s) setNamaSiswa(s);
  },[]);

  useEffect(()=>{
    async function load(){
      setLoading(true);
      try {
        const { data: master } = await supabase.from("master_bab").select("nama_bab").eq("kelas", kelas).eq("mapel", mapel).eq("bab_ke", babKe).maybeSingle();
        setNamaBab(master?.nama_bab || `Bab ${babKe}`);
        const { data } = await supabase.from("soal").select("*").eq("kelas", kelas).eq("mapel", mapel).eq("bab_ke", babKe).order("id", {ascending:true}).limit(30);
        setSoalList(data||[]);
      } catch(e){ console.error(e); }
      setLoading(false);
    }
    load();
  },[kelas, mapel, babKe]);

  const stat = (() => {
    let bPG=0,tPG=0,bS=0,tS=0,bU=0,tU=0;
    soalList.forEach((s:any)=>{
      const j = (jawaban[String(s.id)]||"").toLowerCase().trim();
      const k = (s.kunci||"").toLowerCase().trim();
      const ok = j && k && (j===k || k.includes(j));
      if(s.tipe_soal==='pg_hots'){tPG++; if(ok) bPG++;}
      else if(s.tipe_soal==='essay_singkat'){tS++; if(ok) bS++;}
      else {tU++; if(ok) bU++;}
    });
    const poin = bPG*2 + bS*3 + bU*6;
    const max = tPG*2 + tS*3 + tU*6 || 1;
    return {bPG,tPG,bS,tS,bU,tU,poin,max,nilai:Math.round(poin/max*100)};
  })();

  const handleSave = async () => {
    if(!namaSiswa){ alert("Isi Nama dulu Bos!"); return; }
    setSaving(true);
    localStorage.setItem("bsj_nama_siswa", namaSiswa);
    const { error } = await supabase.from("skor_siswa").insert({ nama_siswa: namaSiswa, kelas, mapel, bab_ke: babKe, nama_bab: namaBab, skor: stat.nilai, poin: stat.poin, total_soal: soalList.length, tipe: `BAB-${babKe}-30soal` });
    setSaving(false);
    if(error) alert("Gagal: "+error.message);
    else { alert(`✅ Bab ${babKe} ${namaBab} Nilai ${stat.nilai} disimpan`); window.location.href="/leaderboard"; }
  };

  if(loading) return <div className="p-10 text-center">Loading Bab {babKe}...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-4 mb-4">
        <h1 className="text-xl font-bold uppercase">{kelas} - {mapel} - BAB {babKe}: {namaBab} (30 SOAL) ULTIMATE</h1>
        <p className="text-sm">15 PG (2p) + 8 Singkat (3p) + 7 Uraian (6p) = 100 | Soal: {soalList.length}</p>
        <div className="mt-3 flex gap-2 flex-wrap">
          {Array.from({length:10},(_,i)=>i+1).map(b=>(
            <button key={b} onClick={()=>{setBabKe(b); window.history.replaceState(null,"",`?mapel=${encodeURIComponent(mapel)}&bab=${b}`)}} className={`px-3 py-1 rounded text-xs font-bold ${b===babKe?'bg-white text-orange-600':'bg-orange-300'}`}>Bab {b}</button>
          ))}
        </div>
      </div>

      <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-4 mb-6 flex justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2"><span className="font-bold">👤 Nama:</span><input value={namaSiswa} onChange={e=>setNamaSiswa(e.target.value)} placeholder="Nama siswa" className="border-2 border-orange-400 rounded-lg px-4 py-2 w-64 font-bold text-base"/></div>
        <div className="flex items-center gap-2"><span className="font-bold">Nilai: {stat.nilai}</span><button onClick={handleSave} disabled={saving} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold">💾 Simpan Bab {babKe}</button></div>
      </div>

      <div className="space-y-6">
        {soalList.map((s:any,idx:number)=>(
          <div key={s.id} className="border rounded-xl p-4 bg-white shadow-sm">
            <div className="flex gap-2 mb-2"><span className="bg-gray-900 text-white px-2 rounded text-xs">Soal {idx+1}/{soalList.length}</span><span className={`px-2 rounded text-xs font-bold ${s.tipe_soal==='pg_hots'?'bg-blue-100 text-blue-700':'bg-green-100 text-green-700'}`}>{s.tipe_soal}</span><span className="text-xs text-gray-500">{s.skor_poin}p</span></div>
            <p className="font-medium mb-3 whitespace-pre-wrap">{s.pertanyaan || s.soal || s.question || '-'}</p>
            {s.tipe_soal==='pg_hots' ? <div className="grid gap-2">{['A','B','C','D'].map(op=><button key={op} onClick={()=>setJawaban({...jawaban,[String(s.id)]:op})} className={`text-left border rounded-lg p-3 ${jawaban[String(s.id)]===op?'bg-orange-100 border-orange-500 border-2':''}`}><b>{op}.</b> {s[`opsi_${op.toLowerCase()}`] || s[`opsi${op}`] || '-'}</button>)}</div> : <textarea value={jawaban[String(s.id)]||''} onChange={e=>setJawaban({...jawaban,[String(s.id)]:e.target.value})} className="w-full border-2 rounded-lg p-3 min-h-[80px]" placeholder={s.tipe_soal==='essay_singkat'?'Jawab 1-2 kalimat':'Uraikan 3-5 kalimat'}/>}
          </div>
        ))}
      </div>

      {soalList.length===0 && <div className="p-8 bg-yellow-50 border-2 border-yellow-300 rounded-xl text-center">Belum ada soal untuk {kelas} {mapel} Bab {babKe}. Tambahkan dulu di Supabase. Kelas={kelas} Mapel={mapel} Bab={babKe}</div>}

      <div className="mt-8 bg-gray-900 text-white rounded-xl p-4 flex flex-col md:flex-row justify-between gap-2"><div className="text-sm">PG:{stat.bPG}/{stat.tPG} Singkat:{stat.bS}/{stat.tS} Uraian:{stat.bU}/{stat.tU} Nilai:{stat.nilai}</div><button onClick={handleSave} className="bg-green-500 px-6 py-2 rounded font-bold">💾 Simpan Leaderboard</button></div>
    </div>
  );
}

export default function Page(){
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <LatihanContent />
    </Suspense>
  );
}
