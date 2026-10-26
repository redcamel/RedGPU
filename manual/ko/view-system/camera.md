---
title: Camera
order: 4
---

<script setup>
const cameraGraph = `
    graph LR
        World["3D 월드 좌표계 (Scene)"]
        ViewMat["뷰 행렬 (position, lookAt)"]
        ProjMat["투영 행렬 (FOV / 직교 영역, Clipping)"]
        Screen["2D 화면 좌표계 (View3D)"]

        World -->|시점 변환| ViewMat
        ViewMat -->|투영 변환| ProjMat
        ProjMat -->|최종 출력| Screen

        %% 회색조 스타일 일괄 적용
        style World fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style ViewMat fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style ProjMat fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Screen fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
`
</script>

# Camera

`Scene` 이 모든 물체가 배치된 '무대'라면, `Camera` 는 그 무대를 바라보는 '관찰자의 눈'입니다. 3D **월드 좌표계**(World Coordinate)를 2D **화면 좌표계**(Screen
Coordinate)로 변환하기 위한 **투영 행렬**(Projection Matrix)과 **뷰 행렬**(View Matrix)을 관리하는 핵심 객체입니다.

## 1. 아키텍처 및 역할

`Camera` 는 3D 공간의 물체를 어느 위치에서 어떤 시야각으로 바라볼지 결정하여 `View3D` 에 전달합니다.

<ClientOnly>
  <MermaidResponsive :definition="cameraGraph" />
</ClientOnly>

- **다양한 투영 방식 지원**: 원근감이 적용되는 `PerspectiveCamera`, 거리 왜곡이 없는 `OrthographicCamera`, 2D 전용 `Camera2D` 를 제공합니다.
- **시점 및 절두체 제어**: 카메라의 월드 위치 (`setPosition`), 응시 지점 (`lookAt`), 시야각 (`fieldOfView`), 가시 거리 (`nearClipping`,
  `farClipping`)를 제어합니다.
- **자동 노출 관리**: 주변 광량 변화에 맞춰 화면의 적정 밝기를 실시간으로 계산하는 자동 노출 (`useAutoExposure`) 방식으로 기본 관리됩니다.

---

## 2. 카메라 유형 및 기본 설정

용도에 따라 세 가지 카메라 클래스를 제공하며, 일반적인 3D 씬에서는 `PerspectiveCamera` 를 사용합니다.

| 클래스                   | 투영 방식                | 설명 및 주요 용도                                                                                              |
|:-------------------------|:-------------------------|:---------------------------------------------------------------------------------------------------------------|
| **`PerspectiveCamera`**  | 원근 투영 (Perspective)  | 거리에 따라 원근감이 적용되는 표준 3D 카메라입니다.                                                            |
| **`OrthographicCamera`** | 직교 투영 (Orthographic) | 거리에 따른 원근 왜곡 없이 물체의 일정한 비율을 유지합니다. 2.5D 아이소메트릭 뷰나 CAD 도면 뷰어에 적합합니다. |
| **`Camera2D`**           | 2D 평면 투영             | `View2D` 생성 시 내부적으로 자동 생성되는 2D 렌더링 전용 카메라입니다.                                         |

`PerspectiveCamera` 는 별도의 컨텍스트 주입 없이 생성하며, 위치 이동 후 `lookAt(x, y, z)` 로 바라볼 목표 좌표를 지정합니다.

```javascript
const camera = new RedGPU.Camera.PerspectiveCamera();

// 시야각 및 가시 거리(절두체 클리핑 평면) 설정
camera.fieldOfView = 45;     // 수직 시야각 (기본값: 60도)
camera.nearClipping = 0.1;   // 근평면 거리 (기본값: 0.1)
camera.farClipping = 50000;  // 원평면 거리 (기본값: 50000)

// 카메라 위치 이동 및 원점 응시
camera.setPosition(0, 5, -15);
camera.lookAt(0, 0, 0);
```

---

## 3. 실습 예제: 카메라 궤도 회전과 `lookAt()`

매 프레임 카메라의 `x`, `z` 좌표를 원형 궤도로 이동시키면서 `lookAt(0, 0, 0)` 을 호출하여 항상 중앙의 물체를 주시하도록 하는 예제입니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();

    // 1. PerspectiveCamera 생성 및 초기 설정
    const camera = new RedGPU.Camera.PerspectiveCamera();
    camera.y = 8;
    camera.fieldOfView = 45;
    camera.lookAt(0, 0, 0);

    // 2. 씬 구성 (TorusKnot + 조명)
    const mesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.TorusKnot(redGPUContext),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#00adb5')
    );
    scene.addChild(mesh);

    const dirLight = new RedGPU.Light.DirectionalLight();
    scene.lightManager.addDirectionalLight(dirLight);

    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
    view.grid = true;
    redGPUContext.addView(view);

    // 3. 매 프레임 카메라 궤도 이동 및 원점 주시
    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, (time) => {
        const angle = time / 1000;
        camera.x = Math.sin(angle) * 15;
        camera.z = Math.cos(angle) * 15;
        camera.lookAt(0, 0, 0);
    });
});
```

### 라이브 데모

<ClientOnly>
<CodePen title="RedGPU Basics - Camera lookAt" slugHash="camera-lookat">
<pre data-lang="html">
&lt;canvas id="redgpu-canvas"&gt;&lt;/canvas&gt;
</pre>
<pre data-lang="css">
body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
</pre>
<pre data-lang="js">
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById("redgpu-canvas");

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    const mesh = new RedGPU.Display.Mesh(
        redGPUContext, 
        new RedGPU.Primitive.TorusKnot(redGPUContext),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#00adb5')
    );
    scene.addChild(mesh);

    const dirLight = new RedGPU.Light.DirectionalLight();
    scene.lightManager.addDirectionalLight(dirLight);

    const camera = new RedGPU.Camera.PerspectiveCamera();
    camera.y = 8;
    camera.fieldOfView = 45;

    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
    view.grid = true;
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, (time) => {
        const angle = time / 1000;
        camera.x = Math.sin(angle) * 15;
        camera.z = Math.cos(angle) * 15;
        camera.lookAt(0, 0, 0);
    });
});
</pre>
</CodePen>
</ClientOnly>

---

## 관련 예제

- [OrbitController 카메라 제어](/RedGPU/examples/3d/controller/orbitController/)
- [IsometricController 직교 투영 카메라](/RedGPU/examples/3d/controller/isometricController/)
- [절두체 컬링 (Frustum Culling)](/RedGPU/examples/3d/frustumCulling/frustumCulling/)

---

## 다음 단계

카메라의 위치를 코드로 일일이 계산하는 대신, 마우스와 터치·키보드를 이용해 직관적으로 시점을 조종하는 방법을 알아봅니다.

- **[Camera Controller](./controller.md)** : 마우스·터치·키보드를 이용한 인터랙티브 카메라 및 캐릭터 제어
