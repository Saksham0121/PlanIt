import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Link as LinkIcon,
  Sparkles,
  Users,
} from "lucide-react";
import { SignedIn, SignedOut } from "@neondatabase/auth/react/ui";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: LinkIcon,
    title: "Share one polished link",
    text: "Every event gets a secure invite page your guests can open from any chat, email, or group thread.",
  },
  {
    icon: Users,
    title: "Collect names without friction",
    text: "Guests RSVP with a name, email, and attendance choice. No guest account, no extra setup.",
  },
  {
    icon: CalendarCheck,
    title: "Track decisions clearly",
    text: "Your dashboard keeps each event, response count, and guest list in a calm command center.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="grid min-h-[calc(100vh-8.5rem)] items-center gap-12 pb-10 pt-14 lg:grid-cols-[1.04fr_0.96fr] lg:pt-20">
        <div className="space-y-9">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-2 text-sm font-medium text-primary shadow-[0_0_34px_rgb(45_212_191/0.12)]">
            <Sparkles className="size-4" />
            Magic links for real-world plans
          </div>

          <div className="space-y-6">
            <div className="section-rule max-w-3xl" />
            <h1 className="max-w-4xl text-6xl font-light leading-[0.92] tracking-normal text-secondary sm:text-7xl lg:text-8xl">
              PlanIt
            </h1>
            <p className="max-w-2xl text-2xl font-light leading-relaxed text-white/78 sm:text-3xl">
              Event planning that feels quiet, clear, and under control.
            </p>
            <p className="max-w-xl text-base leading-7 text-white/58 sm:text-lg">
              Create an event, share a private RSVP link, and see who is going without making guests create another account.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <SignedIn>
              <Button asChild size="lg" className="h-12 rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground shadow-[0_0_36px_rgb(45_212_191/0.24)] hover:bg-primary/90">
                <Link href="/dashboard">
                  Open dashboard <ArrowRight className="size-4" />
                </Link>
              </Button>
            </SignedIn>
            <SignedOut>
              <Button asChild size="lg" className="h-12 rounded-full bg-primary px-6 text-base font-semibold text-primary-foreground shadow-[0_0_36px_rgb(45_212_191/0.24)] hover:bg-primary/90">
                <Link href="/auth/sign-up">
                  Create account <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-full border-white/14 bg-white/8 px-6 text-base text-white hover:bg-white/12">
                <Link href="/auth/sign-in">Sign in</Link>
              </Button>
            </SignedOut>
          </div>
        </div>

        <div className="sky-shell p-5 sm:p-7">
          <div className="rounded-xl border border-white/10 bg-[#04101a]/70 p-5">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="text-sm text-white/44">Tonight</p>
                <h2 className="mt-1 text-2xl font-semibold text-white">Rooftop dinner</h2>
              </div>
              <div className="rounded-full border border-secondary/40 px-3 py-1 text-sm text-secondary">
                Live
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                ["Going", "18", "text-emerald-300"],
                ["Maybe", "6", "text-secondary"],
                ["Out", "3", "text-white/50"],
              ].map(([label, value, color]) => (
                <div key={label} className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
                  <p className="text-sm text-white/45">{label}</p>
                  <p className={`mt-2 text-3xl font-semibold ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              {["Maya Chen", "Arjun Rao", "Nora Patel"].map((name, index) => (
                <div key={name} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.05] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="grid size-9 place-items-center rounded-full bg-primary/12 text-sm font-semibold text-primary">
                      {name.split(" ").map((part) => part[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium text-white">{name}</p>
                      <p className="text-sm text-white/42">Responded {index + 2}m ago</p>
                    </div>
                  </div>
                  <CheckCircle2 className="size-5 text-emerald-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 pb-16 pt-16 md:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="soft-panel p-6">
            <feature.icon className="mb-5 size-6 text-primary" />
            <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
            <p className="mt-3 leading-7 text-white/58">{feature.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
