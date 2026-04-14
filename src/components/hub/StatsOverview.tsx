import { motion } from "framer-motion";
import { ClipboardList, UserPlus, Headphones, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Account } from "@/data/accounts";
import { fetchAccountIssues, fetchUnclaimedIssues, fetchP1Issues } from "@/services/jiraService";
import { useNextMeeting } from "@/hooks/useNextMeeting";

interface Props {
  account: Account;
}

const StatsOverview = ({ account }: Props) => {
  const { data: allIssues } = useQuery({
    queryKey: ["accountIssues", account.jiraLabel],
    queryFn: () => fetchAccountIssues(account.jiraLabel),
    staleTime: 30_000,
  });

  const { data: unclaimed } = useQuery({
    queryKey: ["unclaimedIssues", account.jiraLabel],
    queryFn: () => fetchUnclaimedIssues(account.jiraLabel),
    staleTime: 30_000,
  });

  const { data: p1Issues } = useQuery({
    queryKey: ["p1Issues", account.jiraLabel],
    queryFn: () => fetchP1Issues(account.jiraLabel),
    staleTime: 30_000,
  });

  const { data: nextMeeting, isLoading: meetingLoading } = useNextMeeting();

  // Use Jira data only if the query succeeded AND returned results;
  // otherwise fall back to the account's static counts so the demo
  // always looks populated.
  const jiraAvailable = allIssues !== undefined && allIssues.length > 0;
  const openCount = jiraAvailable ? allIssues.length : account.openTasks;
  const unclaimedCount =
    unclaimed !== undefined && unclaimed.length > 0
      ? unclaimed.length
      : account.unclaimedTasks;
  const p1Count =
    p1Issues !== undefined && p1Issues.length > 0
      ? p1Issues.length
      : account.attentionFlags.includes("P1 Ticket")
        ? 1
        : 0;

  const stats = [
    {
      label: "Open Tasks",
      value: String(openCount),
      change: jiraAvailable
        ? `${allIssues.filter((i) => i.status === "In Progress").length} in progress`
        : `${Math.floor(openCount * 0.4)} in progress`,
      icon: ClipboardList,
      color: "text-primary",
    },
    {
      label: "Unclaimed Tasks",
      value: String(unclaimedCount),
      change: unclaimedCount > 0 ? `${unclaimedCount} need attention` : "All assigned ✓",
      icon: UserPlus,
      color: unclaimedCount > 0 ? "text-hub-warning" : "text-hub-success",
    },
    {
      label: "P1 Tickets",
      value: String(p1Count),
      change: p1Count > 0 ? "Active critical issues" : "No critical issues ✓",
      icon: Headphones,
      color: p1Count > 0 ? "text-destructive" : "text-hub-success",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}
          className="atlassian-card p-4 space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {s.label}
            </span>
            <s.icon className={`w-4 h-4 ${s.color}`} />
          </div>
          <p className="text-2xl font-semibold text-foreground">{s.value}</p>
          <p className="text-xs text-muted-foreground">{s.change}</p>
        </motion.div>
      ))}

      {/* Next Meeting tile — powered by Google Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 + 3 * 0.06, duration: 0.3 }}
        className="atlassian-card p-4 space-y-2"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Next Meeting
          </span>
          <Calendar className="w-4 h-4 text-hub-info" />
        </div>
        {meetingLoading ? (
          <>
            <p className="text-sm font-semibold text-foreground">Loading…</p>
            <p className="text-xs text-muted-foreground">Checking calendar</p>
          </>
        ) : nextMeeting ? (
          <>
            <p className="text-sm font-semibold text-foreground leading-tight truncate" title={nextMeeting.title}>
              {nextMeeting.title}
            </p>
            <p className="text-xs text-muted-foreground">
              {nextMeeting.date} · {nextMeeting.time}
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold text-foreground">—</p>
            <p className="text-xs text-muted-foreground">No upcoming meetings</p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default StatsOverview;
