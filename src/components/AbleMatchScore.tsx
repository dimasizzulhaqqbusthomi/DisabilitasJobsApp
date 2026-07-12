import React from "react";

interface AbleMatchScoreProps {
  score: number;
  className?: string;
}

export const AbleMatchScore: React.FC<AbleMatchScoreProps> = ({ score, className = "" }) => {
  const isNotRecommended = score < 50;
  const isGood = score >= 70;

  return (
    <span
      className={`shrink-0 px-2.5 py-1 rounded-xl text-[10px] font-black leading-none border select-none transition-all ${isNotRecommended
        ? "bg-amber-50 text-amber-600 border-amber-200"
        : isGood
          ? "bg-emerald-50 text-emerald-600 border-emerald-200"
          : "bg-indigo-50 text-indigo-600 border-indigo-200"
        } ${className}`}
    >
      {isNotRecommended ? "! Perlu Pertimbangan" : `${score}% Cocok`}
    </span>
  );
};
