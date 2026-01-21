---
title: View3D
description: RedGPU의 화면 구성 단위인 View3D의 개념과 사용법을 다룹니다.
order: 2
---
<script setup>
const viewGraph = `
    Renderer["RedGPU.Renderer"] -->|Draws| View["RedGPU.Display.View3D"]
    View -->|Composes| Scene["RedGPU.Display.Scene"]
    View -->|Uses| Camera["RedGPU.Camera"]
    
    %% 커스텀 클래스 적용
    class Renderer mermaid-system;
    class View mermaid-main;
`

const conceptGraph = `
    graph TD
        Context["RedGPUContext (Canvas)"]
        View["View3D"]
        Scene["Scene"]
        Camera["Camera"]

        Context --> View
        View --> Scene
        View --> Camera

        %% 커스텀 클래스 적용
        class Context mermaid-system;
        class View mermaid-main;
`

const multiViewGraph = `
    graph TD
        Context["RedGPUContext (Canvas)"]
        View1["View3D (Main View)"]
        View2["View3D (Mini Map)"]
        SceneA["Scene A"]
        CameraX["Camera X"]
        CameraY["Camera Y"]

        Context --> View1
        Context --> View2
        
        View1 --> SceneA
        View1 --> CameraX
        
        View2 -->|Shared| SceneA
        View2 --> CameraY

        %% 커스텀 클래스 적용
        class Context mermaid-system;
        class View1,View2 mermaid-main;
`
</script>

# View3D

`View3D`는 RedGPU에서 3D 장면을 화면에 출력하기 위한 **최종 렌더링 단위**입니다. 
하나의 `RedGPUContext`(Canvas)는 최소 하나 이상의 뷰를 가지며, 각 뷰는 자신만의 공간([Scene](./scene.md))과 시점([Camera](./camera.md))을 연결합니다.

## 1. 개념 이해

`View3D`는 "어떤 장면(Scene)을 어떤 시각(Camera)에서 볼 것인가"를 정의하는 매개체입니다. 캔버스라는 도화지 위에 실제 그림을 그리는 영역(Viewport)이라고 이해할 수 있습니다.

<ClientOnly>
  <MermaidResponsive :definition="conceptGraph" />
</ClientOnly>

렌더링에 필요한 모든 시각적 설정(디버깅 도구, 후처리 효과, 배경 설정 등)은 `View3D` 인스턴스 단위로 관리됩니다.

## 2. 기본 사용법

`View3D`는 `RedGPU.init`의 성공 콜백에서 전달되는 `redGPUContext`를 사용하여 생성하며, 반드시 컨텍스트에 추가(`addView`)해야 화면에 렌더링됩니다.

```javascript
RedGPU.init(
    canvas,
    (redGPUContext) => {
        // 1. Scene과 Camera 생성
        const scene = new RedGPU.Display.Scene(redGPUContext);
        const camera = new RedGPU.Camera.OrbitController(redGPUContext);

        // 2. View3D 생성 및 설정
        const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
        
        // 3. 디버깅 도구 활성화 (격자와 축)
        view.grid = true; 
        view.axis = true;
        
        // 4. 컨텍스트에 뷰 등록
        redGPUContext.addView(view);

        // 5. 렌더러 시작
        const renderer = new RedGPU.Renderer();
        renderer.start(redGPUContext);
    }
);
```

## 3. 디버깅 도구 (Grid & Axis)

씬을 구성할 때 객체의 상대적인 위치와 방향을 파악하는 데 필수적인 도구입니다.

- **`view.grid`**: 3D 월드의 기본 평면(XZ축)에 격자를 표시합니다. 물체가 바닥에 위치하는지, 혹은 얼마나 떨어져 있는지 가늠하는 기준이 됩니다.
- **`view.axis`**: 월드의 원점(0, 0, 0)에 X, Y, Z축을 색상별로 표시합니다.
    - <span style="color:#ff3e3e;font-weight:bold">Red</span>: X축 (가로)
    - <span style="color:#3eff3e;font-weight:bold">Green</span>: Y축 (세로)
    - <span style="color:#3e3eff;font-weight:bold">Blue</span>: Z축 (깊이)

## 4. 라이브 데모 (Live Demo)

아래 예제에서 `view.grid`와 `view.axis`가 활성화된 기본적인 `View3D` 구성을 확인할 수 있습니다.

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
        
        // 디버깅 도구 설정
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

## 5. 멀티 뷰 시스템 (Multi-View System)

RedGPU는 하나의 캔버스 내에서 독립적인 여러 영역을 동시에 렌더링할 수 있는 기능을 제공합니다.

<ClientOnly>
  <MermaidResponsive :definition="multiViewGraph" />
</ClientOnly>

### 위치와 크기 제어
`view.screenRectObject`를 사용하면 현재 뷰의 **논리적 픽셀**(CSS 픽셀) 단위 크기를 가져올 수 있습니다. 이를 활용하여 다른 뷰의 위치를 직관적으로 계산하고 배치할 수 있습니다.

::: tip [물리 픽셀 vs 논리 픽셀]
- **`view.pixelRectObject`**: GPU가 실제로 그리는 **물리 픽셀** 영역입니다. 고해상도 디스플레이에서는 `devicePixelRatio`가 곱해진 큰 값을 가집니다.
- **`view.screenRectObject`**: CSS 픽셀과 일치하는 **논리 픽셀** 영역입니다. UI 배치나 위치 계산 시 권장됩니다.
:::

```javascript
// 1. 메인 뷰 설정 (전체 화면)
const mainView = new RedGPU.Display.View3D(redGPUContext, sharedScene, mainCamera);
mainView.setSize('100%', '100%');
redGPUContext.addView(mainView);

// 2. 미니맵 뷰 설정 (우측 상단 정밀 배치)
const miniMapView = new RedGPU.Display.View3D(redGPUContext, sharedScene, miniMapCamera);
const miniMapSize = 200;
miniMapView.setSize(miniMapSize, miniMapSize);

// 리사이즈 시 메인 뷰의 논리 크기(screenRectObject)를 기준으로 미니맵 위치 업데이트
redGPUContext.onResize = () => {
    const { width } = mainView.screenRectObject;
    miniMapView.setPosition(width - miniMapSize - 10, 10);
};
redGPUContext.addView(miniMapView);
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
        const sharedScene = new RedGPU.Display.Scene(redGPUContext);

        // 메인 뷰
        const mainCamera = new RedGPU.Camera.OrbitController(redGPUContext);
        const mainView = new RedGPU.Display.View3D(redGPUContext, sharedScene, mainCamera);
        mainView.setSize('100%', '100%');
        mainView.grid = true;
        redGPUContext.addView(mainView);

        // 미니맵 뷰
        const miniMapSize = 200;
        const miniMapCamera = new RedGPU.Camera.PerspectiveCamera();
        miniMapCamera.y = 50;
        miniMapCamera.lookAt(0, 0, 0.1);

        const miniMapView = new RedGPU.Display.View3D(redGPUContext, sharedScene, miniMapCamera);
        miniMapView.setSize(miniMapSize, miniMapSize);
        miniMapView.axis = true;
        miniMapView.grid = true;
        redGPUContext.addView(miniMapView);

        // screenRectObject를 사용한 정밀 위치 업데이트
        const updateLayout = () => {
            const { width } = mainView.screenRectObject;
            miniMapView.setPosition(width - miniMapSize - 10, 10);
        };

        redGPUContext.onResize = updateLayout;
        updateLayout(); // 초기 배치

        // 물체 추가
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

<br/>

## 6. 시스템 구조

`View3D`가 전체 엔진 아키텍처에서 수행하는 역할입니다. `Renderer`는 등록된 `View3D`를 순회하며 렌더링 패스를 실행합니다.

<ClientOnly>
  <MermaidResponsive :definition="viewGraph" />
</ClientOnly>

## 다음 학습 추천

- **[씬 (Scene)](./scene.md)**: 3D 객체들을 배치하는 가상 공간 관리.
- **[카메라 (Camera)](./camera.md)**: 다양한 시점 제어 및 카메라 타입.
- **[RedGPU Context](../context/context.md)**: 멀티 뷰 관리 및 엔진 설정 상세 가이드.
