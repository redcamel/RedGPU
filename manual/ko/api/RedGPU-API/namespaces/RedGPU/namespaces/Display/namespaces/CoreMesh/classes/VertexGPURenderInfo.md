[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreMesh](../README.md) / VertexGPURenderInfo

# Class: VertexGPURenderInfo

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:16](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/VertexGPURenderInfo.ts#L16)

GPU 버텍스 렌더링 파이프라인 및 리소스 정보를 관리하는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Constructors

### Constructor

> **new VertexGPURenderInfo**(`vertexShaderModule`, `vertexShaderSourceVariant`, `vertexShaderVariantConditionalBlocks`, `vertexUniformInfo`, `vertexBindGroupLayout`, `vertexUniformBuffer`, `vertexUniformBindGroup`, `pipeline`, `shadowPipeline?`, `pickingPipeline?`): `VertexGPURenderInfo`

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:108](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/VertexGPURenderInfo.ts#L108)

VertexGPURenderInfo 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `vertexShaderModule` | `GPUShaderModule` | 버텍스 셰이더 모듈 |
| `vertexShaderSourceVariant` | [`ShaderVariantGenerator`](../../../../Resource/namespaces/CoreWGSLParser/classes/ShaderVariantGenerator.md) | 버텍스 셰이더 바리안트 생성기 |
| `vertexShaderVariantConditionalBlocks` | `string`[] | 버텍스 셰이더 조건부 블록 목록 |
| `vertexUniformInfo` | `any` | 버텍스 유니폼 정보 |
| `vertexBindGroupLayout` | `GPUBindGroupLayout` | 버텍스 바인드 그룹 레이아웃 |
| `vertexUniformBuffer` | [`StorageBuffer`](../../../../Resource/classes/StorageBuffer.md) \| [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md) | 버텍스 유니폼 또는 스토리지 버퍼 |
| `vertexUniformBindGroup` | `GPUBindGroup` | 버텍스 유니폼 바인드 그룹 |
| `pipeline` | `GPURenderPipeline` | 기본 렌더 파이프라인 |
| `shadowPipeline?` | `GPURenderPipeline` | 그림자 렌더 파이프라인 (선택) |
| `pickingPipeline?` | `GPURenderPipeline` | 피킹 렌더 파이프라인 (선택) |

#### Returns

`VertexGPURenderInfo`

## Properties

### pickingPipeline

> **pickingPipeline**: `GPURenderPipeline`

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:71](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/VertexGPURenderInfo.ts#L71)

피킹 렌더 파이프라인

***

### pipeline

> **pipeline**: `GPURenderPipeline`

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:61](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/VertexGPURenderInfo.ts#L61)

기본 렌더 파이프라인

***

### shadowPipeline

> **shadowPipeline**: `GPURenderPipeline`

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:66](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/VertexGPURenderInfo.ts#L66)

그림자 렌더 파이프라인

***

### vertexBindGroupLayout

> **vertexBindGroupLayout**: `GPUBindGroupLayout`

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:46](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/VertexGPURenderInfo.ts#L46)

버텍스 바인드 그룹 레이아웃

***

### vertexShaderModule

> **vertexShaderModule**: `GPUShaderModule`

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:21](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/VertexGPURenderInfo.ts#L21)

버텍스 셰이더 모듈

***

### vertexShaderSourceVariant

> **vertexShaderSourceVariant**: [`ShaderVariantGenerator`](../../../../Resource/namespaces/CoreWGSLParser/classes/ShaderVariantGenerator.md)

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:26](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/VertexGPURenderInfo.ts#L26)

버텍스 셰이더 바리안트 생성기

***

### vertexShaderVariantConditionalBlocks

> **vertexShaderVariantConditionalBlocks**: `string`[]

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:31](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/VertexGPURenderInfo.ts#L31)

버텍스 셰이더 조건부 블록 목록

***

### vertexStructInfo

> **vertexStructInfo**: `any`

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/VertexGPURenderInfo.ts#L36)

버텍스 구조체 파싱 정보

***

### vertexUniformBindGroup

> **vertexUniformBindGroup**: `GPUBindGroup`

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:51](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/VertexGPURenderInfo.ts#L51)

버텍스 유니폼 바인드 그룹

***

### vertexUniformBuffer

> **vertexUniformBuffer**: [`StorageBuffer`](../../../../Resource/classes/StorageBuffer.md) \| [`UniformBuffer`](../../../../Resource/classes/UniformBuffer.md)

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:56](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/VertexGPURenderInfo.ts#L56)

버텍스 유니폼 또는 스토리지 버퍼

***

### vertexUniformInfo

> **vertexUniformInfo**: `any`

Defined in: [src/display/mesh/core/VertexGPURenderInfo.ts:41](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/mesh/core/VertexGPURenderInfo.ts#L41)

버텍스 유니폼 정보
