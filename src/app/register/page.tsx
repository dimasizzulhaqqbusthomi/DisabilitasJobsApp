"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ACCOMMODATIONS } from "../../data/mockData";
import { useAppState } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import {
  Mail, Lock, Eye, EyeOff, User,
  AlertCircle, Loader2, Check, ChevronRight, ChevronLeft,
  Briefcase, UserCheck, HelpCircle
} from "lucide-react";

type Step = 1 | 2 | 3 | 4 | 5;

const STEP_LABELS = ["Akun", "Profil Akses", "Tujuan", "Preferensi", "Konfirmasi"];

const DISABILITY_OPTIONS = [
  { value: "neurodivergent", label: "Neurodivergent (ADHD / Autisme)" },
  { value: "daksa", label: "Disabilitas Fisik / Daksa (kursi roda, dll.)" },
  { value: "rungu", label: "Tuli / Hard of Hearing (rungu)" },
  { value: "netra", label: "Tunanetra / Low Vision (netra)" },
  { value: "wicara", label: "Disabilitas Wicara" },
  { value: "other", label: "Disabilitas lainnya" },
  { value: "none", label: "Tidak ada / Lebih suka tidak menyebutkan" },
];

const DISABILITY_TEMPLATES: Record<string, { needs: string[]; hint: string }> = {
  neurodivergent: { needs: ["written_instruction", "quiet_environment", "flexible_hours", "remote"], hint: "Instruksi tertulis, lingkungan tenang, jam fleksibel & remote cocok untuk ADHD/Autisme." },
  daksa: { needs: ["wheelchair_access", "flexible_hours", "remote"], hint: "Akses kursi roda, jam fleksibel & remote cocok untuk disabilitas fisik." },
  rungu: { needs: ["caption_meeting", "chat_communication", "written_instruction", "remote"], hint: "Caption rapat, komunikasi chat & instruksi tertulis cocok untuk Tuli/Rungu." },
  netra: { needs: ["screen_reader", "written_instruction", "flexible_hours", "remote"], hint: "Screen reader, instruksi tertulis & jam fleksibel cocok untuk Tunanetra." },
  wicara: { needs: ["chat_communication", "written_instruction", "flexible_hours"], hint: "Komunikasi chat & instruksi tertulis cocok untuk disabilitas wicara." },
};

const PURPOSES = [
  { label: "Cari kerja", Icon: Briefcase, desc: "Temukan lowongan kerja inklusif" },
  { label: "Buat profil skill", Icon: UserCheck, desc: "Siapkan passport keahlian digital" },
  { label: "Persiapan interview", Icon: HelpCircle, desc: "Latihan simulasi wawancara" },
];

const INPUT_CLS = "w-full pl-10 pr-4 py-3.5 rounded-2xl border border-brand-border bg-brand-bg text-sm text-brand-fg placeholder:text-zinc-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all";
const SELECT_CLS = "w-full p-3 rounded-xl border border-brand-border bg-white text-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all";

function RegisterForm() {
  const router = useRouter();
  const { updatePreferences, completeOnboarding } = useAppState();
  const { user } = useAuth();

  const [step, setStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);

  // Step 2
  const [disabilityType, setDisabilityType] = useState("");
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);

  // Step 3
  const [purpose, setPurpose] = useState("Cari kerja");

  // Step 4
  const [prefRole, setPrefRole] = useState("Admin Online");
  const [prefLocation, setPrefLocation] = useState("Jakarta Barat (Bisa Remote)");
  const [prefType, setPrefType] = useState<"remote" | "hybrid" | "onsite">("remote");
  const [prefSalary, setPrefSalary] = useState("Rp 3.000.000 - Rp 4.500.000");

  useEffect(() => {
    if (user) {
      setStep(2);
      setFullName(user.user_metadata?.full_name || user.user_metadata?.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const toggleNeed = (key: string) =>
    setSelectedNeeds(p => p.includes(key) ? p.filter(k => k !== key) : [...p, key]);

  const validateStep1 = () => {
    if (fullName.trim().length < 2) { setError("Nama minimal 2 karakter."); return false; }
    if (!email.includes("@")) { setError("Email tidak valid."); return false; }
    if (password.length < 8) { setError("Kata sandi minimal 8 karakter."); return false; }
    if (password !== confirmPassword) { setError("Konfirmasi kata sandi tidak cocok."); return false; }
    return true;
  };

  const handleNext = () => {
    setError(null);
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !disabilityType) { setError("Pilih salah satu jenis disabilitas."); return; }
    if (step < 5) setStep((s) => (s + 1) as Step);
  };

  const handleBack = () => {
    setError(null);
    setStep(s => {
      const minStep = user ? 2 : 1;
      if (s <= minStep) return s as Step;
      return (s - 1) as Step;
    });
  };

  async function handleSubmit() {
    setError(null);
    setIsLoading(true);
    try {
      const { createClient } = await import("../../lib/supabase/client");
      const supabase = createClient();

      if (user) {
        // OAuth update flow
        const { error: updateErr } = await supabase.from("profiles").upsert({
          id: user.id,
          full_name: fullName || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User",
          email: user.email,
          disability_type: disabilityType,
          accessibility_needs: selectedNeeds,
          created_at: new Date().toISOString(),
        });
        if (updateErr) {
          setError(updateErr.message);
          setIsLoading(false);
          return;
        }
        await supabase.auth.updateUser({
          data: {
            full_name: fullName || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User",
            disability_type: disabilityType,
            accessibility_needs: selectedNeeds,
          }
        });
      } else {
        // Standard email/password signup flow
        const { data, error: signUpError } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: fullName, disability_type: disabilityType, accessibility_needs: selectedNeeds, purpose } },
        });
        if (signUpError) { setError(signUpError.message === "{}" ? "Terjadi kesalahan server." : signUpError.message); setIsLoading(false); return; }
        if (data.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id, full_name: fullName, email,
            disability_type: disabilityType, accessibility_needs: selectedNeeds,
            created_at: new Date().toISOString(),
          });
        }
      }
      updatePreferences({ role: prefRole, location: prefLocation, type: prefType, salary: prefSalary });
      completeOnboarding();
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan. Coba lagi."); setIsLoading(false);
    }
  }

  async function handleGoogleSignUp() {
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
        setError(error.message);
        setIsLoading(false);
      }
    } catch {
      setError("Terjadi kesalahan saat mendaftar dengan Google.");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 px-6 pt-10 pb-8 overflow-y-auto">

        {/* Stepper */}
        <div className="flex items-center justify-center gap-0 mb-7">
          {STEP_LABELS.map((label, idx) => {
            const s = (idx + 1) as Step;
            const done = step > s || (s === 1 && user !== null); const active = step === s;
            return (
              <React.Fragment key={label}>
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${done ? "bg-brand-primary border-brand-primary text-white" : active ? "bg-white border-brand-primary text-brand-primary ring-2 ring-brand-primary/20" : "bg-white border-brand-border text-brand-fg/30"}`}>
                    {done ? <Check className="w-3 h-3" /> : s}
                  </div>
                  <span className={`text-[8px] font-bold ${active ? "text-brand-primary" : "text-brand-fg/35"}`}>{label}</span>
                </div>
                {idx < 4 && <div className={`h-0.5 w-8 mb-5 mx-0.5 rounded-full transition-all ${step > s || (s === 1 && user !== null) ? "bg-brand-primary" : "bg-brand-border"}`} />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium mb-4" role="alert">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /><span>{error}</span>
          </div>
        )}

        {/* ── STEP 1: AKUN ── */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="mb-5">
              <h1 className="text-2xl font-black text-brand-fg">Buat Akun Baru</h1>
              <p className="text-xs text-brand-fg/50 mt-0.5">Buat akun untuk mendapatkan semua fitur</p>
            </div>
            <div className="relative"><User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" /><input id="reg-name" type="text" autoComplete="name" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="nama lengkap Anda" className={INPUT_CLS} /></div>
            <div className="relative"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" /><input id="reg-email" type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email Anda" className={INPUT_CLS} /></div>
            <div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" /><input id="reg-pw" type={showPw ? "text" : "password"} autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="kata sandi (min. 8 karakter)" className={INPUT_CLS + " pr-12"} /><button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400">{showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div>
            <div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" /><input id="reg-cpw" type={showCpw ? "text" : "password"} autoComplete="new-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="konfirmasi kata sandi" className={INPUT_CLS + " pr-12"} /><button type="button" onClick={() => setShowCpw(!showCpw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400">{showCpw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div>
          </div>
        )}

        {/* ── STEP 2: PROFIL AKSES ── */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="mb-4"><h2 className="text-xl font-black text-brand-fg">Profil Aksesibilitas</h2><p className="text-xs text-brand-fg/50 mt-0.5">Informasi ini membantu kami mencocokkan lowongan untuk Anda.</p></div>
            <div className="space-y-2">
              <span className="block text-xs font-bold text-brand-fg/70">Jenis Disabilitas</span>
              <div className="grid gap-2">
                {DISABILITY_OPTIONS.map(opt => (
                  <label key={opt.value} className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all text-xs font-medium ${disabilityType === opt.value ? "border-brand-primary bg-brand-primary/5 text-brand-fg" : "border-brand-border hover:bg-brand-bg text-brand-fg/70"}`}>
                    <input type="radio" name="disability_type" value={opt.value} checked={disabilityType === opt.value} onChange={() => { setDisabilityType(opt.value); const t = DISABILITY_TEMPLATES[opt.value]; setSelectedNeeds(t ? t.needs : []); }} className="text-brand-primary focus:ring-brand-primary" />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
            {disabilityType && DISABILITY_TEMPLATES[disabilityType] && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-brand-primary/5 border border-brand-primary/20">
                <svg className="w-4 h-4 text-brand-primary mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                <div><p className="text-[11px] font-bold text-brand-primary mb-0.5">Template diterapkan otomatis</p><p className="text-[10px] text-brand-fg/60 leading-snug">{DISABILITY_TEMPLATES[disabilityType].hint}</p></div>
              </div>
            )}
            <div className="space-y-2 pt-3 border-t border-brand-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-fg/70">Kebutuhan Akomodasi <span className="font-normal text-brand-fg/40">(bisa diubah)</span></span>
                {selectedNeeds.length > 0 && <button type="button" onClick={() => setSelectedNeeds([])} className="text-[10px] text-zinc-400 hover:text-red-500 underline">Reset</button>}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {ACCOMMODATIONS.map(acc => (
                  <label key={acc.key} className={`flex items-start gap-2 p-2.5 rounded-xl border cursor-pointer select-none transition-all text-[11px] font-medium ${selectedNeeds.includes(acc.key) ? "border-brand-primary bg-brand-primary/5 text-brand-fg" : "border-brand-border hover:bg-brand-bg text-brand-fg/70"}`}>
                    <input type="checkbox" checked={selectedNeeds.includes(acc.key)} onChange={() => toggleNeed(acc.key)} className="mt-0.5 rounded text-brand-primary focus:ring-brand-primary shrink-0" />
                    <span>{acc.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: TUJUAN ── */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="mb-4"><h2 className="text-xl font-black text-brand-fg">Apa tujuan utama Anda?</h2><p className="text-xs text-brand-fg/50 mt-0.5">Pilih satu untuk menyesuaikan tampilan dashboard Anda.</p></div>
            <div className="grid gap-3">
              {PURPOSES.map(({ label, Icon, desc }) => {
                const sel = purpose === label;
                return (
                  <button key={label} type="button" onClick={() => setPurpose(label)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all ${sel ? "border-brand-primary bg-brand-primary/5 ring-2 ring-brand-primary/20" : "border-brand-border hover:border-brand-primary/40 hover:bg-brand-bg"}`}>
                    <div className={`p-2.5 rounded-xl shrink-0 ${sel ? "bg-brand-primary text-white" : "bg-brand-primary/10 text-brand-primary"}`}><Icon className="w-5 h-5" /></div>
                    <div><div className="font-bold text-sm text-brand-fg">{label}</div><div className="text-xs text-brand-fg/60 mt-0.5">{desc}</div></div>
                    {sel && <Check className="w-5 h-5 text-brand-primary ml-auto shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STEP 4: PREFERENSI ── */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="mb-4"><h2 className="text-xl font-black text-brand-fg">Preferensi Pekerjaan</h2><p className="text-xs text-brand-fg/50 mt-0.5">Sesuaikan jenis pekerjaan yang ingin Anda temukan.</p></div>
            <div className="space-y-3">
              <div><label className="block text-xs font-bold text-brand-fg/70 mb-1.5">Bidang Pekerjaan</label>
                <select id="pref-role" value={prefRole} onChange={e => setPrefRole(e.target.value)} className={SELECT_CLS}>
                  <option>Admin Online</option><option>Customer Support Chat</option><option>Data Entry Assistant</option><option>Junior Graphic Designer</option><option>Content Admin UMKM</option>
                </select>
              </div>
              <div><label className="block text-xs font-bold text-brand-fg/70 mb-1.5">Lokasi Kerja</label>
                <select id="pref-loc" value={prefLocation} onChange={e => setPrefLocation(e.target.value)} className={SELECT_CLS}>
                  <option value="Jakarta Barat (Bisa Remote)">Jakarta Barat / Remote</option><option value="Bandung (Hybrid)">Bandung / Hybrid</option><option value="Yogyakarta (Bisa Remote)">Yogyakarta / Remote</option><option value="Surabaya (Remote)">Surabaya / Remote</option><option value="Semarang (Remote)">Semarang / Remote</option>
                </select>
              </div>
              <div><label className="block text-xs font-bold text-brand-fg/70 mb-1.5">Tipe Kerja</label>
                <select id="pref-type" value={prefType} onChange={e => setPrefType(e.target.value as "remote" | "hybrid" | "onsite")} className={SELECT_CLS}>
                  <option value="remote">Remote (Kerja dari Rumah)</option><option value="hybrid">Hybrid (Kantor & Rumah)</option><option value="onsite">Onsite (di Kantor)</option>
                </select>
              </div>
              <div><label className="block text-xs font-bold text-brand-fg/70 mb-1.5">Rentang Gaji</label>
                <select id="pref-salary" value={prefSalary} onChange={e => setPrefSalary(e.target.value)} className={SELECT_CLS}>
                  <option>Rp 3.000.000 - Rp 4.500.000</option><option>Rp 4.500.000 - Rp 5.500.000</option><option>Rp 5.500.000 - Rp 7.000.000</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 5: KONFIRMASI ── */}
        {step === 5 && (
          <div className="space-y-4">
            <div className="mb-4"><h2 className="text-xl font-black text-brand-fg">Konfirmasi Data</h2><p className="text-xs text-brand-fg/50 mt-0.5">Periksa ringkasan sebelum membuat akun.</p></div>
            <div className="divide-y divide-brand-border border border-brand-border rounded-2xl overflow-hidden text-xs bg-brand-bg/50">
              <div className="p-3.5 flex justify-between"><span className="font-semibold text-brand-fg/60">Nama</span><span className="font-extrabold text-brand-fg">{fullName}</span></div>
              <div className="p-3.5 flex justify-between"><span className="font-semibold text-brand-fg/60">Email</span><span className="font-extrabold text-brand-fg truncate max-w-[55%] text-right">{email}</span></div>
              <div className="p-3.5 flex justify-between items-start gap-2"><span className="font-semibold text-brand-fg/60 shrink-0">Disabilitas</span><span className="font-extrabold text-brand-fg text-right">{DISABILITY_OPTIONS.find(d => d.value === disabilityType)?.label}</span></div>
              <div className="p-3.5 flex justify-between"><span className="font-semibold text-brand-fg/60">Tujuan</span><span className="font-extrabold text-brand-fg">{purpose}</span></div>
              <div className="p-3.5 flex justify-between"><span className="font-semibold text-brand-fg/60">Tipe Kerja</span><span className="font-extrabold text-brand-fg capitalize">{prefType}</span></div>
              <div className="p-3.5">
                <span className="font-semibold text-brand-fg/60 block mb-2">Akomodasi</span>
                {selectedNeeds.length === 0 ? <span className="italic text-brand-fg/40">Belum dipilih</span> : (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNeeds.map(key => { const acc = ACCOMMODATIONS.find(a => a.key === key); return <span key={key} className="px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-bold">{acc?.label}</span>; })}
                  </div>
                )}
              </div>
            </div>
            <p className="text-[10px] text-brand-fg/40 leading-relaxed">Dengan mendaftar, Anda menyetujui syarat penggunaan AbleWork. Data aksesibilitas Anda hanya digunakan untuk mencocokkan lowongan kerja.</p>
          </div>
        )}

        {/* Navigation */}
        <div className={`flex items-center pt-5 mt-4 border-t border-brand-border ${step > 1 ? "justify-between" : "justify-end"}`}>
          {step > 1 && (
            <button type="button" onClick={handleBack} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-brand-border hover:bg-brand-bg text-sm font-bold transition-all text-brand-fg/70">
              <ChevronLeft className="w-4 h-4" /><span>Kembali</span>
            </button>
          )}
          {step < 5 ? (
            <button type="button" onClick={handleNext} className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-extrabold shadow-md shadow-brand-primary/25 transition-all">
              <span>Lanjutkan</span><ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={isLoading} className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-70 text-white text-sm font-extrabold shadow-md shadow-brand-primary/25 transition-all">
              {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Membuat akun...</span></> : <><span>Buat Akun</span><Check className="w-4 h-4" /></>}
            </button>
          )}
        </div>

        {/* Google + login link (step 1 only) */}
        {step === 1 && (
          <>
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-brand-border" />
              <span className="text-[10px] text-zinc-400 font-medium">Atau daftar dengan</span>
              <div className="flex-1 h-px bg-brand-border" />
            </div>
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl border-2 border-brand-border bg-white hover:bg-brand-bg disabled:opacity-75 disabled:cursor-not-allowed text-sm font-bold text-brand-fg flex items-center justify-center gap-3 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Daftar dengan Google
            </button>
            <p className="text-center text-xs text-brand-fg/50 mt-4">Sudah punya akun?{" "}<Link href="/login" className="font-bold text-brand-primary hover:underline">Masuk di sini</Link></p>
          </>
        )}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-bg flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-brand-primary" /></div>}>
      <RegisterForm />
    </Suspense>
  );
}
