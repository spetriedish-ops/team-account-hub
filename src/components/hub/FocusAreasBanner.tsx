import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Plus, X, Target } from "lucide-react";

interface FocusItem {
  id: string;
  label: string;
}

const defaultFocusItems: FocusItem[] = [
  { id: "1", label: "Executive Onsite Prep" },
  { id: "2", label: "Expansion Opportunity" },
  { id: "3", label: "Q3 Renewal Strategy" },
];

const FocusAreasBanner = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [items, setItems] = useState<FocusItem[]>(defaultFocusItems);
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
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-3.5 surface-hover"
      >
        <div className="flex items-center gap-2.5">
          <Target className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold font-['Space_Grotesk'] text-foreground">
            Key Focus Areas
          </h2>
          <span className="text-xs text-muted-foreground">({items.length})</span>
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
            <div className="px-5 pb-4 pt-1 flex flex-wrap gap-2.5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center gap-2 px-3.5 py-2 rounded-lg bg-secondary border border-border/50 text-sm text-foreground"
                >
                  <span>{item.label}</span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
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
                    className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary w-48"
                  />
                  <button
                    onClick={addItem}
                    className="text-xs text-primary font-medium hover:underline"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAdding(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-dashed border-border/70 text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Focus Area
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
