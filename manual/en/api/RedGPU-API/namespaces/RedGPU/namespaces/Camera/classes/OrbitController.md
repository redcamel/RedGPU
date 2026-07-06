[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / OrbitController

# Class: OrbitController

Defined in: [src/camera/controller/OrbitController.ts:32](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/OrbitController.ts#L32)

Orbital camera controller that rotates around a specific point.

Primarily used for product modeling viewers or observing 3D objects, allowing the user to inspect the target from various angles via zoom, rotation, and pan operations around a center point.

### Example
```typescript
const controller = new RedGPU.OrbitController(redGPUContext);
controller.centerX = 0;
controller.centerY = 0;
controller.centerZ = 0;
controller.distance = 20;
controller.tilt = -30;
controller.pan = 45;
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/controller/orbitController/" style="width:100%; height:500px;"></iframe>

## Extends

- [`AController`](../namespaces/Core/classes/AController.md)

## Constructors

### Constructor

> **new OrbitController**(`redGPUContext`): `OrbitController`

Defined in: [src/camera/controller/OrbitController.ts:69](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/OrbitController.ts#L69)

Creates an instance of OrbitController.

### Example
```typescript
const controller = new RedGPU.OrbitController(redGPUContext);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`OrbitController`

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`constructor`](../namespaces/Core/classes/AController.md#constructor)

## Properties

### centerX

#### Get Signature

> **get** **centerX**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:103](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/OrbitController.ts#L103)

Gets the X-axis coordinate of the rotation center.

##### Returns

`number`

Center point X-axis coordinate

#### Set Signature

> **set** **centerX**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:115](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/OrbitController.ts#L115)

Sets the X-axis coordinate of the rotation center.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Center point X-axis coordinate |

##### Returns

`void`

***

### centerY

#### Get Signature

> **get** **centerY**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:127](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/OrbitController.ts#L127)

Gets the Y-axis coordinate of the rotation center.

##### Returns

`number`

Center point Y-axis coordinate

#### Set Signature

> **set** **centerY**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:139](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/OrbitController.ts#L139)

Sets the Y-axis coordinate of the rotation center.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Center point Y-axis coordinate |

##### Returns

`void`

***

### centerZ

#### Get Signature

> **get** **centerZ**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:151](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/OrbitController.ts#L151)

Gets the Z-axis coordinate of the rotation center.

##### Returns

`number`

Center point Z-axis coordinate

#### Set Signature

> **set** **centerZ**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:163](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/OrbitController.ts#L163)

Sets the Z-axis coordinate of the rotation center.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Center point Z-axis coordinate |

##### Returns

`void`

***

### distance

#### Get Signature

> **get** **distance**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:176](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/OrbitController.ts#L176)

Gets the distance from the center point to the camera.

##### Returns

`number`

Distance value

#### Set Signature

> **set** **distance**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:188](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/OrbitController.ts#L188)

Sets the distance from the center point to the camera.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Distance value (min 0) |

##### Returns

`void`

***

### distanceInterpolation

#### Get Signature

> **get** **distanceInterpolation**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:226](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/OrbitController.ts#L226)

Gets the distance interpolation factor.

##### Returns

`number`

Distance interpolation factor (0.01 ~ 1)

#### Set Signature

> **set** **distanceInterpolation**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:238](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/OrbitController.ts#L238)

Sets the distance interpolation factor. Lower values for smoother zoom movement.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Interpolation factor (0.01 ~ 1) |

##### Returns

`void`

***

### maxDistance

#### Get Signature

> **get** **maxDistance**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:276](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/OrbitController.ts#L276)

Gets the maximum zoom distance.

##### Returns

`number`

Maximum distance

#### Set Signature

> **set** **maxDistance**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:288](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/OrbitController.ts#L288)

Sets the maximum zoom distance.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Maximum distance (min 0.1) |

##### Returns

`void`

***

### maxTilt

#### Get Signature

> **get** **maxTilt**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:427](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/OrbitController.ts#L427)

Gets the maximum tilt angle.

##### Returns

`number`

Maximum tilt angle

#### Set Signature

> **set** **maxTilt**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:439](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/OrbitController.ts#L439)

Sets the maximum tilt angle.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Maximum tilt angle (-90 ~ 90) |

##### Returns

`void`

***

### minDistance

#### Get Signature

> **get** **minDistance**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:251](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/OrbitController.ts#L251)

Gets the minimum zoom distance.

##### Returns

`number`

Minimum distance

#### Set Signature

> **set** **minDistance**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:263](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/OrbitController.ts#L263)

Sets the minimum zoom distance.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Minimum distance (min 0.1) |

##### Returns

`void`

***

### minTilt

#### Get Signature

> **get** **minTilt**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:402](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/OrbitController.ts#L402)

Gets the minimum tilt angle.

##### Returns

`number`

Minimum tilt angle

#### Set Signature

> **set** **minTilt**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:414](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/OrbitController.ts#L414)

Sets the minimum tilt angle.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Minimum tilt angle (-90 ~ 90) |

##### Returns

`void`

***

### pan

#### Get Signature

> **get** **pan**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:353](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/OrbitController.ts#L353)

Gets the camera's pan (horizontal rotation) angle. (Unit: degrees)

##### Returns

`number`

Pan angle value

#### Set Signature

> **set** **pan**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:365](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/OrbitController.ts#L365)

Sets the camera's pan (horizontal rotation) angle. (Unit: degrees)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Pan angle value |

##### Returns

`void`

***

### rotationInterpolation

#### Get Signature

> **get** **rotationInterpolation**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:327](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/OrbitController.ts#L327)

Gets the rotation interpolation factor.

##### Returns

`number`

Rotation interpolation factor (0.01 ~ 1)

#### Set Signature

> **set** **rotationInterpolation**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:339](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/OrbitController.ts#L339)

Sets the rotation interpolation factor. Lower values for smoother rotation.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Interpolation factor (0.01 ~ 1) |

##### Returns

`void`

***

### speedDistance

#### Get Signature

> **get** **speedDistance**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:201](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/OrbitController.ts#L201)

Gets the distance adjustment speed.

##### Returns

`number`

Distance change speed

#### Set Signature

> **set** **speedDistance**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:213](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/OrbitController.ts#L213)

Sets the distance adjustment speed. Higher values for faster zoom speed.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Distance change speed (min 0.01) |

##### Returns

`void`

***

### speedRotation

#### Get Signature

> **get** **speedRotation**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:302](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/OrbitController.ts#L302)

Gets the rotation speed.

##### Returns

`number`

Rotation speed value

#### Set Signature

> **set** **speedRotation**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:314](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/OrbitController.ts#L314)

Sets the rotation speed. Higher values for faster rotation speed.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Rotation speed value (min 0.01) |

##### Returns

`void`

***

### tilt

#### Get Signature

> **get** **tilt**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:377](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/OrbitController.ts#L377)

Gets the camera's tilt (vertical rotation) angle. (Unit: degrees, Range: -90 ~ 90)

##### Returns

`number`

Tilt angle value

#### Set Signature

> **set** **tilt**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:389](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/OrbitController.ts#L389)

Sets the camera's tilt (vertical rotation) angle. (Unit: degrees)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Tilt angle value (limited to -90 ~ 90 range) |

##### Returns

`void`

***

### update()

> **update**(`view`, `time`): `void`

Defined in: [src/camera/controller/OrbitController.ts:456](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/controller/OrbitController.ts#L456)

Updates the orbit camera every frame.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | The 3D view the camera belongs to |
| `time` | `number` | Current time (ms) |

#### Returns

`void`

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`update`](../namespaces/Core/classes/AController.md#update)


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L18)

Instance sequence ID per class

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`instanceId`](../namespaces/Core/classes/AController.md#instanceid)

## Accessors

### antialiasingManager

#### Get Signature

> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:76](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L76)

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

Defined in: [src/camera/core/AController.ts:100](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/AController.ts#L100)

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

Defined in: [src/base/RedGPUObject.ts:88](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L88)

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

Defined in: [src/base/RedGPUObject.ts:52](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L52)

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

Defined in: [src/camera/core/AController.ts:150](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/AController.ts#L150)

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

Defined in: [src/camera/core/AController.ts:196](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/AController.ts#L196)

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

Defined in: [src/camera/core/AController.ts:163](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/AController.ts#L163)

**`Internal`**

Returns the View with active keyboard input.

##### Returns

[`View3D`](../../Display/classes/View3D.md)

Keyboard active View or null

#### Set Signature

> **set** **keyboardActiveView**(`value`): `void`

Defined in: [src/camera/core/AController.ts:176](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/AController.ts#L176)

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

Defined in: [src/camera/core/AController.ts:209](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/AController.ts#L209)

**`Internal`**

Returns whether keyboard input has already been processed in this frame.

##### Returns

`boolean`

Processing status

#### Set Signature

> **set** **keyboardProcessedThisFrame**(`value`): `void`

Defined in: [src/camera/core/AController.ts:222](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/AController.ts#L222)

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

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L58)

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L70)

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

Defined in: [src/base/RedGPUObject.ts:40](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L40)

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

Defined in: [src/base/RedGPUObject.ts:64](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/RedGPUObject.ts#L64)

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

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L46)

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

Defined in: [src/camera/core/AController.ts:112](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/AController.ts#L112)

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

Defined in: [src/camera/core/AController.ts:124](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/AController.ts#L124)

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

Defined in: [src/camera/core/AController.ts:136](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/AController.ts#L136)

Gets the camera's current world Z coordinate.

##### Returns

`number`

Z coordinate

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`z`](../namespaces/Core/classes/AController.md#z)

## Methods

### checkKeyboardInput()

> **checkKeyboardInput**\<`T`\>(`view`, `keyNameMapper`): `boolean`

Defined in: [src/camera/core/AController.ts:286](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/AController.ts#L286)

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

Defined in: [src/camera/core/AController.ts:230](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/AController.ts#L230)

Destroys the controller and removes event listeners.

#### Returns

`void`

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`destroy`](../namespaces/Core/classes/AController.md#destroy)

***

### findTargetViewByInputEvent()

> **findTargetViewByInputEvent**(`e`): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:369](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/AController.ts#L369)

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

Defined in: [src/camera/core/AController.ts:333](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/AController.ts#L333)

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
| `x` | `number` | [src/camera/core/AController.ts:352](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/AController.ts#L352) |
| `y` | `number` | [src/camera/core/AController.ts:353](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/AController.ts#L353) |

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`getCanvasEventPoint`](../namespaces/Core/classes/AController.md#getcanvaseventpoint)

***


</details>
