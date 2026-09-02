# Explorer Sistem Tubuh

Aplikasi web statis untuk belajar 11 sistem tubuh manusia. Cocok di-host di **GitHub Pages**. Tidak butuh server atau database.

Materi level sekolah. Bukan aplikasi diagnosis dan bukan pengganti dokter.

## Isi

- Kartu 11 sistem tubuh
- Skema tubuh yang bisa diklik
- Fungsi, bagian utama, fakta, dan cara menjaga
- Progress “sudah dipelajari” (tersimpan di `localStorage`)
- Kuis 8 soal acak
- Mode terang / gelap

Sistem reproduksi hanya dijelaskan secara umum, tanpa detail organ.

## Cara menjalankan di komputer

Buka `index.html` di browser, atau dari folder project:

```bash
python3 -m http.server 8080
```

Lalu buka `http://localhost:8080`.

## Deploy ke GitHub Pages

1. Buat repositori baru di GitHub, misalnya `explorer-sistem-tubuh`.
2. Unggah semua file di folder ini (jangan unggah folder induknya saja; `index.html` harus di root repo, atau sesuaikan).
3. Di repo: **Settings → Pages**.
4. Source: **Deploy from a branch**.
5. Branch: `main`, folder: `/ (root)`.
6. Tunggu 1–2 menit. Situsnya: `https://USERNAME.github.io/explorer-sistem-tubuh/`.

Kalau repo bernama `USERNAME.github.io`, situsnya langsung di `https://USERNAME.github.io/`.

## Struktur

```
index.html
css/style.css
js/data.js
js/app.js
README.md
```
