import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const kelas = searchParams.get('kelas')
  const mapel = searchParams.get('mapel')
  const bab = searchParams.get('bab')

  if (!kelas || !mapel || !bab) {
    return NextResponse.json({ soal: [] })
  }

  const { data, error } = await supabase
    .from('soal')
    .select('*')
    .eq('kelas', kelas)
    .eq('mapel', mapel)
    .eq('bab', Number(bab))
    .order('nomor', { ascending: true })
    .limit(30)

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ soal: [], error: error.message })
  }

  // Format Supabase -> format latihan/page.tsx
  const soal = (data || []).map((row: any) => ({
    no: row.nomor,
    tipe: row.tipe || 'PG',
    tanya: row.pertanyaan,
    opsi: [row.opsi_a, row.opsi_b, row.opsi_c, row.opsi_d].filter(Boolean),
    kunci: row.jawaban_benar,
    pembahasan: row.pembahasan || ''
  }))

  return NextResponse.json({ soal })
}