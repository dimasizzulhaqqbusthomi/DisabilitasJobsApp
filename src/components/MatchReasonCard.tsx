import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface MatchReasonCardProps {
  accessibilityScore: number;
  skillScore: number;
  portfolioScore: number;
  jobInterestScore: number;
  className?: string;
}

const getExplanation = (name: string, score: number): string => {
  if (name === "Dukungan Aksesibilitas") {
    if (score === 100) return "Semua kebutuhan akomodasi aksesibilitas kamu terpenuhi.";
    if (score >= 70) return "Sebagian besar akomodasi aksesibilitas kamu terpenuhi dengan baik.";
    if (score >= 40) return "Beberapa akomodasi aksesibilitas kamu terpenuhi oleh perusahaan ini.";
    return "Akomodasi aksesibilitas yang tersedia kurang cocok dengan kebutuhan kamu.";
  }
  if (name === "Skill") {
    if (score === 0) return "Belum ditemukan skill yang sesuai dari Skill Passport kamu.";
    if (score >= 70) return "Sebagian besar skill kamu sangat cocok dengan syarat pekerjaan ini.";
    if (score >= 40) return "Beberapa skill di Skill Passport kamu cocok dengan pekerjaan ini.";
    return "Hanya sedikit skill kamu yang cocok dengan syarat pekerjaan ini.";
  }
  if (name === "Portfolio") {
    if (score >= 70) return "Beberapa portofolio kamu relevan dengan pekerjaan ini.";
    if (score >= 40) return "Ada portofolio kamu yang memiliki kemiripan dengan pekerjaan ini.";
    return "Belum ada portofolio kamu yang relevan atau portofoliomu masih kosong.";
  }
  if (name === "Target Karir") {
    if (score >= 70) return "Target karirmu sangat sesuai dengan posisi pekerjaan ini.";
    if (score >= 40) return "Pekerjaan ini memiliki keselarasan sedang dengan target karirmu.";
    return "Pekerjaan ini memiliki kesamaan bidang yang rendah dengan target karirmu.";
  }
  return "";
};

export const MatchReasonCard: React.FC<MatchReasonCardProps> = ({
  accessibilityScore,
  skillScore,
  portfolioScore,
  jobInterestScore,
  className = ""
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const criteria = [
    {
      name: "Dukungan Aksesibilitas",
      weight: 50,
      score: Math.round(accessibilityScore * 100),
    },
    {
      name: "Skill",
      weight: 20,
      score: Math.round(skillScore * 100),
    },
    {
      name: "Portfolio",
      weight: 20,
      score: Math.round(portfolioScore * 100),
    },
    {
      name: "Target Karir",
      weight: 10,
      score: Math.round(jobInterestScore * 100),
    }
  ];

  return (
    <div className={`bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4 ${className}`}>
      <h3 className="text-xs font-black text-brand-fg flex items-center gap-2">
        <span className="w-1 h-4 rounded-full bg-brand-primary inline-block" />
        Analisis Kecocokan Pekerjaan
      </h3>
      <div className="flex flex-col gap-3 pt-1">
        {criteria.map((r, i) => {
          const isExpanded = expandedIndex === i;
          return (
            <div
              key={i}
              onClick={() => setExpandedIndex(isExpanded ? null : i)}
              className="flex flex-col p-2.5 -mx-2.5 rounded-2xl hover:bg-slate-50/80 active:bg-slate-100/50 cursor-pointer transition-colors"
            >
              <div className="flex justify-between items-center mb-1">
                <div className="text-xs font-extrabold text-slate-800">
                  {r.name}
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">
                    Detail
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180 text-brand-primary" : ""}`} />
                </div>
              </div>
              <div className="flex items-center gap-5 text-[11px] text-slate-500">
                <span className="font-semibold">Bobot {r.weight}%</span>
                <span className="font-semibold">
                  Kecocokan{" "}
                  <span className={r.score >= 70 ? "text-emerald-600 font-bold" : r.score >= 40 ? "text-indigo-600 font-bold" : "text-amber-600 font-bold"}>
                    {r.score}%
                  </span>
                </span>
              </div>
              {/* Elegant progress bar */}
              <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden mt-1.5 border border-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${r.score >= 70
                      ? "bg-emerald-500"
                      : r.score >= 40
                        ? "bg-indigo-500"
                        : "bg-amber-400"
                    }`}
                  style={{ width: `${r.score}%` }}
                />
              </div>
              {isExpanded && (
                <div className="mt-2 text-[10px] text-slate-600 bg-slate-50 border border-slate-100 p-2.5 rounded-xl leading-relaxed animate-fade-in">
                  {getExplanation(r.name, r.score)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

