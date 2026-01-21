---
order: 1
---

# RedGPU Context
영문테스트
RedGPU Context는 WebGPU 애플리케이션의 핵심 요소입니다.

## 개요

RedGPU Context는 WebGPU 디바이스, 캔버스, 그리고 렌더링 파이프라인을 관리하는 중앙 객체입니다.

## Context 생성

```javascript
import RedGPU from 'redgpu';

const redGPU = await RedGPU({
    canvas: document.getElementById('canvas'),
    powerPreference: 'high-performance'
});
```

## 주요 속성

### canvas

렌더링 대상이 되는 HTML Canvas 요소입니다.

### device

WebGPU 디바이스 객체로, GPU와의 통신을 담당합니다.

### context

WebGPU 컨텍스트로, 캔버스와 GPU 간의 연결을 관리합니다.

## 옵션

Context 생성 시 다양한 옵션을 설정할 수 있습니다:

- `canvas`: 렌더링 대상 캔버스
- `powerPreference`: GPU 전력 설정 ('low-power' | 'high-performance')
- `antialias`: 안티앨리어싱 활성화 여부

## 예제

```javascript
const redGPU = await RedGPU({
    canvas: document.getElementById('canvas'),
    powerPreference: 'high-performance',
    antialias: true
});

console.log('WebGPU Device:', redGPU.device);
```
