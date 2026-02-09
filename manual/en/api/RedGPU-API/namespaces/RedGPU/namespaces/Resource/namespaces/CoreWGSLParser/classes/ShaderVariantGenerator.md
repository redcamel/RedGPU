[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreWGSLParser](../README.md) / ShaderVariantGenerator

# Class: ShaderVariantGenerator

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:17](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L17)


Utility class that generates various variant codes for WGSL shaders based on conditional blocks and define strings.


Processes conditional blocks according to the variant key (variantKey), dynamically generating and caching different shader sources.

::: warning

This class is automatically created by the system.<br/>Do not create an instance directly.
:::

## Constructors

### Constructor

> **new ShaderVariantGenerator**(`defines`, `conditionalBlocks`): `ShaderVariantGenerator`

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:36](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L36)


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

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:72](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L72)


Adds texture and sampler information associated with a specific uniform key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `uniformName` | `string` | Uniform name |
| `textures` | `any`[] | Textures array to be activated in this condition |
| `samplers` | `any`[] | Samplers array to be activated in this condition |

#### Returns

`void`

***

### getCachedVariants()

> **getCachedVariants**(): `string`[]

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:186](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L186)


Returns the list of currently cached variant keys.

#### Returns

`string`[]


Cached variant keys array

***

### getUnionSamplers()

> **getUnionSamplers**(): `any`[]

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:149](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L149)


Returns the list of all possible samplers (union).

#### Returns

`any`[]


All samplers array

***

### getUnionTextures()

> **getUnionTextures**(): `any`[]

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:132](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L132)


Returns the list of all possible textures (union).

#### Returns

`any`[]


All textures array

***

### getVariant()

> **getVariant**(`variantKey`): `string`

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:169](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L169)


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

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:111](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L111)


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

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:87](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L87)


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

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:54](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L54)


Sets the base texture and sampler information.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `textures` | `any`[] | Base textures array |
| `samplers` | `any`[] | Base samplers array |

#### Returns

`void`
