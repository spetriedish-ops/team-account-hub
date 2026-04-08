import { motion } from "framer-motion";
import { Hash, Pin } from "lucide-react";

const messages = [
  { channel: "#account-strategy", author: "Sarah Chen", text: "Final deck for the exec onsite is ready — please review by EOD Thursday.", time: "Yesterday, 4:12 PM" },
  { channel: "#support-escalations", author: "David Kim", text: "Ticket #4821 resolved. Root cause was misconfigured SSO — documented in runbook.", time: "Mon, 11:30 AM" },
  { channel: "#general", author: "Marcus Johnson", text: "Reminder: QBR prep sync tomorrow at 10am PT. Agenda doc linked in thread.", time: "Mon, 9:05 AM" },
];

const PinnedSlackMessages = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4, duration: 0.4 }}
    className="glass-card p-6"
  >
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        <Pin className="w-4 h-4 text-primary" />
        <h2 className="text-lg font-semibold font-['Space_Grotesk'] text-foreground">Pinned Slack Messages</h2>
      </div>
      <span className="text-xs text-primary font-medium cursor-pointer hover:underline">Manage pins</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {messages.map((msg, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + i * 0.06 }}
          className="p-4 rounded-lg bg-secondary/50 border border-border/30 space-y-2"
        >
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Hash className="w-3 h-3" />
            <span>{msg.channel}</span>
          </div>
          <p className="text-sm text-foreground line-clamp-2">{msg.text}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-medium text-secondary-foreground">{msg.author}</span>
            <span>{msg.time}</span>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

export default PinnedSlackMessages;
