---
order: 4
---

# 조명과 PhongMaterial (Light & PhongMaterial)

3D 공간의 입체감은 빛과 그림자에 의해 결정됩니다. 조명이 없는 공간은 단면적으로 보이지만, 조명을 추가하면 물체의 굴곡과 깊이감이 살아납니다. 이번 단계에서는 조명의 영향을 받는 **PhongMaterial**과 공간을 밝히는 조명들에 대해 배웁니다.

## 1. 빛의 재질: PhongMaterial

**RedGPU.Material.PhongMaterial**은 조명 계산을 수행하는 고성능 재질입니다. 빛을 받았을 때 밝게 빛나는 하이라이트(Specular)와 부드러운 음영을 표현할 수 있습니다. 색상은 `color.hex` 속성을 통해 설정합니다.

```javascript
// 기본적인 빛 재질 생성
const material = new RedGPU.Material.PhongMaterial(redGPUContext);
material.color.hex = '#00CC99'; // 색상 설정
material.shininess = 32;        // 반짝임의 강도 (값이 클수록 매끄러움)
```

## 2. 주요 조명의 종류

RedGPU는 공간을 밝히기 위한 네 가지 주요 조명을 제공합니다. 조명은 **Scene**의 **LightManager**를 통해 관리됩니다.

| 종류 | 특징 | 주요 용도 |
| :--- | :--- | :--- |
| **AmbientLight** | 모든 방향에서 균일하게 비추는 빛 | 최소한의 가시성 확보, 그림자 부분의 밝기 조절 |
| **DirectionalLight** | 무한히 먼 곳에서 특정 방향으로 쏘는 빛 | 태양광, 전역적인 평행광 |
| **PointLight** | 전구처럼 한 점에서 모든 방향으로 퍼지는 빛 | 촛불, 가로등, 실내 조명 |
| **SpotLight** | 원뿔 모양으로 특정 방향을 집중해서 비추는 빛 | 손전등, 무대 조명, 하이라이트 효과 |

## 3. 학습: 조명이 비치는 구체

조명을 추가하고 **PhongMaterial**이 어떻게 반응하는지 확인해 보겠습니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

RedGPU.init(document.getElementById('redgpu-canvas'), (redGPUContext) => {
    const scene = new RedGPU.Display.Scene(redGPUContext);
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    
    // 1. 조명 설정 (LightManager를 통해 추가)
    // 환경광 추가
    scene.lightManager.ambientLight = new RedGPU.Light.AmbientLight('#ffffff', 0.2);

    // 태양광(방향광) 추가
    const directionalLight = new RedGPU.Light.DirectionalLight([-1, -1, -1], '#ffffff', 1.0);
    scene.lightManager.addDirectionalLight(directionalLight);

    // 2. 빛 재질을 입힌 구체 생성
    const material = new RedGPU.Material.PhongMaterial(redGPUContext);
    material.color.hex = '#1890ff';
    material.shininess = 64;

    const sphere = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Sphere(redGPUContext, 2, 64, 64),
        material
    );
    scene.addChild(sphere);

    // 3. 뷰 설정
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
});
```

## 라이브 데모 (Live Demo)

마우스를 조작하여 빛을 받는 구체의 하이라이트와 음영 변화를 관찰해 보세요.

<ClientOnly>
<CodePen title="RedGPU Basics - Light & Phong" slugHash="mesh-light">
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
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 10;

    // Lights
    scene.lightManager.ambientLight = new RedGPU.Light.AmbientLight('#ffffff', 0.1);
    
    const dirLight = new RedGPU.Light.DirectionalLight([-1, -1, -1], '#ffffff', 1.0);
    scene.lightManager.addDirectionalLight(dirLight);

    const pointLight = new RedGPU.Light.PointLight('#ffcc00', 2.0);
    pointLight.radius = 10;
    pointLight.setPosition(-5, 2, 5);
    scene.lightManager.addPointLight(pointLight);

    // Material & Mesh
    const material = new RedGPU.Material.PhongMaterial(redGPUContext);

    material.shininess = 128;

    const mesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.TorusKnot(redGPUContext), material);
    scene.addChild(mesh);

    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        mesh.rotationY += 1;
    });
});
</pre>
</CodePen>
</ClientOnly>

## 핵심 요약

- **PhongMaterial**의 색상은 `color.hex` 속성을 통해 제어합니다.
- 조명 효과를 시각적으로 확인하려면 반드시 **LightManager**에 조명을 등록해야 합니다.
- **Shininess**는 빛이 맺히는 하이라이트의 날카로운 정도를 결정합니다.

## 다음 학습 추천

외부에서 제작된 정교한 3D 모델(GLTF)을 불러와 사용하는 방법을 알아봅니다.

- **[모델 로딩 (GLTF Loader)](./gltf-loader.md)**