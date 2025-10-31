import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Increase warning threshold slightly and manually split large vendor libs
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) return 'vendor_firebase'
            if (id.includes('@mui') || id.includes('material-ui')) return 'vendor_mui'
            if (id.includes('react') || id.includes('react-dom')) return 'vendor_react'
            return 'vendor'
          }
        },
      },
    },
  },
})
