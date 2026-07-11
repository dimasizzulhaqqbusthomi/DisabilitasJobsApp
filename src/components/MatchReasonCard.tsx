import React from "react";
import { Check, X } from "lucide-react";

interface MatchReasonCardProps {
  skillMatch: boolean;
  accessibilityMatch: boolean;
  workPreferenceMatch: boolean;
  experienceMatch: boolean;
  jobInterestMatch?: boolean;
  className?: string;
}

export const MatchReasonCard: React.FC<MatchReasonCardProps> = ({
  skillMatch,
  accessibilityMatch,
  workPreferenceMatch,
  experienceMatch,
  jobInterestMatch = true,
  className = ""
}) => {
  const reasons = [
    { matched: skillMatch, text: "Skill sesuai", failText: "Skill belum sesuai" },
    { matched: accessibilityMatch, text: "Dukungan akses tersedia", failText: "Dukungan akses kurang lengkap" },
    { matched: workPreferenceMatch, text: "Cara kerja sesuai", failText: "Cara kerja kurang sesuai" },
    { matched: jobInterestMatch, text: "Target karir sesuai", failText: "Target karir kurang sesuai" },
    { matched: experienceMatch, text: "Pengalaman sesuai", failText: "Pengalaman belum sesuai" }
  ];

  return (
    <div className={`bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3 ${className}`}>
      <h3 className="text-xs font-black text-brand-fg flex items-center gap-2">
        <span className="w-1 h-4 rounded-full bg-brand-primary inline-block" />
        Kenapa pekerjaan ini cocok?
      </h3>
      <div className="grid grid-cols-1 gap-2.5 pt-1">
        {reasons.map((r, i) => (
          <div key={i} className="flex items-center gap-2.5 text-xs">
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
        ))}
      </div>
    </div>
  );
};
