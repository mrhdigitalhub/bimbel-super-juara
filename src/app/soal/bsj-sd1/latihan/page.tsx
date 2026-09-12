"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Ganti dengan URL & ANON KEY kamu kalau beda file
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Dummy soal - ganti dengan data asli kamu dari DB / file soal
const SOAL_DUMMY = [
  {
    id: 1,
    tanya: "Apa pengertian dari Lambang Garuda Pancasila?",
    opsi: ["Saling menghormati dan bekerja sama demi kepentingan bersama", "Memaksakan kehendak sendiri", "Tidak peduli dengan orang lain", "Mementingkan diri sendiri"],
    kunci: 0,
    pembahasan: "Pembahasan Lambang Garuda Pancasila."
  },
  // ... tambah 29 soal lagi sampai 30
];

export default function LatihanPage() {
  const searchParams = useSearchParams();
  const mapel = searchParams.get("mapel") || "PPKN";
  const bab = Number(searchParams.get("bab") || "1");

  const [jawaban, setJawaban] = useState<Record<number, number>>({});
  const [sudahKumpul, setSudahKumpul] = useState(false);
  const [hasil, setHasil] = useState({ benar: 0, salah: 0, score: 0 });
  const [saving, setSaving] = useState(false);

  // Ambil data aktivasi dari localStorage (yang kamu simpan waktu di /kode)
  const [kodeAktif, setKodeAktif] = useState("BSJ-SD1-W4CU");
  const [hpOrtu, setHpOrtu] = useState("081770220059");

  useEffect(() => {
    setKodeAktif(localStorage.getItem("bsj_kode_aktif") || "BSJ-SD1-W4CU");
    setHpOrtu(localStorage.getItem("bsj_hp_ortu") || "081770220059");
  }, []);

  const handlePilih = (idSoal: number, idxOpsi: number) => {
    if (sudahKumpul) return;
    setJawaban({ ...jawaban, [idSoal]: idxOpsi });
  };

  const handleKumpulkan = async () => {
    let benar = 0;
    SOAL_DUMMY.forEach((s) => {
      if (jawaban[s.id] === s.kunci) benar++;
    });
    const total = SOAL_DUMMY.length;
    const salah = total - benar;
    const score = Math.round((benar / total) * 100);

    setHasil({ benar, salah, score });
    setSudahKumpul(true);
    setSaving(true);

    // === LANGKAH 2 - SIMPAN KE SUPABASE (ini yang bikin ortu bisa pantau) ===
    try {
      const { error } = await supabase.from("hasil_latihan").insert({
        kode_akses: kodeAktif,
        hp_ortu: hpOrtu,
        kelas: "BSJ-SD1",
        mapel: mapel,
        bab: bab,
        judul: `${mapel} BAB ${bab}`,
        benar: benar,
        salah: salah,
        score: score,
      });

      if (error) {
        console.error("Gagal simpan hasil_latihan:", error);
        alert("Score tersimpan lokal, tapi gagal simpan ke DB: " + error.message);
      } else {
        console.log("✅ Score tersimpan di Supabase!");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
      // Simpan juga di localStorage biar dashboard langsung update
      localStorage.setItem(`bsj-score-${mapel}-${bab}`, JSON.stringify({ benar, salah, score }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <a href="/soal/bsj-sd1" className="inline-block mb-4 px-4 py-2 rounded-full bg-gray-100 text-sm">
        ← Kembali ke Dashboard BSJ-SD1 - 30 BAB
      </a>

      <div className="border rounded-xl p-4 mb-4 flex justify-between items-center">
        <div>
          <h1 className="font-bold">BSJ-SD1 - {mapel} BAB {bab} - Lambang Garuda Pancasila - {SOAL_DUMMY.length} SOAL</h1>
          <p className="text-xs text-gray-500">Mapel: {mapel} | Judul: Lambang Garuda Pancasila</p>
        </div>
        {!sudahKumpul && (
          <button onClick={handleKumpulkan} className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold">
            Kumpulkan & Lihat Score
          </button>
        )}
      </div>

      {sudahKumpul && (
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 text-white mb-6">
          <h2 className="font-bold text-lg">🎉 Score {mapel} BAB {bab}: {hasil.score}%</h2>
          <p className="text-sm opacity-90 mb-4">Lambang Garuda Pancasila</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{hasil.benar}</div>
              <div className="text-xs">Benar</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{hasil.salah}</div>
              <div className="text-xs">Salah</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{hasil.score}%</div>
              <div className="text-xs">Score</div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <a href="/soal/bsj-sd1" className="bg-white text-green-700 px-4 py-2 rounded-full text-sm font-bold">
              ← Kembali ke Dashboard Lengkap 30 BAB
            </a>
            <a href={`/soal/bsj-sd1/latihan?mapel=${mapel}&bab=${bab + 1}`} className="bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold">
              Lanjut BAB {bab + 1} →
            </a>
            <span className="text-xs self-center">{saving ? "Menyimpan..." : "✅ Score tersimpan!"}</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {SOAL_DUMMY.map((soal, idx) => (
          <div key={soal.id} className="border border-green-300 rounded-xl p-4">
            <p className="font-bold mb-3">
              <span className="bg-orange-400 text-white px-2 py-0.5 rounded text-xs mr-2">{idx + 1}</span>
              {soal.tanya}
              {sudahKumpul && jawaban[soal.id] === soal.kunci && <span className="ml-2 text-green-600">✅</span>}
            </p>
            <div className="space-y-2">
              {soal.opsi.map((opsi, i) => {
                const isSelected = jawaban[soal.id] === i;
                const isKunci = sudahKumpul && soal.kunci === i;
                return (
                  <label key={i} className={`block border rounded-lg p-3 cursor-pointer ${isKunci ? "bg-blue-100 border-blue-400" : ""} ${isSelected && !isKunci ? "bg-gray-100" : ""}`}>
                    <input type="radio" name={`soal-${soal.id}`} checked={isSelected} onChange={() => handlePilih(soal.id, i)} className="mr-2" />
                    {String.fromCharCode(65 + i)}. {opsi} {isKunci && <span className="text-green-600 font-bold">(Kunci)</span>}
                  </label>
                );
              })}
            </div>
            {sudahKumpul && (
              <div className="mt-3 bg-yellow-50 border rounded p-2 text-xs">
                <b>Pembahasan:</b> {soal.pembahasan}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
