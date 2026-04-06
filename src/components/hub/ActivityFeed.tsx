import { motion } from "framer-motion";
import { MessageSquare, FileText, CheckCircle2, GitBranch, Zap } from "lucide-react";

const activities = [
  { user: "Sarah C.", action: "commented on Q2 Strategy Brief", time: "5m ago", icon: MessageSquare, color: "text-hub-info" },
  { user: "Marcus J.", action: "uploaded Campaign Performance Report", time: "22m ago", icon: FileText, color: "text-primary" },
  { user: "Aisha P.", action: "completed Creative Review for Sprint 14", time: "1h ago", icon: CheckCircle2, color: "text-hub-success" },
  { user: "David K.", action: "created branch analytics-dashboard-v2", time: "2h ago", icon: GitBranch, color: "text-hub-warning" },
  { user: "Emma T.", action: "triggered workflow: Client Onboarding", time: "3h ago", icon: Zap, color: "text-primary" },
];

const ActivityFeed = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.35, duration: 0.4 }}
    className="glass-card p-6"
  >
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-lg font-semibold font-['Space_Grotesk'] text-foreground">Recent Activity</h2>
      <span className="text-xs text-primary font-medium cursor-pointer hover:underline">See all</span>
    </div>
    <div className="space-y-4">
      {activities.map((a, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45 + i * 0.06 }}
          className="flex items-start gap-3"
        >
          <div className={`mt-0.5 p-1.5 rounded-lg bg-secondary ${a.color}`}>
            <a.icon className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-foreground">
              <span className="font-medium">{a.user}</span>{" "}
              <span className="text-muted-foreground">{a.action}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default ActivityFeed;
