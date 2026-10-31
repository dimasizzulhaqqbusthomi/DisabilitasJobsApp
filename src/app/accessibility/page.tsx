"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAccessibility } from "../../context/AccessibilityContext";
import AppLayout from "../../components/AppLayout";
import {
  ChevronLeft,
  Globe,
  Eye,
  Scan,
  ZapOff,
} from "lucide-react";

/* ----------------------------------------------------------------
   TOGGLE SWITCH - iOS style
   ---------------------------------------------------------------- */
function ToggleSwitch({
  id,
  checked,
  onChange,
  label,
}: {
  id: string;
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onChange();
        }
      }}
      className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        checked ? "bg-emerald-500" : "bg-slate-200"
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

/* ----------------------------------------------------------------
   SETTING ROW
   ---------------------------------------------------------------- */
function SettingRow({
  id,
  icon: Icon,
  title,
  description,
  checked,
  onChange,
}: {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-b-0">
      <div className="flex items-center gap-4 min-w-0 flex-1 pr-4">
        {/* Icon */}
        <div
          aria-hidden="true"
          className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-500"
        >
          <Icon className="w-5 h-5" />
        </div>

        {/* Labels */}
        <div className="min-w-0 flex-1">
          <label
            htmlFor={id}
            className="block text-sm font-bold text-slate-800 cursor-pointer leading-snug"
          >
            {title}
          </label>
          <span className="block text-xs text-slate-400 mt-0.5 leading-snug">
            {description}
          </span>
        </div>
      </div>

      <ToggleSwitch
        id={id}
        checked={checked}
        onChange={onChange}
        label={`${checked ? "Nonaktifkan" : "Aktifkan"} ${title}`}
      />
    </div>
  );
}

/* ----------------------------------------------------------------
   PAGE
   ---------------------------------------------------------------- */
export default function AccessibilityPage() {
  const router = useRouter();
  const {
    simpleLanguage,     toggleSimpleLanguage,
    highContrast,       toggleHighContrast,
    screenReaderLabels, toggleScreenReaderLabels,
    reducedMotion,      toggleReducedMotion,
  } = useAccessibility();

  const settings = [
    {
      id: "toggle-bahasa-mudah",
      icon: Globe,
      title: "Bahasa Mudah",
      description: "Gunakan tata bahasa yang lebih ringkas dan sederhana",
      checked: simpleLanguage,
      onChange: toggleSimpleLanguage,
    },
    {
      id: "toggle-kontras-tinggi",
      icon: Eye,
      title: "Kontras Tinggi",
      description: "Tingkatkan rasio kontras warna untuk keterbacaan",
      checked: highContrast,
      onChange: toggleHighContrast,
    },
    {
      id: "toggle-pembaca-layar",
      icon: Scan,
      title: "Optimalkan Pembaca Layar",
      description: "Gunakan label deskriptif tambahan untuk pembaca layar",
      checked: screenReaderLabels,
      onChange: toggleScreenReaderLabels,
    },
    {
      id: "toggle-kurangi-gerakan",
      icon: ZapOff,
      title: "Kurangi Gerakan",
      description: "Nonaktifkan animasi transisi visual yang berlebihan",
      checked: reducedMotion,
      onChange: toggleReducedMotion,
    },
  ];

  return (
    <AppLayout showHeader={false} mainClassName="flex-1 flex flex-col overflow-hidden bg-slate-50 pb-16">
      <div className="flex-1 overflow-y-auto overflow-x-hidden">

        {/* HEADER - indigo gradient */}
        <div className="relative bg-gradient-to-br from-[#4f46e5] via-[#4338ca] to-[#06b6d4] pt-6 pb-20 px-5 overflow-hidden select-none">
          {/* Decorative circles */}
          <div aria-hidden="true" className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
          <div aria-hidden="true" className="absolute top-4 right-20 w-20 h-20 rounded-full bg-white/5" />
          <div aria-hidden="true" className="absolute bottom-6 left-[-20px] w-32 h-32 rounded-full bg-cyan-400/10" />

          {/* Top nav */}
          <div className="flex items-center justify-between relative z-10">
            <button
              onClick={() => router.push("/profile")}
              aria-label="Kembali ke profil"
              className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <h1 className="text-sm font-black text-white tracking-wide">
              Aksebilitas
            </h1>

            {/* Spacer */}
            <div className="w-9 h-9" aria-hidden="true" />
          </div>
        </div>

        {/* CONTENT CARD - overlaps header */}
        <div className="px-5 -mt-10 z-20 relative">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden p-6 space-y-1">

            {/* Card header */}
            <div className="mb-2">
              <h2 className="text-sm font-extrabold text-slate-800">
                Pengaturan Aksebilitas
              </h2>
              <p className="text-[11px] text-slate-400 font-medium mt-1 leading-relaxed">
                Sesuaikan pengaturan tampilan untuk mempermudah navigasi Anda di AXES.
              </p>
            </div>

            {/* Settings list */}
            <div className="divide-y divide-slate-100">
              {settings.map((s) => (
                <SettingRow key={s.id} {...s} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
