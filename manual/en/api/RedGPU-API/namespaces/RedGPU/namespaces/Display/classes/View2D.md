[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / View2D

# Class: View2D

Defined in: [src/display/view/View2D.ts:28](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/View2D.ts#L28)

View class for 2D rendering.

Extends View3D and internally uses Camera2D to provide a viewpoint optimized for 2D environments. It is used for 2D visualization and UI composition in RedGPU.

* ### Example
```typescript
const scene = new RedGPU.Display.Scene();
const view = new RedGPU.Display.View2D(redGPUContext, scene);
redGPUContext.addView(view);
```
<iframe src="https://redcamel.github.io/RedGPU/examples/2d/helloWorld2D/" ></iframe>

Below is a list of additional sample examples to help understand the structure and operation of View2D.

## See

 - [Multi View2D(2D + 2D) example](https://redcamel.github.io/RedGPU/examples/2d/view/multiView/)
 - [Multi View2D(2D + 3D) example](https://redcamel.github.io/RedGPU/examples/2d/view/multiViewWith3D/)

## Extends

- [`View3D`](View3D.md)

## Constructors

### Constructor

> **new View2D**(`redGPUContext`, `scene`, `name?`): `View2D`

Defined in: [src/display/view/View2D.ts:45](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/View2D.ts#L45)

View2D constructor
Automatically creates a Camera2D and passes it to the View3D constructor.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `scene` | [`Scene`](Scene.md) | Scene instance |
| `name?` | `string` | Optional view name |

#### Returns

`View2D`

#### Overrides

[`View3D`](View3D.md).[`constructor`](View3D.md#constructor)

## Properties


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### onResize

> **onResize**: (`event`) => `void` = `null`

Defined in: [src/display/view/core/ViewTransform.ts:31](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/ViewTransform.ts#L31)

Callback function called when the view size changes

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `RedResizeEvent`\<[`ViewTransform`](../namespaces/CoreView/classes/ViewTransform.md)\> |

#### Returns

`void`

#### Inherited from

[`View3D`](View3D.md).[`onResize`](View3D.md#onresize)

## Accessors

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/RedGPUObject.ts#L76)

Returns the AntialiasingManager instance. (Short-cut path)

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager instance

#### Inherited from

[`View3D`](View3D.md).[`antialiasingManager`](View3D.md#antialiasingmanager)

***

### aspect

#### Get Signature

> **get** **aspect**(): `number`

Defined in: [src/display/view/core/ViewTransform.ts:232](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/ViewTransform.ts#L232)

Returns the aspect ratio (width/height) of the current view.

##### Returns

`number`

#### Inherited from

[`View3D`](View3D.md).[`aspect`](View3D.md#aspect)

***

### axis

#### Get Signature

> **get** **axis**(): [`DrawDebuggerAxis`](../namespaces/drawDebugger/classes/DrawDebuggerAxis.md)

Defined in: [src/display/view/core/AView.ts:226](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/AView.ts#L226)

Returns the axis object for debugging.

##### Returns

[`DrawDebuggerAxis`](../namespaces/drawDebugger/classes/DrawDebuggerAxis.md)

#### Set Signature

> **set** **axis**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:237](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/AView.ts#L237)

Sets the axis for debugging.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` \| [`DrawDebuggerAxis`](../namespaces/drawDebugger/classes/DrawDebuggerAxis.md) | boolean or DrawDebuggerAxis instance |

##### Returns

`void`

#### Inherited from

[`View3D`](View3D.md).[`axis`](View3D.md#axis)

***

### basicRenderBundleEncoderDescriptor

#### Get Signature

> **get** **basicRenderBundleEncoderDescriptor**(): `GPURenderBundleEncoderDescriptor`

Defined in: [src/display/view/View3D.ts:240](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/View3D.ts#L240)

Returns the basic render bundle encoder descriptor.

##### Returns

`GPURenderBundleEncoderDescriptor`

#### Inherited from

[`View3D`](View3D.md).[`basicRenderBundleEncoderDescriptor`](View3D.md#basicrenderbundleencoderdescriptor)

***

### camera

#### Get Signature

> **get** **camera**(): [`Camera2D`](../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../Camera/namespaces/Core/classes/AController.md)

Defined in: [src/display/view/core/ViewTransform.ts:99](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/ViewTransform.ts#L99)

Returns the currently connected camera.

##### Returns

[`Camera2D`](../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../Camera/namespaces/Core/classes/AController.md)

#### Set Signature

> **set** **camera**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:113](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/ViewTransform.ts#L113)

Sets the camera. Must be one of PerspectiveCamera, OrthographicCamera, AController, or Camera2D.

##### Throws

Throws error if camera type is not supported

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Camera2D`](../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../Camera/namespaces/Core/classes/AController.md) | Camera instance to connect |

##### Returns

`void`

#### Inherited from

[`View3D`](View3D.md).[`camera`](View3D.md#camera)

***

### clusterLightManager

#### Get Signature

> **get** **clusterLightManager**(): `ClusterLightManager`

Defined in: [src/display/view/View3D.ts:115](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/View3D.ts#L115)

Returns the cluster light manager.

##### Returns

`ClusterLightManager`

#### Inherited from

[`View3D`](View3D.md).[`clusterLightManager`](View3D.md#clusterlightmanager)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/RedGPUObject.ts#L88)

Returns the CommandEncoderManager instance. (Short-cut path)

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager instance

#### Inherited from

[`View3D`](View3D.md).[`commandEncoderManager`](View3D.md#commandencodermanager)

***

### distanceCulling

#### Get Signature

> **get** **distanceCulling**(): `number`

Defined in: [src/display/view/core/AView.ts:179](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/AView.ts#L179)

Returns the threshold distance for distance-based culling.

##### Returns

`number`

#### Set Signature

> **set** **distanceCulling**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:190](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/AView.ts#L190)

Sets the threshold distance for distance-based culling.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Distance value |

##### Returns

`void`

#### Inherited from

[`View3D`](View3D.md).[`distanceCulling`](View3D.md#distanceculling)

***

### frustumPlanes

#### Get Signature

> **get** **frustumPlanes**(): `number`[][]

Defined in: [src/display/view/core/ViewTransform.ts:243](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/ViewTransform.ts#L243)

Calculates and returns the view frustum planes based on the current projection and camera view matrices.

##### Returns

`number`[][]

Frustum planes array

#### Inherited from

[`View3D`](View3D.md).[`frustumPlanes`](View3D.md#frustumplanes)

***

### fxaa

#### Get Signature

> **get** **fxaa**(): [`FXAA`](../../Antialiasing/classes/FXAA.md)

Defined in: [src/display/view/core/AView.ts:257](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/AView.ts#L257)

Returns the FXAA post-effect object.

##### Returns

[`FXAA`](../../Antialiasing/classes/FXAA.md)

FXAA instance

#### Inherited from

[`View3D`](View3D.md).[`fxaa`](View3D.md#fxaa)

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

[`View3D`](View3D.md).[`gpuDevice`](View3D.md#gpudevice)

***

### grid

#### Get Signature

> **get** **grid**(): [`DrawDebuggerGrid`](../namespaces/drawDebugger/classes/DrawDebuggerGrid.md)

Defined in: [src/display/view/core/AView.ts:198](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/AView.ts#L198)

Returns the grid object for debugging.

##### Returns

[`DrawDebuggerGrid`](../namespaces/drawDebugger/classes/DrawDebuggerGrid.md)

#### Set Signature

> **set** **grid**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:209](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/AView.ts#L209)

Sets the grid for debugging.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` \| [`DrawDebuggerGrid`](../namespaces/drawDebugger/classes/DrawDebuggerGrid.md) | boolean or DrawDebuggerGrid instance |

##### Returns

`void`

#### Inherited from

[`View3D`](View3D.md).[`grid`](View3D.md#grid)

***

### height

#### Get Signature

> **get** **height**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:179](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/ViewTransform.ts#L179)

Returns the height value of the view. (Pixels or percentage string)

##### Returns

`string` \| `number`

#### Set Signature

> **set** **height**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:190](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/ViewTransform.ts#L190)

Sets the height of the view.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | Height value to set |

##### Returns

`void`

#### Inherited from

[`View3D`](View3D.md).[`height`](View3D.md#height)

***

### ibl

#### Get Signature

> **get** **ibl**(): [`IBL`](../../Resource/classes/IBL.md)

Defined in: [src/display/view/View3D.ts:155](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/View3D.ts#L155)

Returns the currently configured IBL (Image-Based Lighting) object.

##### Returns

[`IBL`](../../Resource/classes/IBL.md)

#### Set Signature

> **set** **ibl**(`value`): `void`

Defined in: [src/display/view/View3D.ts:166](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/View3D.ts#L166)

Sets the IBL (Image-Based Lighting) object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`IBL`](../../Resource/classes/IBL.md) | IBL instance to set |

##### Returns

`void`

#### Inherited from

[`View3D`](View3D.md).[`ibl`](View3D.md#ibl)

***

### inverseProjectionMatrix

#### Get Signature

> **get** **inverseProjectionMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:330](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/ViewTransform.ts#L330)

Computes and returns the inverse projection matrix.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

#### Inherited from

[`View3D`](View3D.md).[`inverseProjectionMatrix`](View3D.md#inverseprojectionmatrix)

***

### jitterOffset

#### Get Signature

> **get** **jitterOffset**(): \[`number`, `number`\]

Defined in: [src/display/view/core/ViewTransform.ts:338](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/ViewTransform.ts#L338)

Returns the currently configured jitter offset [offsetX, offsetY].

##### Returns

\[`number`, `number`\]

#### Inherited from

[`View3D`](View3D.md).[`jitterOffset`](View3D.md#jitteroffset)

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

[`View3D`](View3D.md).[`name`](View3D.md#name)

***

### noneJitterProjectionMatrix

#### Get Signature

> **get** **noneJitterProjectionMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:263](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/ViewTransform.ts#L263)

Returns the original projection matrix with jitter excluded.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

#### Inherited from

[`View3D`](View3D.md).[`noneJitterProjectionMatrix`](View3D.md#nonejitterprojectionmatrix)

***

### noneJitterProjectionViewMatrix

#### Get Signature

> **get** **noneJitterProjectionViewMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/View3D.ts:254](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/View3D.ts#L254)

Returns the projection view matrix with jitter excluded.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

#### Inherited from

[`View3D`](View3D.md).[`noneJitterProjectionViewMatrix`](View3D.md#nonejitterprojectionviewmatrix)

***

### pickingManager

#### Get Signature

> **get** **pickingManager**(): [`PickingManager`](../../Picking/classes/PickingManager.md)

Defined in: [src/display/view/core/AView.ts:133](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/AView.ts#L133)

Returns the PickingManager for mouse coordinate-based object selection.

##### Returns

[`PickingManager`](../../Picking/classes/PickingManager.md)

#### Inherited from

[`View3D`](View3D.md).[`pickingManager`](View3D.md#pickingmanager)

***

### pixelRectArray

#### Get Signature

> **get** **pixelRectArray**(): \[`number`, `number`, `number`, `number`\]

Defined in: [src/display/view/core/ViewTransform.ts:198](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/ViewTransform.ts#L198)

Returns the rectangle array in pixels. ([x, y, width, height])

##### Returns

\[`number`, `number`, `number`, `number`\]

#### Inherited from

[`View3D`](View3D.md).[`pixelRectArray`](View3D.md#pixelrectarray)

***

### pixelRectObject

#### Get Signature

> **get** **pixelRectObject**(): `object`

Defined in: [src/display/view/core/ViewTransform.ts:206](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/ViewTransform.ts#L206)

Returns the pixel rectangle in object form. ({ x, y, width, height })

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [src/display/view/core/ViewTransform.ts:211](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/ViewTransform.ts#L211) |
| `width` | `number` | [src/display/view/core/ViewTransform.ts:210](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/ViewTransform.ts#L210) |
| `x` | `number` | [src/display/view/core/ViewTransform.ts:208](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/ViewTransform.ts#L208) |
| `y` | `number` | [src/display/view/core/ViewTransform.ts:209](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/ViewTransform.ts#L209) |

#### Inherited from

[`View3D`](View3D.md).[`pixelRectObject`](View3D.md#pixelrectobject)

***

### postEffectManager

#### Get Signature

> **get** **postEffectManager**(): [`PostEffectManager`](../../PostEffect/classes/PostEffectManager.md)

Defined in: [src/display/view/View3D.ts:174](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/View3D.ts#L174)

Returns the post effect manager.

##### Returns

[`PostEffectManager`](../../PostEffect/classes/PostEffectManager.md)

#### Inherited from

[`View3D`](View3D.md).[`postEffectManager`](View3D.md#posteffectmanager)

***

### projectionMatrix

#### Get Signature

> **get** **projectionMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:308](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/ViewTransform.ts#L308)

Returns the final projection matrix reflecting the jitter offset. (Applied only to PerspectiveCamera when TAA is enabled)

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

#### Inherited from

[`View3D`](View3D.md).[`projectionMatrix`](View3D.md#projectionmatrix)

***

### rawCamera

#### Get Signature

> **get** **rawCamera**(): [`Camera2D`](../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../Camera/classes/OrthographicCamera.md)

Defined in: [src/display/view/core/ViewTransform.ts:255](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/ViewTransform.ts#L255)

Returns the raw camera instance referenced internally. (Returns internal camera if AController is linked)

##### Returns

[`Camera2D`](../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../Camera/classes/OrthographicCamera.md)

#### Inherited from

[`View3D`](View3D.md).[`rawCamera`](View3D.md#rawcamera)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/RedGPUObject.ts#L40)

Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext instance

#### Inherited from

[`View3D`](View3D.md).[`redGPUContext`](View3D.md#redgpucontext)

***

### renderViewStateData

#### Get Signature

> **get** **renderViewStateData**(): [`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md)

Defined in: [src/display/view/View3D.ts:190](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/View3D.ts#L190)

Returns the rendering state data for tracking.

##### Returns

[`RenderViewStateData`](../namespaces/CoreView/classes/RenderViewStateData.md)

#### Inherited from

[`View3D`](View3D.md).[`renderViewStateData`](View3D.md#renderviewstatedata)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/base/RedGPUObject.ts#L64)

Returns the ResourceManager instance. (Short-cut path)

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager instance

#### Inherited from

[`View3D`](View3D.md).[`resourceManager`](View3D.md#resourcemanager)

***

### scene

#### Get Signature

> **get** **scene**(): [`Scene`](Scene.md)

Defined in: [src/display/view/core/AView.ts:110](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/AView.ts#L110)

Returns the Scene object connected to the current view.

##### Returns

[`Scene`](Scene.md)

#### Set Signature

> **set** **scene**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:124](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/AView.ts#L124)

Sets the Scene for the view.

##### Throws

Throws error if not a Scene instance

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Scene`](Scene.md) | Scene instance |

##### Returns

`void`

#### Inherited from

[`View3D`](View3D.md).[`scene`](View3D.md#scene)

***

### screenRectObject

#### Get Signature

> **get** **screenRectObject**(): `object`

Defined in: [src/display/view/core/ViewTransform.ts:219](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/ViewTransform.ts#L219)

Returns the screen-relative rectangle object scaled by dividing by devicePixelRatio.

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [src/display/view/core/ViewTransform.ts:224](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/ViewTransform.ts#L224) |
| `width` | `number` | [src/display/view/core/ViewTransform.ts:223](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/ViewTransform.ts#L223) |
| `x` | `number` | [src/display/view/core/ViewTransform.ts:221](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/ViewTransform.ts#L221) |
| `y` | `number` | [src/display/view/core/ViewTransform.ts:222](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/ViewTransform.ts#L222) |

#### Inherited from

[`View3D`](View3D.md).[`screenRectObject`](View3D.md#screenrectobject)

***

### skyAtmosphere

#### Get Signature

> **get** **skyAtmosphere**(): [`SkyAtmosphere`](SkyAtmosphere.md)

Defined in: [src/display/view/View3D.ts:221](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/View3D.ts#L221)

Returns the sky atmosphere object.

##### Returns

[`SkyAtmosphere`](SkyAtmosphere.md)

#### Set Signature

> **set** **skyAtmosphere**(`value`): `void`

Defined in: [src/display/view/View3D.ts:232](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/View3D.ts#L232)

Sets the sky atmosphere object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`SkyAtmosphere`](SkyAtmosphere.md) | Sky atmosphere instance to set |

##### Returns

`void`

#### Inherited from

[`View3D`](View3D.md).[`skyAtmosphere`](View3D.md#skyatmosphere)

***

### skybox

#### Get Signature

> **get** **skybox**(): [`SkyBox`](SkyBox.md)

Defined in: [src/display/view/View3D.ts:198](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/View3D.ts#L198)

Returns the skybox object.

##### Returns

[`SkyBox`](SkyBox.md)

#### Set Signature

> **set** **skybox**(`value`): `void`

Defined in: [src/display/view/View3D.ts:209](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/View3D.ts#L209)

Sets the skybox object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`SkyBox`](SkyBox.md) | Skybox instance to set |

##### Returns

`void`

#### Inherited from

[`View3D`](View3D.md).[`skybox`](View3D.md#skybox)

***

### systemUniform\_Vertex\_StructInfo

#### Get Signature

> **get** **systemUniform\_Vertex\_StructInfo**(): `any`

Defined in: [src/display/view/View3D.ts:131](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/View3D.ts#L131)

Returns the system vertex uniform structure information.

##### Returns

`any`

#### Inherited from

[`View3D`](View3D.md).[`systemUniform_Vertex_StructInfo`](View3D.md#systemuniform_vertex_structinfo)

***

### systemUniform\_Vertex\_UniformBindGroup

#### Get Signature

> **get** **systemUniform\_Vertex\_UniformBindGroup**(): `GPUBindGroup`

Defined in: [src/display/view/View3D.ts:139](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/View3D.ts#L139)

Returns the system vertex uniform bind group.

##### Returns

`GPUBindGroup`

#### Inherited from

[`View3D`](View3D.md).[`systemUniform_Vertex_UniformBindGroup`](View3D.md#systemuniform_vertex_uniformbindgroup)

***

### systemUniform\_Vertex\_UniformBuffer

#### Get Signature

> **get** **systemUniform\_Vertex\_UniformBuffer**(): [`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

Defined in: [src/display/view/View3D.ts:147](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/View3D.ts#L147)

Returns the system vertex uniform buffer.

##### Returns

[`UniformBuffer`](../../Resource/classes/UniformBuffer.md)

#### Inherited from

[`View3D`](View3D.md).[`systemUniform_Vertex_UniformBuffer`](View3D.md#systemuniform_vertex_uniformbuffer)

***

### taa

#### Get Signature

> **get** **taa**(): [`TAA`](../../Antialiasing/classes/TAA.md)

Defined in: [src/display/view/core/AView.ts:271](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/AView.ts#L271)

Returns the TAA post-effect object.

##### Returns

[`TAA`](../../Antialiasing/classes/TAA.md)

TAA instance

#### Inherited from

[`View3D`](View3D.md).[`taa`](View3D.md#taa)

***

### toneMappingManager

#### Get Signature

> **get** **toneMappingManager**(): [`ToneMappingManager`](../../ToneMapping/classes/ToneMappingManager.md)

Defined in: [src/display/view/View3D.ts:182](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/View3D.ts#L182)

Returns the tone mapping manager.

##### Returns

[`ToneMappingManager`](../../ToneMapping/classes/ToneMappingManager.md)

#### Inherited from

[`View3D`](View3D.md).[`toneMappingManager`](View3D.md#tonemappingmanager)

***

### useDistanceCulling

#### Get Signature

> **get** **useDistanceCulling**(): `boolean`

Defined in: [src/display/view/core/AView.ts:160](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/AView.ts#L160)

Returns whether to use distance-based culling.

##### Returns

`boolean`

#### Set Signature

> **set** **useDistanceCulling**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:171](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/AView.ts#L171)

Sets whether to use distance-based culling.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Whether to use |

##### Returns

`void`

#### Inherited from

[`View3D`](View3D.md).[`useDistanceCulling`](View3D.md#usedistanceculling)

***

### useFrustumCulling

#### Get Signature

> **get** **useFrustumCulling**(): `boolean`

Defined in: [src/display/view/core/AView.ts:141](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/AView.ts#L141)

Returns whether to use frustum culling.

##### Returns

`boolean`

#### Set Signature

> **set** **useFrustumCulling**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:152](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/AView.ts#L152)

Sets whether to use frustum culling.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Whether to use |

##### Returns

`void`

#### Inherited from

[`View3D`](View3D.md).[`useFrustumCulling`](View3D.md#usefrustumculling)

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

[`View3D`](View3D.md).[`uuid`](View3D.md#uuid)

***

### viewRenderTextureManager

#### Get Signature

> **get** **viewRenderTextureManager**(): [`ViewRenderTextureManager`](../namespaces/CoreView/classes/ViewRenderTextureManager.md)

Defined in: [src/display/view/View3D.ts:123](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/View3D.ts#L123)

Returns the view render texture manager.

##### Returns

[`ViewRenderTextureManager`](../namespaces/CoreView/classes/ViewRenderTextureManager.md)

#### Inherited from

[`View3D`](View3D.md).[`viewRenderTextureManager`](View3D.md#viewrendertexturemanager)

***

### width

#### Get Signature

> **get** **width**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:160](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/ViewTransform.ts#L160)

Returns the width value of the view. (Pixels or percentage string)

##### Returns

`string` \| `number`

#### Set Signature

> **set** **width**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:171](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/ViewTransform.ts#L171)

Sets the width of the view.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | Width value to set |

##### Returns

`void`

#### Inherited from

[`View3D`](View3D.md).[`width`](View3D.md#width)

***

### x

#### Get Signature

> **get** **x**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:122](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/ViewTransform.ts#L122)

Returns the X position value of the view. (Pixels or percentage string)

##### Returns

`string` \| `number`

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:133](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/ViewTransform.ts#L133)

Sets the X position of the view.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | X position value to set |

##### Returns

`void`

#### Inherited from

[`View3D`](View3D.md).[`x`](View3D.md#x)

***

### y

#### Get Signature

> **get** **y**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:141](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/ViewTransform.ts#L141)

Returns the Y position value of the view. (Pixels or percentage string)

##### Returns

`string` \| `number`

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:152](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/ViewTransform.ts#L152)

Sets the Y position of the view.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | Y position value to set |

##### Returns

`void`

#### Inherited from

[`View3D`](View3D.md).[`y`](View3D.md#y)

## Methods

### checkMouseInViewBounds()

> **checkMouseInViewBounds**(): `boolean`

Defined in: [src/display/view/core/AView.ts:305](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/AView.ts#L305)

Checks if the mouse pointer is within the pixel area of the current view.

#### Returns

`boolean`

True if the mouse is inside the view bounds, otherwise false

#### Inherited from

[`View3D`](View3D.md).[`checkMouseInViewBounds`](View3D.md#checkmouseinviewbounds)

***

### clearJitterOffset()

> **clearJitterOffset**(): `void`

Defined in: [src/display/view/core/ViewTransform.ts:361](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/ViewTransform.ts#L361)

Clears and resets the jitter offset to 0.

#### Returns

`void`

#### Inherited from

[`View3D`](View3D.md).[`clearJitterOffset`](View3D.md#clearjitteroffset)

***

### screenToWorld()

> **screenToWorld**(`screenX`, `screenY`): `number`[]

Defined in: [src/display/view/core/AView.ts:291](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/AView.ts#L291)

Converts screen coordinates to world coordinates.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `screenX` | `number` | Screen X coordinate |
| `screenY` | `number` | Screen Y coordinate |

#### Returns

`number`[]

Converted world coordinates (3D vector array)

#### Inherited from

[`View3D`](View3D.md).[`screenToWorld`](View3D.md#screentoworld)

***

### setJitterOffset()

> **setJitterOffset**(`offsetX`, `offsetY`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:352](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/ViewTransform.ts#L352)

Sets the render pixel jitter offset for TAA calculations.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `offsetX` | `number` | X-axis jitter offset value |
| `offsetY` | `number` | Y-axis jitter offset value |

#### Returns

`void`

#### Inherited from

[`View3D`](View3D.md).[`setJitterOffset`](View3D.md#setjitteroffset)

***

### setPosition()

> **setPosition**(`x?`, `y?`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:376](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/ViewTransform.ts#L376)

Sets the position (X, Y) of the view and updates physical pixel rectangle values considering DPI.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `string` \| `number` | X position to set (pixel number or percentage string, default: current X) |
| `y` | `string` \| `number` | Y position to set (pixel number or percentage string, default: current Y) |

#### Returns

`void`

#### Inherited from

[`View3D`](View3D.md).[`setPosition`](View3D.md#setposition)

***

### setSize()

> **setSize**(`w?`, `h?`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:399](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/core/ViewTransform.ts#L399)

Sets the size (width, height) of the view and updates internal physical pixel rectangle values. Triggers onResize callback if registered.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `w` | `string` \| `number` | Width to set (pixel number or percentage string, default: current width) |
| `h` | `string` \| `number` | Height to set (pixel number or percentage string, default: current height) |

#### Returns

`void`

#### Inherited from

[`View3D`](View3D.md).[`setSize`](View3D.md#setsize)

***

### update()

> **update**(`shadowRender?`, `calcPointLightCluster?`, `renderPath1ResultTextureView?`): `void`

Defined in: [src/display/view/View3D.ts:271](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/display/view/View3D.ts#L271)

Updates view and lighting data every frame.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `shadowRender` | `boolean` | `false` | Whether it is a shadow map generation render pass |
| `calcPointLightCluster` | `boolean` | `false` | Whether to calculate point light cluster |
| `renderPath1ResultTextureView?` | `GPUTextureView` | `undefined` | Render path 1 stage result texture view |

#### Returns

`void`

#### Inherited from

[`View3D`](View3D.md).[`update`](View3D.md#update)


</details>
