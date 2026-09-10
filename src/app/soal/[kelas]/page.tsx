// src/app/soal/[kelas]/page.tsx - FINAL FIX JUARA
export const dynamic = 'force-dynamic';

"use client";
import { Suspense, useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function KelasContent() {
  const params = useParams();
  const rawKelas = params.kelas as string;
  const kelasId = rawKelas?.startsWith("bsj-")? rawKelas : `bsj-${rawKelas}`;
  const searchParams = useSearchParams();
  const mapelActive = searchParams.get("mapel") || "Matematika";

  const [listBab, setListBab] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const mapels = ["Matematika", "IPAS", "Bahasa Indonesia", "PPKN", "Seni"];

  useEffect(() => {
    async function loadBab() {
      setLoading(true);
      const { data } = await supabase
       .from("master_bab")
       .select("*")
       .eq("kelas", kelasId)
       .eq("mapel", mapelActive)
       .order("bab_ke", { ascending: true });
      setListBab(data || []);
      setLoading(false);
    }
    loadBab();
  }, [kelasId, mapelActive]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-4 mb-4">
        <h1 className="text-2xl font-bold uppercase">{kelasId} - {mapelActive}</h1>
        <p className="text-sm">Pilih Bab - 30 Soal per Bab (V4)</p>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {mapels.map((m) => (
          <Link
            key={m}
            href={`/soal/${kelasId}?mapel=${encodeURIComponent(m)}`}
            className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${
              m === mapelActive? "bg-orange-500 text-white border-orange-500" : "bg-white border-orange-300"
            }`}
          >
            {m}
          </Link>
        ))}
      </div>

      {loading? (
        <div className="p-10 text-center">Loading Bab...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listBab.length === 0? (
            Array.from({ length: 10 }, (_, i) => i + 1).map((b) => (
              <Link
                key={b}
                href={`/soal/${kelasId}/latihan?mapel=${encodeURIComponent(mapelActive)}&bab=${b}`}
                className="border-2 border-orange-200 bg-orange-50 rounded-xl p-4 hover:bg-orange-100"
              >
                <div className="font-bold">BAB {b}</div>
                <div className="text-xs text-gray-500">30 Soal - Klik untuk latihan</div>
              </Link>
            ))
          ) : (
            listBab.map((bab: any) => (
              <Link
                key={bab.bab_ke}
                href={`/soal/${kelasId}/latihan?mapel=${encodeURIComponent(mapelActive)}&bab=${bab.bab_ke}`}
                className="border-2 border-orange-200 bg-white rounded-xl p-4 hover:bg-orange-50 shadow-sm"
              >
                <div className="font-bold">BAB {bab.bab_ke}: {bab.nama_bab}</div>
                <div className="text-xs text-gray-600 mt-1">{bab.deskripsi || "15 PG HOTS + 8 Singkat + 7 Uraian = 30 Soal"}</div>
                <div className="mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded inline-block">Mulai →</div>
              </Link>
            ))
          )}
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-900 text-white rounded-xl text-sm">
        Kelas: {kelasId} | Mapel: {mapelActive} | Total Bab: {listBab.length || 10}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <KelasContent />
    </Suspense>
  );
}