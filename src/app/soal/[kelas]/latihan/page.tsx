export const dynamic = 'force-dynamic';
"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
export default function Page(){
  const {kelas} = useParams() as any;
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold uppercase mb-6">{kelas} - Pilih Mapel</h1>
      <div className="grid grid-cols-2 gap-4">
        {["Matematika","IPAS","Bahasa Indonesia","PPKN","Seni"].map(m=>(
          <Link key={m} href={`/soal/${kelas}/latihan?mapel=${encodeURIComponent(m)}&bab=1`} className="border p-6 rounded-xl text-center font-bold bg-white hover:bg-orange-50">{m}<br/><span className="text-xs">30 Soal</span></Link>
        ))}
      </div>
    </div>
  );
}