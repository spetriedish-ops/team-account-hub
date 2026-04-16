/**
 * Jira API Service
 *
 * Fetches live data from a Jira Cloud project via the Atlassian REST API.
 * Falls back to empty arrays if the API is unavailable (the UI will show
 * mock data instead).
 *
 * The Vite dev server proxies /jira-api/* to the real Atlassian site to
 * avoid CORS issues.
 */

export interface JiraIssue {
  key: string;
  summary: string;
  status: string;
  priority: string;
  assignee: string | null;
  labels: string[];
  created: string;
  updated: string;
  url: string;
}

const JIRA_BASE = "/jira-api";
const JIRA_PROJECT = "HUB";
const JIRA_SITE = "https://one-atlas-fnjq.atlassian.net";

async function jiraFetch(path: string): Promise<any> {
  const res = await fetch(`${JIRA_BASE}${path}`, {
    headers: {
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`Jira API ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

function mapIssue(raw: any): JiraIssue {
  return {
    key: raw.key,
    summary: raw.fields?.summary ?? "",
    status: raw.fields?.status?.name ?? "Unknown",
    priority: raw.fields?.priority?.name ?? "Medium",
    assignee: raw.fields?.assignee?.displayName ?? null,
    labels: raw.fields?.labels ?? [],
    created: raw.fields?.created ?? "",
    updated: raw.fields?.updated ?? "",
    url: `${JIRA_SITE}/browse/${raw.key}`,
  };
}

export async function fetchIssuesByJql(jql: string): Promise<JiraIssue[]> {
  try {
    const data = await jiraFetch(
      `/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}&maxResults=50&fields=summary,status,priority,assignee,labels,created,updated`
    );
    return (data.issues ?? []).map(mapIssue);
  } catch (err) {
    console.warn("Jira API unavailable, using mock data:", err);
    return [];
  }
}

export async function fetchAccountIssues(
  accountLabel: string
): Promise<JiraIssue[]> {
  return fetchIssuesByJql(
    `project = ${JIRA_PROJECT} AND labels = "${accountLabel}" AND status != Done ORDER BY priority ASC, updated DESC`
  );
}

export async function fetchGrayAreaIssues(
  accountLabel: string
): Promise<JiraIssue[]> {
  // Gray Area = unclaimed issues (no assignee) — these are the dangerous ones
  return fetchIssuesByJql(
    `project = ${JIRA_PROJECT} AND labels = "${accountLabel}" AND assignee is EMPTY AND status != Done ORDER BY priority ASC, created DESC`
  );
}

export async function fetchUnclaimedIssues(
  accountLabel: string
): Promise<JiraIssue[]> {
  // Alias for gray area — same concept
  return fetchGrayAreaIssues(accountLabel);
}

export async function fetchP1Issues(
  accountLabel: string
): Promise<JiraIssue[]> {
  return fetchIssuesByJql(
    `project = ${JIRA_PROJECT} AND labels = "${accountLabel}" AND priority = Highest AND status != Done ORDER BY created DESC`
  );
}

export async function fetchHighPriorityITOIssues(): Promise<JiraIssue[]> {
  return fetchIssuesByJql(
    `project = ITO AND status != Done ORDER BY priority ASC, created DESC`
  );
}

export async function fetchAllOpenIssues(): Promise<JiraIssue[]> {
  return fetchIssuesByJql(
    `project = ${JIRA_PROJECT} AND status != Done ORDER BY priority ASC, updated DESC`
  );
}

async function jiraWrite(
  path: string,
  method: "PUT" | "POST",
  body: any
): Promise<{ ok: boolean; status: number }> {
  // Route write operations through our server-side API to avoid XSRF issues
  const res = await fetch("/api/jira-write", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, method, payload: body }),
  });
  const data = await res.json();
  return { ok: data.status >= 200 && data.status < 300, status: data.status };
}

let cachedAccountId: string | null = null;

async function getCurrentUserAccountId(): Promise<string> {
  if (cachedAccountId) return cachedAccountId;
  const data = await jiraFetch("/rest/api/3/myself");
  cachedAccountId = data.accountId;
  return data.accountId;
}

export async function claimIssue(issueKey: string): Promise<boolean> {
  try {
    const accountId = await getCurrentUserAccountId();
    const res = await jiraWrite(
      `/rest/api/3/issue/${issueKey}/assignee`,
      "PUT",
      { accountId }
    );

    if (!res.ok) {
      console.warn(`Claim failed, status: ${res.status}`);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("Failed to claim issue:", err);
    return false;
  }
}

export async function transitionIssue(
  issueKey: string,
  transitionName: string
): Promise<boolean> {
  try {
    // First, get available transitions
    const transData = await jiraFetch(
      `/rest/api/3/issue/${issueKey}/transitions`
    );
    console.log(
      `Available transitions for ${issueKey}:`,
      transData.transitions?.map((t: any) => `${t.id}:${t.name}->${t.to.name}`)
    );

    // Match by transition name OR by destination status name
    const transition = transData.transitions?.find(
      (t: any) =>
        t.name.toLowerCase() === transitionName.toLowerCase() ||
        t.to.name.toLowerCase() === transitionName.toLowerCase()
    );
    if (!transition) {
      console.warn(
        `Transition "${transitionName}" not found for ${issueKey}. Available:`,
        transData.transitions?.map((t: any) => t.name)
      );
      return false;
    }

    console.log(
      `Transitioning ${issueKey} via "${transition.name}" (id:${transition.id}) -> "${transition.to.name}"`
    );

    const res = await jiraWrite(
      `/rest/api/3/issue/${issueKey}/transitions`,
      "POST",
      { transition: { id: transition.id } }
    );

    if (!res.ok) {
      console.warn(`Transition failed for ${issueKey}: ${res.status}`);
    }
    return res.ok;
  } catch (err) {
    console.warn("Failed to transition issue:", err);
    return false;
  }
}
