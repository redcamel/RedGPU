---
title: Phong Material
order: 2
---

<script setup>
const phongGraph = `
    Ambient["Ambient (환경광)"] --> Phong["Phong Reflection (퐁 재질)"]
    Diffuse["Diffuse (난반사)"] --> Phong
    Specular["Specular (정반사)"] --> Phong

    %% 회색조 스타일 적용
    style Ambient fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Diffuse fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Specular fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Phong fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
`
</script>

# Phong Material

`PhongMaterial` 은 환경광 (Ambient), 난반사 (Diffuse), 정반사 (Specular)를 결합한 퐁 반사 모델 기반의 라이팅 재질이며, 다중 텍스처 맵을 통해 사실적인 표면 요철과 광택을
표현합니다.

<ClientOnly>
  <MermaidResponsive :definition="phongGraph" />
</ClientOnly>

---

## 1. 주요 속성 및 텍스처 맵

| 속성명                    | 타입                  | 설명                                                                                               |
|:--------------------------|:----------------------|:---------------------------------------------------------------------------------------------------|
| **`color` / `alpha`**     | `ColorRGB` / `number` | 기본 표면 색상 및 투명도 (`0.0 ~ 1.0`)                                                             |
| **`shininess`**           | `number`              | 정반사 하이라이트의 날카로운 정도 (기본값: `32`)                                                   |
| **`specularStrength`**    | `number`              | 정반사 하이라이트 강도 배율 (기본값: `1.0`)                                                        |
| **`diffuseTexture`**      | `BitmapTexture`       | 표면의 기본 색상과 무늬를 결정하는 디퓨즈(Color) 맵                                                |
| **`normalTexture`**       | `BitmapTexture`       | 폴리곤 분할 없이 미세한 표면 굴곡과 입체감을 표현하는 법선(Normal) 맵                              |
| **`specularTexture`**     | `BitmapTexture`       | 영역별 반사율(금속, 플라스틱 등) 차이를 정의하는 스페큘러 맵                                       |
| **`emissiveTexture`**     | `BitmapTexture`       | 외부 조명과 무관하게 스스로 빛을 내는 발광(Emissive) 맵                                            |
| **`alphaTexture`**        | `BitmapTexture`       | 텍스처 밝기에 따라 투명/불투명 영역을 마스킹하는 알파 맵                                           |
| **`displacementTexture`** | `BitmapTexture`       | 실제 정점(Vertex) 위치를 이동시켜 물리적인 돌출을 만드는 변위 맵 (`displacementScale`로 강도 조절) |
| **`useSSR`**              | `boolean`             | 화면 공간 반사(Screen Space Reflection) 수신 여부                                                  |

```javascript
const material = new RedGPU.Material.PhongMaterial(redGPUContext);
material.color.setColorByHEX('#00CC99');
material.shininess = 32;
material.specularStrength = 1.0;
material.displacementScale = 0.5;
```

---

## 2. 다중 텍스처 조합 예제

디퓨즈, 노멀, 스페큘러, 변위 (`displacementTexture`) 맵을 동시에 적용하여 구체의 입체 질감을 표현하는 예제입니다.

```javascript
const material = new RedGPU.Material.PhongMaterial(redGPUContext);
const assetPath = 'https://redcamel.github.io/RedGPU/examples/assets/phongMaterial/';

material.diffuseTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_diffuseMap.jpg');
material.normalTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_normalMap.jpg');
material.specularTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_specularMap.jpg');
material.displacementTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_displacementMap.jpg');
material.displacementScale = 0.5;
material.shininess = 32;
```

### 라이브 데모

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
    scene.lightManager.ambientLight = new RedGPU.Light.AmbientLight('#ffffff', 50);

    const material = new RedGPU.Material.PhongMaterial(redGPUContext);
    const assetPath = 'https://redcamel.github.io/RedGPU/examples/assets/phongMaterial/';

    material.diffuseTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_diffuseMap.jpg');
    material.normalTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_normalMap.jpg');
    material.specularTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_specularMap.jpg');
    material.displacementTexture = new RedGPU.Resource.BitmapTexture(redGPUContext, assetPath + 'test_displacementMap.jpg');
    
    material.displacementScale = 0.5;
    material.shininess = 32;

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

---

## 다음 단계

- **[Shadow System](./shadow.md)** : 캐스케이드 그림자 맵 (CSM)과 소프트 그림자 설정 방법
