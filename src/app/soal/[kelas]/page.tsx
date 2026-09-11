"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function KelasDashboard() {
  const params = useParams();
  const kelas = (params.kelas as string)?.toLowerCase() || "";
  const [totalScore, setTotalScore] = useState<any>(null);
  const [perMapel, setPerMapel] = useState<any[]>([]);
  const [perBab, setPerBab] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScores() {
      setLoading(true);
      const { data: total } = await supabase.from("total_score_kelas").select("*").eq("kelas", kelas).single();
      const { data: mapel } = await supabase.from("score_per_mapel").select("*").eq("kelas", kelas);
      const { data: bab } = await supabase.from("skor_bab").select("*").eq("kelas", kelas).order("created_at", { ascending: false }).limit(30);
      setTotalScore(total);
      setPerMapel(mapel || []);
      setPerBab(bab || []);
      setLoading(false);
    }
    fetchScores();
  }, [kelas]);

  if (loading) return <div className="p-8 text-center">Loading total score {kelas}...</div>;

  const totalBAB = 5 * 6; // 5 mapel x 6 bab = 30 BAB per kelas
  const progress = totalScore ? Math.round((totalScore.total_bab_dikerjakan / totalBAB) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{kelas.toUpperCase()} - Dashboard Score</h1>

      {/* TOTAL SCORE KELAS */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-2xl mb-6 shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm opacity-80">Total Score Kelas</div>
            <div className="text-5xl font-bold">{totalScore?.total_score_kelas || 0}%</div>
            <div className="text-sm mt-2">{totalScore?.total_bab_dikerjakan || 0} / {totalBAB} BAB selesai ({progress}%) • Benar {totalScore?.total_benar || 0} / {totalScore?.total_soal || 0}</div>
          </div>
          <div className="text-right">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-3xl font-bold">{progress}%</div>
            <div className="text-xs mt-2">Progress</div>
          </div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3 mt-4"><div className="bg-white h-3 rounded-full" style={{ width: `${progress}%` }}></div></div>
      </div>

      {/* SCORE PER MAPEL */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {["PPKN","B. INDONESIA","MTK","IPAS","PAI"].map((mapelName) => {
          const data = perMapel.find((m: any) => m.mapel === mapelName || (mapelName === "B. INDONESIA" && m.mapel === "BINDO"));
          const skor = data?.rata_mapel || 0;
          const selesai = data?.bab_selesai || 0;
          return (
            <div key={mapelName} className="bg-white p-4 rounded-xl shadow border">
              <div className="text-xs text-gray-500">{mapelName}</div>
              <div className="text-2xl font-bold">{skor}%</div>
              <div className="text-xs">{selesai}/6 BAB</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(selesai/6)*100}%` }}></div></div>
              <a href={`/soal/${kelas}/latihan?mapel=${encodeURIComponent(mapelName)}&bab=1`} className="text-xs text-blue-500 mt-2 inline-block">Kerjakan →</a>
            </div>
          );
        })}
      </div>

      {/* HISTORY PER BAB */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-bold mb-4">History Score Per BAB (Terbaru)</h2>
        <div className="space-y-2">
          {perBab.length === 0 && <div className="text-sm text-gray-500">Belum ada BAB yang dikerjakan. Mulai kerjakan soal!</div>}
          {perBab.map((b: any) => (
            <div key={b.id} className="flex justify-between items-center border-b py-2 text-sm">
              <div><b>{b.mapel} BAB {b.bab_ke}</b> - {b.judul_bab} <span className="text-xs text-gray-500">{new Date(b.created_at).toLocaleDateString()}</span></div>
              <div className="flex gap-2"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">{b.benar}/{b.total_soal}</span><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${b.skor >= 80 ? "bg-green-500 text-white" : b.skor >= 60 ? "bg-yellow-500 text-white" : "bg-red-500 text-white"}`}>{b.skor}%</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
