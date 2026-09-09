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

export default function LatihanPage(){
  const params = useParams();
  const searchParams = useSearchParams();
  const kelasParam = (params?.kelas as string) || "sd2";
  const mapelParam = searchParams.get("mapel") || "IPAS";
  const kelasId = `bsj-${kelasParam}`;

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

  useEffect(()=>{ setSelected(jawaban[idx]||"") },[idx,jawaban]);

  const getKunci = (s:any)=> (s.kunci_jawaban||s.kunci||s.jawaban_benar||"").toString().toUpperCase().trim();

  const hitungBatch = (start:number,end:number)=>{
    let benar=0;
    for(let i=start;i<end;i++){ if(jawaban[i]===getKunci(soalList[i])) benar++; }
    return { benar, total: end-start, nilai: Math.round(benar/(end-start)*100) };
  };

  const hitungTotal = ()=>{
    let benar=0;
    soalList.forEach((s,i)=>{ if(jawaban[i]===getKunci(s)) benar++; });
    return { benar, total: soalList.length, nilai: soalList.length? Math.round(benar/soalList.length*100):0 };
  };

  if(loading) return <div className="min-h-screen bg-[#fffaf0] flex items-center justify-center font-black">Loading {mapelParam}...</div>;

  // MODE BATCH RESULT - Tiap 20 Soal
  if(mode==="batch"){
    const batchNum = Math.floor(idx/BATCH);
    const start = batchNum*BATCH;
    const end = Math.min(start+BATCH, soalList.length);
    const { benar, total, nilai } = hitungBatch(start,end);
    const isLastBatch = end===soalList.length;

    return(
      <div className="min-h-screen bg-[#fffaf0] p-4">
        <div className="max-w-3xl mx-auto">
          <div className={`border-2 border-black rounded-2xl shadow-[4px_4px_0px_black] p-6 text-center ${bgKotak}`}>
            <h1 className="text-2xl font-black">📝 Hasil Soal {start+1}-{end}</h1>
            <p className="text-5xl font-black mt-2">{nilai}</p>
            <p className="font-bold">{benar} benar dari {total} soal • {mapelParam}</p>
            <p className="text- mt-1">Batch {batchNum+1} dari {Math.ceil(soalList.length/BATCH)}</p>
          </div>

          <div className="mt-6 space-y-3">
            {soalList.slice(start,end).map((s,i)=>{
              const realIdx = start+i;
              const k = getKunci(s);
              const u = jawaban[realIdx]||"-";
              const ok = u===k;
              return(
                <div key={realIdx} className={`bg-white border-2 border-black rounded-xl p-4 ${ok?'bg-green-50':''}`}>
                  <p className="font-bold text-sm">{realIdx+1}. {s.pertanyaan||s.soal} <span className={`ml-2 px-2 py-0.5 rounded-full text- text-white ${ok?'bg-green-600':'bg-red-600'}`}>{ok?'BENAR':'SALAH'}</span></p>
                  <p className="text-xs mt-1">Jawabanmu: <b>{u}</b> | Kunci: <b className="text-green-700">{k}</b></p>
                  <p className="text-xs mt-1 text-slate-700"><b>Penjelasan:</b> {s.penjelasan||s.pembahasan||"Sesuai kunci jawaban."}</p>
                </div>
              )
            })}
          </div>

          <div className="flex gap-2 justify-center mt-6">
            {isLastBatch? (
              <button onClick={()=>setMode("final")} className="bg-black text-white border-2 border-black px-8 py-3 rounded-full font-black">Lihat Summary Akhir 🏆</button>
            ) : (
              <button onClick={()=>{ setIdx(end); setMode("soal"); }} className="bg-black text-white border-2 border-black px-8 py-3 rounded-full font-black">Lanjut Soal {end+1}-{Math.min(end+BATCH,soalList.length)} →</button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // MODE FINAL - Cuma Summary Score
  if(mode==="final"){
    const { benar, total, nilai } = hitungTotal();
    const jumlahBatch = Math.ceil(total/BATCH);
    return(
      <div className="min-h-screen bg-[#fffaf0] p-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_black] p-8 text-center">
            <h1 className="text-3xl font-black">🏆 SUMMARY AKHIR</h1>
            <p className="font-bold text-slate-600">{mapelParam} • Kelas {kelasParam.toUpperCase()} • {total} Soal</p>
            <p className="text-6xl font-black mt-4">{nilai}</p>
            <p className="font-black text-xl mt-2">{benar}/{total} Benar</p>
            <div className="grid grid-cols-3 gap-2 mt-6">
              {Array.from({length:jumlahBatch}).map((_,b)=>{
                const st=b*BATCH; const en=Math.min(st+BATCH,total); const hb=hitungBatch(st,en);
                return <div key={b} className={`border-2 border-black rounded-xl p-2 ${bgKotak}`}><p className="text- font-bold">{st+1}-{en}</p><p className="font-black">{hb.nilai}</p></div>
              })}
            </div>
            <div className="flex gap-2 justify-center mt-6">
              <Link href={`/soal/${kelasParam}`} className="bg-white border-2 border-black px-6 py-2 rounded-full font-black">← Dashboard</Link>
              <button onClick={()=>{setIdx(0);setJawaban({});setMode("soal");}} className="bg-black text-white border-2 border-black px-6 py-2 rounded-full font-black">Ulangi Latihan</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // MODE SOAL
  const s = soalList[idx];
  if(!s) return <div className="min-h-screen bg-[#fffaf0] p-10 text-center"><Link href={`/soal/${kelasParam}`} className="bg-black text-white px-6 py-2 rounded-full font-black">← Dashboard</Link></div>;

  const batchKe = Math.floor(idx/BATCH)+1;
  const totalBatch = Math.ceil(soalList.length/BATCH);
  const sisaDiBatch = BATCH - (idx % BATCH);

  return(
    <div className="min-h-screen bg-[#fffaf0] p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Link href={`/soal/${kelasParam}`} className="bg-white border-2 border-black px-4 py-2 rounded-full font-black text-sm shadow-[3px_3px_0px_black]">← Dashboard {kelasParam.toUpperCase()}</Link>
          <div className="bg-black text-white px-4 py-1.5 rounded-full text- font-black border-2 border-black">
            {mapelParam} • {idx+1}/{soalList.length} • Batch {batchKe}/{totalBatch}
          </div>
        </div>

        <div className={`rounded-2xl border-2 border-black shadow-[4px_4px_0px_black] p-5 ${bgKotak}`}>
          <p className="text- font-bold text-slate-600">SOAL {idx+1}/{soalList.length} • Sisa {sisaDiBatch} lagi menuju pembahasan</p>
          <h2 className="font-black text- mt-2">{idx+1}. {s.pertanyaan||s.soal}</h2>
          <div className="mt-4 space-y-2">
            {['A','B','C','D'].map(op=>{
              const val = s[`opsi_${op.toLowerCase()}`]||s[op]||"";
              const sel = selected===op;
              return <button key={op} onClick={()=>{setSelected(op);setJawaban(p=>({...p,[idx]:op}))}} className={`w-full text-left border-2 rounded-xl p-3 font-bold ${sel?'bg-black text-white border-black':'bg-white border-slate-200 hover:border-black'}`}>{op}. {val}</button>
            })}
          </div>
          <div className="mt-5 flex justify-between">
            <button onClick={()=>setIdx(Math.max(0,idx-1))} className="px-5 py-2 bg-white border-2 border-black rounded-full font-black text-sm">← Prev</button>
            <button onClick={()=>{
              if((idx+1)%BATCH===0 || idx===soalList.length-1){ setMode("batch"); }
              else setIdx(idx+1);
            }} disabled={!selected} className={`px-6 py-2 border-2 border-black rounded-full font-black text-sm ${!selected?'bg-slate-200 text-slate-400':'bg-black text-white'}`}>
              {(idx+1)%BATCH===0 || idx===soalList.length-1? `Lihat Hasil ${idx+1-(idx%BATCH)}-${idx+1} 📝` : 'Next →'}
            </button>
          </div>
        </div>
        <p className="text-center text- mt-3 font-bold text-slate-500">Pembahasan muncul setiap {BATCH} soal • Total {soalList.length} soal {mapelParam}</p>
      </div>
    </div>
  )
}