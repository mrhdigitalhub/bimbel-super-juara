"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// DATA FIX 30 BAB SESUAI TABEL KESEPAKATAN BOS - TIDAK NAMBAH
const JUDUL_BAB_ALL: any = {
  "bsj-sd1": {
    "PAI & Budi Pekerti": { "1": "Rukun Iman", "2": "Bersuci & Wudhu", "3": "Mengenal Huruf Hijaiyah", "4": "Doa Sehari-hari", "5": "Kisah Nabi", "6": "Akhlak Terpuji" },
    "Bahasa Indonesia": { "1": "Bunyi dan Huruf", "2": "Sapa dan Salam", "3": "Cerita Bergambar", "4": "Kosakata Baru", "5": "Kalimat Sederhana", "6": "Membaca Nyaring" },
    "Matematika": { "1": "Bilangan 1-10", "2": "Penjumlahan & Pengurangan", "3": "Bangun Datar", "4": "Pengukuran Panjang", "5": "Waktu & Jam", "6": "Soal Cerita" },
    "PPKN": { "1": "Aturan di Rumah", "2": "Aturan di Sekolah", "3": "Simbol Pancasila", "4": "Hidup Rukun", "5": "Toleransi", "6": "Gotong Royong" },
    "IPAS": { "1": "Bagian Tubuh", "2": "Panca Indera", "3": "Makhluk Hidup", "4": "Benda di Sekitar", "5": "Cuaca", "6": "Lingkungan Bersih" }
  },
  "bsj-sd2": {
    "PAI & Budi Pekerti": { "1": "Asmaul Husna", "2": "Sholat Wajib", "3": "Kisah Rasul", "4": "Jujur & Amanah", "5": "Hafalan Doa", "6": "Adab Sehari-hari" },
    "Bahasa Indonesia": { "1": "Kalimat Efektif", "2": "Dongeng", "3": "Puisi Anak", "4": "Tanda Baca", "5": "Menulis Cerita", "6": "Wawancara" },
    "Matematika": { "1": "Bilangan 1-100", "2": "Perkalian & Pembagian", "3": "Uang", "4": "Jam & Waktu", "5": "Bangun Ruang", "6": "Pengukuran Berat" },
    "PPKN": { "1": "Lambang Negara", "2": "Hak & Kewajiban", "3": "Musyawarah", "4": "Kerja Sama", "5": "Keberagaman", "6": "Cinta Tanah Air" },
    "IPAS": { "1": "Tumbuhan", "2": "Hewan", "3": "Energi", "4": "Air & Udara", "5": "Bumi & Langit", "6": "Teknologi Sederhana" }
  },
  "bsj-sd3": {
    "PAI & Budi Pekerti": { "1": "Asmaul Husna", "2": "Sholat Wajib", "3": "Kisah Rasul", "4": "Jujur & Amanah", "5": "Hafalan Doa", "6": "Adab Sehari-hari" },
    "Bahasa Indonesia": { "1": "Kalimat Efektif", "2": "Dongeng", "3": "Puisi Anak", "4": "Tanda Baca", "5": "Menulis Cerita", "6": "Wawancara" },
    "Matematika": { "1": "Bilangan 1-100", "2": "Perkalian & Pembagian", "3": "Uang", "4": "Jam & Waktu", "5": "Bangun Ruang", "6": "Pengukuran Berat" },
    "PPKN": { "1": "Lambang Negara", "2": "Hak & Kewajiban", "3": "Musyawarah", "4": "Kerja Sama", "5": "Keberagaman", "6": "Cinta Tanah Air" },
    "IPAS": { "1": "Tumbuhan", "2": "Hewan", "3": "Energi", "4": "Air & Udara", "5": "Bumi & Langit", "6": "Teknologi Sederhana" }
  },
  "bsj-sd4": {
    "PAI & Budi Pekerti": { "1": "Asmaul Husna", "2": "Sholat Wajib", "3": "Kisah Rasul", "4": "Jujur & Amanah", "5": "Hafalan Doa", "6": "Adab Sehari-hari" },
    "Bahasa Indonesia": { "1": "Kalimat Efektif", "2": "Dongeng", "3": "Puisi Anak", "4": "Tanda Baca", "5": "Menulis Cerita", "6": "Wawancara" },
    "Matematika": { "1": "Bilangan 1-100", "2": "Perkalian & Pembagian", "3": "Uang", "4": "Jam & Waktu", "5": "Bangun Ruang", "6": "Pengukuran Berat" },
    "PPKN": { "1": "Lambang Negara", "2": "Hak & Kewajiban", "3": "Musyawarah", "4": "Kerja Sama", "5": "Keberagaman", "6": "Cinta Tanah Air" },
    "IPAS": { "1": "Tumbuhan", "2": "Hewan", "3": "Energi", "4": "Air & Udara", "5": "Bumi & Langit", "6": "Teknologi Sederhana" }
  },
  "bsj-sd5": {
    "PAI & Budi Pekerti": { "1": "Asmaul Husna", "2": "Sholat Wajib", "3": "Kisah Rasul", "4": "Jujur & Amanah", "5": "Hafalan Doa", "6": "Adab Sehari-hari" },
    "Bahasa Indonesia": { "1": "Kalimat Efektif", "2": "Dongeng", "3": "Puisi Anak", "4": "Tanda Baca", "5": "Menulis Cerita", "6": "Wawancara" },
    "Matematika": { "1": "Bilangan 1-100", "2": "Perkalian & Pembagian", "3": "Uang", "4": "Jam & Waktu", "5": "Bangun Ruang", "6": "Pengukuran Berat" },
    "PPKN": { "1": "Lambang Negara", "2": "Hak & Kewajiban", "3": "Musyawarah", "4": "Kerja Sama", "5": "Keberagaman", "6": "Cinta Tanah Air" },
    "IPAS": { "1": "Tumbuhan", "2": "Hewan", "3": "Energi", "4": "Air & Udara", "5": "Bumi & Langit", "6": "Teknologi Sederhana" }
  },
  "bsj-sd6": {
    "PAI & Budi Pekerti": { "1": "Asmaul Husna", "2": "Sholat Wajib", "3": "Kisah Rasul", "4": "Jujur & Amanah", "5": "Hafalan Doa", "6": "Adab Sehari-hari" },
    "Bahasa Indonesia": { "1": "Kalimat Efektif", "2": "Dongeng", "3": "Puisi Anak", "4": "Tanda Baca", "5": "Menulis Cerita", "6": "Wawancara" },
    "Matematika": { "1": "Bilangan 1-100", "2": "Perkalian & Pembagian", "3": "Uang", "4": "Jam & Waktu", "5": "Bangun Ruang", "6": "Pengukuran Berat" },
    "PPKN": { "1": "Lambang Negara", "2": "Hak & Kewajiban", "3": "Musyawarah", "4": "Kerja Sama", "5": "Keberagaman", "6": "Cinta Tanah Air" },
    "IPAS": { "1": "Tumbuhan", "2": "Hewan", "3": "Energi", "4": "Air & Udara", "5": "Bumi & Langit", "6": "Teknologi Sederhana" }
  }
};

// IKON 3D DARI public/icons/ - SESUAI FOTO BOS
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

type Hasil = { id: string; kode_akses: string; mapel: string; bab: number; benar: number; salah: number; score: number; created_at: string; };

export default function DashboardKelasPage() {
  const params = useParams();
  const kelas = ((params.kelas as string) || "bsj-sd1").toLowerCase();
  const [kode, setKode] = useState("");
  const [hasil, setHasil] = useState<Hasil[]>([]);
  const [showPantau, setShowPantau] = useState(false);

  useEffect(function () {
    const k = localStorage.getItem("bsj_kode_aktif") || "BSJ-SD1-W4CU";
    setKode(k);
    supabase.from("hasil_latihan").select("*").eq("kode_akses", k).order("created_at", { ascending: false }).then(function (res) {
      if (res.data) setHasil(res.data as any);
    });
  }, []);

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
    if (low.includes("indonesia") || low.includes("bindo") || low.includes("b. indonesia")) return "Bahasa Indonesia";
    if (low.includes("matematika") || low === "mtk" || low.includes("mtk")) return "Matematika";
    if (low.includes("ppkn") || low.includes("pancasila")) return "PPKN";
    if (low.includes("ipas")) return "IPAS";
    return s;
  }

  function getJudul(mapel: string, bab: number) {
    const m = normalizeMapel(mapel);
    if (JUDUL_BAB_ALL[kelas] && JUDUL_BAB_ALL[kelas][m] && JUDUL_BAB_ALL[kelas][m][String(bab)]) {
      return JUDUL_BAB_ALL[kelas][m][String(bab)];
    }
    return "BAB " + bab;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-[#fffcf5] min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-base">{kelas.toUpperCase()} - Dashboard Score Lengkap {totalBAB} BAB - 5 Mapel</h1>
        <div className="flex gap-2 items-center">
          <span className="text-[10px] bg-green-100 px-2 py-1 rounded-full">Kode: {kode}</span>
          <button onClick={function () { setShowPantau(!showPantau); }} className="text-xs bg-black text-white px-3 py-1.5 rounded-full font-bold">
            Pantauan Orang Tua {hasil.length > 0 ? "(" + hasil.length + ")" : ""}
          </button>
        </div>
      </div>

      {showPantau && (
        <div className="border rounded-xl bg-white p-4 mb-5">
          <h2 className="font-bold text-sm mb-3">Pantauan Orang Tua - {kode} - {kelas.toUpperCase()}</h2>
          {hasil.length === 0 ? <div className="text-sm text-gray-500 p-4 text-center border rounded-lg">Belum ada latihan</div> : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-gray-50"><tr><th className="p-2 text-left">Waktu</th><th className="p-2 text-left">Mapel BAB</th><th className="p-2 text-center">Score</th></tr></thead>
                <tbody>{hasil.map(function (h) {
                  return (
                    <tr key={h.id} className="border-t">
                      <td className="p-2">{new Date(h.created_at).toLocaleString("id-ID")}</td>
                      <td className="p-2"><b>{normalizeMapel(h.mapel)} BAB {h.bab}</b><br/><span className="text-[10px] text-gray-500">{getJudul(h.mapel, h.bab)}</span></td>
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
          <div><div className="text-xs opacity-80">Total Score Kelas</div><div className="text-4xl font-bold">{rata}%</div><div className="text-xs mt-1 opacity-80">{selesai} / {totalBAB} BAB selesai - Benar {totalBenar} / {totalSoal || 0}</div></div>
          <div className="text-center"><div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">{rata}%</div><div className="text-[10px] mt-1 opacity-80">Progress</div></div>
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
        const iconPath = ICON_3D[mapel] || "/icons/book.png";

        return (
          <div key={mapel} className={"border rounded-xl p-3 mb-5 " + w.bg}>
            <div className={"flex justify-between items-center p-3 rounded-lg mb-3 border " + w.header}>
              <div className="flex items-center gap-3">
                <img src={iconPath} alt={mapel} className="w-10 h-10 object-contain drop-shadow-sm" />
                <div>
                  <div className="font-bold text-sm">{mapel}</div>
                  <div className="text-[10px] opacity-70">{doneMapel}/{totalMapel} BAB - Rata {rataMapel}% - {w.pastel}</div>
                </div>
              </div>
              <div className="w-24 h-1.5 bg-white/70 rounded-full"><div className="bg-black/20 h-1.5 rounded-full" style={{ width: (totalMapel ? (doneMapel / totalMapel) * 100 : 0) + "%" }} /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {Object.keys(babs).map(function (babStr) {
                const bab = parseInt(babStr, 10);
                const judul = babs[babStr];
                const skor = hasil.find(function (h) { return normalizeMapel(h.mapel) === mapel && h.bab === bab; });
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
