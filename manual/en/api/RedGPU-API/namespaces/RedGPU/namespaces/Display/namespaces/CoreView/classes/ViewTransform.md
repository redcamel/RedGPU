[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreView](../README.md) / ViewTransform

# Class: ViewTransform

Defined in: [src/display/view/core/ViewTransform.ts:26](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L26)

Class that manages the size and position of View3D/View2D.

Receives a camera type, generates a projection matrix suitable for that camera, and handles the calculation of the position and size (pixel rect) within the screen.

::: warning
This class is a base class used internally by the system.<br/>Do not create instances directly.
:::

## Extends

- [`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md)

## Extended by

- [`AView`](AView.md)

## Constructors

### Constructor

> **new ViewTransform**(`redGPUContext`): `ViewTransform`

Defined in: [src/display/view/core/ViewTransform.ts:90](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L90)

Creates a new ViewTransform instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`ViewTransform`

#### Overrides

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Properties

### onResize

> **onResize**: (`event`) => `void` = `null`

Defined in: [src/display/view/core/ViewTransform.ts:31](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L31)

Callback function called when the view size changes

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `RedResizeEvent`\<`ViewTransform`\> |

#### Returns

`void`

## Accessors

### aspect

#### Get Signature

> **get** **aspect**(): `number`

Defined in: [src/display/view/core/ViewTransform.ts:232](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L232)

Returns the aspect ratio (width/height) of the current view.

##### Returns

`number`

***

### camera

#### Get Signature

> **get** **camera**(): [`Camera2D`](../../../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../../../Camera/namespaces/Core/classes/AController.md)

Defined in: [src/display/view/core/ViewTransform.ts:99](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L99)

Returns the currently connected camera.

##### Returns

[`Camera2D`](../../../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../../../Camera/namespaces/Core/classes/AController.md)

#### Set Signature

> **set** **camera**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:113](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L113)

Sets the camera. Must be one of PerspectiveCamera, OrthographicCamera, AController, or Camera2D.

##### Throws

Throws error if camera type is not supported

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Camera2D`](../../../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../../../Camera/namespaces/Core/classes/AController.md) | Camera instance to connect |

##### Returns

`void`

***

### frustumPlanes

#### Get Signature

> **get** **frustumPlanes**(): `number`[][]

Defined in: [src/display/view/core/ViewTransform.ts:243](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L243)

Calculates and returns the view frustum planes based on the current projection and camera view matrices.

##### Returns

`number`[][]

Frustum planes array

***

### height

#### Get Signature

> **get** **height**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:179](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L179)

Returns the height value of the view. (Pixels or percentage string)

##### Returns

`string` \| `number`

#### Set Signature

> **set** **height**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:190](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L190)

Sets the height of the view.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | Height value to set |

##### Returns

`void`

***

### inverseProjectionMatrix

#### Get Signature

> **get** **inverseProjectionMatrix**(): [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:330](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L330)

Computes and returns the inverse projection matrix.

##### Returns

[`mat4`](../../../../Math/type-aliases/mat4.md)

***

### jitterOffset

#### Get Signature

> **get** **jitterOffset**(): \[`number`, `number`\]

Defined in: [src/display/view/core/ViewTransform.ts:338](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L338)

Returns the currently configured jitter offset [offsetX, offsetY].

##### Returns

\[`number`, `number`\]

***

### noneJitterProjectionMatrix

#### Get Signature

> **get** **noneJitterProjectionMatrix**(): [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:263](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L263)

Returns the original projection matrix with jitter excluded.

##### Returns

[`mat4`](../../../../Math/type-aliases/mat4.md)

***

### pixelRectArray

#### Get Signature

> **get** **pixelRectArray**(): \[`number`, `number`, `number`, `number`\]

Defined in: [src/display/view/core/ViewTransform.ts:198](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L198)

Returns the rectangle array in pixels. ([x, y, width, height])

##### Returns

\[`number`, `number`, `number`, `number`\]

***

### pixelRectObject

#### Get Signature

> **get** **pixelRectObject**(): `object`

Defined in: [src/display/view/core/ViewTransform.ts:206](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L206)

Returns the pixel rectangle in object form. ({ x, y, width, height })

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [src/display/view/core/ViewTransform.ts:211](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L211) |
| `width` | `number` | [src/display/view/core/ViewTransform.ts:210](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L210) |
| `x` | `number` | [src/display/view/core/ViewTransform.ts:208](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L208) |
| `y` | `number` | [src/display/view/core/ViewTransform.ts:209](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L209) |

***

### projectionMatrix

#### Get Signature

> **get** **projectionMatrix**(): [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:308](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L308)

Returns the final projection matrix reflecting the jitter offset. (Applied only to PerspectiveCamera when TAA is enabled)

##### Returns

[`mat4`](../../../../Math/type-aliases/mat4.md)

***

### rawCamera

#### Get Signature

> **get** **rawCamera**(): [`Camera2D`](../../../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../../Camera/classes/OrthographicCamera.md)

Defined in: [src/display/view/core/ViewTransform.ts:255](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L255)

Returns the raw camera instance referenced internally. (Returns internal camera if AController is linked)

##### Returns

[`Camera2D`](../../../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../../Camera/classes/OrthographicCamera.md)

***

### screenRectObject

#### Get Signature

> **get** **screenRectObject**(): `object`

Defined in: [src/display/view/core/ViewTransform.ts:219](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L219)

Returns the screen-relative rectangle object scaled by dividing by devicePixelRatio.

##### Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [src/display/view/core/ViewTransform.ts:224](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L224) |
| `width` | `number` | [src/display/view/core/ViewTransform.ts:223](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L223) |
| `x` | `number` | [src/display/view/core/ViewTransform.ts:221](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L221) |
| `y` | `number` | [src/display/view/core/ViewTransform.ts:222](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L222) |

***

### width

#### Get Signature

> **get** **width**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:160](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L160)

Returns the width value of the view. (Pixels or percentage string)

##### Returns

`string` \| `number`

#### Set Signature

> **set** **width**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:171](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L171)

Sets the width of the view.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | Width value to set |

##### Returns

`void`

***

### x

#### Get Signature

> **get** **x**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:122](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L122)

Returns the X position value of the view. (Pixels or percentage string)

##### Returns

`string` \| `number`

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:133](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L133)

Sets the X position of the view.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | X position value to set |

##### Returns

`void`

***

### y

#### Get Signature

> **get** **y**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:141](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L141)

Returns the Y position value of the view. (Pixels or percentage string)

##### Returns

`string` \| `number`

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:152](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L152)

Sets the Y position of the view.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` \| `number` | Y position value to set |

##### Returns

`void`

## Methods

### clearJitterOffset()

> **clearJitterOffset**(): `void`

Defined in: [src/display/view/core/ViewTransform.ts:361](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L361)

Clears and resets the jitter offset to 0.

#### Returns

`void`

***

### setJitterOffset()

> **setJitterOffset**(`offsetX`, `offsetY`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:352](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L352)

Sets the render pixel jitter offset for TAA calculations.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `offsetX` | `number` | X-axis jitter offset value |
| `offsetY` | `number` | Y-axis jitter offset value |

#### Returns

`void`

***

### setPosition()

> **setPosition**(`x?`, `y?`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:376](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L376)

Sets the position (X, Y) of the view and updates physical pixel rectangle values considering DPI.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `string` \| `number` | X position to set (pixel number or percentage string, default: current X) |
| `y` | `string` \| `number` | Y position to set (pixel number or percentage string, default: current Y) |

#### Returns

`void`

***

### setSize()

> **setSize**(`w?`, `h?`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:399](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/display/view/core/ViewTransform.ts#L399)

Sets the size (width, height) of the view and updates internal physical pixel rectangle values. Triggers onResize callback if registered.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `w` | `string` \| `number` | Width to set (pixel number or percentage string, default: current width) |
| `h` | `string` \| `number` | Height to set (pixel number or percentage string, default: current height) |

#### Returns

`void`


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/RedGPUObject.ts#L76)

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

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/RedGPUObject.ts#L88)

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

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/RedGPUObject.ts#L52)

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

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/BaseObject.ts#L58)

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/BaseObject.ts#L71)

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

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/RedGPUObject.ts#L40)

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

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/RedGPUObject.ts#L64)

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

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/BaseObject.ts#L46)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../BaseObject/classes/RedGPUObject.md#uuid)

***


</details>
