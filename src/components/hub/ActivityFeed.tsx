import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  FileText,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Pin,
  Radio,
} from "lucide-react";
import type { Account } from "@/data/accounts";
import { MOCK_ACTIVITIES, type ActivityItem } from "@/data/mockActivity";

const iconMap: Record<string, typeof MessageSquare> = {
  confluence: FileText,
  jira: CheckCircle2,
  meeting: Calendar,
  slack: Pin,
  support: AlertCircle,
};

const colorMap: Record<string, string> = {
  confluence: "text-primary",
  jira: "text-hub-success",
  meeting: "text-hub-info",
  slack: "text-hub-warning",
  support: "text-destructive",
};

/* ── Simulated live events that trickle in ─────────────── */
const LIVE_EVENTS: ActivityItem[] = [
  {
    type: "jira",
    title: "HUB-3 moved to In Progress",
    time: "Just now",
    icon: "🔄",
    user: "Sarah Chen",
  },
  {
    type: "slack",
    title: "New message in #acme-strategy: 'Customer confirmed onsite date'",
    time: "Just now",
    icon: "💬",
    user: "Mike Johnson",
  },
  {
    type: "confluence",
    title: "Renewal strategy doc updated with latest pricing",
    time: "Just now",
    icon: "📝",
    user: "Sarah Chen",
  },
  {
    type: "jira",
    title: "HUB-12 priority changed to Highest",
    time: "Just now",
    icon: "🔺",
    user: "Alex Rodriguez",
  },
  {
    type: "support",
    title: "New support ticket: SSO configuration assistance",
    time: "Just now",
    icon: "🎫",
    user: "Support Team",
  },
  {
    type: "meeting",
    title: "Meeting notes added: Technical Architecture Discussion",
    time: "Just now",
    icon: "📋",
    user: "Alex Rodriguez",
  },
];

interface Props {
  account: Account;
}

const ActivityFeed = ({ account }: Props) => {
  const baseActivities = MOCK_ACTIVITIES[account.jiraLabel] ?? [];
  const [liveItems, setLiveItems] = useState<ActivityItem[]>([]);
  const liveIndexRef = useRef(0);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;

    // First live event after 8 seconds, then every 12–18 seconds
    const scheduleNext = () => {
      const delay =
        liveIndexRef.current === 0
          ? 8000
          : 12000 + Math.random() * 6000;
      return setTimeout(() => {
        if (liveIndexRef.current < LIVE_EVENTS.length) {
          setLiveItems((prev) => [LIVE_EVENTS[liveIndexRef.current], ...prev]);
          liveIndexRef.current += 1;
          timerRef.current = scheduleNext();
        }
      }, delay);
    };

    const timerRef = { current: scheduleNext() };
    return () => clearTimeout(timerRef.current);
  }, [isLive]);

  const allActivities = [...liveItems, ...baseActivities];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.3 }}
      className="atlassian-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-foreground">
            Recent Activity
          </h2>
          {isLive && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-hub-success/10 text-hub-success">
              <Radio className="w-3 h-3 animate-pulse" />
              LIVE
            </span>
          )}
        </div>
        <button className="text-xs text-primary font-medium hover:underline">
          See all
        </button>
      </div>
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        <AnimatePresence initial={false}>
          {allActivities.map((a, i) => {
            const Icon = iconMap[a.type] ?? MessageSquare;
            const color = colorMap[a.type] ?? "text-muted-foreground";
            const isNew = i < liveItems.length;
            return (
              <motion.div
                key={`${a.title}-${i}`}
                initial={isNew ? { opacity: 0, x: -20, height: 0 } : { opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                transition={
                  isNew
                    ? { type: "spring", stiffness: 300, damping: 25 }
                    : { delay: 0.35 + i * 0.05 }
                }
                className={`flex items-start gap-3 ${isNew ? "relative" : ""}`}
              >
                {isNew && (
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ delay: 3, duration: 1 }}
                    className="absolute -left-1 top-0 bottom-0 w-0.5 rounded-full bg-hub-success"
                  />
                )}
                <div className={`mt-0.5 p-1.5 rounded ${color} bg-muted`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{a.icon} </span>
                    <span className="text-muted-foreground">{a.title}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {a.user && (
                      <span className="text-xs font-medium text-foreground">
                        {a.user}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {a.time}
                    </span>
                    {isNew && (
                      <motion.span
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        transition={{ delay: 5, duration: 1 }}
                        className="text-[10px] font-semibold text-hub-success bg-hub-success/10 px-1.5 py-0.5 rounded"
                      >
                        NEW
                      </motion.span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {allActivities.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No recent activity
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default ActivityFeed;
