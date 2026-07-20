"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useAppState } from "../../context/AppContext";
import { useAccessibility } from "../../context/AccessibilityContext";
import { JOBS, ACCOMMODATIONS, calculateMatchScore } from "../../data/mockData";
import AppLayout from "../../components/AppLayout";
import { AbleMatchScore } from "../../components/AbleMatchScore";
import {
  Search,
  MapPin,
  DollarSign,
  Filter,
  ChevronRight,
  SlidersHorizontal,
  X,
  Briefcase,
  Heart
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
      return { name: "Recruiter AksesKerjaMu", initials: "RA", online: "1 jam lalu" };
  }
};


const getAccLabel = (accKey: string) => {
  switch (accKey) {
    case "remote": return "Kerja dari Rumah (Remote) / Hybrid";
    case "caption_meeting": return "Teks Rapat Video (Caption)";
    case "wheelchair_access": return "Akses Kursi Roda";
    case "written_instruction": return "Instruksi Kerja Tertulis";
    case "screen_reader": return "Mendukung Pembaca Layar (Screen Reader)";
    case "quiet_environment": return "Lingkungan Minim Bising";
    case "flexible_hours": return "Jam Kerja Fleksibel";
    case "chat_communication": return "Wawancara & Komunikasi via Chat";
    default: return accKey;
  }
};


export default function JobListPage() {
  const { selectedNeeds, toggleNeed, currentPersona, jobPreferences, savedJobIds } = useAppState();
  const { simpleLanguage } = useAccessibility();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [selectedSalary, setSelectedSalary] = useState<string>("all");

  // Custom filter panel visibility
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Compute list based on active filters
  const filteredJobs = useMemo(() => {
    return JOBS.map(job => {
      // Recalculate score dynamically based on active selected needs
      const score = calculateMatchScore(job, currentPersona, selectedNeeds, jobPreferences);
      return { ...job, matchScore: score };
    })
      .filter(job => {
        // 1. Search Query Match
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase());

        // 2. Type Match
        const matchesType = selectedType === "all" || job.type === selectedType;

        // 3. Location Match
        const matchesLocation = selectedLocation === "all" ||
          (selectedLocation === "remote" && job.type === "remote") ||
          (selectedLocation === "jakarta" && job.location.includes("Jakarta")) ||
          (selectedLocation === "bandung" && job.location.includes("Bandung")) ||
          (selectedLocation === "yogyakarta" && job.location.includes("Yogyakarta")) ||
          (selectedLocation === "surabaya" && job.location.includes("Surabaya")) ||
          (selectedLocation === "semarang" && job.location.includes("Semarang"));

        // 4. Salary Match
        const matchesSalary = selectedSalary === "all" ||
          (selectedSalary === "low" && job.salary.includes("3.500.000") || job.salary.includes("3.800.000")) ||
          (selectedSalary === "medium" && job.salary.includes("4.200.000") || job.salary.includes("4.500.000")) ||
          (selectedSalary === "high" && job.salary.includes("5.000.000") || job.salary.includes("6.500.000"));

        return matchesSearch && matchesType && matchesLocation && matchesSalary;
      })
      .sort((a, b) => b.matchScore - a.matchScore); // Highest match first
  }, [searchQuery, selectedType, selectedLocation, selectedSalary, selectedNeeds]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedLocation("all");
    setSelectedSalary("all");
  };

  return (
    <AppLayout showHeader={false} mainClassName="flex-1 overflow-y-auto overflow-x-hidden pb-24 bg-brand-bg">
      <div className="flex flex-col min-h-screen">

        {/* ═══ CUSTOM BLUE GRADIENT HEADER ═══ */}
        <div className="relative bg-gradient-to-br from-[#4f46e5] via-[#4338ca] to-[#06b6d4] pt-8 pb-10 px-5 overflow-hidden select-none shadow-lg">
          {/* decorative wave details */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute top-4 right-20 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />

          {/* Top Row: Title + Filter sliders */}
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="w-10" /> {/* Spacer */}

            <h1 className="text-base font-black text-white tracking-wide">Cari Lowongan</h1>

            <Link
              href="/jobs/saved"
              className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 transition-all text-white relative shrink-0"
              aria-label="Lowongan Disimpan"
            >
              <Heart className="w-4.5 h-4.5 fill-rose-400 text-rose-400" />
              {savedJobIds.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-indigo-700">
                  {savedJobIds.length}
                </span>
              )}
            </Link>
          </div>

          {/* Search Capsule */}
          <div className="bg-white rounded-2xl p-1 flex items-center shadow-2xl shadow-black/10 border border-slate-100 max-w-md mx-auto relative z-10">
            {/* Left: Location Select */}
            <div className="relative shrink-0 border-r border-slate-200">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="appearance-none bg-transparent pl-3 pr-7 py-2.5 text-xs font-bold text-slate-700 outline-none cursor-pointer"
              >
                <option value="all">Semua Lokasi</option>
                <option value="remote">Remote</option>
                <option value="jakarta">Jakarta</option>
                <option value="bandung">Bandung</option>
                <option value="yogyakarta">Yogyakarta</option>
                <option value="surabaya">Surabaya</option>
                <option value="semarang">Semarang</option>
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>

            {/* Middle: Keyword Input */}
            <div className="relative flex-1 flex items-center">
              <input
                type="text"
                placeholder="Cari posisi atau perusahaan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent pl-3 pr-9 py-2 text-xs text-slate-800 placeholder:text-slate-400 font-bold outline-none"
              />
              <Search className="absolute right-3 text-slate-400 w-4 h-4" />
            </div>

            {/* Right: Filter icon — inside capsule, separated by left border */}
            <button
              type="button"
              onClick={() => setShowMobileFilters(true)}
              className="shrink-0 border-l border-slate-200 pl-3 pr-2 py-2 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"
              aria-label="Filter"
            >
              <Filter className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* ═══ ACTIVE FILTER BADGES ROW ═══ */}
        {(searchQuery || selectedLocation !== "all" || selectedType !== "all" || selectedSalary !== "all" || selectedNeeds.length > 0) && (
          <div className="flex flex-wrap gap-1.5 px-5 py-3.5 bg-slate-50 border-b border-slate-100 overflow-x-auto scrollbar-none select-none">
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 text-[10px] font-bold text-slate-600 rounded-full shrink-0">
                Kata kunci: "{searchQuery}"
                <button type="button" onClick={() => setSearchQuery("")} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedLocation !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 text-[10px] font-bold text-slate-600 rounded-full shrink-0">
                Lokasi: {selectedLocation}
                <button type="button" onClick={() => setSelectedLocation("all")} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedType !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 text-[10px] font-bold text-slate-600 rounded-full shrink-0">
                Tipe: {selectedType}
                <button type="button" onClick={() => setSelectedType("all")} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedSalary !== "all" && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 text-[10px] font-bold text-slate-600 rounded-full shrink-0">
                Gaji: {selectedSalary === "low" ? "Di bawah 4jt" : selectedSalary === "medium" ? "4jt - 5jt" : "Di atas 5jt"}
                <button type="button" onClick={() => setSelectedSalary("all")} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedNeeds.map(need => {
              const acc = ACCOMMODATIONS.find(a => a.key === need);
              return (
                <span key={need} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 text-[10px] font-bold text-slate-600 rounded-full shrink-0">
                  {acc?.label}
                  <button type="button" onClick={() => toggleNeed(need)} className="hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                </span>
              );
            })}
            <button
              type="button"
              onClick={clearFilters}
              className="text-[10px] font-black text-brand-primary hover:underline ml-auto shrink-0 pl-2"
            >
              Reset Semua
            </button>
          </div>
        )}

        {/* ═══ LIST HEADER & CARDS AREA ═══ */}
        <div className="px-5 py-5 flex-1 flex flex-col space-y-4 max-w-md mx-auto w-full">
          {/* Header Row */}
          <div className="flex items-center justify-between select-none">
            <h2 className="text-sm font-black text-brand-fg">
              {searchQuery ? `Hasil: "${searchQuery}"` : "Semua Lowongan"}
              <span className="text-xs font-bold text-brand-fg/40 ml-1.5">({filteredJobs.length} Lowongan)</span>
            </h2>

            {/* Sort Select */}
            <div className="relative shrink-0">
              <select
                className="appearance-none bg-white border border-slate-100 px-3 py-1.5 pr-7 rounded-xl text-[10px] font-black text-slate-600 shadow-sm outline-none cursor-pointer"
                defaultValue="match"
              >
                <option value="match">Urutan: Kecocokan</option>
                <option value="newest">Urutan: Terbaru</option>
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {filteredJobs.length === 0 && (
            <div className="p-12 border-2 border-dashed border-brand-border rounded-3xl bg-brand-card text-center space-y-4">
              <div className="p-4 bg-brand-primary-light/50 text-brand-primary rounded-full w-fit mx-auto text-2xl">💼</div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-base">Tidak ada lowongan</h3>
                <p className="text-xs text-brand-fg/60 max-w-xs mx-auto">
                  Ubah filter pencarian atau setelan kebutuhan aksesibilitas Anda.
                </p>
              </div>
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold"
              >
                Reset Filter
              </button>
            </div>
          )}

          {/* Job Cards */}
          <div className="space-y-3 pb-8">
            {filteredJobs.map((job) => {
              const recruiter = getRecruiter(job.id);
              return (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="block bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-brand-primary/30 transition-all cursor-pointer"
                >
                  {/* row 1: title + match badge */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-black text-sm text-brand-fg leading-snug flex-1">{job.title}</h3>
                    <AbleMatchScore score={job.matchScore} />
                  </div>

                  {/* row 2: company + location + salary */}
                  <div className="flex items-center gap-3 text-[11px] text-brand-fg/60 mb-3">
                    <span className="flex items-center gap-1 font-semibold">
                      <svg className="w-3 h-3 fill-emerald-500" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {job.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />{job.location.split(" (")[0]}
                    </span>
                    <span className="ml-auto font-bold text-brand-primary text-[10px]">{formatSalary(job.salary)}/bln</span>
                  </div>

                  {/* row 3: type tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {[
                      job.type === "remote" ? "Kerja dari Rumah" : job.type === "hybrid" ? "Hybrid" : "Kerja di Kantor",
                      job.id === "1" || job.id === "5" ? "Penuh Waktu" : "Kontrak",
                      job.id === "2" ? "D3" : job.id === "4" ? "SMA/SMK" : "S1"
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
                    {job.accommodations.slice(0, 3).map((key: string) => {
                      const matched = selectedNeeds.includes(key);
                      return (
                        <span key={key} className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold ${matched
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-50 text-slate-500 border-slate-200"
                          }`}>{getAccLabel(key)}</span>
                      );
                    })}
                  </div>

                  {/* bottom: recruiter */}
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 text-[10px] font-black flex items-center justify-center border border-indigo-200 shrink-0">
                      {recruiter.initials}
                    </div>
                    <div className="text-[10px] text-brand-fg/60 flex-1">
                      <span className="font-bold text-brand-fg">{recruiter.name}</span>
                      <span className="mx-1">·</span>
                      <span className="text-emerald-600 font-semibold">Terverifikasi</span>
                      <span className="mx-1">·</span>
                      <span>Aktif {recruiter.online}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile & Desktop Filter Modal Drawer */}
      {showMobileFilters && (
        <div className="absolute inset-0 z-50 bg-black/60 flex justify-end">
          <div className="w-80 bg-brand-bg h-full p-6 flex flex-col space-y-6 border-l border-brand-border overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-brand-border">
              <h2 className="font-extrabold text-sm flex items-center gap-1.5"><Filter className="w-4 h-4" /> Filter Pencarian</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-1.5 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter: Tipe Kerja */}
            <div className="space-y-2">
              <label htmlFor="mob-type" className="block text-xs font-bold text-zinc-400">Tipe Kerja</label>
              <select
                id="mob-type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-card text-xs focus:border-brand-primary outline-none"
              >
                <option value="all">Semua Tipe Kerja</option>
                <option value="remote">Remote (Dari Rumah)</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">Onsite (Di Kantor)</option>
              </select>
            </div>

            {/* Filter: Lokasi */}
            <div className="space-y-2">
              <label htmlFor="mob-loc" className="block text-xs font-bold text-zinc-400">Lokasi</label>
              <select
                id="mob-loc"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-card text-xs focus:border-brand-primary outline-none"
              >
                <option value="all">Semua Lokasi</option>
                <option value="remote">Bisa Remote</option>
                <option value="jakarta">Jakarta</option>
                <option value="bandung">Bandung</option>
                <option value="yogyakarta">Yogyakarta</option>
                <option value="surabaya">Surabaya</option>
                <option value="semarang">Semarang</option>
              </select>
            </div>

            {/* Filter: Rentang Gaji */}
            <div className="space-y-2">
              <label htmlFor="mob-salary" className="block text-xs font-bold text-zinc-400">Rentang Gaji</label>
              <select
                id="mob-salary"
                value={selectedSalary}
                onChange={(e) => setSelectedSalary(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-brand-border bg-brand-card text-xs focus:border-brand-primary outline-none"
              >
                <option value="all">Semua Gaji</option>
                <option value="low">Di bawah Rp 4 jt</option>
                <option value="medium">Rp 4 jt - Rp 5 jt</option>
                <option value="high">Di atas Rp 5 jt</option>
              </select>
            </div>

            {/* Filter: Akomodasi */}
            <div className="space-y-3 pt-4 border-t border-brand-border">
              <div className="text-xs font-bold text-zinc-400">Akomodasi Aksesibilitas</div>
              <div className="space-y-2.5">
                {ACCOMMODATIONS.map(acc => (
                  <label key={acc.key} className="flex items-start gap-2.5 text-xs text-brand-fg cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={selectedNeeds.includes(acc.key)}
                      onChange={() => toggleNeed(acc.key)}
                      className="rounded border-zinc-300 text-brand-primary focus:ring-brand-primary mt-0.5"
                    />
                    <span>{acc.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4 mt-auto">
              <button
                onClick={clearFilters}
                className="flex-1 p-2.5 rounded-xl border border-brand-border hover:bg-black/5 text-xs font-bold transition-all"
              >
                Reset
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 p-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold transition-all"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
