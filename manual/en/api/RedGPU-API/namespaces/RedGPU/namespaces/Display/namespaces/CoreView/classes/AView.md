[**RedGPU API v4.2.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreView](../README.md) / AView

# Abstract Class: AView

Defined in: [src/display/view/core/AView.ts:30](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/AView.ts#L30)

Abstract base class that serves as a common foundation for View3D and View2D.

Plays a key role in RedGPU's view system, including Scene, Camera, PickingManager, debugging tools (Grid, Axis), and post-effects (TAA, FXAA).

::: warning
This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extends

- [`ViewTransform`](ViewTransform.md)

## Extended by

- [`View3D`](../../../classes/View3D.md)

## Constructors

### Constructor

> `protected` **new AView**(`redGPUContext`, `scene`, `camera`, `name?`): `AView`

Defined in: [src/display/view/core/AView.ts:93](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/AView.ts#L93)

AView constructor

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `scene` | [`Scene`](../../../classes/Scene.md) | Scene instance |
| `camera` | [`Camera2D`](../../../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../../../Camera/namespaces/Core/classes/AController.md) | PerspectiveCamera, OrthographicCamera, AController or Camera2D instance |
| `name?` | `string` | Optional name |

#### Returns

`AView`

#### Overrides

[`ViewTransform`](ViewTransform.md).[`constructor`](ViewTransform.md#constructor)

## Properties

### axis

#### Get Signature

> **get** **axis**(): [`DrawDebuggerAxis`](../../drawDebugger/classes/DrawDebuggerAxis.md)

Defined in: [src/display/view/core/AView.ts:226](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/AView.ts#L226)

Returns the axis object for debugging.

##### Returns

[`DrawDebuggerAxis`](../../drawDebugger/classes/DrawDebuggerAxis.md)

#### Set Signature

> **set** **axis**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:237](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/AView.ts#L237)

Sets the axis for debugging.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` \| [`DrawDebuggerAxis`](../../drawDebugger/classes/DrawDebuggerAxis.md) | boolean or DrawDebuggerAxis instance |

##### Returns

`void`

***

### distanceCulling

#### Get Signature

> **get** **distanceCulling**(): `number`

Defined in: [src/display/view/core/AView.ts:179](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/AView.ts#L179)

Returns the threshold distance for distance-based culling.

##### Returns

`number`

#### Set Signature

> **set** **distanceCulling**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:190](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/AView.ts#L190)

Sets the threshold distance for distance-based culling.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Distance value |

##### Returns

`void`

***

### fxaa

#### Get Signature

> **get** **fxaa**(): [`FXAA`](../../../../Antialiasing/classes/FXAA.md)

Defined in: [src/display/view/core/AView.ts:257](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/AView.ts#L257)

Returns the FXAA post-effect object.

##### Returns

[`FXAA`](../../../../Antialiasing/classes/FXAA.md)

FXAA instance

***

### grid

#### Get Signature

> **get** **grid**(): [`DrawDebuggerGrid`](../../drawDebugger/classes/DrawDebuggerGrid.md)

Defined in: [src/display/view/core/AView.ts:198](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/AView.ts#L198)

Returns the grid object for debugging.

##### Returns

[`DrawDebuggerGrid`](../../drawDebugger/classes/DrawDebuggerGrid.md)

#### Set Signature

> **set** **grid**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:209](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/AView.ts#L209)

Sets the grid for debugging.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` \| [`DrawDebuggerGrid`](../../drawDebugger/classes/DrawDebuggerGrid.md) | boolean or DrawDebuggerGrid instance |

##### Returns

`void`

***

### pickingManager

#### Get Signature

> **get** **pickingManager**(): [`PickingManager`](../../../../Picking/classes/PickingManager.md)

Defined in: [src/display/view/core/AView.ts:133](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/AView.ts#L133)

Returns the PickingManager for mouse coordinate-based object selection.

##### Returns

[`PickingManager`](../../../../Picking/classes/PickingManager.md)

***

### scene

#### Get Signature

> **get** **scene**(): [`Scene`](../../../classes/Scene.md)

Defined in: [src/display/view/core/AView.ts:110](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/AView.ts#L110)

Returns the Scene object connected to the current view.

##### Returns

[`Scene`](../../../classes/Scene.md)

#### Set Signature

> **set** **scene**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:124](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/AView.ts#L124)

Sets the Scene for the view.

##### Throws

Throws error if not a Scene instance

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Scene`](../../../classes/Scene.md) | Scene instance |

##### Returns

`void`

***

### taa

#### Get Signature

> **get** **taa**(): [`TAA`](../../../../Antialiasing/classes/TAA.md)

Defined in: [src/display/view/core/AView.ts:271](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/AView.ts#L271)

Returns the TAA post-effect object.

##### Returns

[`TAA`](../../../../Antialiasing/classes/TAA.md)

TAA instance

***

### useDistanceCulling

#### Get Signature

> **get** **useDistanceCulling**(): `boolean`

Defined in: [src/display/view/core/AView.ts:160](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/AView.ts#L160)

Returns whether to use distance-based culling.

##### Returns

`boolean`

#### Set Signature

> **set** **useDistanceCulling**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:171](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/AView.ts#L171)

Sets whether to use distance-based culling.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Whether to use |

##### Returns

`void`

***

### useFrustumCulling

#### Get Signature

> **get** **useFrustumCulling**(): `boolean`

Defined in: [src/display/view/core/AView.ts:141](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/AView.ts#L141)

Returns whether to use frustum culling.

##### Returns

`boolean`

#### Set Signature

> **set** **useFrustumCulling**(`value`): `void`

Defined in: [src/display/view/core/AView.ts:152](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/AView.ts#L152)

Sets whether to use frustum culling.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Whether to use |

##### Returns

`void`

***

### checkMouseInViewBounds()

> **checkMouseInViewBounds**(): `boolean`

Defined in: [src/display/view/core/AView.ts:305](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/AView.ts#L305)

Checks if the mouse pointer is within the pixel area of the current view.

#### Returns

`boolean`

True if the mouse is inside the view bounds, otherwise false

***

### screenToWorld()

> **screenToWorld**(`screenX`, `screenY`): `number`[]

Defined in: [src/display/view/core/AView.ts:291](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/AView.ts#L291)

Converts screen coordinates to world coordinates.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `screenX` | `number` | Screen X coordinate |
| `screenY` | `number` | Screen Y coordinate |

#### Returns

`number`[]

Converted world coordinates (3D vector array)

***


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/BaseObject.ts#L18)

Instance sequence ID per class

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`instanceId`](ViewTransform.md#instanceid)

***

### onResize

> **onResize**: (`event`) => `void` = `null`

Defined in: [src/display/view/core/ViewTransform.ts:31](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/ViewTransform.ts#L31)

Callback function called when the view size changes

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `RedResizeEvent`\<[`ViewTransform`](ViewTransform.md)\> |

#### Returns

`void`

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`onResize`](ViewTransform.md#onresize)

## Accessors

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/RedGPUObject.ts#L76)

Returns the AntialiasingManager instance. (Short-cut path)

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager instance

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`antialiasingManager`](ViewTransform.md#antialiasingmanager)

***

### aspect

#### Get Signature

> **get** **aspect**(): `number`

Defined in: [src/display/view/core/ViewTransform.ts:232](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/ViewTransform.ts#L232)

Returns the aspect ratio (width/height) of the current view.

##### Returns

`number`

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`aspect`](ViewTransform.md#aspect)

***

### camera

#### Get Signature

> **get** **camera**(): [`Camera2D`](../../../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../../../Camera/namespaces/Core/classes/AController.md)

Defined in: [src/display/view/core/ViewTransform.ts:99](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/ViewTransform.ts#L99)

Returns the currently connected camera.

##### Returns

[`Camera2D`](../../../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../../../Camera/namespaces/Core/classes/AController.md)

#### Set Signature

> **set** **camera**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:113](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/ViewTransform.ts#L113)

Sets the camera. Must be one of PerspectiveCamera, OrthographicCamera, AController, or Camera2D.

##### Throws

Throws error if camera type is not supported

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Camera2D`](../../../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../../../Camera/namespaces/Core/classes/AController.md) | Camera instance to connect |

##### Returns

`void`

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`camera`](ViewTransform.md#camera)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/RedGPUObject.ts#L88)

Returns the CommandEncoderManager instance. (Short-cut path)

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager instance

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`commandEncoderManager`](ViewTransform.md#commandencodermanager)

***

### frustumPlanes

#### Get Signature

> **get** **frustumPlanes**(): `number`[][]

Defined in: [src/display/view/core/ViewTransform.ts:243](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/ViewTransform.ts#L243)

Calculates and returns the view frustum planes based on the current projection and camera view matrices.

##### Returns

`number`[][]

Frustum planes array

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`frustumPlanes`](ViewTransform.md#frustumplanes)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/RedGPUObject.ts#L52)

Returns the WebGPU device object. (Short-cut path)

##### Returns

`GPUDevice`

GPUDevice instance

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`gpuDevice`](ViewTransform.md#gpudevice)

***

### height

#### Get Signature

> **get** **height**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:179](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/ViewTransform.ts#L179)

Returns the height value of the view. (Pixels or percentage string)

##### Returns

`string` \| `number`

#### Set Signature

> **set** **height**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:190](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/ViewTransform.ts#L190)

Sets the height of the view.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | Height value to set |

##### Returns

`void`

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`height`](ViewTransform.md#height)

***

### inverseProjectionMatrix

#### Get Signature

> **get** **inverseProjectionMatrix**(): [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:330](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/ViewTransform.ts#L330)

Computes and returns the inverse projection matrix.

##### Returns

[`mat4`](../../../../Math/type-aliases/mat4.md)

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`inverseProjectionMatrix`](ViewTransform.md#inverseprojectionmatrix)

***

### jitterOffset

#### Get Signature

> **get** **jitterOffset**(): \[`number`, `number`\]

Defined in: [src/display/view/core/ViewTransform.ts:338](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/ViewTransform.ts#L338)

Returns the currently configured jitter offset [offsetX, offsetY].

##### Returns

\[`number`, `number`\]

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`jitterOffset`](ViewTransform.md#jitteroffset)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/BaseObject.ts#L58)

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/BaseObject.ts#L70)

Sets the name of the object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name of the object to set |

##### Returns

`void`

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`name`](ViewTransform.md#name)

***

### noneJitterProjectionMatrix

#### Get Signature

> **get** **noneJitterProjectionMatrix**(): [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:263](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/ViewTransform.ts#L263)

Returns the original projection matrix with jitter excluded.

##### Returns

[`mat4`](../../../../Math/type-aliases/mat4.md)

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`noneJitterProjectionMatrix`](ViewTransform.md#nonejitterprojectionmatrix)

***

### pixelRectArray

#### Get Signature

> **get** **pixelRectArray**(): \[`number`, `number`, `number`, `number`\]

Defined in: [src/display/view/core/ViewTransform.ts:198](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/ViewTransform.ts#L198)

Returns the rectangle array in pixels. ([x, y, width, height])

##### Returns

\[`number`, `number`, `number`, `number`\]

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`pixelRectArray`](ViewTransform.md#pixelrectarray)

***

### pixelRectObject

#### Get Signature

> **get** **pixelRectObject**(): `object`

Defined in: [src/display/view/core/ViewTransform.ts:206](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/ViewTransform.ts#L206)

Returns the pixel rectangle in object form. ({ x, y, width, height })

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [src/display/view/core/ViewTransform.ts:211](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/ViewTransform.ts#L211) |
| `width` | `number` | [src/display/view/core/ViewTransform.ts:210](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/ViewTransform.ts#L210) |
| `x` | `number` | [src/display/view/core/ViewTransform.ts:208](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/ViewTransform.ts#L208) |
| `y` | `number` | [src/display/view/core/ViewTransform.ts:209](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/ViewTransform.ts#L209) |

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`pixelRectObject`](ViewTransform.md#pixelrectobject)

***

### projectionMatrix

#### Get Signature

> **get** **projectionMatrix**(): [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:308](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/ViewTransform.ts#L308)

Returns the final projection matrix reflecting the jitter offset. (Applied only to PerspectiveCamera when TAA is enabled)

##### Returns

[`mat4`](../../../../Math/type-aliases/mat4.md)

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`projectionMatrix`](ViewTransform.md#projectionmatrix)

***

### rawCamera

#### Get Signature

> **get** **rawCamera**(): [`Camera2D`](../../../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../../Camera/classes/OrthographicCamera.md)

Defined in: [src/display/view/core/ViewTransform.ts:255](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/ViewTransform.ts#L255)

Returns the raw camera instance referenced internally. (Returns internal camera if AController is linked)

##### Returns

[`Camera2D`](../../../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../../Camera/classes/OrthographicCamera.md)

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`rawCamera`](ViewTransform.md#rawcamera)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/RedGPUObject.ts#L40)

Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

RedGPUContext instance

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`redGPUContext`](ViewTransform.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/RedGPUObject.ts#L64)

Returns the ResourceManager instance. (Short-cut path)

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager instance

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`resourceManager`](ViewTransform.md#resourcemanager)

***

### screenRectObject

#### Get Signature

> **get** **screenRectObject**(): `object`

Defined in: [src/display/view/core/ViewTransform.ts:219](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/ViewTransform.ts#L219)

Returns the screen-relative rectangle object scaled by dividing by devicePixelRatio.

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [src/display/view/core/ViewTransform.ts:224](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/ViewTransform.ts#L224) |
| `width` | `number` | [src/display/view/core/ViewTransform.ts:223](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/ViewTransform.ts#L223) |
| `x` | `number` | [src/display/view/core/ViewTransform.ts:221](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/ViewTransform.ts#L221) |
| `y` | `number` | [src/display/view/core/ViewTransform.ts:222](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/ViewTransform.ts#L222) |

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`screenRectObject`](ViewTransform.md#screenrectobject)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/base/BaseObject.ts#L46)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`uuid`](ViewTransform.md#uuid)

***

### width

#### Get Signature

> **get** **width**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:160](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/ViewTransform.ts#L160)

Returns the width value of the view. (Pixels or percentage string)

##### Returns

`string` \| `number`

#### Set Signature

> **set** **width**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:171](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/ViewTransform.ts#L171)

Sets the width of the view.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | Width value to set |

##### Returns

`void`

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`width`](ViewTransform.md#width)

***

### x

#### Get Signature

> **get** **x**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:122](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/ViewTransform.ts#L122)

Returns the X position value of the view. (Pixels or percentage string)

##### Returns

`string` \| `number`

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:133](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/ViewTransform.ts#L133)

Sets the X position of the view.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | X position value to set |

##### Returns

`void`

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`x`](ViewTransform.md#x)

***

### y

#### Get Signature

> **get** **y**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:141](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/ViewTransform.ts#L141)

Returns the Y position value of the view. (Pixels or percentage string)

##### Returns

`string` \| `number`

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:152](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/ViewTransform.ts#L152)

Sets the Y position of the view.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | Y position value to set |

##### Returns

`void`

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`y`](ViewTransform.md#y)

## Methods

### clearJitterOffset()

> **clearJitterOffset**(): `void`

Defined in: [src/display/view/core/ViewTransform.ts:361](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/ViewTransform.ts#L361)

Clears and resets the jitter offset to 0.

#### Returns

`void`

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`clearJitterOffset`](ViewTransform.md#clearjitteroffset)

***

### setJitterOffset()

> **setJitterOffset**(`offsetX`, `offsetY`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:352](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/ViewTransform.ts#L352)

Sets the render pixel jitter offset for TAA calculations.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `offsetX` | `number` | X-axis jitter offset value |
| `offsetY` | `number` | Y-axis jitter offset value |

#### Returns

`void`

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`setJitterOffset`](ViewTransform.md#setjitteroffset)

***

### setPosition()

> **setPosition**(`x?`, `y?`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:376](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/ViewTransform.ts#L376)

Sets the position (X, Y) of the view and updates physical pixel rectangle values considering DPI.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `string` \| `number` | X position to set (pixel number or percentage string, default: current X) |
| `y` | `string` \| `number` | Y position to set (pixel number or percentage string, default: current Y) |

#### Returns

`void`

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`setPosition`](ViewTransform.md#setposition)

***

### setSize()

> **setSize**(`w?`, `h?`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:399](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/display/view/core/ViewTransform.ts#L399)

Sets the size (width, height) of the view and updates internal physical pixel rectangle values. Triggers onResize callback if registered.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `w` | `string` \| `number` | Width to set (pixel number or percentage string, default: current width) |
| `h` | `string` \| `number` | Height to set (pixel number or percentage string, default: current height) |

#### Returns

`void`

#### Inherited from

[`ViewTransform`](ViewTransform.md).[`setSize`](ViewTransform.md#setsize)


</details>
