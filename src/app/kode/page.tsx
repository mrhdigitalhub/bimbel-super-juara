"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const formatRupiah = (n:number) => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);

export default function KodePageGold(){
  const [code,setCode]=useState("");
  const [hpOrtu,setHpOrtu]=useState("");
  const [hpAnak,setHpAnak]=useState("");
  const [nama,setNama]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const [success,setSuccess]=useState<any>(null);
  const [setting,setSetting]=useState({ harga: 17000, durasi: 90 });
  const [debug,setDebug]=useState("");

  useEffect(()=>{
    const loadSetting = async()=>{
      const { data, error } = await supabase.from("settings").select("*").in("key",["harga_default","durasi_hari"]);
      if(error){
        console.log("Settings error:", error.message);
        setDebug(prev=>prev+" Settings err: "+error.message+" | ");
      }
      if(data){
        let h=17000, d=90;
        data.forEach((r:any)=>{
          if(r.key==="harga_default") h = parseInt(r.value);
          if(r.key==="durasi_hari") d = parseInt(r.value);
        });
        setSetting({ harga:h, durasi:d });
      }
    };
    loadSetting();

    const params = new URLSearchParams(window.location.search);
    const codeFromUrl = params.get("code");
    if(codeFromUrl){
      const cleanCode = codeFromUrl.trim().toUpperCase();
      setCode(cleanCode);
    }
  },[]);

  const handleRedeem = async (e:React.FormEvent)=>{
    e.preventDefault();
    setError(""); setSuccess(null); setDebug("");
    if(!code || !hpOrtu || !hpAnak || !nama){ setError("Lengkapi semua field! HP Anak wajib diisi!"); return; }
    if(hpAnak.length < 10){ setError("HP Anak minimal 10 digit!"); return; }
    setLoading(true);
    
    if(code.trim().toUpperCase()==="DEMO"){
      const exp = new Date(); exp.setDate(exp.getDate()+setting.durasi);
      setSuccess({code:"BSJ-SD1-DEMO", paket:"bsj-sd1", nominal:setting.harga, hp_ortu:hpOrtu, hp_anak:hpAnak, used_by:nama, expired_at: exp.toISOString(), durasi_hari: setting.durasi});
      setLoading(false); return;
    }

    const cleanCode = code.trim().toUpperCase();
    setDebug(`Cari kode: ${cleanCode} | URL: ${supabaseUrl} |`);

    const { data, error:err } = await supabase.from("vouchers").select("*").eq("code", cleanCode).single();
    
    if(err){
      console.error("Supabase error:", err);
      setDebug(`ERR code: ${err.code} | msg: ${err.message} | details: ${err.details || ''} | hint: ${err.hint || ''}`);
      // Tampilkan error asli biar tahu penyebab RLS atau tidak ada
      if(err.code === "PGRST116" || err.message.includes("No rows")){
        setError(`❌ Kode ${cleanCode} tidak ada di DB! Cek Supabase > vouchers > search ${cleanCode}. Error asli: ${err.message}`);
      } else if(err.message.includes("row-level security") || err.code === "42501"){
        setError(`❌ RLS BLOCK! Supabase block baca voucher! RUN SQL RLS Policy di SQL Editor! Error: ${err.message}`);
      } else {
        setError(`❌ Gagal baca DB: ${err.message} (code: ${err.code}) - Cek .env.local NEXT_PUBLIC_SUPABASE_URL & ANON_KEY!`);
      }
      setLoading(false); return;
    }
    
    if(!data){
      setError(`❌ Kode ${cleanCode} tidak ditemukan! Data null!`);
      setLoading(false); return;
    }

    if(data.status==="USED"){ 
      setSuccess(data); 
      setLoading(false); 
      return; 
    }

    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + setting.durasi);

    const { error:upErr } = await supabase.from("vouchers").update({ 
      status:"USED", 
      hp_ortu: hpOrtu, 
      hp_anak: hpAnak,
      used_by: nama,
      expired_at: expiredAt.toISOString(),
      durasi_hari: setting.durasi
    }).eq("id", data.id);
    
    if(upErr){
      setError(`❌ Gagal update jadi USED! Error: ${upErr.message} - RLS update belum allow! RUN SQL RLS UPDATE policy!`);
      setDebug(`Update ERR: ${upErr.code} | ${upErr.message}`);
      setLoading(false); return;
    }
    
    setSuccess({...data, hp_ortu:hpOrtu, hp_anak:hpAnak, used_by:nama, expired_at: expiredAt.toISOString(), durasi_hari: setting.durasi});
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <header className="sticky top-0 z-50 bg-black border-b-[3px] border-[#FFD700]">
        <div className="max-w-[480px] mx-auto px-4 h-[68px] flex items-center justify-between">
          <div className="text-[12px] font-black tracking-widest text-[#FFD700]">MRH DigitalHub</div>
          <div className="text-[9px] font-black tracking-[0.2em] border-[2px] border-[#FFD700] text-[#FFD700] px-3 py-1.5 rounded-full">PREMIUM {setting.durasi} HARI</div>
        </div>
      </header>

      <main className="max-w-[440px] mx-auto px-4 py-6">
        <div className="relative rounded-[22px] border-[3px] border-[#FFD700] bg-gradient-to-br from-[#1A1A1A] via-[#0F0F0F] to-black p-5 shadow-[0_0_40px_rgba(255,215,0,0.25),8px_8px_0px_0px_black] overflow-hidden mb-6">
          <div className="mt-2">
            <p className="text-[10px] tracking-[0.25em] text-[#FFD700]/70 font-bold">BIMBEL SUPER JUARA • VOUCHER ID</p>
            <p className="font-mono font-black text-[20px] tracking-[0.15em] text-[#FFD700] mt-1">{code ? code.toUpperCase() : "BSJ-SD1-XXXX"}</p>
          </div>
          <div className="flex justify-between items-end mt-5">
            <div>
              <p className="text-[9px] text-white/50 font-bold tracking-widest">MASA AKTIF</p>
              <p className="text-[11px] font-bold text-white/90">{setting.durasi} Hari ({Math.round(setting.durasi/30)} Bulan)</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-white/50 font-bold tracking-widest">VALUE</p>
              <p className="text-[13px] font-black text-[#FFD700]">{formatRupiah(setting.harga)}</p>
            </div>
          </div>
        </div>

        {!success ? (
          <div className="bg-[#111111] border-[3px] border-[#FFD700] rounded-[24px] shadow-[6px_6px_0px_0px_black] overflow-hidden">
            <div className="px-5 py-4 border-b-[3px] border-[#FFD700]/30">
              <h2 className="font-black text-[13px] tracking-widest text-[#FFD700]">🎯 AKTIFKAN KARTU PREMIUM</h2>
              <p className="text-[10px] text-white/50 mt-1">Aktif {setting.durasi} hari - Masukkan kode di kartu gold Anda</p>
            </div>
            <form onSubmit={handleRedeem} className="p-5 space-y-4">
              <div>
                <label className="text-[10px] font-black tracking-[0.2em] text-[#FFD700]">KODE VOUCHER *</label>
                <input value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="BSJ-SD1-XXXX" className="mt-2 w-full h-[52px] bg-[#1E1E1E] border-[2px] border-[#FFD700]/40 rounded-[12px] px-4 font-mono font-bold text-[14px] text-[#FFD700] shadow-[3px_3px_0px_0px_black] placeholder:text-white/20 focus:border-[#FFD700] focus:outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-black tracking-[0.2em] text-[#FFD700]">HP ORANG TUA (WA) *</label>
                <input value={hpOrtu} onChange={e=>setHpOrtu(e.target.value)} placeholder="0817..." className="mt-2 w-full h-[52px] bg-[#1E1E1E] border-[2px] border-[#FFD700]/40 rounded-[12px] px-4 font-bold text-[14px] text-white shadow-[3px_3px_0px_0px_black] placeholder:text-white/20 focus:border-[#FFD700] focus:outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-black tracking-[0.2em] text-[#22C55E]">HP ANAK (YANG BELAJAR) *</label>
                <input value={hpAnak} onChange={e=>setHpAnak(e.target.value)} placeholder="0851..." className="mt-2 w-full h-[52px] bg-[#1E1E1E] border-[2px] border-[#22C55E]/60 rounded-[12px] px-4 font-bold text-[14px] text-white shadow-[3px_3px_0px_0px_black] placeholder:text-white/20 focus:border-[#22C55E] focus:outline-none" />
                <p className="text-[9px] text-[#22C55E]/80 mt-1 font-bold">* HP ini yang dipakai anak untuk login belajar</p>
              </div>
              <div>
                <label className="text-[10px] font-black tracking-[0.2em] text-[#FFD700]">NAMA ANAK *</label>
                <input value={nama} onChange={e=>setNama(e.target.value)} placeholder="Nama lengkap anak" className="mt-2 w-full h-[52px] bg-[#1E1E1E] border-[2px] border-[#FFD700]/40 rounded-[12px] px-4 font-bold text-[14px] text-white shadow-[3px_3px_0px_0px_black] placeholder:text-white/20 focus:border-[#FFD700] focus:outline-none" />
              </div>
              {error && <div className="bg-red-900/30 border-[2px] border-red-500 rounded-[12px] p-3 text-[11px] font-black text-red-300">{error}</div>}
              {debug && <div className="bg-yellow-900/30 border-[2px] border-yellow-500 rounded-[12px] p-2 text-[9px] font-mono text-yellow-200 break-words">{debug}</div>}
              <button disabled={loading} type="submit" className="w-full h-[56px] bg-[#FFD700] text-black border-[3px] border-black rounded-[14px] font-black text-[13px] tracking-wide shadow-[4px_4px_0px_0px_black] disabled:opacity-50 hover:brightness-110 active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_black]">
                {loading ? "CEK KODE..." : `🚀 AKTIFKAN ${setting.durasi} HARI`}
              </button>
              <p className="text-[9px] text-center font-bold text-white/40 tracking-wide">Ketik DEMO untuk test tanpa DB • Kode hangus setelah 1x pakai</p>
            </form>
          </div>
        ) : (
          <div className="bg-[#064E3B] border-[3px] border-[#FFD700] rounded-[24px] shadow-[6px_6px_0px_0px_black] p-6 text-center">
            <div className="w-16 h-16 mx-auto bg-[#FFD700] rounded-full border-[3px] border-black flex items-center justify-center text-[28px] font-black text-black shadow-[3px_3px_0px_0px_black]">✓</div>
            <h2 className="font-black text-[20px] mt-3 text-[#FFD700]">KARTU AKTIF {success.durasi_hari} HARI!</h2>
            <p className="font-bold text-[13px] mt-1 text-white">Selamat {success.used_by}!</p>
            <div className="mt-4 bg-black border-[2px] border-[#FFD700] rounded-[14px] p-4 text-left shadow-[3px_3px_0px_0px_black] space-y-2">
              <p className="text-[10px] font-black text-[#FFD700]">KODE: <span className="font-mono text-[13px] text-white">{success.code}</span></p>
              <p className="text-[10px] font-black text-[#FFD700]">PAKET: <span className="text-white font-bold">{success.paket}</span></p>
              <p className="text-[10px] font-black text-[#FFD700]">NOMINAL: <span className="text-white">{formatRupiah(success.nominal)}</span></p>
              <p className="text-[10px] font-black text-[#FFD700]">HP ORTU: <span className="text-white">{success.hp_ortu}</span></p>
              <p className="text-[10px] font-black text-[#22C55E]">HP ANAK: <span className="text-white">{success.hp_anak}</span></p>
              <p className="text-[10px] font-black text-[#FFD700]">EXPIRED: <span className="text-white">{new Date(success.expired_at).toLocaleDateString('id-ID',{day:'2-digit',month:'long',year:'numeric'})} ({success.durasi_hari} hari)</span></p>
            </div>
            <div className="mt-5 bg-[#111] border-[2px] border-[#22C55E] rounded-[14px] p-4 text-left">
              <p className="text-[11px] font-black text-[#22C55E] tracking-widest">📱 CEK DI HP ANAK {success.hp_anak}:</p>
              <div className="mt-3 space-y-2">
                <button onClick={()=>{
                  const phone = success.hp_anak.replace(/^0/,'62');
                  const msg = `*BIMBEL SUPER JUARA - AKTIF!* 🎉%0A%0AHalo ${success.used_by}! Kartu kamu sudah aktif!%0A%0A*Kode:* ${success.code}%0A*Paket:* ${success.paket.toUpperCase()}%0A*Aktif:* ${success.durasi_hari} Hari (Sampai ${new Date(success.expired_at).toLocaleDateString('id-ID')})%0A*Link Belajar:* https://bimbel.mrh-digitalhub.com/kode?code=${success.code}%0A%0ASelamat belajar ya! 🚀`;
                  window.open(`https://wa.me/${phone}?text=${msg}`,'_blank');
                }} className="w-full h-11 bg-[#25D366] text-black border-[2px] border-black rounded-[12px] font-black text-[11px] shadow-[3px_3px_0px_0px_black] flex items-center justify-center gap-2">
                  <span>💬</span> KIRIM WA KE HP ANAK ({success.hp_anak})
                </button>
              </div>
            </div>
            <button onClick={()=>{ localStorage.setItem('bsj_hp_anak', success.hp_anak); localStorage.setItem('bsj_kode', success.code); window.location.href='/'; }} className="mt-5 w-full h-12 bg-[#FFD700] text-black border-[3px] border-black rounded-[12px] font-black text-[12px] shadow-[4px_4px_0px_0px_black]">📚 MASUK KELAS SEKARANG (HP ANAK)</button>
          </div>
        )}
      </main>
    </div>
  )
}
