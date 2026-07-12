import React from "react";
import { Check, X } from "lucide-react";

interface MatchReasonCardProps {
  accessibilityScore: number;
  skillScore: number;
  portfolioScore: number;
  jobInterestScore: number;
  className?: string;
}

export const MatchReasonCard: React.FC<MatchReasonCardProps> = ({
  accessibilityScore,
  skillScore,
  portfolioScore,
  jobInterestScore,
  className = ""
}) => {
  const criteria = [
    {
      matched: accessibilityScore >= 0.5,
      score: Math.round(accessibilityScore * 100),
      text: "Dukungan akses tersedia (50%)",
      failText: "Dukungan akses kurang lengkap (50%)"
    },
    {
      matched: skillScore >= 0.5,
      score: Math.round(skillScore * 100),
      text: "Skill sesuai (20%)",
      failText: "Skill belum sesuai (20%)"
    },
    {
      matched: portfolioScore >= 0.5,
      score: Math.round(portfolioScore * 100),
      text: "Portofolio relevan (20%)",
      failText: "Portofolio kurang relevan (20%)"
    },
    {
      matched: jobInterestScore >= 0.5,
      score: Math.round(jobInterestScore * 100),
      text: "Target karir sesuai (10%)",
      failText: "Target karir kurang sesuai (10%)"
    }
  ];

  return (
    <div className={`bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3 ${className}`}>
      <h3 className="text-xs font-black text-brand-fg flex items-center gap-2">
        <span className="w-1 h-4 rounded-full bg-brand-primary inline-block" />
        Kenapa pekerjaan ini cocok?
      </h3>
      <div className="grid grid-cols-1 gap-2.5 pt-1">
        {criteria.map((r, i) => (
          <div key={i} className="flex items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2.5">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                r.matched 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-500" 
                  : "bg-slate-50 border-slate-200 text-slate-400"
              }`}>
                {r.matched ? <Check className="w-3 h-3" /> : <X className="w-2.5 h-2.5" />}
              </div>
              <span className={`font-bold ${r.matched ? "text-brand-fg" : "text-slate-400"}`}>
                {r.matched ? r.text : r.failText}
              </span>
            </div>
            <span className={`font-black shrink-0 ${r.matched ? "text-emerald-600" : "text-slate-400 font-bold"}`}>
              {r.score}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
