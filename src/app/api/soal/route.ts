import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

const MAPEL_MAP: Record<string, string[]> = {
  'PAI': ['Pendidikan Agama & Budi Pekerti', 'PAI & Budi Pekerti', 'PAI'],
  'BINDO': ['Bahasa Indonesia', 'BINDO'],
  'Bahasa Indonesia': ['Bahasa Indonesia', 'BINDO'],
  'MTK': ['Matematika', 'MTK'],
  'Matematika': ['Matematika', 'MTK'],
  'PPKN': ['Pendidikan Pancasila', 'PPKN'], // <-- FIX INI BOS! TAMBAH PPKN
  'Pendidikan Pancasila': ['Pendidikan Pancasila', 'PPKN'], // <-- FIX INI JUGA
  'IPAS': ['IPAS'],
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const kelas = searchParams.get('kelas')
  let mapel = searchParams.get('mapel')
  const bab = searchParams.get('bab')

  if (!kelas ||!mapel ||!bab) {
    return NextResponse.json({ soal: [] })
  }

  const babNum = Number(bab)
  const mapelList = MAPEL_MAP[mapel] || [mapel]

  const { data, error } = await supabase
  .from('soal')
  .select('*')
  .eq('kelas', kelas)
  .in('mapel', mapelList)
  .eq('bab_ke', babNum)
  .order('no_urut', { ascending: true })
  .limit(30)

  if (error) {
    return NextResponse.json({ soal: [], error: error.message })
  }

  const soal = (data || []).map((row: any) => ({
    no: row.no_urut,
    tipe: row.tipe_soal || 'PG',
    tanya: row.pertanyaan,
    opsi: [row.opsi_a, row.opsi_b, row.opsi_c, row.opsi_d].filter(Boolean),
    kunci: row.jawaban || row.jawaban_isian || row.kunci_essay,
    pembahasan: row.pembahasan || '',
    nama_bab: row.nama_bab,
  }))

  return NextResponse.json({ soal })
}