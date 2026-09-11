import { createClient } from '@/lib/supabase'
import QuizAutoNext from '@/components/QuizAutoNext'

export default async function QuizPage({ params }: { params: { kelas: string, mapel: string, bab: string } }) {
  const supabase = createClient()
  const { data: soal, error } = await supabase
    .from('soal')
    .select('*')
    .eq('kelas', params.kelas)
    .eq('mapel', decodeURIComponent(params.mapel))
    .eq('bab_ke', parseInt(params.bab))
    .order('no_urut', { ascending: true })

  if (error || !soal || soal.length === 0) {
    return <div className="p-10 text-center">Soal tidak ditemukan untuk {params.kelas} - {params.mapel} - BAB {params.bab}</div>
  }

  return <QuizAutoNext soal={soal} kelas={params.kelas} mapel={params.mapel} bab={params.bab} />
}
