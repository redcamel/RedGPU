[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / FollowController

# Class: FollowController

Defined in: [src/camera/controller/FollowController.ts:31](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/controller/FollowController.ts#L31)


Camera controller that tracks a specific target mesh.


Used to follow behind or rotate around a target, like a character camera in a 3rd person game. It smoothly tracks the target's movement and rotation, allowing for various cinematic effects by adjusting distance, height, and angles.

* ### Example
```typescript
const followController = new RedGPU.Camera.FollowController(redGPUContext, targetMesh);
followController.distance = 15;
followController.height = 8;
followController.pan = 45;
followController.tilt = 30;
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/controller/followController/"></iframe>

## Extends

- [`AController`](../namespaces/Core/classes/AController.md)

## Constructors

### Constructor

> **new FollowController**(`redGPUContext`, `targetMesh`): `FollowController`

Defined in: [src/camera/controller/FollowController.ts:147](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/controller/FollowController.ts#L147)


FollowController constructor

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPU Context |
| `targetMesh` | [`Mesh`](../../Display/classes/Mesh.md) | Target mesh to follow |

#### Returns

`FollowController`

#### Throws


Throws Error if targetMesh is null or undefined

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`constructor`](../namespaces/Core/classes/AController.md#constructor)

## Accessors

### camera

#### Get Signature

> **get** **camera**(): [`PerspectiveCamera`](PerspectiveCamera.md) \| [`OrthographicCamera`](OrthographicCamera.md)

Defined in: [src/camera/core/AController.ts:135](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/core/AController.ts#L135)


Returns the camera controlled by this controller.

##### Returns

[`PerspectiveCamera`](PerspectiveCamera.md) \| [`OrthographicCamera`](OrthographicCamera.md)


Controlled camera (PerspectiveCamera or OrthographicCamera)

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`camera`](../namespaces/Core/classes/AController.md#camera)

***

### distance

#### Get Signature

> **get** **distance**(): `number`

Defined in: [src/camera/controller/FollowController.ts:170](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/controller/FollowController.ts#L170)


Gets the camera distance from the target.

##### Returns

`number`


Target distance (min 0.1)

#### Set Signature

> **set** **distance**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:182](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/controller/FollowController.ts#L182)


Sets the camera distance from the target.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Distance to set (min 0.1) |

##### Returns

`void`

***

### distanceInterpolation

#### Get Signature

> **get** **distanceInterpolation**(): `number`

Defined in: [src/camera/controller/FollowController.ts:195](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/controller/FollowController.ts#L195)


Gets the interpolation factor for the distance value.

##### Returns

`number`


Distance interpolation factor (0.01 ~ 1)

#### Set Signature

> **set** **distanceInterpolation**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:207](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/controller/FollowController.ts#L207)


Sets the interpolation factor for the distance value.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Interpolation factor (0.01 ~ 1) |

##### Returns

`void`

***

### followTargetRotation

#### Get Signature

> **get** **followTargetRotation**(): `boolean`

Defined in: [src/camera/controller/FollowController.ts:395](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/controller/FollowController.ts#L395)


Gets whether to follow the target mesh's rotation.

##### Returns

`boolean`


If true, follows the target's rotation

#### Set Signature

> **set** **followTargetRotation**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:407](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/controller/FollowController.ts#L407)


Sets whether to follow the target mesh's rotation.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | If true, follows the target's rotation |

##### Returns

`void`

***

### height

#### Get Signature

> **get** **height**(): `number`

Defined in: [src/camera/controller/FollowController.ts:220](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/controller/FollowController.ts#L220)


Gets the camera height from the target.

##### Returns

`number`


Target height

#### Set Signature

> **set** **height**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:232](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/controller/FollowController.ts#L232)


Sets the camera height from the target.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Height to set |

##### Returns

`void`

***

### heightInterpolation

#### Get Signature

> **get** **heightInterpolation**(): `number`

Defined in: [src/camera/controller/FollowController.ts:245](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/controller/FollowController.ts#L245)


Gets the interpolation factor for the height value.

##### Returns

`number`


Height interpolation factor (0.01 ~ 1)

#### Set Signature

> **set** **heightInterpolation**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:257](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/controller/FollowController.ts#L257)


Sets the interpolation factor for the height value.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Interpolation factor (0.01 ~ 1) |

##### Returns

`void`

***

### hoveredView

#### Get Signature

> **get** **hoveredView**(): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:149](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/core/AController.ts#L149)

**`Internal`**


Returns the View currently being hovered by the mouse.

##### Returns

[`View3D`](../../Display/classes/View3D.md)


Hovered View or null

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`hoveredView`](../namespaces/Core/classes/AController.md#hoveredview)

***

### interpolation

#### Get Signature

> **get** **interpolation**(): `number`

Defined in: [src/camera/controller/FollowController.ts:370](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/controller/FollowController.ts#L370)


Gets the interpolation factor for the overall camera position.

##### Returns

`number`


Interpolation factor (0.01 ~ 1)

#### Set Signature

> **set** **interpolation**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:382](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/controller/FollowController.ts#L382)


Sets the interpolation factor for the overall camera position.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Interpolation factor (0.01 ~ 1) |

##### Returns

`void`

***

### isKeyboardActiveController

#### Get Signature

> **get** **isKeyboardActiveController**(): `boolean`

Defined in: [src/camera/core/AController.ts:195](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/core/AController.ts#L195)

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

Defined in: [src/camera/core/AController.ts:162](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/core/AController.ts#L162)

**`Internal`**


Returns the View with active keyboard input.

##### Returns

[`View3D`](../../Display/classes/View3D.md)


Keyboard active View or null

#### Set Signature

> **set** **keyboardActiveView**(`value`): `void`

Defined in: [src/camera/core/AController.ts:175](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/core/AController.ts#L175)

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

Defined in: [src/camera/core/AController.ts:208](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/core/AController.ts#L208)

**`Internal`**


Returns whether keyboard input has already been processed in this frame.

##### Returns

`boolean`


Processing status

#### Set Signature

> **set** **keyboardProcessedThisFrame**(`value`): `void`

Defined in: [src/camera/core/AController.ts:221](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/core/AController.ts#L221)

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

Defined in: [src/camera/core/AController.ts:98](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/core/AController.ts#L98)


Returns the name of the controller.

##### Returns

`string`


Controller name

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/camera/core/AController.ts:111](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/core/AController.ts#L111)


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

Defined in: [src/camera/controller/FollowController.ts:270](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/controller/FollowController.ts#L270)


Gets the camera's horizontal rotation (pan) angle around the target.

##### Returns

`number`


Pan angle (in degrees)

#### Set Signature

> **set** **pan**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:282](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/controller/FollowController.ts#L282)


Sets the camera's horizontal rotation (pan) angle around the target.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Pan angle (in degrees) |

##### Returns

`void`

***

### panInterpolation

#### Get Signature

> **get** **panInterpolation**(): `number`

Defined in: [src/camera/controller/FollowController.ts:295](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/controller/FollowController.ts#L295)


Gets the interpolation factor for the pan value.

##### Returns

`number`


Pan interpolation factor (0.01 ~ 1)

#### Set Signature

> **set** **panInterpolation**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:307](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/controller/FollowController.ts#L307)


Sets the interpolation factor for the pan value.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Interpolation factor (0.01 ~ 1) |

##### Returns

`void`

***

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/camera/core/AController.ts:123](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/core/AController.ts#L123)


Returns the RedGPU context.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)


RedGPU context

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`redGPUContext`](../namespaces/Core/classes/AController.md#redgpucontext)

***

### targetMesh

#### Get Signature

> **get** **targetMesh**(): [`Mesh`](../../Display/classes/Mesh.md)

Defined in: [src/camera/controller/FollowController.ts:494](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/controller/FollowController.ts#L494)


Gets the target mesh to follow.

##### Returns

[`Mesh`](../../Display/classes/Mesh.md)


Current target mesh

#### Set Signature

> **set** **targetMesh**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:509](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/controller/FollowController.ts#L509)


Sets the target mesh to follow.

##### Throws


Throws Error if value is null or undefined

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | [`Mesh`](../../Display/classes/Mesh.md) | Target mesh to set |

##### Returns

`void`

***

### targetOffsetX

#### Get Signature

> **get** **targetOffsetX**(): `number`

Defined in: [src/camera/controller/FollowController.ts:419](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/controller/FollowController.ts#L419)


Gets the camera's X-axis offset from the target.

##### Returns

`number`


X-axis offset

#### Set Signature

> **set** **targetOffsetX**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:431](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/controller/FollowController.ts#L431)


Sets the camera's X-axis offset from the target.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | X-axis offset |

##### Returns

`void`

***

### targetOffsetY

#### Get Signature

> **get** **targetOffsetY**(): `number`

Defined in: [src/camera/controller/FollowController.ts:444](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/controller/FollowController.ts#L444)


Gets the camera's Y-axis offset from the target.

##### Returns

`number`


Y-axis offset

#### Set Signature

> **set** **targetOffsetY**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:456](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/controller/FollowController.ts#L456)


Sets the camera's Y-axis offset from the target.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Y-axis offset |

##### Returns

`void`

***

### targetOffsetZ

#### Get Signature

> **get** **targetOffsetZ**(): `number`

Defined in: [src/camera/controller/FollowController.ts:469](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/controller/FollowController.ts#L469)


Gets the camera's Z-axis offset from the target.

##### Returns

`number`


Z-axis offset

#### Set Signature

> **set** **targetOffsetZ**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:481](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/controller/FollowController.ts#L481)


Sets the camera's Z-axis offset from the target.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Z-axis offset |

##### Returns

`void`

***

### tilt

#### Get Signature

> **get** **tilt**(): `number`

Defined in: [src/camera/controller/FollowController.ts:320](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/controller/FollowController.ts#L320)


Gets the camera's vertical rotation (tilt) angle around the target.

##### Returns

`number`


Tilt angle (in degrees, -89 ~ 89)

#### Set Signature

> **set** **tilt**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:332](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/controller/FollowController.ts#L332)


Sets the camera's vertical rotation (tilt) angle around the target.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Tilt angle (in degrees) |

##### Returns

`void`

***

### tiltInterpolation

#### Get Signature

> **get** **tiltInterpolation**(): `number`

Defined in: [src/camera/controller/FollowController.ts:345](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/controller/FollowController.ts#L345)


Gets the interpolation factor for the tilt value.

##### Returns

`number`


Tilt interpolation factor (0.01 ~ 1)

#### Set Signature

> **set** **tiltInterpolation**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:357](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/controller/FollowController.ts#L357)


Sets the interpolation factor for the tilt value.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Interpolation factor (0.01 ~ 1) |

##### Returns

`void`

## Methods

### checkKeyboardInput()

> **checkKeyboardInput**\<`T`\>(`view`, `keyNameMapper`): `boolean`

Defined in: [src/camera/core/AController.ts:283](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/core/AController.ts#L283)


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

Defined in: [src/camera/core/AController.ts:229](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/core/AController.ts#L229)


Destroys the controller and removes event listeners.

#### Returns

`void`

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`destroy`](../namespaces/Core/classes/AController.md#destroy)

***

### findTargetViewByInputEvent()

> **findTargetViewByInputEvent**(`e`): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:367](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/core/AController.ts#L367)

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

Defined in: [src/camera/core/AController.ts:330](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/core/AController.ts#L330)

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
| `x` | `number` | [src/camera/core/AController.ts:350](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/core/AController.ts#L350) |
| `y` | `number` | [src/camera/core/AController.ts:351](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/core/AController.ts#L351) |

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`getCanvasEventPoint`](../namespaces/Core/classes/AController.md#getcanvaseventpoint)

***

### setTargetOffset()

> **setTargetOffset**(`x`, `y`, `z`): `void`

Defined in: [src/camera/controller/FollowController.ts:530](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/controller/FollowController.ts#L530)


Sets the camera's target offset at once.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `x` | `number` | `undefined` | X-axis offset |
| `y` | `number` | `0` | Y-axis offset (default: 0) |
| `z` | `number` | `0` | Z-axis offset (default: 0) |

#### Returns

`void`

***

### update()

> **update**(`view`, `time`): `void`

Defined in: [src/camera/controller/FollowController.ts:550](https://github.com/redcamel/RedGPU/blob/6bb4d0646784423ce5d3379b392fbd3a57b282b8/src/camera/controller/FollowController.ts#L550)


Updates the camera's position and orientation every frame.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | The 3D view the camera belongs to |
| `time` | `number` | Current time (ms) |

#### Returns

`void`

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`update`](../namespaces/Core/classes/AController.md#update)
