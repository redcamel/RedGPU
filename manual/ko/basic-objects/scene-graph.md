---
title: Scene Graph
order: 2
---

<script setup>
const sceneGraph = `
    Scene["Scene (최상위 루트)"] --> Group["Group3D (그룹 컨테이너)"]
    Group --> ParentMesh["부모 메시"]
    ParentMesh --> ChildMesh1["자식 메시 A"]
    ParentMesh --> ChildMesh2["자식 메시 B"]
    ChildMesh2 --> GrandChild["하위 자식 메시"]

    %% 회색조 스타일 적용
    style Scene fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
    style Group fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style ParentMesh fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style ChildMesh1 fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style ChildMesh2 fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style GrandChild fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`
</script>

# Scene Graph

**Scene Graph** 는 3D 공간에 배치된 객체들의 부모-자식 계층 구조로, 부모 객체 (`Group3D`, `Mesh`)의 공간 변형 (이동·회전·스케일)과 투명도가 하위 자식 노드들에게 자동으로 상속되는
트리 시스템입니다.

<ClientOnly>
  <MermaidResponsive :definition="sceneGraph" />
</ClientOnly>

---

## 1. 계층 노드 구성과 `Group3D`

RedGPU의 모든 디스플레이 객체는 `Object3DContainer` 를 상속받아 자식 노드를 보유할 수 있습니다. 자체 지오메트리·머티리얼 없이 순수하게 여러 객체를 논리적 그룹으로 묶어 이동·회전·스케일만
일괄 제어할 때는 `RedGPU.Display.Group3D` (2D 환경에서는 `RedGPU.Display.Group2D`)를 사용합니다.

| 구성 요소                 | 역할 및 특징                                                                                                              |
|:--------------------------|:--------------------------------------------------------------------------------------------------------------------------|
| **`Group3D` / `Group2D`** | 화면에 직접 그려지지 않으면서 자식 객체들의 공통 기준점(Pivot) 및 논리적 묶음 역할만 수행하는 경량 컨테이너               |
| **부모 노드 (`Parent`)**  | 자식 객체들을 포함하는 기준 좌표계. 부모가 이동·회전·스케일되면 자식도 상대적 관계를 유지하며 함께 변환됨                 |
| **자식 노드 (`Child`)**   | 부모에 소속된 객체. 자식의 `x, y, z` 좌표는 부모의 중심점을 `(0, 0, 0)` 으로 간주하는 **상대 좌표**(Local Space)로 계산됨 |

### 주요 컨테이너 제어 메서드

- **`addChild(child)` / `removeChild(child)`**: 자식 객체를 등록하거나 제거합니다.
- **`children` / `numChildren`**: 현재 등록된 자식 배열과 개수를 조회합니다.

> 특정 인덱스 삽입 (`addChildAt`), 순서 변경 (`setChildIndex`, `swapChildren`), 일괄 제거 (`removeAllChildren`) 등 전체 컨테이너 메서드는
> `Object3DContainer` API 문서를 참고하세요.

```javascript
// 1. 논리적 컨테이너 Group3D 생성
const solarSystemGroup = new RedGPU.Display.Group3D('SolarSystem');
scene.addChild(solarSystemGroup);

// 2. 부모 메시(태양)를 그룹에 추가
const sun = new RedGPU.Display.Mesh(redGPUContext, sunGeo, sunMat);
solarSystemGroup.addChild(sun);

// 3. 자식 메시(지구)를 태양의 자식으로 등록 (태양 중심 기준 상대 좌표 x = 5)
const earth = new RedGPU.Display.Mesh(redGPUContext, earthGeo, earthMat);
earth.x = 5;
sun.addChild(earth);
```

---

## 2. 실습 예제: 계층 구조를 이용한 공전 모델

태양 (`sun`)의 자식으로 지구 (`earth`)를, 지구의 자식으로 달 (`moon`)을 등록하여 부모의 회전만으로 공전 궤도를 구현하는 예제입니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    const camera = new RedGPU.Camera.PerspectiveCamera();
    camera.z = -15; camera.y = 5;
    camera.lookAt(0, 0, 0);

    // 1. 태양 생성 (루트 부모)
    const sun = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext, 2),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#ff4500')
    );
    scene.addChild(sun);

    // 2. 지구 생성 (태양의 자식, 상대 거리 7)
    const earth = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext, 0.7),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#1890ff')
    );
    earth.x = 7;
    sun.addChild(earth);

    // 3. 달 생성 (지구의 자식, 상대 거리 2)
    const moon = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext, 0.3),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#ffffff')
    );
    moon.x = 2;
    earth.addChild(moon);

    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        sun.rotationY += 1;   // 태양 회전 -> 지구와 달이 함께 공전
        earth.rotationY += 2; // 지구 회전 -> 달이 지구 주위를 공전
    });
});
```

### 라이브 데모

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

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
const camera = new RedGPU.Camera.PerspectiveCamera ();
    camera.z = -15; camera.y = 5;
    camera.lookAt(0, 0, 0);

    const sun = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext, 2),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#ff4500')
    );
    scene.addChild(sun);

    const earth = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext, 0.7),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#1890ff')
    );
    earth.x = 7;
    sun.addChild(earth);

    const moon = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext, 0.3),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#ffffff')
    );
    moon.x = 2;
    earth.addChild(moon);

    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        sun.rotationY += 1;
        earth.rotationY += 2;
    });
});
</pre>
</CodePen>
</ClientOnly>

---

## 다음 단계

- **[Texture](./texture.md)** : 외부 이미지 및 압축 텍스처를 불러와 머티리얼에 매핑하는 방법
