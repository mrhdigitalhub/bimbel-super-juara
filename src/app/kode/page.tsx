"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Biar gak di-prerender Vercel
export const dynamic = 'force-dynamic';

function KodeForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const codeFromUrl = searchParams.get("code") || "";

  const [kode, setKode] = useState(codeFromUrl);
  const [hpOrtu, setHpOrtu] = useState("");
  const [hpAnak, setHpAnak] = useState("");
  const [namaAnak, setNamaAnak] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (codeFromUrl) setKode(codeFromUrl.toUpperCase());
  }, [codeFromUrl]);

  function getKelasFromKode(kodeStr: string) {
    const k = kodeStr.toUpperCase();
    if (k.includes("SD1")) return "bsj-sd1";
    if (k.includes("SD2")) return "bsj-sd2";
    if (k.includes("SD3")) return "bsj-sd3";
    if (k.includes("SD4")) return "bsj-sd4";
    if (k.includes("SD5")) return "bsj-sd5";
    if (k.includes("SD6")) return "bsj-sd6";
    return "bsj-sd1";
  }

  async function handleAktifkan() {
    if (!kode.trim() || !hpOrtu.trim() || !namaAnak.trim()) {
      setMsg("Lengkapi: Kode Voucher, HP Ortu, Nama Anak");
      return;
    }
    setLoading(true);
    setMsg("Mengaktifkan...");

    const kodeFinal = kode.trim().toUpperCase();
    const kelasAktif = getKelasFromKode(kodeFinal);

    try {
      await supabase.from("voucher_aktif").upsert({
        kode_akses: kodeFinal,
        hp_ortu: hpOrtu.trim(),
        hp_anak: hpAnak.trim(),
        nama_anak: namaAnak.trim(),
        kelas: kelasAktif,
        aktif_sampai: new Date(Date.now() + 30*24*60*60*1000).toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'kode_akses' });
    } catch (e) {
      console.log("supabase skip", e);
    }

    // Simpan untuk dibaca dashboard /soal/[kelas]
    localStorage.setItem("bsj_kode_aktif", kodeFinal);
    localStorage.setItem("bsj_kelas_aktif", kelasAktif);
    localStorage.setItem("bsj_hp_ortu", hpOrtu.trim());
    localStorage.setItem("bsj_hp_anak", hpAnak.trim());
    localStorage.setItem("bsj_nama_anak", namaAnak.trim());
    localStorage.setItem("bsj_aktif_sampai", new Date(Date.now() + 30*24*60*60*1000).toISOString());

    setMsg(`Berhasil! Masuk ke ${kelasAktif.toUpperCase()}...`);
    
    setTimeout(() => {
      window.location.href = `/soal/${kelasAktif}`;
    }, 800);
  }

  const kelasPreview = getKelasFromKode(kode);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-black border border-yellow-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(234,179,8,0.15)]">
        <div className="text-center mb-6">
          <div className="inline-block border border-yellow-500 text-yellow-500 text-[10px] px-3 py-1 rounded-full tracking-widest">PREMIUM 30 HARI</div>
          <h1 className="text-yellow-500 font-bold mt-4 text-sm">AKTIFKAN KARTU PREMIUM</h1>
          <p className="text-white/50 text-[10px] mt-1">Aktif 30 hari - kode: {kode || "BSJ-SD1-XXXX"}</p>
        </div>
        <div className="space-y-3">
          <input value={kode} onChange={(e)=>setKode(e.target.value)} placeholder="BSJ-SD1-XXXX" className="w-full bg-black border border-yellow-500/50 rounded-lg p-3 text-sm text-yellow-500 placeholder:text-yellow-500/30 uppercase font-mono" />
          <input value={hpOrtu} onChange={(e)=>setHpOrtu(e.target.value)} placeholder="HP ORANG TUA" className="w-full bg-black border border-white/20 rounded-lg p-3 text-sm text-white placeholder:text-white/30" />
          <input value={hpAnak} onChange={(e)=>setHpAnak(e.target.value)} placeholder="HP ANAK (YANG BELAJAR)" className="w-full bg-black border border-white/20 rounded-lg p-3 text-sm text-white placeholder:text-white/30" />
          <input value={namaAnak} onChange={(e)=>setNamaAnak(e.target.value)} placeholder="NAMA ANAK" className="w-full bg-black border border-white/20 rounded-lg p-3 text-sm text-white placeholder:text-white/30" />
          {msg && <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs p-3 rounded-lg text-center">{msg}</div>}
          <button onClick={handleAktifkan} disabled={loading} className="w-full bg-yellow-500 text-black rounded-lg py-3 text-sm font-bold hover:bg-yellow-400 disabled:opacity-50">
            {loading ? "Memproses..." : "🚀 AKTIFKAN 30 HARI"}
          </button>
          <p className="text-white/30 text-[10px] text-center mt-2">Langsung masuk kelas {kelasPreview.toUpperCase()} - tanpa pilih kelas lagi</p>
        </div>
      </div>
    </div>
  );
}

export default function KodePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-yellow-500 text-sm">Loading...</div>}>
      <KodeForm />
    </Suspense>
  );
}
