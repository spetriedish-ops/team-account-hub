/**
 * useGoogleCalendar — Context-based Google Calendar integration
 *
 * Architecture:
 *   - useGoogleCalendar()         reads from GoogleCalendarContext (safe anywhere)
 *   - GoogleCalendarContext       provided by one of two providers chosen in App.tsx
 *   - useGoogleCalendarEnabled()  real OAuth via useGoogleLogin — only called inside GoogleOAuthProvider
 *   - useGoogleCalendarDisabled() safe no-op stub — used when VITE_GOOGLE_CLIENT_ID is not set
 */

import { useState, useCallback, useEffect, createContext, useContext } from "react";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
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

const GoogleCalendarContext = createContext<UseGoogleCalendarReturn>({
  status: "unconfigured",
  events: [],
  signIn: () => {},
  signOut: () => {},
  isConnected: false,
  fetchForAccount: async () => [],
});

export { GoogleCalendarContext };

/** Read calendar state — safe to call anywhere in the component tree */
export function useGoogleCalendar(): UseGoogleCalendarReturn {
  return useContext(GoogleCalendarContext);
}

// ─── Enabled hook ─────────────────────────────────────────────────────────────
// NOTE: This file imports useGoogleLogin at the top level. That is intentional —
// the module is only ever *executed* (i.e. this hook is only ever *called*) when
// GoogleOAuthProvider is present in the tree (see App.tsx). The import itself is
// safe; it's the *call* to useGoogleLogin that requires the provider.

export function useGoogleCalendarEnabled(): UseGoogleCalendarReturn {
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
    onSuccess: async (tokenResponse) => {
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

// ─── Disabled stub ────────────────────────────────────────────────────────────
// Never imports or calls anything from @react-oauth/google.

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
