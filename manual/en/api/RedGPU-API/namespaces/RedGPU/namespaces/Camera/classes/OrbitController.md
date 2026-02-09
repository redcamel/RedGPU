[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / OrbitController

# Class: OrbitController

Defined in: [src/camera/controller/OrbitController.ts:34](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/OrbitController.ts#L34)


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

Defined in: [src/camera/controller/OrbitController.ts:71](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/OrbitController.ts#L71)


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

### centerX

#### Get Signature

> **get** **centerX**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:105](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/OrbitController.ts#L105)


Gets the X-axis coordinate of the rotation center.

##### Returns

`number`


Center point X-axis coordinate

#### Set Signature

> **set** **centerX**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:117](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/OrbitController.ts#L117)


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

Defined in: [src/camera/controller/OrbitController.ts:129](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/OrbitController.ts#L129)


Gets the Y-axis coordinate of the rotation center.

##### Returns

`number`


Center point Y-axis coordinate

#### Set Signature

> **set** **centerY**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:141](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/OrbitController.ts#L141)


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

Defined in: [src/camera/controller/OrbitController.ts:153](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/OrbitController.ts#L153)


Gets the Z-axis coordinate of the rotation center.

##### Returns

`number`


Center point Z-axis coordinate

#### Set Signature

> **set** **centerZ**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:165](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/OrbitController.ts#L165)


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

Defined in: [src/camera/controller/OrbitController.ts:178](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/OrbitController.ts#L178)


Gets the distance from the center point to the camera.

##### Returns

`number`


Distance value

#### Set Signature

> **set** **distance**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:190](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/OrbitController.ts#L190)


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

Defined in: [src/camera/controller/OrbitController.ts:228](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/OrbitController.ts#L228)


Gets the distance interpolation factor.

##### Returns

`number`


Distance interpolation factor (0.01 ~ 1)

#### Set Signature

> **set** **distanceInterpolation**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:240](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/OrbitController.ts#L240)


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

### maxDistance

#### Get Signature

> **get** **maxDistance**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:278](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/OrbitController.ts#L278)


Gets the maximum zoom distance.

##### Returns

`number`


Maximum distance

#### Set Signature

> **set** **maxDistance**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:290](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/OrbitController.ts#L290)


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

Defined in: [src/camera/controller/OrbitController.ts:429](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/OrbitController.ts#L429)


Gets the maximum tilt angle.

##### Returns

`number`


Maximum tilt angle

#### Set Signature

> **set** **maxTilt**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:441](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/OrbitController.ts#L441)


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

Defined in: [src/camera/controller/OrbitController.ts:253](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/OrbitController.ts#L253)


Gets the minimum zoom distance.

##### Returns

`number`


Minimum distance

#### Set Signature

> **set** **minDistance**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:265](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/OrbitController.ts#L265)


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

Defined in: [src/camera/controller/OrbitController.ts:404](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/OrbitController.ts#L404)


Gets the minimum tilt angle.

##### Returns

`number`


Minimum tilt angle

#### Set Signature

> **set** **minTilt**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:416](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/OrbitController.ts#L416)


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

Defined in: [src/camera/controller/OrbitController.ts:355](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/OrbitController.ts#L355)


Gets the camera's pan (horizontal rotation) angle. (Unit: degrees)

##### Returns

`number`


Pan angle value

#### Set Signature

> **set** **pan**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:367](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/OrbitController.ts#L367)


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

> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/camera/core/AController.ts:126](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L126)


Returns the RedGPU context.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)


RedGPU context

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`redGPUContext`](../namespaces/Core/classes/AController.md#redgpucontext)

***

### rotationInterpolation

#### Get Signature

> **get** **rotationInterpolation**(): `number`

Defined in: [src/camera/controller/OrbitController.ts:329](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/OrbitController.ts#L329)


Gets the rotation interpolation factor.

##### Returns

`number`


Rotation interpolation factor (0.01 ~ 1)

#### Set Signature

> **set** **rotationInterpolation**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:341](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/OrbitController.ts#L341)


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

Defined in: [src/camera/controller/OrbitController.ts:203](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/OrbitController.ts#L203)


Gets the distance adjustment speed.

##### Returns

`number`


Distance change speed

#### Set Signature

> **set** **speedDistance**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:215](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/OrbitController.ts#L215)


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

Defined in: [src/camera/controller/OrbitController.ts:304](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/OrbitController.ts#L304)


Gets the rotation speed.

##### Returns

`number`


Rotation speed value

#### Set Signature

> **set** **speedRotation**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:316](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/OrbitController.ts#L316)


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

Defined in: [src/camera/controller/OrbitController.ts:379](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/OrbitController.ts#L379)


Gets the camera's tilt (vertical rotation) angle. (Unit: degrees, Range: -90 ~ 90)

##### Returns

`number`


Tilt angle value

#### Set Signature

> **set** **tilt**(`value`): `void`

Defined in: [src/camera/controller/OrbitController.ts:391](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/OrbitController.ts#L391)


Sets the camera's tilt (vertical rotation) angle. (Unit: degrees)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Tilt angle value (limited to -90 ~ 90 range) |

##### Returns

`void`

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/camera/core/AController.ts:150](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L150)


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

Defined in: [src/camera/core/AController.ts:162](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L162)


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

Defined in: [src/camera/core/AController.ts:174](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/core/AController.ts#L174)


Gets the camera's current world Z coordinate.

##### Returns

`number`


Z coordinate

#### Inherited from

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

### fitMeshToScreenCenter()

> **fitMeshToScreenCenter**(`mesh`, `view`): `void`

Defined in: [src/camera/controller/OrbitController.ts:474](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/OrbitController.ts#L474)


Automatically adjusts the camera distance so that the mesh fills the screen center.

### Example
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

### update()

> **update**(`view`, `time`): `void`

Defined in: [src/camera/controller/OrbitController.ts:542](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/controller/OrbitController.ts#L542)


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
