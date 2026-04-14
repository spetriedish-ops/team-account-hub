/**
 * Google Calendar API Service
 *
 * Fetches calendar events using a Google OAuth access token.
 * Uses the Google Calendar REST API v3 directly (no SDK needed).
 */

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;        // ISO date string
  startTime: string;   // e.g. "10:00 AM"
  endTime: string;     // e.g. "11:00 AM"
  attendees: string[];
  meetLink?: string;
  hasNotes: boolean;
}

const CALENDAR_API = "https://www.googleapis.com/calendar/v3";

function formatTime(dateTimeStr: string | undefined): string {
  if (!dateTimeStr) return "";
  const d = new Date(dateTimeStr);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function extractMeetLink(event: any): string | undefined {
  // Check conferenceData for Google Meet links
  const entryPoints = event.conferenceData?.entryPoints ?? [];
  const meet = entryPoints.find((ep: any) => ep.entryPointType === "video");
  return meet?.uri;
}

export async function fetchCalendarEvents(
  accessToken: string,
  accountName: string,
  calendarId: string = "primary",
  maxResults: number = 10
): Promise<CalendarEvent[]> {
  try {
    // Fetch events from 30 days ago up to 30 days ahead
    const timeMin = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const timeMax = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const params = new URLSearchParams({
      calendarId,
      timeMin,
      timeMax,
      maxResults: String(maxResults),
      orderBy: "startTime",
      singleEvents: "true",
      q: accountName, // Search events mentioning the account name
    });

    const res = await fetch(
      `${CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events?${params}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      console.warn(`Google Calendar API error: ${res.status} ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    const items: any[] = data.items ?? [];

    return items
      .filter((e) => e.status !== "cancelled")
      .map((e) => ({
        id: e.id,
        title: e.summary ?? "(No title)",
        date: e.start?.dateTime ?? e.start?.date ?? "",
        startTime: formatTime(e.start?.dateTime),
        endTime: formatTime(e.end?.dateTime),
        attendees: (e.attendees ?? []).map((a: any) => a.displayName ?? a.email),
        meetLink: extractMeetLink(e),
        hasNotes: false, // Future: check linked Confluence pages
      }));
  } catch (err) {
    console.warn("Google Calendar fetch failed:", err);
    return [];
  }
}

export async function fetchAllUpcomingEvents(
  accessToken: string,
  calendarId: string = "primary",
  maxResults: number = 20
): Promise<CalendarEvent[]> {
  try {
    const timeMin = new Date().toISOString();
    const timeMax = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

    const params = new URLSearchParams({
      timeMin,
      timeMax,
      maxResults: String(maxResults),
      orderBy: "startTime",
      singleEvents: "true",
    });

    const res = await fetch(
      `${CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events?${params}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      console.warn(`Google Calendar API error: ${res.status}`);
      return [];
    }

    const data = await res.json();
    return (data.items ?? [])
      .filter((e: any) => e.status !== "cancelled")
      .map((e: any) => ({
        id: e.id,
        title: e.summary ?? "(No title)",
        date: e.start?.dateTime ?? e.start?.date ?? "",
        startTime: formatTime(e.start?.dateTime),
        endTime: formatTime(e.end?.dateTime),
        attendees: (e.attendees ?? []).map((a: any) => a.displayName ?? a.email),
        meetLink: extractMeetLink(e),
        hasNotes: false,
      }));
  } catch (err) {
    console.warn("Google Calendar fetch failed:", err);
    return [];
  }
}
