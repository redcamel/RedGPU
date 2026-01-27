[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreWGSLParser](../README.md) / ShaderVariantGenerator

# Class: ShaderVariantGenerator

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:17](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L17)


Utility class that generates various variant codes for WGSL shaders based on conditional blocks and define strings.


Processes conditional blocks according to the variant key (variantKey), dynamically generating and caching different shader sources.

::: warning

This class is automatically created by the system.<br/>Do not create an instance directly.
:::

## Constructors

### Constructor

> **new ShaderVariantGenerator**(`defines`, `conditionalBlocks`): `ShaderVariantGenerator`

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:32](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L32)


Creates a ShaderVariantGenerator instance. (Internal system only)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `defines` | `string` | Define string of WGSL shader (base source) |
| `conditionalBlocks` | `ConditionalBlock`[] | Array of conditional block information |

#### Returns

`ShaderVariantGenerator`

## Methods

### getCachedVariants()

> **getCachedVariants**(): `string`[]

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:64](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L64)


Returns the list of currently cached variant keys.

#### Returns

`string`[]

***

### getVariant()

> **getVariant**(`variantKey`): `string`

Defined in: [src/resources/wgslParser/core/ShaderVariantGenerator.ts:50](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/resources/wgslParser/core/ShaderVariantGenerator.ts#L50)


Lazy-generates shader code for a specific variant key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `variantKey` | `string` | String connecting conditional keys to activate with '+' (e.g., "FOO+BAR"), or 'none' if no conditions |

#### Returns

`string`


Variant WGSL shader code string
