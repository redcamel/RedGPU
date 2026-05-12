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
      '@redgpu/src': path.resolve(__dirname, '../src')
    }
  },
  define: {
    // 브라우저 환경에서 리액트 프로덕션 빌드로 동작하도록 고정하여 용량 최적화
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  build: {
    // 라이브러리 모드로 작동하여 단일 ESM 파일 생성
    lib: {
      entry: path.resolve(__dirname, 'src/index.tsx'),
      name: 'RedGPUInspector',
      fileName: () => `index.js`,
      formats: ['es']
    },
    rollupOptions: {
      // 모든 의존성(React, Zustand 등)을 번들에 포함하여 Standalone 파일 생성
      external: [],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          zustand: 'zustand'
        }
      }
    },
    // 최적화: 코드 압축 및 소스맵 제거
    minify: 'terser',
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
