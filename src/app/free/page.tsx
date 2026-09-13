"use client";
import { useState, useRef } from "react";

type KelasKey = "SD1" | "SD2" | "SD3" | "SD4" | "SD5" | "SD6";

interface Question {
  mapel: string;
  bab: string;
  soal: string;
  options: string[];
  kunci: number;
  penjelasan: string;
}

// BANK SOAL SAMA DENGAN PAGE FINAL FIX - KurMer 2025 - 10 SOAL / KELAS
const questionBank: Record<KelasKey, Question[]> = {
  SD1: [
    { mapel: "Matematika", bab: "Bilangan 1-20", soal: "Berapa hasil dari 8 + 7 ?", options: ["12", "14", "15", "16"], kunci: 2, penjelasan: "8 + 7 = 15. Hitung dengan jari atau garis bilangan." },
    { mapel: "Bahasa Indonesia", bab: "Huruf Kapital", soal: "Kalimat mana yang penulisan huruf kapitalnya benar?", options: ["saya tinggal di purwakarta", "Saya tinggal di Purwakarta", "saya Tinggal Di purwakarta", "Saya tinggal Di purwakarta"], kunci: 1, penjelasan: "Nama orang dan nama tempat (Purwakarta) wajib huruf kapital." },
    { mapel: "IPA", bab: "Bagian Tubuh", soal: "Bagian tubuh untuk melihat adalah...", options: ["Telinga", "Mata", "Hidung", "Lidah"], kunci: 1, penjelasan: "Mata adalah indra penglihatan." },
    { mapel: "Matematika", bab: "Pengurangan", soal: "Ibu punya 14 apel, dimakan 5. Sisa apel Ibu?", options: ["8", "9", "10", "7"], kunci: 1, penjelasan: "14 - 5 = 9 apel." },
    { mapel: "PPKn", bab: "Aturan di Rumah", soal: "Contoh aturan di rumah adalah...", options: ["Berisik saat belajar", "Merapi mainan setelah bermain", "Tidak pamit saat pergi", "Membuang sampah sembarangan"], kunci: 1, penjelasan: "Merapi mainan = tanggung jawab dan hidup tertib." },
    { mapel: "IPS", bab: "Keluarga", soal: "Ayah dari ayah kita disebut...", options: ["Paman", "Kakek", "Sepupu", "Adik"], kunci: 1, penjelasan: "Ayah dari ayah adalah kakek dari pihak ayah." },
    { mapel: "Matematika", bab: "Bangun Datar", soal: "Benda yang bentuknya lingkaran adalah...", options: ["Penggaris", "Jam dinding", "Buku", "Pintu"], kunci: 1, penjelasan: "Jam dinding umumnya berbentuk lingkaran." },
    { mapel: "Bahasa Indonesia", bab: "Membaca", soal: "Lawan kata 'besar' adalah...", options: ["Tinggi", "Lebar", "Kecil", "Panjang"], kunci: 2, penjelasan: "Antonim besar adalah kecil." },
    { mapel: "IPA", bab: "Hewan", soal: "Hewan yang bisa terbang adalah...", options: ["Kucing", "Burung", "Ikan", "Kura-kura"], kunci: 1, penjelasan: "Burung memiliki sayap untuk terbang." },
    { mapel: "Matematika", bab: "Waktu", soal: "1 minggu ada berapa hari?", options: ["5 hari", "6 hari", "7 hari", "8 hari"], kunci: 2, penjelasan: "1 minggu = 7 hari (Senin-Minggu)." },
  ],
  SD2: [
    { mapel: "Matematika", bab: "Perkalian", soal: "Hasil dari 7 x 8 adalah...", options: ["54", "56", "64", "48"], kunci: 1, penjelasan: "7 x 8 = 56." },
    { mapel: "Bahasa Indonesia", bab: "Kalimat Tanya", soal: "Kata tanya untuk menanyakan tempat adalah...", options: ["Siapa", "Kapan", "Di mana", "Mengapa"], kunci: 2, penjelasan: "Di mana untuk tempat, siapa untuk orang." },
    { mapel: "IPA", bab: "Wujud Benda", soal: "Es batu jika dipanaskan akan menjadi...", options: ["Padat", "Cair", "Gas", "Beku"], kunci: 1, penjelasan: "Es mencair jadi air karena kalor." },
    { mapel: "IPS", bab: "Pekerjaan", soal: "Orang yang mengajar di sekolah disebut...", options: ["Dokter", "Guru", "Pilot", "Petani"], kunci: 1, penjelasan: "Guru bertugas mendidik di sekolah." },
    { mapel: "Matematika", bab: "Uang", soal: "Rp5.000 + Rp2.000 = ...", options: ["Rp6.000", "Rp7.000", "Rp8.000", "Rp10.000"], kunci: 1, penjelasan: "5000+2000=7000." },
    { mapel: "PPKn", bab: "Sila Pancasila", soal: "Sila ke-2 bunyinya...", options: ["Ketuhanan Yang Maha Esa", "Kemanusiaan yang adil dan beradab", "Persatuan Indonesia", "Keadilan sosial"], kunci: 1, penjelasan: "Sila 2 = Kemanusiaan yang adil dan beradab." },
    { mapel: "IPA", bab: "Tumbuhan", soal: "Bagian tumbuhan yang menyerap air adalah...", options: ["Daun", "Bunga", "Akar", "Batang"], kunci: 2, penjelasan: "Akar menyerap air dan mineral." },
    { mapel: "Bahasa Indonesia", bab: "Sinonim", soal: "Sinonim 'pandai' adalah...", options: ["Bodoh", "Malas", "Cerdas", "Lambat"], kunci: 2, penjelasan: "Pandai = cerdas." },
    { mapel: "Matematika", bab: "Pembagian", soal: "36 : 4 = ...", options: ["8", "9", "6", "7"], kunci: 1, penjelasan: "36 dibagi 4 = 9." },
    { mapel: "IPS", bab: "Arah Mata Angin", soal: "Matahari terbit dari arah...", options: ["Barat", "Utara", "Timur", "Selatan"], kunci: 2, penjelasan: "Matahari terbit di Timur, tenggelam di Barat." },
  ],
  SD3: [
    { mapel: "Matematika", bab: "Pecahan", soal: "1/2 + 1/4 = ...", options: ["1/6", "2/6", "3/4", "2/4"], kunci: 2, penjelasan: "1/2 = 2/4, jadi 2/4+1/4=3/4." },
    { mapel: "IPA", bab: "Rantai Makanan", soal: "Padi -> Belalang -> Ayam -> ... Urutan selanjutnya?", options: ["Rumput", "Ular", "Manusia", "Cacing"], kunci: 2, penjelasan: "Ayam dimakan manusia, rantai makanan berakhir di puncak." },
    { mapel: "Bahasa Indonesia", bab: "Ide Pokok", soal: "Ide pokok biasanya ada di...", options: ["Akhir kalimat", "Awal paragraf", "Tengah kata", "Judul saja"], kunci: 1, penjelasan: "Ide pokok sering di awal paragraf (deduktif)." },
    { mapel: "Matematika", bab: "Keliling", soal: "Persegi sisi 9 cm, kelilingnya...", options: ["27 cm", "36 cm", "81 cm", "18 cm"], kunci: 1, penjelasan: "Keliling persegi = 4 x sisi = 36 cm." },
    { mapel: "IPS", bab: "Peta", soal: "Warna biru pada peta melambangkan...", options: ["Gunung", "Hutan", "Perairan", "Jalan"], kunci: 2, penjelasan: "Biru = perairan (laut, sungai, danau)." },
    { mapel: "PPKn", bab: "Hak dan Kewajiban", soal: "Kewajiban siswa di sekolah adalah...", options: ["Dapat nilai bagus", "Mengerjakan PR", "Jajan terus", "Membolos"], kunci: 1, penjelasan: "Mengerjakan PR adalah kewajiban belajar." },
    { mapel: "IPA", bab: "Gaya", soal: "Buah jatuh dari pohon karena gaya...", options: ["Gesek", "Pegas", "Gravitasi", "Magnet"], kunci: 2, penjelasan: "Gravitasi menarik benda ke bumi." },
    { mapel: "Bahasa Indonesia", bab: "Imbuhan", soal: "Kata berimbuhan me- yang benar...", options: ["Me-pukul", "Memukul", "Mempukul", "Me-mukul"], kunci: 1, penjelasan: "me- + pukul = memukul (p luluh)." },
    { mapel: "Matematika", bab: "Sudut", soal: "Sudut siku-siku besarnya...", options: ["45°", "90°", "180°", "360°"], kunci: 1, penjelasan: "Siku-siku = 90 derajat." },
    { mapel: "PPKn", bab: "Musyawarah", soal: "Hasil musyawarah harus...", options: ["Dilanggar", "Dipatuhi bersama", "Diabaikan", "Dilupakan"], kunci: 1, penjelasan: "Hasil musyawarah wajib dipatuhi." },
  ],
  SD4: [
    { mapel: "Matematika", bab: "KPK & FPB", soal: "KPK dari 4 dan 6 adalah...", options: ["12", "8", "10", "6"], kunci: 0, penjelasan: "KPK 4 & 6 = 12." },
    { mapel: "IPA", bab: "Gaya", soal: "Alat untuk mengukur gaya adalah...", options: ["Penggaris", "Dinamometer", "Termometer", "Timbangan"], kunci: 1, penjelasan: "Dinamometer ukur gaya Newton." },
    { mapel: "Bahasa Indonesia", bab: "Pantun", soal: "Pantun terdiri dari...", options: ["2 baris", "4 baris", "6 baris", "1 baris"], kunci: 1, penjelasan: "Pantun 4 baris, sampiran + isi." },
    { mapel: "Matematika", bab: "Bangun Datar", soal: "Luas persegi panjang p=8, l=5 adalah...", options: ["13", "26", "40", "35"], kunci: 2, penjelasan: "Luas = p x l = 40." },
    { mapel: "IPS", bab: "Keragaman Budaya", soal: "Rumah adat Joglo dari...", options: ["Jawa Tengah", "Sumatera", "Kalimantan", "Papua"], kunci: 0, penjelasan: "Joglo dari Jawa Tengah." },
    { mapel: "PPKn", bab: "Pancasila", soal: "Sila ke-3 lambangnya...", options: ["Bintang", "Rantai", "Pohon Beringin", "Padi Kapas"], kunci: 2, penjelasan: "Sila 3 Persatuan, lambang Beringin." },
    { mapel: "IPA", bab: "Energi", soal: "Energi yang berasal dari matahari disebut...", options: ["Energi angin", "Energi surya", "Energi air", "Energi listrik"], kunci: 1, penjelasan: "Surya = matahari." },
    { mapel: "Bahasa Indonesia", bab: "Ide Pokok", soal: "Paragraf yang ide pokok di akhir disebut...", options: ["Deduktif", "Induktif", "Campuran", "Narasi"], kunci: 1, penjelasan: "Induktif ide di akhir." },
    { mapel: "Matematika", bab: "Sudut", soal: "Sudut tumpul besarnya...", options: ["<90°", "=90°", ">90° dan <180°", "=180°"], kunci: 2, penjelasan: "Tumpul >90° <180°." },
    { mapel: "IPS", bab: "Peta", soal: "Kenampakan alam buatan manusia adalah...", options: ["Gunung", "Waduk", "Laut", "Sungai"], kunci: 1, penjelasan: "Waduk bendungan buatan." },
  ],
  SD5: [
    { mapel: "Matematika", bab: "Volume", soal: "Volume kubus sisi 5 cm adalah...", options: ["25 cm³", "100 cm³", "125 cm³", "150 cm³"], kunci: 2, penjelasan: "Volume kubus = s³ = 125." },
    { mapel: "IPA", bab: "Pencernaan", soal: "Organ pencernaan setelah lambung adalah...", options: ["Kerongkongan", "Usus halus", "Mulut", "Tenggorokan"], kunci: 1, penjelasan: "Makanan dari lambung ke usus halus." },
    { mapel: "Bahasa Indonesia", bab: "Teks Eksplanasi", soal: "Teks eksplanasi menjelaskan...", options: ["Cerita khayalan", "Proses terjadinya sesuatu", "Puisi", "Pantun"], kunci: 1, penjelasan: "Eksplanasi = proses sebab akibat." },
    { mapel: "Matematika", bab: "Skala", soal: "Jarak peta 4cm skala 1:100.000, jarak sebenarnya...", options: ["4km", "40km", "400m", "0,4km"], kunci: 0, penjelasan: "4cm x 100.000 = 400.000cm = 4km." },
    { mapel: "IPS", bab: "Kerajaan", soal: "Kerajaan Hindu pertama di Indonesia...", options: ["Kutai", "Tarumanegara", "Majapahit", "Sriwijaya"], kunci: 0, penjelasan: "Kutai di Kalimantan Timur abad ke-4." },
    { mapel: "PPKn", bab: "Bhinneka Tunggal Ika", soal: "Arti Bhinneka Tunggal Ika...", options: ["Berbeda-beda tetapi tetap satu", "Satu nusa satu bangsa", "Bersatu dalam perbedaan", "Berbeda suku"], kunci: 0, penjelasan: "Semboyan negara dari Kitab Sutasoma." },
    { mapel: "IPA", bab: "Peredaran Darah", soal: "Jantung memompa darah ke...", options: ["Paru-paru saja", "Seluruh tubuh", "Otak saja", "Kaki saja"], kunci: 1, penjelasan: "Jantung pompa ke seluruh tubuh." },
    { mapel: "Bahasa Indonesia", bab: "Pantun", soal: "Baris 1-2 pantun disebut...", options: ["Isi", "Sampiran", "Penutup", "Pembuka"], kunci: 1, penjelasan: "Sampiran baris 1-2, isi 3-4." },
    { mapel: "Matematika", bab: "Kecepatan", soal: "Jarak 60km waktu 2 jam, kecepatan...", options: ["20 km/jam", "30 km/jam", "60 km/jam", "120 km/jam"], kunci: 1, penjelasan: "Kecepatan = jarak/waktu = 30." },
    { mapel: "IPS", bab: "Ekonomi", soal: "Kegiatan membuat barang disebut...", options: ["Konsumsi", "Distribusi", "Produksi", "Investasi"], kunci: 2, penjelasan: "Produksi = menghasilkan barang/jasa." },
  ],
  SD6: [
    { mapel: "Matematika", bab: "Lingkaran", soal: "Rumus luas lingkaran adalah...", options: ["π x r x r", "2 x π x r", "π x d", "r x r"], kunci: 0, penjelasan: "Luas = πr²." },
    { mapel: "IPA", bab: "Listrik", soal: "Satuan arus listrik adalah...", options: ["Watt", "Volt", "Ampere", "Ohm"], kunci: 2, penjelasan: "Ampere untuk arus, Volt tegangan." },
    { mapel: "Bahasa Indonesia", bab: "Pidato", soal: "Pidato persuasif bertujuan...", options: ["Menghibur", "Mengajak/mempengaruhi", "Menceritakan", "Menjelaskan"], kunci: 1, penjelasan: "Persuasif = ajakan." },
    { mapel: "Matematika", bab: "Bangun Ruang", soal: "Jumlah sisi tabung adalah...", options: ["2", "3", "4", "1"], kunci: 1, penjelasan: "Tabung 3 sisi: alas, tutup, selimut." },
    { mapel: "IPS", bab: "Proklamasi", soal: "Proklamasi dibacakan di...", options: ["Jl. Pegangsaan Timur 56", "Monas", "Istana Negara", "Gedung Merdeka"], kunci: 0, penjelasan: "Di rumah Soekarno Pegangsaan Timur 56." },
    { mapel: "PPKn", bab: "Demokrasi", soal: "Pemilihan umum dilaksanakan setiap...", options: ["1 tahun", "3 tahun", "5 tahun", "10 tahun"], kunci: 2, penjelasan: "Pemilu 5 tahun sekali." },
    { mapel: "IPA", bab: "Ekosistem", soal: "Pengurai dalam ekosistem adalah...", options: ["Padi", "Jamur", "Ayam", "Elang"], kunci: 1, penjelasan: "Jamur/bakteri pengurai." },
    { mapel: "Bahasa Indonesia", bab: "Unsur Cerita", soal: "Tokoh utama disebut...", options: ["Protagonis", "Antagonis", "Tritagonis", "Figuran"], kunci: 0, penjelasan: "Protagonis tokoh utama baik." },
    { mapel: "Matematika", bab: "Statistika", soal: "Rata-rata dari 80, 85, 90 adalah...", options: ["80", "85", "90", "255"], kunci: 1, penjelasan: "(80+85+90)/3 = 85." },
    { mapel: "IPS", bab: "Globalisasi", soal: "Dampak positif globalisasi...", options: ["Pudarnya budaya lokal", "Mudah akses informasi", "Banyak pengangguran", "Kesenjangan sosial"], kunci: 1, penjelasan: "Akses informasi lebih mudah." },
  ],
};

const kelasList: KelasKey[] = ["SD1","SD2","SD3","SD4","SD5","SD6"];

export default function FreeDemoPage() {
  const [activeKelas, setActiveKelas] = useState<KelasKey>("SD1");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(10).fill(null));
  const [revealed, setRevealed] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const demoRef = useRef<HTMLDivElement>(null);

  const questions = questionBank[activeKelas];
  const current = questions[qIndex];

  const handleKelasChange = (k: KelasKey) => {
    setActiveKelas(k);
    setQIndex(0);
    setAnswers(Array(10).fill(null));
    setShowResult(false);
    setRevealed(false);
    window.location.hash = "demo";
    demoRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const score = answers.filter((a, i) => a === questions[i].kunci).length;
  const percent = Math.round((score / 10) * 100);

  const waLink = (k: KelasKey | string) => {
    const text = `Halo MRH Saya sudah coba demo ${k} di /free, mau paket BSJ-${k} Rp17.000 900 soal KurMer 2025. Minta kode voucher ya!`;
    return `https://wa.me/6281770220059?text=${encodeURIComponent(text)}`;
  };

  const handleAnswer = (idx: number) => {
    if (revealed) return;
    const copy = [...answers];
    copy[qIndex] = idx;
    setAnswers(copy);
    setRevealed(true);
    setTimeout(() => {
      if (qIndex < 9) {
        setQIndex(qIndex + 1);
        setRevealed(false);
      } else {
        setShowResult(true);
      }
    }, 1200);
  };

  const resetDemo = () => {
    setQIndex(0);
    setAnswers(Array(10).fill(null));
    setShowResult(false);
    setRevealed(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFEF5] text-[#0E2A6B] font-sans antialiased">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&display=swap');*{font-family:'Plus Jakarta Sans',system-ui,sans-serif}.shadow-soft{box-shadow:0 8px 30px rgba(14,42,107,0.08)}.shadow-orange{box-shadow:0 10px 24px rgba(255,140,0,0.25)}`}</style>

      {/* Header */}
      <div className="w-full bg-[#0E2A6B] text-white text-[11px] py-2 px-4 flex justify-center items-center gap-2">
        <span className="bg-white/10 px-3 py-1 rounded-full">🔥 FREE DEMO - 10 Soal Gratis SD1-SD6 - KurMer 2025</span>
      </div>

      <header className="max-w-[960px] mx-auto px-5 py-6 text-center">
        <img src="/logo-nrh-transparan.png" alt="MRH" className="w-[180px] mx-auto" />
        <h1 className="mt-6 text-[26px] md:text-[32px] font-extrabold leading-[1.1]">Demo Gratis 10 Soal<br /><span className="text-[#1E5BFF]">Bimbel Super Juara</span> <span className="text-[#FF8C00]">SD1-SD6</span></h1>
        <p className="mt-3 text-[13px] opacity-70 max-w-[600px] mx-auto">Ini halaman khusus <b>/free</b> - Coba 10 soal per kelas langsung di web ini. Soal sudah KurMer 2025 final, sama dengan yang ada di landing utama <b>src/app/page.tsx</b>. Tidak mengurangi 900 soal paket berbayar.</p>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {kelasList.map((k)=>(
            <button key={k} onClick={()=>handleKelasChange(k)} className={`px-4 py-2 rounded-full text-[13px] font-bold border transition ${activeKelas===k ? "bg-[#FF8C00] text-white border-[#FF8C00] shadow-orange" : "bg-white text-[#0E2A6B] border-black/10 hover:border-black/20"}`}>
              {activeKelas===k ? "● " : ""}{k} - Demo 10 Soal
            </button>
          ))}
        </div>
      </header>

      {/* Demo Live */}
      <section ref={demoRef} id="demo" className="max-w-[960px] mx-auto px-5 pb-10">
        <div className="bg-white rounded-[24px] border border-black/5 shadow-soft p-5 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0E2A6B] text-white flex items-center justify-center font-black text-[12px]">{activeKelas}</div>
              <div>
                <div className="font-black text-[14px]">Demo {activeKelas} - 10 Soal KurMer 2025</div>
                <div className="text-[11px] opacity-60">{current.mapel} • {current.bab} • Soal {qIndex+1}/10</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] opacity-60">Skor</div>
              <div className="font-black text-[20px]">{percent}%</div>
            </div>
          </div>

          <div className="mt-4 w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
            <div className="h-full bg-[#1E5BFF] transition-all" style={{ width: `${((qIndex+1)/10)*100}%` }} />
          </div>

          <div className="mt-6 grid md:grid-cols-[1.3fr_0.7fr] gap-6">
            <div className="bg-[#FFFEF5] rounded-2xl border p-4">
              <h3 className="font-bold text-[15px] leading-snug">{qIndex+1}. {current.soal}</h3>
              <div className="mt-1 text-[11px] opacity-60">{current.mapel} - {current.bab}</div>

              <div className="mt-4 grid gap-2">
                {current.options.map((opt, i)=>{
                  const isSelected = answers[qIndex]===i;
                  const isCorrect = i===current.kunci;
                  const showAns = revealed;
                  return (
                    <button key={i} onClick={()=>handleAnswer(i)} className={`text-left rounded-xl border p-3 text-[13px] font-medium transition ${showAns ? (isCorrect ? "bg-emerald-50 border-emerald-400 text-emerald-800" : isSelected ? "bg-rose-50 border-rose-400 text-rose-800" : "bg-white border-black/5 opacity-60") : "bg-white border-black/5 hover:border-[#1E5BFF]/30"}`}>
                      <span className="font-black mr-2">{String.fromCharCode(65+i)}.</span>{opt} {showAns && isCorrect && "✅"} {showAns && isSelected && !isCorrect && "❌"}
                    </button>
                  );
                })}
              </div>

              {revealed && (
                <div className={`mt-4 rounded-xl p-3 text-[12px] border ${answers[qIndex]===current.kunci ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-amber-50 border-amber-200 text-amber-800"}`}>
                  <div className="font-black">{answers[qIndex]===current.kunci ? "🎉 Benar!" : "💡 Penjelasan:"}</div>
                  <div className="mt-1 leading-relaxed">{current.penjelasan}</div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-[#0E2A6B] text-white rounded-2xl p-5">
                <div className="text-[11px] tracking-widest opacity-60 font-bold">SKOR DEMO {activeKelas}</div>
                <div className="mt-1 text-[36px] font-black">{percent}%</div>
                <div className="text-[12px] opacity-80">Benar {score}/10 soal</div>
                <div className="mt-4 grid grid-cols-10 gap-1">
                  {answers.map((a,i)=>(
                    <div key={i} className={`h-2 rounded-full ${a===null ? "bg-white/20" : a===questionBank[activeKelas][i].kunci ? "bg-emerald-400" : "bg-rose-400"}`} />
                  ))}
                </div>

                {showResult && (
                  <div className="mt-5 bg-white text-[#0E2A6B] rounded-xl p-4 text-center">
                    <div className="font-black text-[14px]">{percent>=70 ? "🔥 Keren! Lanjut 900 Soal?" : "💪 Semangat! Coba 900 Soal Lengkap"}</div>
                    <div className="text-[11px] opacity-60 mt-1">Demo {activeKelas} selesai - Skor {percent}%</div>
                    <div className="mt-3 grid gap-2">
                      <a href={waLink(activeKelas)} target="_blank" rel="noopener" className="bg-[#FF8C00] text-white rounded-full px-4 py-2.5 text-[12px] font-black text-center">Ambil 900 Soal {activeKelas} - Rp17rb</a>
                      <button onClick={resetDemo} className="bg-black/5 rounded-full px-4 py-2.5 text-[12px] font-bold">Ulang Demo {activeKelas}</button>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white border rounded-2xl p-4">
                <div className="font-bold text-[12px]">Alur Setelah Demo</div>
                <ul className="mt-2 space-y-1.5 text-[11px] opacity-70 leading-relaxed">
                  <li>✅ Demo 10 soal di /free ini GRATIS, tidak mengurangi 900 soal</li>
                  <li>✅ Klik "Ambil 900 Soal" → WA Admin 081770220059</li>
                  <li>✅ Bayar DANA Rp17rb → Dapat Kode Voucher SD1-SD6</li>
                  <li>✅ Masuk /soal/[kelas] → Soal sesuai kelas → Score real-time</li>
                  <li>✅ Pantauan ortu real-time di dashboard</li>
                </ul>
                <a href="/" className="mt-3 inline-block text-[11px] font-bold text-[#1E5BFF] underline">← Kembali ke Landing Utama</a>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing mini untuk free */}
        <div className="mt-6 bg-white rounded-[20px] border p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FF8C00] flex items-center justify-center font-black text-white">!</div>
            <div>
              <div className="font-black text-[13px]">Suka Demo {activeKelas} Ini?</div>
              <div className="text-[11px] opacity-60">900 Soal KurMer 2025 / kelas cuma Rp17.000 - 5 Mapel Wajib - Score + Penjelasan</div>
            </div>
          </div>
          <a href={waLink(activeKelas)} target="_blank" rel="noopener" className="rounded-full bg-[#0E2A6B] text-white font-black px-6 py-3 text-[12px] whitespace-nowrap">Ambil Paket {activeKelas} →</a>
        </div>
      </section>

      <footer className="bg-[#0E2A6B] text-white mt-6">
        <div className="max-w-[960px] mx-auto px-5 py-6 flex flex-col md:flex-row justify-between gap-3 text-[11px] opacity-60">
          <div>© 2026 MRH Bimbel Super Juara - Demo Free /free - 10 Soal Gratis SD1-SD6 KurMer 2025</div>
          <div className="flex gap-3">
            <a href="/" className="underline">Landing Utama</a>
            <a href="https://wa.me/6281770220059" target="_blank" rel="noopener" className="underline">wa.me/6281770220059</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
