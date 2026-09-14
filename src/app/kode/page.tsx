"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function KodePage(){
  const router = useRouter();
  const [code,setCode]=useState("");
  const [loading,setLoading]=useState(false);
  const [msg,setMsg]=useState("");

  const handleRedeem = async()=>{
    const kode = code.trim().toUpperCase();
    if(!kode){
      setMsg("❌ Masukkan kode voucher dulu!");
      return;
    }
    setLoading(true);
    setMsg(`🔍 Cek kode ${kode} di public.vouchers...`);

    // FIX 100% SINKRON dengan screenshot vouchers kamu: tabel vouchers, kolom code, paket, status
    const { data, error } = await supabase.from("vouchers").select("*").eq("code", kode).single();

    if(error || !data){
      setMsg(`❌ Kode ${kode} tidak ditemukan di public.vouchers. Cek di Supabase → Table Editor → vouchers, pastikan code ada.`);
      setLoading(false);
      return;
    }

    if(data.status!=="AVAILABLE"){
      // Jika sudah USED, masih boleh masuk tapi kasih warning
      setMsg(`⚠️ Kode ${kode} statusnya ${data.status}, tapi tetap coba masuk ke kelas ${data.paket}...`);
    } else {
      setMsg(`✅ Kode valid! Paket: ${data.paket.toUpperCase()} - Rp ${data.nominal?.toLocaleString('id-ID')} - Masuk ke /soal/${data.paket}...`);
    }

    // SIMPAN KODE KE LOCALSTORAGE sesuai format yang dipakai dashboard bsj-sd1
    // Dashboard baca dari bsj_kode_aktif_bsj-sd1 dan bsj_kode_aktif_sd1
    const paket = data.paket.toLowerCase(); // bsj-sd1
    const short = paket.replace("bsj-",""); // sd1
    localStorage.setItem(`bsj_kode_aktif_${paket}`, kode);
    localStorage.setItem(`bsj_kode_aktif_${short}`, kode);
    localStorage.setItem("bsj_kode_aktif", kode); // fallback lama
    localStorage.setItem("bsj_paket_aktif", paket);

    // OPTIONAL: update status jadi USED jika kamu mau (bisa di-comment jika mau bisa dipakai berkali-kali)
    // await supabase.from("vouchers").update({ status: "USED" }).eq("code", kode);

    setTimeout(()=>{
      router.push(`/soal/${paket}`);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5] flex items-center justify-center p-5">
      <div className="w-full max-w-[420px] bg-white rounded-[24px] border shadow-sm p-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-[#0E2A6B] text-white flex items-center justify-center font-black mx-auto">M</div>
          <h1 className="mt-3 font-black text-[20px]">Masukkan Kode Voucher</h1>
          <p className="mt-1 text-[12px] opacity-60">Kode dari Admin setelah beli paket Rp17rb - Cek di public.vouchers</p>
        </div>

        <div className="mt-6">
          <label className="text-[11px] font-black tracking-widest opacity-60">KODE VOUCHER (contoh: BSJ-SD1-455E)</label>
          <input value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="BSJ-SD1-XXXX" className="mt-2 w-full rounded-full border-2 border-[#0E2A6B]/20 px-5 py-3 font-mono font-black text-[16px] tracking-widest text-[#0E2A6B] placeholder:opacity-30" />
        </div>

        <button onClick={handleRedeem} disabled={loading} className="mt-4 w-full rounded-full bg-[#FF8C00] text-white font-black py-3.5 text-[14px] disabled:opacity-50 shadow-[0_8px_20px_rgba(255,140,0,0.3)]">
          {loading ? "⏳ Cek kode..." : "🚀 Masuk ke Kelas →"}
        </button>

        {msg && <div className="mt-4 rounded-xl bg-[#FFFEF5] border p-3 text-[12px] font-bold leading-relaxed">{msg}</div>}

        <div className="mt-6 rounded-xl bg-[#0E2A6B] text-white p-4">
          <div className="font-bold text-[11px]">Alur FINAL yang benar:</div>
          <ul className="mt-2 space-y-1 text-[11px] opacity-80 list-decimal pl-4">
            <li>Siswa beli → Admin buat voucher di /admin → kode masuk public.vouchers (704 records)</li>
            <li>Siswa buka <b>/kode</b> → masukin BSJ-SD1-455E</li>
            <li>Sistem cek di <b>public.vouchers</b> → kalau AVAILABLE → simpan ke localStorage bsj_kode_aktif_bsj-sd1</li>
            <li>Redirect ke /soal/bsj-sd1 → dashboard muncul Voucher: BSJ-SD1-455E (dinamis)</li>
          </ul>
          <div className="mt-3 text-[10px] opacity-50">/redeem akan di-redirect ke /kode biar tidak dobel.</div>
        </div>

        <div className="mt-4 text-center">
          <a href="/admin" className="text-[11px] underline opacity-50">Admin? Buat voucher di /admin</a>
        </div>
      </div>
    </div>
  );
}
