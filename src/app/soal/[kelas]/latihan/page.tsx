"use client";
import { useSearchParams, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// MAPPING FINAL - SUPPORT BINDO, B. INDONESIA, Bahasa Indonesia
const MAPEL_ALIAS: Record<string, string[]> = {
  "PPKN": ["PPKN", "Pendidikan Pancasila", "PKN", "Pancasila", "ppkn", "pkn"],
  "PAI": ["PAI", "Pendidikan Agama Islam", "pai"],
  "IPAS": ["IPAS", "IPA", "IPS", "Ilmu Pengetahuan Alam dan Sosial", "ipas"],
  "MTK": ["MTK", "Matematika", "MATH", "matematika", "mtk"],
  "BINDO": ["BINDO", "B. INDONESIA", "B INDONESIA", "Bahasa Indonesia", "B. Indonesia", "b. indonesia", "bindo"],
  "B. INDONESIA": ["B. INDONESIA", "BINDO", "B INDONESIA", "Bahasa Indonesia"],
  "B. INGGRIS": ["B. INGGRIS", "Bahasa Inggris", "BING", "B INGGRIS"],
};

function getAliasList(mapelParam: string): string[] {
  if (!mapelParam) return ["PPKN"];
  const raw = decodeURIComponent(mapelParam).trim();
  const upper = raw.toUpperCase();
  const lower = raw.toLowerCase();
  if (MAPEL_ALIAS[upper]) return MAPEL_ALIAS[upper];
  for (const [key, values] of Object.entries(MAPEL_ALIAS)) {
    const match = values.some(v => v.toLowerCase() === lower || v.toUpperCase() === upper);
    if (match) return values;
  }
  if (lower.includes("indo") && (lower.includes("bahasa") || lower.includes("bindo") || lower.includes("b. ") || lower.includes("b "))) {
    return ["B. INDONESIA", "BINDO", "Bahasa Indonesia", "B INDONESIA"];
  }
  if (lower.includes("mtk") || lower.includes("matematika") || lower.includes("math")) return MAPEL_ALIAS["MTK"];
  if (lower.includes("pai") || lower.includes("agama")) return MAPEL_ALIAS["PAI"];
  if (lower.includes("ppkn") || lower.includes("pkn") || lower.includes("pancasila")) return MAPEL_ALIAS["PPKN"];
  if (lower.includes("ipas") || lower === "ipa" || lower === "ips") return MAPEL_ALIAS["IPAS"];
  return [mapelParam];
}

function getCanonicalDisplay(mapelParam: string): string {
  const aliases = getAliasList(mapelParam);
  if (aliases.includes("B. INDONESIA")) return "B. INDONESIA";
  if (aliases.includes("BINDO")) return "BINDO";
  const raw = decodeURIComponent(mapelParam).toLowerCase();
  if (raw.includes("indo")) return "B. INDONESIA";
  return aliases[0] || mapelParam;
}

const JUDUL_BAB_ALL: any = {
  "bsj-sd1": {
    "PPKN": { "1": "Lambang Garuda Pancasila", "2": "Aturan di Rumah dan Sekolah", "3": "Toleransi", "4": "Gotong Royong", "5": "Mengenal Pancasila", "6": "Bhinneka Tunggal Ika" },
    "BINDO": { "1": "Bunyi dan Huruf", "2": "Sapa dan Salam", "3": "Cerita Bergambar", "4": "Kosakata Baru", "5": "Kalimat Sederhana", "6": "Membaca Nyaring" },
    "B. INDONESIA": { "1": "Bunyi dan Huruf", "2": "Sapa dan Salam", "3": "Cerita Bergambar", "4": "Kosakata Baru", "5": "Kalimat Sederhana", "6": "Membaca Nyaring" },
  },
  "bsj-sd2": {
    "PPKN": { "1": "Lambang dan Sila Pancasila", "2": "Aturan dan Tata Tertib", "3": "Hak dan Kewajiban", "4": "Gotong Royong di Sekolah", "5": "Musyawarah", "6": "Keberagaman di Rumah" },
    "BINDO": { "1": "Teks Deskripsi", "2": "Teks Narasi", "3": "Puisi Anak", "4": "Teks Informasi", "5": "Teks Prosedur", "6": "Pidato Singkat" },
    "B. INDONESIA": { "1": "Teks Deskripsi", "2": "Teks Narasi", "3": "Puisi Anak", "4": "Teks Informasi", "5": "Teks Prosedur", "6": "Pidato Singkat" },
  },
  "bsj-sd3": {
    "PPKN": { "5": "Hak dan Kewajiban serta Musyawarah", "6": "Keberagaman Budaya dan Gotong Royong" },
    "PAI": { "1": "Nabi dan Rasul", "2": "Shalat Fardhu", "3": "Akhlak Terpuji", "4": "Kisah Teladan Nabi", "5": "Doa Sehari-hari", "6": "Haji dan Ziarah" },
    "IPAS": { "1": "Makhluk Hidup dan Lingkungannya", "2": "Wujud Zat dan Perubahannya", "3": "Energi dan Perubahannya", "4": "Ekosistem", "5": "Manusia dan Lingkungan", "6": "Bumi, Bulan dan Tata Surya" },
    "MTK": { "1": "Bilangan Cacah Sampai 10.000", "2": "Penjumlahan dan Pengurangan", "3": "Perkalian dan Pembagian", "4": "Pecahan Sederhana", "5": "Pengukuran Panjang dan Berat", "6": "Bangun Datar" },
    "BINDO": { "1": "Kalimat dan Tanda Baca", "2": "Teks Deskripsi", "3": "Teks Narasi", "4": "Puisi Anak", "5": "Teks Informasi", "6": "Pidato Singkat" },
    "B. INDONESIA": { "1": "Kalimat dan Tanda Baca", "2": "Teks Deskripsi", "3": "Teks Narasi", "4": "Puisi Anak", "5": "Teks Informasi", "6": "Pidato Singkat" },
  },
  "bsj-sd4": { "PPKN": { "1": "Pancasila Sebagai Dasar Negara", "2": "Hak dan Kewajiban", "3": "Keberagaman Budaya", "4": "Kerja Sama dan Gotong Royong", "5": "Musyawarah dan Demokrasi", "6": "NKRI dan Semangat Kebangsaan" } },
  "bsj-sd5": { "PPKN": { "1": "Pancasila dan Nilai-nilainya", "2": "Norma dan Aturan", "3": "Keberagaman Sosial Budaya", "4": "Gotong Royong dan Kerja Sama", "5": "Musyawarah Mufakat", "6": "Cinta Tanah Air" } },
  "bsj-sd6": { "PPKN": { "1": "Pancasila Sebagai Ideologi", "2": "Hak, Kewajiban dan Tanggung Jawab", "3": "Persatuan dan Kesatuan", "4": "Kerja Sama dalam Keberagaman", "5": "Demokrasi dan Musyawarah", "6": "Bela Negara" } },
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
  const [hasil, setHasil] = useState<{benar: number, salah: number, skor: number, show: boolean} | null>(null);
  const [saving, setSaving] = useState(false);

  const aliasList = getAliasList(mapelParam);
  const mapelDisplay = getCanonicalDisplay(mapelParam);

  useEffect(() => {
    async function fetchSoal() {
      setLoading(true);
      const { data, error } = await supabase
        .from("soal")
        .select("*")
        .eq("kelas", kelas)
        .in("mapel", aliasList)
        .eq("bab_ke", parseInt(babParam))
        .order("no_urut", { ascending: true });
      if (!error) setSoal(data || []);
      setLoading(false);
    }
    fetchSoal();
  }, [kelas, mapelParam, babParam]);

  const getJudulBab = () => {
    const kelasKey = kelas.toLowerCase();
    const mapelKey = mapelDisplay.toUpperCase();
    const judulMap = JUDUL_BAB_ALL[kelasKey]?.[mapelKey]?.[babParam] || JUDUL_BAB_ALL[kelasKey]?.[mapelParam.toUpperCase()]?.[babParam];
    if (judulMap) return judulMap;
    return `BAB ${babParam}`;
  };

  const handleJawab = (no: number, opsi: string) => {
    setJawabanUser({ ...jawabanUser, [no]: opsi });
  };

  const handleKumpulkan = async () => {
    let benar = 0;
    soal.forEach((s: any) => {
      const jawab = jawabanUser[s.no_urut];
      if (jawab && jawab.toUpperCase() === (s.jawaban || "").toUpperCase()) benar++;
    });
    const total = soal.length || 30;
    const salah = total - benar;
    const skor = Math.round((benar / total) * 100);
    setHasil({ benar, salah, skor, show: true });

    // SIMPAN KE SUPABASE TABLE skor_bab
    setSaving(true);
    try {
      await supabase.from("skor_bab").insert({
        kelas: kelas,
        mapel: mapelDisplay,
        bab_ke: parseInt(babParam),
        judul_bab: getJudulBab(),
        total_soal: total,
        benar: benar,
        salah: salah,
        skor: skor,
      });
    } catch (e) {
      console.log("Save skor error (table belum dibuat?):", e);
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading soal {kelas} {mapelDisplay} BAB {babParam}... (alias: {aliasList.join(", ")})</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow">
        <h1 className="font-bold text-sm md:text-base">
          {kelas.toUpperCase()} - {mapelDisplay} BAB {babParam} - {getJudulBab()} - {soal.length} SOAL
        </h1>
        <div className="flex gap-2 items-center">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded hidden md:inline">{aliasList.join(", ")}</span>
          <button onClick={handleKumpulkan} className="text-xs bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-bold">
            Kumpulkan & Lihat Score
          </button>
        </div>
      </div>

      {hasil?.show && (
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-xl mb-6 shadow-lg">
          <h2 className="text-xl font-bold mb-2">🎉 Score BAB {babParam}: {hasil.skor}%</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/20 rounded-lg p-3"><div className="text-2xl font-bold">{hasil.benar}</div><div className="text-xs">Benar</div></div>
            <div className="bg-white/20 rounded-lg p-3"><div className="text-2xl font-bold">{hasil.salah}</div><div className="text-xs">Salah</div></div>
            <div className="bg-white/20 rounded-lg p-3"><div className="text-2xl font-bold">{hasil.skor}%</div><div className="text-xs">Score</div></div>
          </div>
          <div className="mt-4 flex gap-2">
            <a href={`/soal/${kelas}`} className="bg-white text-green-600 px-4 py-2 rounded-full text-xs font-bold">Lihat Total Score {kelas.toUpperCase()}</a>
            <span className="text-xs self-center">{saving ? "Menyimpan..." : "✅ Score tersimpan di Supabase!"}</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {soal.map((s: any, idx: number) => {
          const isPG = (s.tipe_soal || s.tipe || "").toUpperCase() === "PG";
          const opsiList = [
            { key: "A", text: s.opsi_a },
            { key: "B", text: s.opsi_b },
            { key: "C", text: s.opsi_c },
            { key: "D", text: s.opsi_d },
          ].filter((o) => o.text && o.text.trim() !== "");
          const userJawab = jawabanUser[s.no_urut];
          const isBenar = hasil?.show && userJawab && userJawab.toUpperCase() === (s.jawaban || "").toUpperCase();
          const isSalah = hasil?.show && userJawab && userJawab.toUpperCase() !== (s.jawaban || "").toUpperCase();

          return (
            <div key={s.id || idx} className={`bg-white border-2 rounded-xl p-4 shadow-sm ${isBenar ? "border-green-400 bg-green-50" : isSalah ? "border-red-400 bg-red-50" : "border-gray-200"}`}>
              <div className="font-bold text-sm mb-3">
                <span className="bg-orange-400 text-white px-2 py-0.5 rounded text-xs mr-2">{s.no_urut || idx + 1}</span>
                [{s.tipe_soal || "pg"}] {s.pertanyaan} {isBenar && "✅"} {isSalah && "❌"}
              </div>
              {isPG && opsiList.length > 0 ? (
                <div className="space-y-2">
                  {opsiList.map((opsi) => (
                    <label key={opsi.key} className={`flex items-center gap-2 border rounded-lg p-3 cursor-pointer hover:bg-blue-50 ${userJawab === opsi.key ? "bg-blue-100 border-blue-400" : "border-gray-300"}`}>
                      <input type="radio" name={`soal-${s.no_urut}`} value={opsi.key} checked={userJawab === opsi.key} onChange={() => handleJawab(s.no_urut, opsi.key)} className="accent-blue-600" />
                      <span className="text-sm">{opsi.key}. {opsi.text} {hasil?.show && opsi.key === s.jawaban && <b className="text-green-600">(Kunci)</b>}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div><textarea placeholder="Tulis jawaban..." className="w-full border rounded-lg p-3 text-sm min-h-[80px]" onChange={(e) => handleJawab(s.no_urut, e.target.value)} /></div>
              )}
              {hasil?.show && s.pembahasan && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs"><b>Pembahasan:</b> {s.pembahasan} <br/><b>Kunci:</b> {s.jawaban}</div>
              )}
            </div>
          );
        })}
      </div>

      {soal.length === 0 && (
        <div className="text-center p-8 bg-white rounded-xl">Soal tidak ditemukan untuk {kelas} {mapelParam} (alias: {aliasList.join(", ")}) BAB {babParam}. Cek Supabase!</div>
      )}

      {soal.length > 0 && !hasil?.show && (
        <div className="mt-6 text-center"><button onClick={handleKumpulkan} className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg">Kumpulkan & Hitung Score BAB {babParam}</button></div>
      )}
    </div>
  );
}
