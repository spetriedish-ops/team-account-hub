import { useState } from "react";
import { motion } from "framer-motion";
import type { Account } from "@/data/accounts";

const healthStyles: Record<string, string> = {
  Strong: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Good: "bg-blue-50 text-blue-700 border-blue-200",
  "At Risk": "bg-amber-50 text-amber-700 border-amber-200",
  Critical: "bg-red-50 text-red-700 border-red-200",
};

const healthBorderLeft: Record<string, string> = {
  Strong: "border-l-emerald-500",
  Good: "border-l-blue-500",
  "At Risk": "border-l-amber-500",
  Critical: "border-l-red-500",
};

interface Props {
  account: Account;
}

const HubHeader = ({ account }: Props) => {
  const [health, setHealth] = useState(account.health);
  const daysToRenewal = Math.ceil(
    (new Date(account.renewalDate).getTime() - Date.now()) / 86_400_000
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`atlassian-card p-6 border-l-4 ${healthBorderLeft[health] ?? "border-l-primary"}`}
    >
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {account.name}
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground font-medium">
              Strategic
            </span>
            <select
              value={health}
              onChange={(e) => setHealth(e.target.value as Account["health"])}
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring ${healthStyles[health]}`}
            >
              <option>Strong</option>
              <option>Good</option>
              <option>At Risk</option>
              <option>Critical</option>
            </select>
          </div>
        </div>
        <div className="flex gap-6 items-start">
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">{account.arr}</p>
            <p className="text-xs text-muted-foreground">ARR</p>
          </div>
          <div className="text-right">
            <p
              className={`text-sm font-semibold ${daysToRenewal <= 60 ? "text-destructive" : "text-foreground"}`}
            >
              {new Date(account.renewalDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
            <p className="text-xs text-muted-foreground">
              Renewal{" "}
              {daysToRenewal > 0 ? `in ${daysToRenewal}d` : "(Overdue)"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-foreground">
              {account.lastMeeting
                ? new Date(account.lastMeeting).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : "—"}
            </p>
            <p className="text-xs text-muted-foreground">Last Meeting</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HubHeader;
