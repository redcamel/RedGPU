---
title: View3D
description: RedGPU의 렌더링 단위인 View3D의 기술적 명세와 사용법을 다룹니다.
order: 2
---
<script setup>
const viewSystemGraph = `
    graph TD
        Context["RedGPUContext (Environment)"]
        View["View3D (Render Pass)"]
        Scene["Scene (Data)"]
        Camera["Camera (Projection)"]
        Controller["Controller (Input)"]

        Context -->|Manages| View
        View -->|References| Scene
        View -->|References| Camera
        Controller -->|Updates| Camera
        View -.->|Holds| Controller
        
        %% 커스텀 클래스 적용
        class Context mermaid-system;
        class View mermaid-main;
`

const viewGraph = `
    Renderer["RedGPU.Renderer"] -->|Executes Loop| View["RedGPU.Display.View3D"]
    View -->|References| Scene["RedGPU.Display.Scene"]
    View -->|References| Camera["RedGPU.Camera"]
    
    %% 커스텀 클래스 적용
    class Renderer mermaid-system;
    class View mermaid-main;
`

const multiViewGraph = `
    graph TD
        Context["RedGPUContext"]
        View1["View3D (Main Viewport)"]
        View2["View3D (Sub Viewport)"]
        SceneA["Scene A"]
        CameraX["Camera X"]
        CameraY["Camera Y"]

        Context --> View1
        Context --> View2
        
        View1 --> SceneA
        View1 --> CameraX
        
        View2 -->|Shared Reference| SceneA
        View2 --> CameraY

        %% 커스텀 클래스 적용
        class Context mermaid-system;
        class View1,View2 mermaid-main;
`
</script>

# View3D

**View System** 의 가장 핵심적인 '틀' 역할을 하는 **View3D** 는, **RedGPUContext** 내에서 실제로 렌더링이 수행되는 **화면 영역**(Viewport) 을 정의하는 객체입니다. 
장면 데이터(**Scene**) 와 시점 정보(**Camera**) 를 하나로 묶어 최종 프레임을 생성하는 **렌더링 패스**(Render Pass) 역할을 수행합니다.

## 1. 기술적 개요

**View3D** 는 **RedGPUContext** 로부터 생성된 GPU 환경 위에서 동작하며, 다른 구성 요소들과 다음과 같은 관계를 맺습니다.

<ClientOnly>
  <MermaidResponsive :definition="viewSystemGraph" />
</ClientOnly>

**View3D** 인스턴스는 다음과 같은 독립적인 설정과 기능을 가집니다.

*   **독립적 환경 설정**: 스카이박스, 포스트 이펙트 등을 뷰별로 다르게 적용 가능
*   **디버깅 도구 지원**: 그리드(**Grid**) 및 축(**Axis**) 표시 여부 개별 제어
*   **멀티 뷰 운용**: 하나의 컨텍스트 내에서 여러 개의 독립적인 뷰를 동시에 렌더링 가능

## 2. 초기화 및 등록

**View3D** 를 생성하고 화면에 표시하기 위해서는 다음과 같은 단계를 거칩니다.

1.  **인스턴스 생성**: **RedGPUContext** 가 준비된 후, **Scene** 과 **Camera** 를 연결하여 생성합니다.
2.  **컨텍스트 등록**: `addView()` 메서드를 호출하여 렌더링 루프에 포함시킵니다. 등록되지 않은 뷰는 화면에 출력되지 않습니다.

```javascript
RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. 구성 요소 준비 (Scene 및 Camera)
        const scene = new RedGPU.Display.Scene();
        const camera = new RedGPU.Camera.OrbitController(redGPUContext);

        // 2. View3D 생성 및 설정
        const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
        view.grid = true; 
        view.axis = true;
        
        // 3. 컨텍스트에 뷰 등록 (필수)
        redGPUContext.addView(view);

        // 4. 렌더러 시작
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
    const camera = new RedGPU.Camera.OrbitController(redGPUContext);

    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
    view.grid = true; 
    view.axis = true;
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
});
</pre>
  </CodePen>
</ClientOnly>

## 3. 크기와 해상도 관리

**View3D** 는 캔버스 내에서 자신이 차지할 영역과 렌더링 해상도를 결정합니다. 반응형 레이아웃 대응을 위해 CSS 픽셀 단위의 크기와 실제 GPU 렌더링 해상도를 분리하여 관리합니다.

### 영역 설정 (Size & Position)

`setSize()` 와 `setPosition()` 메서드를 통해 뷰의 크기와 위치를 지정할 수 있습니다. 수치(Number), 퍼센트(`%`), 그리고 픽셀(`px`) 단위를 모두 지원합니다.

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
고해상도 디스플레이(HiDPI/Retina) 대응을 위해 두 가지 좌표 객체를 제공합니다.
*   **`view.screenRectObject`**: CSS 픽셀 단위의 **표시 크기**(Layout Size) 입니다. **UI 배치**나 **마우스 이벤트 좌표 계산** 시에 사용합니다.
*   **`view.pixelRectObject`**: `devicePixelRatio` 가 적용된 실제 **물리 해상도**(Physical Resolution) 입니다. 내부적인 렌더링 계산에 사용됩니다.
:::

## 4. 디버깅 도구

개발 중 객체의 상대적인 위치와 방향을 직관적으로 파악할 수 있도록 시각화 도구를 제공합니다.

*   **grid**: 3D 월드의 기본 평면(**XZ** 축) 에 격자를 렌더링합니다. 물체가 지면에 닿아 있는지 가늠하는 기준이 됩니다.
*   **axis**: 월드의 원점(**0, 0, 0**) 을 기준으로 **XYZ** 축을 색상별로 표시합니다.
    *   <span style="color:#ff3e3e;font-weight:bold">Red</span>: **X** 축 (Right)
    *   <span style="color:#3eff3e;font-weight:bold">Green</span>: **Y** 축 (Up)
    *   <span style="color:#3e3eff;font-weight:bold">Blue</span>: **Z** 축 (Depth)

## 5. 멀티 뷰 시스템

RedGPU는 단일 컨텍스트 내에서 다수의 **뷰포트**(Viewport) 를 운용하는 멀티 뷰 렌더링을 지원합니다. 각 뷰는 화면의 특정 영역을 점유하며 독립적인 장면과 카메라를 렌더링합니다.

<ClientOnly>
  <MermaidResponsive :definition="multiViewGraph" />
</ClientOnly>

### 멀티 뷰 구성 예제

앞서 배운 **표시 크기**(screenRectObject) 를 활용하여 메인 화면과 미니맵을 배치하는 방법입니다.

```javascript
// [전제 조건] RedGPU.init 콜백 내부라고 가정합니다.
const sharedScene = new RedGPU.Display.Scene();

// 1. 메인 뷰 설정
const mainCamera = new RedGPU.Camera.OrbitController(redGPUContext);
const mainView = new RedGPU.Display.View3D(redGPUContext, sharedScene, mainCamera);
mainView.setSize('100%', '100%');
redGPUContext.addView(mainView);

// 2. 미니맵 뷰 설정 (우측 상단 고정)
const miniMapCamera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
miniMapCamera.y = 50;
miniMapCamera.lookAt(0, 0, 0);

const miniMapView = new RedGPU.Display.View3D(redGPUContext, sharedScene, miniMapCamera);
const miniMapSize = 200;
miniMapView.setSize(miniMapSize, miniMapSize);
redGPUContext.addView(miniMapView);

// 3. 리사이즈 시 메인 뷰의 표시 크기를 기준으로 미니맵 위치 갱신
redGPUContext.onResize = () => {
    const { width } = mainView.screenRectObject;
    miniMapView.setPosition(width - miniMapSize - 10, 10);
};
```

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

        // 메인 뷰 설정
        const mainCamera = new RedGPU.Camera.OrbitController(redGPUContext);
        const mainView = new RedGPU.Display.View3D(redGPUContext, sharedScene, mainCamera);
        mainView.setSize('100%', '100%');
        mainView.grid = true;
        redGPUContext.addView(mainView);

        // 미니맵 뷰 설정
        const miniMapSize = 200;
        const miniMapCamera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
        miniMapCamera.y = 50;
        miniMapCamera.lookAt(0, 0, 0.1);

        const miniMapView = new RedGPU.Display.View3D(redGPUContext, sharedScene, miniMapCamera);
        miniMapView.setSize(miniMapSize, miniMapSize);
        miniMapView.axis = true;
        miniMapView.grid = true;
        redGPUContext.addView(miniMapView);

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

## 6. 렌더링 흐름

**Renderer** 가 매 프레임 컨텍스트에 등록된 뷰 목록을 순회하며 수행하는 작업 흐름입니다.

<ClientOnly>
  <MermaidResponsive :definition="viewGraph" />
</ClientOnly>

## 다음 단계

**View3D** 를 통해 장면을 그려낼 '틀' 을 준비했습니다. 이제 그 틀 안에 채워넣을 실제 **장면**(Scene) 을 구성할 차례입니다.

메시와 조명이 배치되는 공간인 **Scene** 의 역할과 구성 방법을 알아봅니다.

- **[Scene](./scene.md)**