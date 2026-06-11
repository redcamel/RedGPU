[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreView](../README.md) / ViewRenderTextureManager

# Class: ViewRenderTextureManager

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:88](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L88)

Manager class that creates and manages render targets (color, depth, G-Buffer, etc.) for View3D/2D.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extends

- [`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md)

## Constructors

### Constructor

> **new ViewRenderTextureManager**(`view`): `ViewRenderTextureManager`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:119](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L119)

Creates a new ViewRenderTextureManager instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../classes/View3D.md) | View3D instance this manager will manage |

#### Returns

`ViewRenderTextureManager`

#### Overrides

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors

### depthTexture

#### Get Signature

> **get** **depthTexture**(): `GPUTexture`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:152](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L152)

Returns the depth texture. (reflects swap buffering)

##### Returns

`GPUTexture`

***

### depthTexture0View

#### Get Signature

> **get** **depthTexture0View**(): `GPUTextureView`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:179](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L179)

Returns the first depth texture view.

##### Returns

`GPUTextureView`

***

### depthTexture1View

#### Get Signature

> **get** **depthTexture1View**(): `GPUTextureView`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:188](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L188)

Returns the second depth texture view.

##### Returns

`GPUTextureView`

***

### depthTextureView

#### Get Signature

> **get** **depthTextureView**(): `GPUTextureView`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:161](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L161)

Returns the depth texture view. (reflects swap buffering)

##### Returns

`GPUTextureView`

***

### gBuffers

#### Get Signature

> **get** **gBuffers**(): `Map`\<`string`, `GBufferInfo`\>

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:128](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L128)

Returns the G-Buffer map.

##### Returns

`Map`\<`string`, `GBufferInfo`\>

***

### prevDepthTextureView

#### Get Signature

> **get** **prevDepthTextureView**(): `GPUTextureView`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:170](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L170)

Returns the depth texture view of the previous frame. (reflects swap buffering)

##### Returns

`GPUTextureView`

***

### renderPath1ResultTexture

#### Get Signature

> **get** **renderPath1ResultTexture**(): `GPUTexture`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:205](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L205)

Returns the render path 1 stage result texture.

##### Returns

`GPUTexture`

***

### renderPath1ResultTextureDescriptor

#### Get Signature

> **get** **renderPath1ResultTextureDescriptor**(): `GPUTextureDescriptor`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:144](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L144)

Returns the descriptor used to create the render path 1 stage result texture.

##### Returns

`GPUTextureDescriptor`

***

### renderPath1ResultTextureView

#### Get Signature

> **get** **renderPath1ResultTextureView**(): `GPUTextureView`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:197](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L197)

Returns the render path 1 stage result texture view.

##### Returns

`GPUTextureView`

***

### videoMemorySize

#### Get Signature

> **get** **videoMemorySize**(): `number`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:136](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L136)

Returns the currently calculated video memory usage (in bytes).

##### Returns

`number`

## Methods

### getGBufferResolveTexture()

> **getGBufferResolveTexture**(`type`): `GPUTexture`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:231](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L231)

Returns the G-Buffer resolve texture of the specified type.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `GBUFFER_TYPE` | G-Buffer type constant |

#### Returns

`GPUTexture`

***

### getGBufferResolveTextureView()

> **getGBufferResolveTextureView**(`type`): `GPUTextureView`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:255](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L255)

Returns the G-Buffer resolve texture view of the specified type.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `GBUFFER_TYPE` | G-Buffer type constant |

#### Returns

`GPUTextureView`

***

### getGBufferTexture()

> **getGBufferTexture**(`type`): `GPUTexture`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:219](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L219)

Returns the G-Buffer texture of the specified type.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `GBUFFER_TYPE` | G-Buffer type constant |

#### Returns

`GPUTexture`

***

### getGBufferTextureView()

> **getGBufferTextureView**(`type`): `GPUTextureView`

Defined in: [src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts:243](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/viewRenderTextureManager/ViewRenderTextureManager.ts#L243)

Returns the G-Buffer texture view of the specified type.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `type` | `GBUFFER_TYPE` | G-Buffer type constant |

#### Returns

`GPUTextureView`


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/RedGPUObject.ts#L76)

Returns the AntialiasingManager instance. (Short-cut path)

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/RedGPUObject.ts#L88)

Returns the CommandEncoderManager instance. (Short-cut path)

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/RedGPUObject.ts#L52)

Returns the WebGPU device object. (Short-cut path)

##### Returns

`GPUDevice`

GPUDevice instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/BaseObject.ts#L58)

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/BaseObject.ts#L71)

Sets the name of the object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name of the object to set |

##### Returns

`void`

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`name`](../../../../BaseObject/classes/RedGPUObject.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/RedGPUObject.ts#L40)

Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

RedGPUContext instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/RedGPUObject.ts#L64)

Returns the ResourceManager instance. (Short-cut path)

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager instance

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/BaseObject.ts#L46)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../BaseObject/classes/RedGPUObject.md#uuid)

***


</details>
