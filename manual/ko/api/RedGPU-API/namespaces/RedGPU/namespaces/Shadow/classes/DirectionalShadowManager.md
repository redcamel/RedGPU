[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Shadow](../README.md) / DirectionalShadowManager

# Class: DirectionalShadowManager

Defined in: [src/shadow/DirectionalShadowManager.ts:8](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/shadow/DirectionalShadowManager.ts#L8)

## Constructors

### Constructor

> **new DirectionalShadowManager**(): `DirectionalShadowManager`

#### Returns

`DirectionalShadowManager`

## Accessors

### bias

#### Get Signature

> **get** **bias**(): `number`

Defined in: [src/shadow/DirectionalShadowManager.ts:33](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/shadow/DirectionalShadowManager.ts#L33)

##### Returns

`number`

#### Set Signature

> **set** **bias**(`value`): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:37](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/shadow/DirectionalShadowManager.ts#L37)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### castingList

#### Get Signature

> **get** **castingList**(): ([`Mesh`](../../Display/classes/Mesh.md) \| [`InstancingMesh`](../../Display/classes/InstancingMesh.md))[]

Defined in: [src/shadow/DirectionalShadowManager.ts:21](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/shadow/DirectionalShadowManager.ts#L21)

##### Returns

([`Mesh`](../../Display/classes/Mesh.md) \| [`InstancingMesh`](../../Display/classes/InstancingMesh.md))[]

***

### shadowDepthTextureSize

#### Get Signature

> **get** **shadowDepthTextureSize**(): `number`

Defined in: [src/shadow/DirectionalShadowManager.ts:42](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/shadow/DirectionalShadowManager.ts#L42)

##### Returns

`number`

#### Set Signature

> **set** **shadowDepthTextureSize**(`value`): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:46](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/shadow/DirectionalShadowManager.ts#L46)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### shadowDepthTextureView

#### Get Signature

> **get** **shadowDepthTextureView**(): `GPUTextureView`

Defined in: [src/shadow/DirectionalShadowManager.ts:25](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/shadow/DirectionalShadowManager.ts#L25)

##### Returns

`GPUTextureView`

***

### shadowDepthTextureViewEmpty

#### Get Signature

> **get** **shadowDepthTextureViewEmpty**(): `GPUTextureView`

Defined in: [src/shadow/DirectionalShadowManager.ts:29](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/shadow/DirectionalShadowManager.ts#L29)

##### Returns

`GPUTextureView`

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/shadow/DirectionalShadowManager.ts:17](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/shadow/DirectionalShadowManager.ts#L17)

##### Returns

`number`

## Methods

### destroy()

> **destroy**(): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:64](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/shadow/DirectionalShadowManager.ts#L64)

#### Returns

`void`

***

### reset()

> **reset**(): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:51](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/shadow/DirectionalShadowManager.ts#L51)

#### Returns

`void`

***

### resetCastingList()

> **resetCastingList**(): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:55](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/shadow/DirectionalShadowManager.ts#L55)

#### Returns

`void`

***

### update()

> **update**(`redGPUContext`): `void`

Defined in: [src/shadow/DirectionalShadowManager.ts:59](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/shadow/DirectionalShadowManager.ts#L59)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) |

#### Returns

`void`
