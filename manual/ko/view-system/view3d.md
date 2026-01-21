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

`View3D` 는 **RedGPUContext** 내에서 실제로 렌더링이 수행되는 **화면 영역**(Viewport) 을 정의하는 객체입니다. 
장면 데이터(**Scene**) 와 시점 정보(**Camera**) 를 하나로 묶어 최종 프레임을 생성하는 **렌더링 패스**(Render Pass) 역할을 수행합니다.

## 1. 기술적 개요

`View3D` 는 `RedGPUContext` 로부터 생성된 GPU 환경 위에서 동작하며, 다른 구성 요소들과 다음과 같은 관계를 맺습니다.

<ClientOnly>
  <MermaidResponsive :definition="viewSystemGraph" />
</ClientOnly>

뷰 인스턴스별로 배경색, 포스트 이펙트, 디버깅 옵션 등을 독립적으로 설정할 수 있으며, 하나의 컨텍스트 내에서 여러 개의 뷰를 동시에 운용할 수 있습니다.

## 2. 초기화 및 등록

`View3D` 는 반드시 `RedGPUContext` 가 초기화된 이후에 생성되어야 합니다. 생성된 뷰는 `addView()` 메서드를 통해 컨텍스트의 렌더링 리스트에 등록되어야만 실제 화면에 그려집니다.

```javascript
RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. Scene & Camera 준비
        const scene = new RedGPU.Display.Scene(redGPUContext);
        const camera = new RedGPU.Camera.OrbitController(redGPUContext);

        // 2. View3D 인스턴스화
        const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
        
        // 3. 디버그 옵션 활성화
        view.grid = true; 
        view.axis = true;
        
        // 4. 렌더링 리스트에 추가
        redGPUContext.addView(view);

        // 5. 렌더 루프 시작
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);
    }
);
```

## 3. 디버깅 도구

개발 편의를 위해 월드 좌표계의 기준을 시각화하는 도구를 내장하고 있습니다.

- **`view.grid`**: XZ 평면(Ground) 에 격자를 렌더링하여 스케일 및 거리감을 파악하는 데 사용됩니다.
- **`view.axis`**: 월드 원점(0, 0, 0) 을 기준으로 XYZ 축을 시각화합니다.
    - **R**: X Axis (Right)
    - **G**: Y Axis (Up)
    - **B**: Z Axis (Forward/Backward)

## 4. 라이브 데모

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

RedGPU.init(
    canvas,
    (redGPUContext) => {
        const scene = new RedGPU.Display.Scene(redGPUContext);
        const camera = new RedGPU.Camera.OrbitController(redGPUContext);
        camera.z = -5;

        const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
        view.grid = true; 
        view.axis = true;
        redGPUContext.addView(view);

        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);
    },
    (error) => console.error(error)
);
</pre>
  </CodePen>
</ClientOnly>

<br/>

## 5. 멀티 뷰 시스템

RedGPU는 단일 컨텍스트에서 다수의 뷰포트를 운용하는 멀티 뷰 렌더링을 지원합니다. 각 뷰는 화면의 특정 영역을 점유하며 독립적으로 렌더링됩니다.

<ClientOnly>
  <MermaidResponsive :definition="multiViewGraph" />
</ClientOnly>

### 표시 크기와 해상도

반응형 레이아웃 대응을 위해 `View3D` 는 CSS 픽셀 단위의 크기와 실제 GPU 렌더링 해상도를 분리하여 관리합니다.

::: tip [DPI 대응]
고해상도 디스플레이(HiDPI/Retina) 환경에서는 `window.devicePixelRatio` 값에 따라 표시 크기와 실제 해상도가 달라집니다.
- **`view.screenRectObject`**: 레이아웃 계산에 사용되는 **표시 크기**(Layout Size) 데이터입니다. UI 배치 등에 사용합니다.
- **`view.pixelRectObject`**: 실제 GPU 버퍼 크기인 **물리 해상도**(Physical Resolution) 데이터입니다.
:::

```javascript
// 1. 메인 뷰 (전체 화면 점유)
const mainView = new RedGPU.Display.View3D(redGPUContext, sharedScene, mainCamera);
mainView.setSize('100%', '100%');
redGPUContext.addView(mainView);

// 2. 미니맵 뷰 (우측 상단 고정, 200x200px)
const miniMapView = new RedGPU.Display.View3D(redGPUContext, sharedScene, miniMapCamera);
const miniMapSize = 200;
miniMapView.setSize(miniMapSize, miniMapSize);

// 리사이즈 시 메인 뷰의 표시 크기(screenRectObject)를 기준으로 미니맵 위치 갱신
redGPUContext.onResize = () => {
    const { width } = mainView.screenRectObject;
    miniMapView.setPosition(width - miniMapSize - 10, 10);
};
redGPUContext.addView(miniMapView);
```

## 6. 렌더링 흐름

<ClientOnly>
  <MermaidResponsive :definition="viewGraph" />
</ClientOnly>

## 관련 문서

- **[Scene (장면)](./scene.md)**: 뷰가 렌더링할 데이터 컨테이너.
- **[Camera (카메라)](./camera.md)**: 투영 행렬을 관리하는 주체.