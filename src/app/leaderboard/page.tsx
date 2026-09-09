// src/app/leaderboard/page.tsx - FIXED 404 - LEADERBOARD SD1-SD6
"use client";
import { useEffect, useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useSearchParams } from 'next/navigation';

type Skor = {
  id: string;
  nama_siswa: string;
  kelas: string;
  mapel: string;
  blok_ke: number;
  rentang_soal: string;
  benar: number;
  total_soal: number;
  nilai: number;
  created_at: string;
};

function LeaderboardContent() {
  const searchParams = useSearchParams();
  const filterKelas = searchParams.get('kelas') || 'Semua';
  const filterMapel = searchParams.get('mapel') || 'Semua';

  const [skor, setSkor] = useState<Skor[]>([]);
  const [loading, setLoading] = useState(true);
  const [kelas, setKelas] = useState(filterKelas);
  const [mapel, setMapel] = useState(filterMapel);
  const [blok, setBlok] = useState("Semua");

  useEffect(() => { load(); }, [kelas, mapel, blok]);

  async function load() {
    setLoading(true);
    let query = supabase.from('skor_siswa').select('*').order('nilai', {ascending: false}).order('created_at', {ascending: false}).limit(100);
    if (kelas !== 'Semua') query = query.eq('kelas', kelas);
    if (mapel !== 'Semua') query = query.eq('mapel', mapel);
    if (blok !== 'Semua') query = query.eq('blok_ke', parseInt(blok));
    const { data } = await query;
    setSkor((data as Skor[]) || []);
    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-black mb-2">🏅 LEADERBOARD Bimbel Super Juara SD1-SD6</h1>
      <p className="text-gray-500 mb-6">Top 100 Nilai Tertinggi - Real-time Supabase</p>

      <div className="flex gap-2 mb-6 flex-wrap">
        <select value={kelas} onChange={(e)=>setKelas(e.target.value)} className="border p-2 rounded">
          <option value="Semua">Semua Kelas</option>
          <option value="bsj-sd1">SD1</option>
          <option value="bsj-sd2">SD2</option>
          <option value="bsj-sd3">SD3</option>
          <option value="bsj-sd4">SD4</option>
          <option value="bsj-sd5">SD5</option>
          <option value="bsj-sd6">SD6</option>
        </select>
        <select value={mapel} onChange={(e)=>setMapel(e.target.value)} className="border p-2 rounded">
          <option value="Semua">Semua Mapel</option>
          <option value="Bahasa Indonesia">Bahasa Indonesia</option>
          <option value="Matematika">Matematika</option>
          <option value="IPAS">IPAS</option>
          <option value="PAI & Budi Pekerti">PAI</option>
          <option value="Pendidikan Pancasila">Pancasila</option>
        </select>
        <select value={blok} onChange={(e)=>setBlok(e.target.value)} className="border p-2 rounded">
          <option value="Semua">Semua Blok</option>
          <option value="0">TOTAL (1-120)</option>
          <option value="1">Blok 1 (1-20)</option>
          <option value="2">Blok 2 (21-40)</option>
          <option value="3">Blok 3 (41-60)</option>
          <option value="4">Blok 4 (61-80)</option>
          <option value="5">Blok 5 (81-100)</option>
          <option value="6">Blok 6 (101-120)</option>
        </select>
      </div>

      {loading ? <div className="p-10 text-center">Loading leaderboard...</div> : (
        <div className="bg-white border rounded-xl overflow-hidden shadow">
          <div className="grid grid-cols-12 bg-gray-900 text-white p-3 text-sm font-bold">
            <div className="col-span-1">#</div>
            <div className="col-span-3">Nama</div>
            <div className="col-span-2">Kelas</div>
            <div className="col-span-2">Mapel</div>
            <div className="col-span-2">Blok</div>
            <div className="col-span-2">Nilai</div>
          </div>
          {skor.map((s, idx) => (
            <div key={s.id} className={`grid grid-cols-12 p-3 border-b text-sm ${idx<3?'bg-yellow-50 font-bold':''}`}>
              <div className="col-span-1">{idx===0?'🥇':idx===1?'🥈':idx===2?'🥉':idx+1}</div>
              <div className="col-span-3 truncate">{s.nama_siswa}</div>
              <div className="col-span-2">{s.kelas}</div>
              <div className="col-span-2 truncate">{s.mapel}</div>
              <div className="col-span-2">{s.rentang_soal}</div>
              <div className="col-span-2"><span className={`px-2 py-1 rounded text-white ${s.nilai>=80?'bg-green-600':s.nilai>=60?'bg-orange-500':'bg-red-500'}`}>{s.nilai}</span> <span className="text-xs text-gray-500">{s.benar}/{s.total_soal}</span></div>
            </div>
          ))}
          {skor.length===0 && <div className="p-10 text-center text-gray-400">Belum ada skor. Ayo jadi yang pertama!</div>}
        </div>
      )}
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <LeaderboardContent />
    </Suspense>
  );
}
