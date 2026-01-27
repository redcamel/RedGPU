[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreMesh](../README.md) / VertexGPURenderInfo

# Class: VertexGPURenderInfo

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:10](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/mesh/core/VertexGPURenderInfo.ts#L10)

GPU 버텍스 렌더링 작업에 대한 정보를 나타내는 클래스입니다.


## Constructors

### Constructor

> **new VertexGPURenderInfo**(`vertexShaderModule`, `vertexShaderSourceVariant`, `vertexShaderVariantConditionalBlocks`, `vertexUniformInfo`, `vertexBindGroupLayout`, `vertexUniformBuffer`, `vertexUniformBindGroup`, `pipeline`, `shadowPipeline?`, `pickingPipeline?`): `VertexGPURenderInfo`

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:23](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/mesh/core/VertexGPURenderInfo.ts#L23)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `vertexShaderModule` | `GPUShaderModule` |
| `vertexShaderSourceVariant` | [`ShaderVariantGenerator`](../../../../Resource/namespaces/CoreWGSLParser/classes/ShaderVariantGenerator.md) |
| `vertexShaderVariantConditionalBlocks` | `string`[] |
| `vertexUniformInfo` | `any` |
| `vertexBindGroupLayout` | `GPUBindGroupLayout` |
| `vertexUniformBuffer` | [`StorageBuffer`](../../../../Resource/classes/StorageBuffer.md) \| [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md) |
| `vertexUniformBindGroup` | `GPUBindGroup` |
| `pipeline` | `GPURenderPipeline` |
| `shadowPipeline?` | `GPURenderPipeline` |
| `pickingPipeline?` | `GPURenderPipeline` |

#### Returns

`VertexGPURenderInfo`

## Properties

### pickingPipeline

> **pickingPipeline**: `GPURenderPipeline`

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:21](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/mesh/core/VertexGPURenderInfo.ts#L21)

***

### pipeline

> **pipeline**: `GPURenderPipeline`

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:19](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/mesh/core/VertexGPURenderInfo.ts#L19)

***

### shadowPipeline

> **shadowPipeline**: `GPURenderPipeline`

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:20](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/mesh/core/VertexGPURenderInfo.ts#L20)

***

### vertexBindGroupLayout

> **vertexBindGroupLayout**: `GPUBindGroupLayout`

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:16](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/mesh/core/VertexGPURenderInfo.ts#L16)

***

### vertexShaderModule

> **vertexShaderModule**: `GPUShaderModule`

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:11](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/mesh/core/VertexGPURenderInfo.ts#L11)

***

### vertexShaderSourceVariant

> **vertexShaderSourceVariant**: [`ShaderVariantGenerator`](../../../../Resource/namespaces/CoreWGSLParser/classes/ShaderVariantGenerator.md)

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:12](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/mesh/core/VertexGPURenderInfo.ts#L12)

***

### vertexShaderVariantConditionalBlocks

> **vertexShaderVariantConditionalBlocks**: `string`[]

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:13](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/mesh/core/VertexGPURenderInfo.ts#L13)

***

### vertexStructInfo

> **vertexStructInfo**: `any`

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:14](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/mesh/core/VertexGPURenderInfo.ts#L14)

***

### vertexUniformBindGroup

> **vertexUniformBindGroup**: `GPUBindGroup`

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:17](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/mesh/core/VertexGPURenderInfo.ts#L17)

***

### vertexUniformBuffer

> **vertexUniformBuffer**: [`StorageBuffer`](../../../../Resource/classes/StorageBuffer.md) \| [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:18](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/mesh/core/VertexGPURenderInfo.ts#L18)

***

### vertexUniformInfo

> **vertexUniformInfo**: `any`

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:15](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/display/mesh/core/VertexGPURenderInfo.ts#L15)
