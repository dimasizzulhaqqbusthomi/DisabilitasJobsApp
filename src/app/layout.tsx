import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "../components/Providers";
import { PathnameWatcher } from "../components/PathnameWatcher";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "AbleWork - Work Without Barriers",
  description: "Platform pencarian kerja inklusif untuk penyandang disabilitas dengan job matching berbasis akomodasi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} h-full antialiased overflow-hidden`}
    >
      <body className="h-full w-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-950 text-brand-fg overflow-hidden">
        <PathnameWatcher />
        
        {/* Centered Mobile Layout Container */}
        <div className="w-full max-w-[430px] h-full bg-brand-bg flex flex-col shadow-2xl relative overflow-hidden border-x border-zinc-200/80 dark:border-zinc-800/80">
          <div className="flex-1 relative overflow-hidden flex flex-col">
            <Providers>
              {children}
            </Providers>
          </div>
        </div>
      </body>
    </html>
  );
}
