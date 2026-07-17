[**RedGPU API v4.3.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Shadow](../README.md) / ShadowManager

# Class: ShadowManager

Defined in: [src/shadow/ShadowManager.ts:24](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/shadow/ShadowManager.ts#L24)

Manager class that oversees the overall shadow rendering of the scene.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Constructors

### Constructor

> **new ShadowManager**(): `ShadowManager`

Defined in: [src/shadow/ShadowManager.ts:28](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/shadow/ShadowManager.ts#L28)

#### Returns

`ShadowManager`

## Accessors

### directionalShadowManager

#### Get Signature

> **get** **directionalShadowManager**(): [`DirectionalShadowManager`](DirectionalShadowManager.md)

Defined in: [src/shadow/ShadowManager.ts:39](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/shadow/ShadowManager.ts#L39)

Returns the DirectionalShadowManager.

##### Returns

[`DirectionalShadowManager`](DirectionalShadowManager.md)

DirectionalShadowManager instance

***

### shadowPassDescriptor

#### Get Signature

> **get** **shadowPassDescriptor**(): `GPURenderPassDescriptor`

Defined in: [src/shadow/ShadowManager.ts:51](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/shadow/ShadowManager.ts#L51)

Returns the shadow render pass descriptor.

##### Returns

`GPURenderPassDescriptor`

GPURenderPassDescriptor object

## Methods

### destroy()

> **destroy**(): `void`

Defined in: [src/shadow/ShadowManager.ts:114](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/shadow/ShadowManager.ts#L114)

Releases GPU resources in use for shadow rendering.

#### Returns

`void`

***

### render()

> **render**(`view`): `void`

Defined in: [src/shadow/ShadowManager.ts:63](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/shadow/ShadowManager.ts#L63)

Performs shadow rendering.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | Target View3D |

#### Returns

`void`

***

### update()

> **update**(`redGPUContext`): `void`

Defined in: [src/shadow/ShadowManager.ts:106](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/shadow/ShadowManager.ts#L106)

Updates the state of the manager.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`void`
