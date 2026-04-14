import { useQuery } from "@tanstack/react-query";
import { fetchNextMeeting, type NextMeeting } from "@/services/calendarService";

/**
 * Hook that fetches the next upcoming meeting from Google Calendar.
 * Refreshes every 5 minutes so the tile stays current throughout the day.
 */
export function useNextMeeting() {
  return useQuery<NextMeeting | null>({
    queryKey: ["nextMeeting"],
    queryFn: fetchNextMeeting,
    staleTime: 5 * 60 * 1000,      // 5 minutes
    refetchInterval: 5 * 60 * 1000, // auto-refresh every 5 minutes
    retry: 1,
  });
}
