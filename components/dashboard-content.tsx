import { Button } from "@/components/ui/button";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { RsvpStatus as PrismaRsvpStatus } from "@/app/generated/prisma/enums";
import { ArrowRight, CalendarDays, MapPin, Plus, Users } from "lucide-react";


export function countByStatus(rsvps: {status: PrismaRsvpStatus}[]) {

    let goingcount = 0;
    let maybecount = 0;
    let notgoingcount = 0;

    for (const r of rsvps){
        if (r.status == "going") goingcount++
        else if (r.status == "maybe") maybecount++
        else if (r.status == "notGoing") notgoingcount++
    }

    return { goingcount, maybecount, notgoingcount}
}

export async function DashboardContent({userId}: {userId: string}) {
    
    const rows = await prisma.event.findMany({
        where : { ownerUserId : userId },
        orderBy: { createdAt: 'desc' },
        select: {
            id : true,
            title : true,
            location : true,
            eventDate : true,
            rsvps : { select: { status : true }},
        }
    })
    
    const events = rows.map((e) => ({
        id : e.id,
        title : e.title,
        location : e.location,
        eventDate : e.eventDate ? e.eventDate.toISOString() : null,
        locationName : e.location || "Not specified",
        ...countByStatus(e.rsvps),
    }))

    const totals = events.reduce(
        (acc, event) => ({
            going: acc.going + event.goingcount,
            maybe: acc.maybe + event.maybecount,
            notGoing: acc.notGoing + event.notgoingcount,
        }),
        { going: 0, maybe: 0, notGoing: 0 }
    );

    return (
        <div className="flex flex-1 flex-col gap-8 pb-12">
            <section className="soft-panel p-6 sm:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl space-y-3">
                        <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">Command center</p>
                        <h1 className="text-4xl font-light tracking-normal text-secondary sm:text-5xl">Your events</h1>
                        <p className="text-white/60">
                            Create invite links, watch responses arrive, and open any event when you need the guest list.
                        </p>
                    </div>
                    <Button asChild size="lg" className="h-11 rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary/90">
                        <Link href={"/events/new"}>
                            <Plus className="size-4" />
                            New event
                        </Link>
                    </Button>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-4">
                    {[
                        ["Events", events.length, "text-white"],
                        ["Going", totals.going, "text-emerald-300"],
                        ["Maybe", totals.maybe, "text-secondary"],
                        ["Not going", totals.notGoing, "text-white/55"],
                    ].map(([label, value, color]) => (
                        <div key={label} className="rounded-xl border border-white/10 bg-white/[0.05] p-4">
                            <p className="text-sm text-white/45">{label}</p>
                            <p className={`mt-2 text-3xl font-semibold ${color}`}>{value}</p>
                        </div>
                    ))}
                </div>
            </section>

            {events.length === 0 ? (
                <Card className="soft-panel items-center justify-center border-dashed p-10 text-center">
                    <CardHeader>
                        <CardTitle className="text-2xl text-white">No events created yet</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-6 text-white/58">
                            Start with the basics. You can add a date, location, and invite link in a few seconds.
                        </p>
                        <Button asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                            <Link href={"/events/new"}>
                                <Plus className="size-4" />
                                Create event
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6  grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {events.map((event) => (
                        <Card key={event.id} className="soft-panel gap-5 p-3 transition-transform duration-300 hover:-translate-y-1">
                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between gap-4">
                                    <CardTitle className="line-clamp-2 text-xl text-white">{event.title}</CardTitle>
                                    <Button size="icon-sm" variant="outline" asChild className="rounded-full border-white/12 bg-white/8 text-white hover:bg-white/12" title="Open event">
                                        <Link href={`/events/${event.id}`} aria-label={`Open ${event.title}`}>
                                            <ArrowRight className="size-4" />
                                        </Link>
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    <Badge variant="outline" className="border-emerald-300/20 bg-emerald-300/10 text-emerald-300">Going {event.goingcount}</Badge> 
                                    <Badge variant="outline" className="border-secondary/25 bg-secondary/10 text-secondary">Maybe {event.maybecount}</Badge> 
                                    <Badge variant="outline" className="border-white/10 bg-white/5 text-white/55">Out {event.notgoingcount}</Badge> 
                                </div>
                            </CardHeader>
                            <CardContent className="mt-auto space-y-3 text-sm text-white/58">
                                <div className="flex items-center gap-2">
                                    <MapPin className="size-4 text-primary" />
                                    <span className="line-clamp-1">{event.location ? event.location : "Not specified"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="size-4 text-primary" />
                                    <span>{event.eventDate ? new Date(event.eventDate).toLocaleDateString() : "Not specified"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="size-4 text-primary" />
                                    <span>{event.goingcount + event.maybecount + event.notgoingcount} total responses</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div> 
            )}
        </div>
    );
}
