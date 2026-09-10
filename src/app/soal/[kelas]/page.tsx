export const dynamic = 'force-dynamic';
export default function Page({ params }: { params: { kelas: string } }) {
  const kelas = params.kelas;
  return (
    <div style={{padding:24,maxWidth:800,margin:'0 auto'}}>
      <h1 style={{fontSize:22,fontWeight:'bold',textTransform:'uppercase'}}>{kelas} - Pilih Mapel</h1>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:20}}>
        {["Matematika","IPAS","Bahasa Indonesia","PPKN","Seni"].map(m=>(
          <a key={m} href={`/soal/${kelas}/latihan?mapel=${m}&bab=1`} style={{border:'1px solid #ddd',padding:20,borderRadius:12,textAlign:'center',fontWeight:'bold'}}>{m}<br/><small>30 Soal</small></a>
        ))}
      </div>
    </div>
  );
}