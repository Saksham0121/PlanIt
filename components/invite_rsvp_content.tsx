import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { notFound } from "next/navigation";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { submitOrUpdateRsvpAction } from "@/lib/actions/events";
import { CalendarDays, CheckCircle2, Mail, MapPin, Send, UserRound } from "lucide-react";
import { logger } from "@/lib/logger";

export async function InviteRsvpContent({
    token,
    submitted
    }: {
        token: string,
        submitted: boolean
    }) {
    
    const row = await prisma.eventInvite.findUnique({
        where : { token },
        include:{
            event: {
                select: {
                    id : true,
                    title : true,
                    description: true,
                    location : true,
                    eventDate : true,
                },
            },
        },
    })

    if(!row){
        logger.warn("Invite link access failed: Token not found or expired", "InviteUI", { tokenPrefix: token.substring(0, 8) + "..." });
        notFound();
    }

    logger.debug("Rendered InviteRsvpContent page", "InviteUI", { eventId: row.event.id, submitted });

    const e = row.event;
    const event = {
        title : e.title,
        description : e.description,
        location : e.location,
        eventDate : e.eventDate ? e.eventDate.toISOString() : null,
        
    }

    const submitRsvpForToken = submitOrUpdateRsvpAction.bind(null, token);

    return (
        <div className="mx-auto grid w-full max-w-5xl flex-1 items-start gap-6 py-8 lg:grid-cols-[0.95fr_1.05fr]">
            <section className="soft-panel p-6 sm:p-8">
                <Badge variant="outline" className="border-primary/25 bg-primary/10 text-primary">
                    RSVP invite
                </Badge>
                <h1 className="mt-5 text-4xl font-light tracking-normal text-secondary sm:text-5xl">
                    {event.title}
                </h1>
                <div className="mt-6 space-y-3 text-white/68">
                    <div className="flex items-center gap-3">
                        <CalendarDays className="size-5 text-primary" />
                        <span>{event.eventDate ? new Date(event.eventDate).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "Date not set"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <MapPin className="size-5 text-primary" />
                        <span>{event.location || "Location not set"}</span>
                    </div>
                </div>
                {event.description ? (
                    <p className="mt-6 leading-7 text-white/58">
                        {event.description}
                    </p>
                ) : null}
            </section>

            <Card className="soft-panel">
                <CardHeader className="pb-2">
                    <CardTitle className="text-2xl text-white">Your response</CardTitle>
                    <p className="text-sm text-white/55">Choose the option that best matches your plans.</p>
                </CardHeader>
                <CardContent>
                    {submitted ? (
                        <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-emerald-200">
                            <CheckCircle2 className="size-5" />
                            <p className="font-medium">Thank you. Your RSVP has been recorded.</p>
                        </div>
                    ) : null}
                    <form action = {submitRsvpForToken} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="flex items-center gap-2 text-white/78">
                                <UserRound className="size-4 text-primary" />
                                Name
                            </Label>
                            <Input
                                type="text"
                                id="name"
                                name="name"
                                required
                                placeholder="Your name"
                                className="h-11 border-white/12 bg-white/[0.06] text-white placeholder:text-white/35"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2 text-white/78">
                                <Mail className="size-4 text-primary" />
                                Email
                            </Label>
                            <Input
                             type="email"
                             id="email"
                             name="email"
                             required
                             placeholder="you@example.com"
                             className="h-11 border-white/12 bg-white/[0.06] text-white placeholder:text-white/35"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status" className="text-white/78">Attendance</Label>
                            <select 
                                id="status" 
                                name="status" 
                                className="flex h-11 w-full items-center justify-between rounded-lg border border-white/12 bg-white/[0.06] px-3 py-2 text-sm text-white outline-none transition-colors focus:border-primary focus:ring-3 focus:ring-primary/30"
                            >
                                <option className="bg-[#06131f]" value="going">Going</option>
                                <option className="bg-[#06131f]" value="maybe">Maybe</option>
                                <option className="bg-[#06131f]" value="notGoing">Not going</option>
                            </select>
                        </div>
                        <Button type="submit" className="h-11 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                            <Send className="size-4" />
                            Submit RSVP
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
