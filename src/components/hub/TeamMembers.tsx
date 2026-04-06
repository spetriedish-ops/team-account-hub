import { motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";

const members = [
  { name: "Sarah Chen", role: "Account Lead", avatar: "SC", status: "online" },
  { name: "Marcus Johnson", role: "Strategy Director", avatar: "MJ", status: "online" },
  { name: "Aisha Patel", role: "Creative Lead", avatar: "AP", status: "away" },
  { name: "David Kim", role: "Analytics Manager", avatar: "DK", status: "online" },
  { name: "Emma Torres", role: "Project Manager", avatar: "ET", status: "offline" },
  { name: "James Wright", role: "Content Strategist", avatar: "JW", status: "online" },
];

const statusColors: Record<string, string> = {
  online: "bg-hub-success",
  away: "bg-hub-warning",
  offline: "bg-muted-foreground",
};

const TeamMembers = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3, duration: 0.4 }}
    className="glass-card p-6"
  >
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-lg font-semibold font-['Space_Grotesk'] text-foreground">Team Members</h2>
      <span className="text-xs text-primary font-medium cursor-pointer hover:underline">View all</span>
    </div>
    <div className="space-y-3">
      {members.map((m, i) => (
        <motion.div
          key={m.name}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + i * 0.05 }}
          className="flex items-center gap-3 p-2.5 rounded-lg surface-hover group"
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-secondary-foreground">
              {m.avatar}
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${statusColors[m.status]}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
            <p className="text-xs text-muted-foreground truncate">{m.role}</p>
          </div>
          <MoreHorizontal className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default TeamMembers;
