export const dynamic = 'force-dynamic';

export default function Page({ params, searchParams }: { params: { kelas: string }, searchParams: { mapel?: string, bab?: string } }) {
  const kelas = params.kelas;
  const mapel = searchParams?.mapel || "Matematika";
  const bab = searchParams?.bab || "1";
  
  return (
    <div style={{padding:24,maxWidth:800,margin:'0 auto'}}>
      <h1 style={{fontSize:20,fontWeight:'bold'}}>LATIHAN {kelas.toUpperCase()} - {mapel} - BAB {bab}</h1>
      <div style={{marginTop:16,padding:16,background:'#f0f9ff',borderRadius:12,border:'1px solid #bae6fd'}}>
        <p>✅ File C berhasil! - Kelas: {kelas} | Mapel: {mapel} | Bab: {bab}</p>
        <p style={{fontSize:12,marginTop:8}}>STEP 3 OK - Selanjutnya kita isi 30 soal V4 full (15 PG + 8 Singkat + 7 Uraian)</p>
      </div>
      <a href={`/soal/${kelas}`} style={{display:'inline-block',marginTop:16,padding:'8px 16px',background:'orange',color:'white',borderRadius:8,textDecoration:'none'}}>← Kembali Pilih Mapel</a>
    </div>
  );
}