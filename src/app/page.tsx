"use client";
import { useState, useRef } from "react";

type Option = string;
type Question = {
  id: string;
  mapel: string;
  bab: string;
  soal: string;
  options: Option[];
  kunci: number;
  penjelasan: string;
};

const KELAS = ["SD1", "SD2", "SD3", "SD4", "SD5", "SD6"] as const;
type Kelas = typeof KELAS[number];

const demoData: Record<Kelas, Question[]> = {
  SD1: [
    { id: "1-1", mapel: "Matematika", bab: "Bilangan 1-20", soal: "Berapa hasil dari 8 + 7 ?", options: ["12", "14", "15", "16"], kunci: 2, penjelasan: "8 + 7 = 15. Hitung dengan jari atau garis bilangan." },
    { id: "1-2", mapel: "Bahasa Indonesia", bab: "Huruf Kapital", soal: "Kalimat mana yang penulisan huruf kapitalnya benar?", options: ["saya tinggal di purwakarta", "Saya tinggal di Purwakarta", "saya Tinggal Di purwakarta", "Saya tinggal Di purwakarta"], kunci: 1, penjelasan: "Nama orang dan nama tempat (Purwakarta) wajib huruf kapital." },
    { id: "1-3", mapel: "IPA", bab: "Bagian Tubuh", soal: "Bagian tubuh untuk melihat adalah...", options: ["Telinga", "Mata", "Hidung", "Lidah"], kunci: 1, penjelasan: "Mata adalah indra penglihatan." },
    { id: "1-4", mapel: "Matematika", bab: "Pengurangan", soal: "Ibu punya 14 apel, dimakan 5. Sisa apel Ibu?", options: ["8", "9", "10", "7"], kunci: 1, penjelasan: "14 - 5 = 9 apel." },
    { id: "1-5", mapel: "PPKn", bab: "Aturan di Rumah", soal: "Contoh aturan di rumah adalah...", options: ["Berisik saat belajar", "Merapi mainan setelah bermain", "Tidak pamit saat pergi", "Membuang sampah sembarangan"], kunci: 1, penjelasan: "Merapi mainan = tanggung jawab dan hidup tertib." },
    { id: "1-6", mapel: "IPS", bab: "Keluarga", soal: "Ayah dari ayah kita disebut...", options: ["Paman", "Kakek", "Sepupu", "Adik"], kunci: 1, penjelasan: "Ayah dari ayah adalah kakek dari pihak ayah." },
    { id: "1-7", mapel: "Matematika", bab: "Bangun Datar", soal: "Benda yang bentuknya lingkaran adalah...", options: ["Penggaris", "Jam dinding", "Buku", "Pintu"], kunci: 1, penjelasan: "Jam dinding umumnya berbentuk lingkaran." },
    { id: "1-8", mapel: "Bahasa Indonesia", bab: "Membaca", soal: "Lawan kata 'besar' adalah...", options: ["Tinggi", "Lebar", "Kecil", "Panjang"], kunci: 2, penjelasan: "Antonim besar adalah kecil." },
    { id: "1-9", mapel: "IPA", bab: "Hewan", soal: "Hewan yang bisa terbang adalah...", options: ["Kucing", "Burung", "Ikan", "Kura-kura"], kunci: 1, penjelasan: "Burung memiliki sayap untuk terbang." },
    { id: "1-10", mapel: "Matematika", bab: "Waktu", soal: "1 minggu ada berapa hari?", options: ["5 hari", "6 hari", "7 hari", "8 hari"], kunci: 2, penjelasan: "1 minggu = 7 hari (Senin-Minggu)." },
  ],
  SD2: [
    { id: "2-1", mapel: "Matematika", bab: "Perkalian", soal: "Hasil dari 7 x 8 adalah...", options: ["54", "56", "64", "48"], kunci: 1, penjelasan: "7 x 8 = 56." },
    { id: "2-2", mapel: "Bahasa Indonesia", bab: "Kalimat Tanya", soal: "Kata tanya untuk menanyakan tempat adalah...", options: ["Siapa", "Kapan", "Di mana", "Mengapa"], kunci: 2, penjelasan: "Di mana untuk tempat, siapa untuk orang." },
    { id: "2-3", mapel: "IPA", bab: "Wujud Benda", soal: "Es batu jika dipanaskan akan menjadi...", options: ["Padat", "Cair", "Gas", "Beku"], kunci: 1, penjelasan: "Es mencair jadi air karena kalor." },
    { id: "2-4", mapel: "IPS", bab: "Pekerjaan", soal: "Orang yang mengajar di sekolah disebut...", options: ["Dokter", "Guru", "Pilot", "Petani"], kunci: 1, penjelasan: "Guru bertugas mendidik di sekolah." },
    { id: "2-5", mapel: "Matematika", bab: "Uang", soal: "Rp5.000 + Rp2.000 = ...", options: ["Rp6.000", "Rp7.000", "Rp8.000", "Rp10.000"], kunci: 1, penjelasan: "5000+2000=7000." },
    { id: "2-6", mapel: "PPKn", bab: "Sila Pancasila", soal: "Sila ke-2 bunyinya...", options: ["Ketuhanan Yang Maha Esa", "Kemanusiaan yang adil dan beradab", "Persatuan Indonesia", "Keadilan sosial"], kunci: 1, penjelasan: "Sila 2 = Kemanusiaan yang adil dan beradab." },
    { id: "2-7", mapel: "IPA", bab: "Tumbuhan", soal: "Bagian tumbuhan yang menyerap air adalah...", options: ["Daun", "Bunga", "Akar", "Batang"], kunci: 2, penjelasan: "Akar menyerap air dan mineral." },
    { id: "2-8", mapel: "Bahasa Indonesia", bab: "Sinonim", soal: "Sinonim 'pandai' adalah...", options: ["Bodoh", "Malas", "Cerdas", "Lambat"], kunci: 2, penjelasan: "Pandai = cerdas." },
    { id: "2-9", mapel: "Matematika", bab: "Pembagian", soal: "36 : 4 = ...", options: ["8", "9", "6", "7"], kunci: 1, penjelasan: "36 dibagi 4 = 9." },
    { id: "2-10", mapel: "IPS", bab: "Arah Mata Angin", soal: "Matahari terbit dari arah...", options: ["Barat", "Utara", "Timur", "Selatan"], kunci: 2, penjelasan: "Matahari terbit di Timur, tenggelam di Barat." },
  ],
  SD3: [
    { id: "3-1", mapel: "Matematika", bab: "Pecahan", soal: "1/2 + 1/4 = ...", options: ["1/6", "2/6", "3/4", "2/4"], kunci: 2, penjelasan: "1/2 = 2/4, jadi 2/4+1/4=3/4." },
    { id: "3-2", mapel: "IPA", bab: "Rantai Makanan", soal: "Padi -> Belalang -> Ayam -> ... Urutan selanjutnya?", options: ["Rumput", "Ular", "Manusia", "Cacing"], kunci: 2, penjelasan: "Ayam dimakan manusia, rantai makanan berakhir di puncak." },
    { id: "3-3", mapel: "Bahasa Indonesia", bab: "Ide Pokok", soal: "Ide pokok biasanya ada di...", options: ["Akhir kalimat", "Awal paragraf", "Tengah kata", "Judul saja"], kunci: 1, penjelasan: "Ide pokok sering di awal paragraf (deduktif)." },
    { id: "3-4", mapel: "Matematika", bab: "Keliling", soal: "Persegi sisi 9 cm, kelilingnya...", options: ["27 cm", "36 cm", "81 cm", "18 cm"], kunci: 1, penjelasan: "Keliling persegi = 4 x sisi = 36 cm." },
    { id: "3-5", mapel: "IPS", bab: "Peta", soal: "Warna biru pada peta melambangkan...", options: ["Gunung", "Hutan", "Perairan", "Jalan"], kunci: 2, penjelasan: "Biru = perairan (laut, sungai, danau)." },
    { id: "3-6", mapel: "PPKn", bab: "Hak dan Kewajiban", soal: "Kewajiban siswa di sekolah adalah...", options: ["Dapat nilai bagus", "Mengerjakan PR", "Jajan terus", "Membolos"], kunci: 1, penjelasan: "Mengerjakan PR adalah kewajiban belajar." },
    { id: "3-7", mapel: "IPA", bab: "Gaya", soal: "Buah jatuh dari pohon karena gaya...", options: ["Gesek", "Pegas", "Gravitasi", "Magnet"], kunci: 2, penjelasan: "Gravitasi menarik benda ke bumi." },
    { id: "3-8", mapel: "Bahasa Indonesia", bab: "Imbuhan", soal: "Kata berimbuhan me- yang benar...", options: ["Me-pukul", "Memukul", "Mempukul", "Me-mukul"], kunci: 1, penjelasan: "me- + pukul = memukul (p luluh)." },
    { id: "3-9", mapel: "Matematika", bab: "Sudut", soal: "Sudut siku-siku besarnya...", options: ["45°", "90°", "180°", "360°"], kunci: 1, penjelasan: "Siku-siku = 90 derajat." },
    { id: "3-10", mapel: "PPKn", bab: "Musyawarah", soal: "Hasil musyawarah harus...", options: ["Dilanggar", "Dipatuhi bersama", "Diabaikan", "Dilupakan"], kunci: 1, penjelasan: "Hasil musyawarah wajib dipatuhi." },
  ],
  SD4: [
    { id: "4-1", mapel: "Matematika", bab: "KPK & FPB", soal: "KPK dari 4 dan 6 adalah...", options: ["12", "8", "10", "6"], kunci: 0, penjelasan: "KPK 4 & 6 = 12." },
    { id: "4-2", mapel: "IPA", bab: "Gaya", soal: "Alat untuk mengukur gaya adalah...", options: ["Penggaris", "Dinamometer", "Termometer", "Timbangan"], kunci: 1, penjelasan: "Dinamometer ukur gaya Newton." },
    { id: "4-3", mapel: "Bahasa Indonesia", bab: "Pantun", soal: "Pantun terdiri dari...", options: ["2 baris", "4 baris", "6 baris", "1 baris"], kunci: 1, penjelasan: "Pantun 4 baris, sampiran + isi." },
    { id: "4-4", mapel: "Matematika", bab: "Bangun Datar", soal: "Luas persegi panjang p=8, l=5 adalah...", options: ["13", "26", "40", "35"], kunci: 2, penjelasan: "Luas = p x l = 40." },
    { id: "4-5", mapel: "IPS", bab: "Keragaman Budaya", soal: "Rumah adat Joglo dari...", options: ["Jawa Tengah", "Sumatera", "Kalimantan", "Papua"], kunci: 0, penjelasan: "Joglo dari Jawa Tengah." },
    { id: "4-6", mapel: "PPKn", bab: "Pancasila", soal: "Sila ke-3 lambangnya...", options: ["Bintang", "Rantai", "Pohon Beringin", "Padi Kapas"], kunci: 2, penjelasan: "Sila 3 Persatuan, lambang Beringin." },
    { id: "4-7", mapel: "IPA", bab: "Energi", soal: "Energi yang berasal dari matahari disebut...", options: ["Energi angin", "Energi surya", "Energi air", "Energi listrik"], kunci: 1, penjelasan: "Surya = matahari." },
    { id: "4-8", mapel: "Bahasa Indonesia", bab: "Ide Pokok", soal: "Paragraf yang ide pokok di akhir disebut...", options: ["Deduktif", "Induktif", "Campuran", "Narasi"], kunci: 1, penjelasan: "Induktif ide di akhir." },
    { id: "4-9", mapel: "Matematika", bab: "Sudut", soal: "Sudut tumpul besarnya...", options: ["<90°", "=90°", ">90° dan <180°", "=180°"], kunci: 2, penjelasan: "Tumpul >90° <180°." },
    { id: "4-10", mapel: "IPS", bab: "Peta", soal: "Kenampakan alam buatan manusia adalah...", options: ["Gunung", "Waduk", "Laut", "Sungai"], kunci: 1, penjelasan: "Waduk bendungan buatan." },
  ],
  SD5: [
    { id: "5-1", mapel: "Matematika", bab: "Volume", soal: "Volume kubus sisi 5 cm adalah...", options: ["25 cm³", "100 cm³", "125 cm³", "150 cm³"], kunci: 2, penjelasan: "Volume kubus = s³ = 125." },
    { id: "5-2", mapel: "IPA", bab: "Pencernaan", soal: "Organ pencernaan setelah lambung adalah...", options: ["Kerongkongan", "Usus halus", "Mulut", "Tenggorokan"], kunci: 1, penjelasan: "Makanan dari lambung ke usus halus." },
    { id: "5-3", mapel: "Bahasa Indonesia", bab: "Teks Eksplanasi", soal: "Teks eksplanasi menjelaskan...", options: ["Cerita khayalan", "Proses terjadinya sesuatu", "Puisi", "Pantun"], kunci: 1, penjelasan: "Eksplanasi = proses sebab akibat." },
    { id: "5-4", mapel: "Matematika", bab: "Skala", soal: "Jarak peta 4cm skala 1:100.000, jarak sebenarnya...", options: ["4km", "40km", "400m", "0,4km"], kunci: 0, penjelasan: "4cm x 100.000 = 400.000cm = 4km." },
    { id: "5-5", mapel: "IPS", bab: "Kerajaan", soal: "Kerajaan Hindu pertama di Indonesia...", options: ["Kutai", "Tarumanegara", "Majapahit", "Sriwijaya"], kunci: 0, penjelasan: "Kutai di Kalimantan Timur abad ke-4." },
    { id: "5-6", mapel: "PPKn", bab: "Bhinneka Tunggal Ika", soal: "Arti Bhinneka Tunggal Ika...", options: ["Berbeda-beda tetapi tetap satu", "Satu nusa satu bangsa", "Bersatu dalam perbedaan", "Berbeda suku"], kunci: 0, penjelasan: "Semboyan negara dari Kitab Sutasoma." },
    { id: "5-7", mapel: "IPA", bab: "Peredaran Darah", soal: "Jantung memompa darah ke...", options: ["Paru-paru saja", "Seluruh tubuh", "Otak saja", "Kaki saja"], kunci: 1, penjelasan: "Jantung pompa ke seluruh tubuh." },
    { id: "5-8", mapel: "Bahasa Indonesia", bab: "Pantun", soal: "Baris 1-2 pantun disebut...", options: ["Isi", "Sampiran", "Penutup", "Pembuka"], kunci: 1, penjelasan: "Sampiran baris 1-2, isi 3-4." },
    { id: "5-9", mapel: "Matematika", bab: "Kecepatan", soal: "Jarak 60km waktu 2 jam, kecepatan...", options: ["20 km/jam", "30 km/jam", "60 km/jam", "120 km/jam"], kunci: 1, penjelasan: "Kecepatan = jarak/waktu = 30." },
    { id: "5-10", mapel: "IPS", bab: "Ekonomi", soal: "Kegiatan membuat barang disebut...", options: ["Konsumsi", "Distribusi", "Produksi", "Investasi"], kunci: 2, penjelasan: "Produksi = menghasilkan barang/jasa." },
  ],
  SD6: [
    { id: "6-1", mapel: "Matematika", bab: "Lingkaran", soal: "Rumus luas lingkaran adalah...", options: ["π x r x r", "2 x π x r", "π x d", "r x r"], kunci: 0, penjelasan: "Luas = πr²." },
    { id: "6-2", mapel: "IPA", bab: "Listrik", soal: "Satuan arus listrik adalah...", options: ["Watt", "Volt", "Ampere", "Ohm"], kunci: 2, penjelasan: "Ampere untuk arus, Volt tegangan." },
    { id: "6-3", mapel: "Bahasa Indonesia", bab: "Pidato", soal: "Pidato persuasif bertujuan...", options: ["Menghibur", "Mengajak/mempengaruhi", "Menceritakan", "Menjelaskan"], kunci: 1, penjelasan: "Persuasif = ajakan." },
    { id: "6-4", mapel: "Matematika", bab: "Bangun Ruang", soal: "Jumlah sisi tabung adalah...", options: ["2", "3", "4", "1"], kunci: 1, penjelasan: "Tabung 3 sisi: alas, tutup, selimut." },
    { id: "6-5", mapel: "IPS", bab: "Proklamasi", soal: "Proklamasi dibacakan di...", options: ["Jl. Pegangsaan Timur 56", "Monas", "Istana Negara", "Gedung Merdeka"], kunci: 0, penjelasan: "Di rumah Soekarno Pegangsaan Timur 56." },
    { id: "6-6", mapel: "PPKn", bab: "Demokrasi", soal: "Pemilihan umum dilaksanakan setiap...", options: ["1 tahun", "3 tahun", "5 tahun", "10 tahun"], kunci: 2, penjelasan: "Pemilu 5 tahun sekali." },
    { id: "6-7", mapel: "IPA", bab: "Ekosistem", soal: "Pengurai dalam ekosistem adalah...", options: ["Padi", "Jamur", "Ayam", "Elang"], kunci: 1, penjelasan: "Jamur/bakteri pengurai." },
    { id: "6-8", mapel: "Bahasa Indonesia", bab: "Unsur Cerita", soal: "Tokoh utama disebut...", options: ["Protagonis", "Antagonis", "Tritagonis", "Figuran"], kunci: 0, penjelasan: "Protagonis tokoh utama baik." },
    { id: "6-9", mapel: "Matematika", bab: "Statistika", soal: "Rata-rata dari 80, 85, 90 adalah...", options: ["80", "85", "90", "255"], kunci: 1, penjelasan: "(80+85+90)/3 = 85." },
    { id: "6-10", mapel: "IPS", bab: "Globalisasi", soal: "Dampak positif globalisasi...", options: ["Pudarnya budaya lokal", "Mudah akses informasi", "Banyak pengangguran", "Kesenjangan sosial"], kunci: 1, penjelasan: "Akses informasi lebih mudah." },
  ],
};

export default function Page() {
  const [activeKelas, setActiveKelas] = useState<Kelas>("SD1");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(10).fill(null));
  const [revealed, setRevealed] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [demoVersion, setDemoVersion] = useState(0);
  const demoRef = useRef<HTMLDivElement>(null);

  const questions = demoData[activeKelas];
  const current = questions[qIndex];

  const handleKelasChange = (k: Kelas) => {
    setActiveKelas(k);
    setQIndex(0);
    setAnswers(Array(10).fill(null));
    setShowResult(false);
    setRevealed(false);
  };

  const score = answers.filter((a, i) => a === questions[i].kunci).length;
  const percent = Math.round((score / 10) * 100);

  const scrollToDemo = (kelas?: Kelas) => {
    if (kelas) handleKelasChange(kelas);
    else {
      setDemoVersion(v=>v+1);
      setQIndex(0);
      setShowResult(false);
      setRevealed(false);
      setAnswers(Array(10).fill(null));
    }
    try { window.location.hash = "demo-live"; } catch {}
    demoRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToPilihKelas = () => {
    document.getElementById("pilih-kelas")?.scrollIntoView({ behavior: "smooth" });
  };

  const waLink = (k: Kelas) => {
    const text = `Halo MRH Saya mau paket BSJ-${k} Rp17.000 - 900 soal KurMer 2025. Minta kode voucher ya!`;
    return `https://wa.me/6281770220059?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5] text-[#0E2A6B] font-sans antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&family=Inter:wght@400;600&display=swap');
        *{font-family:'Plus Jakarta Sans','Inter',system-ui,sans-serif}
        .shadow-soft{box-shadow:0 8px 30px rgba(14,42,107,0.08)}
        .shadow-orange{box-shadow:0 10px 24px rgba(255,140,0,0.25)}
      `}</style>

      <div className="w-full bg-[#0E2A6B] text-white text-[11px] md:text-xs py-2 px-4 flex justify-center md:justify-between items-center gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span>📍 Purwakarta - Jawa Barat</span>
          <span className="hidden md:inline opacity-40">|</span>
          <span>✉️ mrhdigitalhub@gmail.com</span>
          <span className="hidden md:inline opacity-40">|</span>
          <span>📞 081770220059</span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[11px] bg-white/10 px-3 py-1 rounded-full">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> 1.274 orang tua aktif hari ini
        </div>
      </div>

      <header className="max-w-[1120px] mx-auto px-4 md:px-6 pt-8 pb-6">
        <div className="flex flex-col items-center text-center">
          <div className="w-[240px] h-auto mb-4">
            <img src="/logo-nrh-transparan.png" alt="MRH Logo" className="w-full h-auto object-contain" />
          </div>
          <p className="text-[11px] md:text-xs tracking-[0.18em] uppercase font-bold text-[#1E5BFF]">MRH - Konsultan | Sertifikasi | DigitalHub</p>
          <p className="text-[10px] md:text-[11px] tracking-wide text-[#0E2A6B]/60 font-semibold mt-1">Bersinergi Bertransformasi Industri Modern</p>

          <div className="mt-8 md:mt-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white border border-[#FF8C00]/20 text-[#FF8C00] text-[11px] font-bold px-3 py-1 rounded-full shadow-soft">
              <span className="bg-[#FF8C00] text-white text-[9px] px-1.5 py-0.5 rounded-full">BARU</span> Kurikulum Merdeka 2025 - 5400 Soal
            </div>
            <h1 className="mt-4 text-[28px] md:text-[48px] font-extrabold leading-[1.1] tracking-tight text-[#0E2A6B]">
              Nilai Anak Turun? <span className="text-[#1E5BFF]">900 Soal KurMer 2025</span> Bikin Juara Kelas - Cuma <span className="text-[#FF8C00]">Rp17.000!</span>
            </h1>
            <p className="mt-4 text-[14px] md:text-[16px] leading-relaxed text-[#0E2A6B]/70 font-medium">
              Bersama MRH Raih Nilai Tertinggi Di Kelas Kamu. <br className="hidden md:block" />
              <span className="font-bold text-[#0E2A6B]">5400 Soal SD1-SD6 (900/kelas) x 5 Mapel Wajib</span>, Pantauan Ortu Real-Time, Score + Penjelasan Lengkap
            </p>

            <div className="mt-6 flex flex-col md:flex-row gap-3 justify-center">
              <button onClick={()=>scrollToDemo()} className="bg-[#0E2A6B] text-white rounded-2xl px-6 py-4 font-bold text-[15px] shadow-soft hover:bg-[#122f78] transition flex items-center justify-center gap-2 cursor-pointer">
                🔥 Buka Demo Live 10 Soal Gratis
              </button>
              <button onClick={scrollToPilihKelas} className="bg-[#FF8C00] text-white rounded-2xl px-6 py-4 font-bold text-[15px] shadow-orange hover:bg-[#ff9a1f] transition flex items-center justify-center gap-2 cursor-pointer">
                🎯 Pilih Kelasmu
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-[#0E2A6B]/60">
              <span>✅ Tanpa aplikasi</span><span>✅ Langsung di web ini</span><span>✅ Voucher DANA</span>
            </div>
          </div>
        </div>

        <div className="mt-10 grid md:grid-cols-[1.2fr_0.8fr] gap-4 items-stretch">
          <div className="bg-white rounded-[24px] border border-[#0E2A6B]/10 p-4 md:p-5 shadow-soft flex flex-col">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold tracking-widest">LIVE PREVIEW SOAL</p>
              <span className="text-[10px] bg-emerald-500 text-white px-2 py-1 rounded-full font-bold">● 900 SOAL / KELAS</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { k: "SD1", n: "900 Soal", c: "bg-blue-50" },
                { k: "SD2", n: "900 Soal", c: "bg-orange-50" },
                { k: "SD3", n: "900 Soal", c: "bg-emerald-50" },
              ].map((it) => (
                <div key={it.k} className={`${it.c} rounded-xl p-3 border`}>
                  <p className="text-[11px] font-bold">{it.k}</p>
                  <p className="text-[10px] opacity-70">{it.n}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-[#0E2A6B] text-white rounded-xl p-3 text-[12px]">
              <p className="font-bold">Alur: Demo di Landing → Pesan WA → Bayar DANA → Kode Voucher → Soal Sesuai Kelas → Score → Selesai</p>
            </div>
          </div>
          <div className="bg-[#FF8C00] rounded-[24px] p-5 text-white shadow-orange flex flex-col justify-between">
            <div>
              <p className="text-[12px] font-bold tracking-widest opacity-90">PROMO HARI INI</p>
              <p className="mt-2 text-[32px] font-extrabold leading-none">Rp17.000</p>
              <p className="text-[12px] opacity-80 line-through">Rp39.000</p>
              <p className="mt-3 text-[13px] font-medium leading-snug">90 Hari akses, 900 soal/kelas, Score + Penjelasan, Pantauan Ortu</p>
            </div>
            <button onClick={scrollToPilihKelas} className="mt-6 bg-white text-[#FF8C00] rounded-xl py-3 font-bold text-[14px]">🎯 Pilih Kelas Sekarang</button>
          </div>
        </div>
      </header>

      <section ref={demoRef} id="demo-live" className="max-w-[1120px] mx-auto px-4 md:px-6 py-8">
        <div className="bg-white rounded-[28px] border border-[#0E2A6B]/10 shadow-soft p-5 md:p-7">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-[20px] md:text-[26px] font-extrabold">DEMO LIVE 10 Soal — Coba Dulu di Landing Ini!</h2>
              <p className="text-[12px] md:text-[13px] text-[#0E2A6B]/60 mt-1">Klik SD1-SD6, jawab 10 soal, langsung score + penjelasan jika salah (demo tidak mengurangi 900 soal asli)</p>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="bg-[#0E2A6B] text-white px-3 py-1.5 rounded-full font-bold">LIVE</span>
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full font-bold">Tanpa Login</span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {KELAS.map((k) => (
              <button key={k} onClick={()=>handleKelasChange(k)} className={`px-4 py-2 rounded-full text-[13px] font-bold border transition ${activeKelas===k ? "bg-[#FF8C00] text-white border-[#FF8C00] shadow-orange" : "bg-white text-[#0E2A6B] border-[#0E2A6B]/15 hover:bg-[#0E2A6B]/5"}`}>
                {activeKelas===k ? "● " : ""}Demo {k}
              </button>
            ))}
          </div>

          <div className="mt-6 grid md:grid-cols-[1.2fr_0.8fr] gap-6">
            <div className="bg-[#FFFEF5] rounded-2xl border p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-widest">{current.mapel} • {current.bab}</span>
                <span className="text-[11px] bg-[#0E2A6B] text-white px-2.5 py-1 rounded-full font-bold">{qIndex+1}/10</span>
              </div>
              <div className="mt-3 w-full h-1.5 bg-[#0E2A6B]/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#1E5BFF] transition-all" style={{ width: `${((qIndex+1)/10)*100}%` }} />
              </div>
              <h3 className="mt-4 text-[16px] font-bold leading-snug">{current.soal}</h3>
              <div className="mt-4 grid gap-2">
                {current.options.map((opt, i) => {
                  const isSelected = answers[qIndex]===i;
                  const isCorrect = i===current.kunci;
                  const showAns = revealed;
                  return (
                    <button key={i} onClick={()=>{
                      if (revealed) return;
                      const copy=[...answers]; copy[qIndex]=i; setAnswers(copy); setRevealed(true);
                      setTimeout(()=>{
                        if (qIndex<9){ setQIndex(qIndex+1); setRevealed(false); } else { setShowResult(true); }
                      }, 1200);
                    }} className={`text-left rounded-xl border p-3 text-[13px] font-medium transition ${showAns ? (isCorrect ? "bg-emerald-50 border-emerald-400 text-emerald-800" : isSelected ? "bg-rose-50 border-rose-400 text-rose-800" : "bg-white border-[#0E2A6B]/10 opacity-60") : "bg-white border-[#0E2A6B]/10 hover:border-[#1E5BFF]/40"}`}>
                      <span className="font-bold mr-2">{String.fromCharCode(65+i)}.</span>{opt} {showAns && isCorrect && "✅"} {showAns && isSelected && !isCorrect && "❌"}
                    </button>
                  );
                })}
              </div>
              {revealed && (
                <div className={`mt-4 rounded-xl p-3 text-[12px] ${answers[qIndex]===current.kunci ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-amber-50 border border-amber-200 text-amber-800"}`}>
                  <p className="font-bold">{answers[qIndex]===current.kunci ? "🎉 Benar!" : "💡 Penjelasan:"}</p>
                  <p className="mt-1 leading-relaxed">{current.penjelasan}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-[#0E2A6B] text-white rounded-2xl p-5">
                <p className="text-[11px] tracking-widest opacity-60 font-bold">SKOR DEMO {activeKelas}</p>
                <p className="mt-2 text-[36px] font-extrabold">{percent}%</p>
                <p className="text-[12px] opacity-80">Benar {score}/10 • {activeKelas} - 10 Soal</p>
                <div className="mt-4 grid grid-cols-10 gap-1">
                  {answers.map((a, i)=>(
                    <div key={i} className={`h-2 rounded-full ${a===null ? "bg-white/20" : a===demoData[activeKelas][i].kunci ? "bg-emerald-400" : "bg-rose-400"}`} />
                  ))}
                </div>
                {showResult && (
                  <div className="mt-4 bg-white text-[#0E2A6B] rounded-xl p-3 text-center">
                    <p className="font-bold text-[14px]">{percent>=70 ? "🔥 Keren! Lanjut 900 Soal?" : "💪 Semangat! Coba 900 Soal Lengkap"}</p>
                    <a href={waLink(activeKelas)} target="_blank" rel="noopener" className="mt-2 inline-block bg-[#FF8C00] text-white rounded-full px-4 py-2 text-[12px] font-bold">Ambil 900 Soal {activeKelas} Rp17rb</a>
                  </div>
                )}
              </div>
              <div className="bg-white border rounded-2xl p-4">
                <p className="text-[12px] font-bold">Kenapa Demo di Landing?</p>
                <ul className="mt-2 space-y-1.5 text-[11px] text-[#0E2A6B]/70">
                  <li>✅ 10 soal preview langsung di web ini (tidak masuk 900 soal asli)</li>
                  <li>✅ Jawab → Score + Penjelasan bila salah</li>
                  <li>✅ Klik Pesan → WA Admin → Bayar DANA → Dapat Kode Voucher</li>
                  <li>✅ Kode SD1 masuk SD1, SD4 masuk SD4 (per-kelas, tidak nyangkut)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pilih-kelas" className="max-w-[1120px] mx-auto px-4 md:px-6 py-6">
        <h2 className="text-[20px] md:text-[24px] font-extrabold">🎯 Pilih Kelasmu — Paket BSJ 900 Soal</h2>
        <p className="text-[12px] text-[#0E2A6B]/60 mt-1">Klik Demo untuk coba 10 soal di landing, klik Pesan untuk WA Admin + Bayar DANA + Dapat Kode Voucher</p>
        <div className="mt-5 grid md:grid-cols-3 gap-4">
          {KELAS.map((k)=>(
            <div key={k} className="bg-white rounded-[20px] border border-[#0E2A6B]/10 p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="bg-[#0E2A6B] text-white text-[11px] font-bold px-2.5 py-1 rounded-full">{k}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold">900 SOAL</span>
              </div>
              <h3 className="mt-3 font-extrabold text-[16px]">BSJ-{k} — 900 Soal KurMer 2025</h3>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-[12px] line-through opacity-50">Rp39.000</span>
                <span className="text-[#FF8C00] font-extrabold text-[20px]">Rp17.000</span>
                <span className="text-[10px] bg-[#FF8C00] text-white px-2 py-0.5 rounded-full font-bold">HEMAT 56%</span>
              </div>
              <div className="mt-3">
                <p className="text-[20px] font-extrabold">Rp17.000 <span className="text-[11px] font-medium opacity-60">/ 90 hari</span></p>
                <ul className="mt-2 space-y-1 text-[11px] text-[#0E2A6B]/70">
                  <li>✓ 900 Soal + Pembahasan</li><li>✓ Score + Pantauan Ortu Real-Time</li><li>✓ 5 Mapel Wajib</li>
                </ul>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button onClick={() => scrollToDemo(k)} className="rounded-xl border border-[#0E2A6B]/15 bg-white text-[12px] font-bold py-2.5 hover:bg-[#0E2A6B]/5">📚 Demo 10 Soal</button>
                <a href={waLink(k)} target="_blank" rel="noopener" className="rounded-xl bg-[#0E2A6B] text-white text-[12px] font-bold py-2.5 text-center hover:bg-[#12307a]">💬 Pesan Sekarang</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[1120px] mx-auto px-4 md:px-6 py-8">
        <div className="bg-white rounded-[28px] border border-[#0E2A6B]/10 shadow-soft p-6 md:p-8">
          <h3 className="text-[18px] md:text-[20px] font-extrabold">Alur Pembayaran Super Simpel — 4 Langkah</h3>
          <div className="mt-6 grid md:grid-cols-4 gap-4 relative">
            <div className="hidden md:block absolute top-[32px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-[#1E5BFF] via-[#FF8C00] to-[#0E2A6B] opacity-20" />
            {[
              { n: "1", t: "Demo di Landing", d: "Coba 10 soal langsung di web ini. Tanpa login.", icon: "🖥️" },
              { n: "2", t: "Pesan via WA", d: "Klik Pesan → WA admin 081770220059. Pilih kelas SD1-SD6.", icon: "💬" },
              { n: "3", t: "Bayar via DANA", d: "Transfer Rp17rb. Admin verifikasi cepat.", icon: "💳" },
              { n: "4", t: "Kode Voucher → Soal Sesuai Kelas → Score", d: "Dapat kode, masuk halaman soal SD1→SD1, SD4→SD4, langsung score + selesai.", icon: "🎯" },
            ].map((s) => (
              <div key={s.n} className="relative bg-[#FFFEF5] rounded-2xl border p-4">
                <div className="w-12 h-12 rounded-2xl bg-white border shadow-soft flex items-center justify-center text-[20px]">{s.icon}</div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#0E2A6B] text-white text-[11px] font-bold flex items-center justify-center">{s.n}</span>
                  <p className="font-bold text-[13px]">{s.t}</p>
                </div>
                <p className="mt-1 text-[12px] text-[#0E2A6B]/60 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-[#0E2A6B] text-white rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-[13px] font-medium">📲 Setelah bayar DANA, admin kirim kode voucher <span className="font-bold text-[#FFC93C]">maks 5 menit</span> (jam kerja 08.00-21.00 WIB)</p>
            <a href="https://wa.me/6281770220059?text=Halo%20MRH%20Saya%20mau%20paket%20BSJ%20Rp17.000" target="_blank" rel="noopener" className="bg-white text-[#0E2A6B] rounded-xl px-4 py-2 text-[12px] font-bold">Chat Admin Sekarang</a>
          </div>
        </div>
      </section>

      <footer className="mt-8 bg-[#0E2A6B] text-white">
        <div className="max-w-[1120px] mx-auto px-4 md:px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <img src="/logo-nrh-transparan.png" alt="MRH" className="w-10 h-10 object-contain bg-white rounded-xl p-1" />
                <div>
                  <p className="font-extrabold text-[14px]">MRH - Konsultan | Sertifikasi | DigitalHub</p>
                  <p className="text-[10px] opacity-70">Bersinergi Bertransformasi Industri Modern</p>
                </div>
              </div>
              <p className="mt-4 text-[12px] opacity-80 max-w-sm leading-relaxed">Bersama MRH Raih Nilai Tertinggi Di Kelas Kamu. Bimbel Super Juara — 5400 soal KurMer 2025 SD1-SD6, 5 mapel wajib, score real-time.</p>
            </div>
            <div className="text-[12px] space-y-1 opacity-80">
              <p>📍 Purwakarta - Jawa Barat</p>
              <p>✉️ mrhdigitalhub@gmail.com</p>
              <p>📞 <a href="https://wa.me/6281770220059" target="_blank" rel="noopener" className="underline">wa.me/6281770220059</a></p>
              <p className="mt-3 text-[11px] opacity-60">Metode: DANA → Voucher → Soal Sesuai Kelas → Score → Selesai</p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between gap-2 text-[11px] opacity-60">
            <p>© mrhdigitalhub@2026 — MRH Bimbel Super Juara. All rights reserved.</p>
            <p>Landing final siap buka di web • Demo live 10 soal • Pesan Rp17rb via WA</p>
          </div>
        </div>
      </footer>

      <a href="https://wa.me/6281770220059?text=Halo%20MRH%20Saya%20mau%20paket%20BSJ%20Rp17.000" target="_blank" rel="noopener" className="fixed bottom-4 right-4 bg-[#25D366] text-white rounded-full px-4 py-3 shadow-[0_10px_24px_rgba(0,0,0,0.2)] font-bold text-[13px] flex items-center gap-2 z-50">
        💬 Pesan WA
      </a>
    </div>
  );
}
