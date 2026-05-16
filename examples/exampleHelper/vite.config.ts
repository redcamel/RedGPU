import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import { fileURLToPath } from 'url';
import * as path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(), 
    cssInjectedByJsPlugin({
      injectCodeFunction: function injectCodeCustomRunTimeFunction(cssCode) {
        try {
          if (typeof document != 'undefined') {
            var elementStyle = document.createElement('style');
            elementStyle.appendChild(document.createTextNode(cssCode));
            document.head.appendChild(elementStyle);
          }
        } catch (e) {
          console.error('vite-plugin-css-injected-by-js', e);
        }
      },
      jsAssetsFilterFunction: function customJsAssetsfilterFunction(outputChunk) {
        // Inject into both entry files
        return outputChunk.fileName == 'index.js' || outputChunk.fileName == 'examples.js';
      }
    })
  ],
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
        index: path.resolve(__dirname, 'src/viewerApp/index.tsx'),
        examples: path.resolve(__dirname, 'src/examplesApp/examples.tsx')
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
