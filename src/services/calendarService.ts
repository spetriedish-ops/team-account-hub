/**
 * Google Calendar Service
 *
 * Fetches the next upcoming meeting from the user's Google Calendar
 * via a server-side proxy endpoint to avoid CORS / OAuth issues.
 *
 * The Vite dev server exposes /api/calendar/next-meeting which proxies
 * to the Google Calendar API.
 */

export interface NextMeeting {
  title: string;
  date: string;       // ISO date string
  time: string;       // formatted time string, e.g. "2:30 PM"
  dateTime: string;   // full ISO datetime
  isAllDay: boolean;
}

const CALENDAR_API = "/api/calendar/next-meeting";

export async function fetchNextMeeting(): Promise<NextMeeting | null> {
  try {
    const res = await fetch(CALENDAR_API, {
      headers: { Accept: "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Calendar API ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();

    if (!data || !data.summary) {
      return null;
    }

    // Parse start time — Google Calendar events can be all-day (date only)
    // or timed (dateTime)
    const isAllDay = !!data.start?.date && !data.start?.dateTime;
    const startRaw = data.start?.dateTime ?? data.start?.date ?? "";

    const startDate = new Date(startRaw);

    const time = isAllDay
      ? "All day"
      : startDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

    const date = startDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    return {
      title: data.summary,
      date,
      time,
      dateTime: startRaw,
      isAllDay,
    };
  } catch (err) {
    console.warn("Google Calendar API unavailable:", err);
    return null;
  }
}
