---
title: GLTF Loader
order: 1
---

<script setup>
const loaderGraph = `
    GLTF[".gltf / .glb 파일"] -->|비동기 로드 및 파싱| Loader["GLTFLoader (로더)"]
    Loader -->|PBRMaterial 생성| Mat["Material (재질)"]
    Loader -->|Geometry 파싱| Geo["Geometry (지오메트리)"]
    Mat --> Mesh["resultMesh (최종 메시)"]
    Geo --> Mesh

    %% 회색조 스타일 적용
    style GLTF fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
    style Loader fill:#fafafa,stroke:#e4e4e7,color:#27272a,stroke-width:1px
    style Mat fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Geo fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
    style Mesh fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
`
</script>

# GLTF Loader

**Primitive** 로 기본적인 형태를 만들 수 있지만, 정교한 캐릭터나 건물 같은 고품질 에셋은 외부 3D 툴 (Blender, Maya 등)에서 제작하여 가져와야 합니다.
RedGPU는 웹 3D 표준 포맷인 **glTF**(GL Transmission Format) 2.0 로딩을 지원하는 `GLTFLoader` 를 제공합니다.

<ClientOnly>
  <MermaidResponsive :definition="loaderGraph" />
</ClientOnly>

## 1. 모델 불러오기

`GLTFLoader` 를 생성하면 비동기로 파일을 로드 및 파싱하며, 완료 시 콜백 함수로 전달된 `loader.resultMesh` 를 `Scene` 에 추가하여 렌더링합니다.

```javascript
new RedGPU.GLTFLoader(
    redGPUContext, 
    'https://.../DamagedHelmet.glb', // 모델 경로
    (loader) => {
        // 로드 완료 후 최종 모델(resultMesh)을 씬에 추가
        scene.addChild(loader.resultMesh);
    }
);
```

- **`resultMesh`**: 로드된 모델 계층 구조를 담고 있는 루트 `Mesh` 객체입니다.
- **`parsingResult`**: 재질 (`materials`), 텍스처 (`textures`), 애니메이션 (`animations`) 등 파싱된 상세 데이터입니다.

> [!TIP]
> glTF 모델은 대부분 `PBRMaterial` 을 사용하므로, 사실적인 금속 반사와 색감을 표현하려면 `view.ibl` 에 `IBL` 환경광을 함께 설정하는 것을 권장합니다.

## 2. 실습 예제: 환경광과 모델 로딩

`IBL` 로 환경을 구성하고 금속 헬멧 모델을 로드하는 예제입니다.

```javascript
import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";

RedGPU.init(canvas, (redGPUContext) => {
    const scene = new RedGPU.Display.Scene();
    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 3;

    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    // 1. IBL 및 SkyBox 설정
    const ibl = new RedGPU.Resource.IBL(
        redGPUContext,
        'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
    );
    view.ibl = ibl;
    view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

    // 2. GLTF 모델 로딩
    new RedGPU.GLTFLoader(
        redGPUContext,
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
        (loader) => {
            scene.addChild(loader.resultMesh);
        }
    );

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
});
```

### 라이브 데모

<ClientOnly>
<CodePen title="RedGPU Basics - GLTF Loader with IBL" slugHash="gltf-loader">
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

    const controller = new RedGPU.Camera.OrbitController(redGPUContext);
    controller.distance = 3;

    const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
    redGPUContext.addView(view);

    const ibl = new RedGPU.Resource.IBL(
        redGPUContext,
        'https://redcamel.github.io/RedGPU/examples/assets/hdr/2k/the_sky_is_on_fire_2k.hdr'
    );
    view.ibl = ibl;
    view.skybox = new RedGPU.Display.SkyBox(redGPUContext, ibl.environmentTexture);

    let targetMesh;
    new RedGPU.GLTFLoader(
        redGPUContext,
        'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb',
        (loader) => {
            targetMesh = loader.resultMesh;
            scene.addChild(targetMesh);
        }
    );

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext, () => {
        if (targetMesh) targetMesh.rotationY += 1;
    });
});
</pre>
</CodePen>
</ClientOnly>

---

## 3. 지원되는 glTF 2.0 재질 확장

`GLTFLoader` 와 `PBRMaterial` 은 기본 Metallic-Roughness 워크플로우 외에도 Khronos 공식 glTF 2.0 PBR 확장(Extensions)을 별도 설정 없이 자동으로
파싱하여 렌더링합니다.

| glTF 확장 명칭                                  | 시각적 효과 및 역할                                        | 라이브 샘플                                                                                                        |
|:------------------------------------------------|:-----------------------------------------------------------|:-------------------------------------------------------------------------------------------------------------------|
| `KHR_materials_clearcoat`                       | 자동차 도장·코팅 표면의 투명 클리어코트 반사층             | [ClearCoat Car Paint](/RedGPU/examples/gltf/gltfExtensions/clearcoat/clearCoatCarPaint/)                           |
| `KHR_materials_transmission`                    | 유리·액체 등 굴절을 동반한 물리적 빛 투과                  | [Mosquito In Amber](/RedGPU/examples/gltf/gltfExtensions/transmission/mosquitoInAmber/)                            |
| `KHR_materials_volume`                          | 두께(`thickness`)와 흡수(`attenuation`)를 갖는 볼륨 매질   | [Dragon Attenuation](/RedGPU/examples/gltf/gltfExtensions/volume/dragonAttenuation/)                               |
| `KHR_materials_ior`                             | 유전체 매질의 굴절률(Index of Refraction) 제어             | [IOR Test Grid](/RedGPU/examples/gltf/gltfExtensions/volume/IORTestGrid/)                                          |
| `KHR_materials_dispersion`                      | 프리즘·보석 내부의 파장별 색분산(무지개 굴절)              | [Dragon Dispersion](/RedGPU/examples/gltf/gltfExtensions/dispersion/dragonDispersion/)                             |
| `KHR_materials_sheen`                           | 벨벳·천·패브릭 표면의 미세 섬유 역광 산란                  | [Glam Velvet Sofa](/RedGPU/examples/gltf/gltfExtensions/sheen/glamVelvetSofa/)                                     |
| `KHR_materials_iridescence`                     | 비눗방울·벌레 껍질·선글라스 코팅의 박막 간섭 무지개빛      | [Iridescence Lamp](/RedGPU/examples/gltf/gltfExtensions/iridescence/iridescenceLamp/)                              |
| `KHR_materials_anisotropy`                      | 헤어라인 브러시드 메탈·실크의 이방성(방향성) 하이라이트    | [Anisotropy Barn Lamp](/RedGPU/examples/gltf/gltfExtensions/anisotropy/anisotropyBarnLamp/)                        |
| `KHR_materials_specular`                        | 비금속 반사 강도(`specularFactor`) 및 반사 색상 미세 제어  | [Specular Silk Pouf](/RedGPU/examples/gltf/gltfExtensions/specular/specularSilkPouf/)                              |
| `KHR_materials_diffuse_transmission`            | 찻잔·나뭇잎·종이 등 반투명 확산 투과(Subsurface) 표현      | [Diffuse Transmission Teacup](/RedGPU/examples/gltf/gltfExtensions/diffuseTransmission/diffuseTransmissionTeacup/) |
| `KHR_materials_emissive_strength`               | `1.0` 이상의 고휘도 HDR 발광(Emissive) 강도 확장           | [Emissive Strength](/RedGPU/examples/gltf/gltfExtensions/emissiveStrength/emissiveStrengthTest/)                   |
| `KHR_materials_unlit` / `KHR_texture_transform` | 조명 연산을 생략하는 Unlit 셰이딩 및 UV 오프셋·회전·스케일 | [Texture Transform](/RedGPU/examples/gltf/gltfExtensions/textureTransform/textureTransformTest/)                   |

---

## 관련 예제

- [DamagedHelmet 모델 로딩](/RedGPU/examples/gltf/models/helmets/)
- [glTF 기본 애니메이션](/RedGPU/examples/gltf/animation/basicAnimations/)
- [애니메이션 모션 블렌딩](/RedGPU/examples/gltf/animation/motionBlending/)
- [Sponza 씬 모델](/RedGPU/examples/gltf/models/sponza/)

---

## 다음 단계

수천~수만 개의 동일한 객체를 단일 드로우 콜로 고성능 렌더링하는 방법을 알아봅니다.

- **[Instancing Mesh](../instanced-mesh/index.md)**
