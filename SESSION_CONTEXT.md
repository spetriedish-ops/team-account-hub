# Account Team Hub — Rovo Dev Session Context

This document captures the full context of the Rovo Dev build sessions for the Account Team Hub (ShipIt 62). Future Rovo Dev sessions should read this file to understand the project history, decisions made, and current state.

**Repo:** https://github.com/spetriedish-ops/team-account-hub  
**ShipIt Ticket:** https://shipit.atlassian.net/browse/SHPLXII-294  
**Loom Submission:** https://www.loom.com/share/bb1c2dc30eaf4e32ad1ea402cbb8b7b7  
**Atlassian Site:** https://one-atlas-fnjq.atlassian.net  
**Built with:** Rovo Dev (100% of code — team has no programming background)

---

## Project Purpose

The Account Team Hub gives Atlassian account teams a single unified view of everything related to a strategic account:
- Live Jira task counts and unclaimed work
- Google Calendar next meeting
- Confluence pages filtered by account label
- Account team members with headshots and org roles
- Gray Area Queue — unowned tasks with a Claim button (writes back to Jira)
- Quick links to Meeting Notes, Jira Board, and Support Queue

**Phase 2 vision:** External Teamwork Collection product for Sales teams at customer companies.

---

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui components
- **Data fetching:** TanStack React Query (auto-refresh every 30s)
- **Animation:** Framer Motion
- **Jira integration:** Jira REST API v3 via Vite proxy (`/jira-api/*`)
- **Confluence integration:** Confluence REST API via Vite proxy (`/confluence-api/*`)
- **Google Calendar:** Google Calendar API v3 + `@react-oauth/google`
- **Product logos:** `@atlaskit/logo`

---

## Environment Variables (.env — never committed to git)

```
VITE_JIRA_API_TOKEN=<base64(email:apitoken)>  # spetrie@atlassian.com
VITE_GOOGLE_CLIENT_ID=304912227481-sd8cjeqcau35jeu1srd6cbe0t46hf2mt.apps.googleusercontent.com
```

The Jira token is Base64-encoded `email:apitoken` using `spetrie@atlassian.com`.  
All Claim actions assign tickets to this user (Sarah Petrie).

---

## Key Architectural Decisions

### Vite Proxy Pattern
All API calls go through Vite dev server proxies to avoid CORS:
- `/jira-api/*` → `https://one-atlas-fnjq.atlassian.net/*` (auth via VITE_JIRA_API_TOKEN)
- `/confluence-api/*` → `https://one-atlas-fnjq.atlassian.net/*` (same token)
- `/api/calendar/next-meeting` → Google Calendar API (auth via VITE_GOOGLE_ACCESS_TOKEN if set)

### Google Calendar OAuth — Context Provider Pattern (CRITICAL)
This was a persistent bug that crashed the page 3 times. The final fix:

**Problem:** `useGoogleLogin` from `@react-oauth/google` throws "Google OAuth components must be used within GoogleOAuthProvider" if called outside the provider, AND GoogleOAuthProvider with an empty clientId loads Google's GSI script which throws "Missing required parameter client_id".

**Solution:** React Context provider pattern in `src/hooks/useGoogleCalendar.ts` and `src/App.tsx`:
- `useGoogleCalendar()` reads from `GoogleCalendarContext` — safe anywhere
- `GoogleCalendarEnabledProvider` — calls `useGoogleCalendarEnabled()` (real OAuth); only rendered inside `GoogleOAuthProvider` when `VITE_GOOGLE_CLIENT_ID` is set
- `GoogleCalendarDisabledProvider` — calls `useGoogleCalendarDisabled()` (safe stub); rendered when unconfigured, no Google scripts load
- `App.tsx` selects the right provider at the root

**DO NOT** revert to calling `useGoogleLogin` directly in `useGoogleCalendar` — it will crash the page when no client ID is configured.

### Jira Integration
- Project key: `HUB` on `one-atlas-fnjq.atlassian.net`
- Gray Area Queue: issues with `status = "Gray Area"` and account label
- Claim button: calls `/rest/api/2/issue/{key}/assignee` then `/rest/api/2/issue/{key}/transitions` to move to "Claimed"
- High Priority Tickets: ITO project (JSM), `priority = High`, `status != Done`
- **Note:** ITO is a JSM project — the `in (...)` JQL operator times out; use `= High` instead

### Confluence Feed
- CQL: `space = "{spaceKey}" AND label = "account-team-hub" ORDER BY lastmodified DESC`
- Label: `account-team-hub` (all accounts, fixed)
- Only Umbrella Corp (space key: `UC`) is currently wired to a real space

---

## Account Data

File: `src/data/accounts.ts`

6 accounts: Acme Corp, Globex Industries, Initech, Umbrella Corp, Wayne Enterprises, Stark Industries

All show segment "Strategic" (hardcoded in UI, not from data).

**Umbrella Corp** is the primary demo account:
- `jiraLabel`: `account:umbrella-corp`
- `confluenceSpaceKey`: `UC`
- Team: Ted Lasso (AE/Sales), Coach Beard (SE/Presales), Nathan Shelley (CSM/Success), Roy Kent (SA/Presales), Rebecca Welton (SEM/Advisory Services), Keeley Jones (AM/Account Management), Jamie Tartt (CMM/Migrations)
- Headshots: `public/headshots/*.{jpg,png}`

Only Umbrella Corp has real links configured in `BottomLinks.tsx`:
- Meeting Notes: UC Confluence space meeting notes template
- Jira Board: HUB board filtered to `account:umbrella-corp`
- Support Queue: ITO custom queue 15

---

## Component Map

```
src/
├── pages/
│   ├── Portfolio.tsx          — Book of business list view
│   └── AccountHub.tsx         — Individual account page
├── components/hub/
│   ├── HubHeader.tsx          — Account page header (name, health, team member count)
│   ├── StatsOverview.tsx      — 4 stat tiles (Open Tasks, Unclaimed, High Priority, Next Meeting)
│   ├── GrayAreaQueue.tsx      — Live unowned Jira tasks with Claim button
│   ├── ConfluenceFeed.tsx     — Confluence pages filtered by account-team-hub label
│   ├── AccountTeam.tsx        — Team member cards with headshots/initials
│   ├── ActivityFeed.tsx       — Mock activity feed with Atlaskit product logos
│   ├── BottomLinks.tsx        — Meeting Notes, Jira Board, Support Queue lozenges
│   └── RecentMeetings.tsx     — Legacy component (UNUSED — replaced by ConfluenceFeed)
├── services/
│   ├── jiraService.ts         — All Jira API calls (fetch issues, claim, assign)
│   ├── confluenceService.ts   — Confluence CQL search
│   ├── calendarService.ts     — Google Calendar proxy service (legacy)
│   └── googleCalendarService.ts — Direct Google Calendar API calls (OAuth)
├── hooks/
│   ├── useGoogleCalendar.ts   — Context-based Google Calendar hook (see arch note above)
│   ├── useNextMeeting.ts      — React Query wrapper for calendar proxy
│   ├── useConfluenceFeed.ts   — React Query wrapper for Confluence feed
│   └── use-mobile.tsx         — Responsive breakpoint hook
├── data/
│   ├── accounts.ts            — Account data + TeamMember type
│   └── mockActivity.ts        — Mock activity feed and Slack messages data
└── App.tsx                    — Root — GoogleOAuthProvider conditional, React Query setup
```

---

## Mock Data (src/data/mockActivity.ts)

Umbrella Corp entries use Ted Lasso cast names:
- Activity Feed: Ted Lasso (Loom, Slack), Roy Kent (Jira critical, Slack rollback), Nathan Shelley (Jira security, Slack remediation), Coach Beard (Confluence postmortem)
- Pinned Slack Messages: Ted Lasso, Nathan Shelley, Roy Kent

---

## Jira Project: HUB

**Statuses used:**
- `Gray Area` — unclaimed/unowned tasks (= Unclaimed Tasks tile)
- `Claimed` — assigned and being worked
- `In Progress` — actively in progress
- `Done` — completed

**Labels:** `account:umbrella-corp`, `account:acme-corp`, `account:globex`, `account:initech`, `account:wayne`, `account:stark`

**Claim flow:**
1. `PUT /rest/api/2/issue/{key}/assignee` — assigns to current API user
2. `POST /rest/api/2/issue/{key}/transitions` — moves to "Claimed" status

---

## ITO Project (JSM — Support Queue)

- Full name: IT Operations
- Used for High Priority Tickets tile
- JQL: `project = ITO AND status != Done AND priority = High`
- **Important:** Use `= High` not `in (Highest, High, Critical)` — the `in` operator times out on JSM projects
- Priority values in ITO: `High` and `Medium` only (no Highest/Critical)
- Queue URL: https://one-atlas-fnjq.atlassian.net/jira/servicedesk/projects/ITO/queues/custom/15

---

## Known Limitations / Future Work

1. **Dynamic Claim assignment** — Currently always assigns to `spetrie@atlassian.com` (the API token user). Discussed "Assign to" dropdown scoped to account team — deferred post-ShipIt.
2. **Confluence spaces for other accounts** — Only Umbrella Corp (UC) is wired. Others have placeholder keys: ACME, GLOBEX, INITECH, WAYNE, STARK.
3. **Google Calendar** — OAuth flow is live. Client ID: `304912227481-sd8cjeqcau35jeu1srd6cbe0t46hf2mt.apps.googleusercontent.com`. Requires `http://localhost:8080` in authorized JS origins.
4. **Google Calendar proxy** — `vite.config.ts` has a `googleCalendarApi` plugin for `VITE_GOOGLE_ACCESS_TOKEN` (server-side token approach, legacy). The OAuth approach is preferred.
5. **Jira write API** — Uses a separate `jiraWriteApi` Vite plugin for CORS-sensitive write operations (assign, transition).
6. **No error boundary** — A crash in any component can blank the page. Consider adding React Error Boundaries.
7. **RecentMeetings.tsx** — Old component still exists but is not used. Can be deleted.

---

## Dev Server

```bash
cd team-account-hub
npm run dev        # starts on http://localhost:8080
```

Vite proxies handle all API calls. The `.env` file must be present with `VITE_JIRA_API_TOKEN`.

---

## Confluence Pages (hello.atlassian.net — personal space)

- [ShipIt 62 Account Team Hub (parent)](https://hello.atlassian.net/wiki/spaces/~71202092255b7fb59645d3bbea2a3ae2c64183/pages/6794740179)
- [Build Progress Report — Apr 15](https://hello.atlassian.net/wiki/spaces/~71202092255b7fb59645d3bbea2a3ae2c64183/pages/6830642715)
- [Build Progress Report — Apr 16](https://hello.atlassian.net/wiki/spaces/~71202092255b7fb59645d3bbea2a3ae2c64183/pages/6841098002)
- [Demo Script & Flow Options](https://hello.atlassian.net/wiki/spaces/~71202092255b7fb59645d3bbea2a3ae2c64183/pages/6845137980)
- [Final Progress Report — Apr 14-18](https://hello.atlassian.net/wiki/spaces/~71202092255b7fb59645d3bbea2a3ae2c64183/pages/6794740179)

---

## ShipIt 62 Submission

- **Award category:** Innovation Award
- **Loom:** https://www.loom.com/share/bb1c2dc30eaf4e32ad1ea402cbb8b7b7 (2:00)
- **Key messages:**
  - "I was annoyed it didn't exist, so I prompted it into existence" — Peter Steinberger (OpenClaw)
  - No engineering backgrounds on the team — built entirely with Rovo Dev
  - Phase 2: external Teamwork Collection product to help sell into Sales teams
