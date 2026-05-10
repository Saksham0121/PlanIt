import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@neondatabase/auth/react/ui";
import { Providers } from "@/components/providers";
import { CalendarDays } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PlanIt",
  description: "Create event links, collect RSVPs, and keep every guest list clear.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <header className="sticky top-4 z-50 w-full px-4 sm:px-6">
            <div className="mx-auto flex max-w-7xl items-center justify-between rounded-[1.4rem] border border-white/10 bg-[#06131f]/72 px-4 py-3 shadow-[0_14px_60px_rgb(0_0_0/0.28)] backdrop-blur-xl sm:px-5">
              <Link href="/" className="flex items-center gap-2 text-base font-semibold tracking-wide text-white transition-colors hover:text-primary">
                <span className="grid size-9 place-items-center rounded-full border border-primary/40 bg-primary/15 text-primary shadow-[0_0_28px_rgb(45_212_191/0.18)]">
                  <CalendarDays className="size-4" />
                </span>
                PlanIt
              </Link>
              <nav className="flex items-center gap-2 sm:gap-4">
                <Link href="/dashboard" className="rounded-full px-3 py-2 text-sm font-medium text-white/72 transition-colors hover:bg-white/8 hover:text-white">
                  Dashboard
                </Link>
                <SignedOut>
                  <Link href="/auth/sign-in" className="rounded-full border border-white/12 bg-white/8 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-white/12">
                    Sign in
                  </Link>
                </SignedOut>
                <SignedIn>
                  <div className="hidden h-5 w-px bg-white/12 sm:block" />
                  <UserButton size="icon" />
                </SignedIn>
              </nav>
            </div>
          </header>
          <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-4">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
