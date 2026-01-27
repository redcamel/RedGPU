[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RenderState](../README.md) / PrimitiveState

# Class: PrimitiveState

Defined in: [src/renderState/PrimitiveState.ts:28](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/renderState/PrimitiveState.ts#L28)

객체의 도형(Primitive) 렌더링 방식 및 면 처리를 관리하는 클래스입니다.


삼각형/라인/포인트 등의 토폴로지 설정, 컬링 모드, 앞면 정의 및 인덱스 포맷 등을 제어합니다.


* ### Example
```typescript
const pState = mesh.primitiveState;
pState.topology = RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_STRIP;
pState.cullMode = RedGPU.GPU_CULL_MODE.BACK;
```

## Constructors

### Constructor

> **new PrimitiveState**(`targetObject3D`): `PrimitiveState`

Defined in: [src/renderState/PrimitiveState.ts:54](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/renderState/PrimitiveState.ts#L54)

PrimitiveState 인스턴스를 생성합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetObject3D` | `any` | 상태가 적용될 대상 객체

#### Returns

`PrimitiveState`

## Properties

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `false`

Defined in: [src/renderState/PrimitiveState.ts:33](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/renderState/PrimitiveState.ts#L33)

파이프라인 갱신 필요 여부


***

### state

> **state**: `GPUPrimitiveState`

Defined in: [src/renderState/PrimitiveState.ts:38](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/renderState/PrimitiveState.ts#L38)

최종 GPUPrimitiveState 상태 객체


## Accessors

### cullMode

#### Get Signature

> **get** **cullMode**(): `GPUCullMode`

Defined in: [src/renderState/PrimitiveState.ts:124](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/renderState/PrimitiveState.ts#L124)

컬링 모드를 가져오거나 설정합니다.


##### Returns

`GPUCullMode`

현재 설정된 GPUCullMode


#### Set Signature

> **set** **cullMode**(`mode`): `void`

Defined in: [src/renderState/PrimitiveState.ts:128](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/renderState/PrimitiveState.ts#L128)

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

Defined in: [src/renderState/PrimitiveState.ts:105](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/renderState/PrimitiveState.ts#L105)

앞면(Front Face) 정의 방식을 가져오거나 설정합니다.


##### Returns

`GPUFrontFace`

현재 설정된 GPUFrontFace


#### Set Signature

> **set** **frontFace**(`face`): `void`

Defined in: [src/renderState/PrimitiveState.ts:109](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/renderState/PrimitiveState.ts#L109)

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

Defined in: [src/renderState/PrimitiveState.ts:86](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/renderState/PrimitiveState.ts#L86)

스트립 인덱스 포맷을 가져오거나 설정합니다.


##### Returns

`GPUIndexFormat`

현재 설정된 GPUIndexFormat


#### Set Signature

> **set** **stripIndexFormat**(`format`): `void`

Defined in: [src/renderState/PrimitiveState.ts:90](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/renderState/PrimitiveState.ts#L90)

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

Defined in: [src/renderState/PrimitiveState.ts:67](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/renderState/PrimitiveState.ts#L67)

도형 토폴로지를 가져오거나 설정합니다.


##### Returns

`GPUPrimitiveTopology`

현재 설정된 GPUPrimitiveTopology


#### Set Signature

> **set** **topology**(`value`): `void`

Defined in: [src/renderState/PrimitiveState.ts:71](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/renderState/PrimitiveState.ts#L71)

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

Defined in: [src/renderState/PrimitiveState.ts:139](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/renderState/PrimitiveState.ts#L139)

깊이 클리핑 비활성화 여부를 가져오거나 설정합니다.


##### Returns

`boolean`

#### Set Signature

> **set** **unclippedDepth**(`state`): `void`

Defined in: [src/renderState/PrimitiveState.ts:143](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/renderState/PrimitiveState.ts#L143)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | `boolean` |

##### Returns

`void`
