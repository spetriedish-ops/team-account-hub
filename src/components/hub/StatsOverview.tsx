import { motion } from "framer-motion";
import { Users } from "lucide-react";

const stats = [
  { label: "Team Members", value: "12", icon: Users, change: "+2 this month", color: "text-primary" },
];

const StatsOverview = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {stats.map((stat, i) => (
      <motion.div
        key={stat.label}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1, duration: 0.4 }}
        className="glass-card p-5 glow-primary group surface-hover cursor-default"
      >
        <div className="flex items-center justify-between mb-3">
          <stat.icon className={`w-5 h-5 ${stat.color}`} />
          <span className="text-xs text-muted-foreground">{stat.change}</span>
        </div>
        <p className="text-2xl font-bold font-['Space_Grotesk'] text-foreground">{stat.value}</p>
        <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
      </motion.div>
    ))}
  </div>
);

export default StatsOverview;
