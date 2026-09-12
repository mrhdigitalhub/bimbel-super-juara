"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 5 MAPEL ASLI 34 BAB BSJ-SD1 DARI MEMORY STEP1 - INI YANG BENER BOS
const JUDUL_BAB_ALL: any = {
  "bsj-sd1": {
    "Matematika": { "1": "Bilangan 1-20", "2": "Penjumlahan Sederhana", "3": "Pengurangan Sederhana", "4": "Bentuk & Pola", "5": "Pengukuran Panjang", "6": "Waktu & Uang", "7": "Bangun Datar", "8": "Diagram Sederhana" },
    "Bahasa Indonesia": { "1": "Bunyi & Huruf", "2": "Suku Kata", "3": "Kalimat Sederhana", "4": "Cerita Pendek", "5": "Kosakata Sehari-hari", "6": "Tanda Baca", "7": "Membaca Nyaring", "8": "Menulis Cerita 1 Paragraf" },
    "IPAS": { "1": "Tubuhku", "2": "Keluargaku", "3": "Lingkungan Sekolah", "4": "Benda di Sekitar", "5": "Cuaca & Musim", "6": "Makhluk Hidup" },
    "PAI": { "1": "Rukun Iman", "2": "Rukun Islam", "3": "Wudu & Shalat", "4": "Akhlak Terpuji", "5": "Kisah Nabi", "6": "Doa Harian" },
    "Pancasila": { "1": "Simbol Pancasila", "2": "Aturan di Rumah", "3": "Aturan di Sekolah", "4": "Tolong Menolong", "5": "Kebersihan", "6": "Cinta Tanah Air" }
  },
  "bsj-sd2": {
    "Matematika": { "1": "Bilangan 1-100", "2": "Penjumlahan Bersusun", "3": "Pengurangan Bersusun", "4": "Perkalian Dasar", "5": "Pembagian Dasar", "6": "Uang & Waktu", "7": "Bangun Datar & Ruang", "8": "Pengukuran Berat" },
    "Bahasa Indonesia": { "1": "Kalimat Efektif", "2": "Teks Deskripsi Benda", "3": "Teks Narasi", "4": "Puisi Anak", "5": "Kosakata Baku", "6": "Huruf Kapital", "7": "Membaca Pemahaman", "8": "Menulis Karangan" },
    "IPAS": { "1": "Bagian Tumbuhan", "2": "Bagian Hewan", "3": "Energi Sehari-hari", "4": "Wujud Benda", "5": "Lingkungan Sehat", "6": "Gaya & Gerak", "7": "Siklus Air", "8": "Kesehatan Tubuh" },
    "PAI": { "1": "Asmaul Husna", "2": "Shalat Fardhu", "3": "Puasa Ramadhan", "4": "Akhlak Mulia", "5": "Kisah Sahabat Nabi", "6": "Al-Quran Iqra" },
    "Pancasila": { "1": "Nilai Pancasila", "2": "Hak & Kewajiban", "3": "Musyawarah", "4": "Keberagaman", "5": "Gotong Royong", "6": "Lambang Negara" }
  },
  "bsj-sd3": {
    "Matematika": { "1": "Bilangan 1.000-10.000", "2": "Penjumlahan & Pengurangan", "3": "Perkalian & Pembagian", "4": "Pecahan Sederhana", "5": "Pengukuran Waktu & Panjang", "6": "Keliling & Luas", "7": "Sudut & Garis", "8": "Diagram & Data", "9": "Bangun Datar", "10": "Bangun Ruang Sederhana" },
    "Bahasa Indonesia": { "1": "Teks Deskripsi", "2": "Teks Narasi", "3": "Teks Prosedur", "4": "Puisi & Pantun", "5": "Imbuhan & Kata Baku", "6": "Kalimat Efektif", "7": "Membaca Intensif", "8": "Menulis Laporan", "9": "Pidato Sederhana", "10": "Surat Pribadi" },
    "IPAS": { "1": "Ciri Makhluk Hidup", "2": "Bagian Tumbuhan & Fungsi", "3": "Ekosistem", "4": "Wujud & Perubahan Benda", "5": "Energi & Sumbernya", "6": "Cuaca & Iklim", "7": "Tata Surya", "8": "Daur Hidup", "9": "Lingkungan & Pelestarian", "10": "Gaya & Pesawat Sederhana" },
    "PAI": { "1": "Sifat Wajib Allah", "2": "Shalat Sunnah", "3": "Zakat & Infak", "4": "Akhlak Terpuji", "5": "Kisah Nabi Ulul Azmi", "6": "Haji & Umrah", "7": "Al-Quran Surah Pendek", "8": "Hadis Akhlak" },
    "Pancasila": { "1": "Norma & Aturan", "2": "Hak & Kewajiban Warga", "3": "Musyawarah & Demokrasi", "4": "Keberagaman Budaya", "5": "Kerjasama", "6": "Sejarah Pancasila", "7": "Lambang Garuda", "8": "Cinta NKRI" }
  },
  "bsj-sd4": {
    "Matematika": { "1": "Bilangan Cacah Besar", "2": "KPK & FPB", "3": "Pecahan Campuran", "4": "Desimal & Persen", "5": "Keliling & Luas Gabungan", "6": "Volume Balok Kubus", "7": "Sudut", "8": "Statistika", "9": "Skala & Denah", "10": "Pembulatan & Penaksiran" },
    "Bahasa Indonesia": { "1": "Teks Fiksi", "2": "Teks Nonfiksi", "3": "Teks Prosedur Kompleks", "4": "Pantun & Syair", "5": "Tata Bahasa", "6": "Kalimat Majemuk", "7": "Membaca Kritis", "8": "Menulis Esai Pendek", "9": "Wawancara", "10": "Iklan & Poster" },
    "IPAS": { "1": "Gaya & Sifatnya", "2": "Energi & Perubahan", "3": "Bunyi & Cahaya", "4": "Tumbuhan & Fotosintesis", "5": "Hewan & Habitat", "6": "Daur Hidup & Ekosistem", "7": "Tata Surya Lanjutan", "8": "Bumi & Lapisan", "9": "Perubahan Lingkungan", "10": "Teknologi Sehari-hari" },
    "PAI": { "1": "Iman Kepada Malaikat", "2": "Iman Kepada Kitab", "3": "Shalat Jumat", "4": "Puasa Wajib & Sunnah", "5": "Zakat Fitrah & Mal", "6": "Kisah Nabi & Rasul", "7": "Al-Quran Tajwid", "8": "Akhlak dalam Keluarga" },
    "Pancasila": { "1": "Pancasila sebagai Ideologi", "2": "UUD 1945", "3": "Bhinneka Tunggal Ika", "4": "Hak & Kewajiban Konstitusional", "5": "Demokrasi Pancasila", "6": "Otonomi Daerah", "7": "Keragaman Sosial Budaya", "8": "NKRI & Ancaman" }
  },
  "bsj-sd5": {
    "Matematika": { "1": "Bilangan Bulat", "2": "Pecahan Operasi", "3": "Perbandingan & Skala", "4": "Kubus & Balok Volume", "5": "Jaring-jaring", "6": "Kecepatan & Debit", "7": "Statistika Mean Median", "8": "Diagram Lingkaran", "9": "Koordinat Kartesius", "10": "Peluang Sederhana" },
    "Bahasa Indonesia": { "1": "Teks Eksplanasi", "2": "Teks Eksposisi", "3": "Teks Pidato", "4": "Cerpen", "5": "Majas & Peribahasa", "6": "Tata Kalimat", "7": "Membaca Analisis", "8": "Menulis Artikel", "9": "Surat Resmi", "10": "Drama Pendek" },
    "IPAS": { "1": "Sistem Pernapasan", "2": "Sistem Pencernaan", "3": "Sistem Peredaran Darah", "4": "Ekosistem & Rantai Makanan", "5": "Siklus Air & Daur", "6": "Listrik & Magnet", "7": "Cahaya & Alat Optik", "8": "Bumi & Antariksa", "9": "Zat & Campuran", "10": "Perubahan Lingkungan" },
    "PAI": { "1": "Iman Kepada Hari Akhir", "2": "Akhlak Terpuji Lanjutan", "3": "Fikih Shalat & Puasa", "4": "Fikih Muamalah", "5": "Kisah Khulafaur Rasyidin", "6": "Al-Quran Qalqalah", "7": "Hadis Pilihan", "8": "Toleransi Beragama" },
    "Pancasila": { "1": "Ideologi & Konstitusi", "2": "Peraturan Perundang-undangan", "3": "Keberagaman & Toleransi", "4": "Gotong Royong & Keadilan", "5": "Demokrasi & Pemilu", "6": "Hak Asasi Manusia", "7": "Globalisasi", "8": "Cinta Produk Dalam Negeri", "9": "Bela Negara", "10": "Kewirausahaan Pancasila" }
  },
  "bsj-sd6": {
    "Matematika": { "1": "Bilangan Bulat & Desimal", "2": "Operasi Hitung Campuran", "3": "Pecahan & Perbandingan", "4": "Lingkaran", "5": "Bangun Ruang Gabungan", "6": "Statistika Lanjutan", "7": "Koordinat & Refleksi", "8": "Skala & Perbandingan Senilai", "9": "Kecepatan Debit & Volume", "10": "Peluang & Kombinasi" },
    "Bahasa Indonesia": { "1": "Teks Laporan Hasil Observasi", "2": "Teks Eksplanasi Ilmiah", "3": "Teks Pidato Persuasif", "4": "Cerita Fiksi & Nilai", "5": "Puisi & Unsur", "6": "Bahasa Baku & Tidak Baku", "7": "Membaca Kritis & Sintesis", "8": "Menulis Karya Ilmiah Sederhana", "9": "Surat Resmi & Lamaran", "10": "Drama & Naskah" },
    "IPAS": { "1": "Sistem Reproduksi Manusia", "2": "Listrik & Rangkaian", "3": "Magnet & Gaya", "4": "Ekosistem & Pelestarian", "5": "Bumi Bulan & Gerhana", "6": "Tata Surya & Galaksi", "7": "Perubahan Wujud & Kimia", "8": "Adaptasi Makhluk Hidup", "9": "Teknologi Ramah Lingkungan", "10": "Perubahan Iklim" },
    "PAI": { "1": "Iman Kepada Qada Qadar", "2": "Akhlak Mahmudah & Mazmumah", "3": "Fikih Haji & Umrah", "4": "Fikih Jinayah", "5": "Sejarah Kebudayaan Islam", "6": "Al-Quran Makhorijul Huruf", "7": "Hadis Arbain", "8": "Toleransi & Moderasi" },
    "Pancasila": { "1": "Pancasila & UUD 1945", "2": "Sistem Pemerintahan Indonesia", "3": "Demokrasi & Pemilu", "4": "Globalisasi & Dampak", "5": "Hak & Kewajiban Warga Negara", "6": "Bela Negara & Patriotisme", "7": "Keadilan Sosial", "8": "Persatuan & Kesatuan", "9": "Wawasan Nusantara", "10": "Kewarganegaraan Digital" }
  }
};

const WARNA: any = {
  "Matematika": { bg: "bg-green-50", header: "bg-green-100", pastel: "Pastel Hijau" },
  "Bahasa Indonesia": { bg: "bg-red-50", header: "bg-red-100", pastel: "Pastel Merah" },
  "IPAS": { bg: "bg-yellow-50", header: "bg-yellow-100", pastel: "Pastel Kuning" },
  "PAI": { bg: "bg-emerald-50", header: "bg-emerald-100", pastel: "Pastel Hijau Tua" },
  "Pancasila": { bg: "bg-blue-50", header: "bg-blue-100", pastel: "Pastel Biru" }
};

type Hasil = { id: string; kode_akses: string; mapel: string; bab: number; benar: number; salah: number; score: number; created_at: string; };

export default function DashboardKelasPage() {
  const params = useParams();
  const kelas = ((params.kelas as string) || "bsj-sd1").toLowerCase();
  const [kode, setKode] = useState("");
  const [hasil, setHasil] = useState<Hasil[]>([]);
  const [showPantau, setShowPantau] = useState(false);

  useEffect(() => {
    const k = localStorage.getItem("bsj_kode_aktif") || "BSJ-SD1-W4CU";
    setKode(k);
    supabase.from("hasil_latihan").select("*").eq("kode_akses", k).order("created_at", { ascending: false }).then(function (res) {
      if (res.data) setHasil(res.data as any);
    });
  }, []);

  const judulBabKelas = JUDUL_BAB_ALL[kelas] || JUDUL_BAB_ALL["bsj-sd1"];
  let totalBAB = 0;
  Object.values(judulBabKelas).forEach(function (m: any) { totalBAB += Object.keys(m).length; });
  if (totalBAB === 0) totalBAB = 34;

  const selesai = hasil.length;
  let totalScore = 0;
  hasil.forEach(function (h) { totalScore += h.score; });
  const rata = selesai ? Math.round(totalScore / selesai) : 0;

  let totalBenar = 0;
  let totalSoal = 0;
  hasil.forEach(function (h) { totalBenar += h.benar; totalSoal += h.benar + h.salah; });

  function getJudul(mapel: string, bab: number) {
    if (JUDUL_BAB_ALL[kelas] && JUDUL_BAB_ALL[kelas][mapel] && JUDUL_BAB_ALL[kelas][mapel][String(bab)]) {
      return JUDUL_BAB_ALL[kelas][mapel][String(bab)];
    }
    return "BAB " + bab;
  }

  function normalizeMapel(s: string) {
    const low = s.toLowerCase();
    if (low.includes("matematika") || low === "mtk") return "Matematika";
    if (low.includes("indonesia") || low.includes("b. indonesia")) return "Bahasa Indonesia";
    if (low.includes("ipas")) return "IPAS";
    if (low === "pai" || low.includes("agama")) return "PAI";
    if (low.includes("pancasila") || low.includes("ppkn") || low.includes("ppkn")) return "Pancasila";
    return s;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-[#fffcf5] min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-base">BSJ-{kelas.toUpperCase()} - Dashboard Score Lengkap {totalBAB} BAB - 5 Mapel</h1>
        <div className="flex gap-2 items-center">
          <span className="text-[10px] bg-green-100 px-2 py-1 rounded-full">Kode: {kode}</span>
          <button onClick={function () { setShowPantau(!showPantau); }} className="text-xs bg-black text-white px-3 py-1.5 rounded-full font-bold">Pantauan Orang Tua {hasil.length > 0 ? "(" + hasil.length + ")" : ""}</button>
        </div>
      </div>

      {showPantau && (
        <div className="border rounded-xl bg-white p-4 mb-5">
          <h2 className="font-bold text-sm mb-3">Pantauan Orang Tua - {kode} - {kelas.toUpperCase()}</h2>
          {hasil.length === 0 ? <div className="text-sm text-gray-500 p-4 text-center border rounded-lg">Belum ada latihan</div> : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-gray-50"><tr><th className="p-2 text-left">Waktu</th><th className="p-2 text-left">Mapel BAB</th><th className="p-2 text-center">Score</th></tr></thead>
                <tbody>{hasil.map(function (h) { return (
                  <tr key={h.id} className="border-t"><td className="p-2">{new Date(h.created_at).toLocaleString("id-ID")}</td><td className="p-2"><b>{h.mapel} BAB {h.bab}</b><br/><span className="text-[10px] text-gray-500">{getJudul(normalizeMapel(h.mapel), h.bab)}</span></td><td className="p-2 text-center"><span className={h.score >= 70 ? "bg-green-100 text-green-700 px-2 py-1 rounded-full text-[10px] font-bold" : "bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-[10px] font-bold"}>{h.score}%</span></td></tr>
                ); })}</tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white p-5 mb-6">
        <div className="flex justify-between items-center">
          <div><div className="text-xs opacity-80">Total Score Kelas</div><div className="text-4xl font-bold">{rata}%</div><div className="text-xs mt-1 opacity-80">{selesai} / {totalBAB} BAB selesai - Benar {totalBenar} / {totalSoal || 0}</div></div>
          <div className="text-center"><div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">{rata}%</div><div className="text-[10px] mt-1 opacity-80">Progress</div></div>
        </div>
        <div className="w-full bg-white/20 h-2 rounded-full mt-4"><div className="bg-white h-2 rounded-full" style={{ width: (totalBAB ? (selesai / totalBAB) * 100 : 0) + "%" }} /></div>
      </div>

      {Object.keys(judulBabKelas).map(function (mapel) {
        const babs = judulBabKelas[mapel];
        const totalMapel = Object.keys(babs).length;
        const doneMapel = hasil.filter(function (h) { return normalizeMapel(h.mapel).toLowerCase() === mapel.toLowerCase(); }).length;
        let scoreMapel = 0;
        hasil.filter(function (h) { return normalizeMapel(h.mapel).toLowerCase() === mapel.toLowerCase(); }).forEach(function (h) { scoreMapel += h.score; });
        const rataMapel = doneMapel ? Math.round(scoreMapel / doneMapel) : 0;
        const w = WARNA[mapel] || { bg: "bg-gray-50", header: "bg-gray-100", pastel: "Pastel Abu" };
        return (
          <div key={mapel} className={"border rounded-xl p-3 mb-5 " + w.bg}>
            <div className={"flex justify-between items-center p-3 rounded-lg mb-3 border " + w.header}>
              <div className="flex items-center gap-2"><span className="font-bold text-sm">{mapel}</span><span className="text-[10px] opacity-70">{doneMapel}/{totalMapel} BAB - Rata {rataMapel}% - {w.pastel}</span></div>
              <div className="w-24 h-1.5 bg-white/70 rounded-full"><div className="bg-black/20 h-1.5 rounded-full" style={{ width: (totalMapel ? (doneMapel / totalMapel) * 100 : 0) + "%" }} /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {Object.keys(babs).map(function (babStr) {
                const bab = parseInt(babStr, 10);
                const judul = babs[babStr];
                const skor = hasil.find(function (h) { return normalizeMapel(h.mapel).toLowerCase() === mapel.toLowerCase() && h.bab === bab; });
                return (
                  <a key={mapel + "-" + bab} href={"/soal/" + kelas + "/latihan?mapel=" + encodeURIComponent(mapel) + "&bab=" + bab} className="bg-white border rounded-lg p-3 hover:border-blue-400 flex justify-between items-start">
                    <div className="pr-2"><div className="text-[10px] text-gray-500">BAB {bab}</div><div className="font-bold text-xs leading-tight">{judul}</div><div className="text-[10px] text-gray-500 mt-1">{skor ? "Benar " + skor.benar : "Belum dikerjakan"}</div></div>
                    <div className={skor ? (skor.score >= 70 ? "bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-full font-bold" : "bg-yellow-100 text-yellow-700 text-[10px] px-2 py-1 rounded-full font-bold") : "bg-gray-100 text-gray-600 text-[10px] px-2 py-1 rounded-full font-bold"}>{skor ? skor.score + "%" : "0%"}</div>
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
