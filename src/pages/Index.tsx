import { motion } from "framer-motion";
import { Bell, Search, Settings } from "lucide-react";
import StatsOverview from "@/components/hub/StatsOverview";
import TeamMembers from "@/components/hub/TeamMembers";
import ActivityFeed from "@/components/hub/ActivityFeed";
import QuickActions from "@/components/hub/QuickActions";

const Index = () => (
  <div className="min-h-screen bg-background">
    {/* Header */}
    <header className="border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
      <div className="container max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm font-['Space_Grotesk']">A</span>
          </div>
          <h1 className="text-lg font-bold font-['Space_Grotesk'] text-foreground">AccountTeamHub</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg surface-hover text-muted-foreground hover:text-foreground transition-colors">
            <Search className="w-4.5 h-4.5" />
          </button>
          <button className="relative p-2 rounded-lg surface-hover text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
          </button>
          <button className="p-2 rounded-lg surface-hover text-muted-foreground hover:text-foreground transition-colors">
            <Settings className="w-4.5 h-4.5" />
          </button>
          <div className="ml-2 w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-semibold text-primary">
            YO
          </div>
        </div>
      </div>
    </header>

    {/* Main Content */}
    <main className="container max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-3xl font-bold font-['Space_Grotesk'] text-foreground">
          Good morning, <span className="gradient-text">Team</span> 👋
        </h2>
        <p className="text-muted-foreground mt-1">Here's what's happening across your account today.</p>
      </motion.div>

      {/* Stats */}
      <StatsOverview />

      {/* Grid: Members + Activity + Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TeamMembers />
        <ActivityFeed />
        <QuickActions />
      </div>
    </main>
  </div>
);

export default Index;
