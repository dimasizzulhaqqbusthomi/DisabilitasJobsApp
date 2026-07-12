export interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: "remote" | "hybrid" | "onsite";
  salary: string;
  defaultMatchScore: number;
  accommodations: string[]; // Keys of accessibility features
  description: string;
  simpleDescription: string; // Simplified language version
  tasks: string[];
  simpleTasks: string[]; // Simplified language version
  requirements: string[];
  simpleRequirements: string[]; // Simplified language version
  facilities: string[];
  notes: string[];
}

export interface PortfolioItem {
  title: string;
  role: string;
  tool: string;
  img: string;
  link?: string;
}

export interface CertificateItem {
  title: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface Persona {
  id: string;
  name: string;
  avatar: string;
  disabilityType: string;
  needs: string[]; // List of accessibility keys
  bio: string;
  skills: string[];
  experience: string;
  education: string;
  workingStyle?: string[];
  targetCareers?: string[];
  location?: string;
  portfolios?: PortfolioItem[];
  certificates?: CertificateItem[];
  purpose?: string;
  cover?: string;
}

export interface AccommodationType {
  key: string;
  label: string;
  icon: string;
  description: string;
  simpleDescription: string;
}

export interface Training {
  id: string;
  title: string;
  duration: string;
  format: string;
  level: "Pemula" | "Menengah" | "Mahir";
  accessibilityLabels: string[];
  description: string;
  url?: string;
}

export interface MessageTemplate {
  id: string;
  title: string;
  text: string;
}

export const ACCOMMODATIONS: AccommodationType[] = [
  {
    key: "remote",
    label: "Bekerja Remote / Hybrid",
    icon: "Home",
    description: "Pilihan bekerja dari rumah untuk mengurangi kebutuhan mobilitas fisik.",
    simpleDescription: "Bisa kerja dari rumah tanpa harus pergi ke kantor."
  },
  {
    key: "caption_meeting",
    label: "Video Call dengan Caption",
    icon: "Subtitles",
    description: "Setiap pertemuan online menyediakan takarir (caption) otomatis atau juru bahasa isyarat.",
    simpleDescription: "Rapat online ada teks tulisannya agar mudah dimengerti."
  },
  {
    key: "wheelchair_access",
    label: "Akses Kursi Roda",
    icon: "Accessibility",
    description: "Gedung kantor dilengkapi ramp, lift, pintu lebar, dan toilet khusus kursi roda.",
    simpleDescription: "Kantor punya jalan datar (ramp), lift, dan toilet untuk kursi roda."
  },
  {
    key: "written_instruction",
    label: "Instruksi Kerja Tertulis",
    icon: "FileText",
    description: "Semua arahan, tugas, dan SOP diberikan secara tertulis untuk mengurangi ambiguitas.",
    simpleDescription: "Tugas kerja diberikan lewat tulisan yang jelas agar tidak membingungkan."
  },
  {
    key: "screen_reader",
    label: "Screen Reader Friendly",
    icon: "Eye",
    description: "Perangkat lunak dan sistem internal perusahaan kompatibel dengan aplikasi pembaca layar (NVDA/JAWS).",
    simpleDescription: "Aplikasi komputer bisa mengeluarkan suara untuk membaca teks di layar."
  },
  {
    key: "quiet_environment",
    label: "Lingkungan Minim Bising",
    icon: "VolumeX",
    description: "Ruang kerja tenang dengan tingkat kebisingan rendah, cocok untuk neurodivergent.",
    simpleDescription: "Tempat kerja tenang, tidak berisik, dan nyaman untuk fokus."
  },
  {
    key: "flexible_hours",
    label: "Jam Kerja Fleksibel",
    icon: "Clock",
    description: "Jam kerja dapat disesuaikan untuk kebutuhan terapi, pengobatan, atau manajemen energi.",
    simpleDescription: "Jam kerja bisa diatur sendiri agar bisa sambil berobat atau istirahat."
  },
  {
    key: "chat_communication",
    label: "Interview & Komunikasi via Chat",
    icon: "MessageSquare",
    description: "Wawancara kerja dan koordinasi harian bisa dilakukan menggunakan teks/chat.",
    simpleDescription: "Bicara dengan bos dan teman kerja lewat ketikan pesan (chat) saja."
  }
];

export const PERSONAS: Persona[] = [
  {
    id: "sinta",
    name: "Sinta",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    disabilityType: "Neurodivergent (ADHD & Autisme)",
    needs: ["written_instruction", "quiet_environment", "flexible_hours", "remote"],
    bio: "Saya tertarik pada pekerjaan administrasi dan pelayanan pelanggan. Saya memiliki kemampuan komunikasi tertulis dan nyaman bekerja dengan tugas yang terstruktur.",
    skills: ["Data Entry", "Microsoft Office", "Google Workspace", "Admin Online", "Desain Canva", "Komunikasi", "Kerjasama Tim", "Problem Solving"],
    experience: "Magang Admin 6 Bulan di UMKM Lokal",
    education: "SMK Administrasi Perkantoran",
    workingStyle: ["structured_task", "independent_work", "written_communication"],
    targetCareers: ["Admin Online", "Customer Support", "Data Entry"],
    location: "Jakarta",
    portfolios: [
      { title: "Desain Konten Sosmed UMKM", role: "Graphic Design", tool: "Canva & Figma", img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=300", link: "https://figma.com" },
      { title: "Data Entry & Dashboard Spreadsheet", role: "Data Entry", tool: "Google Sheets", img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300", link: "https://google.com" }
    ],
    certificates: [
      { title: "Sertifikat Kelulusan Dasar Pengolahan Data Excel", issuer: "AbleWork Academy", date: "Juni 2026", link: "https://excel.com" },
      { title: "Pelatihan Customer Service Chat & Bisnis Online", issuer: "Karya Setara", date: "April 2026", link: "https://karyasetara.com" }
    ]
  },
  {
    id: "budi",
    name: "Budi",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150",
    disabilityType: "Disabilitas Fisik (Pengguna Kursi Roda)",
    needs: ["wheelchair_access", "flexible_hours", "remote"],
    bio: "Desainer Grafis lepas yang ingin mencari tantangan kerja tetap secara hybrid. Membutuhkan akses gedung ramah kursi roda dan toilet aksesibel.",
    skills: ["Desain Canva", "Adobe Illustrator", "Photoshop", "Desain Media Sosial", "Komunikasi", "Kerjasama Tim"],
    experience: "Freelance Graphic Designer selama 2 Tahun",
    education: "D3 Desain Komunikasi Visual",
    workingStyle: ["independent_work", "team_collaboration", "quiet_environment"],
    targetCareers: ["Junior Graphic Designer", "Content Admin UMKM"],
    location: "Bandung",
    portfolios: [
      { title: "Redesign Landing Page AbleWork", role: "UI/UX Designer", tool: "Figma", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300", link: "https://figma.com" },
      { title: "Desain Poster Edukasi Aksesibilitas", role: "Graphic Designer", tool: "Canva", img: "https://images.unsplash.com/photo-1572044162444-ad60f128bde3?w=300", link: "https://canva.com" }
    ],
    certificates: [
      { title: "Sertifikat Adobe Certified Professional in Visual Design", issuer: "Adobe", date: "Mei 2025", link: "https://adobe.com" }
    ]
  },
  {
    id: "adi",
    name: "Adi",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    disabilityType: "Tuli / Hard of Hearing",
    needs: ["caption_meeting", "chat_communication", "written_instruction", "remote"],
    bio: "Spesialis Customer Support berbasis chat yang berpengalaman merespons komplain pelanggan dengan ramah dan cepat. Berkomunikasi optimal menggunakan teks tertulis.",
    skills: ["Customer Service Chat", "Input Data", "Microsoft Excel", "Email Writing", "Komunikasi", "Problem Solving"],
    experience: "Customer Service Chat Staff di Toko Online (1 Tahun)",
    education: "S1 Sastra Inggris",
    workingStyle: ["structured_task", "written_communication", "quiet_environment"],
    targetCareers: ["Customer Support Chat", "Data Entry Assistant"],
    location: "Surabaya",
    portfolios: [
      { title: "Penanganan 500+ Chat Komplain Pelanggan", role: "Customer Support", tool: "WhatsApp Business", img: "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=300", link: "https://whatsapp.com" }
    ],
    certificates: [
      { title: "Pelatihan Komunikasi Efektif Tertulis", issuer: "AbleWork Academy", date: "Februari 2026", link: "https://ablework.id" }
    ]
  },
  {
    id: "dina",
    name: "Dina",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    disabilityType: "Tidak ada / Lebih suka tidak menyebutkan",
    needs: ["remote", "written_instruction"],
    bio: "Saya seorang profesional administrasi yang teliti, terorganisir, dan berfokus pada hasil. Siap memberikan dukungan operasional terbaik secara remote.",
    skills: ["Data Entry", "Microsoft Office", "Admin Online", "komunikasi", "kerjasama tim"],
    experience: "1 Tahun Pengalaman Kerja",
    education: "S1 Administrasi Perkantoran",
    workingStyle: ["structured_task", "independent_work"],
    targetCareers: ["Admin Online"],
    location: "Jakarta",
    portfolios: [
      { title: "Sistem Arsip Digital Kantor", role: "Administrative Assistant", tool: "Google Drive & Notion", img: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=300", link: "https://notion.so" }
    ],
    certificates: [
      { title: "Sertifikat Kompetensi Administrasi Perkantoran", issuer: "BNSP", date: "Maret 2026", link: "https://bnsp.go.id" }
    ]
  }
];

export const JOBS: Job[] = [
  {
    id: "1",
    title: "Admin Online",
    company: "PT Ruang Inklusif",
    logo: "🏢",
    location: "Jakarta Barat (Bisa Remote)",
    type: "remote",
    salary: "Rp 4.500.000 - Rp 5.500.000",
    defaultMatchScore: 94,
    accommodations: ["remote", "written_instruction", "chat_communication", "flexible_hours"],
    description: "Kami mencari Admin Online yang bertugas mengelola pesanan masuk, membalas chat pelanggan, dan memperbarui stok barang di e-commerce secara berkala. Perusahaan kami berkomitmen penuh menciptakan lingkungan kerja inklusif bagi penyandang disabilitas daksa dan rungu.",
    simpleDescription: "Pekerjaan mengurus toko online. Tugasnya membalas pesan pembeli, mendata barang masuk, dan mengupdate stok produk di aplikasi HP/komputer.",
    tasks: [
      "Membalas chat calon pembeli dengan sopan dan cepat",
      "Memproses pesanan baru ke bagian gudang",
      "Mengupdate stok produk secara berkala di marketplace",
      "Membuat laporan penjualan harian sederhana"
    ],
    simpleTasks: [
      "Membalas pesan pembeli di aplikasi belanja online",
      "Mencatat pesanan baru untuk dikirim",
      "Mengganti jumlah stok barang di toko online",
      "Membuat catatan penjualan setiap hari"
    ],
    requirements: [
      "Mampu berkomunikasi dengan baik melalui teks (chat/email)",
      "Bisa menggunakan komputer, internet, dan Microsoft Excel dasar",
      "Teliti, sabar, dan teratur dalam bekerja",
      "Memiliki laptop dan koneksi internet stabil (bila bekerja remote)"
    ],
    simpleRequirements: [
      "Bisa mengetik pesan chat dan email dengan sopan",
      "Bisa mengoperasikan komputer dan Excel sederhana",
      "Teliti dan rapi dalam bekerja",
      "Punya laptop sendiri dan internet di rumah"
    ],
    facilities: [
      "Kerja 100% dari rumah (Remote)",
      "Pemberian instruksi tugas harian tertulis via Slack/WhatsApp",
      "Wawancara tahap 1 dan 2 murni via chat tertulis",
      "Jam kerja fleksibel selama target harian tercapai"
    ],
    notes: [
      "Tidak memerlukan komunikasi suara/telepon sama sekali.",
      "Tersedia mentor pendamping selama 1 bulan pertama masa kerja."
    ]
  },
  {
    id: "2",
    title: "Junior Graphic Designer",
    company: "Studio Setara",
    logo: "🎨",
    location: "Bandung (Hybrid)",
    type: "hybrid",
    salary: "Rp 5.000.000 - Rp 6.500.000",
    defaultMatchScore: 89,
    accommodations: ["caption_meeting", "wheelchair_access", "flexible_hours"],
    description: "Studio Setara membuka kesempatan bagi Junior Graphic Designer untuk membuat visual kreatif media sosial klien. Kami bekerja secara hybrid (3 hari kantor, 2 hari rumah). Kantor kami dirancang ramah kursi roda dan ramah bagi disabilitas rungu dengan penyediaan sistem transkripsi rapat langsung.",
    simpleDescription: "Pekerjaan membuat gambar dan desain untuk media sosial. Kerja 3 hari di kantor dan 2 hari di rumah. Kantor mudah dilewati kursi roda.",
    tasks: [
      "Merancang aset visual kreatif untuk Instagram, TikTok, dan website klien",
      "Bekerja sama dengan tim konten untuk menyelaraskan konsep visual",
      "Melakukan revisi desain berdasarkan masukan klien",
      "Mengatur tata letak layout presentasi internal"
    ],
    simpleTasks: [
      "Membuat gambar menarik untuk Instagram dan media sosial lainnya",
      "Bekerja sama membuat ide gambar dengan teman kantor",
      "Memperbaiki gambar jika ada yang perlu diganti",
      "Merapikan tampilan presentasi kantor"
    ],
    requirements: [
      "Menguasai Canva, Adobe Illustrator, atau Figma",
      "Memiliki portofolio desain yang menarik (fokus utama seleksi)",
      "Mampu menerima masukan secara positif",
      "Pendidikan minimal SMK/sederajat bidang multimedia atau DKV lebih disukai"
    ],
    simpleRequirements: [
      "Bisa memakai aplikasi Canva, Illustrator, atau Figma",
      "Punya contoh gambar buatan sendiri yang bagus untuk ditunjukkan",
      "Mau mendengarkan masukan untuk perbaikan gambar",
      "Lulusan SMK Multimedia atau DKV disukai"
    ],
    facilities: [
      "Gedung kantor dilengkapi ramp aksesibel, lift khusus, toilet kursi roda",
      "Penyediaan teks otomatis (subtitle) instan di setiap rapat video",
      "Proses lamaran murni berbasis portofolio dan wawancara online",
      "Meja kerja ergonomis yang tingginya dapat disesuaikan"
    ],
    notes: [
      "Perlu konfirmasi akses lift gedung jika menggunakan kursi roda elektrik ukuran besar.",
      "Rapat koordinasi mingguan selalu disertai rangkuman tertulis."
    ]
  },
  {
    id: "3",
    title: "Data Entry Assistant",
    company: "Karya Digital",
    logo: "💻",
    location: "Yogyakarta (Bisa Remote)",
    type: "remote",
    salary: "Rp 3.800.000 - Rp 4.500.000",
    defaultMatchScore: 91,
    accommodations: ["remote", "screen_reader", "flexible_hours", "written_instruction"],
    description: "Kami mencari Data Entry Assistant untuk memasukkan data survei dan informasi produk ke dalam spreadsheet internal. Kami menyambut baik pelamar tunanetra/low vision karena semua aplikasi pendataan kami dioptimalkan penuh untuk software pembaca layar (screen reader).",
    simpleDescription: "Pekerjaan mengetik data ke dalam tabel komputer. Bisa dikerjakan dari rumah. Aplikasi yang dipakai sangat ramah bagi pembaca layar.",
    tasks: [
      "Memasukkan data teks dan angka dari file PDF ke sistem spreadsheet",
      "Melakukan verifikasi kebenaran data yang dimasukkan",
      "Merapikan format data agar mudah dibaca oleh tim analis",
      "Melaporkan jumlah entri data yang diselesaikan setiap minggu"
    ],
    simpleTasks: [
      "Menyalin tulisan dan angka dari dokumen ke tabel Excel",
      "Memeriksa apakah ketikan sudah benar dan tidak ada salah ketik",
      "Membuat tabel data terlihat rapi",
      "Melaporkan hasil ketikan data setiap akhir minggu"
    ],
    requirements: [
      "Kecepatan mengetik yang baik dengan akurasi tinggi",
      "Mampu mengoperasikan Microsoft Excel / Google Sheets",
      "Terbiasa menggunakan screen reader (NVDA/JAWS) jika tunanetra",
      "Disiplin tinggi dan mampu bekerja mandiri tanpa pengawasan konstan"
    ],
    simpleRequirements: [
      "Bisa mengetik cepat dan tidak banyak salah ketik",
      "Bisa memakai Google Sheets atau Excel",
      "Bisa memakai aplikasi suara pembaca layar bagi tunanetra",
      "Bisa disiplin bekerja sendiri dari rumah"
    ],
    facilities: [
      "Kerja 100% remote dari rumah masing-masing",
      "Aplikasi database internal berbasis web yang 100% lolos uji aksesibilitas screen reader",
      "Instruksi panduan input data tersedia dalam format teks Markdown terstruktur",
      "Bimbingan adaptasi teknis selama 2 minggu pertama"
    ],
    notes: [
      "Uji coba kerja awal berupa tes mengetik dengan pembaca layar pilihan Anda sendiri.",
      "Jam kerja bebas diatur, yang penting kuota baris data harian terpenuhi."
    ]
  },
  {
    id: "4",
    title: "Customer Support Chat",
    company: "Layanan Prima",
    logo: "💬",
    location: "Surabaya (Remote)",
    type: "remote",
    salary: "Rp 4.200.000 - Rp 5.000.000",
    defaultMatchScore: 87,
    accommodations: ["remote", "chat_communication", "written_instruction"],
    description: "Layanan Prima membuka lowongan Customer Support khusus penanganan teks (bukan telepon). Anda akan membalas keluhan, memberikan solusi penggunaan produk, dan menampung saran dari pengguna aplikasi kami melalui platform live chat dan e-mail saja.",
    simpleDescription: "Pekerjaan membantu pelanggan yang bertanya atau komplain lewat chat. Tidak ada telepon suara. Semua koordinasi lewat teks.",
    tasks: [
      "Membalas pesan bantuan dari pengguna aplikasi secara ramah",
      "Memberikan solusi langkah-demi-langkah sesuai panduan tertulis",
      "Meneruskan keluhan teknis yang rumit ke tim IT",
      "Mengumpulkan feedback kepuasan pelanggan"
    ],
    simpleTasks: [
      "Membalas chat bantuan dari orang yang kesulitan pakai aplikasi",
      "Kasih petunjuk cara pakai aplikasi sesuai buku panduan",
      "Kirim masalah yang susah ke tim komputer (IT)",
      "Catat apakah pembeli puas dengan bantuan kita"
    ],
    requirements: [
      "Kemampuan menulis pesan bahasa Indonesia yang baik, ramah, dan solutif",
      "Mampu mengetik dengan cepat (multitasking membalas 2-3 chat bersamaan)",
      "Cepat belajar memahami cara kerja aplikasi/sistem web",
      "Lulusan SMA/SMK sederajat diperbolehkan melamar"
    ],
    simpleRequirements: [
      "Bisa menulis kalimat bahasa Indonesia dengan sopan dan ramah",
      "Bisa mengetik cepat sambil membalas beberapa chat sekaligus",
      "Cepat paham cara kerja aplikasi baru",
      "Lulusan SMA atau SMK boleh melamar"
    ],
    facilities: [
      "Kerja dari rumah penuh (Remote)",
      "Semua materi pelatihan dan SOP tersedia dalam modul teks lengkap",
      "Komunikasi koordinasi dengan supervisor 100% via teks",
      "Disediakan template jawaban siap pakai untuk mempermudah pekerjaan"
    ],
    notes: [
      "Sangat cocok untuk penyandang disabilitas rungu / wicara karena tidak ada tugas telepon.",
      "Kontrak awal 6 bulan dengan peluang besar menjadi karyawan tetap."
    ]
  },
  {
    id: "5",
    title: "Content Admin UMKM",
    company: "LokalMart",
    logo: "🛍️",
    location: "Semarang (Remote)",
    type: "remote",
    salary: "Rp 3.500.000 - Rp 4.000.000",
    defaultMatchScore: 85,
    accommodations: ["remote", "written_instruction", "flexible_hours"],
    description: "LokalMart membantu ribuan UMKM memasarkan produk mereka. Kami mencari Content Admin untuk mengupload foto produk, menulis deskripsi singkat produk, dan mengurus posting harian di media sosial toko mitra. Tugas diberikan bertahap dengan deadline mingguan yang longgar.",
    simpleDescription: "Pekerjaan memajang foto produk dan menulis keterangan barang di toko online. Tugasnya santai dengan batas waktu pengumpulan seminggu sekali.",
    tasks: [
      "Mengunggah foto barang dan menulis deskripsi produk UMKM mitra",
      "Membuat jadwal postingan sederhana untuk media sosial",
      "Merapikan foto produk menggunakan template Canva yang sudah disediakan",
      "Berkoordinasi dengan pemilik UMKM terkait kelengkapan info barang"
    ],
    simpleTasks: [
      "Upload foto barang dan tulis penjelasan barang di website jualan",
      "Mengatur kapan postingan gambar akan diupload ke media sosial",
      "Mengedit foto produk secara mudah pakai Canva",
      "Bertanya ke penjual UMKM jika ada info barang yang kurang"
    ],
    requirements: [
      "Mampu menggunakan Canva dasar dan mengupload foto ke web/aplikasi",
      "Bisa merangkai kalimat promosi singkat yang menarik",
      "Teliti dalam menginput data harga dan ukuran produk",
      "Memiliki HP Android/iOS yang memadai atau laptop"
    ],
    simpleRequirements: [
      "Bisa pakai Canva dasar dan upload foto ke internet",
      "Bisa membuat kata-kata promosi jualan yang menarik",
      "Teliti menulis harga barang dan ukuran barang agar tidak salah",
      "Punya HP yang bagus atau laptop untuk bekerja"
    ],
    facilities: [
      "100% kerja dari rumah (Remote)",
      "Tugas diberikan bertahap (step-by-step) dengan instruksi tertulis terperinci",
      "Jadwal kerja sangat fleksibel, bebas menentukan jam kerja harian",
      "Disediakan kuota internet bulanan"
    ],
    notes: [
      "Sangat cocok untuk penyandang neurodivergent (seperti ADHD/Autisme) karena pekerjaan terstruktur rapi dan minim tekanan sosial.",
      "Tersedia forum diskusi komunitas internal antar sesama staf difabel."
    ]
  },
  {
    id: "6",
    title: "Social Media Specialist",
    company: "Kreatif Nusantara",
    logo: "📱",
    location: "Jakarta Selatan (Remote)",
    type: "remote",
    salary: "Rp 5.500.000 - Rp 7.000.000",
    defaultMatchScore: 82,
    accommodations: ["remote", "flexible_hours", "written_instruction", "quiet_environment"],
    description: "Kreatif Nusantara adalah agensi digital yang melayani brand lokal Indonesia. Kami mencari Social Media Specialist yang bertugas membuat strategi konten, menulis caption kreatif, serta menganalisis performa postingan di Instagram, TikTok, dan LinkedIn. Seluruh koordinasi dilakukan secara asinkronus lewat Notion dan Slack.",
    simpleDescription: "Pekerjaan membuat rencana konten dan caption untuk media sosial brand. Semua koordinasi lewat chat tertulis, bisa dikerjakan kapan saja dari rumah.",
    tasks: [
      "Merancang kalender konten bulanan untuk 3-5 klien brand lokal",
      "Menulis caption yang menarik dan sesuai tone of voice tiap klien",
      "Menganalisis statistik engagement postingan tiap minggu",
      "Berkoordinasi dengan tim desainer untuk aset visual konten"
    ],
    simpleTasks: [
      "Membuat jadwal postingan konten setiap bulan untuk beberapa klien",
      "Menulis teks postingan yang sesuai gaya tiap klien",
      "Melihat dan melaporkan seberapa banyak orang menyukai postingan",
      "Minta gambar ke tim desain untuk konten yang dibuat"
    ],
    requirements: [
      "Berpengalaman mengelola akun media sosial brand atau pribadi yang aktif",
      "Kemampuan copywriting bahasa Indonesia yang baik dan kreatif",
      "Familiar dengan Meta Business Suite, TikTok Analytics, atau Hootsuite",
      "Mampu bekerja mandiri dan disiplin memenuhi deadline mingguan"
    ],
    simpleRequirements: [
      "Pernah mengelola akun media sosial dengan konten rutin",
      "Bisa menulis kata-kata promosi yang menarik dan kreatif",
      "Pernah pakai alat analitik media sosial (tidak harus semuanya)",
      "Bisa bekerja sendiri dan tepat waktu"
    ],
    facilities: [
      "Kerja 100% remote, koordinasi via Slack dan Notion",
      "Jam kerja bebas selama target mingguan terpenuhi",
      "Seluruh brief dan panduan klien tersedia dalam dokumen tertulis",
      "Budget iklan bulanan untuk eksperimen konten disediakan klien"
    ],
    notes: [
      "Tidak ada kewajiban hadir rapat tatap muka.",
      "Sangat cocok untuk individu kreatif yang bekerja lebih baik secara mandiri."
    ]
  },
  {
    id: "7",
    title: "Operator Input Data",
    company: "Mitra Solusi Indonesia",
    logo: "🗂️",
    location: "Bekasi (Onsite)",
    type: "onsite",
    salary: "Rp 4.000.000 - Rp 4.800.000",
    defaultMatchScore: 78,
    accommodations: ["wheelchair_access", "written_instruction", "quiet_environment"],
    description: "Mitra Solusi Indonesia membuka posisi Operator Input Data untuk membantu digitalisasi arsip fisik klien korporat. Pelamar akan bekerja di kantor kami di Bekasi yang sudah dilengkapi fasilitas aksesibilitas penuh. Gedung kami memiliki lift, ramp, parkir khusus, dan ruang kerja yang luas dan senyap.",
    simpleDescription: "Pekerjaan mengetik data dari dokumen kertas ke komputer di kantor. Kantor sudah ramah kursi roda dan tenang untuk bekerja.",
    tasks: [
      "Menyalin data dari formulir fisik dan dokumen kertas ke sistem komputer",
      "Memeriksa keakuratan data yang sudah diinput oleh anggota tim lain",
      "Mengarsipkan dokumen fisik sesuai sistem penomoran yang berlaku",
      "Membuat laporan progres harian kepada supervisor"
    ],
    simpleTasks: [
      "Menyalin tulisan dari kertas ke komputer",
      "Memeriksa apakah hasil ketikan orang lain sudah benar",
      "Menyimpan dokumen kertas di tempat yang sudah ditentukan",
      "Melaporkan berapa banyak data sudah diselesaikan hari ini"
    ],
    requirements: [
      "Kecepatan dan ketelitian mengetik data yang baik",
      "Mampu menggunakan Microsoft Word dan Excel dasar",
      "Bisa hadir bekerja di kantor Bekasi (transportasi pribadi atau umum)",
      "Pendidikan minimal SMA/SMK sederajat"
    ],
    simpleRequirements: [
      "Bisa mengetik dengan cepat dan tidak banyak salah",
      "Bisa memakai Microsoft Word dan Excel dasar",
      "Bisa datang ke kantor di Bekasi",
      "Lulusan SMA atau SMK boleh melamar"
    ],
    facilities: [
      "Gedung kantor 4 lantai dengan lift, ramp, dan toilet aksesibel kursi roda",
      "Parkir kendaraan bermotor dan kursi roda tersedia gratis",
      "Ruang kerja ber-AC dengan suasana tenang dan pencahayaan nyaman",
      "Instruksi pekerjaan selalu diberikan secara tertulis dan bertahap"
    ],
    notes: [
      "Sangat ramah untuk penyandang disabilitas fisik (pengguna kursi roda).",
      "Tersedia ruang istirahat khusus dan mushola aksesibel di lantai 1."
    ]
  },
  {
    id: "8",
    title: "Asisten Virtual (Virtual Assistant)",
    company: "NexaBiz Remote",
    logo: "💼",
    location: "Indonesia (Full Remote)",
    type: "remote",
    salary: "Rp 4.500.000 - Rp 6.000.000",
    defaultMatchScore: 88,
    accommodations: ["remote", "written_instruction", "flexible_hours", "chat_communication"],
    description: "NexaBiz Remote adalah perusahaan penyedia layanan virtual assistant untuk klien bisnis skala kecil dan menengah di Indonesia. Asisten Virtual bertugas membantu klien dalam penjadwalan, pengelolaan email, penelitian data ringan, dan koordinasi vendor. Semua pekerjaan dilakukan 100% remote menggunakan alat kolaborasi berbasis teks.",
    simpleDescription: "Pekerjaan membantu pemilik bisnis mengatur jadwal, membalas email, dan mencari informasi. Dilakukan sepenuhnya dari rumah lewat chat dan email.",
    tasks: [
      "Mengelola kalender dan jadwal klien menggunakan Google Calendar",
      "Membalas dan menyortir email bisnis klien sesuai prioritas",
      "Melakukan riset ringan (harga, vendor, kompetitor) dan membuat ringkasannya",
      "Menyiapkan dokumen administrasi sederhana seperti invoice dan laporan ringkas"
    ],
    simpleTasks: [
      "Mengatur jadwal pertemuan klien agar tidak bentrok",
      "Membalas email bisnis klien yang masuk",
      "Mencari informasi harga atau vendor lalu membuat catatannya",
      "Membuat dokumen tagihan dan ringkasan laporan sederhana"
    ],
    requirements: [
      "Kemampuan komunikasi tertulis bahasa Indonesia (dan dasar bahasa Inggris) yang baik",
      "Terbiasa menggunakan Google Workspace (Gmail, Docs, Sheets, Calendar)",
      "Kemampuan multitasking dan manajemen prioritas pekerjaan yang baik",
      "Memiliki koneksi internet stabil dan perangkat yang memadai"
    ],
    simpleRequirements: [
      "Bisa menulis email dan pesan bisnis dengan sopan dan jelas",
      "Bisa memakai Gmail, Google Docs, dan Google Sheets",
      "Bisa mengerjakan banyak hal sekaligus dan tahu mana yang harus dikerjakan dulu",
      "Punya internet dan laptop/komputer yang bagus untuk bekerja"
    ],
    facilities: [
      "Kerja 100% dari rumah, tidak ada kewajiban onsite sama sekali",
      "Semua panduan kerja dan SOP tersedia dalam format dokumen tertulis yang lengkap",
      "Komunikasi dengan supervisor dan klien sepenuhnya via chat (Slack/WhatsApp)",
      "Jam kerja fleksibel, disepakati bersama klien di awal kontrak"
    ],
    notes: [
      "Sangat ideal untuk penyandang disabilitas rungu/wicara karena tidak ada tugas telepon suara.",
      "Juga cocok untuk neurodivergent yang bekerja lebih baik dalam lingkungan terstruktur dan minim interaksi tatap muka."
    ]
  }
];

export const TRAININGS: Training[] = [
  {
    id: "t1",
    title: "Pelatihan Dasar Microsoft Excel & Pengolah Data",
    duration: "12 Jam belajar mandiri",
    format: "Online (Video + Teks)",
    level: "Pemula",
    accessibilityLabels: ["Ada Subtitle", "Materi Teks Lengkap", "Dapat Diakses Screen Reader", "Belajar Mandiri"],
    description: "Pelajari rumus dasar Excel (SUM, AVERAGE, IF), merapikan tabel, dan menyiapkan data untuk kebutuhan administrasi online kantor."
  },
  {
    id: "t2",
    title: "Desain Grafis Praktis dengan Canva & Figma",
    duration: "18 Jam belajar mandiri",
    format: "Online (Video Tutorial)",
    level: "Pemula",
    accessibilityLabels: ["Ada Subtitle", "Tugas Praktik Bertahap", "Jadwal Belajar Bebas"],
    description: "Latihan membuat gambar konten sosial media, infografis, dan mengedit foto produk UMKM menggunakan template siap pakai."
  },
  {
    id: "t3",
    title: "Komunikasi Pelanggan & Customer Service Chat Profesional",
    duration: "8 Jam belajar mandiri",
    format: "Online (Teks & Simulasi)",
    level: "Pemula",
    accessibilityLabels: ["100% Berbasis Teks", "Simulasi Chat Interaktif", "Dapat Diakses Screen Reader"],
    description: "Teknik membalas komplain dengan sopan, penggunaan template jawaban, menyusun kalimat penawaran, dan tata krama chat bisnis."
  },
  {
    id: "t4",
    title: "Strategi Pengelolaan Konten Media Sosial UMKM",
    duration: "15 Jam belajar mandiri",
    format: "Online (Video + PDF)",
    level: "Menengah",
    accessibilityLabels: ["Ada Subtitle", "Materi Ringkasan PDF", "Latihan Mandiri"],
    description: "Belajar membuat kalender konten mingguan, menulis caption jualan (copywriting), dan membaca statistik pengunjung toko online sederhana."
  }
];

export const MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: "m1",
    title: "Komunikasi Disabilitas Rungu / Wicara",
    text: "Sebagai informasi tambahan, saya berkomunikasi secara optimal menggunakan pesan tertulis (chat/email) dan pertemuan online dengan takarir (caption). Saya dapat mengikuti seluruh proses rekrutmen ini secara mandiri dengan akomodasi tersebut."
  },
  {
    id: "m2",
    title: "Komunikasi Disabilitas Fisik (Kursi Roda)",
    text: "Saya merupakan pengguna kursi roda aktif. Agar pengerjaan tugas atau pertemuan onsite berjalan lancar, saya membutuhkan akses gedung kantor yang memiliki ramp/lift aksesibel dan toilet ramah disabilitas fisik."
  },
  {
    id: "m3",
    title: "Komunikasi Neurodivergent (ADHD / Autisme)",
    text: "Saya bekerja secara sangat optimal apabila instruksi kerja dan target harian diberikan secara tertulis dan terperinci. Saya juga sangat menyukai lingkungan kerja dengan tingkat kebisingan rendah untuk menjaga fokus kerja saya."
  }
];

export const getExperienceLevel = (expStr: string): string => {
  const normalized = (expStr || "").toLowerCase();
  if (normalized.includes("3 tahun") || normalized.includes("4 tahun") || normalized.includes("5 tahun") || normalized.includes("3 year") || normalized.includes("4 year") || normalized.includes("5 year") || normalized.includes("menengah")) {
    return "Menengah (3-5 tahun)";
  }
  if (normalized.includes("6 tahun") || normalized.includes("7 tahun") || normalized.includes("8 tahun") || normalized.includes("5+ tahun") || normalized.includes("6 year") || normalized.includes("7 year") || normalized.includes("8 year") || normalized.includes("mahir")) {
    return "Mahir (5+ tahun)";
  }
  return "Pemula (0-2 tahun)";
};

const getJobExperienceLevel = (jobTitle: string): string => {
  const normalized = (jobTitle || "").toLowerCase();
  if (normalized.includes("senior") || normalized.includes("lead") || normalized.includes("manager")) {
    return "Mahir (5+ tahun)";
  }
  if (normalized.includes("mid") || normalized.includes("medium")) {
    return "Menengah (3-5 tahun)";
  }
  return "Pemula (0-2 tahun)";
};

const JOB_REQUIRED_SKILLS: Record<string, string[]> = {
  "1": ["Data Entry", "Microsoft Office", "Admin Online"],
  "2": ["Desain Canva", "Adobe Illustrator", "Photoshop"],
  "3": ["Data Entry", "Microsoft Excel", "Google Sheets"],
  "4": ["Customer Service Chat", "Input Data", "Email Writing"],
  "5": ["Desain Canva", "Social Media", "Data Entry"],
  "6": ["Social Media", "Copywriting", "Desain Canva"],
  "7": ["Data Entry", "Microsoft Office", "Input Data"],
  "8": ["Komunikasi", "Google Workspace", "Admin Online", "Email Writing"]
};

// ─────────────────────────────────────────────────────────────────────────────
// SEMANTIC MATCH HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Checks if two strings are semantically related using:
 * 1. Direct substring containment
 * 2. Shared significant words (≥4 chars)
 */
const semanticContains = (a: string, b: string): boolean => {
  const al = a.toLowerCase().trim();
  const bl = b.toLowerCase().trim();
  if (al.includes(bl) || bl.includes(al)) return true;
  // Word-level overlap: share at least one significant word
  const wordsA = al.split(/\W+/).filter(w => w.length >= 4);
  const wordsB = bl.split(/\W+/).filter(w => w.length >= 4);
  return wordsA.some(wa => wordsB.some(wb => wa.includes(wb) || wb.includes(wa)));
};

/**
 * Synonym / concept expansion map (Indonesian + English).
 * Key = canonical concept; values = synonyms / related terms.
 * Used for skill, portfolio, and career matching.
 */
const CONCEPT_SYNONYMS: Record<string, string[]> = {
  // E-commerce / Online Shop
  "toko online": ["online shop", "e-commerce", "ecommerce", "marketplace", "shopee", "tokopedia", "lazada", "bukalapak", "jualan", "berjualan", "dagang", "perdagangan", "penjualan", "jual beli", "belanja online", "admin online"],
  "admin online": ["toko online", "online shop", "e-commerce", "marketplace", "jualan online", "admin toko", "pengelola toko"],
  "jualan": ["sales", "selling", "penjualan", "berjualan", "dagang", "perdagangan", "toko", "online shop", "marketplace"],

  // Data Entry / Spreadsheet
  "data entry": ["input data", "entri data", "pengisian data", "mengetik data", "spreadsheet", "excel", "google sheets"],
  "microsoft excel": ["excel", "spreadsheet", "google sheets", "tabel", "pengolahan data", "data entry"],
  "microsoft office": ["office", "word", "excel", "powerpoint", "google workspace", "google docs"],
  "google workspace": ["google docs", "google sheets", "google drive", "gmail", "google calendar"],

  // Customer Service / Support
  "customer service": ["customer support", "cs", "layanan pelanggan", "pelayanan pelanggan", "membalas chat", "chat support", "helpdesk"],
  "customer support": ["customer service", "cs", "layanan pelanggan", "membalas chat", "chat support"],

  // Design / Creative
  "desain canva": ["canva", "desain grafis", "graphic design", "konten kreatif", "visual"],
  "desain grafis": ["graphic design", "canva", "illustrator", "photoshop", "figma", "visual design", "desainer"],
  "adobe illustrator": ["illustrator", "ai", "vektor", "vector", "desain logo"],
  "photoshop": ["ps", "adobe ps", "image editing", "edit foto", "foto produk"],
  "figma": ["ui design", "ux design", "wireframe", "prototyping", "web design"],

  // Social Media / Content
  "social media": ["medsos", "instagram", "tiktok", "facebook", "twitter", "linkedin", "konten media sosial", "konten sosmed"],
  "content": ["konten", "social media", "posting", "caption", "copywriting"],
  "copywriting": ["menulis konten", "caption", "teks iklan", "copy", "penulisan kreatif"],

  // Communication / Writing
  "komunikasi": ["komunikasi tertulis", "menulis", "email", "chat", "pesan", "korespondensi"],
  "email writing": ["menulis email", "email bisnis", "korespondensi", "surat resmi"],

  // Admin / Virtual Assistant
  "virtual assistant": ["asisten virtual", "va", "admin", "personal assistant", "remote assistant"],
  "admin": ["administrasi", "tata usaha", "sekretaris", "virtual assistant", "back office"],

  // General soft skills
  "kerjasama tim": ["teamwork", "kolaborasi", "team collaboration", "bekerja tim"],
  "problem solving": ["pemecahan masalah", "analitis", "analytical", "troubleshooting"],
};

/**
 * Expands a term into all its synonyms/related concepts.
 */
const expandConcepts = (term: string): string[] => {
  const tl = term.toLowerCase();
  const expanded = new Set<string>([tl]);
  Object.entries(CONCEPT_SYNONYMS).forEach(([canonical, synonyms]) => {
    const allTerms = [canonical, ...synonyms];
    // If the term matches any member of this group, add all group members
    if (allTerms.some(t => semanticContains(tl, t) || semanticContains(t, tl))) {
      allTerms.forEach(t => expanded.add(t.toLowerCase()));
    }
  });
  return Array.from(expanded);
};

/**
 * Returns a [0..1] semantic similarity score between two string lists.
 * Each item in listA is checked against all expanded forms of listB items.
 */
const semanticListOverlap = (listA: string[], listB: string[]): number => {
  if (listA.length === 0 || listB.length === 0) return 0;
  const expandedB = listB.flatMap(expandConcepts);
  let matched = 0;
  listA.forEach(a => {
    const expandedA = expandConcepts(a);
    const found = expandedA.some(ea => expandedB.some(eb => semanticContains(ea, eb)));
    if (found) matched++;
  });
  return matched / listA.length;
};

/**
 * Builds a searchable text corpus from a job (title + description + tasks + requirements + facilities).
 */
const jobCorpus = (job: Job): string => [
  job.title,
  job.description,
  job.simpleDescription,
  ...(job.tasks || []),
  ...(job.simpleTasks || []),
  ...(job.requirements || []),
  ...(job.simpleRequirements || []),
  ...(job.facilities || []),
  ...(job.notes || []),
].join(" ").toLowerCase();

// ─────────────────────────────────────────────────────────────────────────────
// PORTFOLIO RELEVANCE SCORING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calculates how relevant a user's portfolio is to a job.
 * Checks portfolio title, role, and tool against the job corpus.
 * Returns [0..1].
 */
const portfolioRelevanceScore = (portfolios: PortfolioItem[], job: Job): number => {
  if (!portfolios || portfolios.length === 0) return 0.3; // neutral default
  const corpus = jobCorpus(job);
  let totalScore = 0;

  portfolios.forEach(port => {
    const portTerms = [port.title, port.role, port.tool].join(" ").toLowerCase();
    const portWords = portTerms.split(/\W+/).filter(w => w.length >= 3);
    const expandedPortTerms = portTerms.split(/\s+/).filter(w => w.length >= 3).flatMap(expandConcepts);

    // Direct word hits in corpus
    const directHits = portWords.filter(w => corpus.includes(w)).length;
    const directScore = portWords.length > 0 ? Math.min(directHits / portWords.length, 1) : 0;

    // Semantic / concept hits
    const semanticHit = expandedPortTerms.some(t => corpus.includes(t));
    const semanticBoost = semanticHit ? 0.4 : 0;

    totalScore += Math.min(directScore + semanticBoost, 1.0);
  });

  return Math.min(totalScore / portfolios.length, 1.0);
};

// ─────────────────────────────────────────────────────────────────────────────
// ACCESSIBILITY SEMANTIC MATCHING
// ─────────────────────────────────────────────────────────────────────────────

/** Known standard accommodation keys that are matched exactly */
const STANDARD_NEED_KEYS = [
  "remote", "caption_meeting", "wheelchair_access", "written_instruction",
  "screen_reader", "quiet_environment", "flexible_hours", "chat_communication"
];

/**
 * Maps a custom/non-standard need string to a [0..1] match score against a job.
 * Searches the job corpus for relevant semantic matches.
 */
const customNeedMatchScore = (need: string, job: Job): number => {
  const corpus = jobCorpus(job);
  const expanded = expandConcepts(need);
  // Check if any expanded form appears in job corpus
  const found = expanded.some(t => corpus.includes(t.toLowerCase()));
  if (found) return 1.0;
  // Partial: check individual words of the need
  const words = need.toLowerCase().split(/\W+/).filter(w => w.length >= 4);
  if (words.length === 0) return 0;
  const hits = words.filter(w => corpus.includes(w)).length;
  return hits / words.length;
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCORING FUNCTION
// New weights: 50% Accessibility | 20% Skills | 20% Portfolio | 10% Target Career
// ─────────────────────────────────────────────────────────────────────────────

export const calculateMatchDetails = (
  job: Job,
  persona: Persona | null | undefined,
  selectedNeeds: string[] | null | undefined,
  jobPreferences: any
): {
  score: number;
  skillMatch: boolean;
  accessibilityMatch: boolean;
  workPreferenceMatch: boolean;
  experienceMatch: boolean;
  jobInterestMatch: boolean;
  accessibilityScore: number;
  skillScore: number;
  portfolioScore: number;
  jobInterestScore: number;
} => {
  // ── 1. ACCESSIBILITY (50%) ────────────────────────────────────────────────
  // Use selectedNeeds if explicitly provided (even if empty []) — empty means user cleared all needs.
  // Only fall back to persona?.needs when selectedNeeds is null/undefined (not passed at all).
  const needs = (selectedNeeds !== null && selectedNeeds !== undefined ? selectedNeeds : (persona?.needs ?? [])) ;
  let accessibilityScore = 1.0; // default: no needs declared = full score

  if (needs.length > 0) {
    let totalNeedScore = 0;
    needs.forEach(need => {
      if (STANDARD_NEED_KEYS.includes(need)) {
        // Standard need: exact match against job accommodations
        if (job.accommodations.includes(need)) {
          totalNeedScore += 1.0;
        } else if (
          (job.type === "remote" || job.accommodations.includes("remote")) &&
          (need === "wheelchair_access" || need === "quiet_environment" || need === "flexible_hours")
        ) {
          // Remote jobs implicitly satisfy mobility-/environment-related needs
          totalNeedScore += 0.8;
        } else {
          totalNeedScore += 0;
        }
      } else {
        // Custom need: semantic search in job corpus
        totalNeedScore += customNeedMatchScore(need, job);
      }
    });
    accessibilityScore = totalNeedScore / needs.length;
  }

  const accessibilityMatch = accessibilityScore >= 0.5;

  // ── 2. SKILLS (20%) ───────────────────────────────────────────────────────
  const userSkills = persona?.skills || [];
  const reqSkills = JOB_REQUIRED_SKILLS[job.id] || [];
  let skillScore = 1.0; // default: no required skills = full score

  if (reqSkills.length > 0 && userSkills.length > 0) {
    // Use semantic overlap: each required skill is matched semantically against all user skills
    skillScore = semanticListOverlap(reqSkills, userSkills);
  } else if (reqSkills.length > 0 && userSkills.length === 0) {
    skillScore = 0;
  }

  const skillMatch = skillScore > 0 || reqSkills.length === 0;

  // ── 3. PORTFOLIO (20%) ────────────────────────────────────────────────────
  const portfolios = persona?.portfolios || [];
  const portfolioScore = portfolioRelevanceScore(portfolios, job);
  const workPreferenceMatch = portfolioScore >= 0.3; // legacy field reused for portfolio

  // ── 4. TARGET CAREER (10%) ────────────────────────────────────────────────
  const targetCareers = persona?.targetCareers || [];
  let jobInterestScore = 0.5; // neutral default when empty

  if (targetCareers.length > 0) {
    // Build a set of things to match against: job title + job description words + requirements
    const jobTitleTerms = [job.title];
    const jobDescWords = jobCorpus(job).split(/\s+/).filter(w => w.length >= 4);

    // For each target career, check if it semantically matches the job
    const matchCount = targetCareers.filter(career => {
      const expandedCareer = expandConcepts(career);
      // Check against job title (semantic)
      const titleMatch = expandedCareer.some(ec =>
        jobTitleTerms.some(jt => semanticContains(ec, jt) || semanticContains(jt, ec))
      );
      if (titleMatch) return true;
      // Check against job corpus (broader match)
      const corpusMatch = expandedCareer.some(ec =>
        jobDescWords.some(dw => dw.includes(ec) || ec.includes(dw))
      );
      return corpusMatch;
    }).length;

    jobInterestScore = matchCount > 0 ? Math.min(0.5 + (matchCount / targetCareers.length) * 0.5, 1.0) : 0.15;
  }

  const jobInterestMatch = jobInterestScore >= 0.5;

  // ── FINAL WEIGHTED SCORE ──────────────────────────────────────────────────
  // Weights: Accessibility 50% | Skills 20% | Portfolio 20% | Target Career 10%
  const overallScore =
    (accessibilityScore * 0.50) +
    (skillScore         * 0.20) +
    (portfolioScore     * 0.20) +
    (jobInterestScore   * 0.10);

  const score = Math.round(overallScore * 100);

  // experienceMatch is kept for UI compatibility but no longer affects score
  const userExpStr = persona?.experience || "";
  const userLevel = getExperienceLevel(userExpStr);
  const jobLevel = getJobExperienceLevel(job.title);
  const experienceMatch = userLevel === jobLevel || userLevel === "Mahir (5+ tahun)";

  return {
    score,
    skillMatch,
    accessibilityMatch,
    workPreferenceMatch,
    experienceMatch,
    jobInterestMatch,
    accessibilityScore,
    skillScore,
    portfolioScore,
    jobInterestScore
  };
};

export const calculateMatchScore = (
  job: Job,
  persona: Persona | null | undefined,
  selectedNeeds: string[] | null | undefined,
  jobPreferences: any
): number => {
  if (!persona) return job.defaultMatchScore;
  return calculateMatchDetails(job, persona, selectedNeeds, jobPreferences).score;
};


