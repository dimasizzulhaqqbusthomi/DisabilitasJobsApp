"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppState, Application } from "../../context/AppContext";
import AppLayout from "../../components/AppLayout";
import { JOBS } from "../../data/mockData";
import {
  ArrowLeft,
  Briefcase,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Users,
  Send,
  ChevronRight,
  FileSearch,
  MapPin,
  Building2,
  RefreshCw
} from "lucide-react";

/* ─── Status Config ─── */
const STATUS_CONFIG: Record<Application["status"], {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
  step: number;
}> = {
  applied: {
    label: "Lamaran Terkirim",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    icon: <Send className="w-4 h-4" />,
    step: 1,
  },
  review: {
    label: "Sedang Ditinjau",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    icon: <Eye className="w-4 h-4" />,
    step: 2,
  },
  interview: {
    label: "Dipanggil Wawancara",
    color: "text-sky-600",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-200",
    icon: <Users className="w-4 h-4" />,
    step: 3,
  },
  accepted: {
    label: "Lamaran Diterima",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    icon: <CheckCircle2 className="w-4 h-4" />,
    step: 4,
  },
  rejected: {
    label: "Tidak Lolos",
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    icon: <XCircle className="w-4 h-4" />,
    step: 0,
  },
};

/* ─── Timeline Steps ─── */
const TIMELINE_STEPS = [
  { key: "applied", label: "Terkirim", icon: <Send className="w-3 h-3" /> },
  { key: "review", label: "Ditinjau", icon: <Eye className="w-3 h-3" /> },
  { key: "interview", label: "Wawancara", icon: <Users className="w-3 h-3" /> },
  { key: "accepted", label: "Diterima", icon: <CheckCircle2 className="w-3 h-3" /> },
];

/* ─── Company Initials Helper ─── */
const getInitials = (company: string) =>
  company.replace(/^PT\s+/i, "").split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();

function ApplicationCard({ app }: { app: Application }) {
  const { cancelApplication, showToast } = useAppState();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [canceling, setCanceling] = useState(false);

  const job = JOBS.find(j => j.id === app.jobId);
  if (!job) return null;

  const statusConf = STATUS_CONFIG[app.status];
  const currentStep = statusConf.step;
  const isRejected = app.status === "rejected";

  const handleCancelConfirm = async () => {
    setCanceling(true);
    await cancelApplication(app.jobId);
    showToast("Lamaran berhasil dibatalkan.", "info");
    setCanceling(false);
    setShowCancelModal(false);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      {/* Top Job Info */}
      <div className="p-4 flex items-start gap-3 border-b border-slate-50">
        <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs font-black text-indigo-600 shrink-0 shadow-sm">
          {getInitials(job.company)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-black text-xs text-slate-800 truncate">{job.title}</h3>
          <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400 font-semibold">
            <Building2 className="w-3 h-3 shrink-0" />
            <span className="truncate">{job.company}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400 font-semibold">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{job.location.split(" (")[0]}</span>
          </div>
        </div>
        {/* Status Badge */}
        <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border shrink-0 flex items-center gap-1 ${statusConf.bgColor} ${statusConf.color} ${statusConf.borderColor}`}>
          {statusConf.icon}
          {statusConf.label}
        </span>
      </div>

      {/* Timeline Progress (hidden for rejected) */}
      {!isRejected ? (
        <div className="px-4 py-3.5">
          <div className="flex items-center justify-between relative">
            {/* Progress line background */}
            <div className="absolute top-3 left-3 right-3 h-0.5 bg-slate-100 rounded-full z-0" />
            {/* Active progress line */}
            <div
              className="absolute top-3 left-3 h-0.5 bg-indigo-500 rounded-full z-0 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / 3) * (100 - 0)}%` }}
            />

            {TIMELINE_STEPS.map((step, idx) => {
              const stepNum = idx + 1;
              const isDone = currentStep > stepNum;
              const isActive = currentStep === stepNum;
              return (
                <div key={step.key} className="relative z-10 flex flex-col items-center gap-1.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${isDone
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : isActive
                        ? "bg-white border-indigo-500 text-indigo-600 ring-4 ring-indigo-50 shadow-sm"
                        : "bg-white border-slate-200 text-slate-300"
                    }`}>
                    {isDone ? <CheckCircle2 className="w-3 h-3" /> : step.icon}
                  </div>
                  <span className={`text-[9px] font-black ${isActive ? "text-indigo-600" : isDone ? "text-slate-600" : "text-slate-300"}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="px-4 py-3 flex items-center gap-2">
          <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
            Belum Berlanjut Perusahaan memilih kandidat lain untuk posisi ini. Tetap semangat mencari peluang lain.
          </p>
        </div>
      )}

      {/* Footer Row */}
      <div className="px-4 py-3 bg-slate-50/60 flex items-center justify-between border-t border-slate-50">
        <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-semibold">
          <Clock className="w-3 h-3" />
          <span>Dikirim {app.appliedAt}</span>
        </div>
        <div className="flex items-center gap-3">
          {app.status !== "accepted" && app.status !== "rejected" && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="text-[9px] font-black text-rose-500 hover:text-rose-600 transition-colors"
            >
              Batalkan Lamaran
            </button>
          )}
          <Link
            href={`/chat/${app.jobId}`}
            className="flex items-center gap-1 text-[9px] font-black text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Chat HRD
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Custom Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-xs p-6 text-center space-y-4 shadow-2xl border border-slate-100 relative">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mx-auto">
              <XCircle className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-sm font-black text-slate-800">Batalkan Lamaran?</h4>
              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                Apakah Anda yakin ingin membatalkan lamaran untuk posisi <strong className="text-slate-600">{job.title}</strong> di <strong className="text-slate-600">{job.company}</strong>?
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                disabled={canceling}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-[10px] font-black text-slate-500 hover:bg-slate-50 transition-all"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={handleCancelConfirm}
                disabled={canceling}
                className="flex-1 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-[10px] font-black text-white shadow-md shadow-rose-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                {canceling ? (
                  <span>Memproses...</span>
                ) : (
                  <span>Ya, Batalkan</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ApplicationsPage() {
  const { appliedJobs } = useAppState();
  const [filter, setFilter] = useState<"all" | Application["status"]>("all");

  const filtered = filter === "all"
    ? appliedJobs
    : appliedJobs.filter(a => a.status === filter);

  return (
    <AppLayout showHeader={false} mainClassName="flex-1 overflow-y-auto bg-brand-bg pb-24">
      <div className="max-w-2xl mx-auto w-full flex flex-col">

        {/* ─── GRADIENT HEADER ─── */}
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-cyan-500 pt-5 pb-4 px-5 text-white shadow-md shadow-indigo-900/5 relative overflow-hidden select-none mb-4">
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <Link
              href="/dashboard"
              className="w-10 h-10 rounded-full bg-white/10 border border-white/25 flex items-center justify-center hover:bg-white/20 transition-all shrink-0"
              aria-label="Kembali ke Dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <h1 className="text-base font-extrabold text-white absolute left-1/2 -translate-x-1/2">
              Lacak Lamaran
            </h1>
            <div className="w-10 h-10 shrink-0" />
          </div>
        </div>

        {/* ─── CONTENT ─── */}
        <div className="px-4 flex-1 flex flex-col gap-4">

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {([
              { key: "all", label: "Semua" },
              { key: "applied", label: "Terkirim" },
              { key: "review", label: "Ditinjau" },
              { key: "interview", label: "Wawancara" },
              { key: "accepted", label: "Diterima" },
              { key: "rejected", label: "Tidak Lolos" },
            ] as const).map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as typeof filter)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-black border transition-all ${filter === tab.key
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-white text-slate-500 border-slate-200 hover:border-indigo-200 hover:text-indigo-600"
                  }`}
              >
                {tab.label}
                {tab.key === "all" && appliedJobs.length > 0 && (
                  <span className="ml-1 bg-white/25 text-inherit rounded-full px-1">{appliedJobs.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* Application Cards */}
          {filtered.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-4">
                <FileSearch className="w-10 h-10" />
              </div>
              <h2 className="text-sm font-bold text-slate-800 mb-1">Belum Ada Lamaran</h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mb-6">
                {filter === "all"
                  ? "Anda belum melamar pekerjaan apapun. Temukan lowongan yang cocok dan kirim lamaran pertama Anda!"
                  : `Tidak ada lamaran dengan status "${STATUS_CONFIG[filter as Application["status"]]?.label || filter}".`}
              </p>
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md shadow-indigo-600/20 transition-all"
              >
                <Briefcase className="w-3.5 h-3.5" />
                Lihat Lowongan Kerja
              </Link>
            </div>
          ) : (
            <div className="space-y-3 pb-4">
              {filtered.map(app => (
                <ApplicationCard key={app.jobId} app={app} />
              ))}
            </div>
          )}

        </div>
      </div>
    </AppLayout>
  );
}
