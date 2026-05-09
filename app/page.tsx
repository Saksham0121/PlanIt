import Link from "next/link";
import { ArrowRight, CalendarPlus, Link as LinkIcon, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[128px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[128px] -z-10 pointer-events-none" />

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32 mx-auto flex flex-col items-center text-center">
        <div className="space-y-8 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-slate-800/80 border border-slate-700 backdrop-blur-md text-sm text-slate-300 mb-4 shadow-lg">
            <span className="flex h-2.5 w-2.5 rounded-full bg-primary mr-3 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite] shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
            Now with instant magic links
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 mx-auto drop-shadow-sm">
            Plan events without <br className="hidden md:block"/> the chaos.
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Generate secure links, collect RSVPs instantly, and see exactly who is showing up. 
            No accounts required for your guests.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-8">
            <Button asChild size="lg" className="h-14 px-8 text-lg font-semibold rounded-full bg-white text-slate-950 hover:bg-slate-200 transition-all shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)]">
              <Link href="/dashboard">
                Start Planning <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-14 px-8 text-lg font-medium rounded-full border-slate-700 bg-slate-800/50 backdrop-blur-md hover:bg-slate-800 text-white transition-all">
              <Link href="#features">
                How it works
              </Link>
            </Button>
          </div>
        </div>

        {/* Feature Grid */}
        <div id="features" className="w-full mt-40 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <Card className="bg-slate-900/40 border-slate-800/80 backdrop-blur-xl hover:bg-slate-900/80 hover:border-slate-700 transition-all duration-300 shadow-xl overflow-hidden group">
            <CardContent className="p-8 space-y-5">
              <div className="h-14 w-14 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <LinkIcon className="h-7 w-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-100 tracking-tight">Instant Invites</h3>
              <p className="text-slate-400 leading-relaxed text-lg">
                Create an event and instantly get a unique, secure link to share in WhatsApp, iMessage, or email.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-slate-800/80 backdrop-blur-xl hover:bg-slate-900/80 hover:border-slate-700 transition-all duration-300 shadow-xl overflow-hidden group">
            <CardContent className="p-8 space-y-5">
              <div className="h-14 w-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <Users className="h-7 w-7 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-100 tracking-tight">Effortless RSVPs</h3>
              <p className="text-slate-400 leading-relaxed text-lg">
                Guests click the link, enter their name, and RSVP in 5 seconds. Zero friction, zero account creation.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/40 border-slate-800/80 backdrop-blur-xl hover:bg-slate-900/80 hover:border-slate-700 transition-all duration-300 shadow-xl overflow-hidden group">
            <CardContent className="p-8 space-y-5">
              <div className="h-14 w-14 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                <CalendarPlus className="h-7 w-7 text-amber-400" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-100 tracking-tight">Live Tracking</h3>
              <p className="text-slate-400 leading-relaxed text-lg">
                Your dashboard updates in real-time. See exactly who's coming, who's maybe, and who's out.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="w-full border-t border-slate-800/60 py-8 text-center text-slate-500 text-sm mt-auto z-10 bg-background/80 backdrop-blur-lg">
        <p>© {new Date().getFullYear()} PlanIt. Built for better events.</p>
      </footer>
    </div>
  );
}
