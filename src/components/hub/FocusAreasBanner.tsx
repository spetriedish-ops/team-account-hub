import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Plus, X, Target } from "lucide-react";
import type { Account } from "@/data/accounts";

interface FocusItem {
  id: string;
  label: string;
}

interface Props {
  account: Account;
}

const FocusAreasBanner = ({ account }: Props) => {
  const [isOpen, setIsOpen] = useState(true);
  const [items, setItems] = useState<FocusItem[]>(
    account.keyFocusAreas.map((label, i) => ({ id: String(i), label }))
  );
  const [isAdding, setIsAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");

  const addItem = () => {
    if (!newLabel.trim()) return;
    setItems([...items, { id: Date.now().toString(), label: newLabel.trim() }]);
    setNewLabel("");
    setIsAdding(false);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  return (
    <div className="atlassian-card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-accent transition-colors"
      >
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            Key Focus Areas
          </h2>
          <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-semibold rounded bg-muted text-muted-foreground">
            {items.length}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 flex flex-wrap gap-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center gap-2 px-3 py-1.5 rounded bg-primary/10 text-sm font-medium text-primary border border-primary/20"
                >
                  <span>{item.label}</span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-primary/60 hover:text-destructive"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {isAdding ? (
                <div className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addItem();
                      if (e.key === "Escape") setIsAdding(false);
                    }}
                    placeholder="Focus area name…"
                    className="px-3 py-1.5 rounded border border-input text-sm text-foreground bg-card placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring w-48"
                  />
                  <button
                    onClick={addItem}
                    className="px-3 py-1.5 text-xs font-medium text-primary-foreground bg-primary rounded hover:bg-primary/90 transition-colors"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAdding(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FocusAreasBanner;
