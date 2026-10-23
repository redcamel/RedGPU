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

`RedGPUContext` 는 WebGPU 디바이스·어댑터 초기화, 캔버스 해상도 제어, `View3D` 컨테이너 및 엔진 핵심 매니저들을 통합 관리하는 최상위 컨텍스트 객체입니다.

```javascript
RedGPU.init(
    canvas,
    (redGPUContext) => {
      // RedGPU.init() 초기화 성공 시 redGPUContext 인스턴스가 전달됩니다.
    },
        (error) => {
          console.error('RedGPU 초기화 실패:', error);
    }
);
```

> [!WARNING]
> `RedGPUContext` 는 `RedGPU.init()` 호출을 통해 내부적으로 자동 생성됩니다.<br/>
> 개발자가 직접 `new` 키워드로 인스턴스를 생성하면 안 됩니다.

---

## 1. 초기화 프로세스

`RedGPU.init()` 함수를 호출하여 WebGPU 어댑터와 디바이스를 비동기로 초기화하고 `RedGPUContext` 인스턴스를 획득합니다.

<ClientOnly>
  <MermaidResponsive :definition="contextLifeCycle" />
</ClientOnly>

---

## 2. 뷰 등록과 관리

`RedGPUContext` 는 화면에 렌더링할 `View3D`(`View2D` 포함) 목록을 관리하는 컨테이너 (`RedGPUContextViewContainer`)입니다. 등록된 뷰들은 인덱스 순서대로
렌더링되며, 다중 뷰를 등록해 화면 분할이나 PIP (Picture-in-Picture), UI 오버레이를 구성할 수 있습니다.

- **`addView(view)` / `removeView(view)`**: 렌더링할 뷰를 등록하거나 제거합니다.
- **`viewList` / `numViews`**: 현재 등록된 뷰 배열 (`View3D[]`)과 개수를 조회합니다.

> 특정 인덱스 삽입 (`addViewAt`), 렌더링 순서 변경 (`setViewIndex`, `swapViews`) 등 전체 컨테이너 제어 메서드는 `RedGPUContextViewContainer` API
> 문서를 참고하세요.

---

## 3. 화면 크기 및 해상도 제어

HTML 캔버스 요소의 레이아웃 크기 (CSS 픽셀) 변화를 감지하여 GPU 렌더링 해상도를 자동으로 갱신합니다.

- **`width` / `height`** (`number | string`): 캔버스의 가로·세로 크기를 조회하거나 변경합니다 (`'100%'`, `'800px'`, `600` 등 지원).
- **`setSize(width, height)`**: 가로·세로 크기를 한 번에 지정합니다.
- **`renderScale`** (`number`, 기본값: `1`): 렌더링 해상도 배율입니다. 저사양·모바일 환경에서 성능 확보를 위해 `0.5 ~ 0.8` 등으로 낮출 수 있습니다.
- **`screenRectObject`** (`IRedGPURectObject`): CSS 픽셀 기준 캔버스 영역 `{ x, y, width, height }`를 반환합니다.
- **`pixelRectObject`** (`IRedGPURectObject`): `devicePixelRatio`와 `renderScale`이 반영된 실제 물리 픽셀 해상도
  `{ x, y, width, height }`를 반환합니다.

### `onResize` 이벤트 콜백

캔버스 크기가 변경될 때 호출되며, `RedResizeEvent<RedGPUContext>` 객체가 인자로 전달됩니다.

```javascript
redGPUContext.onResize = (event) => {
    const { width, height } = event.screenRectObject; // CSS 픽셀 단위
    const { width: pWidth, height: pHeight } = event.pixelRectObject; // 물리 픽셀 단위

  console.log(`CSS 크기: ${width}x${height}, 물리 해상도: ${pWidth}x${pHeight}`);
};
```

---

## 4. 주요 속성 및 내장 매니저

`RedGPUContext` 가 기본 보유하는 설정 속성과 4대 핵심 매니저 및 WebGPU 네이티브 객체 목록입니다.

| 속성 / 메서드               | 타입                         | 설명                                                                               |
|:----------------------------|:-----------------------------|:-----------------------------------------------------------------------------------|
| **`backgroundColor`**       | `ColorRGBA`                  | 캔버스 기본 배경색 (기본값: `0, 0, 0, 1`)                                          |
| **`alphaMode`**             | `GPUCanvasAlphaMode`         | 캔버스 알파 합성 모드 (`'premultiplied'` 또는 `'opaque'`)                          |
| **`antialiasingManager`**   | `AntialiasingManager`        | 전역 안티앨리어싱(`useTAA`, `useMSAA`, `useFXAA`) 배타 제어 (읽기 전용)            |
| **`resourceManager`**       | `ResourceManager`            | 텍스처·버퍼·셰이더 모듈·바인드 그룹 레이아웃 중앙 캐싱 및 메모리 추적 (읽기 전용)  |
| **`commandEncoderManager`** | `CommandEncoderManager`      | 프레임 내 렌더/컴퓨트 패스 실행 순서 조율 및 GPU 큐 일괄 제출 (읽기 전용)          |
| **`detector`**              | `RedGPUContextDetector`      | 모바일 여부(`isMobile`), OS, 브라우저 및 WebGPU 하드웨어 `limits` 분석 (읽기 전용) |
| **`keyboardKeyBuffer`**     | `{ [key: string]: boolean }` | 현재 눌려 있는 키보드 키 상태를 저장하는 실시간 버퍼                               |
| **`gpuDevice`**             | `GPUDevice`                  | WebGPU 논리 디바이스 객체 (읽기 전용)                                              |
| **`gpuAdapter`**            | `GPUAdapter`                 | 물리 GPU 어댑터 정보 객체 (읽기 전용)                                              |
| **`gpuContext`**            | `GPUCanvasContext`           | HTML 캔버스와 연결된 WebGPU 컨텍스트 (읽기 전용)                                   |
| **`htmlCanvas`**            | `HTMLCanvasElement`          | 렌더링에 사용 중인 DOM `<canvas>` 요소 (읽기 전용)                                 |
| **`destroy()`**             | `() => void`                 | 컨텍스트가 보유한 모든 GPU 리소스를 파기하고 디바이스를 해제합니다.                |

---

## 5. 컨텍스트 주입의 필요성

RedGPU의 모든 그래픽 리소스와 디스플레이 객체 (메시, 지오메트리, 재질, 텍스처 등)는 생성자 첫 번째 인자로 `redGPUContext` 를 전달받습니다. 이는 객체가 어느 `GPUDevice` 와
`ResourceManager` 에 속해 GPU 메모리를 할당받을지 결정하는 기준이 되기 때문입니다.

```javascript
// [O] 생성 시 첫 번째 인자로 redGPUContext 주입
const material = new RedGPU.Material.ColorMaterial(redGPUContext);

// [X] 컨텍스트 누락 시 에러 발생
// const material = new RedGPU.Material.ColorMaterial(); 
```

---

## 다음 단계

- **[View System](../view-system/index.md)** : `View3D`, `Scene`, `Camera` 를 조합하여 화면에 3D 무대를 출력하는 방법
