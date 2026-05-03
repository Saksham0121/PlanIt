import { NextRequest } from "next/server";
import { auth } from "@/lib/auth/server";

export default async function proxy(request: NextRequest) {
    const { auth } = await import("@/lib/auth/server");
    return auth.middleware({ loginUrl: "/auth/sign-in" })(request);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, robots.txt, etc. (metadata files)
         */
        "/((?!_next/static|_next/image|favicon.ico|robots.txt).*)",
    ],
};
