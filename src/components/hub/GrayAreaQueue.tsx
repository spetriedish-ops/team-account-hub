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

const GrayAreaQueue = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.35, duration: 0.4 }}
    className="glass-card p-6 flex-1"
  >
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-lg font-semibold font-['Space_Grotesk'] text-foreground">Gray Area Queue</h2>
      <span className="text-xs text-primary font-medium cursor-pointer hover:underline">View all</span>
    </div>
    <div className="space-y-3">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.45 + i * 0.06 }}
          className="p-3 rounded-lg bg-secondary/50 border border-border/30 space-y-1.5"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm text-foreground font-medium">{item.title}</p>
            <AlertCircle className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${priorityColors[item.priority]}`} />
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
