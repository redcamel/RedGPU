[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Camera](../../../README.md) / [Core](../README.md) / AController

# Abstract Class: AController

Defined in: [src/camera/core/AController.ts:29](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/camera/core/AController.ts#L29)


Abstract class for camera controllers.


Provides a common interface for controlling various camera types such as PerspectiveCamera and OrthographicCamera.

::: warning

This class is an abstract class used internally by the system.<br/>Direct instantiation is not possible; inherit and implement if necessary.
:::

## Extended by

- [`FreeController`](../../../classes/FreeController.md)
- [`FollowController`](../../../classes/FollowController.md)
- [`OrbitController`](../../../classes/OrbitController.md)
- [`IsometricController`](../../../classes/IsometricController.md)

## Constructors

### Constructor

> **new AController**(`redGPUContext`, `initInfo`): `AController`

Defined in: [src/camera/core/AController.ts:76](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/camera/core/AController.ts#L76)


AController constructor

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../RedGPUContext/classes/RedGPUContext.md) | RedGPU Context |
| `initInfo` | `controllerInit` | Controller initialization info |

#### Returns

`AController`

## Accessors

### camera

#### Get Signature

> **get** **camera**(): [`PerspectiveCamera`](../../../classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../classes/OrthographicCamera.md)

Defined in: [src/camera/core/AController.ts:135](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/camera/core/AController.ts#L135)


Returns the camera controlled by this controller.

##### Returns

[`PerspectiveCamera`](../../../classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../classes/OrthographicCamera.md)


Controlled camera (PerspectiveCamera or OrthographicCamera)

***

### hoveredView

#### Get Signature

> **get** **hoveredView**(): [`View3D`](../../../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:149](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/camera/core/AController.ts#L149)

**`Internal`**


Returns the View currently being hovered by the mouse.

##### Returns

[`View3D`](../../../../Display/classes/View3D.md)


Hovered View or null

***

### isKeyboardActiveController

#### Get Signature

> **get** **isKeyboardActiveController**(): `boolean`

Defined in: [src/camera/core/AController.ts:195](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/camera/core/AController.ts#L195)

**`Internal`**


Returns whether the current controller is processing keyboard input.

##### Returns

`boolean`


Whether it is the keyboard active controller

***

### keyboardActiveView

#### Get Signature

> **get** **keyboardActiveView**(): [`View3D`](../../../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:162](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/camera/core/AController.ts#L162)

**`Internal`**


Returns the View with active keyboard input.

##### Returns

[`View3D`](../../../../Display/classes/View3D.md)


Keyboard active View or null

#### Set Signature

> **set** **keyboardActiveView**(`value`): `void`

Defined in: [src/camera/core/AController.ts:175](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/camera/core/AController.ts#L175)

**`Internal`**


Sets the View with active keyboard input.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`View3D`](../../../../Display/classes/View3D.md) | View to set or null |

##### Returns

`void`

***

### keyboardProcessedThisFrame

#### Get Signature

> **get** **keyboardProcessedThisFrame**(): `boolean`

Defined in: [src/camera/core/AController.ts:208](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/camera/core/AController.ts#L208)

**`Internal`**


Returns whether keyboard input has already been processed in this frame.

##### Returns

`boolean`


Processing status

#### Set Signature

> **set** **keyboardProcessedThisFrame**(`value`): `void`

Defined in: [src/camera/core/AController.ts:221](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/camera/core/AController.ts#L221)

**`Internal`**


Sets whether keyboard input has been processed in this frame.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Processing status to set |

##### Returns

`void`

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/camera/core/AController.ts:98](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/camera/core/AController.ts#L98)


Returns the name of the controller.

##### Returns

`string`


Controller name

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/camera/core/AController.ts:111](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/camera/core/AController.ts#L111)


Sets the name of the controller.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name to set |

##### Returns

`void`

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../../../RedGPUContext/classes/RedGPUContext.md)

Defined in: [src/camera/core/AController.ts:123](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/camera/core/AController.ts#L123)


Returns the RedGPU context.

##### Returns

[`RedGPUContext`](../../../../RedGPUContext/classes/RedGPUContext.md)


RedGPU context

## Methods

### checkKeyboardInput()

> **checkKeyboardInput**\<`T`\>(`view`, `keyNameMapper`): `boolean`

Defined in: [src/camera/core/AController.ts:283](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/camera/core/AController.ts#L283)


Checks for keyboard input and sets the active View.

#### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `Record`\<`string`, `string`\> |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | Current View |
| `keyNameMapper` | `T` | Key mapping object |

#### Returns

`boolean`


True if keyboard input processing is possible, otherwise false

***

### destroy()

> **destroy**(): `void`

Defined in: [src/camera/core/AController.ts:229](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/camera/core/AController.ts#L229)


Destroys the controller and removes event listeners.

#### Returns

`void`

***

### findTargetViewByInputEvent()

> **findTargetViewByInputEvent**(`e`): [`View3D`](../../../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:367](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/camera/core/AController.ts#L367)

**`Internal`**


Finds the View where the input event occurred.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `e` | `MouseEvent` \| `TouchEvent` | Mouse or touch event |

#### Returns

[`View3D`](../../../../Display/classes/View3D.md)


Corresponding View or null

***

### getCanvasEventPoint()

> **getCanvasEventPoint**(`e`, `redGPUContext`): `object`

Defined in: [src/camera/core/AController.ts:330](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/camera/core/AController.ts#L330)

**`Internal`**


Gets the event coordinates on the canvas.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `e` | `MouseEvent` \| `TouchEvent` \| `WheelEvent` | Mouse, touch, or wheel event |
| `redGPUContext` | [`RedGPUContext`](../../../../RedGPUContext/classes/RedGPUContext.md) | RedGPU context |

#### Returns

`object`


{x, y} coordinate object

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `x` | `number` | [src/camera/core/AController.ts:350](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/camera/core/AController.ts#L350) |
| `y` | `number` | [src/camera/core/AController.ts:351](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/camera/core/AController.ts#L351) |

***

### update()

> **update**(`view`, `time`, `updateAnimation`): `void`

Defined in: [src/camera/core/AController.ts:256](https://github.com/redcamel/RedGPU/blob/ad7763b72bf927f4e4920daa847a7ad20d9f6f1a/src/camera/core/AController.ts#L256)


Updates the controller state. Must be implemented in derived classes.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../../../Display/classes/View3D.md) | Current View |
| `time` | `number` | Current time (ms) |
| `updateAnimation` | () => `void` | Animation update callback |

#### Returns

`void`
