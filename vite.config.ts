import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

function jiraWriteApi(jiraToken: string): Plugin {
  const jiraSite = "https://one-atlas-fnjq.atlassian.net";

  return {
    name: "jira-write-api",
    configureServer(server) {
      server.middlewares.use("/api/jira-write", (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end("Method not allowed");
          return;
        }

        let body = "";
        req.on("data", (chunk: Buffer) => {
          body += chunk.toString();
        });
        req.on("end", async () => {
          try {
            const { path: apiPath, method, payload } = JSON.parse(body);
            const response = await fetch(`${jiraSite}${apiPath}`, {
              method: method || "POST",
              headers: {
                Authorization: `Basic ${jiraToken}`,
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-Atlassian-Token": "no-check",
              },
              body: payload ? JSON.stringify(payload) : undefined,
            });

            const text = await response.text();
            res.statusCode = 200; // Always 200 to the client; real status in body
            res.setHeader("Content-Type", "application/json");
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.end(
              JSON.stringify({ status: response.status, body: text || null })
            );
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });

      // Handle CORS preflight for the API endpoint
      server.middlewares.use("/api/jira-write", (req, res, next) => {
        if (req.method === "OPTIONS") {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
          res.setHeader("Access-Control-Allow-Headers", "Content-Type");
          res.statusCode = 204;
          res.end();
          return;
        }
        next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
      proxy: {
        "/jira-api": {
          target: "https://one-atlas-fnjq.atlassian.net",
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/jira-api/, ""),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq) => {
              const token = env.VITE_JIRA_API_TOKEN;
              if (token) {
                proxyReq.setHeader("Authorization", `Basic ${token}`);
              }
              proxyReq.setHeader("X-Atlassian-Token", "no-check");
              proxyReq.removeHeader("origin");
              proxyReq.removeHeader("referer");
            });
          },
        },
      },
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      env.VITE_JIRA_API_TOKEN && jiraWriteApi(env.VITE_JIRA_API_TOKEN),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
  };
});
