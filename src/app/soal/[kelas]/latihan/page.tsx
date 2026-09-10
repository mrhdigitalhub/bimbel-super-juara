// @ts-nocheck
"use client";
import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

// BANK SOAL FINAL 5 MAPEL - TANPA PJOK & SENI - KEY "1" BUKAN "BAB 1"
const BANK_SOAL: any = {
  "PAI & Budi Pekerti": {
    "1": [
      {no:1,tipe:"PG",tanya:"Rukun Iman ada berapa?",opsi:["4","5","6","7"],kunci:"C"},
      {no:2,tipe:"PG",tanya:"Rukun Iman pertama iman kepada...",opsi:["Malaikat","Allah","Rasul","Kitab"],kunci:"B"},
      {no:3,tipe:"PG",tanya:"Kitab suci umat Islam adalah...",opsi:["Injil","Taurat","Al-Quran","Zabur"],kunci:"C"},
      {no:4,tipe:"PG",tanya:"Nabi terakhir adalah...",opsi:["Nabi Isa","Nabi Musa","Nabi Muhammad SAW","Nabi Ibrahim"],kunci:"C"},
      {no:5,tipe:"PG",tanya:"Malaikat penyampai wahyu adalah...",opsi:["Mikail","Jibril","Izrail","Israfil"],kunci:"B"},
      {no:6,tipe:"PG",tanya:"Hari kiamat disebut hari...",opsi:["Kelahiran","Akhir","Awal","Libur"],kunci:"B"},
      {no:7,tipe:"PG",tanya:"Rukun Islam ada...",opsi:["4","5","6","3"],kunci:"B"},
      {no:8,tipe:"PG",tanya:"Syahadat rukun Islam ke...",opsi:["1","2","3","5"],kunci:"A"},
      {no:9,tipe:"PG",tanya:"Sholat wajib sehari ada...",opsi:["3 kali","4 kali","5 kali","6 kali"],kunci:"C"},
      {no:10,tipe:"PG",tanya:"Puasa Ramadhan hukumnya...",opsi:["Sunnah","Wajib","Makruh","Mubah"],kunci:"B"},
      {no:11,tipe:"PG",tanya:"Arah kiblat adalah...",opsi:["Masjid","Ka'bah","Rumah","Sekolah"],kunci:"B"},
      {no:12,tipe:"PG",tanya:"Sebelum sholat harus...",opsi:["Makan","Wudhu","Tidur","Bermain"],kunci:"B"},
      {no:13,tipe:"PG",tanya:"Doa sebelum makan agar...",opsi:["Kenyang","Berkah","Cepat","Banyak"],kunci:"B"},
      {no:14,tipe:"PG",tanya:"Sikap jujur disukai...",opsi:["Setan","Allah","Iblis","Jin"],kunci:"B"},
      {no:15,tipe:"PG",tanya:"Hormat orang tua hukumnya...",opsi:["Wajib","Sunnah","Haram","Makruh"],kunci:"A"},
      {no:16,tipe:"ISIAN",tanya:"Rukun Iman ke-2 iman kepada...",kunci:"malaikat"},
      {no:17,tipe:"ISIAN",tanya:"Al-Quran turun kepada Nabi...",kunci:"muhammad"},
      {no:18,tipe:"ISIAN",tanya:"Malaikat dari...",kunci:"cahaya"},
      {no:19,tipe:"ISIAN",tanya:"Sholat Subuh... rakaat",kunci:"2"},
      {no:20,tipe:"ISIAN",tanya:"Zakat fitrah bulan...",kunci:"ramadhan"},
      {no:21,tipe:"ISIAN",tanya:"Doa tidur: Bismika Allahumma...",kunci:"ahya"},
      {no:22,tipe:"ISIAN",tanya:"Akhlak ke teman...",kunci:"menghormati"},
      {no:23,tipe:"ISIAN",tanya:"Bangun Ka'bah Nabi...",kunci:"ibrahim"},
      {no:24,tipe:"URAIAN",tanya:"Sebutkan 6 Rukun Iman urut!",kunci:"rukun iman"},
      {no:25,tipe:"URAIAN",tanya:"Jelaskan wudhu!",kunci:"wudhu"},
      {no:26,tipe:"URAIAN",tanya:"Arti syahadat?",kunci:"syahadat"},
      {no:27,tipe:"URAIAN",tanya:"5 waktu sholat?",kunci:"sholat"},
      {no:28,tipe:"URAIAN",tanya:"Sikap ke orang tua?",kunci:"hormat"},
      {no:29,tipe:"URAIAN",tanya:"Kisah Nabi Nuh?",kunci:"nuh"},
      {no:30,tipe:"URAIAN",tanya:"Doa sebelum belajar?",kunci:"robbi"},
    ]
  },
  "PPKN": {
    "1": [
      {no:1,tipe:"PG",tanya:"Aturan di rumah dibuat oleh...",opsi:["Teman","Orang tua","Tetangga","Guru"],kunci:"B"},
      {no:2,tipe:"PG",tanya:"Jika mainan berantakan harus...",opsi:["Dibiarkan","Dirapikan","Dibuang","Disembunyikan"],kunci:"B"},
      {no:3,tipe:"PG",tanya:"Sebelum makan harus cuci...",opsi:["Kaki","Tangan","Rambut","Baju"],kunci:"B"},
      {no:4,tipe:"PG",tanya:"Bangun pagi harus...",opsi:["Tidur lagi","Merapikan tempat tidur","Main HP","Menangis"],kunci:"B"},
      {no:5,tipe:"PG",tanya:"Simbol sila ke-1 Pancasila adalah...",opsi:["Bintang","Rantai","Pohon Beringin","Kepala Banteng"],kunci:"A"},
      {no:6,tipe:"PG",tanya:"Pancasila artinya...",opsi:["Lima dasar","Satu dasar","Dua dasar","Tiga dasar"],kunci:"A"},
      {no:7,tipe:"PG",tanya:"Hidup rukun artinya hidup...",opsi:["Bertengkar","Damai dan saling menyayangi","Sendiri","Marah"],kunci:"B"},
      {no:8,tipe:"PG",tanya:"Jika bertengkar dengan teman harus...",opsi:["Diam","Memaafkan dan berbaikan","Memukul","Menjauh"],kunci:"B"},
      {no:9,tipe:"PG",tanya:"Gotong royong adalah kerja...",opsi:["Sendiri","Bersama-sama","Paksa","Bayar"],kunci:"B"},
      {no:10,tipe:"PG",tanya:"Contoh gotong royong di rumah...",opsi:["Membersihkan rumah bersama","Main sendiri","Tidur","Makan"],kunci:"A"},
      {no:11,tipe:"PG",tanya:"Aturan di sekolah dibuat oleh...",opsi:["Murid","Guru dan kepala sekolah","Satpam","Tukang kebun"],kunci:"B"},
      {no:12,tipe:"PG",tanya:"Datang ke sekolah harus...",opsi:["Terlambat","Tepat waktu","Tidak datang","Pulang cepat"],kunci:"B"},
      {no:13,tipe:"PG",tanya:"Seragam SD hari Senin putih...",opsi:["Biru","Merah","Kuning","Hijau"],kunci:"B"},
      {no:14,tipe:"PG",tanya:"Membuang sampah harus di...",opsi:["Lantai","Tempat sampah","Laci","Tas teman"],kunci:"B"},
      {no:15,tipe:"PG",tanya:"Jika ingin ke toilet saat pelajaran harus...",opsi:["Langsung pergi","Izin guru","Diam","Menangis"],kunci:"B"},
      {no:16,tipe:"ISIAN",tanya:"Aturan di rumah harus di...",kunci:"taati"},
      {no:17,tipe:"ISIAN",tanya:"Bintang adalah simbol sila ke...",kunci:"1"},
      {no:18,tipe:"ISIAN",tanya:"Hidup rukun membuat hati...",kunci:"senang"},
      {no:19,tipe:"ISIAN",tanya:"Gotong royong membuat pekerjaan jadi...",kunci:"ringan"},
      {no:20,tipe:"ISIAN",tanya:"Jika salah harus meminta...",kunci:"maaf"},
      {no:21,tipe:"ISIAN",tanya:"Pancasila ada... sila",kunci:"5"},
      {no:22,tipe:"ISIAN",tanya:"Sila ke-2 simbolnya...",kunci:"rantai"},
      {no:23,tipe:"ISIAN",tanya:"Toleransi artinya menghargai...",kunci:"perbedaan"},
      {no:24,tipe:"URAIAN",tanya:"Sebutkan 3 aturan di rumah!",kunci:"aturan"},
      {no:25,tipe:"URAIAN",tanya:"Apa itu hidup rukun? Beri contoh!",kunci:"rukun"},
      {no:26,tipe:"URAIAN",tanya:"Sebutkan 5 simbol Pancasila!",kunci:"pancasila"},
      {no:27,tipe:"URAIAN",tanya:"Mengapa harus gotong royong?",kunci:"gotong"},
      {no:28,tipe:"URAIAN",tanya:"Bagaimana jika teman beda agama?",kunci:"toleransi"},
      {no:29,tipe:"URAIAN",tanya:"Apa akibat tidak taat aturan?",kunci:"akibat"},
      {no:30,tipe:"URAIAN",tanya:"Buat cerita hidup rukun di sekolah!",kunci:"cerita"},
    ]
  }
};

export default function Page(){
  const params = useParams() as any;
  const search = useSearchParams() as any;
  const kelasRaw = params?.kelas;
  const kelasFix = kelasRaw && kelasRaw!=="undefined"? kelasRaw : "bsj-sd1";
  const kelas = String(kelasFix).toUpperCase();
  const mapel = search.get("mapel") || "PPKN";
  const bab = search.get("bab") || "1";
  // ANTI NYASAR - jika PPKN gak ada, jangan fallback ke PAI! Kasih pesan!
  const dataMapel = BANK_SOAL[mapel];
  const soal = dataMapel?.[bab] || dataMapel?.["1"] || [];

  return (
    <div className="min-h-screen bg-[#fffaf5] p-2">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white border rounded-xl p-3 flex justify-between mb-4">
          <h1 className="font-black text-orange-600 text-sm">{kelas} - {mapel} - BAB {bab} {soal.length===0?"(SOAL BELUM ADA)":""}</h1>
          <a href={`/soal/${kelasFix}`} className="text-xs bg-gray-100 px-3 py-1 rounded">← Mapel</a>
        </div>
        {soal.length===0? (
          <div className="bg-yellow-50 border-2 border-yellow-300 p-6 rounded-2xl text-center">
            <p className="font-bold">Soal {mapel} BAB {bab} belum dibuat!</p>
            <p className="text-sm mt-2">Bukan soal PAI lagi, tapi memang belum ada. Silakan buat dulu!</p>
          </div>
        ) : soal.map((s:any)=>(
          <div key={s.no} className="bg-white border p-4 rounded-2xl mb-3">
            <p className="font-bold text-sm"><span className="bg-orange-500 text-white px-2 rounded mr-2">{s.no}</span>[{s.tipe}] {s.tanya}</p>
            {s.tipe==="PG" && <div className="grid gap-2 mt-2">{s.opsi.map((o:string,i:number)=><label key={i} className="border p-2 rounded-lg text-sm"><input type="radio" name={`q${s.no}`}/> {["A","B","C","D"][i]}. {o}</label>)}</div>}
            {s.tipe!=="PG" && <textarea className="w-full border rounded-lg p-2 mt-2 text-sm" placeholder="Jawab..."></textarea>}
          </div>
        ))}
      </div>
    </div>
  );
}