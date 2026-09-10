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
      <h1 style={{fontSize:20,fontWeight:900,textTransform:'uppercase'}}>{String(kelas).toUpperCase()} - 5 MAPEL INTI</h1>
      <p style={{fontSize:12,color:'#666'}}>FIX SLUG - Tanpa karakter & - Anti SOAL BELUM ADA</p>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:20}}>
        {MAPEL.map(m=>(
          <a key={m.slug} href={`/soal/${kelas}/latihan?mapel=${m.slug}&bab=1`} style={{border:'2px solid #f97316',padding:20,borderRadius:16,textAlign:'center',fontWeight:700,background:'#fff',display:'block'}}>
            {m.nama}<br/><small style={{color:'#888'}}>{m.slug} - BAB 1-6 - 30 Soal/BAB</small>
          </a>
        ))}
      </div>
      <div style={{marginTop:20,padding:12,background:'#f0fdf4',borderRadius:8,fontSize:12}}>
        <b>URL BENAR:</b> ?mapel=PAI&bab=1 (pakai &)<br/>
        <b>URL SALAH kemarin:</b> ?mapel=PAI/bab=1 (pakai /) → Jadi SOAL BELUM ADA
      </div>
      <a href="/soal" style={{display:'inline-block',marginTop:20,background:'#eee',padding:'8px 16px',borderRadius:8}}>← Kelas</a>
    </div>
  );
}
