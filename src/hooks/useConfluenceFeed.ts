import { useQuery } from "@tanstack/react-query";
import { fetchConfluenceFeed, type ConfluencePage } from "@/services/confluenceService";

/**
 * Fetches Confluence pages labelled "account-team-hub" for the given space key.
 * Refreshes every 5 minutes.
 */
export function useConfluenceFeed(spaceKey: string) {
  return useQuery<ConfluencePage[]>({
    queryKey: ["confluenceFeed", spaceKey],
    queryFn: () => fetchConfluenceFeed(spaceKey),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    retry: 1,
    enabled: !!spaceKey,
  });
}
