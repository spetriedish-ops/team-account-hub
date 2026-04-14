import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, FileText, Video, LogIn, LogOut, Loader2, ExternalLink } from "lucide-react";
import type { Account } from "@/data/accounts";
import { MOCK_MEETINGS } from "@/data/mockActivity";
import { useGoogleCalendar } from "@/hooks/useGoogleCalendar";
import type { CalendarEvent } from "@/services/googleCalendarService";

interface Props {
  account: Account;
}

const RecentMeetings = ({ account }: Props) => {
  const { status, signIn, signOut, isConnected, fetchForAccount } = useGoogleCalendar();
  const [liveEvents, setLiveEvents] = useState<CalendarEvent[]>([]);

  // Fetch account-specific events when connected
  useEffect(() => {
    if (isConnected) {
      fetchForAccount(account.name).then(setLiveEvents);
    } else {
      setLiveEvents([]);
    }
  }, [isConnected, account.name, fetchForAccount]);

  // Use live events if connected, otherwise fall back to mock data
  const mockMeetings = MOCK_MEETINGS[account.jiraLabel] ?? [];
  const hasLiveEvents = isConnected && liveEvents.length > 0;
  const hasMockMeetings = mockMeetings.length > 0;

  if (!hasLiveEvents && !hasMockMeetings && status !== "loading") {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.3 }}
      className="atlassian-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            Recent Meetings
          </h2>
          {isConnected && (
            <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded font-medium">
              Live
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isConnected ? (
            <button
              onClick={signOut}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
              title="Disconnect Google Calendar"
            >
              <LogOut className="w-3 h-3" />
              Disconnect
            </button>
          ) : (
            <button
              onClick={() => signIn()}
              className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
            >
              <LogIn className="w-3 h-3" />
              Connect Google Calendar
            </button>
          )}
        </div>
      </div>

      {/* Loading state */}
      {status === "loading" && (
        <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading calendar events…
        </div>
      )}

      {/* Live Google Calendar events */}
      {hasLiveEvents && (
        <div className="space-y-2">
          {liveEvents.map((evt, i) => (
            <motion.div
              key={evt.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className="flex items-center justify-between p-3 rounded border border-border hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded bg-primary/10 text-primary">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{evt.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(evt.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                    {evt.startTime && ` · ${evt.startTime}`}
                    {evt.endTime && ` – ${evt.endTime}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {evt.hasNotes && (
                  <span className="flex items-center gap-1 text-xs text-hub-success font-medium">
                    <FileText className="w-3 h-3" />
                    Notes
                  </span>
                )}
                {evt.meetLink ? (
                  <a
                    href={evt.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                  >
                    <Video className="w-3 h-3" />
                    Join
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Video className="w-3 h-3" />
                    Recording
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Connected but no matching events for this account */}
      {isConnected && liveEvents.length === 0 && status !== "loading" && (
        <div className="py-4 text-sm text-muted-foreground text-center">
          No calendar events found mentioning "{account.name}"
        </div>
      )}

      {/* Fallback mock meetings when not connected */}
      {!isConnected && status !== "loading" && (
        <div className="space-y-2">
          {mockMeetings.map((mtg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className="flex items-center justify-between p-3 rounded border border-border hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded bg-primary/10 text-primary">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{mtg.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(mtg.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {mtg.hasNotes && (
                  <span className="flex items-center gap-1 text-xs text-hub-success font-medium">
                    <FileText className="w-3 h-3" />
                    Notes
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Video className="w-3 h-3" />
                  Recording
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default RecentMeetings;
