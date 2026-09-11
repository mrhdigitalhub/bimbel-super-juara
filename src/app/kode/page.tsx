export const dynamic = 'force-dynamic'
"use client"
import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

function KodeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlCode = searchParams.get("code") || ""
  const [kode, setKode] = useState(urlCode)
  const [hpOrtu, setHpOrtu] = useState("")
  const [hpAnak, setHpAnak] = useState("")
  const [nama, setNama] = useState("")
  const [durasi, setDurasi] = useState(90)
  const [loading, setLoading] = useState(false)

  useEffect(()=>{ if(urlCode) setKode(urlCode) },[urlCode])

  useEffect(()=>{
    if(!kode) return
    // baca durasi real dari DB
    supabase.from("kode_akses").select("durasi_hari,created_at,expired_at").eq("kode", kode.trim().toUpperCase()).maybeSingle().then(({data})=>{
      if(!data) return
      let d = (data as any).durasi_hari
      if(!d && data.created_at && data.expired_at) d = Math.round((new Date(data.expired_at).getTime()-new Date(data.created_at).getTime())/86400000)
      if(d) setDurasi(d)
      console.log("durasi DB:", d, data) // cek di F12
    })
  },[kode])

  const handleAktifkan = async () => {
    if(!hpOrtu ||!hpAnak ||!nama) return alert("Lengkapi HP Ortu, HP Anak, Nama!")
    setLoading(true)
    const { error } = await supabase.from("kode_akses").update({ status: "TERPAKAI", hp_ortu: hpOrtu, hp_anak: hpAnak, nama_anak: nama, used_at: new Date().toISOString() }).eq("kode", kode.toUpperCase())
    if(error) { alert(error.message); setLoading(false); return }
    localStorage.setItem("bsj_aktif_code", kode.toUpperCase())
    localStorage.setItem("bsj_durasi", String(durasi))
    localStorage.setItem("bsj_nama", nama)
    // FLOW: habis aktivasi masuk ke /soal
    router.push("/soal")
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex justify-center py-3"><span className="border border-yellow-400 text-yellow-400 px-4 py-1 rounded-full text-xs">PREMIUM {durasi} HARI</span></div>
      <div className="max-w-[420px] mx-auto mt-6 border border-yellow-500 rounded-2xl p-5">
        <h2 className="text-yellow-400 font-bold">AKTIFKAN KARTU PREMIUM</h2>
        <p className="text-gray-400 text-xs mb-4">Aktif {durasi} hari - kode: {kode}</p>
        <input value={kode} onChange={e=>setKode(e.target.value.toUpperCase())} className="w-full bg-zinc-900 border border-yellow-500/50 rounded-xl p-3 mb-3 text-yellow-400"/>
        <input placeholder="HP ORANG TUA" value={hpOrtu} onChange={e=>setHpOrtu(e.target.value)} className="w-full bg-zinc-900 border rounded-xl p-3 mb-3"/>
        <input placeholder="HP ANAK (YANG BELAJAR)" value={hpAnak} onChange={e=>setHpAnak(e.target.value)} className="w-full bg-zinc-900 border border-green-500/50 rounded-xl p-3 mb-3"/>
        <input placeholder="NAMA ANAK" value={nama} onChange={e=>setNama(e.target.value)} className="w-full bg-zinc-900 border rounded-xl p-3 mb-4"/>
        <button onClick={handleAktifkan} disabled={loading} className="w-full bg-yellow-400 text-black font-black py-4 rounded-xl">{loading? "PROSES...":`🚀 AKTIFKAN ${durasi} HARI`}</button>
      </div>
    </div>
  )
}
export default function Page(){ return <Suspense fallback={<div className="bg-black text-yellow-400 min-h-screen flex items-center justify-center">Loading...</div>}><KodeContent/></Suspense> }