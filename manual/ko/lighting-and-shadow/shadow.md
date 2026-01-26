---
title: Shadow System
order: 3
---

# 그림자 시스템

3D 공간에서 그림자는 물체의 입체감과 공간 내 위치 관계를 결정짓는 핵심 요소입니다. RedGPU는 물리 기반의 그림자 시스템을 제공하며, 간단한 설정만으로 사실적인 그림자를 표현할 수 있습니다.

## 1. 그림자 생성의 3요소

그림자가 화면에 나타나기 위해서는 다음 세 가지 요소가 유기적으로 설정되어야 합니다.

1.  **광원**(Light) : 그림자를 만들어낼 빛입니다. 현재 **DirectionalLight** 가 그림자 생성을 지원합니다.
2.  **캐스터**(Caster) : 그림자를 **만드는** 물체입니다. (예: 캐릭터, 건물) -> `mesh.castShadow = true`
3.  **리시버**(Receiver) : 그림자를 **받는** 물체입니다. (예: 바닥, 벽) -> `mesh.receiveShadow = true`

::: warning [성능 주의]
그림자 연산은 GPU 자원을 많이 소모합니다. 따라서 모든 물체에 적용하기보다, 시각적으로 중요한 물체와 바닥 등에 선별적으로 적용하는 것이 성능 최적화에 유리합니다.
:::

## 2. 객체 설정 (Cast & Receive)

RedGPU의 모든 **Mesh** 객체는 그림자 생성 및 수신 여부를 결정하는 독립적인 속성을 가집니다.

```javascript
// 1. 그림자를 생성할 물체 (Caster)
const box = new RedGPU.Display.Mesh(redGPUContext, boxGeometry, boxMaterial);
box.castShadow = true;

// 2. 그림자를 받을 물체 (Receiver)
const floor = new RedGPU.Display.Mesh(redGPUContext, floorGeometry, floorMaterial);
floor.receiveShadow = true;
```

## 3. 그림자 품질 관리 (ShadowManager)

**Scene** 은 내부적으로 **ShadowManager** 를 소유하고 있어, 그림자의 해상도나 품질을 전역적으로 관리할 수 있습니다.

```javascript
// 그림자 맵의 해상도 설정 (기본값: 1024)
// 값이 클수록 그림자 경계가 선명해지지만 성능 비용이 증가합니다.
scene.shadowManager.directionalShadowManager.shadowDepthTextureSize = 2048;
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

    scene.lightManager.ambientLight = new RedGPU.Light.AmbientLight('#ffffff', 0.3);

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
-   **품질 제어**: `ShadowManager` 를 통해 성능과 선명도 사이의 균형을 조절할 수 있습니다.

## 다음 단계

그림자까지 더해져 입체감이 살아난 공간에 무한한 배경과 실사 같은 환경광을 더하는 방법을 알아봅니다.

- **[환경 설정](../environment/index.md)**