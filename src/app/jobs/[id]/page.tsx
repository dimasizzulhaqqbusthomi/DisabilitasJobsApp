"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAppState } from "../../../context/AppContext";
import { useAccessibility } from "../../../context/AccessibilityContext";
import { JOBS, ACCOMMODATIONS, calculateMatchScore, calculateMatchDetails } from "../../../data/mockData";
import AppLayout from "../../../components/AppLayout";
import { AbleMatchScore } from "../../../components/AbleMatchScore";
import { MatchReasonCard } from "../../../components/MatchReasonCard";
import {
  MapPin,
  ChevronLeft,
  Check,
  Heart,
  Briefcase,
  Clock,
  GraduationCap,
  AlertTriangle,
  Accessibility,
  BadgeCheck,
  MessageSquare
} from "lucide-react";

/* ─── helper: format salary ─── */
const formatSalary = (salary: string): string => {
  if (salary.includes(" - ")) {
    const parts = salary.split(" - ");
    const fmt = (s: string) => {
      const num = parseInt(s.replace(/\D/g, ""));
      return `Rp ${(num / 1_000_000).toFixed(1).replace(".0", "")}jt`;
    };
    return `${fmt(parts[0])}-${fmt(parts[1])}`;
  }
  const num = parseInt(salary.replace(/\D/g, ""));
  return `Rp ${(num / 1_000_000).toFixed(1).replace(".0", "")}jt`;
};

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

/* ─── helper: match badge colors ─── */
const matchStyle = (score: number) => {
  if (score === 0) return "bg-amber-50 text-amber-600 border-amber-200";
  if (score >= 70) return "bg-emerald-50 text-emerald-600 border-emerald-200";
  return "bg-indigo-50 text-indigo-600 border-indigo-200";
};

/* ─── helper: donut arc ─── */
function DonutRing({ score }: { score: number }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const strokeColor = score === 0 ? "#fbbf24" : score >= 70 ? "#34d399" : "#22d3ee";
  return (
    <svg width="52" height="52" viewBox="0 0 52 52">
      <circle cx="26" cy="26" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="6" />
      <circle
        cx="26" cy="26" r={r} fill="none"
        stroke={strokeColor} strokeWidth="6"
        strokeDasharray={`${fill} ${circ - fill}`}
        strokeLinecap="round"
        transform="rotate(-90 26 26)"
        style={{ transition: "stroke-dasharray 0.8s ease" }}
      />
      <text x="26" y="32" textAnchor="middle" fontSize="11" fontWeight="900" fill="#ffffff">
        {score}
      </text>
    </svg>
  );
}

const getRecruiter = (jobId: string) => {
  switch (jobId) {
    case "1":
      return { name: "Riska Amalia", initials: "RA", phone: "+62 812-3456-7890", waLink: "https://wa.me/6281234567890", online: "2 jam lalu" };
    case "2":
      return { name: "Beni Setiawan", initials: "BS", phone: "+62 823-4567-8901", waLink: "https://wa.me/6282345678901", online: "5 jam lalu" };
    case "3":
      return { name: "Yudi Prasetyo", initials: "YP", phone: "+62 834-5678-9012", waLink: "https://wa.me/6283456789012", online: "10 mnt lalu" };
    case "4":
      return { name: "Lina Marlina", initials: "LM", phone: "+62 845-5678-9013", waLink: "https://wa.me/6284556789013", online: "1 hari lalu" };
    case "5":
      return { name: "Dewi Lestari", initials: "DL", phone: "+62 856-5678-9014", waLink: "https://wa.me/6285656789014", online: "3 jam lalu" };
    case "6":
      return { name: "Andika Pratama", initials: "AP", phone: "+62 867-5678-9015", waLink: "https://wa.me/6286756789015", online: "30 mnt lalu" };
    case "7":
      return { name: "Sri Wahyuni", initials: "SW", phone: "+62 878-5678-9016", waLink: "https://wa.me/6287856789016", online: "2 jam lalu" };
    case "8":
      return { name: "Fajar Nugroho", initials: "FN", phone: "+62 889-5678-9017", waLink: "https://wa.me/6288956789017", online: "15 mnt lalu" };
    default:
      return { name: "Recruiter AbleWork", initials: "RA", phone: "+62 812-3456-7890", waLink: "https://wa.me/6281234567890", online: "1 jam lalu" };
  }
};

export default function JobDetailPage() {
  const params = useParams();
  const { selectedNeeds, showToast, appliedJobs, currentPersona, jobPreferences, savedJobIds, toggleSaveJob } = useAppState();
  const { simpleLanguage } = useAccessibility();

  const id = params?.id as string;
  const job = JOBS.find((j) => j.id === id);

  /* ── Not found ── */
  if (!job) {
    return (
      <AppLayout showHeader={false} mainClassName="flex-1 overflow-y-auto overflow-x-hidden pb-24 bg-brand-bg">
        <div className="p-8 text-center space-y-4 mt-12">
          <div className="text-4xl">⚠️</div>
          <h1 className="text-xl font-bold">Lowongan tidak ditemukan</h1>
          <p className="text-xs text-brand-fg/60">Lowongan ini mungkin sudah ditutup atau tidak terdaftar.</p>
          <Link href="/jobs" className="inline-block px-4 py-2 rounded-xl bg-brand-primary text-white text-xs font-bold">
            Kembali ke Daftar Lowongan
          </Link>
        </div>
      </AppLayout>
    );
  }

  const isSaved = savedJobIds.includes(job.id);
  const matchDetails = calculateMatchDetails(job, currentPersona, selectedNeeds, jobPreferences);
  const matchScore = matchDetails.score;
  const isApplied = appliedJobs.some((app) => app.jobId === job.id);
  const recruiter = getRecruiter(job.id);

  const handleSaveToggle = () => {
    toggleSaveJob(job.id);
    showToast(isSaved ? "Lowongan dihapus dari simpanan" : "Lowongan berhasil disimpan!", "info");
  };

  const typeLabel = job.type === "remote" ? "Remote" : job.type === "hybrid" ? "Hybrid" : "Onsite";

  /* ─────────────────── JSX ─────────────────── */
  return (
    /* mainClassName: flex-col so content + apply bar stack vertically within the panel */
    <AppLayout
      showHeader={false}
      mainClassName="flex-1 flex flex-col overflow-hidden bg-brand-bg pb-16"
    >
      {/* ══════════════════════════════════════════
          SCROLLABLE CONTENT AREA (takes remaining space)
      ══════════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">

        {/* ── GRADIENT HERO HEADER ── */}
        <div className="relative bg-gradient-to-br from-[#4f46e5] via-[#4338ca] to-[#06b6d4] pt-10 pb-14 px-5 overflow-hidden shadow-lg">
          {/* decorative orbs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute top-4 right-20 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute bottom-10 left-[-20px] w-32 h-32 rounded-full bg-cyan-400/10 pointer-events-none" />

          {/* Top row: back button + label */}
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <Link
              href="/jobs"
              className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 transition-all text-white shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <span className="text-white/70 text-xs font-semibold tracking-wide">Detail Lowongan</span>
          </div>

          {/* Company logo + title row + match donut */}
          <div className="relative z-10 flex items-start gap-4">
            {/* Company Logo Initials */}
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-base font-black text-white shrink-0 backdrop-blur-sm shadow-inner uppercase tracking-wider select-none">
              {getCompanyInitials(job.company)}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-black text-white leading-snug mb-0.5">{job.title}</h1>
              <div className="flex items-center gap-1.5 text-white/70 text-xs font-semibold mb-3">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span className="truncate">{job.company}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1 text-[11px] text-white/80 font-semibold">
                  <MapPin className="w-3 h-3 shrink-0" />
                  {job.location.split(" (")[0]}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-white border border-white/20 text-[10px] font-bold">
                  {typeLabel}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-white border border-white/20 text-[10px] font-bold">
                  {formatSalary(job.salary)}/bln
                </span>
              </div>
            </div>

            {/* Match score donut */}
            <div className="shrink-0 flex flex-col items-center gap-1">
              <DonutRing score={matchScore} />
              <AbleMatchScore score={matchScore} />
            </div>
          </div>
        </div>

        {/* ── CONTENT CARDS (overlap header with -mt-6) ── */}
        <div className="relative z-10 px-4 -mt-6 space-y-4 max-w-lg mx-auto w-full pb-6">

          {/* Quick Stat Pills */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-4 py-3 flex items-center">
            <div className="flex-1 flex flex-col items-center border-r border-slate-100 pr-3">
              <Briefcase className="w-4 h-4 text-indigo-500 mb-0.5" />
              <span className="text-[10px] text-slate-400 font-semibold">Tipe</span>
              <span className="text-xs font-black text-brand-fg">{typeLabel}</span>
            </div>
            <div className="flex-1 flex flex-col items-center border-r border-slate-100 pr-3">
              <Clock className="w-4 h-4 text-emerald-500 mb-0.5" />
              <span className="text-[10px] text-slate-400 font-semibold">Status</span>
              <span className="text-xs font-black text-emerald-600">Dibuka</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <GraduationCap className="w-4 h-4 text-indigo-500 mb-0.5" />
              <span className="text-[10px] text-slate-400 font-semibold">Pendidikan</span>
              <span className="text-xs font-black text-brand-fg">
                {job.id === "2" ? "D3" : job.id === "4" ? "SMA/SMK" : "S1"}
              </span>
            </div>
          </div>

          {/* Kontak Rekruter (HRD) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
            <h2 className="text-xs font-black text-brand-fg flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-indigo-500 inline-block shrink-0" />
              Kontak Rekruter (HRD)
            </h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 text-xs font-black flex items-center justify-center border border-indigo-200 shrink-0">
                {recruiter.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-800 text-xs truncate">{recruiter.name}</span>
                  <span className="text-slate-300 mx-1 text-xs">·</span>
                  <span className="text-emerald-600 font-bold text-[11px]">Verified</span>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  Online {recruiter.online} · Aktif di AbleWork
                </p>
              </div>
              
              <Link
                href={`/chat/${job.id}`}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black flex items-center gap-1 transition-all shadow-md shadow-indigo-600/15 shrink-0"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Chat Sekarang
              </Link>
            </div>
          </div>

          {/* Alasan Kecocokan Pekerjaan */}
          <MatchReasonCard
            skillMatch={matchDetails.skillMatch}
            accessibilityMatch={matchDetails.accessibilityMatch}
            workPreferenceMatch={matchDetails.workPreferenceMatch}
            experienceMatch={matchDetails.experienceMatch}
            jobInterestMatch={matchDetails.jobInterestMatch}
          />

          {/* Akomodasi Aksesibilitas */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
              <Accessibility className="w-4 h-4 text-indigo-500 shrink-0" />
              <span className="text-xs font-black text-brand-fg">Akomodasi Aksesibilitas</span>
              <span className="ml-auto text-[9px] font-bold text-indigo-500 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full whitespace-nowrap">
                {job.accommodations.filter((k) => selectedNeeds.includes(k)).length}/{job.accommodations.length} Cocok
              </span>
            </div>
            <div className="p-4 flex flex-col gap-2.5">
              {job.accommodations.map((accKey) => {
                const acc = ACCOMMODATIONS.find((a) => a.key === accKey);
                if (!acc) return null;
                const matched = selectedNeeds.includes(accKey);
                return (
                  <div
                    key={accKey}
                    className={`p-3 rounded-xl border flex items-start gap-3 ${
                      matched ? "bg-emerald-50 border-emerald-200" : "bg-slate-50 border-slate-100"
                    }`}
                  >
                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${matched ? "bg-emerald-500" : "bg-slate-300"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                        <span className={`text-xs font-black ${matched ? "text-emerald-700" : "text-brand-fg"}`}>
                          {acc.label}
                        </span>
                        {matched && (
                          <span className="text-[8px] font-black text-emerald-600 bg-emerald-100 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                            ✓ Cocok
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-brand-fg/60 leading-relaxed">
                        {simpleLanguage ? acc.simpleDescription : acc.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ringkasan Pekerjaan */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-2">
            <h2 className="text-xs font-black text-brand-fg flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-indigo-500 inline-block shrink-0" />
              Ringkasan Pekerjaan
            </h2>
            <p className="text-xs text-brand-fg/70 leading-relaxed">
              {simpleLanguage ? job.simpleDescription : job.description}
            </p>
          </div>

          {/* Tugas Utama */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
            <h2 className="text-xs font-black text-brand-fg flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-emerald-500 inline-block shrink-0" />
              Tugas Utama
            </h2>
            <ul className="space-y-2">
              {(simpleLanguage ? job.simpleTasks : job.tasks).map((task, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-brand-fg/75">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-emerald-500" />
                  </div>
                  <span className="leading-relaxed">{task}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Syarat Pekerjaan */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
            <h2 className="text-xs font-black text-brand-fg flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-indigo-500 inline-block shrink-0" />
              Syarat Pekerjaan
            </h2>
            <ul className="space-y-2">
              {(simpleLanguage ? job.simpleRequirements : job.requirements).map((req, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-brand-fg/75">
                  <div className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-indigo-500" />
                  </div>
                  <span className="leading-relaxed">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Catatan & Risiko */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
            <h2 className="text-xs font-black text-amber-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Catatan &amp; Risiko Kerja
            </h2>
            <ul className="space-y-1.5">
              {job.notes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[11px] text-amber-800/80">
                  <span className="shrink-0 mt-0.5">•</span>
                  <span className="leading-relaxed">{note}</span>
                </li>
              ))}
              <li className="flex items-start gap-2 text-[11px] text-amber-800/80">
                <span className="shrink-0 mt-0.5">•</span>
                <span className="leading-relaxed">Interview online tersedia via Google Meet/Zoom dengan opsi teks penuh jika dibutuhkan.</span>
              </li>
            </ul>
          </div>

        </div>
        {/* end content cards */}
      </div>
      {/* end scrollable area */}

      {/* ══════════════════════════════════════════
          APPLY BAR — pinned at bottom of flex column,
          sits above the bottom nav (handled by AppLayout pb-16 equivalent)
      ══════════════════════════════════════════ */}
      <div className="shrink-0 bg-white border-t border-slate-100 px-4 pt-3 pb-4 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] max-w-lg mx-auto w-full">
        {isApplied ? (
          <div className="py-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-emerald-700 font-black text-sm">
            ✓ Sudah Melamar Lowongan Ini
          </div>
        ) : (
          <div className="flex gap-3">
            {/* Save / Bookmark button */}
            <button
              onClick={handleSaveToggle}
              className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 transition-all ${
                isSaved
                  ? "bg-rose-50 border-rose-200 text-rose-500"
                  : "border-slate-200 bg-white text-slate-400 hover:border-rose-300 hover:text-rose-400"
              }`}
              aria-label={isSaved ? "Hapus simpanan" : "Simpan lowongan"}
            >
              <Heart className={`w-5 h-5 ${isSaved ? "fill-rose-500 text-rose-500" : ""}`} />
            </button>

            {/* Apply CTA */}
            <Link
              href={`/apply?jobId=${job.id}`}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white text-sm font-black text-center shadow-lg shadow-indigo-500/30 transition-all flex items-center justify-center"
            >
              Lamar dengan Skill Passport
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
