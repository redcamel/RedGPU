[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Shadow](../README.md) / ShadowManager

# Class: ShadowManager

Defined in: [src/shadow/ShadowManager.ts:24](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/shadow/ShadowManager.ts#L24)

Manager class that oversees the overall shadow rendering of the scene.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Constructors

### Constructor

> **new ShadowManager**(): `ShadowManager`

Defined in: [src/shadow/ShadowManager.ts:30](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/shadow/ShadowManager.ts#L30)

#### Returns

`ShadowManager`

## Accessors

### directionalShadowManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **directionalShadowManager**(): [`DirectionalShadowManager`](DirectionalShadowManager.md)

Defined in: [src/shadow/ShadowManager.ts:41](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/shadow/ShadowManager.ts#L41)

Returns the DirectionalShadowManager.

##### Returns

[`DirectionalShadowManager`](DirectionalShadowManager.md)

DirectionalShadowManager instance

## Methods

### destroy()

> **destroy**(): `void`

Defined in: [src/shadow/ShadowManager.ts:116](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/shadow/ShadowManager.ts#L116)

Releases GPU resources in use for shadow rendering.

#### Returns

`void`

***

### render()

> **render**(`view`): `void`

Defined in: [src/shadow/ShadowManager.ts:53](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/shadow/ShadowManager.ts#L53)

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

Defined in: [src/shadow/ShadowManager.ts:208](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/shadow/ShadowManager.ts#L208)

Updates the state of the manager.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`void`
