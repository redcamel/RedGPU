[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RenderState](../README.md) / BlendState

# Class: BlendState

Defined in: [src/renderState/BlendState.ts:24](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/renderState/BlendState.ts#L24)

머티리얼의 색상 및 알파 블렌딩 동작을 제어하는 상태 클래스입니다.


렌더 파이프라인에서 소스와 대상 색상을 어떻게 혼합할지 정의하며, 투명도나 합성 효과를 구현하는 데 사용됩니다.


* ### Example
```typescript
const blendState = material.blendState;
blendState.operation = RedGPU.GPU_BLEND_OPERATION.ADD;
blendState.srcFactor = RedGPU.GPU_BLEND_FACTOR.SRC_ALPHA;
blendState.dstFactor = RedGPU.GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;
```

## Constructors

### Constructor

> **new BlendState**(`targetMaterial`, `srcFactor?`, `dstFactor?`, `operation?`): `BlendState`

Defined in: [src/renderState/BlendState.ts:52](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/renderState/BlendState.ts#L52)

BlendState 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetMaterial` | `any` | 블렌드 상태가 적용될 머티리얼
| `srcFactor?` | `GPUBlendFactor` | 소스 블렌드 팩터
| `dstFactor?` | `GPUBlendFactor` | 대상 블렌드 팩터
| `operation?` | `GPUBlendOperation` | 블렌드 연산

#### Returns

`BlendState`

## Properties

### state

> **state**: `GPUBlendComponent`

Defined in: [src/renderState/BlendState.ts:29](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/renderState/BlendState.ts#L29)

최종 GPUBlendComponent 상태 객체


## Accessors

### dstFactor

#### Get Signature

> **get** **dstFactor**(): `GPUBlendFactor`

Defined in: [src/renderState/BlendState.ts:107](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/renderState/BlendState.ts#L107)

대상(Destination) 블렌드 팩터를 가져오거나 설정합니다.


##### Returns

`GPUBlendFactor`

현재 설정된 GPUBlendFactor


#### Set Signature

> **set** **dstFactor**(`newDstFactor`): `void`

Defined in: [src/renderState/BlendState.ts:111](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/renderState/BlendState.ts#L111)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `newDstFactor` | `GPUBlendFactor` |

##### Returns

`void`

***

### operation

#### Get Signature

> **get** **operation**(): `GPUBlendOperation`

Defined in: [src/renderState/BlendState.ts:67](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/renderState/BlendState.ts#L67)

블렌드 연산 방식을 가져오거나 설정합니다.


##### Returns

`GPUBlendOperation`

현재 설정된 GPUBlendOperation


#### Set Signature

> **set** **operation**(`newOperation`): `void`

Defined in: [src/renderState/BlendState.ts:71](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/renderState/BlendState.ts#L71)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `newOperation` | `GPUBlendOperation` |

##### Returns

`void`

***

### srcFactor

#### Get Signature

> **get** **srcFactor**(): `GPUBlendFactor`

Defined in: [src/renderState/BlendState.ts:87](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/renderState/BlendState.ts#L87)

소스(Source) 블렌드 팩터를 가져오거나 설정합니다.


##### Returns

`GPUBlendFactor`

현재 설정된 GPUBlendFactor


#### Set Signature

> **set** **srcFactor**(`newSrcFactor`): `void`

Defined in: [src/renderState/BlendState.ts:91](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/renderState/BlendState.ts#L91)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `newSrcFactor` | `GPUBlendFactor` |

##### Returns

`void`
