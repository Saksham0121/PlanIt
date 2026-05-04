import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FormMessage } from "@/components/ui/form";
import Link from "next/link";
import { createEventAction } from "@/lib/actions/events";

export default async function NewEventPage() {
    return (
        <div className="mx-auto w-full max-w-2xl mt-8">
            <Card>
                <CardHeader>
                    <CardTitle>Create event</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action= {createEventAction} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                type="text"
                                placeholder="Event Title"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Event Description"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                name="location"
                                placeholder="Event Location"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="eventDate">Date and Time</Label>
                            <Input
                                id="eventDate"
                                name="eventDate"
                                type="datetime-local"
                            />
                            <p className="ml-2 text-muted-foreground text-xs">Optional, you can setv this later</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button type="submit">Create Event</Button>
                            <Button type="button" variant="outline" asChild>
                                <Link href={"/dashboard"}>Cancel</Link>
                            </Button>
                        </div>

                    </form>
                </CardContent>
            </Card>
        </div>
    )
}