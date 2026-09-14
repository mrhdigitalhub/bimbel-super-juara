"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function getOpsi(s:any): string[] {
  // coba berbagai format kolom di Supabase
  if (Array.isArray(s.options)) return s.options;
  if (Array.isArray(s.pilihan)) return s.pilihan;
  if (s.opsi_a) return [s.opsi_a, s.opsi_b, s.opsi_c, s.opsi_d].filter(Boolean);
  if (s.pilihan_a) return [s.pilihan_a, s.pilihan_b, s.pilihan_c, s.pilihan_d].filter(Boolean);
  if (s.a) return [s.a, s.b, s.c, s.d].filter(Boolean);
  return [];
}

function getKunci(s:any): number {
  if (typeof s.kunci_jawaban === 'number') return s.kunci_jawaban;
  if (typeof s.kunci === 'number') return s.kunci;
  if (typeof s.jawaban_benar === 'number') return s.jawaban_benar;
  if (typeof s.correct === 'number') return s.correct;
  // jika huruf A/B/C/D
  const k = (s.kunci_jawaban || s.jawaban || s.kunci || '').toString().toUpperCase();
  if (k==='A') return 0;
  if (k==='B') return 1;
  if (k==='C') return 2;
  if (k==='D') return 3;
  return 0;
}

function LatihanContent(){
  const searchParams = useSearchParams();
  const mapelRaw = searchParams.get("mapel") || "pai";
  const SLUG_TO_MAPEL: any = {
    "pai": "PAI & Budi Pekerti",
    "pai-budi": "PAI & Budi Pekerti",
    "bahasa-indonesia": "Bahasa Indonesia",
    "bindo": "Bahasa Indonesia",
    "matematika": "Matematika",
    "mtk": "Matematika",
    "ppkn": "PPKN",
    "ipas": "IPAS",
    "PAI & Budi Pekerti": "PAI & Budi Pekerti",
    "Bahasa Indonesia": "Bahasa Indonesia"
  };
  const mapel = SLUG_TO_MAPEL[mapelRaw] || SLUG_TO_MAPEL[decodeURIComponent(mapelRaw)] || mapelRaw;
  const bab = parseInt(searchParams.get("bab") || "1",10);
  const kelasParam = searchParams.get("kelas") as string | null;
  // kelas dari URL path fallback
  const kelas = (kelasParam || (typeof window!=='undefined' ? window.location.pathname.split('/')[2] : 'bsj-sd1') || 'bsj-sd1').toLowerCase();

  const [soal,setSoal]=useState<any[]>([]);
  const [loading,setLoading]=useState(true);
  const [jawab,setJawab]=useState<number[]>([]);
  const [selesai,setSelesai]=useState(false);
  const [score,setScore]=useState(0);
  const [kode,setKode]=useState("");

  useEffect(()=>{
    const k = localStorage.getItem(`bsj_kode_aktif_${kelas}`) || localStorage.getItem(`bsj_kode_aktif_${kelas.replace('bsj-','')}`) || localStorage.getItem('bsj_kode_aktif') || '';
    setKode(k);
    const fetchSoal = async()=>{
      setLoading(true);
      const formats = [kelas, kelas.replace('bsj-',''), kelas.toUpperCase(), kelas.replace('-','_'), `bsj_${kelas.replace('bsj-','')}`];
      let found:any[] = [];
      for(const fmt of formats){
        const { data } = await supabase.from("soal").select("*").eq("kelas", fmt).eq("mapel", mapel).eq("bab_ke", bab).order('id');
        if(data && data.length>0){ found=data; break; }
        const { data: data2 } = await supabase.from("soal").select("*").ilike("kelas", `%${fmt}%`).eq("mapel", mapel).eq("bab_ke", bab).order('id');
        if(data2 && data2.length>0){ found=data2; break; }
      }
      if(found.length===0){
        const { data: data3 } = await supabase.from("soal").select("*").eq("mapel", mapel).eq("bab_ke", bab).limit(30);
        if(data3) found=data3;
      }
      setSoal(found);
      setJawab(Array(found.length).fill(-1));
      setLoading(false);
    };
    fetchSoal();
  },[mapel,bab,kelas]);

  const handlePilih = (idx:number, opt:number)=>{
    const copy=[...jawab];
    copy[idx]=opt;
    setJawab(copy);
  };

  const handleSelesai = async()=>{
    let benar=0;
    soal.forEach((s,i)=>{
      const kunci=getKunci(s);
      if(jawab[i]===kunci) benar++;
    });
    const total=soal.length;
    const sc=Math.round((benar/total)*100);
    setScore(sc);
    setSelesai(true);
    // simpan ke hasil_latihan
    const kodeAkses = localStorage.getItem(`bsj_kode_aktif_${kelas}`) || localStorage.getItem('bsj_kode_aktif') || 'TANPA-KODE';
    await supabase.from("hasil_latihan").insert({
      kode_akses: kodeAkses,
      kelas: kelas,
      mapel: mapel,
      bab: bab,
      benar: benar,
      salah: total-benar,
      score: sc
    });
  };

  if(loading) return <div className="p-10 text-center">Loading {kelas.toUpperCase()} - {mapel} BAB {bab}...</div>;
  if(soal.length===0) return <div className="p-10 text-center">0 SOAL untuk {kelas} {mapel} BAB {bab}<br/><a href={`/soal/${kelas}`} className="underline">Kembali Dashboard</a></div>;

  if(selesai){
    const benar = jawab.filter((j,i)=>j===getKunci(soal[i])).length;
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white border rounded-2xl p-6 text-center">
          <div className="text-5xl font-black text-blue-600">{score}%</div>
          <div className="mt-2 font-bold">{kelas.toUpperCase()} - {mapel} BAB {bab}</div>
          <div className="text-[16px] opacity-60">Benar {benar} / {soal.length} • Kode: {kode||'Tanpa Kode'}</div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <a href={`/soal/${kelas}`} className="bg-black text-white rounded-full py-3 text-[16px] font-bold">Kembali Dashboard</a>
            <button onClick={()=>{setSelesai(false); setJawab(Array(soal.length).fill(-1));}} className="border rounded-full py-3 text-[16px] font-bold">Ulangi</button>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {soal.map((s,i)=>{
            const kunci=getKunci(s);
            const opsi=getOpsi(s);
            const j=jawab[i];
            const ok=j===kunci;
            return (
              <div key={i} className={`border rounded-xl p-4 ${ok?'bg-green-50 border-green-200':'bg-red-50 border-red-200'}`}>
                <div className="font-bold text-[18px]">{i+1}. {s.soal||s.pertanyaan}</div>
                <div className="mt-2 text-[14px]">Jawab: {opsi[j]||'-'} {ok?'✅':'❌'} | Kunci: {opsi[kunci]}</div>
                {s.penjelasan && <div className="mt-2 text-[15px] opacity-70">Pembahasan: {s.penjelasan}</div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 bg-[#fffcf5] min-h-screen">
      <a href={`/soal/${kelas}`} className="text-[14px] font-bold">← Kembali ke Dashboard {kelas.toUpperCase()} - 30 BAB</a>
      <div className="mt-3 bg-white border rounded-xl p-4 flex justify-between items-center">
        <div><div className="font-black text-[16px]">{kelas.toUpperCase()} - {mapel} BAB {bab} - {soal.length} SOAL</div><div className="text-[15px] opacity-60">Kode: {kode||'Belum ada'} • Pilih jawaban A-D</div></div>
        <div className="text-[14px] bg-blue-100 px-3 py-1 rounded-full font-bold">{jawab.filter(j=>j!==-1).length}/{soal.length}</div>
      </div>
      <div className="mt-4 space-y-4">
        {soal.map((s,i)=>{
          const opsi=getOpsi(s);
          return (
            <div key={s.id||i} className="bg-white border rounded-xl p-4">
              <div className="font-bold text-[18px]">{i+1}. {s.soal||s.pertanyaan}</div>
              <div className="mt-3 grid gap-2">
                {opsi.length>0 ? opsi.map((o:string,oi:number)=>(
                  <button key={oi} onClick={()=>handlePilih(i,oi)} className={`text-left border rounded-lg px-3 py-2.5 text-[16px] ${jawab[i]===oi?'bg-blue-600 text-white border-blue-600 font-bold':'bg-gray-50 hover:bg-gray-100'}`}>
                    <span className="font-black mr-2">{String.fromCharCode(65+oi)}.</span>{o}
                  </button>
                )) : (
                  <div className="text-[14px] opacity-60">Opsi tidak ditemukan di DB. Cek kolom opsi_a/b/c/d. Soal: {JSON.stringify(s).slice(0,150)}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <button onClick={handleSelesai} disabled={jawab.includes(-1)} className="mt-6 w-full bg-[#FF8C00] text-white font-black py-4 rounded-full disabled:opacity-40 shadow">✅ Selesai & Simpan Score →</button>
      <div className="mt-3 text-[15px] opacity-50 text-center">Score akan masuk ke Pantauan Orang Tua di dashboard {kelas.toUpperCase()}</div>
    </div>
  );
}

export default function LatihanPage(){
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading latihan...</div>}>
      <LatihanContent/>
    </Suspense>
  );
}
