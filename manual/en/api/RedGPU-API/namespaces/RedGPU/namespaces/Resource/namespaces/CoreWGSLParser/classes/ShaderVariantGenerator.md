[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreWGSLParser](../README.md) / ShaderVariantGenerator

# Class: ShaderVariantGenerator

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:14](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L14)

Utility class that dynamically generates and caches various WGSL shader variant codes based on conditional blocks and define strings.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Constructors

### Constructor

> **new ShaderVariantGenerator**(`defines`, `conditionalBlocks`): `ShaderVariantGenerator`

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:33](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L33)

Creates a ShaderVariantGenerator instance. (Internal system only)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `defines` | `string` | Define string of WGSL shader (base source) |
| `conditionalBlocks` | `ConditionalBlock`[] | Array of conditional block information |

#### Returns

`ShaderVariantGenerator`

## Methods

### addConditionalInfo()

> **addConditionalInfo**(`uniformName`, `textures`, `samplers`): `void`

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:69](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L69)

Adds texture and sampler information associated with a specific globalStruct key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `uniformName` | `string` | Uniform name |
| `textures` | `any`[] | Textures array to be activated in this condition |
| `samplers` | `any`[] | Samplers array to be activated in this condition |

#### Returns

`void`

***

### destroy()

> **destroy**(): `void`

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:192](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L192)

Explicitly releases references to cached variant codes and internal texture/sampler maps.

#### Returns

`void`

***

### getCachedVariants()

> **getCachedVariants**(): `string`[]

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:184](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L184)

Returns the list of currently cached variant keys.

#### Returns

`string`[]

Cached variant keys array

***

### getUnionSamplers()

> **getUnionSamplers**(): `any`[]

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:146](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L146)

Returns the list of all possible samplers (union).

#### Returns

`any`[]

All samplers array

***

### getUnionTextures()

> **getUnionTextures**(): `any`[]

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:129](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L129)

Returns the list of all possible textures (union).

#### Returns

`any`[]

All textures array

***

### getVariant()

> **getVariant**(`variantKey`): `string`

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:166](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L166)

Lazy-generates shader code for a specific variant key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `variantKey` | `string` | String connecting conditional keys to activate with '+' (e.g., "FOO+BAR"), or 'none' if no conditions |

#### Returns

`string`

Variant WGSL shader code string

***

### getVariantSamplers()

> **getVariantSamplers**(`variantKey`): `any`[]

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:108](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L108)

Returns the list of samplers activated for a specific variant key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `variantKey` | `string` | Variant key |

#### Returns

`any`[]

Activated samplers array

***

### getVariantTextures()

> **getVariantTextures**(`variantKey`): `any`[]

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:84](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L84)

Returns the list of textures activated for a specific variant key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `variantKey` | `string` | Variant key |

#### Returns

`any`[]

Activated textures array

***

### setBaseInfo()

> **setBaseInfo**(`textures`, `samplers`): `void`

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:51](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L51)

Sets the base texture and sampler information.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `textures` | `any`[] | Base textures array |
| `samplers` | `any`[] | Base samplers array |

#### Returns

`void`
