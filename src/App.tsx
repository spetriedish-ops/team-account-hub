import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppShell from "@/components/AppShell";
import PageTransition from "@/components/PageTransition";
import Portfolio from "./pages/Portfolio";
import AccountHub from "./pages/AccountHub";
import NotFound from "./pages/NotFound";
import {
  GoogleCalendarContext,
  useGoogleCalendarEnabled,
  useGoogleCalendarDisabled,
} from "@/hooks/useGoogleCalendar";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<AppShell />}>
          <Route
            path="/"
            element={
              <PageTransition>
                <Portfolio />
              </PageTransition>
            }
          />
          <Route
            path="/account/:id"
            element={
              <PageTransition>
                <AccountHub />
              </PageTransition>
            }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "";

// ─── Google Calendar context providers ───────────────────────────────────────
// These components sit inside/outside GoogleOAuthProvider as appropriate and
// supply calendar state via context. Components call useGoogleCalendar() to
// read from context — they never call useGoogleLogin directly, so rules of
// hooks are never violated regardless of the provider tree.

function GoogleCalendarEnabledProvider({ children }: { children: React.ReactNode }) {
  const value = useGoogleCalendarEnabled();
  return (
    <GoogleCalendarContext.Provider value={value}>
      {children}
    </GoogleCalendarContext.Provider>
  );
}

function GoogleCalendarDisabledProvider({ children }: { children: React.ReactNode }) {
  const value = useGoogleCalendarDisabled();
  return (
    <GoogleCalendarContext.Provider value={value}>
      {children}
    </GoogleCalendarContext.Provider>
  );
}

const AppRoutes = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// When a Google Client ID is configured: wrap with GoogleOAuthProvider and
// use the real hook inside it. When not configured: use the safe stub and
// never load any Google scripts.
const App = () =>
  GOOGLE_CLIENT_ID ? (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleCalendarEnabledProvider>
        <AppRoutes />
      </GoogleCalendarEnabledProvider>
    </GoogleOAuthProvider>
  ) : (
    <GoogleCalendarDisabledProvider>
      <AppRoutes />
    </GoogleCalendarDisabledProvider>
  );

export default App;
