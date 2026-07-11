"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAppState } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { useAccessibility } from "../../context/AccessibilityContext";
import { ACCOMMODATIONS, JOBS, calculateMatchScore } from "../../data/mockData";
import AppLayout from "../../components/AppLayout";
import {
  User,
  Lock,
  Mail,
  Save,
  Key,
  AlertCircle,
  Loader2,
  Sparkles,
  Check,
  Eye,
  EyeOff,
  Accessibility as AccessIcon,
  BookOpen,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Upload,
  Phone,
  Edit2,
  LogOut,
  MapPin,
  FileCheck,
} from "lucide-react";

const DISABILITY_OPTIONS = [
  { value: "neurodivergent", label: "Neurodivergent (ADHD / Autisme)" },
  { value: "daksa", label: "Disabilitas Fisik / Daksa (kursi roda, dll.)" },
  { value: "rungu", label: "Tuli / Hard of Hearing (rungu)" },
  { value: "netra", label: "Tunanetra / Low Vision (netra)" },
  { value: "wicara", label: "Disabilitas Wicara" },
  { value: "other", label: "Disabilitas lainnya" },
  { value: "none", label: "Tidak ada / Lebih suka tidak menyebutkan" },
];

const WORKING_STYLE_OPTIONS = [
  { key: "structured_task", label: "Pekerjaan Terstruktur", desc: "Nyaman dengan tugas yang memiliki langkah dan instruksi jelas." },
  { key: "independent_work", label: "Fokus Mandiri", desc: "Dapat menyelesaikan pekerjaan dengan sedikit supervisi." },
  { key: "written_communication", label: "Komunikasi Tertulis", desc: "Lebih nyaman menerima instruksi melalui chat atau email." },
  { key: "team_collaboration", label: "Kolaborasi Tim", desc: "Nyaman bekerja bersama tim dan berdiskusi." }
];

const TARGET_CAREER_OPTIONS = [
  "Admin Online",
  "Customer Support",
  "Data Entry",
  "Junior Graphic Designer",
  "Content Admin UMKM"
];

const SOFT_SKILLS_PRESETS = ["komunikasi", "kerjasama tim", "problem solving", "kepemimpinan", "negosiasi", "adaptabilitas", "manajemen waktu"];

const ACC_GROUPS = [
  {
    title: "Cara Bekerja",
    items: [
      { key: "remote", label: "Remote / Hybrid", desc: "Pilihan bekerja dari rumah untuk mengurangi kebutuhan mobilitas fisik.", simpleDesc: "Bisa kerja dari rumah tanpa harus pergi ke kantor." },
      { key: "flexible_hours", label: "Jam Kerja Fleksibel", desc: "Jam kerja dapat disesuaikan untuk kebutuhan terapi, pengobatan, atau manajemen energi.", simpleDesc: "Jam kerja bisa diatur sendiri agar bisa sambil berobat atau istirahat." }
    ]
  },
  {
    title: "Komunikasi",
    items: [
      { key: "caption_meeting", label: "Video Call dengan Caption", desc: "Setiap pertemuan online menyediakan takarir (caption) otomatis atau juru bahasa isyarat.", simpleDesc: "Rapat online ada teks tulisannya agar mudah dimengerti." },
      { key: "written_instruction", label: "Instruksi Kerja Tertulis", desc: "Semua arahan, tugas, dan SOP diberikan secara tertulis untuk mengurangi ambiguitas.", simpleDesc: "Tugas kerja diberikan lewat tulisan yang jelas agar tidak membingungkan." },
      { key: "chat_communication", label: "Interview via Chat", desc: "Wawancara kerja dan koordinasi harian bisa dilakukan menggunakan teks/chat.", simpleDesc: "Bicara dengan bos dan teman kerja lewat ketikan pesan (chat) saja." }
    ]
  },
  {
    title: "Lingkungan",
    items: [
      { key: "wheelchair_access", label: "Akses Kursi Roda", desc: "Gedung kantor dilengkapi ramp, lift, pintu lebar, dan toilet khusus kursi roda.", simpleDesc: "Kantor punya jalan datar (ramp), lift, dan toilet untuk kursi roda." },
      { key: "screen_reader", label: "Screen Reader Friendly", desc: "Perangkat lunak dan sistem internal perusahaan kompatibel dengan aplikasi pembaca layar (NVDA/JAWS).", simpleDesc: "Aplikasi komputer bisa mengeluarkan suara untuk membaca teks di layar." },
      { key: "quiet_environment", label: "Lingkungan Minim Gangguan", desc: "Ruang kerja tenang dengan tingkat kebisingan rendah, cocok untuk neurodivergent.", simpleDesc: "Tempat kerja tenang, tidak berisik, dan nyaman untuk fokus." }
    ]
  }
];

const getShortAccLabel = (k: string) => {
  const map: Record<string, string> = {
    remote: "Remote",
    flexible_hours: "Jam Kerja Fleksibel",
    caption_meeting: "Video Call dengan Caption",
    written_instruction: "Instruksi Kerja Tertulis",
    chat_communication: "Interview via Chat",
    wheelchair_access: "Akses Kursi Roda",
    screen_reader: "Screen Reader Friendly",
    quiet_environment: "Lingkungan Minim Gangguan"
  };
  return map[k] || k;
};

const categorizeSkills = (skills: string[]) => {
  const tech: string[] = [];
  const soft: string[] = [];
  skills.forEach(s => {
    const trimmed = s.trim();
    if (SOFT_SKILLS_PRESETS.includes(trimmed.toLowerCase())) {
      soft.push(trimmed);
    } else {
      tech.push(trimmed);
    }
  });
  return { tech, soft };
};

function DonutRing({ pct, size = 88, stroke = 9 }: { pct: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const color = pct === 0 ? "#f59e0b" : pct >= 70 ? "#10b981" : "#4f46e5";
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.6s ease" }} />
    </svg>
  );
}

export default function ProfilePage() {
  const { currentPersona, refreshProfile, updatePersona, showToast, appliedJobs, selectedNeeds, jobPreferences } = useAppState();
  const { user, signOut } = useAuth();
  const { simpleLanguage } = useAccessibility();

  // Mode & Tabs
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"informasi" | "password">("informasi");

  // Profile Form States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("081234567890");
  const [location, setLocation] = useState("Jakarta");
  const [disabilityType, setDisabilityType] = useState("");
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [selectedNeedsList, setSelectedNeedsList] = useState<string[]>([]);
  const [targetCareers, setTargetCareers] = useState<string[]>([]);
  const [workingStyle, setWorkingStyle] = useState<string[]>([]);

  // Comma-separated Skills edit states
  const [techSkillsStr, setTechSkillsStr] = useState("");
  const [softSkillsStr, setSoftSkillsStr] = useState("");

  // Password Form States
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // General States
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Initialize values
  useEffect(() => {
    if (currentPersona) {
      setFullName(currentPersona.name || "");
      setAvatarUrl(currentPersona.avatar || "");
      setBio(currentPersona.bio || "");
      setExperience(currentPersona.experience || "");
      setEducation(currentPersona.education || "");
      setSelectedNeedsList(currentPersona.needs || []);
      setLocation(currentPersona.location || "Jakarta");
      setTargetCareers(currentPersona.targetCareers || []);
      setWorkingStyle(currentPersona.workingStyle || []);

      // Categorize skills on load
      const skills = currentPersona.skills || [];
      const categorized = categorizeSkills(skills);
      setTechSkillsStr(categorized.tech.join(", "));
      setSoftSkillsStr(categorized.soft.join(", "));

      // Phone local storage binding
      const savedPhone = localStorage.getItem(`app-phone-${currentPersona.id}`);
      setPhone(savedPhone || "081234567890");

      // Resolve disability type value
      const typeStr = currentPersona.disabilityType || "";
      if (typeStr.includes("Neurodivergent")) setDisabilityType("neurodivergent");
      else if (typeStr.includes("Fisik") || typeStr.includes("Daksa")) setDisabilityType("daksa");
      else if (typeStr.includes("Tuli") || typeStr.includes("Hearing") || typeStr.includes("rungu")) setDisabilityType("rungu");
      else if (typeStr.includes("netra") || typeStr.includes("Vision")) setDisabilityType("netra");
      else if (typeStr.includes("Wicara")) setDisabilityType("wicara");
      else if (typeStr.includes("lainnya") || typeStr.includes("other")) setDisabilityType("other");
      else if (typeStr.includes("Umum") || typeStr === "") setDisabilityType("none");
      else setDisabilityType("none");
    }

    if (user) {
      setEmail(user.email || "");
    } else {
      setEmail("mode-simulasi@ablework.com");
    }
  }, [currentPersona, user]);

  // Toggle Accommodations
  const handleToggleNeed = (key: string) => {
    setSelectedNeedsList((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Toggle Target Career
  const handleToggleCareer = (career: string) => {
    setTargetCareers((prev) =>
      prev.includes(career) ? prev.filter((c) => c !== career) : [...prev, career]
    );
  };

  // Toggle Working Style
  const handleToggleWorkingStyle = (key: string) => {
    setWorkingStyle((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Avatar Upload Handler
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("Ukuran gambar terlalu besar. Maksimal 2MB.", "warning");
      return;
    }

    if (!user) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarUrl(reader.result as string);
      reader.readAsDataURL(file);
      return;
    }

    setAvatarUploading(true);
    try {
      const { createClient } = await import("../../lib/supabase/client");
      const supabase = createClient();

      const ext = file.name.split(".").pop();
      const filePath = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true, contentType: file.type });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

      setAvatarUrl(publicUrl);
      showToast("Foto profil berhasil diunggah!", "success");
    } catch (err: any) {
      console.error("Avatar upload error:", err);
      showToast("Gagal mengunggah foto. Coba lagi.", "warning");
    } finally {
      setAvatarUploading(false);
    }
  };

  // Save Profile Form
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileError(null);

    const techList = techSkillsStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const softList = softSkillsStr
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const combinedSkills = [...techList, ...softList];

    try {
      if (user) {
        // Save phone locally
        localStorage.setItem(`app-phone-${currentPersona.id}`, phone);

        // Update context & localStorage (runs db sync internally inside updatePersona)
        updatePersona({
          name: fullName,
          avatar: avatarUrl,
          disabilityType: DISABILITY_OPTIONS.find((opt) => opt.value === disabilityType)?.label || "Umum",
          bio: bio,
          skills: combinedSkills,
          experience: experience,
          education: education,
          needs: selectedNeedsList,
          workingStyle: workingStyle,
          targetCareers: targetCareers,
          location: location,
        });

        showToast("Profil Anda berhasil diperbarui!", "success");
      } else {
        // Mock Mode: update locally in AppContext
        const resolvedDisabilityLabel =
          DISABILITY_OPTIONS.find((opt) => opt.value === disabilityType)?.label || "Umum";

        updatePersona({
          name: fullName,
          avatar: avatarUrl,
          disabilityType: resolvedDisabilityLabel,
          bio: bio,
          skills: combinedSkills,
          experience: experience,
          education: education,
          needs: selectedNeedsList,
          workingStyle: workingStyle,
          targetCareers: targetCareers,
          location: location,
        });

        localStorage.setItem(`app-phone-${currentPersona.id}`, phone);
        showToast("Profil Simulasi berhasil diperbarui!", "success");
      }
      setIsEditMode(false);
    } catch (err: any) {
      console.error(err);
      setProfileError(err?.message || "Terjadi kesalahan saat menyimpan profil.");
      showToast("Gagal memperbarui profil.", "warning");
    } finally {
      setProfileLoading(false);
    }
  };

  // Change Password Form
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword.length < 8) {
      setPasswordError("Kata sandi baru harus minimal 8 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setPasswordLoading(true);

    try {
      if (user) {
        const { createClient } = await import("../../lib/supabase/client");
        const supabase = createClient();
        const { error } = await supabase.auth.updateUser({ password: newPassword });

        if (error) throw error;

        setNewPassword("");
        setConfirmPassword("");
        showToast("Kata sandi Anda berhasil diperbarui!", "success");
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setNewPassword("");
        setConfirmPassword("");
        showToast("Kata sandi simulasi berhasil diperbarui!", "success");
      }
      setIsEditMode(false);
    } catch (err: any) {
      console.error(err);
      setPasswordError(err?.message || "Terjadi kesalahan saat memperbarui kata sandi.");
      showToast("Gagal memperbarui kata sandi.", "warning");
    } finally {
      setPasswordLoading(false);
    }
  };

  // Computed Stats
  const cocokCount = JOBS.map(job => calculateMatchScore(job, currentPersona, selectedNeeds, jobPreferences)).filter(score => score >= 50).length;
  const skillCount = currentPersona?.skills?.length || 0;
  const accommodationCount = selectedNeedsList.length;

  const scoredJobs = JOBS.map(job => ({
    ...job, matchScore: calculateMatchScore(job, currentPersona, selectedNeeds, jobPreferences)
  }));
  const avgMatch = selectedNeeds.length === 0 ? 0
    : Math.round(scoredJobs.reduce((s, j) => s + j.matchScore, 0) / scoredJobs.length);

  const calculateProfileProgress = () => {
    let score = 0;
    if (fullName && fullName.trim().length > 0) score += 10;
    if (email && email.trim().length > 0) score += 10;
    if (phone && phone.trim().length > 0) score += 10;
    if (location && location.trim().length > 0) score += 10;
    if (education && education.trim().length > 0) score += 10;
    if (experience && experience.trim().length > 0) score += 10;
    if (bio && bio.trim().length > 0) score += 10;
    if (targetCareers && targetCareers.length > 0) score += 10;

    const skills = currentPersona?.skills || [];
    if (skills.length > 0 || (techSkillsStr && techSkillsStr.trim().length > 0) || (softSkillsStr && softSkillsStr.trim().length > 0)) {
      score += 10;
    }

    if (selectedNeedsList && selectedNeedsList.length > 0) score += 10;

    return Math.max(10, Math.min(100, score));
  };

  const progressPercent = calculateProfileProgress();

  const initials = fullName ? fullName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "U";

  // Categorize skills for viewing
  const viewSkills = currentPersona?.skills || [];
  const categorizedView = categorizeSkills(viewSkills);

  return (
    <AppLayout
      showHeader={false}
      mainClassName="flex-1 flex flex-col overflow-hidden bg-brand-bg pb-16"
    >
      <div className="flex-1 overflow-y-auto overflow-x-hidden">

        {/* ============================================================
            1. VIEW PROFILE MODE
           ============================================================ */}
        {!isEditMode && (
          <div className="flex flex-col min-h-screen pb-10">

            {/* --- GRADIENT HERO HEADER --- */}
            <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-cyan-500 pt-10 pb-8 px-5 text-white rounded-b-[40px] shadow-lg flex flex-col items-center">
              {/* decorative circles */}
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
              <div className="absolute top-4 right-20 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />
              <div className="absolute bottom-10 left-[-20px] w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

              {/* Title & Edit Button Row */}
              <div className="w-full flex items-center justify-between mb-6 z-10">
                <span className="text-lg font-black tracking-wide">Profil Kerja Inklusif</span>
                <button
                  type="button"
                  onClick={() => { setIsEditMode(true); setActiveTab("informasi"); }}
                  className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-black hover:bg-white/25 transition-all text-white shadow-sm"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Profil</span>
                </button>
              </div>

              {/* User Identity Info */}
              <div className="relative z-10 flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center overflow-hidden shadow-inner mb-4">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-3xl font-black">{initials}</span>
                  )}
                </div>

                <h1 className="text-2xl font-black tracking-wide text-center leading-tight mb-0.5">{fullName}</h1>
                <p className={`text-sm text-center mb-1 ${targetCareers.length > 0 ? "text-cyan-100 font-extrabold" : "text-white/60 font-semibold italic"}`}>
                  {targetCareers.length > 0 ? targetCareers[0] : "Belum mengatur target karir"}
                </p>
                <div className="flex items-center gap-1 text-white/80 text-xs font-bold mb-4">
                  <MapPin className="w-3.5 h-3.5 text-cyan-300" />
                  <span>{location}</span>
                </div>

                {/* Profile Completion Progress Bar */}
                <div className="w-64 bg-white/15 border border-white/10 rounded-2xl p-3 backdrop-blur-sm shadow-inner mb-4 flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[10px] font-black tracking-wide">
                    <span className="text-white/80">Progress Profil</span>
                    <span className="text-cyan-200">{progressPercent}% Lengkap</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-300 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                  </div>
                </div>

                {/* Badge Dukungan Kerja Aktif */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-black text-cyan-100/70 uppercase tracking-widest">Pendukung Kerja</span>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {selectedNeedsList.length === 0 ? (
                      <span className="text-xs italic text-white/50">Tidak ada dukungan aktif</span>
                    ) : (
                      selectedNeedsList.map((needKey) => (
                        <span key={needKey} className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-black flex items-center gap-1 shadow-sm">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                          {getShortAccLabel(needKey)}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="relative z-10 flex gap-3.5 max-w-md mx-auto w-full mt-4">
                {[
                  { label: "Rekomendasi Cocok", val: cocokCount },
                  { label: "Skill", val: skillCount },
                  { label: "Pendukung Kerja", val: accommodationCount },
                ].map(s => (
                  <div key={s.label} className="flex-1 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl py-3 px-2 text-center text-white shadow-md select-none">
                    <div className="font-black text-xl leading-none text-cyan-200">{s.val}</div>
                    <div className="text-[10px] text-white/80 font-bold mt-1 leading-tight">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* --- SECTION ORDER DISPLAY --- */}
            <div className="px-4 mt-4 z-20 relative space-y-4 max-w-md mx-auto w-full">

              {/* Kesesuaian Profil Kerja Card */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5 flex items-center gap-5">
                {/* donut */}
                <div className="relative shrink-0">
                  <DonutRing pct={avgMatch} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-base font-black text-brand-fg leading-none">{avgMatch}%</span>
                    <span className="text-[8px] text-brand-fg/50 font-bold leading-tight">Match</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-black text-sm text-brand-fg mb-0.5">
                    Kesesuaian Profil Kerja
                  </h2>
                  <div className="text-[11px] font-black text-indigo-600 mb-3">
                    {avgMatch}% Cocok
                  </div>

                  {/* Match Factors list */}
                  <div className="space-y-1.5 text-xs font-semibold text-slate-700">
                    <div className="flex items-center gap-2">
                      {targetCareers && targetCareers.length > 0 ? (
                        <>
                          <span className="text-emerald-500 font-extrabold text-[13px]">✓</span>
                          <span>Target karir sesuai</span>
                        </>
                      ) : (
                        <>
                          <span className="text-rose-500 font-extrabold text-[13px]">✗</span>
                          <span className="text-slate-400">Target karir belum diisi</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {currentPersona.skills && currentPersona.skills.length > 0 ? (
                        <>
                          <span className="text-emerald-500 font-extrabold text-[13px]">✓</span>
                          <span>Skill sesuai</span>
                        </>
                      ) : (
                        <>
                          <span className="text-rose-500 font-extrabold text-[13px]">✗</span>
                          <span className="text-slate-400">Skill belum diisi</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedNeedsList && selectedNeedsList.length > 0 ? (
                        <>
                          <span className="text-emerald-500 font-extrabold text-[13px]">✓</span>
                          <span>Dukungan akses tersedia</span>
                        </>
                      ) : (
                        <>
                          <span className="text-rose-500 font-extrabold text-[13px]">✗</span>
                          <span className="text-slate-400">Dukungan akses belum diisi</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {workingStyle && workingStyle.length > 0 ? (
                        <>
                          <span className="text-emerald-500 font-extrabold text-[13px]">✓</span>
                          <span>Gaya kerja sesuai</span>
                        </>
                      ) : (
                        <>
                          <span className="text-rose-500 font-extrabold text-[13px]">✗</span>
                          <span className="text-slate-400">Gaya kerja belum diisi</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. PENGALAMAN KERJA CARD */}
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-brand-fg flex items-center gap-2">
                    <span className="w-1.5 h-4.5 rounded-full bg-indigo-600 inline-block" />
                    Pengalaman Kerja
                  </h3>
                  <button
                    onClick={() => { setIsEditMode(true); setActiveTab("informasi"); }}
                    className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5"
                  >
                    Edit &gt;
                  </button>
                </div>
                <div className="flex items-start gap-3.5 pt-1.5">
                  <div className="w-8.5 h-8.5 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Detail Pengalaman</span>
                    <span className="block text-xs font-bold text-brand-fg mt-0.5 leading-relaxed">{experience || "Belum diisi"}</span>
                  </div>
                </div>
              </div>

              {/* 4. TARGET KARIR CARD */}
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-brand-fg flex items-center gap-2">
                    <span className="w-1.5 h-4.5 rounded-full bg-indigo-600 inline-block" />
                    Target Karir
                  </h3>
                  <button
                    onClick={() => { setIsEditMode(true); setActiveTab("informasi"); }}
                    className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5"
                  >
                    Edit &gt;
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {targetCareers.length === 0 ? (
                    <span className="text-xs italic text-brand-fg/40">Belum ada target karir yang dipilih</span>
                  ) : (
                    targetCareers.map((career) => (
                      <span key={career} className="px-3.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-black flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        {career}
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* 5. SKILL PASSPORT SUMMARY CARD */}
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-3xl p-5 border border-indigo-400/20 shadow-md text-white space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black flex items-center gap-2">
                    <FileCheck className="w-4.5 h-4.5 text-cyan-300" />
                    Skill Passport
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-white/20 border border-white/20 text-[9px] font-black">
                    {progressPercent}% Lengkap
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-white/10 rounded-2xl p-3 shadow-inner text-center">
                  <div>
                    <div className="text-lg font-black text-cyan-200">{skillCount}</div>
                    <div className="text-[9px] text-white/70 font-bold uppercase tracking-wider">Skill Terverifikasi</div>
                  </div>
                  <div className="border-l border-white/10">
                    <div className="text-lg font-black text-cyan-200">2</div>
                    <div className="text-[9px] text-white/70 font-bold uppercase tracking-wider">Portofolio</div>
                  </div>
                </div>

                <Link
                  href="/skill-passport"
                  className="block w-full py-3 rounded-xl bg-white hover:bg-zinc-50 text-indigo-900 text-xs font-black text-center shadow-md shadow-indigo-800/25 transition-all"
                >
                  Lihat Skill Passport
                </Link>
              </div>

              {/* 6. KETERAMPILAN KERJA CARD */}
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-brand-fg flex items-center gap-2">
                    <span className="w-1.5 h-4.5 rounded-full bg-indigo-600 inline-block" />
                    Keterampilan Kerja
                  </h3>
                  <button
                    onClick={() => { setIsEditMode(true); setActiveTab("informasi"); }}
                    className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5"
                  >
                    Edit &gt;
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Technical Skills */}
                  <div className="space-y-2">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Technical Skill</span>
                    <div className="flex flex-wrap gap-2">
                      {categorizedView.tech.length === 0 ? (
                        <span className="text-xs italic text-brand-fg/40">Belum ada technical skill</span>
                      ) : (
                        categorizedView.tech.map((s) => (
                          <span key={s} className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-brand-fg text-xs font-bold flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            {s}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="h-px bg-slate-100" />

                  {/* Soft Skills */}
                  <div className="space-y-2">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Soft Skill</span>
                    <div className="flex flex-wrap gap-2">
                      {categorizedView.soft.length === 0 ? (
                        <span className="text-xs italic text-brand-fg/40">Belum ada soft skill</span>
                      ) : (
                        categorizedView.soft.map((s) => (
                          <span key={s} className="px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-brand-fg text-xs font-bold flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                            {s}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 7. GAYA KERJA SAYA CARD */}
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-brand-fg flex items-center gap-2">
                    <span className="w-1.5 h-4.5 rounded-full bg-indigo-600 inline-block" />
                    Gaya Kerja Saya
                  </h3>
                  <button
                    onClick={() => { setIsEditMode(true); setActiveTab("informasi"); }}
                    className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5"
                  >
                    Edit &gt;
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                  Gaya kerja yang membantu Anda bekerja secara optimal di perusahaan.
                </p>

                <div className="grid gap-2.5 pt-1">
                  {workingStyle.length === 0 ? (
                    <span className="text-xs italic text-brand-fg/40">Belum ada gaya kerja yang dipilih</span>
                  ) : (
                    workingStyle.map((styleKey) => {
                      const opt = WORKING_STYLE_OPTIONS.find((o) => o.key === styleKey);
                      if (!opt) return null;
                      return (
                        <div key={styleKey} className="p-3 rounded-xl border border-indigo-100 bg-indigo-50/40 flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="block text-xs font-black text-indigo-900">{opt.label}</span>
                            <span className="block text-[10px] text-brand-fg/70 font-medium leading-relaxed mt-0.5">{opt.desc}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* 8. KEBUTUHAN AKSES KERJA CARD */}
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-brand-fg flex items-center gap-2">
                      <span className="w-1.5 h-4.5 rounded-full bg-indigo-600 inline-block" />
                      Kebutuhan Akses Kerja
                    </h3>
                    <button
                      onClick={() => { setIsEditMode(true); setActiveTab("informasi"); }}
                      className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5"
                    >
                      Edit &gt;
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-1">
                    Informasi ini membantu AbleWork menemukan lingkungan kerja yang sesuai dengan kebutuhanmu.
                  </p>
                </div>

                <div className="space-y-4 pt-1">
                  {ACC_GROUPS.map((group) => {
                    const selectedInGroup = group.items.filter(item => selectedNeedsList.includes(item.key));
                    if (selectedInGroup.length === 0) return null;
                    return (
                      <div key={group.title} className="space-y-2">
                        <span className="block text-[10px] font-black text-indigo-600/70 uppercase tracking-widest">{group.title}</span>
                        <div className="grid gap-2">
                          {selectedInGroup.map((item) => (
                            <div key={item.key} className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/20 flex items-start gap-2.5">
                              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="block text-xs font-black text-emerald-900">{item.label}</span>
                                <span className="block text-[10px] text-brand-fg/70 font-medium leading-relaxed mt-0.5">
                                  {simpleLanguage ? item.simpleDesc : item.desc}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {selectedNeedsList.length === 0 && (
                    <span className="text-xs italic text-brand-fg/40 block text-center py-2">Belum ada kebutuhan akses kerja terpilih</span>
                  )}
                </div>
              </div>

              {/* 9. INFORMASI PRIBADI CARD */}
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-brand-fg flex items-center gap-2">
                    <span className="w-1.5 h-4.5 rounded-full bg-indigo-600 inline-block" />
                    Informasi Pribadi
                  </h3>
                  <button
                    onClick={() => { setIsEditMode(true); setActiveTab("informasi"); }}
                    className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5"
                  >
                    Edit &gt;
                  </button>
                </div>

                <div className="space-y-3.5 pt-1.5">

                  {/* Email */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-8.5 h-8.5 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Email</span>
                      <span className="block text-xs font-bold text-brand-fg truncate">{email}</span>
                    </div>
                  </div>

                  {/* Nomor HP */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-8.5 h-8.5 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Nomor HP</span>
                      <span className="block text-xs font-bold text-brand-fg">{phone}</span>
                    </div>
                  </div>

                  {/* Pendidikan */}
                  <div className="flex items-center gap-3.5">
                    <div className="w-8.5 h-8.5 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Pendidikan Terakhir</span>
                      <span className="block text-xs font-bold text-brand-fg truncate">{education || "Belum diisi"}</span>
                    </div>
                  </div>

                  {/* Tentang Saya */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-8.5 h-8.5 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Tentang Saya</span>
                      <span className="block text-xs font-bold text-brand-fg mt-0.5 leading-relaxed">
                        {bio || "Pengguna belum menambahkan deskripsi profesional tentang dirinya."}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 10. KELUAR AKUN */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-100">
                <button
                  type="button"
                  onClick={signOut}
                  className="w-full flex items-center justify-between p-4.5 hover:bg-slate-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                      <LogOut className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-xs font-black text-rose-600">Keluar Akun</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ============================================================
            2. EDIT PROFILE MODE (TABBED CONTROLS)
           ============================================================ */}
        {isEditMode && (
          <div className="flex flex-col min-h-screen pb-10">

            {/* --- EDIT MODE GRADIENT HEADER --- */}
            <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-cyan-500 pt-10 pb-20 px-5 text-white rounded-b-[40px] shadow-lg flex flex-col items-center">
              {/* Back Button */}
              <div className="w-full flex items-center gap-3 mb-6 z-10">
                <button
                  type="button"
                  onClick={() => setIsEditMode(false)}
                  className="w-9 h-9 rounded-full bg-white/15 border border-white/20 flex items-center justify-center hover:bg-white/25 transition-all text-white shrink-0 shadow-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm font-black tracking-wide">Edit Profil Kerja</span>
              </div>

              {/* Avatar in Edit Mode */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="relative w-22 h-22 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center overflow-hidden shadow-inner mb-3 group">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-3xl font-black">{initials}</span>
                  )}
                  {avatarUploading && (
                    <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    </div>
                  )}
                </div>

                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-[9px] font-black text-white hover:bg-white/35 transition-all">
                  <Upload className="w-3 h-3" />
                  <span>Ubah Foto Profil</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                    disabled={avatarUploading}
                  />
                </label>
                <p className="text-[10px] text-white/70 font-bold mt-2">{email}</p>
              </div>
            </div>

            {/* --- TAB CONTROL ROW --- */}
            <div className="px-5 -mt-8 z-20 relative max-w-md mx-auto w-full mb-6">
              <div className="bg-white p-1 rounded-2xl border border-slate-100 flex gap-1 shadow-md">
                <button
                  type="button"
                  onClick={() => setActiveTab("informasi")}
                  className={`flex-1 py-3 px-3.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${activeTab === "informasi"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  <User className="w-4 h-4" />
                  <span>Informasi</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("password")}
                  className={`flex-1 py-3 px-3.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${activeTab === "password"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                    }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>Password</span>
                </button>
              </div>
            </div>

            {/* --- TAB FORM CONTENT --- */}
            <div className="px-4 space-y-4 max-w-md mx-auto w-full relative z-10">

              {profileError && (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold" role="alert">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{profileError}</span>
                </div>
              )}

              {/* TAB 1: INFORMASI FORM */}
              {activeTab === "informasi" && (
                <form onSubmit={handleSaveProfile} className="space-y-4">

                  {/* Main Inputs */}
                  <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
                    <h3 className="text-xs font-black text-brand-fg flex items-center gap-2 pb-1 border-b border-slate-100">
                      <span className="w-1 h-3 rounded-full bg-indigo-600 inline-block" />
                      Detail Biodata
                    </h3>

                    {/* Full Name */}
                    <div className="space-y-1">
                      <label htmlFor="profile-name" className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Nama Lengkap
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          id="profile-name"
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Nama lengkap"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs font-bold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                      <label htmlFor="profile-phone" className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Nomor HP
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          id="profile-phone"
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Nomor HP"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs font-bold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-1">
                      <label htmlFor="profile-location" className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Lokasi
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          id="profile-location"
                          type="text"
                          required
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="Contoh: Jakarta"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs font-bold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Disability Type */}
                    <div className="space-y-1">
                      <label htmlFor="profile-disability" className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Jenis Disabilitas
                      </label>
                      <select
                        id="profile-disability"
                        value={disabilityType}
                        onChange={(e) => setDisabilityType(e.target.value)}
                        className="w-full px-3.5 py-3 rounded-xl border border-slate-200 text-xs font-bold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white text-brand-fg"
                      >
                        {DISABILITY_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Education */}
                    <div className="space-y-1">
                      <label htmlFor="profile-education" className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Pendidikan Terakhir
                      </label>
                      <div className="relative">
                        <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          id="profile-education"
                          type="text"
                          value={education}
                          onChange={(e) => setEducation(e.target.value)}
                          placeholder="Contoh: S1 Sastra Inggris"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs font-bold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="space-y-1">
                      <label htmlFor="profile-experience" className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Pengalaman Kerja
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          id="profile-experience"
                          type="text"
                          value={experience}
                          onChange={(e) => setExperience(e.target.value)}
                          placeholder="Contoh: Freelance selama 2 Tahun"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs font-bold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-1">
                      <label htmlFor="profile-bio" className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Tentang Saya (Bio)
                      </label>
                      <textarea
                        id="profile-bio"
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Ringkasan profesional diri Anda..."
                        className="w-full px-3.5 py-3 rounded-xl border border-slate-200 text-xs font-bold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none h-20"
                      />
                    </div>
                  </div>

                  {/* TARGET CAREERS EDIT CARD */}
                  <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
                    <h3 className="text-xs font-black text-brand-fg flex items-center gap-2 pb-1 border-b border-slate-100">
                      <span className="w-1 h-3 rounded-full bg-indigo-600 inline-block" />
                      Target Karir
                    </h3>
                    <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                      Pilih satu atau beberapa karir yang diminati. Data ini digunakan untuk memberikan rekomendasi lowongan.
                    </p>

                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {TARGET_CAREER_OPTIONS.map((career) => {
                        const isChecked = targetCareers.includes(career);
                        return (
                          <label
                            key={career}
                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all text-xs font-bold ${isChecked ? "border-indigo-500 bg-indigo-50/55" : "border-slate-100 hover:bg-slate-50"
                              }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleCareer(career)}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 shrink-0"
                            />
                            <span>{career}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* SKILLS EDIT CARD */}
                  <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
                    <h3 className="text-xs font-black text-brand-fg flex items-center gap-2 pb-1 border-b border-slate-100">
                      <span className="w-1 h-3 rounded-full bg-indigo-600 inline-block" />
                      Keterampilan
                    </h3>

                    {/* Tech Skill */}
                    <div className="space-y-1">
                      <label htmlFor="profile-tech-skills" className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Technical Skill (Pisahkan dengan koma)
                      </label>
                      <textarea
                        id="profile-tech-skills"
                        rows={2}
                        value={techSkillsStr}
                        onChange={(e) => setTechSkillsStr(e.target.value)}
                        placeholder="Contoh: Canva, Microsoft Office, Data Entry"
                        className="w-full px-3.5 py-3 rounded-xl border border-slate-200 text-xs font-bold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none h-16"
                      />
                    </div>

                    {/* Soft Skill */}
                    <div className="space-y-1">
                      <label htmlFor="profile-soft-skills" className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Soft Skill (Pisahkan dengan koma)
                      </label>
                      <textarea
                        id="profile-soft-skills"
                        rows={2}
                        value={softSkillsStr}
                        onChange={(e) => setSoftSkillsStr(e.target.value)}
                        placeholder="Contoh: Komunikasi, Kerjasama Tim, Problem Solving"
                        className="w-full px-3.5 py-3 rounded-xl border border-slate-200 text-xs font-bold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none h-16"
                      />
                    </div>
                  </div>

                  {/* CARA KERJA EDIT CARD */}
                  <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-3">
                    <h3 className="text-xs font-black text-brand-fg flex items-center gap-2 pb-1 border-b border-slate-100">
                      <span className="w-1 h-3 rounded-full bg-indigo-600 inline-block" />
                      Cara Kerja Saya
                    </h3>
                    <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                      Pilih gaya kerja yang membantu kamu bekerja secara optimal.
                    </p>

                    <div className="grid gap-2 pt-1">
                      {WORKING_STYLE_OPTIONS.map((opt) => {
                        const isChecked = workingStyle.includes(opt.key);
                        return (
                          <label
                            key={opt.key}
                            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all text-xs ${isChecked ? "border-indigo-500 bg-indigo-50/55" : "border-slate-100 hover:bg-slate-50"
                              }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleWorkingStyle(opt.key)}
                              className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 shrink-0"
                            />
                            <div className="space-y-0.5">
                              <span className="font-black text-brand-fg block text-[11px]">{opt.label}</span>
                              <span className="text-[9px] text-slate-400 font-medium block leading-normal">{opt.desc}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* KEBUTUHAN AKSES EDIT CARD */}
                  <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">
                    <div>
                      <h3 className="text-xs font-black text-brand-fg flex items-center gap-2 pb-1 border-b border-slate-100">
                        <AccessIcon className="w-4.5 h-4.5 text-indigo-600 shrink-0" />
                        Kebutuhan Akses Kerja
                      </h3>
                      <p className="text-[10px] text-slate-400 font-semibold leading-relaxed mt-1">
                        Informasi ini membantu AbleWork menemukan lingkungan kerja yang sesuai dengan kebutuhanmu.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {ACC_GROUPS.map((group) => (
                        <div key={group.title} className="space-y-2">
                          <span className="block text-[10px] font-black text-indigo-600 uppercase tracking-wider">{group.title}</span>
                          <div className="space-y-2">
                            {group.items.map((acc) => {
                              const isChecked = selectedNeedsList.includes(acc.key);
                              return (
                                <label
                                  key={acc.key}
                                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all text-xs ${isChecked
                                    ? "border-emerald-500 bg-emerald-50/55 shadow-sm"
                                    : "border-slate-100 hover:bg-slate-50"
                                    }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => handleToggleNeed(acc.key)}
                                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0 border-slate-200 w-3.5 h-3.5"
                                  />
                                  <div className="space-y-0.5">
                                    <span className="font-black text-brand-fg block text-[11px]">{acc.label}</span>
                                    <span className="text-[9px] text-slate-400 font-medium block leading-normal">
                                      {simpleLanguage ? acc.simpleDesc : acc.desc}
                                    </span>
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-75 disabled:cursor-not-allowed text-white text-xs font-black shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
                  >
                    {profileLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Simpan Perubahan</span>
                      </>
                    )}
                  </button>

                </form>
              )}

              {/* TAB 2: PASSWORD FORM */}
              {activeTab === "password" && (
                <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
                  <h3 className="text-xs font-black text-brand-fg flex items-center gap-2 mb-4">
                    <Key className="w-4 h-4 text-indigo-600 shrink-0" />
                    Ubah Kata Sandi
                  </h3>

                  {passwordError && (
                    <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold mb-4">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-1">
                      <label htmlFor="profile-new-password" className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Kata Sandi Baru
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          id="profile-new-password"
                          type={showPassword ? "text" : "password"}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Minimal 8 karakter"
                          className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 text-xs font-bold focus:border-indigo-500 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-fg"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="profile-confirm-password" className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Konfirmasi Kata Sandi Baru
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          id="profile-confirm-password"
                          type={showPassword ? "text" : "password"}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Ulangi kata sandi baru"
                          className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 text-xs font-bold focus:border-indigo-500 outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-75 disabled:cursor-not-allowed text-white text-xs font-black shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
                    >
                      {passwordLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Memperbarui...</span>
                        </>
                      ) : (
                        <>
                          <Key className="w-4 h-4" />
                          <span>Ubah Password</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
