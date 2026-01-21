---
order: 4
---

<script setup>
const meshGraph = `
    Geometry["지오메트리 (형태)"] -->|구성| Mesh["메시 (객체)"]
    Material["머티리얼 (표면)"] -->|구성| Mesh
`
</script>

# 메시 (Mesh)

**Mesh**는 RedGPU의 3D 공간에서 시각적으로 표현되는 가장 기본적인 객체 단위입니다. 뼈대에 해당하는 **지오메트리(Geometry)**와 피부에 해당하는 **머티리얼(Material)**이 결합되어 하나의 완성된 객체를 형성합니다.

## 1. 메시의 구성 요소

메시는 독립적으로 존재할 수 없으며, 반드시 다음 두 요소가 결합되어야 합니다.

- **Geometry** (지오메트리): 점, 선, 면으로 이루어진 물체의 물리적인 **형태**입니다.
- **Material** (머티리얼): 색상, 질감, 반사광 등 물체의 **표면** 속성을 결정합니다.

<ClientOnly>
  <MermaidResponsive :definition="meshGraph" />
</ClientOnly>

## 2. 형태 정의: 지오메트리 (Geometry)

RedGPU는 별도의 외부 모델 파일 없이 즉시 사용할 수 있는 다양한 **RedGPU.Primitive**들을 제공합니다.

| 종류 | 설명 |
| :--- | :--- |
| **Box** | 직육면체 상자 형태 |
| **Sphere** | 매끄러운 구체 형태 |
| **Plane** / **Ground** | 2D 평면 또는 격자 지면 형태 |
| **Cylinder** / **Circle** | 원기둥 또는 원형 평면 형태 |
| **Torus** / **TorusKnot** | 고리 또는 꼬인 매듭 형태 |

## 3. 표면 정의: 머티리얼 (Material)

**ColorMaterial**은 메시의 색상과 투명도를 결정하는 가장 기본적인 재질입니다.

```javascript
// 빨간색 불투명 재질 생성
const redMat = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');

// 파란색 반투명 재질 생성 (alpha: 0.5)
const blueAlphaMat = new RedGPU.Material.ColorMaterial(redGPUContext, '#0000ff');
blueAlphaMat.alpha = 0.5; 
```

## 4. 메시 제어 (Transformation)

생성된 **Mesh** 객체는 3D 공간 안에서 자유롭게 변형할 수 있는 속성을 가집니다.

- **Position** (`x`, `y`, `z`): 공간 상의 위치를 지정합니다.
- **Rotation** (`rotationX`, `rotationY`, `rotationZ`): 객체의 회전 값을 조절합니다.
- **Scale** (`scaleX`, `scaleY`, `scaleZ`): 객체의 크기를 배수로 조절합니다.

```javascript
const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

mesh.x = 10;           // X축 이동
mesh.rotationY = 45;   // Y축 회전
mesh.scaleX = 2;       // X축 2배 확대
```

## 5. 학습: 메시 생성 및 배치

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene(redGPUContext);
    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
    camera.z = -10;

    // 1. 메시 구성 요소 준비
    const geometry = new RedGPU.Primitive.Box(redGPUContext);
    const material = new RedGPU.Material.ColorMaterial(redGPUContext, '#00CC99');

    // 2. 메시 생성 및 Scene에 추가
    const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
    scene.addChild(mesh);

    // 3. 뷰 설정 및 렌더링
    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        mesh.rotationY += 1;
    });
});
```

## 라이브 데모 (Live Demo)

<ClientOnly>
<CodePen title="RedGPU Basics - Mesh Playground" slugHash="mesh-playground">
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
    const scene = new RedGPU.Display.Scene(redGPUContext);
    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
    camera.z = -15; camera.y = 8;
    camera.lookAt(0, 0, 0);

    // 1. Ground (White)
    const floor = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext, 50, 50),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#ffffff')
    );
    scene.addChild(floor);

    // 2. Torus (Yellow)
    const torus = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Torus(redGPUContext, 3, 0.5),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#ffcc00')
    );
    torus.y = 2;
    scene.addChild(torus);

    // 3. Box (Blue)
    const box = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#1890ff')
    );
    box.x = -6; box.y = 1;
    scene.addChild(box);

    // 4. TorusKnot (Red)
    const knot = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.TorusKnot(redGPUContext, 1.5, 0.4),
        new RedGPU.Material.ColorMaterial(redGPUContext, '#ff4d4f')
    );
    knot.x = 6; knot.y = 2.5;
    scene.addChild(knot);

    const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        torus.rotationX += 0.5;
        torus.rotationY += 1;
        box.rotationY += 1;
        knot.rotationY += 2;
    });
});
</pre>
</CodePen>
</ClientOnly>

## 핵심 요약

- **Mesh**는 **Geometry**와 **Material**이 결합된 3D 객체의 기본 단위입니다.
- 개체별로 **scale**, **rotation**, **position** 속성으로 3D 공간 상의 변형을 직접 제어합니다.
- **Scene**에 추가됨으로써 비로소 공간의 구성 요소로 확정되어 화면에 렌더링됩니다.

## 다음 학습 추천

메시들을 부모-자식 관계로 묶어 복잡한 구조를 만드는 방법을 알아봅니다.

- **[Scene Graph (Scene Graph)](./scene-graph.md)**