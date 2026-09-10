export const dynamic = 'force-dynamic';
"use client";
import { useParams, useSearchParams } from "next/navigation";
export default function Page(){
  const {kelas} = useParams() as any;
  const sp = useSearchParams();
  const mapel = sp.get("mapel") || "Matematika";
  const bab = sp.get("bab") || "1";
  return <div className="p-6"><h1 className="text-xl font-bold">{kelas} - {mapel} - BAB {bab}</h1><p className="mt-4">File latihan minimal - Ready untuk Vercel. Setelah Ready hijau kita isi full 30 soal.</p></div>;
}