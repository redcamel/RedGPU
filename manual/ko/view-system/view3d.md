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

**View System** 의 가장 핵심적인 '틀' 역할을 하는 **View3D** 는, **RedGPUContext** 내에서 실제로 렌더링이 수행되는 **화면 영역**(Viewport) 을 정의하는 객체입니다. 
장면 데이터(**Scene**) 와 시점 정보(**Camera**) 를 하나로 묶어 최종 프레임을 생성하는 **렌더링 패스**(Render Pass) 역할을 수행합니다.

## 1. 기술적 개요

**View3D** 는 **RedGPUContext** 로부터 생성된 GPU 환경 위에서 동작하며, 다른 구성 요소들과 다음과 같은 관계를 맺습니다.

<ClientOnly>
  <MermaidResponsive :definition="viewSystemGraph" />
</ClientOnly>

**View3D** 인스턴스는 다음과 같은 독립적인 설정과 기능을 가집니다.

* **독립적 환경 설정**: 스카이박스(Skybox), 스카이 대기(SkyAtmosphere), IBL 등을 뷰별로 다르게 적용 가능
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

### 3.3 뷰별 크기 변경 감지 (onResize)

`redGPUContext.onResize`가 전체 캔버스의 크기 변화를 감지한다면, 개별 **View3D** 객체의 `onResize` 콜백은 해당 뷰의 크기가 변경될 때마다 호출됩니다. 

뷰의 크기를 퍼센트(`%`) 단위로 설정했을 때 부모인 캔버스 크기가 변하거나, `setSize()`를 통해 직접 크기를 변경할 때 유용하게 사용할 수 있습니다. 이 콜백은 `RedResizeEvent` 인터페이스
형식의 이벤트를 인자로 받습니다.

#### RedResizeEvent 인터페이스 구조

| 속성명                    | 타입                  | 설명                                                              |
|:-----------------------|:--------------------|:----------------------------------------------------------------|
| **`target`**           | `T` (예: `View3D`)   | 이벤트가 발생한 대상 뷰 인스턴스                                              |
| **`screenRectObject`** | `IRedGPURectObject` | CSS 픽셀 단위의 크기 및 위치 정보 (`{ x, y, width, height }`)               |
| **`pixelRectObject`**  | `IRedGPURectObject` | `devicePixelRatio`가 적용된 물리 픽셀 단위 정보 (`{ x, y, width, height }`) |

```typescript
import {RedResizeEvent, View3D} from "RedGPU";

// 개별 뷰의 크기 변경 시 호출될 콜백 정의
view.onResize = (event: RedResizeEvent<View3D>) => {
    const {target, screenRectObject, pixelRectObject} = event;
    const {width, height} = screenRectObject;
    console.log(`뷰 영역 변경: ${width}x${height} (물리 해상도: ${pixelRectObject.width}x${pixelRectObject.height})`);
    
    // 해당 뷰 내의 특정 UI 요소를 재배치하거나 카메라 설정을 조정합니다.
};
```


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
const miniMapCamera = new RedGPU.Camera.PerspectiveCamera();
miniMapCamera.y = 50;
miniMapCamera.lookAt(0, 0, 0);

const miniMapView = new RedGPU.Display.View3D(redGPUContext, sharedScene, miniMapCamera);
const miniMapSize = 200;
miniMapView.setSize(miniMapSize, miniMapSize);
redGPUContext.addView(miniMapView);

// 3. 리사이즈 시 메인 뷰의 표시 크기를 기준으로 미니맵 위치 갱신
redGPUContext.onResize = (event) => {
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
        const miniMapCamera = new RedGPU.Camera.PerspectiveCamera();
        miniMapCamera.y = 50;
        miniMapCamera.lookAt(0, 0, 0.1);

        const miniMapView = new RedGPU.Display.View3D(redGPUContext, sharedScene, miniMapCamera);
        miniMapView.setSize(miniMapSize, miniMapSize);
        miniMapView.axis = true;
        miniMapView.grid = true;
        redGPUContext.addView(miniMapView);

        const updateLayout = (event) => {
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

## 6. 주요 API 속성 및 메서드

`View3D` 클래스는 3D 렌더링의 퀄리티 조절, 성능 최적화 및 유틸리티를 위한 다양한 API를 제공합니다.

### 6.1 환경 및 조명 설정

* **`skybox`** (`SkyBox`): 뷰에 배경으로 그려질 스카이박스 인스턴스를 설정하거나 가져옵니다.
* **`skyAtmosphere`** (`SkyAtmosphere`): 대기 산란 효과를 연출하기 위한 스카이 대기를 설정하거나 가져옵니다.
* **`ibl`** (`IBL`): 이미지 기반 조명(Image-Based Lighting) 효과를 위한 IBL 데이터를 연결하거나 가져옵니다.

### 6.2 후처리 및 톤 매핑 매니저

* **`postEffectManager`** (`PostEffectManager`): 블러, 블룸 등 해당 뷰 영역 전체에 최종 적용할 후처리 필터들을 추가하고 관리하는 매니저입니다.
* **`toneMappingManager`** (`ToneMappingManager`): 고대비(HDR)로 계산된 해당 뷰의 렌더링 결과물을 모니터 표준 범위(SDR)로 변환해주는 톤 매핑 정책을 관리합니다.

### 6.3 렌더링 최적화 (Culling)

* **`useFrustumCulling`** (`boolean`, 기본값: `true`): 카메라 시야각(절두체)을 벗어난 메쉬들의 드로우 콜을 자동으로 생략하여 프레임 레이트를 높입니다.
* **`useDistanceCulling`** (`boolean`, 기본값: `false`): 카메라와 메쉬 간의 거리를 기준으로 특정 거리 이상 멀어진 물체의 렌더링을 차단합니다.
* **`distanceCulling`** (`number`, 기본값: `50`): 거리 기반 컬링을 수행할 한계 거리 수치입니다.

### 6.4 유틸리티 및 디버그 상태 데이터

* **`renderViewStateData`** (`RenderViewStateData`, 읽기 전용): 이 뷰의 실시간 렌더링 통계 정보가 축적되는 읽기 전용 객체입니다. 개발 시 성능 프로파일링 및 최적화 상태
  디버깅에 유용합니다.
    * `renderResults.numDrawCalls`: 현재 뷰에서 발생한 총 드로우 콜(Draw Call) 횟수
    * `renderResults.numTriangles`: 현재 뷰에서 최종 렌더링된 총 폴리곤(삼각형) 개수
    * `renderResults.num3DObjects`: 씬 그래프 내에서 컬링을 통과해 실제 렌더링된 3D 객체 수
    * `renderResults.numInstances`: 인스턴스 렌더링 기법이 적용된 총 인스턴스 개수
    * `renderResults.numDirtyPipelines`: 재컴파일되거나 갱신된 파이프라인 개수
* **`screenToWorld(screenX, screenY)`**: 2D 캔버스 화면의 마우스나 터치 좌표를 3D 공간상의 월드 좌표(`[x, y, z]`)로 역계산하여 반환합니다.
* **`checkMouseInViewBounds()`**: 마우스 포인터가 현재 이 뷰의 픽셀 영역 내부 영역에 위치하는지 여부를 검사해 `boolean`으로 반환합니다.

---

## 다음 단계

**View3D** 를 통해 장면을 그려낼 '틀' 을 준비했습니다. 이제 그 틀 안에 채워넣을 실제 **장면**(Scene) 을 구성할 차례입니다.

메시와 조명이 배치되는 공간인 **Scene** 의 역할과 구성 방법을 알아봅니다.

- **[Scene](./scene.md)**
