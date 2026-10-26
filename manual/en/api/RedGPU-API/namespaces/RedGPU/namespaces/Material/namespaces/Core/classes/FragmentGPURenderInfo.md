[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Material](../../../README.md) / [Core](../README.md) / FragmentGPURenderInfo

# Class: FragmentGPURenderInfo

Defined in: [src/material/core/FragmentGPURenderInfo.ts:25](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/FragmentGPURenderInfo.ts#L25)

Class that holds GPU rendering resources and pipeline state information for a fragment shader.

Automatically created internally during material initialization to manage shader modules, bind group layouts, uniform buffers, and bind groups.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

### Example
```typescript
// Access through a material instance
const renderInfo = material.gpuRenderInfo;
```

## Constructors

### Constructor

> **new FragmentGPURenderInfo**(`fragmentShaderModule`, `fragmentShaderSourceVariant`, `fragmentShaderVariantConditionalBlocks`, `fragmentUniformInfo`, `fragmentBindGroupLayout`, `fragmentUniformBuffer`, `fragmentUniformBindGroup?`, `fragmentState?`): `FragmentGPURenderInfo`

Defined in: [src/material/core/FragmentGPURenderInfo.ts:96](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/FragmentGPURenderInfo.ts#L96)

Creates a FragmentGPURenderInfo instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fragmentShaderModule` | `GPUShaderModule` | Fragment shader module |
| `fragmentShaderSourceVariant` | [`ShaderVariantGenerator`](../../../../Resource/namespaces/CoreWGSLParser/classes/ShaderVariantGenerator.md) | Fragment shader source variant generator |
| `fragmentShaderVariantConditionalBlocks` | `string`[] | List of fragment shader variant conditional blocks |
| `fragmentUniformInfo` | `any` | Fragment uniform structure information |
| `fragmentBindGroupLayout` | `GPUBindGroupLayout` | Fragment bind group layout |
| `fragmentUniformBuffer` | [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md) | Fragment uniform buffer |
| `fragmentUniformBindGroup?` | `GPUBindGroup` | Fragment uniform bind group (optional) |
| `fragmentState?` | `GPUFragmentState` | Fragment render state (optional) |

#### Returns

`FragmentGPURenderInfo`

## Properties

### fragmentBindGroupLayout

> **fragmentBindGroupLayout**: `GPUBindGroupLayout`

Defined in: [src/material/core/FragmentGPURenderInfo.ts:50](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/FragmentGPURenderInfo.ts#L50)

Fragment bind group layout (GPUBindGroupLayout)

***

### fragmentShaderModule

> **fragmentShaderModule**: `GPUShaderModule`

Defined in: [src/material/core/FragmentGPURenderInfo.ts:30](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/FragmentGPURenderInfo.ts#L30)

Compiled fragment GPUShaderModule

***

### fragmentShaderSourceVariant

> **fragmentShaderSourceVariant**: [`ShaderVariantGenerator`](../../../../Resource/namespaces/CoreWGSLParser/classes/ShaderVariantGenerator.md)

Defined in: [src/material/core/FragmentGPURenderInfo.ts:35](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/FragmentGPURenderInfo.ts#L35)

Fragment shader source variant generator

***

### fragmentShaderVariantConditionalBlocks

> **fragmentShaderVariantConditionalBlocks**: `string`[]

Defined in: [src/material/core/FragmentGPURenderInfo.ts:40](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/FragmentGPURenderInfo.ts#L40)

List of fragment shader conditional branch block identifiers

***

### fragmentState

> **fragmentState**: `GPUFragmentState`

Defined in: [src/material/core/FragmentGPURenderInfo.ts:65](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/FragmentGPURenderInfo.ts#L65)

Fragment render state (GPUFragmentState) used for pipeline creation

***

### fragmentUniformBindGroup

> **fragmentUniformBindGroup**: `GPUBindGroup`

Defined in: [src/material/core/FragmentGPURenderInfo.ts:60](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/FragmentGPURenderInfo.ts#L60)

Fragment uniform bind group (GPUBindGroup)

***

### fragmentUniformBuffer

> **fragmentUniformBuffer**: [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)

Defined in: [src/material/core/FragmentGPURenderInfo.ts:55](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/FragmentGPURenderInfo.ts#L55)

Fragment uniform buffer (UniformBuffer)

***

### fragmentUniformInfo

> **fragmentUniformInfo**: `any`

Defined in: [src/material/core/FragmentGPURenderInfo.ts:45](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/FragmentGPURenderInfo.ts#L45)

Parsed fragment uniform structure information

## Methods

### destroy()

> **destroy**(): `void`

Defined in: [src/material/core/FragmentGPURenderInfo.ts:120](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/material/core/FragmentGPURenderInfo.ts#L120)

Destroys the managed fragment uniform buffer and releases all references.

#### Returns

`void`
