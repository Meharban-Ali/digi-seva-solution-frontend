import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      workbox: {
        cleanupOutdatedCaches: true,
        navigateFallback: "/index.html",
        // Do NOT precache admin JS chunks for public visitors on SW install
        globIgnores: ["**/Admin*.js", "**/ChangePassword*.js", "**/MediaPicker*.js"],
        runtimeCaching: [
          {
            // Public API Calls: Exclude /api/admin/ from service worker runtime caching
            urlPattern: /\/api\/(?!admin\/).*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "public-api-cache",
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours fallback
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Cloudinary Image Assets: Network-First strategy to ensure image updates reflect immediately
            urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "cloudinary-images",
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      manifest: {
        name: "Digi Seva Solution",
        short_name: "DigiSeva",
        description: "Authorized Common Service Center (Jan Seva Kendra) in New Ashok Nagar, Delhi 110096",
        theme_color: "#0f172a",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/@tiptap")) {
            return "tiptap-editor";
          }
          if (id.includes("node_modules/framer-motion")) {
            return "framer-motion";
          }
          if (id.includes("node_modules/@tanstack/react-query")) {
            return "react-query";
          }
          if (id.includes("node_modules/i18next") || id.includes("node_modules/react-i18next")) {
            return "i18n-vendor";
          }
          if (id.includes("node_modules/lucide-react")) {
            return "lucide-icons";
          }
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/") || id.includes("node_modules/react-router-dom/")) {
            return "vendor-core";
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
