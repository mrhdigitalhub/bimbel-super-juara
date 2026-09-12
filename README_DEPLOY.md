# Bimbel Super Juara SD - Landing Page Next.js

## Sudah Fix:
- Kotak paket hemat tidak terpotong
- Alamat: Purwakarta - Jawa Barat - Indonesia
- Email: mailto:mrhdigitalhub@gmail.com (klik langsung buka Gmail)
- WA: https://wa.me/6281770220059 sudah konek
- Harga: Rp17.000 PER KELAS (900 soal), bundle 6 kelas Rp85.000
- Demo: soal beda tiap kelas tiap mapel (150 soal demo real dari DB 5400), tampil score + pembahasan salah

## Cara Git Push ke Vercel Project bimbel-super-juara

1. Buka project lama:
   cd path/ke/bimbel-super-juara

2. Copy isi ZIP ini ke sana (replace):
   - app/page.tsx -> replace file existing app/page.tsx kamu
   - app/layout.tsx, app/globals.css
   - public/logo-mrh.png

   ATAU jika mau simpan dashboard lama, taruh landing di app/bsj/page.tsx (buat folder bsj)

3. Push:
   git add .
   git commit -m "feat: LP BSJ SD fix terpotong + Purwakarta + email mailto + harga per kelas 17k + demo beda kelas score"
   git push origin main

4. Tunggu 2 menit di https://vercel.com/mrhdigitalhub/bimbel-super-juara
   Akan auto deploy -> Live

5. Cek live: https://bimbel-super-juara.vercel.app (atau domain custom kamu)

Email & WA langsung konek karena pakai mailto dan wa.me.
