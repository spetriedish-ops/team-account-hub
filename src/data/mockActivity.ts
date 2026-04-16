export interface ActivityItem {
  type: "confluence" | "jira" | "meeting" | "slack" | "support" | "loom";
  title: string;
  time: string;
  icon: string;
  user?: string;
  url?: string;
}

export const MOCK_ACTIVITIES: Record<string, ActivityItem[]> = {
  "account:acme-corp": [
    { type: "jira",       title: "P1: SSO login failure affecting 200+ users",                    time: "1 hour ago",   icon: "", user: "Alex Rodriguez",   url: "https://one-atlas-fnjq.atlassian.net/browse/HUB-42" },
    { type: "loom",       title: "Acme Corp — Executive Onsite Recap & Next Steps",               time: "3 hours ago",  icon: "", user: "Sarah Chen",        url: "https://www.loom.com/share/demo-acme-onsite" },
    { type: "confluence", title: "Acme Implementation Runbook v2.1 — Published",                  time: "5 hours ago",  icon: "", user: "Sarah Chen",        url: "https://one-atlas-fnjq.atlassian.net/wiki" },
    { type: "slack",      title: "Pinned: 'Final exec deck ready for review by EOD Thursday'",    time: "1 day ago",    icon: "", user: "Mike Johnson",      url: "" },
    { type: "support",    title: "JSM ticket: API rate limiting impacting bulk imports",           time: "2 days ago",   icon: "", user: "Support Team",      url: "https://one-atlas-fnjq.atlassian.net/browse/HUB-38" },
    { type: "jira",       title: "5 tasks moved to In Progress in Q2 Delivery Board",             time: "3 days ago",   icon: "", user: "Sarah Chen",        url: "https://one-atlas-fnjq.atlassian.net/browse/HUB-35" },
  ],
  "account:globex": [
    { type: "confluence", title: "APAC Multi-Region Deployment Architecture — Published",         time: "1 hour ago",   icon: "", user: "Emma Wilson",       url: "https://one-atlas-fnjq.atlassian.net/wiki" },
    { type: "loom",       title: "Globex QBR Prep — Walkthrough of Analytics Roadmap",            time: "4 hours ago",  icon: "", user: "Jessica Liu",       url: "https://www.loom.com/share/demo-globex-qbr" },
    { type: "jira",       title: "Advanced analytics dashboard demo — marked Done",               time: "1 day ago",    icon: "", user: "David Park",        url: "https://one-atlas-fnjq.atlassian.net/browse/HUB-29" },
    { type: "slack",      title: "Pinned: 'APAC expansion approved by customer board 🎉'",        time: "2 days ago",   icon: "", user: "David Park",        url: "" },
    { type: "support",    title: "JSM: Data residency query from customer legal team",            time: "3 days ago",   icon: "", user: "Support Team",      url: "https://one-atlas-fnjq.atlassian.net/browse/HUB-27" },
  ],
  "account:initech": [
    { type: "jira",       title: "Legacy ERP integration scoping — In Progress",                  time: "5 hours ago",  icon: "", user: "Tom Brady",         url: "https://one-atlas-fnjq.atlassian.net/browse/HUB-55" },
    { type: "loom",       title: "Initech Integration Architecture — Technical Walkthrough",       time: "1 day ago",    icon: "", user: "Tom Brady",         url: "https://www.loom.com/share/demo-initech-arch" },
    { type: "support",    title: "JSM: Data export compliance request — GDPR Article 20",        time: "1 day ago",    icon: "", user: "Support Team",      url: "https://one-atlas-fnjq.atlassian.net/browse/HUB-52" },
    { type: "confluence", title: "Integration requirements & API mapping doc — Drafted",          time: "2 days ago",   icon: "", user: "Lisa Martinez",     url: "https://one-atlas-fnjq.atlassian.net/wiki" },
    { type: "slack",      title: "Pinned: 'Legacy API docs received — starting scoping'",        time: "3 days ago",   icon: "", user: "Tom Brady",         url: "" },
  ],
  "account:umbrella-corp": [
    { type: "jira",       title: "CRITICAL: Data migration failure — rollback in progress",       time: "45 min ago",   icon: "", user: "Roy Kent",          url: "https://one-atlas-fnjq.atlassian.net/browse/HUB-71" },
    { type: "support",    title: "JSM: SLA breach — 4 tickets exceeded response SLA",            time: "2 hours ago",  icon: "", user: "Support Team",      url: "https://one-atlas-fnjq.atlassian.net/browse/HUB-70" },
    { type: "loom",       title: "Umbrella Corp — Incident Review & Remediation Plan",            time: "4 hours ago",  icon: "", user: "Ted Lasso",         url: "https://www.loom.com/share/demo-umbrella-incident" },
    { type: "jira",       title: "Security audit findings escalated to VP Engineering",           time: "6 hours ago",  icon: "", user: "Nathan Shelley",    url: "https://one-atlas-fnjq.atlassian.net/browse/HUB-68" },
    { type: "slack",      title: "Pinned: '⚠️ CTO escalated to our VP — all hands needed'",     time: "1 day ago",    icon: "", user: "Ted Lasso",         url: "" },
    { type: "confluence", title: "Incident postmortem template — In Review",                     time: "2 days ago",   icon: "", user: "Coach Beard",       url: "https://one-atlas-fnjq.atlassian.net/wiki" },
  ],
  "account:wayne": [
    { type: "loom",       title: "Wayne Enterprises — Dashboard Mockup Walkthrough",              time: "2 hours ago",  icon: "", user: "Alfred Pennyworth", url: "https://www.loom.com/share/demo-wayne-dashboard" },
    { type: "jira",       title: "Custom executive dashboard templates — scoping kicked off",      time: "4 hours ago",  icon: "", user: "Bruce Wayne",       url: "https://one-atlas-fnjq.atlassian.net/browse/HUB-61" },
    { type: "slack",      title: "Pinned: 'Dashboard mockups approved by customer VP ✅'",        time: "1 day ago",    icon: "", user: "Alfred Pennyworth", url: "" },
    { type: "confluence", title: "Reporting & Analytics requirements — Captured",                 time: "2 days ago",   icon: "", user: "Alfred Pennyworth", url: "https://one-atlas-fnjq.atlassian.net/wiki" },
    { type: "support",    title: "JSM: SSO SAML configuration assistance requested",              time: "3 days ago",   icon: "", user: "Support Team",      url: "https://one-atlas-fnjq.atlassian.net/browse/HUB-58" },
  ],
  "account:stark": [
    { type: "jira",       title: "AI + Rovo integration — Phase 1 shipped ✅",                   time: "2 hours ago",  icon: "", user: "James Rhodes",      url: "https://one-atlas-fnjq.atlassian.net/browse/HUB-81" },
    { type: "loom",       title: "Stark Industries — Rovo AI Demo for Executive Sponsors",        time: "5 hours ago",  icon: "", user: "Tony Stark",        url: "https://www.loom.com/share/demo-stark-rovo" },
    { type: "confluence", title: "Multi-region compliance & data residency — In Review",          time: "1 day ago",    icon: "", user: "James Rhodes",      url: "https://one-atlas-fnjq.atlassian.net/wiki" },
    { type: "slack",      title: "Pinned: 'Phase 1 AI demo was a hit — accelerating Phase 2'",  time: "1 day ago",    icon: "", user: "Pepper Potts",      url: "" },
    { type: "jira",       title: "EU AI Act compliance checklist — 3 items flagged",              time: "2 days ago",   icon: "", user: "James Rhodes",      url: "https://one-atlas-fnjq.atlassian.net/browse/HUB-79" },
    { type: "support",    title: "JSM: Rovo agent permissions scoping for enterprise tier",       time: "3 days ago",   icon: "", user: "Support Team",      url: "https://one-atlas-fnjq.atlassian.net/browse/HUB-77" },
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
    { author: "Ted Lasso", timestamp: "1 day ago", text: "⚠️ Customer CTO escalated migration failure directly to our VP. All hands on deck.", channel: "#umbrella-escalation" },
    { author: "Nathan Shelley", timestamp: "2 days ago", text: "Security audit remediation plan drafted — needs review ASAP.", channel: "#umbrella-support" },
    { author: "Roy Kent", timestamp: "3 days ago", text: "Rollback complete. Production stable but 3 workflows still degraded.", channel: "#umbrella-technical" },
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
