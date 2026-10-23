---
title: PBR Material
order: 3
---

<script setup>
const pbrGraph = `
    BaseColor["BaseColor (기본 색상)"] --> PBR["PBRMaterial (물리 기반 재질)"]
    MetalRough["Metallic / Roughness (금속성·거칠기)"] --> PBR
    Detail["Normal / Occlusion / Emissive"] --> PBR

    %% 회색조 스타일 적용
    style BaseColor fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style MetalRough fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style Detail fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
    style PBR fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
`
</script>

# PBR Material

`PBRMaterial` 은 에너지 보존 법칙과 미세면 (Microfacet) 이론에 기반하여 금속성 (**Metallic**)과 표면 거칠기 (**Roughness**) 등 현실 세계의 물리적 재질 특성을
사실적으로 표현하는 **물리 기반 렌더링**(Physically Based Rendering) 재질입니다.

`GLTFLoader` 로 외부 `.gltf` / `.glb` 모델을 불러올 때 기본 재질로 자동 생성되며, 직접 생성하여 프리미티브 메시에 적용할 수도 있습니다.

<ClientOnly>
  <MermaidResponsive :definition="pbrGraph" />
</ClientOnly>

## 1. 텍스처 맵을 통한 물리 재질 구현

`PBRMaterial` 은 glTF 2.0 표준 **Metallic-Roughness** 워크플로우를 따르며, 다음과 같은 핵심 텍스처 맵을 조합해 실사 같은 재질을 완성합니다.

| 텍스처 맵                    | 역할                    | 효과                                                            |
|:-----------------------------|:------------------------|:----------------------------------------------------------------|
| **baseColorTexture**         | 기본 색상(Albedo Map)   | 빛 정보가 배제된 표면 고유의 색상과 무늬 결정                   |
| **metallicRoughnessTexture** | 금속성·거칠기 지도      | G 채널에 표면 거칠기(Roughness), B 채널에 금속성(Metallic) 정의 |
| **normalTexture**            | 표면 요철(Normal Map)   | 정점을 쪼개지 않고 미세한 굴곡과 입체감 표현                    |
| **occlusionTexture**         | 환경 차폐(AO Map)       | 틈새나 구석진 곳에 빛이 덜 닿아 생기는 미세 음영 표현 (R 채널)  |
| **emissiveTexture**          | 발광 지도(Emissive Map) | 주변 조명과 무관하게 스스로 빛을 내는 영역 지정                 |

## 2. 주요 속성 제어

텍스처 없이도 기본 팩터 (Factor) 수치를 조절하여 비금속 플라스틱부터 매끄러운 순수 금속까지 다양한 질감을 표현할 수 있습니다.

```javascript
const material = new RedGPU.Material.PBRMaterial(redGPUContext);

// 1. 기본 색상 (RGBA: 0.0 ~ 1.0)
material.baseColorFactor = [1.0, 0.85, 0.35, 1.0];

// 2. 금속성 및 거칠기 제어 (0.0 ~ 1.0)
material.metallicFactor = 1.0;  // 0.0: 비금속(플라스틱, 나무) ~ 1.0: 순수 금속
material.roughnessFactor = 0.2; // 0.0: 매끄러운 거울면 ~ 1.0: 거친 무광 표면
```

::: tip [IBL 환경광 연동 권장]
금속성이 높고 매끄러운 표면은 주변 환경을 반사하며 질감이 드러납니다. `PBRMaterial` 의 사실적인 반사를 확인하려면 **[IBL (이미지 기반 조명)](../environment/ibl.md)** 과 함께
사용하는 것이 좋습니다.
:::

## 3. 실습 예제: 거칠기 (Roughness)에 따른 질감 변화

동일한 황금빛 금속 (`metallicFactor = 1.0`) 구체 5개를 배치하고, `roughnessFactor` 를 `0.0` 부터 `1.0` 까지 다르게 설정하여 표면 반사가 어떻게 달라지는지 확인해
봅니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();

    // 1. 조명 및 IBL 환경광 설정
    const light = new RedGPU.Light.DirectionalLight();
    scene.lightManager.addDirectionalLight(light);

    const ibl = new RedGPU.Resource.IBL(
        redGPUContext,
        'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
    );

    // 2. 거칠기(Roughness)가 다른 5개의 PBR 구체 배치
    const sphereGeometry = new RedGPU.Primitive.Sphere(redGPUContext, 1.2, 64, 64);

    for (let i = 0; i < 5; i++) {
        const material = new RedGPU.Material.PBRMaterial(redGPUContext);
        material.baseColorFactor = [1.0, 0.82, 0.35, 1.0];
        material.metallicFactor = 1.0;
        material.roughnessFactor = i / 4; // 0.0 (거울면) ~ 1.0 (무광)

        const mesh = new RedGPU.Display.Mesh(redGPUContext, sphereGeometry, material);
        mesh.x = (i - 2) * 3;
        scene.addChild(mesh);
    }

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 12;

    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.ibl = ibl;
    view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
    redGPUContext.addView(view);

    new RedGPU.Renderer().start(redGPUContext);
});
```

### 라이브 데모

왼쪽 (`roughnessFactor: 0.0`, 매끄러운 거울 반사)에서 오른쪽 (`roughnessFactor: 1.0`, 거친 확산 반사)으로 갈수록 하이라이트와 환경 반사가 어떻게 변하는지 확인해 보세요.

<ClientOnly>
<CodePen title="RedGPU Basics - PBR Material" slugHash="pbr-material-basic">
<pre data-lang="html">
&lt;canvas id="redgpu-canvas"&gt;&lt;/canvas&gt;
</pre>
<pre data-lang="css">
body { margin: 0; overflow: hidden; background: #000; }
canvas { display: block; width: 100vw; height: 100vh; }
</pre>
<pre data-lang="js">
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

const canvas = document.getElementById ("redgpu-canvas");

RedGPU.init (canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene ();

    const light = new RedGPU.Light.DirectionalLight();
    scene.lightManager.addDirectionalLight(light);

    const ibl = new RedGPU.Resource.IBL(
        redGPUContext,
        'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
    );

    const sphereGeometry = new RedGPU.Primitive.Sphere(redGPUContext, 1.2, 64, 64);

    for (let i = 0; i < 5; i++) {
        const material = new RedGPU.Material.PBRMaterial(redGPUContext);
        material.baseColorFactor = [1.0, 0.82, 0.35, 1.0];
        material.metallicFactor = 1.0;
        material.roughnessFactor = i / 4;

        const mesh = new RedGPU.Display.Mesh(redGPUContext, sphereGeometry, material);
        mesh.x = (i - 2) * 3;
        scene.addChild(mesh);
    }

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 12;

    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    view.ibl = ibl;
    view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);
    redGPUContext.addView(view);

    new RedGPU.Renderer().start(redGPUContext);

});
</pre>
</CodePen>
</ClientOnly>

## 핵심 요약

- **`PBRMaterial`** 은 **금속성**(`metallicFactor`)과 **거칠기**(`roughnessFactor`)를 기반으로 현실적인 표면 질감을 계산합니다.
- `GLTFLoader` 로 로드된 3D 모델의 표준 재질로 사용되며, 투명 유리 (`KHR_materials_transmission`), 클리어코트 (`KHR_materials_clearcoat`) 등 다양한
  glTF 확장 속성도 지원합니다.
- 주변 환경을 반사하는 **`IBL`** 과 함께 사용할 때 가장 사실적인 결과물을 얻을 수 있습니다.

---

## 관련 예제

- [금속성·거칠기 구체 비교](/RedGPU/examples/gltf/basic/metalRoughSpheres/)
- [DamagedHelmet (PBR 텍스처 맵)](/RedGPU/examples/gltf/models/helmets/)
- [투과율 및 굴절 (Transmission)](/RedGPU/examples/gltf/gltfExtensions/transmission/transmissionTest/)
- [클리어코트 (Clearcoat)](/RedGPU/examples/gltf/gltfExtensions/clearcoat/clearCoatCarPaint/)
- [광택 직물 (Sheen)](/RedGPU/examples/gltf/gltfExtensions/sheen/glamVelvetSofa/)

---

## 다음 단계

빛이 물체에 가려져 생기는 그림자를 구현하고 씬에 사실적인 공간감을 부여하는 방법에 대해 알아봅니다.

- **[그림자](./shadow.md)**
