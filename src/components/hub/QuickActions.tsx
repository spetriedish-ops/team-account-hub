import { motion } from "framer-motion";
import { Plus, Video, CalendarDays, Send } from "lucide-react";

const actions = [
  { label: "New Thread", icon: Plus, desc: "Start a discussion" },
  { label: "Schedule Call", icon: Video, desc: "Book a team meeting" },
  { label: "Plan Sprint", icon: CalendarDays, desc: "Organize next sprint" },
  { label: "Send Update", icon: Send, desc: "Broadcast to team" },
];

const QuickActions = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5, duration: 0.4 }}
    className="glass-card p-6"
  >
    <h2 className="text-lg font-semibold font-['Space_Grotesk'] text-foreground mb-5">Quick Actions</h2>
    <div className="grid grid-cols-2 gap-3">
      {actions.map((a, i) => (
        <motion.button
          key={a.label}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary/50 border border-border/30 surface-hover text-center group cursor-pointer"
        >
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
            <a.icon className="w-5 h-5" />
          </div>
          <span className="text-sm font-medium text-foreground">{a.label}</span>
          <span className="text-xs text-muted-foreground">{a.desc}</span>
        </motion.button>
      ))}
    </div>
  </motion.div>
);

export default QuickActions;
