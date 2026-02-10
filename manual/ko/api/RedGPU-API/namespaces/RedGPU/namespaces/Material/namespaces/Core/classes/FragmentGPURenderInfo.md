[**RedGPU API v4.0.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Material](../../../README.md) / [Core](../README.md) / FragmentGPURenderInfo

# Class: FragmentGPURenderInfo

Defined in: [src/material/core/FragmentGPURenderInfo.ts:9](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/FragmentGPURenderInfo.ts#L9)

GPU 프래그먼트 렌더링 작업에 대한 정보를 나타냅니다.


## Constructors

### Constructor

> **new FragmentGPURenderInfo**(`fragmentShaderModule`, `fragmentShaderSourceVariant`, `fragmentShaderVariantConditionalBlocks`, `fragmentUniformInfo`, `fragmentBindGroupLayout`, `fragmentUniformBuffer`, `fragmentUniformBindGroup?`, `fragmentState?`): `FragmentGPURenderInfo`

Defined in: [src/material/core/FragmentGPURenderInfo.ts:79](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/FragmentGPURenderInfo.ts#L79)

FragmentGPURenderInfo 생성자


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fragmentShaderModule` | `GPUShaderModule` | 프래그먼트 셰이더 모듈
| `fragmentShaderSourceVariant` | [`ShaderVariantGenerator`](../../../../Resource/namespaces/CoreWGSLParser/classes/ShaderVariantGenerator.md) | 프래그먼트 셰이더 소스 바리안트 생성기
| `fragmentShaderVariantConditionalBlocks` | `string`[] | 프래그먼트 셰이더 바리안트 조건부 블록 리스트
| `fragmentUniformInfo` | `any` | 프래그먼트 유니폼 정보
| `fragmentBindGroupLayout` | `GPUBindGroupLayout` | 프래그먼트 바인드 그룹 레이아웃
| `fragmentUniformBuffer` | [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md) | 프래그먼트 유니폼 버퍼
| `fragmentUniformBindGroup?` | `GPUBindGroup` | 프래그먼트 유니폼 바인드 그룹
| `fragmentState?` | `GPUFragmentState` | 프래그먼트 렌더 상태

#### Returns

`FragmentGPURenderInfo`

## Properties

### fragmentBindGroupLayout

> **fragmentBindGroupLayout**: `GPUBindGroupLayout`

Defined in: [src/material/core/FragmentGPURenderInfo.ts:34](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/FragmentGPURenderInfo.ts#L34)

프래그먼트 바인드 그룹 레이아웃


***

### fragmentShaderModule

> **fragmentShaderModule**: `GPUShaderModule`

Defined in: [src/material/core/FragmentGPURenderInfo.ts:14](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/FragmentGPURenderInfo.ts#L14)

프래그먼트 셰이더 모듈


***

### fragmentShaderSourceVariant

> **fragmentShaderSourceVariant**: [`ShaderVariantGenerator`](../../../../Resource/namespaces/CoreWGSLParser/classes/ShaderVariantGenerator.md)

Defined in: [src/material/core/FragmentGPURenderInfo.ts:19](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/FragmentGPURenderInfo.ts#L19)

프래그먼트 셰이더 소스 바리안트 생성기


***

### fragmentShaderVariantConditionalBlocks

> **fragmentShaderVariantConditionalBlocks**: `string`[]

Defined in: [src/material/core/FragmentGPURenderInfo.ts:24](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/FragmentGPURenderInfo.ts#L24)

프래그먼트 셰이더 바리안트 조건부 블록 리스트


***

### fragmentState

> **fragmentState**: `GPUFragmentState`

Defined in: [src/material/core/FragmentGPURenderInfo.ts:49](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/FragmentGPURenderInfo.ts#L49)

프래그먼트 렌더 상태


***

### fragmentUniformBindGroup

> **fragmentUniformBindGroup**: `GPUBindGroup`

Defined in: [src/material/core/FragmentGPURenderInfo.ts:44](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/FragmentGPURenderInfo.ts#L44)

프래그먼트 유니폼 바인드 그룹


***

### fragmentUniformBuffer

> **fragmentUniformBuffer**: [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)

Defined in: [src/material/core/FragmentGPURenderInfo.ts:39](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/FragmentGPURenderInfo.ts#L39)

프래그먼트 유니폼 버퍼


***

### fragmentUniformInfo

> **fragmentUniformInfo**: `any`

Defined in: [src/material/core/FragmentGPURenderInfo.ts:29](https://github.com/redcamel/RedGPU/blob/b3274202eaabee728fa50abc8b146faf4bbca5f8/src/material/core/FragmentGPURenderInfo.ts#L29)

프래그먼트 유니폼 정보

