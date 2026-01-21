---
order: 4
---

# Phong Material

**Phong Material**은 3D 그래픽스에서 가장 널리 사용되는 라이팅 모델 중 하나인 '퐁(Phong) 리플렉션 모델'을 구현한 재질입니다. 빛의 반사를 계산하여 물체의 입체감과 질감을 사실적으로 표현합니다.

## 1. Phong 라이팅의 구성 요소

PhongMaterial은 빛에 반응하여 세 가지 주요 요소를 결합합니다.

1. **Ambient (환경광)**: 조명과 상관없이 물체가 기본적으로 가지는 최소한의 밝기입니다.
2. **Diffuse (난반사)**: 빛이 물체 표면에 부딪혀 고르게 퍼지는 물리적인 색상입니다. 물체의 형태를 파악하는 데 가장 중요합니다.
3. **Specular (정반사)**: 매끄러운 표면에서 빛이 한 방향으로 반사되어 생기는 강한 하이라이트입니다.

## 2. 주요 속성 제어

`PhongMaterial`은 단순히 색상뿐만 아니라 다양한 물리적 속성을 제어할 수 있습니다.

```javascript
const material = new RedGPU.Material.PhongMaterial(redGPUContext);

// 1. 기본 색상 및 투명도
material.color.setColorByHEX('#00CC99');
material.alpha = 1.0;

// 2. 하이라이트(Specular) 설정
material.specularPower = 32;    // 하이라이트의 날카로운 정도 (Shininess)
material.specularStrength = 1.0; // 하이라이트의 강도
material.specularColor.setColorByHEX('#ffffff');

// 3. 발광(Emissive) 설정
material.emissiveColor.setColorByHEX('#ff0000');
material.emissiveStrength = 0.5;
```

## 3. 텍스처 맵 활용

`PhongMaterial`은 단순한 수치를 넘어 텍스처를 통해 부위별로 다른 속성을 부여할 수 있습니다.

- **diffuseTexture**: 물체 표면의 기본 무늬(Color Map).
- **normalTexture**: 실제 기하학적 구조를 변경하지 않고도 표면의 미세한 굴곡과 디테일을 표현합니다.
- **specularTexture**: 물체의 어느 부분이 더 번쩍일지(금속 부분 등)를 맵으로 지정합니다.
- **emissiveTexture**: 스스로 빛을 내는 영역을 지정합니다.

```javascript
material.diffuseTexture = bitmapTexture;
material.normalTexture = normalMapTexture;
material.normalScale = 1.0; // 노멀맵의 강도 조절
```

## 4. 학습: 재질의 반짝임 조절하기

`specularPower`(Shininess) 값에 따라 물체의 질감이 어떻게 변하는지 확인해 보세요.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById('redgpu-canvas');

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    
    // 조명이 있어야 Phong 재질이 보입니다.
    const light = new RedGPU.Light.DirectionalLight();
    scene.lightManager.addDirectionalLight(light);

    // 1. 거친 재질 (Low Shininess)
    const roughBox = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#1890ff')
    );
    roughBox.material.specularPower = 2; // 낮을수록 하이라이트가 퍼짐
    roughBox.x = -2;
    scene.addChild(roughBox);

    // 2. 매끄러운 재질 (High Shininess)
    const shinyBox = new RedGPU.Display.Mesh(
        redGPUContext,
        new RedGPU.Primitive.Box(redGPUContext),
        new RedGPU.Material.PhongMaterial(redGPUContext, '#1890ff')
    );
    shinyBox.material.specularPower = 128; // 높을수록 하이라이트가 맺힘
    shinyBox.x = 2;
    scene.addChild(shinyBox);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
});
```

## 라이브 데모 (Live Demo)

다양한 텍스처 맵이 결합된 PhongMaterial의 실제 모습을 확인해 보세요.

<ClientOnly>
<CodePen title="RedGPU Basics - Phong Material" slugHash="phong-material-detail">
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
    light.x = 5; light.y = 5; light.z = 5;
    scene.lightManager.addDirectionalLight(light);
    scene.lightManager.ambientLight = new RedGPU.Light.AmbientLight('#ffffff', 0.1);

    const material = new RedGPU.Material.PhongMaterial(redGPUContext, '#ffffff');
    material.specularPower = 64;
    
    // 노멀맵과 디퓨즈맵 적용 예시 (경로는 실제 애셋 경로에 맞춰야 함)
    material.diffuseTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, 'https://redcamel.github.io/RedGPU/examples/assets/UV_Grid_Sm.jpg');

    const mesh = new RedGPU.Display.Mesh(redGPUContext, new RedGPU.Primitive.TorusKnot(redGPUContext), material);
    scene.addChild(mesh);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
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

- **Phong Material**은 빛의 난반사(Diffuse)와 정반사(Specular)를 계산하는 표준 재질입니다.
- **specularPower**를 통해 물체의 매끄러움 정도를 조절합니다.
- **Normal Map**을 사용하여 낮은 폴리곤에서도 정교한 표면 디테일을 표현할 수 있습니다.

## 다음 학습 추천

재질을 비추어 입체감을 만들어내는 다양한 광원들에 대해 알아봅니다.

- **[조명 (Light)](./light.md)**
