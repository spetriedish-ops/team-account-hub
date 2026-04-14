import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Bell, Search, Settings, HelpCircle } from "lucide-react";

const AppShell = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isPortfolio = location.pathname === "/";

  return (
    <div className="min-h-screen bg-background">
      {/* Header — Atlassian-style top nav */}
      <header className="bg-primary sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto flex items-center justify-between h-12 px-6">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2.5 hover:opacity-90 transition-opacity"
            >
              <div className="w-7 h-7 rounded bg-primary-foreground/20 flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">
                  A
                </span>
              </div>
              <h1 className="text-sm font-semibold text-primary-foreground">
                Account Team Hub
              </h1>
            </button>
            <nav className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => navigate("/")}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  isPortfolio
                    ? "bg-primary-foreground/15 text-primary-foreground"
                    : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                }`}
              >
                Portfolio
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 transition-colors">
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
              SC
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AppShell;
