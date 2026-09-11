"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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

const MAPEL_STYLE: any = {
  "PPKN": { bg: "bg-blue-50", border: "border-blue-300", headerBg: "bg-blue-100", icon: "/icons/ppkn.png", color: "Pastel Biru" },
  "B. INDONESIA": { bg: "bg-red-50", border: "border-red-300", headerBg: "bg-red-100", icon: "/icons/bindo.png", color: "Pastel Merah" },
  "MTK": { bg: "bg-green-50", border: "border-green-300", headerBg: "bg-green-100", icon: "/icons/mtk.png", color: "Pastel Hijau" },
  "IPAS": { bg: "bg-yellow-50", border: "border-yellow-300", headerBg: "bg-yellow-100", icon: "/icons/ipas.png", color: "Pastel Kuning" },
  "PAI": { bg: "bg-amber-50", border: "border-amber-300", headerBg: "bg-amber-100", icon: "/icons/pai.png", color: "Pastel Emas" },
};

export default function KelasDashboardLengkap() {
  const params = useParams();
  const kelas = (params.kelas as string)?.toLowerCase() || "";
  const [skorData, setSkorData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSkor() {
      setLoading(true);
      const { data } = await supabase.from("skor_bab").select("*").eq("kelas", kelas).order("mapel", { ascending: true }).order("bab_ke", { ascending: true });
      setSkorData(data || []);
      setLoading(false);
    }
    fetchSkor();
  }, [kelas]);

  if (loading) return <div className="p-8 text-center">Loading Dashboard {kelas}...</div>;

  const totalBAB = 30;
  const selesai = skorData.length;
  const totalScore = selesai > 0 ? Math.round(skorData.reduce((a, b) => a + b.skor, 0) / selesai) : 0;
  const totalBenar = skorData.reduce((a, b) => a + b.benar, 0);
  const progress = Math.round((selesai / totalBAB) * 100);
  const mapels = ["PPKN", "B. INDONESIA", "MTK", "IPAS", "PAI"];
  const getSkorBab = (mapel: string, bab: number) => skorData.find((s) => s.mapel === mapel && s.bab_ke === bab);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">{kelas.toUpperCase()} - Dashboard Score Lengkap 30 BAB</h1>

      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-2xl mb-6 shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm opacity-80">Total Score Kelas</div>
            <div className="text-5xl font-bold">{totalScore}%</div>
            <div className="text-sm mt-2">{selesai} / {totalBAB} BAB selesai ({progress}%) • Benar {totalBenar} / {selesai * 30}</div>
          </div>
          <div className="text-center"><div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">{progress}%</div><div className="text-xs mt-1">Progress</div></div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3 mt-4"><div className="bg-white h-3 rounded-full" style={{ width: `${progress}%` }}></div></div>
      </div>

      <div className="space-y-6">
        {mapels.map((mapel) => {
          const style = MAPEL_STYLE[mapel];
          const skorMapel = skorData.filter((s) => s.mapel === mapel);
          const selesaiMapel = skorMapel.length;
          const rataMapel = selesaiMapel > 0 ? Math.round(skorMapel.reduce((a, b) => a + b.skor, 0) / selesaiMapel) : 0;
          return (
            <div key={mapel} className={`${style.bg} ${style.border} border-2 rounded-xl shadow p-4`}>
              <div className={`flex justify-between items-center mb-3 ${style.headerBg} p-3 rounded-lg`}>
                <h2 className="font-bold flex items-center gap-3">
                  <img src={style.icon} alt={mapel} className="w-12 h-12 object-contain drop-shadow" />
                  <span className="text-base">{mapel}</span>
                  <span className="text-xs font-normal text-gray-600 ml-2">{selesaiMapel}/6 BAB - Rata {rataMapel}% - {style.color}</span>
                </h2>
                <div className="w-24 bg-white rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(selesaiMapel / 6) * 100}%` }}></div></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((bab) => {
                  const judul = JUDUL_BAB_LENGKAP[kelas]?.[mapel]?.[bab.toString()] || `BAB ${bab}`;
                  const skor = getSkorBab(mapel, bab);
                  return (
                    <a key={bab} href={`/soal/${kelas}/latihan?mapel=${encodeURIComponent(mapel)}&bab=${bab}`} className={`border rounded-lg p-3 hover:shadow-md transition block bg-white ${skor ? "border-green-400" : "border-gray-200"}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="text-xs text-gray-500">BAB {bab}</div>
                          <div className="font-bold text-sm">{judul}</div>
                          <div className="text-xs mt-1">{skor ? `✅ Score ${skor.skor}% (${skor.benar}/30)` : "Belum dikerjakan"}</div>
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full font-bold ${skor ? (skor.skor >= 80 ? "bg-green-500 text-white" : skor.skor >= 60 ? "bg-yellow-500 text-white" : "bg-red-500 text-white") : "bg-gray-200 text-gray-600"}`}>{skor ? `${skor.skor}%` : "0%"}</div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
