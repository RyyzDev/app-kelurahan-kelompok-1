import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: [
      'churchy-unpacifistic-velva.ngrok-free.dev'
    ],
    hmr: {
      clientPort: 443 // Paksa HMR client menggunakan port HTTPS (Ngrok)
    }
  },
  plugins: [
     react(),
     tailwindcss(),
     VitePWA({
       registerType: 'autoUpdate',
       devOptions: {
         enabled: true,
         type: 'module'
       },
       includeAssets: ['manifest.json'],
       workbox: {
         globPatterns: ['**/*.{js,css,html,svg,png,ico,json}'],
         navigateFallback: '/index.html',
         navigateFallbackAllowlist: [/^(?!\/__).*/],
         cleanupOutdatedCaches: true,
         clientsClaim: true,
         skipWaiting: true,
         runtimeCaching: [
           {
             urlPattern: ({ request }) => request.mode === 'navigate',
             handler: 'NetworkFirst',
             options: {
               cacheName: 'pages-cache',
               networkTimeoutSeconds: 3,
               expiration: {
                 maxEntries: 50,
                 maxAgeSeconds: 60 * 60 * 24 // 24 hours
               },
               cacheableResponse: {
                 statuses: [0, 200]
               }
             }
           },
           {
             urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
             handler: 'CacheFirst',
             options: {
               cacheName: 'google-fonts-cache',
               expiration: {
                 maxEntries: 10,
                 maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
               },
               cacheableResponse: {
                 statuses: [0, 200]
               }
             }
           },
           {
             urlPattern: /\/api\/warga\/surat\/layanan/i,
             handler: 'StaleWhileRevalidate',
             options: {
               cacheName: 'layanan-surat-cache',
               expiration: {
                 maxEntries: 50,
                 maxAgeSeconds: 60 * 60 * 24 // 24 hours
               }
             }
           },
           {
             urlPattern: /\/api\/warga\/surat\/permohonan/i,
             handler: 'StaleWhileRevalidate',
             options: {
               cacheName: 'warga-surat-cache',
               expiration: {
                 maxEntries: 100,
                 maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
               },
               cacheableResponse: {
                 statuses: [0, 200]
               }
             }
           },
           {
             urlPattern: /\/api\/admin\/permohonan/i,
             handler: 'StaleWhileRevalidate',
             options: {
               cacheName: 'admin-surat-cache',
               expiration: {
                 maxEntries: 100,
                 maxAgeSeconds: 60 * 60 * 24 // 24 hours
               },
               cacheableResponse: {
                 statuses: [0, 200]
               }
             }
           },
           {
             urlPattern: /\/api\/user\/profile/i,
             handler: 'NetworkFirst',
             options: {
               cacheName: 'user-profile-cache',
               expiration: {
                 maxEntries: 1,
                 maxAgeSeconds: 60 * 60 * 24 // 24 hours
               },
               cacheableResponse: {
                 statuses: [0, 200]
               }
             }
           }
         ]
       },
       manifest: {
         name: 'SI-GERCAP Kelurahan',
         short_name: 'SI-GERCAP',
         description: 'Sistem Informasi Gerakan Cepat Kelurahan - Digitalisasi Layanan Publik',
         theme_color: '#0047AB',
         background_color: '#F8FAFC',
         display: 'standalone',
         orientation: 'portrait',
         scope: '/',
         start_url: '/',
         icons: [
           {
             src: 'logo192.png',
             sizes: '192x192',
             type: 'image/png'
           },
           {
             src: 'logo512.png',
             sizes: '512x512',
             type: 'image/png'
           },
           {
             src: 'logo512.png',
             sizes: '512x512',
             type: 'image/png',
             purpose: 'any maskable'
           }
         ]
       }
     }),
   ],
})
