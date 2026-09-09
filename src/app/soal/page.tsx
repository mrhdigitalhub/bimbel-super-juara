"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DashboardKelasPage() {
  const params = useParams();
  const kelasParam = params.kelas as string; // sd2
  const kelasId = `bsj-${kelasParam}`; // bsj-sd2
  const [soalList, setSoalList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
       .from("soal")
       .select("mapel, is_free")
       .ilike("kelas", `%${kelasId}%`);

      setSoalList(data || []);
      setLoading(false);
    }
    load();
  }, [kelasId]);

  if (loading) return <div className="p-10 text-center font-black">Loading {kelasParam.toUpperCase()} - 600 Soal...</div>;

  const premium = soalList.filter(s =>!s.is_free);
  const free = soalList.filter(s => s.is_free);
  const mapels = [...new Set(premium.map(s => s.mapel))].sort();
  const totalPremium = premium.length;

  return (
    <div className="max-w-5xl mx-auto p-4 pb-10">
      <Link href="/soal" className="text-sm font-bold">← Kembali ke Daftar Kelas</Link>

      <h1 className="text-3xl font-black mt-4">DASHBOARD {kelasParam.toUpperCase()}</h1>
      <p className="font-bold text-slate-600">{totalPremium} Soal Premium Siap Latihan • {mapels.length} Mapel • {free.length} FREE</p>

      {/* PROGRESS */}
      <div className="bg-white border-2 border-black rounded-2xl p-4 mt-6 shadow-[4px_4px_0px_black]">
        <div className="flex justify-between font-black text-sm"><span>PROGRESS BELAJAR</span><span>41%</span></div>
        <div className="w-full h-3 bg-slate-200 rounded-full mt-2"><div className="h-3 bg-green-500 rounded-full w-[41%]"></div></div>
      </div>

      {/* 6 MAPEL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
        {mapels.map(m => {
          const jml = premium.filter(s => s.mapel === m).length;
          return (
            <div key={m} className="bg-white border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_black]">
              <div className="flex justify-between items-start">
                <span className="text-3xl">📘</span>
                <span className="text- font-black px-2 py-1 rounded-full bg-black text-white">{jml} SOAL</span>
              </div>
              <h3 className="font-black text-lg mt-2">{m}</h3>
              <p className="text-xs text-slate-500">{jml} Soal HOTS • Kunci + Pembahasan</p>
              <div className="w-full h-2 bg-slate-100 rounded-full mt-3"><div className="h-2 bg-blue-500 rounded-full w-[30%]"></div></div>
              <p className="text- font-bold mt-1">{Math.floor(jml*0.3)}/{jml} selesai</p>
            </div>
          )
        })}
      </div>

      <Link href={`/soal/${kelasParam}/latihan`} className="block mt-8 bg-[#FFE74E] border-2 border-black rounded-full py-4 text-center font-black text-lg shadow-[4px_4px_0px_black] hover:translate-y-1">
        🚀 MASUK LATIHAN {totalPremium} SOAL
      </Link>

      <div className="text-center text- text-slate-400 mt-10">© 2026 BIMBEL SUPER JUARA • MRH DigitalHub • WA: 0817-7022-1059</div>
    </div>
  );
}