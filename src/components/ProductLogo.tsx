/**
 * ProductLogo
 * Inline SVG logos for Atlassian products + Slack + Loom.
 * Using inline SVGs guarantees no network dependency during the demo.
 */

interface Props {
  product: "jira" | "confluence" | "slack" | "loom" | "jsm";
  className?: string;
  size?: number;
}

export const ProductLogo = ({ product, className = "", size = 16 }: Props) => {
  const s = size;

  switch (product) {
    case "jira":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="jira-g1" x1="23.16" y1="14.38" x2="15.18" y2="22.36" gradientUnits="userSpaceOnUse">
              <stop offset="0.18" stopColor="#0052CC"/>
              <stop offset="1" stopColor="#2684FF"/>
            </linearGradient>
            <linearGradient id="jira-g2" x1="8.94" y1="17.7" x2="16.92" y2="9.72" gradientUnits="userSpaceOnUse">
              <stop offset="0.18" stopColor="#0052CC"/>
              <stop offset="1" stopColor="#2684FF"/>
            </linearGradient>
          </defs>
          <path d="M15.89 1.01L1.36 15.54a1.22 1.22 0 000 1.72l6.73 6.73 8.16-8.16 6.62-6.62-6.98-8.2z" fill="url(#jira-g2)"/>
          <path d="M15.89 30.99l14.53-14.53a1.22 1.22 0 000-1.72l-6.73-6.73-8.16 8.16-6.62 6.62 6.98 8.2z" fill="url(#jira-g1)"/>
        </svg>
      );

    case "confluence":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="conf-g1" x1="25.13" y1="27.4" x2="10.26" y2="18.79" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#0052CC"/>
              <stop offset="0.92" stopColor="#2380FB"/>
              <stop offset="1" stopColor="#2684FF"/>
            </linearGradient>
            <linearGradient id="conf-g2" x1="6.87" y1="4.6" x2="21.74" y2="13.21" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#0052CC"/>
              <stop offset="0.92" stopColor="#2380FB"/>
              <stop offset="1" stopColor="#2684FF"/>
            </linearGradient>
          </defs>
          <path d="M1.64 22.6c-.34.55-.72 1.27-.05 1.76l9.01 5.7c.67.43 1.27.08 1.62-.49l4.06-6.96c-3.41.17-7.07-.05-14.64-.01z" fill="url(#conf-g1)"/>
          <path d="M30.36 9.4c.34-.55.72-1.27.05-1.76L21.4 1.94c-.67-.43-1.27-.08-1.62.49l-4.06 6.96c3.41-.17 7.07.05 14.64.01z" fill="url(#conf-g2)"/>
          <path d="M15.72 22.61l-4.06 6.96s3.56 2.18 8.28 0l4.1-7.05c-2.12.12-5.4.28-8.32.09z" fill="#2684FF"/>
          <path d="M16.28 9.39l4.06-6.96S16.78.25 12.06 2.43l-4.1 7.05c2.12-.12 5.4-.28 8.32-.09z" fill="#2684FF"/>
        </svg>
      );

    case "slack":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
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

    case "loom":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <circle cx="16" cy="16" r="16" fill="#625DF5"/>
          <circle cx="16" cy="16" r="6" fill="white"/>
          <path d="M16 7l2.47 6.76L26 16l-7.53 2.24L16 25l-2.47-6.76L6 16l7.53-2.24z" fill="white" opacity="0.6"/>
        </svg>
      );

    case "jsm":
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
          <defs>
            <linearGradient id="jsm-g" x1="6" y1="6" x2="26" y2="26" gradientUnits="userSpaceOnUse">
              <stop stopColor="#2684FF"/>
              <stop offset="1" stopColor="#0052CC"/>
            </linearGradient>
          </defs>
          <rect width="32" height="32" rx="6" fill="url(#jsm-g)"/>
          <path d="M16 8l2.4 5.6L24 16l-5.6 2.4L16 24l-2.4-5.6L8 16l5.6-2.4z" fill="white"/>
        </svg>
      );

    default:
      return null;
  }
};

export default ProductLogo;
