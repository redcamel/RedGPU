<script setup>
const sceneGraph = `
    Scene["Scene (Root)"] --> ParentMesh["Parent Mesh"]
    ParentMesh --> ChildMesh1["Child Mesh A"]
    ParentMesh --> ChildMesh2["Child Mesh B"]
    ChildMesh2 --> GrandChild["Grandchild Mesh"]
`
</script>

# 씬 그래프 (Scene Graph)

**Scene Graph**는 3D 공간에 배치된 객체들의 계층 구조를 의미합니다. RedGPU에서는 모든 **Mesh**가 다른 메시의 부모가 될 수 있으며, 부모의 변환(위치, 회전, 크기)은 자식에게 고스란히 상속됩니다.

## 1. 메시 계층 구조

RedGPU의 **Mesh**는 지오메트리와 머티리얼을 가진 가시 객체임과 동시에, 다른 메시를 포함할 수 있는 컨테이너 역할을 합니다.

- **부모 메시 (Parent)**: 자식 객체를 포함하는 기준점입니다. 부모가 움직이면 자식은 부모와의 상대적인 거리를 유지하며 함께 움직입니다.
- **자식 메시 (Child)**: 부모에게 소속된 객체입니다. 자신의 `x, y, z` 좌표는 부모의 중심점을 `(0, 0, 0)`으로 간주하는 상대 좌표로 계산됩니다.

<ClientOnly>
  <MermaidResponsive :definition="sceneGraph" />
</ClientOnly>

## 2. 계층 구조 형성: addChild

**RedGPU.Display.Mesh**의 `addChild()` 메서드를 사용하여 특정 메시를 다른 메시의 자식으로 등록할 수 있습니다.

```javascript
// 부모 메시 생성 (태양)
const sun = new RedGPU.Display.Mesh(redContext, sunGeo, sunMat);
scene.addChild(sun);

// 자식 메시 생성 (지구)
const earth = new RedGPU.Display.Mesh(redContext, earthGeo, earthMat);

// 지구가 태양의 자식이 됨
sun.addChild(earth);

// 이제 earth.x = 5는 태양으로부터 5만큼 떨어진 위치를 의미합니다.
earth.x = 5;
```

## 3. 변환 상속 (Transformation Inheritance)

부모 메시의 상태 변화는 모든 자식에게 영향을 미칩니다.

1. **위치 이동**: 부모가 이동하면 자식은 부모에 부착된 상태로 함께 이동합니다.
2. **회전**: 부모가 자신의 축을 기준으로 회전하면 자식은 부모의 중심을 축으로 삼아 공전하듯 회전합니다.
3. **크기 조절**: 부모의 크기가 2배가 되면 자식의 크기와 부모로부터의 거리도 모두 2배가 됩니다.

## 4. 실습: 계층 구조를 이용한 공전 모델

부모 메시의 회전이 자식에게 어떻게 영향을 미치는지 확인해 보겠습니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redContext) => {
    const scene = new RedGPU.Display.Scene(redContext);
    const camera = new RedGPU.Camera.PerspectiveCamera(redContext);
    camera.z = -15; camera.y = 5;
    camera.lookAt(0, 0, 0);

    // 1. 태양 생성 (루트 부모)
    const sun = new RedGPU.Display.Mesh(
        redContext,
        new RedGPU.Primitive.Sphere(redContext, 2),
        new RedGPU.Material.ColorMaterial(redContext, '#ff4500')
    );
    scene.addChild(sun);

    // 2. 지구 생성 (태양의 자식)
    const earth = new RedGPU.Display.Mesh(
        redContext,
        new RedGPU.Primitive.Sphere(redContext, 0.7),
        new RedGPU.Material.ColorMaterial(redContext, '#1890ff')
    );
    earth.x = 7; // 태양(부모)으로부터 7만큼 떨어진 위치
    sun.addChild(earth); // 태양에 지구 추가

    // 3. 달 생성 (지구의 자식)
    const moon = new RedGPU.Display.Mesh(
        redContext,
        new RedGPU.Primitive.Sphere(redContext, 0.3),
        new RedGPU.Material.ColorMaterial(redContext, '#ffffff')
    );
    moon.x = 2; // 지구(부모)로부터 2만큼 떨어진 위치
    earth.addChild(moon); // 지구에 달 추가

    const view = new RedGPU.Display.View3D(redContext, scene, camera);
    redContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redContext, () => {
        // 태양만 회전시켜도 자식인 지구와 달이 함께 공전합니다.
        sun.rotationY += 1;
        
        // 지구를 회전시키면 자식인 달이 지구 주위를 공전합니다.
        earth.rotationY += 2;
    });
});
```

## 라이브 데모

<ClientOnly>
<CodePen title="RedGPU Basics - Mesh Hierarchy" slugHash="mesh-hierarchy">
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

RedGPU.init(canvas, (redContext) => {
    const scene = new RedGPU.Display.Scene(redContext);
    const camera = new RedGPU.Camera.PerspectiveCamera(redContext);
    camera.z = -15; camera.y = 5;
    camera.lookAt(0, 0, 0);

    const sun = new RedGPU.Display.Mesh(
        redContext,
        new RedGPU.Primitive.Sphere(redContext, 2),
        new RedGPU.Material.ColorMaterial(redContext, '#ff4500')
    );
    scene.addChild(sun);

    const earth = new RedGPU.Display.Mesh(
        redContext,
        new RedGPU.Primitive.Sphere(redContext, 0.7),
        new RedGPU.Material.ColorMaterial(redContext, '#1890ff')
    );
    earth.x = 7;
    sun.addChild(earth);

    const moon = new RedGPU.Display.Mesh(
        redContext,
        new RedGPU.Primitive.Sphere(redContext, 0.3),
        new RedGPU.Material.ColorMaterial(redContext, '#ffffff')
    );
    moon.x = 2;
    earth.addChild(moon);

    const view = new RedGPU.Display.View3D(redContext, scene, camera);
    redContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redContext, () => {
        sun.rotationY += 1;
        earth.rotationY += 2;
    });
});
</pre>
</CodePen>
</ClientOnly>

## 핵심 요약

- 모든 **Mesh**는 부모 컨테이너가 되어 자식 메시를 포함할 수 있습니다.
- 자식의 좌표는 항상 부모의 위치를 기준으로 하는 **상대 좌표**입니다.
- 부모의 회전과 크기 변환은 자식에게 물리적으로 상속되어 복잡한 연동 애니메이션을 쉽게 구현할 수 있습니다.

## 다음 학습 추천

외부에서 제작된 정교한 3D 모델(GLTF)을 불러와 사용하는 방법을 알아봅니다.

- **[모델 로딩 (GLTF Loader) →](./gltf-loader.md)**
