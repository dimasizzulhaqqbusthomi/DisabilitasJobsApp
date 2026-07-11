# AbleWork - "Work Without Barriers"

AbleWork adalah prototype platform pencarian kerja inklusif yang dirancang khusus untuk penyandang disabilitas. Berbeda dari job portal konvensional, AbleWork mengutamakan **Inclusive Job Matching** dengan mencocokkan kebutuhan aksesibilitas fisik, sensorik, dan kognitif pencari kerja dengan akomodasi yang disediakan oleh perusahaan secara dinamis dan real-time.

Proyek ini dibangun untuk mendukung tema lomba: **“Designing Without Barriers: Inclusive Interfaces for the Underserved”** dengan subtema **“Akses Ketenagakerjaan yang Setara dan Inklusif”**.

---

## 🚀 Cara Menjalankan Project Secara Lokal

### Prasyarat
- **Node.js** versi `18.x` atau lebih baru (direkomendasikan Node.js v23)
- **NPM** (bawaan dari instalasi Node.js)

### Langkah-langkah
1. **Masuk ke folder project**:
   ```bash
   cd difabeljobsapp
   ```
2. **Install dependensi**:
   ```bash
   npm install
   ```
3. **Jalankan server pengembangan**:
   ```bash
   npm run dev
   ```
4. **Buka aplikasi**:
   Buka browser Anda dan akses halaman [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Design System Singkat

### Palette Warna
- **Primary (Indigo/Biru Keunguan)**: `#4f46e5` - Melambangkan profesionalitas, kestabilan, dan kepercayaan.
- **Secondary (Cyan/Turquoise)**: `#06b6d4` - Melambangkan modernitas, keramahan, dan energi kreatif.
- **Background**: `#f8fafc` (slate-50) - Memberikan nuansa latar belakang yang lembut untuk mata dan mengurangi kelelahan visual.
- **Accent (Emerald/Hijau)**: `#10b981` - Menunjukkan status cocok (match) / aman untuk melamar.
- **Warning (Amber/Kuning-Oranye)**: `#f59e0b` - Memberikan indikator perhatian atau batas waktu.
- **Danger (Red/Merah Lembut)**: `#ef4444` - Menandai risiko fisik atau peringatan jalur rekrutmen.

### Tipografi & Kontras
- Menggunakan font **Inter** (sans-serif) dari Google Fonts yang memiliki keterbacaan tinggi di berbagai ukuran layar.
- Menggunakan rasio kontras warna tinggi (memenuhi standar WCAG AA) untuk memastikan teks terbaca dengan jelas oleh penyandang low vision.

---

## ♿ Fitur Aksesibilitas (Wajib & Inovatif)

Aplikasi dilengkapi dengan panel **Pengaturan Aksesibilitas** (`/accessibility`) yang terintegrasi secara global dan instan menggunakan React Context API:
1. **Mode Kontras Tinggi (High Contrast Mode)**: Mengubah seluruh warna tema menjadi hitam pekat, putih, dan kuning terang untuk pengguna dengan gangguan penglihatan berat (low vision).
2. **Skala Ukuran Teks (Text Scaling)**: Memungkinkan peningkatan ukuran huruf website secara proporsional hingga 130% tanpa merusak layout.
3. **Bahasa Sederhana (Simple Language Mode)**: Menyederhanakan kalimat deskripsi lowongan kerja dan tugas kerja agar lebih mudah dipahami oleh pengguna neurodivergent (ADHD, spektrum autisme).
4. **Kurangi Gerakan (Reduced Motion)**: Menonaktifkan seluruh transisi animasi css untuk mencegah pemicu kejang atau pusing visual.
5. **Optimasi Pembaca Layar (Screen Reader Optimized)**: Menambahkan deskripsi teks terperinci (`aria-label`) di setiap tombol interaktif.

---

## 🗺️ Struktur Navigasi & Halaman yang Tersedia

Prototype ini mencakup 11 halaman/rute fungsional tanpa backend (menggunakan mock data lokal dinamis):

1. **`/` (Landing Page)**: Mengenalkan aplikasi, tantangan pencari kerja disabilitas, solusi inklusif AbleWork, dan visualisasi persona target.
2. **`/onboarding`**: Proses registrasi 3-langkah untuk menentukan tujuan pengguna, memilih kebutuhan aksesibilitas kerja, serta preferensi kerja.
3. **`/dashboard`**: Rangkuman profil pengguna ("Halo, Sinta"), statistika lamaran, rekomendasi kerja harian, dan checklist wawancara.
4. **`/jobs` (Job List)**: Pencarian lowongan kerja dilengkapi sidebar filter canggih berdasarkan akomodasi, gaji, tipe kerja, dan status kecocokan.
5. **`/jobs/[id]` (Job Detail)**: Detail spesifik tugas, syarat, daftar akomodasi kantor yang cocok, catatan risiko, serta CTA melamar.
6. **`/skill-passport`**: Profil kemampuan alternatif non-formal yang mudah dipahami, portofolio visual, sertifikasi, serta tombol "Download PDF/Cetak".
7. **`/apply` (Apply Page)**: Alur melamar 3-langkah (Konfirmasi Passport, Pilih Template Pesan Aksesibilitas untuk HRD, dan Review Kirim).
8. **`/training`**: Pelatihan bersertifikat gratis yang direkomendasikan sistem dengan label aksesibilitas (subtitle, ramah pembaca layar).
9. **`/interview-checklist`**: Checklist persiapan fisik/perangkat sebelum wawancara serta simulasi draf jawaban pertanyaan HRD.
10. **`/accessibility` (Settings)**: Panel kontrol pengaturan aksesibilitas global dengan visual preview card sebelum dan sesudah diganti.
11. **`/feedback`**: Media evaluasi bagi pencari kerja pasca interview untuk menilai keramahan akomodasi perusahaan.

---

## 🔄 User Flow Utama

- **Landing Page (/)** -> Mulai Cari Kerja -> **Onboarding (/onboarding)**
- **Onboarding (/onboarding)** -> Pilih Kebutuhan & Preferensi -> **Dashboard (/dashboard)**
- **Dashboard (/dashboard)** -> Cari Lowongan -> **Job List (/jobs)** -> Pilih Lowongan -> **Job Detail (/jobs/id)**
- **Job Detail (/jobs/id)** -> Lamar Kerja -> **Apply (/apply)** -> Kirim Lamaran -> **Interview Checklist (/interview-checklist)** -> Wawancara Selesai -> **Feedback (/feedback)**

---

## 👥 Persona Simulasi (Dapat Ditukar di Header)

Untuk memudahkan juri/penguji melihat sifat dinamis dari aplikasi, terdapat widget **Persona Switcher** di bagian kanan atas header:
- **Sinta (Neurodivergent - ADHD/Autisme)**: Membutuhkan instruksi tertulis, lingkungan minim bising, jam fleksibel, dan remote.
- **Budi (Disabilitas Fisik - Kursi Roda)**: Membutuhkan akses kursi roda, meja kerja ergonomis, dan kerja hybrid/onsite.
- **Adi (Tuli / Hard of Hearing)**: Membutuhkan video call ber-caption, komunikasi chat tertulis, dan remote.

*Setiap kali Anda menukar persona, Match Score di daftar lowongan akan otomatis dihitung ulang sesuai dengan keselarasan profil akomodasi masing-masing persona.*
