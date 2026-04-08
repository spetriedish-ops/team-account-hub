import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, X, Check, Users } from "lucide-react";

interface Member {
  id: string;
  name: string;
  title: string;
  accountRole: string;
  avatar: string;
}

const defaultMembers: Member[] = [
  { id: "1", name: "Sarah Chen", title: "Senior Account Executive", accountRole: "Account Lead", avatar: "SC" },
  { id: "2", name: "Marcus Johnson", title: "Strategy Director", accountRole: "Strategy Lead", avatar: "MJ" },
  { id: "3", name: "Aisha Patel", title: "Senior Designer", accountRole: "Creative Lead", avatar: "AP" },
  { id: "4", name: "David Kim", title: "Analytics Manager", accountRole: "Analytics Lead", avatar: "DK" },
  { id: "5", name: "Emma Torres", title: "Project Manager", accountRole: "Delivery Manager", avatar: "ET" },
  { id: "6", name: "James Wright", title: "Content Strategist", accountRole: "Content Lead", avatar: "JW" },
];

const AccountTeam = () => {
  const [members, setMembers] = useState<Member[]>(defaultMembers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState("");

  const startEdit = (m: Member) => {
    setEditingId(m.id);
    setEditRole(m.accountRole);
  };

  const saveEdit = (id: string) => {
    setMembers(members.map((m) => (m.id === id ? { ...m, accountRole: editRole } : m)));
    setEditingId(null);
  };

  const removeMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.4 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <h2 className="text-lg font-semibold font-['Space_Grotesk'] text-foreground">Account Team</h2>
        </div>
        <button className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
          <Plus className="w-3.5 h-3.5" />
          Add Member
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {members.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.04 }}
            className="group relative p-4 rounded-lg bg-secondary/50 border border-border/30 text-center space-y-2"
          >
            <button
              onClick={() => removeMember(m.id)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="w-12 h-12 mx-auto rounded-full bg-secondary flex items-center justify-center text-sm font-semibold text-secondary-foreground border border-border/50">
              {m.avatar}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground truncate">{m.name}</p>
              <p className="text-xs text-muted-foreground truncate">{m.title}</p>
            </div>
            {editingId === m.id ? (
              <div className="flex items-center gap-1">
                <input
                  autoFocus
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") saveEdit(m.id); if (e.key === "Escape") setEditingId(null); }}
                  className="w-full px-2 py-1 text-xs rounded bg-card border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button onClick={() => saveEdit(m.id)} className="text-hub-success"><Check className="w-3.5 h-3.5" /></button>
              </div>
            ) : (
              <button
                onClick={() => startEdit(m)}
                className="flex items-center justify-center gap-1 w-full text-xs text-primary font-medium hover:underline"
              >
                {m.accountRole}
                <Pencil className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AccountTeam;
