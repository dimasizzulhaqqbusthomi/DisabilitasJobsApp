"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// Onboarding sudah digabung ke dalam proses registrasi (5 tahap).
// Halaman ini hanya redirect ke dashboard.
export default function OnboardingPage() {
  const router = useRouter();
  useEffect(() => { router.replace("/dashboard"); }, [router]);
  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
    </div>
  );
}
