import { motion } from "framer-motion";
import { Calendar, FileText, Video } from "lucide-react";
import type { Account } from "@/data/accounts";
import { MOCK_MEETINGS } from "@/data/mockActivity";

interface Props {
  account: Account;
}

const RecentMeetings = ({ account }: Props) => {
  const meetings = MOCK_MEETINGS[account.jiraLabel] ?? [];

  if (meetings.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.3 }}
      className="atlassian-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            Recent Meetings
          </h2>
        </div>
        <button className="text-xs text-primary font-medium hover:underline">
          View calendar
        </button>
      </div>
      <div className="space-y-2">
        {meetings.map((mtg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.05 }}
            className="flex items-center justify-between p-3 rounded border border-border hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded bg-primary/10 text-primary">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {mtg.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(mtg.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {mtg.hasNotes && (
                <span className="flex items-center gap-1 text-xs text-hub-success font-medium">
                  <FileText className="w-3 h-3" />
                  Notes
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Video className="w-3 h-3" />
                Recording
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentMeetings;
