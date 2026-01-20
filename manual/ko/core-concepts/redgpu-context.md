# RedGPU Context

RedGPU Context는 RedGPU 애플리케이션의 핵심이 되는 중앙 제어 객체입니다.

## 개요

RedGPU Context는 WebGPU 디바이스(Device), 캔버스(Canvas), 그리고 렌더링에 필요한 각종 상태와 리소스를 총괄 관리합니다. 모든 RedGPU의 구성 요소(Scene, Mesh, Material 등)는 이 컨텍스트를 통해 생성되고 연결됩니다.

## Context 생성

`RedGPU.init` 함수를 통해 컨텍스트를 초기화하고 획득할 수 있습니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 초기화 성공 시 redGPUContext를 사용할 수 있습니다.
        console.log('RedGPU Context 획득:', redGPUContext);
    },
    (error) => {
        // WebGPU 미지원 브라우저 등 초기화 실패 시 처리
        console.error('초기화 실패:', error);
    }
);
```

## 주요 역할

### 1. 리소스 관리
GPU 메모리에 업로드되는 텍스처, 버퍼, 파이프라인 등을 내부적으로 추적하고 관리합니다.

### 2. 캔버스 연결
WebGPU가 화면에 그림을 그릴 수 있도록 HTML 캔버스 엘리먼트와 GPU 컨텍스트를 연결합니다.

### 3. 디바이스 제어
WebGPU의 핵심인 `GPUDevice`에 접근하여 하드웨어 가속 기능을 수행할 수 있도록 돕습니다.

## 주요 속성 및 메서드

- `canvas`: 현재 연결된 HTML 캔버스 엘리먼트입니다.
- `addView(view)`: 렌더링할 뷰(View3D)를 컨텍스트에 등록합니다.
- `removeView(view)`: 등록된 뷰를 제거합니다.

## 핵심 요약

- **RedGPU Context**는 엔진의 모든 기능이 시작되는 중심점입니다.
- `RedGPU.init`을 통해 비동기적으로 생성됩니다.
- 씬(Scene)이나 메시(Mesh)를 생성할 때 첫 번째 인자로 항상 전달되어야 하는 필수 객체입니다.