export const dynamic = 'force-dynamic';
"use client";
import Link from "next/link";
export default function Page(){
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Pilih Kelas - Bimbel Super Juara</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {["bsj-sd1","bsj-sd2","bsj-sd3","bsj-sd4","bsj-sd5","bsj-sd6"].map(k=>(
          <Link key={k} href={`/soal/${k}`} className="border-2 border-orange-300 bg-orange-50 p-6 rounded-xl text-center font-bold uppercase hover:bg-orange-100">
            {k.replace('bsj-','').toUpperCase()}<br/><span className="text-xs font-normal">30 Soal / Bab</span>
          </Link>
        ))}
      </div>
    </div>
  );
}