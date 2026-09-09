"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";

const warnaBg: any = {
  "Bahasa Indonesia": "bg-[#d4f8d4]",
  "IPAS": "bg-[#dbeafe]",
  "Matematika": "bg-[#fef9c3]",
  "Pendidikan Agama & Budi Pekerti": "bg-[#fce7f3]",
  "PAI & Budi Pekerti": "bg-[#fce7f3]",
  "Pendidikan Pancasila": "bg-[#ffedd5]",
  "Pancasila": "bg-[#ffedd5]",
};

export default function LatihanPage(){
  const params = useParams();
  const searchParams = useSearchParams();
  const kelasParam = (params?.kelas as string) || "sd2";
  const mapelParam = searchParams.get("mapel");
  const kelasId = `bsj-${kelasParam}`;
  const [soalList,setSoalList]=useState<any[]>([]);
  const [idx,setIdx]=useState(0);
  const [jawaban,setJawaban]=useState<Record<number,string>>({});
  const [selected,setSelected]=useState("");
  const [selesai,setSelesai]=useState(false);
  const [loading,setLoading]=useState(true);

  const bgPage = warnaBg[mapelParam||""] || "bg-[#fffaf0]";

  useEffect(()=>{ (async()=>{
    setLoading(true);
    let q = supabase.from("soal").select("*").ilike("kelas",`%${kelasId}%`).limit(1000);
    if(mapelParam) q = q.eq("mapel", mapelParam);
    const {data}=await q;
    setSoalList(data||[]); setLoading(false);
  })()},[kelasId,mapelParam]);

  useEffect(()=>{setSelected(jawaban[idx]||"")},[idx,jawaban]);

  if(loading) return <div className={`min-h-screen flex items-center justify-center font-black ${bgPage}`}>Loading {mapelParam}...</div>;

  if(selesai){
    let benar=0; soalList.forEach((s,i)=>{const k=(s.kunci_jawaban||s.kunci||"").toUpperCase(); if(jawaban[i]===k) benar++;});
    const nilai=Math.round(benar/soalList.length*100);
    return(
      <div className={`min-h-screen p-4 ${bgPage}`}>
        <div className="max-w-3xl mx-auto bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_black] p-6 text-center">
          <h1 className="text-3xl font-black">🏆 Nilai: {nilai}</h1>
          <p className="font-bold">{benar}/{soalList.length} benar • {mapelParam}</p>
          <Link href={`/soal/${kelasParam}`} className="mt-4 inline-block bg-black text-white px-6 py-2 rounded-full font-black">← Dashboard</Link>
        </div>
        <div className="max-w-3xl mx-auto mt-4 space-y-2">
          {soalList.map((s,i)=>{
            const k=(s.kunci_jawaban||s.kunci||"").toUpperCase(); const u=jawaban[i]||"-";
            return <div key={i} className="bg-white border-2 border-black rounded-xl p-4"><p className="font-bold text-sm">{i+1}. {s.pertanyaan} {u===k?'✅':'❌'}</p><p className="text-xs">Jawab: {u} | Kunci: {k}</p><p className="text-xs text-slate-600">Penjelasan: {s.penjelasan||"Sudah sesuai kunci."}</p></div>
          })}
        </div>
      </div>
    )
  }

  const s=soalList[idx]; if(!s) return <div className={`p-10 text-center ${bgPage}`}><Link href={`/soal/${kelasParam}`} className="bg-black text-white px-6 py-2 rounded-full font-black">← Dashboard</Link></div>;

  return(
    <div className={`min-h-screen p-4 ${bgPage}`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Link href={`/soal/${kelasParam}`} className="bg-white border-2 border-black px-4 py-2 rounded-full font-black text-sm shadow-[3px_3px_0px_black]">← Dashboard {kelasParam.toUpperCase()}</Link>
          <div className="bg-black text-white px-4 py-1.5 rounded-full text- font-black border-2 border-black">{mapelParam} • {idx+1}/{soalList.length}</div>
        </div>
        <div className="bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_black] p-5">
          <p className="text- font-bold text-slate-500">SOAL {idx+1}/{soalList.length} • {s.mapel}</p>
          <h2 className="font-black text- mt-2">{idx+1}. {s.pertanyaan||s.soal}</h2>
          <div className="mt-4 space-y-2">
            {['A','B','C','D'].map(op=>{
              const val=s[`opsi_${op.toLowerCase()}`]||s[op]||""; const sel=selected===op;
              return <button key={op} onClick={()=>{setSelected(op); setJawaban(p=>({...p,[idx]:op}))}} className={`w-full text-left border-2 rounded-xl p-3 font-bold ${sel?'bg-black text-white border-black':'bg-white border-slate-200 hover:border-black'}`}>{op}. {val}</button>
            })}
          </div>
          <div className="mt-5 flex justify-between">
            <button onClick={()=>setIdx(Math.max(0,idx-1))} className="px-5 py-2 bg-white border-2 border-black rounded-full font-black text-sm">← Prev</button>
            <button onClick={()=> idx===soalList.length-1? setSelesai(true):setIdx(idx+1)} disabled={!selected} className={`px-6 py-2 border-2 border-black rounded-full font-black text-sm ${!selected?'bg-slate-200':'bg-black text-white'}`}>{idx===soalList.length-1?'Selesai 🏆':'Next →'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}