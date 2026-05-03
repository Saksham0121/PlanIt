import { GetSession } from "@/lib/auth/server"
import { DashboardContent } from "@/components/dashboard-content"

export default async function Dashboard({userId}: {userId: string}) {
    // Optional chaining added in case session or user is null when unauthenticated
    return <DashboardContent userId={userId}/>
}


