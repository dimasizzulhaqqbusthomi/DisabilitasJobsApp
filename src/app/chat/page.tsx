"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useAppState } from "../../context/AppContext";
import { useAccessibility } from "../../context/AccessibilityContext";
import AppLayout from "../../components/AppLayout";
import { 
  Search, 
  CheckCheck, 
  Lock,
  ArrowLeft
} from "lucide-react";

// Mock recruiters listing
const RECRUITERS = [
  { id: "1", name: "Riska Amalia", initials: "RA", company: "PT Ruang Inklusif", lastMsg: "Halo! Lamaran Anda sudah saya terima ya. Saya akan segera kabari.", time: "09:11 AM", unread: 2, online: true },
  { id: "2", name: "Beni Setiawan", initials: "BS", company: "Karya Inklusi", lastMsg: "Apakah Anda bersedia untuk interview chat hari Selasa besok?", time: "10:20 AM", unread: 1, online: true },
  { id: "3", name: "Yudi Prasetyo", initials: "YP", company: "Harmoni Retail", lastMsg: "You: Terima kasih sudah melamar, mohon info selanjutnya.", time: "Kemarin", unread: 0, read: true, online: false },
  { id: "4", name: "Lina Marlina", initials: "LM", company: "PT Sinergi Utama", lastMsg: "You: Baik Bu, berkas portofolio sudah saya perbarui.", time: "2 hari lalu", unread: 0, read: true, online: false },
  { id: "5", name: "Dewi Lestari", initials: "DL", company: "Sentra Kreatif", lastMsg: "Bisa kirimkan link portofolio Canva atau Figma Anda?", time: "3 hari lalu", unread: 0, read: false, online: true }
];

export default function ChatListPage() {
  const { simpleLanguage } = useAccessibility();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = useMemo(() => {
    return RECRUITERS.filter(chat => 
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      chat.company.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <AppLayout showHeader={false} mainClassName="flex-1 flex flex-col h-full overflow-hidden bg-brand-bg relative pb-16">
      {/* Scrollable chat content wrapper */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col min-h-full">
        
          {/* ─── GRADIENT HEADER (Matches Notifications Style) ─── */}
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-cyan-500 pt-5 pb-4 px-5 text-white shadow-md shadow-indigo-900/5 relative overflow-hidden select-none mb-4">
            {/* decorative circles */}
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute bottom-[-20px] left-[-20px] w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <Link
                href="/dashboard"
                className="w-10 h-10 rounded-full bg-white/10 border border-white/25 flex items-center justify-center hover:bg-white/20 transition-all shrink-0"
                aria-label="Kembali ke Dashboard"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </Link>
              <h1 className="text-base font-extrabold text-white absolute left-1/2 -translate-x-1/2">
                Pesan
              </h1>
              <div className="w-10 h-10 shrink-0" />
            </div>
          </div>

          {/* ─── MAIN CONTENT ─── */}
          <div className="px-5 py-4 flex-1 flex flex-col space-y-4 max-w-md mx-auto w-full">
            
            {/* Search Bar */}
            <div className="bg-white border border-slate-100 rounded-2xl p-3 flex items-center shadow-sm">
              <Search className="text-slate-400 w-4.5 h-4.5 shrink-0 ml-1" />
              <input
                type="text"
                placeholder={simpleLanguage ? "Cari nama orang..." : "Cari rekruter atau perusahaan..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent pl-3 text-xs text-slate-800 placeholder:text-slate-400 font-bold outline-none"
              />
            </div>

            {/* Message List */}
            <div className="space-y-2.5">
              {filteredChats.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  Tidak ada riwayat chat yang cocok.
                </div>
              ) : (
                filteredChats.map((chat) => (
                  <Link
                    key={chat.id}
                    href={`/chat/${chat.id}`}
                    className="bg-white border border-slate-50 hover:border-indigo-100 rounded-2xl p-3.5 flex items-center gap-3.5 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                  >
                    {/* Recruiter Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-11 h-11 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 font-black text-sm flex items-center justify-center shadow-inner">
                        {chat.initials}
                      </div>
                      {chat.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                      )}
                    </div>

                    {/* Message content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-xs text-slate-800 truncate">{chat.name}</h4>
                        <span className="text-[9px] text-slate-400 font-semibold">{chat.time}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[10px] text-slate-500 font-semibold truncate leading-relaxed">
                          {chat.lastMsg}
                        </p>
                        
                        {/* Status Badges */}
                        {chat.unread > 0 ? (
                          <span className="bg-rose-500 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 shadow-sm shadow-rose-500/10">
                            {chat.unread}
                          </span>
                        ) : chat.read ? (
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        ) : null}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* Bottom Footnote Encryption */}
            <div className="flex items-center justify-center gap-1.5 text-[9px] text-slate-400 font-semibold py-6">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Pesan pribadi Anda terlindungi enkripsi end-to-end</span>
            </div>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}
