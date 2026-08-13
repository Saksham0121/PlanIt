import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";
import { logger } from "./logger";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

function createPrismaClient() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        logger.error("DATABASE_URL is not configured in environment variables", "Database");
        throw new Error("DATABASE_URL is not set.");
    }
    logger.debug("Initializing Prisma Client with PostgreSQL adapter", "Database");
    try {
        const adapter = new PrismaPg({ connectionString });
        return new PrismaClient({ adapter });
    } catch (err) {
        logger.error("Failed to initialize Prisma Client adapter", "Database", err);
        throw err;
    }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}