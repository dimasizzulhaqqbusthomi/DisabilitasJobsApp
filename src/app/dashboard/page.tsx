"use client";

import React from "react";
import Link from "next/link";
import { useAppState } from "../../context/AppContext";
import { useAccessibility } from "../../context/AccessibilityContext";
import { JOBS, calculateMatchScore } from "../../data/mockData";
import AppLayout from "../../components/AppLayout";
import { AbleMatchScore } from "../../components/AbleMatchScore";
import {
  Briefcase, Award, Send, ChevronRight,
  Bell, Accessibility, MapPin, Zap, Sparkles, Mic, MessageSquare
} from "lucide-react";

/* ─── helpers ─────────────────────────────────────────────── */
const fmtSalary = (s: string) =>
  s.replace(/Rp\s?/g, "Rp ").replace(/\.000\.000/g, "jt")
    .replace(/\.500\.000/g, ",5jt").replace(/\.800\.000/g, ",8jt")
    .replace(/\.200\.000/g, ",2jt").replace(/\s?-\s?Rp\s?/g, "–");

const getAccLabel = (k: string) => ({
  remote: "Kerja dari Rumah (Remote) / Hybrid", caption_meeting: "Teks Rapat Video (Caption)",
  wheelchair_access: "Akses Kursi Roda", written_instruction: "Instruksi Tertulis",
  screen_reader: "Mendukung Pembaca Layar", quiet_environment: "Minim Bising",
  flexible_hours: "Jam Fleksibel", chat_communication: "Komunikasi Chat",
}[k] ?? k);

const getRecruiter = (id: string) => ({
  "1": { initials: "RA", name: "Riska A." },
  "2": { initials: "BS", name: "Beni S." },
  "3": { initials: "YP", name: "Yudi P." },
  "4": { initials: "LM", name: "Lina M." },
  "5": { initials: "DL", name: "Dewi L." },
}[id] ?? { initials: "AKM", name: "AksesKerjaMu" });

/* ─── Donut ring component ─────────────────────────────────── */
function DonutRing({ pct, size = 88, stroke = 9 }: { pct: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const color = pct === 0 ? "#f59e0b" : pct >= 70 ? "#10b981" : "#4f46e5";
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.6s ease" }} />
    </svg>
  );
}

export default function DashboardPage() {
  const { currentPersona, selectedNeeds, appliedJobs, jobPreferences } = useAppState();
  const { simpleLanguage } = useAccessibility();

  const scoredJobs = JOBS.map(job => ({
    ...job, matchScore: calculateMatchScore(job, currentPersona, selectedNeeds, jobPreferences)
  })).sort((a, b) => b.matchScore - a.matchScore);

  const topJobs = scoredJobs.slice(0, 3);
  // Always use real calculated average — score reflects all dimensions (accessibility, skills, portfolio, career)
  const avgMatch = Math.round(scoredJobs.reduce((s, j) => s + j.matchScore, 0) / scoredJobs.length);

  const initials = currentPersona.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const skillPct = Math.min(100, Math.round((currentPersona.skills?.length || 0) * 16));
  const cocok = scoredJobs.filter(j => j.matchScore >= 50).length;
  const dikirim = appliedJobs.length;

  // ── Profile completion: same 10-field formula as Profile page ──
  const getProfileCompletionPercentage = () => {
    let score = 0;
    if (currentPersona.name && currentPersona.name.trim().length > 0) score += 10;
    // email is always present so we count it
    score += 10;
    if (currentPersona.location && currentPersona.location.trim().length > 0) score += 10;
    if (currentPersona.education && currentPersona.education.trim().length > 0) score += 10;
    if (currentPersona.experience && currentPersona.experience.trim().length > 0) score += 10;
    if (currentPersona.bio && currentPersona.bio.trim().length > 0) score += 10;
    if (currentPersona.targetCareers && currentPersona.targetCareers.length > 0) score += 10;
    if (currentPersona.skills && currentPersona.skills.length > 0) score += 10;
    if (selectedNeeds && selectedNeeds.length > 0) score += 10;
    // phone is stored in localStorage per profile page; assume present if persona exists
    score += 10;
    return Math.max(10, Math.min(100, score));
  };
  const profileCompletionPct = getProfileCompletionPercentage();

  return (
    <AppLayout showHeader={false} mainClassName="flex-1 overflow-y-auto overflow-x-hidden pb-24 bg-brand-bg">
      <div className="flex flex-col min-h-screen">

        {/* ═══ GRADIENT HEADER ═══ */}
        <div className="relative bg-gradient-to-br from-[#4f46e5] via-[#4338ca] to-[#06b6d4] pt-10 pb-20 px-5 overflow-hidden select-none">
          {/* decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute top-4 right-20 w-20 h-20 rounded-full bg-white/5" />
          <div className="absolute bottom-10 left-[-20px] w-32 h-32 rounded-full bg-cyan-400/10" />

          {/* top row: avatar + greeting + chat + bell */}
          <div className="flex items-center gap-3 relative z-10 mb-8">
            <div className="w-11 h-11 rounded-full bg-white/20 border border-white/25 flex items-center justify-center text-sm font-black text-white shrink-0">
              {initials}
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-[10px] text-white/70 font-medium">Selamat datang di AksesKerjaMu</span>
              <span className="text-base font-black text-white leading-tight">{currentPersona.name}</span>
            </div>
            <Link href="/chat" aria-label="Pesan (Chat)"
              className="relative w-10 h-10 rounded-full bg-white/15 border border-white/20 flex items-center justify-center hover:bg-white/25 transition-all">
              <MessageSquare className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-[#4338ca] animate-pulse">3</span>
            </Link>
            <Link href="/notifications" aria-label="Notifikasi"
              className="relative w-10 h-10 rounded-full bg-white/15 border border-white/20 flex items-center justify-center hover:bg-white/25 transition-all">
              <Bell className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-[#4338ca] animate-pulse">6</span>
            </Link>
          </div>

          {/* stat pill row */}
          <div className="relative z-10 flex gap-2.5">
            {[
              { label: "Kecocokan Kerja", val: cocok, href: "/jobs" },
              { label: "Lamaran", val: dikirim, href: "/applications" },
            ].map(s => (
              <Link
                key={s.label}
                href={s.href}
                className="flex-1 bg-white/15 backdrop-blur-sm border border-white/20 rounded-2xl px-3 py-2.5 text-center hover:bg-white/25 active:scale-[0.98] transition-all block"
              >
                <div className="text-white font-black text-base leading-none">{s.val}</div>
                <div className="text-white/70 text-[9px] font-semibold mt-0.5 leading-tight">{s.label}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* ═══ FLOATING MATCH CARD ═══ */}
        <div className="px-5 -mt-12 z-20 relative mb-5">

          {/* Card: Kecocokan Kerja Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-slate-100 p-5 flex items-center gap-5">
            {/* donut */}
            <div className="relative shrink-0">
              <DonutRing pct={avgMatch} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-black text-brand-fg leading-none">{avgMatch}%</span>
                <span className="text-[6.5px] text-brand-fg/50 font-extrabold leading-none uppercase tracking-tighter text-center max-w-[42px]">Kecocokan</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-black text-sm text-brand-fg mb-1">
                {avgMatch < 30
                  ? "Belum Ada Kecocokan Kerja"
                  : avgMatch >= 70
                    ? "Kecocokan Kerja Sangat Baik!"
                    : "Kecocokan Kerja Cukup Baik"}
              </h2>
              <p className="text-[11px] text-brand-fg/60 leading-snug mb-3">
                {avgMatch < 30
                  ? "Tambahkan skill, portofolio, atau target karir untuk meningkatkan Kecocokan Kerja Anda."
                  : `${cocok} dari ${scoredJobs.length} lowongan sesuai dengan profil aksesibilitas Anda.`}
              </p>
              <Link href="/profil-kerja"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-primary text-white text-[10px] font-bold hover:bg-brand-primary-hover transition-all">
                <Accessibility className="w-3.5 h-3.5" />
                {avgMatch < 30 ? "Lengkapi Profil" : "Perbarui Profil Kerja"}
              </Link>
            </div>
          </div>
        </div>

        {/* ═══ MAIN CONTENT ═══ */}
        <div className="px-5 space-y-6 pb-6">

          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-3">
            <Link href="/jobs"
              className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all">
              <div className="p-2 bg-white/20 rounded-xl"><Briefcase className="w-5 h-5" /></div>
              <div><div className="font-black text-sm">Cari Kerja</div><div className="text-[10px] text-white/70">Lihat semua lowongan</div></div>
            </Link>
            <Link href="/profil-kerja"
              className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-700 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all">
              <div className="p-2 bg-white/20 rounded-xl"><Award className="w-5 h-5" /></div>
              <div><div className="font-black text-sm">Profil Kerja</div><div className="text-[10px] text-white/70">Update keahlianmu</div></div>
            </Link>
            <Link href="/interview-prep"
              className="col-span-2 flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all">
              <div className="p-2 bg-white/20 rounded-xl"><Mic className="w-5 h-5" /></div>
              <div><div className="font-black text-sm">Persiapan Wawancara</div><div className="text-[10px] text-white/70">Latihan simulasi pertanyaan HRD</div></div>
            </Link>
          </div>

          {/* Recommended Jobs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-black text-brand-fg">Rekomendasi Untukmu</h2>
                <p className="text-[11px] text-brand-fg/50">Diurutkan berdasarkan Kecocokan Kerja</p>
              </div>
              <Link href="/jobs" className="flex items-center gap-0.5 text-xs font-bold text-brand-primary hover:underline">
                Lihat Semua<ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {topJobs.map((job) => {
                const rec = getRecruiter(job.id);
                return (
                  <Link key={job.id} href={`/jobs/${job.id}`}
                    className="block bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-brand-primary/30 transition-all cursor-pointer">
                    {/* row 1: title + match badge */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-black text-sm text-brand-fg leading-snug flex-1">{job.title}</h3>
                      <AbleMatchScore score={job.matchScore} />
                    </div>

                    {/* row 2: company + location */}
                    <div className="flex items-center gap-3 text-[11px] text-brand-fg/60 mb-3">
                      <span className="flex items-center gap-1 font-semibold">
                        <svg className="w-3 h-3 fill-emerald-500" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        {job.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />{job.location.split(" (")[0]}
                      </span>
                      <span className="ml-auto font-bold text-brand-primary text-[10px]">{fmtSalary(job.salary)}/bln</span>
                    </div>

                    {/* row 3: job type tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {[
                        job.type === "remote" ? "Remote" : job.type === "hybrid" ? "Hybrid" : "Onsite",
                        job.id === "1" || job.id === "5" ? "Penuh Waktu" : "Kontrak",
                        job.id === "2" ? "D3" : "S1 / SMA"
                      ].map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg">{tag}</span>
                      ))}
                    </div>

                    {/* divider */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider whitespace-nowrap">Akomodasi Aksesibilitas</span>
                      <div className="flex-1 h-px bg-slate-100" />
                    </div>

                    {/* accommodations */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {job.accommodations.slice(0, 3).map(key => {
                        const matched = selectedNeeds.includes(key);
                        return (
                          <span key={key} className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold ${matched
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-50 text-slate-500 border-slate-200"
                            }`}>{getAccLabel(key)}</span>
                        );
                      })}
                    </div>

                    {/* bottom: recruiter + salary */}
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                      <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 text-[10px] font-black flex items-center justify-center border border-indigo-200 shrink-0">
                        {rec.initials}
                      </div>
                      <div className="text-[10px] text-brand-fg/60">
                        <span className="font-bold text-brand-fg">{rec.name}</span>
                        <span className="mx-1">·</span>
                        <span className="text-emerald-600 font-semibold">Terverifikasi</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Bottom CTA banner */}
          <div className="rounded-3xl bg-gradient-to-r from-brand-primary to-cyan-500 p-5 flex items-center gap-4 text-white shadow-xl shadow-brand-primary/20">
            <div className="p-3 bg-white/15 rounded-2xl shrink-0"><Zap className="w-6 h-6" /></div>
            <div className="flex-1 min-w-0">
              <div className="font-black text-sm mb-0.5">Lamar Lebih Mudah</div>
              <div className="text-[11px] text-white/80 leading-snug">Kirim lamaran dengan satu klik menggunakan Profil Kerja Anda</div>
            </div>
            <Link href="/jobs" className="shrink-0 px-3 py-2 bg-white text-brand-primary rounded-xl text-[10px] font-black hover:bg-blue-50 transition-all">
              Mulai
            </Link>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
