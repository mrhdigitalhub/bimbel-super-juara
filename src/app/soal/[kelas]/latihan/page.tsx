// @ts-nocheck
"use client";
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
const JUDUL_BAB_ALL = {"bsj-sd1": {"PAI": {"1": "Rukun Iman", "2": "Bersuci & Wudhu", "3": "Mengenal Huruf Hijaiyah", "4": "Doa Sehari-hari", "5": "Kisah Nabi", "6": "Akhlak Terpuji"}, "BINDO": {"1": "Bunyi dan Huruf", "2": "Sapa dan Salam", "3": "Cerita Bergambar", "4": "Kosakata Baru", "5": "Kalimat Sederhana", "6": "Membaca Nyaring"}, "MTK": {"1": "Bilangan 1-10", "2": "Penjumlahan & Pengurangan", "3": "Bangun Datar", "4": "Pengukuran Panjang", "5": "Waktu & Jam", "6": "Soal Cerita"}, "PPKN": {"1": "Aturan di Rumah", "2": "Aturan di Sekolah", "3": "Simbol Pancasila", "4": "Hidup Rukun", "5": "Toleransi", "6": "Gotong Royong"}, "IPAS": {"1": "Bagian Tubuh", "2": "Panca Indera", "3": "Makhluk Hidup", "4": "Benda di Sekitar", "5": "Cuaca", "6": "Lingkungan Bersih"}}, "bsj-sd2": {"PAI": {"1": "Asmaul Husna", "2": "Shalat Wajib", "3": "Hijaiyah Sambung", "4": "Adab Sehari-hari", "5": "Kisah Nabi Nuh & Ibrahim", "6": "Akhlak Jujur & Disiplin"}, "BINDO": {"1": "Huruf Vokal Konsonan", "2": "Perkenalan Diri", "3": "Dongeng Fabel", "4": "Kata Sifat", "5": "Kalimat Tanya", "6": "Menulis Cerita Pendek"}, "MTK": {"1": "Bilangan 11-100", "2": "Penjumlahan Bersusun", "3": "Pengurangan Bersusun", "4": "Perkalian Dasar", "5": "Pembagian Dasar", "6": "Bangun Ruang Sederhana"}, "PPKN": {"1": "Sila 1-2 Pancasila", "2": "Hak & Kewajiban", "3": "Hidup Tertib", "4": "Kerja Sama", "5": "Musyawarah", "6": "Cinta Lingkungan"}, "IPAS": {"1": "Anggota Keluarga", "2": "Pertumbuhan Manusia", "3": "Sumber Energi", "4": "Wujud Benda", "5": "Cuaca & Musim", "6": "Daur Hidup Hewan"}}};
export default function Page(){
  const params = useParams();
  const search = useSearchParams();
  const kelasId = (params.kelas) || "bsj-sd1";
  const kelas = kelasId.toUpperCase();
  const mapel = search.get("mapel") || "PAI";
  const bab = search.get("bab") || "1";
  const judul = (JUDUL_BAB_ALL[kelasId] && JUDUL_BAB_ALL[kelasId][mapel] && JUDUL_BAB_ALL[kelasId][mapel][bab]) || "BAB "+bab;
  const [soal, setSoal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jawab, setJawab] = useState({});
  const [selesai, setSelesai] = useState(false);
  const [nilai, setNilai] = useState(0);
  const [benar, setBenar] = useState(0);
  useEffect(()=>{
    setLoading(true);
    fetch(`/api/soal?kelas=${kelasId}&mapel=${mapel}&bab=${bab}`)
      .then(r=>r.json())
      .then(d=>{ setSoal(d.soal || []); setLoading(false); })
      .catch(()=>setLoading(false));
  },[kelasId, mapel, bab]);
  const handleKumpul = () => {
    const b = soal.filter((s)=>{
      const j=(jawab[s.no]||"").toLowerCase().trim();
      const k=String(s.kunci).toLowerCase().trim();
      return j && (k.includes(j) || j===k || j.includes(k));
    }).length;
    const n = Math.round(b/soal.length*100);
    setBenar(b); setNilai(n); setSelesai(true);
    localStorage.setItem(`${kelasId}-${mapel}-${bab}`, String(n));
  };
  if(loading){
    return (<div className="min-h-screen bg-[#fffaf5] flex items-center justify-center"><div className="text-center"><img src="/mrh-logo.png" className="h-12 mx-auto mb-4 animate-pulse" /><p className="font-black text-orange-600">Loading {kelas} - {mapel} BAB {bab} - {judul}...</p><p className="text-xs text-gray-400">Ambil dari Supabase (30 soal)</p></div></div>);
  }
  if(soal.length===0){
    return (<div className="min-h-screen bg-[#fffaf5] p-6"><div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl text-center border"><h1 className="font-black text-orange-600">SOAL BELUM DI-IMPORT</h1><p className="text-sm mt-2">{kelas} - {mapel} BAB {bab} - {judul}</p><a href={`/soal/${kelasId}`} className="inline-block mt-4 bg-orange-500 text-white px-6 py-2 rounded-xl">Dashboard</a></div></div>);
  }
  if(selesai){
    let total=0, cnt=0;
    for(let i=1;i<=6;i++){ const v=localStorage.getItem(`${kelasId}-${mapel}-${i}`); if(v){ total+=parseInt(v); cnt++; } }
    const avg = cnt? Math.round(total/cnt):nilai;
    return (<div className="min-h-screen bg-orange-50 p-4"><div className="max-w-md mx-auto"><div className="bg-white p-2 rounded-xl flex justify-center mb-4"><img src="/mrh-logo.png" className="h-10" /></div><div className="bg-white p-6 rounded-[24px] shadow-xl text-center"><p className="text-xs text-gray-500">{kelas} - {mapel} BAB {bab} - {judul}</p><h1 className="text-6xl font-black text-orange-500 mt-2">{nilai}</h1><p className="font-bold mt-2">{benar} dari {soal.length} benar</p><div className="mt-4 p-3 bg-gray-50 rounded-xl"><p className="text-xs">Nilai Akhir Mapel {mapel}</p><p className="text-xl font-black text-green-600">{avg} - {cnt}/6 BAB selesai</p></div><div className="flex gap-2 mt-6"><button onClick={()=>{setSelesai(false);setJawab({})}} className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold">Ulangi</button><a href={`/soal/${kelasId}`} className="flex-1 bg-gray-900 text-white py-3 rounded-xl text-center font-bold">Dashboard</a></div></div></div></div>);
  }
  return (<div className="min-h-screen bg-[#fffaf5]"><div className="sticky top-0 bg-white border-b p-3 z-10"><div className="max-w-3xl mx-auto flex justify-between items-center"><div className="flex items-center gap-2"><img src="/mrh-logo.png" className="h-8" /><h1 className="font-black text-orange-600 text-[11px] leading-tight">{kelas} - {mapel} BAB {bab} - {judul} - {soal.length} SOAL (Supabase)</h1></div><div className="flex gap-2"><a href={`/soal/${kelasId}`} className="text-[10px] bg-gray-100 px-2 py-1 rounded-full">Mapel</a><button onClick={handleKumpul} className="text-[10px] bg-green-600 text-white px-3 py-1 rounded-full font-bold">Kumpulkan</button></div></div></div><div className="max-w-3xl mx-auto p-3 space-y-3">{soal.map((s)=> (<div key={s.no} className="bg-white border p-4 rounded-2xl"><p className="font-bold text-sm"><span className="bg-orange-500 text-white px-2 py-0.5 rounded text-xs mr-2">{s.no}</span>[{s.tipe}] {s.tanya}</p>{s.tipe==="PG"? <div className="grid gap-2 mt-3">{(s.opsi||[]).map((o,i)=><label key={i} className="border p-2.5 rounded-xl text-sm flex gap-2 cursor-pointer hover:bg-orange-50"><input type="radio" name={`q${s.no}`} onChange={()=>setJawab({...jawab,[s.no]:["A","B","C","D"][i]})}/>{["A","B","C","D"][i]}. {o}</label>)}</div> : <textarea className="w-full border rounded-xl p-3 mt-3 text-sm" rows={2} value={jawab[s.no]||""} onChange={e=>setJawab({...jawab,[s.no]:e.target.value})} placeholder="Tulis jawaban..."/>}</div>))}<button onClick={handleKumpul} className="w-full bg-green-600 text-white py-4 rounded-2xl font-black text-sm">KUMPULKAN - SIMPAN SCORE BAB {bab}</button></div></div>);
}
