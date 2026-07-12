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
  Settings,
  ZapOff,
  Image as ImageIcon,
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
  { key: "independent_work", label: "Fokus Mandiri", desc: "Dapat menyelesaikan pekerjaan secara mandiri dengan sedikit supervisi." },
  { key: "team_collaboration", label: "Kolaborasi Tim", desc: "Nyaman bekerja bersama tim dan berdiskusi." },
  { key: "initial_guidance", label: "Membutuhkan Arahan Awal", desc: "Lebih optimal dengan panduan saat memulai pekerjaan." },
  { key: "written_communication", label: "Komunikasi Tertulis", desc: "Lebih nyaman menerima instruksi melalui chat atau email." },
  { key: "quiet_environment", label: "Lingkungan Minim Gangguan", desc: "Bekerja lebih optimal pada lingkungan yang tenang." }
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

const getDisabilityLabel = (val: string) => {
  const found = DISABILITY_OPTIONS.find(opt => opt.value === val);
  return found ? found.label : "Tidak ada / Lebih suka tidak menyebutkan";
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

function CircularProgress({ value, max = 10, size = 48, strokeWidth = 5 }: { value: number; max?: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / max) * circumference;

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#22d3ee"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white">
        {value}/{max}
      </div>
    </div>
  );
}

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

export default function ProfilePage() {
  const { currentPersona, refreshProfile, updatePersona, showToast, appliedJobs, selectedNeeds, jobPreferences } = useAppState();
  const { user, signOut } = useAuth();
  const {
    simpleLanguage,
    toggleSimpleLanguage,
    highContrast,
    toggleHighContrast,
    screenReaderLabels,
    toggleScreenReaderLabels,
    reducedMotion,
    toggleReducedMotion,
  } = useAccessibility();

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
  const [coverUrl, setCoverUrl] = useState("");
  const [coverUploading, setCoverUploading] = useState(false);
  const [purpose, setPurpose] = useState("");
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
      setSelectedNeedsList(selectedNeeds || currentPersona.needs || []);
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

      // Cover local storage binding
      const savedCover = localStorage.getItem(`app-cover-${currentPersona.id}`);
      setCoverUrl(currentPersona.cover || savedCover || "");

      // Purpose binding
      setPurpose(currentPersona.purpose || "");

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
      setEmail("mode-simulasi@akseskerjamu.com");
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

  // Cover Upload Handler
  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("Ukuran gambar terlalu besar. Maksimal 2MB.", "warning");
      return;
    }

    setCoverUploading(true);
    try {
      if (!user) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setCoverUrl(base64data);
          if (currentPersona) {
            localStorage.setItem(`app-cover-${currentPersona.id}`, base64data);
            updatePersona({ cover: base64data });
          }
        };
        reader.readAsDataURL(file);
        showToast("Gambar latar belakang berhasil diperbarui secara lokal!", "success");
        return;
      }

      const { createClient } = await import("../../lib/supabase/client");
      const supabase = createClient();

      const ext = file.name.split(".").pop();
      const filePath = `${user.id}/cover.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true, contentType: file.type });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

      setCoverUrl(publicUrl);
      if (currentPersona) {
        localStorage.setItem(`app-cover-${currentPersona.id}`, publicUrl);
        updatePersona({ cover: publicUrl });
      }
      showToast("Gambar latar belakang berhasil diperbarui!", "success");
    } catch (err: any) {
      console.error("Cover upload error:", err);
      showToast("Gagal mengunggah gambar latar belakang. Coba lagi.", "warning");
    } finally {
      setCoverUploading(false);
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
          purpose: purpose,
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
          purpose: purpose,
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

  const getMissingProfilKerjaFields = () => {
    const missing = [];

    // 1. Profil Dasar (Nama, Pendidikan, Tentang Saya)
    const hasProfile = fullName && fullName.trim().length > 0 &&
      education && education.trim().length > 0 &&
      bio && bio.trim().length > 0;
    if (!hasProfile) missing.push("Profil Dasar");

    // 2. Pengalaman Kerja
    if (!experience || experience.trim().length === 0) missing.push("Pengalaman Kerja");

    // 3. Target Karir
    const hasTarget = targetCareers && targetCareers.length > 0;
    if (!hasTarget) missing.push("Target Karir");

    // 4. Keterampilan
    const hasSkills = currentPersona?.skills && currentPersona.skills.length > 0;
    if (!hasSkills) missing.push("Keterampilan");

    // 5. Kebutuhan Akses Kerja
    const hasNeeds = selectedNeeds && selectedNeeds.length > 0;
    if (!hasNeeds) missing.push("Kebutuhan Akses Kerja");

    // 6. Gaya Kerja
    const hasStyle = workingStyle && workingStyle.length > 0;
    if (!hasStyle) missing.push("Gaya Kerja");

    // 7. Portofolio & Sertifikat
    const hasPortfolioOrCert = (currentPersona?.portfolios && currentPersona.portfolios.length > 0) ||
      (currentPersona?.certificates && currentPersona.certificates.length > 0);
    if (!hasPortfolioOrCert) missing.push("Portofolio & Sertifikat");

    return missing;
  };

  const PROFIL_KERJA_TOTAL = 7;
  const missingFields = getMissingProfilKerjaFields();
  const completedCount = PROFIL_KERJA_TOTAL - missingFields.length;
  const progressPercent = Math.round((completedCount / PROFIL_KERJA_TOTAL) * 100);

  const initials = fullName ? fullName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "U";

  return (
    <AppLayout
      showHeader={false}
      mainClassName="flex-1 flex flex-col overflow-hidden bg-gradient-to-tr from-slate-50 via-teal-50/10 to-indigo-50/30 pb-16"
    >
      <div className="flex-1 overflow-y-auto overflow-x-hidden">

        {/* ============================================================
            1. VIEW PROFILE MODE
           ============================================================ */}
        {!isEditMode && (
          <div className="flex flex-col min-h-screen pb-10">

            {/* --- GRADIENT HEADER BACKGROUND --- */}
            <div className="relative bg-gradient-to-br from-[#4f46e5] via-[#4338ca] to-[#06b6d4] pt-6 pb-[212px] px-5 overflow-hidden select-none">
              {/* decorative circles */}
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
              <div className="absolute top-4 right-20 w-20 h-20 rounded-full bg-white/5" />
              <div className="absolute bottom-10 left-[-20px] w-32 h-32 rounded-full bg-cyan-400/10" />

              {/* --- TOP NAV HEADER --- */}
              <div className="flex items-center justify-between relative z-10">
                <Link
                  href="/"
                  className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all shadow-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Link>
                <h2 className="text-sm font-black text-white tracking-wide">Profil Saya</h2>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setIsEditMode(true); setActiveTab("informasi"); }}
                    className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all shadow-sm"
                    title="Edit Profil & Password"
                  >
                    <Edit2 className="w-4.5 h-4.5" />
                  </button>
                  <Link
                    href="/accessibility"
                    className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all shadow-sm"
                    title="Pengaturan Aksesibilitas"
                  >
                    <Settings className="w-4.5 h-4.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* --- PROFILE BANNER & IDENTITY --- */}
            <div className="px-5 -mt-[172px] z-20 relative">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden relative pb-6">
                {/* Decorative cover gradient banner */}
                <div className="h-28 relative overflow-hidden">
                  {coverUrl ? (
                    <img src={coverUrl} alt="Cover Banner" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-[#4f46e5] via-[#4338ca] to-[#06b6d4]" />
                  )}
                  {/* Subtle top-down overlay shadow */}
                  <div className="absolute inset-0 bg-black/40 pointer-events-none" />

                  {/* Purpose Badge in Top-Right Corner */}
                  {currentPersona?.purpose && (
                    <span className="absolute top-3 right-3 z-10 px-3 py-1.5 rounded-xl bg-emerald-500/20 backdrop-blur-md border border-emerald-500/35 text-emerald-300 text-[9px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1.5 select-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {currentPersona.purpose}
                    </span>
                  )}
                </div>

                {/* Avatar container overlapping banner */}
                <div className="relative -mt-14 flex justify-center">
                  <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md border border-slate-100/50">
                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 flex items-center justify-center">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-indigo-600 text-3xl font-black">{initials}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Text Identity */}
                <div className="text-center mt-3 px-4">
                  <h1 className="text-lg font-black text-slate-800 tracking-wide">{fullName}</h1>
                  <p className="text-[11px] font-bold text-slate-400 mt-0.5">{email}</p>

                  {/* Location & Verified */}
                  <div className="flex items-center justify-center gap-2.5 mt-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-slate-500 uppercase bg-slate-50 border border-slate-100/50 px-3 py-1 rounded-full">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {location || "Asal"}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      PROFILE VERIFIED
                    </span>
                  </div>

                </div>
              </div>
            </div>

            {/* --- PROFIL KERJA SUMMARY CARD --- */}
            <div className="px-5 mt-4 z-20 relative max-w-md mx-auto w-full">
              <div className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-3xl p-5 border border-indigo-400/20 shadow-md text-white space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black flex items-center gap-2">
                    <FileCheck className="w-4.5 h-4.5 text-cyan-300" />
                    Profil Kerja
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-white/20 border border-white/20 text-[9px] font-black">
                    {progressPercent}% Lengkap
                  </span>
                </div>

                {/* Circular Progress & Missing Fields Detail */}
                <div className="flex items-center gap-3.5 bg-white/10 rounded-2xl p-4 shadow-inner">
                  <CircularProgress value={completedCount} max={PROFIL_KERJA_TOTAL} />
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-xs font-black text-white">Kelengkapan Profil Kerja</div>
                    {missingFields.length > 0 ? (
                      <div className="mt-1 space-y-0.5">
                        <span className="block text-[8px] text-cyan-200 font-extrabold uppercase tracking-wider">Belum diisi:</span>
                        <span className="block text-[10px] text-white/90 font-bold leading-normal">
                          {missingFields.join(", ")}
                        </span>
                      </div>
                    ) : (
                      <div className="text-[9px] text-emerald-300 font-black mt-1 uppercase tracking-wider flex items-center gap-1">
                        <Check className="w-3 h-3 shrink-0" />
                        Profil Kerja 100% Lengkap
                      </div>
                    )}
                  </div>
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
                  href="/profil-kerja"
                  className="block w-full py-3 rounded-xl bg-white hover:bg-zinc-50 text-indigo-900 text-xs font-black text-center shadow-md shadow-indigo-800/25 transition-all"
                >
                  Lihat Profil Kerja
                </Link>
              </div>
            </div>

            {/* --- UNIFIED PREFERENCES MENU CARD --- */}
            <div className="px-5 mt-4 z-20 relative max-w-md mx-auto w-full">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100">

                {/* Section Header */}
                <div className="px-5 py-4 bg-slate-50/50">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Informasi Utama</h3>
                </div>

                {/* Nomor HP */}
                <div className="flex items-center gap-4 py-3.5 px-5 hover:bg-slate-50/30 transition-colors">
                  <div className="w-8.5 h-8.5 rounded-xl bg-indigo-50/60 border border-indigo-100/40 flex items-center justify-center text-indigo-600 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Nomor HP</span>
                    <span className="block text-xs font-bold text-slate-700">{phone || "Belum diatur"}</span>
                  </div>
                </div>

                {/* Pendidikan Terakhir */}
                <div className="flex items-center gap-4 py-3.5 px-5 hover:bg-slate-50/30 transition-colors">
                  <div className="w-8.5 h-8.5 rounded-xl bg-indigo-50/60 border border-indigo-100/40 flex items-center justify-center text-indigo-600 shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Pendidikan Terakhir</span>
                    <span className="block text-xs font-bold text-slate-700 truncate">{education || "Belum diatur"}</span>
                  </div>
                </div>

                {/* Jenis Disabilitas */}
                <div className="flex items-center gap-4 py-3.5 px-5 hover:bg-slate-50/30 transition-colors">
                  <div className="w-8.5 h-8.5 rounded-xl bg-indigo-50/60 border border-indigo-100/40 flex items-center justify-center text-indigo-600 shrink-0">
                    <AccessIcon className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Jenis Disabilitas</span>
                    <span className="block text-xs font-bold text-slate-700">{getDisabilityLabel(disabilityType)}</span>
                  </div>
                </div>

                {/* Tentang Saya (Bio) */}
                <div className="flex items-start gap-4 py-4.5 px-5 hover:bg-slate-50/30 transition-colors">
                  <div className="w-8.5 h-8.5 rounded-xl bg-indigo-50/60 border border-indigo-100/40 flex items-center justify-center text-indigo-600 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">Tentang Saya</span>
                    <span className="block text-xs font-bold text-slate-700 mt-1 leading-relaxed">
                      {bio || "Pengguna belum menambahkan deskripsi profesional tentang dirinya."}
                    </span>
                  </div>
                </div>


                {/* --- LOG OUT --- */}
                <button
                  type="button"
                  onClick={signOut}
                  className="w-full flex items-center justify-between py-4 px-5 hover:bg-rose-50/20 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8.5 h-8.5 rounded-xl bg-rose-50 border border-rose-100/30 flex items-center justify-center text-rose-600">
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
            2. EDIT PROFILE MODE
           ============================================================ */}
        {isEditMode && (
          <div className="flex flex-col min-h-screen pb-10">

            {/* --- GRADIENT HEADER BACKGROUND (EDIT MODE) --- */}
            <div className="relative bg-gradient-to-br from-[#4f46e5] via-[#4338ca] to-[#06b6d4] pt-6 pb-[220px] px-5 overflow-hidden select-none mb-6">
              {/* decorative circles */}
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
              <div className="absolute top-4 right-20 w-20 h-20 rounded-full bg-white/5" />
              <div className="absolute bottom-10 left-[-20px] w-32 h-32 rounded-full bg-cyan-400/10" />

              {/* --- EDIT MODE TOP HEADER --- */}
              <div className="flex items-center justify-between relative z-10">
                <button
                  type="button"
                  onClick={() => setIsEditMode(false)}
                  className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition-all shadow-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-sm font-black text-white tracking-wide">Edit Profil</h2>
                <button
                  type="submit"
                  form="profile-form"
                  disabled={profileLoading || passwordLoading}
                  className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-white hover:bg-white/25 disabled:opacity-50 transition-all shadow-sm"
                >
                  {profileLoading || passwordLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <Check className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* --- PROFILE BANNER & IDENTITY CARD (EDIT MODE) --- */}
            <div className="px-5 -mt-[202px] z-20 relative">
              <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden relative pb-6">
                {/* Decorative cover gradient banner */}
                <div className="h-28 relative overflow-hidden">
                  {coverUrl ? (
                    <img src={coverUrl} alt="Cover Banner" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-[#4f46e5] via-[#4338ca] to-[#06b6d4]" />
                  )}
                  {/* Subtle top-down overlay shadow */}
                  <div className="absolute inset-0 bg-black/40 pointer-events-none" />

                  {/* Purpose Badge in Top-Left Corner */}
                  {purpose && (
                    <span className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-xl bg-emerald-500/20 backdrop-blur-md border border-emerald-500/35 text-emerald-300 text-[9px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1.5 select-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {purpose}
                    </span>
                  )}

                  {/* Edit banner badge */}
                  <label className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-black/50 border border-white/20 flex items-center gap-1.5 text-white text-[9px] font-black uppercase tracking-wider cursor-pointer hover:bg-black/70 transition-all shadow-md">
                    {coverUploading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                    ) : (
                      <ImageIcon className="w-3.5 h-3.5 text-white" />
                    )}
                    <span>{coverUploading ? "Mengunggah..." : "Ubah Latar"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      className="hidden"
                      disabled={coverUploading}
                    />
                  </label>
                </div>

                {/* Avatar container overlapping banner */}
                <div className="relative -mt-14 flex justify-center">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md border border-slate-100/50">
                      <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 flex items-center justify-center relative group">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-indigo-600 text-3xl font-black">{initials}</span>
                        )}
                        {avatarUploading && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Loader2 className="w-5 h-5 text-white animate-spin" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Upload camera badge */}
                    <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-white cursor-pointer shadow-md hover:bg-indigo-700 transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                        disabled={avatarUploading}
                      />
                    </label>
                  </div>
                </div>

                {/* Text Identity & Tabs */}
                <div className="text-center mt-3 px-4">
                  <h1 className="text-lg font-black text-slate-800 tracking-wide">{fullName}</h1>
                  <p className="text-[11px] font-bold text-slate-400 mt-0.5">{email}</p>

                  {/* --- TAB CONTROL PILLS --- */}
                  <div className="max-w-md mx-auto w-full mt-4">
                    <div className="bg-slate-50 p-1 rounded-2xl border border-slate-100 flex gap-1 shadow-inner">
                      <button
                        type="button"
                        onClick={() => setActiveTab("informasi")}
                        className={`flex-1 py-3 px-3.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${activeTab === "informasi"
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                          : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                          }`}
                      >
                        <User className="w-4 h-4" />
                        <span>Biodata</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveTab("password")}
                        className={`flex-1 py-3 px-3.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${activeTab === "password"
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                          : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                          }`}
                      >
                        <Lock className="w-4 h-4" />
                        <span>Kata Sandi</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* --- EDIT MODE FORMS CONTAINER --- */}
            <div className="px-5 space-y-4 max-w-md mx-auto w-full relative z-10 mt-6">

              {profileError && (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold" role="alert">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{profileError}</span>
                </div>
              )}

              {/* TAB 1: BIODATA FORM */}
              {activeTab === "informasi" && (
                <form id="profile-form" onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">

                    <h3 className="text-xs font-black text-slate-800 flex items-center gap-2 pb-1 border-b border-slate-100">
                      <span className="w-1.5 h-4 rounded-full bg-indigo-600 inline-block" />
                      Informasi Anda
                    </h3>

                    {/* Full Name */}
                    <div className="space-y-1">
                      <label htmlFor="profile-fullname" className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Nama Lengkap
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          id="profile-fullname"
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Nama lengkap Anda"
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
                          placeholder="Contoh: 08123456789"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs font-bold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-1">
                      <label htmlFor="profile-location" className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Asal Kota / Lokasi
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          id="profile-location"
                          type="text"
                          required
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="Contoh: Surabaya, Jawa Timur"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs font-bold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Disability Dropdown */}
                    <div className="space-y-1">
                      <label htmlFor="profile-disability" className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Jenis Disabilitas
                      </label>
                      <select
                        id="profile-disability"
                        value={disabilityType}
                        onChange={(e) => setDisabilityType(e.target.value)}
                        className="w-full px-3.5 py-3 rounded-xl border border-slate-200 text-xs font-bold focus:border-indigo-500 outline-none bg-white"
                      >
                        {DISABILITY_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Purpose of using the app Dropdown */}
                    <div className="space-y-1">
                      <label htmlFor="profile-purpose" className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
                        Tujuan Utama Menggunakan Aplikasi
                      </label>
                      <select
                        id="profile-purpose"
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        className="w-full px-3.5 py-3 rounded-xl border border-slate-200 text-xs font-bold focus:border-indigo-500 outline-none bg-white"
                      >
                        <option value="Cari kerja">Cari kerja</option>
                        <option value="Buat profil skill">Buat profil skill</option>
                        <option value="Persiapan interview">Persiapan interview</option>
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

                    {/* Save Button at the Bottom */}
                    <button
                      type="submit"
                      disabled={profileLoading}
                      className="w-full mt-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 transition-all"
                    >
                      {profileLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Menyimpan...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span>Simpan Perubahan</span>
                        </>
                      )}
                    </button>

                  </div>
                </form>
              )}

              {/* TAB 2: CHANGE PASSWORD */}
              {activeTab === "password" && (
                <form id="profile-form" onSubmit={handleChangePassword} className="space-y-4">
                  <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 space-y-4">

                    <h3 className="text-xs font-black text-slate-800 flex items-center gap-2 pb-1 border-b border-slate-100">
                      <span className="w-1.5 h-4 rounded-full bg-indigo-600 inline-block" />
                      Ubah Kata Sandi
                    </h3>

                    {passwordError && (
                      <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold mb-4">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{passwordError}</span>
                      </div>
                    )}

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

                    {/* Save Password Button at the Bottom */}
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="w-full mt-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 transition-all"
                    >
                      {passwordLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Mengubah Sandi...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 text-white" />
                          <span>Simpan Sandi Baru</span>
                        </>
                      )}
                    </button>

                  </div>
                </form>
              )}

            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
}
