[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / OrbitController

# Class: OrbitController

Defined in: [src/camera/controller/OrbitController.ts:33](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/OrbitController.ts#L33)


Orbital camera controller that rotates around a specific point.


Primarily used for product modeling viewers or observing 3D objects, allowing the user to inspect the target from various angles via zoom, rotation, and pan operations around a center point.

* ### Example
```typescript
const controller = new RedGPU.Camera.OrbitController(redGPUContext);
controller.centerX = 0;
controller.centerY = 0;
controller.centerZ = 0;
controller.distance = 20;
controller.tilt = -30;
controller.pan = 45;
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/controller/orbitController/"></iframe>

## Extends

- [`AController`](../namespaces/Core/classes/AController.md)

## Constructors

### Constructor

> **new OrbitController**(`redGPUContext`): `OrbitController`

Defined in: [src/camera/controller/OrbitController.ts:55](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/OrbitController.ts#L55)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md) |

#### Returns

`OrbitController`

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

[`AController`](../namespaces/Core/classes/AController.md).[`camera`](../namespaces/Core/classes/AController.md#camera)

***

### centerX

#### Get Signature

> **get** **centerX**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:83](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/OrbitController.ts#L83)


Gets the X-axis coordinate of the rotation center.

##### Returns

`number`


Center point X-axis coordinate

#### Set Signature

> **set** **centerX**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:95](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/OrbitController.ts#L95)


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

Defined in: [src/camera/controller/OrbitController.ts:107](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/OrbitController.ts#L107)


Gets the Y-axis coordinate of the rotation center.

##### Returns

`number`


Center point Y-axis coordinate

#### Set Signature

> **set** **centerY**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:119](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/OrbitController.ts#L119)


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

Defined in: [src/camera/controller/OrbitController.ts:131](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/OrbitController.ts#L131)


Gets the Z-axis coordinate of the rotation center.

##### Returns

`number`


Center point Z-axis coordinate

#### Set Signature

> **set** **centerZ**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:143](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/OrbitController.ts#L143)


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

Defined in: [src/camera/controller/OrbitController.ts:156](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/OrbitController.ts#L156)


Gets the distance from the center point to the camera.

##### Returns

`number`


Distance value

#### Set Signature

> **set** **distance**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:168](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/OrbitController.ts#L168)


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

Defined in: [src/camera/controller/OrbitController.ts:206](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/OrbitController.ts#L206)


Gets the distance interpolation factor.

##### Returns

`number`


Distance interpolation factor (0.01 ~ 1)

#### Set Signature

> **set** **distanceInterpolation**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:218](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/OrbitController.ts#L218)


Sets the distance interpolation factor. Lower values for smoother zoom movement.

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

### maxTilt

#### Get Signature

> **get** **maxTilt**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:357](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/OrbitController.ts#L357)


Gets the maximum tilt angle.

##### Returns

`number`


Maximum tilt angle

#### Set Signature

> **set** **maxTilt**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:369](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/OrbitController.ts#L369)


Sets the maximum tilt angle.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Maximum tilt angle (-90 ~ 90) |

##### Returns

`void`

***

### minTilt

#### Get Signature

> **get** **minTilt**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:332](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/OrbitController.ts#L332)


Gets the minimum tilt angle.

##### Returns

`number`


Minimum tilt angle

#### Set Signature

> **set** **minTilt**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:344](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/OrbitController.ts#L344)


Sets the minimum tilt angle.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Minimum tilt angle (-90 ~ 90) |

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

Defined in: [src/camera/controller/OrbitController.ts:283](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/OrbitController.ts#L283)


Gets the camera's pan (horizontal rotation) angle. (Unit: degrees)

##### Returns

`number`


Pan angle value

#### Set Signature

> **set** **pan**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:295](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/OrbitController.ts#L295)


Sets the camera's pan (horizontal rotation) angle. (Unit: degrees)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Pan angle value |

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

### rotationInterpolation

#### Get Signature

> **get** **rotationInterpolation**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:257](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/OrbitController.ts#L257)


Gets the rotation interpolation factor.

##### Returns

`number`


Rotation interpolation factor (0.01 ~ 1)

#### Set Signature

> **set** **rotationInterpolation**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:269](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/OrbitController.ts#L269)


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

Defined in: [src/camera/controller/OrbitController.ts:181](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/OrbitController.ts#L181)


Gets the distance adjustment speed.

##### Returns

`number`


Distance change speed

#### Set Signature

> **set** **speedDistance**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:193](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/OrbitController.ts#L193)


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

Defined in: [src/camera/controller/OrbitController.ts:232](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/OrbitController.ts#L232)


Gets the rotation speed.

##### Returns

`number`


Rotation speed value

#### Set Signature

> **set** **speedRotation**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:244](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/OrbitController.ts#L244)


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

Defined in: [src/camera/controller/OrbitController.ts:307](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/OrbitController.ts#L307)


Gets the camera's tilt (vertical rotation) angle. (Unit: degrees, Range: -90 ~ 90)

##### Returns

`number`


Tilt angle value

#### Set Signature

> **set** **tilt**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:319](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/OrbitController.ts#L319)


Sets the camera's tilt (vertical rotation) angle. (Unit: degrees)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Tilt angle value (limited to -90 ~ 90 range) |

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

### fitMeshToScreenCenter()

> **fitMeshToScreenCenter**(`mesh`, `view`): `void`

Defined in: [src/camera/controller/OrbitController.ts:390](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/OrbitController.ts#L390)


Automatically adjusts the camera distance so that the mesh fills the screen center.

* ### Example
```typescript
controller.fitMeshToScreenCenter(mesh, view);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `mesh` | [`Mesh`](../../Display/classes/Mesh.md) | Target mesh to fit to the screen |
| `view` | [`View3D`](../../Display/classes/View3D.md) | Current view instance |

#### Returns

`void`

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

### update()

> **update**(`view`, `time`): `void`

Defined in: [src/camera/controller/OrbitController.ts:458](https://github.com/redcamel/RedGPU/blob/bc0b7b6061658e08f23e4af6ea5619ae59f524b4/src/camera/controller/OrbitController.ts#L458)


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
