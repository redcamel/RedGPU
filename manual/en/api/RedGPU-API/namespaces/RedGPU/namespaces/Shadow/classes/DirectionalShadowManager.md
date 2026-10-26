[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Shadow](../README.md) / DirectionalShadowManager

# Class: DirectionalShadowManager

Defined in: [src/shadow/DirectionalShadowManager.ts:46](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/shadow/DirectionalShadowManager.ts#L46)

Class that manages CSM (Cascaded Shadow Maps) depth texture arrays and related settings for directional lights.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

### Example
```typescript
// Correct access method
const directionalShadowManager = view.directionalShadowManager;
```

## Constructors

### Constructor

> **new DirectionalShadowManager**(): `DirectionalShadowManager`

#### Returns

`DirectionalShadowManager`

## Accessors

### bias

#### Get Signature

> **get** **bias**(): `number`

Defined in: [src/shadow/DirectionalShadowManager.ts:175](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/shadow/DirectionalShadowManager.ts#L175)

Returns the shadow bias value.

##### Returns

`number`

Bias value

#### Set Signature

> **set** **bias**(`value`): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:162](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/shadow/DirectionalShadowManager.ts#L162)

Sets the shadow bias value. (0.0 to 1.0)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Bias value |

##### Returns

`void`

***

### cascadeBoundingSpheres

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **cascadeBoundingSpheres**(): `Float32Array`

Defined in: [src/shadow/DirectionalShadowManager.ts:78](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/shadow/DirectionalShadowManager.ts#L78)

Returns the world-space bounding sphere info [center.x, center.y, center.z, radius] * 4 (length 16 Float32Array) for each cascade.

##### Returns

`Float32Array`

***

### cascadeCount

#### Get Signature

> **get** **cascadeCount**(): `number`

Defined in: [src/shadow/DirectionalShadowManager.ts:212](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/shadow/DirectionalShadowManager.ts#L212)

Returns the number of cascade splits for CSM (Cascaded Shadow Maps) (1 to 4, default: 3).

##### Returns

`number`

Cascade count

#### Set Signature

> **set** **cascadeCount**(`value`): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:245](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/shadow/DirectionalShadowManager.ts#L245)

Sets the number of cascade splits for CSM (Cascaded Shadow Maps) (1 to 4).

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Cascade count (1 to 4) |

##### Returns

`void`

***

### cascadeLightDistances

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **cascadeLightDistances**(): `Float32Array`

Defined in: [src/shadow/DirectionalShadowManager.ts:86](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/shadow/DirectionalShadowManager.ts#L86)

Returns the array of orthographic light distances (length 4 Float32Array) along the inverse light direction (-lightDir) from each cascade center.

##### Returns

`Float32Array`

***

### cascadeProjectionViewMatrices

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **cascadeProjectionViewMatrices**(): [`mat4`](../../Math/type-aliases/mat4.md)[]

Defined in: [src/shadow/DirectionalShadowManager.ts:270](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/shadow/DirectionalShadowManager.ts#L270)

Returns the array of projection-view matrices for each cascade (length 4).

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)[]

Array of projection-view matrices

***

### cascadeSplitDepths

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **cascadeSplitDepths**(): `Float32Array`

Defined in: [src/shadow/DirectionalShadowManager.ts:258](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/shadow/DirectionalShadowManager.ts#L258)

Returns the array of split depths for each cascade (length 4).

##### Returns

`Float32Array`

Split depth Float32Array

***

### casterBoundingCenter

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **casterBoundingCenter**(): `Float32Array`

Defined in: [src/shadow/DirectionalShadowManager.ts:94](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/shadow/DirectionalShadowManager.ts#L94)

Returns the center coordinates (vec3) of the casters' effective shadow volume.

##### Returns

`Float32Array`

***

### casterBoundingRadiusSq

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **casterBoundingRadiusSq**(): `number`

Defined in: [src/shadow/DirectionalShadowManager.ts:102](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/shadow/DirectionalShadowManager.ts#L102)

Returns the squared radius of the casters' effective shadow volume (0.0: no casters, <0.0: global casters bypass, >0.0: valid squared radius).

##### Returns

`number`

***

### castingList

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **castingList**(): ([`Mesh`](../../Display/classes/Mesh.md) \| [`InstancingMesh`](../../Display/classes/InstancingMesh.md))[]

Defined in: [src/shadow/DirectionalShadowManager.ts:126](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/shadow/DirectionalShadowManager.ts#L126)

Returns the list of objects that will cast shadows.

##### Returns

([`Mesh`](../../Display/classes/Mesh.md) \| [`InstancingMesh`](../../Display/classes/InstancingMesh.md))[]

Array of shadow casting objects

***

### maxShadowDistance

#### Get Signature

> **get** **maxShadowDistance**(): `number`

Defined in: [src/shadow/DirectionalShadowManager.ts:220](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/shadow/DirectionalShadowManager.ts#L220)

Returns the maximum shadow distance (Unreal Engine standard default: 200m).

##### Returns

`number`

#### Set Signature

> **set** **maxShadowDistance**(`value`): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:232](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/shadow/DirectionalShadowManager.ts#L232)

Sets the maximum shadow distance (default: 200m).

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Maximum shadow distance in meters |

##### Returns

`void`

***

### shadowDepthTextureSize

#### Get Signature

> **get** **shadowDepthTextureSize**(): `number`

Defined in: [src/shadow/DirectionalShadowManager.ts:282](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/shadow/DirectionalShadowManager.ts#L282)

Returns the size (resolution, default: 2048) of the shadow depth texture.

##### Returns

`number`

Resolution value

#### Set Signature

> **set** **shadowDepthTextureSize**(`value`): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:294](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/shadow/DirectionalShadowManager.ts#L294)

Sets the size (resolution, default: 2048) of the shadow depth texture. (Integer)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Resolution value (default: 2048) |

##### Returns

`void`

***

### shadowDepthTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **shadowDepthTextureView**(): `GPUTextureView`

Defined in: [src/shadow/DirectionalShadowManager.ts:138](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/shadow/DirectionalShadowManager.ts#L138)

Returns the shadow depth texture view in 2D Texture Array dimension. (For main rendering shader binding)

##### Returns

`GPUTextureView`

2D Array Shadow depth GPUTextureView

***

### shadowDepthTextureViewEmpty

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **shadowDepthTextureViewEmpty**(): `GPUTextureView`

Defined in: [src/shadow/DirectionalShadowManager.ts:150](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/shadow/DirectionalShadowManager.ts#L150)

Returns an empty (1x1x4) 2D Array depth texture view for non-shadow states.

##### Returns

`GPUTextureView`

Empty depth GPUTextureView

***

### strength

#### Get Signature

> **get** **strength**(): `number`

Defined in: [src/shadow/DirectionalShadowManager.ts:200](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/shadow/DirectionalShadowManager.ts#L200)

Returns the shadow strength value.

##### Returns

`number`

Strength value (0.0 to 1.0)

#### Set Signature

> **set** **strength**(`value`): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:187](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/shadow/DirectionalShadowManager.ts#L187)

Sets the shadow strength value. (0.0 to 1.0)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Strength value |

##### Returns

`void`

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/shadow/DirectionalShadowManager.ts:114](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/shadow/DirectionalShadowManager.ts#L114)

Returns the video memory size (Bytes) used by the current shadow map.

##### Returns

`number`

Video memory usage in bytes

## Methods

### calculateCSMMatrices()

> **calculateCSMMatrices**(`view`): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:331](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/shadow/DirectionalShadowManager.ts#L331)

In-place calculates jitter-free high-precision CSM matrices and split depths directly into member buffers
     using the Auto-CSM physical texel density inversion model and symmetric bounding sphere algorithm.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 대상 View3D |

#### Returns

`void`

***

### destroy()

> **destroy**(): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:483](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/shadow/DirectionalShadowManager.ts#L483)

Releases GPU resources in use.

#### Returns

`void`

***

### getCascadeLayerView()

> **getCascadeLayerView**(`index`): `GPUTextureView`

Defined in: [src/shadow/DirectionalShadowManager.ts:310](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/shadow/DirectionalShadowManager.ts#L310)

Returns a single 2D depth texture view for a specific cascade layer.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `index` | `number` | Cascade index (0 to 3) |

#### Returns

`GPUTextureView`

2D GPUTextureView of the layer

***

### resetCastingList()

> **resetCastingList**(): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:318](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/shadow/DirectionalShadowManager.ts#L318)

Resets the list of shadow casting objects.

#### Returns

`void`

***

### update()

> **update**(`redGPUContext`): `boolean`

Defined in: [src/shadow/DirectionalShadowManager.ts:508](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/shadow/DirectionalShadowManager.ts#L508)

Updates internal state. (Mainly checks for resolution changes)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`boolean`
