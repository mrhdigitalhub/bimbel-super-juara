export const dynamic = 'force-dynamic';

export default function Page({ params }: { params: { kelas: string } }) {
  const kelas = params.kelas;
  return (
    <div style={{padding:24,maxWidth:800,margin:'0 auto'}}>
      <h1 style={{fontSize:22,fontWeight:'bold',textTransform:'uppercase',marginBottom:16}}>
        {kelas} - Pilih Mapel
      </h1>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
        {[
          {m:"Matematika",c:"#ffedd5"},
          {m:"IPAS",c:"#dcfce7"},
          {m:"Bahasa Indonesia",c:"#dbeafe"},
          {m:"PPKN",c:"#f3e8ff"},
          {m:"Seni",c:"#fef9c3"},
        ].map(item=>(
          <a
            key={item.m}
            href={`/soal/${kelas}/latihan?mapel=${encodeURIComponent(item.m)}&bab=1`}
            style={{border:'2px solid #ccc',padding:20,borderRadius:12,textAlign:'center',fontWeight:'bold',background:item.c,textDecoration:'none',color:'black'}}
          >
            {item.m}<br/><small>BAB 1-10 - 30 Soal</small>
          </a>
        ))}
      </div>
      <p style={{marginTop:20,fontSize:12,color:'#666'}}>STEP2 OK - kelas: {kelas}</p>
    </div>
  );
}