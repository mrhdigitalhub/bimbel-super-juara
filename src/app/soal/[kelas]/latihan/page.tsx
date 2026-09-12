
"use client";
import { useSearchParams, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Import judul final dari dashboard (copy same object for consistency)
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


export default function LatihanPage() {
  const params = useParams();
  const search = useSearchParams();
  const kelas = ((params.kelas as string) || "bsj-sd1").toLowerCase();
  const mapelParam = search.get("mapel") || "Matematika";
  const babParam = parseInt(search.get("bab") || "1", 10);

  const [soals, setSoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [jawaban, setJawaban] = useState<Record<number,string>>({});
  const [selesai, setSelesai] = useState(false);

  const judul = (JUDUL_BAB_ALL[kelas] && JUDUL_BAB_ALL[kelas][mapelParam] && JUDUL_BAB_ALL[kelas][mapelParam][String(babParam)]) || "BAB "+babParam;

  useEffect(() => {
    async function fetchSoal() {
      setLoading(true);
      // FIX: Query by kelas, mapel, bab_ke - bukan judul_bab (yang bikin 0 SOAL sebelumnya)
      const { data, error } = await supabase
        .from("soal")
        .select("*")
        .eq("kelas", kelas)
        .eq("mapel", mapelParam)
        .eq("bab_ke", babParam)
        .order("no_urut", { ascending: true });
      
      console.log("FETCH:", kelas, mapelParam, babParam, "RESULT:", data?.length, "ERROR:", error);
      
      // Fallback: jika tidak ketemu karena perbedaan huruf besar kecil mapel, coba ilike
      if (!data || data.length === 0) {
        const { data: data2 } = await supabase
          .from("soal")
          .select("*")
          .ilike("kelas", kelas)
          .ilike("mapel", `%${mapelParam.split(" ")[0]}%`)
          .eq("bab_ke", babParam)
          .order("no_urut", { ascending: true });
        if (data2 && data2.length > 0) {
          setSoals(data2);
          setLoading(false);
          return;
        }
      }
      
      setSoals(data || []);
      setLoading(false);
    }
    fetchSoal();
  }, [kelas, mapelParam, babParam]);

  const hitungScore = () => {
    let benar = 0;
    soals.forEach((s:any) => {
      if (jawaban[s.no_urut] === s.jawaban) benar++;
    });
    const score = soals.length ? Math.round((benar / soals.length) * 100) : 0;
    
    // Simpan ke hasil_latihan
    const kode = localStorage.getItem("bsj_kode_aktif") || "TEST";
    supabase.from("hasil_latihan").insert({
      kode_akses: kode,
      kelas: kelas,
      mapel: mapelParam,
      bab: babParam,
      benar: benar,
      salah: soals.length - benar,
      score: score
    }).then(()=>{});
    
    setSelesai(true);
  };

  if (loading) return <div className="p-8 text-center">Loading {soals.length} soal...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 bg-[#fffcf5] min-h-screen">
      <a href={`/soal/${kelas}`} className="text-xs bg-gray-100 px-3 py-2 rounded-full inline-block mb-4">← Kembali ke Dashboard {kelas.toUpperCase()} - 30 BAB</a>
      
      <div className="border rounded-xl bg-white p-4 mb-4 flex justify-between items-center">
        <div>
          <div className="font-bold text-sm">{kelas.toUpperCase()} - {mapelParam} BAB {babParam} - {judul} - {soals.length} SOAL</div>
          <div className="text-[11px] text-gray-500">Mapel: {mapelParam} | Judul: {judul}</div>
        </div>
        <button onClick={hitungScore} className="bg-green-500 text-white text-xs px-4 py-2 rounded-full font-bold">Kumpulkan & Lihat Score</button>
      </div>

      {soals.length === 0 ? (
        <div className="bg-red-50 border border-red-200 p-6 rounded-xl text-center">
          <div className="font-bold text-red-600">0 SOAL - Debug Info:</div>
          <div className="text-xs mt-2 text-left bg-white p-3 rounded">
            Kelas: {kelas}<br/>
            Mapel: {mapelParam}<br/>
            BAB: {babParam}<br/>
            Judul: {judul}<br/>
            Cek Supabase: SELECT * FROM soal WHERE kelas='{kelas}' AND mapel='{mapelParam}' AND bab_ke={babParam}
          </div>
          <div className="text-xs mt-3">Jika 0 terus, jalankan di Supabase: SELECT * FROM soal WHERE kelas ILIKE '%sd1%' LIMIT 5 untuk lihat format kelas yang tersimpan</div>
        </div>
      ) : (
        <div className="space-y-4">
          {soals.map((s:any) => (
            <div key={s.no_urut} className="bg-white border rounded-xl p-4">
              <div className="font-bold text-sm mb-3">{s.no_urut}. {s.pertanyaan}</div>
              <div className="grid grid-cols-1 gap-2">
                {["A","B","C","D"].map((opt) => (
                  <label key={opt} className={`border rounded-lg p-3 text-sm flex gap-2 cursor-pointer ${jawaban[s.no_urut]===opt ? 'bg-blue-50 border-blue-400' : 'hover:bg-gray-50'}`}>
                    <input type="radio" name={`soal-${s.no_urut}`} checked={jawaban[s.no_urut]===opt} onChange={()=>setJawaban({...jawaban, [s.no_urut]:opt})} />
                    <span><b>{opt}.</b> {s[`opsi_${opt.toLowerCase()}`]}</span>
                  </label>
                ))}
              </div>
              {selesai && (
                <div className="mt-3 text-xs bg-gray-50 p-3 rounded">
                  <b>Jawaban:</b> {s.jawaban} - <b>Pembahasan:</b> {s.pembahasan}
                </div>
              )}
            </div>
          ))}
          <button onClick={hitungScore} className="w-full bg-green-600 text-white py-3 rounded-full font-bold">Kumpulkan & Hitung Score</button>
          {selesai && (
            <div className="bg-purple-600 text-white p-5 rounded-xl text-center">
              <div className="text-3xl font-bold">Score: {(() => { let b=0; soals.forEach((x:any)=>{if(jawaban[x.no_urut]===x.jawaban) b++}); return Math.round(b/soals.length*100); })()}%</div>
              <a href={`/soal/${kelas}`} className="inline-block mt-3 bg-white text-purple-600 px-4 py-2 rounded-full text-xs font-bold">← Dashboard Lengkap 30 BAB</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
