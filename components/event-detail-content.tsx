import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { countByStatus } from "./dashboard-content";
import { Button } from "./ui/button";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Form } from "radix-ui";
import { createInviteLinkAction } from "@/lib/actions/events";

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

    const createInviteActionForEvent =  createInviteLinkAction.bind(null, event.id)

    const inviteUrl = event.inviteToken 
        ? `${process.env.NEXT_PUBLIC_APP_URL 
            ?? ""}/invite/${event.inviteToken}`
        : null;

    return (
    <div className="flex flex-col gap-6">
        <div className="flex flex-wrap justify-between gap-3">
            <div className ="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">{event.title}</h1>
                <p>{event.eventDate 
                    ? new Date(event.eventDate).toLocaleString()
                    : "No date selected"}

                    {event.location ? ` - ${event.location}` : ""}
                </p>
                <p> {event.description && <p> {event.description} </p>} </p>
            </div>
            <Button asChild variant = "outline" >
                <Link href= {"/dashboard"} > Back </Link>
            </Button>
        </div>
        
        <div className="flex flex-wrap gap-w text-xs">
            <Badge variant="default" className="bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600/20">Going: {event.goingCount}</Badge> 
            <Badge variant="secondary" className="bg-amber-600/10 text-amber-600 hover:bg-amber-600/20">Maybe: {event.maybeCount}</Badge> 
            <Badge variant="secondary" className="bg-red-600/10 text-red-600 hover:bg-red-600/20">Not Going: {event.notGoingCount}</Badge> 
        </div>
                    
        <Card>
            <CardHeader>Invite Link</CardHeader>
            <CardContent>
                <p>
                    Share this link with guests so they can RSVP without creating an account.
                </p>
                {inviteUrl ? (<div className="rounded-d border border-[var(--border)] bg-[var(--surface)] p-3 text-sm">
                    {inviteUrl}
                </div>) : (<p className="text-sm text-[var(--muted-foreground)]">
                    No invite link created yet.
                </p>
                )}
                <form action={createInviteActionForEvent}>
                    <Button type="submit">Generate Link</Button>
                </form>
            </CardContent>
        </Card>

    </div>)
}