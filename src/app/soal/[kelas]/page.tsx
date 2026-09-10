"use client";
import { useParams } from "next/navigation";
const MAPEL = [
  {slug:"PAI", nama:"PAI & Budi Pekerti"},
  {slug:"BINDO", nama:"Bahasa Indonesia"},
  {slug:"MTK", nama:"Matematika"},
  {slug:"PPKN", nama:"PPKN"},
  {slug:"IPAS", nama:"IPAS"},
];
export default function Page(){
  const params=useParams() as any;
  const kelas = params.kelas || "bsj-sd1";
  return (
    <div style={{padding:24,maxWidth:800,margin:'0 auto'}}>
      <h1 style={{fontSize:20,fontWeight:900}}>{String(kelas).toUpperCase()} - 5 Mapel</h1>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:20}}>
        {MAPEL.map(m=>(
          <a key={m.slug} href={`/soal/${kelas}/latihan?mapel=${m.slug}&bab=1`} style={{border:'2px solid #f97316',padding:20,borderRadius:16,textAlign:'center',fontWeight:700,background:'#fff'}}>
            {m.nama}<br/><small>BAB 1-6</small>
          </a>
        ))}
      </div>
    </div>
  );
}