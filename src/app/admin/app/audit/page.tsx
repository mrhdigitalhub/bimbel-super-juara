"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuditPage() {
  const [soals, setSoals] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const run = async () => {
      const paketId = "c112aca3-3bfe-4849-84c2-a98787ede5d6";
      const { data } = await supabase.from("soals").select("*").eq("paket_id", paketId).limit(30);
      if (!data) return;
      setSoals(data);
      const hasil = data.map((s: any, i: number) => {
        const teks = s.pertanyaan || s.soal || "";
        let hitung: number | null = null;
        let opsiBenar: string | null = null;
        const m = teks.match(/(\d+)\s*dus.*?isi\s*(\d+).*?(\d+)\s*kue dimakan/i) || teks.match(/membeli\s*(\d+).*?isi\s*(\d+).*?(\d+)\s*dimakan/i) || teks.match(/(\d+)\s*x\s*(\d+).*?(\d+)/);
        if (m) {
          const dus = parseInt(m[1]); const isi = parseInt(m[2]); const dimakan = parseInt(m[3]);
          if (!isNaN(dus) && !isNaN(isi) && !isNaN(dimakan)) {
            hitung = dus * isi - dimakan;
            const map: any = { A: s.opsi_a, B: s.opsi_b, C: s.opsi_c, D: s.opsi_d };
            for (let k in map) { if (map[k] && parseInt(map[k]) === hitung) opsiBenar = k; }
          }
        }
        // Cek pola lain: 25x15=375, 375-5=370
        if (hitung === null) {
          const m2 = s.pembahasan?.match(/(\d+)\s*x\s*(\d+)\s*=\s*(\d+).*?(\d+)\s*-\s*(\d+)\s*=\s*(\d+)/i);
          if (m2) { hitung = parseInt(m2[6]); const map: any = { A: s.opsi_a, B: s.opsi_b, C: s.opsi_c, D: s.opsi_d }; for (let k in map) { if (map[k] && parseInt(map[k]) === hitung) opsiBenar = k; } }
        }
        const kunci = (s.kunci_jawaban || "").toString().trim().toUpperCase();
        let status = "OK";
        if (!kunci) status = "KOSONG!";
        else if (opsiBenar && kunci !== opsiBenar) status = `SALAH! DB:${kunci} harusnya ${opsiBenar} (${hitung})`;
        return { no: i + 1, teks: teks.substring(0, 100), opsi_a: s.opsi_a, opsi_b: s.opsi_b, opsi_c: s.opsi_c, opsi_d: s.opsi_d, kunci, hitung, opsiBenar, status, id: s.id, pembahasan: s.pembahasan };
      });
      setLogs(hasil);
    };
    run();
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: "Nunito, sans-serif", background: "#fef9c3", minHeight: "100vh" }}>
      <h1>🔍 AUDIT 30 SOAL FREE TRIAL</h1>
      <div style={{ background: "white", padding: 16, borderRadius: 12, marginBottom: 20 }}>
        <b>Total: {soals.length} soal | Kosong: {logs.filter((l: any) => l.status.includes("KOSONG")).length} | Salah: {logs.filter((l: any) => l.status.includes("SALAH")).length}</b>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: 12, overflow: "hidden" }}>
        <thead style={{ background: "#16a34a", color: "white" }}><tr><th style={{ padding: 8 }}>No</th><th>Soal</th><th>Opsi</th><th>Kunci DB</th><th>Hitung</th><th>Status</th><th>SQL Fix</th></tr></thead>
        <tbody>
          {logs.map((l: any) => (
            <tr key={l.no} style={{ borderBottom: "1px solid #ddd", background: l.status.includes("KOSONG") ? "#fef3c7" : l.status.includes("SALAH") ? "#fee2e2" : "white" }}>
              <td style={{ padding: 8 }}>{l.no}</td>
              <td style={{ padding: 8, fontSize: 12 }}>{l.teks}...<br/><small style={{ color: "#6b7280" }}>{l.pembahasan?.substring(0, 80)}</small></td>
              <td style={{ padding: 8, fontSize: 12 }}>A:{l.opsi_a} B:{l.opsi_b} C:{l.opsi_c} D:{l.opsi_d}</td>
              <td style={{ padding: 8, fontWeight: 800 }}>{l.kunci || "(KOSONG)"}</td>
              <td style={{ padding: 8 }}>{l.hitung ? `${l.hitung} => ${l.opsiBenar}` : "-"}</td>
              <td style={{ padding: 8, fontWeight: 700, color: l.status.includes("OK") ? "#16a34a" : "#dc2626" }}>{l.status}</td>
              <td style={{ padding: 8, fontSize: 10 }}>{l.status.includes("SALAH") || l.status.includes("KOSONG") ? `UPDATE soals SET kunci_jawaban='${l.opsiBenar}' WHERE id='${l.id}';` : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 20, background: "white", padding: 16, borderRadius: 12 }}>
        <h3>Copy SQL FIX untuk Supabase:</h3>
        <pre style={{ background: "#1f2937", color: "#10b981", padding: 16, borderRadius: 8, overflow: "auto", fontSize: 11 }}>
          {logs.filter((l: any) => l.status.includes("SALAH") || l.status.includes("KOSONG")).map((l: any) => `UPDATE soals SET kunci_jawaban='${l.opsiBenar}' WHERE id='${l.id}'; -- No ${l.no} ${l.hitung}`).join("\n")}
        </pre>
      </div>
    </div>
  );
}
