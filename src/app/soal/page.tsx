"use client";
export const dynamic = 'force-dynamic';
import Link from "next/link";

const KELAS = [
  {id:"sd1", nama:"SD Kelas 1", emoji:"🎒", color:"bg-yellow-300"},
  {id:"sd2", nama:"SD Kelas 2", emoji:"📚", color:"bg-green-300"},
  {id:"sd3", nama:"SD Kelas 3", emoji:"✏️", color:"bg-blue-300"},
  {id:"sd4", nama:"SD Kelas 4", emoji:"📖", color:"bg-purple-300"},
  {id:"sd5", nama:"SD Kelas 5", emoji:"🎓", color:"bg-pink-300"},
  {id:"sd6", nama:"SD Kelas 6", emoji:"🏆", color:"bg-orange-300"},
];

export default function SoalPage(){
  return(
    <div className="max-w-5xl mx-auto p-6 pb-20">
      <h1 className="text-4xl font-black">PILIH KELAS JUARA!</h1>
      <p className="font-bold text-slate-600 mt-2">6 Kelas • @600 Soal • 5 Mapel @120</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        {KELAS.map(k=>(
          <Link key={k.id} href={`/soal/${k.id}`} className={`${k.color} border- border-black rounded- p-6 shadow-[6px_6px_0px_black] hover:translate-y-1 block`}>
            <div className="text-4xl">{k.emoji}</div>
            <div className="font-black text-xl mt-2">{k.nama.toUpperCase()}</div>
            <div className="font-bold text-sm mt-1">600 Soal • 5 Mapel • HOTS</div>
          </Link>
        ))}
      </div>
    </div>
  )
}