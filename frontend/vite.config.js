import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    port: 5173,

    // Anything the app requests at /api/... is forwarded to the backend by the
    // dev server. The browser therefore only ever talks to localhost:5173, so
    // the request is same-origin and CORS never comes into play.
    //
    // It also means the frontend no longer hardcodes a backend port. If the
    // backend port changes, only this one line changes.
    proxy: {
      // 127.0.0.1, not "localhost". The API binds to loopback IPv4 only, and on
      // Windows "localhost" can resolve to the IPv6 address ::1 first — which
      // would make every proxied call fail with a connection error.
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
})
