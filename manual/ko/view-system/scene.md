---
title: Scene
order: 3
---
<script setup>
const sceneGraph = `
    graph TD
        Scene["RedGPU.Display.Scene (최상위 씬)"]
        LightMgr["LightManager (조명 매니저)"]
        ShadowMgr["ShadowManager (그림자 매니저)"]
        PhysicsEngine["PhysicsEngine (물리 엔진)"]
        Children["자식 노드 (Mesh, Group3D)"]
        Ambient["AmbientLight (환경광)"]
        DirLight["DirectionalLight (방향광)"]

        Scene -->|소유| LightMgr
        Scene -->|소유| ShadowMgr
        Scene -->|소유| PhysicsEngine
        Scene -->|포함| Children
        
        LightMgr -->|관리| Ambient
        LightMgr -->|관리| DirLight
        
        %% 회색조 스타일 일괄 적용
        style Scene fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style LightMgr fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style ShadowMgr fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style PhysicsEngine fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Children fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Ambient fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style DirLight fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`
</script>

# Scene

`View3D` 가 장면을 보여주는 '창문'이라면, `Scene` 은 그 창문 너머에 펼쳐지는 '무대'입니다. 3D 공간에 배치되는 모든 디스플레이 객체 (`Mesh`, `Group3D` 등)와 조명, 그림자, 자연
환경 및 물리 엔진을 통합 관리하는 **씬 그래프**(Scene Graph)의 **루트 컨테이너**(`Object3DContainer`) 역할을 수행합니다.

## 1. 아키텍처 및 역할

`Scene` 은 단순한 컨테이너 역할을 넘어 다음과 같은 핵심 기능을 수행합니다.

<ClientOnly>
  <MermaidResponsive :definition="sceneGraph" />
</ClientOnly>

- **3D 객체 계층 관리**: `addChild(child)` 및 `removeChild(child)` 메서드를 통해 렌더링할 3D 객체들의 부모-자식 트리 구조 (`children`)를 관리합니다.
- **조명 및 그림자 통합 관리**: 기본적으로 포함된 `lightManager` 와 `shadowManager` 를 통해 씬 전체에 영향을 주는 광원 및 그림자 데이터를 통합 관리합니다.
- **자연 환경 및 시뮬레이션 통합**: 오픈월드 지형 (`landscape`), 수체 (`addWater`), 전역 바람 (`windManager`) 및 물리 엔진 (`physicsEngine`)을 씬 단위로
  바인딩하여 제어합니다.

---

## 2. 기본 사용법

`Scene` 의 가장 기본적인 역할은 렌더링할 3D 물체와 조명을 담는 것입니다. 생성된 3D 객체는 `scene.addChild()` 로 등록해야 화면에 나타나며, 광원은 `scene.lightManager` 에
추가합니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();

    // 1. 조명 등록 (LightManager)
    const dirLight = new RedGPU.Light.DirectionalLight();  
    scene.lightManager.addDirectionalLight(dirLight);

    // 2. 3D 객체 추가 (addChild)
    const mesh = new RedGPU.Display.Mesh(
        redGPUContext, 
        new RedGPU.Primitive.TorusKnot(redGPUContext, 2, 0.6, 128, 32),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0055')
    );
    scene.addChild(mesh);

    // 3. 뷰 연결 및 렌더링 시작
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.grid = true;
    view.axis = true;
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        mesh.rotationY += 1;
        mesh.rotationX += 0.5;
    });
});
```

### 라이브 데모

<ClientOnly>
<CodePen title="RedGPU Basics - Scene Complete" slugHash="scene-complete">
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

    // Lighting
    const dirLight = new RedGPU.Light.DirectionalLight();
    scene.lightManager.addDirectionalLight(dirLight);

    // Add Object (TorusKnot)
    const mesh = new RedGPU.Display.Mesh(
        redGPUContext, 
        new RedGPU.Primitive.TorusKnot(redGPUContext, 2, 0.6, 128, 32),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0055')
    );
    scene.addChild(mesh);

    // View & Render
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.grid = true;
    view.axis = true;
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        mesh.rotationY += 1;
        mesh.rotationX += 0.5;
    });
});
</pre>
</CodePen>
</ClientOnly>

---

## 3. 씬 고유 배경색 설정

기본적으로 뷰포트 배경은 `redGPUContext.backgroundColor` 를 따르지만, `scene.useBackgroundColor = true` 로 활성화하면 해당 `Scene` 만의 독립적인 배경 색상
(`ColorRGBA`)을 지정할 수 있습니다.

```javascript
scene.useBackgroundColor = true;
scene.backgroundColor.setColorByHEX('#1a1a2e');
```

---

## 4. 다중 뷰 장면 공유

하나의 `Scene` 인스턴스를 여러 `View3D` 에 동시에 연결하면, 동일한 3D 공간을 서로 다른 카메라 시점으로 렌더링할 수 있습니다.

```javascript
const sharedScene = new RedGPU.Display.Scene();

const mainView = new RedGPU.Display.View3D(redGPUContext, sharedScene, mainCamera);
const subView = new RedGPU.Display.View3D(redGPUContext, sharedScene, subCamera);
```

---

## 관련 예제

- [Scene 기본 구성](/RedGPU/examples/3d/scene/)
- [다중 뷰 Scene 공유](/RedGPU/examples/3d/view/multiView/)

---

## 다음 단계

`Scene`(무대)까지 준비되었으니, 이제 이 무대를 바라볼 **시점**을 정의해야 합니다. 3D 공간을 2D 화면으로 투영하는 `Camera` 에 대해 알아봅니다.

- **[Camera](./camera.md)** : 3D 공간을 2D 화면으로 투영하는 카메라와 시점 제어
