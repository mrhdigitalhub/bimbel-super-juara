// src/app/soal/[kelas]/latihan/page.tsx - FIX 100% JUARA
"use client";
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LatihanPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const rawKelas = params.kelas as string;
  const mapel = searchParams.get('mapel') || 'IPAS';

  // FIX ANTI bsj-bsj-sd2
  const kelasId = rawKelas?.startsWith("bsj-")? rawKelas : `bsj-${rawKelas}`;

  const [soal, setSoal] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data, error } = await supabase
       .from('soal')
       .select('*')
       .eq('kelas', kelasId)
       .eq('mapel', mapel)
       .order('no_urut', { ascending: true });

      if (error) {
        console.error(error);
      } else {
        setSoal(data || []);
      }
      setLoading(false);
    }
    load();
  }, [kelasId, mapel]);

  if (loading) return <div className="p-10">Loading {kelasId} - {mapel}...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">{kelasId} - {mapel} ({soal.length} Soal)</h1>
      {/* render soal kamu selanjutnya */}
      <pre className="mt-4 text-xs">{JSON.stringify(soal.slice(0,1), null, 2)}</pre>
    </div>
  );
}