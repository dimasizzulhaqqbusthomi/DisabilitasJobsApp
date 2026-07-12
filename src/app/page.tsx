"use client";

import Link from "next/link";
import AppLayout from "../components/AppLayout";
import { 
  Briefcase, 
  UserCheck, 
  HelpCircle, 
  ShieldCheck, 
  CheckCircle,
  Accessibility, 
  Eye, 
  VolumeX, 
  MessageSquare,
  ArrowRight
} from "lucide-react";
import { useAccessibility } from "../context/AccessibilityContext";

export default function LandingPage() {
  const { simpleLanguage } = useAccessibility();

  return (
    <AppLayout showNav={false}>
      {/* Top Simple Header */}
      <header className="py-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between w-full border-b border-brand-border/40">
        <Link href="/" className="flex items-center gap-2 text-2xl font-black text-brand-primary">
          <div className="p-1.5 bg-brand-primary text-white rounded-lg">
            <Accessibility className="w-6 h-6" />
          </div>
          <span>Able<span className="text-brand-secondary">Work</span></span>
        </Link>
        <Link 
          href="/onboarding" 
          className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-bold shadow-md shadow-brand-primary/10 transition-all"
        >
          Masuk Aplikasi
        </Link>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 max-w-5xl mx-auto text-center px-4 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary-light/50 border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" /> Subtema: Akses Ketenagakerjaan yang Setara & Inklusif
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight text-brand-fg">
          AksesKerjaMu membantu pencari kerja difabel menemukan lowongan dan proses rekrutmen yang lebih inklusif.
        </h1>
        
        <p className="text-lg md:text-xl text-brand-fg/70 max-w-3xl mx-auto">
          {simpleLanguage 
            ? "AksesKerjaMu membantu Anda mencari pekerjaan dan melamar dengan mudah sesuai dengan kondisi atau kebutuhan Anda."
            : "Platform pencarian kerja pertama yang berfokus pada kecocokan akomodasi aksesibilitas (inclusive job matching) untuk membantu penyandang disabilitas berkarir secara mandiri dan setara."
          }
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <Link 
            href="/onboarding" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-brand-primary hover:bg-brand-primary-hover text-white text-base font-extrabold shadow-lg shadow-brand-primary/25 transition-all group"
          >
            <span>Mulai Cari Kerja</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/profil-kerja" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-brand-border bg-brand-card hover:bg-black/5 text-base font-extrabold transition-all"
          >
            <span>Buat Profil Kerja</span>
          </Link>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-12 border-t border-brand-border/40">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center space-y-2 mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-brand-fg">Masalah Utama Dunia Kerja Saat Ini</h2>
            <p className="text-sm text-brand-fg/70 max-w-xl mx-auto">
              Mengapa mencari pekerjaan bagi penyandang disabilitas sangat penuh rintangan?
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-brand-border bg-brand-card space-y-4">
              <div className="p-3 bg-brand-danger-light/50 text-brand-danger w-fit rounded-xl">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Aksesibilitas Tidak Dijelaskan</h3>
              <p className="text-sm text-brand-fg/70">
                Lowongan kerja sering kali tidak menjelaskan akomodasi fisik maupun non-fisik yang tersedia di kantor.
              </p>
            </div>
            
            <div className="p-6 rounded-2xl border border-brand-border bg-brand-card space-y-4">
              <div className="p-3 bg-brand-danger-light/50 text-brand-danger w-fit rounded-xl">
                <Accessibility className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">Uji Seleksi Tidak Fleksibel</h3>
              <p className="text-sm text-brand-fg/70">
                Format wawancara dan tes kerja sering kali tidak ramah bagi penyandang disabilitas netra, rungu, maupun neurodivergent.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-brand-border bg-brand-card space-y-4">
              <div className="p-3 bg-brand-danger-light/50 text-brand-danger w-fit rounded-xl">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">CV Kaku Tanpa Portofolio</h3>
              <p className="text-sm text-brand-fg/70">
                CV konvensional menyulitkan penyandang disabilitas yang memiliki keterampilan luar biasa namun tidak punya riwayat kerja formal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-12 bg-brand-primary-light/10 border-t border-b border-brand-border/40">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-brand-fg">Solusi Inovatif AksesKerjaMu</h2>
            <p className="text-sm text-brand-fg/70 max-w-xl mx-auto">
              Bagaimana AksesKerjaMu memecahkan rintangan dan menyetarakan akses ketenagakerjaan?
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Kecocokan Kerja Aksesibel", desc: "Mencocokkan kebutuhan disabilitas Anda dengan akomodasi kerja secara otomatis menggunakan kalkulator Kecocokan Kerja." },
              { title: "Filter Akomodasi Pintar", desc: "Mencari kerja khusus berdasarkan kriteria seperti: kursi roda, bantuan teks rapat, jam kerja fleksibel, atau remote." },
              { title: "Profil Kerja Inklusif", desc: "Profil kerja alternatif yang menonjolkan keterampilan siap kerja dan portofolio praktis alih-alih CV formal." },
              { title: "Template Pesan Akses", desc: "Menyediakan pesan otomatis untuk mengomunikasikan kebutuhan akomodasi Anda kepada HRD secara sopan saat melamar." },
              { title: "Checklist Persiapan Interview", desc: "Membantu kesiapan wawancara kerja Anda dengan checklist kelengkapan dan simulasi pertanyaan." }
            ].map((sol, index) => (
              <div key={index} className="p-6 rounded-2xl bg-brand-card border border-brand-border flex gap-4">
                <CheckCircle className="text-brand-accent w-6 h-6 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-brand-fg">{sol.title}</h3>
                  <p className="text-xs text-brand-fg/70">{sol.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Persona Section */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center space-y-2 mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-brand-fg">Dirancang untuk Semua Kebutuhan</h2>
            <p className="text-sm text-brand-fg/70 max-w-xl mx-auto">
              AksesKerjaMu memprioritaskan ragam aksesibilitas untuk berbagai profil pengguna.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Kursi Roda & Fisik", icon: Accessibility, desc: "Fokus pada ramah ramp gedung, lift aksesibel, toilet disabilitas, dan opsi kerja hybrid." },
              { name: "Tuli & Rungu", icon: MessageSquare, desc: "Fokus pada komunikasi chat/email, rapat video ber-caption, dan instruksi tertulis." },
              { name: "Tunanetra / Low Vision", icon: Eye, desc: "Fokus pada antarmuka kontras tinggi, label suara, dan kompabilitas penuh screen reader." },
              { name: "Neurodivergent / ADHD", icon: VolumeX, desc: "Fokus pada lingkungan minim bising, jam kerja fleksibel, dan panduan kerja terstruktur." }
            ].map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={idx} className="p-5 rounded-2xl border border-brand-border bg-brand-card text-center space-y-3">
                  <div className="p-3 bg-brand-primary-light/50 text-brand-primary w-fit mx-auto rounded-xl">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-brand-fg">{p.name}</h3>
                  <p className="text-xs text-brand-fg/75">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-8 border-t border-brand-border/40 mt-auto bg-brand-card text-center text-xs text-brand-fg/50 space-y-2">
        <p className="font-bold text-brand-primary">AksesKerjaMu © 2026. Lomba UI/UX: “Designing Without Barriers”</p>
        <p>Tagline: “Work Without Barriers” — Subtema: Akses Ketenagakerjaan yang Setara & Inklusif</p>
      </footer>
    </AppLayout>
  );
}
