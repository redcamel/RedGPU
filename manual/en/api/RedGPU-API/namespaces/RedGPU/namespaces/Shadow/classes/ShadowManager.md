[**RedGPU API v4.2.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Shadow](../README.md) / ShadowManager

# Class: ShadowManager

Defined in: [src/shadow/ShadowManager.ts:23](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/shadow/ShadowManager.ts#L23)

Manager class that oversees the overall shadow rendering of the scene.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Constructors

### Constructor

> **new ShadowManager**(): `ShadowManager`

Defined in: [src/shadow/ShadowManager.ts:27](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/shadow/ShadowManager.ts#L27)

#### Returns

`ShadowManager`

## Accessors

### directionalShadowManager

#### Get Signature

> **get** **directionalShadowManager**(): [`DirectionalShadowManager`](DirectionalShadowManager.md)

Defined in: [src/shadow/ShadowManager.ts:38](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/shadow/ShadowManager.ts#L38)

Returns the DirectionalShadowManager.

##### Returns

[`DirectionalShadowManager`](DirectionalShadowManager.md)

DirectionalShadowManager instance

***

### shadowPassDescriptor

#### Get Signature

> **get** **shadowPassDescriptor**(): `GPURenderPassDescriptor`

Defined in: [src/shadow/ShadowManager.ts:50](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/shadow/ShadowManager.ts#L50)

Returns the shadow render pass descriptor.

##### Returns

`GPURenderPassDescriptor`

GPURenderPassDescriptor object

## Methods

### render()

> **render**(`view`): `void`

Defined in: [src/shadow/ShadowManager.ts:62](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/shadow/ShadowManager.ts#L62)

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

Defined in: [src/shadow/ShadowManager.ts:105](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/shadow/ShadowManager.ts#L105)

Updates the state of the manager.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`void`
