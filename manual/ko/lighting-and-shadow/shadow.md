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

3D 공간에서 그림자는 물체의 입체감과 공간 내 위치 관계를 결정짓는 핵심 요소입니다. RedGPU는 물리 기반의 그림자 시스템을 제공하며, 간단한 설정만으로 사실적인 그림자를 표현할 수 있습니다.

<ClientOnly>
  <MermaidResponsive :definition="shadowGraph" />
</ClientOnly>

## 1. 그림자 생성의 3요소

그림자가 화면에 나타나기 위해서는 다음 세 가지 요소가 유기적으로 설정되어야 합니다.

1.  **광원**(Light) : 그림자를 만들어낼 빛입니다. 현재 **DirectionalLight** 가 그림자 생성을 지원합니다.
2. **캐스터**(Caster) : 그림자를 **만드는** 물체입니다. (예: 캐릭터, 건물, 식생) -> `mesh.castShadow = true`
3. **리시버**(Receiver) : 그림자를 **받는** 물체입니다. (예: 바닥, 지형, 벽) -> `mesh.receiveShadow = true`

::: warning [성능 주의]
그림자 연산은 GPU 자원을 많이 소모합니다. 따라서 모든 물체에 적용하기보다, 시각적으로 중요한 물체와 바닥 등에 선별적으로 적용하는 것이 성능 최적화에 유리합니다.
:::

## 2. 객체 설정

RedGPU의 **Mesh**, **InstancingMesh** 및 오픈월드 **Landscape**(지형·식생·잔디) 객체는 그림자 생성 및 수신 여부를 결정하는 속성을 가집니다.

```javascript
// 1. 그림자를 생성할 물체 (Caster)
const box = new RedGPU.Display.Mesh(redGPUContext, boxGeometry, boxMaterial);
box.castShadow = true;

// 2. 그림자를 받을 물체 (Receiver)
const floor = new RedGPU.Display.Mesh(redGPUContext, floorGeometry, floorMaterial);
floor.receiveShadow = true;
```

## 3. 그림자 품질 관리

**Scene** 은 내부적으로 **ShadowManager** 와 **DirectionalShadowManager** 를 소유하고 있어, 최대 4단계 **캐스케이드 그림자 맵**(Cascaded Shadow
Maps, CSM) 및 **PCSS**(Percentage-Closer Soft Shadows) 품질을 전역적으로 제어할 수 있습니다.

특히 RedGPU의 CSM 파이프라인은 카메라 이동 시 발생하는 그림자 경계의 일렁임 (Shadow Shimmering)을 원천 차단하기 위해 **서브픽셀 텍셀 스내핑**(Texel Snapping)을 수행하며,
**16-Tap Vogel Spiral** 회전 샘플링을 결합하여 부드러운 반그림자 (Penumbra)를 렌더링합니다.

| 속성명                       | 기본값    | 설명                                                                           |
|:-----------------------------|:----------|:-------------------------------------------------------------------------------|
| **`shadowDepthTextureSize`** | `2048`    | 각 캐스케이드 그림자 맵의 해상도 (값이 클수록 선명하지만 GPU 메모리 소모 증가) |
| **`cascadeCount`**           | `4`       | CSM 캐스케이드 분할 단계 수 (`1 ~ 4`)                                          |
| **`maxShadowDistance`**      | `200`     | 그림자가 렌더링되는 카메라로부터의 최대 월드 거리                              |
| **`targetNearTexelSize`**    | `0.02`    | 첫 번째 근거리 캐스케이드(Cascade 0)가 유지할 목표 월드 텍셀 크기              |
| **`pcssLightSize`**          | `1.0`     | PCSS 소프트 그림자의 가상 광원 크기 (값이 클수록 경계가 넓게 퍼짐)             |
| **`strength`**               | `0.9`     | 그림자의 진하기(불투명도) 강도 (`0.0 ~ 1.0`)                                   |
| **`bias`**                   | `0.00015` | 표면 자기 그림자 오류(Shadow Acne)를 방지하기 위한 깊이 바이어스 오프셋        |

```javascript
const dirShadowManager = scene.shadowManager.directionalShadowManager;

// 1. 그림자 맵의 해상도 설정 (기본값: 2048)
dirShadowManager.shadowDepthTextureSize = 2048;

// 2. CSM 캐스케이드 분할 수 (1 ~ 4, 기본값: 4), 최대 그림자 거리 및 근거리 텍셀 밀도
dirShadowManager.cascadeCount = 4;
dirShadowManager.maxShadowDistance = 200;
dirShadowManager.targetNearTexelSize = 0.02;

// 3. PCSS 소프트 그림자 광원 크기, 진하기 및 바이어스 조절
dirShadowManager.pcssLightSize = 1.0;
dirShadowManager.strength = 0.9;
dirShadowManager.bias = 0.00015;
```

## 4. 실습 예제: 그림자가 있는 씬 구성

방향광(DirectionalLight)을 사용하여 회전하는 정육면체의 그림자를 바닥에 드리우는 예제입니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // 1. 조명 및 그림자 설정
    const light = new RedGPU.Light.DirectionalLight();
    light.x = -5; light.y = 10; light.z = 5;
    scene.lightManager.addDirectionalLight(light);

    // 2. 바닥 생성 (Receiver)
    const floor = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext, 20, 20),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#cccccc')
    );
    floor.receiveShadow = true; 
    scene.addChild(floor);

    // 3. 상자 생성 (Caster)
    const box = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0000')
    );
    box.y = 2;
    box.castShadow = true; 
    scene.addChild(box);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        box.rotationX += 1;
        box.rotationY += 1;
    });
});
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
    
    // Light
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

## 핵심 요약

-   **castShadow** : 물체가 그림자를 생성하도록 설정합니다.
-   **receiveShadow** : 물체 표면에 그림자가 드리우도록 설정합니다.
- **품질 제어**: `DirectionalShadowManager` 를 통해 CSM 캐스케이드, 텍셀 스내핑, PCSS 소프트 그림자 품질을 정밀하게 조절할 수 있습니다.

## 다음 단계

그림자까지 더해져 입체감이 살아난 공간에 무한한 배경과 실사 같은 환경광을 더하는 방법을 알아봅니다.

- **[환경 설정](../environment/index.md)**
