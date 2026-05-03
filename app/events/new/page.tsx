import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default async function NewEventPage() {
    return (
        <div className="mx-auto w-full max-w-2xl mt-8">
            <Card>
                <CardHeader>
                    <CardTitle>Create event</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
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
                        
                        <Button type="submit">Create Event</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}