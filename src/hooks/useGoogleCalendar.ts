/**
 * useGoogleCalendar
 *
 * Exports two hooks:
 *   - useGoogleCalendarEnabled  — uses useGoogleLogin; MUST be rendered inside GoogleOAuthProvider
 *   - useGoogleCalendarDisabled — safe no-op stub; never touches @react-oauth/google
 *
 * The correct hook is selected in GoogleCalendarProvider (see App.tsx) based on
 * whether VITE_GOOGLE_CLIENT_ID is configured, so rules-of-hooks are never violated.
 */

import { useState, useCallback, useEffect, createContext, useContext } from "react";
import { fetchCalendarEvents, fetchAllUpcomingEvents, type CalendarEvent } from "@/services/googleCalendarService";

const STORAGE_KEY = "gcal_access_token";
const STORAGE_EXPIRY_KEY = "gcal_token_expiry";

export const CLIENT_ID_CONFIGURED = !!import.meta.env.VITE_GOOGLE_CLIENT_ID;

export type GoogleCalendarStatus = "idle" | "loading" | "connected" | "error" | "unconfigured";

export interface UseGoogleCalendarReturn {
  status: GoogleCalendarStatus;
  events: CalendarEvent[];
  signIn: () => void;
  signOut: () => void;
  isConnected: boolean;
  fetchForAccount: (accountName: string) => Promise<CalendarEvent[]>;
}

// ─── Context ──────────────────────────────────────────────────────────────────
// Components read calendar state from context rather than calling the hook
// directly — this is what allows us to select the right implementation once
// at the top of the tree without violating rules of hooks downstream.

const GoogleCalendarContext = createContext<UseGoogleCalendarReturn>({
  status: "unconfigured",
  events: [],
  signIn: () => {},
  signOut: () => {},
  isConnected: false,
  fetchForAccount: async () => [],
});

export function useGoogleCalendar(): UseGoogleCalendarReturn {
  return useContext(GoogleCalendarContext);
}

export { GoogleCalendarContext };

// ─── Enabled hook (requires GoogleOAuthProvider in tree) ──────────────────────
export function useGoogleCalendarEnabled(): UseGoogleCalendarReturn {
  // Import useGoogleLogin only when this hook is actually used (i.e. inside
  // GoogleOAuthProvider). Using a direct import here is fine because this
  // function is only ever called from GoogleCalendarEnabledProvider which is
  // only rendered when VITE_GOOGLE_CLIENT_ID is set (and GoogleOAuthProvider
  // is therefore present).
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useGoogleLogin, googleLogout } = require("@react-oauth/google");

  const [status, setStatus] = useState<GoogleCalendarStatus>("idle");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    const expiry = sessionStorage.getItem(STORAGE_EXPIRY_KEY);
    if (stored && expiry && Date.now() < Number(expiry)) {
      setAccessToken(stored);
      setStatus("loading");
      fetchAllUpcomingEvents(stored)
        .then((evts) => { setEvents(evts); setStatus("connected"); })
        .catch(() => { setStatus("error"); sessionStorage.removeItem(STORAGE_KEY); });
    }
  }, []);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse: { access_token: string }) => {
      const token = tokenResponse.access_token;
      sessionStorage.setItem(STORAGE_KEY, token);
      sessionStorage.setItem(STORAGE_EXPIRY_KEY, String(Date.now() + 3600 * 1000));
      setAccessToken(token);
      setStatus("loading");
      try {
        const evts = await fetchAllUpcomingEvents(token);
        setEvents(evts);
        setStatus("connected");
      } catch {
        setStatus("error");
      }
    },
    onError: () => setStatus("error"),
    scope: "https://www.googleapis.com/auth/calendar.readonly",
  });

  const signIn = useCallback(() => googleLogin(), [googleLogin]);

  const signOut = useCallback(() => {
    googleLogout();
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_EXPIRY_KEY);
    setAccessToken(null);
    setEvents([]);
    setStatus("idle");
  }, []);

  const fetchForAccount = useCallback(
    async (accountName: string): Promise<CalendarEvent[]> => {
      if (!accessToken) return [];
      return fetchCalendarEvents(accessToken, accountName);
    },
    [accessToken]
  );

  return { status, events, signIn, signOut, isConnected: status === "connected", fetchForAccount };
}

// ─── Disabled stub (safe to use anywhere, never loads Google scripts) ─────────
export function useGoogleCalendarDisabled(): UseGoogleCalendarReturn {
  return {
    status: "unconfigured",
    events: [],
    signIn: () => console.warn("Google Calendar: set VITE_GOOGLE_CLIENT_ID to enable."),
    signOut: () => {},
    isConnected: false,
    fetchForAccount: async () => [],
  };
}
