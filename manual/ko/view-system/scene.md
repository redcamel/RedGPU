---
title: Scene
order: 3
---
<script setup>
const sceneGraph = `
    graph TD
        Scene["RedGPU.Display.Scene (Root Node)"]
        LightMgr["LightManager (Uniform Buffer)"]
        Children["Child Nodes (Mesh, Group)"]
        Ambient["AmbientLight"]
        DirLight["DirectionalLight"]

        Scene -->|Owns| LightMgr
        Scene -->|Contains| Children
        
        LightMgr -->|Manages| Ambient
        LightMgr -->|Manages| DirLight
        
        %% 커스텀 클래스 적용
        class Scene mermaid-main;
        class LightMgr mermaid-system;
`
</script>

# Scene

**View3D** 가 장면을 보여주는 '창문'이라면, **Scene** 은 그 창문 너머에 펼쳐지는 '무대'입니다.
렌더링될 모든 3D 객체(Mesh, Group)와 조명(Light)을 포함하는 **씬 그래프**(Scene Graph) 의 최상위 루트 노드(Root Node) 역할을 수행합니다.

## 1. 아키텍처 및 역할

**Scene** 은 단순한 컨테이너 역할을 넘어 다음과 같은 핵심 기능을 수행합니다.

<ClientOnly>
  <MermaidResponsive :definition="sceneGraph" />
</ClientOnly>

*   **계층 구조 관리**: `addChild()`, `removeChild()` 메서드를 통해 객체들의 부모-자식 관계를 관리합니다.
*   **조명 데이터 관리**: 기본적으로 포함된 **LightManager** 를 통해 씬 전체에 영향을 주는 조명 데이터를 GPU 버퍼(Uniform Buffer)로 통합 관리합니다.

## 2. 객체 관리 (Hierarchy)

**Scene** 의 가장 기본적인 역할은 렌더링할 3D 물체들을 담는 것입니다. 생성된 객체는 `addChild()` 를 통해 씬에 추가되어야만 화면에 나타납니다.

```javascript
// 1. Scene 생성
const scene = new RedGPU.Display.Scene();

// 2. 3D 물체(Mesh) 를 생성하여 추가
// 혹시 **Mesh** 에 대한 개념이 아직 생소하시더라도 걱정하지 마세요.
// 상세한 생성 방법은 이어지는 **Basic Objects** 파트에서 자세히 다룰 예정입니다.
const box = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

// 물체의 위치를 설정하여 공간 상에 배치합니다.
box.x = 0;
box.y = 1;
box.z = -5;

scene.addChild(box);
```

::: info [학습 가이드]
물체를 구성하는 방법이 아직 익숙하지 않으시더라도, **Scene** 에 여러 요소를 담았을 때의 시각적 변화를 가볍게 확인해 보시기 바랍니다. (코드는 참고용으로만 훑어보셔도 충분합니다!)
:::

## 3. 조명 관리자 (Light Manager)

단순히 물체에 색상을 칠하는 것을 넘어, 깊이감 있는 명암과 사실적인 입체감을 구현하기 위해서는 조명이 필요합니다. 
**Scene** 은 내부적으로 **LightManager** 를 소유하고 있어, 여기에 등록된 다양한 광원들이 씬 전체에 유기적으로 작용하도록 통합 관리합니다.

```javascript
// Ambient Light (전역 환경광) 설정
scene.lightManager.ambientLight = new RedGPU.Light.AmbientLight('#ffffff', 0.1);

// Directional Light (방향성 광원) 추가
const dirLight = new RedGPU.Light.DirectionalLight();
scene.lightManager.addDirectionalLight(dirLight);

// [참고] 조명 효과를 보려면 PhongMaterial 등 조명에 반응하는 재질을 사용해야 합니다.
// const material = new RedGPU.Material.PhongMaterial(redGPUContext);
```

## 4. 실습 예제

앞서 배운 객체 추가와 조명 설정을 결합하여 완성된 씬을 구성해 봅니다.
입체감이 잘 드러나는 **TorusKnot** 모델을 사용하고, 공간감을 파악하기 위해 **Grid** 와 **Axis** 를 활성화했습니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // 1. 조명 설정
    const dirLight = new RedGPU.Light.DirectionalLight();  
    scene.lightManager.addDirectionalLight(dirLight);

    // 2. 객체 추가 (TorusKnot)
    const mesh = new RedGPU.Display.Mesh(
        redGPUContext, 
        new RedGPU.Primitive.TorusKnot(redGPUContext, 2, 0.6, 128, 32),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0055')
    );
    scene.addChild(mesh);

    // 3. 뷰 연결 및 디버깅 도구 활성화
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

## 5. 장면 공유 (Shared Model)

**Scene** 은 렌더링될 데이터와 상태를 가진 모델(Model) 입니다. 하나의 **Scene** 인스턴스를 여러 개의 **View3D** 가 동시에 참조할 수 있습니다. 

이를 통해 동일한 장면에 추가된 물체나 조명의 변화를 서로 다른 시점(Camera)에서 실시간으로 관찰하는 기능을 효율적으로 구현할 수 있습니다.

```javascript
// 하나의 Scene 생성 (공유 데이터)
const sharedScene = new RedGPU.Display.Scene();

// 여러 View에서 동일한 Scene 을 참조
const view1 = new RedGPU.Display.View3D(redGPUContext, sharedScene, camera1);
const view2 = new RedGPU.Display.View3D(redGPUContext, sharedScene, camera2);
```

::: tip [멀티 뷰 레이아웃]
여러 개의 뷰를 화면에 배치하고 크기를 조절하는 상세한 방법은 **[View3D](./view3d.md)** 문서의 멀티 뷰 시스템 섹션을 참고하세요.
:::

---

## 다음 단계

**Scene** (무대)까지 준비되었으니, 이제 이 무대를 바라볼 **시점**을 정의해야 합니다.
3D 공간을 2D 화면으로 투영하는 **Camera** 에 대해 알아봅니다.

- **[Camera (카메라)](./camera.md)**
