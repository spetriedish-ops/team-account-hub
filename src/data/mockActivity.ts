export interface ActivityItem {
  type: "confluence" | "jira" | "meeting" | "slack" | "support";
  title: string;
  time: string;
  icon: string;
  user?: string;
}

export const MOCK_ACTIVITIES: Record<string, ActivityItem[]> = {
  "account:acme-corp": [
    { type: "jira", title: "P1 Issue Escalated — Database Connection Timeout", time: "2 hours ago", icon: "🔴", user: "Alex Rodriguez" },
    { type: "confluence", title: "Implementation Guide Updated", time: "4 hours ago", icon: "📄", user: "Sarah Chen" },
    { type: "meeting", title: "Executive Steering Committee Scheduled", time: "1 day ago", icon: "📅", user: "Mike Johnson" },
    { type: "slack", title: "Pinned key architecture decision doc in #acme-strategy", time: "2 days ago", icon: "📌", user: "Alex Rodriguez" },
    { type: "jira", title: "5 tasks moved to In Progress", time: "3 days ago", icon: "🔄", user: "Sarah Chen" },
    { type: "support", title: "API rate limiting ticket opened", time: "3 days ago", icon: "🎫", user: "Support Team" },
  ],
  "account:globex": [
    { type: "confluence", title: "APAC Deployment Architecture Doc Published", time: "1 hour ago", icon: "📄", user: "Emma Wilson" },
    { type: "meeting", title: "QBR Prep Sync Completed", time: "3 hours ago", icon: "📅", user: "Jessica Liu" },
    { type: "jira", title: "Advanced analytics demo — marked Done", time: "1 day ago", icon: "✅", user: "David Park" },
    { type: "slack", title: "Customer shared positive NPS feedback", time: "2 days ago", icon: "🎉", user: "David Park" },
  ],
  "account:initech": [
    { type: "jira", title: "Legacy system integration scoping started", time: "5 hours ago", icon: "🔧", user: "Tom Brady" },
    { type: "support", title: "Data export compliance request opened", time: "1 day ago", icon: "🎫", user: "Lisa Martinez" },
    { type: "confluence", title: "Integration requirements doc drafted", time: "2 days ago", icon: "📄", user: "Tom Brady" },
  ],
  "account:umbrella-corp": [
    { type: "jira", title: "CRITICAL: Data migration failure — rollback initiated", time: "1 hour ago", icon: "🔴", user: "Christopher Lee" },
    { type: "jira", title: "Security audit findings escalated to leadership", time: "3 hours ago", icon: "🔴", user: "Patricia Evans" },
    { type: "support", title: "SLA breach reported — 4 tickets exceeded response time", time: "6 hours ago", icon: "⚠️", user: "Support Team" },
    { type: "meeting", title: "Emergency account review scheduled", time: "1 day ago", icon: "📅", user: "Robert Zhang" },
    { type: "slack", title: "Customer CTO expressed frustration in exec channel", time: "1 day ago", icon: "😟", user: "Robert Zhang" },
    { type: "jira", title: "Training program — no DRI assigned yet", time: "2 days ago", icon: "🔄", user: "Patricia Evans" },
    { type: "confluence", title: "Incident postmortem template created", time: "3 days ago", icon: "📄", user: "Christopher Lee" },
  ],
  "account:wayne": [
    { type: "jira", title: "Custom dashboard templates — scoping in progress", time: "4 hours ago", icon: "🔧", user: "Bruce Wayne" },
    { type: "meeting", title: "Bi-weekly sync completed", time: "1 day ago", icon: "📅", user: "Alfred Pennyworth" },
    { type: "confluence", title: "Reporting requirements captured", time: "3 days ago", icon: "📄", user: "Alfred Pennyworth" },
  ],
  "account:stark": [
    { type: "jira", title: "AI integration roadmap — phase 1 completed ✅", time: "2 hours ago", icon: "✅", user: "James Rhodes" },
    { type: "confluence", title: "Multi-region compliance doc in review", time: "1 day ago", icon: "📄", user: "James Rhodes" },
    { type: "meeting", title: "Innovation workshop scheduled for next week", time: "1 day ago", icon: "📅", user: "Tony Stark" },
    { type: "slack", title: "Customer shared Rovo success story internally", time: "3 days ago", icon: "🎉", user: "Pepper Potts" },
  ],
};

export const MOCK_MEETINGS: Record<string, { date: string; title: string; hasNotes: boolean }[]> = {
  "account:acme-corp": [
    { date: "2026-04-03", title: "Executive Steering Committee", hasNotes: true },
    { date: "2026-04-01", title: "Implementation Review", hasNotes: true },
    { date: "2026-03-28", title: "Quarterly Business Review", hasNotes: false },
    { date: "2026-03-21", title: "Technical Architecture Discussion", hasNotes: true },
    { date: "2026-03-15", title: "Onboarding Kickoff", hasNotes: false },
  ],
  "account:globex": [
    { date: "2026-04-02", title: "QBR Prep Sync", hasNotes: true },
    { date: "2026-03-26", title: "APAC Expansion Planning", hasNotes: true },
    { date: "2026-03-19", title: "Analytics Demo", hasNotes: true },
  ],
  "account:umbrella-corp": [
    { date: "2026-04-04", title: "Emergency Account Review", hasNotes: false },
    { date: "2026-03-20", title: "Security Audit Debrief", hasNotes: true },
    { date: "2026-02-28", title: "Quarterly Check-in", hasNotes: true },
  ],
  "account:initech": [
    { date: "2026-03-15", title: "Integration Scoping Call", hasNotes: true },
    { date: "2026-03-01", title: "Account Health Review", hasNotes: true },
  ],
  "account:wayne": [
    { date: "2026-04-01", title: "Bi-weekly Sync", hasNotes: true },
    { date: "2026-03-18", title: "Dashboard Requirements Workshop", hasNotes: true },
  ],
  "account:stark": [
    { date: "2026-04-03", title: "AI Roadmap Review", hasNotes: true },
    { date: "2026-03-27", title: "Multi-region Architecture Session", hasNotes: true },
    { date: "2026-03-13", title: "Innovation Workshop", hasNotes: true },
  ],
};

export const MOCK_PINNED_MESSAGES: Record<string, { author: string; timestamp: string; text: string; channel: string }[]> = {
  "account:acme-corp": [
    { author: "Sarah Chen", timestamp: "2 days ago", text: "Final deck for the exec onsite is ready — please review by EOD Thursday.", channel: "#acme-strategy" },
    { author: "Mike Johnson", timestamp: "1 week ago", text: "Please review the updated implementation timeline before Friday's call.", channel: "#acme-support" },
    { author: "Alex Rodriguez", timestamp: "1 week ago", text: "🎉 Successfully deployed to staging! Performance metrics looking excellent.", channel: "#acme-technical" },
  ],
  "account:globex": [
    { author: "Jessica Liu", timestamp: "1 day ago", text: "APAC expansion approved by customer's board — moving to phase 2.", channel: "#globex-strategy" },
    { author: "Emma Wilson", timestamp: "3 days ago", text: "Architecture review for multi-region complete. No blockers.", channel: "#globex-technical" },
  ],
  "account:umbrella-corp": [
    { author: "Robert Zhang", timestamp: "1 day ago", text: "⚠️ Customer CTO escalated migration failure directly to our VP. All hands on deck.", channel: "#umbrella-escalation" },
    { author: "Patricia Evans", timestamp: "2 days ago", text: "Security audit remediation plan drafted — needs review ASAP.", channel: "#umbrella-support" },
    { author: "Christopher Lee", timestamp: "3 days ago", text: "Rollback complete. Production stable but 3 workflows still degraded.", channel: "#umbrella-technical" },
  ],
  "account:initech": [
    { author: "Tom Brady", timestamp: "3 days ago", text: "Legacy system API docs received from customer. Starting integration scoping.", channel: "#initech-general" },
  ],
  "account:wayne": [
    { author: "Alfred Pennyworth", timestamp: "2 days ago", text: "Dashboard mockups approved by customer VP. Moving to build phase.", channel: "#wayne-general" },
  ],
  "account:stark": [
    { author: "Tony Stark", timestamp: "1 day ago", text: "Phase 1 AI integration demo was a hit! Customer wants to accelerate phase 2.", channel: "#stark-strategy" },
    { author: "James Rhodes", timestamp: "3 days ago", text: "EU compliance documentation submitted. Awaiting legal review.", channel: "#stark-technical" },
  ],
};
