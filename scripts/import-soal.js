const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
require("dotenv").config({ path: ".env.local" });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function importFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const dataPerKelas = JSON.parse(raw);
  let total = 0;
  for (const kelas of Object.keys(dataPerKelas)) {
    const perMapel = dataPerKelas[kelas];
    for (const mapel of Object.keys(perMapel)) {
      const perBab = perMapel[mapel];
      for (const bab of Object.keys(perBab)) {
        const soalList = perBab[bab];
        const rows = soalList.map(s => ({ kelas, mapel, bab: parseInt(bab), no: s.no, tipe: s.tipe, tanya: s.tanya, opsi: s.opsi || null, kunci: String(s.kunci) }));
        const { error } = await supabase.from("soal_super_juara").upsert(rows, { onConflict: "kelas,mapel,bab,no" });
        if (error) console.error(`Error ${kelas} ${mapel} BAB ${bab}:`, error.message);
        else console.log(`Imported ${kelas} ${mapel} BAB ${bab} - ${rows.length} soal`);
        total += rows.length;
      }
    }
  }
  console.log(`TOTAL: ${total}`);
}
(async () => { await importFile("./BSJ-ALL-SD1-SD2-COMBINED.json"); })();
