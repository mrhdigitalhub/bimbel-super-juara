"use client";
import Link from "next/link";

const KELAS = [
  { id:"bsj-sd1", nama:"BSJ - SD1", kelas:"Kelas 1 SD", warna:"#fecaca", border:"#ef4444", soal:900 },
  { id:"bsj-sd2", nama:"BSJ - SD2", kelas:"Kelas 2 SD", warna:"#fef08a", border:"#eab308", soal:900 },
  { id:"bsj-sd3", nama:"BSJ - SD3", kelas:"Kelas 3 SD", warna:"#bfdbfe", border:"#3b82f6", soal:900 },
  { id:"bsj-sd4", nama:"BSJ - SD4", kelas:"Kelas 4 SD", warna:"#fde68a", border:"#f59e0b", soal:900 },
  { id:"bsj-sd5", nama:"BSJ - SD5", kelas:"Kelas 5 SD", warna:"#bbf7d0", border:"#22c55e", soal:900 },
  { id:"bsj-sd6", nama:"BSJ - SD6", kelas:"Kelas 6 SD", warna:"#fed7aa", border:"#f97316", soal:900 },
];

export default function SoalPage(){
  return (
    <div className="min-h-screen bg-[#fffaf5]">
      <div className="bg-white border-b-2 border-orange-100 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <img src="/mrh-logo.png" alt="MRH DigitalHub" className="h-20 w-auto object-contain" />
          <div className="mt-2 text-center">
            <h1 className="text-[10px] tracking-[0.2em] font-bold text-[#0a1a5c] uppercase">Konsultan | Sertifikasi | DigitalHub</h1>
            <p className="text-[8px] tracking-[0.3em] text-[#0a1a5c] mt-1 font-semibold">BERSINERGY BERTRANSFORMASI INDUSTRI MODERN</p>
          </div>
          <h2 className="mt-4 text-xl font-black text-orange-600">BIMBEL SUPER JUARA</h2>
          <p className="text-xs text-gray-500">Pilih Kelas - 6 Kelas - 5.400 Soal Valid</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {KELAS.map((k)=>(
            <Link key={k.id} href={`/soal/${k.id}`} className="group">
              <div style={{backgroundColor:k.warna, borderColor:k.border, borderWidth:'3px'}} className="rounded-[24px] p-6 border-2 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all h-[180px] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-black text-gray-800">{k.nama}</h3>
                    <span className="bg-white text-xs font-bold px-3 py-1 rounded-full shadow">{k.soal} Soal</span>
                  </div>
                  <p className="text-sm font-bold text-gray-700 mt-1">{k.kelas}</p>
                  <p className="text-xs text-gray-600 mt-2">5 Mapel x 6 BAB x 30 Soal</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs bg-white/80 px-3 py-1 rounded-full font-bold">30 BAB Valid</span>
                  <span className="text-sm font-black group-hover:translate-x-1 transition">Masuk →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
