"use client";

import { NeonAuthUIProvider } from "@neondatabase/auth/react/ui";
import { authClient } from "@/lib/auth/client";
import type { ComponentProps, ReactNode } from "react";

// This silences the React 19 strict mode warning about script tags.
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalError = console.error;
  console.error = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("Encountered a script tag")) return;
    originalError.apply(console, args);
  };
}

type NeonAuthClient = ComponentProps<typeof NeonAuthUIProvider>["authClient"];

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NeonAuthUIProvider authClient={authClient as unknown as NeonAuthClient} defaultTheme="dark">
      {children}
    </NeonAuthUIProvider>
  );
}
