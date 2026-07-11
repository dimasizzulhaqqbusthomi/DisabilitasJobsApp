"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAppState } from "../../../context/AppContext";
import { useAccessibility } from "../../../context/AccessibilityContext";
import { useAuth } from "../../../context/AuthContext";
import AppLayout from "../../../components/AppLayout";
import { 
  ChevronLeft, 
  Video, 
  Phone, 
  Mic, 
  Image as ImageIcon, 
  Smile, 
  Send,
  Check,
  CheckCheck
} from "lucide-react";

// Recruiter Info Map
const RECRUITERS: Record<string, { name: string; initials: string; company: string; online: boolean; phone: string }> = {
  "1": { name: "Riska Amalia", initials: "RA", company: "PT Ruang Inklusif", online: true, phone: "+62 812-3456-7890" },
  "2": { name: "Beni Setiawan", initials: "BS", company: "Karya Inklusi", online: true, phone: "+62 823-4567-8901" },
  "3": { name: "Yudi Prasetyo", initials: "YP", company: "Harmoni Retail", online: false, phone: "+62 834-5678-9012" },
  "4": { name: "Lina Marlina", initials: "LM", company: "PT Sinergi Utama", online: false, phone: "+62 845-5678-9013" },
  "5": { name: "Dewi Lestari", initials: "DL", company: "Sentra Kreatif", online: true, phone: "+62 856-5678-9014" },
};

// Initial Mock Messages
const INITIAL_MESSAGES_MAP: Record<string, { sender: "recruiter" | "user"; text: string; time: string }[]> = {
  "1": [
    { sender: "recruiter", text: "Halo! Lamaran Anda untuk posisi Admin Online sudah saya terima ya. Saya sangat terkesan dengan profil Anda.", time: "09:05 AM" },
    { sender: "user", text: "Terima kasih banyak Bu Riska! Saya sangat tertarik untuk berkontribusi di PT Ruang Inklusif.", time: "09:07 AM" },
    { sender: "recruiter", text: "Sama-sama. Saya sedang meninjau kebutuhan aksesibilitas Anda. Apakah deskripsi pekerjaan ini sudah cukup jelas?", time: "09:11 AM" },
  ],
  "2": [
    { sender: "recruiter", text: "Halo, salam kenal. Saya Beni dari Karya Inklusi. Saya melihat Anda terampil menggunakan Microsoft Excel.", time: "10:10 AM" },
    { sender: "user", text: "Halo Pak Beni, benar. Saya memiliki sertifikat pengolahan data spreadsheet dari AbleWork Academy.", time: "10:15 AM" },
    { sender: "recruiter", text: "Luar biasa. Apakah Anda bersedia untuk interview chat hari Selasa besok jam 10 pagi?", time: "10:20 AM" },
  ],
  "3": [
    { sender: "recruiter", text: "Halo Yudi di sini. Kami sedang membutuhkan Kasir Admin untuk penempatan Yogyakarta.", time: "Kemarin, 03:00 PM" },
    { sender: "user", text: "Halo Pak Yudi, posisi tersebut sangat cocok dengan preferensi lokasi saya. Apakah bisa dilakukan dengan jam kerja fleksibel?", time: "Kemarin, 03:15 PM" },
    { sender: "recruiter", text: "Ya, kami mendukung jam kerja fleksibel dan komunikasi utama via chat. Silakan kirim CV lengkap Anda.", time: "Kemarin, 03:20 PM" },
    { sender: "user", text: "Terima kasih sudah melamar, mohon info selanjutnya.", time: "Kemarin, 03:22 PM" }
  ],
  "4": [
    { sender: "recruiter", text: "Halo, selamat sore. Saya tertarik dengan profil portofolio telemarketing yang Anda unggah.", time: "2 hari lalu, 02:30 PM" },
    { sender: "user", text: "Selamat sore Bu Lina. Terima kasih, saya senang mendengarnya.", time: "2 hari lalu, 02:45 PM" },
    { sender: "recruiter", text: "Apakah ada berkas portofolio tambahan yang bisa saya lihat?", time: "2 hari lalu, 02:50 PM" },
    { sender: "user", text: "Baik Bu, berkas portofolio sudah saya perbarui.", time: "2 hari lalu, 03:00 PM" }
  ],
  "5": [
    { sender: "recruiter", text: "Halo! Saya Dewi, lead designer di Sentra Kreatif. Saya melihat karya poster aksesibilitas Anda sangat menarik.", time: "3 hari lalu, 09:00 AM" },
    { sender: "user", text: "Halo Kak Dewi! Terima kasih banyak atas apresiasinya. Saya mendesain poster itu menggunakan Canva.", time: "3 hari lalu, 09:15 AM" },
    { sender: "recruiter", text: "Bisa kirimkan link portofolio Canva atau Figma Anda?", time: "3 hari lalu, 09:30 AM" }
  ]
};

export default function ChatRoomPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useAppState();
  const { simpleLanguage } = useAccessibility();
  
  const id = params?.id as string;
  const recruiter = RECRUITERS[id] || { name: "Recruiter AbleWork", initials: "RA", company: "AbleWork Co", online: true, phone: "+62 812-3456-7890" };

  const [messages, setMessages] = useState<{ id?: string; sender: "recruiter" | "user"; text: string; time: string }[]>([]);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Initial messages loader (Loads from Supabase if logged in, fallback to mockup list + localStorage)
  useEffect(() => {
    if (user) {
      import("../../../lib/supabase/client").then(({ createClient }) => {
        const supabase = createClient();
        supabase
          .from("chat_messages")
          .select("*")
          .eq("user_id", user.id)
          .eq("recruiter_id", id)
          .order("created_at", { ascending: true })
          .then(({ data, error }) => {
            if (data && data.length > 0 && !error) {
              const formatted = data.map(m => ({
                id: m.id,
                sender: m.sender as "recruiter" | "user",
                text: m.message,
                time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }));
              setMessages(formatted);
            } else {
              setMessages(INITIAL_MESSAGES_MAP[id] || INITIAL_MESSAGES_MAP["1"]);
            }
          });
      });
    } else {
      // Check localStorage for auto-sent messages (from apply flow)
      const localKey = `chat-local-${id}`;
      const localMsgs = JSON.parse(localStorage.getItem(localKey) || "[]");
      const mockMsgs = INITIAL_MESSAGES_MAP[id] || INITIAL_MESSAGES_MAP["1"];
      
      if (localMsgs.length > 0) {
        // Merge: put auto-sent messages after the mock history
        setMessages([...mockMsgs, ...localMsgs]);
      } else {
        setMessages(mockMsgs);
      }
    }
  }, [user, id]);

  // Scroll to bottom whenever messages list changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const messageText = inputText.trim();
    setInputText("");

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append user message locally
    const newUserMsg = { sender: "user" as const, text: messageText, time: timeStr };
    setMessages(prev => [...prev, newUserMsg]);

    // Save to Supabase if authenticated
    if (user) {
      try {
        const { createClient } = await import("../../../lib/supabase/client");
        const supabase = createClient();
        await supabase
          .from("chat_messages")
          .insert({
            user_id: user.id,
            recruiter_id: id,
            sender: "user",
            message: messageText
          });
      } catch (err) {
        console.error("Error saving message to Supabase:", err);
      }
    }

    // Auto mockup reply from Recruiter after 1.5 seconds
    setTimeout(async () => {
      const replyText = `Terima kasih atas pesan Anda. Saya sudah menerima detail informasi tersebut. Saya akan meninjau kelengkapan profil Anda dan menghubungi Anda kembali secepatnya.`;
      const replyTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const newRecruiterMsg = { sender: "recruiter" as const, text: replyText, time: replyTimeStr };
      
      setMessages(prev => [...prev, newRecruiterMsg]);

      // Save recruiter response to Supabase too if authenticated
      if (user) {
        try {
          const { createClient } = await import("../../../lib/supabase/client");
          const supabase = createClient();
          await supabase
            .from("chat_messages")
            .insert({
              user_id: user.id,
              recruiter_id: id,
              sender: "recruiter",
              message: replyText
            });
        } catch (err) {
          console.error("Error saving recruiter response to Supabase:", err);
        }
      }
    }, 1500);
  };

  return (
    <AppLayout showHeader={false} showNav={false} mainClassName="flex-1 overflow-hidden bg-brand-bg relative flex flex-col h-screen">
      <div className="flex flex-col h-full bg-slate-50">
        
        {/* ─── HEADER BAR (Matches User Style Third Screen) ─── */}
        <div className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-3">
            {/* Back Arrow */}
            <Link 
              href="/chat"
              className="p-1 rounded-full hover:bg-slate-100 transition-colors text-slate-600"
            >
              <ChevronLeft className="w-6 h-6" />
            </Link>

            {/* Recruiter Avatar & Info */}
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 font-black text-xs flex items-center justify-center shadow-inner">
                  {recruiter.initials}
                </div>
                {recruiter.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                )}
              </div>
              <div>
                <h1 className="text-xs font-black text-slate-800 leading-tight">
                  {recruiter.name}
                </h1>
                <p className="text-[10px] font-bold text-slate-400">
                  {recruiter.online ? "Online" : "Offline"} · {recruiter.company}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side Camera/Phone icons */}
          <div className="flex items-center gap-1">
            <button 
              type="button"
              onClick={() => showToast("Panggilan video simulasi belum didukung.", "info")}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              aria-label="Panggilan Video"
            >
              <Video className="w-4.5 h-4.5" />
            </button>
            <button 
              type="button"
              onClick={() => showToast("Panggilan suara simulasi belum didukung.", "info")}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
              aria-label="Panggilan Suara"
            >
              <Phone className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ─── CHAT BUBBLES SCROLL AREA ─── */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          
          {/* Centered Date Label */}
          <div className="text-center">
            <span className="bg-slate-200/60 text-slate-500 text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Today, Jan 9
            </span>
          </div>

          {messages.map((msg, index) => {
            const isUser = msg.sender === "user";
            return (
              <div 
                key={index} 
                className={`flex flex-col ${isUser ? "items-end" : "items-start"} space-y-1`}
              >
                {/* Bubble Container */}
                <div 
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl shadow-sm text-xs font-bold leading-relaxed ${
                    isUser 
                      ? "bg-indigo-600 text-white rounded-tr-none" 
                      : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
                
                {/* Time + Status tag */}
                <div className={`flex items-center gap-1 text-[9px] text-slate-400 font-semibold px-1`}>
                  <span>{msg.time}</span>
                  {isUser && (
                    <CheckCheck className="w-3 h-3 text-indigo-500" />
                  )}
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* ─── BOTTOM CHAT INPUT BAR (Matches User Style Third Screen) ─── */}
        <form 
          onSubmit={handleSendMessage}
          className="bg-white border-t border-slate-100 px-4 py-3 flex items-center gap-2 sticky bottom-0 z-10 shrink-0 shadow-lg"
        >
          {/* Mic Button */}
          <button
            type="button"
            onClick={() => showToast("Fitur Voice Note sedang disiapkan.", "info")}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors shrink-0"
            aria-label="Kirim Pesan Suara"
          >
            <Mic className="w-4.5 h-4.5" />
          </button>

          {/* Text Input Box */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={simpleLanguage ? "Ketik pesan di sini..." : "Tulis Pesan..."}
            className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 font-bold outline-none focus:border-indigo-300 focus:bg-white transition-all"
          />

          {/* Image Upload Button */}
          <button
            type="button"
            onClick={() => showToast("Unggah gambar simulasi belum didukung.", "info")}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors shrink-0"
            aria-label="Kirim Gambar"
          >
            <ImageIcon className="w-4.5 h-4.5" />
          </button>

          {/* Emoji Button */}
          <button
            type="button"
            onClick={() => showToast("Keyboard emoji sedang disiapkan.", "info")}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors shrink-0"
            aria-label="Pilih Emoji"
          >
            <Smile className="w-4.5 h-4.5" />
          </button>

          {/* Send Action Button */}
          <button
            type="submit"
            disabled={!inputText.trim()}
            className={`p-2.5 rounded-xl flex items-center justify-center transition-all shrink-0 ${
              inputText.trim() 
                ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/25 cursor-pointer scale-105" 
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
            aria-label="Kirim Pesan"
          >
            <Send className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

      </div>
    </AppLayout>
  );
}
