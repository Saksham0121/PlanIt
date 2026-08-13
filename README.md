# PlanIt 🗓️

**PlanIt** is a modern, full-stack event management and guest RSVP tracking web application built to eliminate friction in event planning. It empowers hosts to effortlessly create events, generate secure magic invite links, and track guest RSVPs in real time — without forcing guests to create accounts or log in.

---

## 🚀 Key Features & Full-Stack Capabilities

### 🔐 1. Authentication & Account Management
- **Neon Auth Integration**: Secure user registration, login, and session persistence powered by `@neondatabase/auth`.
- **Protected Command Center**: Private host dashboards and event management routes protected at the server layer so users can only access their own events.
- **Embedded Account View**: Integrated profile management powered by Neon Auth.

### 📅 2. Event Creation & Management
- **Instant Event Setup**: Hosts can quickly create events specifying the event title, detailed description, physical/virtual location, and date/time.
- **Host Command Center**: Centralized dashboard listing all active events with quick-action cards, aggregate response tallies, and direct links to event details.

### 🔗 3. Magic Invite Link Generation
- **Unique Shareable Tokens**: Generates cryptographically secure, tokenized invite URLs (`/invite/[token]`) using Next.js Server Actions and Prisma ORM.
- **Link Regeneration**: Hosts can view, copy, or regenerate invite links at any time from the event details page.

### ✉️ 4. Frictionless Guest RSVP Flow
- **Zero-Login Guest RSVP**: Invite links allow guests to view event details and submit RSVPs (`Going`, `Maybe`, `Not Going`) without needing an account.
- **Smart Response Upserting**: Handles RSVPs dynamically via normalized email lookup (`[eventId, emailNormalized]`). Guests can submit responses or update existing responses seamlessly without creating duplicate entries.

### 📊 5. Real-Time Analytics & Guest Lists
- **Aggregate Metrics**: Command center displays live counters for total events, total responses, and breakdown by response status (`Going`, `Maybe`, `Not Going`).
- **Detailed Guest Table**: Event-specific tables listing respondent names, email addresses, color-coded status badges, and precise response timestamps.

### 🎨 6. Modern Glassmorphic UI/UX
- **Custom Theme System**: Built on Next.js 16 App Router and Tailwind CSS v4 featuring a dark aesthetic, translucent glassmorphism panels (`backdrop-blur-xl`), animated background elements, and responsive design.
- **Shadcn UI & Lucide Icons**: UI component architecture using Radix UI primitives, Lucide React icons, and utility styling (`clsx`, `tailwind-merge`, `cva`).

### 🪵 7. Structured Logging & Debugging Architecture
- **Centralized Logger Utility**: Built-in structured logging system (`lib/logger.ts`) with ISO 8601 timestamps, module context tags, severity levels, inspectable metadata, and stack trace capture.
- **Server Action & Database Observability**: Complete execution tracking across event creation, invite generation, guest RSVP submissions, authentication session checks, and Prisma database connections.
- **Safe Control Flow Handling**: Prevents error-swallowing bugs during Next.js server navigation redirects.

---

## 🛠️ Tech Stack

| Domain | Technology / Library | Description |
| :--- | :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) | App Router architecture, Server Components & Server Actions |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Type-safe code across client and server |
| **UI & Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Styling via CSS `@theme` rules & glassmorphic design system |
| **UI Components** | [Shadcn UI](https://ui.shadcn.com/) / [Radix UI](https://www.radix-ui.com/) | Accessible component primitives & design tokens |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent icons |
| **Authentication** | [Neon Auth](https://neon.tech/) (`@neondatabase/auth`) | OAuth / Magic Link user authentication & React UI bindings |
| **Database** | [Neon Postgres](https://neon.tech/) | Serverless PostgreSQL database |
| **ORM** | [Prisma ORM (v7)](https://www.prisma.io/) | Schema management & serverless database client with `@prisma/adapter-pg` |
| **Form Handling** | `react-hook-form` & `zod` | Client/Server side schema validation and form management |
| **Logging & Debugging** | Custom Logger (`lib/logger.ts`) | Structured console logging with log levels, metadata, and error tracing |

---

## 🪵 Logging & Debugging System

PlanIt implements a structured application logger in `lib/logger.ts` to simplify debugging, audit system actions, and trace runtime execution across Next.js Server Components, Server Actions, and Prisma database layers.

### Log Levels
- `logger.info(message, context, data)`: High-level operational events (e.g., event created, RSVP recorded, invite generated).
- `logger.warn(message, context, data)`: Validation failures, invalid/expired token access, unauthorized action attempts.
- `logger.error(message, context, error, data)`: Unhandled exceptions, database query failures, and runtime errors with full stack traces.
- `logger.debug(message, context, data)`: Fine-grained debugging metrics (e.g., session resolution, UI render metadata). Active in development mode or when `DEBUG=true`.

### Output Format Example
```text
[2026-08-13T17:15:30.123Z] [INFO] [EventAction] Event created successfully {
  "eventId": "a1b2c3d4-e5f6-7890-abcd-1234567890ab",
  "title": "Summer Tech Meetup",
  "ownerUserId": "user_998877",
  "hasLocation": true,
  "hasDate": true
}
```

### Monitored Contexts
| Context Tag | Target File | Description |
| :--- | :--- | :--- |
| `[EventAction]` | `lib/actions/events.ts` | Tracks event creation form submissions and database writes |
| `[InviteAction]` | `lib/actions/events.ts` | Logs magic invite token generation and upserts |
| `[RsvpAction]` | `lib/actions/events.ts` | Monitors guest RSVP submissions and response updates |
| `[EventValidation]` | `lib/actions/events.ts` | Captures title, date, or length validation issues |
| `[RsvpValidation]` | `lib/actions/events.ts` | Captures guest name, email, or status validation issues |
| `[AuthServer]` | `lib/auth/server.ts` | Audits session retrieval and authentication checks |
| `[Database]` | `lib/prisma.ts` | Traces Prisma client initialization and adapter status |
| `[DashboardUI]` | `components/dashboard-content.tsx` | Logs dashboard data rendering and event counts |
| `[EventDetailUI]` | `components/event-detail-content.tsx` | Tracks event detail page views and missing event lookups |
| `[InviteUI]` | `components/invite_rsvp_content.tsx` | Logs guest invite landing page access and expired link attempts |

---

## 🗄️ Database Architecture & Schema

The relational database model (managed via Prisma) is structured around three core entities:

```
┌─────────────────┐       1 : 1       ┌─────────────────────┐
│      Event      ├───────────────────┤     EventInvite     │
│ (ownerUserId,   │                   │ (token, eventId)    │
│  title, date)   │                   └──────────┬──────────┘
└────────┬────────┘                              │
         │                                       │
         │ 1 : N                                 │ 1 : N (Optional)
         ▼                                       ▼
┌───────────────────────────────────────────────────────────┐
│                        EventRSVP                          │
│   (eventId, name, email, emailNormalized, status)         │
└───────────────────────────────────────────────────────────┘
```

### Models:
1. **`Event`**: Stores core event information (`id`, `ownerUserId`, `title`, `description`, `location`, `eventDate`, `createdAt`, `updatedAt`). Indexed by `[ownerUserId, createdAt]`.
2. **`EventInvite`**: Stores shareable invite tokens tied to a specific event (`id`, `eventId` [Unique], `token` [Unique], `createdAt`).
3. **`EventRSVP`**: Stores individual guest responses (`id`, `eventId`, `inviteId`, `name`, `email`, `emailNormalized`, `status` (`going`, `maybe`, `notGoing`), `respondedAt`). Enforces a unique index on `[eventId, emailNormalized]`.

---

## 📁 Repository Structure

```
planit/
├── app/
│   ├── account/          # Account management pages (Neon Auth AccountView)
│   ├── auth/             # Authentication catch-all routes (Sign in, Sign up)
│   ├── dashboard/        # Host command center dashboard page
│   ├── events/
│   │   ├── [eventId]/    # Event details & guest RSVP management page
│   │   └── new/          # Event creation form page
│   ├── generated/        # Prisma client generated code
│   ├── invite/
│   │   └── [token]/      # Public guest RSVP landing page
│   ├── globals.css       # Tailwind v4 configuration (@theme, glassmorphic utility classes)
│   ├── layout.tsx        # Root layout with navbar & Neon Auth context providers
│   └── page.tsx          # Hero landing page
├── components/
│   ├── dashboard-content.tsx    # Dashboard UI & aggregate stats computation
│   ├── event-detail-content.tsx # Host event detail view & guest RSVP data table
│   ├── invite_rsvp_content.tsx  # Guest RSVP submission form component
│   ├── providers.tsx            # App level context providers
│   └── ui/                      # Shadcn UI reusable components
├── lib/
│   ├── actions/
│   │   └── events.ts     # Next.js Server Actions (create event, generate link, submit RSVP with logger)
│   ├── auth/             # Neon Auth server & client utilities (with session logging)
│   ├── logger.ts         # Centralized structured logging utility (INFO, WARN, ERROR, DEBUG)
│   └── prisma.ts         # Prisma client initialization with PostgreSQL adapter & database logging
├── prisma/
│   └── schema.prisma     # Prisma data models, enums & PostgreSQL database configuration
└── package.json          # Dependencies & npm scripts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.x or later)
- **npm** / **yarn** / **pnpm** / **bun**
- A **Neon Postgres** database instance

### Environment Setup

Create a `.env` file in the root directory and add the required environment variables:

```env
# Database Connection
DATABASE_URL="postgresql://user:password@ep-cool-db.neon.tech/neondb?sslmode=require"

# Application Base URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Neon Auth Configuration
NEON_AUTH_BASE_URL="https://auth.neon.tech/..."

# Debug Mode (Optional - set to 'true' to force DEBUG level logging in production)
DEBUG="true"
```

### Installation & Run

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```

3. **Push Database Schema**:
   ```bash
   npx prisma db push
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
