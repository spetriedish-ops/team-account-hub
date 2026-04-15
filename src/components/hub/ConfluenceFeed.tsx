import { motion } from "framer-motion";
import { BookOpen, ExternalLink, Loader2, User } from "lucide-react";
import type { Account } from "@/data/accounts";
import { useConfluenceFeed } from "@/hooks/useConfluenceFeed";

interface Props {
  account: Account;
}

const ConfluenceFeed = ({ account }: Props) => {
  const { data: pages, isLoading, isError } = useConfluenceFeed(
    account.confluenceSpaceKey
  );

  const hasPages = pages && pages.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.3 }}
      className="atlassian-card p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            Confluence Feed
          </h2>
          {hasPages && (
            <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-1.5 py-0.5 rounded font-medium">
              {pages.length} page{pages.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <a
          href={`https://one-atlas-fnjq.atlassian.net/wiki/spaces/${account.confluenceSpaceKey}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"
        >
          Open space
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading Confluence pages…
        </div>
      )}

      {/* Error */}
      {isError && !isLoading && (
        <div className="py-6 text-sm text-muted-foreground text-center">
          Could not load Confluence pages. Check your API token.
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && !hasPages && (
        <div className="py-6 text-sm text-muted-foreground text-center">
          No pages labelled{" "}
          <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
            account-team-hub
          </span>{" "}
          found in the{" "}
          <span className="font-medium">{account.confluenceSpaceKey}</span>{" "}
          space.
        </div>
      )}

      {/* Pages list */}
      {hasPages && (
        <div className="space-y-2">
          {pages.map((page, i) => (
            <motion.a
              key={page.id}
              href={page.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className="flex items-start justify-between p-3 rounded border border-border hover:bg-accent transition-colors group"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-1.5 rounded bg-primary/10 text-primary shrink-0 mt-0.5">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                    {page.title}
                  </p>
                  {page.excerpt && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {page.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="w-2.5 h-2.5" />
                      {page.authorName}
                    </span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">
                      {page.lastModifiedFormatted}
                    </span>
                  </div>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1 ml-2" />
            </motion.a>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ConfluenceFeed;
