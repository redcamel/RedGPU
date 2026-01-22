---
title: RedGPU Context
description: RedGPU 엔진의 시작점이자 리소스 관리자인 RedGPUContext에 대해 알아봅니다.
order: 1
---

<script setup>
const contextLifeCycle = `
    graph LR
        Init["RedGPU.init() 호출"] -->|비동기| Callback["onSuccess 콜백"]
        Callback -->|인스턴스 획득| Setup["씬 및 뷰 설정"]
        Setup -->|루프 시작| Render["Renderer.start()"]
        
        %% 커스텀 클래스 적용
        class Init,Render mermaid-system;
        class Callback mermaid-main;
`
</script>

# RedGPUContext

**RedGPUContext**는 RedGPU 엔진이 동작하는 기반이 되는 객체입니다. 
복잡한 WebGPU 초기화 과정을 대신 처리하며, 텍스처나 모델과 같은 각종 리소스를 생성하고 관리하는 중심 역할을 수행합니다.

## 1. 역할과 주요 기능

RedGPUContext는 엔진의 전반적인 상태를 관리하며 다음과 같은 기능을 제공합니다.

- **디바이스 관리**: 브라우저와 GPU 하드웨어 간의 연결을 유지하고 통신을 담당합니다.
- **리소스 생성**: 메시, 텍스처, 재질 등 모든 3D 객체는 이 컨텍스트를 거쳐 생성됩니다.
- **출력 제어**: HTML 캔버스 요소와 연결되어 렌더링된 결과물을 화면에 표시합니다.

## 2. 초기화 프로세스

WebGPU 환경을 구축하기 위해 `RedGPU.init` 함수를 호출하여 비동기적으로 컨텍스트를 생성합니다.

<ClientOnly>
  <MermaidResponsive :definition="contextLifeCycle" />
</ClientOnly>

```javascript
import * as RedGPU from "dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

// RedGPU 초기화 요청
RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 초기화 성공 시 redGPUContext 인스턴스를 획득합니다.
        console.log('RedGPUContext 준비 완료:', redGPUContext);

        // 예: 씬 생성 (context 주입 필요)
        const scene = new RedGPU.Display.Scene();
    },
    (failReason) => {
        // 초기화 실패 시 (WebGPU 미지원 등) 처리
        console.error('초기화 실패:', failReason);
    }
);
```

## 3. 핵심 인터페이스

### 3.1 뷰 등록과 관리

화면에 무엇을 그릴지 결정하는 **뷰**(View3D) 목록을 관리합니다. 생성된 뷰를 컨텍스트에 등록해야만 실제 렌더링 파이프라인에 포함됩니다.

| 메서드 | 설명 |
| :--- | :--- |
| `addView(view)` | 렌더링할 뷰를 등록합니다. |
| `removeView(view)` | 등록된 뷰를 제거합니다. |
| `viewList` | 현재 등록된 모든 뷰의 목록을 반환합니다. |

### 3.2 캔버스 크기 자동 최적화

RedGPU는 캔버스 요소의 **표시 크기**(Layout Size) 변화를 실시간으로 감지합니다. 브라우저 창의 크기가 바뀌거나 CSS 레이아웃에 의해 캔버스가 차지하는 영역이 변경되면, 엔진은 이에 맞춰 렌더링 해상도를 자동으로 재설정합니다.

이 과정에서 `onResize` 콜백을 정의하면, 크기 변경 시점에 맞춘 추가적인 로직을 실행할 수 있습니다.

```javascript
// 크기 변경 시 호출될 콜백 정의
redGPUContext.onResize = (width, height) => {
    console.log(`캔버스 크기 변경: ${width}x${height}`);
    // UI 재배치나 카메라 속성 조정 등을 수행합니다.
};
```

## 4. 컨텍스트 주입의 필요성

RedGPU의 거의 모든 객체는 생성 시 첫 번째 인자로 `redGPUContext`를 요구합니다.

이는 각 객체가 GPU 메모리를 사용하기 위해 **"어느 GPU 디바이스에 데이터를 생성해야 하는지"**를 알아야 하기 때문입니다. 컨텍스트를 전달함으로써 엔진은 객체와 실제 하드웨어 리소스를 올바르게 연결할 수 있습니다.

```javascript
// [O] 올바른 방법: 생성 시 컨텍스트를 전달합니다.
const material = new RedGPU.Material.ColorMaterial(redGPUContext);

// [X] 잘못된 방법: 컨텍스트 누락 시 에러가 발생합니다.
// const material = new RedGPU.Material.ColorMaterial(); 
```

## 핵심 요약

- **엔진의 시작점**: `RedGPU.init`을 통해 비동기적으로 생성되는 필수 객체입니다.
- **필수 인자**: 메시나 재질 등 모든 그래픽 객체 생성 시 반드시 주입해야 합니다.
- **통합 관리자**: GPU 디바이스, 캔버스, 렌더링 뷰를 하나로 묶어 관리합니다.

## 다음 단계

RedGPUContext를 통해 엔진을 구동할 준비를 마쳤습니다. 하지만 아직 화면은 비어있습니다.

이제 빈 캔버스 위에 **카메라**(Camera)를 배치하고, 물체를 담을 **공간**(Scene)을 정의하여 실제 3D 세계를 구성하는 방법을 알아볼 차례입니다.

- **[View System (화면 구성)](../view-system/)**
