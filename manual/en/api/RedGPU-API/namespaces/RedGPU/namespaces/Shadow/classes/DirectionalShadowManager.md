[**RedGPU API v4.3.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Shadow](../README.md) / DirectionalShadowManager

# Class: DirectionalShadowManager

Defined in: [src/shadow/DirectionalShadowManager.ts:20](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/shadow/DirectionalShadowManager.ts#L20)

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

Defined in: [src/shadow/DirectionalShadowManager.ts:89](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/shadow/DirectionalShadowManager.ts#L89)

Returns the shadow bias value.

##### Returns

`number`

Bias value

#### Set Signature

> **set** **bias**(`value`): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:101](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/shadow/DirectionalShadowManager.ts#L101)

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

Defined in: [src/shadow/DirectionalShadowManager.ts:53](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/shadow/DirectionalShadowManager.ts#L53)

Returns the list of objects that will cast shadows.

##### Returns

([`Mesh`](../../Display/classes/Mesh.md) \| [`InstancingMesh`](../../Display/classes/InstancingMesh.md))[]

Array of shadow casting objects

***

### filterScale

#### Get Signature

> **get** **filterScale**(): `number`

Defined in: [src/shadow/DirectionalShadowManager.ts:139](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/shadow/DirectionalShadowManager.ts#L139)

Returns the shadow filter scale value.

##### Returns

`number`

Filter scale value (default: 4.0)

#### Set Signature

> **set** **filterScale**(`value`): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:151](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/shadow/DirectionalShadowManager.ts#L151)

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

Defined in: [src/shadow/DirectionalShadowManager.ts:165](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/shadow/DirectionalShadowManager.ts#L165)

Returns the size (resolution) of the shadow depth texture.

##### Returns

`number`

Resolution value

#### Set Signature

> **set** **shadowDepthTextureSize**(`value`): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:177](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/shadow/DirectionalShadowManager.ts#L177)

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

Defined in: [src/shadow/DirectionalShadowManager.ts:65](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/shadow/DirectionalShadowManager.ts#L65)

Returns the shadow depth texture view.

##### Returns

`GPUTextureView`

Shadow depth GPUTextureView

***

### shadowDepthTextureViewEmpty

#### Get Signature

> **get** **shadowDepthTextureViewEmpty**(): `GPUTextureView`

Defined in: [src/shadow/DirectionalShadowManager.ts:77](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/shadow/DirectionalShadowManager.ts#L77)

Returns an empty (1x1) depth texture view for non-shadow states.

##### Returns

`GPUTextureView`

Empty depth GPUTextureView

***

### strength

#### Get Signature

> **get** **strength**(): `number`

Defined in: [src/shadow/DirectionalShadowManager.ts:114](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/shadow/DirectionalShadowManager.ts#L114)

Returns the shadow strength value.

##### Returns

`number`

Strength value (0.0 to 1.0)

#### Set Signature

> **set** **strength**(`value`): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:126](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/shadow/DirectionalShadowManager.ts#L126)

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

Defined in: [src/shadow/DirectionalShadowManager.ts:41](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/shadow/DirectionalShadowManager.ts#L41)

Returns the video memory size (Bytes) used by the current shadow map.

##### Returns

`number`

Video memory usage in bytes

## Methods

### destroy()

> **destroy**(): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:215](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/shadow/DirectionalShadowManager.ts#L215)

Releases GPU resources in use.

#### Returns

`void`

***

### reset()

> **reset**(): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:186](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/shadow/DirectionalShadowManager.ts#L186)

Resets the manager and destroys resources.

#### Returns

`void`

***

### resetCastingList()

> **resetCastingList**(): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:194](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/shadow/DirectionalShadowManager.ts#L194)

Resets the list of shadow casting objects.

#### Returns

`void`

***

### update()

> **update**(`redGPUContext`): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:206](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/shadow/DirectionalShadowManager.ts#L206)

Updates internal state. (Mainly checks for resolution changes)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`void`
