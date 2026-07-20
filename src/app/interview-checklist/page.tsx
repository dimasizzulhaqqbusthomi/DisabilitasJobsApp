"use client";

import React, { useState } from "react";
import { useAppState } from "../../context/AppContext";
import { useAccessibility } from "../../context/AccessibilityContext";
import AppLayout from "../../components/AppLayout";
import { 
  CheckSquare, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  CheckCircle,
  MessageSquare,
  Sparkles
} from "lucide-react";

export default function InterviewChecklistPage() {
  const { showToast } = useAppState();
  const { simpleLanguage } = useAccessibility();

  // Checklist items
  const [checklist, setChecklist] = useState([
    { id: "c1", label: "Dokumen CV pendukung sudah siap", checked: true },
    { id: "c2", label: "Profil Kerja sudah di-update & di-download", checked: true },
    { id: "c3", label: "Pesan akomodasi sudah ditulis & disalin", checked: false },
    { id: "c4", label: "Tautan platform video call (Zoom/Meet) sudah dicoba", checked: false },
    { id: "c5", label: "Headset / Webcam / Screen Reader sudah menyala stabil", checked: false },
    { id: "c6", label: "Nomor kontak HRD/Rekruter sudah disimpan", checked: false },
    { id: "c7", label: "Simulasi draf jawaban wawancara sudah dibaca", checked: false },
  ]);

  // Question simulation answers
  const [answers, setAnswers] = useState({
    q1: "",
    q2: "",
    q3: "",
  });

  // Expanded questions state
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>("q1");

  const handleCheck = (id: string) => {
    setChecklist(prev => {
      const next = prev.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      );
      // count completed
      const completedCount = next.filter(i => i.checked).length;
      if (completedCount === next.length) {
        showToast("Luar biasa! Persiapan wawancara Anda sudah 100% matang!", "success");
      }
      return next;
    });
  };

  const completedCount = checklist.filter(c => c.checked).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  const questions = [
    { 
      id: "q1", 
      q: "Ceritakan kemampuan utama kamu", 
      tip: "Fokuskan jawaban Anda pada skill spesifik yang tertera di Profil Kerja Anda. Sebutkan portofolio Canva, Excel, atau Chat Support yang pernah Anda buat meskipun itu hasil dari pelatihan mandiri.",
      placeholder: "Contoh: Saya memiliki keahlian dalam data entry menggunakan Google Sheets dan Excel, serta terbiasa mengedit foto menggunakan Canva..."
    },
    { 
      id: "q2", 
      q: "Kebutuhan kerja seperti apa yang membuat kamu produktif?", 
      tip: "Gunakan kesempatan ini untuk menerangkan akomodasi disabilitas Anda dengan percaya diri. Sampaikan secara sopan seperti: 'Saya bekerja sangat optimal dengan panduan instruksi tertulis dan lingkungan yang hening...'",
      placeholder: "Contoh: Agar dapat bekerja maksimal, saya membutuhkan instruksi tugas tertulis dan lingkungan kerja yang tenang..."
    },
    { 
      id: "q3", 
      q: "Contoh pekerjaan atau pengalaman yang pernah kamu lakukan?", 
      tip: "Sebutkan proyek latihan, tugas sekolah/kuliah, magang, atau pelatihan mandiri di AksesKerjaMu Academy yang berhasil Anda selesaikan. Fokus pada hasil nyata yang berhasil Anda capai.",
      placeholder: "Contoh: Di pelatihan AksesKerjaMu, saya menyelesaikan entri 500 baris data produk dan membuat template spanduk promosi toko..."
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black">Persiapan & Checklist Wawancara</h1>
          <p className="text-sm text-brand-fg/70">
            Panduan lengkap kesiapan wawancara kerja Anda serta sarana draf jawaban simulasi pertanyaan HRD.
          </p>
        </div>

        {/* Top Progress bar card */}
        <div className="p-6 rounded-3xl border border-brand-border bg-brand-card shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
            <h2 className="font-extrabold text-sm flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-brand-primary" />
              <span>Progress Kesiapan Wawancara</span>
            </h2>
            <span className="text-xs font-bold text-brand-primary">{completedCount} dari {checklist.length} Tugas Selesai ({progressPercent}%)</span>
          </div>

          <div className="w-full h-3 bg-brand-border rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-primary transition-all duration-500 rounded-full" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Double Column content */}
        <div className="grid lg:grid-cols-5 gap-6 items-start">
          
          {/* Left Checklist (3 cols) */}
          <div className="lg:col-span-3 p-6 rounded-3xl border border-brand-border bg-brand-card space-y-4">
            <h3 className="text-base font-extrabold text-brand-fg">Checklist Kelengkapan</h3>
            
            <div className="divide-y divide-brand-border">
              {checklist.map((item) => (
                <label 
                  key={item.id} 
                  className={`flex items-start gap-3 py-3 cursor-pointer select-none transition-all ${
                    item.checked ? "text-brand-fg/60" : "text-brand-fg font-semibold"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => handleCheck(item.id)}
                    className="w-5 h-5 rounded border-zinc-300 text-brand-primary focus:ring-brand-primary mt-0.5"
                  />
                  <span className="text-xs sm:text-sm leading-tight pt-0.5">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Right Simulation Questions (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-base font-extrabold text-brand-fg flex items-center gap-1.5">
              <BookOpen className="w-5 h-5 text-brand-primary" />
              <span>Simulasi Pertanyaan HRD</span>
            </h3>

            <div className="space-y-3">
              {questions.map((question) => {
                const isExpanded = expandedQuestion === question.id;
                return (
                  <div 
                    key={question.id}
                    className="border border-brand-border rounded-2xl bg-brand-card overflow-hidden transition-all hover:border-brand-primary/30"
                  >
                    {/* Header */}
                    <button
                      onClick={() => setExpandedQuestion(isExpanded ? null : question.id)}
                      className="w-full p-4 flex justify-between items-center text-left hover:bg-black/5"
                      type="button"
                    >
                      <span className="text-xs font-extrabold text-brand-fg">{question.q}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />}
                    </button>

                    {/* Content */}
                    {isExpanded && (
                      <div className="p-4 bg-brand-bg/50 border-t border-brand-border space-y-3">
                        {/* Tips alert box */}
                        <div className="p-3 rounded-xl bg-brand-primary-light/50 border border-brand-primary/10 text-[10px] text-brand-fg leading-relaxed flex gap-2">
                          <Sparkles className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-brand-primary block mb-0.5">Tips Menjawab:</span>
                            <span>{question.tip}</span>
                          </div>
                        </div>

                        {/* Textbox Draft */}
                        <div className="space-y-1">
                          <label htmlFor={`draft-${question.id}`} className="block text-[10px] font-bold text-zinc-400">Tulis Draf Jawaban Anda</label>
                          <textarea
                            id={`draft-${question.id}`}
                            value={answers[question.id as keyof typeof answers]}
                            onChange={(e) => setAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
                            placeholder={question.placeholder}
                            rows={3}
                            className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-card text-xs focus:border-brand-primary focus:ring-brand-primary"
                          />
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              showToast("Draf jawaban berhasil disimpan!", "success");
                              setExpandedQuestion(null);
                            }}
                            className="px-3.5 py-1.5 rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white text-[10px] font-bold transition-all"
                            type="button"
                          >
                            Simpan Jawaban
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </AppLayout>
  );
}
