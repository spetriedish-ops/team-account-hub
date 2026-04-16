export interface TeamMember {
  role: string;
  name: string;
  owns: string;
  avatar: string;
  /** Optional path to a headshot image (relative to /public) */
  avatarUrl?: string;
}

export interface Account {
  id: number;
  name: string;
  tier: "Enterprise" | "Mid-Market" | "Growth";
  arr: string;
  health: "Strong" | "Good" | "At Risk" | "Critical";
  renewalDate: string;
  openTasks: number;
  unclaimedTasks: number;
  lastMeeting: string;
  attentionFlags: string[];
  keyFocusAreas: string[];
  team: TeamMember[];
  jiraLabel: string;
  /** Confluence space key for this account's pages feed */
  confluenceSpaceKey: string;
}

export const ACCOUNTS: Account[] = [
  {
    id: 1,
    name: "Acme Corp",
    tier: "Enterprise",
    arr: "$2.5M",
    health: "At Risk",
    renewalDate: "2026-06-15",
    openTasks: 12,
    unclaimedTasks: 4,
    lastMeeting: "2026-03-28",
    attentionFlags: ["P1 Ticket", "Unclaimed Tasks"],
    keyFocusAreas: [
      "Reduce implementation timeline",
      "Optimize user adoption",
      "Executive onsite prep",
    ],
    team: [
      { role: "AE", name: "Sarah Chen", owns: "Growth", avatar: "SC" },
      { role: "CSM", name: "Mike Johnson", owns: "Health", avatar: "MJ" },
      { role: "SE", name: "Alex Rodriguez", owns: "Technical", avatar: "AR" },
    ],
    jiraLabel: "account:acme-corp",
    confluenceSpaceKey: "ACME",
  },
  {
    id: 2,
    name: "Globex Industries",
    tier: "Enterprise",
    arr: "$3.2M",
    health: "Strong",
    renewalDate: "2026-12-01",
    openTasks: 3,
    unclaimedTasks: 0,
    lastMeeting: "2026-04-02",
    attentionFlags: [],
    keyFocusAreas: [
      "Expand to APAC region",
      "Implement advanced analytics",
    ],
    team: [
      { role: "AE", name: "Jessica Liu", owns: "Expansion", avatar: "JL" },
      { role: "CSM", name: "David Park", owns: "Success", avatar: "DP" },
      { role: "SE", name: "Emma Wilson", owns: "Architecture", avatar: "EW" },
    ],
    jiraLabel: "account:globex",
    confluenceSpaceKey: "GLOBEX",
  },
  {
    id: 3,
    name: "Initech",
    tier: "Mid-Market",
    arr: "$850K",
    health: "Good",
    renewalDate: "2026-08-22",
    openTasks: 7,
    unclaimedTasks: 2,
    lastMeeting: "2026-03-15",
    attentionFlags: ["Unclaimed Tasks"],
    keyFocusAreas: ["Integrate with legacy systems"],
    team: [
      { role: "AE", name: "Tom Brady", owns: "Account", avatar: "TB" },
      { role: "CSM", name: "Lisa Martinez", owns: "Operations", avatar: "LM" },
    ],
    jiraLabel: "account:initech",
    confluenceSpaceKey: "INITECH",
  },
  {
    id: 4,
    name: "Umbrella Corp",
    tier: "Enterprise",
    arr: "$4.1M",
    health: "Critical",
    renewalDate: "2026-05-10",
    openTasks: 18,
    unclaimedTasks: 8,
    lastMeeting: "2026-02-28",
    attentionFlags: [
      "P1 Ticket",
      "P2 Tickets",
      "Unclaimed Tasks",
      "Renewal Risk",
    ],
    keyFocusAreas: [
      "Critical infrastructure upgrade",
      "Team training program",
      "Support SLA improvement",
    ],
    team: [
      {
        role: "AE",
        name: "Ted Lasso",
        owns: "Strategic",
        avatar: "TL",
        avatarUrl: "/headshots/ted-lasso.jpg",
      },
      {
        role: "SE",
        name: "Coach Beard",
        owns: "Technical",
        avatar: "CB",
        avatarUrl: "/headshots/coach-beard.png",
      },
      {
        role: "CSM",
        name: "Nathan Shelley",
        owns: "Adoption",
        avatar: "NS",
        avatarUrl: "/headshots/nathan-shelley.png",
      },
      {
        role: "SA",
        name: "Roy Kent",
        owns: "Architecture",
        avatar: "RK",
        avatarUrl: "/headshots/roy-kent.png",
      },
      {
        role: "SEM",
        name: "Rebecca Welton",
        owns: "Executive",
        avatar: "RW",
        avatarUrl: "/headshots/rebecca-welton.png",
      },
    ],
    jiraLabel: "account:umbrella-corp",
    confluenceSpaceKey: "UC",
  },
  {
    id: 5,
    name: "Wayne Enterprises",
    tier: "Enterprise",
    arr: "$1.8M",
    health: "Good",
    renewalDate: "2026-10-05",
    openTasks: 5,
    unclaimedTasks: 1,
    lastMeeting: "2026-04-01",
    attentionFlags: [],
    keyFocusAreas: ["Enhance reporting capabilities"],
    team: [
      { role: "AE", name: "Bruce Wayne", owns: "Enterprise", avatar: "BW" },
      {
        role: "CSM",
        name: "Alfred Pennyworth",
        owns: "Support",
        avatar: "AP",
      },
    ],
    jiraLabel: "account:wayne",
    confluenceSpaceKey: "WAYNE",
  },
  {
    id: 6,
    name: "Stark Industries",
    tier: "Enterprise",
    arr: "$5.2M",
    health: "Strong",
    renewalDate: "2026-11-15",
    openTasks: 2,
    unclaimedTasks: 0,
    lastMeeting: "2026-04-03",
    attentionFlags: [],
    keyFocusAreas: ["AI integration roadmap", "Multi-region deployment"],
    team: [
      { role: "AE", name: "Tony Stark", owns: "Innovation", avatar: "TS" },
      { role: "CSM", name: "Pepper Potts", owns: "Executive", avatar: "PP" },
      {
        role: "SE",
        name: "James Rhodes",
        owns: "Military Grade",
        avatar: "JR",
      },
    ],
    jiraLabel: "account:stark",
    confluenceSpaceKey: "STARK",
  },
];

export function getAccountById(id: number): Account | undefined {
  return ACCOUNTS.find((a) => a.id === id);
}
