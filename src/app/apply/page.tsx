"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppState } from "../../context/AppContext";
import { useAccessibility } from "../../context/AccessibilityContext";
import { useAuth } from "../../context/AuthContext";
import { JOBS, MESSAGE_TEMPLATES } from "../../data/mockData";
import AppLayout from "../../components/AppLayout";
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  FileText, 
  MessageSquare, 
  Send, 
  UserCheck,
  Briefcase,
  MapPin,
  GraduationCap,
  Star,
  X,
  Heart
} from "lucide-react";

const FEEDBACK_FEATURES = [
  { id: "recommendation", label: "Rekomendasi pekerjaan sesuai" },
  { id: "accessibility",  label: "Informasi aksesibilitas" },
  { id: "skill_passport", label: "Skill Passport" },
  { id: "apply_easy",    label: "Proses melamar mudah" },
];

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110 active:scale-95"
          aria-label={`Beri ${i} bintang`}
        >
          <Star
            className={`w-8 h-8 transition-colors ${
              i <= (hovered || value)
                ? "fill-amber-400 text-amber-400"
                : "text-slate-200 fill-slate-200"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

/* ─── helper: get company initials (no emoji logo) ─── */
const getCompanyInitials = (company: string): string => {
  return company
    .replace(/^PT\s+/i, "")
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

function ApplyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentPersona, applyForJob, showToast } = useAppState();
  const { user } = useAuth();
  const { simpleLanguage } = useAccessibility();

  // Feedback modal state
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackStar, setFeedbackStar] = useState(0);
  const [feedbackFeatures, setFeedbackFeatures] = useState<string[]>([]);
  const [feedbackNote, setFeedbackNote] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackDone, setFeedbackDone] = useState(false);
  const [appliedJobTitle, setAppliedJobTitle] = useState("");

  const toggleFeature = (id: string) => {
    setFeedbackFeatures(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleSkipFeedback = () => {
    router.push("/applications");
  };

  const handleSubmitFeedback = async () => {
    setFeedbackSubmitting(true);
    try {
      const { createClient } = await import("../../lib/supabase/client");
      const supabase = createClient();
      await supabase.from("app_feedback").insert({
        user_id: user?.id ?? null,
        rating: feedbackStar,
        helpful_features: feedbackFeatures,
        note: feedbackNote.trim(),
        job_title: appliedJobTitle,
      });
    } catch (err) {
      console.error("Failed to save feedback:", err);
    } finally {
      setFeedbackSubmitting(false);
      setFeedbackDone(true);
      setTimeout(() => router.push("/applications"), 1200);
    }
  };

  // Selected job details
  const jobIdFromQuery = searchParams ? searchParams.get("jobId") : null;
  const [selectedJobId, setSelectedJobId] = useState<string>(jobIdFromQuery || JOBS[0].id);
  const activeJob = JOBS.find(j => j.id === selectedJobId) || JOBS[0];

  const [step, setStep] = useState(1);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(MESSAGE_TEMPLATES[0].id);
  
  // Custom cover message
  const [customMessage, setCustomMessage] = useState(MESSAGE_TEMPLATES[0].text);

  // Sync custom text when template ID changes
  useEffect(() => {
    if (selectedTemplateId) {
      const template = MESSAGE_TEMPLATES.find(t => t.id === selectedTemplateId);
      if (template) {
        setCustomMessage(template.text);
      }
    }
  }, [selectedTemplateId]);

  const handleTemplateSelect = (id: string) => {
    if (selectedTemplateId === id) {
      // Toggle off / Unselect
      setSelectedTemplateId("");
      setCustomMessage("");
    } else {
      setSelectedTemplateId(id);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setCustomMessage(val);
    
    // Unselect template if the text is edited and no longer matches
    const activeTemplate = MESSAGE_TEMPLATES.find(t => t.id === selectedTemplateId);
    if (activeTemplate && activeTemplate.text !== val) {
      setSelectedTemplateId("");
    }
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // 1. Register application in state
      applyForJob(activeJob.id, customMessage);
      setAppliedJobTitle(activeJob.title);

      // 2. Auto-send intro message to recruiter in chat
      const introMsg = `Halo! Saya baru saja mengirimkan lamaran untuk posisi **${activeJob.title}** di **${activeJob.company}**. Saya sangat tertarik dan berharap dapat berdiskusi lebih lanjut mengenai peluang ini. Terima kasih!`;

      if (user) {
        try {
          const { createClient } = await import("../../lib/supabase/client");
          const supabase = createClient();
          await supabase.from("chat_messages").insert({
            user_id: user.id,
            recruiter_id: activeJob.id,
            sender: "user",
            message: introMsg,
          });
        } catch (err) {
          console.error("Failed to send auto chat message:", err);
        }
      } else {
        const key = `chat-local-${activeJob.id}`;
        const existing = JSON.parse(localStorage.getItem(key) || "[]");
        existing.push({ sender: "user", text: introMsg, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) });
        localStorage.setItem(key, JSON.stringify(existing));
      }

      showToast("Lamaran berhasil dikirim! Pesan otomatis ke HRD telah terkirim.", "success");
      // Show feedback modal instead of immediately redirecting
      setShowFeedback(true);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.push(`/jobs/${activeJob.id}`);
    }
  };

  return (
    <>
    {/* ═══ FEEDBACK OVERLAY ═══ */}
    {showFeedback && (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-end bg-black/40 backdrop-blur-sm px-4 pb-6">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
          
          {feedbackDone ? (
            /* ── Success state ── */
            <div className="p-8 flex flex-col items-center gap-3 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <Heart className="w-8 h-8 text-emerald-500 fill-emerald-500" />
              </div>
              <h3 className="text-base font-black text-brand-fg">Terima Kasih!</h3>
              <p className="text-xs text-slate-400 font-medium">Feedback kamu sangat berarti untuk AbleWork 🙌</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="relative bg-gradient-to-br from-[#4f46e5] via-[#4338ca] to-[#06b6d4] p-5 text-white">
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
                <button
                  onClick={handleSkipFeedback}
                  className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-all"
                  aria-label="Lewati"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-full bg-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs font-black text-white/80">Lamaran berhasil dikirim</span>
                </div>
                <h2 className="text-base font-black leading-snug">Bagaimana pengalaman kamu menggunakan AbleWork?</h2>
              </div>

              {/* Body */}
              <div className="p-5 space-y-5">
                {/* Star Rating */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Beri Penilaian</p>
                  <StarRating value={feedbackStar} onChange={setFeedbackStar} />
                </div>

                {/* Feature Checkboxes */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Apa yang paling membantu?</p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {FEEDBACK_FEATURES.map(f => {
                      const active = feedbackFeatures.includes(f.id);
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => toggleFeature(f.id)}
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                            active
                              ? "border-indigo-400 bg-indigo-50 ring-1 ring-indigo-400/20"
                              : "border-slate-100 bg-slate-50 hover:bg-slate-100"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                            active
                              ? "bg-indigo-500 border-indigo-500 text-white"
                              : "bg-white border-slate-200 text-transparent"
                          }`}>
                            <Check className="w-3 h-3" />
                          </div>
                          <span className={`text-xs font-bold ${ active ? "text-indigo-700" : "text-slate-500" }`}>
                            {f.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label htmlFor="feedback-note" className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Masukan (opsional)</label>
                  <textarea
                    id="feedback-note"
                    value={feedbackNote}
                    onChange={e => setFeedbackNote(e.target.value)}
                    rows={3}
                    placeholder="Tuliskan saran atau masukanmu..."
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-brand-fg placeholder:text-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none leading-relaxed resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={handleSkipFeedback}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-xs font-black hover:bg-slate-50 transition-all"
                  >
                    Lewati
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitFeedback}
                    disabled={feedbackStar === 0 || feedbackSubmitting}
                    className="flex-2 flex-[2] py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:from-indigo-700 hover:to-indigo-600"
                  >
                    {feedbackSubmitting ? (
                      <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Kirim Feedback
                      </>
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    )}

    <AppLayout
      showHeader={false}
      mainClassName="flex-1 flex flex-col overflow-hidden bg-brand-bg pb-16"
    >
      {/* ══════════════════════════════════════════
          SCROLLABLE CONTENT AREA
      ══════════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        
        {/* ── GRADIENT HERO HEADER ── */}
        <div className="relative bg-gradient-to-br from-[#4f46e5] via-[#4338ca] to-[#06b6d4] pt-10 pb-16 px-5 overflow-hidden shadow-lg">
          {/* decorative orbs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute top-4 right-20 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute bottom-10 left-[-20px] w-32 h-32 rounded-full bg-cyan-400/10 pointer-events-none" />

          {/* Top row: back button + label */}
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <button
              onClick={handleBack}
              className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 transition-all text-white shrink-0"
              aria-label="Kembali"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-white/70 text-xs font-semibold tracking-wide">Proses Lamaran</span>
          </div>

          {/* Title Row */}
          <div className="relative z-10">
            <h1 className="text-xl font-black text-white leading-snug mb-1">Kirim Lamaran Kerja</h1>
            <p className="text-white/70 text-xs leading-relaxed max-w-sm">
              Melamar secara inklusif dengan melampirkan Skill Passport digital Anda dan pesan akomodasi.
            </p>
          </div>
        </div>

        {/* ── MAIN CONTENT (overlaps gradient header) ── */}
        <div className="relative z-10 px-4 -mt-8 space-y-4 max-w-lg mx-auto w-full pb-6">
          
          {/* Stepper Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-5 py-4">
            <div className="flex items-center justify-between relative max-w-xs mx-auto py-1">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0 rounded-full" />
              <div 
                className="absolute top-1/2 left-0 h-0.5 bg-indigo-500 -translate-y-1/2 z-0 transition-all duration-300 rounded-full" 
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              />

              {[1, 2, 3].map((s) => {
                const isCompleted = step > s;
                const isActive = step === s;
                return (
                  <div key={s} className="z-10 flex flex-col items-center gap-1">
                    <div 
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs border transition-all ${
                        isCompleted 
                          ? "bg-emerald-500 border-emerald-500 text-white" 
                          : isActive 
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-md ring-4 ring-indigo-50" 
                            : "bg-white border-slate-200 text-slate-400"
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : s}
                    </div>
                    <span className={`text-[9px] font-black ${isActive ? "text-indigo-600" : "text-slate-400"}`}>
                      {s === 1 ? "Passport" : s === 2 ? "Akomodasi" : "Kirim"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Step Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
            
            {/* ── STEP 1: PASSPORT PREVIEW ── */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xs font-black text-indigo-600 uppercase tracking-wider">Tahap 1: Konfirmasi Skill Passport</h2>
                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-0.5">
                    Informasi profil &amp; skill Anda akan dilampirkan secara otomatis ke pihak perusahaan.
                  </p>
                </div>

                {/* Job Info Selector */}
                {!jobIdFromQuery ? (
                  <div className="space-y-1">
                    <label htmlFor="apply-job-select" className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Melamar untuk Posisi</label>
                    <select
                      id="apply-job-select"
                      value={selectedJobId}
                      onChange={(e) => setSelectedJobId(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs font-bold text-brand-fg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    >
                      {JOBS.map(j => (
                        <option key={j.id} value={j.id}>{j.title} ({j.company})</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center text-xs font-black text-indigo-600 uppercase select-none shrink-0 shadow-sm">
                        {getCompanyInitials(activeJob.company)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-black text-xs text-brand-fg truncate">{activeJob.title}</div>
                        <div className="text-[10px] font-semibold text-slate-400 truncate">{activeJob.company}</div>
                      </div>
                    </div>
                    <span className="text-[9px] font-black bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-full uppercase shrink-0">
                      {activeJob.type}
                    </span>
                  </div>
                )}

                {/* Passport Card Preview */}
                <div className="border border-indigo-100 rounded-xl bg-indigo-50/20 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-3 flex items-center gap-3 text-white">
                    <img 
                      src={currentPersona.avatar} 
                      alt="" 
                      className="w-10 h-10 rounded-full object-cover shrink-0 border-2 border-white/20 shadow-sm" 
                    />
                    <div className="min-w-0">
                      <div className="font-black text-xs leading-tight">{currentPersona.name}</div>
                      <div className="text-[9px] font-bold text-indigo-100 uppercase tracking-wider mt-0.5 truncate">{currentPersona.disabilityType}</div>
                    </div>
                  </div>
                  <div className="p-3.5 space-y-2.5 text-[11px] text-brand-fg/80">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="font-semibold">{currentPersona.education}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span className="font-semibold">{currentPersona.experience}</span>
                    </div>
                    <div className="pt-1.5 border-t border-indigo-100/60">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Daftar Keahlian Diverifikasi</div>
                      <div className="flex flex-wrap gap-1">
                        {currentPersona.skills.map(skill => (
                          <span key={skill} className="px-2 py-0.5 rounded-md bg-white border border-indigo-100 text-[9px] font-black text-indigo-600">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2: CHOOSE TEMPLATE ── */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xs font-black text-indigo-600 uppercase tracking-wider">Tahap 2: Pesan Akomodasi HRD</h2>
                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-0.5">
                    Pilih template pernyataan ramah untuk menginformasikan kebutuhan aksesibilitas Anda.
                  </p>
                </div>

                {/* Templates grid */}
                <div className="grid gap-2.5">
                  {MESSAGE_TEMPLATES.map((tmpl) => {
                    const isSelected = selectedTemplateId === tmpl.id;
                    return (
                      <button
                        key={tmpl.id}
                        onClick={() => handleTemplateSelect(tmpl.id)}
                        className={`p-3 rounded-xl border text-left text-[11px] transition-all relative ${
                          isSelected 
                            ? "border-indigo-500 bg-indigo-50/30 ring-1 ring-indigo-500/20" 
                            : "border-slate-100 bg-slate-50/50 hover:bg-slate-50"
                        }`}
                        type="button"
                      >
                        <div className="font-black text-brand-fg flex items-center gap-1.5 mb-1">
                          <MessageSquare className={`w-3.5 h-3.5 ${isSelected ? "text-indigo-600" : "text-slate-400"}`} />
                          <span className={isSelected ? "text-indigo-700" : ""}>{tmpl.title}</span>
                          {isSelected && (
                            <span className="ml-auto w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 text-white" />
                            </span>
                          )}
                        </div>
                        <p className="text-brand-fg/60 leading-relaxed font-medium">{tmpl.text}</p>
                      </button>
                    );
                  })}

                  {/* Option for custom message */}
                  <button
                    onClick={() => {
                      setSelectedTemplateId("");
                      setCustomMessage("");
                    }}
                    className={`p-3 rounded-xl border text-left text-[11px] transition-all relative ${
                      selectedTemplateId === "" 
                        ? "border-indigo-500 bg-indigo-50/30 ring-1 ring-indigo-500/20" 
                        : "border-slate-100 bg-slate-50/50 hover:bg-slate-50"
                    }`}
                    type="button"
                  >
                    <div className="font-black text-brand-fg flex items-center gap-1.5 mb-1">
                      <FileText className={`w-3.5 h-3.5 ${selectedTemplateId === "" ? "text-indigo-600" : "text-slate-400"}`} />
                      <span className={selectedTemplateId === "" ? "text-indigo-700" : ""}>Tulis Pesan Kustom Sendiri</span>
                      {selectedTemplateId === "" && (
                        <span className="ml-auto w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </span>
                      )}
                    </div>
                    <p className="text-brand-fg/60 leading-relaxed font-medium">Pilih ini jika Anda ingin mengetik pesan akomodasi kustom Anda sendiri dari awal.</p>
                  </button>
                </div>

                {/* Customizable textarea */}
                <div className="space-y-1.5 pt-1">
                  <label htmlFor="custom-message" className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Kustomisasi Pesan Pendamping</label>
                  <textarea
                    id="custom-message"
                    value={customMessage}
                    onChange={handleTextareaChange}
                    rows={4}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-brand-fg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* ── STEP 3: REVIEW & SEND ── */}
            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-xs font-black text-indigo-600 uppercase tracking-wider">Tahap 3: Tinjau dan Kirim Lamaran</h2>
                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-0.5">
                    Pastikan seluruh informasi lampiran Anda sudah benar sebelum dikirim.
                  </p>
                </div>

                <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100 bg-slate-50/50">
                  <div className="p-3.5 space-y-1">
                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Perusahaan Tujuan</span>
                    <div className="font-black text-xs text-brand-fg">{activeJob.company}</div>
                    <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5">
                      <Briefcase className="w-3 h-3 text-slate-400" />
                      <span>{activeJob.title}</span>
                      <span>•</span>
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{activeJob.location.split(" (")[0]}</span>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-1.5">
                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Berkas Lampiran</span>
                    <div className="font-black text-xs text-brand-fg flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                        <UserCheck className="w-4.5 h-4.5 text-emerald-500" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate">Skill Passport - {currentPersona.name}.pdf</div>
                        <div className="text-[8px] font-black text-emerald-600 uppercase tracking-wide">Terverifikasi AbleWork</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-1">
                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Pernyataan Akomodasi</span>
                    <p className="text-[11px] text-brand-fg/70 leading-relaxed font-semibold italic bg-white p-2.5 rounded-lg border border-slate-100">
                      "{customMessage}"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Form Nav Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-100">
              {step > 1 && (
                <button
                  onClick={handleBack}
                  className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl border border-slate-200 bg-white text-slate-500 hover:border-slate-300 text-xs font-black transition-all"
                  type="button"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>
              )}

              <button
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white text-xs font-black shadow-md shadow-indigo-500/20 transition-all"
                type="button"
              >
                <span>{step === 3 ? "Kirim Lamaran" : "Lanjutkan"}</span>
                {step < 3 ? <ChevronRight className="w-4 h-4" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </div>

          </div>
        </div>

      </div>
    </AppLayout>
    </>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={
      <AppLayout showNav={false}>
        <div className="flex items-center justify-center p-12 text-sm text-zinc-500">
          Memuat formulir lamaran kerja...
        </div>
      </AppLayout>
    }>
      <ApplyContent />
    </Suspense>
  );
}
