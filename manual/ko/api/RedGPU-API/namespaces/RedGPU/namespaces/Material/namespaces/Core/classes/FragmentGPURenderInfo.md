[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Material](../../../README.md) / [Core](../README.md) / FragmentGPURenderInfo

# Class: FragmentGPURenderInfo

Defined in: [src/material/core/FragmentGPURenderInfo.ts:14](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/FragmentGPURenderInfo.ts#L14)

GPU 프래그먼트 렌더링 작업에 대한 정보를 나타냅니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Constructors

### Constructor

> **new FragmentGPURenderInfo**(`fragmentShaderModule`, `fragmentShaderSourceVariant`, `fragmentShaderVariantConditionalBlocks`, `fragmentUniformInfo`, `fragmentBindGroupLayout`, `fragmentUniformBuffer`, `fragmentUniformBindGroup?`, `fragmentState?`): `FragmentGPURenderInfo`

Defined in: [src/material/core/FragmentGPURenderInfo.ts:84](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/FragmentGPURenderInfo.ts#L84)

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

Defined in: [src/material/core/FragmentGPURenderInfo.ts:39](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/FragmentGPURenderInfo.ts#L39)

프래그먼트 바인드 그룹 레이아웃

***

### fragmentShaderModule

> **fragmentShaderModule**: `GPUShaderModule`

Defined in: [src/material/core/FragmentGPURenderInfo.ts:19](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/FragmentGPURenderInfo.ts#L19)

프래그먼트 셰이더 모듈

***

### fragmentShaderSourceVariant

> **fragmentShaderSourceVariant**: [`ShaderVariantGenerator`](../../../../Resource/namespaces/CoreWGSLParser/classes/ShaderVariantGenerator.md)

Defined in: [src/material/core/FragmentGPURenderInfo.ts:24](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/FragmentGPURenderInfo.ts#L24)

프래그먼트 셰이더 소스 바리안트 생성기

***

### fragmentShaderVariantConditionalBlocks

> **fragmentShaderVariantConditionalBlocks**: `string`[]

Defined in: [src/material/core/FragmentGPURenderInfo.ts:29](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/FragmentGPURenderInfo.ts#L29)

프래그먼트 셰이더 바리안트 조건부 블록 리스트

***

### fragmentState

> **fragmentState**: `GPUFragmentState`

Defined in: [src/material/core/FragmentGPURenderInfo.ts:54](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/FragmentGPURenderInfo.ts#L54)

프래그먼트 렌더 상태

***

### fragmentUniformBindGroup

> **fragmentUniformBindGroup**: `GPUBindGroup`

Defined in: [src/material/core/FragmentGPURenderInfo.ts:49](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/FragmentGPURenderInfo.ts#L49)

프래그먼트 유니폼 바인드 그룹

***

### fragmentUniformBuffer

> **fragmentUniformBuffer**: [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)

Defined in: [src/material/core/FragmentGPURenderInfo.ts:44](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/FragmentGPURenderInfo.ts#L44)

프래그먼트 유니폼 버퍼

***

### fragmentUniformInfo

> **fragmentUniformInfo**: `any`

Defined in: [src/material/core/FragmentGPURenderInfo.ts:34](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/material/core/FragmentGPURenderInfo.ts#L34)

프래그먼트 유니폼 정보
