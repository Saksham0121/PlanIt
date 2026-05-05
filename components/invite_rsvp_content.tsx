import { Button } from "@/components/ui/button";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { RsvpStatus as PrismaRsvpStatus } from "@/app/generated/prisma/enums";
import { notFound } from "next/navigation";
import { Label } from "./ui/label";
import { Input } from "./ui/input";


export async function InviteRsvpContent({
    token,
    submitted
    }: {
        token: string,
        submitted: boolean
    }) {
    
    const row = await prisma.eventInvite.findMany({
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
        notFound();
    }
    const e = row[0].event;
    const event = {
        title : e.title,
        description : e.description,
        location : e.location,
        eventDate : e.eventDate ? e.eventDate.toISOString() : null,
        
    }


    return (
        <div className="flex flex-1 flex-col gap-8">
            <Card>
                <CardHeader className="space-y-3">
                    <Badge variant="secondary" className="w-fit">
                        RSVP
                    </Badge>
                    <CardTitle className="text-3xl">{event.title}</CardTitle>
                    <p className="text-muted-foreground">
                        {event.eventDate ? new Date(event.eventDate).toLocaleString() 
                        : "Not set"} 
                        {event.location ? " at " + event.location : ""}
                    </p>
                    {event.description ? (
                        <p className="text-muted-foreground mt-2">
                            {event.description}
                        </p>
                    ) : null}
                </CardHeader>
                <CardContent>
                    {submitted ? (
                        <p className="text-green-600 font-medium text-center">
                            Thank you! Your RSVP has been recorded.
                        </p>
                    ) : null}
                        <form className="space-y-4">
                            <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                type="text"
                                id="name"
                                name="name"
                                required
                                placeholder="Your Name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">
                                Email
                            </Label>
                            <Input
                             type="email"
                             id="email"
                             name="email"
                             required
                             placeholder="you@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status"> Attendance </Label>
                            <select 
                                id="status" 
                                name="status" 
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="going">Going</option>
                                <option value="maybe">Maybe</option>
                                <option value="notGoing">Not Going</option>
                            </select>
                        </div>
                        <Button type="submit" className="w-full">Submit RSVP</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}