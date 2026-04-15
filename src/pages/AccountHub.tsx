import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { getAccountById } from "@/data/accounts";
import HubHeader from "@/components/hub/HubHeader";
import FocusAreasBanner from "@/components/hub/FocusAreasBanner";
import StatsOverview from "@/components/hub/StatsOverview";
import ActivityFeed from "@/components/hub/ActivityFeed";
import GrayAreaQueue from "@/components/hub/GrayAreaQueue";
import PinnedSlackMessages from "@/components/hub/PinnedSlackMessages";
import AccountTeam from "@/components/hub/AccountTeam";
import ConfluenceFeed from "@/components/hub/ConfluenceFeed";
import BottomLinks from "@/components/hub/BottomLinks";

const AccountHub = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const account = getAccountById(Number(id));

  if (!account) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-muted-foreground">Account not found.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-primary hover:underline"
        >
          Back to Portfolio
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back link */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate("/")}
        className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Portfolio
      </motion.button>

      <HubHeader account={account} />
      <FocusAreasBanner account={account} />
      <StatsOverview account={account} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed account={account} />
        <GrayAreaQueue account={account} />
      </div>

      <PinnedSlackMessages account={account} />
      <ConfluenceFeed account={account} />
      <AccountTeam account={account} />
      <BottomLinks />
    </div>
  );
};

export default AccountHub;
