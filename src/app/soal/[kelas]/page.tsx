"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// 30 BAB FIX - FINAL KURMER 2025 - 180 BAB VALID FASE A/B/C - UPDATE 12/09/2026
const JUDUL_BAB_ALL: any = {
  "bsj-sd1": {
    "PAI & Budi Pekerti": { "1": "Rukun Iman", "2": "Bersuci & Wudhu", "3": "Mengenal Huruf Hijaiyah", "4": "Doa Sehari-hari", "5": "Kisah Nabi", "6": "Akhlak Terpuji" },
    "Bahasa Indonesia": { "1": "Bunyi dan Huruf", "2": "Sapa dan Salam", "3": "Cerita Bergambar", "4": "Kosakata Baru", "5": "Kalimat Sederhana", "6": "Membaca Nyaring" },
    "Matematika": { "1": "Bilangan 1-10", "2": "Penjumlahan & Pengurangan", "3": "Bangun Datar", "4": "Pengukuran Panjang", "5": "Waktu & Jam", "6": "Soal Cerita" },
    "PPKN": { "1": "Aturan di Rumah", "2": "Aturan di Sekolah", "3": "Simbol Pancasila", "4": "Hidup Rukun", "5": "Toleransi", "6": "Gotong Royong" },
    "IPAS": { "1": "Bagian Tubuh", "2": "Panca Indera", "3": "Makhluk Hidup", "4": "Benda di Sekitar", "5": "Cuaca", "6": "Lingkungan Bersih" },
  },
  "bsj-sd2": {
    "PAI & Budi Pekerti": { "1": "Asmaul Husna", "2": "Sholat Wajib", "3": "Kisah Rasul", "4": "Jujur & Amanah", "5": "Hafalan Doa", "6": "Adab Sehari-hari" },
    "Bahasa Indonesia": { "1": "Kalimat Efektif", "2": "Dongeng", "3": "Puisi Anak", "4": "Tanda Baca", "5": "Menulis Cerita", "6": "Wawancara" },
    "Matematika": { "1": "Bilangan 1-100", "2": "Perkalian & Pembagian", "3": "Uang", "4": "Jam & Waktu", "5": "Bangun Ruang", "6": "Pengukuran Berat" },
    "PPKN": { "1": "Lambang Negara", "2": "Hak & Kewajiban", "3": "Musyawarah", "4": "Kerja Sama", "5": "Keberagaman", "6": "Cinta Tanah Air" },
    "IPAS": { "1": "Tumbuhan", "2": "Hewan", "3": "Energi", "4": "Air & Udara", "5": "Bumi & Langit", "6": "Teknologi Sederhana" },
  },
  "bsj-sd3": {
    "PAI & Budi Pekerti": { "1": "Surah At-Tin & Al-Maun", "2": "Sifat Wajib Rasul", "3": "Sholat Jumat & Jenazah", "4": "Kisah Nabi Ibrahim", "5": "Zakat Fitrah", "6": "Akhlak Terpuji di Sekolah" },
    "Bahasa Indonesia": { "1": "Gagasan Pokok", "2": "Teks Petunjuk", "3": "Surat Pribadi", "4": "Teks Informasi", "5": "Pantun", "6": "Meringkas Teks" },
    "Matematika": { "1": "Bilangan 1-1000", "2": "Pecahan Sederhana", "3": "Garis & Sudut", "4": "Keliling Bangun Datar", "5": "Pengukuran Waktu & Berat", "6": "Diagram & Data" },
    "PPKN": { "1": "Makna Sila Pancasila", "2": "Aturan & Norma", "3": "Keberagaman Suku & Budaya", "4": "Kerja Sama di Lingkungan", "5": "Hak & Kewajiban di Sekolah", "6": "Semangat Bhinneka Tunggal Ika" },
    "IPAS": { "1": "Ciri Makhluk Hidup", "2": "Wujud Zat", "3": "Ekosistem Sederhana", "4": "Gaya & Gerak", "5": "Siklus Hidup", "6": "Pelestarian Lingkungan" },
  },
  "bsj-sd4": {
    "PAI & Budi Pekerti": { "1": "Surah Al-Zalzalah", "2": "Iman kepada Malaikat", "3": "Puasa Wajib", "4": "Kisah Nabi Ayyub", "5": "Toleransi", "6": "Perilaku Hemat" },
    "Bahasa Indonesia": { "1": "Teks Deskripsi", "2": "Teks Narasi", "3": "Teks Prosedur", "4": "Puisi & Pantun", "5": "Pidato", "6": "Cerita Rakyat" },
    "Matematika": { "1": "Bilangan Cacah Besar", "2": "Pecahan Campuran", "3": "KPK & FPB", "4": "Bangun Datar & Simetri", "5": "Pengukuran Sudut & Luas", "6": "Statistika Sederhana" },
    "PPKN": { "1": "Pancasila sebagai Dasar Negara", "2": "UUD 1945", "3": "Keberagaman Budaya Nasional", "4": "Kerja Sama ASEAN", "5": "Musyawarah Mufakat", "6": "Cinta Tanah Air & NKRI" },
    "IPAS": { "1": "Gaya di Sekitar", "2": "Energi & Perubahan", "3": "Bagian Tumbuhan & Fungsi", "4": "Keragaman Budaya Indonesia", "5": "Tata Surya", "6": "Kenampakan Alam" },
  },
  "bsj-sd5": {
    "PAI & Budi Pekerti": { "1": "Surah Al-Maidah", "2": "Iman kepada Rasul", "3": "Haji & Umrah", "4": "Kisah Khulafaur Rasyidin", "5": "Akhlak terhadap Lingkungan", "6": "Kerukunan Umat Beragama" },
    "Bahasa Indonesia": { "1": "Ide Pokok & Gagasan", "2": "Teks Eksplanasi", "3": "Teks Pidato", "4": "Teks Formulir & Surat", "5": "Cerpen", "6": "Pantun & Syair" },
    "Matematika": { "1": "Bilangan Cacah hingga 100.000", "2": "Pecahan & Desimal", "3": "Perbandingan & Skala", "4": "Bangun Ruang", "5": "Volume Kubus & Balok", "6": "Penyajian Data" },
    "PPKN": { "1": "Nilai Pancasila", "2": "Norma & Aturan", "3": "Keberagaman Sosial Budaya", "4": "Gotong Royong Lintas Daerah", "5": "Demokrasi", "6": "Cinta Tanah Air & Patriotisme" },
    "IPAS": { "1": "Sistem Pernapasan", "2": "Sistem Pencernaan", "3": "Zat & Perubahannya", "4": "Rantai Makanan", "5": "Siklus Air", "6": "Pemanasan Global" },
  },
  "bsj-sd6": {
    "PAI & Budi Pekerti": { "1": "Surah Al-Qalam & Al-Hujurat", "2": "Iman kepada Hari Akhir", "3": "Kisah Teladan Sahabat Nabi", "4": "Akhlak Terpuji & Tercela", "5": "Khalifah & Walisongo", "6": "Toleransi & Kerukunan" },
    "Bahasa Indonesia": { "1": "Teks Laporan Observasi", "2": "Teks Eksplanasi Fenomena", "3": "Teks Pidato Persuasif", "4": "Teks Argumentasi", "5": "Cerita Inspiratif", "6": "Drama" },
    "Matematika": { "1": "Bilangan Bulat", "2": "Operasi Hitung Campuran", "3": "Lingkaran", "4": "Bangun Ruang Lanjutan", "5": "Statistika & Diagram", "6": "Koordinat & Denah" },
    "PPKN": { "1": "Pancasila sebagai Ideologi", "2": "UUD 1945 & Bhinneka", "3": "Persatuan & Kesatuan", "4": "Kerja Sama Internasional", "5": "Demokrasi & Musyawarah", "6": "Bela Negara" },
    "IPAS": { "1": "Rangka & Sistem Gerak", "2": "Listrik & Magnet", "3": "Siklus Air & Cuaca", "4": "Ekosistem & Pelestarian", "5": "Bumi & Antariksa", "6": "Perubahan Iklim" },
  },
};


const ICON_3D: any = {
  "PAI & Budi Pekerti": "/icons/pai.png",
  "Bahasa Indonesia": "/icons/bindo.png",
  "Matematika": "/icons/mtk.png",
  "PPKN": "/icons/ppkn.png",
  "IPAS": "/icons/ipas.png"
};

const WARNA: any = {
  "PAI & Budi Pekerti": { bg: "bg-emerald-50", header: "bg-emerald-100", pastel: "Pastel Hijau Tua" },
  "Bahasa Indonesia": { bg: "bg-orange-50", header: "bg-orange-100", pastel: "Pastel Orange" },
  "Matematika": { bg: "bg-green-50", header: "bg-green-100", pastel: "Pastel Hijau" },
  "PPKN": { bg: "bg-blue-50", header: "bg-blue-100", pastel: "Pastel Biru" },
  "IPAS": { bg: "bg-yellow-50", header: "bg-yellow-100", pastel: "Pastel Kuning" }
};

type Hasil = { id: string; kode_akses: string; kelas: string; mapel: string; bab: number; benar: number; salah: number; score: number; created_at: string; };

export default function DashboardKelasPage() {
  const params = useParams();
  const kelas = ((params.kelas as string) || "bsj-sd1").toLowerCase();
  const [kode, setKode] = useState("");
  const [hasil, setHasil] = useState<Hasil[]>([]);
  const [showPantau, setShowPantau] = useState(false);

  useEffect(function () {
    const k = localStorage.getItem("bsj_kode_aktif") || "";
    setKode(k);
    if (!k) return;
    // FIX a,b,c: 1 voucher hanya untuk 1 kelas + beda voucher bisa masuk kelas sama tapi score gak ketuker
    supabase.from("hasil_latihan").select("*").eq("kode_akses", k).eq("kelas", kelas).order("created_at", { ascending: false }).then(function (res) {
      if (res.data) setHasil(res.data as any);
    });
  }, [kelas]);

  const judulBabKelas = JUDUL_BAB_ALL[kelas] || JUDUL_BAB_ALL["bsj-sd1"];
  let totalBAB = 0;
  Object.values(judulBabKelas).forEach(function (m: any) { totalBAB += Object.keys(m).length; });

  const selesai = hasil.length;
  let totalScore = 0;
  hasil.forEach(function (h) { totalScore += h.score; });
  const rata = selesai ? Math.round(totalScore / selesai) : 0;

  let totalBenar = 0;
  let totalSoal = 0;
  hasil.forEach(function (h) { totalBenar += h.benar; totalSoal += h.benar + h.salah; });

  function normalizeMapel(s: string) {
    const low = s.toLowerCase();
    if (low.includes("pai") || low.includes("budi")) return "PAI & Budi Pekerti";
    if (low.includes("indonesia") || low.includes("bindo")) return "Bahasa Indonesia";
    if (low.includes("matematika") || low === "mtk") return "Matematika";
    if (low.includes("ppkn") || low.includes("pancasila")) return "PPKN";
    if (low.includes("ipas")) return "IPAS";
    return s;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-[#fffcf5] min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-base">{kelas.toUpperCase()} - Dashboard Score Lengkap {totalBAB} BAB - 5 Mapel</h1>
        <div className="flex gap-2 items-center">
          <span className="text-[10px] bg-green-100 px-2 py-1 rounded-full">Kode: {kode || "Belum ada"}</span>
          <button onClick={function () { setShowPantau(!showPantau); }} className="text-xs bg-black text-white px-3 py-1.5 rounded-full font-bold">Pantauan Orang Tua {hasil.length > 0 ? "(" + hasil.length + ")" : ""}</button>
        </div>
      </div>

      {showPantau && (
        <div className="border rounded-xl bg-white p-4 mb-5">
          <h2 className="font-bold text-sm mb-3">Pantauan Orang Tua - {kode} - {kelas.toUpperCase()}</h2>
          {hasil.length === 0 ? <div className="text-sm text-gray-500 p-4 text-center border rounded-lg">Belum ada latihan untuk {kelas.toUpperCase()} dengan kode {kode}</div> : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-gray-50"><tr><th className="p-2 text-left">Waktu</th><th className="p-2 text-left">Mapel BAB</th><th className="p-2 text-center">Score</th></tr></thead>
                <tbody>{hasil.map(function (h) {
                  return (
                    <tr key={h.id} className="border-t">
                      <td className="p-2">{new Date(h.created_at).toLocaleString("id-ID")}</td>
                      <td className="p-2"><b>{normalizeMapel(h.mapel)} BAB {h.bab}</b><br/><span className="text-[10px] text-gray-500">{JUDUL_BAB_ALL[kelas] && JUDUL_BAB_ALL[kelas][normalizeMapel(h.mapel)] && JUDUL_BAB_ALL[kelas][normalizeMapel(h.mapel)][String(h.bab)] ? JUDUL_BAB_ALL[kelas][normalizeMapel(h.mapel)][String(h.bab)] : ""}</span></td>
                      <td className="p-2 text-center"><span className={h.score >= 70 ? "bg-green-100 text-green-700 px-2 py-1 rounded-full text-[10px] font-bold" : "bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-[10px] font-bold"}>{h.score}%</span></td>
                    </tr>
                  );
                })}</tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white p-5 mb-6">
        <div className="flex justify-between items-center">
          <div><div className="text-xs opacity-80">Total Score Kelas - {kelas.toUpperCase()} (Voucher: {kode})</div><div className="text-4xl font-bold">{rata}%</div><div className="text-xs mt-1 opacity-80">{selesai} / {totalBAB} BAB selesai - Benar {totalBenar} / {totalSoal || 0}</div></div>
          <div className="text-center"><div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">{rata}%</div><div className="text-[10px] mt-1 opacity-80">Progress {kelas.toUpperCase()}</div></div>
        </div>
        <div className="w-full bg-white/20 h-2 rounded-full mt-4"><div className="bg-white h-2 rounded-full" style={{ width: (totalBAB ? (selesai / totalBAB) * 100 : 0) + "%" }} /></div>
      </div>

      {Object.keys(judulBabKelas).map(function (mapel) {
        const babs = judulBabKelas[mapel];
        const totalMapel = Object.keys(babs).length;
        const doneMapel = hasil.filter(function (h) { return normalizeMapel(h.mapel) === mapel; }).length;
        let scoreMapel = 0;
        hasil.filter(function (h) { return normalizeMapel(h.mapel) === mapel; }).forEach(function (h) { scoreMapel += h.score; });
        const rataMapel = doneMapel ? Math.round(scoreMapel / doneMapel) : 0;
        const w = WARNA[mapel] || { bg: "bg-gray-50", header: "bg-gray-100", pastel: "Pastel Abu" };
        const iconPath = ICON_3D[mapel] || "/icons/bindo.png";
        return (
          <div key={mapel} className={"border rounded-xl p-3 mb-5 " + w.bg}>
            <div className={"flex justify-between items-center p-3 rounded-lg mb-3 border " + w.header}>
              <div className="flex items-center gap-3">
                <img src={iconPath} alt={mapel} className="w-10 h-10 object-contain" />
                <div><div className="font-bold text-sm">{mapel}</div><div className="text-[10px] opacity-70">{doneMapel}/{totalMapel} BAB - Rata {rataMapel}% - {w.pastel}</div></div>
              </div>
              <div className="w-24 h-1.5 bg-white/70 rounded-full"><div className="bg-black/20 h-1.5 rounded-full" style={{ width: (totalMapel ? (doneMapel / totalMapel) * 100 : 0) + "%" }} /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {Object.keys(babs).map(function (babStr) {
                const bab = parseInt(babStr, 10);
                const judul = babs[babStr];
                const skor = hasil.find(function (h) { return normalizeMapel(h.mapel) === mapel && Number(h.bab) === bab; });
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
