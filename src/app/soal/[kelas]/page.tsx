"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function DashboardKelas() {
  const params = useParams();
  const kelas = params.kelas as string;
  const [stats, setStats] = useState({ mtk: 0, indo: 0, ipa: 0, total: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const { count } = await supabase.from("soal").select("*", { count: "exact", head: true }).eq("kelas", kelas.toLowerCase()).eq("is_free", false)
      setStats({ mtk: 200, indo: 200, ipa: 200, total: count || 600 });
    };
    fetchStats();
  }, [kelas]);

  const mapel = [
    { kode: "mtk", nama: "Matematika", icon: "🔢", color: "#2563eb", done: 45 },
    { kode: "indo", nama: "B. Indonesia", icon: "📖", color: "#16a34a", done: 120 },
    { kode: "ipa", nama: "IPA Terpadu", icon: "🔬", color: "#9333ea", done: 78 },
  ];

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "white", padding: "12px 20px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 10 }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <img src="/mrh-logo.png" alt="MRH" style={{ height: 45, width: "auto" }} />
        </Link>
        <div>
          <h1 style={{ color: "#15803d", fontWeight: 900, fontSize: 20, margin: 0 }}>DASHBOARD {kelas.toUpperCase()}</h1>
          <p style={{ color: "#1e3a8a", fontStyle: "italic", fontWeight: 600, fontSize: 12, margin: 0 }}>{stats.total} Soal Premium Siap Latihan</p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
        {/* Progress Bar Total */}
        <div style={{ background: "#f8fafc", border: "2px solid #000", borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontWeight: 800, fontSize: 14 }}>PROGRESS BELAJAR</span>
            <span style={{ fontWeight: 800, fontSize: 14 }}>{Math.round((45+120+78)/6)}%</span>
          </div>
          <div style={{ background: "#e2e8f0", height: 12, borderRadius: 20, overflow: "hidden" }}>
            <div style={{ background: "#22c55e", width: "40%", height: "100%", borderRadius: 20 }}></div>
          </div>
          <p style={{ fontSize: 12, marginTop: 8, color: "#64748b" }}>243 dari 600 soal sudah dikerjakan</p>
        </div>

        {/* 3 Card Mapel */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16, marginBottom: 24 }}>
          {mapel.map((m) => (
            <div key={m.kode} style={{ background: "white", border: "2px solid #000", borderRadius: 12, padding: 16, boxShadow: "4px 4px 0px #000" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 28 }}>{m.icon}</span>
                <span style={{ background: m.color, color: "white", fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 20 }}>{m.kode.toUpperCase()}</span>
              </div>
              <h3 style={{ fontWeight: 900, fontSize: 16, margin: "0 0 4px 0" }}>{m.nama}</h3>
              <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 12px 0" }}>{m.kode === "mtk"? "200" : m.kode === "indo"? "200" : "200"} Soal • Target TKA</p>
              <div style={{ background: "#f1f5f9", height: 8, borderRadius: 10, overflow: "hidden", marginBottom: 6 }}>
                <div style={{ background: m.color, width: `${(m.done / 200) * 100}%`, height: "100%" }}></div>
              </div>
              <p style={{ fontSize: 11, fontWeight: 700 }}>{m.done}/200 selesai</p>
            </div>
          ))}
        </div>

        {/* CTA Utama */}
        <Link href={`/soal/${kelas.toLowerCase()}/latihan`} style={{ textDecoration: "none" }}>
          <div style={{ background: "#facc15", border: "3px solid #000", borderRadius: 16, padding: 20, textAlign: "center", boxShadow: "6px 6px 0px #000", cursor: "pointer" }}>
            <h2 style={{ fontWeight: 900, fontSize: 20, margin: 0, color: "#000" }}>🚀 MASUK LATIHAN 600 SOAL</h2>
            <p style={{ fontSize: 13, fontWeight: 700, margin: "6px 0 0 0", color: "#000" }}>Kerjakan semua mapel • Style FREE putih bersih</p>
          </div>
        </Link>

        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <Link href="/free" style={{ flex: 1, background: "white", border: "2px solid #000", borderRadius: 12, padding: 12, textAlign: "center", textDecoration: "none", color: "#000", fontWeight: 800, fontSize: 13 }}>← Coba FREE 30 Soal</Link>
          <Link href="/hasil" style={{ flex: 1, background: "white", border: "2px solid #000", borderRadius: 12, padding: 12, textAlign: "center", textDecoration: "none", color: "#000", fontWeight: 800, fontSize: 13 }}>📊 Lihat Hasil</Link>
        </div>
      </div>
    </div>
  );
}