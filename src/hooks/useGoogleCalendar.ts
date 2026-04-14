import { useState, useCallback, useEffect } from "react";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";
import { fetchCalendarEvents, fetchAllUpcomingEvents, type CalendarEvent } from "@/services/googleCalendarService";

const STORAGE_KEY = "gcal_access_token";
const STORAGE_EXPIRY_KEY = "gcal_token_expiry";

export type GoogleCalendarStatus = "idle" | "loading" | "connected" | "error";

export interface UseGoogleCalendarReturn {
  status: GoogleCalendarStatus;
  events: CalendarEvent[];
  signIn: () => void;
  signOut: () => void;
  isConnected: boolean;
  fetchForAccount: (accountName: string) => Promise<CalendarEvent[]>;
}

export function useGoogleCalendar(): UseGoogleCalendarReturn {
  const [status, setStatus] = useState<GoogleCalendarStatus>("idle");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Restore token from session storage on mount
  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    const expiry = sessionStorage.getItem(STORAGE_EXPIRY_KEY);
    if (stored && expiry && Date.now() < Number(expiry)) {
      setAccessToken(stored);
      setStatus("loading");
      fetchAllUpcomingEvents(stored)
        .then((evts) => {
          setEvents(evts);
          setStatus("connected");
        })
        .catch(() => {
          setStatus("error");
          sessionStorage.removeItem(STORAGE_KEY);
        });
    }
  }, []);

  const signIn = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const token = tokenResponse.access_token;
      // Store token with 1-hour expiry
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

  return {
    status,
    events,
    signIn,
    signOut,
    isConnected: status === "connected",
    fetchForAccount,
  };
}
