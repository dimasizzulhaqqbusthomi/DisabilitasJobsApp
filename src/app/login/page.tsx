"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, Accessibility } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirectTo") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function extractErrorMessage(err: unknown): string {
    if (!err) return "Terjadi kesalahan. Silakan coba lagi.";
    if (typeof err === "string") return err;
    if (typeof err === "object") {
      const e = err as Record<string, unknown>;
      const msg = e.message ?? e.error_description ?? e.msg ?? e.error;
      if (typeof msg === "string" && msg.length > 0) {
        if (msg === "{}" || msg.trim() === "{}") return "Terjadi kesalahan server internal.";
        if (msg === "Invalid login credentials") return "Email atau kata sandi salah.";
        if (msg.includes("Email not confirmed")) return "Email belum dikonfirmasi. Cek inbox Anda.";
        return msg;
      }
    }
    return "Terjadi kesalahan koneksi. Periksa internet Anda.";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const { createClient } = await import("../../lib/supabase/client");
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(extractErrorMessage(error)); setIsLoading(false); return; }
      // Gunakan full navigation ke localhost agar cookie session terbaca dengan benar
      // (menghindari masalah RSC fetch gagal akibat cross-origin atau cookie domain)
      const target = redirectTo.startsWith("/") ? redirectTo : "/dashboard";
      window.location.href = `http://localhost:3000${target}`;
    } catch (err: unknown) {
      setError(extractErrorMessage(err));
      setIsLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError(null);
    setIsLoading(true);
    try {
      const { createClient } = await import("../../lib/supabase/client");
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        setError(extractErrorMessage(error));
        setIsLoading(false);
      }
    } catch (err: unknown) {
      setError(extractErrorMessage(err));
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      {/* Top illustration area */}
      <div className="relative bg-gradient-to-br from-brand-primary/10 via-brand-primary/5 to-transparent flex flex-col items-center pt-12 pb-8 px-6 overflow-hidden">
        {/* Background decorative circles */}
        <div className="absolute top-4 right-8 w-16 h-16 rounded-full bg-brand-primary/15" />
        <div className="absolute bottom-0 left-4 w-10 h-10 rounded-full bg-brand-primary/10" />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-brand-primary rounded-xl shadow-lg shadow-brand-primary/30">
            <Accessibility className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black text-brand-fg">
            Able<span className="text-brand-primary">Work</span>
          </span>
        </Link>

        {/* Illustration placeholder — decorative SVG */}
        <div className="w-48 h-36 flex items-center justify-center">
          <svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Phone mockup */}
            <rect x="70" y="10" width="60" height="100" rx="10" fill="white" stroke="#e2e8f0" strokeWidth="1.5"/>
            <rect x="78" y="22" width="44" height="28" rx="4" fill="#e0e7ff"/>
            <rect x="78" y="56" width="30" height="4" rx="2" fill="#e2e8f0"/>
            <rect x="78" y="64" width="44" height="4" rx="2" fill="#e2e8f0"/>
            <rect x="78" y="72" width="44" height="4" rx="2" fill="#e2e8f0"/>
            <rect x="82" y="84" width="36" height="12" rx="6" fill="#4f46e5"/>
            {/* Person silhouette */}
            <circle cx="155" cy="60" r="12" fill="#4f46e5" opacity="0.15"/>
            <circle cx="155" cy="52" r="7" fill="#4f46e5" opacity="0.5"/>
            <path d="M143 75 Q155 68 167 75" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
            {/* Shield/lock icon */}
            <path d="M100 25 L112 30 L112 42 Q112 50 100 55 Q88 50 88 42 L88 30 Z" fill="#4f46e5" opacity="0.15"/>
            <rect x="96" y="36" width="8" height="7" rx="2" fill="#4f46e5" opacity="0.7"/>
            <path d="M96 36 Q100 31 104 36" stroke="#4f46e5" strokeWidth="1.5" fill="none" opacity="0.7"/>
          </svg>
        </div>
      </div>

      {/* Card form */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-4 px-6 pt-8 pb-8 shadow-xl">
        <h1 className="text-2xl font-black text-brand-fg mb-1">Selamat Datang!</h1>
        <p className="text-xs text-brand-fg/50 mb-6">Masuk untuk melanjutkan pencarian kerja inklusif</p>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium mb-4" role="alert">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off" method="post">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="masukkan email Anda"
              className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-brand-border bg-brand-bg text-sm text-brand-fg placeholder:text-zinc-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="kata sandi"
              className="w-full pl-10 pr-12 py-3.5 rounded-2xl border border-brand-border bg-brand-bg text-sm text-brand-fg placeholder:text-zinc-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-brand-fg transition-colors"
              aria-label={showPassword ? "Sembunyikan" : "Tampilkan"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Forgot password */}
          <div className="flex justify-end -mt-1">
            <Link href="/forgot-password" className="text-xs font-semibold text-brand-primary hover:underline">
              Lupa kata sandi?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm font-extrabold shadow-lg shadow-brand-primary/30 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /><span>Sedang masuk...</span></>
            ) : "Masuk"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-brand-border" />
          <span className="text-[10px] text-zinc-400 font-medium">Anda dapat masuk dengan</span>
          <div className="flex-1 h-px bg-brand-border" />
        </div>

        {/* Google Sign-in */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full py-3.5 rounded-2xl border-2 border-brand-border bg-white hover:bg-brand-bg disabled:opacity-75 disabled:cursor-not-allowed text-sm font-bold text-brand-fg flex items-center justify-center gap-3 transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Masuk dengan Google
        </button>

        {/* Register link */}
        <p className="text-center text-xs text-brand-fg/50 mt-5">
          Belum punya akun?{" "}
          <Link href="/register" className="font-bold text-brand-primary hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
