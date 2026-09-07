"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null as any;
function randomCode(len=4){ const c="ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let r=""; for(let i=0;i<len;i++) r+=c[Math.floor(Math.random()*c.length)]; return r; }

export default function Admin(){
  const [paket,setPaket]=useState("bsj-sd1");
  const [jumlah,setJumlah]=useState(100);
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState<any[]>([]);
  const [log,setLog]=useState("");
  const [stats,setStats]=useState<any>({total:0});
  const [harga,setHarga]=useState(17000);
  const [durasi,setDurasi]=useState(90);
  const [saving,setSaving]=useState(false);

  useEffect(()=>{
    if(!supabase) return;
    loadStats();
    loadSettings();
  },[]);

  const loadSettings = async()=>{
    if(!supabase) return;
    const { data } = await supabase.from("settings").select("*");
    if(data){
      data.forEach((r:any)=>{
        if(r.key==="harga_default") setHarga(parseInt(r.value));
        if(r.key==="durasi_hari") setDurasi(parseInt(r.value));
      });
    }
  };

  const loadStats = async()=>{
    if(!supabase) return;
    const { data } = await supabase.from("vouchers").select("paket, nominal, status");
    if(data){
      const grouped:any={};
      data.forEach((v:any)=>{
        const key = `${v.paket} | Rp ${v.nominal}`;
        if(!grouped[key]) grouped[key]={count:0, available:0, used:0};
        grouped[key].count++;
        if(v.status==="AVAILABLE") grouped[key].available++;
        else grouped[key].used++;
      });
      setStats({total:data.length, grouped});
    }
  };

  const saveSettings = async()=>{
    if(!supabase) return;
    setSaving(true);
    const { error: e1 } = await supabase.from("settings").upsert({ key:"harga_default", value: String(harga) });
    const { error: e2 } = await supabase.from("settings").upsert({ key:"durasi_hari", value: String(durasi) });
    if(e1||e2) setLog(`❌ Gagal simpan setting: ${e1?.message||e2?.message}`);
    else setLog(`✅ SETTING DISIMPAN! Harga: Rp ${harga.toLocaleString('id-ID')} | Masa aktif: ${durasi} hari (${Math.round(durasi/30)} bulan) - Semua redeem baru akan pakai setting ini!`);
    setSaving(false);
  };

  const generate = async()=>{
    if(!supabase) return;
    setLoading(true);
    setLog(`🚀 Generate ${jumlah} voucher ${paket.toUpperCase()} @ Rp ${harga.toLocaleString('id-ID')} - ${durasi} hari...`);
    const batch=[];
    for(let i=0;i<jumlah;i++){
      const code=`BSJ-${paket.replace('bsj-','').toUpperCase()}-${randomCode(4)}`;
      batch.push({ code, paket: paket, status: "AVAILABLE", nominal: harga, durasi_hari: durasi });
    }
    const { data, error } = await supabase.from("vouchers").insert(batch).select();
    if(error){ setLog(`❌ Error: ${error.message}`); setLoading(false); return; }
    setResult(data||batch);
    setLog(`✅ BERHASIL! ${data?.length} voucher ${paket.toUpperCase()} @ Rp ${harga.toLocaleString('id-ID')} - ${durasi} HARI! Total nilai: Rp ${((data?.length||0)*harga).toLocaleString('id-ID')}`);
    loadStats();
    setLoading(false);
  };

  const fixHargaLama = async()=>{
    if(!supabase) return;
    if(!confirm(`Update SEMUA voucher yang masih 150k atau harga lama jadi Rp ${harga.toLocaleString('id-ID')}?`)) return;
    const { error } = await supabase.from("vouchers").update({ nominal: harga }).neq("nominal", harga);
    if(error) alert("Error: "+error.message); else { alert(`✅ Semua voucher udah jadi Rp ${harga.toLocaleString('id-ID')}!`); loadStats(); }
  };

  const exportCSV=()=>{
    if(!result.length) return;
    let csv="Kode Voucher,Paket,Status,Nominal,Durasi Hari,Link Redeem,HP Ortu,HP Anak,Expired\n";
    result.forEach(r=>{ csv+=`${r.code},${r.paket},${r.status},${r.nominal},${r.durasi_hari||durasi},http://localhost:3000/kode?code=${r.code},,,\n`; });
    const blob=new Blob([csv],{type:'text/csv'}); const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download=`VOUCHER-${paket.toUpperCase()}-${result.length}x${harga}-D${durasi}.csv`; a.click();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4">
      <div className="max-w-[1100px] mx-auto">
        <header className="bg-black border-[3px] border-[#FFD700] rounded-[16px] p-4 flex justify-between items-center mb-6">
          <div className="flex gap-3 items-center"><div className="bg-[#FFD700] text-black w-8 h-8 rounded font-black flex items-center justify-center">M</div><div><p className="font-black text-[#FFD700] text-[14px]">ADMIN SUPER JUARA - SETTING HARGA & EXPIRED</p><p className="text-[10px] text-white/50">701 voucher @ Rp 17K - bisa diubah kapan aja</p></div></div>
          <div className="bg-[#22C55E] text-black rounded-full px-3 py-1 font-black text-[11px]">TOTAL {stats.total||701} VOUCHER</div>
        </header>

        <div className="bg-gradient-to-br from-[#1A1A1A] to-black border-[3px] border-[#22C55E] rounded-[16px] p-5 mb-6 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
          <h2 className="font-black text-[#22C55E] text-[13px] tracking-widest mb-4">⚙️ SETTING GLOBAL - HARGA & MASA AKTIF (BISA DIUBAH KAPAN AJA)</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-black text-[#FFD700] tracking-widest">HARGA DEFAULT (Rp)</label>
              <input type="number" value={harga} onChange={e=>setHarga(parseInt(e.target.value)||0)} className="mt-2 w-full h-12 bg-[#1E1E1E] border-2 border-[#FFD700]/40 rounded-[12px] px-3 font-black text-white text-[18px]" />
              <p className="text-[10px] text-white/50 mt-1">Harga jual sekarang: {new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(harga)}</p>
            </div>
            <div>
              <label className="text-[10px] font-black text-[#FFD700] tracking-widest">MASA AKTIF (HARI)</label>
              <select value={durasi} onChange={e=>setDurasi(parseInt(e.target.value))} className="mt-2 w-full h-12 bg-[#1E1E1E] border-2 border-[#22C55E]/40 rounded-[12px] px-3 font-black text-[#22C55E] text-[16px]">
                <option value={30}>30 Hari (1 Bulan)</option>
                <option value={60}>60 Hari (2 Bulan)</option>
                <option value={90}>90 Hari (3 Bulan) - REKOMENDASI</option>
                <option value={180}>180 Hari (6 Bulan)</option>
                <option value={365}>365 Hari (1 Tahun)</option>
              </select>
              <p className="text-[10px] text-[#22C55E] font-black mt-1">{durasi} hari = {Math.round(durasi/30)} bulan</p>
            </div>
            <div className="flex flex-col justify-end gap-2">
              <button onClick={saveSettings} disabled={saving} className="w-full h-12 bg-[#22C55E] text-black border-2 border-black rounded-[12px] font-black text-[12px] shadow-[3px_3px_0px_0px_black]">{saving?"⏳ SIMPAN...":`💾 SIMPAN SETTING Rp ${harga.toLocaleString()} - ${durasi} HARI`}</button>
              <button onClick={fixHargaLama} className="w-full h-8 bg-black border-2 border-[#FFD700] text-[#FFD700] rounded-[10px] font-black text-[10px]">🔧 FIX VOUCHER LAMA JADI Rp {harga.toLocaleString()}</button>
            </div>
          </div>
        </div>

        {stats.grouped && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {Object.entries(stats.grouped).map(([k,v]:any)=>(
              <div key={k} className="bg-[#111] border-2 border-white/10 rounded-[12px] p-3">
                <p className="text-[10px] font-black text-white/60">{k}</p>
                <p className="text-[14px] font-black text-[#FFD700]">{v.count} voucher</p>
                <p className="text-[10px] text-green-400">{v.available} available • {v.used} used</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#111] border-2 border-[#FFD700] rounded-[16px] p-4">
            <label className="text-[10px] font-black text-[#FFD700]">PILIH PAKET</label>
            <select value={paket} onChange={e=>setPaket(e.target.value)} className="mt-2 w-full h-12 bg-[#1E1E1E] border-2 border-[#FFD700]/40 rounded-[12px] px-3 font-black text-[#FFD700]">
              <option value="bsj-sd1">BSJ-SD1 - Kelas 1</option><option value="bsj-sd2">BSJ-SD2 - Kelas 2</option><option value="bsj-sd3">BSJ-SD3 - Kelas 3</option><option value="bsj-sd4">BSJ-SD4 - Kelas 4</option><option value="bsj-sd5">BSJ-SD5 - Kelas 5</option><option value="bsj-sd6">BSJ-SD6 - Kelas 6</option>
            </select>
          </div>
          <div className="bg-[#111] border-2 border-[#FFD700] rounded-[16px] p-4">
            <label className="text-[10px] font-black text-[#FFD700]">JUMLAH VOUCHER</label>
            <input type="number" value={jumlah} onChange={e=>setJumlah(parseInt(e.target.value)||0)} className="mt-2 w-full h-12 bg-[#1E1E1E] border-2 border-[#FFD700]/40 rounded-[12px] px-3 font-black text-white text-[20px]" />
            <p className="text-[10px] text-[#FFD700] font-black mt-1">Total nilai: Rp {(jumlah*harga).toLocaleString('id-ID')} (Rp {harga.toLocaleString()} x {jumlah} - {durasi} hari)</p>
          </div>
          <div className="bg-[#111] border-2 border-[#FFD700] rounded-[16px] p-4 flex flex-col justify-center">
            <button onClick={generate} disabled={loading} className="w-full h-12 bg-[#FFD700] text-black border-2 border-black rounded-[12px] font-black text-[13px] shadow-[3px_3px_0px_0px_black]">{loading?"⏳ GENERATE...":`🚀 GENERATE ${jumlah} x Rp ${harga.toLocaleString()} ${durasi}HARI`}</button>
            {result.length>0 && <div className="grid grid-cols-2 gap-2 mt-3"><button onClick={exportCSV} className="h-9 bg-white text-black border-2 border-black rounded-[10px] font-black text-[10px]">📊 EXPORT CSV</button><button onClick={()=>window.print()} className="h-9 bg-black border-2 border-[#FFD700] text-[#FFD700] rounded-[10px] font-black text-[10px]">🖨️ CETAK</button></div>}
          </div>
        </div>

        {log && <div className="bg-[#064E3B] border-2 border-[#FFD700] rounded-[12px] p-3 text-[12px] font-black text-[#FFD700] mb-4">{log}</div>}

        {result.length>0 && (
          <div className="bg-[#111] border-[3px] border-[#FFD700] rounded-[16px] overflow-hidden">
            <div className="p-3 bg-[#FFD700] text-black font-black text-[12px]">📦 {result.length} VOUCHER {paket.toUpperCase()} @ {new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(harga)} - {durasi} HARI - SIAP JUAL!</div>
            <div className="max-h-[500px] overflow-auto"><table className="w-full text-[11px]"><thead className="bg-black sticky top-0"><tr className="text-[#FFD700] text-[10px]"><th className="p-2 text-left">No</th><th className="p-2 text-left">Kode</th><th className="p-2">Paket</th><th className="p-2">Nominal</th><th className="p-2">Durasi</th><th className="p-2">Status</th></tr></thead><tbody>{result.map((r,i)=><tr key={r.code} className="border-b border-white/10"><td className="p-2">{i+1}</td><td className="p-2 font-mono font-black text-[#FFD700]">{r.code}</td><td className="p-2 text-center">{r.paket}</td><td className="p-2 text-center">Rp {r.nominal?.toLocaleString()}</td><td className="p-2 text-center">{r.durasi_hari} hari</td><td className="p-2 text-center"><span className="bg-green-900 text-green-300 rounded-full px-2 py-0.5 text-[9px]">{r.status}</span></td></tr>)}</tbody></table></div>
          </div>
        )}
      </div>
    </div>
  )
}
