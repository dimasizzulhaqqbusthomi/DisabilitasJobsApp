"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Accessibility, Lock, Eye, EyeOff, Mail, AlertCircle, Loader2, ChevronLeft, CheckCircle } from "lucide-react";

type ForgotStep = "email" | "sent" | "reset";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<ForgotStep>("email");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSendReset(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !email.includes("@")) {
      setError("Masukkan alamat email yang valid."); return;
    }
    setIsLoading(true);
    try {
      const { createClient } = await import("../../lib/supabase/client");
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/forgot-password?step=reset`,
      });
      if (error) { setError(error.message); setIsLoading(false); return; }
      setStep("sent");
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (newPassword.length < 8) { setError("Kata sandi minimal 8 karakter."); return; }
    if (newPassword !== confirmPassword) { setError("Konfirmasi kata sandi tidak cocok."); return; }
    setIsLoading(true);
    try {
      const { createClient } = await import("../../lib/supabase/client");
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) { setError(error.message); setIsLoading(false); return; }
      setStep("sent"); // reuse sent step as success
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      {/* Top illustration area */}
      <div className="relative bg-gradient-to-br from-brand-primary/10 via-brand-primary/5 to-transparent flex flex-col items-center pt-10 pb-8 px-6 overflow-hidden">
        <div className="absolute top-4 right-8 w-14 h-14 rounded-full bg-brand-primary/15" />
        <div className="absolute bottom-0 left-6 w-8 h-8 rounded-full bg-brand-primary/10" />

        {/* Back button */}
        <Link href="/login"
          className="absolute top-5 left-5 flex items-center gap-1 text-xs font-bold text-brand-fg/60 hover:text-brand-primary transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </Link>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-5">
          <div className="p-2 bg-brand-primary rounded-xl shadow-lg shadow-brand-primary/30">
            <Accessibility className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black text-brand-fg">
            Able<span className="text-brand-primary">Work</span>
          </span>
        </Link>

        {/* Illustration — lock/reset visual */}
        <div className="w-44 h-32 flex items-center justify-center">
          <svg viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Form/screen background */}
            <rect x="45" y="10" width="110" height="90" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="1.5"/>
            {/* Input rows */}
            <rect x="58" y="30" width="84" height="14" rx="7" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1"/>
            <rect x="64" y="36" width="6" height="3" rx="1.5" fill="#94a3b8"/>
            <rect x="72" y="36" width="40" height="3" rx="1.5" fill="#cbd5e1"/>
            <rect x="58" y="52" width="84" height="14" rx="7" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1"/>
            <rect x="64" y="58" width="6" height="3" rx="1.5" fill="#94a3b8"/>
            <rect x="72" y="58" width="30" height="3" rx="1.5" fill="#cbd5e1"/>
            {/* Button */}
            <rect x="58" y="74" width="84" height="16" rx="8" fill="#4f46e5"/>
            <rect x="78" y="80" width="44" height="4" rx="2" fill="white" opacity="0.8"/>
            {/* Lock icon */}
            <rect x="92" y="102" width="16" height="12" rx="3" fill="#4f46e5" opacity="0.8"/>
            <path d="M95 102 L95 98 Q100 93 105 98 L105 102" stroke="#4f46e5" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <circle cx="100" cy="108" r="2" fill="white"/>
            {/* People silhouettes */}
            <circle cx="162" cy="55" r="10" fill="#4f46e5" opacity="0.10"/>
            <circle cx="162" cy="49" r="6" fill="#4f46e5" opacity="0.35"/>
            <path d="M153 66 Q162 61 171 66" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" opacity="0.35"/>
            <circle cx="32" cy="80" r="6" fill="#4f46e5" opacity="0.07"/>
          </svg>
        </div>

        {/* Step title inside illustration area */}
        <p className="text-xs font-semibold text-brand-primary mt-1">
          {step === "email" ? "Atur Ulang Kata Sandi" : step === "reset" ? "Buat Kata Sandi Baru" : ""}
        </p>
      </div>

      {/* Card */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-4 px-6 pt-8 pb-8 shadow-xl">

        {/* ── STEP: EMAIL ── */}
        {step === "email" && (
          <>
            <h1 className="text-2xl font-black text-brand-fg mb-1">Lupa Kata Sandi?</h1>
            <p className="text-xs text-brand-fg/50 mb-6 leading-relaxed">
              Masukkan email Anda dan kami akan mengirimkan tautan untuk mengatur ulang kata sandi.
            </p>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium mb-4" role="alert">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSendReset} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  id="forgot-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="masukkan email Anda"
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-brand-border bg-brand-bg text-sm text-brand-fg placeholder:text-zinc-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-2xl bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-extrabold shadow-lg shadow-brand-primary/30 transition-all flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /><span>Mengirim...</span></>
                ) : "Kirim Tautan Reset"}
              </button>
            </form>

            <p className="text-center text-xs text-brand-fg/50 mt-6">
              Ingat kata sandi?{" "}
              <Link href="/login" className="font-bold text-brand-primary hover:underline">Masuk di sini</Link>
            </p>
          </>
        )}

        {/* ── STEP: SENT / SUCCESS ── */}
        {step === "sent" && (
          <div className="flex flex-col items-center text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-brand-accent/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-brand-accent" />
            </div>
            <div>
              <h1 className="text-xl font-black text-brand-fg">Email Terkirim!</h1>
              <p className="text-xs text-brand-fg/50 mt-2 leading-relaxed max-w-xs mx-auto">
                Kami telah mengirimkan tautan reset kata sandi ke <strong className="text-brand-fg">{email}</strong>. 
                Cek kotak masuk dan folder spam Anda.
              </p>
            </div>
            <Link href="/login"
              className="w-full py-4 rounded-2xl bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-extrabold shadow-lg shadow-brand-primary/30 transition-all flex items-center justify-center mt-4">
              Kembali ke Halaman Masuk
            </Link>
          </div>
        )}

        {/* ── STEP: RESET (new password) ── */}
        {step === "reset" && (
          <>
            <h1 className="text-2xl font-black text-brand-fg mb-1">Buat Kata Sandi Baru</h1>
            <p className="text-xs text-brand-fg/50 mb-6 leading-relaxed">
              Kata sandi baru Anda harus berbeda dari kata sandi yang pernah digunakan sebelumnya.
            </p>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium mb-4" role="alert">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  id="new-password"
                  type={showNew ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="kata sandi baru"
                  className="w-full pl-10 pr-12 py-3.5 rounded-2xl border border-brand-border bg-brand-bg text-sm text-brand-fg placeholder:text-zinc-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                />
                <button type="button" onClick={() => setShowNew(!showNew)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-brand-fg transition-colors">
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="konfirmasi kata sandi"
                  className="w-full pl-10 pr-12 py-3.5 rounded-2xl border border-brand-border bg-brand-bg text-sm text-brand-fg placeholder:text-zinc-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-brand-fg transition-colors">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-2xl bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-extrabold shadow-lg shadow-brand-primary/30 transition-all flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /><span>Memperbarui...</span></>
                ) : "Buat Kata Sandi Baru"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
