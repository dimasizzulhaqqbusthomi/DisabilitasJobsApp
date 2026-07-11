"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useAppState } from "../../../context/AppContext";
import { useAccessibility } from "../../../context/AccessibilityContext";
import { JOBS, ACCOMMODATIONS, calculateMatchScore } from "../../../data/mockData";
import AppLayout from "../../../components/AppLayout";
import { AbleMatchScore } from "../../../components/AbleMatchScore";
import { 
  Heart,
  ChevronLeft,
  MapPin,
  Briefcase,
  Trash2
} from "lucide-react";

const formatSalary = (salaryStr: string) => {
  return salaryStr
    .replace(/Rp\s?/g, "Rp ")
    .replace(/\.000\.000/g, "jt")
    .replace(/\.500\.000/g, ",5jt")
    .replace(/\.800\.000/g, ",8jt")
    .replace(/\.200\.000/g, ",2jt")
    .replace(/\s?-\s?Rp\s?/g, "-");
};

const getRecruiter = (jobId: string) => {
  switch (jobId) {
    case "1":
      return { name: "Riska Amalia", initials: "RA", online: "2 jam lalu" };
    case "2":
      return { name: "Beni Setiawan", initials: "BS", online: "5 jam lalu" };
    case "3":
      return { name: "Yudi Prasetyo", initials: "YP", online: "10 mnt lalu" };
    case "4":
      return { name: "Lina Marlina", initials: "LM", online: "1 hari lalu" };
    case "5":
      return { name: "Dewi Lestari", initials: "DL", online: "3 jam lalu" };
    case "6":
      return { name: "Andika Pratama", initials: "AP", online: "30 mnt lalu" };
    case "7":
      return { name: "Sri Wahyuni", initials: "SW", online: "2 jam lalu" };
    case "8":
      return { name: "Fajar Nugroho", initials: "FN", online: "15 mnt lalu" };
    default:
      return { name: "Recruiter AbleWork", initials: "RA", online: "1 jam lalu" };
  }
};

const getAccLabel = (accKey: string) => {
  switch (accKey) {
    case "remote": return "Bekerja Remote / Hybrid";
    case "caption_meeting": return "Video Call dengan Caption";
    case "wheelchair_access": return "Akses Kursi Roda";
    case "written_instruction": return "Instruksi Kerja Tertulis";
    case "screen_reader": return "Screen Reader Friendly";
    case "quiet_environment": return "Lingkungan Minim Bising";
    case "flexible_hours": return "Jam Kerja Fleksibel";
    case "chat_communication": return "Interview & Komunikasi via Chat";
    default: return accKey;
  }
};

export default function SavedJobsPage() {
  const { selectedNeeds, currentPersona, jobPreferences, savedJobIds, toggleSaveJob } = useAppState();
  const { simpleLanguage } = useAccessibility();

  // Filter only saved jobs and sort by match score
  const savedJobs = useMemo(() => {
    return JOBS.filter(job => savedJobIds.includes(job.id))
      .map(job => {
        const score = calculateMatchScore(job, currentPersona, selectedNeeds, jobPreferences);
        return { ...job, matchScore: score };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [savedJobIds, selectedNeeds, currentPersona, jobPreferences]);

  return (
    <AppLayout showHeader={false} mainClassName="flex-1 overflow-y-auto overflow-x-hidden pb-24 bg-brand-bg relative">
      <div className="flex flex-col min-h-screen">
        
        {/* ─── GRADIENT HEADER ─── */}
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-cyan-500 pt-10 pb-8 px-5 text-white rounded-b-[32px] shadow-lg shadow-indigo-900/10 relative overflow-hidden select-none mb-4">
          {/* decorative circles */}
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <Link
              href="/jobs"
              className="w-10 h-10 rounded-full bg-white/10 border border-white/25 flex items-center justify-center hover:bg-white/20 transition-all shrink-0"
              aria-label="Kembali ke Daftar Pekerjaan"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </Link>
            <h1 className="text-base font-extrabold text-white absolute left-1/2 -translate-x-1/2">
              Lowongan Disimpan
            </h1>
            <div className="w-10 h-10 shrink-0" />
          </div>
        </div>

        {/* ─── LIST CONTAINER ─── */}
        <div className="px-5 py-2 flex-1 flex flex-col space-y-4 max-w-md mx-auto w-full">
          
          <div className="flex items-center justify-between select-none px-1">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Daftar Favorit Anda
            </h2>
            <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
              {savedJobs.length} Lowongan
            </span>
          </div>

          {/* Empty State */}
          {savedJobs.length === 0 && (
            <div className="p-12 border-2 border-dashed border-slate-200 rounded-3xl bg-white text-center space-y-5 my-6 shadow-sm">
              <div className="p-4 bg-rose-50 text-rose-500 rounded-full w-fit mx-auto text-3xl">
                <Heart className="w-8 h-8 fill-rose-100 text-rose-400 stroke-[1.5]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-base text-slate-800">Belum ada favorit</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                  Semua lowongan kerja yang Anda simpan/favoritkan akan muncul di halaman ini agar mudah diakses nanti.
                </p>
              </div>
              <Link
                href="/jobs"
                className="inline-block px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/10"
              >
                Cari Lowongan Sekarang
              </Link>
            </div>
          )}

          {/* Job Cards */}
          <div className="space-y-3.5 pb-8">
            {savedJobs.map((job) => {
              const recruiter = getRecruiter(job.id);
              return (
                <div
                  key={job.id}
                  className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-brand-primary/30 transition-all relative"
                >
                  {/* Card link */}
                  <Link href={`/jobs/${job.id}`} className="block">
                    {/* row 1: title + match badge */}
                    <div className="flex items-start justify-between gap-8 mb-2">
                      <h3 className="font-black text-sm text-slate-800 leading-snug flex-1 hover:text-indigo-600 transition-colors">
                        {job.title}
                      </h3>
                      <div className="shrink-0 pt-0.5">
                        <AbleMatchScore score={job.matchScore} />
                      </div>
                    </div>

                    {/* row 2: company + location + salary */}
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-3">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <svg className="w-3 h-3 fill-emerald-500" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {job.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {job.location.split(" (")[0]}
                      </span>
                    </div>

                    {/* row 3: salary & tags */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pt-1">
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          job.type === "remote" ? "Remote" : job.type === "hybrid" ? "Hybrid" : "Onsite",
                          job.id === "1" || job.id === "5" ? "Penuh Waktu" : "Kontrak",
                        ].map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg">{tag}</span>
                        ))}
                      </div>
                      <span className="font-extrabold text-indigo-600 text-[11px]">
                        {formatSalary(job.salary)}/bln
                      </span>
                    </div>

                    {/* divider */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                        Akomodasi Aksesibilitas
                      </span>
                      <div className="flex-1 h-px bg-slate-100" />
                    </div>

                    {/* accommodations */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {job.accommodations.slice(0, 3).map((key: string) => {
                        const matched = selectedNeeds.includes(key);
                        return (
                          <span key={key} className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold ${
                            matched
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-50 text-slate-500 border-slate-200"
                          }`}>{getAccLabel(key)}</span>
                        );
                      })}
                    </div>
                  </Link>

                  {/* Quick Action: Unsave Button (not overlapping Link) */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black flex items-center justify-center border border-indigo-100 shrink-0">
                        {recruiter.initials}
                      </div>
                      <div className="text-[10px] text-slate-500 flex-1">
                        <span className="font-bold text-slate-700">{recruiter.name}</span>
                        <span className="mx-1">·</span>
                        <span className="text-emerald-600 font-semibold">Verified</span>
                      </div>
                    </div>

                    {/* Unsave Button */}
                    <button
                      type="button"
                      onClick={() => toggleSaveJob(job.id)}
                      className="p-1.5 rounded-xl border border-rose-100 bg-rose-50/50 hover:bg-rose-50 text-rose-500 transition-colors"
                      title="Hapus dari simpanan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
