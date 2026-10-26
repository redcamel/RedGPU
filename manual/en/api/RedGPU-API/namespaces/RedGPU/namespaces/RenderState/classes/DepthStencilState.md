[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RenderState](../README.md) / DepthStencilState

# Class: DepthStencilState

Defined in: [src/renderState/DepthStencilState.ts:26](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/DepthStencilState.ts#L26)

Class that manages depth and stencil test states for objects.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

### Example
```typescript
const depthStencilState = mesh.depthStencilState;
depthStencilState.depthWriteEnabled = true;
depthStencilState.depthCompare = RedGPU.GPU_COMPARE_FUNCTION.LESS_EQUAL;
```

## Constructors

### Constructor

> **new DepthStencilState**(`targetObject3D`): `DepthStencilState`

Defined in: [src/renderState/DepthStencilState.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/DepthStencilState.ts#L48)

Creates a DepthStencilState instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `targetObject3D` | `any` | Target 3D object to which the state is applied |

#### Returns

`DepthStencilState`

## Accessors

### depthBias

#### Get Signature

> **get** **depthBias**(): `number`

Defined in: [src/renderState/DepthStencilState.ts:183](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/DepthStencilState.ts#L183)

Gets or sets the depth bias value.

##### Returns

`number`

Currently configured `GPUDepthBias` value

#### Set Signature

> **set** **depthBias**(`value`): `void`

Defined in: [src/renderState/DepthStencilState.ts:187](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/DepthStencilState.ts#L187)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### depthBiasClamp

#### Get Signature

> **get** **depthBiasClamp**(): `number`

Defined in: [src/renderState/DepthStencilState.ts:217](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/DepthStencilState.ts#L217)

Gets or sets the depth bias clamp value.

##### Returns

`number`

Depth bias clamp value

#### Set Signature

> **set** **depthBiasClamp**(`value`): `void`

Defined in: [src/renderState/DepthStencilState.ts:221](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/DepthStencilState.ts#L221)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### depthBiasSlopeScale

#### Get Signature

> **get** **depthBiasSlopeScale**(): `number`

Defined in: [src/renderState/DepthStencilState.ts:200](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/DepthStencilState.ts#L200)

Gets or sets the depth bias slope scale value.

##### Returns

`number`

Depth bias slope scale value

#### Set Signature

> **set** **depthBiasSlopeScale**(`value`): `void`

Defined in: [src/renderState/DepthStencilState.ts:204](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/DepthStencilState.ts#L204)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### depthCompare

#### Get Signature

> **get** **depthCompare**(): `GPUCompareFunction`

Defined in: [src/renderState/DepthStencilState.ts:96](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/DepthStencilState.ts#L96)

Gets or sets the depth comparison function.

##### Returns

`GPUCompareFunction`

Currently configured `GPUCompareFunction` value

#### Set Signature

> **set** **depthCompare**(`value`): `void`

Defined in: [src/renderState/DepthStencilState.ts:100](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/DepthStencilState.ts#L100)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `GPUCompareFunction` |

##### Returns

`void`

***

### depthWriteEnabled

#### Get Signature

> **get** **depthWriteEnabled**(): `boolean`

Defined in: [src/renderState/DepthStencilState.ts:79](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/DepthStencilState.ts#L79)

Gets or sets whether writing to the depth buffer is enabled.

##### Returns

`boolean`

Whether depth buffer writing is enabled

#### Set Signature

> **set** **depthWriteEnabled**(`value`): `void`

Defined in: [src/renderState/DepthStencilState.ts:83](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/DepthStencilState.ts#L83)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

### format

#### Get Signature

> **get** **format**(): `GPUTextureFormat`

Defined in: [src/renderState/DepthStencilState.ts:60](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/DepthStencilState.ts#L60)

Gets or sets the depth/stencil texture format.

##### Returns

`GPUTextureFormat`

Currently configured `GPUTextureFormat` value

#### Set Signature

> **set** **format**(`value`): `void`

Defined in: [src/renderState/DepthStencilState.ts:64](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/DepthStencilState.ts#L64)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `GPUTextureFormat` |

##### Returns

`void`

***

### state

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **state**(): `object`

Defined in: [src/renderState/DepthStencilState.ts:234](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/DepthStencilState.ts#L234)

Returns a state object in `GPUDepthStencilState` format based on the current settings.

##### Returns

`object`

Generated depth/stencil state object

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `depthBias` | `number` | [src/renderState/DepthStencilState.ts:249](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/DepthStencilState.ts#L249) |
| `depthBiasClamp` | `number` | [src/renderState/DepthStencilState.ts:251](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/DepthStencilState.ts#L251) |
| `depthBiasSlopeScale` | `number` | [src/renderState/DepthStencilState.ts:250](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/DepthStencilState.ts#L250) |
| `depthCompare` | `GPUCompareFunction` | [src/renderState/DepthStencilState.ts:244](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/DepthStencilState.ts#L244) |
| `depthWriteEnabled` | `boolean` | [src/renderState/DepthStencilState.ts:243](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/DepthStencilState.ts#L243) |
| `format` | `GPUTextureFormat` | [src/renderState/DepthStencilState.ts:242](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/DepthStencilState.ts#L242) |
| `stencilBack` | `GPUStencilFaceState` | [src/renderState/DepthStencilState.ts:246](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/DepthStencilState.ts#L246) |
| `stencilFront` | `GPUStencilFaceState` | [src/renderState/DepthStencilState.ts:245](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/DepthStencilState.ts#L245) |
| `stencilReadMask` | `number` | [src/renderState/DepthStencilState.ts:247](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/DepthStencilState.ts#L247) |
| `stencilWriteMask` | `number` | [src/renderState/DepthStencilState.ts:248](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/DepthStencilState.ts#L248) |

***

### stencilBack

#### Get Signature

> **get** **stencilBack**(): `GPUStencilFaceState`

Defined in: [src/renderState/DepthStencilState.ts:132](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/DepthStencilState.ts#L132)

Gets or sets the back stencil face state.

##### Returns

`GPUStencilFaceState`

Back `GPUStencilFaceState` object

#### Set Signature

> **set** **stencilBack**(`value`): `void`

Defined in: [src/renderState/DepthStencilState.ts:136](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/DepthStencilState.ts#L136)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `GPUStencilFaceState` |

##### Returns

`void`

***

### stencilFront

#### Get Signature

> **get** **stencilFront**(): `GPUStencilFaceState`

Defined in: [src/renderState/DepthStencilState.ts:115](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/DepthStencilState.ts#L115)

Gets or sets the front stencil face state.

##### Returns

`GPUStencilFaceState`

Front `GPUStencilFaceState` object

#### Set Signature

> **set** **stencilFront**(`value`): `void`

Defined in: [src/renderState/DepthStencilState.ts:119](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/DepthStencilState.ts#L119)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `GPUStencilFaceState` |

##### Returns

`void`

***

### stencilReadMask

#### Get Signature

> **get** **stencilReadMask**(): `number`

Defined in: [src/renderState/DepthStencilState.ts:149](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/DepthStencilState.ts#L149)

Gets or sets the stencil read mask.

##### Returns

`number`

Stencil read mask value

#### Set Signature

> **set** **stencilReadMask**(`value`): `void`

Defined in: [src/renderState/DepthStencilState.ts:153](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/DepthStencilState.ts#L153)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### stencilWriteMask

#### Get Signature

> **get** **stencilWriteMask**(): `number`

Defined in: [src/renderState/DepthStencilState.ts:166](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/DepthStencilState.ts#L166)

Gets or sets the stencil write mask.

##### Returns

`number`

Stencil write mask value

#### Set Signature

> **set** **stencilWriteMask**(`value`): `void`

Defined in: [src/renderState/DepthStencilState.ts:170](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/renderState/DepthStencilState.ts#L170)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`
