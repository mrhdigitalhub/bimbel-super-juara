"use client";
export default function Page(){
  const kelasList=["bsj-sd1","bsj-sd2","bsj-sd3","bsj-sd4","bsj-sd5","bsj-sd6"];
  return <div style={{padding:24,maxWidth:800,margin:'0 auto'}}>
    <h1 style={{fontSize:22,fontWeight:'900'}}>Pilih Kelas - Bimbel Super Juara</h1>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginTop:20}}>
      {kelasList.map(k=><a key={k} href={`/soal/${k}`} style={{border:'2px solid #f97316',padding:20,borderRadius:16,textAlign:'center',fontWeight:'800',background:'#fff'}}>{k.toUpperCase()}</a>)}
    </div>
  </div>;
}