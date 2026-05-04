import EventDetailsContent from "@/components/event-detail-content";
import { getSession } from "@/lib/auth/server";

 

export default async function EventDetailsPage({
    params,
} :{
    params : Promise<{eventId: string}>;
}) {
    const { eventId } = await params;
    const session = await getSession();
    const userId = session.data?.user.id;
    return <EventDetailsContent userId = {userId!} eventId = {eventId}/>

    
}   