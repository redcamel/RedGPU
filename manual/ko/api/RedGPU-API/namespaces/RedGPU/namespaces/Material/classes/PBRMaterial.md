[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Material](../README.md) / PBRMaterial

# Class: PBRMaterial

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:171](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L171)

PBR(Physically Based Rendering) 머티리얼 클래스입니다.


ABitmapBaseMaterial을 상속받아 PBR 렌더링을 위한 머티리얼을 생성합니다.


## Extends

- [`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md)

## Constructors

### Constructor

> **new PBRMaterial**(`redGPUContext`): `PBRMaterial`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:695](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L695)

PBRMaterial 생성자


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext 인스턴스

#### Returns

`PBRMaterial`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`constructor`](../namespaces/Core/classes/ABitmapBaseMaterial.md#constructor)

## Properties

### \_\_packingList

> **\_\_packingList**: `any`[]

Defined in: [src/material/core/ABitmapBaseMaterial.ts:22](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABitmapBaseMaterial.ts#L22)

파이프라인 갱신 시 호출되는 콜백 리스트


#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`__packingList`](../namespaces/Core/classes/ABitmapBaseMaterial.md#__packinglist)

***

### alphaBlend

> **alphaBlend**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:191](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L191)

알파 블렌딩 모드


***

### baseColorFactor

> **baseColorFactor**: `number`[]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:212](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L212)

베이스 컬러 팩터


***

### baseColorTexture

> **baseColorTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:202](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L202)

베이스 컬러 텍스처


***

### baseColorTexture\_texCoord\_index

> **baseColorTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:217](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L217)

베이스 컬러 텍스처 UV 인덱스


***

### baseColorTextureSampler

> **baseColorTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:207](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L207)

베이스 컬러 텍스처 샘플러


***

### cutOff

> **cutOff**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:186](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L186)

알파 컷오프 값


***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:62](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L62)

파이프라인 dirty 상태 플래그


#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`dirtyPipeline`](../namespaces/Core/classes/ABitmapBaseMaterial.md#dirtypipeline)

***

### doubleSided

> **doubleSided**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:661](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L661)

양면 렌더링 여부


***

### emissiveFactor

> **emissiveFactor**: `number`[]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:601](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L601)

발광 팩터


***

### emissiveStrength

> **emissiveStrength**: `number`[]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:606](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L606)

발광 강도


***

### emissiveTexture

> **emissiveTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:586](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L586)

발광 텍스처


***

### emissiveTexture\_texCoord\_index

> **emissiveTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:596](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L596)

발광 텍스처 UV 인덱스


***

### emissiveTextureSampler

> **emissiveTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:591](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L591)

발광 텍스처 샘플러


***

### gpuRenderInfo

> **gpuRenderInfo**: [`FragmentGPURenderInfo`](../namespaces/Core/classes/FragmentGPURenderInfo.md)

Defined in: [src/material/core/ABaseMaterial.ts:57](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L57)

프래그먼트 GPU 렌더 정보 객체


#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`gpuRenderInfo`](../namespaces/Core/classes/ABitmapBaseMaterial.md#gpurenderinfo)

***

### KHR\_anisotropyRotation

> **KHR\_anisotropyRotation**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:299](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L299)

이방성 회전


***

### KHR\_anisotropyStrength

> **KHR\_anisotropyStrength**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:294](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L294)

이방성 강도


***

### KHR\_anisotropyTexture

> **KHR\_anisotropyTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:304](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L304)

이방성 텍스처


***

### KHR\_anisotropyTexture\_texCoord\_index

> **KHR\_anisotropyTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:314](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L314)

이방성 텍스처 UV 인덱스


***

### KHR\_anisotropyTextureSampler

> **KHR\_anisotropyTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:309](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L309)

이방성 텍스처 샘플러


***

### KHR\_attenuationColor

> **KHR\_attenuationColor**: `number`[]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:408](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L408)

감쇠 컬러


***

### KHR\_attenuationDistance

> **KHR\_attenuationDistance**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:403](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L403)

감쇠 거리


***

### KHR\_clearcoatFactor

> **KHR\_clearcoatFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:233](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L233)

클리어코트 팩터


***

### KHR\_clearcoatNormalScale

> **KHR\_clearcoatNormalScale**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:228](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L228)

클리어코트 노멀 스케일


***

### KHR\_clearcoatNormalTexture

> **KHR\_clearcoatNormalTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:248](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L248)

클리어코트 노멀 텍스처


***

### KHR\_clearcoatNormalTexture\_texCoord\_index

> **KHR\_clearcoatNormalTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:278](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L278)

클리어코트 노멀 텍스처 UV 인덱스


***

### KHR\_clearcoatNormalTextureSampler

> **KHR\_clearcoatNormalTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:263](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L263)

클리어코트 노멀 텍스처 샘플러


***

### KHR\_clearcoatRoughnessFactor

> **KHR\_clearcoatRoughnessFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:238](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L238)

클리어코트 거칠기 팩터


***

### KHR\_clearcoatRoughnessTexture

> **KHR\_clearcoatRoughnessTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:253](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L253)

클리어코트 거칠기 텍스처


***

### KHR\_clearcoatRoughnessTexture\_texCoord\_index

> **KHR\_clearcoatRoughnessTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:283](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L283)

클리어코트 거칠기 텍스처 UV 인덱스


***

### KHR\_clearcoatRoughnessTextureSampler

> **KHR\_clearcoatRoughnessTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:268](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L268)

클리어코트 거칠기 텍스처 샘플러


***

### KHR\_clearcoatTexture

> **KHR\_clearcoatTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:243](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L243)

클리어코트 텍스처


***

### KHR\_clearcoatTexture\_texCoord\_index

> **KHR\_clearcoatTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:273](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L273)

클리어코트 텍스처 UV 인덱스


***

### KHR\_clearcoatTextureSampler

> **KHR\_clearcoatTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:258](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L258)

클리어코트 텍스처 샘플러


***

### KHR\_diffuseTransmissionColorFactor

> **KHR\_diffuseTransmissionColorFactor**: \[`number`, `number`, `number`\]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:357](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L357)

확산 투과 컬러 팩터


***

### KHR\_diffuseTransmissionColorTexture

> **KHR\_diffuseTransmissionColorTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:377](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L377)

확산 투과 컬러 텍스처


***

### KHR\_diffuseTransmissionColorTexture\_texCoord\_index

> **KHR\_diffuseTransmissionColorTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:387](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L387)

확산 투과 컬러 텍스처 UV 인덱스


***

### KHR\_diffuseTransmissionColorTextureSampler

> **KHR\_diffuseTransmissionColorTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:382](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L382)

확산 투과 컬러 텍스처 샘플러


***

### KHR\_diffuseTransmissionFactor

> **KHR\_diffuseTransmissionFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:352](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L352)

확산 투과 팩터


***

### KHR\_diffuseTransmissionTexture

> **KHR\_diffuseTransmissionTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:362](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L362)

확산 투과 텍스처


***

### KHR\_diffuseTransmissionTexture\_texCoord\_index

> **KHR\_diffuseTransmissionTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:372](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L372)

확산 투과 텍스처 UV 인덱스


***

### KHR\_diffuseTransmissionTextureSampler

> **KHR\_diffuseTransmissionTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:367](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L367)

확산 투과 텍스처 샘플러


***

### KHR\_dispersion

> **KHR\_dispersion**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:668](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L668)

KHR_dispersion 확장 사용 여부


***

### KHR\_iridescenceFactor

> **KHR\_iridescenceFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:507](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L507)

무지개빛 팩터


***

### KHR\_iridescenceIor

> **KHR\_iridescenceIor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:512](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L512)

무지개빛 IOR


***

### KHR\_iridescenceTexture

> **KHR\_iridescenceTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:527](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L527)

무지개빛 텍스처


***

### KHR\_iridescenceTextureSampler

> **KHR\_iridescenceTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:532](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L532)

무지개빛 텍스처 샘플러


***

### KHR\_iridescenceThicknessMaximum

> **KHR\_iridescenceThicknessMaximum**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:522](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L522)

무지개빛 최대 두께


***

### KHR\_iridescenceThicknessMinimum

> **KHR\_iridescenceThicknessMinimum**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:517](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L517)

무지개빛 최소 두께


***

### KHR\_iridescenceThicknessTexture

> **KHR\_iridescenceThicknessTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:537](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L537)

무지개빛 두께 텍스처


***

### KHR\_iridescenceThicknessTextureSampler

> **KHR\_iridescenceThicknessTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:542](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L542)

무지개빛 두께 텍스처 샘플러


***

### KHR\_materials\_ior

> **KHR\_materials\_ior**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:554](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L554)

KHR_materials_ior 확장 IOR 값


***

### KHR\_sheenColorFactor

> **KHR\_sheenColorFactor**: \[`number`, `number`, `number`\]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:434](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L434)

광택 컬러 팩터


***

### KHR\_sheenColorTexture

> **KHR\_sheenColorTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:444](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L444)

광택 컬러 텍스처


***

### KHR\_sheenColorTextureSampler

> **KHR\_sheenColorTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:449](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L449)

광택 컬러 텍스처 샘플러


***

### KHR\_sheenRoughnessFactor

> **KHR\_sheenRoughnessFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:439](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L439)

광택 거칠기 팩터


***

### KHR\_sheenRoughnessTexture

> **KHR\_sheenRoughnessTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:454](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L454)

광택 거칠기 텍스처


***

### KHR\_sheenRoughnessTextureSampler

> **KHR\_sheenRoughnessTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:459](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L459)

광택 거칠기 텍스처 샘플러


***

### KHR\_specularColorFactor

> **KHR\_specularColorFactor**: \[`number`, `number`, `number`\]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:475](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L475)

스펙큘러 컬러 팩터


***

### KHR\_specularColorTexture

> **KHR\_specularColorTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:490](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L490)

스펙큘러 컬러 텍스처


***

### KHR\_specularColorTextureSampler

> **KHR\_specularColorTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:495](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L495)

스펙큘러 컬러 텍스처 샘플러


***

### KHR\_specularFactor

> **KHR\_specularFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:470](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L470)

스펙큘러 팩터


***

### KHR\_specularTexture

> **KHR\_specularTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:480](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L480)

스펙큘러 텍스처


***

### KHR\_specularTextureSampler

> **KHR\_specularTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:485](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L485)

스펙큘러 텍스처 샘플러


***

### KHR\_thicknessFactor

> **KHR\_thicknessFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:398](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L398)

두께 팩터


***

### KHR\_thicknessTexture

> **KHR\_thicknessTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:413](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L413)

두께 텍스처


***

### KHR\_thicknessTexture\_texCoord\_index

> **KHR\_thicknessTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:423](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L423)

두께 텍스처 UV 인덱스


***

### KHR\_thicknessTextureSampler

> **KHR\_thicknessTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:418](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L418)

두께 텍스처 샘플러


***

### KHR\_transmissionFactor

> **KHR\_transmissionFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:326](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L326)

투과 팩터


***

### KHR\_transmissionTexture

> **KHR\_transmissionTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:331](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L331)

투과 텍스처


***

### KHR\_transmissionTexture\_texCoord\_index

> **KHR\_transmissionTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:341](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L341)

투과 텍스처 UV 인덱스


***

### KHR\_transmissionTextureSampler

> **KHR\_transmissionTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:336](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L336)

투과 텍스처 샘플러


***

### metallicFactor

> **metallicFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:648](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L648)

금속성 팩터


***

### metallicRoughnessTexture

> **metallicRoughnessTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:633](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L633)

금속성-거칠기 텍스처


***

### metallicRoughnessTexture\_texCoord\_index

> **metallicRoughnessTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:643](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L643)

금속성-거칠기 텍스처 UV 인덱스


***

### metallicRoughnessTextureSampler

> **metallicRoughnessTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:638](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L638)

금속성-거칠기 텍스처 샘플러


***

### normalScale

> **normalScale**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:560](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L560)

노멀 스케일


***

### normalTexture

> **normalTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:570](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L570)

노멀 텍스처


***

### normalTexture\_texCoord\_index

> **normalTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:580](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L580)

노멀 텍스처 UV 인덱스


***

### normalTextureSampler

> **normalTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:575](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L575)

노멀 텍스처 샘플러


***

### occlusionStrength

> **occlusionStrength**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:627](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L627)

오클루전 강도


***

### occlusionTexture

> **occlusionTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:612](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L612)

오클루전 텍스처


***

### occlusionTexture\_texCoord\_index

> **occlusionTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:622](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L622)

오클루전 텍스처 UV 인덱스


***

### occlusionTextureSampler

> **occlusionTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:617](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L617)

오클루전 텍스처 샘플러


***

### opacity

> **opacity**: `number`

Defined in: [src/material/core/ABaseMaterial.ts:23](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L23)

머티리얼의 불투명도(0~1)


#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`opacity`](../namespaces/Core/classes/ABitmapBaseMaterial.md#opacity)

***

### roughnessFactor

> **roughnessFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:653](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L653)

거칠기 팩터


***

### tint

> **tint**: [`ColorRGBA`](../../Color/classes/ColorRGBA.md)

Defined in: [src/material/core/ABaseMaterial.ts:28](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L28)

머티리얼의 틴트 컬러(RGBA)


#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`tint`](../namespaces/Core/classes/ABitmapBaseMaterial.md#tint)

***

### transparent

> **transparent**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:67](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L67)

머티리얼 투명도 여부


#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`transparent`](../namespaces/Core/classes/ABitmapBaseMaterial.md#transparent)

***

### use2PathRender

> **use2PathRender**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:196](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L196)

2패스 렌더링 사용 여부


#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`use2PathRender`](../namespaces/Core/classes/ABitmapBaseMaterial.md#use2pathrender)

***

### useCutOff

> **useCutOff**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:181](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L181)

알파 컷오프 사용 여부


***

### useKHR\_materials\_anisotropy

> **useKHR\_materials\_anisotropy**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:289](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L289)

KHR_materials_anisotropy 확장 사용 여부


***

### useKHR\_materials\_clearcoat

> **useKHR\_materials\_clearcoat**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:223](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L223)

KHR_materials_clearcoat 확장 사용 여부


***

### useKHR\_materials\_diffuse\_transmission

> **useKHR\_materials\_diffuse\_transmission**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:347](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L347)

KHR_materials_diffuse_transmission 확장 사용 여부


***

### useKHR\_materials\_iridescence

> **useKHR\_materials\_iridescence**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:502](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L502)

KHR_materials_iridescence 확장 사용 여부


***

### useKHR\_materials\_sheen

> **useKHR\_materials\_sheen**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:429](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L429)

KHR_materials_sheen 확장 사용 여부


***

### useKHR\_materials\_specular

> **useKHR\_materials\_specular**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:465](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L465)

KHR_materials_specular 확장 사용 여부


***

### useKHR\_materials\_transmission

> **useKHR\_materials\_transmission**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:321](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L321)

KHR_materials_transmission 확장 사용 여부


***

### useKHR\_materials\_unlit

> **useKHR\_materials\_unlit**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:548](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L548)

KHR_materials_unlit 확장 사용 여부


***

### useKHR\_materials\_volume

> **useKHR\_materials\_volume**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:393](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L393)

KHR_materials_volume 확장 사용 여부


***

### useNormalTexture

> **useNormalTexture**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:565](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L565)

노멀 텍스처 사용 여부


***

### useTint

> **useTint**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:33](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L33)

틴트 컬러 사용 여부


#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`useTint`](../namespaces/Core/classes/ABitmapBaseMaterial.md#usetint)

***

### useVertexColor

> **useVertexColor**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:176](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L176)

버텍스 컬러 사용 여부


## Accessors

### blendAlphaState

#### Get Signature

> **get** **blendAlphaState**(): [`BlendState`](../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:289](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L289)

머티리얼의 알파 블렌드 상태 객체 반환


##### Returns

[`BlendState`](../../RenderState/classes/BlendState.md)

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`blendAlphaState`](../namespaces/Core/classes/ABitmapBaseMaterial.md#blendalphastate)

***

### blendColorState

#### Get Signature

> **get** **blendColorState**(): [`BlendState`](../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:281](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L281)

머티리얼의 컬러 블렌드 상태 객체 반환


##### Returns

[`BlendState`](../../RenderState/classes/BlendState.md)

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`blendColorState`](../namespaces/Core/classes/ABitmapBaseMaterial.md#blendcolorstate)

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:57](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L57)

캐시 키를 반환합니다.


##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L65)

캐시 키를 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`cacheKey`](../namespaces/Core/classes/ABitmapBaseMaterial.md#cachekey)

***

### FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME

#### Get Signature

> **get** **FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:257](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L257)

프래그먼트 바인드 그룹 디스크립터명을 반환합니다.


##### Returns

`string`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME`](../namespaces/Core/classes/ABitmapBaseMaterial.md#fragment_bind_group_descriptor_name)

***

### FRAGMENT\_SHADER\_MODULE\_NAME

#### Get Signature

> **get** **FRAGMENT\_SHADER\_MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:249](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L249)

프래그먼트 셰이더 모듈명을 반환합니다.


##### Returns

`string`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`FRAGMENT_SHADER_MODULE_NAME`](../namespaces/Core/classes/ABitmapBaseMaterial.md#fragment_shader_module_name)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:106](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L106)

연관된 GPU 디바이스를 반환합니다.


##### Returns

`GPUDevice`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`gpuDevice`](../namespaces/Core/classes/ABitmapBaseMaterial.md#gpudevice)

***

### MODULE\_NAME

#### Get Signature

> **get** **MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:241](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L241)

머티리얼 모듈명을 반환합니다.


##### Returns

`string`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`MODULE_NAME`](../namespaces/Core/classes/ABitmapBaseMaterial.md#module_name)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:81](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L81)

인스턴스의 이름을 반환합니다. 이름이 없으면 클래스명과 ID로 생성합니다.


##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:90](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L90)

인스턴스의 이름을 설정합니다.


##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`name`](../namespaces/Core/classes/ABitmapBaseMaterial.md#name)

***

### packedKHR\_clearcoatTexture\_transmission

#### Get Signature

> **get** **packedKHR\_clearcoatTexture\_transmission**(): [`PackedTexture`](../../Resource/classes/PackedTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:723](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L723)

Clearcoat 및 Transmission 패킹 텍스처 반환


##### Returns

[`PackedTexture`](../../Resource/classes/PackedTexture.md)

***

### packedKHR\_diffuse\_transmission

#### Get Signature

> **get** **packedKHR\_diffuse\_transmission**(): [`PackedTexture`](../../Resource/classes/PackedTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:758](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L758)

Diffuse Transmission 패킹 텍스처 반환


##### Returns

[`PackedTexture`](../../Resource/classes/PackedTexture.md)

***

### packedKHR\_iridescence

#### Get Signature

> **get** **packedKHR\_iridescence**(): [`PackedTexture`](../../Resource/classes/PackedTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:731](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L731)

Iridescence 패킹 텍스처 반환


##### Returns

[`PackedTexture`](../../Resource/classes/PackedTexture.md)

***

### packedKHR\_sheen

#### Get Signature

> **get** **packedKHR\_sheen**(): [`PackedTexture`](../../Resource/classes/PackedTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:747](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L747)

Sheen 패킹 텍스처 반환


##### Returns

[`PackedTexture`](../../Resource/classes/PackedTexture.md)

***

### packedORMTexture

#### Get Signature

> **get** **packedORMTexture**(): [`PackedTexture`](../../Resource/classes/PackedTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:739](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L739)

ORM(Occlusion, Roughness, Metallic) 패킹 텍스처 반환


##### Returns

[`PackedTexture`](../../Resource/classes/PackedTexture.md)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/resources/core/ResourceBase.ts:114](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L114)

RedGPUContext 인스턴스를 반환합니다.


##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`redGPUContext`](../namespaces/Core/classes/ABitmapBaseMaterial.md#redgpucontext)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:73](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L73)

리소스 매니저 키를 반환합니다.


##### Returns

`string`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`resourceManagerKey`](../namespaces/Core/classes/ABitmapBaseMaterial.md#resourcemanagerkey)

***

### STORAGE\_STRUCT

#### Get Signature

> **get** **STORAGE\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:265](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L265)

셰이더 storage 구조 정보를 반환합니다.


##### Returns

`any`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`STORAGE_STRUCT`](../namespaces/Core/classes/ABitmapBaseMaterial.md#storage_struct)

***

### tintBlendMode

#### Get Signature

> **get** **tintBlendMode**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:205](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L205)

틴트 블렌드 모드 이름을 반환합니다.


##### Returns

`string`

틴트 블렌드 모드 이름


#### Set Signature

> **set** **tintBlendMode**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:220](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L220)

틴트 블렌드 모드를 설정합니다.


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `"SUBTRACT"` \| `"NORMAL"` \| `"MULTIPLY"` \| `"LIGHTEN"` \| `"SCREEN"` \| `"LINEAR_DODGE"` \| `"DARKEN"` \| `"OVERLAY"` \| `"COLOR_DODGE"` \| `"COLOR_BURN"` \| `"HARD_LIGHT"` \| `"SOFT_LIGHT"` \| `"DIFFERENCE"` \| `"EXCLUSION"` \| `"DIVIDE"` \| `"VIVID_LIGHT"` \| `"LINEAR_BURN"` \| `"PIN_LIGHT"` \| `"SATURATION"` \| `"HUE"` \| `"LUMINOSITY"` \| `"COLOR"` \| `"NEGATION"` \| [`TINT_BLEND_MODE`](../type-aliases/TINT_BLEND_MODE.md) | 틴트 블렌드 모드 값 또는 키

##### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`tintBlendMode`](../namespaces/Core/classes/ABitmapBaseMaterial.md#tintblendmode)

***

### UNIFORM\_STRUCT

#### Get Signature

> **get** **UNIFORM\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:273](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L273)

셰이더 uniforms 구조 정보를 반환합니다.


##### Returns

`any`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`UNIFORM_STRUCT`](../namespaces/Core/classes/ABitmapBaseMaterial.md#uniform_struct)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:98](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L98)

고유 식별자(UUID)를 반환합니다.


##### Returns

`string`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`uuid`](../namespaces/Core/classes/ABitmapBaseMaterial.md#uuid)

***

### writeMaskState

#### Get Signature

> **get** **writeMaskState**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:297](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L297)

머티리얼의 writeMask 상태 반환


##### Returns

`number`

#### Set Signature

> **set** **writeMaskState**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:308](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L308)

머티리얼의 writeMask 상태 설정


##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | GPUFlagsConstant 값

##### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`writeMaskState`](../namespaces/Core/classes/ABitmapBaseMaterial.md#writemaskstate)

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:125](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L125)

파이프라인이 더티해질 때 호출될 리스너를 추가합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 리스너 함수

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`__addDirtyPipelineListener`](../namespaces/Core/classes/ABitmapBaseMaterial.md#__adddirtypipelinelistener)

***

### \_\_fireListenerList()

> **\_\_fireListenerList**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:152](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L152)

등록된 더티 리스너들을 실행합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | 실행 후 리스너 목록 초기화 여부 (기본값: false)

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`__fireListenerList`](../namespaces/Core/classes/ABitmapBaseMaterial.md#__firelistenerlist)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:137](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L137)

더티 파이프라인 리스너를 제거합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 제거할 리스너 함수

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`__removeDirtyPipelineListener`](../namespaces/Core/classes/ABitmapBaseMaterial.md#__removedirtypipelinelistener)

***

### \_updateBaseProperty()

> `protected` **\_updateBaseProperty**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:463](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L463)

머티리얼의 유니폼/컬러/틴트 등 기본 속성값을 유니폼 버퍼에 반영합니다.


#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`_updateBaseProperty`](../namespaces/Core/classes/ABitmapBaseMaterial.md#_updatebaseproperty)

***

### \_updateFragmentState()

> `protected` **\_updateFragmentState**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:351](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L351)

프래그먼트 셰이더 바인드 그룹/유니폼/텍스처/샘플러 등의 상태를 갱신합니다.


#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`_updateFragmentState`](../namespaces/Core/classes/ABitmapBaseMaterial.md#_updatefragmentstate)

***

### getFragmentRenderState()

> **getFragmentRenderState**(`entryPoint?`): `GPUFragmentState`

Defined in: [src/material/core/ABaseMaterial.ts:431](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L431)

GPU 프래그먼트 렌더 상태 객체를 반환합니다.


#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `entryPoint` | `string` | `'main'` | 셰이더 엔트리포인트 (기본값: 'main')

#### Returns

`GPUFragmentState`

GPU 프래그먼트 상태


#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`getFragmentRenderState`](../namespaces/Core/classes/ABitmapBaseMaterial.md#getfragmentrenderstate)

***

### getGPUResourceSampler()

> **getGPUResourceSampler**(`sampler`): `GPUSampler`

Defined in: [src/material/core/ABaseMaterial.ts:488](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L488)

샘플러 객체에서 GPU 샘플러를 반환합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sampler` | [`Sampler`](../../Resource/classes/Sampler.md) | Sampler 객체

#### Returns

`GPUSampler`

GPUSampler 인스턴스


#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`getGPUResourceSampler`](../namespaces/Core/classes/ABitmapBaseMaterial.md#getgpuresourcesampler)

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:316](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L316)

GPU 렌더 파이프라인 정보 및 유니폼 버퍼를 초기화합니다.


#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`initGPURenderInfos`](../namespaces/Core/classes/ABitmapBaseMaterial.md#initgpurenderinfos)

***

### setupPackedKHR\_clearcoatTexture\_transmission()

> **setupPackedKHR\_clearcoatTexture\_transmission**(): `Promise`\<`void`\>

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:800](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L800)

Clearcoat 및 Transmission 텍스처 패킹 설정


#### Returns

`Promise`\<`void`\>

***

### setupPackedKHR\_diffuse\_transmission()

> **setupPackedKHR\_diffuse\_transmission**(): `Promise`\<`void`\>

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:887](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L887)

Diffuse Transmission 텍스처 패킹 설정


#### Returns

`Promise`\<`void`\>

***

### setupPackedKHR\_iridescence()

> **setupPackedKHR\_iridescence**(): `Promise`\<`void`\>

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:951](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L951)

Iridescence 텍스처 패킹 설정


#### Returns

`Promise`\<`void`\>

***

### setupPackedKHR\_sheen()

> **setupPackedKHR\_sheen**(): `Promise`\<`void`\>

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:919](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L919)

Sheen 텍스처 패킹 설정


#### Returns

`Promise`\<`void`\>

***

### setupPackORMTexture()

> **setupPackORMTexture**(): `Promise`\<`void`\>

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:769](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L769)

ORM(Occlusion, Roughness, Metallic) 텍스처 패킹 설정


#### Returns

`Promise`\<`void`\>

***

### updateSampler()

> **updateSampler**(`prevSampler`, `newSampler`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:75](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABitmapBaseMaterial.ts#L75)

샘플러 객체 변경 및 DirtyPipeline 리스너를 관리합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prevSampler` | [`Sampler`](../../Resource/classes/Sampler.md) | 이전 샘플러
| `newSampler` | [`Sampler`](../../Resource/classes/Sampler.md) | 새 샘플러

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`updateSampler`](../namespaces/Core/classes/ABitmapBaseMaterial.md#updatesampler)

***

### updateTexture()

> **updateTexture**(`prevTexture`, `texture`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:59](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABitmapBaseMaterial.ts#L59)

텍스처 객체 변경 및 DirtyPipeline 리스너를 관리합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prevTexture` | [`ANoiseTexture`](../../Resource/namespaces/CoreNoiseTexture/classes/ANoiseTexture.md) \| [`BitmapTexture`](../../Resource/classes/BitmapTexture.md) \| [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`HDRTexture`](../../Resource/classes/HDRTexture.md) | 이전 텍스처 (BitmapTexture | CubeTexture | ANoiseTexture | HDRTexture)
| `texture` | [`ANoiseTexture`](../../Resource/namespaces/CoreNoiseTexture/classes/ANoiseTexture.md) \| [`BitmapTexture`](../../Resource/classes/BitmapTexture.md) \| [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`HDRTexture`](../../Resource/classes/HDRTexture.md) | 새 텍스처 (BitmapTexture | CubeTexture | ANoiseTexture | HDRTexture)

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`updateTexture`](../namespaces/Core/classes/ABitmapBaseMaterial.md#updatetexture)
