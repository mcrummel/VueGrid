/* eslint-disable @typescript-eslint/no-unused-vars */
import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  build: {
    minify: true,
    reportCompressedSize: true,
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'lib/vue-grid.ts'),
      name: 'vue-grid',
      // the proper extensions will be added
      fileName: 'vue-grid',
      formats: ['es', 'cjs', 'umd']
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      // Provide global variables to use in the UMD build
      // for externalized deps
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://ghoapi.azureedge.net',
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err)
          })
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url)
          })
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url)
          })
        }
      }
    }
  }
})
