[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Picking](../README.md) / PickingManager

# Class: PickingManager

Defined in: [src/picking/core/PickingManager.ts:29](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/picking/core/PickingManager.ts#L29)


Class that handles mouse events and manages interaction with objects.


Detects and processes events such as mouse clicks, moves, and overs. Implements pixel-perfect object selection using GPU textures.

::: warning

This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

### Example
```typescript
// 올바른 접근 방법 (Correct access)
const pickingManager = view.pickingManager;
```

## Constructors

### Constructor

> **new PickingManager**(): `PickingManager`

#### Returns

`PickingManager`

## Properties

### lastMouseClickEvent

> **lastMouseClickEvent**: `MouseEvent`

Defined in: [src/picking/core/PickingManager.ts:31](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/picking/core/PickingManager.ts#L31)

***

### lastMouseEvent

> **lastMouseEvent**: `MouseEvent`

Defined in: [src/picking/core/PickingManager.ts:30](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/picking/core/PickingManager.ts#L30)

## Accessors

### castingList

#### Get Signature

> **get** **castingList**(): ([`Mesh`](../../Display/classes/Mesh.md) \| [`InstancingMesh`](../../Display/classes/InstancingMesh.md))[]

Defined in: [src/picking/core/PickingManager.ts:83](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/picking/core/PickingManager.ts#L83)


Returns the picking casting list.

##### Returns

([`Mesh`](../../Display/classes/Mesh.md) \| [`InstancingMesh`](../../Display/classes/InstancingMesh.md))[]

***

### mouseX

#### Get Signature

> **get** **mouseX**(): `number`

Defined in: [src/picking/core/PickingManager.ts:59](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/picking/core/PickingManager.ts#L59)


Mouse X coordinate

##### Returns

`number`

#### Set Signature

> **set** **mouseX**(`value`): `void`

Defined in: [src/picking/core/PickingManager.ts:63](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/picking/core/PickingManager.ts#L63)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### mouseY

#### Get Signature

> **get** **mouseY**(): `number`

Defined in: [src/picking/core/PickingManager.ts:71](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/picking/core/PickingManager.ts#L71)


Mouse Y coordinate

##### Returns

`number`

#### Set Signature

> **set** **mouseY**(`value`): `void`

Defined in: [src/picking/core/PickingManager.ts:75](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/picking/core/PickingManager.ts#L75)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### pickingDepthGPUTextureView

#### Get Signature

> **get** **pickingDepthGPUTextureView**(): `GPUTextureView`

Defined in: [src/picking/core/PickingManager.ts:107](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/picking/core/PickingManager.ts#L107)


Returns the depth texture view for picking.

##### Returns

`GPUTextureView`

***

### pickingGPUTexture

#### Get Signature

> **get** **pickingGPUTexture**(): `GPUTexture`

Defined in: [src/picking/core/PickingManager.ts:91](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/picking/core/PickingManager.ts#L91)


Returns the GPU texture for picking.

##### Returns

`GPUTexture`

***

### pickingGPUTextureView

#### Get Signature

> **get** **pickingGPUTextureView**(): `GPUTextureView`

Defined in: [src/picking/core/PickingManager.ts:99](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/picking/core/PickingManager.ts#L99)


Returns the GPU texture view for picking.

##### Returns

`GPUTextureView`

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/picking/core/PickingManager.ts:51](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/picking/core/PickingManager.ts#L51)


Returns the video memory usage.

##### Returns

`number`

## Methods

### checkEvents()

> **checkEvents**(`view`, `time`): `void`

Defined in: [src/picking/core/PickingManager.ts:168](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/picking/core/PickingManager.ts#L168)


Checks and processes events.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | `any` | View3D instance |
| `time` | `number` | Time |

#### Returns

`void`

***

### checkTexture()

> **checkTexture**(`view`): `void`

Defined in: [src/picking/core/PickingManager.ts:142](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/picking/core/PickingManager.ts#L142)


Checks the texture size and recreates it if necessary.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | `any` | View3D instance |

#### Returns

`void`

***

### destroy()

> **destroy**(): `void`

Defined in: [src/picking/core/PickingManager.ts:123](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/picking/core/PickingManager.ts#L123)


Destroys the PickingManager.

#### Returns

`void`

***

### resetCastingList()

> **resetCastingList**(): `void`

Defined in: [src/picking/core/PickingManager.ts:115](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/picking/core/PickingManager.ts#L115)


Resets the casting list.

#### Returns

`void`
