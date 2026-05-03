import { GetSession } from "@/lib/auth/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export async function DashboardContent({userId}: {userId: string}) {
    return <div className = " flex flex-1 flex-col gap-6">
        <div className = "flex flex-wrap items-center gap-4 justify-between">
            <div>
                <h1 className = "text-4xl font-semibold tracking-tight">Events</h1>
                <p className="text-sm text-[var(--muted-foreground)]">Manage your events and RSVPs here</p>
            </div>
            <div>
                <Button asChild>
                    <Link href ={"/events/new"} > Create New Event </Link>
                </Button>
            </div>
        </div>
    </div>
    
}