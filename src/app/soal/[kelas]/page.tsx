"use client";
export const dynamic = 'force-dynamic';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function DashboardKelas() {
  const params = useParams();
  const kelas = (params?.kelas as string) || "sd1";
  const kelasId = `bsj-${kelas.toLowerCase()}`;
  const [soalList, setSoalList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await supabase.from("soal").select("mapel, is_free").ilike("kelas", `%${kelasId}%`).limit(1000);
      setSoalList(data || []);
      setLoading(false);
    };
    fetchStats();
  }, [kelasId]);

  if(loading) return <div style={{padding:40, textAlign:"center", fontWeight:900}}>Loading {kelas.toUpperCase()}...</div>;

  const premium = soalList.filter((s:any)=>!s.is_free);
  const mapels = [...new Set(premium.map((s:any)=>s.mapel))].sort() as string[];
  const total = premium.length || 600;

  const warna:any = { "Matematika":"#2563eb", "Bahasa Indonesia":"#16a34a", "IPAS":"#9333ea", "PPKn":"#ea580c", "Bahasa Inggris":"#db2777" };

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh" }}>
      <div style={{ background: "white", padding: "12px 20px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.08)", position: "sticky", top: 0, zIndex: 10 }}>
        <Link href="/"><img src="/mrh-logo.png" alt="MRH" style={{ height: 45, width: "auto" }} /></Link>
        <div>
          <h1 style={{ color: "#15803d", fontWeight: 900, fontSize: 20, margin: 0 }}>DASHBOARD {kelas.toUpperCase()}</h1>
          <p style={{ color: "#1e3a8a", fontWeight: 600, fontSize: 12, margin: 0 }}>{total} Soal Premium • {mapels.length} Mapel @120</p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
        <div style={{ background: "#f8fafc", border: "2px solid #000", borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontWeight: 800, fontSize: 14 }}>PROGRESS BELAJAR</span><span style={{ fontWeight: 800 }}>41%</span></div>
          <div style={{ background: "#e2e8f0", height: 12, borderRadius: 20, marginTop:8 }}><div style={{ background: "#22c55e", width: "41%", height: "100%", borderRadius:20 }}></div></div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16, marginBottom: 24 }}>
          {mapels.map((m) => {
            const jml = premium.filter((s:any)=>s.mapel===m).length;
            return (
              <div key={m} style={{ background: "white", border: "2px solid #000", borderRadius: 12, padding: 16, boxShadow: "4px 4px 0px #000" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 28 }}>📘</span><span style={{ background: warna[m]||"#000", color: "white", fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 20 }}>{jml} SOAL</span></div>
                <h3 style={{ fontWeight: 900, fontSize: 16, margin: "8px 0 4px 0" }}>{m}</h3>
                <p style={{ fontSize: 12, color: "#64748b" }}>{jml} Soal • HOTS • Kunci + Pembahasan</p>
              </div>
            )
          })}
        </div>

        <Link href={`/soal/${kelas}/latihan`} style={{ textDecoration: "none" }}>
          <div style={{ background: "#facc15", border: "3px solid #000", borderRadius: 16, padding: 20, textAlign: "center", boxShadow: "6px 6px 0px #000" }}>
            <h2 style={{ fontWeight: 900, fontSize: 20, margin: 0 }}>🚀 MASUK LATIHAN {total} SOAL</h2>
          </div>
        </Link>
      </div>
    </div>
  );
}