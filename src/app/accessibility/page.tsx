"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAccessibility } from "../../context/AccessibilityContext";
import AppLayout from "../../components/AppLayout";
import {
  ChevronLeft,
  Sparkles,
  Eye,
  FileCheck,
  ZapOff
} from "lucide-react";

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${checked ? "bg-emerald-500" : "bg-slate-200"
        }`}
    >
      <span
        className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${checked ? "translate-x-4.5" : "translate-x-0"
          }`}
      />
    </button>
  );
}

export default function AccessibilityPage() {
  const router = useRouter();
  const {
    simpleLanguage,
    toggleSimpleLanguage,
    highContrast,
    toggleHighContrast,
    screenReaderLabels,
    toggleScreenReaderLabels,
    reducedMotion,
    toggleReducedMotion
  } = useAccessibility();

  return (
    <AppLayout showHeader={false} mainClassName="flex-1 flex flex-col overflow-hidden bg-brand-bg pb-16">
      <div className="flex-1 overflow-y-auto overflow-x-hidden">

        {/* ═══ CUSTOM BLUE GRADIENT HEADER ═══ */}
        <div className="relative bg-gradient-to-br from-[#4f46e5] via-[#4338ca] to-[#06b6d4] pt-6 pb-20 px-5 overflow-hidden select-none">
          {/* decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute top-4 right-20 w-20 h-20 rounded-full bg-white/5" />
          <div className="absolute bottom-10 left-[-20px] w-32 h-32 rounded-full bg-cyan-400/10" />

          {/* --- TOP NAV HEADER --- */}
          <div className="flex items-center justify-between relative z-10">
            <button
              onClick={() => router.push("/profile")}
              className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all shadow-sm"
              aria-label="Kembali ke profil"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-sm font-black text-white tracking-wide">Aksesibilitas</h2>
            <div className="w-9 h-9" /> {/* Spacer */}
          </div>
        </div>

        {/* ═══ CONTENT CARD ═══ */}
        <div className="px-5 -mt-10 z-20 relative">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden p-6 space-y-6">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800">Pengaturan Aksesibilitas</h3>
              <p className="text-[11px] text-slate-400 font-semibold mt-1">
                Sesuaikan pengaturan tampilan untuk mempermudah navigasi Anda di AbleWork.
              </p>
            </div>

            <div className="divide-y divide-slate-100">

              {/* Bahasa Mudah Toggle */}
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4 min-w-0 flex-1 pr-4">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100/45 flex items-center justify-center text-emerald-600 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs font-black text-slate-700">Bahasa Mudah</span>
                    <span className="block text-[9px] text-slate-400 font-semibold leading-normal mt-0.5">
                      Gunakan tata bahasa yang lebih ringkas dan sederhana
                    </span>
                  </div>
                </div>
                <ToggleSwitch checked={simpleLanguage} onChange={toggleSimpleLanguage} />
              </div>

              {/* Kontras Tinggi Toggle */}
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4 min-w-0 flex-1 pr-4">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100/45 flex items-center justify-center text-emerald-600 shrink-0">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs font-black text-slate-700">Kontras Tinggi</span>
                    <span className="block text-[9px] text-slate-400 font-semibold leading-normal mt-0.5">
                      Tingkatkan rasio kontras warna untuk keterbacaan
                    </span>
                  </div>
                </div>
                <ToggleSwitch checked={highContrast} onChange={toggleHighContrast} />
              </div>

              {/* Pembaca Layar Toggle */}
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4 min-w-0 flex-1 pr-4">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100/45 flex items-center justify-center text-emerald-600 shrink-0">
                    <FileCheck className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs font-black text-slate-700">Optimalkan Pembaca Layar</span>
                    <span className="block text-[9px] text-slate-400 font-semibold leading-normal mt-0.5">
                      Gunakan label deskriptif tambahan untuk screen reader
                    </span>
                  </div>
                </div>
                <ToggleSwitch checked={screenReaderLabels} onChange={toggleScreenReaderLabels} />
              </div>

              {/* Kurangi Animasi Toggle */}
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4 min-w-0 flex-1 pr-4">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100/45 flex items-center justify-center text-emerald-600 shrink-0">
                    <ZapOff className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs font-black text-slate-700">Kurangi Gerakan</span>
                    <span className="block text-[9px] text-slate-400 font-semibold leading-normal mt-0.5">
                      Nonaktifkan animasi transisi visual yang berlebihan
                    </span>
                  </div>
                </div>
                <ToggleSwitch checked={reducedMotion} onChange={toggleReducedMotion} />
              </div>

            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
