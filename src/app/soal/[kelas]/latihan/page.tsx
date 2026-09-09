"use client";
import { useSearchParams, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LatihanPage(){
  const params = useParams();
  const searchParams = useSearchParams();
  const kelas = (params?.kelas as string) || "sd2";
  const mapelFilter = searchParams.get("mapel"); // <-- BACA FILTER!
  const kelasId = `bsj-${kelas}`;

  const [soal,setSoal]=useState<any[]>([]);
  const [idx,setIdx]=useState(0);
  const [filter,setFilter]=useState(mapelFilter || "Semua");

  useEffect(()=>{
    (async()=>{
      let q = supabase.from("soal").select("*").ilike("kelas",`%${kelasId}%`).limit(600);
      if(mapelFilter) q = q.eq("mapel", mapelFilter);
      const {data}=await q;
      setSoal(data||[]);
    })()
  },[kelasId, mapelFilter]);

  const soalTampil = filter==="Semua"? soal : soal.filter(s=>s.mapel===filter);
  const s = soalTampil[idx];

  if(!s) return <div className="p-10 text-center font-black">Loading {filter}...</div>;

  return(
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex gap-2 flex-wrap mb-4">
        {["Semua","Pendidikan Agama & Budi Pekerti","Bahasa Indonesia","Pendidikan Pancasila","Matematika","IPAS"].map(m=>{
          const j=soal.filter(x=>m==="Semua"||x.mapel===m).length;
          return <button key={m} onClick={()=>{setFilter(m); setIdx(0)}} className={`px-3 py-1 rounded-full border-2 border-black font-bold text-xs ${filter===m?'bg-black text-white':'bg-white'}`}>{m} ({j})</button>
        })}
      </div>
      <div className="border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_black]">
        <p className="text- font-bold text-slate-500">SOAL {idx+1}/{soalTampil.length} • {s.mapel} • #{s.id}</p>
        <h2 className="font-black mt-2">{idx+1}. {s.pertanyaan || s.soal}</h2>
        <div className="mt-4 space-y-2">
          {['A','B','C','D'].map(opt=>(
            <div key={opt} className="border-2 border-slate-200 rounded-xl p-3 font-bold hover:border-black cursor-pointer">{opt}. {s[`opsi_${opt.toLowerCase()}`] || s[opt]}</div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={()=>setIdx(Math.max(0,idx-1))} className="px-4 py-2 bg-slate-100 border-2 border-black rounded-full font-black">← Prev</button>
          <button onClick={()=>setIdx(Math.min(soalTampil.length-1,idx+1))} className="px-4 py-2 bg-black text-white border-2 border-black rounded-full font-black">Next →</button>
        </div>
      </div>
    </div>
  )
}