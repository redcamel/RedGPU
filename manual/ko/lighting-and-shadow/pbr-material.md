---
title: PBR Material
order: 4
---

# PBR Material

`PBRMaterial` 은 에너지 보존 법칙과 미세면 (Microfacet) 이론에 기반하여 금속성 (`metallicFactor`), 거칠기 (`roughnessFactor`), 굴절 및 다중 코팅 등 물리적
재질 특성을 시뮬레이션하는 물리 기반 렌더링 머티리얼입니다. `GLTFLoader` 로드 시 자동 생성되며, 직접 인스턴스를 생성해 기본 프리미티브나 커스텀 메시에 부여할 수도 있습니다.

---

## 1. 핵심 PBR 속성 및 텍스처 채널

`PBRMaterial` 은 glTF 2.0 표준 Metallic-Roughness 워크플로우를 따릅니다.

| 속성명                         | 타입                               | 기본값          | 설명                                                         |
|:-------------------------------|:-----------------------------------|:----------------|:-------------------------------------------------------------|
| **`baseColorFactor`**          | `[number, number, number, number]` | `[1, 1, 1, 1]`  | 표면의 기본 RGBA 색상 배율 (`0.0 ~ 1.0`)                     |
| **`baseColorTexture`**         | `BitmapTexture`                    | `null`          | 표면 기본 색상(Albedo) 텍스처                                |
| **`metallicFactor`**           | `number`                           | `1.0`           | 금속성 계수 (`0.0`: 비금속 유전체 ~ `1.0`: 순수 금속)        |
| **`roughnessFactor`**          | `number`                           | `1.0`           | 표면 거칠기 계수 (`0.0`: 완전한 거울면 ~ `1.0`: 완전 확산면) |
| **`metallicRoughnessTexture`** | `BitmapTexture`                    | `null`          | 거칠기(G 채널)와 금속성(B 채널)이 기록된 텍스처              |
| **`normalTexture`**            | `BitmapTexture`                    | `null`          | 탄젠트 공간 법선(Normal) 맵 텍스처                           |
| **`normalScale`**              | `number`                           | `1.0`           | 노멀 맵 요철 강도 배율                                       |
| **`occlusionTexture`**         | `BitmapTexture`                    | `null`          | 미세 틈새 차폐(AO, R 채널) 텍스처                            |
| **`occlusionStrength`**        | `number`                           | `1.0`           | 앰비언트 오클루전 적용 강도 (`0.0 ~ 1.0`)                    |
| **`emissiveFactor`**           | `[number, number, number]`         | `[0, 0, 0]`     | 자체 발광 RGB 색상 강도                                      |
| **`emissiveTexture`**          | `BitmapTexture`                    | `null`          | 자체 발광(Emissive) 텍스처                                   |
| **`emissiveStrength`**         | `number`                           | `1.0`           | 발광 밝기 증폭 배율 (`KHR_materials_emissive_strength`)      |
| **`doubleSided`**              | `boolean`                          | `false`         | 뒷면 컬링을 끄고 양면 렌더링 수행 여부                       |
| **`useCutOff` / `cutOff`**     | `boolean` / `number`               | `false` / `0.5` | 알파 마스크(`MASK`) 컷오프 활성화 여부 및 임계값             |

```javascript
const pbrMaterial = new RedGPU.Material.PBRMaterial(redGPUContext);
pbrMaterial.baseColorFactor = [1.0, 0.85, 0.35, 1.0];
pbrMaterial.metallicFactor = 1.0;
pbrMaterial.roughnessFactor = 0.15;

const sphere = new RedGPU.Display.Mesh(
    redGPUContext,
    new RedGPU.Primitive.Sphere(redGPUContext, 2, 64, 64),
    pbrMaterial
);
scene.addChild(sphere);
```

> [!TIP]
> 금속 (`metallicFactor`가 높은 재질)과 매끄러운 표면은 주변 환경 반사광을 통해 질감이 표현되므로, `view.ibl` 에 **[IBL](../environment/ibl.md)** 또는
**[SkyAtmosphere](../environment/skyatmosphere.md)** 설정을 권장합니다.

---

## 2. 지원하는 glTF KHR 재질 확장

| KHR 확장 규격                            | 주요 제어 속성                                                                                      | 표현 재질 예시                                           |
|:-----------------------------------------|:----------------------------------------------------------------------------------------------------|:---------------------------------------------------------|
| **`KHR_materials_clearcoat`**            | `useKHR_materials_clearcoat`, `KHR_clearcoatFactor`, `KHR_clearcoatRoughnessFactor`                 | 자동차 클리어코트 도장, 코팅된 원목, 젖은 표면           |
| **`KHR_materials_transmission`**         | `useKHR_materials_transmission`, `KHR_transmissionFactor`, `KHR_transmissionTexture`                | 투명 유리, 물병, 아크릴                                  |
| **`KHR_materials_volume`**               | `useKHR_materials_volume`, `KHR_thicknessFactor`, `KHR_attenuationColor`, `KHR_attenuationDistance` | 두께에 따라 빛이 흡수·굴절되는 색유리, 보석              |
| **`KHR_materials_ior`**                  | `KHR_materials_ior` (기본값: `1.5`)                                                                 | 매질별 굴절률 (물 `1.33`, 유리 `1.5`, 다이아몬드 `2.42`) |
| **`KHR_materials_sheen`**                | `useKHR_materials_sheen`, `KHR_sheenColorFactor`, `KHR_sheenRoughnessFactor`                        | 벨벳, 새틴, 극세사 등 직물 가장자리 광택                 |
| **`KHR_materials_specular`**             | `useKHR_materials_specular`, `KHR_specularFactor`, `KHR_specularColorFactor`                        | 비금속 재질의 정밀한 반사율 및 반사 색상 제어            |
| **`KHR_materials_anisotropy`**           | `useKHR_materials_anisotropy`, `KHR_anisotropyStrength`, `KHR_anisotropyRotation`                   | 헤어라인 가공 금속(Brushed Metal), LP 레코드판           |
| **`KHR_materials_iridescence`**          | `useKHR_materials_iridescence`, `KHR_iridescenceFactor`, `KHR_iridescenceIor`                       | 비눗방울, 기름막, 갑충류 껍질의 무지개빛 박막 간섭       |
| **`KHR_materials_diffuse_transmission`** | `useKHR_materials_diffuse_transmission`, `KHR_diffuseTransmissionFactor`                            | 나뭇잎, 한지, 양초 등 반투명 확산 투과 재질              |
| **`KHR_materials_unlit`**                | `useKHR_materials_unlit`                                                                            | 조명 연산을 생략하고 베이스 컬러만 출력하는 언릿 재질    |

---

## 관련 예제

- [금속성·거칠기 구체 비교](/RedGPU/examples/gltf/basic/metalRoughSpheres/)
- [투과율 및 굴절 (Transmission)](/RedGPU/examples/gltf/gltfExtensions/transmission/transmissionTest/)
- [클리어코트 (Clearcoat)](/RedGPU/examples/gltf/gltfExtensions/clearcoat/clearCoatCarPaint/)
- [광택 직물 (Sheen)](/RedGPU/examples/gltf/gltfExtensions/sheen/glamVelvetSofa/)
- [무지개빛 박막 간섭 (Iridescence)](/RedGPU/examples/gltf/gltfExtensions/iridescence/iridescenceLamp/)

---

## 다음 단계

- **[Environment](../environment/index.md)** : `IBL`, `SkyBox`, `SkyAtmosphere` 를 활용한 배경 및 환경광 구성
