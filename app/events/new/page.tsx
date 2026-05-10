import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { createEventAction } from "@/lib/actions/events";
import { ArrowLeft, CalendarPlus, MapPin, Text, Type } from "lucide-react";

export default async function NewEventPage() {
    return (
        <div className="mx-auto grid w-full max-w-5xl gap-6 pb-12 lg:grid-cols-[0.85fr_1.15fr]">
            <aside className="soft-panel h-fit p-6 sm:p-8">
                <Button asChild variant="ghost" className="mb-8 rounded-full text-white/65 hover:bg-white/8 hover:text-white">
                    <Link href={"/dashboard"}>
                        <ArrowLeft className="size-4" />
                        Dashboard
                    </Link>
                </Button>
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-primary">New event</p>
                <h1 className="mt-3 text-4xl font-light tracking-normal text-secondary sm:text-5xl">Set the scene</h1>
                <p className="mt-5 leading-7 text-white/60">
                    Add the essentials now. After creating the event, PlanIt gives you a shareable RSVP link.
                </p>
            </aside>

            <Card className="soft-panel">
                <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                        <span className="grid size-10 place-items-center rounded-full bg-primary/12 text-primary">
                            <CalendarPlus className="size-5" />
                        </span>
                        <CardTitle className="text-2xl text-white">Create event</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <form action= {createEventAction} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="flex items-center gap-2 text-white/78">
                                <Type className="size-4 text-primary" />
                                Title
                            </Label>
                            <Input
                                id="title"
                                name="title"
                                type="text"
                                required
                                placeholder="Friday dinner, demo night, birthday brunch"
                                className="h-11 border-white/12 bg-white/[0.06] text-white placeholder:text-white/35"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description" className="flex items-center gap-2 text-white/78">
                                <Text className="size-4 text-primary" />
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="A short note guests should see before they RSVP"
                                className="min-h-28 border-white/12 bg-white/[0.06] text-white placeholder:text-white/35"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location" className="flex items-center gap-2 text-white/78">
                                <MapPin className="size-4 text-primary" />
                                Location
                            </Label>
                            <Input
                                id="location"
                                name="location"
                                placeholder="Venue, address, or online link"
                                className="h-11 border-white/12 bg-white/[0.06] text-white placeholder:text-white/35"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="eventDate" className="flex items-center gap-2 text-white/78">
                                <CalendarPlus className="size-4 text-primary" />
                                Date and time
                            </Label>
                            <Input
                                id="eventDate"
                                name="eventDate"
                                type="datetime-local"
                                className="h-11 border-white/12 bg-white/[0.06] text-white"
                            />
                            <p className="text-xs text-white/45">Optional. You can leave this blank while plans are still forming.</p>
                        </div>

                        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                            <Button type="submit" className="h-11 rounded-full bg-primary px-5 text-primary-foreground hover:bg-primary/90">
                                <CalendarPlus className="size-4" />
                                Create event
                            </Button>
                            <Button type="button" variant="outline" asChild className="h-11 rounded-full border-white/12 bg-white/8 px-5 text-white hover:bg-white/12">
                                <Link href={"/dashboard"}>Cancel</Link>
                            </Button>
                        </div>

                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
