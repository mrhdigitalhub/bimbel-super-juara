"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const JUDUL_BAB: any = {
  "bsj-sd1": {
    "PAI": {
      "1": "Rukun Iman",
      "2": "Bersuci & Wudhu",
      "3": "Mengenal Huruf Hijaiyah",
      "4": "Doa Sehari-hari",
      "5": "Kisah Nabi",
      "6": "Akhlak Terpuji"
    },
    "BINDO": {
      "1": "Bunyi dan Huruf",
      "2": "Sapa dan Salam",
      "3": "Cerita Bergambar",
      "4": "Kosakata Baru",
      "5": "Kalimat Sederhana",
      "6": "Membaca Nyaring"
    },
    "MTK": {
      "1": "Bilangan 1-10",
      "2": "Penjumlahan & Pengurangan",
      "3": "Bangun Datar",
      "4": "Pengukuran Panjang",
      "5": "Waktu & Jam",
      "6": "Soal Cerita"
    },
    "PPKN": {
      "1": "Aturan di Rumah",
      "2": "Aturan di Sekolah",
      "3": "Simbol Pancasila",
      "4": "Hidup Rukun",
      "5": "Toleransi",
      "6": "Gotong Royong"
    },
    "IPAS": {
      "1": "Bagian Tubuh",
      "2": "Panca Indera",
      "3": "Makhluk Hidup",
      "4": "Benda di Sekitar",
      "5": "Cuaca",
      "6": "Lingkungan Bersih"
    }
  },
  "bsj-sd2": {
    "PAI": {
      "1": "Asmaul Husna",
      "2": "Shalat Wajib",
      "3": "Hijaiyah Sambung",
      "4": "Adab Sehari-hari",
      "5": "Kisah Nabi Nuh & Ibrahim",
      "6": "Akhlak Jujur & Disiplin"
    },
    "BINDO": {
      "1": "Huruf Vokal Konsonan",
      "2": "Perkenalan Diri",
      "3": "Dongeng Fabel",
      "4": "Kata Sifat",
      "5": "Kalimat Tanya",
      "6": "Menulis Cerita Pendek"
    },
    "MTK": {
      "1": "Bilangan 11-100",
      "2": "Penjumlahan Bersusun",
      "3": "Pengurangan Bersusun",
      "4": "Perkalian Dasar",
      "5": "Pembagian Dasar",
      "6": "Bangun Ruang Sederhana"
    },
    "PPKN": {
      "1": "Sila 1-2 Pancasila",
      "2": "Hak & Kewajiban",
      "3": "Hidup Tertib",
      "4": "Kerja Sama",
      "5": "Musyawarah",
      "6": "Cinta Lingkungan"
    },
    "IPAS": {
      "1": "Anggota Keluarga",
      "2": "Pertumbuhan Manusia",
      "3": "Sumber Energi",
      "4": "Wujud Benda",
      "5": "Cuaca & Musim",
      "6": "Daur Hidup Hewan"
    }
  },
  "bsj-sd3": {
    "PAI": {
      "1": "Sifat Wajib Allah",
      "2": "Shalat Sunnah",
      "3": "Tajwid Dasar",
      "4": "Kisah Nabi Yusuf & Musa",
      "5": "Akhlak Sabar & Syukur",
      "6": "Hari Kiamat"
    },
    "BINDO": {
      "1": "Ide Pokok Paragraf",
      "2": "Tanda Baca",
      "3": "Cerita Rakyat",
      "4": "Sinonim Antonim",
      "5": "Surat Pribadi",
      "6": "Puisi Anak"
    },
    "MTK": {
      "1": "Bilangan 1000-10000",
      "2": "Perkalian Bersusun",
      "3": "Pembagian Bersusun",
      "4": "Pecahan Sederhana",
      "5": "Keliling Bangun Datar",
      "6": "Diagram Batang"
    },
    "PPKN": {
      "1": "Sila 3-4 Pancasila",
      "2": "Keberagaman Budaya",
      "3": "Aturan & Norma",
      "4": "Gotong Royong Desa",
      "5": "Hak Anak",
      "6": "Lingkungan RT/RW"
    },
    "IPAS": {
      "1": "Bagian Tumbuhan",
      "2": "Ekosistem Sawah",
      "3": "Gaya & Gerak",
      "4": "Energi Panas Cahaya",
      "5": "Siklus Air",
      "6": "Sistem Pencernaan"
    }
  },
  "bsj-sd4": {
    "PAI": {
      "1": "Iman Kepada Malaikat",
      "2": "Puasa Ramadhan",
      "3": "Tajwid Idgham Ikhfa",
      "4": "Kisah Nabi Isa & Ayyub",
      "5": "Akhlak Amanah & Ikhlas",
      "6": "Zakat & Infaq"
    },
    "BINDO": {
      "1": "Gagasan Utama & Pendukung",
      "2": "Majas Sederhana",
      "3": "Cerita Fiksi Nonfiksi",
      "4": "Amanat Cerita",
      "5": "Pidato Singkat",
      "6": "Resensi Buku Anak"
    },
    "MTK": {
      "1": "Bilangan Cacah Besar",
      "2": "FPB & KPK",
      "3": "Pecahan Campuran",
      "4": "Desimal & Persen",
      "5": "Luas Bangun Datar",
      "6": "Volume Kubus Balok"
    },
    "PPKN": {
      "1": "Sila 5 Pancasila",
      "2": "Bhinneka Tunggal Ika",
      "3": "Hak Kewajiban Warga",
      "4": "Musyawarah Desa",
      "5": "Kerja Sama ASEAN",
      "6": "Cinta Tanah Air"
    },
    "IPAS": {
      "1": "Gaya Gravitasi Gesek",
      "2": "Energi Alternatif",
      "3": "Rantai Makanan",
      "4": "Daur Hidup Tumbuhan",
      "5": "Panca Indera Lanjutan",
      "6": "Pelestarian Alam"
    }
  },
  "bsj-sd5": {
    "PAI": {
      "1": "Iman Kepada Kitab",
      "2": "Haji & Umrah",
      "3": "Tajwid Qalqalah",
      "4": "Kisah Khulafaur Rasyidin",
      "5": "Akhlak Tawadhu & Tasamuh",
      "6": "Hari Akhir & Akhlak"
    },
    "BINDO": {
      "1": "Kalimat Efektif",
      "2": "Iklan & Poster",
      "3": "Teks Eksplanasi",
      "4": "Pantun Syair Gurindam",
      "5": "Drama Pendek",
      "6": "Laporan Pengamatan"
    },
    "MTK": {
      "1": "Bilangan Bulat",
      "2": "Perbandingan & Skala",
      "3": "Pecahan Operasi Lanjut",
      "4": "Kecepatan & Debit",
      "5": "Luas Gabungan",
      "6": "Data & Diagram Lingkaran"
    },
    "PPKN": {
      "1": "Nilai Pancasila Sehari-hari",
      "2": "Keberagaman Suku Agama",
      "3": "Organisasi Masyarakat",
      "4": "Sistem Pemerintahan Desa",
      "5": "Kerja Sama Internasional",
      "6": "Bela Negara"
    },
    "IPAS": {
      "1": "Organ Tubuh & Fungsinya",
      "2": "Adaptasi Makhluk Hidup",
      "3": "Zat Campuran",
      "4": "Perubahan Wujud",
      "5": "Bumi & Tata Surya",
      "6": "Lingkungan & Teknologi"
    }
  },
  "bsj-sd6": {
    "PAI": {
      "1": "Iman Kepada Rasul",
      "2": "Shalat Jumat & Jenazah",
      "3": "Tajwid Gharib",
      "4": "Kisah Walisongo",
      "5": "Akhlak Terpuji Lanjut",
      "6": "Akhlak Mazmumah Hindari"
    },
    "BINDO": {
      "1": "Teks Laporan Hasil Observasi",
      "2": "Teks Eksplanasi Kompleks",
      "3": "Pidato Persuasif",
      "4": "Cerpen",
      "5": "Puisi & Makna",
      "6": "Naskah Drama"
    },
    "MTK": {
      "1": "Bilangan Bulat Negatif",
      "2": "Operasi Hitung Campuran",
      "3": "Lingkaran",
      "4": "Bangun Ruang Lanjut",
      "5": "Statistika Mean Median Modus",
      "6": "Peluang Sederhana"
    },
    "PPKN": {
      "1": "Pancasila Sebagai Ideologi",
      "2": "UUD 1945 & Amandemen",
      "3": "Keberagaman Global",
      "4": "Demokrasi & Pemilu",
      "5": "Kerja Sama & Globalisasi",
      "6": "Tanggung Jawab Warga Negara"
    },
    "IPAS": {
      "1": "Rangka & Otot",
      "2": "Perkembangbiakan Hewan Tumbuhan",
      "3": "Listrik & Magnet",
      "4": "Siklus Hidup & Pubertas",
      "5": "Tata Surya & Gerhana",
      "6": "Perubahan Lingkungan"
    }
  }
};

const MAPEL = [
  {slug:"PAI", nama:"PAI & Budi Pekerti", warna:"#bbf7d0", border:"#22c55e"},
  {slug:"BINDO", nama:"Bahasa Indonesia", warna:"#bfdbfe", border:"#3b82f6"},
  {slug:"MTK", nama:"Matematika", warna:"#fed7aa", border:"#f97316"},
  {slug:"PPKN", nama:"PPKN", warna:"#fecaca", border:"#ef4444"},
  {slug:"IPAS", nama:"IPAS", warna:"#e9d5ff", border:"#a855f7"},
];

export default function KelasPage(){
  const params = useParams() as any;
  const kelasId = params.kelas || "bsj-sd1";
  const [scores, setScores] = useState<any>({});

  useEffect(()=>{
    const s:any = {};
    MAPEL.forEach(m=>{
      for(let b=1;b<=6;b++){
        const key = `${kelasId}-${m.slug}-${b}`;
        const val = localStorage.getItem(key);
        if(val) s[key]=parseInt(val);
      }
    });
    setScores(s);
  },[kelasId]);

  const getMapelAvg = (slug:string)=>{
    let total=0, count=0;
    for(let b=1;b<=6;b++){
      const key=`${kelasId}-${slug}-${b}`;
      if(scores[key]){ total+=scores[key]; count++; }
    }
    return count? Math.round(total/count):0;
  };

  return (
    <div className="min-h-screen bg-[#fffaf5]">
      <div className="bg-white border-b py-3 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex flex-col items-center px-4">
          <img src="/mrh-logo.png" alt="MRH" className="h-14 w-auto" />
          <p className="text-[8px] tracking-[0.2em] font-bold text-[#0a1a5c] mt-1">Konsultan | Sertifikasi | DigitalHub</p>
          <div className="w-full flex justify-between items-center mt-3">
            <a href="/soal" className="text-xs bg-gray-100 px-3 py-1 rounded-full">← 6 Kelas</a>
            <h1 className="font-black text-orange-600 uppercase text-sm">{kelasId} - 30 BAB - 900 SOAL</h1>
            <span className="text-xs"></span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 space-y-6">
        {MAPEL.map(m=>{
          const avg = getMapelAvg(m.slug);
          const judulMap = JUDUL_BAB[kelasId]?.[m.slug] || {};
          return (
            <div key={m.slug} style={{borderColor:m.border}} className="bg-white rounded-[20px] border-2 p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <div style={{backgroundColor:m.warna}} className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm">{m.slug}</div>
                  <div>
                    <h2 className="font-black text-sm">{m.nama}</h2>
                    <p className="text-[10px] text-gray-500">6 BAB x 30 Soal = 180 Soal</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Nilai Akhir Mapel</p>
                  <p className={`text-lg font-black ${avg>=70?'text-green-600':'text-gray-400'}`}>{avg? `${avg}`:'-'}</p>
                  {avg>0 && <p className="text-[10px] font-bold">{avg>=70?'LULUS':'BELUM'}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {[1,2,3,4,5,6].map(b=>{
                  const key=`${kelasId}-${m.slug}-${b}`;
                  const sc = scores[key];
                  const judul = judulMap[String(b)] || `BAB ${b}`;
                  return (
                    <a key={b} href={`/soal/${kelasId}/latihan?mapel=${m.slug}&bab=${b}`} className="border rounded-xl p-3 hover:shadow-md transition flex justify-between items-center group">
                      <div>
                        <p className="text-[11px] font-black">BAB {b} - {judul}</p>
                        <p className="text-[10px] text-gray-500">{kelasId.toUpperCase()} - {m.slug} BAB {b} - 30 Soal</p>
                      </div>
                      <div className="text-right">
                        {sc ? <span className="bg-green-100 text-green-700 text-xs font-black px-2 py-1 rounded-full">{sc}</span> : <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-full">Kerjakan</span>}
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
