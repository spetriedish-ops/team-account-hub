import { motion } from "framer-motion";
import { Hash, Pin } from "lucide-react";
import type { Account } from "@/data/accounts";
import { MOCK_PINNED_MESSAGES } from "@/data/mockActivity";

interface Props {
  account: Account;
}

const PinnedSlackMessages = ({ account }: Props) => {
  const messages = MOCK_PINNED_MESSAGES[account.jiraLabel] ?? [];

  if (messages.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.3 }}
      className="atlassian-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Pin className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            Pinned Slack Messages
          </h2>
        </div>
        <button className="text-xs text-primary font-medium hover:underline">
          Manage pins
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 + i * 0.05 }}
            className="p-3 rounded border border-border hover:bg-accent transition-colors space-y-2"
          >
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Hash className="w-3 h-3" />
              <span>{msg.channel}</span>
            </div>
            <p className="text-sm text-foreground line-clamp-2">{msg.text}</p>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{msg.author}</span>
              <span>{msg.timestamp}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PinnedSlackMessages;
