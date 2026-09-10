"use client";
import { useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";

function Isi(){
  const params = useParams() as any;
  const search = useSearchParams();
  const kelas = params.kelas || "bsj-sd1";
  const mapel = search.get("mapel") || "Matematika";
  const bab = search.get("bab") || "1";

  const soal = Array.from({length:30},(_,i)=>{
    const no=i+1;
    const tipe = no<=15? "PG" : no<=23? "ISIAN" : "URAIAN";
    return {
      no,
      tipe,
      tanya: `Soal ${no} [${tipe}] ${mapel} BAB ${bab} - Pertanyaan kurikulum merdeka tentang materi BAB ${bab}?`,
      opsi: ["Pilihan A benar","Pilihan B","Pilihan C","Pilihan D"],
      kunci: no<=15? "A" : `jawaban ${no}`
    };
  });

  const [jawab,setJawab]=useState<Record<number,string>>({});
  const [selesai,setSelesai]=useState(false);
  const benar = soal.filter(s=> (jawab[s.no]||"").toLowerCase().trim() === s.kunci.toLowerCase().trim() || (s.tipe==="PG" && jawab[s.no]==="A")).length;
  const nilai = Math.round(benar/soal.length*100);

  if(selesai){
    return (
      <div style={{padding:24,textAlign:'center',maxWidth:600,margin:'0 auto'}}>
        <h1 style={{fontSize:28,fontWeight:'bold'}}>Nilai: {nilai}</h1>
        <p style={{marginTop:8}}>{kelas.toUpperCase()} - {mapel} - BAB {bab}</p>
        <p>{benar} benar dari 30 soal</p>
        <button onClick={()=>{setSelesai(false);setJawab({})}} style={{marginTop:16,background:'#f97316',color:'#fff',padding:'10px 20px',borderRadius:8}}>Ulangi</button>
        <a href={`/soal/${kelas}`} style={{display:'inline-block',marginLeft:8,background:'#eee',padding:'10px 20px',borderRadius:8}}>Kembali</a>
      </div>
    );
  }

  return (
    <div style={{padding:16,maxWidth:800,margin:'0 auto',fontFamily:'sans-serif'}}>
      <div style={{display:'flex',justifyContent:'space-between',borderBottom:'1px solid #ddd',paddingBottom:8,marginBottom:16}}>
        <h1 style={{fontWeight:'bold'}}>{kelas.toUpperCase()} - {mapel} - BAB {bab} - 30 SOAL</h1>
        <a href={`/soal/${kelas}`} style={{background:'#f3f4f6',padding:'4px 12px',borderRadius:8,fontSize:12}}>← Mapel</a>
      </div>
      {soal.map(s=>(
        <div key={s.no} style={{border:'1px solid #e5e7eb',padding:12,borderRadius:12,marginBottom:12,background:'#fff'}}>
          <p style={{fontWeight:'bold'}}>{s.no}. [{s.tipe}] {s.tanya}</p>
          {s.tipe==="PG"? (
            <div style={{marginTop:8,display:'grid',gap:6}}>
              {s.opsi.map((o,idx)=>{
                const h=["A","B","C","D"][idx];
                return <label key={h} style={{border:'1px solid #ddd',padding:8,borderRadius:8,background:jawab[s.no]===h?'#ffedd5':'#fff',cursor:'pointer'}}><input type="radio" name={`q${s.no}`} checked={jawab[s.no]===h} onChange={()=>setJawab({...jawab,[s.no]:h})} style={{marginRight:8}}/>{h}. {o}</label>
              })}
            </div>
          ) : (
            <input style={{marginTop:8,border:'1px solid #ddd',width:'100%',padding:8,borderRadius:8}} placeholder="Tulis jawaban..." value={jawab[s.no]||""} onChange={e=>setJawab({...jawab,[s.no]:e.target.value})}/>
          )}
        </div>
      ))}
      <button onClick={()=>setSelesai(true)} style={{width:'100%',background:'#16a34a',color:'#fff',padding:12,borderRadius:12,fontWeight:'bold'}}>KUMPULKAN - LIHAT NILAI</button>
      <p style={{fontSize:10,textAlign:'center',marginTop:8,color:'#999'}}>FINAL 30 SOAL - 1 FILE - PASTI READY</p>
    </div>
  );
}

export default function Page(){
  return <Suspense fallback={<div style={{padding:24}}>Loading...</div>}><Isi/></Suspense>;
}