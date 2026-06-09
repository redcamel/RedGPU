---
title: Light
order: 1
---
<script setup>
const lightGraph = `
    graph TD
        Scene["Scene (Stage)"]
        LightMgr["LightManager (Director)"]
        Ambient["AmbientLight (All Directions)"]
        DirLight["DirectionalLight (Sun)"]
        PointLight["PointLight (Bulb)"]
        SpotLight["SpotLight (Flashlight)"]

        Scene -->|Has| LightMgr
        LightMgr -->|Manages| Ambient
        LightMgr -->|Manages| DirLight
        LightMgr -->|Manages| PointLight
        LightMgr -->|Manages| SpotLight
        
        %% 회색조 스타일 적용
        style Scene fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style LightMgr fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Ambient fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style DirLight fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style PointLight fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style SpotLight fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`
</script>

# Light

**Texture** 가 물체의 표면에 그림을 입히는 것이라면, **Light** 는 그 물체에 입체감과 깊이를 부여하는 '생명력'입니다.
RedGPU의 모든 조명은 **LightManager** 를 통해 통합 관리되며, 다양한 광원을 조합하여 극적인 연출을 할 수 있습니다.

## 1. 빛의 물리적 단위 (Light Units)

RedGPU는 물리 기반 렌더링(PBR)을 지원하기 때문에, 조명 시스템에서 실제 현실 세계의 빛 단위를 사용하여 광원의 세기를 조절합니다.

| 단위                 | 물리적 의미                  | RedGPU에서의 역할                                                                       | 설명                                                                                       |
|:-------------------|:------------------------|:-----------------------------------------------------------------------------------|:-----------------------------------------------------------------------------------------|
| **Lux (룩스, lx)**   | **조도 (Illuminance)**    | `DirectionalLight` (기본값 `100,000`), <br/>`AmbientLight` (기본값 `50`) 의 세기 (`lux` 속성) | 특정 면적에 도달하는 빛의 밝기입니다. 1 Lux는 $1\text{ lm/m}^2$ 와 같으며, 맑은 날 한낮의 태양광은 약 100,000 Lux 수준입니다. |
| **Lumen (루멘, lm)** | **광선속 (Luminous Flux)** | `PointLight` (기본값 `1,000`), <br/>`SpotLight` (기본값 `1,000`) 의 세기 (`lumen` 속성)       | 광원으로부터 사방으로 방출되는 전체 빛의 물리적 총량입니다. 전구의 밝기를 비교할 때 주로 사용됩니다.                                |

::: tip [실제 사용 팁]
RedGPU에서 가장 자주 사용되는 **DirectionalLight**는 전역을 고르게 비추는 평행광선(태양광)이기 때문에, 면적당 밝기를 의미하는 **Lux(룩스)** 단위를 사용하여 강도를 제어합니다 (
`lux` 속성의 기본값은 태양광 수준인 `100,000`입니다).
:::

---

## 2. LightManager

조명은 생성하는 것만으로는 화면에 영향을 주지 않습니다. 반드시 **Scene** 의 `lightManager` 에 등록해야 엔진이 이를 계산에 포함합니다.

<ClientOnly>
  <MermaidResponsive :definition="lightGraph" />
</ClientOnly>

::: tip [기본 조명 상태]
광원을 사용해야 하는 재질(PhongMaterial, PBRMaterial 등)의 경우, 조명을 설정하지 않으면 화면에 아무것도 보이지 않습니다.
:::

::: info [광원 등록 한계치]
RedGPU 셰이더 및 버퍼 연산 최적화를 위해 각 광원 종류별로 등록할 수 있는 최대 개수가 제한되어 있습니다. 한계치를 초과하여 등록하려고 시도하면 에러가 발생합니다.

- **DirectionalLight (방향광)**: 최대 **3개**
- **PointLight + SpotLight (클러스터 조명)**: 합산 최대 **1,024개**
- **AmbientLight (환경광)**: 씬(Scene)당 최대 **1개** (속성으로 직접 할당)
  :::

```javascript
// 방향광 추가 (여러 개 가능)
scene.lightManager.addDirectionalLight(directionalLight);

// 점광원 추가 (여러 개 가능)
scene.lightManager.addPointLight(pointLight);
```

## 3. 주요 조명의 종류

RedGPU는 물리적 특성이 다른 네 가지 광원을 제공합니다. 각 조명의 특성을 이해하고 상황에 맞게 조합하는 것이 중요합니다.

| 종류                   | 특징              | 주요 용도               | 사용 단위 (속성)                     | 비유               |
|:---------------------|:----------------|:--------------------|:-------------------------------|:-----------------|
| **DirectionalLight** | 평행한 빛 (태양광)     | 전역적인 조명, 그림자 생성     | **Lux** (`lux`, 기본값 100,000)   | 태양 (Sun)         |
| **PointLight**       | 한 지점에서 퍼져나감     | 특정 영역 강조, 거리별 감쇠 발생 | **Lumen** (`lumen`, 기본값 1,000) | 전구 (Bulb)        |
| **SpotLight**        | 원뿔 모양의 집중된 빛    | 강조 조명, 연극 무대 효과     | **Lumen** (`lumen`, 기본값 1,000) | 손전등 (Flashlight) |
| **AmbientLight**     | 모든 방향에서 균일하게 비춤 | 그림자 완화, 전체적인 밝기 보정  | **Lux** (`lux`, 기본값 50)        | 채우는 빛 (Fill)     |

### 3.1 DirectionalLight (방향광)
태양처럼 무한히 먼 곳에서 특정 방향으로 평행하게 쏘는 빛입니다.
- **특징**: 위치(Position)에 상관없이 방향(Direction)이 일정하며, 그림자를 생성할 수 있는 가장 대표적인 광원입니다.

### 3.2 PointLight (점광원)
공간의 한 지점에서 모든 방향으로 퍼져나가는 빛입니다.
- **특징**: 거리의 제곱에 비례하여 밝기가 줄어드는 **감쇠**(Attenuation) 현상이 발생합니다. `radius` 속성으로 빛이 도달하는 범위를 결정합니다.

### 3.3 SpotLight (스포트라이트)
특정 지점에서 특정 방향으로 원뿔 모양의 빛을 쏘는 광원입니다.
- **특징**: 빛의 각도(`angle`)와 외곽의 부드러움(`exponent`)을 조절하여 집중된 조명 효과를 연출합니다.

### 3.4 AmbientLight (환경광)

모든 방향에서 물체를 균일하게 비추는 빛입니다.

- **특징**: 위치나 방향이 없으며 그림자가 생성되지 않습니다. 조명이 닿지 않는 어두운 부분을 살짝 밝히는 보정 용도로 사용합니다.

::: warning [재질 주의]
**ColorMaterial** 은 조명의 영향을 받지 않고 단색으로만 출력됩니다. 조명 효과를 확인하려면 반드시 **PhongMaterial** 이나 **PBRMaterial** 과 같은 광택/질감이 있는 재질을 사용해야 합니다.
:::

## 4. 실습: 다채로운 조명 구성

바닥과 여러 개의 구체를 배치하고, 서로 다른 색상의 **PointLight** 두 개를 움직여 빛이 공간에 퍼지는 효과를 구현해 봅니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // 1. 파란색 점광원
    const blueLight = new RedGPU.Light.PointLight('#0000ff', 2.0);
    blueLight.radius = 15;
    scene.lightManager.addPointLight(blueLight);

    // 2. 빨간색 점광원
    const redLight = new RedGPU.Light.PointLight('#ff0000', 2.0);
    redLight.radius = 15;
    scene.lightManager.addPointLight(redLight);

    // 3. 바닥 및 물체 생성 (PhongMaterial 사용)
    const material = new RedGPU.Material.PhongMaterial(redGPUContext);
    
    // 바닥
    const floor = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext, 30, 30),
        material
    );
    scene.addChild(floor);

    // 구체 25개 배치
    const sphereGeometry = new RedGPU.Primitive.Sphere(redGPUContext, 1, 32, 32);
    for (let i = 0; i < 25; i++) {
        const mesh = new RedGPU.Display.Mesh(redGPUContext, sphereGeometry, material);
        mesh.x = (i % 5 - 2) * 4;
        mesh.z = (Math.floor(i / 5) - 2) * 4;
        scene.addChild(mesh);
    }

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 25;

    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    
    // 4. 조명 애니메이션
    renderer.start(redGPUContext, (time) => {
        const t = time / 1000;
        blueLight.x = Math.sin(t) * 10;
        blueLight.z = Math.cos(t) * 10;
        blueLight.y = Math.sin(t * 0.5) * 5 + 5;

        redLight.x = Math.sin(t + 3.14) * 10;
        redLight.z = Math.cos(t + 3.14) * 10;
        redLight.y = Math.cos(t * 0.5) * 5 + 5;
    });
});
```

### 라이브 데모

광원의 위치가 이동함에 따라 물체의 표면에 맺히는 빛의 변화를 확인해 보세요.

<ClientOnly>
<CodePen title="RedGPU Basics - Multi Lights" slugHash="multi-lights-demo">
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
    
    const blueLight = new RedGPU.Light.PointLight('#0000ff', 2.0);
    blueLight.radius = 15;
    scene.lightManager.addPointLight(blueLight);

    const redLight = new RedGPU.Light.PointLight('#ff0000', 2.0);
    redLight.radius = 15;
    scene.lightManager.addPointLight(redLight);

    const material = new RedGPU.Material.PhongMaterial(redGPUContext);
    
    const floor = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext, 30, 30),
        material
    );
    scene.addChild(floor);

    const sphereGeometry = new RedGPU.Primitive.Sphere(redGPUContext, 1, 32, 32);
    for (let i = 0; i < 25; i++) {
        const mesh = new RedGPU.Display.Mesh(redGPUContext, sphereGeometry, material);
        mesh.x = (i % 5 - 2) * 4;
        mesh.z = (Math.floor(i / 5) - 2) * 4;
        scene.addChild(mesh);
    }

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 25;

    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, (time) => {
        const t = time / 1000;
        blueLight.x = Math.sin(t) * 10;
        blueLight.z = Math.cos(t) * 10;
        blueLight.y = Math.sin(t * 0.5) * 5 + 5;

        redLight.x = Math.sin(t + 3.14) * 10;
        redLight.z = Math.cos(t + 3.14) * 10;
        redLight.y = Math.cos(t * 0.5) * 5 + 5;
    });
});
</pre>
</CodePen>
</ClientOnly>

## 핵심 요약

- **LightManager** 를 통해 모든 광원을 등록하고 제어합니다.
- 조명 효과를 보려면 **PhongMaterial** 이나 **PBRMaterial** 등 광택 재질을 사용해야 합니다.
- **DirectionalLight** 는 전역적인 조명에, **PointLight** / **SpotLight** 는 강조 조명에 적합합니다.

## 다음 학습 추천

조명의 빛을 받아 정교한 표면 질감과 입체감을 표현하는 Phong Material에 대해 알아봅니다.

- **[Phong Material](./phong-material.md)**