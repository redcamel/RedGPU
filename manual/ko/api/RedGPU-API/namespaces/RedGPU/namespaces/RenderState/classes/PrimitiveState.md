[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RenderState](../README.md) / PrimitiveState

# Class: PrimitiveState

Defined in: [src/renderState/PrimitiveState.ts:31](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/PrimitiveState.ts#L31)

객체의 프리미티브(Primitive) 토폴로지, 앞면 방향 및 면 컬링 방식을 제어하는 렌더 상태 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

### Example
```typescript
const primitiveState = mesh.primitiveState;
primitiveState.topology = RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_STRIP;
primitiveState.cullMode = RedGPU.GPU_CULL_MODE.BACK;
```

## Constructors

### Constructor

> **new PrimitiveState**(`targetObject3D`): `PrimitiveState`

Defined in: [src/renderState/PrimitiveState.ts:57](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/PrimitiveState.ts#L57)

PrimitiveState 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetObject3D` | `any` | 상태가 적용될 대상 3D 객체 |

#### Returns

`PrimitiveState`

## Properties

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `false`

Defined in: [src/renderState/PrimitiveState.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/PrimitiveState.ts#L36)

파이프라인 갱신 필요 여부

***

### state

> **state**: `GPUPrimitiveState`

Defined in: [src/renderState/PrimitiveState.ts:41](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/PrimitiveState.ts#L41)

최종 생성된 `GPUPrimitiveState` 상태 객체

## Accessors

### cullMode

#### Get Signature

> **get** **cullMode**(): `GPUCullMode`

Defined in: [src/renderState/PrimitiveState.ts:127](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/PrimitiveState.ts#L127)

면 컬링(Culling) 모드를 반환하거나 설정합니다.

##### Returns

`GPUCullMode`

현재 설정된 `GPUCullMode` 값

#### Set Signature

> **set** **cullMode**(`mode`): `void`

Defined in: [src/renderState/PrimitiveState.ts:131](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/PrimitiveState.ts#L131)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `mode` | `GPUCullMode` |

##### Returns

`void`

***

### frontFace

#### Get Signature

> **get** **frontFace**(): `GPUFrontFace`

Defined in: [src/renderState/PrimitiveState.ts:108](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/PrimitiveState.ts#L108)

폴리곤의 앞면(Front Face) 판별 방향을 반환하거나 설정합니다.

##### Returns

`GPUFrontFace`

현재 설정된 `GPUFrontFace` 값

#### Set Signature

> **set** **frontFace**(`face`): `void`

Defined in: [src/renderState/PrimitiveState.ts:112](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/PrimitiveState.ts#L112)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `face` | `GPUFrontFace` |

##### Returns

`void`

***

### stripIndexFormat

#### Get Signature

> **get** **stripIndexFormat**(): `GPUIndexFormat`

Defined in: [src/renderState/PrimitiveState.ts:89](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/PrimitiveState.ts#L89)

스트립 토폴로지 사용 시 인덱스 포맷을 반환하거나 설정합니다.

##### Returns

`GPUIndexFormat`

현재 설정된 `GPUIndexFormat` 값

#### Set Signature

> **set** **stripIndexFormat**(`format`): `void`

Defined in: [src/renderState/PrimitiveState.ts:93](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/PrimitiveState.ts#L93)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `format` | `GPUIndexFormat` |

##### Returns

`void`

***

### topology

#### Get Signature

> **get** **topology**(): `GPUPrimitiveTopology`

Defined in: [src/renderState/PrimitiveState.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/PrimitiveState.ts#L70)

프리미티브 토폴로지를 반환하거나 설정합니다.

##### Returns

`GPUPrimitiveTopology`

현재 설정된 `GPUPrimitiveTopology` 값

#### Set Signature

> **set** **topology**(`value`): `void`

Defined in: [src/renderState/PrimitiveState.ts:74](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/PrimitiveState.ts#L74)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `GPUPrimitiveTopology` |

##### Returns

`void`

***

### unclippedDepth

#### Get Signature

> **get** **unclippedDepth**(): `boolean`

Defined in: [src/renderState/PrimitiveState.ts:146](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/PrimitiveState.ts#L146)

깊이 클리핑 비활성화 여부를 반환하거나 설정합니다.

##### Returns

`boolean`

깊이 클리핑 비활성화 여부

#### Set Signature

> **set** **unclippedDepth**(`state`): `void`

Defined in: [src/renderState/PrimitiveState.ts:150](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/renderState/PrimitiveState.ts#L150)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | `boolean` |

##### Returns

`void`
