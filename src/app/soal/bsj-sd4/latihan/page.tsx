"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function LatihanContent(){
  const searchParams = useSearchParams();
  const mapel = searchParams.get("mapel") || "Matematika";
  const bab = parseInt(searchParams.get("bab") || "1",10);
  const kelas = "bsj-sd4";

  const [soal,setSoal]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [debug,setDebug]=useState("");

  useEffect(()=>{
    const fetchSoal = async()=>{
      setLoading(true);
      const formats = ["bsj-sd1","sd1","SD1","bsj_sd1"];
      let found:any[] = [];
      let q = "";
      for(const fmt of formats){
        const { data } = await supabase.from("soal").select("*").eq("kelas", fmt).eq("mapel", mapel).eq("bab_ke", bab);
        q = `SELECT * FROM soal WHERE kelas='${fmt}' AND mapel='${mapel}' AND bab_ke=${bab}`;
        if(data && data.length>0){ found=data; break; }
        const { data: data2 } = await supabase.from("soal").select("*").ilike("kelas", `%${fmt}%`).eq("mapel", mapel).eq("bab_ke", bab);
        if(data2 && data2.length>0){ found=data2; q += " (ILIKE)"; break; }
      }
      if(found.length===0){
        const { data: data3 } = await supabase.from("soal").select("*").eq("mapel", mapel).eq("bab_ke", bab).limit(5);
        if(data3 && data3.length>0){
          setDebug(`Kelas format di DB beda. Contoh: ${JSON.stringify(data3[0]).slice(0,200)} | Query: ${q}`);
        } else {
          setDebug(`0 SOAL - Query: ${q} | Cek Supabase: SELECT * FROM soal WHERE kelas ILIKE '%sd1%' LIMIT 5`);
        }
      }
      setSoal(found);
      setLoading(false);
    };
    fetchSoal();
  },[mapel,bab]);

  if(loading) return <div className="p-10 text-center">Loading soal {kelas} - {mapel} BAB {bab}...</div>;

  if(soal.length===0){
    return (
      <div className="max-w-2xl mx-auto p-5">
        <a href="/soal/bsj-sd4" className="text-[12px]">← Kembali ke Dashboard BSJ-SD4 - 30 BAB</a>
        <div className="mt-4 border rounded-xl p-4 bg-[#FFF7ED]">
          <div className="font-black text-red-600 text-center">0 SOAL - Debug Info:</div>
          <div className="mt-3 bg-white p-3 rounded text-[11px] font-mono whitespace-pre-wrap">{debug}
Kelas: bsj-sd1 (FIX: coba format sd1, SD1, bsj-sd1, bsj_sd1)
Mapel: {mapel}
BAB: {bab}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <a href="/soal/bsj-sd4" className="text-[12px] font-bold">← Kembali ke Dashboard BSJ-SD4 - 30 BAB</a>
      <div className="mt-4 border rounded-xl p-4 bg-white">
        <h1 className="font-black">BSJ-SD4 - {mapel} BAB {bab} - {soal.length} SOAL</h1>
        <div className="text-[11px] opacity-60">Mapel: {mapel} | BAB {bab} | Kelas: bsj-sd1</div>
      </div>
      <div className="mt-4 space-y-3">
        {soal.map((s,i)=><div key={s.id||i} className="border rounded-xl p-4 bg-white"><div className="font-bold text-[13px]">{i+1}. {s.soal||s.pertanyaan}</div></div>)}
      </div>
    </div>
  );
}

export default function LatihanPage(){
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading latihan...</div>}>
      <LatihanContent/>
    </Suspense>
  );
}
