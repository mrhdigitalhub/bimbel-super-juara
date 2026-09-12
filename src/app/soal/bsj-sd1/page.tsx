"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState, Suspense } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Hasil = {
  id: string;
  kode_akses: string;
  mapel: string;
  bab: number;
  benar: number;
  salah: number;
  score: number;
  created_at: string;
};

function DashboardContent() {
  const [kode, setKode] = useState("");
  const [hasil, setHasil] = useState<Hasil[]>([]);
  const [tab, setTab] = useState<"soal" | "pantau">("soal");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const k = localStorage.getItem("bsj_kode_aktif") || "BSJ-SD1-W4CU";
    setKode(k);
    fetchHasil(k);
  }, []);

  const fetchHasil = async (kodeAkses: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("hasil_latihan")
      .select("*")
      .eq("kode_akses", kodeAkses)
      .order("created_at", { ascending: false });
    if (!error && data) setHasil(data as any);
    setLoading(false);
  };

  const mapels = ["PPKN", "Bahasa Indonesia", "Matematika", "IPAS", "Seni", "PJOK"];

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">📚 Dashboard BSJ-SD1 - 30 BAB</h1>
        <div className="text-xs bg-green-100 px-3 py-1 rounded-full">Kode: {kode}</div>
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab("soal")} className={`px-4 py-2 rounded-full text-sm font-bold ${tab === "soal" ? "bg-black text-white" : "bg-gray-100"}`}>📝 Latihan Soal</button>
        <button onClick={() => setTab("pantau")} className={`px-4 py-2 rounded-full text-sm font-bold ${tab === "pantau" ? "bg-blue-600 text-white" : "bg-gray-100"}`}>📊 Pantauan Orang Tua {hasil.length > 0 && `(${hasil.length})`}</button>
      </div>

      {tab === "soal" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {mapels.map((m) =>
            [1, 2, 3, 4, 5].map((bab) => {
              const skor = hasil.find((h) => h.mapel === m && h.bab === bab);
              return (
                <a key={`${m}-${bab}`} href={`/soal/bsj-sd1/latihan?mapel=${m}&bab=${bab}`} className="border rounded-xl p-4 hover:border-blue-400 flex justify-between items-center">
                  <div><div className="font-bold">{m} BAB {bab}</div><div className="text-xs text-gray-500">Lambang Garuda Pancasila</div></div>
                  {skor ? <div className={`px-3 py-1 rounded-full text-xs font-bold ${skor.score >= 70 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{skor.score}%</div> : <div className="text-xs bg-gray-100 px-3 py-1 rounded-full">Kerjakan →</div>}
                </a>
              );
            })
          )}
        </div>
      )}

      {tab === "pantau" && (
        <div>
          {loading ? <div>Loading...</div> : hasil.length === 0 ? <div className="text-center py-10 border rounded-xl">Belum ada latihan. Kerjakan soal dulu Bos!</div> : (
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="bg-blue-50 p-4 rounded-xl text-center"><div className="text-2xl font-bold">{hasil.length}</div><div className="text-xs">Total Latihan</div></div>
                <div className="bg-green-50 p-4 rounded-xl text-center"><div className="text-2xl font-bold">{hasil.length ? Math.round(hasil.reduce((a, b) => a + b.score, 0) / hasil.length) : 0}%</div><div className="text-xs">Rata-rata</div></div>
                <div className="bg-yellow-50 p-4 rounded-xl text-center"><div className="text-2xl font-bold">{hasil.filter((h) => h.score >= 70).length}</div><div className="text-xs">Tuntas</div></div>
                <div className="bg-red-50 p-4 rounded-xl text-center"><div className="text-2xl font-bold">{hasil.filter((h) => h.score < 70).length}</div><div className="text-xs">Perlu Ulang</div></div>
              </div>
              <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50"><tr><th className="p-3 text-left">Waktu</th><th className="p-3 text-left">Mapel BAB</th><th className="p-3 text-center">Benar</th><th className="p-3 text-center">Salah</th><th className="p-3 text-center">Score</th></tr></thead>
                  <tbody>
                    {hasil.map((h) => (
                      <tr key={h.id} className="border-t"><td className="p-3 text-xs">{new Date(h.created_at).toLocaleString("id-ID")}</td><td className="p-3 font-bold">{h.mapel} BAB {h.bab}</td><td className="p-3 text-center text-green-600 font-bold">{h.benar}</td><td className="p-3 text-center text-red-600">{h.salah}</td><td className="p-3 text-center"><span className={`px-2 py-1 rounded-full text-xs font-bold ${h.score >= 70 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{h.score}%</span></td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<div className="p-10 text-center">Loading Dashboard...</div>}><DashboardContent /></Suspense>;
}
