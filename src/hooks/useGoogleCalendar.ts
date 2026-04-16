import { useState, useCallback, useEffect } from "react";
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

/**
 * useGoogleCalendar
 *
 * Always calls useGoogleLogin (satisfying React's rules of hooks), but the
 * GoogleOAuthProvider is only rendered in App.tsx when VITE_GOOGLE_CLIENT_ID
 * is set — so this is safe.
 *
 * When unconfigured the signIn callback is a no-op and status stays "unconfigured".
 */
export function useGoogleCalendar(): UseGoogleCalendarReturn {
  const [status, setStatus] = useState<GoogleCalendarStatus>(
    CLIENT_ID_CONFIGURED ? "idle" : "unconfigured"
  );
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Restore token from sessionStorage on mount
  useEffect(() => {
    if (!CLIENT_ID_CONFIGURED) return;
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

  const signIn = useCallback(() => {
    if (!CLIENT_ID_CONFIGURED) {
      console.warn("Google Calendar: set VITE_GOOGLE_CLIENT_ID to enable.");
      return;
    }
    googleLogin();
  }, [googleLogin]);

  const signOut = useCallback(() => {
    googleLogout();
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_EXPIRY_KEY);
    setAccessToken(null);
    setEvents([]);
    setStatus(CLIENT_ID_CONFIGURED ? "idle" : "unconfigured");
  }, []);

  const fetchForAccount = useCallback(
    async (accountName: string): Promise<CalendarEvent[]> => {
      if (!accessToken) return [];
      return fetchCalendarEvents(accessToken, accountName);
    },
    [accessToken]
  );

  return {
    status,
    events,
    signIn,
    signOut,
    isConnected: status === "connected",
    fetchForAccount,
  };
}
