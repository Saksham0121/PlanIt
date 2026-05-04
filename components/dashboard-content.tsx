import { Button } from "@/components/ui/button";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { RsvpStatus as PrismaRsvpStatus } from "@/app/generated/prisma/enums";


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

    return (
        <div className="flex flex-1 flex-col gap-8">
            {/* Header Section */}
            <div className="flex flex-wrap items-center gap-4 justify-between">
                <div>
                    <h1 className="text-4xl font-semibold tracking-tight">Events</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage your events and RSVPs here
                    </p>
                </div>
                <div>
                    <Button asChild>
                        <Link href={"/events/new"}>Create New Event</Link>
                    </Button>
                </div>
            </div>

            {/* Events Grid Section */}
            {events.length === 0 ? (
                <Card className="flex flex-col items-center justify-center p-10 text-center border-dashed">
                    <CardHeader>
                        <CardTitle className="text-2xl">No events created yet</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-6">
                            You haven't created any events. Click the button above to get started.
                        </p>
                        <Button variant="outline" asChild>
                            <Link href={"/events/new"}>Create New Event</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {events.map((event) => (
                        <Card key={event.id} className="flex flex-col hover:shadow-md transition-shadow">
                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between gap-4">
                                    <CardTitle className="text-xl line-clamp-1">{event.title}</CardTitle>
                                    <Button size="sm" variant="secondary" asChild>
                                        <Link href={`/events/${event.id}`}>Open</Link>
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {/* Placeholder badges until RSVPs are loaded */}
                                    <Badge variant="default" className="bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600/20">Going: {event.goingcount}</Badge> 
                                    <Badge variant="secondary" className="bg-amber-600/10 text-amber-600 hover:bg-amber-600/20">Maybe: {event.maybecount}</Badge> 
                                    <Badge variant="secondary" className="bg-red-600/10 text-red-600 hover:bg-red-600/20">Not Going: {event.notgoingcount}</Badge> 
                                </div>
                            </CardHeader>
                            <CardContent className="mt-auto text-sm text-muted-foreground space-y-2">
                                <div className="flex items-center gap-2">
                                    <span>📍</span>
                                    <span className="line-clamp-1">{event.location ? event.location : "Not specified"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>📅</span>
                                    <span>{event.eventDate ? new Date(event.eventDate).toLocaleDateString() : "Not specified"}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div> 
            )}
        </div>
    );
}