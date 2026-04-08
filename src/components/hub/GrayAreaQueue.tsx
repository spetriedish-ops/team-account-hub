import { motion } from "framer-motion";
import { AlertCircle, Clock, User } from "lucide-react";

const items = [
  { title: "Licensing discrepancy on Enterprise tier", assignee: "Unassigned", age: "3d", priority: "high" },
  { title: "Custom integration request from VP Eng", assignee: "Sarah C.", age: "1d", priority: "medium" },
  { title: "Unclear ownership of analytics dashboard", assignee: "Unassigned", age: "5d", priority: "high" },
  { title: "Pilot feedback routing", assignee: "Marcus J.", age: "2d", priority: "low" },
];

const priorityColors: Record<string, string> = {
  high: "text-destructive",
  medium: "text-hub-warning",
  low: "text-muted-foreground",
};

const priorityBg: Record<string, string> = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-hub-warning/10 text-hub-warning",
  low: "bg-muted text-muted-foreground",
};

const GrayAreaQueue = () => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3, duration: 0.3 }}
    className="atlassian-card p-5 flex-1"
  >
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-sm font-semibold text-foreground">Gray Area Queue</h2>
      <button className="text-xs text-primary font-medium hover:underline">View all</button>
    </div>
    <div className="space-y-2">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + i * 0.05 }}
          className="p-3 rounded border border-border hover:bg-accent transition-colors space-y-1.5"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm text-foreground font-medium">{item.title}</p>
            <span className={`shrink-0 inline-flex items-center px-1.5 py-0.5 text-[11px] font-semibold rounded ${priorityBg[item.priority]}`}>
              {item.priority}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><User className="w-3 h-3" />{item.assignee}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.age}</span>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default GrayAreaQueue;
