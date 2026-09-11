#!/bin/bash
# CODE PUSH FINAL - PASTEL + IKON 3D REALISTIS - BIMBEL SUPER JUARA

# 1. BIKIN FOLDER ICONS
mkdir -p public/icons

# 2. COPY 5 ICON TRANSPARAN (Bos download dari chat Juara, taruh di /mnt/data dulu atau langsung curl jika sudah di CDN)
# Kalau Bos sudah download manual, skip curl dan langsung cp
echo "Pastikan file ikon ada di /mnt/data/:"
echo " - ppkn_garuda_icon.png -> public/icons/ppkn.png"
echo " - b_indo_books_icon.png -> public/icons/bindo.png"
echo " - mtk_calc_icon.png -> public/icons/mtk.png"
echo " - ipas_globe_icon.png -> public/icons/ipas.png"
echo " - pai_quran_icon.png -> public/icons/pai.png"

cp /mnt/data/ppkn_garuda_icon.png public/icons/ppkn.png
cp /mnt/data/b_indo_books_icon.png public/icons/bindo.png
cp /mnt/data/mtk_calc_icon.png public/icons/mtk.png
cp /mnt/data/ipas_globe_icon.png public/icons/ipas.png
cp /mnt/data/pai_quran_icon.png public/icons/pai.png

# 3. COPY FILE DASHBOARD FINAL
cp /mnt/data/page_FINAL_PUSH_PASTEL_REAL_ICON.tsx app/soal/\[kelas\]/page.tsx

# 4. COPY FILE LATIHAN DENGAN TOMBOL KEMBALI
cp /mnt/data/page_FINAL_WITH_BACK_BUTTON.tsx app/soal/\[kelas\]/latihan/page.tsx

# 5. CEK
ls -lh public/icons/
echo "Dashboard file:"
ls -lh app/soal/\[kelas\]/page.tsx
ls -lh app/soal/\[kelas\]/latihan/page.tsx

# 6. PUSH
git add public/icons/ app/soal/\[kelas\]/page.tsx app/soal/\[kelas\]/latihan/page.tsx
git commit -m "feat dashboard pastel biru merah hijau kuning emas + ikon 3D realistis buku garuda kalkulator globe quran + tombol kembali"
git push origin main

echo "SELESAI PUSH BOS!"
