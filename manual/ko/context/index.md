---
title: RedGPU Context
description: RedGPU 엔진의 시작점이자 리소스 관리자인 RedGPUContext에 대해 알아봅니다.
order: 2
---

<script setup>
const contextLifeCycle = `
    graph LR
        Init["RedGPU.init() 호출"] -->|비동기| Callback["onWebGPUInitialized 콜백"]
        Callback -->|인스턴스 획득| Setup["씬 및 뷰 설정"]
        Setup -->|루프 시작| Render["Renderer.start()"]
        
        %% 회색조 스타일 적용
        style Init fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:1px
        style Callback fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
        style Setup fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
        style Render fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:1px
`
</script>

# RedGPUContext

`RedGPUContext` 는 RedGPU 엔진이 동작하는 기반이 되는 최상위 컨텍스트 객체입니다. 복잡한 WebGPU 초기화 과정을 대신 처리하며, 디바이스, 어댑터, 캔버스, 리소스 및 렌더링에 필요한 다양한
매니저 객체들을 관리하는 중심 역할을 수행합니다.

> [!WARNING]
> `RedGPUContext` 는 `RedGPU.init()` 호출을 통해 내부적으로 자동 생성됩니다.<br/>
> 개발자가 직접 `new` 키워드를 사용하여 인스턴스를 생성하면 안 됩니다.

---

## 1. 아키텍처 및 역할

`RedGPU.init()` 함수를 호출하여 WebGPU 어댑터와 디바이스를 비동기로 초기화하고 `RedGPUContext` 인스턴스를 획득합니다.

<ClientOnly>
  <MermaidResponsive :definition="contextLifeCycle" />
</ClientOnly>

`RedGPUContext` 는 엔진의 전반적인 상태를 관리하며 다음과 같은 핵심 역할을 수행합니다:

- **뷰 컨테이너 운용**: 화면에 렌더링할 `View3D`(`View2D` 포함) 목록을 관리하며 (`addView`, `removeView`), 다중 뷰를 통한 화면 분할이나 UI 오버레이 구성을 지원합니다.
- **화면 크기 및 해상도 제어**: HTML `<canvas>` 크기 변화를 자동 감지 (`onResize`)하고, 렌더링 배율 (`renderScale`) 및 기본 배경색 (`backgroundColor`)을
  제어합니다.
- **내장 핵심 매니저 제공**: 안티앨리어싱 (`antialiasingManager`), GPU 리소스 캐싱 (`resourceManager`), 커맨드 인코딩 (`commandEncoderManager`),
  하드웨어 환경 분석 (`detector`) 매니저를 기본 보유합니다.
- **전역 입력 상태 버퍼링**: 실시간 키보드 눌림 상태를 저장하는 `keyboardKeyBuffer` 를 제공합니다.

---

## 2. 기본 초기화 사용법

WebGPU 환경을 구축하기 위해 대상 `<canvas>` 요소와 성공·실패 콜백을 전달하여 `RedGPU.init()` 을 호출합니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 초기화 성공 시 redGPUContext 인스턴스를 획득합니다.
        console.log('RedGPUContext 준비 완료:', redGPUContext);

        // 기본 배경색 지정
        redGPUContext.backgroundColor.setColorByHEX('#000000');
    },
    (error) => {
        // 초기화 실패 시 (WebGPU 미지원 환경 등) 처리
        console.error('RedGPU 초기화 실패:', error);
    }
);
```

---

## 3. 크기와 해상도 관리

`RedGPUContext` 는 HTML 캔버스 요소의 화면 레이아웃 크기 (CSS 픽셀 단위) 변화를 감지하고 렌더링 해상도를 자동으로 최적화합니다.

### 주요 스펙 및 메서드

- **`width` / `height`** (`number | string`): 캔버스의 너비와 높이 값을 직접 변경하거나 가져올 수 있습니다. `'100%'`, `'800px'`, `600` 과 같은 형식을 모두
  지원합니다.
- **`setSize(width, height)`**: 가로/세로 크기를 한 번에 지정합니다.
- **`renderScale`** (`number`): 화면의 렌더링 해상도 배율을 결정합니다. 기본값은 `1` 이며, 모바일 기기에서의 성능 최적화를 위해 해상도를 낮추고 싶다면 `0.5` 등으로 조절할 수
  있습니다.
- **`screenRectObject`** (`IRedGPURectObject`): CSS 픽셀 기준 캔버스의 영역 정보 `{ x, y, width, height }` 를 제공합니다.
- **`pixelRectObject`** (`IRedGPURectObject`): 물리 픽셀 기준 캔버스의 실제 렌더 해상도 정보 `{ x, y, width, height }` 를 제공합니다.

### `onResize` 이벤트 콜백

캔버스 크기가 조절되거나 `setSize()` 가 호출되어 크기가 변경될 때, `onResize` 콜백을 등록하여 UI 레이아웃 재배치 등의 추가 연산을 수행할 수 있습니다. 매개변수로 전달되는 `event` 객체는
`RedResizeEvent<RedGPUContext>` 인터페이스를 따릅니다.

```javascript
redGPUContext.onResize = (event) => {
    // event.target은 RedGPUContext 인스턴스를 가리킵니다.
    const { width, height } = event.screenRectObject; // CSS 픽셀 단위
    const { width: pWidth, height: pHeight } = event.pixelRectObject; // 물리 픽셀 단위

    console.log(`CSS 크기: ${width}x${height}, 실제 물리 해상도: ${pWidth}x${pHeight}`);
};
```

---

## 4. 컨텍스트 주입의 필요성

RedGPU의 거의 모든 3D 객체 (메시, 지오메트리, 텍스처, 재질 등)는 생성자 첫 번째 인자로 `redGPUContext` 를 요구합니다.

각 그래픽 객체는 GPU 메모리를 동적으로 할당받아야 하는데, 이때 **"어느 GPU 디바이스 (`gpuDevice`)와 리소스 매니저 (`resourceManager`)를 사용하여 리소스를 생성할 것인가"**에
대한 연결 기준이 바로 `RedGPUContext` 가 되기 때문입니다.

```javascript
// [O] 올바른 방법: 생성 시 항상 첫 번째 인자로 컨텍스트를 주입합니다.
const material = new RedGPU.Material.ColorMaterial(redGPUContext);

// [X] 잘못된 방법: 컨텍스트를 전달하지 않으면 에러가 발생합니다.
// const material = new RedGPU.Material.ColorMaterial(); 
```

---

## 관련 예제

- [Hello World 3D](/RedGPU/examples/3d/helloWorld/)
- [다중 캔버스 (Multi Canvas)](/RedGPU/examples/3d/multiCanvas/)

---

## 다음 단계

`RedGPUContext` 를 통해 엔진을 구동할 준비를 마쳤습니다. 이제 빈 캔버스 위에 **카메라**(`Camera`)를 배치하고, 물체를 담을 **공간**(`Scene`)을 정의하여 실제 3D 세계를 화면에
그려내는 방법을 알아봅니다.

- **[View System](../view-system/index.md)** : `View3D`, `Scene`, `Camera` 를 조합하여 화면에 3D 무대를 출력하는 방법
