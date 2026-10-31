# AXES - "Work Without Barriers"
### Platform Pencarian & Penyelarasan Kerja Inklusif Berbasis Kebutuhan Aksesibilitas

[![Next.js](https://img.shields.io/badge/Next.js-16.2.10-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%26%20Auth-3ecf8e?logo=supabase)](https://supabase.com/)
[![A11y WCAG 2.1](https://img.shields.io/badge/A11y-WCAG%202.1%20AA%2FAAA-green?logo=w3c)](https://www.w3.org/WAI/standards-guidelines/wcag/)

---

## 📌 Tentang AXES

**AXES** (*Akses Kerja Setara*) adalah platform ketenagakerjaan inklusif generasi baru yang dirancang khusus untuk menjembatani talenta penyandang disabilitas (fisik, sensorik, maupun neurodivergent) dengan perusahaan yang menyediakan akomodasi kerja ramah disabilitas.

Berbeda dari job portal konvensional yang kaku dan hanya berfokus pada riwayat kerja formal, AXES menerapkan pendekatan **kesetaraan akses, kemandirian, dan desain inklusif** melalui algoritma **Inclusive Job Matching**. Sistem ini mencocokkan profil kebutuhan akomodasi pencari kerja dengan fasilitas nyata yang disediakan oleh tempat kerja secara dinamis dan transparan.

---

## ✨ Fitur-Fitur Utama Aplikasi Secara Rinci

### 1. 🎯 Inclusive Job Matching Engine (Kalkulator Kecocokan Kerja)
- **Multi-Factor Scoring**: Algoritma cerdas yang menghitung skor kecocokan (*Match Score* 0–100%) secara instan:
  - **Dukungan Aksesibilitas (50%)**: Seberapa tepat akomodasi kantor (kursi roda, caption meeting, screen reader support, dll.) memenuhi kebutuhan pelamar.
  - **Kesesuaian Keterampilan (30%)**: Keselarasan skill praktis kandidat dengan kebutuhan lowongan.
  - **Preferensi Kerja (20%)**: Kesesuaian tipe kerja (remote, hybrid, onsite) dan jam kerja fleksibel.
- **Kartu Alasan Kecocokan (*Match Reason Card*)**: Memberikan transparansi detail mengapa lowongan tersebut cocok atau akomodasi apa yang masih belum tersedia di perusahaan terkait.

### 2. 🎛️ Pusat Kontrol Aksesibilitas Adaptif (`/accessibility`)
Sistem aksesibilitas global berbasis React Context yang dapat diubah secara instan tanpa me-reload halaman:
- **Mode Kontras Tinggi (*High Contrast Mode*)**: Memenuhi standar kontras ekstrem WCAG AAA (latar gelap murni, border tegas, teks kuning cerah dan putih kontras) untuk penyandang *low vision*. Otomatis tersinkronisasi dengan preferensi sistem operasi (`prefers-contrast`).
- **Skala Ukuran Teks (*Text Scaling*)**: Pilihan ukuran teks (Normal, Besar, Sangat Besar) yang mereskalasi seluruh elemen antarmuka tanpa merusak tata letak responsif.
- **Bahasa Sederhana (*Simple Language Mode*)**: Mengubah terminologi korporat yang rumit menjadi instruksi yang padat, jelas, dan ramah kognitif untuk pencari kerja neurodivergent (ADHD / Autisme).
- **Kurangi Gerakan (*Reduced Motion*)**: Menonaktifkan animasi CSS untuk mencegah kelelahan visual dan pemicu vestibular.
- **Pembaca Layar & ARIA Live Regions**: Pengumuman status live (`aria-live="polite"`) saat pengguna mengubah opsi atau menerima notifikasi, serta tombol navigasi ramah keyboard.

### 3. 🔍 Eksplorasi Lowongan Kerja Cerdas (`/jobs`, `/jobs/[id]`)
- **Filter Akomodasi Khusus**: Pencarian lowongan berdasarkan kriteria akses nyata:
  - Akses Kursi Roda / Fasilitas Ramp & Lift
  - Video Rapat dengan Subtitle/Caption
  - Komunikasi Utama via Chat/Teks
  - Panduan & Instruksi Tertulis
  - Lingkungan Minim Bising / Ruang Senyap
  - Kerja dari Rumah (*Remote*) & Jam Fleksibel
- **Detail Pekerjaan Komprehensif**: Menampilkan fasilitas kantor, penyesuaian uji seleksi, informasi profil HRD terverifikasi, tautan WhatsApp langsung, dan tombol simpan lowongan (`/jobs/saved`).

### 4. 🪪 Profil Kerja Digital & Skill Passport (`/profil-kerja`)
- **Pengganti CV Formal Konvensional**: Mengedepankan kompetensi riil, portofolio karya visual/digital, dan sertifikat pelatihan terverifikasi.
- **Kartu Identitas Digital (AXES ID)**: Desain *passport card* modern dengan nomor verifikasi unik, indikator kelengkapan profil, dan status kesiapan kerja.
- **Galeri Portofolio & Sertifikat Interaktif**: Pelamar dapat mengunggah dan menampilkan karya serta sertifikat kursus dengan pratinjau gambar dan tautan eksternal.
- **Siap Cetak / Ekspor PDF**: Tata letak yang dioptimalkan untuk mode cetak browser (`@media print`) sebagai berkas lamaran resmi.

### 5. 📝 Alur Lamaran Kerja Terpandu 3-Langkah (`/apply`)
- **Langkah 1 - Konfirmasi Berkas**: Memverifikasi Skill Passport dan portofolio yang akan dilampirkan.
- **Langkah 2 - Generator Template Surat Akomodasi**: Menghasilkan pernyataan kebutuhan aksesibilitas yang profesional dan bermartabat kepada perekrut tanpa rasa canggung atau diskriminatif.
- **Langkah 3 - Review & Kirim**: Pratinjau akhir sebelum berkas diteruskan ke antrean prioritas rekrutmen.
- **Evaluasi Kepuasan Pengalaman**: Survei feedback singkat pasca-melamar untuk terus meningkatkan kualitas layanan platform.

### 6. 💬 Chat Interaktif dengan Perekrut (`/chat`, `/chat/[id]`)
- **Ruang Percakapan Berbasis Teks**: Dirancang khusus untuk memfasilitasi wawancara dan komunikasi awal antara pencari kerja (termasuk Tuli/Hard of Hearing dan Disabilitas Wicara) dengan HRD perusahaan secara langsung.
- Mendukung template pesan cepat, riwayat pesan, dan status keaktifan perekrut.

### 7. 🎯 Pusat Persiapan Wawancara & Checklist Mandiri (`/interview-prep`, `/interview-checklist`)
- **Panduan Metode STAR**: Simulasi jawaban wawancara terstruktur (*Situation, Task, Action, Result*) dengan contoh praktis di bidang data entry, desain, admin, dan customer service.
- **Naskah Edukasi Akomodasi**: Panduan cara mengomunikasikan kebutuhan alat bantu atau akomodasi kantor saat interview secara percaya diri.
- **Interactive Device & Environment Checklist**: Daftar periksa kesiapan koneksi, headset, aplikasi screen reader, pencahayaan, dan dokumen sebelum sesi wawancara dimulai.

### 8. 📊 Manajemen Status Lamaran (`/applications`)
- Pelacakan status lamaran secara terpusat (*Terkirim*, *Sedang Ditinjau*, *Tahap Wawancara*, *Diterima*).
- Fitur batalkan lamaran dengan konfirmasi modal yang aman.

### 9. ⭐ Audit & Feedback Keramahan Rekrutmen Perusahaan (`/feedback`)
- Mengizinkan kandidat memberikan penilaian nyata terhadap fasilitas dan perlakuan aksesibilitas perusahaan pasca wawancara.
- Menjaga transparansi komitmen inklusivitas industri secara transparan.

### 10. 🔐 Autentikasi Fleksibel & Simulasi Persona (`/login`, `/register`, `/forgot-password`)
- **Supabase Auth**: Pendaftaran dan login dengan email & password terenkripsi, reset kata sandi via email, serta integrasi Google OAuth.
- **Quick Persona Switcher**: Memudahkan penguji/juri beralih ke 4 persona simulasi secara instan:
  - **Sinta** (Neurodivergent - ADHD/Autisme)
  - **Budi** (Disabilitas Fisik - Pengguna Kursi Roda)
  - **Adi** (Tuli / Hard of Hearing)
  - **Dina** (Profil 100% Siap Kerja & Cocok Sempurna)

---

## 💻 Teknologi yang Digunakan

| Kategori | Teknologi | Deskripsi & Peran |
| :--- | :--- | :--- |
| **Bahasa Pemrograman** | [TypeScript 5](https://www.typescriptlang.org/) | Pengetikan statis ketat (*type safety*) untuk menjamin keandalan data lowongan, profil, dan state aksesibilitas. |
| **Framework Utama** | [Next.js 16 (App Router)](https://nextjs.org/) | Framework React modern dengan hybrid rendering (Server Components, Client Components, Static Route Generation, dan Fast Refresh dengan Turbopack). |
| **UI Library** | [React 19](https://react.dev/) | Library antarmuka berbasis komponen reaktif dengan hooks modern (`useActionState`, `useOptimistic`, dsb). |
| **Styling & Design System** | [Tailwind CSS v4](https://tailwindcss.com/) | Utilitas CSS modern performa tinggi dengan variabel CSS dinamis untuk High Contrast Mode dan Text Scaling. |
| **Iconography** | [Lucide React](https://lucide.dev/) | Kumpulan ikon vektor berformat SVG yang ringan, konsisten, dan dapat diakses dengan pembaca layar. |
| **Database** | [Supabase PostgreSQL](https://supabase.com/) | Relational Database Cloud yang andal, dilengkapi ekstensi `pgcrypto` untuk keamanan data. |
| **Otentikasi** | [Supabase Auth](https://supabase.com/docs/guides/auth) | Sistem autentikasi berbasis JWT: Email/Password, OAuth Google, Session Refresh, dan Magic Link. |
| **Penyimpanan Berkas** | [Supabase Storage](https://supabase.com/docs/guides/storage) | Bucket `avatars` publik dengan batasan ukuran 2MB dan MIME type whitelist untuk foto profil dan sampul. |
| **Keamanan Data** | [Row Level Security (RLS)](https://www.postgresql.org/docs/current/ddl-rowsecurity.html) | Kebijakan akses data tingkat baris di PostgreSQL: pengguna hanya dapat melihat dan memperbarui profil miliknya sendiri. |
| **State Management** | React Context API | `AccessibilityContext` (A11y preferences), `AuthContext` (Sesi Supabase), dan `AppContext` (Data pelamar, bookmark, persona). |
| **Deployment & Hosting** | [Vercel](https://vercel.com/) | Infrastruktur serverless global dengan dukungan otomatis Next.js Turbopack, CDN Edge Caching, dan integrasi CI/CD Git. |

---

## 📂 Struktur Direktori Proyek

```text
AXES/
├── public/                       # Aset statis SVG dan favicon
├── src/
│   ├── app/                      # Rute App Router Next.js
│   │   ├── accessibility/        # Halaman pengaturan aksesibilitas global
│   │   ├── applications/         # Halaman riwayat dan pelacakan lamaran
│   │   ├── apply/                # Halaman formulir pengiriman lamaran 3-tahap
│   │   ├── auth/callback/        # Rute penanganan redirect OAuth Supabase
│   │   ├── chat/                 # Daftar pesan dan ruang chat perekrut
│   │   ├── dashboard/            # Beranda kandidat & rekomendasi harian
│   │   ├── feedback/             # Formulir audit keramahan aksesibilitas kantor
│   │   ├── forgot-password/      # Formulir pemulihan kata sandi
│   │   ├── interview-checklist/  # Checklist persiapan teknis & fisik wawancara
│   │   ├── interview-prep/       # Latihan tanya jawab wawancara metode STAR
│   │   ├── jobs/                 # Eksplorasi lowongan, detail job & bookmark
│   │   ├── login/                # Halaman masuk akun & pemilih persona
│   │   ├── notifications/        # Notifikasi status rekrutmen
│   │   ├── onboarding/           # Wizard onboarding profil aksesibilitas
│   │   ├── profil-kerja/         # Digital Skill Passport & CV ramah difabel
│   │   ├── profile/              # Pengaturan akun, avatar, sampul & kata sandi
│   │   ├── register/             # Pendaftaran akun bertahap
│   │   ├── globals.css           # Styling dasar, tema kontras tinggi & variabel CSS
│   │   ├── layout.tsx            # Root layout, font Inter, dan live announcements
│   │   └── page.tsx              # Landing page utama AXES
│   ├── components/               # Komponen antarmuka yang dapat digunakan kembali
│   │   ├── AbleMatchScore.tsx    # Komponen lencana skor kecocokan
│   │   ├── AppLayout.tsx         # Navbar desktop, navigasi mobile & footer
│   │   ├── MatchReasonCard.tsx   # Kartu rincian bobot skor akomodasi
│   │   ├── PathnameWatcher.tsx   # Pemantau rute untuk pembaruan aksesibilitas
│   │   └── Providers.tsx         # Pembungkus Auth, App, dan A11y Context
│   ├── context/                  # React Context untuk state aplikasi global
│   │   ├── AccessibilityContext.tsx # Logika tema kontras tinggi, font size & audio cues
│   │   ├── AppContext.tsx        # Sinkronisasi profil, lamaran, kebutuhan ke Supabase
│   │   └── AuthContext.tsx       # State sesi login & Google OAuth
│   ├── data/
│   │   └── mockData.ts           # Data dummy lowongan, kriteria akomodasi & persona
│   ├── lib/
│   │   └── supabase/             # Client & Server helper Supabase
│   └── proxy.ts                  # Reverse proxy/middleware helper
├── supabase/                     # Konfigurasi dan migrasi Supabase lokal/CLI
├── .env.example                  # Template variabel lingkungan
├── .gitignore                    # Berkas filter pengabaian Git yang aman
├── package.json                  # Dependensi dan skrip proyek
├── storage_setup.sql             # Skrip SQL inisialisasi bucket storage Supabase
├── supabase_setup.sql            # Skrip SQL inisialisasi tabel, RLS, dan seed data
└── tsconfig.json                 # Konfigurasi TypeScript compiler
```

---

## 🚀 Panduan Menjalankan Secara Lokal

### 1. Prasyarat Sistem
- **Node.js**: Versi `18.18.0` atau yang lebih baru (Disarankan Node.js `20.x` / `22.x`)
- **NPM**: Versi `9.x` atau lebih baru (atau Yarn / PNPM / Bun)
- **Akun Supabase**: Gratis di [supabase.com](https://supabase.com) (opsional, jika ingin menghubungkan database langsung).

### 2. Kloning Repositori
```bash
git clone https://github.com/dimasizzulhaqqbusthomi/DisabilitasJobsApp.git
cd DisabilitasJobsApp
```

### 3. Instalasi Dependensi
```bash
npm install
```

### 4. Konfigurasi Environment Variables
Salin berkas `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Buka `.env.local` dan isi URL serta Kunci Anon dari proyek Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```
*(Catatan: Aplikasi tetap berjalan dengan sempurna menggunakan fallback data lokal jika kunci Supabase belum diisi).*

### 5. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka peramban Anda di [http://localhost:3000](http://localhost:3000).

---

## 🗄️ Menyiapkan Database Supabase (Opsional tapi Direkomendasikan)

Jika Anda ingin mengaktifkan sinkronisasi database cloud penuh:

1. Buka [Supabase Dashboard](https://supabase.com/dashboard) dan buat proyek baru.
2. Masuk ke menu **SQL Editor** di panel samping kiri.
3. Buka berkas [`supabase_setup.sql`](file:///e:/Antigravity/AXES/supabase_setup.sql) dari proyek ini, salin seluruh isinya, lalu tempelkan ke SQL Editor dan klik tombol **Run**.
   - Skrip ini akan membuat tabel `profiles`, mengonfigurasi RLS, membuat fungsi pemicu registrasi otomatis, dan memasukkan data seed persona AXES.
4. Buka berkas [`storage_setup.sql`](file:///e:/Antigravity/AXES/storage_setup.sql), salin isinya, tempelkan ke SQL Editor dan jalankan.
   - Skrip ini akan membuat bucket storage `avatars` publik untuk foto profil pengguna.
5. (Opsional) Jalankan migrasi di [`supabase/migrations/create_app_feedback.sql`](file:///e:/Antigravity/AXES/supabase/migrations/create_app_feedback.sql) untuk tabel umpan balik aplikasi.

---

## 🌐 Panduan Deployment ke Vercel

Proyek ini telah dioptimalkan secara penuh untuk deployment sekali klik ke [Vercel](https://vercel.com):

1. **Push ke GitHub**: Pastikan kode terbaru sudah berada di repositori GitHub Anda.
2. **Impor Proyek ke Vercel**:
   - Buka dasbor Vercel dan klik **Add New...** -> **Project**.
   - Pilih repositori `DisabilitasJobsApp` (atau repositori AXES Anda).
3. **Konfigurasi Environment Variables**:
   - Di bagian **Environment Variables**, tambahkan:
     - `NEXT_PUBLIC_SUPABASE_URL`: URL project Supabase Anda.
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Kunci anonim public Supabase.
4. **Deploy**:
   - Klik **Deploy**. Vercel akan secara otomatis membangun proyek menggunakan Turbopack dan merilis aplikasi ke domain produksi (contoh: `https://axes-app.vercel.app`).

---

## ♿ Kepatuhan Standar Aksesibilitas (A11y)

AXES dibangun dengan mengacu pada pedoman **Web Content Accessibility Guidelines (WCAG) 2.1 Level AA & AAA**:
- **Contrast Ratio**: Rasio kontras teks minimum 4.5:1 pada mode default, dan rasio ekstrem 7:1+ pada Mode Kontras Tinggi.
- **Keyboard Operable**: Seluruh alur (mulai dari navigasi, pemilih akomodasi, hingga pengiriman lamaran) dapat dioperasikan penuh menggunakan tombol `Tab`, `Space`, `Enter`, dan panah navigasi keyboard.
- **Screen Reader Friendly**: Menggunakan elemen HTML semantik (`main`, `nav`, `header`, `section`, `article`, `figure`), atribut `aria-label`, `aria-checked`, `role="switch"`, dan `aria-live`.
- **Cognitive Clarity**: Dukungan mode Bahasa Sederhana (*Simple Language*) dengan kalimat pendek, tanpa jargon ambigu, serta bantuan visual ikonik yang jelas.

---

## 📄 Lisensi & Hak Cipta

Dibuat dengan ❤️ untuk lomba **UI/UX: “Designing Without Barriers: Inclusive Interfaces for the Underserved”**.  
Hak Cipta © 2026 **AXES** — *Work Without Barriers*. Seluruh hak cipta dilindungi undang-undang.
