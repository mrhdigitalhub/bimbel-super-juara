"use client"
import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function KodeContent() {
  const searchParams = useSearchParams()
  const urlCode = searchParams.get("code") || ""

  const [kode, setKode] = useState(urlCode)
  const [hpOrtu, setHpOrtu] = useState("")
  const [hpAnak, setHpAnak] = useState("")
  const [nama, setNama] = useState("")
  const [durasi, setDurasi] = useState<number>(90)
  const [loadingDurasi, setLoadingDurasi] = useState(false)

  useEffect(() => {
    if (!urlCode) return
    setKode(urlCode)
  }, [urlCode])

  useEffect(() => {
    if (!kode || kode.length < 5) return
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
        if (d) setDurasi(d)
      }
      setLoadingDurasi(false)
    }
    fetchDurasi()
  }, [kode])

  return (
    <div className="min-h-screen bg-black">
      <div className="flex justify-center py-3 border-b border-yellow-500">
        <span className="border border-yellow-400 text-yellow-400 px-4 py-1 rounded-full text-xs">
          PREMIUM {loadingDurasi? "..." : `${durasi} HARI`}
        </span>
      </div>
      <div className="max-w-[420px] mx-auto mt-6 border border-yellow-500 rounded-2xl p-5">
        <h2 className="text-yellow-400 font-bold">🎫 AKTIFKAN KARTU PREMIUM</h2>
        <p className="text-gray-400 text-xs mb-4">Aktif {durasi} hari - kode: {kode || "-"}</p>

        <label className="text-yellow-500 text-[11px]">KODE VOUCHER *</label>
        <input value={kode} onChange={e=>setKode(e.target.value.toUpperCase())}
          className="w-full bg-zinc-900 border border-yellow-500/50 rounded-xl p-3 mb-3 text-yellow-400" placeholder="BSJ-SD1-XXXX"/>

        <label className="text-yellow-500 text-[11px]">HP ORANG TUA *</label>
        <input value={hpOrtu} onChange={e=>setHpOrtu(e.target.value)}
          className="w-full bg-zinc-900 border border-yellow-500/50 rounded-xl p-3 mb-3 text-white"/>

        <label className="text-green-400 text-[11px]">HP ANAK (YANG BELAJAR) *</label>
        <input value={hpAnak} onChange={e=>setHpAnak(e.target.value)}
          className="w-full bg-zinc-900 border border-green-500/50 rounded-xl p-3 mb-3 text-white"/>

        <label className="text-yellow-500 text-[11px]">NAMA ANAK *</label>
        <input value={nama} onChange={e=>setNama(e.target.value)}
          className="w-full bg-zinc-900 border border-yellow-500/50 rounded-xl p-3 mb-4 text-white"/>

        <button className="w-full bg-yellow-400 text-black font-black py-4 rounded-xl">
          🚀 AKTIFKAN {durasi} HARI
        </button>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-yellow-400">Loading...</div>}>
      <KodeContent />
    </Suspense>
  )
}