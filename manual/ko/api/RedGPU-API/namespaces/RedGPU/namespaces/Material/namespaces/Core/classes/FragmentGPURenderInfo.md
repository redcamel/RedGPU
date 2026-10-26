[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Material](../../../README.md) / [Core](../README.md) / FragmentGPURenderInfo

# Class: FragmentGPURenderInfo

Defined in: [src/material/core/FragmentGPURenderInfo.ts:25](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/FragmentGPURenderInfo.ts#L25)

프래그먼트 셰이더의 GPU 렌더링 리소스 및 파이프라인 상태 정보를 보관하는 클래스입니다.

머티리얼 초기화 시 내부적으로 자동 생성되어 셰이더 모듈, 바인드 그룹 레이아웃, 유니폼 버퍼 및 바인드 그룹을 관리합니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

### Example
```typescript
// 머티리얼 인스턴스를 통해 접근
const renderInfo = material.gpuRenderInfo;
```

## Constructors

### Constructor

> **new FragmentGPURenderInfo**(`fragmentShaderModule`, `fragmentShaderSourceVariant`, `fragmentShaderVariantConditionalBlocks`, `fragmentUniformInfo`, `fragmentBindGroupLayout`, `fragmentUniformBuffer`, `fragmentUniformBindGroup?`, `fragmentState?`): `FragmentGPURenderInfo`

Defined in: [src/material/core/FragmentGPURenderInfo.ts:96](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/FragmentGPURenderInfo.ts#L96)

FragmentGPURenderInfo 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fragmentShaderModule` | `GPUShaderModule` | 프래그먼트 셰이더 모듈 |
| `fragmentShaderSourceVariant` | [`ShaderVariantGenerator`](../../../../Resource/namespaces/CoreWGSLParser/classes/ShaderVariantGenerator.md) | 프래그먼트 셰이더 소스 바리안트 생성기 |
| `fragmentShaderVariantConditionalBlocks` | `string`[] | 프래그먼트 셰이더 바리안트 조건부 블록 목록 |
| `fragmentUniformInfo` | `any` | 프래그먼트 유니폼 구조체 정보 |
| `fragmentBindGroupLayout` | `GPUBindGroupLayout` | 프래그먼트 바인드 그룹 레이아웃 |
| `fragmentUniformBuffer` | [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md) | 프래그먼트 유니폼 버퍼 |
| `fragmentUniformBindGroup?` | `GPUBindGroup` | 프래그먼트 유니폼 바인드 그룹 (선택) |
| `fragmentState?` | `GPUFragmentState` | 프래그먼트 렌더 상태 (선택) |

#### Returns

`FragmentGPURenderInfo`

## Properties

### fragmentBindGroupLayout

> **fragmentBindGroupLayout**: `GPUBindGroupLayout`

Defined in: [src/material/core/FragmentGPURenderInfo.ts:50](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/FragmentGPURenderInfo.ts#L50)

프래그먼트 바인드 그룹 레이아웃 (GPUBindGroupLayout)

***

### fragmentShaderModule

> **fragmentShaderModule**: `GPUShaderModule`

Defined in: [src/material/core/FragmentGPURenderInfo.ts:30](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/FragmentGPURenderInfo.ts#L30)

컴파일된 프래그먼트 GPUShaderModule

***

### fragmentShaderSourceVariant

> **fragmentShaderSourceVariant**: [`ShaderVariantGenerator`](../../../../Resource/namespaces/CoreWGSLParser/classes/ShaderVariantGenerator.md)

Defined in: [src/material/core/FragmentGPURenderInfo.ts:35](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/FragmentGPURenderInfo.ts#L35)

프래그먼트 셰이더 소스 바리안트 생성기

***

### fragmentShaderVariantConditionalBlocks

> **fragmentShaderVariantConditionalBlocks**: `string`[]

Defined in: [src/material/core/FragmentGPURenderInfo.ts:40](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/FragmentGPURenderInfo.ts#L40)

프래그먼트 셰이더 조건부 분기 블록 식별자 목록

***

### fragmentState

> **fragmentState**: `GPUFragmentState`

Defined in: [src/material/core/FragmentGPURenderInfo.ts:65](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/FragmentGPURenderInfo.ts#L65)

파이프라인 생성에 사용되는 프래그먼트 렌더 상태 (GPUFragmentState)

***

### fragmentUniformBindGroup

> **fragmentUniformBindGroup**: `GPUBindGroup`

Defined in: [src/material/core/FragmentGPURenderInfo.ts:60](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/FragmentGPURenderInfo.ts#L60)

프래그먼트 유니폼 바인드 그룹 (GPUBindGroup)

***

### fragmentUniformBuffer

> **fragmentUniformBuffer**: [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)

Defined in: [src/material/core/FragmentGPURenderInfo.ts:55](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/FragmentGPURenderInfo.ts#L55)

프래그먼트 유니폼 버퍼 (UniformBuffer)

***

### fragmentUniformInfo

> **fragmentUniformInfo**: `any`

Defined in: [src/material/core/FragmentGPURenderInfo.ts:45](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/FragmentGPURenderInfo.ts#L45)

파싱된 프래그먼트 유니폼 구조체 정보

## Methods

### destroy()

> **destroy**(): `void`

Defined in: [src/material/core/FragmentGPURenderInfo.ts:120](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/FragmentGPURenderInfo.ts#L120)

관리 중인 프래그먼트 유니폼 버퍼를 파기하고 모든 참조를 해제합니다.

#### Returns

`void`
