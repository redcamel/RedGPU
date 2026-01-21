---
title: 메시
order: 1
---

<script setup>
const meshGraph = `
    Geometry["지오메트리 (형태)"] -->|구성| Mesh["메시 (객체)"]
    Material["머티리얼 (표면)"] -->|구성| Mesh
`
</script>

# Mesh

**Mesh** 는 RedGPU의 3D 공간에서 시각적으로 표현되는 가장 기본적인 객체 단위입니다. 뼈대에 해당하는 **Geometry** 와 피부에 해당하는 **Material** 이 결합되어 하나의 완성된 객체를 형성합니다.

## 1. 메시의 구성 요소

**Mesh** 는 독립적으로 존재할 수 없으며, 반드시 다음 두 요소가 결합되어야 합니다.

- **Geometry** (지오메트리): 점, 선, 면으로 이루어진 물체의 물리적인 **형태** 입니다.
- **Material** (머티리얼): 색상, 질감, 반사광 등 물체의 **표면** 속성을 결정합니다.

<ClientOnly>
  <MermaidResponsive :definition="meshGraph" />
</ClientOnly>

## 2. 지오메트리와 프리미티브 (Geometry & Primitive)

**지오메트리**(Geometry) 는 3D 공간 상의 수많은 점(**Vertex**) 데이터들의 집합입니다. 

RedGPU는 외부 모델 파일을 불러오기 전, **공간 구성이나 시각화 테스트** 를 빠르게 수행할 수 있도록 **프리미티브**(Primitive) 라는 기본 도형들을 제공합니다. 이를 사용하면 복잡한 데이터 계산 없이 즉시 3D 구조를 설계할 수 있습니다.

| 종류 | 설명 |
| :--- | :--- |
| **Box** | 육면체 상자 형태 |
| **Sphere** | 매끄러운 구체 형태 |
| **Plane** / **Ground** | 2D 평면 또는 격자 지면 형태 |
| **Cylinder** / **Circle** | 원기둥 또는 원형 평면 형태 |
| **Torus** / **TorusKnot** | 고리 또는 꼬인 매듭 형태 |

## 3. 표면 정의: 머티리얼 (Material)

**Material** 은 물체의 표면이 어떻게 보일지를 결정하는 속성입니다. 단순한 색상뿐만 아니라 텍스처, 반사율, 투명도 등을 정의할 수 있습니다.

| 종류 | 특징 | 주요 용도 |
| :--- | :--- | :--- |
| **ColorMaterial** | 단색 및 투명도만 출력 (조명 무시) | 빠른 시각화, 프로토타이핑, 디버깅 |
| **BitmapMaterial** | 이미지(**Texture**)를 물체 표면에 출력 | 배경, 단순 이미지 객체, 2D 스프라이트 |
| **PhongMaterial** | 빛과 그림자, 하이라이트 표현 | 사실적인 3D 물체, 입체감 강조 |
| **PBRMaterial** | 물리 기반 렌더링(**PBR**) 지원 | 고품질 실사 렌더링, 금속/거칠기 표현 |

가장 기본적인 **ColorMaterial** 은 조명 연산 없이 색상 값(RGB)과 투명도(Alpha)만을 빠르게 렌더링합니다.

```javascript
// 1. 불투명 빨간색 재질
const redMat = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');

// 2. 반투명 파란색 재질 (alpha: 0.0 ~ 1.0)
const blueAlphaMat = new RedGPU.Material.ColorMaterial(redGPUContext, '#0000ff');
blueAlphaMat.alpha = 0.5; 
```

::: info [다양한 재질]
이미지를 입히려면 **BitmapMaterial**, 빛과 그림자를 표현하려면 **PhongMaterial** 등을 사용합니다. 이들은 이어지는 챕터에서 상세히 다룹니다.
:::

## 4. 메시 제어 (Transformation)

생성된 **Mesh** 객체는 3D 공간 안에서 자유롭게 변형할 수 있는 속성을 가집니다.

- **Position** (`x`, `y`, `z`): 공간 상의 위치를 지정합니다.
- **Rotation** (`rotationX`, `rotationY`, `rotationZ`): 객체의 회전값을 조절합니다. (단위: Degree)
- **Scale** (`scaleX`, `scaleY`, `scaleZ`): 객체의 크기를 배수로 조절합니다.

::: tip [중심점(Pivot) 안내]
모든 위치 이동, 회전, 크기 조절은 객체의 **중심점**(Pivot) 을 기준으로 동작합니다. 프리미티브의 경우 각 도형의 기하학적 중심이 기준점이 됩니다.
:::

```javascript
const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);

mesh.x = 10;           // X축 이동
mesh.rotationY = 45;   // Y축 45도 회전
mesh.scaleX = 2;       // X축 방향으로 2배 확대
```

## 5. 실습: 메시 생성 및 배치

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    const camera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
    camera.z = -15; 
    camera.y = 5;
    camera.lookAt(0, 0, 0);

    // 1. 테스트용 박스 형태와 기본 재질 준비
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
        mesh.rotationY += 1; // 매 프레임 Y축 회전
    });
});
```

### 라이브 데모

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
    const scene = new RedGPU.Display.Scene();
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

- **Mesh** 는 **Geometry** 와 **Material** 이 결합된 3D 객체의 기본 단위입니다.
- **Primitive** 는 시각화 테스트 및 구조 설계를 위한 표준 도형 데이터입니다.
- **ColorMaterial** 은 성능이 가볍고 조명 없이 색상을 확인하기에 적합합니다.
- 모든 변형(Transform)은 객체의 **중심점**(Pivot) 을 기준으로 이루어집니다.

## 다음 학습 추천

단순한 색상을 넘어 실제 이미지를 물체 표면에 입히는 방법을 알아봅니다.

- **[텍스처 (Texture)](./texture.md)**