[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Material](../../../README.md) / [Core](../README.md) / FragmentGPURenderInfo

# Class: FragmentGPURenderInfo

Defined in: [src/material/core/FragmentGPURenderInfo.ts:9](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/material/core/FragmentGPURenderInfo.ts#L9)


Represents information about a GPU fragment render operation.

## Constructors

### Constructor

> **new FragmentGPURenderInfo**(`fragmentShaderModule`, `fragmentShaderSourceVariant`, `fragmentShaderVariantConditionalBlocks`, `fragmentUniformInfo`, `fragmentBindGroupLayout`, `fragmentUniformBuffer`, `fragmentUniformBindGroup?`, `fragmentState?`): `FragmentGPURenderInfo`

Defined in: [src/material/core/FragmentGPURenderInfo.ts:79](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/material/core/FragmentGPURenderInfo.ts#L79)


FragmentGPURenderInfo constructor

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fragmentShaderModule` | `GPUShaderModule` | Fragment shader module |
| `fragmentShaderSourceVariant` | [`ShaderVariantGenerator`](../../../../Resource/namespaces/CoreWGSLParser/classes/ShaderVariantGenerator.md) | Fragment shader source variant generator |
| `fragmentShaderVariantConditionalBlocks` | `string`[] | List of fragment shader variant conditional blocks |
| `fragmentUniformInfo` | `any` | Fragment uniform information |
| `fragmentBindGroupLayout` | `GPUBindGroupLayout` | Fragment bind group layout |
| `fragmentUniformBuffer` | [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md) | Fragment uniform buffer |
| `fragmentUniformBindGroup?` | `GPUBindGroup` | Fragment uniform bind group |
| `fragmentState?` | `GPUFragmentState` | Fragment render state |

#### Returns

`FragmentGPURenderInfo`

## Properties

### fragmentBindGroupLayout

> **fragmentBindGroupLayout**: `GPUBindGroupLayout`

Defined in: [src/material/core/FragmentGPURenderInfo.ts:34](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/material/core/FragmentGPURenderInfo.ts#L34)


Fragment bind group layout

***

### fragmentShaderModule

> **fragmentShaderModule**: `GPUShaderModule`

Defined in: [src/material/core/FragmentGPURenderInfo.ts:14](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/material/core/FragmentGPURenderInfo.ts#L14)


Fragment shader module

***

### fragmentShaderSourceVariant

> **fragmentShaderSourceVariant**: [`ShaderVariantGenerator`](../../../../Resource/namespaces/CoreWGSLParser/classes/ShaderVariantGenerator.md)

Defined in: [src/material/core/FragmentGPURenderInfo.ts:19](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/material/core/FragmentGPURenderInfo.ts#L19)


Fragment shader source variant generator

***

### fragmentShaderVariantConditionalBlocks

> **fragmentShaderVariantConditionalBlocks**: `string`[]

Defined in: [src/material/core/FragmentGPURenderInfo.ts:24](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/material/core/FragmentGPURenderInfo.ts#L24)


List of fragment shader variant conditional blocks

***

### fragmentState

> **fragmentState**: `GPUFragmentState`

Defined in: [src/material/core/FragmentGPURenderInfo.ts:49](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/material/core/FragmentGPURenderInfo.ts#L49)


Fragment render state

***

### fragmentUniformBindGroup

> **fragmentUniformBindGroup**: `GPUBindGroup`

Defined in: [src/material/core/FragmentGPURenderInfo.ts:44](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/material/core/FragmentGPURenderInfo.ts#L44)


Fragment uniform bind group

***

### fragmentUniformBuffer

> **fragmentUniformBuffer**: [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)

Defined in: [src/material/core/FragmentGPURenderInfo.ts:39](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/material/core/FragmentGPURenderInfo.ts#L39)


Fragment uniform buffer

***

### fragmentUniformInfo

> **fragmentUniformInfo**: `any`

Defined in: [src/material/core/FragmentGPURenderInfo.ts:29](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/material/core/FragmentGPURenderInfo.ts#L29)


Fragment uniform information
