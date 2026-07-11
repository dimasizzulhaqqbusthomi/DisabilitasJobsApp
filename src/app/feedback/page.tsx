"use client";

import React, { useState } from "react";
import { useAppState } from "../../context/AppContext";
import { useAccessibility } from "../../context/AccessibilityContext";
import { JOBS } from "../../data/mockData";
import AppLayout from "../../components/AppLayout";
import { 
  MessageSquare, 
  Star, 
  Send, 
  CheckCircle,
  Building,
  AlertCircle
} from "lucide-react";

export default function FeedbackPage() {
  const { appliedJobs, submitFeedback, feedbacks, showToast } = useAppState();
  const { simpleLanguage } = useAccessibility();

  // Selected job for feedback
  const [selectedJobId, setSelectedJobId] = useState<string>(
    appliedJobs.length > 0 ? appliedJobs[0].jobId : JOBS[0].id
  );

  // Form states
  const [isAccessible, setIsAccessible] = useState<boolean>(true);
  const [hasAccommodation, setHasAccommodation] = useState<boolean>(true);
  const [isDescriptionAccurate, setIsDescriptionAccurate] = useState<boolean>(true);
  const [rating, setRating] = useState<number>(5);
  const [comments, setComments] = useState<string>("");

  const activeJob = JOBS.find(j => j.id === selectedJobId) || JOBS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFeedback({
      jobId: selectedJobId,
      isAccessible,
      hasAccommodation,
      isDescriptionAccurate,
      rating,
      comments
    });
    // Reset comments
    setComments("");
    showToast("Feedback rekrutmen inklusif berhasil dikirim!", "success");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-black">Feedback Rekrutmen Inklusif</h1>
          <p className="text-sm text-brand-fg/70">
            Bantu kami memantau inklusivitas perusahaan! Ceritakan pengalaman wawancara atau lamaran Anda di sini.
          </p>
        </div>

        {/* Layout: Left Form (3 cols), Right Submissions history (2 cols) */}
        <div className="grid lg:grid-cols-5 gap-6 items-start">
          
          {/* Left: Feedback Form */}
          <form 
            onSubmit={handleSubmit}
            className="lg:col-span-3 p-6 sm:p-8 rounded-3xl border border-brand-border bg-brand-card shadow-lg space-y-5"
          >
            <h2 className="text-base font-extrabold text-brand-fg flex items-center gap-2 pb-2 border-b border-brand-border">
              <MessageSquare className="w-5 h-5 text-brand-primary" />
              <span>Formulir Kepuasan Akses</span>
            </h2>

            {/* Select Job */}
            <div className="space-y-1">
              <label htmlFor="feedback-job" className="block text-xs font-bold text-brand-fg/80">Pilih Pekerjaan / Perusahaan</label>
              <select
                id="feedback-job"
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full p-3 rounded-xl border border-brand-border bg-brand-card text-sm focus:border-brand-primary"
              >
                {appliedJobs.length > 0 ? (
                  appliedJobs.map(app => {
                    const j = JOBS.find(job => job.id === app.jobId);
                    return (
                      <option key={app.jobId} value={app.jobId}>
                        {j ? `${j.title} - ${j.company}` : "Pekerjaan Simpanan"}
                      </option>
                    );
                  })
                ) : (
                  JOBS.map(j => (
                    <option key={j.id} value={j.id}>{j.title} - {j.company}</option>
                  ))
                )}
              </select>
              {appliedJobs.length === 0 && (
                <span className="text-[10px] text-brand-warning flex items-center gap-1 mt-1 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Anda belum mengirim lamaran resmi. Menampilkan semua lowongan demo.</span>
                </span>
              )}
            </div>

            {/* Question 1: Accessible recruit? */}
            <div className="space-y-2 pt-2">
              <span className="block text-xs font-bold text-brand-fg/80">1. Apakah seluruh proses rekrutmen mudah diakses oleh Anda?</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="radio"
                    name="q_accessible"
                    checked={isAccessible === true}
                    onChange={() => setIsAccessible(true)}
                    className="text-brand-primary focus:ring-brand-primary"
                  />
                  <span>Ya, Sangat Aksesibel</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="radio"
                    name="q_accessible"
                    checked={isAccessible === false}
                    onChange={() => setIsAccessible(false)}
                    className="text-brand-primary focus:ring-brand-primary"
                  />
                  <span>Tidak, Ada Rintangan</span>
                </label>
              </div>
            </div>

            {/* Question 2: HR Accommodations */}
            <div className="space-y-2">
              <span className="block text-xs font-bold text-brand-fg/80">2. Apakah pihak HRD menyediakan akomodasi disabilitas yang Anda minta?</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="radio"
                    name="q_accommodation"
                    checked={hasAccommodation === true}
                    onChange={() => setHasAccommodation(true)}
                    className="text-brand-primary focus:ring-brand-primary"
                  />
                  <span>Ya, Disediakan dengan Baik</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="radio"
                    name="q_accommodation"
                    checked={hasAccommodation === false}
                    onChange={() => setHasAccommodation(false)}
                    className="text-brand-primary focus:ring-brand-primary"
                  />
                  <span>Tidak / Ditolak</span>
                </label>
              </div>
            </div>

            {/* Question 3: Description accuracy */}
            <div className="space-y-2">
              <span className="block text-xs font-bold text-brand-fg/80">3. Apakah info akomodasi di deskripsi lowongan sesuai kenyataan saat interview?</span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="radio"
                    name="q_accuracy"
                    checked={isDescriptionAccurate === true}
                    onChange={() => setIsDescriptionAccurate(true)}
                    className="text-brand-primary focus:ring-brand-primary"
                  />
                  <span>Ya, Sangat Akurat</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <input
                    type="radio"
                    name="q_accuracy"
                    checked={isDescriptionAccurate === false}
                    onChange={() => setIsDescriptionAccurate(false)}
                    className="text-brand-primary focus:ring-brand-primary"
                  />
                  <span>Tidak Sesuai Deskripsi</span>
                </label>
              </div>
            </div>

            {/* Rating Stars */}
            <div className="space-y-2">
              <span className="block text-xs font-bold text-brand-fg/80">Rating Inklusivitas Perusahaan (1-5)</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-2xl hover:scale-110 transition-transform"
                    aria-label={`Beri rating bintang ${star}`}
                  >
                    <Star 
                      className={`w-6 h-6 ${
                        star <= rating 
                          ? "fill-brand-warning text-brand-warning" 
                          : "text-zinc-300 dark:text-zinc-600"
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-1">
              <label htmlFor="feedback-comment" className="block text-xs font-bold text-brand-fg/80">Catatan Pengalaman Tambahan</label>
              <textarea
                id="feedback-comment"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Bagikan cerita detail atau kendala khusus yang Anda rasakan selama proses rekrutmen..."
                rows={4}
                className="w-full p-3 rounded-xl border border-brand-border bg-brand-card text-xs focus:border-brand-primary focus:ring-brand-primary"
                required
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-extrabold shadow-lg shadow-brand-primary/20 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Feedback Rekrutmen</span>
            </button>

          </form>

          {/* Right: Submissions List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-extrabold text-zinc-400 uppercase tracking-wider">Histori Feedback Komunitas</h3>

            <div className="space-y-3.5">
              {feedbacks.length === 0 ? (
                <div className="p-6 border border-dashed border-brand-border rounded-2xl text-center text-xs text-brand-fg/60">
                  Belum ada feedback yang dikirim. Formulir Anda akan muncul di sini setelah disubmit.
                </div>
              ) : (
                feedbacks.map((f, idx) => {
                  const job = JOBS.find(j => j.id === f.jobId);
                  return (
                    <div 
                      key={idx} 
                      className="p-4 rounded-2xl border border-brand-border bg-brand-card space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div className="text-xs">
                          <div className="font-extrabold text-brand-fg">{job?.company || "Perusahaan Rekanan"}</div>
                          <div className="text-zinc-500 font-medium">{job?.title || "Posisi Staff"}</div>
                        </div>
                        
                        <div className="flex gap-0.5 text-brand-warning">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3.5 h-3.5 ${
                                i < f.rating ? "fill-brand-warning" : "text-zinc-200 dark:text-zinc-800"
                              }`} 
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-brand-fg/80 italic leading-relaxed">
                        "{f.comments}"
                      </p>

                      <div className="pt-2 border-t border-brand-border flex flex-wrap gap-2 text-[9px] font-bold text-brand-fg">
                        <span className={`px-2 py-0.5 rounded ${f.isAccessible ? "bg-brand-accent-light text-brand-accent" : "bg-brand-danger-light text-brand-danger"}`}>
                          {f.isAccessible ? "Aksesibel" : "Kendala Akses"}
                        </span>
                        <span className={`px-2 py-0.5 rounded ${f.hasAccommodation ? "bg-brand-accent-light text-brand-accent" : "bg-brand-danger-light text-brand-danger"}`}>
                          {f.hasAccommodation ? "Akomodasi OK" : "Akomodasi No"}
                        </span>
                        <span className="ml-auto text-zinc-400 font-medium">{f.submittedAt}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>
    </AppLayout>
  );
}
