"use client";
import { useSearchParams, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// MAPPING MAPEL - FIX PPKN KECIL BESAR
const MAPEL_ALIAS: any = {
  "PPKN": ["PPKN", "Pendidikan Pancasila", "PKN", "Pancasila"],
  "PAI": ["PAI", "Pendidikan Agama Islam"],
  "IPAS": ["IPAS", "IPA", "IPS", "Ilmu Pengetahuan Alam dan Sosial"],
  "MTK": ["MTK", "Matematika"],
  "B. INDONESIA": ["B. INDONESIA", "Bahasa Indonesia", "BINDO", "B INDONESIA"],
  "B. INGGRIS": ["B. INGGRIS", "Bahasa Inggris", "BING", "B INGGRIS"],
};

// JUDUL BAB - FIX DOUBLE BAB 5 - BAB 5
const JUDUL_BAB_ALL: any = {
  "bsj-sd1": {
    "PPKN": { "1": "Lambang Garuda Pancasila", "2": "Aturan di Rumah dan Sekolah", "3": "Toleransi", "4": "Gotong Royong", "5": "Mengenal Pancasila", "6": "Bhinneka Tunggal Ika" },
  },
  "bsj-sd2": {
    "PPKN": { "1": "Lambang dan Sila Pancasila", "2": "Aturan dan Tata Tertib", "3": "Hak dan Kewajiban", "4": "Gotong Royong di Sekolah", "5": "Musyawarah", "6": "Keberagaman di Rumah" },
  },
  "bsj-sd3": {
    "PPKN": {
      "5": "Hak dan Kewajiban serta Musyawarah",
      "6": "Keberagaman Budaya dan Gotong Royong"
    },
    "PAI": {
      "1": "Nabi dan Rasul", "2": "Shalat Fardhu", "3": "Akhlak Terpuji", "4": "Kisah Teladan Nabi", "5": "Doa Sehari-hari", "6": "Haji dan Ziarah"
    },
    "IPAS": {
      "1": "Makhluk Hidup dan Lingkungannya", "2": "Wujud Zat dan Perubahannya", "3": "Energi dan Perubahannya", "4": "Ekosistem", "5": "Manusia dan Lingkungan", "6": "Bumi, Bulan dan Tata Surya"
    },
    "MTK": {
      "1": "Bilangan Cacah Sampai 10.000", "2": "Penjumlahan dan Pengurangan", "3": "Perkalian dan Pembagian", "4": "Pecahan Sederhana", "5": "Pengukuran Panjang dan Berat", "6": "Bangun Datar"
    },
    "B. INDONESIA": {
      "1": "Kalimat dan Tanda Baca", "2": "Teks Deskripsi", "3": "Teks Narasi", "4": "Puisi Anak", "5": "Teks Informasi", "6": "Pidato Singkat"
    },
    "B. INGGRIS": {
      "1": "Greetings and Introduction", "2": "My Family", "3": "Numbers and Colors", "4": "Animals and Pets", "5": "Daily Activities", "6": "My Hobbies"
    }
  },
  "bsj-sd4": {
    "PPKN": { "1": "Pancasila Sebagai Dasar Negara", "2": "Hak dan Kewajiban", "3": "Keberagaman Budaya", "4": "Kerja Sama dan Gotong Royong", "5": "Musyawarah dan Demokrasi", "6": "NKRI dan Semangat Kebangsaan" },
  },
  "bsj-sd5": {
    "PPKN": { "1": "Pancasila dan Nilai-nilainya", "2": "Norma dan Aturan", "3": "Keberagaman Sosial Budaya", "4": "Gotong Royong dan Kerja Sama", "5": "Musyawarah Mufakat", "6": "Cinta Tanah Air" },
  },
  "bsj-sd6": {
    "PPKN": { "1": "Pancasila Sebagai Ideologi", "2": "Hak, Kewajiban dan Tanggung Jawab", "3": "Persatuan dan Kesatuan", "4": "Kerja Sama dalam Keberagaman", "5": "Demokrasi dan Musyawarah", "6": "Bela Negara" },
  },
};

export default function LatihanPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const kelas = (params.kelas as string)?.toLowerCase() || "";
  const mapelParam = searchParams.get("mapel") || "PPKN";
  const babParam = searchParams.get("bab") || "1";

  const [soal, setSoal] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [jawabanUser, setJawabanUser] = useState<any>({});

  useEffect(() => {
    async function fetchSoal() {
      setLoading(true);
      
      // FIX MAPEL ALIAS - PPKN BISA KECIL BESAR
      const aliasList = MAPEL_ALIAS[mapelParam.toUpperCase()] || [mapelParam];
      
      const { data, error } = await supabase
        .from("soal")
        .select("*")
        .eq("kelas", kelas)
        .in("mapel", aliasList)
        .eq("bab_ke", parseInt(babParam))
        .order("no_urut", { ascending: true });

      if (error) {
        console.error("Error fetch soal:", error);
      } else {
        setSoal(data || []);
      }
      setLoading(false);
    }
    fetchSoal();
  }, [kelas, mapelParam, babParam]);

  // FIX JUDUL BIAR GAK DOUBLE BAB 5 - BAB 5
  const getJudulBab = () => {
    const kelasUpper = kelas.toLowerCase();
    const mapelUpper = mapelParam.toUpperCase();
    const judulMap = JUDUL_BAB_ALL[kelasUpper]?.[mapelUpper]?.[babParam];
    if (judulMap) return judulMap;
    return `BAB ${babParam}`;
  };

  const handleJawab = (no: number, opsi: string) => {
    setJawabanUser({ ...jawabanUser, [no]: opsi });
  };

  if (loading) {
    return <div className="p-8 text-center">Loading soal {kelas} {mapelParam} BAB {babParam}...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow">
        <h1 className="font-bold text-sm md:text-base">
          {kelas.toUpperCase()} - {mapelParam} BAB {babParam} - {getJudulBab()} - {soal.length} SOAL (Supabase)
        </h1>
        <div className="flex gap-2">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">Mapel</span>
          <button className="text-xs bg-green-500 text-white px-3 py-1 rounded-full">Kumpulkan</button>
        </div>
      </div>

      {/* LIST SOAL */}
      <div className="space-y-4">
        {soal.map((s: any, idx: number) => {
          // FIX CASE SENSITIVE - PG BISA pg / Pg / pG
          const isPG = (s.tipe_soal || s.tipe || "").toUpperCase() === "PG";
          const opsiList = [
            { key: "A", text: s.opsi_a },
            { key: "B", text: s.opsi_b },
            { key: "C", text: s.opsi_c },
            { key: "D", text: s.opsi_d },
          ].filter((o) => o.text && o.text.trim() !== "");

          return (
            <div key={s.id || idx} className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="font-bold text-sm mb-3">
                <span className="bg-orange-400 text-white px-2 py-0.5 rounded text-xs mr-2">{s.no_urut || idx + 1}</span>
                [{s.tipe_soal || "pg"}] {s.pertanyaan}
              </div>

              {isPG && opsiList.length > 0 ? (
                <div className="space-y-2">
                  {opsiList.map((opsi) => (
                    <label
                      key={opsi.key}
                      className={`flex items-center gap-2 border rounded-lg p-3 cursor-pointer hover:bg-blue-50 ${
                        jawabanUser[s.no_urut] === opsi.key ? "bg-blue-100 border-blue-400" : "border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`soal-${s.no_urut}`}
                        value={opsi.key}
                        checked={jawabanUser[s.no_urut] === opsi.key}
                        onChange={() => handleJawab(s.no_urut, opsi.key)}
                        className="accent-blue-600"
                      />
                      <span className="text-sm">
                        {opsi.key}. {opsi.text}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <div>
                  <textarea
                    placeholder="Tulis jawaban..."
                    className="w-full border rounded-lg p-3 text-sm min-h-[80px]"
                    onChange={(e) => handleJawab(s.no_urut, e.target.value)}
                  />
                </div>
              )}

              {s.pembahasan && jawabanUser[s.no_urut] && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs">
                  <b>Pembahasan:</b> {s.pembahasan} <br />
                  <b>Kunci:</b> {s.jawaban}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {soal.length === 0 && (
        <div className="text-center p-8 bg-white rounded-xl">
          Soal tidak ditemukan untuk {kelas} {mapelParam} BAB {babParam}. Cek Supabase!
        </div>
      )}
    </div>
  );
}
