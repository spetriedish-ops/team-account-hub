import { motion } from "framer-motion";
import { ClipboardList, UserPlus, Headphones, Calendar } from "lucide-react";

const stats = [
  { label: "Open Tasks", value: "12", change: "+3 this week", icon: ClipboardList, color: "text-primary" },
  { label: "Unclaimed Tasks", value: "5", change: "2 high priority", icon: UserPlus, color: "text-hub-warning" },
  { label: "Open Support Tickets", value: "8", change: "1 critical", icon: Headphones, color: "text-destructive" },
  { label: "Upcoming Meetings", value: "4", change: "Next: Tomorrow 10am", icon: Calendar, color: "text-hub-info" },
];

const StatsOverview = () => (
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
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{s.label}</span>
          <s.icon className={`w-4 h-4 ${s.color}`} />
        </div>
        <p className="text-2xl font-semibold text-foreground">{s.value}</p>
        <p className="text-xs text-muted-foreground">{s.change}</p>
      </motion.div>
    ))}
  </div>
);

export default StatsOverview;
