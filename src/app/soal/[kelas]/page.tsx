"use client";
import { useParams } from "next/navigation";
export default function Page(){
  const params=useParams() as any;
  const kelasRaw=params.kelas;
  const kelas = kelasRaw && kelasRaw!=="undefined"? kelasRaw : "bsj-sd1";
  return (
    <div style={{padding:24,maxWidth:800,margin:'0 auto'}}>
      <h1 style={{fontSize:20,fontWeight:'900',textTransform:'uppercase'}}>{kelas} - Pilih Mapel</h1>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:20}}>
        {["Matematika","IPAS","Bahasa Indonesia","PPKN","Seni"].map(m=>(
          <a key={m} href={`/soal/${kelas}/latihan?mapel=${encodeURIComponent(m)}&bab=1`} style={{border:'1px solid #ddd',padding:20,borderRadius:16,textAlign:'center',fontWeight:'700',background:'#fff'}}>{m}<br/><small>BAB 1 - 30 Soal</small></a>
        ))}
      </div>
      <a href="/soal" style={{display:'inline-block',marginTop:20,background:'#eee',padding:'8px 16px',borderRadius:8}}>← Kelas</a>
    </div>
  );
}