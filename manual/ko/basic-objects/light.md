---
title: Light (조명)
order: 5
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
        
        %% 커스텀 클래스 적용
        class Scene mermaid-main;
        class LightMgr mermaid-system;
`
</script>

# Light

3D 공간에서 빛은 사물의 형태를 드러내고 공간의 깊이감을 만드는 핵심 요소입니다. RedGPU의 모든 조명은 **Scene**의 **LightManager**를 통해 통합 관리되며, 다양한 광원을 조합하여 극적인 연출을 할 수 있습니다.

## 1. LightManager

조명은 생성하는 것만으로는 화면에 영향을 주지 않습니다. 반드시 씬의 `lightManager`에 등록해야 엔진이 이를 계산에 포함합니다.

<ClientOnly>
  <MermaidResponsive :definition="lightGraph" />
</ClientOnly>

```javascript
// 환경광 설정 (단 하나만 존재)
scene.lightManager.ambientLight = new RedGPU.Light.AmbientLight('#ffffff', 0.2);

// 방향광 추가 (여러 개 가능)
scene.lightManager.addDirectionalLight(directionalLight);

// 점광원 추가 (여러 개 가능)
scene.lightManager.addPointLight(pointLight);
```

## 2. 주요 조명의 종류

RedGPU는 물리적 특성이 다른 네 가지 광원을 제공합니다. 각 조명의 특성을 이해하고 상황에 맞게 조합하는 것이 중요합니다.

| 종류 | 특징 | 주요 용도 | 비유 |
| :--- | :--- | :--- | :--- |
| **AmbientLight** | 모든 방향에서 균일하게 비춤 | 그림자 완화, 전체적인 밝기 보정 | 채우는 빛 (Fill) |
| **DirectionalLight** | 평행한 빛 (태양광) | 전역적인 조명, 그림자 생성 | 태양 (Sun) |
| **PointLight** | 한 지점에서 퍼져나감 | 특정 영역 강조, 거리별 감쇠 발생 | 전구 (Bulb) |
| **SpotLight** | 원뿔 모양의 집중된 빛 | 강조 조명, 연극 무대 효과 | 손전등 (Flashlight) |

### 2.1 AmbientLight (환경광)
모든 방향에서 물체를 균일하게 비추는 빛입니다.
- **특징**: 위치나 방향이 없으며 그림자가 생성되지 않습니다. 조명이 닿지 않는 어두운 부분을 살짝 밝히는 보정 용도로 사용합니다.

### 2.2 DirectionalLight (방향광)
태양처럼 무한히 먼 곳에서 특정 방향으로 평행하게 쏘는 빛입니다.
- **특징**: 위치(Position)에 상관없이 방향(Direction)이 일정하며, 그림자를 생성할 수 있는 가장 대표적인 광원입니다.

### 2.3 PointLight (점광원)
공간의 한 지점에서 모든 방향으로 퍼져나가는 빛입니다.
- **특징**: 거리의 제곱에 비례하여 밝기가 줄어드는 **감쇠(Attenuation)** 현상이 발생합니다. `radius` 속성으로 빛이 도달하는 범위를 결정합니다.

### 2.4 SpotLight (스포트라이트)
특정 지점에서 특정 방향으로 원뿔 모양의 빛을 쏘는 광원입니다.
- **특징**: 빛의 각도(`angle`)와 외곽의 부드러움(`exponent`)을 조절하여 집중된 조명 효과를 연출합니다.

::: warning [재질 주의]
`ColorMaterial`은 조명의 영향을 받지 않고 단색으로만 출력됩니다. 조명 효과를 확인하려면 반드시 **`PhongMaterial`**이나 **`StandardMaterial`**과 같은 광택/질감이 있는 재질을 사용해야 합니다.
:::

## 3. 학습: 여러 조명이 섞인 씬 구성

서로 다른 색상의 PointLight를 배치하여 화려한 조명 효과를 만들어 보겠습니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

RedGPU.init(document.getElementById('redgpu-canvas'), (redGPUContext) => {
    const scene = new RedGPU.Display.Scene(redGPUContext);
    
    // 1. 기본 환경광 (낮은 강도)
    scene.lightManager.ambientLight = new RedGPU.Light.AmbientLight('#ffffff', 0.1);

    // 2. 파란색 점광원
    const blueLight = new RedGPU.Light.PointLight('#0000ff', 2.0);
    blueLight.setPosition(-5, 3, 0);
    blueLight.radius = 15;
    scene.lightManager.addPointLight(blueLight);

    // 3. 빨간색 점광원
    const redLight = new RedGPU.Light.PointLight('#ff0000', 2.0);
    redLight.setPosition(5, 3, 0);
    redLight.radius = 15;
    scene.lightManager.addPointLight(redLight);

    // 4. 조명에 반응하는 PhongMaterial 적용
    const mesh = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.TorusKnot(redGPUContext),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#ffffff')
    );
    scene.addChild(mesh);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
});
```

## 라이브 데모 (Live Demo)

광원의 위치를 이동시키며 물체의 표면에 맺히는 빛의 변화를 확인해 보세요.

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
    const scene = new RedGPU.Display.Scene(redGPUContext);
    
    scene.lightManager.ambientLight = new RedGPU.Light.AmbientLight('#ffffff', 0.1);
    
    const p1 = new RedGPU.Light.PointLight('#ffcc00', 3.0);
    p1.radius = 15;
    scene.lightManager.addPointLight(p1);

    const mesh = new RedGPU.Display.Mesh(
        redGPUContext, 
        new RedGPU.Primitive.Sphere(redGPUContext, 3, 64, 64), 
        new RedGPU.Material.PhongMaterial(redGPUContext)
    );
    scene.addChild(mesh);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    let time = 0;
    renderer.start(redGPUContext, () => {
        time += 0.02;
        p1.x = Math.sin(time) * 10;
        p1.z = Math.cos(time) * 10;
    });
});
</pre>
</CodePen>
</ClientOnly>

## 핵심 요약

- **LightManager**를 통해 모든 광원을 등록하고 제어합니다.
- 조명 효과를 보려면 **PhongMaterial** 등 광택 재질을 사용해야 합니다.
- **DirectionalLight**는 전역적인 조명에, **PointLight/SpotLight**는 강조 조명에 적합합니다.

## 다음 학습 추천

조명에 의해 만들어지는 입체감의 완성, 그림자 시스템에 대해 알아봅니다.

- **[그림자 (Shadow)](./shadow.md)**