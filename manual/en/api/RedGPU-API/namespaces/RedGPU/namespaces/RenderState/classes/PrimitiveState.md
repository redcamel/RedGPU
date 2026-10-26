[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RenderState](../README.md) / PrimitiveState

# Class: PrimitiveState

Defined in: [src/renderState/PrimitiveState.ts:31](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/PrimitiveState.ts#L31)

Render state class that controls primitive topology, front-face orientation, and face culling mode for objects.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
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

Defined in: [src/renderState/PrimitiveState.ts:57](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/PrimitiveState.ts#L57)

Creates a PrimitiveState instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetObject3D` | `any` | Target 3D object to which the state is applied |

#### Returns

`PrimitiveState`

## Properties

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `false`

Defined in: [src/renderState/PrimitiveState.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/PrimitiveState.ts#L36)

Whether the pipeline requires an update

***

### state

> **state**: `GPUPrimitiveState`

Defined in: [src/renderState/PrimitiveState.ts:41](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/PrimitiveState.ts#L41)

Final generated `GPUPrimitiveState` state object

## Accessors

### cullMode

#### Get Signature

> **get** **cullMode**(): `GPUCullMode`

Defined in: [src/renderState/PrimitiveState.ts:127](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/PrimitiveState.ts#L127)

Gets or sets the face culling mode.

##### Returns

`GPUCullMode`

Currently configured `GPUCullMode` value

#### Set Signature

> **set** **cullMode**(`mode`): `void`

Defined in: [src/renderState/PrimitiveState.ts:131](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/PrimitiveState.ts#L131)

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

Defined in: [src/renderState/PrimitiveState.ts:108](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/PrimitiveState.ts#L108)

Gets or sets the winding order that defines the front face of polygons.

##### Returns

`GPUFrontFace`

Currently configured `GPUFrontFace` value

#### Set Signature

> **set** **frontFace**(`face`): `void`

Defined in: [src/renderState/PrimitiveState.ts:112](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/PrimitiveState.ts#L112)

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

Defined in: [src/renderState/PrimitiveState.ts:89](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/PrimitiveState.ts#L89)

Gets or sets the index format when using strip topology.

##### Returns

`GPUIndexFormat`

Currently configured `GPUIndexFormat` value

#### Set Signature

> **set** **stripIndexFormat**(`format`): `void`

Defined in: [src/renderState/PrimitiveState.ts:93](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/PrimitiveState.ts#L93)

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

Defined in: [src/renderState/PrimitiveState.ts:70](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/PrimitiveState.ts#L70)

Gets or sets the primitive topology.

##### Returns

`GPUPrimitiveTopology`

Currently configured `GPUPrimitiveTopology` value

#### Set Signature

> **set** **topology**(`value`): `void`

Defined in: [src/renderState/PrimitiveState.ts:74](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/PrimitiveState.ts#L74)

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

Defined in: [src/renderState/PrimitiveState.ts:146](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/PrimitiveState.ts#L146)

Gets or sets whether depth clipping is disabled.

##### Returns

`boolean`

Whether depth clipping is disabled

#### Set Signature

> **set** **unclippedDepth**(`state`): `void`

Defined in: [src/renderState/PrimitiveState.ts:150](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/PrimitiveState.ts#L150)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `state` | `boolean` |

##### Returns

`void`
