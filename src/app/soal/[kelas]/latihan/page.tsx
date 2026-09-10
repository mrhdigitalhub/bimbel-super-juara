export const dynamic = 'force-dynamic';
export default function Page({ params, searchParams }: { params: { kelas: string }, searchParams: { mapel?: string, bab?: string } }) {
  const kelas = params.kelas;
  const mapel = searchParams?.mapel || "Matematika";
  const bab = searchParams?.bab || "1";
  return (
    <div style={{padding:24,maxWidth:800,margin:'0 auto',fontFamily:'sans-serif'}}>
      <h1 style={{fontSize:20,fontWeight:'bold'}}>LATIHAN {kelas.toUpperCase()} - {mapel} - BAB {bab}</h1>
      <p style={{marginTop:12}}>Sistem latihan 30 soal siap. Versi minimal Ready 18s!</p>
      <div style={{marginTop:20,display:'grid',gap:12}}>
        {[1,2,3].map(n=><div key={n} style={{border:'1px solid #ddd',padding:12,borderRadius:8}}>Soal {n} - {mapel} BAB {bab} - Contoh soal...</div>)}
      </div>
      <a href={`/soal/${kelas}`} style={{display:'inline-block',marginTop:20,background:'#eee',padding:'8px 16px',borderRadius:8}}>Kembali Pilih Mapel</a>
    </div>
  );
}