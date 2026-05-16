import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import * as path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@redgpu/src': path.resolve(__dirname, '../../src')
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  build: {
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.tsx'),
        examples: path.resolve(__dirname, 'src/examples.tsx')
      },
      name: 'RedGPUExampleHelper',
      fileName: (format, entryName) => `${entryName}.js`,
      formats: ['es']
    },
    rollupOptions: {
      output: {
        plugins: [
          {
            name: 'strip-pure-comments',
            renderChunk(code) {
              return {
                code: code.replace(/\/\*\s*@__PURE__\s*\*\//g, ''),
                map: null
              };
            }
          }
        ]
      }
    },
    minify: 'terser',
    assetsInlineLimit: 0,
    terserOptions: {
      format: {
        comments: false,
        max_line_len: 0
      }
    },
    sourcemap: false,
    emptyOutDir: true
  }
});
