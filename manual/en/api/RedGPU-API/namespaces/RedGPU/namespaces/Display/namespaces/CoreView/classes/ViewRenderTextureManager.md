[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreView](../README.md) / ViewRenderTextureManager

# Class: ViewRenderTextureManager

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:101](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L101)

Manager class that creates and manages render targets (color, depth, G-Buffer, etc.) for View3D/View2D.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

***

### Example
```typescript
// Access via View3D instance
const viewRenderTextureManager = view.viewRenderTextureManager;
```

## Extends

- [`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new ViewRenderTextureManager**(`view`): `ViewRenderTextureManager`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:130](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L130)

Creates a ViewRenderTextureManager instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../classes/View3D.md) | View3D instance this manager will manage |

#### Returns

`ViewRenderTextureManager`

#### Overrides

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### depthTexture

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **depthTexture**(): `GPUTexture`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:179](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L179)

Returns the depth texture of the current frame.

##### Returns

`GPUTexture`

Current depth texture

***

***

### depthTexture0View

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **depthTexture0View**(): `GPUTextureView`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:218](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L218)

Returns the view of the first depth texture (`depthTexture0`).

##### Returns

`GPUTextureView`

First depth texture view

***

***

### depthTexture1View

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **depthTexture1View**(): `GPUTextureView`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:231](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L231)

Returns the view of the second depth texture (`depthTexture1`).

##### Returns

`GPUTextureView`

Second depth texture view

***

***

### depthTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **depthTextureView**(): `GPUTextureView`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:192](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L192)

Returns the depth texture view of the current frame.

##### Returns

`GPUTextureView`

Current depth texture view

***

***

### gBuffers

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gBuffers**(): `Map`\<`string`, `GBufferInfo`\>

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:143](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L143)

Returns the G-Buffer map (`Map<string, GBufferInfo>`).

##### Returns

`Map`\<`string`, `GBufferInfo`\>

G-Buffer information map

***

***

### prevDepthTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **prevDepthTextureView**(): `GPUTextureView`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:205](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L205)

Returns the depth texture view of the previous frame.

##### Returns

`GPUTextureView`

Previous frame depth texture view

***

***

### renderPath1DepthResultTexture

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **renderPath1DepthResultTexture**(): `GPUTexture`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:280](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L280)

Returns the render path 1 depth result texture.

##### Returns

`GPUTexture`

Render path 1 depth result texture

***

***

### renderPath1DepthResultTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **renderPath1DepthResultTextureView**(): `GPUTextureView`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:268](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L268)

Returns the render path 1 depth result texture view.

##### Returns

`GPUTextureView`

Render path 1 depth result texture view

***

***

### renderPath1ResultTexture

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **renderPath1ResultTexture**(): `GPUTexture`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:256](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L256)

Returns the render path 1 color result texture.

##### Returns

`GPUTexture`

Render path 1 result texture

***

***

### renderPath1ResultTextureDescriptor

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **renderPath1ResultTextureDescriptor**(): `GPUTextureDescriptor`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:167](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L167)

Returns the texture descriptor of the render path 1 result texture.

##### Returns

`GPUTextureDescriptor`

Render path 1 result texture descriptor

***

***

### renderPath1ResultTextureView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **renderPath1ResultTextureView**(): `GPUTextureView`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:244](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L244)

Returns the render path 1 color result texture view.

##### Returns

`GPUTextureView`

Render path 1 result texture view

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:155](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L155)

Returns the total video memory usage (in bytes) of the currently managed render textures.

##### Returns

`number`

Video memory usage (bytes)

## Methods



***

### copyDepthToRenderPath1()

> **copyDepthToRenderPath1**(`encoder`): `void`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:292](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L292)

Copies or MSAA-resolves the depth buffer of render path 1 into `renderPath1DepthResultTexture` for reading in path 2.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `encoder` | `GPUCommandEncoder` | GPUCommandEncoder instance |

#### Returns

`void`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:377](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L377)

Releases all managed G-Buffer and depth texture resources and destroys the manager.

#### Returns

`void`

***

***

### getGBufferResolveTexture()

> **getGBufferResolveTexture**(`type`): `GPUTexture`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:336](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L336)

Returns the MSAA resolve G-Buffer texture of the specified type.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `GBUFFER_TYPE` | G-Buffer type constant |

#### Returns

`GPUTexture`

Resolve target GPU texture

***

***

### getGBufferResolveTextureView()

> **getGBufferResolveTextureView**(`type`): `GPUTextureView`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:368](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L368)

Returns the MSAA resolve G-Buffer texture view of the specified type.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `GBUFFER_TYPE` | G-Buffer type constant |

#### Returns

`GPUTextureView`

Resolve target GPU texture view

***

***

### getGBufferTexture()

> **getGBufferTexture**(`type`): `GPUTexture`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:320](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L320)

Returns the G-Buffer texture of the specified type.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `GBUFFER_TYPE` | G-Buffer type constant |

#### Returns

`GPUTexture`

G-Buffer GPU texture

***

***

### getGBufferTextureView()

> **getGBufferTextureView**(`type`): `GPUTextureView`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:352](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L352)

Returns the G-Buffer texture view of the specified type.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `GBUFFER_TYPE` | G-Buffer type constant |

#### Returns

`GPUTextureView`

G-Buffer GPU texture view

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

Returns the `CommandEncoderManager` instance managing WebGPU command encoding.

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../../../BaseObject/classes/RedGPUObject.md#gpudevice)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../../../BaseObject/classes/RedGPUObject.md#instanceid)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`name`](../../../../BaseObject/classes/RedGPUObject.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

Returns the bound `RedGPUContext` instance.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

Returns the `ResourceManager` instance managing global GPU resources.

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../../../BaseObject/classes/RedGPUObject.md#resourcemanager)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../BaseObject/classes/RedGPUObject.md#uuid)

***

</details>
