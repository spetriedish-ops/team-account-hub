import { motion } from "framer-motion";
import { FileText, LayoutGrid, Headphones, ExternalLink } from "lucide-react";
import type { Account } from "@/data/accounts";

interface Props {
  account: Account;
}

// Per-account link overrides — add entries here as accounts get real URLs.
// Falls back to "#" for any account not listed.
const ACCOUNT_LINKS: Record<
  string,
  { meetingNotes?: string; jiraBoard?: string; supportQueue?: string }
> = {
  "account:umbrella-corp": {
    meetingNotes:
      "https://one-atlas-fnjq.atlassian.net/wiki/spaces/UC/pages/11436345/Template+-+Meeting+notes",
    jiraBoard:
      "https://one-atlas-fnjq.atlassian.net/jira/core/projects/HUB/board?filter=labels+%3D+%22account%3Aumbrella-corp%22&groupBy=status&atlOrigin=eyJpIjoiNTU2OGQ3OTM5YTJhNDdjNDkyNjgzM2Q3MzU0Y2Q3ODciLCJwIjoiaiJ9",
  },
};

const BottomLinks = ({ account }: Props) => {
  const overrides = ACCOUNT_LINKS[account.jiraLabel] ?? {};

  const links = [
    {
      label: "Meeting Notes",
      description: "Access shared meeting notes and action items",
      icon: FileText,
      href: overrides.meetingNotes ?? "#",
    },
    {
      label: "Jira Board",
      description: "View the account Jira board and backlog",
      icon: LayoutGrid,
      href: overrides.jiraBoard ?? "#",
    },
    {
      label: "Support Queue",
      description: "Monitor open support tickets and SLAs",
      icon: Headphones,
      href: overrides.supportQueue ?? "#",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
    >
      {links.map((link, i) => (
        <motion.a
          key={link.label}
          href={link.href}
          target={link.href !== "#" ? "_blank" : undefined}
          rel={link.href !== "#" ? "noopener noreferrer" : undefined}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + i * 0.05 }}
          className="atlassian-card-interactive p-4 flex items-start gap-3 group cursor-pointer"
        >
          <div className="p-2 rounded bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
            <link.icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-medium text-foreground">{link.label}</p>
              <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{link.description}</p>
          </div>
        </motion.a>
      ))}
    </motion.div>
  );
};

export default BottomLinks;
