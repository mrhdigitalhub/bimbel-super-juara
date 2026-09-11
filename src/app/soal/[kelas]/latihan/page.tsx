// src/app/soal/[kelas]/latihan/page.tsx - FIX VERCEL ERROR
import { supabase } from '@/lib/supabase'
import LatihanClient from './LatihanClient'

export default async function Page({ 
  params, 
  searchParams 
}: { 
  params: { kelas: string }, 
  searchParams: { mapel: string, bab: string } 
}) {
  const kelas = params.kelas
  const mapel = searchParams.mapel
  const bab = parseInt(searchParams.bab)

  const { data: soal } = await supabase
    .from('soal')
    .select('*')
    .eq('kelas', kelas)
    .eq('mapel', mapel)
    .eq('bab_ke', bab)
    .order('no_urut', { ascending: true })

  if (!soal || soal.length === 0) {
    return <div className="p-10 text-center">Soal tidak ditemukan {kelas} {mapel} BAB {bab}</div>
  }

  return <LatihanClient soal={soal} kelas={kelas} mapel={mapel} bab={bab} />
}
