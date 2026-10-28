// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      VitePWA({
        // The service worker is generated at build time and registered only from
        // src/pwa/register-sw.ts, which refuses to run in dev/Lovable preview.
        // This project's served files are emitted to dist/client, not dist.
        outDir: "dist/client",
        registerType: "autoUpdate",
        injectRegister: null,
        devOptions: { enabled: false },
        manifest: {
          id: "/",
          name: "Avashesh — Waste Less. Create More.",
          short_name: "Avashesh",
          description:
            "Record agricultural waste, explore rule-based reuse ideas and browse crop residue listings.",
          start_url: "/",
          scope: "/",
          display: "standalone",
          background_color: "#FBF6EC",
          theme_color: "#2C5C2F",
          lang: "en",
          icons: [
            { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
            { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
            {
              src: "/icons/icon-maskable-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
        workbox: {
          globPatterns: ["**/*.{js,css,html,webmanifest,png,jpg,jpeg,svg,woff,woff2}"],
          cleanupOutdatedCaches: true,
          dontCacheBustURLsMatching: /\.[a-f0-9]{8,}\.(js|css)$/,
          maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
          runtimeCaching: [
            {
              // Pages always come from the network while a connection exists. The
              // copy is kept so a page already opened can still be read offline.
              urlPattern: ({ request, sameOrigin }) => sameOrigin && request.mode === "navigate",
              handler: async (options) => {
                const cache = await caches.open("avashesh-pages");
                try {
                  const response = await fetch(options.request);
                  if (response.ok) {
                    try {
                      await cache.put(options.request, response.clone());
                    } catch {
                      // A page that cannot be stored is still served normally.
                    }
                  }
                  return response;
                } catch {
                  const saved = await cache.match(options.request);
                  if (saved) return saved;
                  const offlinePage = await caches.match("/offline.html");
                  if (offlinePage) return offlinePage;
                  return new Response("You are offline.", {
                    status: 503,
                    headers: { "content-type": "text/plain" },
                  });
                }
              },
            },
            {
              // Same-origin hashed build files are immutable, so they may be cached hard.
              urlPattern: ({ url, sameOrigin }) =>
                sameOrigin && /\.[a-f0-9]{8,}\.(js|css)$/.test(url.pathname),
              handler: "CacheFirst",
              options: {
                cacheName: "avashesh-hashed-assets",
                expiration: { maxEntries: 250, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },
          ],
        },
      }),
    ],
  },
});
