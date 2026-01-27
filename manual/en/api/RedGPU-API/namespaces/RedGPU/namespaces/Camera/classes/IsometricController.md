[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / IsometricController

# Class: IsometricController

Defined in: [src/camera/controller/IsometricController.ts:27](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L27)


Camera controller providing an isometric view.


Implements a fixed-angle quarter view, commonly used in strategy simulations or tile-based games, using orthographic projection without perspective distortion.

* ### Example
```typescript
const controller = new RedGPU.Camera.IsometricController(redGPUContext);
controller.viewHeight = 15;
controller.zoom = 1;
```
<iframe src="https://redcamel.github.io/RedGPU/examples/3d/controller/isometricController/"></iframe>

## Extends

- [`AController`](../namespaces/Core/classes/AController.md)

## Constructors

### Constructor

> **new IsometricController**(`redGPUContext`): `IsometricController`

Defined in: [src/camera/controller/IsometricController.ts:66](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L66)


IsometricController constructor

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`IsometricController`

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`constructor`](../namespaces/Core/classes/AController.md#constructor)

## Accessors

### camera

#### Get Signature

> **get** **camera**(): [`PerspectiveCamera`](PerspectiveCamera.md) \| [`OrthographicCamera`](OrthographicCamera.md)

Defined in: [src/camera/core/AController.ts:135](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/core/AController.ts#L135)


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

Defined in: [src/camera/core/AController.ts:149](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/core/AController.ts#L149)

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

Defined in: [src/camera/core/AController.ts:195](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/core/AController.ts#L195)

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

Defined in: [src/camera/core/AController.ts:162](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/core/AController.ts#L162)

**`Internal`**


Returns the View with active keyboard input.

##### Returns

[`View3D`](../../Display/classes/View3D.md)


Keyboard active View or null

#### Set Signature

> **set** **keyboardActiveView**(`value`): `void`

Defined in: [src/camera/core/AController.ts:175](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/core/AController.ts#L175)

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

Defined in: [src/camera/core/AController.ts:208](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/core/AController.ts#L208)

**`Internal`**


Returns whether keyboard input has already been processed in this frame.

##### Returns

`boolean`


Processing status

#### Set Signature

> **set** **keyboardProcessedThisFrame**(`value`): `void`

Defined in: [src/camera/core/AController.ts:221](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/core/AController.ts#L221)

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

> **get** **keyNameMapper**(): `object`

Defined in: [src/camera/controller/IsometricController.ts:398](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L398)


Gets the current key mapping configuration.

##### Returns

`object`


Copy of key mapping object

| Name | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ |
| `moveDown` | `string` | `'s'` | [src/camera/controller/IsometricController.ts:50](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L50) |
| `moveLeft` | `string` | `'a'` | [src/camera/controller/IsometricController.ts:51](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L51) |
| `moveRight` | `string` | `'d'` | [src/camera/controller/IsometricController.ts:52](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L52) |
| `moveUp` | `string` | `'w'` | [src/camera/controller/IsometricController.ts:49](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L49) |

***

### maxZoom

#### Get Signature

> **get** **maxZoom**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:219](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L219)


Gets the maximum zoom level.

##### Returns

`number`


Maximum zoom level

#### Set Signature

> **set** **maxZoom**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:231](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L231)


Sets the maximum zoom level.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Maximum zoom level (min 0.01) |

##### Returns

`void`

***

### minZoom

#### Get Signature

> **get** **minZoom**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:193](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L193)


Gets the minimum zoom level.

##### Returns

`number`


Minimum zoom level

#### Set Signature

> **set** **minZoom**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:205](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L205)


Sets the minimum zoom level.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Minimum zoom level (min 0.01) |

##### Returns

`void`

***

### mouseMoveSpeed

#### Get Signature

> **get** **mouseMoveSpeed**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:347](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L347)


Gets the mouse movement speed.

##### Returns

`number`


Mouse movement speed

#### Set Signature

> **set** **mouseMoveSpeed**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:359](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L359)


Sets the mouse movement speed.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Mouse movement speed (min 0.01) |

##### Returns

`void`

***

### mouseMoveSpeedInterpolation

#### Get Signature

> **get** **mouseMoveSpeedInterpolation**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:372](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L372)


Gets the mouse movement interpolation factor.

##### Returns

`number`


Mouse movement interpolation factor (0.01 ~ 1)

#### Set Signature

> **set** **mouseMoveSpeedInterpolation**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:384](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L384)


Sets the mouse movement interpolation factor. Lower values for smoother movement.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Interpolation factor (0.01 ~ 1) |

##### Returns

`void`

***

### moveSpeed

#### Get Signature

> **get** **moveSpeed**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:297](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L297)


Gets the keyboard movement speed.

##### Returns

`number`


Movement speed

#### Set Signature

> **set** **moveSpeed**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:309](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L309)


Sets the keyboard movement speed.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Movement speed (min 0.01) |

##### Returns

`void`

***

### moveSpeedInterpolation

#### Get Signature

> **get** **moveSpeedInterpolation**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:322](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L322)


Gets the keyboard movement interpolation factor.

##### Returns

`number`


Movement interpolation factor (0.01 ~ 1)

#### Set Signature

> **set** **moveSpeedInterpolation**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:334](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L334)


Sets the keyboard movement interpolation factor. Lower values for smoother movement.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Interpolation factor (0.01 ~ 1) |

##### Returns

`void`

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/camera/core/AController.ts:98](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/core/AController.ts#L98)


Returns the name of the controller.

##### Returns

`string`


Controller name

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/camera/core/AController.ts:111](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/core/AController.ts#L111)


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

### redGPUContext

#### Get Signature

> **get** **redGPUContext**(): [`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md)

Defined in: [src/camera/core/AController.ts:123](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/core/AController.ts#L123)


Returns the RedGPU context.

##### Returns

[`RedGPUContext`](../../RedGPUContext/classes/RedGPUContext.md)


RedGPU context

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`redGPUContext`](../namespaces/Core/classes/AController.md#redgpucontext)

***

### speedZoom

#### Get Signature

> **get** **speedZoom**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:168](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L168)


Gets the zoom speed.

##### Returns

`number`


Zoom speed

#### Set Signature

> **set** **speedZoom**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:180](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L180)


Sets the zoom speed. Higher values for faster zoom.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Zoom speed (min 0.01) |

##### Returns

`void`

***

### viewHeight

#### Get Signature

> **get** **viewHeight**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:246](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L246)


Gets the view height of the orthographic camera.

##### Returns

`number`


View height

#### Set Signature

> **set** **viewHeight**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:258](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L258)


Sets the view height of the orthographic camera.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | View height (min 0.1) |

##### Returns

`void`

***

### viewHeightInterpolation

#### Get Signature

> **get** **viewHeightInterpolation**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:271](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L271)


Gets the view height interpolation factor.

##### Returns

`number`


View height interpolation factor (0.01 ~ 1)

#### Set Signature

> **set** **viewHeightInterpolation**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:283](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L283)


Sets the view height interpolation factor. Lower values for smoother transition.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Interpolation factor (0.01 ~ 1) |

##### Returns

`void`

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:411](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L411)


Gets the target's X-axis position.

##### Returns

`number`


X-axis coordinate

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:423](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L423)


Gets the target's Y-axis position.

##### Returns

`number`


Y-axis coordinate

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:435](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L435)


Gets the target's Z-axis position.

##### Returns

`number`


Z-axis coordinate

***

### zoom

#### Get Signature

> **get** **zoom**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:117](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L117)


Gets the zoom level.

##### Returns

`number`


Zoom level (default: 1)

#### Set Signature

> **set** **zoom**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:129](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L129)


Sets the zoom level. Limited to minZoom ~ maxZoom range.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Zoom level value |

##### Returns

`void`

***

### zoomInterpolation

#### Get Signature

> **get** **zoomInterpolation**(): `number`

Defined in: [src/camera/controller/IsometricController.ts:143](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L143)


Gets the zoom interpolation factor.

##### Returns

`number`


Zoom interpolation factor (0.01 ~ 1)

#### Set Signature

> **set** **zoomInterpolation**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:155](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L155)


Sets the zoom interpolation factor. Lower values for smoother zoom.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Interpolation factor (0.01 ~ 1) |

##### Returns

`void`

## Methods

### checkKeyboardInput()

> **checkKeyboardInput**\<`T`\>(`view`, `keyNameMapper`): `boolean`

Defined in: [src/camera/core/AController.ts:283](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/core/AController.ts#L283)


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

Defined in: [src/camera/core/AController.ts:229](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/core/AController.ts#L229)


Destroys the controller and removes event listeners.

#### Returns

`void`

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`destroy`](../namespaces/Core/classes/AController.md#destroy)

***

### findTargetViewByInputEvent()

> **findTargetViewByInputEvent**(`e`): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:367](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/core/AController.ts#L367)

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

Defined in: [src/camera/core/AController.ts:330](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/core/AController.ts#L330)

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
| `x` | `number` | [src/camera/core/AController.ts:350](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/core/AController.ts#L350) |
| `y` | `number` | [src/camera/core/AController.ts:351](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/core/AController.ts#L351) |

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`getCanvasEventPoint`](../namespaces/Core/classes/AController.md#getcanvaseventpoint)

***

### setMoveDownKey()

> **setMoveDownKey**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:459](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L459)


Sets the move down key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Key name to set |

#### Returns

`void`

***

### setMoveLeftKey()

> **setMoveLeftKey**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:471](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L471)


Sets the move left key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Key name to set |

#### Returns

`void`

***

### setMoveRightKey()

> **setMoveRightKey**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:483](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L483)


Sets the move right key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Key name to set |

#### Returns

`void`

***

### setMoveUpKey()

> **setMoveUpKey**(`value`): `void`

Defined in: [src/camera/controller/IsometricController.ts:447](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L447)


Sets the move up key.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Key name to set |

#### Returns

`void`

***

### update()

> **update**(`view`, `time`): `void`

Defined in: [src/camera/controller/IsometricController.ts:499](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/camera/controller/IsometricController.ts#L499)


Updates the isometric camera every frame.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 3D view the camera belongs to |
| `time` | `number` | Current time (ms) |

#### Returns

`void`

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`update`](../namespaces/Core/classes/AController.md#update)
