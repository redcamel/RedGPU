[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / FreeController

# Class: FreeController

Defined in: [src/camera/controller/FreeController.ts:89](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/FreeController.ts#L89)


First-person camera controller that allows free movement.


Allows for free-flight exploration of the space using keyboard and mouse, similar to FPS games or 3D editor viewports.

* ### Example
```typescript
const controller = new RedGPU.Camera.FreeController(redGPUContext);
controller.setPosition(10, 5, 20);
controller.pan = 30;
controller.tilt = 10;
controller.setMoveForwardKey('w');
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/controller/freeController/"></iframe>

## Extends

- [`AController`](../namespaces/Core/classes/AController.md)

## Constructors

### Constructor

> **new FreeController**(`redGPUContext`): `FreeController`

Defined in: [src/camera/controller/FreeController.ts:127](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/FreeController.ts#L127)


Constructor for FreeController.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md) | RedGPU Context object |

#### Returns

`FreeController`

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`constructor`](../namespaces/Core/classes/AController.md#constructor)

## Accessors

### camera

#### Get Signature

> **get** **camera**(): [`PerspectiveCamera`](PerspectiveCamera.md) \| [`OrthographicCamera`](OrthographicCamera.md)

Defined in: [src/camera/core/AController.ts:135](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/core/AController.ts#L135)


Returns the camera controlled by this controller.

##### Returns

[`PerspectiveCamera`](PerspectiveCamera.md) \| [`OrthographicCamera`](OrthographicCamera.md)


Controlled camera (PerspectiveCamera or OrthographicCamera)

#### Inherited from

[`FollowController`](FollowController.md).[`camera`](FollowController.md#camera)

***

### hoveredView

#### Get Signature

> **get** **hoveredView**(): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:149](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/core/AController.ts#L149)

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

Defined in: [src/camera/core/AController.ts:195](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/core/AController.ts#L195)

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

Defined in: [src/camera/core/AController.ts:162](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/core/AController.ts#L162)

**`Internal`**


Returns the View with active keyboard input.

##### Returns

[`View3D`](../../Display/classes/View3D.md)


Keyboard active View or null

#### Set Signature

> **set** **keyboardActiveView**(`value`): `void`

Defined in: [src/camera/core/AController.ts:175](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/core/AController.ts#L175)

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

Defined in: [src/camera/core/AController.ts:208](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/core/AController.ts#L208)

**`Internal`**


Returns whether keyboard input has already been processed in this frame.

##### Returns

`boolean`


Processing status

#### Set Signature

> **set** **keyboardProcessedThisFrame**(`value`): `void`

Defined in: [src/camera/core/AController.ts:221](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/core/AController.ts#L221)

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

### keyNameMapper

#### Get Signature

> **get** **keyNameMapper**(): `KeyNameMapper`

Defined in: [src/camera/controller/FreeController.ts:409](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/FreeController.ts#L409)


Gets the current key mapping configuration.

##### Returns

`KeyNameMapper`


Copy of key mapping object

***

### maxAcceleration

#### Get Signature

> **get** **maxAcceleration**(): `number`

Defined in: [src/camera/controller/FreeController.ts:384](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/FreeController.ts#L384)


Gets the maximum acceleration.

##### Returns

`number`


Maximum acceleration value

#### Set Signature

> **set** **maxAcceleration**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:396](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/FreeController.ts#L396)


Sets the maximum acceleration.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Maximum acceleration value to set |

##### Returns

`void`

***

### moveSpeed

#### Get Signature

> **get** **moveSpeed**(): `number`

Defined in: [src/camera/controller/FreeController.ts:282](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/FreeController.ts#L282)


Gets the camera's movement speed.

##### Returns

`number`


Movement speed value

#### Set Signature

> **set** **moveSpeed**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:294](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/FreeController.ts#L294)


Sets the camera's movement speed.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Movement speed value to set (min 0.01) |

##### Returns

`void`

***

### moveSpeedInterpolation

#### Get Signature

> **get** **moveSpeedInterpolation**(): `number`

Defined in: [src/camera/controller/FreeController.ts:307](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/FreeController.ts#L307)


Gets the movement interpolation factor. (Range 0~1, smaller is smoother)

##### Returns

`number`


Movement interpolation factor value

#### Set Signature

> **set** **moveSpeedInterpolation**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:319](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/FreeController.ts#L319)


Sets the movement interpolation factor. (Range 0.01~1, smaller is smoother movement)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Interpolation factor value to set |

##### Returns

`void`

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/camera/core/AController.ts:98](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/core/AController.ts#L98)


Returns the name of the controller.

##### Returns

`string`


Controller name

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/camera/core/AController.ts:111](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/core/AController.ts#L111)


Sets the name of the controller.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name to set |

##### Returns

`void`

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`name`](../namespaces/Core/classes/AController.md#name)

***

### pan

#### Get Signature

> **get** **pan**(): `number`

Defined in: [src/camera/controller/FreeController.ts:228](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/FreeController.ts#L228)


Gets the camera's horizontal rotation angle (Pan). (Unit: degrees)

##### Returns

`number`


Horizontal rotation angle value

#### Set Signature

> **set** **pan**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:240](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/FreeController.ts#L240)


Sets the camera's horizontal rotation angle (Pan). (Unit: degrees)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Horizontal rotation angle value to set |

##### Returns

`void`

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md)

Defined in: [src/camera/core/AController.ts:123](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/core/AController.ts#L123)


Returns the RedGPU context.

##### Returns

[`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md)


RedGPU context

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`redGPUContext`](../namespaces/Core/classes/AController.md#redgpucontext)

***

### rotationSpeed

#### Get Signature

> **get** **rotationSpeed**(): `number`

Defined in: [src/camera/controller/FreeController.ts:333](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/FreeController.ts#L333)


Gets the camera's rotation speed.

##### Returns

`number`


Rotation speed value

#### Set Signature

> **set** **rotationSpeed**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:345](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/FreeController.ts#L345)


Sets the camera's rotation speed.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Rotation speed value to set (min 0.01) |

##### Returns

`void`

***

### rotationSpeedInterpolation

#### Get Signature

> **get** **rotationSpeedInterpolation**(): `number`

Defined in: [src/camera/controller/FreeController.ts:358](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/FreeController.ts#L358)


Gets the rotation interpolation factor. (Range 0~1, smaller is smoother)

##### Returns

`number`


Rotation interpolation factor value

#### Set Signature

> **set** **rotationSpeedInterpolation**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:370](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/FreeController.ts#L370)


Sets the rotation interpolation factor. (Range 0.01~1, smaller is smoother rotation)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Interpolation factor value to set |

##### Returns

`void`

***

### tilt

#### Get Signature

> **get** **tilt**(): `number`

Defined in: [src/camera/controller/FreeController.ts:254](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/FreeController.ts#L254)


Gets the camera's vertical rotation angle (Tilt). (Unit: degrees, Range: -90 ~ 90)

##### Returns

`number`


Vertical rotation angle value

#### Set Signature

> **set** **tilt**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:266](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/FreeController.ts#L266)


Sets the camera's vertical rotation angle (Tilt). (Unit: degrees, Range: -90 ~ 90)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Vertical rotation angle value to set |

##### Returns

`void`

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/camera/controller/FreeController.ts:149](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/FreeController.ts#L149)


Gets the camera's X-axis position.

##### Returns

`number`


Camera X-axis position value

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:161](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/FreeController.ts#L161)


Sets the camera's X-axis position.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | X-axis position value to set (number) |

##### Returns

`void`

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/camera/controller/FreeController.ts:175](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/FreeController.ts#L175)


Gets the camera's Y-axis position.

##### Returns

`number`


Camera Y-axis position value

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:187](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/FreeController.ts#L187)


Sets the camera's Y-axis position.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Y-axis position value to set (number) |

##### Returns

`void`

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/camera/controller/FreeController.ts:201](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/FreeController.ts#L201)


Gets the camera's Z-axis position.

##### Returns

`number`


Camera Z-axis position value

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:213](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/FreeController.ts#L213)


Sets the camera's Z-axis position.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Z-axis position value to set (number) |

##### Returns

`void`

## Methods

### checkKeyboardInput()

> **checkKeyboardInput**\<`T`\>(`view`, `keyNameMapper`): `boolean`

Defined in: [src/camera/core/AController.ts:283](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/core/AController.ts#L283)


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

Defined in: [src/camera/core/AController.ts:229](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/core/AController.ts#L229)


Destroys the controller and removes event listeners.

#### Returns

`void`

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`destroy`](../namespaces/Core/classes/AController.md#destroy)

***

### findTargetViewByInputEvent()

> **findTargetViewByInputEvent**(`e`): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:367](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/core/AController.ts#L367)

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

Defined in: [src/camera/core/AController.ts:330](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/core/AController.ts#L330)

**`Internal`**


Gets the event coordinates on the canvas.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `e` | `MouseEvent` \| `TouchEvent` \| `WheelEvent` | Mouse, touch, or wheel event |
| `redGPUContext` | [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md) | RedGPU context |

#### Returns

`object`


{x, y} coordinate object

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `x` | `number` | [src/camera/core/AController.ts:350](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/core/AController.ts#L350) |
| `y` | `number` | [src/camera/core/AController.ts:351](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/core/AController.ts#L351) |

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`getCanvasEventPoint`](../namespaces/Core/classes/AController.md#getcanvaseventpoint)

***

### setMoveBackKey()

> **setMoveBackKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:433](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/FreeController.ts#L433)


Sets the move backward key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Key name to set (e.g., 's') |

#### Returns

`void`

***

### setMoveDownKey()

> **setMoveDownKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:481](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/FreeController.ts#L481)


Sets the move down key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Key name to set (e.g., 'g') |

#### Returns

`void`

***

### setMoveForwardKey()

> **setMoveForwardKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:421](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/FreeController.ts#L421)


Sets the move forward key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Key name to set (e.g., 'w') |

#### Returns

`void`

***

### setMoveLeftKey()

> **setMoveLeftKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:445](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/FreeController.ts#L445)


Sets the move left key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Key name to set (e.g., 'a') |

#### Returns

`void`

***

### setMoveRightKey()

> **setMoveRightKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:457](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/FreeController.ts#L457)


Sets the move right key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Key name to set (e.g., 'd') |

#### Returns

`void`

***

### setMoveUpKey()

> **setMoveUpKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:469](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/FreeController.ts#L469)


Sets the move up key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Key name to set (e.g., 't') |

#### Returns

`void`

***

### setTurnDownKey()

> **setTurnDownKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:529](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/FreeController.ts#L529)


Sets the turn down key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Key name to set (e.g., 'f') |

#### Returns

`void`

***

### setTurnLeftKey()

> **setTurnLeftKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:493](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/FreeController.ts#L493)


Sets the turn left key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Key name to set (e.g., 'q') |

#### Returns

`void`

***

### setTurnRightKey()

> **setTurnRightKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:505](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/FreeController.ts#L505)


Sets the turn right key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Key name to set (e.g., 'e') |

#### Returns

`void`

***

### setTurnUpKey()

> **setTurnUpKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:517](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/FreeController.ts#L517)


Sets the turn up key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Key name to set (e.g., 'r') |

#### Returns

`void`

***

### update()

> **update**(`view`, `time`): `void`

Defined in: [src/camera/controller/FreeController.ts:545](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/FreeController.ts#L545)


Updates the camera controller every frame.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 3D View object |
| `time` | `number` | Current elapsed time (ms) |

#### Returns

`void`

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`update`](../namespaces/Core/classes/AController.md#update)
