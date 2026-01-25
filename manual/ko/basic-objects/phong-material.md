---
title: Phong Material (퐁 재질)
order: 5
---

# Phong Material

**Phong Material** 은 3D 그래픽스에서 가장 널리 사용되는 라이팅 모델 중 하나인 '퐁(Phong) 리플렉션 모델' 을 구현한 재질입니다. 단순히 색상을 칠하는 것을 넘어, 다양한 **텍스처 맵** 을 활용하여 물체의 질감을 사실적으로 조절할 수 있습니다.

## 1. 텍스처 맵을 통한 질감 구현

`PhongMaterial` 은 여러 장의 텍스처를 겹쳐서 입힘으로써 물체의 디테일을 완성합니다. RedGPU는 다음과 같은 다양한 맵을 지원합니다.

| 텍스처 맵 | 역할 | 효과 |
| :--- | :--- | :--- |
| **diffuseTexture** | 기본 무늬(Color Map) | 물체 표면의 기본적인 색상과 패턴 결정 |
| **normalTexture** | 표면 요철(Normal Map) | 실제 면을 나누지 않고도 미세한 굴곡과 입체감 표현 |
| **specularTexture** | 광택 지도(Specular Map) | 물체의 어느 부분이 더 반짝일지(금속, 플라스틱 등) 정의 |
| **emissiveTexture** | 발광 지도(Emissive Map) | 조명과 상관없이 스스로 빛을 내는 영역 지정 |
| **alphaTexture** | 투명도 지도(Alpha Map) | 텍스처의 밝기에 따라 투명/불투명 영역 지정 |
| **displacementTexture** | 변위 지도(Displacement Map) | 실제 지오메트리 정점을 이동시켜 물리적인 굴곡 생성 |

## 2. 주요 속성 제어

수치 조절을 통해 하이라이트의 강도와 날카로움을 제어할 수 있습니다.

```javascript
const material = new RedGPU.Material.PhongMaterial(redGPUContext);

// 1. 기본 색상 및 투명도
material.color.setColorByHEX('#00CC99');
material.alpha = 1.0;

// 2. 하이라이트(Specular) 제어
material.specularPower = 32;    // 하이라이트의 날카로운 정도 (Shininess)
material.specularStrength = 1.0; // 하이라이트의 강도

// 3. 고급 속성
material.displacementScale = 1.0; // 변위 맵의 돌출 정도
material.useSSR = true;           // 스크린 스페이스 반사 사용
```

## 3. 실습 예제: 텍스처 조합하기

여러 장의 맵을 동시에 적용하여 단순한 공을 정교한 행성이나 기계 부품처럼 보이게 만들 수 있습니다.

```javascript
    // 1. 재질 생성
    const material = new RedGPU.Material.PhongMaterial(redGPUContext);
    
    // 2. 다양한 텍스처 맵 적용
    const assetPath = 'https://redcamel.github.io/RedGPU/examples/assets/phongMaterial/';
    
    material.diffuseTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_diffuseMap.jpg');
    material.normalTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_normalMap.jpg');
    material.specularTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_specularMap.jpg');
    material.displacementTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_displacementMap.jpg');
    
    material.displacementScale = 0.5; // 변위 강도 조절

    const mesh = new RedGPU.Display.Mesh(
        redGPUContext, 
        new RedGPU.Primitive.Sphere(redGPUContext, 4, 64, 64), 
        material
    );
    scene.addChild(mesh);

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    new RedGPU.Renderer().start(redGPUContext, () => {
        mesh.rotationY += 1;
    });
});
```

### 라이브 데모

텍스처 맵이 적용된 **PhongMaterial** 이 조명 아래에서 어떻게 반응하는지 확인해 보세요.

<ClientOnly>
<CodePen title="RedGPU Basics - Phong Material Texture" slugHash="phong-material-texture">
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
    scene.lightManager.addDirectionalLight(light);
    scene.lightManager.ambientLight = new RedGPU.Light.AmbientLight('#ffffff', 0.1);

    const material = new RedGPU.Material.PhongMaterial(redGPUContext);
    const assetPath = 'https://redcamel.github.io/RedGPU/examples/assets/phongMaterial/';

    material.diffuseTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_diffuseMap.jpg');
    material.normalTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_normalMap.jpg');
    material.specularTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_specularMap.jpg');
    material.displacementTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_displacementMap.jpg');
    
    material.displacementScale = 0.5;
    material.specularPower = 32;

    const mesh = new RedGPU.Display.Mesh(
        redGPUContext, 
        new RedGPU.Primitive.Sphere(redGPUContext, 4, 64, 64), 
        material
    );
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

- **Phong Material** 은 빛의 난반사(Diffuse) 와 정반사(Specular) 를 계산하는 라이팅 재질입니다.
- **Normal Map** 을 사용하면 면을 쪼개지 않고도 정교한 표면 질감을 표현할 수 있습니다.
- **Displacement Map** 을 통해 실제 지오메트리를 변형시켜 물리적인 입체감을 만들 수 있습니다.

---

## 다음 단계

사실적인 공간감을 위한 그림자 시스템에 대해 알아봅니다.

- **[그림자 (Shadow)](../shadow-system/)**
