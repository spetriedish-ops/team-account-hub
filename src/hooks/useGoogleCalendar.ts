import { useState, useCallback, useEffect } from "react";
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

// ─── Stub (no Google OAuth) ───────────────────────────────────────────────────
// Used when VITE_GOOGLE_CLIENT_ID is not configured. Never calls useGoogleLogin.
function useGoogleCalendarStub(): UseGoogleCalendarReturn {
  return {
    status: "unconfigured",
    events: [],
    signIn: () => console.warn("Google Calendar: set VITE_GOOGLE_CLIENT_ID to enable."),
    signOut: () => {},
    isConnected: false,
    fetchForAccount: async () => [],
  };
}

// ─── Real hook (requires GoogleOAuthProvider) ─────────────────────────────────
// Dynamically imported so useGoogleLogin is NEVER called when unconfigured.
// This file is only loaded when CLIENT_ID_CONFIGURED is true.
let _useGoogleCalendarReal: (() => UseGoogleCalendarReturn) | null = null;

function getReal(): () => UseGoogleCalendarReturn {
  if (!_useGoogleCalendarReal) {
    // We build the real hook here at call time (not module load time) so that
    // useGoogleLogin is only ever invoked inside a component that is rendered
    // within GoogleOAuthProvider.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useGoogleLogin, googleLogout } = require("@react-oauth/google");

    _useGoogleCalendarReal = function useGoogleCalendarReal(): UseGoogleCalendarReturn {
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
    };
  }
  return _useGoogleCalendarReal;
}

/**
 * useGoogleCalendar
 *
 * When VITE_GOOGLE_CLIENT_ID is not set: returns a safe stub (no Google imports,
 * no GSI script loaded, page renders normally).
 *
 * When VITE_GOOGLE_CLIENT_ID is set: delegates to the real hook which calls
 * useGoogleLogin inside GoogleOAuthProvider. The real hook function is stable
 * (memoised in _useGoogleCalendarReal) so hook call count never changes between
 * renders — React's rules of hooks are satisfied.
 */
export function useGoogleCalendar(): UseGoogleCalendarReturn {
  // CLIENT_ID_CONFIGURED is a module-level constant (never changes at runtime),
  // so this branch is always the same — no rules-of-hooks violation.
  if (!CLIENT_ID_CONFIGURED) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useGoogleCalendarStub();
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return getReal()();
}
