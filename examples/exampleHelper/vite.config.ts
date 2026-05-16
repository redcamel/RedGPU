import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import { fileURLToPath } from 'url';
import * as path from 'path';
import * as fs from 'fs';

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
    }),
    injectModulePreload()
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
        chunkFileNames: '[name]-[hash].js',
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/scheduler/')) {
            return 'vendor-react';
          }
        },
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
      compress: {
        drop_console: false,
        drop_debugger: true,
        pure_funcs: ['console.info', 'console.debug'], // [KO] 불필요한 로그 함수 제거 [EN] Remove unnecessary log functions
        passes: 2, // [KO] 압축 패스 증가로 더 최적화 [EN] Increase compress passes for better optimization
      },
      format: {
        comments: false,
        max_line_len: 0
      },
      mangle: {
        toplevel: true, // [KO] 최상위 레벨 변수명도 난독화 [EN] Mangle top-level variable names
      }
    },
    sourcemap: false,
    emptyOutDir: true
  }
});

// Custom Plugin to inject modulepreload tags into index.html
function injectModulePreload() {
  return {
    name: 'inject-modulepreload',
    writeBundle(options: any, bundle: any) {
      const htmlPath = path.resolve(__dirname, '../index.html');
      
      if (fs.existsSync(htmlPath)) {
        let html = fs.readFileSync(htmlPath, 'utf-8');
        
        // [KO] 엔트리가 아니고, 리스트 페이지에서 필요 없는 청크들 제외
        // [EN] Filter out entries and chunks not needed for the list page
        const chunks = Object.values(bundle).filter((b: any) => {
          if (b.type !== 'chunk' || b.isEntry) return false;
          
          // [KO] 리스트 페이지에 불필요한 무거운 컴포넌트들 제외
          // [EN] Exclude heavy components unnecessary for the list page
          const excludedNames = ['GuiPanel', 'GuiIBL', 'GuiSkyBox'];
          return !excludedNames.some(name => b.fileName.includes(name));
        });

        const preloadTags = chunks.map((c: any) => `<link rel="modulepreload" href="./exampleHelper/dist/${c.fileName}">`).join('\n    ');
        
        const regex = /<!-- JS Module Preloading[\s\S]*?<style>/;
        const replacement = `<!-- JS Module Preloading (Resolve Critical Request Chain) -->\n    ${preloadTags}\n\n    <style>`;
        
        if (regex.test(html)) {
          html = html.replace(regex, replacement);
          fs.writeFileSync(htmlPath, html);
          console.log(`\n[SEO] Successfully injected ${chunks.length} modulepreload links into examples/index.html`);
        }
      }
    }
  };
}