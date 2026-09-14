"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
function rand(len=4){ const c="ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; let r=""; for(let i=0;i<len;i++) r+=c[Math.floor(Math.random()*c.length)]; return r; }

export default function Admin(){
  const [paket,setPaket]=useState("bsj-sd1");
  const [jumlah,setJumlah]=useState(20);
  const [harga,setHarga]=useState(17000);
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState<any[]>([]);
  const [log,setLog]=useState("");
  const [stats,setStats]=useState<any>({total:0});

  useEffect(()=>{ loadStats(); },[]);

  const loadStats = async()=>{
    const { data } = await supabase.from("vouchers").select("paket, nominal, status");
    if(data){
      const grouped:any={};
      data.forEach((v:any)=>{
        const k=`${v.paket} | Rp ${v.nominal}`;
        if(!grouped[k]) grouped[k]={count:0, available:0, used:0};
        grouped[k].count++;
        if(v.status==="AVAILABLE") grouped[k].available++;
        else grouped[k].used++;
      });
      setStats({total:data.length, grouped});
    }
  };

  const generate = async()=>{
    setLoading(true);
    setLog(`🚀 Generate ${jumlah} voucher ${paket.toUpperCase()} @ Rp ${harga.toLocaleString('id-ID')}...`);
    const batch:any[]=[];
    for(let i=0;i<jumlah;i++){
      const code=`BSJ-${paket.replace('bsj-','').toUpperCase()}-${rand(4)}`;
      // SINKRON 100% dengan screenshot kamu: id, code, nominal, paket, status
      batch.push({ code, paket, nominal: harga, status: "AVAILABLE" });
    }
    const { data, error } = await supabase.from("vouchers").insert(batch).select();
    if(error){ setLog(`❌ Error: ${error.message}`); setLoading(false); return; }
    setResult(data||batch);
    setLog(`✅ BERHASIL! ${data?.length} voucher ${paket.toUpperCase()} @ Rp ${harga.toLocaleString('id-ID')} masuk ke public.vouchers! Total sekarang: ${stats.total + (data?.length||0)}`);
    loadStats();
    setLoading(false);
  };

  const exportCSV=()=>{
    if(!result.length) return;
    let csv="code,paket,nominal,status,link_redeem\n";
    result.forEach(r=>{ csv+=`${r.code},${r.paket},${r.nominal},${r.status},https://bimbel-super-juara.vercel.app/redeem?code=${r.code}\n`; });
    const blob=new Blob([csv],{type:'text/csv'}); const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download=`VOUCHER-${paket.toUpperCase()}-${result.length}x${harga}.csv`; a.click();
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5] p-4">
      <div className="max-w-[1100px] mx-auto">
        <header className="bg-[#0E2A6B] rounded-[16px] p-4 flex justify-between items-center text-white">
          <div className="flex gap-3 items-center"><div className="bg-[#FF8C00] w-8 h-8 rounded-full flex items-center justify-center font-black">M</div><div><p className="font-black text-[14px]">ADMIN - VOUCHER GENERATOR</p><p className="text-[10px] opacity-60">Tabel: public.vouchers (704 records) - id, code, nominal, paket, status - SINKRON 100%</p></div></div>
          <div className="flex gap-2"><a href="/admin/kode" className="bg-white text-[#0E2A6B] rounded-full px-3 py-1.5 font-black text-[11px]">📋 LIHAT {stats.total} VOUCHER →</a></div>
        </header>

        {stats.grouped && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
            {Object.entries(stats.grouped).map(([k,v]:any)=>(
              <div key={k} className="bg-white border rounded-[12px] p-3"><p className="text-[10px] font-black opacity-60">{k}</p><p className="text-[14px] font-black">{v.count} voucher</p><p className="text-[10px] text-green-600 font-bold">{v.available} AVAILABLE • {v.used} USED</p></div>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white border rounded-[16px] p-4"><label className="text-[10px] font-black opacity-60">PAKET</label><select value={paket} onChange={e=>setPaket(e.target.value)} className="mt-2 w-full h-12 bg-[#FFFEF5] border rounded-[12px] px-3 font-black"><option value="bsj-sd1">BSJ-SD1 - Kelas 1</option><option value="bsj-sd2">BSJ-SD2 - Kelas 2</option><option value="bsj-sd3">BSJ-SD3 - Kelas 3</option><option value="bsj-sd4">BSJ-SD4 - Kelas 4</option><option value="bsj-sd5">BSJ-SD5 - Kelas 5</option><option value="bsj-sd6">BSJ-SD6 - Kelas 6</option><option value="bsj-all">BSJ-ALL - Lengkap 5400 Soal</option></select></div>
          <div className="bg-white border rounded-[16px] p-4"><label className="text-[10px] font-black opacity-60">JUMLAH</label><input type="number" value={jumlah} onChange={e=>setJumlah(parseInt(e.target.value)||0)} className="mt-2 w-full h-12 bg-[#FFFEF5] border rounded-[12px] px-3 font-black text-[20px]" /><p className="text-[10px] font-bold mt-1">Total: Rp {(jumlah*harga).toLocaleString('id-ID')}</p></div>
          <div className="bg-white border rounded-[16px] p-4"><label className="text-[10px] font-black opacity-60">HARGA (Rp)</label><input type="number" value={harga} onChange={e=>setHarga(parseInt(e.target.value)||0)} className="mt-2 w-full h-12 bg-[#FFFEF5] border rounded-[12px] px-3 font-black text-[18px]" /><button onClick={generate} disabled={loading} className="mt-3 w-full h-10 bg-[#FF8C00] text-white rounded-[12px] font-black text-[12px]">{loading?"⏳...":`🚀 GENERATE ${jumlah}x`}</button></div>
        </div>

        {log && <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-[12px] p-3 text-[12px] font-bold text-emerald-800">{log}</div>}

        {result.length>0 && (
          <div className="mt-4 bg-white border rounded-[16px] overflow-hidden">
            <div className="p-3 bg-[#0E2A6B] text-white font-black text-[12px] flex justify-between"><span>📦 {result.length} VOUCHER BARU - SIAP JUAL!</span><button onClick={exportCSV} className="bg-white text-[#0E2A6B] rounded-full px-3 py-1 text-[10px]">📊 EXPORT CSV</button></div>
            <div className="max-h-[400px] overflow-auto"><table className="w-full text-[11px]"><thead className="bg-[#FFFEF5] sticky top-0"><tr><th className="p-2 text-left">No</th><th className="p-2 text-left">Code</th><th className="p-2">Paket</th><th className="p-2">Nominal</th><th className="p-2">Status</th></tr></thead><tbody>{result.map((r,i)=><tr key={r.code} className="border-b"><td className="p-2">{i+1}</td><td className="p-2 font-mono font-black text-[#0E2A6B]">{r.code}</td><td className="p-2 text-center">{r.paket}</td><td className="p-2 text-center">Rp {r.nominal?.toLocaleString()}</td><td className="p-2 text-center"><span className="bg-green-100 text-green-700 rounded-full px-2 py-0.5 text-[9px] font-bold">{r.status}</span></td></tr>)}</tbody></table></div>
          </div>
        )}
      </div>
    </div>
  )
}
