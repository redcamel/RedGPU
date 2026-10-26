[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Picking](../README.md) / PickingManager

# Class: PickingManager

Defined in: [src/picking/core/PickingManager.ts:37](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L37)

Manager class that processes mouse interactions with objects in a view by combining a GPU offscreen picking pass and raycasting.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

***

### Example
```typescript
// Correct access method
const pickingManager = view.pickingManager;
```

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new PickingManager**(`view`): `PickingManager`

Defined in: [src/picking/core/PickingManager.ts:74](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L74)

Creates a PickingManager instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`AView`](../../Display/namespaces/CoreView/classes/AView.md) | Target view instance for picking |

#### Returns

`PickingManager`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Properties



***

### lastMouseClickEvent

> **lastMouseClickEvent**: `MouseEvent`

Defined in: [src/picking/core/PickingManager.ts:47](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L47)

Last received mouse click event

***

***

### lastMouseEvent

> **lastMouseEvent**: `MouseEvent`

Defined in: [src/picking/core/PickingManager.ts:42](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L42)

Last received mouse move/button event

## Accessors



***

### castingList

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **castingList**(): ([`Mesh`](../../Display/classes/Mesh.md) \| [`InstancingMesh`](../../Display/classes/InstancingMesh.md))[]

Defined in: [src/picking/core/PickingManager.ts:131](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L131)

Returns the list of picking target objects collected in the current frame.

##### Returns

([`Mesh`](../../Display/classes/Mesh.md) \| [`InstancingMesh`](../../Display/classes/InstancingMesh.md))[]

Array of picking target meshes

***

***

### mouseX

#### Get Signature

> **get** **mouseX**(): `number`

Defined in: [src/picking/core/PickingManager.ts:99](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L99)

Gets or sets the current logical mouse X coordinate.

##### Returns

`number`

Logical mouse X coordinate

#### Set Signature

> **set** **mouseX**(`value`): `void`

Defined in: [src/picking/core/PickingManager.ts:103](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L103)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### mouseY

#### Get Signature

> **get** **mouseY**(): `number`

Defined in: [src/picking/core/PickingManager.ts:115](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L115)

Gets or sets the current logical mouse Y coordinate.

##### Returns

`number`

Logical mouse Y coordinate

#### Set Signature

> **set** **mouseY**(`value`): `void`

Defined in: [src/picking/core/PickingManager.ts:119](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L119)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### pickingDepthGPUTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pickingDepthGPUTextureView**(): `GPUTextureView`

Defined in: [src/picking/core/PickingManager.ts:167](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L167)

Returns the GPU texture view of the picking depth texture.

##### Returns

`GPUTextureView`

`GPUTextureView` for picking depth

***

***

### pickingGPUTexture

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pickingGPUTexture**(): `GPUTexture`

Defined in: [src/picking/core/PickingManager.ts:143](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L143)

Returns the GPU texture used for picking color rendering.

##### Returns

`GPUTexture`

`GPUTexture` for picking

***

***

### pickingGPUTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pickingGPUTextureView**(): `GPUTextureView`

Defined in: [src/picking/core/PickingManager.ts:155](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L155)

Returns the GPU texture view of the picking color texture.

##### Returns

`GPUTextureView`

`GPUTextureView` for picking

***

***

### pickingPassDescriptor

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pickingPassDescriptor**(): `GPURenderPassDescriptor`

Defined in: [src/picking/core/PickingManager.ts:179](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L179)

Returns the picking render pass descriptor.

##### Returns

`GPURenderPassDescriptor`

`GPURenderPassDescriptor` object

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/picking/core/PickingManager.ts:87](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L87)

Returns the total video memory size (in bytes) occupied by picking textures.

##### Returns

`number`

Video memory usage (unit: bytes)

## Methods



***

### checkEvents()

> **checkEvents**(`view`, `time`): `Promise`\<`void`\>

Defined in: [src/picking/core/PickingManager.ts:268](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L268)

Asynchronously reads the pixel color value to identify the picked object and dispatches registered mouse events.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | `any` | Target view instance |
| `time` | `number` | Current frame time (ms) |

#### Returns

`Promise`\<`void`\>

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/picking/core/PickingManager.ts:242](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L242)

Destroys the picking manager's GPU textures and pixel readback buffer.

#### Returns

`void`

***

***

### render()

> **render**(`view`): `void`

Defined in: [src/picking/core/PickingManager.ts:191](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L191)

Records collected picking target objects into the picking render pass and schedules pixel readback copy.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | Target `View3D` instance to render |

#### Returns

`void`

***

***

### resetCastingList()

> **resetCastingList**(): `void`

Defined in: [src/picking/core/PickingManager.ts:234](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/picking/core/PickingManager.ts#L234)

Clears the picking casting list.

#### Returns

`void`

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

Returns the `CommandEncoderManager` instance managing WebGPU command encoding.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L56)

Returns the logical WebGPU device (`GPUDevice`) assigned to the context.

##### Returns

`GPUDevice`

`GPUDevice` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

Returns the unique sequential instance ID assigned per class.

##### Returns

`number`

Per-class unique instance ID

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../BaseObject/classes/RedGPUObject.md#instanceid)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L63)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`name`](../../BaseObject/classes/RedGPUObject.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

Returns the bound `RedGPUContext` instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

Returns the `ResourceManager` instance managing global GPU resources.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` instance

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

***

</details>
