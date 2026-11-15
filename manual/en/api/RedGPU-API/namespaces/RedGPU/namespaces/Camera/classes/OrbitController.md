[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / OrbitController

# Class: OrbitController

Defined in: [src/camera/controller/OrbitController.ts:30](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/controller/OrbitController.ts#L30)

Camera controller class that performs orbital rotation and zoom around a specified center point.

***

### Example
```typescript
const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.centerX = 0;
controller.centerY = 0;
controller.centerZ = 0;
controller.distance = 20;
controller.tilt = -30;
controller.pan = 45;
```

<ExampleFrame src="https://redcamel.github.io/RedGPU/examples/3d/controller/orbitController/" />

## See

[OrbitController example](https://redcamel.github.io/RedGPU/examples/3d/controller/orbitController/)

## Extends

- [`AController`](../namespaces/Core/classes/AController.md)

## Constructors



***

### Constructor

> **new OrbitController**(`redGPUContext`): `OrbitController`

Defined in: [src/camera/controller/OrbitController.ts:62](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/controller/OrbitController.ts#L62)

Creates an OrbitController instance.

#### Example
```typescript
const controller = new RedGPU.Camera.OrbitController(redGPUContext);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`OrbitController`

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`constructor`](../namespaces/Core/classes/AController.md#constructor)

## Accessors



***

### centerX

#### Get Signature

> **get** **centerX**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:97](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/controller/OrbitController.ts#L97)

Gets or sets the X-axis coordinate of the rotation center point.

##### Returns

`number`

Center point X-axis coordinate (default: `0`)

#### Set Signature

> **set** **centerX**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:101](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/controller/OrbitController.ts#L101)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### centerY

#### Get Signature

> **get** **centerY**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:114](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/controller/OrbitController.ts#L114)

Gets or sets the Y-axis coordinate of the rotation center point.

##### Returns

`number`

Center point Y-axis coordinate (default: `0`)

#### Set Signature

> **set** **centerY**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:118](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/controller/OrbitController.ts#L118)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### centerZ

#### Get Signature

> **get** **centerZ**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:131](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/controller/OrbitController.ts#L131)

Gets or sets the Z-axis coordinate of the rotation center point.

##### Returns

`number`

Center point Z-axis coordinate (default: `0`)

#### Set Signature

> **set** **centerZ**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:135](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/controller/OrbitController.ts#L135)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### distance

#### Get Signature

> **get** **distance**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:148](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/controller/OrbitController.ts#L148)

Gets or sets the target distance from the center point to the camera. (`0` or greater)

##### Returns

`number`

Target distance (default: `15`)

#### Set Signature

> **set** **distance**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:152](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/controller/OrbitController.ts#L152)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### distanceInterpolation

#### Get Signature

> **get** **distanceInterpolation**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:182](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/controller/OrbitController.ts#L182)

Gets or sets the damping interpolation factor for zoom distance changes. (`0.01` ~ `1`)

##### Returns

`number`

Distance interpolation factor (default: `0.02`)

#### Set Signature

> **set** **distanceInterpolation**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:186](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/controller/OrbitController.ts#L186)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxDistance

#### Get Signature

> **get** **maxDistance**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:216](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/controller/OrbitController.ts#L216)

Gets or sets the maximum zoom distance. (`0.1` or greater)

##### Returns

`number`

Maximum distance (default: `Infinity`)

#### Set Signature

> **set** **maxDistance**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:220](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/controller/OrbitController.ts#L220)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxTilt

#### Get Signature

> **get** **maxTilt**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:318](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/controller/OrbitController.ts#L318)

Gets or sets the maximum tilt angle limit. (`-90` ~ `90`)

##### Returns

`number`

Maximum tilt angle (default: `90`)

#### Set Signature

> **set** **maxTilt**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:322](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/controller/OrbitController.ts#L322)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minDistance

#### Get Signature

> **get** **minDistance**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:199](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/controller/OrbitController.ts#L199)

Gets or sets the minimum zoom distance. (`0.1` or greater)

##### Returns

`number`

Minimum distance (default: `0.1`)

#### Set Signature

> **set** **minDistance**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:203](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/controller/OrbitController.ts#L203)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minTilt

#### Get Signature

> **get** **minTilt**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:301](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/controller/OrbitController.ts#L301)

Gets or sets the minimum tilt angle limit. (`-90` ~ `90`)

##### Returns

`number`

Minimum tilt angle (default: `-90`)

#### Set Signature

> **set** **minTilt**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:305](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/controller/OrbitController.ts#L305)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### pan

#### Get Signature

> **get** **pan**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:267](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/controller/OrbitController.ts#L267)

Gets or sets the camera's target horizontal rotation (Pan) angle. (Unit: degrees)

##### Returns

`number`

Pan angle (default: `0`)

#### Set Signature

> **set** **pan**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:271](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/controller/OrbitController.ts#L271)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### rotationInterpolation

#### Get Signature

> **get** **rotationInterpolation**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:250](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/controller/OrbitController.ts#L250)

Gets or sets the damping interpolation factor for rotation changes. (`0.01` ~ `1`)

##### Returns

`number`

Rotation interpolation factor (default: `0.02`)

#### Set Signature

> **set** **rotationInterpolation**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:254](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/controller/OrbitController.ts#L254)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### speedDistance

#### Get Signature

> **get** **speedDistance**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:165](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/controller/OrbitController.ts#L165)

Gets or sets the zoom distance adjustment speed. (`0.01` or greater)

##### Returns

`number`

Distance adjustment speed (default: `1.5`)

#### Set Signature

> **set** **speedDistance**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:169](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/controller/OrbitController.ts#L169)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### speedRotation

#### Get Signature

> **get** **speedRotation**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:233](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/controller/OrbitController.ts#L233)

Gets or sets the rotation speed. (`0.01` or greater)

##### Returns

`number`

Rotation speed (default: `3`)

#### Set Signature

> **set** **speedRotation**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:237](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/controller/OrbitController.ts#L237)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### tilt

#### Get Signature

> **get** **tilt**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:284](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/controller/OrbitController.ts#L284)

Gets or sets the camera's target vertical rotation (Tilt) angle. (Unit: degrees, Range: `-90` ~ `90`)

##### Returns

`number`

Tilt angle (default: `-35`)

#### Set Signature

> **set** **tilt**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:288](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/controller/OrbitController.ts#L288)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

## Methods



***

### update()

> **update**(`view`, `time`): `void`

Defined in: [src/camera/controller/OrbitController.ts:338](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/controller/OrbitController.ts#L338)

Updates the orbital camera state every frame.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | `View3D` instance connected to the controller |
| `time` | `number` | Current elapsed time (ms) |

#### Returns

`void`

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`update`](../namespaces/Core/classes/AController.md#update)

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/base/RedGPUObject.ts#L80)

Returns the `AntialiasingManager` instance managing anti-aliasing settings.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` instance

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`antialiasingManager`](../namespaces/Core/classes/AController.md#antialiasingmanager)

***

***

### camera

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **camera**(): [`PerspectiveCamera`](PerspectiveCamera.md) \| [`OrthographicCamera`](OrthographicCamera.md)

Defined in: [src/camera/core/AController.ts:86](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/core/AController.ts#L86)

Returns the camera instance controlled by this controller.

##### Returns

[`PerspectiveCamera`](PerspectiveCamera.md) \| [`OrthographicCamera`](OrthographicCamera.md)

Controlled `PerspectiveCamera` or `OrthographicCamera` instance

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`camera`](../namespaces/Core/classes/AController.md#camera)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/base/RedGPUObject.ts#L92)

Returns the `CommandEncoderManager` instance managing WebGPU command encoding.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` instance

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`commandEncoderManager`](../namespaces/Core/classes/AController.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/base/RedGPUObject.ts#L56)

Returns the logical WebGPU device (`GPUDevice`) assigned to the context.

##### Returns

`GPUDevice`

`GPUDevice` instance

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`gpuDevice`](../namespaces/Core/classes/AController.md#gpudevice)

***

***

### hoveredView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **hoveredView**(): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:134](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/core/AController.ts#L134)

Returns the `View3D` instance currently hovered by the pointer.

##### Returns

[`View3D`](../../Display/classes/View3D.md)

Hovered `View3D` or `null`

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`hoveredView`](../namespaces/Core/classes/AController.md#hoveredview)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/base/BaseObject.ts#L36)

Returns the unique sequential instance ID assigned per class.

##### Returns

`number`

Per-class unique instance ID

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`instanceId`](../namespaces/Core/classes/AController.md#instanceid)

***

***

### isKeyboardActiveController

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isKeyboardActiveController**(): `boolean`

Defined in: [src/camera/core/AController.ts:167](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/core/AController.ts#L167)

Returns whether this controller is currently the global keyboard-active controller.

##### Returns

`boolean`

Whether this controller is keyboard-active

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`isKeyboardActiveController`](../namespaces/Core/classes/AController.md#iskeyboardactivecontroller)

***

***

### keyboardActiveView

#### Get Signature

> **get** **keyboardActiveView**(): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:146](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/core/AController.ts#L146)

Gets or sets the global active `View3D` holding keyboard input focus.

##### Returns

[`View3D`](../../Display/classes/View3D.md)

Keyboard-active `View3D` or `null`

#### Set Signature

> **set** **keyboardActiveView**(`value`): `void`

Defined in: [src/camera/core/AController.ts:150](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/core/AController.ts#L150)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`View3D`](../../Display/classes/View3D.md) |

##### Returns

`void`

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`keyboardActiveView`](../namespaces/Core/classes/AController.md#keyboardactiveview)

***

***

### keyboardProcessedThisFrame

#### Get Signature

> **get** **keyboardProcessedThisFrame**(): `boolean`

Defined in: [src/camera/core/AController.ts:179](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/core/AController.ts#L179)

Gets or sets whether keyboard input has already been processed in the current frame.

##### Returns

`boolean`

Whether keyboard input has been processed this frame

#### Set Signature

> **set** **keyboardProcessedThisFrame**(`value`): `void`

Defined in: [src/camera/core/AController.ts:183](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/core/AController.ts#L183)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`keyboardProcessedThisFrame`](../namespaces/Core/classes/AController.md#keyboardprocessedthisframe)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/base/BaseObject.ts#L63)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`name`](../namespaces/Core/classes/AController.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/base/RedGPUObject.ts#L44)

Returns the bound `RedGPUContext` instance.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` instance

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`redGPUContext`](../namespaces/Core/classes/AController.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/base/RedGPUObject.ts#L68)

Returns the `ResourceManager` instance managing global GPU resources.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` instance

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`resourceManager`](../namespaces/Core/classes/AController.md#resourcemanager)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`uuid`](../namespaces/Core/classes/AController.md#uuid)

***

***

### x

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **x**(): `number`

Defined in: [src/camera/core/AController.ts:98](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/core/AController.ts#L98)

Returns the world X coordinate of the controlled camera.

##### Returns

`number`

Camera world X coordinate

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`x`](../namespaces/Core/classes/AController.md#x)

***

***

### y

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **y**(): `number`

Defined in: [src/camera/core/AController.ts:110](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/core/AController.ts#L110)

Returns the world Y coordinate of the controlled camera.

##### Returns

`number`

Camera world Y coordinate

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`y`](../namespaces/Core/classes/AController.md#y)

***

***

### z

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **z**(): `number`

Defined in: [src/camera/core/AController.ts:122](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/core/AController.ts#L122)

Returns the world Z coordinate of the controlled camera.

##### Returns

`number`

Camera world Z coordinate

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`z`](../namespaces/Core/classes/AController.md#z)

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### checkKeyboardInput()

> **checkKeyboardInput**\<`T`\>(`view`, `keyNameMapper`): `boolean`

Defined in: [src/camera/core/AController.ts:258](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/core/AController.ts#L258)

Checks whether any key in the key mapping table is pressed and acquires keyboard processing focus for the current `View3D`.

#### Type Parameters

| Type Parameter |
| ------ |
| <a id="type-parameter-t"></a> `T` *extends* `Record`\<`string`, `string`\> |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | `View3D` instance to check keyboard input for |
| `keyNameMapper` | `T` | Object mapping action names to key names (`Record<string, string>`) |

#### Returns

`boolean`

`true` if keyboard input can be processed in the current view, otherwise `false`

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`checkKeyboardInput`](../namespaces/Core/classes/AController.md#checkkeyboardinput)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/camera/core/AController.ts:191](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/core/AController.ts#L191)

Removes all canvas and window event listeners registered to the controller and clears internal references.

#### Returns

`void`

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`destroy`](../namespaces/Core/classes/AController.md#destroy)

***

***

### findTargetViewByInputEvent()

> **findTargetViewByInputEvent**(`e`): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:332](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/core/AController.ts#L332)

Finds and returns the `View3D` instance containing the pixel coordinates of the input event.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `e` | `MouseEvent` \| `TouchEvent` | Mouse or touch event (`MouseEvent` \| `TouchEvent`) |

#### Returns

[`View3D`](../../Display/classes/View3D.md)

`View3D` instance where the event occurred, or `null`

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`findTargetViewByInputEvent`](../namespaces/Core/classes/AController.md#findtargetviewbyinputevent)

***

***

### getCanvasEventPoint()

> **getCanvasEventPoint**(`e`, `redGPUContext`): `object`

Defined in: [src/camera/core/AController.ts:302](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/core/AController.ts#L302)

Calculates canvas-local `{ x, y }` coordinates from a mouse, touch, or wheel event.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `e` | `MouseEvent` \| `TouchEvent` \| `WheelEvent` | Input event (`MouseEvent` \| `TouchEvent` \| `WheelEvent`) |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | `RedGPUContext` instance |

#### Returns

`object`

Canvas-local `{ x, y }` coordinate object

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `x` | `number` | [src/camera/core/AController.ts:48](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/core/AController.ts#L48) |
| `y` | `number` | [src/camera/core/AController.ts:48](https://github.com/redcamel/RedGPU/blob/02c1984aa4d4459730423af2aefb6e6d17516878/src/camera/core/AController.ts#L48) |

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`getCanvasEventPoint`](../namespaces/Core/classes/AController.md#getcanvaseventpoint)

***

</details>
