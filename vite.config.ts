import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.jsx'),
      name: 'react-crypto-pay',
      fileName: (format) => `react-crypto-pay.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          "react-dom": "ReactDOM"
        }
      }
    },
    sourcemap: true,
    emptyOutDir: true
  },
  plugins: [react()]
})
