"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminKodePage(){
  const [vouchers,setVouchers]=useState<any[]>([]);
  const [search,setSearch]=useState("");
  const [filterPaket,setFilterPaket]=useState("all");
  const [filterStatus,setFilterStatus]=useState("all");
  const [loading,setLoading]=useState(true);

  useEffect(()=>{ load(); },[]);

  const load = async()=>{
    setLoading(true);
    const { data } = await supabase.from("vouchers").select("*").order("created_at",{ascending:false}).limit(500);
    if(data) setVouchers(data);
    setLoading(false);
  };

  const filtered = vouchers.filter(v=>{
    const matchSearch = !search || v.code?.toLowerCase().includes(search.toLowerCase());
    const matchPaket = filterPaket==="all" || v.paket===filterPaket;
    const matchStatus = filterStatus==="all" || v.status===filterStatus;
    return matchSearch && matchPaket && matchStatus;
  });

  const copyText = (code:string, paket:string, nominal:number)=>{
    const text = `✅ Voucher Bimbel Super Juara Aktif!

Kode: *${code}*
Paket: ${paket.toUpperCase()} - 900 Soal KurMer 2025
Harga: Rp ${nominal?.toLocaleString('id-ID')}

Cara pakai:
1. Buka: https://bimbel-super-juara.vercel.app/redeem
2. Masukkan kode: ${code}
3. Langsung akses soal + score + penjelasan

WA Admin: 081770220059`;
    navigator.clipboard.writeText(text);
    alert("Teks WA disalin!");
  };

  const paketList = Array.from(new Set(vouchers.map(v=>v.paket)));

  return (
    <div className="min-h-screen bg-[#FFFEF5] p-4">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div>
            <h1 className="font-black text-[20px]">📋 Daftar Voucher - {vouchers.length} kode</h1>
            <p className="text-[11px] opacity-60">Tabel: <b>public.vouchers</b> | Cek di Supabase → Table Editor → vouchers (seperti screenshot kamu)</p>
          </div>
          <div className="flex gap-2">
            <a href="/admin" className="rounded-full bg-[#0E2A6B] text-white px-4 py-2 text-[12px] font-bold">← Buat Voucher Baru (/admin)</a>
            <button onClick={load} className="rounded-full bg-white border px-4 py-2 text-[12px] font-bold">🔄 Refresh</button>
          </div>
        </div>

        <div className="mt-5 bg-white rounded-[16px] border p-4 flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-[10px] font-black tracking-widest opacity-60">CARI KODE (contoh: 455E)</label>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Ketik code..." className="mt-1 w-full rounded-full border px-4 py-2.5 text-[13px]" />
          </div>
          <div>
            <label className="text-[10px] font-black tracking-widest opacity-60">FILTER PAKET</label>
            <select value={filterPaket} onChange={e=>setFilterPaket(e.target.value)} className="mt-1 rounded-full border px-3 py-2.5 text-[12px] font-bold">
              <option value="all">Semua Paket</option>
              {paketList.map(p=><option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black tracking-widest opacity-60">STATUS</label>
            <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} className="mt-1 rounded-full border px-3 py-2.5 text-[12px] font-bold">
              <option value="all">Semua</option>
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="USED">USED</option>
            </select>
          </div>
        </div>

        <div className="mt-4 bg-white rounded-[16px] border overflow-hidden">
          {loading ? <div className="p-10 text-center text-[13px] opacity-60">Loading vouchers...</div> : (
            <div className="overflow-auto max-h-[70vh]">
              <table className="w-full text-[12px]">
                <thead className="bg-[#0E2A6B] text-white text-[11px] sticky top-0">
                  <tr><th className="p-2.5 text-left">No</th><th className="p-2.5 text-left">Code</th><th className="p-2.5">Paket</th><th className="p-2.5">Nominal</th><th className="p-2.5">Status</th><th className="p-2.5">Durasi</th><th className="p-2.5">Aksi</th></tr>
                </thead>
                <tbody>
                  {filtered.map((v,i)=>(
                    <tr key={v.id} className="border-b hover:bg-[#FFFEF5]">
                      <td className="p-2.5">{i+1}</td>
                      <td className="p-2.5 font-mono font-black text-[#0E2A6B]">{v.code}</td>
                      <td className="p-2.5 text-center font-bold">{v.paket}</td>
                      <td className="p-2.5 text-center">Rp {v.nominal?.toLocaleString('id-ID')}</td>
                      <td className="p-2.5 text-center"><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${v.status==="AVAILABLE" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>{v.status}</span></td>
                      <td className="p-2.5 text-center text-[11px]">{v.durasi_hari ? `${v.durasi_hari} hr` : "-"}</td>
                      <td className="p-2.5 flex gap-1 justify-center">
                        <button onClick={()=>{navigator.clipboard.writeText(v.code); alert("Kode disalin");}} className="rounded-full bg-black/5 px-2.5 py-1 text-[10px] font-bold">Copy</button>
                        <button onClick={()=>copyText(v.code, v.paket, v.nominal)} className="rounded-full bg-[#FF8C00] text-white px-2.5 py-1 text-[10px] font-bold">WA</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length===0 && <div className="p-10 text-center text-[12px] opacity-50">Tidak ada hasil untuk filter "{search}" — klik Remove all filters di Supabase seperti di screenshot kamu, atau di sini ganti filter jadi Semua</div>}
            </div>
          )}
        </div>

        <div className="mt-4 rounded-[16px] bg-[#0E2A6B] text-white p-4 text-[11px] leading-relaxed">
          <b>Posisi cek tabel yang kamu tanya (info posisi untuk cek tabel):</b><br/>
          1. Buka supabase.com → Login → Pilih project <b>bimbel-super-juara</b> (zmvwcennxyzzbmkarzuj)<br/>
          2. Kiri: <b>Table Editor</b> → Cari tabel <b>public.vouchers</b> (paling bawah seperti di screenshot kamu)<br/>
          3. Kalau kamu filter code ~ 455E dan muncul "The filters have returned no results" → klik <b>Remove all filters</b> (tombol putih di tengah) → semua voucher akan muncul lagi<br/>
          4. Kolom penting: <b>code</b> (kode voucher), <b>paket</b> (bsj-sd1 ... bsj-sd6), <b>nominal</b> (17000), <b>status</b> (AVAILABLE/USED)
        </div>
      </div>
    </div>
  );
}
