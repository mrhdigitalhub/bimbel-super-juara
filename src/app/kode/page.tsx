"use client"
import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

function KodeContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const codeParam = searchParams.get("code") || ""
  
  const [kodeInput, setKodeInput] = useState(codeParam)
  const [durasi, setDurasi] = useState(30)
  const [loading, setLoading] = useState(true)
  const [hpOrtu, setHpOrtu] = useState("")
  const [hpAnak, setHpAnak] = useState("")
  const [namaAnak, setNamaAnak] = useState("")

  // AMBIL DURASI DARI DB - DINAMIS 30/60/90/365
  useEffect(() => {
    async function getDurasi() {
      if (!codeParam) { setLoading(false); return }
      const { data } = await supabase.from("kode_akses").select("durasi_hari").eq("kode", codeParam.toUpperCase()).single()
      if (data?.durasi_hari) setDurasi(data.durasi_hari)
      setLoading(false)
    }
    getDurasi()
  }, [codeParam])

  // FUNGSI DETEKSI KELAS DARI KODE - INI KUNCINYA BOS!
  const getKelasFromKode = (kode: string) => {
    const k = kode.toUpperCase()
    if (k.includes("SD1")) return "bsj-sd1"
    if (k.includes("SD2")) return "bsj-sd2"
    if (k.includes("SD3")) return "bsj-sd3"
    if (k.includes("SD4")) return "bsj-sd4"
    if (k.includes("SD5")) return "bsj-sd5"
    if (k.includes("SD6")) return "bsj-sd6"
    if (k.includes("ALL") || k.includes("SD1-SD6")) return "all"
    return "bsj-sd1" // default
  }

  const handleAktifkan = async () => {
    if (!kodeInput || !hpOrtu || !hpAnak || !namaAnak) {
      alert("Lengkapi semua data Bos!")
      return
    }
    // 1. Validasi kode di DB
    const { data: kodeData } = await supabase.from("kode_akses").select("*").eq("kode", kodeInput.toUpperCase()).single()
    if (!kodeData) { alert("Kode tidak ditemukan!"); return }
    if (kodeData.status === "TERPAKAI") { alert("Kode sudah terpakai!"); return }

    // 2. Update jadi terpakai
    await supabase.from("kode_akses").update({ 
      status: "TERPAKAI", 
      hp_ortu: hpOrtu, 
      hp_anak: hpAnak, 
      nama_anak: namaAnak,
      dipakai_at: new Date().toISOString()
    }).eq("kode", kodeInput.toUpperCase())

    // 3. Simpan ke localStorage
    localStorage.setItem("bsj_aktif", JSON.stringify({ kode: kodeInput, durasi: kodeData.durasi_hari, nama: namaAnak, kelas: getKelasFromKode(kodeInput) }))

    // 4. REDIRECT LANGSUNG KE KELAS - BUKAN KE /soal
    const kelasTujuan = getKelasFromKode(kodeInput)
    if (kelasTujuan === "all") {
      router.push("/soal") // kalau bundle baru ke list 6 kelas (Photo 1)
    } else {
      router.push(`/soal/${kelasTujuan}`) // langsung ke dashboard 30 BAB (Photo 2)
    }
  }

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="mb-6 text-xs border border-yellow-400 text-yellow-400 px-3 py-1 rounded-full">PREMIUM {durasi} HARI</div>
      <div className="bg-black border border-yellow-500/50 rounded-xl p-6 w-full max-w-sm">
        <h1 className="text-yellow-400 font-bold text-sm mb-1">AKTIFKAN KARTU PREMIUM</h1>
        <p className="text-gray-400 text-[10px] mb-4">Aktif {durasi} hari - kode: {codeParam || kodeInput}</p>
        
        <input value={kodeInput} onChange={e=>setKodeInput(e.target.value.toUpperCase())} placeholder="BSJ-SD1-XXXX" className="w-full bg-black border border-yellow-500/50 rounded-lg p-3 text-sm text-yellow-400 mb-3" />
        <input value={hpOrtu} onChange={e=>setHpOrtu(e.target.value)} placeholder="HP ORANG TUA" className="w-full bg-black border border-gray-600 rounded-lg p-3 text-sm text-white mb-3" />
        <input value={hpAnak} onChange={e=>setHpAnak(e.target.value)} placeholder="HP ANAK (YANG BELAJAR)" className="w-full bg-black border border-green-500/50 rounded-lg p-3 text-sm text-white mb-3" />
        <input value={namaAnak} onChange={e=>setNamaAnak(e.target.value)} placeholder="NAMA ANAK" className="w-full bg-black border border-gray-600 rounded-lg p-3 text-sm text-white mb-4" />
        
        <button onClick={handleAktifkan} className="w-full bg-yellow-400 text-black font-bold py-3 rounded-lg text-sm">🚀 AKTIFKAN {durasi} HARI</button>
        <p className="text-[10px] text-gray-500 mt-3 text-center">Langsung masuk kelas {getKelasFromKode(kodeInput).toUpperCase()} - tanpa pilih kelas lagi</p>
      </div>
    </div>
  )
}

export default function KodePage(){
  return <Suspense fallback={<div className="min-h-screen bg-black"/>}><KodeContent/></Suspense>
}
