"use client";
import { useSearchParams, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

function getKanonikalMapel(mapelParam: string): string {
  if (!mapelParam) return "PPKN";
  const raw = decodeURIComponent(mapelParam).trim().toLowerCase();
  if (raw.includes("indo") || raw.includes("bindo")) return "B. INDONESIA";
  if (raw.includes("mtk") || raw.includes("matematika") || raw.includes("math")) return "MTK";
  if (raw.includes("pai") || raw.includes("agama")) return "PAI";
  if (raw.includes("ppkn") || raw.includes("pkn") || raw.includes("pancasila")) return "PPKN";
  if (raw.includes("ipas") || raw === "ipa" || raw === "ips") return "IPAS";
  return raw.toUpperCase() === "BINDO" ? "B. INDONESIA" : decodeURIComponent(mapelParam).toUpperCase();
}

const JUDUL_BAB_LENGKAP: any = {
  "bsj-sd1": {
    "PPKN": { "1": "Lambang Garuda Pancasila", "2": "Aturan di Rumah dan Sekolah", "3": "Toleransi dan Keberagaman", "4": "Gotong Royong", "5": "Mengenal Pancasila", "6": "Bhinneka Tunggal Ika" },
    "PAI": { "1": "Mengenal Huruf Hijaiyah", "2": "Rukun Iman", "3": "Rukun Islam", "4": "Kisah Nabi Muhammad", "5": "Doa Sehari-hari", "6": "Akhlak Terpuji" },
    "IPAS": { "1": "Mengenal Bagian Tubuh", "2": "Panca Indera", "3": "Makhluk Hidup di Sekitar", "4": "Benda di Sekitarku", "5": "Cuaca dan Musim", "6": "Lingkungan Rumahku" },
    "MTK": { "1": "Bilangan 1 Sampai 10", "2": "Penjumlahan Sederhana", "3": "Pengurangan Sederhana", "4": "Mengenal Bentuk", "5": "Pengukuran Panjang", "6": "Bilangan Sampai 20" },
    "B. INDONESIA": { "1": "Bunyi dan Huruf", "2": "Sapa dan Salam", "3": "Cerita Bergambar", "4": "Kosakata Baru", "5": "Kalimat Sederhana", "6": "Membaca Nyaring" },
  },
  "bsj-sd2": {
    "PPKN": { "1": "Lambang dan Sila Pancasila", "2": "Aturan dan Tata Tertib", "3": "Hak dan Kewajiban", "4": "Gotong Royong di Sekolah", "5": "Musyawarah", "6": "Keberagaman di Rumah" },
    "PAI": { "1": "Asmaul Husna", "2": "Shalat Fardhu", "3": "Kisah Nabi Nuh", "4": "Perilaku Jujur", "5": "Doa Sebelum dan Sesudah Belajar", "6": "Kisah Nabi Saleh" },
    "IPAS": { "1": "Wujud Benda", "2": "Perubahan Benda", "3": "Tumbuhan di Sekitar", "4": "Hewan di Sekitar", "5": "Energi di Sekitar", "6": "Cuaca dan Lingkungan" },
    "MTK": { "1": "Bilangan Cacah Sampai 100", "2": "Penjumlahan dan Pengurangan", "3": "Perkalian dan Pembagian", "4": "Pengukuran Waktu dan Panjang", "5": "Bangun Datar Sederhana", "6": "Diagram Gambar" },
    "B. INDONESIA": { "1": "Teks Deskripsi", "2": "Teks Narasi", "3": "Puisi Anak", "4": "Teks Informasi", "5": "Teks Prosedur", "6": "Pidato Singkat" },
  },
  "bsj-sd3": {
    "PPKN": { "1": "Lambang Negara dan Pancasila", "2": "Aturan dan Norma", "3": "Hak dan Kewajiban Warga", "4": "Keberagaman Budaya", "5": "Hak dan Kewajiban serta Musyawarah", "6": "Keberagaman Budaya dan Gotong Royong" },
    "PAI": { "1": "Nabi dan Rasul", "2": "Shalat Fardhu", "3": "Akhlak Terpuji", "4": "Kisah Teladan Nabi", "5": "Doa Sehari-hari", "6": "Haji dan Ziarah" },
    "IPAS": { "1": "Makhluk Hidup dan Lingkungannya", "2": "Wujud Zat dan Perubahannya", "3": "Energi dan Perubahannya", "4": "Ekosistem", "5": "Manusia dan Lingkungan", "6": "Bumi, Bulan dan Tata Surya" },
    "MTK": { "1": "Bilangan Cacah Sampai 10.000", "2": "Penjumlahan dan Pengurangan", "3": "Perkalian dan Pembagian", "4": "Pecahan Sederhana", "5": "Pengukuran Panjang dan Berat", "6": "Bangun Datar" },
    "B. INDONESIA": { "1": "Kalimat dan Tanda Baca", "2": "Teks Deskripsi", "3": "Teks Narasi", "4": "Puisi Anak", "5": "Teks Informasi", "6": "Pidato Singkat" },
  },
  "bsj-sd4": {
    "PPKN": { "1": "Pancasila Sebagai Dasar Negara", "2": "Hak dan Kewajiban", "3": "Keberagaman Budaya", "4": "Kerja Sama dan Gotong Royong", "5": "Musyawarah dan Demokrasi", "6": "NKRI dan Semangat Kebangsaan" },
    "PAI": { "1": "Surah At-Tin dan Al-Maun", "2": "Iman Kepada Malaikat", "3": "Kisah Nabi Muhammad di Madinah", "4": "Zakat", "5": "Perilaku Terpuji", "6": "Kisah Sahabat Nabi" },
    "IPAS": { "1": "Gaya di Sekitar Kita", "2": "Energi dan Transformasi", "3": "Bagian Tumbuhan dan Fungsinya", "4": "Keragaman Budaya Indonesia", "5": "Sistem Tata Surya", "6": "Kenampakan Alam Indonesia" },
    "MTK": { "1": "Bilangan Cacah Besar", "2": "Pecahan", "3": "Pola Bilangan", "4": "Pengukuran Sudut dan Luas", "5": "Bangun Datar dan Volume", "6": "Statistika Sederhana" },
    "B. INDONESIA": { "1": "Teks Narasi dan Informasi", "2": "Teks Prosedur", "3": "Puisi dan Pantun", "4": "Teks Deskripsi Objektif", "5": "Teks Persuasi", "6": "Pidato dan Wawancara" },
  },
  "bsj-sd5": {
    "PPKN": { "1": "Pancasila dan Nilai-nilainya", "2": "Norma dan Aturan", "3": "Keberagaman Sosial Budaya", "4": "Gotong Royong dan Kerja Sama", "5": "Musyawarah Mufakat", "6": "Cinta Tanah Air" },
    "PAI": { "1": "Surah Al-Maidah dan At-Tahrim", "2": "Iman Kepada Rasul", "3": "Puasa Ramadan", "4": "Kisah Nabi Daud dan Sulaiman", "5": "Akhlak Terhadap Sesama", "6": "Khalifah dan Walisongo" },
    "IPAS": { "1": "Sistem Pernapasan Manusia", "2": "Sistem Pencernaan Manusia", "3": "Zat dan Perubahannya", "4": "Gaya dan Gerak", "5": "Ekosistem dan Rantai Makanan", "6": "Pelestarian Lingkungan" },
    "MTK": { "1": "Bilangan Cacah Sampai 100.000", "2": "Pecahan dan Desimal", "3": "Perbandingan dan Skala", "4": "Bangun Datar dan Ruang", "5": "Pengumpulan Data", "6": "Keliling dan Luas" },
    "B. INDONESIA": { "1": "Ide Pokok dan Gagasan Utama", "2": "Teks Eksplanasi", "3": "Puisi dan Syair", "4": "Teks Persuasi dan Iklan", "5": "Pidato dan Diskusi", "6": "Cerita Rakyat dan Drama" },
  },
  "bsj-sd6": {
    "PPKN": { "1": "Pancasila Sebagai Ideologi", "2": "Hak, Kewajiban dan Tanggung Jawab", "3": "Persatuan dan Kesatuan", "4": "Kerja Sama dalam Keberagaman", "5": "Demokrasi dan Musyawarah", "6": "Bela Negara" },
    "PAI": { "1": "Surah Al-Qalam dan Al-Hujurat", "2": "Iman Kepada Hari Akhir", "3": "Haji dan Umrah", "4": "Kisah Nabi Ayyub dan Yunus", "5": "Toleransi dan Kerukunan", "6": "Kisah Khulafaur Rasyidin" },
    "IPAS": { "1": "Rangka dan Sistem Gerak Manusia", "2": "Siklus Air dan Cuaca", "3": "Listrik dan Magnet", "4": "Perubahan Wujud Zat", "5": "Ekosistem dan Pelestarian", "6": "Bumi dan Antariksa" },
    "MTK": { "1": "Bilangan Bulat dan Pecahan", "2": "Operasi Hitung Campuran", "3": "Bangun Ruang", "4": "Statistika dan Diagram", "5": "Perbandingan dan Skala Lanjutan", "6": "Koordinat dan Denah" },
    "B. INDONESIA": { "1": "Teks Laporan Hasil Observasi", "2": "Teks Eksplanasi Fenomena", "3": "Puisi dan Teks Pidato", "4": "Teks Formulir dan Surat", "5": "Cerpen dan Drama", "6": "Teks Argumentasi" },
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
  const [hasil, setHasil] = useState<{benar: number, salah: number, skor: number, show: boolean} | null>(null);
  const [saving, setSaving] = useState(false);

  const kanonikalMapel = getKanonikalMapel(mapelParam);
  const getJudulBab = () => JUDUL_BAB_LENGKAP[kelas]?.[kanonikalMapel]?.[babParam] || `BAB ${babParam}`;

  useEffect(() => {
    async function fetchSoal() {
      setLoading(true);
      const { data } = await supabase.from("soal").select("*").eq("kelas", kelas).eq("mapel", kanonikalMapel).eq("bab_ke", parseInt(babParam)).order("no_urut", { ascending: true });
      setSoal(data || []);
      setLoading(false);
    }
    fetchSoal();
  }, [kelas, mapelParam, babParam, kanonikalMapel]);

  const handleJawab = (no: number, opsi: string) => setJawabanUser({ ...jawabanUser, [no]: opsi });

  const handleKumpulkan = async () => {
    let benar = 0;
    soal.forEach((s: any) => { const j = jawabanUser[s.no_urut]; if (j && j.toUpperCase() === (s.jawaban || "").toUpperCase()) benar++; });
    const total = soal.length || 30;
    const skor = Math.round((benar / total) * 100);
    setHasil({ benar, salah: total - benar, skor, show: true });
    setSaving(true);
    try { await supabase.from("skor_bab").insert({ kelas, mapel: kanonikalMapel, bab_ke: parseInt(babParam), judul_bab: getJudulBab(), total_soal: total, benar, salah: total - benar, skor }); } catch {}
    setSaving(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <div className="p-8 text-center">Loading {kelas.toUpperCase()} - {kanonikalMapel} BAB {babParam} - {getJudulBab()}...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* TOMBOL KEMBALI + HEADER - FIX YANG BOS MAU! */}
      <div className="mb-4">
        <a href={`/soal/${kelas}`} className="inline-flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full font-bold mb-3">
          ← Kembali ke Dashboard {kelas.toUpperCase()} - 30 BAB
        </a>
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow border">
          <div>
            <h1 className="font-bold text-sm md:text-base">{kelas.toUpperCase()} - {kanonikalMapel} BAB {babParam} - {getJudulBab()} - {soal.length} SOAL</h1>
            <div className="text-xs text-gray-500 mt-1">Mapel: {kanonikalMapel} | Judul: {getJudulBab()}</div>
          </div>
          <button onClick={handleKumpulkan} className="text-xs bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-bold whitespace-nowrap">Kumpulkan & Lihat Score</button>
        </div>
      </div>

      {hasil?.show && (
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-xl mb-6 shadow-lg">
          <h2 className="text-xl font-bold mb-1">🎉 Score {kanonikalMapel} BAB {babParam}: {hasil.skor}%</h2>
          <p className="text-sm opacity-90 mb-3">{getJudulBab()}</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/20 rounded-lg p-3"><div className="text-2xl font-bold">{hasil.benar}</div><div className="text-xs">Benar</div></div>
            <div className="bg-white/20 rounded-lg p-3"><div className="text-2xl font-bold">{hasil.salah}</div><div className="text-xs">Salah</div></div>
            <div className="bg-white/20 rounded-lg p-3"><div className="text-2xl font-bold">{hasil.skor}%</div><div className="text-xs">Score</div></div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={`/soal/${kelas}`} className="bg-white text-green-600 px-4 py-2 rounded-full text-xs font-bold">← Kembali ke Dashboard Lengkap 30 BAB</a>
            <a href={`/soal/${kelas}/latihan?mapel=${encodeURIComponent(kanonikalMapel)}&bab=${parseInt(babParam) + 1 <= 6 ? parseInt(babParam) + 1 : 1}`} className="bg-yellow-300 text-black px-4 py-2 rounded-full text-xs font-bold">Lanjut BAB {parseInt(babParam) + 1 <= 6 ? parseInt(babParam) + 1 : 1} →</a>
            <span className="text-xs self-center">{saving ? "Menyimpan..." : "✅ Score tersimpan!"}</span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {soal.map((s: any, idx: number) => {
          const opsiList = [{ key: "A", text: s.opsi_a }, { key: "B", text: s.opsi_b }, { key: "C", text: s.opsi_c }, { key: "D", text: s.opsi_d }].filter((o) => o.text);
          const userJawab = jawabanUser[s.no_urut];
          const isBenar = hasil?.show && userJawab?.toUpperCase() === (s.jawaban || "").toUpperCase();
          const isSalah = hasil?.show && userJawab && userJawab.toUpperCase() !== (s.jawaban || "").toUpperCase();
          return (
            <div key={s.id || idx} className={`bg-white border-2 rounded-xl p-4 shadow-sm ${isBenar ? "border-green-400 bg-green-50" : isSalah ? "border-red-400 bg-red-50" : "border-gray-200"}`}>
              <div className="font-bold text-sm mb-3"><span className="bg-orange-400 text-white px-2 py-0.5 rounded text-xs mr-2">{s.no_urut || idx + 1}</span>{s.pertanyaan} {isBenar && "✅"} {isSalah && "❌"}</div>
              <div className="space-y-2">{opsiList.map((opsi) => (<label key={opsi.key} className={`flex items-center gap-2 border rounded-lg p-3 cursor-pointer ${userJawab === opsi.key ? "bg-blue-100 border-blue-400" : "border-gray-300"}`}><input type="radio" name={`soal-${s.no_urut}`} value={opsi.key} checked={userJawab === opsi.key} onChange={() => handleJawab(s.no_urut, opsi.key)} /><span className="text-sm">{opsi.key}. {opsi.text} {hasil?.show && opsi.key === s.jawaban && <b className="text-green-600">(Kunci)</b>}</span></label>))}</div>
              {hasil?.show && s.pembahasan && (<div className="mt-3 p-3 bg-yellow-50 border rounded-lg text-xs"><b>Pembahasan:</b> {s.pembahasan}<br/><b>Kunci:</b> {s.jawaban}</div>)}
            </div>
          );
        })}
      </div>
      <div className="mt-8 flex justify-between">
        <a href={`/soal/${kelas}`} className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-full font-bold text-sm">← Dashboard Lengkap 30 BAB</a>
        <button onClick={handleKumpulkan} className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-bold">Kumpulkan & Hitung Score</button>
      </div>
    </div>
  );
}
