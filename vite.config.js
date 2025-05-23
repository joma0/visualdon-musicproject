import { defineConfig } from 'vite'
import dsv from '@rollup/plugin-dsv'

export default defineConfig({
  plugins: [dsv()],
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          d3: [
            'd3',
            'd3-array',
            'd3-axis',
            'd3-selection',
            'd3-scale',
            'd3-force',
            'd3-shape',
            'd3-transition'
          ]
        }
      }
    }
  },
  css: './postcss.config.cjs',
  optimizeDeps: {
    include: [
      'd3',
      'd3-selection',
      'd3-scale',
      'd3-array',
      'd3-force',
      'd3-transition',
      'd3-shape'
    ]
  }
})