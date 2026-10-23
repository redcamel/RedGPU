---
title: Shadow System
order: 3
---

<script setup>
const shadowGraph = `
    Light["Light (광원: DirectionalLight)"] -->|빛 방사| Caster["Caster (그림자 생성 물체: castShadow = true)"]
    Caster -->|그림자 투사| Receiver["Receiver (그림자 받는 물체: receiveShadow = true)"]

    %% 회색조 스타일 적용
    style Light fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Caster fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Receiver fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
`
</script>

# 그림자 시스템

RedGPU는 최대 4단계 **캐스케이드 그림자 맵**(CSM), 카메라 이동 시 그림자 경계 떨림을 방지하는 **서브픽셀 텍셀 스내핑**(Texel Snapping), 그리고 **16-Tap Vogel Spiral
PCSS** 소프트 그림자 파이프라인을 제공합니다.

<ClientOnly>
  <MermaidResponsive :definition="shadowGraph" />
</ClientOnly>

---

## 1. 그림자 생성의 3요소 및 객체 설정

그림자 렌더링을 위해서는 광원, 캐스터 (`castShadow`), 리시버 (`receiveShadow`) 세 가지가 함께 설정되어야 합니다.

1. **광원**: `DirectionalLight` 가 그림자 생성을 지원합니다.
2. **캐스터**(Caster): 그림자를 드리우는 객체 (`mesh.castShadow = true`)
3. **리시버**(Receiver): 그림자가 맺히는 표면 객체 (`mesh.receiveShadow = true`)

```javascript
box.castShadow = true;     // 그림자 생성 (Caster)
floor.receiveShadow = true; // 그림자 수신 (Receiver)
```

> [!WARNING]
> 그림자 깊이 패스는 추가 드로우콜을 발생시키므로, 시각적으로 중요한 객체와 바닥/지형에만 선별적으로 활성화하는 것이 성능에 유리합니다.

---

## 2. 그림자 품질 제어

`scene.shadowManager.directionalShadowManager` 를 통해 CSM 분할 및 PCSS 소프트 그림자 품질을 전역 제어합니다.

| 속성명                       | 기본값    | 설명                                                                            |
|:-----------------------------|:----------|:--------------------------------------------------------------------------------|
| **`shadowDepthTextureSize`** | `2048`    | 각 캐스케이드 그림자 맵의 해상도 (`256 ~ 8192`)                                 |
| **`cascadeCount`**           | `4`       | CSM 캐스케이드 분할 단계 수 (`1 ~ 4`)                                           |
| **`maxShadowDistance`**      | `200`     | 그림자가 렌더링되는 카메라로부터의 최대 월드 거리                               |
| **`targetNearTexelSize`**    | `0.02`    | 첫 번째 근거리 캐스케이드(Cascade 0)가 유지할 목표 월드 텍셀 크기               |
| **`pcssLightSize`**          | `1.0`     | PCSS 소프트 그림자의 가상 광원 크기 (값이 클수록 반그림자 경계가 부드럽게 퍼짐) |
| **`strength`**               | `0.9`     | 그림자 불투명도 강도 (`0.0 ~ 1.0`)                                              |
| **`bias`**                   | `0.00015` | 표면 자기 그림자 오류(Shadow Acne) 방지용 깊이 바이어스                         |

```javascript
const dirShadowManager = scene.shadowManager.directionalShadowManager;
dirShadowManager.shadowDepthTextureSize = 2048;
dirShadowManager.cascadeCount = 4;
dirShadowManager.maxShadowDistance = 200;
dirShadowManager.pcssLightSize = 1.0;
dirShadowManager.strength = 0.9;
```

---

## 3. 그림자 구성 예제

`DirectionalLight` 아래에서 회전하는 상자 (`castShadow = true`)의 그림자를 바닥 (`receiveShadow = true`)에 투사하는 예제입니다.

```javascript
// 1. 광원 등록
const light = new RedGPU.Light.DirectionalLight();
light.x = -3;
light.y = 5;
light.z = 3;
scene.lightManager.addDirectionalLight(light);

// 2. 바닥 생성 (그림자 수신)
const floor = new RedGPU.Display.Mesh(
    redGPUContext,
    new RedGPU.Primitive.Ground(redGPUContext, 30, 30),
    new RedGPU.Material.PhongMaterial(redGPUContext, '#555555')
);
floor.receiveShadow = true;
scene.addChild(floor);

// 3. 상자 생성 (그림자 생성)
const box = new RedGPU.Display.Mesh(
    redGPUContext,
    new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2),
    new RedGPU.Material.PhongMaterial(redGPUContext, '#ffcc00')
);
box.y = 3;
box.castShadow = true;
scene.addChild(box);
```

### 라이브 데모

<ClientOnly>
<CodePen title="RedGPU Basics - Shadow" slugHash="shadow-basic">
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
    
    const light = new RedGPU.Light.DirectionalLight();
    light.x = -3; light.y = 5; light.z = 3;
    scene.lightManager.addDirectionalLight(light);
    scene.lightManager.ambientLight = new RedGPU.Light.AmbientLight('#ffffff', 50);

    // Floor (Receiver)
    const floor = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext, 30, 30),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#555555')
    );
    floor.receiveShadow = true;
    scene.addChild(floor);

    // Box (Caster)
    const box = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext, 2, 2, 2),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#ffcc00')
    );
    box.y = 3;
    box.castShadow = true;
    scene.addChild(box);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        box.rotationY += 1;
        box.rotationZ += 1;
    });
});
</pre>
</CodePen>
</ClientOnly>

---

## 관련 예제

- [방향광 그림자 (Directional Shadow)](/RedGPU/examples/3d/shadow/directionalShadow/)
- [glTF 모델 그림자](/RedGPU/examples/3d/shadow/gltfDirectionalShadow/)

---

## 다음 단계

- **[PBR Material](./pbr-material.md)** : 금속성·거칠기 기반 물리 기반 렌더링 (PBR) 재질 설정 방법
