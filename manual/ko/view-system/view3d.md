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

**View System** 의 가장 핵심적인 '틀' 역할을 하는 `View3D` 는, `RedGPUContext` 내에서 실제로 렌더링이 수행되는 **화면 영역**(Viewport)을 정의하는 객체입니다. 장면
데이터 (`Scene`)와 시점 정보 (`Camera`)를 하나로 묶어 최종 프레임을 생성하는 **렌더링 패스**(Render Pass) 역할을 수행합니다.

## 1. 아키텍처 및 역할

`View3D` 는 `Scene` 과 `Camera`(또는 컨트롤러)를 참조하며, `redGPUContext.addView(view)` 로 등록되어야 렌더링 루프에 포함됩니다.

<ClientOnly>
  <MermaidResponsive :definition="viewSystemGraph" />
</ClientOnly>

`View3D` 인스턴스는 다음과 같은 독립적인 설정과 기능을 가집니다:

- **독립적 환경 설정**: 스카이박스 (`skybox`), 스카이 대기 (`skyAtmosphere`), 이미지 기반 조명 (`ibl`), 후처리 (`postEffectManager`), 톤 매핑
  (`toneMappingManager`) 등을 뷰별로 다르게 적용할 수 있습니다.
- **디버깅 도구 지원**: 그리드 (`grid`) 및 축 (`axis`) 표시 여부를 뷰마다 개별 제어할 수 있습니다.
- **멀티 뷰 운용**: 하나의 `RedGPUContext` 내에서 여러 개의 독립적인 뷰를 동시에 렌더링할 수 있습니다.

---

## 2. 기본 사용법

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

## 3. 크기와 해상도 관리

`View3D` 는 캔버스 내에서 자신이 차지할 영역과 렌더링 해상도를 결정합니다. 반응형 레이아웃 대응을 위해 CSS 픽셀 단위의 크기와 실제 GPU 렌더링 해상도를 분리하여 관리합니다.

### 영역 설정 (Size & Position)

`setSize()` 와 `setPosition()` 메서드를 통해 뷰의 크기와 위치를 지정할 수 있습니다. 수치 (`number`), 퍼센트 (`%`), 그리고 픽셀 (`px`) 단위를 모두 지원합니다.

```javascript
// 수치(Number) 또는 픽셀(px) 문자열 사용 가능
view.setSize(500, 300);
view.setSize('500px', '300px');

// 퍼센트(%) 단위 사용 가능
view.setSize('100%', '100%');

// 위치 설정
view.setPosition(10, 10);
view.setPosition('10px', '10%');
```

::: tip [픽셀 단위 가이드]
고해상도 디스플레이 (HiDPI/Retina) 대응을 위해 두 가지 좌표 객체를 제공합니다.

* **`view.screenRectObject`**: CSS 픽셀 단위의 **표시 크기**(Layout Size)입니다. **UI 배치**나 **마우스 이벤트 좌표 계산** 시에 사용합니다.
* **`view.pixelRectObject`**: `devicePixelRatio` 가 적용된 실제 **물리 해상도**(Physical Resolution)입니다. 내부적인 렌더링 계산에 사용됩니다.
  :::

### 뷰별 크기 변경 감지 (`onResize`)

`redGPUContext.onResize` 가 전체 캔버스의 크기 변화를 감지한다면, 개별 `View3D` 객체의 `onResize` 콜백은 해당 뷰의 크기가 변경될 때마다 호출됩니다.

뷰의 크기를 퍼센트 (`%`) 단위로 설정했을 때 부모인 캔버스 크기가 변하거나, `setSize()` 를 통해 직접 크기를 변경할 때 유용하게 사용할 수 있습니다. 이 콜백은 `RedResizeEvent`
인터페이스 형식의 이벤트를 인자로 받습니다.

#### `RedResizeEvent` 인터페이스 구조

| 속성명                 | 타입                | 설명                                                                         |
|:-----------------------|:--------------------|:-----------------------------------------------------------------------------|
| **`target`**           | `T` (예: `View3D`)  | 이벤트가 발생한 대상 뷰 인스턴스                                             |
| **`screenRectObject`** | `IRedGPURectObject` | CSS 픽셀 단위의 크기 및 위치 정보 (`{ x, y, width, height }`)                |
| **`pixelRectObject`**  | `IRedGPURectObject` | `devicePixelRatio` 가 적용된 물리 픽셀 단위 정보 (`{ x, y, width, height }`) |

```javascript
// 개별 뷰의 크기 변경 시 호출될 콜백 정의
view.onResize = (event) => {
    const { target, screenRectObject, pixelRectObject } = event;
    const { width, height } = screenRectObject;
    console.log(`뷰 영역 변경: ${width}x${height} (물리 해상도: ${pixelRectObject.width}x${pixelRectObject.height})`);
    
    // 해당 뷰 내의 특정 UI 요소를 재배치하거나 카메라 설정을 조정합니다.
};
```

---

## 4. 디버깅 도구

개발 중 객체의 상대적인 위치와 방향을 직관적으로 파악할 수 있도록 시각화 도구를 제공합니다.

* **`grid`**: 3D 월드의 기본 평면 (**XZ** 축)에 격자를 렌더링합니다. 물체가 지면에 닿아 있는지 가늠하는 기준이 됩니다.
* **`axis`**: 월드의 원점 (**0, 0, 0**)을 기준으로 **XYZ** 축을 색상별로 표시합니다.
    * <span style="color:#ff3e3e;font-weight:bold">Red</span>: **X** 축 (Right)
    * <span style="color:#3eff3e;font-weight:bold">Green</span>: **Y** 축 (Up)
    * <span style="color:#3e3eff;font-weight:bold">Blue</span>: **Z** 축 (Depth)

---

## 5. 멀티 뷰 시스템

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

## 관련 예제

- [단일 뷰 (Single View)](/RedGPU/examples/3d/view/singleView/)
- [다중 뷰 (Multi View)](/RedGPU/examples/3d/view/multiView/)
- [3D + 2D 복합 다중 뷰](/RedGPU/examples/2d/view/multiViewWith3D/)

---

## 다음 단계

`View3D` 를 통해 장면을 그려낼 '틀'을 준비했습니다. 이제 그 틀 안에 채워넣을 실제 **장면**(`Scene`)을 구성할 차례입니다. 메시와 조명이 배치되는 공간인 `Scene` 의 역할과 구성 방법을
알아봅니다.

- **[Scene](./scene.md)** : 3D 객체와 조명이 배치되는 `Scene` 의 구조와 설정 방법
