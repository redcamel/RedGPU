[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RenderState](../README.md) / PrimitiveState

# Class: PrimitiveState

Defined in: [src/renderState/PrimitiveState.ts:28](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/renderState/PrimitiveState.ts#L28)


Class that manages primitive rendering methods and face handling for objects.


Controls topology settings such as triangle/line/point, culling mode, front-face definition, and index format.

* ### Example
```typescript
const pState = mesh.primitiveState;
pState.topology = RedGPU.GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_STRIP;
pState.cullMode = RedGPU.GPU_CULL_MODE.BACK;
```

## Constructors

### Constructor

> **new PrimitiveState**(`targetObject3D`): `PrimitiveState`

Defined in: [src/renderState/PrimitiveState.ts:54](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/renderState/PrimitiveState.ts#L54)


Creates an instance of PrimitiveState.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetObject3D` | `any` | Target object to which the state is applied |

#### Returns

`PrimitiveState`

## Properties

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `false`

Defined in: [src/renderState/PrimitiveState.ts:33](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/renderState/PrimitiveState.ts#L33)


Whether the pipeline needs updating

***

### state

> **state**: `GPUPrimitiveState`

Defined in: [src/renderState/PrimitiveState.ts:38](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/renderState/PrimitiveState.ts#L38)


Final GPUPrimitiveState state object

## Accessors

### cullMode

#### Get Signature

> **get** **cullMode**(): `GPUCullMode`

Defined in: [src/renderState/PrimitiveState.ts:124](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/renderState/PrimitiveState.ts#L124)


Gets or sets the culling mode.

##### Returns

`GPUCullMode`


Current GPUCullMode

#### Set Signature

> **set** **cullMode**(`mode`): `void`

Defined in: [src/renderState/PrimitiveState.ts:128](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/renderState/PrimitiveState.ts#L128)

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

Defined in: [src/renderState/PrimitiveState.ts:105](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/renderState/PrimitiveState.ts#L105)


Gets or sets the front-face orientation.

##### Returns

`GPUFrontFace`


Current GPUFrontFace

#### Set Signature

> **set** **frontFace**(`face`): `void`

Defined in: [src/renderState/PrimitiveState.ts:109](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/renderState/PrimitiveState.ts#L109)

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

Defined in: [src/renderState/PrimitiveState.ts:86](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/renderState/PrimitiveState.ts#L86)


Gets or sets the strip index format.

##### Returns

`GPUIndexFormat`


Current GPUIndexFormat

#### Set Signature

> **set** **stripIndexFormat**(`format`): `void`

Defined in: [src/renderState/PrimitiveState.ts:90](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/renderState/PrimitiveState.ts#L90)

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

Defined in: [src/renderState/PrimitiveState.ts:67](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/renderState/PrimitiveState.ts#L67)


Gets or sets the primitive topology.

##### Returns

`GPUPrimitiveTopology`


Current GPUPrimitiveTopology

#### Set Signature

> **set** **topology**(`value`): `void`

Defined in: [src/renderState/PrimitiveState.ts:71](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/renderState/PrimitiveState.ts#L71)

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

Defined in: [src/renderState/PrimitiveState.ts:139](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/renderState/PrimitiveState.ts#L139)


Gets or sets whether depth clipping is disabled (unclipped).

##### Returns

`boolean`

#### Set Signature

> **set** **unclippedDepth**(`state`): `void`

Defined in: [src/renderState/PrimitiveState.ts:143](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/renderState/PrimitiveState.ts#L143)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | `boolean` |

##### Returns

`void`
