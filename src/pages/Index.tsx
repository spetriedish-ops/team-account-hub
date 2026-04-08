import { motion } from "framer-motion";
import { Bell, Search, Settings, HelpCircle } from "lucide-react";
import FocusAreasBanner from "@/components/hub/FocusAreasBanner";
import StatsOverview from "@/components/hub/StatsOverview";
import ActivityFeed from "@/components/hub/ActivityFeed";
import GrayAreaQueue from "@/components/hub/GrayAreaQueue";
import PinnedSlackMessages from "@/components/hub/PinnedSlackMessages";
import AccountTeam from "@/components/hub/AccountTeam";
import BottomLinks from "@/components/hub/BottomLinks";

const Index = () => (
  <div className="min-h-screen bg-background">
    {/* Header — Atlassian-style top nav */}
    <header className="bg-primary sticky top-0 z-50">
      <div className="container max-w-7xl mx-auto flex items-center justify-between h-12 px-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-primary-foreground/20 flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs">A</span>
          </div>
          <h1 className="text-sm font-semibold text-primary-foreground">AccountTeamHub</h1>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 rounded surface-hover text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors">
            <Search className="w-4 h-4" />
          </button>
          <button className="relative p-2 rounded text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-destructive" />
          </button>
          <button className="p-2 rounded text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors">
            <HelpCircle className="w-4 h-4" />
          </button>
          <button className="p-2 rounded text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
          <div className="ml-2 w-7 h-7 rounded-full bg-hub-success flex items-center justify-center text-[11px] font-semibold text-primary-foreground">
            YO
          </div>
        </div>
      </div>
    </header>

    {/* Main Content */}
    <main className="container max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-semibold text-foreground">
          Good morning, <span className="gradient-text">Team</span> 👋
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Here's what's happening across your account today.</p>
      </motion.div>

      <FocusAreasBanner />
      <StatsOverview />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed />
        <GrayAreaQueue />
      </div>

      <PinnedSlackMessages />
      <AccountTeam />
      <BottomLinks />
    </main>
  </div>
);

export default Index;
