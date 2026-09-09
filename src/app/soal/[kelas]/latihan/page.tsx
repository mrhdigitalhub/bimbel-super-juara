// src/app/soal/[kelas]/latihan/page.tsx - V3 MIXED SUPPORT PG + ISIAN + ESSAY + BENAR SALAH
"use client";
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Soal = {
  id: number;
  kelas: string;
  mapel: string;
  no_urut: number;
  tipe_soal: string;
  pertanyaan: string;
  opsi_a?: string;
  opsi_b?: string;
  opsi_c?: string;
  opsi_d?: string;
  jawaban?: string;
  jawaban_isian?: string;
  kunci_essay?: string;
  pembahasan: string;
  is_free: boolean;
};

export default function LatihanPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const rawKelas = params.kelas as string;
  const mapel = searchParams.get('mapel') || 'IPAS';

  const kelasId = rawKelas?.startsWith("bsj-") ? rawKelas : `bsj-${rawKelas}`;

  const [soal, setSoal] = useState<Soal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [current, setCurrent] = useState(0);
  const [jawabanUser, setJawabanUser] = useState<Record<string, string>>({});
  const [showHasil, setShowHasil] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await supabase
        .from('soal')
        .select('*')
        .eq('kelas', kelasId)
        .eq('mapel', mapel)
        .order('no_urut', { ascending: true });

      if (error) console.error(error);
      else setSoal((data as Soal[]) || []);
      setLoading(false);
    }
    load();
  }, [kelasId, mapel]);

  if (loading) return <div className="p-10 text-center">Loading {kelasId} - {mapel}...</div>;
  if (soal.length === 0) return <div className="p-10 text-center">Belum ada soal untuk {kelasId} - {mapel}</div>;

  const s = soal[current];
  const isPG = s.tipe_soal === 'pilihan_ganda';
  const isIsian = s.tipe_soal === 'isian';
  const isEssay = s.tipe_soal === 'essay';
  const isBenarSalah = s.tipe_soal === 'benar_salah';

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-2">{kelasId} - {mapel} ({soal.length} Soal) V3 Mixed</h1>
      <div className="flex gap-2 mb-4 text-sm">
        <span className="px-2 py-1 bg-blue-100 rounded">Soal {current + 1}/{soal.length}</span>
        <span className="px-2 py-1 bg-purple-100 rounded">{s.tipe_soal}</span>
        <span className="px-2 py-1 bg-green-100 rounded">{s.is_free ? 'GRATIS' : 'PREMIUM'}</span>
      </div>

      <div className="border rounded-xl p-6 shadow bg-white">
        <p className="text-lg mb-6 leading-relaxed">{s.pertanyaan}</p>

        {isPG && (
          <div className="grid gap-3">
            {[
              {k:'A', v:s.opsi_a},
              {k:'B', v:s.opsi_b},
              {k:'C', v:s.opsi_c},
              {k:'D', v:s.opsi_d},
            ].map((opt) => (
              <button
                key={opt.k}
                onClick={() => setJawabanUser({...jawabanUser, [String(s.no_urut)]: opt.k})}
                className={`text-left border p-3 rounded-lg hover:bg-blue-50 ${jawabanUser[String(s.no_urut)]===opt.k ? 'bg-blue-100 border-blue-500 font-bold' : ''}`}
              >
                <span className="font-bold mr-2">{opt.k}.</span> {opt.v}
              </button>
            ))}
          </div>
        )}

        {isIsian && (
          <div>
            <input
              type="text"
              placeholder="Ketik jawaban singkat 1-3 kata..."
              value={jawabanUser[String(s.no_urut)] || ''}
              onChange={(e) => setJawabanUser({...jawabanUser, [String(s.no_urut)]: e.target.value})}
              className="border-2 p-3 w-full rounded-lg focus:border-blue-500 outline-none"
            />
            {showHasil && (
              <div className="mt-3 p-3 bg-green-50 rounded">Kunci: <b>{s.jawaban_isian}</b></div>
            )}
          </div>
        )}

        {isBenarSalah && (
          <div>
            <div className="flex gap-3 mb-3">
              <button onClick={() => setJawabanUser({...jawabanUser, [String(s.no_urut)]: 'Benar'})} className={`px-6 py-2 rounded-full border ${jawabanUser[String(s.no_urut)]==='Benar'?'bg-green-500 text-white':''}`}>Benar</button>
              <button onClick={() => setJawabanUser({...jawabanUser, [String(s.no_urut)]: 'Salah'})} className={`px-6 py-2 rounded-full border ${jawabanUser[String(s.no_urut)]==='Salah'?'bg-red-500 text-white':''}`}>Salah</button>
            </div>
            <textarea placeholder="Tulis alasanmu..." value={jawabanUser[`${s.no_urut}_alasan`] || ''} onChange={(e)=>setJawabanUser({...jawabanUser, [`${s.no_urut}_alasan`]: e.target.value})} className="border p-3 w-full rounded-lg h-20" />
            {showHasil && <div className="mt-3 p-3 bg-yellow-50 rounded">Kunci: {s.jawaban_isian} <br/> Alasan: {s.kunci_essay}</div>}
          </div>
        )}

        {isEssay && (
          <div>
            <textarea placeholder="Jelaskan jawabanmu dengan cerita..." value={jawabanUser[String(s.no_urut)] || ''} onChange={(e)=>setJawabanUser({...jawabanUser, [String(s.no_urut)]: e.target.value})} className="border-2 p-3 w-full rounded-lg h-32 focus:border-blue-500 outline-none" />
            {showHasil && <div className="mt-3 p-3 bg-blue-50 rounded"><b>Poin Kunci:</b><br/>{s.kunci_essay}</div>}
          </div>
        )}

        {showHasil && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="font-bold">Pembahasan:</p>
            <p>{s.pembahasan}</p>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button disabled={current===0} onClick={()=>{setCurrent(current-1); setShowHasil(false)}} className="px-4 py-2 border rounded disabled:opacity-30">← Sebelumnya</button>
        <button onClick={()=>setShowHasil(!showHasil)} className="px-4 py-2 bg-yellow-400 rounded font-bold">{showHasil ? 'Sembunyikan' : 'Lihat Kunci'}</button>
        <button disabled={current===soal.length-1} onClick={()=>{setCurrent(current+1); setShowHasil(false)}} className="px-4 py-2 border rounded disabled:opacity-30">Selanjutnya →</button>
      </div>
    </div>
  );
}
