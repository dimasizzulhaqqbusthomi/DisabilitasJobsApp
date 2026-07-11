Saya ingin kamu membuat prototype UI/UX berbasis Next.js untuk aplikasi bernama “AbleWork”.

Konteks:
AbleWork adalah platform pencarian kerja inklusif untuk penyandang disabilitas. Fokus utamanya bukan sekadar job portal biasa, tetapi inclusive job matching berdasarkan kebutuhan aksesibilitas pengguna, keterampilan, lokasi, pola kerja, dan akomodasi kerja yang tersedia.

Makna brand:
AbleWork berarti platform yang membantu pengguna menemukan pekerjaan yang sesuai dengan kemampuan, kebutuhan aksesibilitas, dan kondisi kerja yang membuat mereka bisa bekerja secara optimal. AbleWork tidak menggunakan pendekatan belas kasihan, tetapi pendekatan kesetaraan akses, kemandirian, dan desain inklusif.

Tagline:
“Work Without Barriers”

Tema lomba:
“Designing Without Barriers: Inclusive Interfaces for the Underserved”

Subtema:
Akses Ketenagakerjaan yang Setara dan Inklusif.

Tujuan produk:
Membantu penyandang disabilitas menemukan pekerjaan yang sesuai dengan kemampuan dan kebutuhan aksesibilitas mereka, serta membantu mereka menyiapkan profil kerja, skill passport, lamaran, pelatihan, dan persiapan interview.

Gunakan:
- Next.js
- TypeScript
- Tailwind CSS
- App Router
- Komponen reusable
- Data dummy/mock, tidak perlu backend
- Desain responsive untuk mobile dan desktop
- Fokus utama pada UI visual, user flow, dan aksesibilitas

Gaya visual:
Buat desain modern, bersih, inklusif, profesional, dan mudah dibaca.
Gunakan nuansa warna:
- Primary: biru keunguan / indigo
- Secondary: cyan atau turquoise
- Background: putih kebiruan sangat muda
- Accent: hijau untuk status cocok/aman
- Warning: kuning/oranye untuk perhatian
- Danger: merah lembut untuk risiko

Jangan membuat tampilan terlalu ramai. Prioritaskan:
- kontras tinggi
- font jelas
- tombol besar
- spacing lega
- ikon dengan label teks
- form bertahap
- bahasa sederhana
- navigasi mudah

Buat halaman berikut:

1. Landing Page
Isi:
- Hero section dengan headline: “AbleWork membantu pencari kerja difabel menemukan lowongan, pelatihan, dan proses rekrutmen yang lebih inklusif.”
- Subheadline: “AbleWork membantu pencari kerja difabel menemukan lowongan, pelatihan, dan proses rekrutmen yang lebih inklusif.”
- CTA utama: “Mulai Cari Kerja”
- CTA kedua: “Buat Skill Passport”
- Section masalah: “Lowongan kerja sering tidak menjelaskan aksesibilitas”
- Section solusi: job matching, filter akomodasi, skill passport, template lamaran, checklist interview
- Section persona singkat: pengguna kursi roda, tuli/hard of hearing, low vision, neurodivergent
- Footer sederhana

2. Onboarding Page
Buat stepper 3 langkah:
Step 1: Pilih tujuan pengguna
- Cari kerja
- Cari pelatihan
- Buat profil skill
- Persiapan interview

Step 2: Pilih kebutuhan aksesibilitas kerja
Checkbox:
- Akses kursi roda
- Interview via chat/email
- Video call dengan caption
- Instruksi kerja tertulis
- Screen reader friendly
- Lingkungan minim bising
- Jam kerja fleksibel
- Remote/hybrid

Step 3: Pilih preferensi kerja
- Bidang pekerjaan
- Lokasi
- Tipe kerja: remote, hybrid, onsite
- Level pengalaman
- Rentang gaji

3. Dashboard Page
Isi:
- Greeting: “Halo, Sinta”
- Card ringkasan:
  - 12 lowongan cocok
  - 3 pelatihan direkomendasikan
  - Skill Passport 80% lengkap
  - 1 interview mendatang
- Section “Rekomendasi Terbaik Hari Ini”
- Section “Lengkapi Profil Aksesibilitas”
- Section “Checklist Persiapan Interview”
- Sidebar atau bottom navigation

4. Job List Page
Tampilkan daftar lowongan kerja dalam card.
Setiap card berisi:
- Nama posisi
- Nama perusahaan
- Lokasi
- Tipe kerja
- Gaji
- Accessibility match score, contoh: “92% cocok”
- Badge akomodasi:
  - Remote
  - Caption Meeting
  - Akses kursi roda
  - Instruksi tertulis
- Tombol “Lihat Detail”

Tambahkan filter:
- Jenis disabilitas/kebutuhan akses
- Tipe kerja
- Lokasi
- Rentang gaji
- Level pengalaman
- Akomodasi tersedia

5. Job Detail Page
Isi:
- Judul posisi
- Perusahaan
- Match score besar
- Ringkasan pekerjaan
- Tugas utama
- Syarat kerja
- Akomodasi tersedia
- Fasilitas aksesibilitas:
  - Ramp/lift
  - Toilet aksesibel
  - Interview online
  - Caption meeting
  - Komunikasi tertulis
- Risiko/catatan:
  - “Perlu konfirmasi akses gedung”
  - “Interview tahap 1 tersedia via video call”
- Tombol “Lamar dengan Skill Passport”
- Tombol “Simpan Lowongan”

6. Skill Passport Page
Buat halaman profil kemampuan pengguna.
Isi:
- Foto/avatar
- Nama pengguna
- Role yang diminati
- Ringkasan kemampuan
- Skill chips:
  - Desain Canva
  - Admin Online
  - Input Data
  - Customer Service Chat
  - Microsoft Office
- Portofolio sederhana
- Sertifikat/pelatihan
- Preferensi kerja
- Kebutuhan aksesibilitas kerja
- Tombol “Download PDF”
- Tombol “Gunakan untuk Melamar”

Konsep penting:
Skill Passport bukan CV formal biasa. Ini harus terasa lebih mudah, visual, dan ramah untuk pengguna yang belum punya pengalaman kerja formal.

7. Apply Page
Buat alur melamar kerja 3 tahap:
Tahap 1: Pilih Skill Passport
Tahap 2: Pilih template komunikasi kebutuhan aksesibilitas
Contoh template:
- “Saya dapat mengikuti interview secara optimal melalui chat tertulis atau video call dengan caption.”
- “Saya membutuhkan akses masuk kantor yang ramah kursi roda.”
- “Saya bekerja lebih optimal dengan instruksi tertulis dan jadwal kerja yang jelas.”
Tahap 3: Review dan kirim lamaran

Tampilkan progress stepper dan preview lamaran.

8. Training Recommendation Page
Isi:
- Rekomendasi pelatihan berdasarkan lowongan yang dipilih
- Card pelatihan:
  - Judul pelatihan
  - Durasi
  - Format
  - Level
  - Label aksesibilitas:
    - Ada subtitle
    - Materi teks
    - Bisa diakses screen reader
    - Bisa belajar mandiri
- Tombol “Mulai Pelatihan”
- Tombol “Simpan”

9. Interview Checklist Page
Isi:
Checklist persiapan:
- Dokumen sudah siap
- Skill Passport sudah diperbarui
- Kebutuhan akomodasi sudah ditulis
- Link interview sudah dicek
- Perangkat dan koneksi sudah siap
- Kontak HR tersedia
- Pertanyaan latihan sudah dipelajari

Tambahkan card simulasi pertanyaan:
- “Ceritakan kemampuan utama kamu”
- “Kebutuhan kerja seperti apa yang membuat kamu produktif?”
- “Contoh pekerjaan atau pengalaman yang pernah kamu lakukan?”

10. Accessibility Settings Page
Isi:
- Toggle high contrast mode
- Toggle large text
- Toggle reduced motion
- Toggle simple language
- Toggle screen reader optimized labels
- Pilihan ukuran teks
- Preview card sebelum dan sesudah

11. Feedback Page
Setelah proses lamaran/interview, pengguna bisa memberi feedback:
- Apakah proses rekrutmen aksesibel?
- Apakah HR menyediakan akomodasi?
- Apakah deskripsi lowongan sesuai kenyataan?
- Rating 1-5
- Kolom catatan
- Tombol kirim feedback

Komponen yang harus dibuat:
- Navbar
- Sidebar / Bottom Navigation
- Button
- Card
- Badge
- Input
- Checkbox
- Select
- Stepper
- Progress bar
- Match score component
- Job card
- Training card
- Accessibility badge
- Empty state
- Modal sederhana
- Toast notification dummy

Struktur navigasi:
Gunakan routing Next.js:
/
/onboarding
/dashboard
/jobs
/jobs/[id]
/skill-passport
/apply
/training
/interview-checklist
/accessibility
/feedback

Data dummy:
Buat minimal:
- 5 data lowongan kerja
- 3 data pengguna/persona
- 5 data akomodasi aksesibilitas
- 4 data pelatihan
- 3 template pesan kebutuhan aksesibilitas

Contoh lowongan:
1. Admin Online - PT Ruang Inklusif
Akomodasi: remote, instruksi tertulis, komunikasi via chat
Match: 94%

2. Junior Graphic Designer - Studio Setara
Akomodasi: hybrid, caption meeting, portofolio-based hiring
Match: 89%

3. Data Entry Assistant - Karya Digital
Akomodasi: remote, screen reader friendly tools, jam fleksibel
Match: 91%

4. Customer Support Chat - Layanan Prima
Akomodasi: full chat-based work, training teks, supervisor mentor
Match: 87%

5. Content Admin UMKM - LokalMart
Akomodasi: remote, tugas bertahap, instruksi tertulis
Match: 85%

UX requirement:
Buat user flow terasa realistis:
Landing → Onboarding → Dashboard → Job List → Job Detail → Apply → Interview Checklist → Feedback

Jangan hanya membuat halaman statis yang terpisah. Buat tombol antarhalaman bisa diklik dengan Link Next.js.

Aksesibilitas wajib:
- Gunakan semantic HTML
- Semua tombol punya label jelas
- Jangan mengandalkan warna saja
- Kontras teks harus baik
- Form punya label
- Fokus keyboard terlihat
- Gunakan aria-label jika perlu
- Layout tetap nyaman pada mobile
- Hindari animasi berlebihan

Output yang saya inginkan:
- Berikan kode lengkap proyek Next.js
- Buat tampilan langsung bisa dijalankan
- Jangan pakai backend
- Jangan pakai database
- Jangan pakai login sungguhan
- Gunakan mock data lokal
- Buat desain seindah mungkin agar bisa saya jadikan referensi Figma
- Sertakan instruksi cara menjalankan project

Tambahan:
Buat juga file README.md yang menjelaskan:
- Konsep aplikasi
- Halaman yang tersedia
- Cara menjalankan
- Design system singkat
- User flow utama
- Fitur aksesibilitas