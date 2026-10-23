---
title: Mesh
order: 1
---

<script setup>
const meshGraph = `
    Geometry["지오메트리 (형태)"] -->|구성| Mesh["메시 (객체)"]
    Material["머티리얼 (표면)"] -->|구성| Mesh

    %% 회색조 스타일 적용
    style Geometry fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Material fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Mesh fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
`
</script>

# Mesh

`Mesh` 는 정점 형태 데이터인 **지오메트리**(`Geometry`)와 표면 속성인 **머티리얼**(`Material`)을 결합하여 3D 공간에 렌더링되는 기본 디스플레이 객체입니다.

<ClientOnly>
  <MermaidResponsive :definition="meshGraph" />
</ClientOnly>

---

## 1. 지오메트리와 프리미티브

**지오메트리**(Geometry)는 3D 공간의 정점 (Vertex), 법선 (Normal), UV 좌표 데이터 집합입니다. RedGPU는 별도의 외부 모델 파일 없이 즉시 생성할 수 있는 절차적 기본 도형인
**프리미티브**(`RedGPU.Primitive.*`)를 제공합니다.

| 클래스                    | 설명                                      |
|:--------------------------|:------------------------------------------|
| **`Box` / `RoundedBox`**  | 육면체 상자 또는 모서리가 둥근 상자 형태  |
| **`Sphere` / `Capsule`**  | 구체 또는 캡슐 알약 형태                  |
| **`Cone` / `Cylinder`**   | 원뿔 또는 원기둥 형태                     |
| **`Plane` / `Ground`**    | 2D 사각형 평면 또는 격자 지면 형태        |
| **`Circle` / `Ring`**     | 원형 평면 또는 가운데가 뚫린 링 평면 형태 |
| **`Torus` / `TorusKnot`** | 도넛 모양의 고리 또는 꼬인 매듭 형태      |

---

## 2. 머티리얼 종류

**머티리얼**(Material)은 물체 표면의 색상, 텍스처, 조명 반사율 및 투명도를 결정합니다.

| 클래스               | 특징                                                | 주요 용도                         |
|:---------------------|:----------------------------------------------------|:----------------------------------|
| **`ColorMaterial`**  | 조명 연산 없이 단색(RGB) 및 투명도만 출력           | 빠른 시각화, 프로토타이핑, 디버깅 |
| **`BitmapMaterial`** | 단일 텍스처(`BitmapTexture`)를 표면에 매핑          | 배경, 비조명 이미지 객체          |
| **`PhongMaterial`**  | 난반사(Diffuse) 및 정반사(Specular) 하이라이트 연산 | 표준 라이팅 기반 3D 객체          |
| **`PBRMaterial`**    | 금속성(Metallic)·거칠기(Roughness) 및 KHR 확장 지원 | 고품질 물리 기반 실사 렌더링      |

```javascript
// 1. 불투명 빨간색 재질
const redMat = new RedGPU.Material.ColorMaterial(redGPUContext, '#ff0000');

// 2. 반투명 파란색 재질 (alpha: 0.0 ~ 1.0)
const blueAlphaMat = new RedGPU.Material.ColorMaterial(redGPUContext, '#0000ff');
blueAlphaMat.alpha = 0.5;
```

---

## 3. 공간 변환 및 주요 속성

`Mesh` 의 위치, 회전, 스케일 변환은 객체의 **중심점**(Pivot)을 기준으로 동작합니다.

| 구분         | 속성명                                    | 타입 / 기본값           | 설명                                                                                |
|:-------------|:------------------------------------------|:------------------------|:------------------------------------------------------------------------------------|
| **트랜스폼** | **`x`, `y`, `z`**                         | `number` (`0`)          | 3D 공간상의 로컬 좌표 (`setPosition(x, y, z)` 지원)                                 |
| **트랜스폼** | **`rotationX`, `rotationY`, `rotationZ`** | `number` (`0`)          | 각 축 기준 회전 각도 (단위: Degree, `setRotation(x, y, z)` 지원)                    |
| **트랜스폼** | **`scaleX`, `scaleY`, `scaleZ`**          | `number` (`1`)          | 각 축 기준 크기 배율 (`setScale(x, y, z)` 지원)                                     |
| **트랜스폼** | **`pivotX`, `pivotY`, `pivotZ`**          | `number` (`0`)          | 이동·회전·스케일 변환의 기준점 오프셋 좌표                                          |
| **외형**     | **`geometry`**                            | `Geometry \| Primitive` | 메시에 바인딩된 지오메트리 인스턴스                                                 |
| **외형**     | **`material`**                            | `ABaseMaterial`         | 메시에 바인딩된 표면 머티리얼 인스턴스                                              |
| **외형**     | **`opacity`**                             | `number` (`1.0`)        | 메시 투명도 (`0.0 ~ 1.0`, 하위 자식 노드에 곱연산으로 전파)                         |
| **그림자**   | **`castShadow`**                          | `boolean` (`false`)     | 광원으로부터 다른 물체에 그림자를 투사(Cast)할지 여부                               |
| **그림자**   | **`receiveShadow`**                       | `boolean` (`true`)      | 다른 물체가 드리운 그림자를 표면에 수신(Receive)할지 여부                           |
| **컬링**     | **`ignoreFrustumCulling`**                | `boolean` (`false`)     | 카메라 절두체(Frustum) 컬링을 무시하고 항상 렌더링할지 여부                         |
| **컬링**     | **`useScreenSpaceSizeCulling`**           | `boolean` (`true`)      | 화면 투영 크기 비율이 임계값 미만일 때 드로우 콜을 생략하는 컬링 활성화 여부        |
| **컬링**     | **`minScreenSpaceSize`**                  | `number` (`0.006`)      | 투영 면적 컬링을 수행할 최소 화면 크기 비율 임계값                                  |
| **상호작용** | **`enableWaterInteraction`**              | `boolean` (`false`)     | 수체(`Lake`) 표면과 충돌·이동 시 실시간 2D 물결 파동 생성 여부 (자식까지 재귀 적용) |
| **상호작용** | **`waterWaveStrength`**                   | `number` (`1.0`)        | 수체(`Lake`)와 상호작용할 때 생성되는 물결 파동 강도 배율                           |
| **디버그**   | **`enableDebugger`**                      | `boolean` (`false`)     | 바운딩 볼륨(`OBB`/`AABB`) 및 법선 시각화 디버거(`DrawDebuggerMesh`) 표시 여부       |

```javascript
const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
mesh.setPosition(10, 0, 0);
mesh.rotationY = 45;
mesh.scaleX = 2;
```

---

## 4. 실습 예제: 메시 생성 및 배치

다양한 프리미티브 도형과 `ColorMaterial` 을 결합하여 씬에 배치하고 회전시키는 예제입니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    const camera = new RedGPU.Camera.PerspectiveCamera();
    camera.setPosition(0, 5, -15);
    camera.lookAt(0, 0, 0);

    // 1. 지오메트리와 기본 재질 준비
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
const camera = new RedGPU.Camera.PerspectiveCamera ();
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

---

## 관련 예제

- [기본 메시 (Basic Mesh)](/RedGPU/examples/3d/mesh/basicMesh/)
- [내장 프리미티브 모음](/RedGPU/examples/3d/primitive/primitives/)
- [피벗 설정 (Pivot)](/RedGPU/examples/3d/mesh/pivot/)
- [시선 고정 (LookAt)](/RedGPU/examples/3d/mesh/lookAt/)
- [바운딩 박스 표시 (BoundBox)](/RedGPU/examples/3d/mesh/boundBox/meshBoundBox/)

---

## 다음 단계

- **[Scene Graph](./scene-graph.md)** : 객체들을 부모-자식 관계로 묶어 복합 계층 구조와 연동 애니메이션을 구성하는 방법
