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
  const mapelParam = searchParams.get("mapel"); // mis: IPAS

  const kelasId = `bsj-${kelasParam}`;
  const [soalList,setSoalList]=useState<any[]>([]);
  const [idx,setIdx]=useState(0);
  const [jawaban,setJawaban]=useState<Record<number,string>>({});
  const [selected,setSelected]=useState<string>("");
  const [selesai,setSelesai]=useState(false);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    async function load(){
      setLoading(true);
      let q = supabase.from("soal").select("*").ilike("kelas",`%${kelasId}%`).limit(1000);
      if(mapelParam) q = q.eq("mapel", mapelParam);
      const { data } = await q;
      setSoalList(data||[]);
      setLoading(false);
    }
    load();
  },[kelasId, mapelParam]);

  useEffect(()=>{
    setSelected(jawaban[idx]||"");
  },[idx, jawaban]);

  if(loading) return <div className="min-h-screen flex items-center justify-center font-black">Loading {mapelParam||"Soal"}...</div>;

  // HITUNG SCORE
  const hitungScore = () => {
    let benar = 0;
    soalList.forEach((s,i)=>{
      const kunci = (s.kunci_jawaban || s.kunci || s.jawaban_benar || "").toUpperCase().trim();
      if(jawaban[i] && jawaban[i]===kunci) benar++;
    });
    return { benar, total: soalList.length, nilai: Math.round(benar/soalList.length*100) };
  };

  if(selesai){
    const { benar, total, nilai } = hitungScore();
    return(
      <div className="min-h-screen bg-[#fffaf0] p-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_black] p-6 text-center">
            <h1 className="text-3xl font-black">🏆 Nilai Kamu: {nilai}</h1>
            <p className="font-bold mt-2">{benar} benar dari {total} soal • {mapelParam}</p>
            <div className="flex gap-2 justify-center mt-4">
              <Link href={`/soal/${kelasParam}`} className="bg-white border-2 border-black px-6 py-2 rounded-full font-black">← Dashboard {kelasParam.toUpperCase()}</Link>
              <button onClick={()=>{setSelesai(false);setIdx(0);setJawaban({})}} className="bg-black text-white border-2 border-black px-6 py-2 rounded-full font-black">Ulangi</button>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {soalList.map((s,i)=>{
              const kunci = (s.kunci_jawaban || s.kunci || s.jawaban_benar || "").toUpperCase().trim();
              const userJwb = jawaban[i]||"-";
              const isBenar = userJwb===kunci;
              return(
                <div key={i} className={`bg-white border-2 border-black rounded-xl p-4 ${isBenar?'border-green-600':''}`}>
                  <p className="font-bold text-sm">{i+1}. {s.pertanyaan || s.soal} <span className={`ml-2 px-2 py-1 rounded-full text- ${isBenar?'bg-green-600 text-white':'bg-red-600 text-white'}`}>{isBenar?'BENAR':'SALAH'}</span></p>
                  <p className="text-xs mt-1">Jawabanmu: <b>{userJwb}</b> | Kunci: <b className="text-green-700">{kunci}</b></p>
                  <p className="text-xs mt-1 text-slate-600"><b>Penjelasan:</b> {s.penjelasan || s.pembahasan || "Pembahasan belum tersedia, kunci jawaban sudah sesuai."}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const s = soalList[idx];
  if(!s) return <div className="p-10 text-center"><Link href={`/soal/${kelasParam}`} className="bg-black text-white px-6 py-2 rounded-full font-black">← Kembali Dashboard</Link></div>;

  const pilihJawaban = (opsi:string) => {
    setSelected(opsi);
    setJawaban(prev=>({...prev, [idx]:opsi}));
  };

  const next = () => {
    if(idx===soalList.length-1) setSelesai(true);
    else setIdx(idx+1);
  };

  return(
    <div className="min-h-screen bg-[#fffaf0] p-4">
      <div className="max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <Link href={`/soal/${kelasParam}`} className="bg-white border-2 border-black px-4 py-2 rounded-full font-black text-sm shadow-[3px_3px_0px_black]">
            ← Dashboard {kelasParam.toUpperCase()}
          </Link>
          <div className="bg-green-600 text-white px-4 py-1.5 rounded-full text- font-black border-2 border-black">
            {mapelParam? `${mapelParam} • `:''}{idx+1}/{soalList.length}
          </div>
        </div>

        {/* FIX #2: Kalau datang dari Dashboard dengan?mapel=, SEMBUNYIKAN filter lain */}
        {!mapelParam && (
          <div className="flex flex-wrap gap-2 mb-4">
            {MAPELS.map(m=>{
              const c = soalList.filter(x=>x.mapel===m).length;
              return <Link key={m} href={`/soal/${kelasParam}/latihan?mapel=${encodeURIComponent(m)}`} className="px-3 py-1.5 rounded-full border-2 border-black font-bold text-xs bg-white hover:bg-black hover:text-white">{m} ({c})</Link>
            })}
          </div>
        )}

        {/* CARD SOAL */}
        <div className="bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_black] p-5">
          <p className="text- font-bold text-slate-500">SOAL {idx+1}/{soalList.length} • {s.mapel} • #{String(s.id).slice(0,8)}</p>
          <h2 className="font-black text- mt-2">{idx+1}. {s.pertanyaan || s.soal}</h2>

          <div className="mt-4 space-y-2">
            {['A','B','C','D'].map(op=>{
              const val = s[`opsi_${op.toLowerCase()}`] || s[op] || "";
              const isSelected = selected===op;
              return(
                <button key={op} onClick={()=>pilihJawaban(op)}
                  className={`w-full text-left border-2 rounded-xl p-3 font-bold transition ${isSelected?'bg-black text-white border-black':'bg-white border-slate-200 hover:border-black'}`}>
                  {op}. {val}
                </button>
              )
            })}
          </div>

          <div className="mt-5 flex justify-between items-center">
            <button onClick={()=>setIdx(Math.max(0,idx-1))} className="px-5 py-2 bg-white border-2 border-black rounded-full font-black text-sm">← Prev</button>
            <button onClick={next} disabled={!selected} className={`px-6 py-2 border-2 border-black rounded-full font-black text-sm ${!selected?'bg-slate-200 text-slate-400':'bg-black text-white'}`}>
              {idx===soalList.length-1? 'Selesai & Lihat Nilai 🏆' : 'Next →'}
            </button>
          </div>
        </div>

        {mapelParam && <div className="text-center mt-3"><Link href={`/soal/${kelasParam}`} className="text- font-black underline">Ganti Mapel di Dashboard</Link></div>}
      </div>
    </div>
  )
}