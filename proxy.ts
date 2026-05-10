// this is a middleware that is used to protect the routes that require authentication

import { NextRequest, NextResponse } from "next/server";

function isServerActionPost(request: NextRequest) {
    if (request.method != "POST") return false;
    const h = request.headers;
    return Boolean(h.get("Next-Action") ?? h.get("next-action"));
}
export default async function proxy(request: NextRequest) {
    if (isServerActionPost(request)) {
        return NextResponse.next();
    }

    const { auth } = await import("@/lib/auth/server");
    return auth.middleware({ loginUrl: "/auth/sign-in" })(request);
}

// the paths that require authentication
export const config = {
    matcher: ["/dashboard/:path*","/events/:path*"],
};
