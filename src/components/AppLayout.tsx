"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppState } from "../context/AppContext";
import { useAccessibility } from "../context/AccessibilityContext";
import { useAuth } from "../context/AuthContext";
import { 
  Briefcase, 
  CheckSquare, 
  Settings, 
  MessageSquare, 
  Home, 
  User, 
  Accessibility, 
  RefreshCw,
  X,
  Menu,
  CheckCircle,
  AlertTriangle,
  Info,
  LogOut,
  Award,
  ClipboardList,
  Mic
} from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
  showHeader?: boolean;
  mainClassName?: string;
}

export default function AppLayout({ children, showNav = true, showHeader = true, mainClassName }: AppLayoutProps) {
  const pathname = usePathname();
  const { 
    currentPersona, 
    toast, 
    clearToast, 
    resetAppState 
  } = useAppState();
  
  const { 
    highContrast, 
    largeText, 
    simpleLanguage, 
    screenReaderLabels 
  } = useAccessibility();

  const { user, signOut } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Lowongan Kerja", href: "/jobs", icon: Briefcase },
    { name: "Pesan (Chat)", href: "/chat", icon: MessageSquare },
    { name: "Lacak Lamaran", href: "/applications", icon: ClipboardList },
    { name: "Profil Saya", href: "/profile", icon: User },
    { name: "Skill Passport", href: "/skill-passport", icon: Award },
    { name: "Persiapan Wawancara", href: "/interview-prep", icon: Mic },
    { name: "Checklist Interview", href: "/interview-checklist", icon: CheckSquare },
    { name: "Aksesibilitas", href: "/accessibility", icon: Settings },
    { name: "Feedback", href: "/feedback", icon: MessageSquare },
  ];

  return (
    <div className="h-full flex flex-col bg-brand-bg text-brand-fg overflow-hidden relative">
      {/* Toast Notification */}
      {toast && (
        <div 
          className="absolute bottom-20 inset-x-4 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border glass-panel animate-toast print:hidden"
          role="alert"
          aria-live="polite"
        >
          {toast.type === "success" && <CheckCircle className="text-brand-accent w-6 h-6 shrink-0" />}
          {toast.type === "warning" && <AlertTriangle className="text-brand-warning w-6 h-6 shrink-0" />}
          {toast.type === "info" && <Info className="text-brand-secondary w-6 h-6 shrink-0" />}
          <span className="font-semibold text-xs min-w-0 flex-1 break-words">{toast.message}</span>
          <button 
            onClick={clearToast} 
            className="ml-auto p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 shrink-0"
            aria-label="Tutup notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Navbar */}
      {showNav && showHeader && (
        <header className="sticky top-0 z-40 border-b border-brand-border bg-brand-card/85 backdrop-blur-md transition-all duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Link 
                href="/" 
                className="flex items-center gap-2 text-2xl font-black text-brand-primary"
                aria-label="AbleWork Home"
              >
                <div className="p-1.5 bg-brand-primary text-white rounded-lg" aria-hidden="true">
                  <Accessibility className="w-6 h-6" />
                </div>
                <span>Able<span className="text-brand-secondary">Work</span></span>
              </Link>
              <span className="hidden sm:inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-brand-primary-light text-brand-primary dark:bg-zinc-800 dark:text-zinc-200">
                PROTOTYPE UI
              </span>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-3">
              {/* Auth: user email + sign out */}
              {user ? (
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-[10px] text-brand-fg/60 font-medium max-w-[140px] truncate" title={user.email}>
                    {user.email}
                  </span>
                  <button
                    onClick={signOut}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-brand-border hover:border-brand-danger/50 hover:text-brand-danger text-xs font-bold transition-all"
                    aria-label="Keluar dari akun"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold transition-all"
                >
                  Masuk
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl border border-brand-border bg-brand-card hover:bg-black/5"
                aria-expanded={mobileMenuOpen}
                aria-label="Buka menu navigasi"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <div className="flex-1 w-full mx-auto flex overflow-hidden">
        {/* Desktop Left Sidebar */}
        {showNav && (
          <aside className="hidden md:block w-64 shrink-0 border-r border-brand-border p-4 space-y-2">
            <nav className="space-y-1" aria-label="Main Navigation">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                      isActive 
                        ? "bg-brand-primary text-white shadow-md shadow-brand-primary/20" 
                        : "hover:bg-brand-primary-light/50 hover:text-brand-primary"
                    }`}
                  >
                    <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-6 mt-6 border-t border-brand-border">
              <div className="p-4 rounded-xl bg-brand-primary-light/30 border border-brand-primary/20 text-xs text-brand-fg space-y-2">
                <p className="font-bold text-brand-primary">Mode Akses Aktif:</p>
                <ul className="space-y-1 list-disc pl-4 text-brand-fg/80">
                  {highContrast && <li>Kontras Tinggi</li>}
                  {largeText !== "normal" && <li>Teks Besar ({largeText})</li>}
                  {simpleLanguage && <li>Bahasa Sederhana</li>}
                  {screenReaderLabels && <li>Optimasi Pembaca Layar</li>}
                  {!highContrast && largeText === "normal" && !simpleLanguage && !screenReaderLabels && (
                    <li className="list-none -ml-4 italic text-zinc-500">Standar</li>
                  )}
                </ul>
                <Link 
                  href="/accessibility" 
                  className="block mt-2 font-bold text-brand-primary hover:underline"
                >
                  Ubah Aksesibilitas →
                </Link>
              </div>
            </div>
          </aside>
        )}

        {/* Content Box */}
        <main className={mainClassName ?? "flex-1 p-4 pb-24 overflow-y-auto overflow-x-hidden"}>
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      {showNav && (
        <nav 
          className="absolute bottom-0 left-0 right-0 border-t border-brand-border bg-brand-card/95 backdrop-blur-md h-16 flex justify-around items-center z-30 shadow-lg px-2"
          aria-label="Mobile Navigation"
        >
          {[
            { name: "Home", href: "/dashboard", icon: Home },
            { name: "Lowongan", href: "/jobs", icon: Briefcase },
            { name: "Chat", href: "/chat", icon: MessageSquare },
            { name: "Lamaran", href: "/applications", icon: ClipboardList },
            { name: "Profil", href: "/profile", icon: User }
          ].map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex flex-col items-center justify-center gap-1 w-20 h-full text-[10px] font-bold transition-all ${
                  isActive ? "text-brand-primary" : "text-brand-fg/50 hover:text-brand-fg/80"
                }`}
              >
                {/* Active Indicator Top Bar */}
                {isActive && (
                  <div className="absolute top-0 w-8 h-[3px] bg-brand-primary rounded-b-sm z-40 transition-all duration-300 animate-fade-in" />
                )}
                <Icon className={`w-5.5 h-5.5 transition-colors ${isActive ? "text-brand-primary" : "text-zinc-400 dark:text-zinc-500"}`} aria-hidden="true" />
                <span className="tracking-wide">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      )}

      {/* Mobile Overlay Menu */}
      {mobileMenuOpen && (
        <div className="absolute inset-0 z-45 bg-black/60 flex justify-end">
          <div className="w-64 bg-brand-bg h-full p-4 flex flex-col space-y-4 border-l border-brand-border">
            <div className="flex items-center justify-between pb-4 border-b border-brand-border">
              <span className="font-bold text-sm">Navigasi Menu</span>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full bg-black/5 hover:bg-black/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm ${
                      isActive ? "bg-brand-primary text-white" : "hover:bg-brand-primary-light/50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="space-y-2">
              {user && (
                <div className="px-3 py-2 rounded-xl bg-brand-primary-light/20 border border-brand-primary/10 text-xs">
                  <span className="block text-[10px] text-brand-fg/50 font-medium">Masuk sebagai</span>
                  <span className="font-bold text-brand-fg truncate block max-w-full">{user.email}</span>
                </div>
              )}
              {user ? (
                <button 
                  onClick={() => { signOut(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-brand-danger/30 text-brand-danger text-sm font-semibold hover:bg-brand-danger-light/30 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-bold transition-all"
                >
                  Masuk / Daftar
                </Link>
              )}
              <button 
                onClick={() => { resetAppState(); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 p-2 rounded-xl border border-brand-border text-xs font-semibold hover:bg-black/5 transition-all text-brand-fg/60"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Data Simulasi</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
