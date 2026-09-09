"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useParams } from "next/navigation";

const META: any = {
  "Bahasa Indonesia": { icon:"📖", bg:"#E8F5E9", badge:"#16a34a", short:"Bahasa Indonesia" },
  "IPAS": { icon:"🔬", bg:"#E3F2FD", badge:"#2563eb", short:"IPAS" },
  "Matematika": { icon:"🔢", bg:"#FFF9C4", badge:"#eab308", short:"Matematika" },
  "Pendidikan Agama & Budi Pekerti": { icon:"🕌", bg:"#FCE4EC", badge:"#ec4899", short:"PAI & Budi Pekerti" },
  "Pendidikan Pancasila": { icon:"🇮🇩", bg:"#FFF3E0", badge:"#f97316", short:"Pancasila" },
};

export default function DashboardKelasPage(){
  const params = useParams();
  const kelasParam = (params?.kelas as string) || "sd1";
  const kelasId = `bsj-${kelasParam}`;
  const [list,setList]=useState<any[]>([]);
  const [load,setLoad]=useState(true);
  useEffect(()=>{ (async()=>{ const {data}=await supabase.from("soal").select("mapel,is_free").ilike("kelas",`%${kelasId}%`).limit(1000); setList(data||[]); setLoad(false); })() },[kelasId]);
  if(load) return <div className="p-10 text-center font-black">Loading {kelasParam.toUpperCase()}...</div>;
  const premium=list.filter((s:any)=>!s.is_free);

  return(
    <div className="max-w-6xl mx-auto p-4 pb-12 bg-white min-h-screen">
      <div className="flex gap-3 items-center">
        <img src="/mrh-logo.png" className="h-10"/>
        <div><h1 className="text-2xl font-black text-green-700">DASHBOARD {kelasParam.toUpperCase()}</h1><p className="text-xs font-bold text-slate-500">600 Soal Premium • 5 Mapel @120</p></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        {Object.keys(META).map(m=>{
          const meta=META[m];
          const jml=premium.filter((s:any)=>s.mapel===m).length||120;
          return(
            <Link key={m} href={`/soal/${kelasParam}/latihan?mapel=${encodeURIComponent(m)}`} className="block border- border-black rounded- p-5 shadow-[5px_5px_0px_black] hover:translate-y-[-2px] transition-all" style={{background:meta.bg}}>
              <div className="flex justify-between"><div className="w-12 h-12 bg-white border-2 border-black rounded-xl flex items-center justify-center text-2xl shadow-[2px_2px_0px_black]">{meta.icon}</div><span className="text-white font-black text- px-3 py-1 rounded-full border-2 border-black" style={{background:meta.badge}}>{jml} SOAL</span></div>
              <h3 className="font-black text- mt-4">{meta.short}</h3>
              <p className="text- font-bold text-slate-600">✅ HOTS • ✅ Kunci • ✅ Pembahasan</p>
              <div className="mt-3 text- font-black bg-black text-white inline-block px-3 py-1 rounded-full">▶️ Klik untuk Latihan</div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}