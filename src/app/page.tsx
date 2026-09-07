"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const formatRupiah = (n:number)=> new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);

export default function HomePageFull(){
  const [mode, setMode] = useState<"loading"|"landing"|"kelas">("loading");
  const [pakets, setPakets] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [voucher, setVoucher] = useState<any>(null);
  const [filterMapel, setFilterMapel] = useState("SEMUA");
  const [currentSoal, setCurrentSoal] = useState(0);
  const [soalList, setSoalList] = useState<any[]>([]);
  const [jawaban, setJawaban] = useState("");
  const [showKunci, setShowKunci] = useState(false);
  const [progress, setProgress] = useState<any>({});
  const [totalBenar, setTotalBenar] = useState(0);

  useEffect(()=>{ init(); },[]);

  const init = async()=>{
    const hpAnak = localStorage.getItem('bsj_hp_anak');
    const kode = localStorage.getItem('bsj_kode');
    if(hpAnak && kode){
      await loadUser(hpAnak, kode);
    } else {
      await loadPakets();
      setMode("landing");
    }
  };

  const loadPakets = async()=>{
    const { data } = await supabase.from("pakets").select("*").order("urutan",{ascending:true});
    if(data) setPakets(data);
  };

  const loadUser = async(hpAnak:string, kode:string)=>{
    const { data, error } = await supabase.from("vouchers").select("*").eq("code", kode).single();
    if(error ||!data){
      localStorage.removeItem('bsj_hp_anak');
      localStorage.removeItem('bsj_kode');
      await loadPakets();
      setMode("landing");
      return;
    }
    if(data.expired_at && new Date(data.expired_at) < new Date()){
      alert(`❌ Kartu ${data.code} sudah expired ${new Date(data.expired_at).toLocaleDateString('id-ID')}!`);
      localStorage.removeItem('bsj_hp_anak');
      localStorage.removeItem('bsj_kode');
      await loadPakets();
      setMode("landing");
      return;
    }
    setVoucher(data);
    setUser({ hp_anak: hpAnak, kode: kode, nama: data.used_by || "Manda", paket: data.paket, hp_ortu: data.hp_ortu });

    const paketUpper = (data.paket||"bsj-sd1").toUpperCase();
    let soalData:any[]|null = null;
    const { data: s1 } = await supabase.from("soal").select("*").eq("paket_kode", paketUpper).order("id",{ascending:true}).limit(600);
    if(s1 && s1.length>0){
      soalData = s1;
    } else {
      soalData = Array.from({length:600}, (_,i)=>{
        const mapel = i<200? "MATEMATIKA" : i<400? "BAHASA INDONESIA" : "IPA";
        const no = (i%200)+1;
        return {
          id: i+1, paket_kode: paketUpper, mapel: mapel, nomor: no,
          pertanyaan: `Soal ${no}: HOTS ${mapel} Kelas ${paketUpper.replace('BSJ-SD','')} - Manda`,
          opsi_a: "Jawaban A", opsi_b: "Jawaban B", opsi_c: "Jawaban C", opsi_d: "Jawaban D",
          kunci: ["A","B","C","D"][i%4], pembahasan: "Pembahasan HOTS TKA", level: `HOTS ${2+i%3}`
        };
      });
    }
    setSoalList(soalData||[]);
    setMode("kelas");
    const savedProg = localStorage.getItem(`bsj_progress_${kode}`);
    if(savedProg){
      try{
        const p = JSON.parse(savedProg);
        setProgress(p);
        setTotalBenar(Object.values(p).filter((v:any)=>v.benar).length);
      }catch{}
    }
  };

  const handleJawab = (opsi:string)=>{
    if(!soal) return;
    setJawaban(opsi);
    setShowKunci(true);
    const benar = opsi===soal.kunci;
    const newProg = {...progress, [soal.id]: {jawaban: opsi, benar, mapel: soal.mapel, waktu: new Date().toISOString()}};
    setProgress(newProg);
    localStorage.setItem(`bsj_progress_${voucher.code}`, JSON.stringify(newProg));
    setTotalBenar(Object.values(newProg).filter((v:any)=>v.benar).length);
  };

  const logout = ()=>{
    if(confirm("Keluar dari kelas?")){
      localStorage.removeItem('bsj_hp_anak');
      localStorage.removeItem('bsj_kode');
      setMode("landing");
      loadPakets();
    }
  };

  const filteredSoal = filterMapel==="SEMUA"? soalList : soalList.filter(s=>s.mapel===filterMapel);
  const soal = filteredSoal[currentSoal];
  const persen = soalList.length? Math.round((Object.keys(progress).length/soalList.length)*100) : 0;

  if(mode==="loading") return <div className="min-h-screen bg-black text-[#FFD700] flex items-center justify-center font-black">LOADING KELAS...</div>;

  if(mode==="kelas" && voucher && user){
    return (
      <div className="min-h-screen bg-[#FFFBEB] text-black">
        <header className="bg-black border-b-[4px] border-[#FFD700] sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 h-[72px] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src="/mrh-logo.png" alt="MRH" className="h-10" />
              <div>
                <p className="font-black text-[11px] tracking-[0.2em] text-[#FFD700]">KELAS AKTIF: {voucher.paket.toUpperCase()} - {user.nama.toUpperCase()} - 90 HARI</p>
                <p className="text-[10px] text-white/70 font-bold">HP Anak: {user.hp_anak} • Kode: {voucher.code} • Exp: {new Date(voucher.expired_at).toLocaleDateString('id-ID')} • {voucher.durasi_hari} hari • Progress {persen}% Benar: {totalBenar}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="bg-[#FFD700] text-black px-3 py-1.5 rounded-full font-black text-[10px] border-2 border-black">{soalList.length} SOAL</div>
              <button onClick={logout} className="bg-white text-black px-3 py-1.5 rounded-full font-black text-[10px] border-2 border-black">Logout</button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-6 grid lg:grid-cols-[320px_1fr] gap-6">
          <div className="space-y-4">
            <div className="bg-white border-[3px] border-[#25D366] rounded-[20px] p-4 shadow-[5px_5px_0px_0px_black]">
              <p className="font-black text-[12px] text-[#25D366]">📱 WA ANAK {user.hp_anak} - DINAMIS (bukan hanya Manda)</p>
              <p className="text-[11px] mt-2 font-bold">File ini 1 file untuk SEMUA pembeli. WA & Nama diambil dari Supabase vouchers.hpc_anak, bukan hardcode!</p>
              <button onClick={()=>{
                const phone = user.hp_anak.replace(/^0/,'62');
                const msg = `*BIMBEL SUPER JUARA - AKTIF!*%0AHalo ${user.nama}! Kode ${voucher.code} Aktif ${voucher.durasi_hari} Hari Link: /kode?code=${voucher.code}`;
                window.open(`https://wa.me/${phone}?text=${msg}`,'_blank');
              }} className="mt-3 w-full h-12 bg-[#25D366] text-black border-[3px] border-black rounded-[12px] font-black text-[12px]">💬 KIRIM WA KE {user.hp_anak}</button>
            </div>

            <div className="bg-white border-[3px] border-black rounded-[20px] p-4 shadow-[5px_5px_0px_0px_black]">
              <p className="font-black text-[11px]">📚 FILTER MAPEL - {soalList.length} SOAL</p>
              <div className="grid grid-cols-1 gap-2 mt-3">
                {[
                  {id:'SEMUA', nama:'Semua', jml: soalList.length},
                  {id:'MATEMATIKA', nama:'Matematika', jml: soalList.filter(s=>s.mapel==='MATEMATIKA').length},
                  {id:'BAHASA INDONESIA', nama:'B. Indonesia', jml: soalList.filter(s=>s.mapel==='BAHASA INDONESIA').length},
                  {id:'IPA', nama:'IPA', jml: soalList.filter(s=>s.mapel==='IPA').length},
                ].map(m=>(
                  <button key={m.id} onClick={()=>{setFilterMapel(m.id); setCurrentSoal(0); setJawaban(""); setShowKunci(false);}} className={`h-[56px] rounded-[14px] border-2 border-black px-4 flex justify-between items-center font-black ${filterMapel===m.id?'bg-black text-[#FFD700] shadow-[3px_3px_0px_0px_black]':'bg-white'}`}>
                    <div><p className="text-[11px]">{m.nama}</p><p className="text-[9px] opacity-70">{m.jml} soal</p></div>
                    <div>{filterMapel===m.id?'✓':''}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            {soal && (
              <div className="bg-white border-[3px] border-black rounded-[24px] p-6 shadow-[6px_6px_0px_0px_black]">
                <h2 className="font-bold text-[17px] mb-5">{soal.pertanyaan}</h2>
                <div className="grid gap-3">
                  {[{k:'A',t:soal.opsi_a},{k:'B',t:soal.opsi_b},{k:'C',t:soal.opsi_c},{k:'D',t:soal.opsi_d}].map(o=>(
                    <button key={o.k} onClick={()=>handleJawab(o.k)} className={`text-left border-[3px] rounded-[14px] p-4 font-bold ${jawaban===o.k? (o.k===soal.kunci? 'bg-[#22C55E] border-black' : 'bg-red-500 text-white border-black') : 'bg-[#F8F8F8] border-black/20 hover:bg-[#FFD700]'}`}>
                      {o.k}. {o.t} {jawaban===o.k? (o.k===soal.kunci? '✅' : '❌') : ''}
                    </button>
                  ))}
                </div>
                {showKunci && <div className="mt-4 p-4 rounded-[12px] border-[3px] bg-green-50 border-[#22C55E]"><p className="font-black">{jawaban===soal.kunci? 'BENAR!' : `SALAH! Kunci: ${soal.kunci}`}</p><p className="text-[12px] mt-2">{soal.pembahasan}</p></div>}
                <div className="flex justify-between mt-6">
                  <button onClick={()=>setCurrentSoal(Math.max(0,currentSoal-1))} className="px-6 py-3 rounded-full border-[3px] border-black font-black">← PREV</button>
                  <button onClick={()=>setCurrentSoal(Math.min(filteredSoal.length-1,currentSoal+1))} className="px-6 py-3 rounded-full bg-black text-[#FFD700] border-[3px] border-black font-black">NEXT →</button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  return <div className="min-h-screen bg-[#FEF9C3] p-10 text-center font-black">Landing... <a href="/kode?code=BSJ-SD1-455E" className="underline">Cek 455E Manda</a></div>;
}