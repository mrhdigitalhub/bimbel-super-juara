"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

const MAPELS = ["Bahasa Indonesia","IPAS","Matematika","Pendidikan Agama & Budi Pekerti","Pendidikan Pancasila"];

export default function LatihanPage(){
  const params = useParams();
  const searchParams = useSearchParams();
  const kelasParam = (params?.kelas as string) || "sd2";
  const mapelParam = searchParams.get("mapel") || "Bahasa Indonesia";
  const kelasId = `bsj-${kelasParam}`;

  const [soalList,setSoalList]=useState<any[]>([]);
  const [idx,setIdx]=useState(0);
  const [filter,setFilter]=useState(mapelParam);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{ setFilter(mapelParam) },[mapelParam]);

  useEffect(()=>{
    async function load(){
      setLoading(true);
      const { data } = await supabase.from("soal").select("*").ilike("kelas",`%${kelasId}%`).limit(1000);
      setSoalList(data||[]);
      setLoading(false);
    }
    load();
  },[kelasId]);

  const counts:any={ Semua: soalList.length };
  MAPELS.forEach(m=> counts[m]=soalList.filter(s=>s.mapel===m).length);
  const filtered = filter==="Semua"? soalList : soalList.filter(s=>s.mapel===filter);
  const s = filtered[idx];

  if(loading) return <div className="min-h-screen flex items-center justify-center font-black">Loading {filter}...</div>;
  if(!s) return <div className="p-10 text-center"><p className="font-black">Soal {filter} belum ada</p><Link href={`/soal/${kelasParam}`} className="mt-4 inline-block bg-black text-white px-6 py-2 rounded-full font-black">← Kembali ke Dashboard</Link></div>;

  return(
    <div className="min-h-screen bg-[#fffaf0] p-4">
      <div className="max-w-3xl mx-auto">
        {/* HEADER + TOMBOL KEMBALI JUARA */}
        <div className="flex justify-between items-center mb-4">
          <Link href={`/soal/${kelasParam}`} className="bg-white border-2 border-black px-4 py-2 rounded-full font-black text-sm shadow-[3px_3px_0px_black] hover:translate-y-[-1px]">
            ← Dashboard {kelasParam.toUpperCase()}
          </Link>
          <div className="bg-green-600 text-white px-4 py-1.5 rounded-full text- font-black border-2 border-black">
            {filtered.length} SOAL
          </div>
        </div>

        {/* PILIH MAPEL */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={()=>{setFilter("Semua");setIdx(0)}} className={`px-3 py-1.5 rounded-full border-2 border-black font-bold text-xs ${filter==="Semua"?"bg-black text-white":"bg-white"}`}>Semua ({counts.Semua})</button>
          {MAPELS.map(m=>(
            <button key={m} onClick={()=>{setFilter(m);setIdx(0)}} className={`px-3 py-1.5 rounded-full border-2 border-black font-bold text-xs ${filter===m?"bg-black text-white":"bg-white"}`}>{m} ({counts[m]||0})</button>
          ))}
        </div>

        {/* CARD SOAL */}
        <div className="bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_black] p-5">
          <p className="text- font-bold text-slate-500">SOAL {idx+1}/{filtered.length} • {s.mapel} • #{String(s.id).slice(0,8)}</p>
          <h2 className="font-black text- mt-2 leading-snug">{idx+1}. {s.pertanyaan || s.soal}</h2>

          <div className="mt-4 space-y-2">
            {['A','B','C','D'].map(op=>{
              const val = s[`opsi_${op.toLowerCase()}`] || s[op] || s[`opsi_${op}`];
              return <button key={op} className="w-full text-left border-2 border-slate-200 rounded-xl p-3 font-bold hover:border-black hover:bg-slate-50 transition">{op}. {val}</button>
            })}
          </div>

          <div className="mt-5 flex justify-between items-center">
            <div className="flex gap-2">
              <button onClick={()=>setIdx(Math.max(0,idx-1))} className="px-5 py-2 bg-white border-2 border-black rounded-full font-black text-sm">← Prev</button>
              <button onClick={()=>setIdx(Math.min(filtered.length-1,idx+1))} className="px-5 py-2 bg-black text-white border-2 border-black rounded-full font-black text-sm">Next →</button>
            </div>
            <Link href={`/soal/${kelasParam}`} className="text- font-black underline">Ganti Mapel</Link>
          </div>
        </div>

        <p className="text-center text- text-slate-400 mt-4 font-bold">Tip: Klik Dashboard untuk kembali pilih mapel pastel 🟢🟡🔵🟠🩷</p>
      </div>
    </div>
  )
}