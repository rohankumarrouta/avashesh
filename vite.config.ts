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
          // Navigations are fetched from the network first; this page is the last
          // resort when the device is offline and the page was never opened before.
          navigateFallback: "/offline.html",
          navigateFallbackDenylist: [/^\/~oauth/, /^\/api\//, /^\/\.well-known\//],
          cleanupOutdatedCaches: true,
          dontCacheBustURLsMatching: /\.[a-f0-9]{8,}\.(js|css)$/,
          maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
          runtimeCaching: [
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
