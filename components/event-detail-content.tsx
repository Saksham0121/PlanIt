import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { countByStatus } from "./dashboard-content";
import { Button } from "./ui/button";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader } from "./ui/card";
import { createInviteLinkAction } from "@/lib/actions/events";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ArrowLeft, CalendarDays, Copy, Link as LinkIcon, MapPin, RefreshCw, Users } from "lucide-react";

export default async function EventDetailsContent({
    userId,
    eventId,
}: {
    userId: string;
    eventId: string;
}) {
    const row = await prisma.event.findFirst({
        where: { id: eventId, ownerUserId: userId },
        select: {
            id: true,
            title: true,
            description: true,
            location: true,
            eventDate: true,
            invites: { select: { token: true }},
            rsvps: { select: { status: true } },

        }
    })
    if (!row) notFound();

    const counts = countByStatus(row.rsvps);

    const event = {
        id : row.id,
        title : row.title,
        description : row.description,
        location : row.location,
        eventDate : row.eventDate ? row.eventDate.toISOString() : null,
        inviteToken : row.invites?.token ?? null,
        goingCount : counts.goingcount,
        maybeCount : counts.maybecount,
        notGoingCount : counts.notgoingcount,
    }

    const rsvpRows = await prisma.eventRSVP.findMany({
        where : { eventId },
        orderBy: { respondedAt: "desc"},
        select: {
            id : true,
            name : true,
            email : true,
            status : true,
            respondedAt : true,
        }
    });

    const rsvps = rsvpRows.map((r) => ({
        id: r.id,
        name : r.name,
        email : r.email,
        status : r.status,
        respondedAt : r.respondedAt?.toISOString(),
    }))

    const createInviteActionForEvent =  createInviteLinkAction.bind(null, event.id)

    const inviteUrl = event.inviteToken 
        ? `${process.env.NEXT_PUBLIC_APP_URL 
            ?? ""}/invite/${event.inviteToken}`
        : null;

    const totalResponses = event.goingCount + event.maybeCount + event.notGoingCount;

    return (
    <div className="flex w-full flex-col gap-6 pb-12">
        <div className="flex">
            <Button asChild variant="ghost" className="rounded-full text-white/65 hover:bg-white/8 hover:text-white">
                <Link href={"/dashboard"}>
                    <ArrowLeft className="size-4" />
                    Dashboard
                </Link>
            </Button>
        </div>

        <section className="soft-panel p-6 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
                <div className="space-y-5">
                    <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">Event details</p>
                    <div>
                        <h1 className="max-w-3xl text-4xl font-light tracking-normal text-secondary sm:text-5xl">{event.title}</h1>
                        {event.description && <p className="mt-4 max-w-2xl leading-7 text-white/65">{event.description}</p>}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] p-4 text-white/70">
                            <CalendarDays className="size-5 text-primary" />
                            <span>
                                {event.eventDate 
                                ? new Date(event.eventDate).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
                                : "No date selected"}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.05] p-4 text-white/70">
                            <MapPin className="size-5 text-primary" />
                            <span>{event.location || "No location selected"}</span>
                        </div>
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-4 lg:grid-cols-2">
                    {[
                        ["Responses", totalResponses, "text-white"],
                        ["Going", event.goingCount, "text-emerald-300"],
                        ["Maybe", event.maybeCount, "text-secondary"],
                        ["Out", event.notGoingCount, "text-white/55"],
                    ].map(([label, value, color]) => (
                        <div key={label} className="rounded-xl border border-white/10 bg-white/[0.05] p-4">
                            <p className="text-sm text-white/45">{label}</p>
                            <p className={`mt-2 text-3xl font-semibold ${color}`}>{value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
                    
        <div className="grid gap-6 lg:grid-cols-[24rem_1fr]">
            <Card className="soft-panel">
                <CardHeader className="pb-1">
                    <div className="flex items-center gap-3">
                        <span className="grid size-10 place-items-center rounded-full bg-primary/12 text-primary">
                            <LinkIcon className="size-5" />
                        </span>
                        <div>
                            <h2 className="text-xl font-semibold text-white">Invite link</h2>
                            <p className="text-sm text-white/55">Share this with guests.</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-5">
                    {inviteUrl ? (
                        <div className="rounded-xl border border-white/12 bg-[#03111c]/72 p-4 text-sm font-mono text-primary shadow-inner">
                            <p className="break-all">{inviteUrl}</p>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-dashed border-white/14 bg-white/[0.04] p-4 text-sm text-white/48">
                            Generate a link before sharing this event.
                        </div>
                    )}
                    <form action={createInviteActionForEvent}>
                        <Button type="submit" className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                            {inviteUrl ? <RefreshCw className="size-4" /> : <Copy className="size-4" />}
                            {inviteUrl ? "Regenerate link" : "Generate link"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="soft-panel">
                <CardHeader className="pb-1">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-white">Guest list</h2>
                            <p className="text-sm text-white/55">{totalResponses} responses recorded</p>
                        </div>
                        <Users className="size-5 text-primary" />
                    </div>
                </CardHeader>
                <CardContent>
                    {rsvps.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-white/14 bg-white/[0.04] py-12 text-center text-white/45">
                            No RSVPs yet. Share your invite link to get started.
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-xl border border-white/10">
                            <table className="w-full text-left text-sm">
                                <TableHeader className="bg-white/[0.06]">
                                    <TableRow className="border-b border-white/10 hover:bg-transparent">
                                        <TableHead className="h-11 px-4 font-medium text-white/72">Name</TableHead>
                                        <TableHead className="hidden h-11 px-4 font-medium text-white/72 sm:table-cell">Email</TableHead>
                                        <TableHead className="h-11 px-4 font-medium text-white/72">Status</TableHead>
                                        <TableHead className="h-11 px-4 text-right font-medium text-white/72">Responded</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rsvps.map((rsvp) => (
                                        <TableRow key={rsvp.id} className="border-b border-white/8 hover:bg-white/[0.05]">
                                            <TableCell className="px-4 py-3 font-medium text-white">{rsvp.name}</TableCell>
                                            <TableCell className="hidden px-4 py-3 text-white/55 sm:table-cell">{rsvp.email}</TableCell>
                                            <TableCell className="px-4 py-3">
                                                <Badge variant="outline" className={`
                                                    ${rsvp.status === 'going' ? 'border-emerald-300/20 bg-emerald-300/10 text-emerald-300' : ''}
                                                    ${rsvp.status === 'maybe' ? 'border-secondary/25 bg-secondary/10 text-secondary' : ''}
                                                    ${rsvp.status === 'notGoing' ? 'border-white/10 bg-white/5 text-white/55' : ''}
                                                    capitalize
                                                `}>
                                                    {rsvp.status === 'notGoing' ? 'Not going' : rsvp.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap px-4 py-3 text-right text-white/45">
                                                {new Date(rsvp.respondedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>)
}
