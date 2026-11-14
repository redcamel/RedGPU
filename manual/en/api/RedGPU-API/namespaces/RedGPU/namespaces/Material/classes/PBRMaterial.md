[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Material](../README.md) / PBRMaterial

# Class: PBRMaterial

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:185](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L185)

Material class supporting Physically Based Rendering (PBR) and glTF 2.0 material extensions.

Integrates and manages base color, metallic/roughness, normal, occlusion, emissive textures, and various `KHR_materials_*` extension properties, configuring packed textures for the render pipeline.

## Extends

- [`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md)

## Constructors



***

### Constructor

> **new PBRMaterial**(`redGPUContext`): `PBRMaterial`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:692](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L692)

Creates a PBRMaterial instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`PBRMaterial`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`constructor`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#constructor)

## Properties



***

### alphaBlend

> **alphaBlend**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:205](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L205)

Alpha blending mode value

***

***

### baseColorFactor

> **baseColorFactor**: `number`[]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:225](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L225)

Base color factor `[r, g, b, a]`

***

***

### baseColorTexture

> **baseColorTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:215](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L215)

Base color texture

***

***

### baseColorTexture\_texCoord\_index

> **baseColorTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:230](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L230)

Base color texture UV channel index

***

***

### baseColorTextureSampler

> **baseColorTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:220](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L220)

Base color texture sampler

***

***

### cutOff

> **cutOff**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:200](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L200)

Alpha cutoff threshold value

***

***

### doubleSided

> **doubleSided**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:655](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L655)

Whether double-sided rendering is enabled

***

***

### emissiveFactor

> **emissiveFactor**: `number`[]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:600](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L600)

Emissive color factor `[r, g, b]`

***

***

### emissiveStrength

> **emissiveStrength**: `number`[]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:605](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L605)

Emissive strength multiplier (`KHR_materials_emissive_strength`)

***

***

### emissiveTexture

> **emissiveTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:585](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L585)

Emissive texture

***

***

### emissiveTexture\_texCoord\_index

> **emissiveTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:595](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L595)

Emissive texture UV channel index

***

***

### emissiveTextureSampler

> **emissiveTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:590](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L590)

Emissive texture sampler

***

***

### isFoliage

> **isFoliage**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:660](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L660)

Whether Two-Sided Foliage shading model is enabled

***

***

### KHR\_anisotropyRotation

> **KHR\_anisotropyRotation**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:310](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L310)

Anisotropy rotation angle (in radians)

***

***

### KHR\_anisotropyStrength

> **KHR\_anisotropyStrength**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:305](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L305)

Anisotropy strength

***

***

### KHR\_anisotropyTexture

> **KHR\_anisotropyTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:315](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L315)

Anisotropy texture

***

***

### KHR\_anisotropyTexture\_texCoord\_index

> **KHR\_anisotropyTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:325](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L325)

Anisotropy texture UV channel index

***

***

### KHR\_anisotropyTextureSampler

> **KHR\_anisotropyTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:320](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L320)

Anisotropy texture sampler

***

***

### KHR\_attenuationColor

> **KHR\_attenuationColor**: `number`[]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:415](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L415)

Volume attenuation color `[r, g, b]`

***

***

### KHR\_attenuationDistance

> **KHR\_attenuationDistance**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:410](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L410)

Light attenuation distance within the volume

***

***

### KHR\_clearcoatFactor

> **KHR\_clearcoatFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:245](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L245)

Clearcoat intensity factor

***

***

### KHR\_clearcoatNormalScale

> **KHR\_clearcoatNormalScale**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:240](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L240)

Clearcoat normal map scale

***

***

### KHR\_clearcoatNormalTexture

> **KHR\_clearcoatNormalTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:260](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L260)

Clearcoat normal texture

***

***

### KHR\_clearcoatNormalTexture\_texCoord\_index

> **KHR\_clearcoatNormalTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:290](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L290)

Clearcoat normal texture UV channel index

***

***

### KHR\_clearcoatNormalTextureSampler

> **KHR\_clearcoatNormalTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:275](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L275)

Clearcoat normal texture sampler

***

***

### KHR\_clearcoatRoughnessFactor

> **KHR\_clearcoatRoughnessFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:250](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L250)

Clearcoat roughness factor

***

***

### KHR\_clearcoatRoughnessTexture

> **KHR\_clearcoatRoughnessTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:265](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L265)

Clearcoat roughness texture

***

***

### KHR\_clearcoatRoughnessTexture\_texCoord\_index

> **KHR\_clearcoatRoughnessTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:295](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L295)

Clearcoat roughness texture UV channel index

***

***

### KHR\_clearcoatRoughnessTextureSampler

> **KHR\_clearcoatRoughnessTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:280](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L280)

Clearcoat roughness texture sampler

***

***

### KHR\_clearcoatTexture

> **KHR\_clearcoatTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:255](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L255)

Clearcoat texture

***

***

### KHR\_clearcoatTexture\_texCoord\_index

> **KHR\_clearcoatTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:285](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L285)

Clearcoat texture UV channel index

***

***

### KHR\_clearcoatTextureSampler

> **KHR\_clearcoatTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:270](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L270)

Clearcoat texture sampler

***

***

### KHR\_diffuseTransmissionColorFactor

> **KHR\_diffuseTransmissionColorFactor**: \[`number`, `number`, `number`\]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:365](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L365)

Diffuse transmission color factor `[r, g, b]`

***

***

### KHR\_diffuseTransmissionColorTexture

> **KHR\_diffuseTransmissionColorTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:385](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L385)

Diffuse transmission color texture

***

***

### KHR\_diffuseTransmissionColorTexture\_texCoord\_index

> **KHR\_diffuseTransmissionColorTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:395](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L395)

Diffuse transmission color texture UV channel index

***

***

### KHR\_diffuseTransmissionColorTextureSampler

> **KHR\_diffuseTransmissionColorTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:390](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L390)

Diffuse transmission color texture sampler

***

***

### KHR\_diffuseTransmissionFactor

> **KHR\_diffuseTransmissionFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:360](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L360)

Diffuse transmission factor

***

***

### KHR\_diffuseTransmissionTexture

> **KHR\_diffuseTransmissionTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:370](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L370)

Diffuse transmission texture

***

***

### KHR\_diffuseTransmissionTexture\_texCoord\_index

> **KHR\_diffuseTransmissionTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:380](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L380)

Diffuse transmission texture UV channel index

***

***

### KHR\_diffuseTransmissionTextureSampler

> **KHR\_diffuseTransmissionTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:375](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L375)

Diffuse transmission texture sampler

***

***

### KHR\_dispersion

> **KHR\_dispersion**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:665](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L665)

`KHR_materials_dispersion` dispersion strength

***

***

### KHR\_iridescenceFactor

> **KHR\_iridescenceFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:510](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L510)

Iridescence intensity factor

***

***

### KHR\_iridescenceIor

> **KHR\_iridescenceIor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:515](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L515)

Iridescence thin-film index of refraction (IOR)

***

***

### KHR\_iridescenceTexture

> **KHR\_iridescenceTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:530](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L530)

Iridescence intensity texture

***

***

### KHR\_iridescenceTextureSampler

> **KHR\_iridescenceTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:535](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L535)

Iridescence intensity texture sampler

***

***

### KHR\_iridescenceThicknessMaximum

> **KHR\_iridescenceThicknessMaximum**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:525](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L525)

Iridescence thin-film maximum thickness (nm)

***

***

### KHR\_iridescenceThicknessMinimum

> **KHR\_iridescenceThicknessMinimum**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:520](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L520)

Iridescence thin-film minimum thickness (nm)

***

***

### KHR\_iridescenceThicknessTexture

> **KHR\_iridescenceThicknessTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:540](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L540)

Iridescence thickness texture

***

***

### KHR\_iridescenceThicknessTextureSampler

> **KHR\_iridescenceThicknessTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:545](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L545)

Iridescence thickness texture sampler

***

***

### KHR\_materials\_ior

> **KHR\_materials\_ior**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:555](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L555)

`KHR_materials_ior` index of refraction (IOR) value (default: `1.5`)

***

***

### KHR\_sheenColorFactor

> **KHR\_sheenColorFactor**: \[`number`, `number`, `number`\]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:440](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L440)

Sheen color factor `[r, g, b]`

***

***

### KHR\_sheenColorTexture

> **KHR\_sheenColorTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:450](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L450)

Sheen color texture

***

***

### KHR\_sheenColorTextureSampler

> **KHR\_sheenColorTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:455](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L455)

Sheen color texture sampler

***

***

### KHR\_sheenRoughnessFactor

> **KHR\_sheenRoughnessFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:445](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L445)

Sheen roughness factor

***

***

### KHR\_sheenRoughnessTexture

> **KHR\_sheenRoughnessTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:460](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L460)

Sheen roughness texture

***

***

### KHR\_sheenRoughnessTextureSampler

> **KHR\_sheenRoughnessTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:465](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L465)

Sheen roughness texture sampler

***

***

### KHR\_specularColorFactor

> **KHR\_specularColorFactor**: \[`number`, `number`, `number`\]

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:480](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L480)

Specular color factor `[r, g, b]`

***

***

### KHR\_specularColorTexture

> **KHR\_specularColorTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:495](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L495)

Specular color texture

***

***

### KHR\_specularColorTextureSampler

> **KHR\_specularColorTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:500](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L500)

Specular color texture sampler

***

***

### KHR\_specularFactor

> **KHR\_specularFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:475](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L475)

Specular reflection strength factor

***

***

### KHR\_specularTexture

> **KHR\_specularTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:485](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L485)

Specular texture

***

***

### KHR\_specularTextureSampler

> **KHR\_specularTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:490](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L490)

Specular texture sampler

***

***

### KHR\_thicknessFactor

> **KHR\_thicknessFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:405](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L405)

Volume thickness factor

***

***

### KHR\_thicknessTexture

> **KHR\_thicknessTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:420](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L420)

Volume thickness texture

***

***

### KHR\_thicknessTexture\_texCoord\_index

> **KHR\_thicknessTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:430](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L430)

Volume thickness texture UV channel index

***

***

### KHR\_thicknessTextureSampler

> **KHR\_thicknessTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:425](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L425)

Volume thickness texture sampler

***

***

### KHR\_transmissionFactor

> **KHR\_transmissionFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:335](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L335)

Optical transmission factor

***

***

### KHR\_transmissionTexture

> **KHR\_transmissionTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:340](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L340)

Transmission texture

***

***

### KHR\_transmissionTexture\_texCoord\_index

> **KHR\_transmissionTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:350](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L350)

Transmission texture UV channel index

***

***

### KHR\_transmissionTextureSampler

> **KHR\_transmissionTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:345](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L345)

Transmission texture sampler

***

***

### metallicFactor

> **metallicFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:645](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L645)

Metallic factor (0.0 to 1.0)

***

***

### metallicRoughnessTexture

> **metallicRoughnessTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:630](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L630)

Metallic-Roughness texture

***

***

### metallicRoughnessTexture\_texCoord\_index

> **metallicRoughnessTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:640](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L640)

Metallic-Roughness texture UV channel index

***

***

### metallicRoughnessTextureSampler

> **metallicRoughnessTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:635](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L635)

Metallic-Roughness texture sampler

***

***

### normalScale

> **normalScale**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:560](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L560)

Normal map scale

***

***

### normalTexture

> **normalTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:570](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L570)

Normal map texture

***

***

### normalTexture\_texCoord\_index

> **normalTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:580](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L580)

Normal map texture UV channel index

***

***

### normalTextureSampler

> **normalTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:575](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L575)

Normal map texture sampler

***

***

### occlusionStrength

> **occlusionStrength**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:625](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L625)

Occlusion application strength

***

***

### occlusionTexture

> **occlusionTexture**: [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:610](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L610)

Occlusion (AO) texture

***

***

### occlusionTexture\_texCoord\_index

> **occlusionTexture\_texCoord\_index**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:620](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L620)

Occlusion texture UV channel index

***

***

### occlusionTextureSampler

> **occlusionTextureSampler**: [`Sampler`](../../Resource/classes/Sampler.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:615](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L615)

Occlusion texture sampler

***

***

### roughnessFactor

> **roughnessFactor**: `number`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:650](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L650)

Roughness factor (0.0 to 1.0)

***

***

### useCutOff

> **useCutOff**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:195](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L195)

Whether to use alpha cutoff (MASK)

***

***

### useKHR\_materials\_anisotropy

> **useKHR\_materials\_anisotropy**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:300](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L300)

Whether to use the `KHR_materials_anisotropy` extension

***

***

### useKHR\_materials\_clearcoat

> **useKHR\_materials\_clearcoat**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:235](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L235)

Whether to use the `KHR_materials_clearcoat` extension

***

***

### useKHR\_materials\_diffuse\_transmission

> **useKHR\_materials\_diffuse\_transmission**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:355](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L355)

Whether to use the `KHR_materials_diffuse_transmission` extension

***

***

### useKHR\_materials\_iridescence

> **useKHR\_materials\_iridescence**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:505](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L505)

Whether to use the `KHR_materials_iridescence` extension

***

***

### useKHR\_materials\_sheen

> **useKHR\_materials\_sheen**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:435](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L435)

Whether to use the `KHR_materials_sheen` extension

***

***

### useKHR\_materials\_specular

> **useKHR\_materials\_specular**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:470](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L470)

Whether to use the `KHR_materials_specular` extension

***

***

### useKHR\_materials\_transmission

> **useKHR\_materials\_transmission**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:330](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L330)

Whether to use the `KHR_materials_transmission` extension

***

***

### useKHR\_materials\_unlit

> **useKHR\_materials\_unlit**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:550](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L550)

Whether to use the `KHR_materials_unlit` extension

***

***

### useKHR\_materials\_volume

> **useKHR\_materials\_volume**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:400](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L400)

Whether to use the `KHR_materials_volume` extension

***

***

### useNormalTexture

> **useNormalTexture**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:565](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L565)

Whether to use normal texture

***

***

### useVertexColor

> **useVertexColor**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:190](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L190)

Whether to use vertex color

## Accessors



***

### packedKHR\_clearcoatTexture\_transmission

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **packedKHR\_clearcoatTexture\_transmission**(): [`PackedTexture`](../../Resource/classes/PackedTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:721](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L721)

Returns the packed texture combining clearcoat and transmission/thickness channels.

##### Returns

[`PackedTexture`](../../Resource/classes/PackedTexture.md)

PackedTexture instance

***

***

### packedKHR\_diffuse\_transmission

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **packedKHR\_diffuse\_transmission**(): [`PackedTexture`](../../Resource/classes/PackedTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:769](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L769)

Returns the packed texture combining diffuse transmission color and factor channels.

##### Returns

[`PackedTexture`](../../Resource/classes/PackedTexture.md)

PackedTexture instance

***

***

### packedKHR\_iridescence

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **packedKHR\_iridescence**(): [`PackedTexture`](../../Resource/classes/PackedTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:733](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L733)

Returns the packed texture combining iridescence and thickness channels.

##### Returns

[`PackedTexture`](../../Resource/classes/PackedTexture.md)

PackedTexture instance

***

***

### packedKHR\_sheen

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **packedKHR\_sheen**(): [`PackedTexture`](../../Resource/classes/PackedTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:757](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L757)

Returns the packed texture combining sheen color and roughness channels.

##### Returns

[`PackedTexture`](../../Resource/classes/PackedTexture.md)

PackedTexture instance

***

***

### packedORMTexture

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **packedORMTexture**(): [`PackedTexture`](../../Resource/classes/PackedTexture.md)

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:745](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L745)

Returns the ORM packed texture combining occlusion (R), roughness (G), and metallic (B).

##### Returns

[`PackedTexture`](../../Resource/classes/PackedTexture.md)

PackedTexture instance

***

## Methods



***

### setupPackedKHR\_clearcoatTexture\_transmission()

> **setupPackedKHR\_clearcoatTexture\_transmission**(): `Promise`\<`void`\>

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:809](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L809)

Packs clearcoat, clearcoat roughness, transmission, and volume thickness textures into a single 4-channel texture.

#### Returns

`Promise`\<`void`\>

***

***

### setupPackedKHR\_diffuse\_transmission()

> **setupPackedKHR\_diffuse\_transmission**(): `Promise`\<`void`\>

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:851](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L851)

Merges diffuse transmission color and diffuse transmission factor textures into a single packed texture.

#### Returns

`Promise`\<`void`\>

***

***

### setupPackedKHR\_iridescence()

> **setupPackedKHR\_iridescence**(): `Promise`\<`void`\>

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:915](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L915)

Merges iridescence and iridescence thickness textures into a single packed texture.

#### Returns

`Promise`\<`void`\>

***

***

### setupPackedKHR\_sheen()

> **setupPackedKHR\_sheen**(): `Promise`\<`void`\>

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:883](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L883)

Merges sheen color and sheen roughness textures into a single packed texture.

#### Returns

`Promise`\<`void`\>

***

***

### setupPackORMTexture()

> **setupPackORMTexture**(): `Promise`\<`void`\>

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:777](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L777)

Merges occlusion and metallic-roughness textures into a single ORM packed texture.

#### Returns

`Promise`\<`void`\>

***

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### \_\_packingList

> **\_\_packingList**: `any`[]

Defined in: [src/material/core/ABitmapBaseMaterial.ts:24](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABitmapBaseMaterial.ts#L24)

List of texture packing callback functions executed when updating fragment state

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`__packingList`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#__packinglist)

***

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:80](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L80)

Flag indicating whether the pipeline needs updating

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`dirtyPipeline`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#dirtypipeline)

***

***

### dirtyTextureTransform

> **dirtyTextureTransform**: `boolean` = `false`

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:32](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/AUVTransformBaseMaterial.ts#L32)

Flag indicating whether texture UV transform information has changed

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`dirtyTextureTransform`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#dirtytexturetransform)

***

***

### gpuRenderInfo

> **gpuRenderInfo**: [`FragmentGPURenderInfo`](../namespaces/Core/classes/FragmentGPURenderInfo.md)

Defined in: [src/material/core/ABaseMaterial.ts:75](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L75)

Fragment GPU render pipeline information object

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`gpuRenderInfo`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#gpurenderinfo)

***

***

### isDebuggerMaterial?

> `optional` **isDebuggerMaterial?**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:48](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L48)

Flag indicating whether it is a debugger-dedicated material

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`isDebuggerMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#isdebuggermaterial)

***

***

### isInstanceofMaterial

> **isInstanceofMaterial**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:43](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L43)

Flag indicating whether it is a material instance

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`isInstanceofMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#isinstanceofmaterial)

***

***

### opacity

> **opacity**: `number`

Defined in: [src/material/core/ABaseMaterial.ts:28](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L28)

Opacity of the material (0.0 to 1.0)

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`opacity`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#opacity)

***

***

### tint

> **tint**: [`ColorRGBA`](../../Color/classes/ColorRGBA.md)

Defined in: [src/material/core/ABaseMaterial.ts:33](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L33)

Tint color of the material (ColorRGBA)

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`tint`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#tint)

***

***

### use2PathRender

> **use2PathRender**: `boolean`

Defined in: [src/material/pbrMaterial/PBRMaterial.ts:210](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/pbrMaterial/PBRMaterial.ts#L210)

Whether to use 2-pass transparent rendering

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`use2PathRender`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#use2pathrender)

***

***

### useTint

> **useTint**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:38](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L38)

Whether to apply tint color

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`useTint`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#usetint)

***

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`antialiasingManager`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#antialiasingmanager)

***

***

### blendAlphaState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **blendAlphaState**(): [`BlendState`](../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:292](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L292)

Returns the alpha blend state object.

##### Returns

[`BlendState`](../../RenderState/classes/BlendState.md)

Alpha BlendState instance

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`blendAlphaState`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#blendalphastate)

***

***

### blendColorState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **blendColorState**(): [`BlendState`](../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:280](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L280)

Returns the color blend state object.

##### Returns

[`BlendState`](../../RenderState/classes/BlendState.md)

Color BlendState instance

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`blendColorState`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#blendcolorstate)

***

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:61](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/resources/core/ResourceBase.ts#L61)

Gets or sets the cache key.

##### Returns

`string`

Cache key string

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/resources/core/ResourceBase.ts#L65)

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

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L92)

Returns the `CommandEncoderManager` instance managing WebGPU command encoding.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` instance

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`commandEncoderManager`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#commandencodermanager)

***

***

### FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:232](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L232)

Returns the fragment bind group descriptor name.

##### Returns

`string`

Bind group descriptor name

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#fragment_bind_group_descriptor_name)

***

***

### FRAGMENT\_SHADER\_MODULE\_NAME

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **FRAGMENT\_SHADER\_MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:220](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L220)

Returns the fragment shader module name.

##### Returns

`string`

Fragment shader module name

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`FRAGMENT_SHADER_MODULE_NAME`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#fragment_shader_module_name)

***

***

### globalFragmentSlotIndex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **globalFragmentSlotIndex**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:320](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L320)

Returns the allocated slot index within the global fragment SSBO.

##### Returns

`number`

Allocated slot index (`-1` if unallocated)

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`globalFragmentSlotIndex`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#globalfragmentslotindex)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:89](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/resources/core/ResourceBase.ts#L89)

Returns the associated GPUDevice.

##### Returns

`GPUDevice`

GPUDevice instance

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`gpuDevice`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#gpudevice)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L36)

Returns the unique sequential instance ID assigned per class.

##### Returns

`number`

Per-class unique instance ID

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`instanceId`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#instanceid)

***

***

### MODULE\_NAME

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:208](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L208)

Returns the material module name.

##### Returns

`string`

Module name

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`MODULE_NAME`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#module_name)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L63)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L70)

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

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L44)

Returns the bound `RedGPUContext` instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` instance

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`redGPUContext`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L68)

Returns the `ResourceManager` instance managing global GPU resources.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` instance

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`resourceManager`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#resourcemanager)

***

***

### resourceManagerKey

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:77](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/resources/core/ResourceBase.ts#L77)

Returns the resource manager key.

##### Returns

`string`

Resource manager key string

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`resourceManagerKey`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#resourcemanagerkey)

***

***

### revision

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **revision**(): `number`

Defined in: [src/resources/core/ResourceBase.ts:49](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/resources/core/ResourceBase.ts#L49)

Returns the revision (update count) of the resource.

##### Returns

`number`

Resource revision number

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`revision`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#revision)

***

***

### SHADER\_INFO

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **SHADER\_INFO**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:256](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L256)

Returns the complete parsed WGSL shader information.

##### Returns

`any`

Parsed shader information object

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`SHADER_INFO`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#shader_info)

***

***

### STORAGE\_STRUCT

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **STORAGE\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:244](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L244)

Returns the parsed shader storage structure information.

##### Returns

`any`

Storage structure information

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`STORAGE_STRUCT`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#storage_struct)

***

***

### textureOffset

#### Get Signature

> **get** **textureOffset**(): \[`number`, `number`\]

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:71](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/AUVTransformBaseMaterial.ts#L71)

Returns or sets the texture UV offset `[u, v]`.

##### Returns

\[`number`, `number`\]

UV offset tuple `[u, v]` (default: `[0, 0]`)

#### Set Signature

> **set** **textureOffset**(`value`): `void`

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:75](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/AUVTransformBaseMaterial.ts#L75)

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

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:88](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/AUVTransformBaseMaterial.ts#L88)

Returns or sets the texture UV tiling scale `[u, v]`.

##### Returns

\[`number`, `number`\]

UV scale tuple `[u, v]` (default: `[1, 1]`)

#### Set Signature

> **set** **textureScale**(`value`): `void`

Defined in: [src/material/core/AUVTransformBaseMaterial.ts:92](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/AUVTransformBaseMaterial.ts#L92)

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

Defined in: [src/material/core/ABaseMaterial.ts:175](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L175)

Returns the key name of the currently set tint blend mode or sets a new mode.

##### Throws

Throws an Error if an invalid tint blend mode value or key is specified

##### Returns

`string`

Tint blend mode key string (e.g., `'MULTIPLY'`)

#### Set Signature

> **set** **tintBlendMode**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:183](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L183)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `"SUBTRACT"` \| `"NORMAL"` \| `"MULTIPLY"` \| `"LIGHTEN"` \| `"SCREEN"` \| `"LINEAR_DODGE"` \| `"DARKEN"` \| `"OVERLAY"` \| `"COLOR_DODGE"` \| `"COLOR_BURN"` \| `"HARD_LIGHT"` \| `"SOFT_LIGHT"` \| `"DIFFERENCE"` \| `"EXCLUSION"` \| `"DIVIDE"` \| `"VIVID_LIGHT"` \| `"LINEAR_BURN"` \| `"PIN_LIGHT"` \| `"SATURATION"` \| `"HUE"` \| `"LUMINOSITY"` \| `"COLOR"` \| `"NEGATION"` \| [`TINT_BLEND_MODE`](../type-aliases/TINT_BLEND_MODE.md) |

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`tintBlendMode`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#tintblendmode)

***

***

### transparent

#### Get Signature

> **get** **transparent**(): `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:87](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L87)

Gets or sets whether transparent rendering is enabled for the material.

##### Returns

`boolean`

#### Set Signature

> **set** **transparent**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:91](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L91)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`transparent`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#transparent)

***

***

### UNIFORM\_STRUCT

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **UNIFORM\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:268](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L268)

Returns the parsed shader uniform structure information.

##### Returns

`any`

Uniform structure information

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`UNIFORM_STRUCT`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#uniform_struct)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`uuid`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#uuid)

***

***

### writeMaskState

#### Get Signature

> **get** **writeMaskState**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:304](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L304)

Returns or sets the color write mask (GPUColorWrite) state.

##### Returns

`number`

GPUFlagsConstant value

#### Set Signature

> **set** **writeMaskState**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:308](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L308)

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

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:102](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/resources/core/ResourceBase.ts#L102)

Adds a pipeline dirty listener to be called when the resource changes.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to register |

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`__addDirtyPipelineListener`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#__adddirtypipelinelistener)

***

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:115](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/resources/core/ResourceBase.ts#L115)

Removes a registered pipeline dirty listener.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | Listener function to remove |

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`__removeDirtyPipelineListener`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#__removedirtypipelinelistener)

***

***

### \_updateBaseProperty()

> **\_updateBaseProperty**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:477](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L477)

Synchronizes basic material properties (uniforms, colors, tint, etc.) to the uniform buffer and global SSBO.

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`_updateBaseProperty`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#_updatebaseproperty)

***

***

### \_updateFragmentState()

> **\_updateFragmentState**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:372](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L372)

Checks shader variants and updates the fragment bind group and render state.

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`_updateFragmentState`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#_updatefragmentstate)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:526](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L526)

Destroys the material instance and releases allocated uniform buffers and global fragment slots.

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`destroy`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#destroy)

***

***

### getFragmentRenderState()

> **getFragmentRenderState**(`entryPoint?`): `GPUFragmentState`

Defined in: [src/material/core/ABaseMaterial.ts:445](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L445)

Creates and returns a GPU fragment render state (GPUFragmentState) object.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `entryPoint?` | `string` | `'main'` | Fragment shader entry point function name (default: `'main'`) |

#### Returns

`GPUFragmentState`

Configured GPUFragmentState object

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`getFragmentRenderState`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#getfragmentrenderstate)

***

***

### getGPUResourceSampler()

> **getGPUResourceSampler**(`sampler`): `GPUSampler`

Defined in: [src/material/core/ABaseMaterial.ts:518](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L518)

Returns the GPUSampler from a Sampler instance, or the default GPUSampler if not provided.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sampler` | [`Sampler`](../../Resource/classes/Sampler.md) | Sampler instance |

#### Returns

`GPUSampler`

GPUSampler instance

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`getGPUResourceSampler`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#getgpuresourcesampler)

***

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:328](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABaseMaterial.ts#L328)

Initializes GPU fragment render pipeline information and uniform buffers.

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`initGPURenderInfos`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#initgpurenderinfos)

***

***

### notifyUpdate()

> **notifyUpdate**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:131](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/resources/core/ResourceBase.ts#L131)

Notifies registered listeners that the resource has been updated.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList?` | `boolean` | `false` | Whether to reset the listener list after notification (default: false) |

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`notifyUpdate`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#notifyupdate)

***

***

### updateSampler()

> **updateSampler**(`prevSampler`, `newSampler`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:80](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABitmapBaseMaterial.ts#L80)

Updates pipeline dirty listeners upon sampler change and refreshes the fragment state.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prevSampler` | [`Sampler`](../../Resource/classes/Sampler.md) | Previously bound Sampler instance |
| `newSampler` | [`Sampler`](../../Resource/classes/Sampler.md) | New Sampler instance to bind |

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`updateSampler`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#updatesampler)

***

***

### updateTexture()

> **updateTexture**(`prevTexture`, `texture`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:63](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/material/core/ABitmapBaseMaterial.ts#L63)

Updates pipeline dirty listeners upon texture change and refreshes the fragment state.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prevTexture` | `any` | Previously bound texture object |
| `texture` | `any` | New texture object to bind |

#### Returns

`void`

#### Inherited from

[`AUVTransformBaseMaterial`](../namespaces/Core/classes/AUVTransformBaseMaterial.md).[`updateTexture`](../namespaces/Core/classes/AUVTransformBaseMaterial.md#updatetexture)

</details>
