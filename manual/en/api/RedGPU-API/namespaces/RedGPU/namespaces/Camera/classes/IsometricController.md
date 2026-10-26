[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / IsometricController

# Class: IsometricController

Defined in: [src/camera/controller/IsometricController.ts:24](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L24)

Camera controller class that provides a fixed-angle isometric (quarter-view) perspective using orthographic projection (`OrthographicCamera`).

***

### Example
```typescript
const controller = new RedGPU.Camera.IsometricController(redGPUContext);
controller.viewHeight = 15;
controller.zoom = 1;
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/controller/isometricController/" style="width:100%; height:500px;"></iframe>

## See

[IsometricController example](https://redcamel.github.io/RedGPU/examples/3d/controller/isometricController/)

## Extends

- [`AController`](../namespaces/Core/classes/AController.md)

## Constructors



***

### Constructor

> **new IsometricController**(`redGPUContext`): `IsometricController`

Defined in: [src/camera/controller/IsometricController.ts:64](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L64)

Creates an IsometricController instance.

#### Example
```typescript
const controller = new RedGPU.Camera.IsometricController(redGPUContext);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`IsometricController`

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`constructor`](../namespaces/Core/classes/AController.md#constructor)

## Accessors



***

### keyNameMapper

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **keyNameMapper**(): `object`

Defined in: [src/camera/controller/IsometricController.ts:294](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L294)

Returns a copy of the currently configured keyboard key mapping object.

##### Returns

`object`

Key mapping configuration object

| Name | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ |
| `moveDown` | `string` | `'s'` | [src/camera/controller/IsometricController.ts:43](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L43) |
| `moveLeft` | `string` | `'a'` | [src/camera/controller/IsometricController.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L44) |
| `moveRight` | `string` | `'d'` | [src/camera/controller/IsometricController.ts:45](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L45) |
| `moveUp` | `string` | `'w'` | [src/camera/controller/IsometricController.ts:42](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L42) |

***

***

### maxZoom

#### Get Signature

> **get** **maxZoom**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:174](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L174)

Gets or sets the maximum zoom scale. (`0.01` or greater)

##### Returns

`number`

Maximum zoom scale (default: `3`)

#### Set Signature

> **set** **maxZoom**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:178](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L178)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minZoom

#### Get Signature

> **get** **minZoom**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:156](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L156)

Gets or sets the minimum zoom scale. (`0.01` or greater)

##### Returns

`number`

Minimum zoom scale (default: `0.5`)

#### Set Signature

> **set** **minZoom**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:160](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L160)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### mouseMoveSpeed

#### Get Signature

> **get** **mouseMoveSpeed**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:260](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L260)

Gets or sets the mouse movement speed. (`0.01` or greater)

##### Returns

`number`

Mouse movement speed (default: `1`)

#### Set Signature

> **set** **mouseMoveSpeed**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:264](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L264)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### mouseMoveSpeedInterpolation

#### Get Signature

> **get** **mouseMoveSpeedInterpolation**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:277](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L277)

Gets or sets the damping interpolation factor for mouse movement. (`0.0001` ~ `1`)

##### Returns

`number`

Mouse movement interpolation factor (default: `0.02`)

#### Set Signature

> **set** **mouseMoveSpeedInterpolation**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:281](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L281)

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

Defined in: [src/camera/controller/IsometricController.ts:226](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L226)

Gets or sets the keyboard movement speed. (`0.01` or greater)

##### Returns

`number`

Movement speed (default: `20`)

#### Set Signature

> **set** **moveSpeed**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:230](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L230)

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

Defined in: [src/camera/controller/IsometricController.ts:243](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L243)

Gets or sets the damping interpolation factor for position movement. (`0.0001` ~ `1`)

##### Returns

`number`

Movement interpolation factor (default: `0.02`)

#### Set Signature

> **set** **moveSpeedInterpolation**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:247](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L247)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### speedZoom

#### Get Signature

> **get** **speedZoom**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:139](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L139)

Gets or sets the mouse wheel zoom speed. (`0.01` or greater)

##### Returns

`number`

Zoom speed (default: `0.1`)

#### Set Signature

> **set** **speedZoom**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:143](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L143)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### targetX

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **targetX**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:306](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L306)

Returns the current X-axis coordinate of the target point the camera looks at.

##### Returns

`number`

Target X-axis coordinate

***

***

### targetY

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **targetY**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:318](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L318)

Returns the current Y-axis coordinate of the target point the camera looks at. (Always `0`)

##### Returns

`number`

Target Y-axis coordinate (`0`)

***

***

### targetZ

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **targetZ**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:330](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L330)

Returns the current Z-axis coordinate of the target point the camera looks at.

##### Returns

`number`

Target Z-axis coordinate

***

***

### viewHeight

#### Get Signature

> **get** **viewHeight**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:192](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L192)

Gets or sets the base height of the orthographic projection view. (`0.1` or greater)

##### Returns

`number`

View height (default: `15`)

#### Set Signature

> **set** **viewHeight**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:196](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L196)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### viewHeightInterpolation

#### Get Signature

> **get** **viewHeightInterpolation**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:209](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L209)

Gets or sets the damping interpolation factor for view height changes. (`0.0001` ~ `1`)

##### Returns

`number`

View height interpolation factor (default: `0.02`)

#### Set Signature

> **set** **viewHeightInterpolation**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:213](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L213)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### zoom

#### Get Signature

> **get** **zoom**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:105](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L105)

Gets or sets the target zoom scale. (`minZoom` ~ `maxZoom`)

##### Returns

`number`

Target zoom scale (default: `1`)

#### Set Signature

> **set** **zoom**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:109](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L109)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### zoomInterpolation

#### Get Signature

> **get** **zoomInterpolation**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:122](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L122)

Gets or sets the damping interpolation factor for zoom changes. (`0.0001` ~ `1`)

##### Returns

`number`

Zoom interpolation factor (default: `0.02`)

#### Set Signature

> **set** **zoomInterpolation**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:126](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L126)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

## Methods



***

### setMoveDownKey()

> **setMoveDownKey**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:354](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L354)

Sets the move down key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Key name to assign (e.g., `'s'`) |

#### Returns

`void`

***

***

### setMoveLeftKey()

> **setMoveLeftKey**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:366](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L366)

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

Defined in: [src/camera/controller/IsometricController.ts:378](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L378)

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

Defined in: [src/camera/controller/IsometricController.ts:342](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L342)

Sets the move up key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Key name to assign (e.g., `'w'`) |

#### Returns

`void`

***

***

### update()

> **update**(`view`, `time`): `void`

Defined in: [src/camera/controller/IsometricController.ts:393](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/controller/IsometricController.ts#L393)

Updates the isometric camera state every frame.

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

***

### x

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **x**(): `number`

Defined in: [src/camera/core/AController.ts:98](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L98)

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

Defined in: [src/camera/core/AController.ts:110](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L110)

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

Defined in: [src/camera/core/AController.ts:122](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L122)

Returns the world Z coordinate of the controlled camera.

##### Returns

`number`

Camera world Z coordinate

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`z`](../namespaces/Core/classes/AController.md#z)

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
