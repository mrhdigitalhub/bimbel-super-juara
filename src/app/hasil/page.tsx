"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function HasilPage() {
  const params = useSearchParams();
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(30);
  const waNumber = "6281770220059";

  useEffect(() => {
    const s = parseInt(params.get("score") || localStorage.getItem("skor_free") || "0");
    const t = parseInt(params.get("total") || "30");
    setScore(s);
    setTotal(t);
  }, [params]);

  const persen = total > 0 ? Math.round((score / total) * 100) : 0;
  let pesan = "";
  let emoji = "";
  if (persen >= 80) { pesan = "LUAR BIASA! Kamu Calon Juara TKA!"; emoji = "🏆"; }
  else if (persen >= 60) { pesan = "KEREN! Tinggal sedikit lagi jadi Juara!"; emoji = "🔥"; }
  else if (persen >= 40) { pesan = "Bagus! Terus latihan biar makin jago!"; emoji = "💪"; }
  else { pesan = "Semangat! Latihan lagi, kamu pasti bisa!"; emoji = "🌟"; }

  const waText = `Halo kak, saya barusan coba FREE TRIAL 30 soal, skor saya ${score}/${total} (${persen}%). Saya mau lanjut beli PAKET LENGKAP 600 SOAL TKA SD seharga Rp 20.000 dong!`;
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;

  return (
    <div style={{background:"#fef9c3", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:20}}>
      <div style={{background:"white", maxWidth:480, width:"100%", borderRadius:20, padding:24, boxShadow:"0 8px 30px rgba(0,0,0,0.12)", textAlign:"center", border:"3px solid #16a34a"}}>
        <div style={{fontSize:60}}>{emoji}</div>
        <h1 style={{fontSize:28, fontWeight:900, color:"#1e293b", margin:"8px 0"}}>SKOR KAMU!</h1>
        <div style={{background:"#f0fdf4", border:"2px dashed #16a34a", borderRadius:16, padding:16, margin:"16px 0"}}>
          <div style={{fontSize:52, fontWeight:900, color:"#16a34a", lineHeight:1}}>{score} / {total}</div>
          <div style={{fontSize:22, fontWeight:800, color:"#15803d"}}>{persen}% Benar</div>
          <p style={{fontWeight:700, color:"#1e293b", marginTop:8}}>{pesan}</p>
        </div>

        <div style={{textAlign:"left", background:"#eff6ff", borderRadius:12, padding:12, fontSize:13, margin:"16px 0"}}>
          <b style={{color:"#1e40af"}}>🎯 Yang kamu coba barusan:</b>
          <div>✅ 30 Soal TKA SD (FREE TRIAL)</div>
          <div style={{marginTop:6}}><b style={{color:"#dc2626"}}>🔥 Yang belum kamu coba:</b></div>
          <div>📚 600 Soal Lengkap TKA Kelas 1-6</div>
          <div>✅ Kunci Jawaban + Pembahasan</div>
          <div>📊 Latihan Per Kelas (100 soal/kelas)</div>
        </div>

        <a href={waLink} target="_blank" style={{display:"block", background:"#22c55e", color:"white", padding:"14px", borderRadius:30, fontWeight:900, fontSize:16, textDecoration:"none", marginTop:12, boxShadow:"0 4px 12px rgba(34,197,94,0.4)"}}>
          🛒 LANJUT BELI 600 SOAL - Rp 20.000
        </a>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:10}}>
          <a href="/soal?kode=BSJ-SD-FREE" style={{display:"block", background:"#e5e7eb", color:"#374151", padding:"10px", borderRadius:20, fontWeight:700, textDecoration:"none", fontSize:13}}>
            🔄 Ulangi Trial
          </a>
          <a href="/" style={{display:"block", background:"white", border:"2px solid #2563eb", color:"#2563eb", padding:"10px", borderRadius:20, fontWeight:700, textDecoration:"none", fontSize:13}}>
            🏠 Pilih Kelas Lain
          </a>
        </div>
        <p style={{fontSize:11, color:"#6b7280", marginTop:14}}>Bimbel Super Juara - Belajar lebih terarah, Hadapi TKA Lebih Percaya Diri</p>
      </div>
    </div>
  );
}
