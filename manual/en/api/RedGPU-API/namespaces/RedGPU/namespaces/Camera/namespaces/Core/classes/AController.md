[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Camera](../../../README.md) / [Core](../README.md) / AController

# Abstract Class: AController

Defined in: [src/camera/core/AController.ts:32](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L32)

Abstract controller class that processes mouse, touch, and keyboard inputs to control a camera (`PerspectiveCamera` or `OrthographicCamera`).

::: warning
This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extends

- [`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md)

## Extended by

- [`FreeController`](../../../classes/FreeController.md)
- [`FollowController`](../../../classes/FollowController.md)
- [`OrbitController`](../../../classes/OrbitController.md)
- [`IsometricController`](../../../classes/IsometricController.md)

## Constructors



***

### Constructor

> **new AController**(`redGPUContext`, `initInfo`): `AController`

Defined in: [src/camera/core/AController.ts:65](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L65)

Initializes the `AController` instance and registers canvas input event listeners.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | `RedGPUContext` instance |
| `initInfo` | `controllerInit` | Controller input callbacks and initial camera configuration options |

#### Returns

`AController`

#### Overrides

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### camera

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **camera**(): [`PerspectiveCamera`](../../../classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../classes/OrthographicCamera.md)

Defined in: [src/camera/core/AController.ts:86](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L86)

Returns the camera instance controlled by this controller.

##### Returns

[`PerspectiveCamera`](../../../classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../classes/OrthographicCamera.md)

Controlled `PerspectiveCamera` or `OrthographicCamera` instance

***

***

### hoveredView

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **hoveredView**(): [`View3D`](../../../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:134](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L134)

Returns the `View3D` instance currently hovered by the pointer.

##### Returns

[`View3D`](../../../../Display/classes/View3D.md)

Hovered `View3D` or `null`

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

***

***

### keyboardActiveView

#### Get Signature

> **get** **keyboardActiveView**(): [`View3D`](../../../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:146](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L146)

Gets or sets the global active `View3D` holding keyboard input focus.

##### Returns

[`View3D`](../../../../Display/classes/View3D.md)

Keyboard-active `View3D` or `null`

#### Set Signature

> **set** **keyboardActiveView**(`value`): `void`

Defined in: [src/camera/core/AController.ts:150](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L150)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`View3D`](../../../../Display/classes/View3D.md) |

##### Returns

`void`

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

## Methods



***

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
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | `View3D` instance to check keyboard input for |
| `keyNameMapper` | `T` | Object mapping action names to key names (`Record<string, string>`) |

#### Returns

`boolean`

`true` if keyboard input can be processed in the current view, otherwise `false`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/camera/core/AController.ts:191](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L191)

Removes all canvas and window event listeners registered to the controller and clears internal references.

#### Returns

`void`

***

***

### findTargetViewByInputEvent()

> **findTargetViewByInputEvent**(`e`): [`View3D`](../../../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:332](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L332)

Finds and returns the `View3D` instance containing the pixel coordinates of the input event.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `e` | `MouseEvent` \| `TouchEvent` | Mouse or touch event (`MouseEvent` \| `TouchEvent`) |

#### Returns

[`View3D`](../../../../Display/classes/View3D.md)

`View3D` instance where the event occurred, or `null`

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
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | `RedGPUContext` instance |

#### Returns

`object`

Canvas-local `{ x, y }` coordinate object

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `x` | `number` | [src/camera/core/AController.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L48) |
| `y` | `number` | [src/camera/core/AController.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L48) |

***

***

### update()

> **update**(`view`, `time`, `updateAnimation?`): `void`

Defined in: [src/camera/core/AController.ts:231](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/AController.ts#L231)

Calculates frame elapsed time (`deltaTime`), prevents duplicate view updates, and executes the animation callback.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | Target `View3D` instance to update |
| `time` | `number` | Current frame timestamp in milliseconds |
| `updateAnimation?` | (`view`, `deltaTime`) => `void` | Optional callback function receiving `deltaTime` in seconds to update camera state |

#### Returns

`void`

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L80)

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

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L92)

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

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L56)

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

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L36)

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

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`name`](../../../../BaseObject/classes/RedGPUObject.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L44)

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

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/RedGPUObject.ts#L68)

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

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L48)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string of the object

#### Inherited from

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../../../BaseObject/classes/RedGPUObject.md#uuid)

***

</details>
