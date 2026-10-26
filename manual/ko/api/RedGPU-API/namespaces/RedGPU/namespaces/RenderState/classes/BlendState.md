[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RenderState](../README.md) / BlendState

# Class: BlendState

Defined in: [src/renderState/BlendState.ts:27](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/BlendState.ts#L27)

머티리얼의 색상 및 알파 블렌딩 동작을 제어하는 렌더 상태 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

### Example
```typescript
const blendState = material.blendStateColor;
blendState.operation = RedGPU.GPU_BLEND_OPERATION.ADD;
blendState.srcFactor = RedGPU.GPU_BLEND_FACTOR.SRC_ALPHA;
blendState.dstFactor = RedGPU.GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;
```

## Constructors

### Constructor

> **new BlendState**(`targetMaterial`, `srcFactor?`, `dstFactor?`, `operation?`): `BlendState`

Defined in: [src/renderState/BlendState.ts:55](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/BlendState.ts#L55)

BlendState 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `targetMaterial` | `any` | `undefined` | 블렌드 상태가 적용될 대상 머티리얼 |
| `srcFactor?` | `GPUBlendFactor` | `GPU_BLEND_FACTOR.SRC_ALPHA` | 소스 블렌드 팩터 (기본값: `GPU_BLEND_FACTOR.SRC_ALPHA`) |
| `dstFactor?` | `GPUBlendFactor` | `GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA` | 대상 블렌드 팩터 (기본값: `GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA`) |
| `operation?` | `GPUBlendOperation` | `GPU_BLEND_OPERATION.ADD` | 블렌드 연산 방식 (기본값: `GPU_BLEND_OPERATION.ADD`) |

#### Returns

`BlendState`

## Properties

### state

> **state**: `GPUBlendComponent`

Defined in: [src/renderState/BlendState.ts:32](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/BlendState.ts#L32)

최종 생성된 `GPUBlendComponent` 상태 객체

## Accessors

### dstFactor

#### Get Signature

> **get** **dstFactor**(): `GPUBlendFactor`

Defined in: [src/renderState/BlendState.ts:110](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/BlendState.ts#L110)

대상(Destination) 블렌드 팩터를 반환하거나 설정합니다.

##### Returns

`GPUBlendFactor`

현재 설정된 대상 `GPUBlendFactor` 값

#### Set Signature

> **set** **dstFactor**(`newDstFactor`): `void`

Defined in: [src/renderState/BlendState.ts:114](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/BlendState.ts#L114)

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

Defined in: [src/renderState/BlendState.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/BlendState.ts#L70)

블렌드 연산 방식을 반환하거나 설정합니다.

##### Returns

`GPUBlendOperation`

현재 설정된 `GPUBlendOperation` 값

#### Set Signature

> **set** **operation**(`newOperation`): `void`

Defined in: [src/renderState/BlendState.ts:74](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/BlendState.ts#L74)

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

Defined in: [src/renderState/BlendState.ts:90](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/BlendState.ts#L90)

소스(Source) 블렌드 팩터를 반환하거나 설정합니다.

##### Returns

`GPUBlendFactor`

현재 설정된 소스 `GPUBlendFactor` 값

#### Set Signature

> **set** **srcFactor**(`newSrcFactor`): `void`

Defined in: [src/renderState/BlendState.ts:94](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/BlendState.ts#L94)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `newSrcFactor` | `GPUBlendFactor` |

##### Returns

`void`
