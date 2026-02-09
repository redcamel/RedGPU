[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / FreeController

# Class: FreeController

Defined in: [src/camera/controller/FreeController.ts:46](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L46)


First-person camera controller that allows free movement.


Allows for free-flight exploration of the space using keyboard and mouse, similar to FPS games or 3D editor viewports.

* ### Example
```typescript
const controller = new RedGPU.FreeController(redGPUContext);
controller.pan = 30;
controller.tilt = 10;
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/controller/freeController/" style="width:100%; height:500px;"></iframe>

## Extends

- [`AController`](../namespaces/Core/classes/AController.md)

## Constructors

### Constructor

> **new FreeController**(`redGPUContext`): `FreeController`

Defined in: [src/camera/controller/FreeController.ts:88](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L88)


Creates an instance of FreeController.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPU Context object |

#### Returns

`FreeController`

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`constructor`](../namespaces/Core/classes/AController.md#constructor)

## Accessors

### camera

#### Get Signature

> **get** **camera**(): [`PerspectiveCamera`](PerspectiveCamera.md) \| [`OrthographicCamera`](OrthographicCamera.md)

Defined in: [src/camera/core/AController.ts:138](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L138)


Returns the camera controlled by this controller.

##### Returns

[`PerspectiveCamera`](PerspectiveCamera.md) \| [`OrthographicCamera`](OrthographicCamera.md)


Controlled camera (PerspectiveCamera or OrthographicCamera)

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`camera`](../namespaces/Core/classes/AController.md#camera)

***

### hoveredView

#### Get Signature

> **get** **hoveredView**(): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:187](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L187)

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

Defined in: [src/camera/core/AController.ts:233](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L233)

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

Defined in: [src/camera/core/AController.ts:200](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L200)

**`Internal`**


Returns the View with active keyboard input.

##### Returns

[`View3D`](../../Display/classes/View3D.md)


Keyboard active View or null

#### Set Signature

> **set** **keyboardActiveView**(`value`): `void`

Defined in: [src/camera/core/AController.ts:213](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L213)

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

Defined in: [src/camera/core/AController.ts:246](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L246)

**`Internal`**


Returns whether keyboard input has already been processed in this frame.

##### Returns

`boolean`


Processing status

#### Set Signature

> **set** **keyboardProcessedThisFrame**(`value`): `void`

Defined in: [src/camera/core/AController.ts:259](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L259)

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

Defined in: [src/camera/controller/FreeController.ts:150](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L150)

Key mapping configuration object

##### Returns

`KeyNameMapper`

***

### maxAcceleration

#### Get Signature

> **get** **maxAcceleration**(): `number`

Defined in: [src/camera/controller/FreeController.ts:146](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L146)

Maximum acceleration scale

##### Returns

`number`

#### Set Signature

> **set** **maxAcceleration**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:147](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L147)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### mouseSensitivity

#### Get Signature

> **get** **mouseSensitivity**(): `number`

Defined in: [src/camera/controller/FreeController.ts:125](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L125)

Mouse rotation sensitivity

##### Returns

`number`

#### Set Signature

> **set** **mouseSensitivity**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:126](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L126)

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

Defined in: [src/camera/controller/FreeController.ts:130](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L130)

Movement speed

##### Returns

`number`

#### Set Signature

> **set** **moveSpeed**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:131](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L131)

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

Defined in: [src/camera/controller/FreeController.ts:134](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L134)

Movement interpolation factor

##### Returns

`number`

#### Set Signature

> **set** **moveSpeedInterpolation**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:135](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L135)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/camera/core/AController.ts:101](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L101)


Returns the name of the controller.

##### Returns

`string`


Controller name

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/camera/core/AController.ts:114](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L114)


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

Defined in: [src/camera/controller/FreeController.ts:117](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L117)

Horizontal rotation angle (Pan) in degrees

##### Returns

`number`

#### Set Signature

> **set** **pan**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:118](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L118)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/camera/core/AController.ts:126](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L126)


Returns the RedGPU context.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)


RedGPU context

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`redGPUContext`](../namespaces/Core/classes/AController.md#redgpucontext)

***

### rotationSpeed

#### Get Signature

> **get** **rotationSpeed**(): `number`

Defined in: [src/camera/controller/FreeController.ts:138](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L138)

Rotation speed

##### Returns

`number`

#### Set Signature

> **set** **rotationSpeed**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:139](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L139)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### rotationSpeedInterpolation

#### Get Signature

> **get** **rotationSpeedInterpolation**(): `number`

Defined in: [src/camera/controller/FreeController.ts:142](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L142)

Rotation interpolation factor

##### Returns

`number`

#### Set Signature

> **set** **rotationSpeedInterpolation**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:143](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L143)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### tilt

#### Get Signature

> **get** **tilt**(): `number`

Defined in: [src/camera/controller/FreeController.ts:121](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L121)

Vertical rotation angle (Tilt) in degrees

##### Returns

`number`

#### Set Signature

> **set** **tilt**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:122](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L122)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/camera/controller/FreeController.ts:103](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L103)

X-axis position

##### Returns

`number`

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:104](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L104)


Gets the camera's current world X coordinate.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`


X coordinate

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`x`](../namespaces/Core/classes/AController.md#x)

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/camera/controller/FreeController.ts:107](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L107)

Y-axis position

##### Returns

`number`

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:108](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L108)


Gets the camera's current world Y coordinate.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`


Y coordinate

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`y`](../namespaces/Core/classes/AController.md#y)

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/camera/controller/FreeController.ts:111](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L111)

Z-axis position

##### Returns

`number`

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:112](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L112)


Gets the camera's current world Z coordinate.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`


Z coordinate

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`z`](../namespaces/Core/classes/AController.md#z)

## Methods

### checkKeyboardInput()

> **checkKeyboardInput**\<`T`\>(`view`, `keyNameMapper`): `boolean`

Defined in: [src/camera/core/AController.ts:323](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L323)


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

Defined in: [src/camera/core/AController.ts:267](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L267)


Destroys the controller and removes event listeners.

#### Returns

`void`

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`destroy`](../namespaces/Core/classes/AController.md#destroy)

***

### findTargetViewByInputEvent()

> **findTargetViewByInputEvent**(`e`): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:407](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L407)

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

Defined in: [src/camera/core/AController.ts:370](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L370)

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
| `x` | `number` | [src/camera/core/AController.ts:390](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L390) |
| `y` | `number` | [src/camera/core/AController.ts:391](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L391) |

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`getCanvasEventPoint`](../namespaces/Core/classes/AController.md#getcanvaseventpoint)

***

### setMoveBackKey()

> **setMoveBackKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:156](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L156)

Sets the move backward key

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

#### Returns

`void`

***

### setMoveDownKey()

> **setMoveDownKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:164](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L164)

Sets the move down key

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

#### Returns

`void`

***

### setMoveForwardKey()

> **setMoveForwardKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:154](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L154)

Sets the move forward key

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

#### Returns

`void`

***

### setMoveLeftKey()

> **setMoveLeftKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:158](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L158)

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

Defined in: [src/camera/controller/FreeController.ts:160](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L160)

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

Defined in: [src/camera/controller/FreeController.ts:162](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L162)

Sets the move up key

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

#### Returns

`void`

***

### setTurnDownKey()

> **setTurnDownKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:172](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L172)

Sets the turn down key

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

#### Returns

`void`

***

### setTurnLeftKey()

> **setTurnLeftKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:166](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L166)

Sets the turn left key

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

#### Returns

`void`

***

### setTurnRightKey()

> **setTurnRightKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:168](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L168)

Sets the turn right key

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

#### Returns

`void`

***

### setTurnUpKey()

> **setTurnUpKey**(`value`): `void`

Defined in: [src/camera/controller/FreeController.ts:170](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L170)

Sets the turn up key

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

#### Returns

`void`

***

### update()

> **update**(`view`, `time`): `void`

Defined in: [src/camera/controller/FreeController.ts:181](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/FreeController.ts#L181)


Updates the controller every frame.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 3D View |
| `time` | `number` | Current time |

#### Returns

`void`

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`update`](../namespaces/Core/classes/AController.md#update)
