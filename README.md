# Account Team Hub

A unified collaboration surface for account management teams. Built for **Shipit62**.

Account Team Hub aggregates signals from Jira, Confluence, Slack, and meetings into a single dashboard — eliminating the "gray area" where tasks fall through the cracks because nobody owns them.

## Features

- **Portfolio View** — See all your accounts at a glance with health scores, ARR, renewal dates, attention flags, and unclaimed task counts
- **Account Hub** — Deep-dive into a single account with activity feed, Gray Area Queue, pinned Slack messages, meetings, and team roster
- **Live Jira Integration** — Gray Area Queue and stats pull real issues from a Jira Cloud project via REST API
- **Claim Tasks** — Click "Claim" on a gray area item to assign yourself and move it to "Claimed" in Jira — two-way integration
- **Real-Time Activity Ticker** — Live events appear in the activity feed with animated transitions
- **Editable Focus Areas** — Add, remove, and manage key focus areas per account
- **Editable Team Roster** — Add/remove members, inline-edit ownership roles

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS + Shadcn UI
- Framer Motion (animations)
- TanStack React Query (data fetching)
- React Router (navigation)
- Jira Cloud REST API

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Jira API access

Create a `.env.local` file in the project root:

```
VITE_JIRA_API_TOKEN=<your-base64-encoded-credentials>
```

**To generate the token value:**

1. Go to [Atlassian API Tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click **Create API token** → give it any name → copy the token
3. Base64-encode your email and token:
   ```bash
   echo -n "your-email@atlassian.com:your-api-token" | base64
   ```
4. Paste the output as the value of `VITE_JIRA_API_TOKEN`

> **Note:** The app works without this token — all UI renders with realistic fallback data. The token enables live Jira data in the Gray Area Queue, live stats, and the Claim button.

### 3. Run the dev server

```bash
npm run dev
```

The app runs at **http://localhost:8080**

## Project Structure

```
src/
├── components/
│   ├── AppShell.tsx            # Top nav + layout wrapper
│   ├── PageTransition.tsx      # Animated route transitions
│   ├── hub/
│   │   ├── HubHeader.tsx       # Account header (name, health, ARR, renewal)
│   │   ├── FocusAreasBanner.tsx # Editable focus areas
│   │   ├── StatsOverview.tsx    # Open tasks, unclaimed, P1s, meetings (Jira-powered)
│   │   ├── ActivityFeed.tsx     # Recent activity with live ticker
│   │   ├── GrayAreaQueue.tsx    # Unclaimed issues from Jira with Claim button
│   │   ├── PinnedSlackMessages.tsx
│   │   ├── RecentMeetings.tsx
│   │   ├── AccountTeam.tsx     # Editable team roster
│   │   └── BottomLinks.tsx     # Quick links to Meeting Notes, Jira, Support
│   └── ui/                     # Shadcn UI components
├── data/
│   ├── accounts.ts             # Account definitions and mock data
│   └── mockActivity.ts         # Mock activity, meetings, Slack messages
├── pages/
│   ├── Portfolio.tsx           # Portfolio overview (all accounts)
│   └── AccountHub.tsx          # Single account detail view
├── services/
│   └── jiraService.ts          # Jira REST API client (read + write)
└── App.tsx                     # Router + providers
```

## Jira Project Setup

The app connects to a Jira Cloud project called **Account Team Hub** (key: `HUB`) on `one-atlas-fnjq.atlassian.net`.

**Board columns:** Gray Area → Claimed → In Progress → Done

**Labels used:**
- `account:acme-corp`, `account:globex`, `account:umbrella-corp`, etc. — associate issues with accounts
- Issues with no assignee appear in the Gray Area Queue

## Without Jira (Fallback Mode)

If the Jira API is unavailable or unconfigured, the app gracefully falls back to:
- Hardcoded task counts from account definitions
- Static gray area items with realistic issue keys and summaries
- All UI features work normally — only live data and the Claim button are affected
