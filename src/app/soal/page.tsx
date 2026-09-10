export const dynamic = 'force-dynamic';
export default function Page(){
  return (
    <div style={{padding:24,maxWidth:800,margin:'0 auto'}}>
      <h1 style={{fontSize:24,fontWeight:'bold',marginBottom:16}}>Pilih Kelas - Bimbel Super Juara</h1>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        {["bsj-sd1","bsj-sd2","bsj-sd3","bsj-sd4","bsj-sd5","bsj-sd6"].map(k=>(
          <a key={k} href={`/soal/${k}`} style={{border:'2px solid orange',padding:20,borderRadius:12,textAlign:'center',fontWeight:'bold',textDecoration:'none',color:'black',background:'#fff7ed'}}>
            {k.toUpperCase()}<br/><small>30 Soal / Bab</small>
          </a>
        ))}
      </div>
    </div>
  );
}