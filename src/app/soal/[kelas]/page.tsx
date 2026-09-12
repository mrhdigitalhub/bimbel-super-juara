"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Data 30 BAB dummy - ganti dengan data asli Bos kalau ada
const MAPEL_DATA: any = {
  "bsj-sd1": [
    { name: "PAI & Budi Pekerti", bab: ["Rukun Iman","Bersuci & Wudhu","Mengenal Huruf Hijaiyah","Doa Sehari-hari","Kisah Nabi","Akhlak Terpuji"] },
    { name: "Bahasa Indonesia", bab: ["Bunyi dan Huruf","Sapa dan Salam","Cerita Bergambar","Menulis Tegak Bersambung","Puisi Anak","Cerita Fabel"] },
  ]
};

export default function SoalKelasDashboard() {
  const params = useParams();
  const kelasParam = (params?.kelas as string) || "bsj-sd1";
  const kelas = kelasParam.toLowerCase();
  const router = useRouter();

  const [kodeAktif, setKodeAktif] = useState("Belum ada");
  const [namaAnak, setNamaAnak] = useState("");
  const [totalScore, setTotalScore] = useState(0);
  const [babDone, setBabDone] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Baca dari localStorage (yang disimpan halaman /kode)
    const k = localStorage.getItem("bsj_kode_aktif");
    const kKelas = localStorage.getItem("bsj_kelas_aktif");
    const nAnak = localStorage.getItem("bsj_nama_anak") || "";
    
    if (k) {
      setKodeAktif(k);
    } else {
      setKodeAktif("Belum ada");
    }
    setNamaAnak(nAnak);

    // 2. Kalau kode ada tapi kelas beda - paksa redirect ke kelas yang sesuai kode
    if (k && kKelas && kKelas !== kelas) {
      // misal kode SD2 tapi buka SD1 -> lempar ke SD2
      // window.location.href = `/soal/${kKelas}`; // aktifkan kalau mau strict 1 voucher 1 kelas
    }

    // 3. Load score dari Supabase - FILTER KODE + KELAS (logic a,b,c)
    async function loadScore() {
      if (!k || k === "Belum ada") {
        setLoading(false);
        return;
      }
      try {
        // Logic baru: filter kode_akses + kelas (biar score gak ketuker)
        const { data, error } = await supabase
          .from("hasil_latihan")
          .select("*")
          .eq("kode_akses", k)
          .ilike("kelas", `%${kelas}%`); // ilike biar BSJ-SD1 - Kelas 1 masih kebaca

        if (error) throw error;
        if (data) {
          const done = data.filter((d:any) => d.skor >= 60).length; // anggap selesai kalau >=60
          const benar = data.reduce((s:number, d:any)=> s + (d.jumlah_benar||0), 0);
          const total = data.length > 0 ? Math.round(data.reduce((s:number,d:any)=> s + (d.skor||0),0)/data.length) : 0;
          setBabDone(done);
          setTotalScore(total);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
    loadScore();
  }, [kelas]);

  function handleLogout() {
    localStorage.removeItem("bsj_kode_aktif");
    localStorage.removeItem("bsj_kelas_aktif");
    router.push("/kode");
  }

  const mapels = MAPEL_DATA[kelas] || MAPEL_DATA["bsj-sd1"];

  return (
    <div className="min-h-screen bg-[#f8f5ff] p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-bold text-sm">BSJ-SD1 - Dashboard Score Lengkap 30 BAB - 5 Mapel</h1>
          <div className="flex gap-2 items-center">
            <span className="bg-green-50 text-green-700 text-[10px] px-2 py-1 rounded-full border border-green-200">Kode: {kodeAktif}</span>
            <button onClick={()=>router.push("/kode")} className="bg-black text-white text-[10px] px-3 py-1 rounded-full">Pantauan Orang Tua</button>
          </div>
        </div>

        {/* HEADER SCORE */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-500 rounded-xl p-5 text-white relative overflow-hidden mb-4">
          <div className="flex justify-between">
            <div>
              <p className="text-[10px] opacity-80">Total Score Kelas - {kelas.toUpperCase()} (Voucher: {kodeAktif})</p>
              <p className="text-3xl font-bold">{loading ? "..." : `${totalScore}%`}</p>
              <p className="text-[10px] mt-1 opacity-80">{babDone} / 30 BAB selesai - {namaAnak ? `Anak: ${namaAnak}` : `Benar 0 / 0`}</p>
            </div>
            <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center font-bold">{loading ? "..." : `${totalScore}%`}</div>
          </div>
          <div className="w-full bg-white/20 h-1.5 rounded-full mt-3">
            <div className="bg-white h-1.5 rounded-full" style={{width: `${totalScore}%`}}></div>
          </div>
          {kodeAktif === "Belum ada" && (
            <div className="mt-3 bg-yellow-400 text-black text-xs p-2 rounded-lg text-center">
              ⚠️ Voucher belum aktif. <Link href="/kode" className="underline font-bold">Aktifkan di /kode</Link>
            </div>
          )}
        </div>

        {/* MAPEL CARDS - sama seperti foto Bos */}
        {mapels.map((m:any, idx:number)=>(
          <div key={idx} className="bg-[#f0fdf4] border border-green-900/10 rounded-xl p-3 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">📦</div>
              <div>
                <p className="font-bold text-xs">{m.name}</p>
                <p className="text-[9px] text-gray-500">0/6 BAB - Rata 0% - Pastel Hijau Tua</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {m.bab.map((babName:string, bIdx:number)=>(
                <Link key={bIdx} href={`/soal/${kelas}/latihan?mapel=${encodeURIComponent(m.name)}&bab=${bIdx+1}`} className="bg-white rounded-lg p-2 border border-black/5 hover:border-purple-400">
                  <p className="text-[8px] text-gray-500">BAB {bIdx+1}</p>
                  <p className="text-[10px] font-bold leading-tight">{babName}</p>
                  <p className="text-[8px] text-gray-400 mt-1">Belum dikerjakan</p>
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center mt-6">
          <button onClick={handleLogout} className="text-[10px] text-gray-400 underline">Ganti Voucher / Logout</button>
        </div>
      </div>
    </div>
  );
}
