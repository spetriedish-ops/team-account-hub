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
  <svg width={size} height={size} viewBox="0 0 127 127" xmlns="http://www.w3.org/2000/svg">
    <path d="M27.2 80c0 7.3-5.9 13.2-13.2 13.2C6.7 93.2.8 87.3.8 80c0-7.3 5.9-13.2 13.2-13.2h13.2V80zm6.6 0c0-7.3 5.9-13.2 13.2-13.2 7.3 0 13.2 5.9 13.2 13.2v33c0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V80z" fill="#E01E5A"/>
    <path d="M47 27c-7.3 0-13.2-5.9-13.2-13.2C33.8 6.5 39.7.6 47 .6c7.3 0 13.2 5.9 13.2 13.2V27H47zm0 6.7c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H13.9C6.6 60.1.7 54.2.7 46.9c0-7.3 5.9-13.2 13.2-13.2H47z" fill="#36C5F0"/>
    <path d="M99.9 46.9c0-7.3 5.9-13.2 13.2-13.2 7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H99.9V46.9zm-6.6 0c0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V13.8C66.9 6.5 72.8.6 80.1.6c7.3 0 13.2 5.9 13.2 13.2v33.1z" fill="#2EB67D"/>
    <path d="M80.1 99.8c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V99.8h13.2zm0-6.6c-7.3 0-13.2-5.9-13.2-13.2 0-7.3 5.9-13.2 13.2-13.2h33.1c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H80.1z" fill="#ECB22E"/>
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
