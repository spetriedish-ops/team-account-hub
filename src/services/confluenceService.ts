/**
 * Confluence Service
 *
 * Fetches Confluence pages from a given space that have the label
 * "account-team-hub". Proxies requests through the Vite dev server
 * at /confluence-api/* to avoid CORS issues — the same pattern used
 * by jiraService.ts.
 */

export interface ConfluencePage {
  id: string;
  title: string;
  url: string;
  space: string;
  lastModified: string;       // ISO date string
  lastModifiedFormatted: string; // e.g. "Apr 14, 2026"
  authorName: string;
  authorAvatar: string | null;
  excerpt: string;
}

const CONFLUENCE_BASE = "/confluence-api";
const CONFLUENCE_SITE = "https://one-atlas-fnjq.atlassian.net";
const FEED_LABEL = "account-team-hub";
const MAX_RESULTS = 8;

async function confluenceFetch(path: string): Promise<any> {
  const res = await fetch(`${CONFLUENCE_BASE}${path}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`Confluence API ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

function mapPage(raw: any): ConfluencePage {
  const lastModified = raw.version?.when ?? raw.history?.lastUpdated?.when ?? "";
  const lastModifiedFormatted = lastModified
    ? new Date(lastModified).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Unknown date";

  const authorName =
    raw.version?.by?.displayName ??
    raw.history?.lastUpdated?.by?.displayName ??
    "Unknown";

  const authorAvatar =
    raw.version?.by?.profilePicture?.path
      ? `${CONFLUENCE_SITE}${raw.version.by.profilePicture.path}`
      : null;

  // Strip HTML tags from excerpt for plain text preview
  const rawExcerpt =
    raw.excerpt ?? raw.body?.view?.value ?? "";
  const excerpt = rawExcerpt
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);

  return {
    id: raw.id,
    title: raw.title,
    url: `${CONFLUENCE_SITE}/wiki${raw._links?.webui ?? `/spaces/${raw.space?.key}/pages/${raw.id}`}`,
    space: raw.space?.name ?? raw.space?.key ?? "",
    lastModified,
    lastModifiedFormatted,
    authorName,
    authorAvatar,
    excerpt,
  };
}

/**
 * Fetch Confluence pages in a given space labelled "account-team-hub",
 * ordered by most recently modified.
 */
export async function fetchConfluenceFeed(
  spaceKey: string
): Promise<ConfluencePage[]> {
  if (!spaceKey) return [];

  try {
    const cql = encodeURIComponent(
      `space = "${spaceKey}" AND label = "${FEED_LABEL}" ORDER BY lastmodified DESC`
    );
    const data = await confluenceFetch(
      `/wiki/rest/api/content/search?cql=${cql}&limit=${MAX_RESULTS}&expand=version,space,history.lastUpdated,excerpt`
    );
    return (data.results ?? []).map(mapPage);
  } catch (err) {
    console.warn("Confluence API unavailable:", err);
    return [];
  }
}
