import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Shield, Zap, FolderKanban, Target, Info } from "lucide-react";

interface MatchReasonCardProps {
  accessibilityScore: number;
  skillScore: number;
  portfolioScore: number;
  jobInterestScore: number;
  className?: string;
}

/* helpers */
const pct = (raw: number) => Math.round(raw * 100);

const scoreColor = (s: number) =>
  s >= 70 ? "text-emerald-600" : s >= 40 ? "text-indigo-600" : "text-amber-600";

const barColor = (s: number) =>
  s >= 70 ? "bg-emerald-500" : s >= 40 ? "bg-indigo-500" : "bg-amber-400";

const badgeCls = (s: number) =>
  s >= 70
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : s >= 40
      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
      : "bg-amber-50 text-amber-700 border-amber-200";

const getLabel = (s: number) =>
  s >= 70 ? "Baik" : s >= 40 ? "Cukup" : "Kurang";

const getExplanation = (name: string, score: number): string => {
  if (name === "Dukungan Aksesibilitas") {
    if (score === 100) return "Semua akomodasi aksesibilitas yang kamu butuhkan tersedia di perusahaan ini, sangat ideal.";
    if (score >= 70) return "Sebagian besar kebutuhan akomodasi aksesibilitasmu terpenuhi dengan baik oleh perusahaan ini.";
    if (score >= 40) return "Beberapa kebutuhan aksesibilitasmu terpenuhi, namun ada beberapa yang belum ada. Cek bagian Dukungan Kerja di bawah.";
    return "Akomodasi yang tersedia kurang sesuai kebutuhanmu. Pertimbangkan untuk menghubungi rekruter mengenai akomodasi tambahan.";
  }
  if (name === "Kesesuaian Skill") {
    if (score === 0) return "Belum ada skill di Profil Kerjamu yang cocok dengan syarat pekerjaan ini. Pertimbangkan tambah skill yang relevan.";
    if (score >= 70) return "Skill-mu sangat relevan dengan persyaratan pekerjaan ini. Kamu adalah kandidat yang kuat.";
    if (score >= 40) return "Beberapa skill di profilmu relevan. Tambahkan skill lain yang disebutkan di syarat pekerjaan untuk meningkatkan skor.";
    return "Hanya sedikit skill yang cocok. Pelajari skill yang diminta dan tambahkan ke Profil Kerjamu.";
  }
  if (name === "Portofolio") {
    if (score >= 70) return "Portofoliomu sangat relevan dengan bidang pekerjaan ini. Rekruter pasti tertarik.";
    if (score >= 40) return "Ada portofolio yang memiliki kemiripan dengan pekerjaan ini. Tambahkan proyek yang lebih spesifik bila ada.";
    return "Belum ada portofolio yang relevan atau profilmu belum memiliki portofolio. Tambahkan proyek terkait untuk meningkatkan nilai.";
  }
  if (name === "Target Karir") {
    if (score >= 70) return "Target karirmu sangat sesuai dengan posisi ini. Kamu sudah mengarah ke jalur yang tepat.";
    if (score >= 40) return "Pekerjaan ini cukup selaras dengan target karirmu, meskipun tidak sempurna cocok.";
    return "Pekerjaan ini kurang sesuai dengan target karirmu. Namun tetap bisa jadi batu loncatan, pertimbangkan sebelum melamar.";
  }
  return "";
};

const getTip = (name: string, score: number): string | null => {
  if (score >= 70) return null;
  if (name === "Dukungan Aksesibilitas" && score < 70)
    return "Tanyakan langsung ke rekruter apakah ada akomodasi tambahan yang bisa dinegosiasikan.";
  if (name === "Kesesuaian Skill" && score < 70)
    return "Perbarui Profil Kerja dengan skill yang relevan, atau ikuti pelatihan yang tersedia.";
  if (name === "Portofolio" && score < 70)
    return "Tambahkan minimal 1 proyek yang berhubungan dengan pekerjaan ini di Profil Kerja.";
  if (name === "Target Karir" && score < 70)
    return "Perbarui target karir di Profil Kerjamu agar lebih mencerminkan pekerjaan yang kamu lamar.";
  return null;
};

/* icon map */
const ICONS: Record<string, React.ElementType> = {
  "Dukungan Aksesibilitas": Shield,
  "Kesesuaian Skill": Zap,
  "Portofolio": FolderKanban,
  "Target Karir": Target,
};

/* component */
export const MatchReasonCard: React.FC<MatchReasonCardProps> = ({
  accessibilityScore,
  skillScore,
  portfolioScore,
  jobInterestScore,
  className = "",
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const criteria = [
    { name: "Dukungan Aksesibilitas", weight: 50, score: pct(accessibilityScore) },
    { name: "Kesesuaian Skill", weight: 20, score: pct(skillScore) },
    { name: "Portofolio", weight: 20, score: pct(portfolioScore) },
    { name: "Target Karir", weight: 10, score: pct(jobInterestScore) },
  ];

  const overallScore = Math.round(
    (accessibilityScore * 0.5 +
      skillScore * 0.2 +
      portfolioScore * 0.2 +
      jobInterestScore * 0.1) * 100
  );

  return (
    <div className={`bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden ${className}`}>
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xs font-black text-brand-fg flex items-center gap-2">
            <span className="w-1 h-4 rounded-full bg-brand-primary inline-block" />
            Analisis Kecocokan Kerja
          </h3>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-1.5 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Info cara hitung kecocokan"
          >
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* Info panel */}
        {showInfo && (
          <div className="mt-2 p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-[10px] text-indigo-800 leading-relaxed animate-fade-in space-y-1">
            <p className="font-black text-indigo-700 mb-1">Cara Hitung Nilai Kecocokan</p>
            <p>Nilai kecocokan dihitung otomatis dari <strong>4 faktor</strong> berdasarkan Profil Kerjamu:</p>
            <ul className="space-y-0.5 mt-1">
              <li>• <strong>Dukungan Aksesibilitas (50%)</strong>: seberapa banyak kebutuhan akomodasi aksesibilitasmu dipenuhi lowongan ini</li>
              <li>• <strong>Kesesuaian Skill (20%)</strong>: seberapa cocok skill di profilmu dengan syarat pekerjaan</li>
              <li>• <strong>Portofolio (20%)</strong>: relevansi proyek portofoliomu dengan bidang pekerjaan ini</li>
              <li>• <strong>Target Karir (10%)</strong>: keselarasan target karirmu dengan posisi yang ditawarkan</li>
            </ul>
          </div>
        )}

        {/* Overall bar */}
        <div className="flex items-center gap-3 mt-3">
          <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${barColor(overallScore)}`}
              style={{ width: `${overallScore}%` }}
            />
          </div>
          <span className={`text-xs font-black shrink-0 ${scoreColor(overallScore)}`}>
            {overallScore}% Kecocokan
          </span>
        </div>
      </div>

      {/* Criteria list */}
      <div className="p-4 space-y-2">
        {criteria.map((r, i) => {
          const isExpanded = expandedIndex === i;
          const Icon = ICONS[r.name] ?? Shield;
          const tip = getTip(r.name, r.score);

          return (
            <div
              key={i}
              onClick={() => setExpandedIndex(isExpanded ? null : i)}
              className="p-3 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 active:bg-indigo-50/60 cursor-pointer transition-all"
            >
              {/* Row 1: icon + name + badge + chevron */}
              <div className="flex items-center gap-2.5 mb-2">
                <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${badgeCls(r.score)}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-extrabold text-slate-800 leading-tight">{r.name}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${badgeCls(r.score)}`}>
                        {getLabel(r.score)}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isExpanded ? "rotate-180 text-brand-primary" : ""}`}
                      />
                    </div>
                  </div>

                  {/* Row 2: weight + score + bar */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap">Bobot {r.weight}%</span>
                    <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-100">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barColor(r.score)}`}
                        style={{ width: `${r.score}%` }}
                      />
                    </div>
                    <span className={`text-[10px] font-black shrink-0 ${scoreColor(r.score)}`}>
                      {r.score}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Expanded: penjelasan singkat */}
              {isExpanded && (
                <div className="mt-3 space-y-2 animate-fade-in">
                  <p className="text-[10px] text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                    {getExplanation(r.name, r.score)}
                  </p>
                  {tip && (
                    <p className="text-[10px] text-indigo-700 leading-relaxed bg-indigo-50 border border-indigo-100 p-2.5 rounded-xl">
                      {tip}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="px-4 pb-4">
        <div className="p-3 rounded-2xl bg-gradient-to-r from-indigo-50 to-cyan-50 border border-indigo-100 text-[10px] text-indigo-800 leading-relaxed flex flex-col gap-2">
          <span>
            <span className="font-black">Tingkatkan nilai kecocokanmu</span> dengan melengkapi Profil Kerja, tambahkan skill, portofolio, dan target karir yang relevan.
          </span>
          <Link
            href="/profil-kerja"
            className="inline-flex items-center justify-center py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black transition-all text-center shadow-md shadow-indigo-600/15"
          >
            Lengkapi Profil Kerja
          </Link>
        </div>
      </div>
    </div>
  );
};
