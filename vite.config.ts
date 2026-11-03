import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'PersonCardNav — People Directory',
        short_name: 'PersonCardNav',
        description: 'Browse, search, and filter a people directory powered by DummyJSON.',
        theme_color: '#5b3df5',
        background_color: '#f6f6fb',
        display: 'standalone',
        icons: [{ src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
      },
      workbox: {
        // Precaches the app shell (JS/CSS/HTML) so the SPA itself loads
        // offline. DummyJSON API data has its own IndexedDB cache
        // (src/offline) with real query semantics, not a generic HTTP cache.
        globPatterns: ['**/*.{js,css,html,svg,woff2}'],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
})
