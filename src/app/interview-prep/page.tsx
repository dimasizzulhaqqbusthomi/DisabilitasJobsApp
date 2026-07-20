"use client";

import React, { useState } from "react";
import Link from "next/link";
import AppLayout from "../../components/AppLayout";
import { useAppState } from "../../context/AppContext";
import {
  ArrowLeft,
  Briefcase,
  Award,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Lightbulb,
  User,
  Target,
  MessageSquare,
  BookOpen,
  CheckCircle2,
  Mic,
  Heart,
} from "lucide-react";

/* ─── Data Pertanyaan HRD ─── */
const QUESTION_CATEGORIES = [
  {
    id: "personal",
    label: "Tentang Diri",
    color: "indigo",
    icon: <User className="w-4 h-4" />,
    questions: [
      {
        id: "p1",
        q: "Ceritakan tentang diri Anda secara singkat.",
        tip: "Mulai dari latar belakang pendidikan, kemudian pengalaman relevan, lalu apa yang Anda cari. Singkat dan padat, maksimal 2 menit. Jangan lupa sebutkan kekuatan utama Anda yang relevan dengan posisi yang dilamar.",
        example: "Saya lulusan SMK Administrasi Perkantoran dengan pengalaman magang admin 6 bulan. Saya terbiasa menggunakan Google Workspace dan Excel untuk pengelolaan data. Saya mencari posisi admin remote yang memberi saya instruksi kerja tertulis yang jelas.",
      },
      {
        id: "p2",
        q: "Apa kelebihan dan kekurangan Anda?",
        tip: "Untuk kelebihan, pilih yang relevan dengan pekerjaan (misalnya: teliti, terstruktur, komunikator tertulis yang baik). Untuk kekurangan, sebut yang sudah Anda sadari dan sedang Anda perbaiki — hindari kekurangan yang fatal untuk posisi ini.",
        example: "Kelebihan saya adalah sangat teliti dalam input data dan konsisten dalam jadwal kerja. Kekurangan saya adalah terkadang terlalu perfeksionis, namun saya belajar memprioritaskan tugas agar deadline tetap terpenuhi.",
      },
      {
        id: "p3",
        q: "Mengapa Anda tertarik melamar di posisi ini?",
        tip: "Hubungkan keahlian Anda dengan kebutuhan posisi secara spesifik. Tunjukkan Anda sudah riset tentang perusahaan. Sebutkan nilai atau fasilitas aksesibel yang membuat Anda yakin bisa berkontribusi optimal di sini.",
        example: "Saya tertarik karena posisi ini 100% remote dengan instruksi tertulis, yang sangat sesuai dengan cara kerja terbaik saya. Saya juga senang dengan misi perusahaan yang ramah disabilitas dan mendukung karir setara.",
      },
    ],
  },
  {
    id: "skills",
    label: "Kemampuan Kerja",
    color: "emerald",
    icon: <Target className="w-4 h-4" />,
    questions: [
      {
        id: "s1",
        q: "Ceritakan pengalaman atau proyek yang pernah Anda kerjakan.",
        tip: "Gunakan metode STAR: Situasi → Tugas → Aksi → Hasil. Sebutkan proyek nyata (portofolio, magang, pelatihan, tugas mandiri). Fokus pada hasil yang terukur seperti 'menyelesaikan 500 baris data dalam 3 hari'.",
        example: "Di pelatihan AksesKerjaMu, saya menyelesaikan entri 500 baris data produk UMKM menggunakan Google Sheets dalam 3 hari. Hasilnya digunakan untuk laporan bulanan tim dan mendapat penilaian baik dari pembimbing.",
      },
      {
        id: "s2",
        q: "Aplikasi atau alat kerja apa saja yang Anda kuasai?",
        tip: "Sebutkan secara spesifik dan jujur. Bagi menjadi kategori: Office (Word, Excel, Slides), Desain (Canva, Figma), Komunikasi (Slack, WhatsApp Business), atau alat khusus. Tambahkan tingkat keahlian jika perlu.",
        example: "Saya menguasai Google Workspace (Docs, Sheets, Drive) untuk keseharian, Canva untuk desain konten sederhana, dan sudah terbiasa bekerja via Slack dan email bisnis untuk koordinasi tim remote.",
      },
      {
        id: "s3",
        q: "Bagaimana cara Anda mengatur waktu dan prioritas pekerjaan?",
        tip: "Tunjukkan sistem nyata yang Anda gunakan: to-do list, Notion, Google Calendar, atau sistem pribadi lainnya. Sebutkan juga bagaimana Anda menangani deadline mendadak atau perubahan prioritas mendadak.",
        example: "Saya membuat daftar tugas harian di Google Keep setiap pagi, menandai mana yang paling penting dan mendesak. Jika ada perubahan mendadak, saya segera konfirmasi ulang prioritas dengan atasan via chat tertulis.",
      },
    ],
  },
  {
    id: "accessibility",
    label: "Akomodasi Disabilitas",
    color: "violet",
    icon: <Heart className="w-4 h-4" />,
    questions: [
      {
        id: "a1",
        q: "Kondisi kerja seperti apa yang paling mendukung produktivitas Anda?",
        tip: "Ini adalah kesempatan emas untuk menyebutkan kebutuhan akomodasi Anda dengan percaya diri dan profesional. Sampaikan sebagai 'kondisi optimal untuk hasil terbaik', bukan sebagai keterbatasan. Jelaskan juga mengapa kondisi itu membantu Anda.",
        example: "Saya bekerja sangat optimal ketika menerima instruksi tertulis yang jelas dan terperinci, serta berada di lingkungan yang tenang. Kondisi ini membantu saya mempertahankan fokus dan menghasilkan pekerjaan yang teliti dan akurat.",
      },
      {
        id: "a2",
        q: "Apakah ada penyesuaian khusus yang Anda butuhkan dalam proses kerja?",
        tip: "Sampaikan secara spesifik dan solusi-berorientasi. Misalnya: 'Saya perlu instruksi tertulis karena saya lebih mudah memproses informasi lewat teks' atau 'Saya membutuhkan akses lift karena menggunakan kursi roda'. Tunjukkan bahwa penyesuaian ini tidak menghalangi produktivitas.",
        example: "Saya membutuhkan seluruh briefing dan instruksi tugas disampaikan dalam format tertulis (chat/email/dokumen). Dengan cara ini, saya bisa memproses informasi secara optimal dan hasil pekerjaan saya jauh lebih akurat dan konsisten.",
      },
    ],
  },
  {
    id: "situational",
    label: "Situasional",
    color: "amber",
    icon: <Lightbulb className="w-4 h-4" />,
    questions: [
      {
        id: "st1",
        q: "Bagaimana Anda menangani kesalahan atau koreksi dari atasan?",
        tip: "Tunjukkan kedewasaan dan growth mindset. Tidak ada yang sempurna — HRD tahu itu. Yang dinilai adalah bagaimana reaksi Anda: apakah Anda defensif, atau terbuka menerima masukan dan memperbaiki? Gunakan contoh nyata jika ada.",
        example: "Saya menerima koreksi dengan terbuka. Saya langsung mencatat feedbacknya, meminta klarifikasi jika ada yang kurang jelas lewat chat, lalu segera memperbaiki pekerjaan. Bagi saya, koreksi adalah cara tercepat untuk berkembang.",
      },
      {
        id: "st2",
        q: "Apa yang Anda lakukan jika menghadapi tugas yang belum pernah Anda kerjakan?",
        tip: "Tunjukkan inisiatif dan kemandirian. Sebutkan langkah konkret: mencari panduan, bertanya kepada rekan, mencoba sambil belajar. HRD menghargai kandidat yang tidak mudah menyerah dan mau belajar hal baru secara mandiri.",
        example: "Pertama saya baca panduan atau SOP yang tersedia. Jika belum ada, saya cari referensi sendiri online, lalu coba kerjakan. Jika masih ragu, saya tulis pertanyaan spesifik ke atasan via chat agar tidak membuang waktu keduanya.",
      },
    ],
  },
];

/* ─── Color Map ─── */
const COLOR_MAP: Record<string, { bg: string; border: string; text: string; lightBg: string; dot: string }> = {
  indigo: { bg: "bg-indigo-600", border: "border-indigo-200", text: "text-indigo-600", lightBg: "bg-indigo-50", dot: "bg-indigo-500" },
  emerald: { bg: "bg-emerald-600", border: "border-emerald-200", text: "text-emerald-600", lightBg: "bg-emerald-50", dot: "bg-emerald-500" },
  violet: { bg: "bg-violet-600", border: "border-violet-200", text: "text-violet-600", lightBg: "bg-violet-50", dot: "bg-violet-500" },
  amber: { bg: "bg-amber-500", border: "border-amber-200", text: "text-amber-600", lightBg: "bg-amber-50", dot: "bg-amber-500" },
};

export default function InterviewPrepPage() {
  const { showToast } = useAppState();
  const [expandedId, setExpandedId] = useState<string | null>("p1");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const totalQ = QUESTION_CATEGORIES.reduce((acc, c) => acc + c.questions.length, 0);
  const savedCount = Object.keys(saved).filter((k) => saved[k]).length;
  const progressPct = Math.round((savedCount / totalQ) * 100);

  const handleSave = (qId: string) => {
    setSaved((prev) => ({ ...prev, [qId]: true }));
    setExpandedId(null);
    showToast("Draf jawaban tersimpan! ✅", "success");
  };

  return (
    <AppLayout showHeader={false} mainClassName="flex-1 overflow-y-auto bg-brand-bg pb-36">
      <div className="max-w-2xl mx-auto w-full flex flex-col">

        {/* ─── GRADIENT HEADER ─── */}
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-cyan-500 pt-5 pb-5 px-5 text-white shadow-md shadow-indigo-900/5 relative overflow-hidden select-none">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

          <div className="flex items-center justify-between relative z-10 mb-4">
            <Link
              href="/dashboard"
              className="w-10 h-10 rounded-full bg-white/10 border border-white/25 flex items-center justify-center hover:bg-white/20 transition-all shrink-0"
              aria-label="Kembali ke Dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <h1 className="text-base font-extrabold text-white absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
              Persiapan Wawancara
            </h1>
            <div className="w-10 h-10 shrink-0" />
          </div>

          {/* Progress in header */}
          <div className="relative z-10 bg-white/10 rounded-2xl p-3.5 border border-white/15">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-white/80" />
                <span className="text-xs font-bold text-white">Progress Latihan</span>
              </div>
              <span className="text-xs font-black text-white">{savedCount}/{totalQ} Soal</span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-[10px] text-white/70 mt-1.5 font-semibold">
              {savedCount === 0
                ? "Belum ada draf yang disimpan. Mulai latihan sekarang!"
                : savedCount === totalQ
                  ? "🎉 Luar biasa! Semua jawaban sudah siap!"
                  : `${totalQ - savedCount} pertanyaan lagi untuk diselesaikan.`}
            </p>
          </div>
        </div>

        {/* ─── CONTENT ─── */}
        <div className="px-4 pt-4 flex-1 flex flex-col gap-5">

          {/* Intro card */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-3.5 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-black text-indigo-800 mb-0.5">Cara Menggunakan Halaman Ini</p>
              <p className="text-[11px] text-indigo-700 leading-relaxed">
                Baca setiap pertanyaan dan tips menjawabnya, lalu tulis draf jawaban Anda di kolom yang tersedia. Simpan setiap jawaban untuk melacak kesiapan Anda sebelum wawancara.
              </p>
            </div>
          </div>

          {/* Question Categories */}
          {QUESTION_CATEGORIES.map((cat) => {
            const c = COLOR_MAP[cat.color];
            return (
              <div key={cat.id} className="space-y-2.5">
                {/* Category Header */}
                <div className="flex items-center gap-2 px-1">
                  <div className={`w-6 h-6 rounded-lg ${c.bg} flex items-center justify-center text-white shrink-0`}>
                    {cat.icon}
                  </div>
                  <h2 className="text-xs font-black text-slate-700 uppercase tracking-wide">{cat.label}</h2>
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className={`text-[10px] font-bold ${c.text} ${c.lightBg} px-2 py-0.5 rounded-full border ${c.border}`}>
                    {cat.questions.length} Pertanyaan
                  </span>
                </div>

                {/* Questions */}
                {cat.questions.map((q, qi) => {
                  const isExpanded = expandedId === q.id;
                  const isSaved = saved[q.id];
                  return (
                    <div
                      key={q.id}
                      className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${isExpanded ? `${c.border} shadow-md` : "border-slate-100"
                        }`}
                    >
                      {/* Question Row */}
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : q.id)}
                        className="w-full p-4 flex items-start gap-3 text-left"
                      >
                        {/* Number / check */}
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 transition-all ${isSaved
                          ? "bg-emerald-500 text-white"
                          : isExpanded
                            ? `${c.bg} text-white`
                            : "bg-slate-100 text-slate-500"
                          }`}>
                          {isSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : qi + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-bold leading-snug ${isSaved ? "text-slate-400 line-through" : "text-slate-800"}`}>
                            {q.q}
                          </p>
                          {isSaved && (
                            <span className="text-[10px] text-emerald-600 font-semibold">✓ Draf tersimpan</span>
                          )}
                        </div>
                        {isExpanded
                          ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />}
                      </button>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="px-4 pb-4 space-y-3 border-t border-slate-50 pt-3">
                          {/* Tips */}
                          <div className={`${c.lightBg} border ${c.border} rounded-xl p-3 flex gap-2.5`}>
                            <Sparkles className={`w-4 h-4 ${c.text} shrink-0 mt-0.5`} />
                            <div>
                              <p className={`text-[10px] font-black ${c.text} mb-1`}>💡 Tips Menjawab:</p>
                              <p className="text-[11px] text-slate-600 leading-relaxed">{q.tip}</p>
                            </div>
                          </div>

                          {/* Example answer */}
                          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                            <p className="text-[10px] font-black text-slate-500 mb-1.5">📝 Contoh Jawaban:</p>
                            <p className="text-[11px] text-slate-600 leading-relaxed">"{q.example}"</p>
                          </div>

                          {/* Draft textarea */}
                          <div>
                            <label htmlFor={`draft-${q.id}`} className="block text-[10px] font-black text-slate-500 mb-1.5">
                              ✍️ Tulis Draf Jawaban Anda:
                            </label>
                            <textarea
                              id={`draft-${q.id}`}
                              value={drafts[q.id] || ""}
                              onChange={(e) => setDrafts((prev) => ({ ...prev, [q.id]: e.target.value }))}
                              placeholder="Tulis jawaban Anda sendiri di sini berdasarkan pengalaman Anda..."
                              rows={4}
                              className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 resize-none leading-relaxed placeholder:text-slate-300"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSave(q.id)}
                            disabled={!drafts[q.id]?.trim()}
                            className={`w-full py-2.5 rounded-xl text-xs font-black transition-all ${drafts[q.id]?.trim()
                              ? `${c.bg} text-white shadow-md hover:opacity-90`
                              : "bg-slate-100 text-slate-400 cursor-not-allowed"
                              }`}
                          >
                            {drafts[q.id]?.trim() ? "Simpan Draf Jawaban ✅" : "Tulis jawaban dahulu..."}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Tips Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-2xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4" />
              <p className="text-xs font-black">Tips Hari Wawancara</p>
            </div>
            <ul className="space-y-1.5">
              {[
                "Cek koneksi internet & perangkat 30 menit sebelum mulai",
                "Siapkan dokumen CV & Profil Kerja di tab terpisah",
                "Beritahu HRD kebutuhan akomodasi Anda di awal percakapan",
                "Berbicara perlahan dan jelas - HRD menghargai kejujuran",
                "Tidak apa-apa meminta waktu sejenak untuk berpikir",
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-white/90">
                  <span className="text-white font-black shrink-0">→</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>
    </AppLayout>
  );
}
