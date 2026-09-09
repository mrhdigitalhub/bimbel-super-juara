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

const BATCH = 20;

function cleanText(t: string) {
  if (!t) return "";
  return t
   .replace(/Pertanyaan ke-\d+\s*/gi, "")
   .replace(/\[BSJ-[^\]]+\]:?\s*/gi, "")
   .replace(/\[BSJ-[^\]]+\]/g, "")
   .replace(/\(Skenario HOTS[^)]+\)/gi, "")
   .replace(/\s*#\d+\s*$/g, "")
   .replace(/^\d+\.\s*/, "")
   .trim();
}

export default function LatihanPage(){
  const params = useParams();
  const searchParams = useSearchParams();
  const kelasParam = (params?.kelas as string) || "sd2";
  const mapelParam = searchParams.get("mapel") || "IPAS";
  // FIX UTAMA: jangan jadi bsj-bsj-sd2
  const kelasId = kelasParam.startsWith("bsj-")? kelasParam : kelasParam;

  const [soalList,setSoalList]=useState<any[]>([]);
  const [idx,setIdx]=useState(0);
  const [jawaban,setJawaban]=useState<Record<number,string>>({});
  const [selected,setSelected]=useState("");
  const [mode,setMode]=useState<"soal"|"batch"|"final">("soal");
  const [loading,setLoading]=useState(true);

  const bgKotak = warnaBg[mapelParam] || "bg-white";

  useEffect(()=>{
    (async()=>{
      setLoading(true);
      let q = supabase.from("soal").select("*").eq("kelas", kelasId).limit(1000);
      if(mapelParam) q = q.eq("mapel", mapelParam);
      const { data } = await q;
      setSoalList(data||[]);
      setLoading(false);
    })();
  },[kelasId,mapelParam]);

  useEffect(()=>{ setSelected(jawaban[idx]||""); },[idx,jawaban]);

  const getKunci = (s:any)=> (s.kunci_jawaban||s.kunci||s.jawaban_benar||"").toString().toUpperCase().trim();

  const hitungBatch = (start:number,end:number)=>{
    let benar=0;
    for(let i=start;i<end;i++){
      if(jawaban[i] && jawaban[i]===getKunci(soalList[i])) benar++;
    }
    return benar;
  }

  if(loading) return <div className="p-10 text-center">Loading {mapelParam} {kelasId}...</div>;
  if(!soalList.length) return (
    <div className="p-10 text-center">
      <Link href={`/soal/${kelasParam}`} className="bg-black text-white px-6 py-2 rounded-full">← Dashboard</Link>
      <p className="mt-6">Soal tidak ditemukan untuk kelas={kelasId} mapel={mapelParam}. Cek Supabase!</p>
    </div>
  );

  const s = soalList[idx];
  const batchStart = Math.floor(idx/BATCH)*BATCH;
  const batchEnd = Math.min(batchStart+BATCH, soalList.length);
  const sisaMenujuPembahasan = batchEnd - (idx+1);

  return (
    <div className="min-h-screen bg-[#fefce8] p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Link href={`/soal/${kelasParam}`} className="bg-black text-white px-4 py-1.5 rounded-full text-sm font-bold">← Dashboard {kelasParam.toUpperCase()}</Link>
          <div className="bg-black text-white px-4 py-1.5 rounded-full text-sm font-bold">{mapelParam} • {idx+1}/{soalList.length} • Batch {Math.floor(idx/BATCH)+1}/{Math.ceil(soalList.length/BATCH)}</div>
        </div>

        {mode==="soal" && (
          <div className={`border-2 border-black rounded-2xl p-5 ${bgKotak} shadow-[4px_4px_0px_0px_black]`}>
            <p className="text-xs font-bold mb-2">SOAL {idx+1}/{soalList.length} • Sisa {sisaMenujuPembahasan} lagi menuju pembahasan</p>
            <h2 className="font-bold mb-4">{idx+1}. {cleanText(s.pertanyaan)}</h2>

            {["A","B","C","D"].map((k)=>{
              const opsi = cleanText(s[`opsi_${k.toLowerCase()}`]||"");
              const isSelected = selected===k;
              return (
                <button key={k} onClick={()=>{setSelected(k); setJawaban({...jawaban,[idx]:k})}}
                  className={`w-full text-left border-2 border-black rounded-xl p-3 mb-2 bg-white ${isSelected?"bg-yellow-200":""}`}>
                  <b>{k}.</b> {opsi}
                </button>
              )
            })}

            <div className="flex justify-between mt-4">
              <button disabled={idx===0} onClick={()=>setIdx(idx-1)} className="border-2 border-black rounded-full px-4 py-1 bg-white disabled:opacity-30">← Prev</button>
              <button onClick={()=>{
                if(idx+1===batchEnd) setMode("batch");
                else setIdx(idx+1);
              }} className="border-2 border-black rounded-full px-4 py-1 bg-white">Next →</button>
            </div>
          </div>
        )}

        {mode==="batch" && (
          <div className="border-2 border-black rounded-2xl p-6 bg-white text-center">
            <h2 className="text-xl font-bold">Batch {Math.floor(idx/BATCH)+1} Selesai!</h2>
            <p className="my-2">Benar {hitungBatch(batchStart,batchEnd)} dari {batchEnd-batchStart} soal</p>
            <button onClick={()=>{setMode("soal"); setIdx(batchEnd)}} className="bg-black text-white px-6 py-2 rounded-full mr-2">Lanjut Batch Berikutnya</button>
            <button onClick={()=>setMode("soal")} className="border-2 border-black px-6 py-2 rounded-full">Ulangi Batch</button>
          </div>
        )}

        <p className="text-center text-xs mt-4 text-gray-600">Pembahasan muncul setiap {BATCH} soal • Total {soalList.length} soal {mapelParam}</p>
      </div>
    </div>
  )
}