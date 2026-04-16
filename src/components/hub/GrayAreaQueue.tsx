import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  Clock,
  User,
  ExternalLink,
  Loader2,
  Hand,
  Check,
  ArrowRight,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Account } from "@/data/accounts";
import {
  fetchGrayAreaIssues,
  claimIssue,
  transitionIssue,
  type JiraIssue,
} from "@/services/jiraService";

const priorityBg: Record<string, string> = {
  Highest: "bg-destructive/10 text-destructive",
  High: "bg-destructive/10 text-destructive",
  Medium: "bg-hub-warning/10 text-hub-warning",
  Low: "bg-muted text-muted-foreground",
  Lowest: "bg-muted text-muted-foreground",
};

interface Props {
  account: Account;
}

type FallbackItem = {
  key: string;
  summary: string;
  priority: string;
  assignee: string | null;
  created: string;
};

const GrayAreaQueue = ({ account }: Props) => {
  const queryClient = useQueryClient();
  const [claimingKey, setClaimingKey] = useState<string | null>(null);
  const [claimedKeys, setClaimedKeys] = useState<Set<string>>(new Set());

  const { data: issues, isLoading } = useQuery({
    queryKey: ["grayAreaIssues", account.jiraLabel],
    queryFn: () => fetchGrayAreaIssues(account.jiraLabel),
    staleTime: 30_000,
    refetchInterval: 30_000,
  });

  // Fallback mock data if Jira unavailable — account-specific
  const fallbackMap: Record<string, FallbackItem[]> = {
    "account:acme-corp": [
      { key: "HUB-2", summary: "Resolve licensing discrepancy on Enterprise tier", priority: "High", assignee: null, created: "2026-04-10" },
      { key: "HUB-1", summary: "Custom integration request from VP Engineering", priority: "Medium", assignee: null, created: "2026-04-09" },
      { key: "HUB-5", summary: "Unclear ownership of analytics dashboard rollout", priority: "High", assignee: null, created: "2026-04-08" },
    ],
    "account:umbrella-corp": [
      { key: "HUB-11", summary: "Team training program — no DRI assigned", priority: "High", assignee: null, created: "2026-04-07" },
      { key: "HUB-13", summary: "Contract amendment for infrastructure upgrade — legal review pending", priority: "High", assignee: null, created: "2026-04-06" },
    ],
    "account:initech": [
      { key: "HUB-15", summary: "Data export request — compliance requirement", priority: "Medium", assignee: null, created: "2026-04-05" },
    ],
  };
  const fallbackItems: FallbackItem[] = fallbackMap[account.jiraLabel] ?? [];

  const displayItems: (JiraIssue | FallbackItem)[] =
    issues && issues.length > 0 ? issues : fallbackItems;
  const isLive = issues && issues.length > 0;

  const handleClaim = async (issueKey: string) => {
    setClaimingKey(issueKey);
    try {
      const assigned = await claimIssue(issueKey);
      if (!assigned) {
        toast.error(`Failed to assign ${issueKey}`, {
          description: "Check your Jira permissions",
        });
        setClaimingKey(null);
        return;
      }

      // Move to Claimed column (transition name is "Gray Area Queue" → status "Claimed")
      const transitioned = await transitionIssue(issueKey, "Gray Area Queue");
      setClaimedKeys((prev) => new Set(prev).add(issueKey));

      if (transitioned) {
        toast.success(`Claimed ${issueKey}`, {
          description: "Assigned to you and moved to Claimed",
        });
      } else {
        toast.success(`Assigned ${issueKey}`, {
          description: "Assigned to you (transition to Claimed column failed)",
        });
      }

      // Refresh queries after a beat
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["grayAreaIssues"] });
        queryClient.invalidateQueries({ queryKey: ["accountIssues"] });
        queryClient.invalidateQueries({ queryKey: ["unclaimedIssues"] });
      }, 1000);
    } catch (err) {
      console.error("Claim error:", err);
      toast.error(`Failed to claim ${issueKey}`, {
        description: String(err),
      });
    }
    setClaimingKey(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.3 }}
      className="atlassian-card p-5 flex-1"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-foreground">
            Gray Area Queue
          </h2>
          {isLive && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-hub-success/10 text-hub-success">
              <span className="w-1.5 h-1.5 rounded-full bg-hub-success animate-pulse" />
              LIVE
            </span>
          )}
        </div>
        <button className="text-xs text-primary font-medium hover:underline">
          View all
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">
            Loading from Jira…
          </span>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {displayItems.map((item, i) => {
              const isJira = "url" in item;
              const key = isJira ? (item as JiraIssue).key : item.key;
              const isClaimed = claimedKeys.has(key);
              const isClaiming = claimingKey === key;

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: 8 }}
                  animate={
                    isClaimed
                      ? { opacity: 0.5, x: 0, scale: 0.98 }
                      : { opacity: 1, x: 0, scale: 1 }
                  }
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ delay: isClaimed ? 0 : 0.4 + i * 0.05 }}
                  className={`p-3 rounded border transition-colors space-y-1.5 ${
                    isClaimed
                      ? "border-hub-success/30 bg-hub-success/5"
                      : "border-border hover:bg-accent"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {isJira && (
                          <a
                            href={(item as JiraIssue).url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono text-primary hover:underline shrink-0"
                          >
                            {(item as JiraIssue).key}
                          </a>
                        )}
                        <p
                          className={`text-sm font-medium truncate ${isClaimed ? "line-through text-muted-foreground" : "text-foreground"}`}
                        >
                          {item.summary}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 inline-flex items-center px-1.5 py-0.5 text-[11px] font-semibold rounded ${priorityBg[item.priority] ?? "bg-muted text-muted-foreground"}`}
                    >
                      {item.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {isClaimed ? (
                        <span className="text-hub-success font-medium">
                          You (claimed)
                        </span>
                      ) : (
                        item.assignee ?? "Unassigned"
                      )}
                    </span>
                    {isJira && (item as JiraIssue).created && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(
                          (item as JiraIssue).created
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}

                    <div className="ml-auto flex items-center gap-2">
                      {/* Claim button */}
                      {!isClaimed && isJira && (
                        <button
                          onClick={() => handleClaim(key)}
                          disabled={isClaiming}
                          className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded
                            bg-primary text-primary-foreground hover:bg-primary/90
                            disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {isClaiming ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Claiming…
                            </>
                          ) : (
                            <>
                              <Hand className="w-3 h-3" />
                              Claim
                            </>
                          )}
                        </button>
                      )}
                      {isClaimed && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded bg-hub-success/10 text-hub-success">
                          <Check className="w-3 h-3" />
                          Claimed
                        </span>
                      )}

                      {isJira && (
                        <a
                          href={(item as JiraIssue).url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Open
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {displayItems.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              🎉 No gray area items — all tasks have clear ownership
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default GrayAreaQueue;
