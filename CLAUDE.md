# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm run lint     # ESLint
```

No test framework is configured.

## Architecture

### Routing & Pages
Next.js App Router. Pages: `/` (home), `/programs`, `/pricing`, `/schedule`, `/contact`, `/dashboard` (parent), `/admin`.

### State Management
All mutable state lives in `src/context/ParentContext.tsx` — a single React context that covers children, bookings, training cards, sessions, coaches, and fields. Components consume it via `useParent()`.

Persistence is handled in `src/lib/storage.ts` using a single localStorage key (`sevenAcademyState`). On first load (or after reset), defaults are hydrated from `src/data/parent.ts` plus coaches/fields extracted from `src/data/schedule.ts`. The context exposes a `resetToDefaults()` for dev use.

### Admin Dashboard
`src/components/admin/AdminShell.tsx` is a tab switcher with five tabs (Sessions, Bookings, Children, Coaches, Fields). Each tab renders a dedicated table component. Session creation/editing uses `SessionModal`; session detail viewing uses `SessionDetailsModal`.

### Styling
Tailwind v4 — **no `tailwind.config.ts`**. All custom design tokens are declared in `src/app/globals.css` under `@theme {}`. Do not create a config file; add new tokens directly in `globals.css`.

The site is RTL Hebrew. `<html lang="he" dir="rtl">` is set in `src/app/layout.tsx`. Font: Heebo via `next/font/google`.

Key color tokens: `navy` (#0d1b2a), `green` (#00c853), `gold` (#c9a84c), `pitch` (#070d17), `light` (#f5f7fa).

### Path Aliases
`@/*` maps to `src/*`.

## Business Context
Seven Academy is a youth football training academy. The payment model is a **10-session training card** with 3-month validity — no subscriptions. There is no auth or payment integration in this MVP.

Content is in Hebrew; component and variable names are in English.


## Product Purpose

Seven Academy is a youth football training academy management system.

The platform supports two main user roles:

### Parents
Parents can:
- register their children
- purchase training cards
- book training sessions
- cancel bookings
- track remaining sessions on the training card

### Admin
The admin manages the academy operations:
- create and manage training sessions
- manage coaches
- manage fields
- manage children
- monitor bookings

This project is currently an MVP without backend or authentication.

All data is stored client-side using React context and persisted in localStorage.


## Data Model

Core entities in the system:

### Child
Represents a player registered by a parent.

Fields:
- id
- name
- birthYear
- parentName

### Training Card
A prepaid card used for booking sessions.

Fields:
- childId
- totalSessions (10)
- usedSessions
- remainingSessions
- expiryDate
- status

### Session
Represents a specific training event.

Fields:
- id
- title
- date
- time
- coachId
- fieldId
- birthYear
- capacity

### Booking
Represents a child's registration to a specific session.

Fields:
- id
- childId
- sessionId
- status


## Business Rules

Training bookings follow these rules:

1. A child can only book a session if:
   - they have an active training card
   - remainingSessions > 0
   - the session birthYear matches the child birthYear
   - the session is not full

2. Booking a session:
   - decreases remainingSessions by 1
   - increases usedSessions by 1

3. Canceling a booking:
   - restores the session to the training card balance

4. Sessions are date-specific (not only weekday-based).

5. Admin actions immediately affect the parent-facing app.

6. All application state is managed inside `ParentContext` and persisted to localStorage.


## Development Guidelines

This project is intentionally built without a backend for MVP speed.

Important constraints:

- Do not introduce server APIs or database integrations.
- All new features must work with the existing React context state.
- Maintain compatibility with the current localStorage persistence.
- Keep the UI RTL and Hebrew-first.