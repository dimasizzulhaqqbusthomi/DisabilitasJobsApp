"use client";

import React, { useState } from "react";
import Link from "next/link";
import AppLayout from "../../components/AppLayout";
import { useAppState } from "../../context/AppContext";
import { 
  ArrowLeft, 
  Bell, 
  MoreVertical, 
  Check, 
  Trash2, 
  Inbox,
  CheckSquare
} from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  date: string;
  group: "Hari ini" | "Kemarin";
  read: boolean;
  type: "success" | "info" | "warning";
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Lamaran Berhasil Dikirim",
    desc: "Lamaran Anda untuk posisi 'Customer Support' telah berhasil dikirim dan sedang menunggu verifikasi oleh pihak HRD.",
    date: "23 Juni 2026",
    group: "Hari ini",
    read: false,
    type: "success",
  },
  {
    id: "notif-2",
    title: "Akomodasi Disetujui Mitra",
    desc: "Kebutuhan akomodasi 'Akses Kursi Roda' Anda telah selesai dikonfirmasi dan disetujui oleh Mitra Pemberi Kerja.",
    date: "23 Juni 2026",
    group: "Hari ini",
    read: false,
    type: "info",
  },
  {
    id: "notif-3",
    title: "Berkas Prioritas Diteruskan",
    desc: "Berkas lamaran Anda telah dikirim dan masuk dalam antrean prioritas rekrutmen inklusif AksesKerjaMu.",
    date: "23 Juni 2026",
    group: "Kemarin",
    read: true,
    type: "success",
  },
  {
    id: "notif-4",
    title: "Lamaran Sedang Ditinjau",
    desc: "Pihak rekruter telah mulai meninjau detail kualifikasi dan skor kecocokan profil Kecocokan Kerja Anda.",
    date: "23 Juni 2026",
    group: "Kemarin",
    read: true,
    type: "info",
  },
];

export default function NotificationsPage() {
  const { showToast } = useAppState();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Mark all as read
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast("Semua notifikasi ditandai telah dibaca", "success");
  };

  // Toggle read status for single item
  const handleToggleRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: !n.read } : n))
    );
    setActiveMenuId(null);
  };

  // Delete notification
  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    showToast("Notifikasi berhasil dihapus", "info");
    setActiveMenuId(null);
  };

  // Groups
  const todayNotifs = notifications.filter(n => n.group === "Hari ini");
  const yesterdayNotifs = notifications.filter(n => n.group === "Kemarin");

  return (
    <AppLayout 
      showHeader={false} 
      mainClassName="flex-1 overflow-y-auto bg-brand-bg pb-24"
    >
      <div className="max-w-2xl mx-auto w-full flex flex-col relative bg-brand-bg">
        
        {/* ─── GRADIENT HEADER ─── */}
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
              Notifikasi
            </h1>
            <div className="w-10 h-10 shrink-0" />
          </div>
        </div>

        {/* ─── CONTENT AREA ─── */}
        <div className="p-4 flex-1 flex flex-col gap-6">
          {notifications.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-20 px-6">
              <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mb-4">
                <Inbox className="w-10 h-10" />
              </div>
              <h2 className="text-sm font-bold text-slate-800 mb-1">
                Tidak ada notifikasi
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Anda akan menerima notifikasi di sini ketika ada kabar terbaru mengenai lamaran kerja Anda.
              </p>
            </div>
          ) : (
            <>
              {/* --- GROUP: HARI INI --- */}
              {todayNotifs.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <h2 className="text-xs font-black text-slate-800 tracking-wide uppercase">
                      Hari ini
                    </h2>
                    <button
                      onClick={handleMarkAllRead}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Tandai Semua
                    </button>
                  </div>

                  <div className="space-y-3">
                    {todayNotifs.map(item => (
                      <div 
                        key={item.id}
                        className={`bg-white rounded-2xl border transition-all p-4 relative ${
                          item.read 
                            ? "border-slate-100 opacity-75" 
                            : "border-slate-100 shadow-sm shadow-blue-500/5 bg-gradient-to-r from-blue-50/10 to-white"
                        }`}
                      >
                        {/* Unread indicator dot */}
                        {!item.read && (
                          <div className="absolute top-4 right-10 w-2 h-2 rounded-full bg-blue-600" />
                        )}

                        <div className="flex items-start gap-4">
                          {/* Bell Circle Icon */}
                          <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                            <Bell className="w-5 h-5 fill-blue-600" />
                          </div>

                          {/* Info Text */}
                          <div className="flex-1 min-w-0 pr-4">
                            <h3 className="text-xs font-black text-slate-800 mb-1 leading-snug">
                              {item.title}
                            </h3>
                            <p className="text-[11px] text-slate-600 leading-relaxed mb-2">
                              {item.desc}
                            </p>
                            <span className="text-[10px] font-bold text-blue-600">
                              {item.date}
                            </span>
                          </div>

                          {/* Menu Trigger */}
                          <div className="relative shrink-0">
                            <button
                              onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                              className="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center transition-all text-slate-400"
                              aria-label="Opsi notifikasi"
                            >
                              <MoreVertical className="w-4 h-4 text-slate-700" />
                            </button>

                            {/* Dropdown Menu */}
                            {activeMenuId === item.id && (
                              <div className="absolute right-0 top-9 w-36 bg-white border border-slate-100 rounded-xl shadow-xl z-20 overflow-hidden py-1">
                                <button
                                  onClick={() => handleToggleRead(item.id)}
                                  className="w-full px-3 py-2 text-[10px] font-black text-slate-700 hover:bg-slate-50 flex items-center gap-2 text-left"
                                >
                                  <CheckSquare className="w-3.5 h-3.5" />
                                  <span>{item.read ? "Belum Dibaca" : "Tandai Dibaca"}</span>
                                </button>
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="w-full px-3 py-2 text-[10px] font-black text-red-600 hover:bg-red-50/50 flex items-center gap-2 text-left"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Hapus</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- GROUP: KEMARIN --- */}
              {yesterdayNotifs.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <h2 className="text-xs font-black text-slate-800 tracking-wide uppercase">
                      Kemarin
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {yesterdayNotifs.map(item => (
                      <div 
                        key={item.id}
                        className={`bg-white rounded-2xl border transition-all p-4 relative ${
                          item.read 
                            ? "border-slate-100 opacity-75" 
                            : "border-slate-100 shadow-sm shadow-blue-500/5 bg-gradient-to-r from-blue-50/10 to-white"
                        }`}
                      >
                        {/* Unread indicator dot */}
                        {!item.read && (
                          <div className="absolute top-4 right-10 w-2 h-2 rounded-full bg-blue-600" />
                        )}

                        <div className="flex items-start gap-4">
                          {/* Bell Circle Icon */}
                          <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                            <Bell className="w-5 h-5 fill-blue-600" />
                          </div>

                          {/* Info Text */}
                          <div className="flex-1 min-w-0 pr-4">
                            <h3 className="text-xs font-black text-slate-800 mb-1 leading-snug">
                              {item.title}
                            </h3>
                            <p className="text-[11px] text-slate-600 leading-relaxed mb-2">
                              {item.desc}
                            </p>
                            <span className="text-[10px] font-bold text-blue-600">
                              {item.date}
                            </span>
                          </div>

                          {/* Menu Trigger */}
                          <div className="relative shrink-0">
                            <button
                              onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                              className="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center transition-all text-slate-400"
                              aria-label="Opsi notifikasi"
                            >
                              <MoreVertical className="w-4 h-4 text-slate-700" />
                            </button>

                            {/* Dropdown Menu */}
                            {activeMenuId === item.id && (
                              <div className="absolute right-0 top-9 w-36 bg-white border border-slate-100 rounded-xl shadow-xl z-20 overflow-hidden py-1">
                                <button
                                  onClick={() => handleToggleRead(item.id)}
                                  className="w-full px-3 py-2 text-[10px] font-black text-slate-700 hover:bg-slate-50 flex items-center gap-2 text-left"
                                >
                                  <CheckSquare className="w-3.5 h-3.5" />
                                  <span>{item.read ? "Belum Dibaca" : "Tandai Dibaca"}</span>
                                </button>
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="w-full px-3 py-2 text-[10px] font-black text-red-600 hover:bg-red-50/50 flex items-center gap-2 text-left"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Hapus</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </AppLayout>
  );
}
