"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const JUDUL_BAB_ALL: any = {
  "bsj-sd1": {
    "PPKN": { "1": "Lambang Garuda Pancasila", "2": "Aturan di Rumah dan Sekolah", "3": "Toleransi", "4": "Gotong Royong", "5": "Mengenal Pancasila", "6": "Bhinneka Tunggal Ika" }
  },
  "bsj-sd2": {
    "PPKN": { "1": "Lambang dan Sila Pancasila", "2": "Aturan dan Tata Tertib", "3": "Hak dan Kewajiban", "4": "Gotong Royong di Sekolah", "5": "Musyawarah", "6": "Keberagaman di Rumah" }
  },
  "bsj-sd3": {
    "PPKN": { "5": "Hak dan Kewajiban serta Musyawarah", "6": "Keberagaman Budaya dan Gotong Royong" },
    "PAI": { "1": "Nabi dan Rasul", "2": "Shalat Fardhu", "3": "Akhlak Terpuji", "4": "Kisah Teladan Nabi", "5": "Doa Sehari-hari", "6": "Haji dan Ziarah" },
    "IPAS": { "1": "Makhluk Hidup dan Lingkungannya", "2": "Wujud Zat dan Perubahannya", "3": "Energi dan Perubahannya", "4": "Ekosistem", "5": "Manusia dan Lingkungan", "6": "Bumi, Bulan dan Tata Surya" },
    "MTK": { "1": "Bilangan Cacah Sampai 10.000", "2": "Penjumlahan dan Pengurangan", "3": "Perkalian dan Pembagian", "4": "Pecahan Sederhana", "5": "Pengukuran Panjang dan Berat", "6": "Bangun Datar" },
    "B. INDONESIA": { "1": "Kalimat dan Tanda Baca", "2": "Teks Deskripsi", "3": "Teks Narasi", "4": "Puisi Anak", "5": "Teks Informasi", "6": "Pidato Singkat" },
    "B. INGGRIS": { "1": "Greetings and Introduction", "2": "My Family", "3": "Numbers and Colors", "4": "Animals and Pets", "5": "Daily Activities", "6": "My Hobbies" }
  },
  "bsj-sd4": {
    "PPKN": { "1": "Pancasila Sebagai Dasar Negara", "2": "Hak dan Kewajiban", "3": "Keberagaman Budaya", "4": "Kerja Sama dan Gotong Royong", "5": "Musyawarah dan Demokrasi", "6": "NKRI dan Semangat Kebangsaan" }
  },
  "bsj-sd5": {
    "PPKN": { "1": "Pancasila dan Nilai-nilainya", "2": "Norma dan Aturan", "3": "Keberagaman Sosial Budaya", "4": "Gotong Royong dan Kerja Sama", "5": "Musyawarah Mufakat", "6": "Cinta Tanah Air" }
  },
  "bsj-sd6": {
    "PPKN": { "1": "Pancasila Sebagai Ideologi", "2": "Hak, Kewajiban dan Tanggung Jawab", "3": "Persatuan dan Kesatuan", "4": "Kerja Sama dalam Keberagaman", "5": "Demokrasi dan Musyawarah", "6": "Bela Negara" }
  }
};

const WARNA: any = {
  "PPKN": { bg: "bg-blue-50", header: "bg-blue-100", pastel: "Pastel Biru" },
  "B. INDONESIA": { bg: "bg-red-50", header: "bg-red-100", pastel: "Pastel Merah" },
  "MTK": { bg: "bg-green-50", header: "bg-green-100", pastel: "Pastel Hijau" },
  "IPAS": { bg: "bg-yellow-50", header: "bg-yellow-100", pastel: "Pastel Kuning" },
  "PAI": { bg: "bg-emerald-50", header: "bg-emerald-100", pastel: "Pastel Hijau" },
  "B. INGGRIS": { bg: "bg-purple-50", header: "bg-purple-100", pastel: "Pastel Ungu" }
};

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

export default function DashboardKelasPage() {
  const params = useParams();
  const kelasRaw = params.kelas as string;
  const kelas = kelasRaw ? kelasRaw.toLowerCase() : "bsj-sd2";
  const [kode, setKode] = useState("");
  const [hasil, setHasil] = useState<Hasil[]>([]);
  const [showPantau, setShowPantau] = useState(false);

  useEffect(() => {
    const k = localStorage.getItem("bsj_kode_aktif") || "BSJ-SD1-W4CU";
    setKode(k);
    supabase
      .from("hasil_latihan")
      .select("*")
      .eq("kode_akses", k)
      .order("created_at", { ascending: false })
      .then(function (res) {
        if (res.data) {
          setHasil(res.data as any);
        }
      });
  }, []);

  const judulBabKelas = JUDUL_BAB_ALL[kelas] || JUDUL_BAB_ALL["bsj-sd2"];
  let totalBAB = 0;
  Object.values(judulBabKelas).forEach(function (m: any) {
    totalBAB += Object.keys(m).length;
  });
  if (totalBAB === 0) totalBAB = 30;

  const selesai = hasil.length;
  let totalScore = 0;
  hasil.forEach(function (h) {
    totalScore += h.score;
  });
  const rata = selesai ? Math.round(totalScore / selesai) : 0;

  let totalBenar = 0;
  let totalSoal = 0;
  hasil.forEach(function (h) {
    totalBenar += h.benar;
    totalSoal += h.benar + h.salah;
  });

  function getJudul(mapel: string, bab: number) {
    const fromKelas = JUDUL_BAB_ALL[kelas] && JUDUL_BAB_ALL[kelas][mapel] && JUDUL_BAB_ALL[kelas][mapel][String(bab)];
    if (fromKelas) return fromKelas;
    const fromSD2 = JUDUL_BAB_ALL["bsj-sd2"] && JUDUL_BAB_ALL["bsj-sd2"][mapel] && JUDUL_BAB_ALL["bsj-sd2"][mapel][String(bab)];
    if (fromSD2) return fromSD2;
    return "BAB " + bab;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-[#fffcf5] min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-base">
          {kelas.toUpperCase()} - Dashboard Score Lengkap {totalBAB} BAB
        </h1>
        <div className="flex gap-2 items-center">
          <span className="text-[10px] bg-green-100 px-2 py-1 rounded-full">Kode: {kode}</span>
          <button
            onClick={function () {
              setShowPantau(!showPantau);
            }}
            className="text-xs bg-black text-white px-3 py-1.5 rounded-full font-bold"
          >
            Pantauan Orang Tua {hasil.length > 0 ? "(" + hasil.length + ")" : ""}
          </button>
        </div>
      </div>

      {showPantau && (
        <div className="border rounded-xl bg-white p-4 mb-5">
          <h2 className="font-bold text-sm mb-3">Pantauan Orang Tua - {kode} - {kelas.toUpperCase()}</h2>
          {hasil.length === 0 ? (
            <div className="text-sm text-gray-500 p-4 text-center border rounded-lg">Belum ada latihan untuk kelas ini</div>
          ) : (
            <div>
              <div className="grid grid-cols-4 gap-2 mb-3 text-center">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <div className="font-bold text-lg">{hasil.length}</div>
                  <div className="text-[10px]">Total Latihan</div>
                </div>
                <div className="bg-green-50 p-2 rounded-lg">
                  <div className="font-bold text-lg">{rata}%</div>
                  <div className="text-[10px]">Rata-rata</div>
                </div>
                <div className="bg-yellow-50 p-2 rounded-lg">
                  <div className="font-bold text-lg">
                    {hasil.filter(function (h) {
                      return h.score >= 70;
                    }).length}
                  </div>
                  <div className="text-[10px]">Tuntas</div>
                </div>
                <div className="bg-red-50 p-2 rounded-lg">
                  <div className="font-bold text-lg">
                    {hasil.filter(function (h) {
                      return h.score < 70;
                    }).length}
                  </div>
                  <div className="text-[10px]">Perlu Ulang</div>
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-2 text-left">Waktu</th>
                      <th className="p-2 text-left">Mapel BAB</th>
                      <th className="p-2 text-center">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hasil.map(function (h) {
                      return (
                        <tr key={h.id} className="border-t">
                          <td className="p-2">{new Date(h.created_at).toLocaleString("id-ID")}</td>
                          <td className="p-2">
                            <b>
                              {h.mapel} BAB {h.bab}
                            </b>
                            <br />
                            <span className="text-[10px] text-gray-500">{getJudul(h.mapel, h.bab)}</span>
                          </td>
                          <td className="p-2 text-center">
                            <span className={h.score >= 70 ? "bg-green-100 text-green-700 px-2 py-1 rounded-full text-[10px] font-bold" : "bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-[10px] font-bold"}>
                              {h.score}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white p-5 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-xs opacity-80">Total Score Kelas</div>
            <div className="text-4xl font-bold">{rata}%</div>
            <div className="text-xs mt-1 opacity-80">
              {selesai} / {totalBAB} BAB selesai - Benar {totalBenar} / {totalSoal || 0}
            </div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">{rata}%</div>
            <div className="text-[10px] mt-1 opacity-80">Progress</div>
          </div>
        </div>
        <div className="w-full bg-white/20 h-2 rounded-full mt-4">
          <div className="bg-white h-2 rounded-full" style={{ width: (totalBAB ? (selesai / totalBAB) * 100 : 0) + "%" }} />
        </div>
      </div>

      {Object.keys(judulBabKelas).map(function (mapel) {
        const babs = judulBabKelas[mapel];
        const totalMapel = Object.keys(babs).length;
        const doneMapel = hasil.filter(function (h) {
          return h.mapel.toUpperCase() === mapel.toUpperCase();
        }).length;
        let scoreMapel = 0;
        hasil
          .filter(function (h) {
            return h.mapel.toUpperCase() === mapel.toUpperCase();
          })
          .forEach(function (h) {
            scoreMapel += h.score;
          });
        const rataMapel = doneMapel ? Math.round(scoreMapel / doneMapel) : 0;
        const w = WARNA[mapel] || { bg: "bg-gray-50", header: "bg-gray-100", pastel: "Pastel Abu" };

        return (
          <div key={mapel} className={"border rounded-xl p-3 mb-5 " + w.bg}>
            <div className={"flex justify-between items-center p-3 rounded-lg mb-3 border " + w.header}>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">{mapel}</span>
                <span className="text-[10px] opacity-70">
                  {doneMapel}/{totalMapel} BAB - Rata {rataMapel}% - {w.pastel}
                </span>
              </div>
              <div className="w-24 h-1.5 bg-white/70 rounded-full">
                <div className="bg-black/20 h-1.5 rounded-full" style={{ width: (totalMapel ? (doneMapel / totalMapel) * 100 : 0) + "%" }} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {Object.keys(babs).map(function (babStr) {
                const bab = parseInt(babStr, 10);
                const judul = getJudul(mapel, bab);
                const skor = hasil.find(function (h) {
                  return h.mapel.toUpperCase() === mapel.toUpperCase() && h.bab === bab;
                });
                return (
                  <a
                    key={mapel + "-" + bab}
                    href={"/soal/" + kelas + "/latihan?mapel=" + encodeURIComponent(mapel) + "&bab=" + bab}
                    className="bg-white border rounded-lg p-3 hover:border-blue-400 flex justify-between items-start"
                  >
                    <div className="pr-2">
                      <div className="text-[10px] text-gray-500">BAB {bab}</div>
                      <div className="font-bold text-xs leading-tight">{judul}</div>
                      <div className="text-[10px] text-gray-500 mt-1">{skor ? "Benar " + skor.benar : "Belum dikerjakan"}</div>
                    </div>
                    <div className={skor ? (skor.score >= 70 ? "bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full font-bold" : "bg-yellow-100 text-yellow-700 text-[10px] px-2 py-1 rounded-full font-bold") : "bg-gray-100 text-gray-600 text-[10px] px-2 py-1 rounded-full font-bold"}>
                      {skor ? skor.score + "%" : "0%"}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
