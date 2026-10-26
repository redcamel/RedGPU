[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / FollowController

# Class: FollowController

Defined in: [src/camera/controller/FollowController.ts:32](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/FollowController.ts#L32)

Third-person camera controller class that smoothly tracks the movement and rotation of a specified target `Mesh`.

***

### Example
```typescript
const controller = new RedGPU.Camera.FollowController(redGPUContext, targetMesh);
controller.distance = 15;
controller.height = 8;
controller.pan = 45;
controller.tilt = 30;
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/controller/followController/" style="width:100%; height:500px;"></iframe>

## See

[FollowController example](https://redcamel.github.io/RedGPU/examples/3d/controller/followController/)

## Extends

- [`AController`](../namespaces/Core/classes/AController.md)

## Constructors



***

### Constructor

> **new FollowController**(`redGPUContext`, `targetMesh`): `FollowController`

Defined in: [src/camera/controller/FollowController.ts:76](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/FollowController.ts#L76)

Creates a FollowController instance.

#### Example
```typescript
const controller = new RedGPU.Camera.FollowController(redGPUContext, targetMesh);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `targetMesh` | [`Mesh`](../../Display/classes/Mesh.md) | Target `Mesh` instance to follow |

#### Returns

`FollowController`

#### Overrides

[`AController`](../namespaces/Core/classes/AController.md).[`constructor`](../namespaces/Core/classes/AController.md#constructor)

## Accessors



***

### distance

#### Get Signature

> **get** **distance**(): `number`

Defined in: [src/camera/controller/FollowController.ts:100](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/FollowController.ts#L100)

Gets or sets the target distance from the target mesh to the camera. (`0.1` or greater)

##### Returns

`number`

Target distance (default: `5`)

#### Set Signature

> **set** **distance**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:104](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/FollowController.ts#L104)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### distanceInterpolation

#### Get Signature

> **get** **distanceInterpolation**(): `number`

Defined in: [src/camera/controller/FollowController.ts:117](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/FollowController.ts#L117)

Gets or sets the damping interpolation factor for distance changes. (`0.01` ~ `1`)

##### Returns

`number`

Distance interpolation factor (default: `0.02`)

#### Set Signature

> **set** **distanceInterpolation**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:121](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/FollowController.ts#L121)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### followTargetRotation

#### Get Signature

> **get** **followTargetRotation**(): `boolean`

Defined in: [src/camera/controller/FollowController.ts:253](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/FollowController.ts#L253)

Gets or sets whether to rotate the camera's orbital reference axes along with the target mesh's rotation.

##### Returns

`boolean`

Whether target rotation tracking is enabled (default: `true`)

#### Set Signature

> **set** **followTargetRotation**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:257](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/FollowController.ts#L257)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### height

#### Get Signature

> **get** **height**(): `number`

Defined in: [src/camera/controller/FollowController.ts:134](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/FollowController.ts#L134)

Gets or sets the target height of the camera from the target mesh.

##### Returns

`number`

Target height (default: `1`)

#### Set Signature

> **set** **height**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:138](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/FollowController.ts#L138)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### heightInterpolation

#### Get Signature

> **get** **heightInterpolation**(): `number`

Defined in: [src/camera/controller/FollowController.ts:151](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/FollowController.ts#L151)

Gets or sets the damping interpolation factor for height changes. (`0.01` ~ `1`)

##### Returns

`number`

Height interpolation factor (default: `0.02`)

#### Set Signature

> **set** **heightInterpolation**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:155](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/FollowController.ts#L155)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### interpolation

#### Get Signature

> **get** **interpolation**(): `number`

Defined in: [src/camera/controller/FollowController.ts:236](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/FollowController.ts#L236)

Gets or sets the overall damping interpolation factor for camera position tracking. (`0.01` ~ `1`)

##### Returns

`number`

Position interpolation factor (default: `0.02`)

#### Set Signature

> **set** **interpolation**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:240](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/FollowController.ts#L240)

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

Defined in: [src/camera/controller/FollowController.ts:168](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/FollowController.ts#L168)

Gets or sets the camera's target horizontal rotation (Pan) angle around the target. (Unit: degrees)

##### Returns

`number`

Pan angle (default: `0`)

#### Set Signature

> **set** **pan**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:172](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/FollowController.ts#L172)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### panInterpolation

#### Get Signature

> **get** **panInterpolation**(): `number`

Defined in: [src/camera/controller/FollowController.ts:185](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/FollowController.ts#L185)

Gets or sets the damping interpolation factor for pan rotation. (`0.01` ~ `1`)

##### Returns

`number`

Pan interpolation factor (default: `0.02`)

#### Set Signature

> **set** **panInterpolation**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:189](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/FollowController.ts#L189)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### targetMesh

#### Get Signature

> **get** **targetMesh**(): [`Mesh`](../../Display/classes/Mesh.md)

Defined in: [src/camera/controller/FollowController.ts:320](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/FollowController.ts#L320)

Gets or sets the target mesh currently being followed.

##### Returns

[`Mesh`](../../Display/classes/Mesh.md)

Target `Mesh` instance

#### Set Signature

> **set** **targetMesh**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:324](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/FollowController.ts#L324)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`Mesh`](../../Display/classes/Mesh.md) |

##### Returns

`void`

***

***

### targetOffsetX

#### Get Signature

> **get** **targetOffsetX**(): `number`

Defined in: [src/camera/controller/FollowController.ts:269](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/FollowController.ts#L269)

Gets or sets the X-axis offset of the target point the camera looks at.

##### Returns

`number`

X-axis offset (default: `0`)

#### Set Signature

> **set** **targetOffsetX**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:273](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/FollowController.ts#L273)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### targetOffsetY

#### Get Signature

> **get** **targetOffsetY**(): `number`

Defined in: [src/camera/controller/FollowController.ts:286](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/FollowController.ts#L286)

Gets or sets the Y-axis offset of the target point the camera looks at.

##### Returns

`number`

Y-axis offset (default: `0`)

#### Set Signature

> **set** **targetOffsetY**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:290](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/FollowController.ts#L290)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### targetOffsetZ

#### Get Signature

> **get** **targetOffsetZ**(): `number`

Defined in: [src/camera/controller/FollowController.ts:303](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/FollowController.ts#L303)

Gets or sets the Z-axis offset of the target point the camera looks at.

##### Returns

`number`

Z-axis offset (default: `0`)

#### Set Signature

> **set** **targetOffsetZ**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:307](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/FollowController.ts#L307)

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

Defined in: [src/camera/controller/FollowController.ts:202](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/FollowController.ts#L202)

Gets or sets the camera's target vertical rotation (Tilt) angle around the target. (Unit: degrees, Range: `-89` ~ `89`)

##### Returns

`number`

Tilt angle (default: `15`)

#### Set Signature

> **set** **tilt**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:206](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/FollowController.ts#L206)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### tiltInterpolation

#### Get Signature

> **get** **tiltInterpolation**(): `number`

Defined in: [src/camera/controller/FollowController.ts:219](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/FollowController.ts#L219)

Gets or sets the damping interpolation factor for tilt rotation. (`0.01` ~ `1`)

##### Returns

`number`

Tilt interpolation factor (default: `0.02`)

#### Set Signature

> **set** **tiltInterpolation**(`value`): `void`

Defined in: [src/camera/controller/FollowController.ts:223](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/FollowController.ts#L223)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

## Methods



***

### setTargetOffset()

> **setTargetOffset**(`x`, `y?`, `z?`): `void`

Defined in: [src/camera/controller/FollowController.ts:350](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/FollowController.ts#L350)

Sets the 3-axis offset of the target point the camera looks at all at once.

#### Example
```typescript
controller.setTargetOffset(0, 2, 0);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `x` | `number` | `undefined` | X-axis offset |
| `y?` | `number` | `0` | Y-axis offset (default: `0`) |
| `z?` | `number` | `0` | Z-axis offset (default: `0`) |

#### Returns

`void`

***

***

### update()

> **update**(`view`, `time`): `void`

Defined in: [src/camera/controller/FollowController.ts:370](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/controller/FollowController.ts#L370)

Updates the follow camera's position and look-at direction every frame.

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

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

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

Defined in: [src/camera/core/AController.ts:86](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/AController.ts#L86)

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

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

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

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L56)

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

Defined in: [src/camera/core/AController.ts:134](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/AController.ts#L134)

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

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

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

Defined in: [src/camera/core/AController.ts:167](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/AController.ts#L167)

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

Defined in: [src/camera/core/AController.ts:146](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/AController.ts#L146)

Gets or sets the global active `View3D` holding keyboard input focus.

##### Returns

[`View3D`](../../Display/classes/View3D.md)

Keyboard-active `View3D` or `null`

#### Set Signature

> **set** **keyboardActiveView**(`value`): `void`

Defined in: [src/camera/core/AController.ts:150](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/AController.ts#L150)

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

Defined in: [src/camera/core/AController.ts:179](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/AController.ts#L179)

Gets or sets whether keyboard input has already been processed in the current frame.

##### Returns

`boolean`

Whether keyboard input has been processed this frame

#### Set Signature

> **set** **keyboardProcessedThisFrame**(`value`): `void`

Defined in: [src/camera/core/AController.ts:183](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/AController.ts#L183)

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

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L63)

Gets or sets the object name. Returns a default name (`ClassName Instance N`) if not explicitly set.

##### Returns

`string`

Object name string

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L70)

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

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

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

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

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

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L48)

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

Defined in: [src/camera/core/AController.ts:98](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/AController.ts#L98)

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

Defined in: [src/camera/core/AController.ts:110](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/AController.ts#L110)

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

Defined in: [src/camera/core/AController.ts:122](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/AController.ts#L122)

Returns the world Z coordinate of the controlled camera.

##### Returns

`number`

Camera world Z coordinate

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`z`](../namespaces/Core/classes/AController.md#z)

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### checkKeyboardInput()

> **checkKeyboardInput**\<`T`\>(`view`, `keyNameMapper`): `boolean`

Defined in: [src/camera/core/AController.ts:258](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/AController.ts#L258)

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

Defined in: [src/camera/core/AController.ts:191](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/AController.ts#L191)

Removes all canvas and window event listeners registered to the controller and clears internal references.

#### Returns

`void`

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`destroy`](../namespaces/Core/classes/AController.md#destroy)

***

***

### findTargetViewByInputEvent()

> **findTargetViewByInputEvent**(`e`): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/camera/core/AController.ts:332](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/AController.ts#L332)

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

Defined in: [src/camera/core/AController.ts:302](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/AController.ts#L302)

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
| `x` | `number` | [src/camera/core/AController.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/AController.ts#L48) |
| `y` | `number` | [src/camera/core/AController.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/camera/core/AController.ts#L48) |

#### Inherited from

[`AController`](../namespaces/Core/classes/AController.md).[`getCanvasEventPoint`](../namespaces/Core/classes/AController.md#getcanvaseventpoint)

***

</details>
