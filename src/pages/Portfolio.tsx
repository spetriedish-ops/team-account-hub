import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Filter,
  Users,
} from "lucide-react";
import { ACCOUNTS, type Account } from "@/data/accounts";

/* ── Health Badge ────────────────────────────────────────── */
const healthStyles: Record<string, string> = {
  Strong:
    "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Good: "bg-blue-50 text-blue-700 border border-blue-200",
  "At Risk":
    "bg-amber-50 text-amber-700 border border-amber-200",
  Critical:
    "bg-red-50 text-red-700 border border-red-200",
};

const HealthBadge = ({ health }: { health: string }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${healthStyles[health] ?? ""}`}
  >
    {health}
  </span>
);

/* ── Flag Badge ──────────────────────────────────────────── */
const flagColors: Record<string, string> = {
  "P1 Ticket": "bg-red-100 text-red-700",
  "P2 Tickets": "bg-orange-100 text-orange-700",
  "Unclaimed Tasks": "bg-amber-100 text-amber-700",
  "Renewal Risk": "bg-purple-100 text-purple-700",
};

const FlagBadge = ({ flag }: { flag: string }) => (
  <span
    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${flagColors[flag] ?? "bg-muted text-muted-foreground"}`}
  >
    {flag}
  </span>
);

/* ── Expanded Row ────────────────────────────────────────── */
const AccountExpanded = ({ account }: { account: Account }) => (
  <motion.div
    initial={{ height: 0, opacity: 0 }}
    animate={{ height: "auto", opacity: 1 }}
    exit={{ height: 0, opacity: 0 }}
    transition={{ duration: 0.2 }}
    className="overflow-hidden"
  >
    <div className="px-6 pb-5 pt-1 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Focus areas */}
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Key Focus Areas
        </h4>
        <ul className="space-y-1.5">
          {account.keyFocusAreas.map((fa) => (
            <li
              key={fa}
              className="flex items-start gap-2 text-sm text-foreground"
            >
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              {fa}
            </li>
          ))}
        </ul>
      </div>

      {/* Team */}
      <div>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Account Team
        </h4>
        <div className="space-y-2">
          {account.team.map((m) => (
            <div
              key={m.name}
              className="flex items-center gap-3 text-sm"
            >
              <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                {m.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-medium text-foreground">
                  {m.name}
                </span>
                <span className="text-muted-foreground"> · {m.role}</span>
              </div>
              <span className="text-xs text-muted-foreground">{m.owns}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

/* ── Account Row ─────────────────────────────────────────── */
interface AccountRowProps {
  account: Account;
  isExpanded: boolean;
  onToggle: () => void;
  onOpen: () => void;
  index: number;
}

const AccountRow = ({
  account,
  isExpanded,
  onToggle,
  onOpen,
  index,
}: AccountRowProps) => {
  const daysToRenewal = Math.ceil(
    (new Date(account.renewalDate).getTime() - Date.now()) / 86_400_000
  );
  const renewalUrgent = daysToRenewal <= 60;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      className="atlassian-card overflow-hidden"
    >
      {/* Main row */}
      <div
        className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={onToggle}
      >
        {/* Name + tier */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
              }}
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate"
            >
              {account.name}
            </button>
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
              {account.tier}
            </span>
          </div>
          {account.attentionFlags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {account.attentionFlags.map((f) => (
                <FlagBadge key={f} flag={f} />
              ))}
            </div>
          )}
        </div>

        {/* ARR */}
        <div className="hidden sm:block text-right w-20">
          <p className="text-sm font-semibold text-foreground">{account.arr}</p>
          <p className="text-[11px] text-muted-foreground">ARR</p>
        </div>

        {/* Health */}
        <div className="w-20 flex justify-center">
          <HealthBadge health={account.health} />
        </div>

        {/* Renewal */}
        <div className="hidden md:block text-right w-28">
          <p
            className={`text-sm font-medium ${renewalUrgent ? "text-destructive" : "text-foreground"}`}
          >
            {new Date(account.renewalDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {daysToRenewal > 0 ? `${daysToRenewal}d away` : "Overdue"}
          </p>
        </div>

        {/* Tasks */}
        <div className="hidden lg:flex items-center gap-4 w-32">
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground">
              {account.openTasks}
            </p>
            <p className="text-[11px] text-muted-foreground">Open</p>
          </div>
          <div className="text-center">
            <p
              className={`text-sm font-semibold ${account.unclaimedTasks > 0 ? "text-hub-warning" : "text-foreground"}`}
            >
              {account.unclaimedTasks}
            </p>
            <p className="text-[11px] text-muted-foreground">Unclaimed</p>
          </div>
        </div>

        {/* Chevron */}
        <div className="text-muted-foreground">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </div>

      {/* Expanded details */}
      {isExpanded && <AccountExpanded account={account} />}
    </motion.div>
  );
};

/* ── Portfolio Page ───────────────────────────────────────── */
const Portfolio = () => {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [needsAttention, setNeedsAttention] = useState(false);
  const [healthFilter, setHealthFilter] = useState("All");

  const filteredAccounts = useMemo(() => {
    let list = [...ACCOUNTS];
    if (needsAttention) {
      list = list.filter(
        (a) =>
          a.health === "At Risk" ||
          a.health === "Critical" ||
          a.unclaimedTasks > 0
      );
    }
    if (healthFilter !== "All") {
      list = list.filter((a) => a.health === healthFilter);
    }
    // Sort: Critical first, then At Risk, then by ARR descending
    const healthOrder: Record<string, number> = {
      Critical: 0,
      "At Risk": 1,
      Good: 2,
      Strong: 3,
    };
    list.sort(
      (a, b) => (healthOrder[a.health] ?? 9) - (healthOrder[b.health] ?? 9)
    );
    return list;
  }, [needsAttention, healthFilter]);

  /* Summary stats */
  const totalArr = ACCOUNTS.reduce((sum, a) => {
    const num = parseFloat(a.arr.replace(/[$MK,]/g, ""));
    const multiplier = a.arr.includes("M") ? 1_000_000 : a.arr.includes("K") ? 1_000 : 1;
    return sum + num * multiplier;
  }, 0);
  const criticalCount = ACCOUNTS.filter(
    (a) => a.health === "Critical" || a.health === "At Risk"
  ).length;
  const totalUnclaimed = ACCOUNTS.reduce(
    (sum, a) => sum + a.unclaimedTasks,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-semibold text-foreground">
          Portfolio Overview
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Monitor and manage your enterprise accounts
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Accounts",
            value: ACCOUNTS.length.toString(),
            sub: `${ACCOUNTS.filter((a) => a.tier === "Enterprise").length} Enterprise`,
            icon: Users,
            color: "text-primary",
          },
          {
            label: "Portfolio ARR",
            value: `$${(totalArr / 1_000_000).toFixed(1)}M`,
            sub: "Combined annual revenue",
            icon: Users,
            color: "text-hub-success",
          },
          {
            label: "Needs Attention",
            value: criticalCount.toString(),
            sub: "At Risk or Critical",
            icon: AlertTriangle,
            color: "text-destructive",
          },
          {
            label: "Unclaimed Tasks",
            value: totalUnclaimed.toString(),
            sub: "Across all accounts",
            icon: Filter,
            color: "text-hub-warning",
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06, duration: 0.3 }}
            className="atlassian-card p-4 space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {stat.label}
              </span>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="text-2xl font-semibold text-foreground">
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="atlassian-card p-4"
      >
        <div className="flex flex-wrap gap-4 items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={needsAttention}
              onChange={(e) => setNeedsAttention(e.target.checked)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm font-medium text-foreground">
              Needs Attention Only
            </span>
          </label>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground">
              Health:
            </label>
            <select
              value={healthFilter}
              onChange={(e) => setHealthFilter(e.target.value)}
              className="px-3 py-1.5 border border-border rounded-md text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option>All</option>
              <option>Strong</option>
              <option>Good</option>
              <option>At Risk</option>
              <option>Critical</option>
            </select>
          </div>

          <span className="text-xs text-muted-foreground ml-auto">
            Showing {filteredAccounts.length} of {ACCOUNTS.length} accounts
          </span>
        </div>
      </motion.div>

      {/* Account List */}
      <div className="space-y-3">
        {filteredAccounts.map((account, i) => (
          <AccountRow
            key={account.id}
            account={account}
            isExpanded={expandedId === account.id}
            onToggle={() =>
              setExpandedId(expandedId === account.id ? null : account.id)
            }
            onOpen={() => navigate(`/account/${account.id}`)}
            index={i}
          />
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
