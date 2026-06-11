[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Material](../README.md) / PBRMaterial

# Class: PBRMaterial

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:186](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L186)

PBR (Physically Based Rendering) material class.

Inherits from ABitmapBaseMaterial to create a material for PBR rendering.

## Extends

- [`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md)

## Constructors

### Constructor

> **new PBRMaterial**(`redGPUContext`): `PBRMaterial`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:710](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L710)

PBRMaterial constructor

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`PBRMaterial`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`constructor`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#constructor)

## Properties

### alphaBlend

> **alphaBlend**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:206](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L206)

Alpha blending mode

***

### baseColorFactor

> **baseColorFactor**: `number`[]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:227](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L227)

Base color factor

***

### baseColorTexture

> **baseColorTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:217](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L217)

Base color texture

***

### baseColorTexture\_texCoord\_index

> **baseColorTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:232](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L232)

Base color texture UV index

***

### baseColorTextureSampler

> **baseColorTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:222](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L222)

Base color texture sampler

***

### cutOff

> **cutOff**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:201](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L201)

Alpha cutoff value

***

### doubleSided

> **doubleSided**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:676](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L676)

Whether it is double-sided

***

### emissiveFactor

> **emissiveFactor**: `number`[]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:616](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L616)

emissive factor

***

### emissiveStrength

> **emissiveStrength**: `number`[]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:621](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L621)

emissive strength

***

### emissiveTexture

> **emissiveTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:601](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L601)

Emissive texture

***

### emissiveTexture\_texCoord\_index

> **emissiveTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:611](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L611)

Emissive texture UV index

***

### emissiveTextureSampler

> **emissiveTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:606](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L606)

Emissive texture sampler

***

### KHR\_anisotropyRotation

> **KHR\_anisotropyRotation**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:314](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L314)

Anisotropy rotation

***

### KHR\_anisotropyStrength

> **KHR\_anisotropyStrength**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:309](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L309)

Anisotropy strength

***

### KHR\_anisotropyTexture

> **KHR\_anisotropyTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:319](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L319)

Anisotropy texture

***

### KHR\_anisotropyTexture\_texCoord\_index

> **KHR\_anisotropyTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:329](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L329)

Anisotropy texture UV index

***

### KHR\_anisotropyTextureSampler

> **KHR\_anisotropyTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:324](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L324)

Anisotropy texture sampler

***

### KHR\_attenuationColor

> **KHR\_attenuationColor**: `number`[]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:423](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L423)

Attenuation color

***

### KHR\_attenuationDistance

> **KHR\_attenuationDistance**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:418](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L418)

Attenuation distance

***

### KHR\_clearcoatFactor

> **KHR\_clearcoatFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:248](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L248)

Clearcoat factor

***

### KHR\_clearcoatNormalScale

> **KHR\_clearcoatNormalScale**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:243](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L243)

Clearcoat normal scale

***

### KHR\_clearcoatNormalTexture

> **KHR\_clearcoatNormalTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:263](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L263)

Clearcoat normal texture

***

### KHR\_clearcoatNormalTexture\_texCoord\_index

> **KHR\_clearcoatNormalTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:293](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L293)

Clearcoat normal texture UV index

***

### KHR\_clearcoatNormalTextureSampler

> **KHR\_clearcoatNormalTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:278](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L278)

Clearcoat normal texture sampler

***

### KHR\_clearcoatRoughnessFactor

> **KHR\_clearcoatRoughnessFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:253](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L253)

Clearcoat roughness factor

***

### KHR\_clearcoatRoughnessTexture

> **KHR\_clearcoatRoughnessTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:268](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L268)

Clearcoat roughness texture

***

### KHR\_clearcoatRoughnessTexture\_texCoord\_index

> **KHR\_clearcoatRoughnessTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:298](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L298)

Clearcoat roughness texture UV index

***

### KHR\_clearcoatRoughnessTextureSampler

> **KHR\_clearcoatRoughnessTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:283](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L283)

Clearcoat roughness texture sampler

***

### KHR\_clearcoatTexture

> **KHR\_clearcoatTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:258](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L258)

Clearcoat texture

***

### KHR\_clearcoatTexture\_texCoord\_index

> **KHR\_clearcoatTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:288](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L288)

Clearcoat texture UV index

***

### KHR\_clearcoatTextureSampler

> **KHR\_clearcoatTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:273](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L273)

Clearcoat texture sampler

***

### KHR\_diffuseTransmissionColorFactor

> **KHR\_diffuseTransmissionColorFactor**: \[`number`, `number`, `number`\]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:372](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L372)

Diffuse transmission color factor

***

### KHR\_diffuseTransmissionColorTexture

> **KHR\_diffuseTransmissionColorTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:392](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L392)

Diffuse transmission color texture

***

### KHR\_diffuseTransmissionColorTexture\_texCoord\_index

> **KHR\_diffuseTransmissionColorTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:402](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L402)

Diffuse transmission color texture UV index

***

### KHR\_diffuseTransmissionColorTextureSampler

> **KHR\_diffuseTransmissionColorTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:397](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L397)

Diffuse transmission color texture sampler

***

### KHR\_diffuseTransmissionFactor

> **KHR\_diffuseTransmissionFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:367](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L367)

Diffuse transmission factor

***

### KHR\_diffuseTransmissionTexture

> **KHR\_diffuseTransmissionTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:377](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L377)

Diffuse transmission texture

***

### KHR\_diffuseTransmissionTexture\_texCoord\_index

> **KHR\_diffuseTransmissionTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:387](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L387)

Diffuse transmission texture UV index

***

### KHR\_diffuseTransmissionTextureSampler

> **KHR\_diffuseTransmissionTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:382](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L382)

Diffuse transmission texture sampler

***

### KHR\_dispersion

> **KHR\_dispersion**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:683](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L683)

Whether to use KHR_dispersion extension

***

### KHR\_iridescenceFactor

> **KHR\_iridescenceFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:522](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L522)

Iridescence factor

***

### KHR\_iridescenceIor

> **KHR\_iridescenceIor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:527](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L527)

Iridescence IOR

***

### KHR\_iridescenceTexture

> **KHR\_iridescenceTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:542](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L542)

Iridescence texture

***

### KHR\_iridescenceTextureSampler

> **KHR\_iridescenceTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:547](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L547)

Iridescence texture sampler

***

### KHR\_iridescenceThicknessMaximum

> **KHR\_iridescenceThicknessMaximum**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:537](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L537)

Iridescence thickness maximum

***

### KHR\_iridescenceThicknessMinimum

> **KHR\_iridescenceThicknessMinimum**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:532](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L532)

Iridescence thickness minimum

***

### KHR\_iridescenceThicknessTexture

> **KHR\_iridescenceThicknessTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:552](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L552)

Iridescence thickness texture

***

### KHR\_iridescenceThicknessTextureSampler

> **KHR\_iridescenceThicknessTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:557](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L557)

Iridescence thickness texture sampler

***

### KHR\_materials\_ior

> **KHR\_materials\_ior**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:569](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L569)

KHR_materials_ior extension IOR value

***

### KHR\_sheenColorFactor

> **KHR\_sheenColorFactor**: \[`number`, `number`, `number`\]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:449](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L449)

Sheen color factor

***

### KHR\_sheenColorTexture

> **KHR\_sheenColorTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:459](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L459)

Sheen color texture

***

### KHR\_sheenColorTextureSampler

> **KHR\_sheenColorTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:464](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L464)

Sheen color texture sampler

***

### KHR\_sheenRoughnessFactor

> **KHR\_sheenRoughnessFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:454](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L454)

Sheen roughness factor

***

### KHR\_sheenRoughnessTexture

> **KHR\_sheenRoughnessTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:469](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L469)

Sheen roughness texture

***

### KHR\_sheenRoughnessTextureSampler

> **KHR\_sheenRoughnessTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:474](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L474)

Sheen roughness texture sampler

***

### KHR\_specularColorFactor

> **KHR\_specularColorFactor**: \[`number`, `number`, `number`\]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:490](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L490)

Specular color factor

***

### KHR\_specularColorTexture

> **KHR\_specularColorTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:505](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L505)

Specular color texture

***

### KHR\_specularColorTextureSampler

> **KHR\_specularColorTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:510](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L510)

Specular color texture sampler

***

### KHR\_specularFactor

> **KHR\_specularFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:485](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L485)

Specular factor

***

### KHR\_specularTexture

> **KHR\_specularTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:495](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L495)

Specular texture

***

### KHR\_specularTextureSampler

> **KHR\_specularTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:500](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L500)

Specular texture sampler

***

### KHR\_thicknessFactor

> **KHR\_thicknessFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:413](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L413)

Thickness factor

***

### KHR\_thicknessTexture

> **KHR\_thicknessTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:428](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L428)

Thickness texture

***

### KHR\_thicknessTexture\_texCoord\_index

> **KHR\_thicknessTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:438](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L438)

Thickness texture UV index

***

### KHR\_thicknessTextureSampler

> **KHR\_thicknessTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:433](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L433)

Thickness texture sampler

***

### KHR\_transmissionFactor

> **KHR\_transmissionFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:341](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L341)

Transmission factor

***

### KHR\_transmissionTexture

> **KHR\_transmissionTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:346](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L346)

Transmission texture

***

### KHR\_transmissionTexture\_texCoord\_index

> **KHR\_transmissionTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:356](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L356)

Transmission texture UV index

***

### KHR\_transmissionTextureSampler

> **KHR\_transmissionTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:351](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L351)

Transmission texture sampler

***

### metallicFactor

> **metallicFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:663](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L663)

Metallic factor

***

### metallicRoughnessTexture

> **metallicRoughnessTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:648](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L648)

Metallic-Roughness texture

***

### metallicRoughnessTexture\_texCoord\_index

> **metallicRoughnessTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:658](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L658)

Metallic-Roughness texture UV index

***

### metallicRoughnessTextureSampler

> **metallicRoughnessTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:653](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L653)

Metallic-Roughness texture sampler

***

### normalScale

> **normalScale**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:575](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L575)

Normal scale

***

### normalTexture

> **normalTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:585](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L585)

Normal texture

***

### normalTexture\_texCoord\_index

> **normalTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:595](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L595)

Normal texture UV index

***

### normalTextureSampler

> **normalTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:590](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L590)

Normal texture sampler

***

### occlusionStrength

> **occlusionStrength**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:642](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L642)

Occlusion strength

***

### occlusionTexture

> **occlusionTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:627](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L627)

Occlusion texture

***

### occlusionTexture\_texCoord\_index

> **occlusionTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:637](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L637)

Occlusion texture UV index

***

### occlusionTextureSampler

> **occlusionTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:632](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L632)

Occlusion texture sampler

***

### roughnessFactor

> **roughnessFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:668](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L668)

Roughness factor

***

### useCutOff

> **useCutOff**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:196](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L196)

Whether to use alpha cutoff

***

### useKHR\_materials\_anisotropy

> **useKHR\_materials\_anisotropy**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:304](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L304)

Whether to use KHR_materials_anisotropy extension

***

### useKHR\_materials\_clearcoat

> **useKHR\_materials\_clearcoat**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:238](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L238)

Whether to use KHR_materials_clearcoat extension

***

### useKHR\_materials\_diffuse\_transmission

> **useKHR\_materials\_diffuse\_transmission**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:362](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L362)

Whether to use KHR_materials_diffuse_transmission extension

***

### useKHR\_materials\_iridescence

> **useKHR\_materials\_iridescence**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:517](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L517)

Whether to use KHR_materials_iridescence extension

***

### useKHR\_materials\_sheen

> **useKHR\_materials\_sheen**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:444](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L444)

Whether to use KHR_materials_sheen extension

***

### useKHR\_materials\_specular

> **useKHR\_materials\_specular**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:480](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L480)

Whether to use KHR_materials_specular extension

***

### useKHR\_materials\_transmission

> **useKHR\_materials\_transmission**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:336](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L336)

Whether to use KHR_materials_transmission extension

***

### useKHR\_materials\_unlit

> **useKHR\_materials\_unlit**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:563](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L563)

Whether to use KHR_materials_unlit extension

***

### useKHR\_materials\_volume

> **useKHR\_materials\_volume**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:408](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L408)

Whether to use KHR_materials_volume extension

***

### useNormalTexture

> **useNormalTexture**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:580](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L580)

Whether to use normal texture

***

### useVertexColor

> **useVertexColor**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:191](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L191)

Whether to use vertex color

## Accessors

### packedKHR\_clearcoatTexture\_transmission

#### Get Signature

> **get** **packedKHR\_clearcoatTexture\_transmission**(): [`PackedTexture`](../../Resource/classes/PackedTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:738](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L738)

Returns packed texture for Clearcoat and Transmission

##### Returns

[`PackedTexture`](../../Resource/classes/PackedTexture.md)

***

### packedKHR\_diffuse\_transmission

#### Get Signature

> **get** **packedKHR\_diffuse\_transmission**(): [`PackedTexture`](../../Resource/classes/PackedTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:773](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L773)

Returns packed texture for Diffuse Transmission

##### Returns

[`PackedTexture`](../../Resource/classes/PackedTexture.md)

***

### packedKHR\_iridescence

#### Get Signature

> **get** **packedKHR\_iridescence**(): [`PackedTexture`](../../Resource/classes/PackedTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:746](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L746)

Returns packed texture for Iridescence

##### Returns

[`PackedTexture`](../../Resource/classes/PackedTexture.md)

***

### packedKHR\_sheen

#### Get Signature

> **get** **packedKHR\_sheen**(): [`PackedTexture`](../../Resource/classes/PackedTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:762](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L762)

Returns packed texture for Sheen

##### Returns

[`PackedTexture`](../../Resource/classes/PackedTexture.md)

***

### packedORMTexture

#### Get Signature

> **get** **packedORMTexture**(): [`PackedTexture`](../../Resource/classes/PackedTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:754](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L754)

Returns packed texture for ORM (Occlusion, Roughness, Metallic)

##### Returns

[`PackedTexture`](../../Resource/classes/PackedTexture.md)

***

### textureOffset

#### Get Signature

> **get** **textureOffset**(): \[`number`, `number`\]

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:74](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/AUVTransformBaseMaterial.ts#L74)

Texture offset (u, v)

### textureScale

#### Get Signature

> **get** **textureScale**(): \[`number`, `number`\]

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:92](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/AUVTransformBaseMaterial.ts#L92)

Texture scale (u, v)

### setupPackedKHR\_clearcoatTexture\_transmission()

> **setupPackedKHR\_clearcoatTexture\_transmission**(): `Promise`\<`void`\>

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:815](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L815)

Setup Clearcoat and Transmission texture packing

#### Returns

`Promise`\<`void`\>

***

### setupPackedKHR\_diffuse\_transmission()

> **setupPackedKHR\_diffuse\_transmission**(): `Promise`\<`void`\>

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:902](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L902)

Setup Diffuse Transmission texture packing

#### Returns

`Promise`\<`void`\>

***

### setupPackedKHR\_iridescence()

> **setupPackedKHR\_iridescence**(): `Promise`\<`void`\>

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:966](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L966)

Setup Iridescence texture packing

#### Returns

`Promise`\<`void`\>

***

### setupPackedKHR\_sheen()

> **setupPackedKHR\_sheen**(): `Promise`\<`void`\>

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:934](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L934)

Setup Sheen texture packing

#### Returns

`Promise`\<`void`\>

***

### setupPackORMTexture()

> **setupPackORMTexture**(): `Promise`\<`void`\>

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:784](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L784)

Setup ORM (Occlusion, Roughness, Metallic) texture packing

#### Returns

`Promise`\<`void`\>

***


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### \_\_packingList

> **\_\_packingList**: `any`[]

Defined in: [src/material/core/ABitmapBaseMaterial.ts:27](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/ABitmapBaseMaterial.ts#L27)

List of callbacks called when updating the pipeline

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`__packingList`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#__packinglist)

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:67](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/ABaseMaterial.ts#L67)

Pipeline dirty status flag

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`dirtyPipeline`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#dirtypipeline)

***

### dirtyTextureTransform

> **dirtyTextureTransform**: `boolean` = `false`

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:34](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/AUVTransformBaseMaterial.ts#L34)

Texture transform change status flag

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`dirtyTextureTransform`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#dirtytexturetransform)

***

### gpuRenderInfo

> **gpuRenderInfo**: [`FragmentGPURenderInfo`](../namespaces/Core/classes/FragmentGPURenderInfo.md)

Defined in: [src/material/core/ABaseMaterial.ts:62](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/ABaseMaterial.ts#L62)

Fragment GPU render info object

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`gpuRenderInfo`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#gpurenderinfo)

***

### isInstanceofMaterial

> **isInstanceofMaterial**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:33](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/ABaseMaterial.ts#L33)

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`isInstanceofMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#isinstanceofmaterial)

***

### opacity

> **opacity**: `number`

Defined in: [src/material/core/ABaseMaterial.ts:22](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/ABaseMaterial.ts#L22)

Material opacity (0~1)

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`opacity`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#opacity)

***

### tint

> **tint**: [`ColorRGBA`](../../Color/classes/ColorRGBA.md)

Defined in: [src/material/core/ABaseMaterial.ts:27](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/ABaseMaterial.ts#L27)

Material tint color (RGBA)

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`tint`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#tint)

***

### transparent

> **transparent**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:72](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/ABaseMaterial.ts#L72)

Whether the material is transparent

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`transparent`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#transparent)

***

### use2PathRender

> **use2PathRender**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:211](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/pbrMaterial/PBRMaterial.ts#L211)

Whether to use 2-pass rendering

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`use2PathRender`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#use2pathrender)

***

### useTint

> **useTint**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:32](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/ABaseMaterial.ts#L32)

Whether to use tint color

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`useTint`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#usetint)

***

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/RedGPUObject.ts#L76)

Returns the AntialiasingManager instance. (Short-cut path)

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager instance

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`antialiasingManager`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#antialiasingmanager)

***

### blendAlphaState

#### Get Signature

> **get** **blendAlphaState**(): [`BlendState`](../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:291](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/ABaseMaterial.ts#L291)

Returns the material's alpha blend state object

##### Returns

[`BlendState`](../../RenderState/classes/BlendState.md)

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`blendAlphaState`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#blendalphastate)

***

### blendColorState

#### Get Signature

> **get** **blendColorState**(): [`BlendState`](../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:283](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/ABaseMaterial.ts#L283)

Returns the material's color blend state object

##### Returns

[`BlendState`](../../RenderState/classes/BlendState.md)

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`blendColorState`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#blendcolorstate)

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:53](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/core/ResourceBase.ts#L53)

Returns the cache key.

##### Returns

`string`

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:61](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/core/ResourceBase.ts#L61)

Sets the cache key.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`cacheKey`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#cachekey)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/RedGPUObject.ts#L88)

Returns the CommandEncoderManager instance. (Short-cut path)

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager instance

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`commandEncoderManager`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#commandencodermanager)

***

### FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME

#### Get Signature

> **get** **FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:259](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/ABaseMaterial.ts#L259)

Returns the fragment bind group descriptor name.

##### Returns

`string`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#fragment_bind_group_descriptor_name)

***

### FRAGMENT\_SHADER\_MODULE\_NAME

#### Get Signature

> **get** **FRAGMENT\_SHADER\_MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:251](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/ABaseMaterial.ts#L251)

Returns the fragment shader module name.

##### Returns

`string`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`FRAGMENT_SHADER_MODULE_NAME`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#fragment_shader_module_name)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:77](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/core/ResourceBase.ts#L77)

Returns the associated GPU device.

##### Returns

`GPUDevice`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`gpuDevice`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#gpudevice)

***

### MODULE\_NAME

#### Get Signature

> **get** **MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:243](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/ABaseMaterial.ts#L243)

Returns the material module name.

##### Returns

`string`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`MODULE_NAME`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#module_name)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/BaseObject.ts#L58)

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/BaseObject.ts#L71)

Sets the name of the object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name of the object to set |

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`name`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/RedGPUObject.ts#L40)

Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext instance

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`redGPUContext`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/RedGPUObject.ts#L64)

Returns the ResourceManager instance. (Short-cut path)

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager instance

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`resourceManager`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#resourcemanager)

***

### resourceManagerKey

#### Get Signature

> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:69](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/core/ResourceBase.ts#L69)

Returns the resource manager key.

##### Returns

`string`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`resourceManagerKey`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#resourcemanagerkey)

***

### revision

#### Get Signature

> **get** **revision**(): `number`

Defined in: [src/resources/core/ResourceBase.ts:45](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/core/ResourceBase.ts#L45)

Returns the revision (update count) of the resource.

##### Returns

`number`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`revision`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#revision)

***

### STORAGE\_STRUCT

#### Get Signature

> **get** **STORAGE\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:267](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/ABaseMaterial.ts#L267)

Returns the shader storage structure information.

##### Returns

`any`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`STORAGE_STRUCT`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#storage_struct)

***

### Example
```typescript
material.textureOffset = [0.5, 0.5];
```

##### Returns

\[`number`, `number`\]

#### Set Signature

> **set** **textureOffset**(`value`): `void`

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:78](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/AUVTransformBaseMaterial.ts#L78)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | \[`number`, `number`\] |

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`textureOffset`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#textureoffset)

***

### Example
```typescript
material.textureScale = [2.0, 2.0];
```

##### Returns

\[`number`, `number`\]

#### Set Signature

> **set** **textureScale**(`value`): `void`

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:96](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/AUVTransformBaseMaterial.ts#L96)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | \[`number`, `number`\] |

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`textureScale`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#texturescale)

***

### tintBlendMode

#### Get Signature

> **get** **tintBlendMode**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:207](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/ABaseMaterial.ts#L207)

Returns the tint blend mode name.

##### Returns

`string`

Tint blend mode name

#### Set Signature

> **set** **tintBlendMode**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:222](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/ABaseMaterial.ts#L222)

Sets the tint blend mode.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `"SUBTRACT"` \| `"NORMAL"` \| `"MULTIPLY"` \| `"LIGHTEN"` \| `"SCREEN"` \| `"LINEAR_DODGE"` \| `"DARKEN"` \| `"OVERLAY"` \| `"COLOR_DODGE"` \| `"COLOR_BURN"` \| `"HARD_LIGHT"` \| `"SOFT_LIGHT"` \| `"DIFFERENCE"` \| `"EXCLUSION"` \| `"DIVIDE"` \| `"VIVID_LIGHT"` \| `"LINEAR_BURN"` \| `"PIN_LIGHT"` \| `"SATURATION"` \| `"HUE"` \| `"LUMINOSITY"` \| `"COLOR"` \| `"NEGATION"` \| [`TINT_BLEND_MODE`](../type-aliases/TINT_BLEND_MODE.md) | Tint blend mode value or key |

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`tintBlendMode`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#tintblendmode)

***

### UNIFORM\_STRUCT

#### Get Signature

> **get** **UNIFORM\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:275](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/ABaseMaterial.ts#L275)

Returns the shader uniforms structure information.

##### Returns

`any`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`UNIFORM_STRUCT`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#uniform_struct)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/base/BaseObject.ts#L46)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`uuid`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#uuid)

***

### writeMaskState

#### Get Signature

> **get** **writeMaskState**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:299](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/ABaseMaterial.ts#L299)

Returns the material's writeMask state

##### Returns

`number`

#### Set Signature

> **set** **writeMaskState**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:310](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/ABaseMaterial.ts#L310)

Sets the material's writeMask state

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | GPUFlagsConstant value |

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`writeMaskState`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#writemaskstate)

## Methods

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:89](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/core/ResourceBase.ts#L89)

Adds a listener function to be called when the pipeline becomes dirty.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function |

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`__addDirtyPipelineListener`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#__adddirtypipelinelistener)

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:101](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/core/ResourceBase.ts#L101)

Removes a resource update listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to be removed |

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`__removeDirtyPipelineListener`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#__removedirtypipelinelistener)

***

### \_updateBaseProperty()

> `protected` **\_updateBaseProperty**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:465](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/ABaseMaterial.ts#L465)

Reflects basic material properties such as uniforms/color/tint to the uniform buffer.

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`_updateBaseProperty`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#_updatebaseproperty)

***

### \_updateFragmentState()

> `protected` **\_updateFragmentState**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:353](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/ABaseMaterial.ts#L353)

Updates fragment shader bind group/uniform/texture/sampler states.

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`_updateFragmentState`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#_updatefragmentstate)

***

### getFragmentRenderState()

> **getFragmentRenderState**(`entryPoint?`): `GPUFragmentState`

Defined in: [src/material/core/ABaseMaterial.ts:433](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/ABaseMaterial.ts#L433)

Returns the GPU fragment render state object.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `entryPoint` | `string` | `'main'` | Shader entry point (default: 'main') |

#### Returns

`GPUFragmentState`

GPU fragment state

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`getFragmentRenderState`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#getfragmentrenderstate)

***

### getGPUResourceSampler()

> **getGPUResourceSampler**(`sampler`): `GPUSampler`

Defined in: [src/material/core/ABaseMaterial.ts:490](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/ABaseMaterial.ts#L490)

Returns the GPU sampler from the Sampler object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sampler` | [`Sampler`](../../Resource/classes/Sampler.md) | Sampler object |

#### Returns

`GPUSampler`

GPUSampler instance

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`getGPUResourceSampler`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#getgpuresourcesampler)

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:318](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/ABaseMaterial.ts#L318)

Initializes GPU render pipeline info and uniform buffer.

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`initGPURenderInfos`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#initgpurenderinfos)

***

### notifyUpdate()

> **notifyUpdate**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:116](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/resources/core/ResourceBase.ts#L116)

Notifies registered listeners that the resource has been updated.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList` | `boolean` | `false` | Whether to reset the listener list after firing (default: false) |

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`notifyUpdate`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#notifyupdate)

***

### updateSampler()

> **updateSampler**(`prevSampler`, `newSampler`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:80](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/ABitmapBaseMaterial.ts#L80)

Manages sampler object changes and DirtyPipeline listeners.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prevSampler` | [`Sampler`](../../Resource/classes/Sampler.md) | Previous sampler |
| `newSampler` | [`Sampler`](../../Resource/classes/Sampler.md) | New sampler |

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`updateSampler`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#updatesampler)

***

### updateTexture()

> **updateTexture**(`prevTexture`, `texture`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:64](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/ABitmapBaseMaterial.ts#L64)

Manages texture object changes and DirtyPipeline listeners.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prevTexture` | [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`BitmapTexture`](../../Resource/classes/BitmapTexture.md) \| [`ANoiseTexture`](../../Resource/namespaces/CoreNoiseTexture/classes/ANoiseTexture.md) \| [`HDRTexture`](../../Resource/classes/HDRTexture.md) | Previous texture (BitmapTexture | CubeTexture | ANoiseTexture | HDRTexture) |
| `texture` | [`CubeTexture`](../../Resource/classes/CubeTexture.md) \| [`BitmapTexture`](../../Resource/classes/BitmapTexture.md) \| [`ANoiseTexture`](../../Resource/namespaces/CoreNoiseTexture/classes/ANoiseTexture.md) \| [`HDRTexture`](../../Resource/classes/HDRTexture.md) | New texture (BitmapTexture | CubeTexture | ANoiseTexture | HDRTexture) |

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`updateTexture`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#updatetexture)


</details>
