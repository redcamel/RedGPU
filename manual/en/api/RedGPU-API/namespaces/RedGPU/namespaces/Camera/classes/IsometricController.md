[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / IsometricController

# Class: IsometricController

Defined in: [src/camera/controller/IsometricController.ts:26](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L26)

Camera controller providing an isometric view.

Implements a fixed-angle quarter view, commonly used in strategy simulations or tile-based games, using orthographic projection without perspective distortion.

* ### Example
```typescript
const controller = new RedGPU.IsometricController(redGPUContext);
controller.viewHeight = 15;
controller.zoom = 1;
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/controller/isometricController/" style="width:100%; height:500px;"></iframe>

## Extends

- [`AController`](../namespaces/Core/classes/AController.md)

## Constructors

### Constructor

> **new IsometricController**(`redGPUContext`): `IsometricController`

Defined in: [src/camera/controller/IsometricController.ts:64](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L64)

Creates an instance of IsometricController.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`IsometricController`

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`constructor`](../namespaces/Core/classes/AController.md#constructor)

## Accessors

### keyNameMapper

#### Get Signature

> **get** **keyNameMapper**(): `object`

Defined in: [src/camera/controller/IsometricController.ts:221](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L221)

Key mapping configuration

##### Returns

`object`

| Name | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ |
| `moveDown` | `string` | `'s'` | [src/camera/controller/IsometricController.ts:49](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L49) |
| `moveLeft` | `string` | `'a'` | [src/camera/controller/IsometricController.ts:50](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L50) |
| `moveRight` | `string` | `'d'` | [src/camera/controller/IsometricController.ts:51](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L51) |
| `moveUp` | `string` | `'w'` | [src/camera/controller/IsometricController.ts:48](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L48) |

***

### maxZoom

#### Get Signature

> **get** **maxZoom**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:150](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L150)

Maximum zoom

##### Returns

`number`

#### Set Signature

> **set** **maxZoom**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:154](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L154)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### minZoom

#### Get Signature

> **get** **minZoom**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:139](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L139)

Minimum zoom

##### Returns

`number`

#### Set Signature

> **set** **minZoom**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:143](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L143)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### mouseMoveSpeed

#### Get Signature

> **get** **mouseMoveSpeed**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:201](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L201)

Mouse movement speed

##### Returns

`number`

#### Set Signature

> **set** **mouseMoveSpeed**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:205](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L205)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### mouseMoveSpeedInterpolation

#### Get Signature

> **get** **mouseMoveSpeedInterpolation**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:211](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L211)

Mouse movement interpolation factor

##### Returns

`number`

#### Set Signature

> **set** **mouseMoveSpeedInterpolation**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:215](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L215)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### moveSpeed

#### Get Signature

> **get** **moveSpeed**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:181](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L181)

Movement speed

##### Returns

`number`

#### Set Signature

> **set** **moveSpeed**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:185](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L185)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### moveSpeedInterpolation

#### Get Signature

> **get** **moveSpeedInterpolation**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:191](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L191)

Movement interpolation factor

##### Returns

`number`

#### Set Signature

> **set** **moveSpeedInterpolation**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:195](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L195)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### speedZoom

#### Get Signature

> **get** **speedZoom**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:129](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L129)

Zoom speed

##### Returns

`number`

#### Set Signature

> **set** **speedZoom**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:133](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L133)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### targetX

#### Get Signature

> **get** **targetX**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:226](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L226)

Target X position

##### Returns

`number`

***

### targetY

#### Get Signature

> **get** **targetY**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:231](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L231)

Target Y position

##### Returns

`number`

***

### targetZ

#### Get Signature

> **get** **targetZ**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:236](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L236)

Target Z position

##### Returns

`number`

***

### viewHeight

#### Get Signature

> **get** **viewHeight**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:161](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L161)

View height

##### Returns

`number`

#### Set Signature

> **set** **viewHeight**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:165](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L165)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### viewHeightInterpolation

#### Get Signature

> **get** **viewHeightInterpolation**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:171](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L171)

View height interpolation factor

##### Returns

`number`

#### Set Signature

> **set** **viewHeightInterpolation**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:175](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L175)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### zoom

#### Get Signature

> **get** **zoom**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:104](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L104)

Gets the zoom level.

##### Returns

`number`

Zoom level

#### Set Signature

> **set** **zoom**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:113](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L113)

Sets the zoom level.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Zoom level |

##### Returns

`void`

***

### zoomInterpolation

#### Get Signature

> **get** **zoomInterpolation**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:119](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L119)

Zoom interpolation factor

##### Returns

`number`

#### Set Signature

> **set** **zoomInterpolation**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:123](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L123)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

## Methods

### setMoveDownKey()

> **setMoveDownKey**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:246](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L246)

Sets the move down key

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

#### Returns

`void`

***

### setMoveLeftKey()

> **setMoveLeftKey**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:251](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L251)

Sets the move left key

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

#### Returns

`void`

***

### setMoveRightKey()

> **setMoveRightKey**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:256](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L256)

Sets the move right key

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

#### Returns

`void`

***

### setMoveUpKey()

> **setMoveUpKey**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:241](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L241)

Sets the move up key

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

#### Returns

`void`

***

### update()

> **update**(`view`, `time`): `void`

Defined in: [src/camera/controller/IsometricController.ts:266](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/controller/IsometricController.ts#L266)

Updates the camera every frame.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 3D view |
| `time` | `number` | Current time |

#### Returns

`void`

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`update`](../namespaces/Core/classes/AController.md#update)


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/RedGPUObject.ts#L76)

Returns the AntialiasingManager instance. (Short-cut path)

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

AntialiasingManager instance

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`antialiasingManager`](../namespaces/Core/classes/AController.md#antialiasingmanager)

***

### camera

#### Get Signature

> **get** **camera**(): [`PerspectiveCamera`](PerspectiveCamera.md) \| [`OrthographicCamera`](OrthographicCamera.md)

Defined in: [src/camera/core/AController.ts:100](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/AController.ts#L100)

Returns the camera controlled by this controller.

##### Returns

[`PerspectiveCamera`](PerspectiveCamera.md) \| [`OrthographicCamera`](OrthographicCamera.md)

Controlled camera (PerspectiveCamera or OrthographicCamera)

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`camera`](../namespaces/Core/classes/AController.md#camera)

***

### commandEncoderManager

#### Get Signature

> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/RedGPUObject.ts#L88)

Returns the CommandEncoderManager instance. (Short-cut path)

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

CommandEncoderManager instance

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`commandEncoderManager`](../namespaces/Core/classes/AController.md#commandencodermanager)

***

### gpuDevice

#### Get Signature

> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/RedGPUObject.ts#L52)

Returns the WebGPU device object. (Short-cut path)

##### Returns

`GPUDevice`

GPUDevice instance

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`gpuDevice`](../namespaces/Core/classes/AController.md#gpudevice)

***

### hoveredView

#### Get Signature

> **get** **hoveredView**(): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:150](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/AController.ts#L150)

**`Internal`**

Returns the View currently being hovered by the mouse.

##### Returns

[`View3D`](../../Display/classes/View3D.md)

Hovered View or null

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`hoveredView`](../namespaces/Core/classes/AController.md#hoveredview)

***

### isKeyboardActiveController

#### Get Signature

> **get** **isKeyboardActiveController**(): `boolean`

Defined in: [src/camera/core/AController.ts:196](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/AController.ts#L196)

**`Internal`**

Returns whether the current controller is processing keyboard input.

##### Returns

`boolean`

Whether it is the keyboard active controller

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`isKeyboardActiveController`](../namespaces/Core/classes/AController.md#iskeyboardactivecontroller)

***

### keyboardActiveView

#### Get Signature

> **get** **keyboardActiveView**(): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:163](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/AController.ts#L163)

**`Internal`**

Returns the View with active keyboard input.

##### Returns

[`View3D`](../../Display/classes/View3D.md)

Keyboard active View or null

#### Set Signature

> **set** **keyboardActiveView**(`value`): `void`

Defined in: [src/camera/core/AController.ts:176](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/AController.ts#L176)

**`Internal`**

Sets the View with active keyboard input.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`View3D`](../../Display/classes/View3D.md) | View to set or null |

##### Returns

`void`

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`keyboardActiveView`](../namespaces/Core/classes/AController.md#keyboardactiveview)

***

### keyboardProcessedThisFrame

#### Get Signature

> **get** **keyboardProcessedThisFrame**(): `boolean`

Defined in: [src/camera/core/AController.ts:209](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/AController.ts#L209)

**`Internal`**

Returns whether keyboard input has already been processed in this frame.

##### Returns

`boolean`

Processing status

#### Set Signature

> **set** **keyboardProcessedThisFrame**(`value`): `void`

Defined in: [src/camera/core/AController.ts:222](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/AController.ts#L222)

**`Internal`**

Sets whether keyboard input has been processed in this frame.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Processing status to set |

##### Returns

`void`

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`keyboardProcessedThisFrame`](../namespaces/Core/classes/AController.md#keyboardprocessedthisframe)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/BaseObject.ts#L58)

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/BaseObject.ts#L71)

Sets the name of the object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name of the object to set |

##### Returns

`void`

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`name`](../namespaces/Core/classes/AController.md#name)

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/RedGPUObject.ts#L40)

Returns the RedGPUContext instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

RedGPUContext instance

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`redGPUContext`](../namespaces/Core/classes/AController.md#redgpucontext)

***

### resourceManager

#### Get Signature

> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/RedGPUObject.ts#L64)

Returns the ResourceManager instance. (Short-cut path)

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

ResourceManager instance

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`resourceManager`](../namespaces/Core/classes/AController.md#resourcemanager)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/BaseObject.ts#L46)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`uuid`](../namespaces/Core/classes/AController.md#uuid)

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/camera/core/AController.ts:112](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/AController.ts#L112)

Gets the camera's current world X coordinate.

##### Returns

`number`

X coordinate

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`x`](../namespaces/Core/classes/AController.md#x)

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/camera/core/AController.ts:124](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/AController.ts#L124)

Gets the camera's current world Y coordinate.

##### Returns

`number`

Y coordinate

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`y`](../namespaces/Core/classes/AController.md#y)

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/camera/core/AController.ts:136](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/AController.ts#L136)

Gets the camera's current world Z coordinate.

##### Returns

`number`

Z coordinate

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`z`](../namespaces/Core/classes/AController.md#z)

***

### checkKeyboardInput()

> **checkKeyboardInput**\<`T`\>(`view`, `keyNameMapper`): `boolean`

Defined in: [src/camera/core/AController.ts:286](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/AController.ts#L286)

Checks for keyboard input and sets the active View.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Record`\<`string`, `string`\> |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | Current View |
| `keyNameMapper` | `T` | Key mapping object |

#### Returns

`boolean`

True if keyboard input processing is possible, otherwise false

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`checkKeyboardInput`](../namespaces/Core/classes/AController.md#checkkeyboardinput)

***

### destroy()

> **destroy**(): `void`

Defined in: [src/camera/core/AController.ts:230](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/AController.ts#L230)

Destroys the controller and removes event listeners.

#### Returns

`void`

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`destroy`](../namespaces/Core/classes/AController.md#destroy)

***

### findTargetViewByInputEvent()

> **findTargetViewByInputEvent**(`e`): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:369](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/AController.ts#L369)

**`Internal`**

Finds the View where the input event occurred.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `e` | `MouseEvent` \| `TouchEvent` | Mouse or touch event |

#### Returns

[`View3D`](../../Display/classes/View3D.md)

Corresponding View or null

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`findTargetViewByInputEvent`](../namespaces/Core/classes/AController.md#findtargetviewbyinputevent)

***

### getCanvasEventPoint()

> **getCanvasEventPoint**(`e`, `redGPUContext`): `object`

Defined in: [src/camera/core/AController.ts:333](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/AController.ts#L333)

**`Internal`**

Gets the event coordinates on the canvas.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `e` | `MouseEvent` \| `TouchEvent` \| `WheelEvent` | Mouse, touch, or wheel event |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPU context |

#### Returns

`object`

{x, y} coordinate object

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `x` | `number` | [src/camera/core/AController.ts:352](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/AController.ts#L352) |
| `y` | `number` | [src/camera/core/AController.ts:353](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/AController.ts#L353) |

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`getCanvasEventPoint`](../namespaces/Core/classes/AController.md#getcanvaseventpoint)

***


</details>
