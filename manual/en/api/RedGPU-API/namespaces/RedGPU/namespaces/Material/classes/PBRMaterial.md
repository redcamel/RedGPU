[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Material](../README.md) / PBRMaterial

# Class: PBRMaterial

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:171](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L171)


PBR (Physically Based Rendering) material class.


Inherits from ABitmapBaseMaterial to create a material for PBR rendering.

## Extends

- [`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md)

## Constructors

### Constructor

> **new PBRMaterial**(`redGPUContext`): `PBRMaterial`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:695](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L695)


PBRMaterial constructor

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`PBRMaterial`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`constructor`](../namespaces/Core/classes/ABitmapBaseMaterial.md#constructor)

## Properties

### \_\_packingList

> **\_\_packingList**: `any`[]

Defined in: [src/material/core/ABitmapBaseMaterial.ts:22](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABitmapBaseMaterial.ts#L22)


List of callbacks called when updating the pipeline

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`__packingList`](../namespaces/Core/classes/ABitmapBaseMaterial.md#__packinglist)

***

### alphaBlend

> **alphaBlend**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:191](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L191)


Alpha blending mode

***

### baseColorFactor

> **baseColorFactor**: `number`[]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:212](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L212)


Base color factor

***

### baseColorTexture

> **baseColorTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:202](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L202)


Base color texture

***

### baseColorTexture\_texCoord\_index

> **baseColorTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:217](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L217)


Base color texture UV index

***

### baseColorTextureSampler

> **baseColorTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:207](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L207)


Base color texture sampler

***

### cutOff

> **cutOff**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:186](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L186)


Alpha cutoff value

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:62](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L62)


Pipeline dirty status flag

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`dirtyPipeline`](../namespaces/Core/classes/ABitmapBaseMaterial.md#dirtypipeline)

***

### doubleSided

> **doubleSided**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:661](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L661)


Whether it is double-sided

***

### emissiveFactor

> **emissiveFactor**: `number`[]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:601](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L601)


Emissive factor

***

### emissiveStrength

> **emissiveStrength**: `number`[]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:606](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L606)


Emissive strength

***

### emissiveTexture

> **emissiveTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:586](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L586)


Emissive texture

***

### emissiveTexture\_texCoord\_index

> **emissiveTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:596](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L596)


Emissive texture UV index

***

### emissiveTextureSampler

> **emissiveTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:591](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L591)


Emissive texture sampler

***

### gpuRenderInfo

> **gpuRenderInfo**: [`FragmentGPURenderInfo`](../namespaces/Core/classes/FragmentGPURenderInfo.md)

Defined in: [src/material/core/ABaseMaterial.ts:57](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L57)


Fragment GPU render info object

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`gpuRenderInfo`](../namespaces/Core/classes/ABitmapBaseMaterial.md#gpurenderinfo)

***

### KHR\_anisotropyRotation

> **KHR\_anisotropyRotation**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:299](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L299)


Anisotropy rotation

***

### KHR\_anisotropyStrength

> **KHR\_anisotropyStrength**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:294](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L294)


Anisotropy strength

***

### KHR\_anisotropyTexture

> **KHR\_anisotropyTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:304](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L304)


Anisotropy texture

***

### KHR\_anisotropyTexture\_texCoord\_index

> **KHR\_anisotropyTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:314](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L314)


Anisotropy texture UV index

***

### KHR\_anisotropyTextureSampler

> **KHR\_anisotropyTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:309](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L309)


Anisotropy texture sampler

***

### KHR\_attenuationColor

> **KHR\_attenuationColor**: `number`[]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:408](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L408)


Attenuation color

***

### KHR\_attenuationDistance

> **KHR\_attenuationDistance**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:403](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L403)


Attenuation distance

***

### KHR\_clearcoatFactor

> **KHR\_clearcoatFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:233](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L233)


Clearcoat factor

***

### KHR\_clearcoatNormalScale

> **KHR\_clearcoatNormalScale**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:228](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L228)


Clearcoat normal scale

***

### KHR\_clearcoatNormalTexture

> **KHR\_clearcoatNormalTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:248](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L248)


Clearcoat normal texture

***

### KHR\_clearcoatNormalTexture\_texCoord\_index

> **KHR\_clearcoatNormalTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:278](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L278)


Clearcoat normal texture UV index

***

### KHR\_clearcoatNormalTextureSampler

> **KHR\_clearcoatNormalTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:263](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L263)


Clearcoat normal texture sampler

***

### KHR\_clearcoatRoughnessFactor

> **KHR\_clearcoatRoughnessFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:238](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L238)


Clearcoat roughness factor

***

### KHR\_clearcoatRoughnessTexture

> **KHR\_clearcoatRoughnessTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:253](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L253)


Clearcoat roughness texture

***

### KHR\_clearcoatRoughnessTexture\_texCoord\_index

> **KHR\_clearcoatRoughnessTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:283](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L283)


Clearcoat roughness texture UV index

***

### KHR\_clearcoatRoughnessTextureSampler

> **KHR\_clearcoatRoughnessTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:268](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L268)


Clearcoat roughness texture sampler

***

### KHR\_clearcoatTexture

> **KHR\_clearcoatTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:243](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L243)


Clearcoat texture

***

### KHR\_clearcoatTexture\_texCoord\_index

> **KHR\_clearcoatTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:273](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L273)


Clearcoat texture UV index

***

### KHR\_clearcoatTextureSampler

> **KHR\_clearcoatTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:258](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L258)


Clearcoat texture sampler

***

### KHR\_diffuseTransmissionColorFactor

> **KHR\_diffuseTransmissionColorFactor**: \[`number`, `number`, `number`\]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:357](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L357)


Diffuse transmission color factor

***

### KHR\_diffuseTransmissionColorTexture

> **KHR\_diffuseTransmissionColorTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:377](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L377)


Diffuse transmission color texture

***

### KHR\_diffuseTransmissionColorTexture\_texCoord\_index

> **KHR\_diffuseTransmissionColorTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:387](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L387)


Diffuse transmission color texture UV index

***

### KHR\_diffuseTransmissionColorTextureSampler

> **KHR\_diffuseTransmissionColorTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:382](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L382)


Diffuse transmission color texture sampler

***

### KHR\_diffuseTransmissionFactor

> **KHR\_diffuseTransmissionFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:352](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L352)


Diffuse transmission factor

***

### KHR\_diffuseTransmissionTexture

> **KHR\_diffuseTransmissionTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:362](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L362)


Diffuse transmission texture

***

### KHR\_diffuseTransmissionTexture\_texCoord\_index

> **KHR\_diffuseTransmissionTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:372](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L372)


Diffuse transmission texture UV index

***

### KHR\_diffuseTransmissionTextureSampler

> **KHR\_diffuseTransmissionTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:367](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L367)


Diffuse transmission texture sampler

***

### KHR\_dispersion

> **KHR\_dispersion**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:668](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L668)


Whether to use KHR_dispersion extension

***

### KHR\_iridescenceFactor

> **KHR\_iridescenceFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:507](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L507)


Iridescence factor

***

### KHR\_iridescenceIor

> **KHR\_iridescenceIor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:512](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L512)


Iridescence IOR

***

### KHR\_iridescenceTexture

> **KHR\_iridescenceTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:527](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L527)


Iridescence texture

***

### KHR\_iridescenceTextureSampler

> **KHR\_iridescenceTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:532](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L532)


Iridescence texture sampler

***

### KHR\_iridescenceThicknessMaximum

> **KHR\_iridescenceThicknessMaximum**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:522](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L522)


Iridescence thickness maximum

***

### KHR\_iridescenceThicknessMinimum

> **KHR\_iridescenceThicknessMinimum**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:517](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L517)


Iridescence thickness minimum

***

### KHR\_iridescenceThicknessTexture

> **KHR\_iridescenceThicknessTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:537](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L537)


Iridescence thickness texture

***

### KHR\_iridescenceThicknessTextureSampler

> **KHR\_iridescenceThicknessTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:542](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L542)


Iridescence thickness texture sampler

***

### KHR\_materials\_ior

> **KHR\_materials\_ior**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:554](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L554)


KHR_materials_ior extension IOR value

***

### KHR\_sheenColorFactor

> **KHR\_sheenColorFactor**: \[`number`, `number`, `number`\]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:434](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L434)


Sheen color factor

***

### KHR\_sheenColorTexture

> **KHR\_sheenColorTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:444](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L444)


Sheen color texture

***

### KHR\_sheenColorTextureSampler

> **KHR\_sheenColorTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:449](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L449)


Sheen color texture sampler

***

### KHR\_sheenRoughnessFactor

> **KHR\_sheenRoughnessFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:439](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L439)


Sheen roughness factor

***

### KHR\_sheenRoughnessTexture

> **KHR\_sheenRoughnessTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:454](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L454)


Sheen roughness texture

***

### KHR\_sheenRoughnessTextureSampler

> **KHR\_sheenRoughnessTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:459](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L459)


Sheen roughness texture sampler

***

### KHR\_specularColorFactor

> **KHR\_specularColorFactor**: \[`number`, `number`, `number`\]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:475](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L475)


Specular color factor

***

### KHR\_specularColorTexture

> **KHR\_specularColorTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:490](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L490)


Specular color texture

***

### KHR\_specularColorTextureSampler

> **KHR\_specularColorTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:495](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L495)


Specular color texture sampler

***

### KHR\_specularFactor

> **KHR\_specularFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:470](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L470)


Specular factor

***

### KHR\_specularTexture

> **KHR\_specularTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:480](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L480)


Specular texture

***

### KHR\_specularTextureSampler

> **KHR\_specularTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:485](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L485)


Specular texture sampler

***

### KHR\_thicknessFactor

> **KHR\_thicknessFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:398](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L398)


Thickness factor

***

### KHR\_thicknessTexture

> **KHR\_thicknessTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:413](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L413)


Thickness texture

***

### KHR\_thicknessTexture\_texCoord\_index

> **KHR\_thicknessTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:423](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L423)


Thickness texture UV index

***

### KHR\_thicknessTextureSampler

> **KHR\_thicknessTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:418](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L418)


Thickness texture sampler

***

### KHR\_transmissionFactor

> **KHR\_transmissionFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:326](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L326)


Transmission factor

***

### KHR\_transmissionTexture

> **KHR\_transmissionTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:331](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L331)


Transmission texture

***

### KHR\_transmissionTexture\_texCoord\_index

> **KHR\_transmissionTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:341](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L341)


Transmission texture UV index

***

### KHR\_transmissionTextureSampler

> **KHR\_transmissionTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:336](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L336)


Transmission texture sampler

***

### metallicFactor

> **metallicFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:648](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L648)


Metallic factor

***

### metallicRoughnessTexture

> **metallicRoughnessTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:633](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L633)


Metallic-Roughness texture

***

### metallicRoughnessTexture\_texCoord\_index

> **metallicRoughnessTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:643](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L643)


Metallic-Roughness texture UV index

***

### metallicRoughnessTextureSampler

> **metallicRoughnessTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:638](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L638)


Metallic-Roughness texture sampler

***

### normalScale

> **normalScale**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:560](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L560)


Normal scale

***

### normalTexture

> **normalTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:570](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L570)


Normal texture

***

### normalTexture\_texCoord\_index

> **normalTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:580](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L580)


Normal texture UV index

***

### normalTextureSampler

> **normalTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:575](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L575)


Normal texture sampler

***

### occlusionStrength

> **occlusionStrength**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:627](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L627)


Occlusion strength

***

### occlusionTexture

> **occlusionTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:612](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L612)


Occlusion texture

***

### occlusionTexture\_texCoord\_index

> **occlusionTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:622](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L622)


Occlusion texture UV index

***

### occlusionTextureSampler

> **occlusionTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:617](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L617)


Occlusion texture sampler

***

### opacity

> **opacity**: `number`

Defined in: [src/material/core/ABaseMaterial.ts:23](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L23)


Material opacity (0~1)

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`opacity`](../namespaces/Core/classes/ABitmapBaseMaterial.md#opacity)

***

### roughnessFactor

> **roughnessFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:653](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L653)


Roughness factor

***

### tint

> **tint**: [`ColorRGBA`](../../Color/classes/ColorRGBA.md)

Defined in: [src/material/core/ABaseMaterial.ts:28](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L28)


Material tint color (RGBA)

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`tint`](../namespaces/Core/classes/ABitmapBaseMaterial.md#tint)

***

### transparent

> **transparent**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:67](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L67)


Whether the material is transparent

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`transparent`](../namespaces/Core/classes/ABitmapBaseMaterial.md#transparent)

***

### use2PathRender

> **use2PathRender**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:196](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L196)


Whether to use 2-pass rendering

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`use2PathRender`](../namespaces/Core/classes/ABitmapBaseMaterial.md#use2pathrender)

***

### useCutOff

> **useCutOff**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:181](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L181)


Whether to use alpha cutoff

***

### useKHR\_materials\_anisotropy

> **useKHR\_materials\_anisotropy**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:289](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L289)


Whether to use KHR_materials_anisotropy extension

***

### useKHR\_materials\_clearcoat

> **useKHR\_materials\_clearcoat**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:223](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L223)


Whether to use KHR_materials_clearcoat extension

***

### useKHR\_materials\_diffuse\_transmission

> **useKHR\_materials\_diffuse\_transmission**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:347](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L347)


Whether to use KHR_materials_diffuse_transmission extension

***

### useKHR\_materials\_iridescence

> **useKHR\_materials\_iridescence**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:502](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L502)


Whether to use KHR_materials_iridescence extension

***

### useKHR\_materials\_sheen

> **useKHR\_materials\_sheen**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:429](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L429)


Whether to use KHR_materials_sheen extension

***

### useKHR\_materials\_specular

> **useKHR\_materials\_specular**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:465](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L465)


Whether to use KHR_materials_specular extension

***

### useKHR\_materials\_transmission

> **useKHR\_materials\_transmission**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:321](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L321)


Whether to use KHR_materials_transmission extension

***

### useKHR\_materials\_unlit

> **useKHR\_materials\_unlit**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:548](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L548)


Whether to use KHR_materials_unlit extension

***

### useKHR\_materials\_volume

> **useKHR\_materials\_volume**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:393](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L393)


Whether to use KHR_materials_volume extension

***

### useNormalTexture

> **useNormalTexture**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:565](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L565)


Whether to use normal texture

***

### useTint

> **useTint**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:33](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L33)


Whether to use tint color

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`useTint`](../namespaces/Core/classes/ABitmapBaseMaterial.md#usetint)

***

### useVertexColor

> **useVertexColor**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:176](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L176)


Whether to use vertex color

## Accessors

### blendAlphaState

#### Get Signature

> **get** **blendAlphaState**(): [`BlendState`](../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:289](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L289)


Returns the material's alpha blend state object

##### Returns

[`BlendState`](../../RenderState/classes/BlendState.md)

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`blendAlphaState`](../namespaces/Core/classes/ABitmapBaseMaterial.md#blendalphastate)

***

### blendColorState

#### Get Signature

> **get** **blendColorState**(): [`BlendState`](../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:281](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L281)


Returns the material's color blend state object

##### Returns

[`BlendState`](../../RenderState/classes/BlendState.md)

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`blendColorState`](../namespaces/Core/classes/ABitmapBaseMaterial.md#blendcolorstate)

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:57](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L57)


Returns the cache key.

##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L65)


Sets the cache key.

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


Returns the fragment bind group descriptor name.

##### Returns

`string`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME`](../namespaces/Core/classes/ABitmapBaseMaterial.md#fragment_bind_group_descriptor_name)

***

### FRAGMENT\_SHADER\_MODULE\_NAME

#### Get Signature

> **get** **FRAGMENT\_SHADER\_MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:249](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L249)


Returns the fragment shader module name.

##### Returns

`string`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`FRAGMENT_SHADER_MODULE_NAME`](../namespaces/Core/classes/ABitmapBaseMaterial.md#fragment_shader_module_name)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:106](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L106)


Returns the associated GPU device.

##### Returns

`GPUDevice`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`gpuDevice`](../namespaces/Core/classes/ABitmapBaseMaterial.md#gpudevice)

***

### MODULE\_NAME

#### Get Signature

> **get** **MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:241](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L241)


Returns the material module name.

##### Returns

`string`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`MODULE_NAME`](../namespaces/Core/classes/ABitmapBaseMaterial.md#module_name)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:81](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L81)


Returns the name of the instance. If no name exists, it is generated using the class name and ID.

##### Returns

`string`

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:90](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L90)


Sets the name of the instance.

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


Returns packed texture for Clearcoat and Transmission

##### Returns

[`PackedTexture`](../../Resource/classes/PackedTexture.md)

***

### packedKHR\_diffuse\_transmission

#### Get Signature

> **get** **packedKHR\_diffuse\_transmission**(): [`PackedTexture`](../../Resource/classes/PackedTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:758](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L758)


Returns packed texture for Diffuse Transmission

##### Returns

[`PackedTexture`](../../Resource/classes/PackedTexture.md)

***

### packedKHR\_iridescence

#### Get Signature

> **get** **packedKHR\_iridescence**(): [`PackedTexture`](../../Resource/classes/PackedTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:731](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L731)


Returns packed texture for Iridescence

##### Returns

[`PackedTexture`](../../Resource/classes/PackedTexture.md)

***

### packedKHR\_sheen

#### Get Signature

> **get** **packedKHR\_sheen**(): [`PackedTexture`](../../Resource/classes/PackedTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:747](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L747)


Returns packed texture for Sheen

##### Returns

[`PackedTexture`](../../Resource/classes/PackedTexture.md)

***

### packedORMTexture

#### Get Signature

> **get** **packedORMTexture**(): [`PackedTexture`](../../Resource/classes/PackedTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:739](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L739)


Returns packed texture for ORM (Occlusion, Roughness, Metallic)

##### Returns

[`PackedTexture`](../../Resource/classes/PackedTexture.md)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/resources/core/ResourceBase.ts:114](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L114)


Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`redGPUContext`](../namespaces/Core/classes/ABitmapBaseMaterial.md#redgpucontext)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:73](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L73)


Returns the resource manager key.

##### Returns

`string`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`resourceManagerKey`](../namespaces/Core/classes/ABitmapBaseMaterial.md#resourcemanagerkey)

***

### STORAGE\_STRUCT

#### Get Signature

> **get** **STORAGE\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:265](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L265)


Returns the shader storage structure information.

##### Returns

`any`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`STORAGE_STRUCT`](../namespaces/Core/classes/ABitmapBaseMaterial.md#storage_struct)

***

### tintBlendMode

#### Get Signature

> **get** **tintBlendMode**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:205](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L205)


Returns the tint blend mode name.

##### Returns

`string`


Tint blend mode name

#### Set Signature

> **set** **tintBlendMode**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:220](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L220)


Sets the tint blend mode.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `"SUBTRACT"` \| `"NORMAL"` \| `"MULTIPLY"` \| `"LIGHTEN"` \| `"SCREEN"` \| `"LINEAR_DODGE"` \| `"DARKEN"` \| `"OVERLAY"` \| `"COLOR_DODGE"` \| `"COLOR_BURN"` \| `"HARD_LIGHT"` \| `"SOFT_LIGHT"` \| `"DIFFERENCE"` \| `"EXCLUSION"` \| `"DIVIDE"` \| `"VIVID_LIGHT"` \| `"LINEAR_BURN"` \| `"PIN_LIGHT"` \| `"SATURATION"` \| `"HUE"` \| `"LUMINOSITY"` \| `"COLOR"` \| `"NEGATION"` \| [`TINT_BLEND_MODE`](../type-aliases/TINT_BLEND_MODE.md) | Tint blend mode value or key |

##### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`tintBlendMode`](../namespaces/Core/classes/ABitmapBaseMaterial.md#tintblendmode)

***

### UNIFORM\_STRUCT

#### Get Signature

> **get** **UNIFORM\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:273](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L273)


Returns the shader uniforms structure information.

##### Returns

`any`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`UNIFORM_STRUCT`](../namespaces/Core/classes/ABitmapBaseMaterial.md#uniform_struct)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:98](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L98)


Returns the UUID.

##### Returns

`string`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`uuid`](../namespaces/Core/classes/ABitmapBaseMaterial.md#uuid)

***

### writeMaskState

#### Get Signature

> **get** **writeMaskState**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:297](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L297)


Returns the material's writeMask state

##### Returns

`number`

#### Set Signature

> **set** **writeMaskState**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:308](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L308)


Sets the material's writeMask state

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | GPUFlagsConstant value |

##### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`writeMaskState`](../namespaces/Core/classes/ABitmapBaseMaterial.md#writemaskstate)

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:125](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L125)


Adds a listener function to be called when the pipeline becomes dirty.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function |

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`__addDirtyPipelineListener`](../namespaces/Core/classes/ABitmapBaseMaterial.md#__adddirtypipelinelistener)

***

### \_\_fireListenerList()

> **\_\_fireListenerList**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:152](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L152)


Fires the registered dirty listeners.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | Whether to reset the listener list after firing (default: false) |

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`__fireListenerList`](../namespaces/Core/classes/ABitmapBaseMaterial.md#__firelistenerlist)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:137](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/resources/core/ResourceBase.ts#L137)


Removes a dirty pipeline listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to be removed |

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`__removeDirtyPipelineListener`](../namespaces/Core/classes/ABitmapBaseMaterial.md#__removedirtypipelinelistener)

***

### \_updateBaseProperty()

> `protected` **\_updateBaseProperty**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:463](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L463)


Reflects basic material properties such as uniforms/color/tint to the uniform buffer.

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`_updateBaseProperty`](../namespaces/Core/classes/ABitmapBaseMaterial.md#_updatebaseproperty)

***

### \_updateFragmentState()

> `protected` **\_updateFragmentState**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:351](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L351)


Updates fragment shader bind group/uniform/texture/sampler states.

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`_updateFragmentState`](../namespaces/Core/classes/ABitmapBaseMaterial.md#_updatefragmentstate)

***

### getFragmentRenderState()

> **getFragmentRenderState**(`entryPoint?`): `GPUFragmentState`

Defined in: [src/material/core/ABaseMaterial.ts:431](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L431)


Returns the GPU fragment render state object.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `entryPoint` | `string` | `'main'` | Shader entry point (default: 'main') |

#### Returns

`GPUFragmentState`


GPU fragment state

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`getFragmentRenderState`](../namespaces/Core/classes/ABitmapBaseMaterial.md#getfragmentrenderstate)

***

### getGPUResourceSampler()

> **getGPUResourceSampler**(`sampler`): `GPUSampler`

Defined in: [src/material/core/ABaseMaterial.ts:488](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L488)


Returns the GPU sampler from the Sampler object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sampler` | [`Sampler`](../../Resource/classes/Sampler.md) | Sampler object |

#### Returns

`GPUSampler`


GPUSampler instance

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`getGPUResourceSampler`](../namespaces/Core/classes/ABitmapBaseMaterial.md#getgpuresourcesampler)

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:316](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABaseMaterial.ts#L316)


Initializes GPU render pipeline info and uniform buffer.

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`initGPURenderInfos`](../namespaces/Core/classes/ABitmapBaseMaterial.md#initgpurenderinfos)

***

### setupPackedKHR\_clearcoatTexture\_transmission()

> **setupPackedKHR\_clearcoatTexture\_transmission**(): `Promise`\<`void`\>

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:800](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L800)


Setup Clearcoat and Transmission texture packing

#### Returns

`Promise`\<`void`\>

***

### setupPackedKHR\_diffuse\_transmission()

> **setupPackedKHR\_diffuse\_transmission**(): `Promise`\<`void`\>

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:887](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L887)


Setup Diffuse Transmission texture packing

#### Returns

`Promise`\<`void`\>

***

### setupPackedKHR\_iridescence()

> **setupPackedKHR\_iridescence**(): `Promise`\<`void`\>

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:951](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L951)


Setup Iridescence texture packing

#### Returns

`Promise`\<`void`\>

***

### setupPackedKHR\_sheen()

> **setupPackedKHR\_sheen**(): `Promise`\<`void`\>

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:919](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L919)


Setup Sheen texture packing

#### Returns

`Promise`\<`void`\>

***

### setupPackORMTexture()

> **setupPackORMTexture**(): `Promise`\<`void`\>

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:769](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/pbrMaterial/PBRMaterial.ts#L769)


Setup ORM (Occlusion, Roughness, Metallic) texture packing

#### Returns

`Promise`\<`void`\>

***

### updateSampler()

> **updateSampler**(`prevSampler`, `newSampler`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:75](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABitmapBaseMaterial.ts#L75)


Manages sampler object changes and DirtyPipeline listeners.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prevSampler` | [`Sampler`](../../Resource/classes/Sampler.md) | Previous sampler |
| `newSampler` | [`Sampler`](../../Resource/classes/Sampler.md) | New sampler |

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`updateSampler`](../namespaces/Core/classes/ABitmapBaseMaterial.md#updatesampler)

***

### updateTexture()

> **updateTexture**(`prevTexture`, `texture`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:59](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/material/core/ABitmapBaseMaterial.ts#L59)


Manages texture object changes and DirtyPipeline listeners.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prevTexture` | [`ANoiseTexture`](../../Resource/namespaces/CoreNoiseTexture/classes/ANoiseTexture.md) \| [`BitmapTexture`](../../Resource/classes/BitmapTexture.md) \| [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`HDRTexture`](../../Resource/classes/HDRTexture.md) | Previous texture (BitmapTexture | CubeTexture | ANoiseTexture | HDRTexture) |
| `texture` | [`ANoiseTexture`](../../Resource/namespaces/CoreNoiseTexture/classes/ANoiseTexture.md) \| [`BitmapTexture`](../../Resource/classes/BitmapTexture.md) \| [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`HDRTexture`](../../Resource/classes/HDRTexture.md) | New texture (BitmapTexture | CubeTexture | ANoiseTexture | HDRTexture) |

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../namespaces/Core/classes/ABitmapBaseMaterial.md).[`updateTexture`](../namespaces/Core/classes/ABitmapBaseMaterial.md#updatetexture)
