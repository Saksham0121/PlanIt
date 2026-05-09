import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { countByStatus } from "./dashboard-content";
import { Button } from "./ui/button";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Form } from "radix-ui";
import { createInviteLinkAction } from "@/lib/actions/events";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

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

    return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pt-4 pb-12">
        <div className="flex flex-wrap justify-between gap-4 bg-slate-900/40 p-6 rounded-xl border border-slate-800/80 shadow-sm">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-100">{event.title}</h1>
                <p className="text-slate-400 flex items-center gap-2">
                    {event.eventDate 
                    ? new Date(event.eventDate).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
                    : "No date selected"}
                    {event.location ? <span className="text-slate-500"> • {event.location}</span> : ""}
                </p>
                {event.description && <p className="text-slate-300 pt-2 leading-relaxed max-w-2xl"> {event.description} </p>}
                
                <div className="flex flex-wrap gap-3 pt-4">
                    <Badge variant="default" className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20">Going: {event.goingCount}</Badge> 
                    <Badge variant="secondary" className="bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20">Maybe: {event.maybeCount}</Badge> 
                    <Badge variant="secondary" className="bg-slate-500/10 text-slate-400 hover:bg-slate-500/20 border border-slate-500/20">Not Going: {event.notGoingCount}</Badge> 
                </div>
            </div>
            <Button asChild variant="outline" className="border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200 shadow-sm">
                <Link href={"/dashboard"}>Back to Dashboard</Link>
            </Button>
        </div>
                    
        <Card className="bg-slate-900/40 border-slate-800/80 shadow-lg">
            <CardHeader className="pb-4">
                <h2 className="text-xl font-semibold text-slate-100">Invite Link</h2>
                <p className="text-sm text-slate-400">
                    Share this link with guests so they can RSVP without creating an account.
                </p>
            </CardHeader>
            <CardContent className="space-y-5">
                {inviteUrl ? (
                    <div className="rounded-md border border-slate-700 bg-slate-800/50 p-4 text-sm text-blue-400 font-mono select-all overflow-x-auto whitespace-nowrap shadow-inner">
                        {inviteUrl}
                    </div>
                ) : (
                    <p className="text-sm text-slate-500 italic">
                        No invite link created yet. Click below to generate one.
                    </p>
                )}
                <form action={createInviteActionForEvent}>
                    <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700 shadow-md">
                        {inviteUrl ? "Regenerate Link" : "Generate Link"}
                    </Button>
                </form>
            </CardContent>
        </Card>

        <Card className="bg-slate-900/40 border-slate-800/80 shadow-lg">
            <CardHeader className="pb-4">
                <h2 className="text-xl font-semibold text-slate-100">RSVP List</h2>
            </CardHeader>
            <CardContent>
                {rsvps.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 bg-slate-900/20 rounded-lg border border-slate-800/50 border-dashed">
                        No RSVPs yet. Share your invite link to get started!
                    </div>
                ) : (
                    <div className="rounded-md border border-slate-800 overflow-hidden shadow-inner">
                        <table className="w-full text-sm text-left">
                            <TableHeader className="bg-slate-800/50">
                                <TableRow className="border-b border-slate-800 hover:bg-transparent">
                                    <TableHead className="text-slate-300 font-medium h-10 px-4">Name</TableHead>
                                    <TableHead className="text-slate-300 font-medium h-10 px-4 hidden sm:table-cell">Email</TableHead>
                                    <TableHead className="text-slate-300 font-medium h-10 px-4">Status</TableHead>
                                    <TableHead className="text-slate-300 font-medium h-10 px-4 text-right">Responded At</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rsvps.map((rsvp) => (
                                    <TableRow key={rsvp.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                        <TableCell className="px-4 py-3 font-medium text-slate-200">{rsvp.name}</TableCell>
                                        <TableCell className="px-4 py-3 text-slate-400 hidden sm:table-cell">{rsvp.email}</TableCell>
                                        <TableCell className="px-4 py-3">
                                            <Badge variant="secondary" className={`
                                                ${rsvp.status === 'going' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                                                ${rsvp.status === 'maybe' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : ''}
                                                ${rsvp.status === 'notGoing' ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' : ''}
                                                border capitalize
                                            `}>
                                                {rsvp.status === 'notGoing' ? 'Not Going' : rsvp.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-slate-500 text-right whitespace-nowrap">
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
    </div>)
}