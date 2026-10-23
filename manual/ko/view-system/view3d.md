---
title: View3D
description: RedGPU의 렌더링 단위인 View3D의 기술적 명세와 사용법을 다룹니다.
order: 2
---
<script setup>
const viewSystemGraph = `
    graph TD
        Context["RedGPUContext (실행 환경)"]
        View["View3D (렌더 뷰포트)"]
        Scene["Scene (3D 공간 데이터)"]
        Camera["Camera (투영 시점)"]
        Controller["Controller (입력 제어)"]

        Context -->|관리| View
        View -->|참조| Scene
        View -->|참조| Camera
        Controller -->|갱신| Camera
        View -.->|보유| Controller
        
        %% 회색조 스타일 적용
        style Context fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style View fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Scene fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Camera fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style Controller fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`

const multiViewGraph = `
    graph TD
        Context["RedGPUContext"]
        View1["View3D (메인 뷰포트)"]
        View2["View3D (서브 뷰포트)"]
        SceneA["Scene A (동일 씬)"]
        CameraX["Camera X (메인 시점)"]
        CameraY["Camera Y (보조 시점)"]

        Context --> View1
        Context --> View2
        
        View1 --> SceneA
        View1 --> CameraX
        
        View2 -->|공유 참조| SceneA
        View2 --> CameraY

        %% 회색조 스타일 적용
        style Context fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style View1 fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style View2 fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style SceneA fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style CameraX fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style CameraY fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`
</script>

# View3D

`View3D` 는 `RedGPUContext` 내에서 렌더링이 수행되는 **화면 영역**(Viewport)을 정의하며, 장면 데이터 (`Scene`)와 시점 정보 (`Camera` 또는 `AController`)를
결합하여 프레임을 생성하는 렌더링 단위입니다.

`View3D` 인스턴스는 다음과 같은 독립적인 설정과 기능을 가집니다:

- **독립적 환경 설정**: 스카이박스 (`skybox`), 스카이 대기 (`skyAtmosphere`), 이미지 기반 조명 (`ibl`), 후처리 (`postEffectManager`), 톤 매핑
  (`toneMappingManager`) 등을 뷰별로 다르게 적용할 수 있습니다.
- **디버깅 도구 지원**: 그리드 (`grid`) 및 축 (`axis`) 표시 여부를 뷰마다 개별 제어할 수 있습니다.
- **멀티 뷰 운용**: 하나의 `RedGPUContext` 내에서 여러 개의 독립적인 뷰를 동시에 렌더링할 수 있습니다.

---

## 1. 아키텍처 및 기본 사용법

`View3D` 는 `Scene` 과 `Camera`(또는 컨트롤러)를 참조하며, `redGPUContext.addView(view)` 로 등록되어야 렌더링 루프에 포함됩니다.

<ClientOnly>
  <MermaidResponsive :definition="viewSystemGraph" />
</ClientOnly>

```javascript
RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. Scene 및 Camera(Controller) 생성
        const scene = new RedGPU.Display.Scene();
        const controller = new RedGPU.Camera.OrbitController(redGPUContext);

        // 2. View3D 생성 및 디버그 그리드·축 활성화
        const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
        view.grid = true;
        view.axis = true;

        // 3. 컨텍스트에 뷰 등록 및 렌더러 시작
        redGPUContext.addView(view);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);
    }
);
```

### 라이브 데모

<ClientOnly>
  <CodePen title="RedGPU Basics - View3D" slugHash="view-basic">
<pre data-lang="html">
&lt;canvas id="redgpu-canvas"&gt;&lt;/canvas&gt;
</pre>
<pre data-lang="css">
body { margin: 0; overflow: hidden; background: #111; }
canvas { display: block; width: 100vw; height: 100vh; }
</pre>
<pre data-lang="js">
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById("redgpu-canvas");

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
const controller = new RedGPU.Camera.OrbitController (redGPUContext);

    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.grid = true; 
    view.axis = true;
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
});
</pre>
  </CodePen>
</ClientOnly>

---

## 2. 영역 설정 및 리사이즈 감지

뷰포트의 위치와 크기는 숫자 (`number`), 픽셀 (`'500px'`), 백분율 (`'100%'`) 단위로 제어할 수 있습니다.

- **`x` / `y`** (`number | string`): 뷰포트의 좌측 상단 기준 X·Y 좌표를 조회하거나 설정합니다 (기본값: `0`).
- **`width` / `height`** (`number | string`): 뷰포트의 가로·세로 크기를 조회하거나 설정합니다 (기본값: `'100%'`).
- **`setPosition(x, y)` / `setSize(width, height)`**: 위치와 크기를 한 번에 변경합니다.
- **`screenRectObject`** (`IRedGPURectObject`): CSS 픽셀 단위의 표시 영역 `{ x, y, width, height }`를 반환합니다.
- **`pixelRectObject`** (`IRedGPURectObject`): `devicePixelRatio`와 `renderScale`이 반영된 실제 물리 픽셀 영역
  `{ x, y, width, height }`를 반환합니다.

```javascript
view.setSize('50%', '100%');
view.setPosition('50%', 0);
```

### `onResize` 이벤트 콜백

뷰의 크기가 변경될 때 호출되며, `RedResizeEvent<View3D>` 객체 (`target`, `screenRectObject`, `pixelRectObject`)가 인자로 전달됩니다.

```javascript
view.onResize = (event) => {
    const {screenRectObject, pixelRectObject} = event;
    console.log(`CSS 영역: ${screenRectObject.width}x${screenRectObject.height}, 물리 해상도: ${pixelRectObject.width}x${pixelRectObject.height}`);
};
```

---

## 3. 멀티 뷰 시스템

단일 `RedGPUContext` 에 여러 `View3D` 를 등록하면 동일한 `Scene` 을 서로 다른 카메라 시점으로 동시에 렌더링 (화면 분할, 미니맵 PIP 등)할 수 있습니다.

<ClientOnly>
  <MermaidResponsive :definition="multiViewGraph" />
</ClientOnly>

```javascript
const sharedScene = new RedGPU.Display.Scene();

// 1. 메인 뷰 설정 (전체 화면)
const mainCamera = new RedGPU.Camera.OrbitController(redGPUContext);
const mainView = new RedGPU.Display.View3D(redGPUContext, sharedScene, mainCamera);
mainView.setSize('100%', '100%');
redGPUContext.addView(mainView);

// 2. 미니맵 뷰 설정 (우측 상단 200x200 고정)
const miniMapSize = 200;
const miniMapCamera = new RedGPU.Camera.PerspectiveCamera();
miniMapCamera.y = 50;
miniMapCamera.lookAt(0, 0, 0);

const miniMapView = new RedGPU.Display.View3D(redGPUContext, sharedScene, miniMapCamera);
miniMapView.setSize(miniMapSize, miniMapSize);
redGPUContext.addView(miniMapView);

// 3. 리사이즈 시 메인 뷰 표시 크기(screenRectObject) 기준으로 미니맵 위치 갱신
redGPUContext.onResize = () => {
    const { width } = mainView.screenRectObject;
    miniMapView.setPosition(width - miniMapSize - 10, 10);
};
```

### 라이브 데모

<ClientOnly>
  <CodePen title="RedGPU Basics - Multi View" slugHash="view-multi">
<pre data-lang="html">
&lt;canvas id="redgpu-canvas"&gt;&lt;/canvas&gt;
</pre>
<pre data-lang="css">
body { margin: 0; overflow: hidden; background: #111; }
canvas { display: block; width: 100vw; height: 100vh; }
</pre>
<pre data-lang="js">
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById("redgpu-canvas");

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const sharedScene = new RedGPU.Display.Scene();

        // 1. 메인 뷰 설정 (전체 화면)
        const mainCamera = new RedGPU.Camera.OrbitController(redGPUContext);
        const mainView = new RedGPU.Display.View3D(redGPUContext, sharedScene, mainCamera);
        mainView.setSize('100%', '100%');
        mainView.grid = true;
        redGPUContext.addView(mainView);

        // 2. 미니맵 뷰 설정 (우측 상단 200x200 고정)
        const miniMapSize = 200;
        const miniMapCamera = new RedGPU.Camera.PerspectiveCamera();
        miniMapCamera.y = 50;
        miniMapCamera.lookAt(0, 0, 0);

        const miniMapView = new RedGPU.Display.View3D(redGPUContext, sharedScene, miniMapCamera);
        miniMapView.setSize(miniMapSize, miniMapSize);
        miniMapView.axis = true;
        miniMapView.grid = true;
        redGPUContext.addView(miniMapView);

        // 3. 리사이즈 시 메인 뷰 표시 크기(screenRectObject) 기준으로 미니맵 위치 갱신
        const updateLayout = () => {
            const { width } = mainView.screenRectObject;
            miniMapView.setPosition(width - miniMapSize - 10, 10);
        };

        redGPUContext.onResize = updateLayout;
        updateLayout();

        // 씬 오브젝트 배치
        const geometry = new RedGPU.Primitive.Box(redGPUContext);
        const material = new RedGPU.Material.ColorMaterial(redGPUContext, "#00CC99");
        for (let i = 0; i < 30; i++) {
            const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
            mesh.x = Math.random() * 40 - 20;
            mesh.z = Math.random() * 40 - 20;
            sharedScene.addChild(mesh);
        }

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);
    },
    (error) => console.error(error)
);
</pre>
  </CodePen>
</ClientOnly>

---

## 다음 단계

- **[Scene](./scene.md)** : 3D 객체와 조명이 배치되는 `Scene` 의 구조와 설정 방법
