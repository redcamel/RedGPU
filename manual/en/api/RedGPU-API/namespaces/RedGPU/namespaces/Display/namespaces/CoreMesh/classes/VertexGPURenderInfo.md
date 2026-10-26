[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreMesh](../README.md) / VertexGPURenderInfo

# Class: VertexGPURenderInfo

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:16](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/VertexGPURenderInfo.ts#L16)

Class that manages GPU vertex rendering pipeline and resource information.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Constructors

### Constructor

> **new VertexGPURenderInfo**(`vertexShaderModule`, `vertexShaderSourceVariant`, `vertexShaderVariantConditionalBlocks`, `vertexUniformInfo`, `vertexBindGroupLayout`, `vertexUniformBuffer`, `vertexUniformBindGroup`, `pipeline`, `shadowPipeline?`, `pickingPipeline?`): `VertexGPURenderInfo`

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:108](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/VertexGPURenderInfo.ts#L108)

Creates a VertexGPURenderInfo instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `vertexShaderModule` | `GPUShaderModule` | Vertex shader module |
| `vertexShaderSourceVariant` | [`ShaderVariantGenerator`](../../../../Resource/namespaces/CoreWGSLParser/classes/ShaderVariantGenerator.md) | Vertex shader variant generator |
| `vertexShaderVariantConditionalBlocks` | `string`[] | List of vertex shader conditional blocks |
| `vertexUniformInfo` | `any` | Vertex uniform information |
| `vertexBindGroupLayout` | `GPUBindGroupLayout` | Vertex bind group layout |
| `vertexUniformBuffer` | [`StorageBuffer`](../../../../Resource/classes/StorageBuffer.md) \| [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md) | Vertex uniform or storage buffer |
| `vertexUniformBindGroup` | `GPUBindGroup` | Vertex uniform bind group |
| `pipeline` | `GPURenderPipeline` | Base render pipeline |
| `shadowPipeline?` | `GPURenderPipeline` | Shadow render pipeline (optional) |
| `pickingPipeline?` | `GPURenderPipeline` | Picking render pipeline (optional) |

#### Returns

`VertexGPURenderInfo`

## Properties

### pickingPipeline

> **pickingPipeline**: `GPURenderPipeline`

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:71](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/VertexGPURenderInfo.ts#L71)

Picking render pipeline

***

### pipeline

> **pipeline**: `GPURenderPipeline`

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:61](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/VertexGPURenderInfo.ts#L61)

Base render pipeline

***

### shadowPipeline

> **shadowPipeline**: `GPURenderPipeline`

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:66](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/VertexGPURenderInfo.ts#L66)

Shadow render pipeline

***

### vertexBindGroupLayout

> **vertexBindGroupLayout**: `GPUBindGroupLayout`

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:46](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/VertexGPURenderInfo.ts#L46)

Vertex bind group layout

***

### vertexShaderModule

> **vertexShaderModule**: `GPUShaderModule`

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:21](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/VertexGPURenderInfo.ts#L21)

Vertex shader module

***

### vertexShaderSourceVariant

> **vertexShaderSourceVariant**: [`ShaderVariantGenerator`](../../../../Resource/namespaces/CoreWGSLParser/classes/ShaderVariantGenerator.md)

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:26](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/VertexGPURenderInfo.ts#L26)

Vertex shader variant generator

***

### vertexShaderVariantConditionalBlocks

> **vertexShaderVariantConditionalBlocks**: `string`[]

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:31](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/VertexGPURenderInfo.ts#L31)

List of vertex shader conditional blocks

***

### vertexStructInfo

> **vertexStructInfo**: `any`

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/VertexGPURenderInfo.ts#L36)

Vertex structure parsing information

***

### vertexUniformBindGroup

> **vertexUniformBindGroup**: `GPUBindGroup`

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:51](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/VertexGPURenderInfo.ts#L51)

Vertex uniform bind group

***

### vertexUniformBuffer

> **vertexUniformBuffer**: [`StorageBuffer`](../../../../Resource/classes/StorageBuffer.md) \| [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:56](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/VertexGPURenderInfo.ts#L56)

Vertex uniform or storage buffer

***

### vertexUniformInfo

> **vertexUniformInfo**: `any`

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:41](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/VertexGPURenderInfo.ts#L41)

Vertex uniform information
