# PlanIt - Project Context & Architecture

This document provides a comprehensive overview of the **PlanIt** event management platform. It serves as context for any AI agent or developer jumping into the codebase.

## 🎯 Project Overview
PlanIt is a modern web application that simplifies event planning. It allows users to quickly generate secure event links and track RSVPs in real-time without requiring guests to create accounts.

## 🛠 Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, Lucide React (Icons)
- **UI Components:** Shadcn UI (using `class-variance-authority`, `clsx`, `tailwind-merge`)
- **Authentication:** Neon Auth (`@neondatabase/auth`)
- **Database:** PostgreSQL (Neon Postgres)
- **ORM:** Prisma Client with `@prisma/adapter-pg`
- **Form Handling:** `react-hook-form` + `zod`


## 🗄️ Database Schema (Prisma)
The database structure revolves around Events and RSVPs:

1. **`Event`**:
   - Fields: `id` (UUID), `ownerUserId` (string from Neon Auth), `title`, `description`, `location`, `eventDate`.
   - Relationships: One-to-one with `EventInvite`, One-to-many with `EventRSVP`.

2. **`EventInvite`**:
   - Fields: `id`, `eventId`, `token` (unique secure string for shareable links).
   - Purpose: Stores the unique magic link data for a specific event.

3. **`EventRSVP`**:
   - Fields: `id`, `eventId`, `inviteId`, `name`, `email`, `emailNormalized`, `status` (`going`, `maybe`, `notGoing`).
   - Purpose: Captures guest responses. Guests do not need an account; responses are uniquely tied to `[eventId, emailNormalized]`.

## 📁 Core Application Structure
- `app/globals.css`: Contains the Tailwind `@theme` configuration and global layer rules.
- `app/layout.tsx`: Root layout featuring the `<Providers>` context, a floating glassmorphic header, and the `<UserButton />` from Neon Auth.
- `app/page.tsx`: Premium landing page showcasing the value proposition, using `<SignedIn>` and `<SignedOut>` components to toggle the "Open dashboard" and "Create account / Sign in" buttons.
- `app/auth/[path]/page.tsx`: Dynamic catch-all route for Neon Auth flows (Login, Sign-up, Magic Links, etc.).
- `app/account/[path]/page.tsx`: Uses `<AccountView>` for managing the user profile.
- `components/event-detail-content.tsx`: A major client/server component responsible for rendering event details, displaying the RSVP list (in a data table), and rendering the invite link.

## 🚀 Key Functionality
1. **Instant Event Creation**: Logged-in users can spin up an event providing basic details (title, location, date).
2. **Magic Invite Links**: Generating an event automatically provisions an `EventInvite` with a unique token. The user can share `planit.com/invite/<token>`.
3. **Frictionless RSVPs**: Guests click the link, see the event details, and submit their Name/Email and Status. No login wall.
4. **Live Dashboard Tracking**: The creator can see aggregated response totals (`Going: 5`, `Maybe: 2`, `Not Going: 1`) and a detailed table of respondents.

## 🤖 Context for Future Agents
- **Tailwind v4**: Do not use `tailwind.config.ts`. Configuration is managed inside `app/globals.css` via the `@theme` block.
- **Styling modifications**: When creating new UI components, utilize transparent overlays (`bg-white/5` or `bg-white/10` with `backdrop-blur`) instead of hardcoded opaque colors (like `bg-slate-800`) to maintain the glassmorphic aesthetic against the Dark Classic Blue background.
- **Neon Auth**: Always utilize `@neondatabase/auth/react/ui` for authentication states (`<SignedIn>`, `<SignedOut>`, `<UserButton>`) instead of custom NextAuth/Clerk implementations.
