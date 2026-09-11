"use client"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function KodePage() {
  const searchParams = useSearchParams()
  const urlCode = searchParams.get("code") || ""

  const [kode, setKode] = useState(urlCode)
  const [hpOrtu, setHpOrtu] = useState("081770220059")
  const [hpAnak, setHpAnak] = useState("")
  const [nama, setNama] = useState("")

  const [durasi, setDurasi] = useState<number>(90) // default kalau kode tidak ketemu
  const [loadingDurasi, setLoadingDurasi] = useState(false)

  // 1. AMBIL DURASI ASLI DARI kode_akses
  useEffect(() => {
    if (!kode) return
    const fetchDurasi = async () => {
      setLoadingDurasi(true)
      const { data } = await supabase
       .from("kode_akses")
       .select("created_at,expired_at,durasi_hari,masa_aktif_hari")
       .eq("kode", kode.trim().toUpperCase())
       .maybeSingle()

      if (data) {
        let d = (data as any).durasi_hari || (data as any).masa_aktif_hari
        if (!d && data.created_at && data.expired_at) {
          d = Math.round((new Date(data.expired_at).getTime() - new Date(data.created_at).getTime()) / 86400000)
        }
        if (d && d > 0) setDurasi(d)
      }
      setLoadingDurasi(false)
    }
    fetchDurasi()
  }, [kode])

  useEffect(() => { if (urlCode) setKode(urlCode) }, [urlCode])

  const handleAktifkan = () => {
    // validasi fix biar tidak error "HP Anak wajib diisi" padahal sudah diisi
    if (!kode.trim() ||!hpOrtu.trim() ||!hpAnak.trim() ||!nama.trim()) {
      alert("Lengkapi semua field! HP Anak wajib diisi!")
      return
    }
    //... lanjutkan proses aktivasi kamu yang lama...
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="flex justify-center py-3 border-b border-yellow-500">
        <span className="border border-yellow-400 text-yellow-400 px-4 py-1 rounded-full text-xs">
          PREMIUM {loadingDurasi? "..." : `${durasi} HARI`}
        </span>
      </div>

      <div className="max-w-[420px] mx-auto mt-6 border border-yellow-500 rounded-2xl p-5">
        <h2 className="text-yellow-400 font-bold">🎫 AKTIFKAN KARTU PREMIUM</h2>
        <p className="text-gray-400 text-xs mb-4">
          Aktif {durasi} hari - Masukkan kode di kartu gold Anda
        </p>

        <label className="text-yellow-500 text-[11px]">KODE VOUCHER *</label>
        <input value={kode} onChange={e=>setKode(e.target.value.toUpperCase())}
          className="w-full bg-zinc-900 border border-yellow-500/50 rounded-xl p-3 mb-3 text-yellow-400"/>

        <label className="text-yellow-500 text-[11px]">HP ORANG TUA (WA) *</label>
        <input value={hpOrtu} onChange={e=>setHpOrtu(e.target.value)}
          className="w-full bg-zinc-900 border border-yellow-500/50 rounded-xl p-3 mb-3 text-white"/>

        <label className="text-green-400 text-[11px]">HP ANAK (YANG BELAJAR) *</label>
        <input value={hpAnak} onChange={e=>setHpAnak(e.target.value)}
          className="w-full bg-zinc-900 border border-green-500/50 rounded-xl p-3 mb-1 text-white"/>
        <p className="text-green-500 text-[10px] mb-3">* HP ini yang dipakai anak untuk login belajar</p>

        <label className="text-yellow-500 text-[11px]">NAMA ANAK *</label>
        <input value={nama} onChange={e=>setNama(e.target.value)}
          className="w-full bg-zinc-900 border border-yellow-500/50 rounded-xl p-3 mb-4 text-white"/>

        <button onClick={handleAktifkan}
          className="w-full bg-yellow-400 text-black font-black py-4 rounded-xl">
          🚀 AKTIFKAN {durasi} HARI
        </button>
        <p className="text-gray-500 text-[10px] text-center mt-2">
          Kode hangus setelah 1x pakai - Aktif {durasi} hari - Ketik DEMO untuk test
        </p>
      </div>
    </div>
  )
}