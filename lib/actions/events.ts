"use server"
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "../auth/server";
import { prisma } from "../prisma";
import { RsvpStatus } from "@/app/generated/prisma/enums";
import { logger } from "../logger";

// Helper function to parse Create Event form data with validation logging.
function parseCreateEvent(formData: FormData) {
    const title = String(formData.get("title") ?? "").trim();
    if (title.length < 3 || title.length > 120) {
        logger.warn("Create event validation failed: Title length invalid", "EventValidation", { titleLength: title.length });
        throw new Error("Title must be between 3 and 120 characters.");
    }
    const description = String(formData.get("description") ?? "").trim();
    const location = String(formData.get("location") ?? "").trim();
    const eventDate = String(formData.get("eventDate") ?? "").trim();
    return {
        title,
        description: description.length ? description.slice(0, 2000) : "",
        location: location.length ? location.slice(0, 200) : "",
        eventDate: eventDate.length ? eventDate : null,
    };
}

const RSVP_STATUSES = ["going", "maybe", "notGoing"] as const;

function isRsvpStatus(s: string): s is RsvpStatus {
    return (RSVP_STATUSES as readonly string[]).includes(s);
}

// Helper function to parse RSVP form data with validation logging.
function parseRsvp(formData: FormData) {
    const name = String(formData.get("name") ?? "").trim();
    if (name.length < 3 || name.length > 120) {
        logger.warn("RSVP validation failed: Name length invalid", "RsvpValidation", { nameLength: name.length });
        throw new Error("Name must be between 3 and 120 characters.");
    }
    const email = String(formData.get("email") ?? "").trim();
    if (email.length < 3 || email.length > 320 || !email.includes("@")) {
        logger.warn("RSVP validation failed: Invalid email format", "RsvpValidation", { email });
        throw new Error("Please enter a valid email.");
    }
    const status = String(formData.get("status") ?? "").trim();
    if (!isRsvpStatus(status)) {
        logger.warn("RSVP validation failed: Invalid status value", "RsvpValidation", { status });
        throw new Error("Invalid RSVP status");
    }

    return { name, email, status };
}

// Server Action: Create an event
export async function createEventAction(formData: FormData) {
    logger.info("Executing createEventAction", "EventAction");
    const session = await getSession();
    const userId = session.data?.user.id;

    if (!userId) {
        logger.warn("Unauthorized attempt to create event", "EventAction");
        throw new Error("You must be logged in to create an event.");
    }

    const input = parseCreateEvent(formData);
    let createdId: string | null = null;

    try {
        const created = await prisma.event.create({
            data: {
                ownerUserId: userId,
                title: input.title,
                description: input.description,
                location: input.location,
                eventDate: input.eventDate ? new Date(input.eventDate) : null,
            }
        });
        createdId = created.id;
        logger.info("Event created successfully", "EventAction", {
            eventId: created.id,
            title: created.title,
            ownerUserId: userId,
            hasLocation: !!input.location,
            hasDate: !!input.eventDate,
        });
    } catch (err) {
        logger.error("Failed to create event in database", "EventAction", err, { ownerUserId: userId, title: input.title });
        throw err;
    }

    if (createdId) {
        redirect(`/events/${createdId}`);
    }
}

// Server Action: Create or update magic invite link for an event
export async function createInviteLinkAction(eventId: string) {
    logger.info("Executing createInviteLinkAction", "InviteAction", { eventId });
    const session = await getSession();
    const userId = session.data?.user.id;

    if (!userId) {
        logger.warn("Unauthorized attempt to create invite link", "InviteAction", { eventId });
        throw new Error("Unauthorized");
    }

    const owns = await prisma.event.findFirst({
        where: {
            id: eventId,
            ownerUserId: userId,
        },
        select: { id: true }
    });

    if (!owns) {
        logger.warn("Permission denied: User does not own event", "InviteAction", { eventId, userId });
        throw new Error("You don't own this event");
    }

    const token = crypto.randomUUID().replace(/-/g, "");

    try {
        const invite = await prisma.eventInvite.upsert({
            where: { eventId },
            create: { eventId, token },
            update: { token },
        });
        logger.info("Invite link generated/updated successfully", "InviteAction", {
            eventId,
            inviteId: invite.id,
            tokenPrefix: token.substring(0, 8) + "...",
        });
        revalidatePath(`/events/${eventId}`);
    } catch (err) {
        logger.error("Failed to upsert invite link", "InviteAction", err, { eventId });
        throw err;
    }
}

// Server Action: Submit or update guest RSVP
export async function submitOrUpdateRsvpAction(
    token: string,
    formData: FormData,
) {
    logger.info("Executing submitOrUpdateRsvpAction", "RsvpAction", { tokenPrefix: token.substring(0, 8) + "..." });
    const input = parseRsvp(formData);

    const invite = await prisma.eventInvite.findFirst({
        where: { token },
        select: {
            id: true,
            event: {
                select: { id: true, title: true }
            },
        },
    });

    if (!invite) {
        logger.warn("RSVP failed: Invalid or expired invite token", "RsvpAction", { token });
        throw new Error("Invalid or expired invite link");
    }

    const eventId = invite.event.id;
    const emailNormalized = input.email.toLowerCase();
    let isRedirect = false;

    try {
        const rsvp = await prisma.eventRSVP.upsert({
            where: {
                eventId_emailNormalized: {
                    eventId,
                    emailNormalized
                }
            },
            create: {
                eventId,
                inviteId: invite.id,
                email: input.email,
                emailNormalized,
                name: input.name,
                status: input.status as RsvpStatus,
            },
            update: {
                name: input.name,
                status: input.status as RsvpStatus,
                respondedAt: new Date(),
            }
        });

        logger.info("RSVP recorded successfully", "RsvpAction", {
            rsvpId: rsvp.id,
            eventId,
            eventTitle: invite.event.title,
            status: rsvp.status,
            emailNormalized,
        });
        isRedirect = true;
    } catch (err) {
        logger.error("Database error while upserting RSVP", "RsvpAction", err, { eventId, emailNormalized });
        throw err;
    }

    if (isRedirect) {
        redirect(`/invite/${token}?submitted=1`);
    }
}
