"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAppState } from "../../context/AppContext";
import { useAccessibility } from "../../context/AccessibilityContext";
import { ACCOMMODATIONS, PortfolioItem, CertificateItem } from "../../data/mockData";
import AppLayout from "../../components/AppLayout";
import {
  Download,
  Send,
  MapPin,
  Briefcase,
  GraduationCap,
  Check,
  Plus,
  Award,
  Sparkles,
  ChevronLeft,
  BadgeCheck,
  Accessibility,
  Pencil,
  Trash2,
  X,
  Upload,
  FileText,
  User,
  Users,
  Compass,
  Mail,
  VolumeX,
  ExternalLink
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

const WORKING_STYLE_OPTIONS = [
  {
    key: "structured_task",
    label: "Pekerjaan Terstruktur",
    description: "Nyaman dengan tugas yang memiliki langkah dan instruksi jelas.",
    icon: FileText
  },
  {
    key: "independent_work",
    label: "Fokus Mandiri",
    description: "Dapat menyelesaikan pekerjaan secara mandiri dengan sedikit supervisi.",
    icon: User
  },
  {
    key: "team_collaboration",
    label: "Kolaborasi Tim",
    description: "Nyaman bekerja bersama tim dan berdiskusi.",
    icon: Users
  },
  {
    key: "initial_guidance",
    label: "Membutuhkan Arahan Awal",
    description: "Lebih optimal dengan panduan saat memulai pekerjaan.",
    icon: Compass
  },
  {
    key: "written_communication",
    label: "Komunikasi Tertulis",
    description: "Lebih nyaman menerima instruksi melalui chat atau email.",
    icon: Mail
  },
  {
    key: "quiet_environment",
    label: "Lingkungan Minim Gangguan",
    description: "Bekerja lebih optimal pada lingkungan yang tenang.",
    icon: VolumeX
  }
];




export default function SkillPassportPage() {
  const { currentPersona, selectedNeeds, toggleNeed, jobPreferences, updatePersona, updatePreferences, showToast } = useAppState();
  const { simpleLanguage } = useAccessibility();
  const { user } = useAuth();

  // --- Skills State ---
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkillText, setNewSkillText] = useState("");

  // Get portfolios and certificates directly from currentPersona
  const portfolios = currentPersona.portfolios || [];
  const certificates = currentPersona.certificates || [];

  const savePortfolios = (newPorts: PortfolioItem[]) => {
    updatePersona({ portfolios: newPorts });
  };

  const saveCertificates = (newCerts: CertificateItem[]) => {
    updatePersona({ certificates: newCerts });
  };

  // --- Modals State ---
  const [activeModal, setActiveModal] = useState<"port-add" | "port-edit" | "cert-add" | "cert-edit" | "profile-edit" | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Form states
  const [portTitle, setPortTitle] = useState("");
  const [portRole, setPortRole] = useState("");
  const [portTool, setPortTool] = useState("");
  const [portImg, setPortImg] = useState("");
  const [portLink, setPortLink] = useState("");
  const [portImgFile, setPortImgFile] = useState<File | null>(null);

  const [certTitle, setCertTitle] = useState("");
  const [certIssuer, setCertIssuer] = useState("");
  const [certDate, setCertDate] = useState("");
  const [certLink, setCertLink] = useState("");

  // Profile Edit states
  const [profileName, setProfileName] = useState("");
  const [profileRole, setProfileRole] = useState("");
  const [profileWorkType, setProfileWorkType] = useState("");
  const [profileEducation, setProfileEducation] = useState("");
  const [profileExperience, setProfileExperience] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileAvatar, setProfileAvatar] = useState("");
  const [profileAvatarFile, setProfileAvatarFile] = useState<File | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  // --- Action Handlers ---
  const handleDownloadPDF = () => {
    showToast("Membuka jendela cetak CV ATS A4...", "success");
    setTimeout(() => {
      window.print();
    }, 500);
  };

  // Image Upload Helper
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast("Ukuran gambar terlalu besar. Maksimal 2MB.", "warning");
        return;
      }
      setPortImgFile(file);
      setPortImg(URL.createObjectURL(file));
    }
  };

  // Avatar Upload Helper
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast("Ukuran gambar terlalu besar. Maksimal 2MB.", "warning");
        return;
      }
      setProfileAvatarFile(file);
      setProfileAvatar(URL.createObjectURL(file));
    }
  };

  const uploadImageToBucket = async (file: File, bucketName: string): Promise<string> => {
    const { createClient } = await import("../../lib/supabase/client");
    const supabase = createClient();

    // Generate unique name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${currentPersona.id}/${fileName}`;

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (error) {
      throw new Error(error.message);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return publicUrl;
  };

  // Profile Edit Handlers
  const handleOpenEditProfile = () => {
    setProfileName(currentPersona.name);
    setProfileRole(currentPersona.targetCareers && currentPersona.targetCareers.length > 0
      ? currentPersona.targetCareers.join(", ")
      : jobPreferences.role);
    setProfileWorkType(jobPreferences.type);
    setProfileEducation(currentPersona.education);
    setProfileExperience(currentPersona.experience);
    setProfileBio(currentPersona.bio);
    setProfileAvatar(currentPersona.avatar);
    setProfileAvatarFile(null);
    setActiveModal("profile-edit");
  };

  const handleEditProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) return;

    let finalAvatar = profileAvatar;
    if (profileAvatarFile) {
      setIsUploading(true);
      try {
        finalAvatar = await uploadImageToBucket(profileAvatarFile, "portfolios");
      } catch (err: any) {
        showToast(`Gagal mengunggah foto profil: ${err.message}`, "warning");
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    const targetCareersArray = profileRole.split(",").map(c => c.trim()).filter(Boolean);

    updatePersona({
      name: profileName.trim(),
      education: profileEducation.trim(),
      experience: profileExperience.trim(),
      bio: profileBio.trim(),
      avatar: finalAvatar,
      targetCareers: targetCareersArray
    });

    updatePreferences({
      role: profileRole.trim(),
      type: profileWorkType
    });

    setActiveModal(null);
    setProfileAvatarFile(null);
    showToast("Profil Passport berhasil diperbarui!", "success");
  };

  // Skills
  const handleAddSkill = () => {
    if (!newSkillText.trim()) return;
    const cleanSkill = newSkillText.trim();
    if (currentPersona.skills.includes(cleanSkill)) {
      showToast("Keahlian sudah ada!", "warning");
      return;
    }
    const updatedSkills = [...currentPersona.skills, cleanSkill];
    updatePersona({ skills: updatedSkills });
    setNewSkillText("");
    setIsAddingSkill(false);
    showToast("Keahlian baru berhasil ditambahkan!", "success");
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    const updatedSkills = currentPersona.skills.filter(s => s !== skillToDelete);
    updatePersona({ skills: updatedSkills });
    showToast("Keahlian dihapus.", "info");
  };

  // Portfolio
  const handleOpenAddPortfolio = () => {
    setPortTitle("");
    setPortRole("");
    setPortTool("");
    setPortImg("https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300"); // default writing/work placeholder
    setPortLink("");
    setPortImgFile(null);
    setActiveModal("port-add");
  };

  const handleAddPortfolioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portTitle.trim() || !portRole.trim() || !portLink.trim()) {
      showToast("Judul, Peran, dan Link Bukti wajib diisi!", "warning");
      return;
    }

    let finalImg = portImg;
    if (portImgFile) {
      setIsUploading(true);
      try {
        finalImg = await uploadImageToBucket(portImgFile, "portfolios");
      } catch (err: any) {
        showToast(`Gagal mengunggah gambar: ${err.message}`, "warning");
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    const newItem: PortfolioItem = {
      title: portTitle.trim(),
      role: portRole.trim(),
      tool: portTool.trim() || "N/A",
      img: finalImg || "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300",
      link: portLink.trim()
    };
    savePortfolios([...portfolios, newItem]);
    setActiveModal(null);
    setPortImgFile(null);
    showToast("Portofolio baru berhasil ditambahkan!", "success");
  };

  const handleOpenEditPortfolio = (idx: number) => {
    const item = portfolios[idx];
    setSelectedIndex(idx);
    setPortTitle(item.title);
    setPortRole(item.role);
    setPortTool(item.tool);
    setPortImg(item.img);
    setPortLink(item.link || "");
    setPortImgFile(null);
    setActiveModal("port-edit");
  };

  const handleEditPortfolioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex === null || !portTitle.trim() || !portRole.trim() || !portLink.trim()) {
      showToast("Judul, Peran, dan Link Bukti wajib diisi!", "warning");
      return;
    }

    let finalImg = portImg;
    if (portImgFile) {
      setIsUploading(true);
      try {
        finalImg = await uploadImageToBucket(portImgFile, "portfolios");
      } catch (err: any) {
        showToast(`Gagal mengunggah gambar: ${err.message}`, "warning");
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    const updated = [...portfolios];
    updated[selectedIndex] = {
      title: portTitle.trim(),
      role: portRole.trim(),
      tool: portTool.trim(),
      img: finalImg,
      link: portLink.trim()
    };
    savePortfolios(updated);
    setActiveModal(null);
    setPortImgFile(null);
    showToast("Portofolio berhasil diperbarui!", "success");
  };

  const handleDeletePortfolio = () => {
    if (selectedIndex === null) return;
    const updated = portfolios.filter((_, i) => i !== selectedIndex);
    savePortfolios(updated);
    setActiveModal(null);
    showToast("Portofolio berhasil dihapus.", "info");
  };

  // Certificates
  const handleOpenAddCertificate = () => {
    setCertTitle("");
    setCertIssuer("");
    setCertDate("");
    setCertLink("");
    setActiveModal("cert-add");
  };

  const handleAddCertificateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certTitle.trim() || !certIssuer.trim() || !certLink.trim()) {
      showToast("Nama Sertifikasi, Institusi Penerbit, dan Link Bukti wajib diisi!", "warning");
      return;
    }
    const newItem: CertificateItem = {
      title: certTitle.trim(),
      issuer: certIssuer.trim(),
      date: certDate.trim() || "Baru saja",
      link: certLink.trim()
    };
    saveCertificates([...certificates, newItem]);
    setActiveModal(null);
    showToast("Pelatihan baru berhasil ditambahkan!", "success");
  };

  const handleOpenEditCertificate = (idx: number) => {
    const item = certificates[idx];
    setSelectedIndex(idx);
    setCertTitle(item.title);
    setCertIssuer(item.issuer);
    setCertDate(item.date);
    setCertLink(item.link || "");
    setActiveModal("cert-edit");
  };

  const handleEditCertificateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex === null || !certTitle.trim() || !certIssuer.trim() || !certLink.trim()) {
      showToast("Nama Sertifikasi, Institusi Penerbit, dan Link Bukti wajib diisi!", "warning");
      return;
    }
    const updated = [...certificates];
    updated[selectedIndex] = {
      title: certTitle.trim(),
      issuer: certIssuer.trim(),
      date: certDate.trim(),
      link: certLink.trim()
    };
    saveCertificates(updated);
    setActiveModal(null);
    showToast("Sertifikasi berhasil diperbarui!", "success");
  };

  const handleDeleteCertificate = () => {
    if (selectedIndex === null) return;
    const updated = certificates.filter((_, i) => i !== selectedIndex);
    saveCertificates(updated);
    setActiveModal(null);
    showToast("Pelatihan berhasil dihapus.", "info");
  };

  return (
    <AppLayout
      showHeader={false}
      mainClassName="flex-1 flex flex-col overflow-hidden bg-brand-bg pb-16"
    >
      <div id="passport-screen-content" className="flex-1 flex flex-col overflow-hidden">
        {/* ══════════════════════════════════════════
          SCROLLABLE CONTENT AREA
      ══════════════════════════════════════════ */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">

          {/* ── GRADIENT HERO HEADER ── */}
          <div className="relative bg-gradient-to-br from-[#4f46e5] via-[#4338ca] to-[#06b6d4] pt-10 pb-16 px-5 overflow-hidden shadow-lg">
            {/* decorative orbs */}
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute top-4 right-20 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute bottom-10 left-[-20px] w-32 h-32 rounded-full bg-cyan-400/10 pointer-events-none" />

            {/* Top row: back button + label */}
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <Link
                href="/dashboard"
                className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center hover:bg-white/20 transition-all text-white shrink-0"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <span className="text-white/70 text-xs font-semibold tracking-wide">Passport Saya</span>
            </div>

            {/* Title row */}
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-black text-white leading-snug mb-1">Skill Passport Saya</h1>
                <p className="text-white/70 text-xs leading-relaxed max-w-sm">
                  CV digital inklusif dengan verifikasi keahlian nyata dan deklarasi akomodasi kerja.
                </p>
              </div>
            </div>
          </div>

          {/* ── CONTENT CONTAINER (overlaps header) ── */}
          <div className="relative z-10 px-4 -mt-8 space-y-4 max-w-lg mx-auto w-full pb-6">

            {/* 1. Passport Identity Card (Visual Centerpiece) */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Passport Header Banner */}
              <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-500 px-4 py-3 text-white flex items-center justify-between">
                <span className="text-[10px] font-black tracking-widest uppercase">ABLEWORK PASSPORT</span>
                <span className="text-[8px] font-black bg-emerald-500 text-white border border-emerald-400/20 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <BadgeCheck className="w-2.5 h-2.5" />
                  Verified
                </span>
              </div>

              {/* Passport Body */}
              <div className="p-5 space-y-4 relative">
                {/* Photo & Identity Details with Donut Progress */}
                <button
                  onClick={handleOpenEditProfile}
                  className="absolute top-4 right-4 bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 rounded-lg p-1.5 text-slate-500 hover:text-indigo-600 shadow-sm z-10 flex items-center justify-center transition-colors"
                  title="Edit Profil Passport"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>

                {/* Photo & Identity Details */}
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={currentPersona.avatar}
                      alt={`Foto ${currentPersona.name}`}
                      className="w-16 h-16 rounded-2xl border border-slate-100 shadow-sm object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow border border-white">
                      <Check className="w-3 h-3" />
                    </div>
                  </div>

                  <div className="min-w-0 pt-0.5">
                    <h2 className="text-sm font-black text-brand-fg leading-snug">{currentPersona.name}</h2>
                    <div className="text-[10px] font-black text-indigo-600 uppercase tracking-wide mt-0.5">{currentPersona.disabilityType}</div>
                    <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold mt-1.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>ID: ABLE-{currentPersona.name.substring(0, 3).toUpperCase()}-2026</span>
                    </div>
                  </div>
                </div>

                {/* Grid Metadata Info */}
                <div className="border-t border-dashed border-slate-100 pt-3.5 space-y-2.5 text-[11px]">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Target Karir</span>
                      <span className="font-extrabold text-brand-fg leading-normal">
                        {currentPersona.targetCareers && currentPersona.targetCareers.length > 0
                          ? currentPersona.targetCareers.join(", ")
                          : "Belum ada target karir yang dipilih"}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Tipe Kerja</span>
                      <span className="font-extrabold text-brand-fg leading-normal capitalize">{jobPreferences.type}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Pendidikan</span>
                      <span className="font-extrabold text-brand-fg leading-normal">{currentPersona.education}</span>
                    </div>
                    <div>
                      <span className="block text-[8px] font-black text-slate-400 uppercase tracking-wider">Tentang Saya</span>
                      <span className="font-extrabold text-brand-fg leading-normal block truncate max-w-[150px]" title={currentPersona.bio}>{currentPersona.bio}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Pengalaman Kerja */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-2">
              <h3 className="text-xs font-black text-brand-fg flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-indigo-500 inline-block shrink-0" />
                Pengalaman Kerja
              </h3>
              <p className="text-xs text-brand-fg/70 leading-relaxed font-semibold">
                {currentPersona.experience}
              </p>
            </div>

            {/* 4. Keterampilan Kerja */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
              <h3 className="text-xs font-black text-brand-fg flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-emerald-500 inline-block shrink-0" />
                Keterampilan Kerja
              </h3>

              <div className="flex flex-wrap gap-2">
                {currentPersona.skills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs font-black text-emerald-700 shadow-sm"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-500" />
                    <span>{skill}</span>
                    <button
                      onClick={() => handleDeleteSkill(skill)}
                      className="text-emerald-500 hover:text-emerald-700 ml-1 font-bold text-[10px] w-3 h-3 rounded-full hover:bg-emerald-100 flex items-center justify-center transition-colors"
                      title="Hapus skill"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}

                {!isAddingSkill ? (
                  <button
                    onClick={() => setIsAddingSkill(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-slate-200 hover:border-indigo-500 hover:text-indigo-600 text-xs font-black text-slate-400 transition-all bg-white"
                    type="button"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Skill</span>
                  </button>
                ) : (
                  <div className="flex gap-2 items-center w-full max-w-xs mt-1 animate-in slide-in-from-top-1 duration-200">
                    <input
                      type="text"
                      value={newSkillText}
                      onChange={(e) => setNewSkillText(e.target.value)}
                      placeholder="Ketik keahlian..."
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddSkill();
                      }}
                      autoFocus
                    />
                    <button
                      onClick={handleAddSkill}
                      className="px-3 py-2 rounded-xl bg-indigo-600 text-white text-xs font-black shadow-sm"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => setIsAddingSkill(false)}
                      className="px-2 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-400"
                    >
                      Batal
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Kebutuhan Akses Kerja */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
              <h3 className="text-xs font-black text-brand-fg flex items-center gap-2">
                <Accessibility className="w-4 h-4 text-indigo-500 shrink-0" />
                Kebutuhan Akses Kerja
              </h3>
              <p className="text-[10px] text-slate-400 font-extrabold -mt-1 leading-relaxed">
                Pilih kebutuhan akses harian Anda untuk membantu pencocokan lowongan secara optimal.
              </p>
              <div className="grid grid-cols-1 gap-2 pt-1">
                {ACCOMMODATIONS.map((acc) => {
                  const isSelected = selectedNeeds.includes(acc.key);
                  return (
                    <button
                      key={acc.key}
                      type="button"
                      onClick={() => {
                        toggleNeed(acc.key);
                        showToast("Kebutuhan akses diperbarui!", "success");
                      }}
                      className={`flex gap-3 items-start p-3 rounded-2xl border text-left transition-all ${isSelected
                          ? "border-emerald-500 bg-emerald-50/50 shadow-sm ring-1 ring-emerald-500/10"
                          : "border-slate-100 bg-slate-50/20 hover:bg-slate-50/50"
                        }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isSelected
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-100 text-slate-400"
                        }`}>
                        <Check className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="text-xs font-black text-brand-fg flex items-center gap-1.5">
                          {acc.label}
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold leading-normal">
                          {simpleLanguage ? acc.simpleDescription : acc.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>



            {/* Cara Kerja Saya */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
              <h3 className="text-xs font-black text-brand-fg flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-brand-primary inline-block shrink-0" />
                Cara Kerja Saya
              </h3>
              <p className="text-[10px] text-slate-400 font-extrabold -mt-1 leading-relaxed">
                Pilih gaya kerja yang membantu kamu bekerja secara optimal.
              </p>

              <div className="grid grid-cols-1 gap-2 pt-1">
                {WORKING_STYLE_OPTIONS.map((style) => {
                  const IconComponent = style.icon;
                  const isSelected = (currentPersona.workingStyle || []).includes(style.key);
                  return (
                    <button
                      key={style.key}
                      type="button"
                      onClick={() => {
                        const currentStyles = currentPersona.workingStyle || [];
                        const nextStyles = currentStyles.includes(style.key)
                          ? currentStyles.filter(s => s !== style.key)
                          : [...currentStyles, style.key];
                        updatePersona({ workingStyle: nextStyles });
                        showToast("Gaya kerja diperbarui!", "success");
                      }}
                      className={`flex gap-3 items-start p-3 rounded-2xl border text-left transition-all ${isSelected
                          ? "border-indigo-500 bg-indigo-50/50 shadow-sm ring-1 ring-indigo-500/10"
                          : "border-slate-100 bg-slate-50/20 hover:bg-slate-50/50"
                        }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isSelected
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-400"
                        }`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="text-xs font-black text-brand-fg flex items-center gap-1.5">
                          {style.label}
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold leading-normal">
                          {style.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Portofolio Kerja */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-brand-fg flex items-center gap-2">
                  <span className="w-1 h-4 rounded-full bg-indigo-500 inline-block shrink-0" />
                  Portofolio Kerja
                </h3>
                <button
                  onClick={handleOpenAddPortfolio}
                  className="flex items-center gap-1 text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg"
                >
                  <Plus className="w-3 h-3" />
                  <span>Tambah</span>
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {portfolios.map((item, idx) => {
                  const CardWrapper = item.link ? 'a' : 'div';
                  const wrapperProps = item.link ? { href: item.link, target: "_blank", rel: "noopener noreferrer" } : {};
                  return (
                    <CardWrapper
                      key={idx}
                      {...wrapperProps}
                      className={`border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50 group hover:border-indigo-300 transition-all relative block ${item.link ? 'cursor-pointer' : ''}`}
                    >
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleOpenEditPortfolio(idx);
                        }}
                        className="absolute top-2 right-2 bg-white/95 border border-slate-200 rounded-lg p-1.5 text-slate-500 hover:text-indigo-600 shadow-sm z-10"
                        title="Edit portofolio"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <img
                        src={item.img}
                        alt=""
                        className="w-full h-24 object-cover"
                      />
                      <div className="p-3 text-[10px] space-y-0.5">
                        <div className="font-black text-brand-fg text-xs truncate flex items-center gap-1">
                          {item.title}
                          {item.link && <ExternalLink className="w-2.5 h-2.5 text-indigo-500 shrink-0" />}
                        </div>
                        <div className="text-slate-400 font-semibold truncate">{item.role} • {item.tool}</div>
                      </div>
                    </CardWrapper>
                  );
                })}
                {portfolios.length === 0 && (
                  <p className="text-xs text-slate-400 italic font-semibold sm:col-span-2 text-center py-4">Belum ada portofolio kerja.</p>
                )}
              </div>
            </div>

            {/* 6. Pelatihan & Sertifikasi */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-brand-fg flex items-center gap-2">
                  <span className="w-1 h-4 rounded-full bg-emerald-500 inline-block shrink-0" />
                  Pelatihan &amp; Sertifikasi
                </h3>
                <button
                  onClick={handleOpenAddCertificate}
                  className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg"
                >
                  <Plus className="w-3 h-3" />
                  <span>Tambah</span>
                </button>
              </div>

              <div className="space-y-2">
                {certificates.map((cert, idx) => {
                  const CardWrapper = cert.link ? 'a' : 'div';
                  const wrapperProps = cert.link ? { href: cert.link, target: "_blank", rel: "noopener noreferrer" } : {};
                  return (
                    <CardWrapper
                      key={idx}
                      {...wrapperProps}
                      className={`flex gap-3 items-center p-3 rounded-xl bg-slate-50/50 border border-slate-100 relative group block ${cert.link ? 'cursor-pointer hover:border-emerald-300' : ''}`}
                    >
                      <div className="w-9 h-9 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
                        <Award className="w-5 h-5" />
                      </div>
                      <div className="text-[10px] min-w-0 flex-1 pr-6">
                        <div className="font-black text-xs text-brand-fg truncate flex items-center gap-1">
                          {cert.title}
                          {cert.link && <ExternalLink className="w-2.5 h-2.5 text-emerald-500 shrink-0" />}
                        </div>
                        <div className="text-slate-400 font-semibold truncate">{cert.issuer} • {cert.date}</div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleOpenEditCertificate(idx);
                        }}
                        className="absolute top-1/2 right-3 -translate-y-1/2 bg-white border border-slate-200 rounded-lg p-1.5 text-slate-500 hover:text-indigo-600 shadow-sm z-10"
                        title="Edit sertifikasi"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                    </CardWrapper>
                  );
                })}
                {certificates.length === 0 && (
                  <p className="text-xs text-slate-400 italic font-semibold text-center py-4">Belum ada pelatihan &amp; sertifikasi.</p>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ══════════════════════════════════════════
          STICKY BOTTOM ACTION BAR (pinned above bottom nav)
      ══════════════════════════════════════════ */}
        <div className="shrink-0 bg-white border-t border-slate-100 px-4 pt-3 pb-4 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] max-w-lg mx-auto w-full flex gap-3">
          <button
            onClick={handleDownloadPDF}
            className="flex-1 py-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-600 text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm"
            type="button"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Cetak / Unduh PDF</span>
          </button>

          <Link
            href="/jobs"
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white text-xs font-black shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Mulai Melamar</span>
          </Link>
        </div>

        {/* ══════════════════════════════════════════
          MODAL DIALOG BACKDROP & CONTAINERS
      ══════════════════════════════════════════ */}
        {activeModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">

            {/* Portfolio Add Modal */}
            {activeModal === "port-add" && (
              <form
                onSubmit={handleAddPortfolioSubmit}
                className="bg-white rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-xl border border-slate-100 animate-in zoom-in-95 duration-200"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-sm font-black text-brand-fg flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-indigo-500" />
                    Tambah Portofolio
                  </h4>
                  <button type="button" onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-black text-slate-400 uppercase tracking-wider text-[9px]">Nama Proyek / Portofolio</label>
                    <input
                      type="text"
                      required
                      value={portTitle}
                      onChange={(e) => setPortTitle(e.target.value)}
                      placeholder="Contoh: Desain Konten Instagram UMKM"
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-black text-slate-400 uppercase tracking-wider text-[9px]">Peran / Kategori Kerja</label>
                    <input
                      type="text"
                      required
                      value={portRole}
                      onChange={(e) => setPortRole(e.target.value)}
                      placeholder="Contoh: Graphic Designer"
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-black text-slate-400 uppercase tracking-wider text-[9px]">Alat / Teknologi yang Digunakan</label>
                    <input
                      type="text"
                      value={portTool}
                      onChange={(e) => setPortTool(e.target.value)}
                      placeholder="Contoh: Canva & Adobe Illustrator"
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-black text-slate-400 uppercase tracking-wider text-[9px]">Link Bukti Portofolio (Wajib)</label>
                    <input
                      type="url"
                      required
                      value={portLink}
                      onChange={(e) => setPortLink(e.target.value)}
                      placeholder="Contoh: https://figma.com/file/..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-black text-slate-400 uppercase tracking-wider text-[9px]">Gambar Portofolio</label>
                    {portImg ? (
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50/50 p-2 flex items-center gap-3">
                        <img src={portImg} alt="Preview" className="w-14 h-14 object-cover rounded-lg border border-slate-100" />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-black text-emerald-600 block">Gambar berhasil dipilih</span>
                          <span className="text-[9px] text-slate-400 font-semibold block truncate">Siap disimpan</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPortImg("")}
                          className="p-1.5 rounded-lg border border-rose-100 text-rose-500 hover:bg-rose-50"
                          title="Hapus gambar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <label className="border border-dashed border-slate-200 hover:border-indigo-500 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-slate-50/50 hover:bg-indigo-50/10 transition-all">
                        <Upload className="w-5 h-5 text-slate-400" />
                        <span className="text-[10px] font-black text-slate-600">Klik untuk Unggah Gambar</span>
                        <span className="text-[8px] text-slate-400 font-semibold">PNG, JPG up to 2MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => setActiveModal(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-400 disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black shadow-md transition-all ${isUploading ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' : 'bg-indigo-600 text-white shadow-indigo-500/20'}`}
                  >
                    {isUploading ? "Mengunggah..." : "Simpan Proyek"}
                  </button>
                </div>
              </form>
            )}

            {/* Portfolio Edit Modal */}
            {activeModal === "port-edit" && (
              <form
                onSubmit={handleEditPortfolioSubmit}
                className="bg-white rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-xl border border-slate-100 animate-in zoom-in-95 duration-200"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-sm font-black text-brand-fg flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-indigo-500" />
                    Edit Portofolio
                  </h4>
                  <button type="button" onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-black text-slate-400 uppercase tracking-wider text-[9px]">Nama Proyek / Portofolio</label>
                    <input
                      type="text"
                      required
                      value={portTitle}
                      onChange={(e) => setPortTitle(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-black text-slate-400 uppercase tracking-wider text-[9px]">Peran / Kategori Kerja</label>
                    <input
                      type="text"
                      required
                      value={portRole}
                      onChange={(e) => setPortRole(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-black text-slate-400 uppercase tracking-wider text-[9px]">Alat / Teknologi yang Digunakan</label>
                    <input
                      type="text"
                      value={portTool}
                      onChange={(e) => setPortTool(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-black text-slate-400 uppercase tracking-wider text-[9px]">Link Bukti Portofolio (Wajib)</label>
                    <input
                      type="url"
                      required
                      value={portLink}
                      onChange={(e) => setPortLink(e.target.value)}
                      placeholder="Contoh: https://figma.com/file/..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-black text-slate-400 uppercase tracking-wider text-[9px]">Gambar Portofolio</label>
                    {portImg ? (
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50/50 p-2 flex items-center gap-3">
                        <img src={portImg} alt="Preview" className="w-14 h-14 object-cover rounded-lg border border-slate-100" />
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-black text-emerald-600 block">Gambar berhasil dipilih</span>
                          <span className="text-[9px] text-slate-400 font-semibold block truncate">Siap disimpan</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setPortImg("")}
                          className="p-1.5 rounded-lg border border-rose-100 text-rose-500 hover:bg-rose-50"
                          title="Hapus gambar"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <label className="border border-dashed border-slate-200 hover:border-indigo-500 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-slate-50/50 hover:bg-indigo-50/10 transition-all">
                        <Upload className="w-5 h-5 text-slate-400" />
                        <span className="text-[10px] font-black text-slate-600">Klik untuk Unggah Gambar</span>
                        <span className="text-[8px] text-slate-400 font-semibold">PNG, JPG up to 2MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={handleDeletePortfolio}
                    className="px-3 rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 flex items-center justify-center disabled:opacity-50"
                    title="Hapus portofolio"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => setActiveModal(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-400 disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black shadow-md transition-all ${isUploading ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' : 'bg-indigo-600 text-white shadow-indigo-500/20'}`}
                  >
                    {isUploading ? "Mengunggah..." : "Simpan"}
                  </button>
                </div>
              </form>
            )}

            {/* Certificate Add Modal */}
            {activeModal === "cert-add" && (
              <form
                onSubmit={handleAddCertificateSubmit}
                className="bg-white rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-xl border border-slate-100 animate-in zoom-in-95 duration-200"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-sm font-black text-brand-fg flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-600" />
                    Tambah Pelatihan
                  </h4>
                  <button type="button" onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-black text-slate-400 uppercase tracking-wider text-[9px]">Nama Kursus / Sertifikasi</label>
                    <input
                      type="text"
                      required
                      value={certTitle}
                      onChange={(e) => setCertTitle(e.target.value)}
                      placeholder="Contoh: Pelatihan Data Entry & Spreadsheet"
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-black text-slate-400 uppercase tracking-wider text-[9px]">Penyelenggara / Penerbit</label>
                    <input
                      type="text"
                      required
                      value={certIssuer}
                      onChange={(e) => setCertIssuer(e.target.value)}
                      placeholder="Contoh: AbleWork Academy"
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-black text-slate-400 uppercase tracking-wider text-[9px]">Bulan &amp; Tahun Selesai</label>
                    <input
                      type="text"
                      required
                      value={certDate}
                      onChange={(e) => setCertDate(e.target.value)}
                      placeholder="Contoh: Juli 2026"
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-black text-slate-400 uppercase tracking-wider text-[9px]">Link Bukti Sertifikasi (Wajib)</label>
                    <input
                      type="url"
                      required
                      value={certLink}
                      onChange={(e) => setCertLink(e.target.value)}
                      placeholder="Contoh: https://credential.com/verify/..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-400"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black shadow-md shadow-emerald-500/20"
                  >
                    Simpan Sertifikat
                  </button>
                </div>
              </form>
            )}

            {/* Certificate Edit Modal */}
            {activeModal === "cert-edit" && (
              <form
                onSubmit={handleEditCertificateSubmit}
                className="bg-white rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-xl border border-slate-100 animate-in zoom-in-95 duration-200"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-sm font-black text-brand-fg flex items-center gap-2">
                    <Award className="w-4 h-4 text-emerald-600" />
                    Edit Sertifikasi
                  </h4>
                  <button type="button" onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-black text-slate-400 uppercase tracking-wider text-[9px]">Nama Kursus / Sertifikasi</label>
                    <input
                      type="text"
                      required
                      value={certTitle}
                      onChange={(e) => setCertTitle(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-black text-slate-400 uppercase tracking-wider text-[9px]">Penyelenggara / Penerbit</label>
                    <input
                      type="text"
                      required
                      value={certIssuer}
                      onChange={(e) => setCertIssuer(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-black text-slate-400 uppercase tracking-wider text-[9px]">Bulan &amp; Tahun Selesai</label>
                    <input
                      type="text"
                      required
                      value={certDate}
                      onChange={(e) => setCertDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-black text-slate-400 uppercase tracking-wider text-[9px]">Link Bukti Sertifikasi (Wajib)</label>
                    <input
                      type="url"
                      required
                      value={certLink}
                      onChange={(e) => setCertLink(e.target.value)}
                      placeholder="Contoh: https://credential.com/verify/..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleDeleteCertificate}
                    className="px-3 rounded-xl border border-rose-200 text-rose-500 hover:bg-rose-50 flex items-center justify-center"
                    title="Hapus sertifikasi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveModal(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-400"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-black shadow-md shadow-indigo-500/20"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            )}

            {/* Profile Edit Modal */}
            {activeModal === "profile-edit" && (
              <form
                onSubmit={handleEditProfileSubmit}
                className="bg-white rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-xl border border-slate-100 animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[85vh]"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-sm font-black text-brand-fg flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-indigo-500" />
                    Edit Profil Passport
                  </h4>
                  <button type="button" onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Profile Photo */}
                  <div className="space-y-1">
                    <label className="font-black text-slate-400 uppercase tracking-wider text-[9px]">Foto Profil</label>
                    <div className="flex items-center gap-3 bg-slate-50/50 p-2 border border-slate-100 rounded-xl">
                      {profileAvatar ? (
                        <img src={profileAvatar} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400 font-bold">
                          ?
                        </div>
                      )}
                      <div>
                        <label className="cursor-pointer bg-white border border-slate-200 hover:border-indigo-500 rounded-lg px-2.5 py-1.5 text-[9px] font-black text-slate-600 shadow-sm transition-all block">
                          <span>Ubah Foto</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Name */}
                  <div className="space-y-1">
                    <label className="font-black text-slate-400 uppercase tracking-wider text-[9px]">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  {/* Role */}
                  <div className="space-y-1">
                    <label className="font-black text-slate-400 uppercase tracking-wider text-[9px]">Target Karir</label>
                    <input
                      type="text"
                      required
                      value={profileRole}
                      onChange={(e) => setProfileRole(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                      placeholder="Contoh: Admin Online, Customer Support"
                    />
                  </div>

                  {/* Work Type */}
                  <div className="space-y-1">
                    <label className="font-black text-slate-400 uppercase tracking-wider text-[9px]">Tipe Kerja</label>
                    <select
                      value={profileWorkType}
                      onChange={(e) => setProfileWorkType(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none bg-white text-brand-fg"
                    >
                      <option value="remote">Remote (Bekerja dari Rumah)</option>
                      <option value="hybrid">Hybrid (Kombinasi)</option>
                      <option value="onsite">Onsite (Bekerja di Kantor)</option>
                    </select>
                  </div>

                  {/* Education */}
                  <div className="space-y-1">
                    <label className="font-black text-slate-400 uppercase tracking-wider text-[9px]">Pendidikan</label>
                    <input
                      type="text"
                      required
                      value={profileEducation}
                      onChange={(e) => setProfileEducation(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  {/* Experience */}
                  <div className="space-y-1">
                    <label className="font-black text-slate-400 uppercase tracking-wider text-[9px]">Pengalaman Kerja</label>
                    <input
                      type="text"
                      required
                      value={profileExperience}
                      onChange={(e) => setProfileExperience(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  {/* Bio / Tentang Saya */}
                  <div className="space-y-1">
                    <label className="font-black text-slate-400 uppercase tracking-wider text-[9px]">Tentang Saya</label>
                    <textarea
                      required
                      value={profileBio}
                      onChange={(e) => setProfileBio(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none h-20"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => setActiveModal(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-400 disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black shadow-md transition-all ${isUploading ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' : 'bg-indigo-600 text-white shadow-indigo-500/20'}`}
                  >
                    {isUploading ? "Mengunggah..." : "Simpan Perubahan"}
                  </button>
                </div>
              </form>
            )}

          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════
          ATS CV PRINT TEMPLATE (Hidden on Screen, Visible on Print)
          ══════════════════════════════════════════ */}
      <div
        id="ats-cv-print"
        className="hidden text-slate-900 bg-white"
        style={{ fontFamily: 'Arial, sans-serif', width: '100%', maxWidth: '800px', margin: '0 auto', padding: '10px 0' }}
      >
        {/* Name & Contact */}
        <div style={{ textAlign: 'center', marginBottom: '25px', borderBottom: '2px solid #334155', paddingBottom: '15px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 5px 0', textTransform: 'uppercase', color: '#1e293b', letterSpacing: '0.5px' }}>
            {currentPersona.name}
          </h1>
          <p style={{ fontSize: '14px', fontWeight: '600', color: '#4f46e5', margin: '0 0 10px 0', textTransform: 'uppercase' }}>
            {currentPersona.targetCareers && currentPersona.targetCareers.length > 0
              ? currentPersona.targetCareers.join(" | ")
              : jobPreferences.role}
          </p>
          <div style={{ fontSize: '11px', color: '#475569', display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
            <span><strong>Email:</strong> {user?.email || "Tidak ada email"}</span>
            <span>•</span>
            <span><strong>Tipe Kerja:</strong> {jobPreferences.type === "remote" ? "Remote" : jobPreferences.type === "hybrid" ? "Hybrid" : "Onsite"}</span>
          </div>
        </div>

        {/* Professional Summary */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '8px', color: '#1e293b', letterSpacing: '0.5px' }}>
            Ringkasan Profesional
          </h2>
          <p style={{ fontSize: '11.5px', lineHeight: '1.6', margin: '0', color: '#334155', textAlign: 'justify' }}>
            {currentPersona.bio || "Pencari kerja profesional yang memiliki dedikasi tinggi dan berorientasi pada hasil."}
          </p>
        </div>

        {/* Core Skills */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '8px', color: '#1e293b', letterSpacing: '0.5px' }}>
            Keahlian Utama
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px 12px', fontSize: '11.5px', color: '#334155' }}>
            {currentPersona.skills.map((skill, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '6px', color: '#4f46e5' }}>•</span>
                <span>{skill}</span>
              </div>
            ))}
            {currentPersona.skills.length === 0 && (
              <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>Belum ada keahlian utama yang ditambahkan.</span>
            )}
          </div>
        </div>

        {/* Experience */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '8px', color: '#1e293b', letterSpacing: '0.5px' }}>
            Pengalaman Kerja
          </h2>
          <div style={{ fontSize: '11.5px', color: '#334155' }}>
            <p style={{ margin: '0', fontWeight: 'bold', fontSize: '12px', color: '#1e293b' }}>
              {currentPersona.experience || "Fresh Graduate / Pengalaman kerja belum diatur"}
            </p>
          </div>
        </div>

        {/* Education */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '8px', color: '#1e293b', letterSpacing: '0.5px' }}>
            Pendidikan
          </h2>
          <div style={{ fontSize: '11.5px', color: '#334155' }}>
            <p style={{ margin: '0', fontWeight: 'bold', fontSize: '12px', color: '#1e293b' }}>
              {currentPersona.education || "Pendidikan belum diatur"}
            </p>
          </div>
        </div>

        {/* Work Portfolio (No Images, Only Details) */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '8px', color: '#1e293b', letterSpacing: '0.5px' }}>
            Portofolio Kerja
          </h2>
          {portfolios.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {portfolios.map((item, idx) => (
                <div key={idx} style={{ fontSize: '11.5px', color: '#334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#1e293b', marginBottom: '2px' }}>
                    <span style={{ flex: 1 }}>{item.title}</span>
                    {item.link && (
                      <span style={{ fontWeight: 'normal', fontSize: '10.5px', color: '#4f46e5', textDecoration: 'underline' }}>
                        {item.link}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: '11px', fontStyle: 'italic' }}>
                    <span><strong>Peran:</strong> {item.role}</span>
                    {item.tool && <span><strong>Alat:</strong> {item.tool}</span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '11.5px', fontStyle: 'italic', color: '#94a3b8', margin: '0' }}>Belum ada portofolio kerja.</p>
          )}
        </div>

        {/* Certificates & Training */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', borderBottom: '1px solid #cbd5e1', paddingBottom: '3px', marginBottom: '8px', color: '#1e293b', letterSpacing: '0.5px' }}>
            Pelatihan & Sertifikasi
          </h2>
          {certificates.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {certificates.map((item, idx) => (
                <div key={idx} style={{ fontSize: '11.5px', color: '#334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#1e293b', marginBottom: '2px' }}>
                    <span style={{ flex: 1 }}>{item.title}</span>
                    <span style={{ fontWeight: 'normal', color: '#64748b', fontSize: '11px' }}>{item.date}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: '11px' }}>
                    <span><strong>Penerbit:</strong> {item.issuer}</span>
                    {item.link && (
                      <span style={{ color: '#4f46e5', textDecoration: 'underline', fontSize: '10.5px' }}>
                        {item.link}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: '11.5px', fontStyle: 'italic', color: '#94a3b8', margin: '0' }}>Belum ada pelatihan & sertifikasi.</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
