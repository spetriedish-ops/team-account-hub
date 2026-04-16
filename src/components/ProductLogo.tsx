/**
 * ProductLogo
 * Uses official @atlaskit/logo components for Atlassian products.
 * Slack uses a clean inline SVG (no official package available).
 */

import {
  JiraIcon,
  ConfluenceIcon,
  JiraServiceManagementIcon,
  LoomIcon,
} from "@atlaskit/logo";

interface Props {
  product: "jira" | "confluence" | "slack" | "loom" | "jsm";
  className?: string;
  size?: number;
}

const SlackIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.5 20a2.5 2.5 0 01-2.5-2.5v-7a2.5 2.5 0 015 0v7A2.5 2.5 0 018.5 20z" fill="#E01E5A"/>
    <path d="M8.5 9A2.5 2.5 0 016 6.5 2.5 2.5 0 018.5 4 2.5 2.5 0 0111 6.5V9H8.5z" fill="#E01E5A"/>
    <path d="M20 8.5A2.5 2.5 0 0117.5 6h-7a2.5 2.5 0 010-5h7A2.5 2.5 0 0120 3.5v5z" fill="#36C5F0"/>
    <path d="M23 8.5A2.5 2.5 0 0125.5 6 2.5 2.5 0 0128 8.5 2.5 2.5 0 0125.5 11H23V8.5z" fill="#36C5F0"/>
    <path d="M23.5 12a2.5 2.5 0 012.5 2.5v7a2.5 2.5 0 01-5 0v-7a2.5 2.5 0 012.5-2.5z" fill="#2EB67D"/>
    <path d="M23.5 23A2.5 2.5 0 0126 25.5 2.5 2.5 0 0123.5 28 2.5 2.5 0 0121 25.5V23h2.5z" fill="#2EB67D"/>
    <path d="M12 23.5A2.5 2.5 0 0114.5 26h7a2.5 2.5 0 010 5h-7a2.5 2.5 0 01-2.5-2.5v-5z" fill="#ECB22E"/>
    <path d="M9 23.5A2.5 2.5 0 016.5 26 2.5 2.5 0 014 23.5 2.5 2.5 0 016.5 21H9v2.5z" fill="#ECB22E"/>
  </svg>
);

export const ProductLogo = ({ product, className = "", size = 16 }: Props) => {
  // @atlaskit/logo renders at a fixed internal size; we scale it down with CSS
  // to fit whatever size is requested.
  switch (product) {
    case "jira":
      return (
        <span className={`inline-flex items-center justify-center overflow-hidden shrink-0 ${className}`} style={{ width: size, height: size }}>
          <span style={{ transform: `scale(${size / 32})`, transformOrigin: "center", display: "flex" }}>
            <JiraIcon appearance="brand" size="small" />
          </span>
        </span>
      );
    case "confluence":
      return (
        <span className={`inline-flex items-center justify-center overflow-hidden shrink-0 ${className}`} style={{ width: size, height: size }}>
          <span style={{ transform: `scale(${size / 32})`, transformOrigin: "center", display: "flex" }}>
            <ConfluenceIcon appearance="brand" size="small" />
          </span>
        </span>
      );
    case "jsm":
      return (
        <span className={`inline-flex items-center justify-center overflow-hidden shrink-0 ${className}`} style={{ width: size, height: size }}>
          <span style={{ transform: `scale(${size / 32})`, transformOrigin: "center", display: "flex" }}>
            <JiraServiceManagementIcon appearance="brand" size="small" />
          </span>
        </span>
      );
    case "loom":
      return (
        <span className={`inline-flex items-center justify-center overflow-hidden shrink-0 ${className}`} style={{ width: size, height: size }}>
          <span style={{ transform: `scale(${size / 32})`, transformOrigin: "center", display: "flex" }}>
            <LoomIcon appearance="brand" size="small" />
          </span>
        </span>
      );
    case "slack":
      return (
        <span className={`inline-flex items-center justify-center shrink-0 ${className}`} style={{ width: size, height: size }}>
          <SlackIcon size={size} />
        </span>
      );
    default:
      return null;
  }
};

export default ProductLogo;
