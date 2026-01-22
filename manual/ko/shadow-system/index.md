---
title: Shadow System
order: 1
---

# Shadow

3D 그래픽스에서 그림자는 물체의 입체감과 공간 내 위치 관계를 명확하게 보여주는 핵심 요소입니다. RedGPU는 물리 기반의 그림자 시스템을 제공하며, 간단한 설정만으로 사실적인 그림자를 표현할 수 있습니다.

## 1. 그림자 생성의 3요소

그림자가 화면에 나타나기 위해서는 다음 세 가지 요소가 모두 설정되어야 합니다.

1. **광원 (Light)**: 그림자를 만들어낼 빛 (DirectionalLight 등)
2. **캐스터 (Caster)**: 그림자를 **만드는** 물체 (예: 캐릭터, 건물) -> `castShadow = true`
3. **리시버 (Receiver)**: 그림자를 **받는** 물체 (예: 바닥, 벽) -> `receiveShadow = true`

::: warning 주의
그림자 연산은 GPU 성능을 많이 사용합니다. 불필요한 물체에는 그림자 설정을 끄는 것이 성능 최적화에 도움이 됩니다.
:::

## 2. 객체 설정 (Cast & Receive)

RedGPU의 모든 `Mesh` 객체는 그림자를 생성하거나 받을 수 있는 속성을 가지고 있습니다.

```javascript
// 1. 그림자를 생성할 물체 (Caster)
const box = new RedGPU.Display.Mesh(redGPUContext, boxGeometry, boxMaterial);
box.castShadow = true; // 이 물체는 그림자를 만듭니다.

// 2. 그림자를 받을 물체 (Receiver)
const floor = new RedGPU.Display.Mesh(redGPUContext, floorGeometry, floorMaterial);
floor.receiveShadow = true; // 이 물체 위에는 그림자가 생깁니다.
```

## 3. 그림자 품질 설정 (ShadowManager)

`Scene`은 내부적으로 `ShadowManager`를 가지고 있어, 그림자의 해상도나 품질을 전역적으로 관리할 수 있습니다.

```javascript
// 그림자 맵의 해상도 설정 (기본값: 1024)
// 값이 클수록 그림자가 선명해지지만 성능 비용이 증가합니다.
scene.shadowManager.directionalShadowManager.shadowDepthTextureSize = 2048;
```

## 4. 학습: 그림자가 있는 씬 만들기

방향광(DirectionalLight)을 사용하여 회전하는 큐브의 그림자를 바닥에 드리우는 예제입니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // 1. 조명 설정 (방향광)
    const light = new RedGPU.Light.DirectionalLight();
    light.x = -5;
    light.y = 10;
    light.z = 5;
    scene.lightManager.addDirectionalLight(light);

    // 2. 바닥 생성 (그림자 받기)
    const floor = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Ground(redGPUContext, 20, 20),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#cccccc')
    );
    floor.receiveShadow = true; // 그림자 받기 활성화
    scene.addChild(floor);

    // 3. 상자 생성 (그림자 만들기)
    const box = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#ff0000')
    );
    box.y = 2;
    box.castShadow = true; // 그림자 생성 활성화
    scene.addChild(box);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.tilt = -30; // 초기 틸트 설정 (위에서 내려다보는 각도)
    controller.maxTilt = -15; // 카메라가 바닥 아래로 내려가거나 너무 수평이 되지 않도록 제한
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        box.rotationX += 1;
        box.rotationY += 1;
    });
});
```

## 라이브 데모 (Live Demo)

상자가 회전함에 따라 바닥에 생기는 그림자의 변화를 확인해 보세요.

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

    const ambLight = new RedGPU.Light.AmbientLight('#ffffff', 0.3);
    scene.lightManager.ambientLight = ambLight;

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
    controller.tilt = -30;
    controller.maxTilt = -15;
    
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

- **Cast Shadow**: 물체가 그림자를 **만들도록** 설정합니다.
- **Receive Shadow**: 물체 표면에 그림자가 **드리우도록** 설정합니다.
- **성능 고려**: 그림자 연산은 비용이 높으므로 필요한 객체에만 활성화해야 합니다.

## 다음 학습 추천

이제 정적인 물체뿐만 아니라, 하늘과 같은 배경 환경을 구성하여 더욱 사실적인 씬을 만들어 봅시다.

- **[환경 (Environment) 개요](../environment/)**
