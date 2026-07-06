[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Shadow](../README.md) / DirectionalShadowManager

# Class: DirectionalShadowManager

Defined in: [src/shadow/DirectionalShadowManager.ts:19](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/shadow/DirectionalShadowManager.ts#L19)

Class that manages shadow depth textures and related settings for directional lights.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Constructors

### Constructor

> **new DirectionalShadowManager**(): `DirectionalShadowManager`

#### Returns

`DirectionalShadowManager`

## Accessors

### bias

#### Get Signature

> **get** **bias**(): `number`

Defined in: [src/shadow/DirectionalShadowManager.ts:88](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/shadow/DirectionalShadowManager.ts#L88)

Returns the shadow bias value.

##### Returns

`number`

Bias value

#### Set Signature

> **set** **bias**(`value`): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:100](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/shadow/DirectionalShadowManager.ts#L100)

Sets the shadow bias value. (0.0 to 1.0)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Bias value |

##### Returns

`void`

***

### castingList

#### Get Signature

> **get** **castingList**(): ([`Mesh`](../../Display/classes/Mesh.md) \| [`InstancingMesh`](../../Display/classes/InstancingMesh.md))[]

Defined in: [src/shadow/DirectionalShadowManager.ts:52](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/shadow/DirectionalShadowManager.ts#L52)

Returns the list of objects that will cast shadows.

##### Returns

([`Mesh`](../../Display/classes/Mesh.md) \| [`InstancingMesh`](../../Display/classes/InstancingMesh.md))[]

Array of shadow casting objects

***

### filterScale

#### Get Signature

> **get** **filterScale**(): `number`

Defined in: [src/shadow/DirectionalShadowManager.ts:138](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/shadow/DirectionalShadowManager.ts#L138)

Returns the shadow filter scale value.

##### Returns

`number`

Filter scale value (default: 4.0)

#### Set Signature

> **set** **filterScale**(`value`): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:150](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/shadow/DirectionalShadowManager.ts#L150)

Sets the shadow filter scale value. (0.0 or greater)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Filter scale value |

##### Returns

`void`

***

### shadowDepthTextureSize

#### Get Signature

> **get** **shadowDepthTextureSize**(): `number`

Defined in: [src/shadow/DirectionalShadowManager.ts:164](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/shadow/DirectionalShadowManager.ts#L164)

Returns the size (resolution) of the shadow depth texture.

##### Returns

`number`

Resolution value

#### Set Signature

> **set** **shadowDepthTextureSize**(`value`): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:176](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/shadow/DirectionalShadowManager.ts#L176)

Sets the size (resolution) of the shadow depth texture. (Integer)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Resolution value |

##### Returns

`void`

***

### shadowDepthTextureView

#### Get Signature

> **get** **shadowDepthTextureView**(): `GPUTextureView`

Defined in: [src/shadow/DirectionalShadowManager.ts:64](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/shadow/DirectionalShadowManager.ts#L64)

Returns the shadow depth texture view.

##### Returns

`GPUTextureView`

Shadow depth GPUTextureView

***

### shadowDepthTextureViewEmpty

#### Get Signature

> **get** **shadowDepthTextureViewEmpty**(): `GPUTextureView`

Defined in: [src/shadow/DirectionalShadowManager.ts:76](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/shadow/DirectionalShadowManager.ts#L76)

Returns an empty (1x1) depth texture view for non-shadow states.

##### Returns

`GPUTextureView`

Empty depth GPUTextureView

***

### strength

#### Get Signature

> **get** **strength**(): `number`

Defined in: [src/shadow/DirectionalShadowManager.ts:113](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/shadow/DirectionalShadowManager.ts#L113)

Returns the shadow strength value.

##### Returns

`number`

Strength value (0.0 to 1.0)

#### Set Signature

> **set** **strength**(`value`): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:125](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/shadow/DirectionalShadowManager.ts#L125)

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

> **get** **videoMemorySize**(): `number`

Defined in: [src/shadow/DirectionalShadowManager.ts:40](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/shadow/DirectionalShadowManager.ts#L40)

Returns the video memory size (Bytes) used by the current shadow map.

##### Returns

`number`

Video memory usage in bytes

## Methods

### destroy()

> **destroy**(): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:214](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/shadow/DirectionalShadowManager.ts#L214)

Releases GPU resources in use.

#### Returns

`void`

***

### reset()

> **reset**(): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:185](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/shadow/DirectionalShadowManager.ts#L185)

Resets the manager and destroys resources.

#### Returns

`void`

***

### resetCastingList()

> **resetCastingList**(): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:193](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/shadow/DirectionalShadowManager.ts#L193)

Resets the list of shadow casting objects.

#### Returns

`void`

***

### update()

> **update**(`redGPUContext`): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:205](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/shadow/DirectionalShadowManager.ts#L205)

Updates internal state. (Mainly checks for resolution changes)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`void`
