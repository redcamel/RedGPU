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

## 3. 비동기 로딩 · 취소 및 재질 바리에이션

콜백 방식 외에도 `Promise` 기반의 `loadAsync()` 와 로딩 취소(`abort()` · `AbortSignal`), 그리고 `KHR_materials_variants` 실시간 재질 전환 API를
지원합니다.

```javascript
// 1. Promise 기반 비동기 로딩 및 취소 제어
const controller = new AbortController();
const loader = new RedGPU.GLTFLoader(
    redGPUContext,
    'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MaterialsVariantsShoe/glTF-Binary/MaterialsVariantsShoe.glb'
);

await loader.loadAsync({signal: controller.signal});
scene.addChild(loader.resultMesh);

// 2. KHR_materials_variants 조회 및 실시간 전환
console.log('지원 바리에이션:', loader.materialVariants);
console.log('현재 활성 바리에이션:', loader.activeMaterialVariant);
if (loader.materialVariants.length > 0) {
    loader.applyMaterialVariant(loader.materialVariants[0]);
}

// SPA 페이지 이탈 시 로딩 취소 또는 리소스 해제
// loader.abort();
// loader.destroy();
```

---

## 4. 지원되는 glTF 2.0 확장

`GLTFLoader` 와 `PBRMaterial` 은 기본 Metallic-Roughness 워크플로우 외에도 Khronos 공식 glTF 2.0 확장(Extensions) 23종을 별도 설정 없이 자동으로
파싱하여 렌더링합니다. 압축 확장(`Draco` · `Meshopt` · `KTX2 BasisU`)은 해당 확장이 포함된 모델을 로드할 때만 WASM 디코더를 온디맨드로 불러오므로 코어 번들 용량에 영향을 주지
않습니다.

### 재질 확장

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
| `KHR_materials_variants`                        | 단일 모델의 다중 재질 프리셋 실시간 전환 및 초기 상태 감지 | [Materials Variants Shoe](/RedGPU/examples/gltf/gltfExtensions/materialsVariants/)                                 |
| `KHR_materials_pbrSpecularGlossiness`           | 레거시 Specular-Glossiness PBR 워크플로우 호환             | [Sponza](/RedGPU/examples/gltf/models/sponza/)                                                                     |

### 압축 · 텍스처 · 양자화 및 씬 확장

| glTF 확장 명칭                                        | 역할 및 특징                                                   | 라이브 샘플                                                                                        |
|:------------------------------------------------------|:---------------------------------------------------------------|:---------------------------------------------------------------------------------------------------|
| `KHR_draco_mesh_compression`                          | Google Draco 지오메트리 압축 해제 (온디맨드 WASM)              | [CarConcept (KTX2 + Draco)](/RedGPU/examples/gltf/gltfExtensions/dracoMeshCompression/carConcept/) |
| `KHR_meshopt_compression` / `EXT_meshopt_compression` | meshoptimizer 정점·인덱스·애니메이션 압축 해제 (온디맨드 WASM) | [BrainStem (Meshopt)](/RedGPU/examples/gltf/gltfExtensions/meshoptCompression/brainStem/)          |
| `KHR_texture_basisu` / `EXT_texture_webp`             | KTX2 BasisU GPU 압축 텍스처 (온디맨드 WASM) 및 WebP 텍스처     | [Chronograph Watch](/RedGPU/examples/gltf/gltfExtensions/textureBasisu/chronographWatch/)          |
| `KHR_mesh_quantization`                               | 정수 양자화 정점 속성 디코딩 및 정규화                         | [Mesh Quantization](/RedGPU/examples/gltf/gltfExtensions/meshQuantization/)                        |
| `KHR_lights_punctual`                                 | 씬 내 `Directional` · `Point` · `Spot` 광원 자동 임포트        | —                                                                                                  |
| `KHR_node_visibility`                                 | 노드 초기 가시성 및 애니메이션 기반 가시성 토글                | [Node Visibility](/RedGPU/examples/gltf/gltfExtensions/nodeVisibility/)                            |
| `KHR_animation_pointer`                               | 재질 색상·발광·UV 변환 등 임의 JSON Pointer 속성 애니메이션    | [Pot of Coals](/RedGPU/examples/gltf/gltfExtensions/animationPointer/potOfCoalsAnimationPointer/)  |

---

## 관련 예제

- [DamagedHelmet 모델 로딩](/RedGPU/examples/gltf/models/helmets/)
- [glTF 포맷 통합 비교 — BrainStem 6종](/RedGPU/examples/gltf/formats/brainStemAllFormats/)
- [glTF 포맷 통합 비교 — CarConcept 5종](/RedGPU/examples/gltf/formats/carConceptAllFormats/)
- [glTF 7종 프리미티브 토폴로지](/RedGPU/examples/gltf/basic/meshPrimitiveModes/)
- [glTF 기본 애니메이션](/RedGPU/examples/gltf/animation/basicAnimations/)
- [애니메이션 모션 블렌딩](/RedGPU/examples/gltf/animation/motionBlending/)
- [Sponza 씬 모델](/RedGPU/examples/gltf/models/sponza/)

---

## 다음 단계

수천~수만 개의 동일한 객체를 단일 드로우 콜로 고성능 렌더링하는 방법을 알아봅니다.

- **[Instancing Mesh](../instanced-mesh/index.md)**
