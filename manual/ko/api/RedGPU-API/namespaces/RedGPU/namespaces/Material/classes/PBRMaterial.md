[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Material](../README.md) / PBRMaterial

# Class: PBRMaterial

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:186](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L186)

물리 기반 렌더링(Physically Based Rendering) 및 glTF 2.0 재질 확장을 지원하는 머티리얼 클래스입니다.

베이스 컬러, 금속성/거칠기, 노멀, 오클루전, 발광 텍스처 및 다양한 `KHR_materials_*` 확장 속성을 통합 관리하고 렌더 파이프라인용 패킹 텍스처를 구성합니다.

## Extends

- [`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md)

## Constructors



***

### Constructor

> **new PBRMaterial**(`redGPUContext`): `PBRMaterial`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:693](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L693)

PBRMaterial 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스 |

#### Returns

`PBRMaterial`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`constructor`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#constructor)

## Properties



***

### alphaBlend

> **alphaBlend**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:206](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L206)

알파 블렌딩 모드 값

***

***

### baseColorFactor

> **baseColorFactor**: `number`[]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:226](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L226)

베이스 컬러 팩터 `[r, g, b, a]`

***

***

### baseColorTexture

> **baseColorTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:216](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L216)

베이스 컬러 텍스처

***

***

### baseColorTexture\_texCoord\_index

> **baseColorTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:231](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L231)

베이스 컬러 텍스처 UV 채널 인덱스

***

***

### baseColorTextureSampler

> **baseColorTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:221](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L221)

베이스 컬러 텍스처 샘플러

***

***

### cutOff

> **cutOff**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:201](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L201)

알파 컷오프 임계값

***

***

### doubleSided

> **doubleSided**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:656](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L656)

양면 렌더링 여부

***

***

### emissiveFactor

> **emissiveFactor**: `number`[]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:601](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L601)

발광 컬러 팩터 `[r, g, b]`

***

***

### emissiveStrength

> **emissiveStrength**: `number`[]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:606](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L606)

발광 강도 배율 (`KHR_materials_emissive_strength`)

***

***

### emissiveTexture

> **emissiveTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:586](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L586)

발광(Emissive) 텍스처

***

***

### emissiveTexture\_texCoord\_index

> **emissiveTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:596](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L596)

발광 텍스처 UV 채널 인덱스

***

***

### emissiveTextureSampler

> **emissiveTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:591](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L591)

발광 텍스처 샘플러

***

***

### isFoliage

> **isFoliage**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:661](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L661)

식생(Two-Sided Foliage) 셰이딩 모델 활성화 여부

***

***

### KHR\_anisotropyRotation

> **KHR\_anisotropyRotation**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:311](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L311)

이방성 회전 각도 (라디안)

***

***

### KHR\_anisotropyStrength

> **KHR\_anisotropyStrength**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:306](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L306)

이방성(Anisotropy) 강도

***

***

### KHR\_anisotropyTexture

> **KHR\_anisotropyTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:316](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L316)

이방성 텍스처

***

***

### KHR\_anisotropyTexture\_texCoord\_index

> **KHR\_anisotropyTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:326](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L326)

이방성 텍스처 UV 채널 인덱스

***

***

### KHR\_anisotropyTextureSampler

> **KHR\_anisotropyTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:321](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L321)

이방성 텍스처 샘플러

***

***

### KHR\_attenuationColor

> **KHR\_attenuationColor**: `number`[]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:416](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L416)

볼륨 감쇠 컬러 `[r, g, b]`

***

***

### KHR\_attenuationDistance

> **KHR\_attenuationDistance**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:411](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L411)

볼륨 내 빛 감쇠 거리

***

***

### KHR\_clearcoatFactor

> **KHR\_clearcoatFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:246](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L246)

클리어코트 강도 팩터

***

***

### KHR\_clearcoatNormalScale

> **KHR\_clearcoatNormalScale**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:241](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L241)

클리어코트 노멀 맵 스케일

***

***

### KHR\_clearcoatNormalTexture

> **KHR\_clearcoatNormalTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:261](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L261)

클리어코트 노멀 텍스처

***

***

### KHR\_clearcoatNormalTexture\_texCoord\_index

> **KHR\_clearcoatNormalTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:291](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L291)

클리어코트 노멀 텍스처 UV 채널 인덱스

***

***

### KHR\_clearcoatNormalTextureSampler

> **KHR\_clearcoatNormalTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:276](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L276)

클리어코트 노멀 텍스처 샘플러

***

***

### KHR\_clearcoatRoughnessFactor

> **KHR\_clearcoatRoughnessFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:251](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L251)

클리어코트 거칠기 팩터

***

***

### KHR\_clearcoatRoughnessTexture

> **KHR\_clearcoatRoughnessTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:266](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L266)

클리어코트 거칠기 텍스처

***

***

### KHR\_clearcoatRoughnessTexture\_texCoord\_index

> **KHR\_clearcoatRoughnessTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:296](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L296)

클리어코트 거칠기 텍스처 UV 채널 인덱스

***

***

### KHR\_clearcoatRoughnessTextureSampler

> **KHR\_clearcoatRoughnessTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:281](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L281)

클리어코트 거칠기 텍스처 샘플러

***

***

### KHR\_clearcoatTexture

> **KHR\_clearcoatTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:256](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L256)

클리어코트 텍스처

***

***

### KHR\_clearcoatTexture\_texCoord\_index

> **KHR\_clearcoatTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:286](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L286)

클리어코트 텍스처 UV 채널 인덱스

***

***

### KHR\_clearcoatTextureSampler

> **KHR\_clearcoatTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:271](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L271)

클리어코트 텍스처 샘플러

***

***

### KHR\_diffuseTransmissionColorFactor

> **KHR\_diffuseTransmissionColorFactor**: \[`number`, `number`, `number`\]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:366](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L366)

확산 투과 컬러 팩터 `[r, g, b]`

***

***

### KHR\_diffuseTransmissionColorTexture

> **KHR\_diffuseTransmissionColorTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:386](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L386)

확산 투과 컬러 텍스처

***

***

### KHR\_diffuseTransmissionColorTexture\_texCoord\_index

> **KHR\_diffuseTransmissionColorTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:396](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L396)

확산 투과 컬러 텍스처 UV 채널 인덱스

***

***

### KHR\_diffuseTransmissionColorTextureSampler

> **KHR\_diffuseTransmissionColorTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:391](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L391)

확산 투과 컬러 텍스처 샘플러

***

***

### KHR\_diffuseTransmissionFactor

> **KHR\_diffuseTransmissionFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:361](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L361)

확산 투과(Diffuse Transmission) 팩터

***

***

### KHR\_diffuseTransmissionTexture

> **KHR\_diffuseTransmissionTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:371](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L371)

확산 투과 텍스처

***

***

### KHR\_diffuseTransmissionTexture\_texCoord\_index

> **KHR\_diffuseTransmissionTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:381](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L381)

확산 투과 텍스처 UV 채널 인덱스

***

***

### KHR\_diffuseTransmissionTextureSampler

> **KHR\_diffuseTransmissionTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:376](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L376)

확산 투과 텍스처 샘플러

***

***

### KHR\_dispersion

> **KHR\_dispersion**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:666](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L666)

`KHR_materials_dispersion` 색분산 강도

***

***

### KHR\_iridescenceFactor

> **KHR\_iridescenceFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:511](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L511)

무지개빛(Iridescence) 강도 팩터

***

***

### KHR\_iridescenceIor

> **KHR\_iridescenceIor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:516](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L516)

무지개빛 박막 굴절률 (IOR)

***

***

### KHR\_iridescenceTexture

> **KHR\_iridescenceTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:531](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L531)

무지개빛 강도 텍스처

***

***

### KHR\_iridescenceTextureSampler

> **KHR\_iridescenceTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:536](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L536)

무지개빛 강도 텍스처 샘플러

***

***

### KHR\_iridescenceThicknessMaximum

> **KHR\_iridescenceThicknessMaximum**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:526](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L526)

무지개빛 박막 최대 두께 (nm)

***

***

### KHR\_iridescenceThicknessMinimum

> **KHR\_iridescenceThicknessMinimum**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:521](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L521)

무지개빛 박막 최소 두께 (nm)

***

***

### KHR\_iridescenceThicknessTexture

> **KHR\_iridescenceThicknessTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:541](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L541)

무지개빛 두께 텍스처

***

***

### KHR\_iridescenceThicknessTextureSampler

> **KHR\_iridescenceThicknessTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:546](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L546)

무지개빛 두께 텍스처 샘플러

***

***

### KHR\_materials\_ior

> **KHR\_materials\_ior**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:556](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L556)

`KHR_materials_ior` 굴절률(IOR) 값 (기본값: `1.5`)

***

***

### KHR\_sheenColorFactor

> **KHR\_sheenColorFactor**: \[`number`, `number`, `number`\]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:441](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L441)

광택(Sheen) 컬러 팩터 `[r, g, b]`

***

***

### KHR\_sheenColorTexture

> **KHR\_sheenColorTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:451](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L451)

광택 컬러 텍스처

***

***

### KHR\_sheenColorTextureSampler

> **KHR\_sheenColorTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:456](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L456)

광택 컬러 텍스처 샘플러

***

***

### KHR\_sheenRoughnessFactor

> **KHR\_sheenRoughnessFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:446](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L446)

광택 거칠기 팩터

***

***

### KHR\_sheenRoughnessTexture

> **KHR\_sheenRoughnessTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:461](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L461)

광택 거칠기 텍스처

***

***

### KHR\_sheenRoughnessTextureSampler

> **KHR\_sheenRoughnessTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:466](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L466)

광택 거칠기 텍스처 샘플러

***

***

### KHR\_specularColorFactor

> **KHR\_specularColorFactor**: \[`number`, `number`, `number`\]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:481](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L481)

스펙큘러 컬러 팩터 `[r, g, b]`

***

***

### KHR\_specularColorTexture

> **KHR\_specularColorTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:496](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L496)

스펙큘러 컬러 텍스처

***

***

### KHR\_specularColorTextureSampler

> **KHR\_specularColorTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:501](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L501)

스펙큘러 컬러 텍스처 샘플러

***

***

### KHR\_specularFactor

> **KHR\_specularFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:476](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L476)

스펙큘러 반사 강도 팩터

***

***

### KHR\_specularTexture

> **KHR\_specularTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:486](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L486)

스펙큘러 텍스처

***

***

### KHR\_specularTextureSampler

> **KHR\_specularTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:491](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L491)

스펙큘러 텍스처 샘플러

***

***

### KHR\_thicknessFactor

> **KHR\_thicknessFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:406](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L406)

볼륨 두께 팩터

***

***

### KHR\_thicknessTexture

> **KHR\_thicknessTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:421](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L421)

볼륨 두께 텍스처

***

***

### KHR\_thicknessTexture\_texCoord\_index

> **KHR\_thicknessTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:431](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L431)

볼륨 두께 텍스처 UV 채널 인덱스

***

***

### KHR\_thicknessTextureSampler

> **KHR\_thicknessTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:426](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L426)

볼륨 두께 텍스처 샘플러

***

***

### KHR\_transmissionFactor

> **KHR\_transmissionFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:336](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L336)

광학 투과(Transmission) 팩터

***

***

### KHR\_transmissionTexture

> **KHR\_transmissionTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:341](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L341)

투과 텍스처

***

***

### KHR\_transmissionTexture\_texCoord\_index

> **KHR\_transmissionTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:351](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L351)

투과 텍스처 UV 채널 인덱스

***

***

### KHR\_transmissionTextureSampler

> **KHR\_transmissionTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:346](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L346)

투과 텍스처 샘플러

***

***

### metallicFactor

> **metallicFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:646](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L646)

금속성(Metallic) 팩터 (0.0 ~ 1.0)

***

***

### metallicRoughnessTexture

> **metallicRoughnessTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:631](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L631)

금속성-거칠기(Metallic-Roughness) 텍스처

***

***

### metallicRoughnessTexture\_texCoord\_index

> **metallicRoughnessTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:641](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L641)

금속성-거칠기 텍스처 UV 채널 인덱스

***

***

### metallicRoughnessTextureSampler

> **metallicRoughnessTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:636](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L636)

금속성-거칠기 텍스처 샘플러

***

***

### normalScale

> **normalScale**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:561](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L561)

노멀 맵 스케일

***

***

### normalTexture

> **normalTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:571](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L571)

노멀 맵 텍스처

***

***

### normalTexture\_texCoord\_index

> **normalTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:581](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L581)

노멀 맵 텍스처 UV 채널 인덱스

***

***

### normalTextureSampler

> **normalTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:576](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L576)

노멀 맵 텍스처 샘플러

***

***

### occlusionStrength

> **occlusionStrength**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:626](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L626)

오클루전 적용 강도

***

***

### occlusionTexture

> **occlusionTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:611](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L611)

오클루전(AO) 텍스처

***

***

### occlusionTexture\_texCoord\_index

> **occlusionTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:621](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L621)

오클루전 텍스처 UV 채널 인덱스

***

***

### occlusionTextureSampler

> **occlusionTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:616](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L616)

오클루전 텍스처 샘플러

***

***

### roughnessFactor

> **roughnessFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:651](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L651)

거칠기(Roughness) 팩터 (0.0 ~ 1.0)

***

***

### useCutOff

> **useCutOff**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:196](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L196)

알파 컷오프(MASK) 사용 여부

***

***

### useKHR\_materials\_anisotropy

> **useKHR\_materials\_anisotropy**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:301](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L301)

`KHR_materials_anisotropy` 확장 사용 여부

***

***

### useKHR\_materials\_clearcoat

> **useKHR\_materials\_clearcoat**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:236](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L236)

`KHR_materials_clearcoat` 확장 사용 여부

***

***

### useKHR\_materials\_diffuse\_transmission

> **useKHR\_materials\_diffuse\_transmission**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:356](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L356)

`KHR_materials_diffuse_transmission` 확장 사용 여부

***

***

### useKHR\_materials\_iridescence

> **useKHR\_materials\_iridescence**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:506](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L506)

`KHR_materials_iridescence` 확장 사용 여부

***

***

### useKHR\_materials\_sheen

> **useKHR\_materials\_sheen**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:436](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L436)

`KHR_materials_sheen` 확장 사용 여부

***

***

### useKHR\_materials\_specular

> **useKHR\_materials\_specular**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:471](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L471)

`KHR_materials_specular` 확장 사용 여부

***

***

### useKHR\_materials\_transmission

> **useKHR\_materials\_transmission**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:331](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L331)

`KHR_materials_transmission` 확장 사용 여부

***

***

### useKHR\_materials\_unlit

> **useKHR\_materials\_unlit**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:551](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L551)

`KHR_materials_unlit` 확장 사용 여부

***

***

### useKHR\_materials\_volume

> **useKHR\_materials\_volume**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:401](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L401)

`KHR_materials_volume` 확장 사용 여부

***

***

### useNormalTexture

> **useNormalTexture**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:566](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L566)

노멀 텍스처 사용 여부

***

***

### useVertexColor

> **useVertexColor**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:191](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L191)

버텍스 컬러 사용 여부

## Accessors



***

### packedKHR\_clearcoatTexture\_transmission

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **packedKHR\_clearcoatTexture\_transmission**(): [`PackedTexture`](../../Resource/classes/PackedTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:722](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L722)

클리어코트 및 투과(Transmission)/두께 채널이 결합된 패킹 텍스처를 반환합니다.

##### Returns

[`PackedTexture`](../../Resource/classes/PackedTexture.md)

PackedTexture 인스턴스

***

***

### packedKHR\_diffuse\_transmission

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **packedKHR\_diffuse\_transmission**(): [`PackedTexture`](../../Resource/classes/PackedTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:770](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L770)

확산 투과(Diffuse Transmission) 컬러 및 팩터 채널이 결합된 패킹 텍스처를 반환합니다.

##### Returns

[`PackedTexture`](../../Resource/classes/PackedTexture.md)

PackedTexture 인스턴스

***

***

### packedKHR\_iridescence

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **packedKHR\_iridescence**(): [`PackedTexture`](../../Resource/classes/PackedTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:734](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L734)

무지개빛(Iridescence) 및 두께 채널이 결합된 패킹 텍스처를 반환합니다.

##### Returns

[`PackedTexture`](../../Resource/classes/PackedTexture.md)

PackedTexture 인스턴스

***

***

### packedKHR\_sheen

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **packedKHR\_sheen**(): [`PackedTexture`](../../Resource/classes/PackedTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:758](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L758)

광택(Sheen) 컬러 및 거칠기 채널이 결합된 패킹 텍스처를 반환합니다.

##### Returns

[`PackedTexture`](../../Resource/classes/PackedTexture.md)

PackedTexture 인스턴스

***

***

### packedORMTexture

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **packedORMTexture**(): [`PackedTexture`](../../Resource/classes/PackedTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:746](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L746)

오클루전(R), 거칠기(G), 금속성(B)이 결합된 ORM 패킹 텍스처를 반환합니다.

##### Returns

[`PackedTexture`](../../Resource/classes/PackedTexture.md)

PackedTexture 인스턴스

***

## Methods



***

### setupPackedKHR\_clearcoatTexture\_transmission()

> **setupPackedKHR\_clearcoatTexture\_transmission**(): `Promise`\<`void`\>

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:810](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L810)

클리어코트, 클리어코트 거칠기, 투과, 볼륨 두께 텍스처를 단일 4채널 텍스처로 패킹합니다.

#### Returns

`Promise`\<`void`\>

***

***

### setupPackedKHR\_diffuse\_transmission()

> **setupPackedKHR\_diffuse\_transmission**(): `Promise`\<`void`\>

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:852](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L852)

확산 투과 컬러 및 확산 투과 팩터 텍스처를 단일 패킹 텍스처로 병합합니다.

#### Returns

`Promise`\<`void`\>

***

***

### setupPackedKHR\_iridescence()

> **setupPackedKHR\_iridescence**(): `Promise`\<`void`\>

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:916](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L916)

무지개빛(Iridescence) 및 무지개빛 두께 텍스처를 단일 패킹 텍스처로 병합합니다.

#### Returns

`Promise`\<`void`\>

***

***

### setupPackedKHR\_sheen()

> **setupPackedKHR\_sheen**(): `Promise`\<`void`\>

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:884](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L884)

광택(Sheen) 컬러 및 광택 거칠기 텍스처를 단일 패킹 텍스처로 병합합니다.

#### Returns

`Promise`\<`void`\>

***

***

### setupPackORMTexture()

> **setupPackORMTexture**(): `Promise`\<`void`\>

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:778](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L778)

오클루전과 금속성-거칠기 텍스처를 단일 ORM 패킹 텍스처로 병합합니다.

#### Returns

`Promise`\<`void`\>

***

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### \_\_packingList

> **\_\_packingList**: `any`[]

Defined in: [src/material/core/ABitmapBaseMaterial.ts:24](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABitmapBaseMaterial.ts#L24)

프래그먼트 상태 갱신 시 실행되는 텍스처 패킹 콜백 함수 목록

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`__packingList`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#__packinglist)

***

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:74](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L74)

파이프라인 갱신 필요 여부 플래그

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`dirtyPipeline`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#dirtypipeline)

***

***

### dirtyTextureTransform

> **dirtyTextureTransform**: `boolean` = `false`

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:32](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/AUVTransformBaseMaterial.ts#L32)

텍스처 UV 변환 정보 변경 여부 플래그

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`dirtyTextureTransform`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#dirtytexturetransform)

***

***

### gpuRenderInfo

> **gpuRenderInfo**: [`FragmentGPURenderInfo`](../namespaces/Core/classes/FragmentGPURenderInfo.md)

Defined in: [src/material/core/ABaseMaterial.ts:69](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L69)

프래그먼트 GPU 렌더 파이프라인 정보 객체

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`gpuRenderInfo`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#gpurenderinfo)

***

***

### isInstanceofMaterial

> **isInstanceofMaterial**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:42](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L42)

머티리얼 인스턴스 여부 플래그

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`isInstanceofMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#isinstanceofmaterial)

***

***

### opacity

> **opacity**: `number`

Defined in: [src/material/core/ABaseMaterial.ts:27](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L27)

머티리얼의 불투명도 (0.0 ~ 1.0)

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`opacity`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#opacity)

***

***

### tint

> **tint**: [`ColorRGBA`](../../Color/classes/ColorRGBA.md)

Defined in: [src/material/core/ABaseMaterial.ts:32](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L32)

머티리얼의 틴트 컬러 (ColorRGBA)

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`tint`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#tint)

***

***

### transparent

> **transparent**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:79](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L79)

머티리얼 투명 렌더링 활성화 여부

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`transparent`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#transparent)

***

***

### use2PathRender

> **use2PathRender**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:211](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/pbrMaterial/PBRMaterial.ts#L211)

2패스 투명 렌더링 사용 여부

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`use2PathRender`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#use2pathrender)

***

***

### useTint

> **useTint**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:37](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L37)

틴트 컬러 적용 여부

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`useTint`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#usetint)

***

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`antialiasingManager`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#antialiasingmanager)

***

***

### blendAlphaState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **blendAlphaState**(): [`BlendState`](../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:277](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L277)

알파 블렌드 상태 객체를 반환합니다.

##### Returns

[`BlendState`](../../RenderState/classes/BlendState.md)

알파 BlendState 인스턴스

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`blendAlphaState`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#blendalphastate)

***

***

### blendColorState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **blendColorState**(): [`BlendState`](../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:265](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L265)

컬러 블렌드 상태 객체를 반환합니다.

##### Returns

[`BlendState`](../../RenderState/classes/BlendState.md)

컬러 BlendState 인스턴스

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`blendColorState`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#blendcolorstate)

***

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:61](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L61)

캐시 키를 반환하거나 설정합니다.

##### Returns

`string`

캐시 키 문자열

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L65)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`cacheKey`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#cachekey)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`commandEncoderManager`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#commandencodermanager)

***

***

### FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:217](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L217)

프래그먼트 바인드 그룹 디스크립터 이름을 반환합니다.

##### Returns

`string`

바인드 그룹 디스크립터 이름

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#fragment_bind_group_descriptor_name)

***

***

### FRAGMENT\_SHADER\_MODULE\_NAME

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **FRAGMENT\_SHADER\_MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:205](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L205)

프래그먼트 셰이더 모듈 이름을 반환합니다.

##### Returns

`string`

프래그먼트 셰이더 모듈 이름

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`FRAGMENT_SHADER_MODULE_NAME`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#fragment_shader_module_name)

***

***

### globalFragmentSlotIndex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **globalFragmentSlotIndex**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:305](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L305)

글로벌 프래그먼트 SSBO 내 할당된 슬롯 인덱스를 반환합니다.

##### Returns

`number`

할당된 슬롯 인덱스 (미할당 시 `-1`)

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`globalFragmentSlotIndex`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#globalfragmentslotindex)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:89](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L89)

연관된 GPUDevice를 반환합니다.

##### Returns

`GPUDevice`

GPUDevice 인스턴스

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`gpuDevice`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#gpudevice)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

클래스별로 순차 부여되는 고유 인스턴스 번호를 반환합니다.

##### Returns

`number`

클래스별 고유 인스턴스 번호

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`instanceId`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#instanceid)

***

***

### MODULE\_NAME

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:193](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L193)

머티리얼 모듈 이름을 반환합니다.

##### Returns

`string`

모듈 이름

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`MODULE_NAME`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#module_name)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L63)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Returns

`string`

객체 이름 문자열

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`name`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`redGPUContext`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`resourceManager`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#resourcemanager)

***

***

### resourceManagerKey

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:77](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L77)

리소스 매니저 키를 반환합니다.

##### Returns

`string`

리소스 매니저 키 문자열

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`resourceManagerKey`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#resourcemanagerkey)

***

***

### revision

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **revision**(): `number`

Defined in: [src/resources/core/ResourceBase.ts:49](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L49)

리소스의 리비전(업데이트 횟수)을 반환합니다.

##### Returns

`number`

리소스 리비전 번호

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`revision`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#revision)

***

***

### SHADER\_INFO

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **SHADER\_INFO**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:241](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L241)

파싱된 WGSL 셰이더 전체 정보를 반환합니다.

##### Returns

`any`

파싱된 셰이더 정보 객체

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`SHADER_INFO`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#shader_info)

***

***

### STORAGE\_STRUCT

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **STORAGE\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:229](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L229)

파싱된 셰이더 스토리지 구조체 정보를 반환합니다.

##### Returns

`any`

스토리지 구조체 정보

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`STORAGE_STRUCT`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#storage_struct)

***

***

### textureOffset

#### Get Signature

> **get** **textureOffset**(): \[`number`, `number`\]

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:71](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/AUVTransformBaseMaterial.ts#L71)

텍스처 UV 오프셋 `[u, v]`를 반환하거나 설정합니다.

##### Returns

\[`number`, `number`\]

UV 오프셋 튜플 `[u, v]` (기본값: `[0, 0]`)

#### Set Signature

> **set** **textureOffset**(`value`): `void`

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:75](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/AUVTransformBaseMaterial.ts#L75)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | \[`number`, `number`\] |

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`textureOffset`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#textureoffset)

***

***

### textureScale

#### Get Signature

> **get** **textureScale**(): \[`number`, `number`\]

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:88](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/AUVTransformBaseMaterial.ts#L88)

텍스처 UV 타일링 스케일 `[u, v]`를 반환하거나 설정합니다.

##### Returns

\[`number`, `number`\]

UV 스케일 튜플 `[u, v]` (기본값: `[1, 1]`)

#### Set Signature

> **set** **textureScale**(`value`): `void`

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/AUVTransformBaseMaterial.ts#L92)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | \[`number`, `number`\] |

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`textureScale`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#texturescale)

***

***

### tintBlendMode

#### Get Signature

> **get** **tintBlendMode**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:160](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L160)

현재 설정된 틴트 블렌드 모드의 키 이름을 반환하거나 새로운 모드를 설정합니다.

##### Throws

유효하지 않은 틴트 블렌드 모드 값 또는 키가 지정된 경우 Error 발생

##### Returns

`string`

틴트 블렌드 모드 키 문자열 (예: `'MULTIPLY'`)

#### Set Signature

> **set** **tintBlendMode**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:168](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L168)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `"COLOR"` \| `"NORMAL"` \| `"SUBTRACT"` \| `"MULTIPLY"` \| `"LIGHTEN"` \| `"SCREEN"` \| `"LINEAR_DODGE"` \| `"DARKEN"` \| `"OVERLAY"` \| `"COLOR_DODGE"` \| `"COLOR_BURN"` \| `"HARD_LIGHT"` \| `"SOFT_LIGHT"` \| `"DIFFERENCE"` \| `"EXCLUSION"` \| `"DIVIDE"` \| `"VIVID_LIGHT"` \| `"LINEAR_BURN"` \| `"PIN_LIGHT"` \| `"SATURATION"` \| `"HUE"` \| `"LUMINOSITY"` \| `"NEGATION"` \| [`TINT_BLEND_MODE`](../type-aliases/TINT_BLEND_MODE.md) |

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`tintBlendMode`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#tintblendmode)

***

***

### UNIFORM\_STRUCT

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **UNIFORM\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:253](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L253)

파싱된 셰이더 유니폼 구조체 정보를 반환합니다.

##### Returns

`any`

유니폼 구조체 정보

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`UNIFORM_STRUCT`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#uniform_struct)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L48)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

객체의 UUID 문자열

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`uuid`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#uuid)

***

***

### writeMaskState

#### Get Signature

> **get** **writeMaskState**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:289](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L289)

컬러 쓰기 마스크(GPUColorWrite) 상태를 반환하거나 설정합니다.

##### Returns

`number`

GPUFlagsConstant 값

#### Set Signature

> **set** **writeMaskState**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:293](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L293)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`writeMaskState`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#writemaskstate)

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:102](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L102)

리소스 변경 시 호출될 파이프라인 더티 리스너를 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 등록할 리스너 함수 |

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`__addDirtyPipelineListener`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#__adddirtypipelinelistener)

***

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:115](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L115)

등록된 파이프라인 더티 리스너를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 제거할 리스너 함수 |

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`__removeDirtyPipelineListener`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#__removedirtypipelinelistener)

***

***

### \_updateBaseProperty()

> **\_updateBaseProperty**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:461](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L461)

머티리얼의 기본 속성(유니폼, 컬러, 틴트 등)을 유니폼 버퍼 및 글로벌 SSBO에 동기화합니다.

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`_updateBaseProperty`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#_updatebaseproperty)

***

***

### \_updateFragmentState()

> **\_updateFragmentState**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:357](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L357)

셰이더 바리안트를 점검하고 프래그먼트 바인드 그룹 및 렌더 상태를 갱신합니다.

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`_updateFragmentState`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#_updatefragmentstate)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:510](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L510)

머티리얼 인스턴스를 파기하고 할당된 유니폼 버퍼 및 글로벌 프래그먼트 슬롯을 해제합니다.

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`destroy`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#destroy)

***

***

### getFragmentRenderState()

> **getFragmentRenderState**(`entryPoint?`): `GPUFragmentState`

Defined in: [src/material/core/ABaseMaterial.ts:430](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L430)

GPU 프래그먼트 렌더 상태(GPUFragmentState) 객체를 생성하여 반환합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `entryPoint?` | `string` | `'main'` | 프래그먼트 셰이더 엔트리 포인트 함수 이름 (기본값: `'main'`) |

#### Returns

`GPUFragmentState`

구성된 GPUFragmentState 객체

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`getFragmentRenderState`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#getfragmentrenderstate)

***

***

### getGPUResourceSampler()

> **getGPUResourceSampler**(`sampler`): `GPUSampler`

Defined in: [src/material/core/ABaseMaterial.ts:502](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L502)

Sampler 인스턴스로부터 GPUSampler를 반환하며, 없을 경우 기본 GPUSampler를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sampler` | [`Sampler`](../../Resource/classes/Sampler.md) | Sampler 인스턴스 |

#### Returns

`GPUSampler`

GPUSampler 인스턴스

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`getGPUResourceSampler`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#getgpuresourcesampler)

***

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:313](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L313)

GPU 프래그먼트 렌더 파이프라인 정보와 유니폼 버퍼를 초기화합니다.

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`initGPURenderInfos`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#initgpurenderinfos)

***

***

### notifyUpdate()

> **notifyUpdate**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:131](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L131)

리소스가 업데이트되었음을 등록된 리스너들에게 알립니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList?` | `boolean` | `false` | 알림 실행 후 리스너 목록 초기화 여부 (기본값: false) |

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`notifyUpdate`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#notifyupdate)

***

***

### updateSampler()

> **updateSampler**(`prevSampler`, `newSampler`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABitmapBaseMaterial.ts#L80)

샘플러 변경에 따른 파이프라인 더티 리스너를 교체하고 프래그먼트 상태를 갱신합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prevSampler` | [`Sampler`](../../Resource/classes/Sampler.md) | 이전에 바인딩된 Sampler 인스턴스 |
| `newSampler` | [`Sampler`](../../Resource/classes/Sampler.md) | 새로 바인딩할 Sampler 인스턴스 |

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`updateSampler`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#updatesampler)

***

***

### updateTexture()

> **updateTexture**(`prevTexture`, `texture`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABitmapBaseMaterial.ts#L63)

텍스처 변경에 따른 파이프라인 더티 리스너를 교체하고 프래그먼트 상태를 갱신합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prevTexture` | `any` | 이전에 바인딩된 텍스처 객체 |
| `texture` | `any` | 새로 바인딩할 텍스처 객체 |

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`updateTexture`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#updatetexture)

</details>
