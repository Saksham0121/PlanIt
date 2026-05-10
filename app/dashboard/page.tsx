import { getSession } from "@/lib/auth/server"
import { DashboardContent } from "@/components/dashboard-content"
import { redirect } from "next/navigation";

export default async function Dashboard() {
    const session = await getSession();
    const userId = session.data?.user.id;

    if (!userId) {
        redirect("/auth/sign-in");
    }

    return <DashboardContent userId={userId}/>
}

