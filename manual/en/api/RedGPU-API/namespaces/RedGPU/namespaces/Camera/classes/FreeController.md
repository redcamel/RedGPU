[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / FreeController

# Class: FreeController

Defined in: [src/camera/controller/FreeController.ts:85](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L85)

First-person camera controller class that freely navigates 3D space using keyboard and mouse inputs.

***

### Example
```typescript
const controller = new RedGPU.Camera.FreeController(redGPUContext);
controller.x = 0;
controller.y = 5;
controller.z = 20;
controller.pan = 0;
controller.tilt = -15;
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/controller/freeController/" style="width:100%; height:500px;"></iframe>

## See

[FreeController example](https://redcamel.github.io/RedGPU/examples/3d/controller/freeController/)

## Extends

- [`AController`](../namespaces/Core/classes/AController.md)

## Constructors



***

### Constructor

> **new FreeController**(`redGPUContext`): `FreeController`

Defined in: [src/camera/controller/FreeController.ts:133](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L133)

Creates a FreeController instance.

#### Example
```typescript
const controller = new RedGPU.Camera.FreeController(redGPUContext);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`FreeController`

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`constructor`](../namespaces/Core/classes/AController.md#constructor)

## Accessors



***

### keyNameMapper

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **keyNameMapper**(): `KeyNameMapper`

Defined in: [src/camera/controller/FreeController.ts:339](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L339)

Returns a copy of the currently configured keyboard key mapping object.

##### Returns

`KeyNameMapper`

Key mapping configuration object (`KeyNameMapper`)

***

***

### maxAcceleration

#### Get Signature

> **get** **maxAcceleration**(): `number`

Defined in: [src/camera/controller/FreeController.ts:323](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L323)

Gets or sets the maximum movement acceleration scale.

##### Returns

`number`

Maximum acceleration scale (default: `1`)

#### Set Signature

> **set** **maxAcceleration**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:327](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L327)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### mouseSensitivity

#### Get Signature

> **get** **mouseSensitivity**(): `number`

Defined in: [src/camera/controller/FreeController.ts:238](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L238)

Gets or sets the mouse drag rotation sensitivity. (`0.01` or greater)

##### Returns

`number`

Mouse rotation sensitivity (default: `0.15`)

#### Set Signature

> **set** **mouseSensitivity**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:242](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L242)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### moveSpeed

#### Get Signature

> **get** **moveSpeed**(): `number`

Defined in: [src/camera/controller/FreeController.ts:255](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L255)

Gets or sets the keyboard movement speed. (`0.01` or greater)

##### Returns

`number`

Movement speed (default: `20`)

#### Set Signature

> **set** **moveSpeed**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:259](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L259)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### moveSpeedInterpolation

#### Get Signature

> **get** **moveSpeedInterpolation**(): `number`

Defined in: [src/camera/controller/FreeController.ts:272](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L272)

Gets or sets the damping interpolation factor for movement position changes. (`0.0001` ~ `1`)

##### Returns

`number`

Movement interpolation factor (default: `0.01`)

#### Set Signature

> **set** **moveSpeedInterpolation**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:276](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L276)

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

Defined in: [src/camera/controller/FreeController.ts:204](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L204)

Gets or sets the camera's target horizontal rotation (Pan) angle. (Unit: degrees)

##### Returns

`number`

Pan angle (default: `0`)

#### Set Signature

> **set** **pan**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:208](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L208)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### rotationSpeed

#### Get Signature

> **get** **rotationSpeed**(): `number`

Defined in: [src/camera/controller/FreeController.ts:289](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L289)

Gets or sets the keyboard rotation speed. (`0.01` or greater)

##### Returns

`number`

Rotation speed (default: `100`)

#### Set Signature

> **set** **rotationSpeed**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:293](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L293)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### rotationSpeedInterpolation

#### Get Signature

> **get** **rotationSpeedInterpolation**(): `number`

Defined in: [src/camera/controller/FreeController.ts:306](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L306)

Gets or sets the damping interpolation factor for rotation changes. (`0.0001` ~ `1`)

##### Returns

`number`

Rotation interpolation factor (default: `0.01`)

#### Set Signature

> **set** **rotationSpeedInterpolation**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:310](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L310)

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

Defined in: [src/camera/controller/FreeController.ts:221](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L221)

Gets or sets the camera's target vertical rotation (Tilt) angle. (Unit: degrees, Range: `-89.9` ~ `89.9`)

##### Returns

`number`

Tilt angle (default: `0`)

#### Set Signature

> **set** **tilt**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:225](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L225)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/camera/controller/FreeController.ts:153](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L153)

Gets or sets the camera's target X-axis position.

##### Returns

`number`

X-axis position (default: `0`)

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:157](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L157)

Returns the world X coordinate of the controlled camera.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

Camera world X coordinate

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`x`](../namespaces/Core/classes/AController.md#x)

***

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/camera/controller/FreeController.ts:170](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L170)

Gets or sets the camera's target Y-axis position.

##### Returns

`number`

Y-axis position (default: `0`)

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:174](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L174)

Returns the world Y coordinate of the controlled camera.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

Camera world Y coordinate

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`y`](../namespaces/Core/classes/AController.md#y)

***

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/camera/controller/FreeController.ts:187](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L187)

Gets or sets the camera's target Z-axis position.

##### Returns

`number`

Z-axis position (default: `0`)

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:191](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L191)

Returns the world Z coordinate of the controlled camera.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

Camera world Z coordinate

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`z`](../namespaces/Core/classes/AController.md#z)

## Methods



***

### setMoveBackKey()

> **setMoveBackKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:363](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L363)

Sets the move backward key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Key name to assign (e.g., `'s'`) |

#### Returns

`void`

***

***

### setMoveDownKey()

> **setMoveDownKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:411](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L411)

Sets the move down key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Key name to assign (e.g., `'q'`) |

#### Returns

`void`

***

***

### setMoveForwardKey()

> **setMoveForwardKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:351](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L351)

Sets the move forward key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Key name to assign (e.g., `'w'`) |

#### Returns

`void`

***

***

### setMoveLeftKey()

> **setMoveLeftKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:375](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L375)

Sets the move left key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Key name to assign (e.g., `'a'`) |

#### Returns

`void`

***

***

### setMoveRightKey()

> **setMoveRightKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:387](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L387)

Sets the move right key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Key name to assign (e.g., `'d'`) |

#### Returns

`void`

***

***

### setMoveUpKey()

> **setMoveUpKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:399](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L399)

Sets the move up key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Key name to assign (e.g., `'e'`) |

#### Returns

`void`

***

***

### setTurnDownKey()

> **setTurnDownKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:459](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L459)

Sets the turn down key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Key name to assign (e.g., `'f'`) |

#### Returns

`void`

***

***

### setTurnLeftKey()

> **setTurnLeftKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:423](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L423)

Sets the turn left key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Key name to assign (e.g., `'z'`) |

#### Returns

`void`

***

***

### setTurnRightKey()

> **setTurnRightKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:435](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L435)

Sets the turn right key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Key name to assign (e.g., `'c'`) |

#### Returns

`void`

***

***

### setTurnUpKey()

> **setTurnUpKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:447](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L447)

Sets the turn up key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Key name to assign (e.g., `'r'`) |

#### Returns

`void`

***

***

### update()

> **update**(`view`, `time`): `void`

Defined in: [src/camera/controller/FreeController.ts:474](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/FreeController.ts#L474)

Updates the free-view camera state every frame.

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

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

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

Defined in: [src/camera/core/AController.ts:86](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L86)

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

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L92)

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

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L56)

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

Defined in: [src/camera/core/AController.ts:134](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L134)

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

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L36)

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

Defined in: [src/camera/core/AController.ts:167](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L167)

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

Defined in: [src/camera/core/AController.ts:146](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L146)

Gets or sets the global active `View3D` holding keyboard input focus.

##### Returns

[`View3D`](../../Display/classes/View3D.md)

Keyboard-active `View3D` or `null`

#### Set Signature

> **set** **keyboardActiveView**(`value`): `void`

Defined in: [src/camera/core/AController.ts:150](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L150)

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

Defined in: [src/camera/core/AController.ts:179](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L179)

Gets or sets whether keyboard input has already been processed in the current frame.

##### Returns

`boolean`

Whether keyboard input has been processed this frame

#### Set Signature

> **set** **keyboardProcessedThisFrame**(`value`): `void`

Defined in: [src/camera/core/AController.ts:183](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L183)

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

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L63)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L70)

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

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L44)

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

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

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

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`uuid`](../namespaces/Core/classes/AController.md#uuid)

***

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### checkKeyboardInput()

> **checkKeyboardInput**\<`T`\>(`view`, `keyNameMapper`): `boolean`

Defined in: [src/camera/core/AController.ts:258](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L258)

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

Defined in: [src/camera/core/AController.ts:191](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L191)

Removes all canvas and window event listeners registered to the controller and clears internal references.

#### Returns

`void`

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`destroy`](../namespaces/Core/classes/AController.md#destroy)

***

***

### findTargetViewByInputEvent()

> **findTargetViewByInputEvent**(`e`): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:332](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L332)

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

Defined in: [src/camera/core/AController.ts:302](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L302)

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
| `x` | `number` | [src/camera/core/AController.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L48) |
| `y` | `number` | [src/camera/core/AController.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L48) |

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`getCanvasEventPoint`](../namespaces/Core/classes/AController.md#getcanvaseventpoint)

***

</details>
