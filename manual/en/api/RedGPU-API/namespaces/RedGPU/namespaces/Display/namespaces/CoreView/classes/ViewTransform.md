[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreView](../README.md) / ViewTransform

# Class: ViewTransform

Defined in: [src/display/view/core/ViewTransform.ts:23](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L23)

Base class that manages the position, size, and camera projection matrix of a view.

::: warning
This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extends

- [`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md)

## Extended by

- [`AView`](AView.md)

## Constructors



***

### Constructor

> **new ViewTransform**(`redGPUContext`): `ViewTransform`

Defined in: [src/display/view/core/ViewTransform.ts:52](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L52)

Creates a ViewTransform instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |

#### Returns

`ViewTransform`

#### Overrides

[`RedGPUObject`](../../../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../../../BaseObject/classes/RedGPUObject.md#constructor)

## Properties



***

### onResize

> **onResize**: (`event`) => `void` = `null`

Defined in: [src/display/view/core/ViewTransform.ts:28](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L28)

Callback function invoked when the view size changes

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `event` | `RedResizeEvent`\<`ViewTransform`\> |

#### Returns

`void`

## Accessors



***

### aspect

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **aspect**(): `number`

Defined in: [src/display/view/core/ViewTransform.ts:196](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L196)

Returns the aspect ratio (width / height) of the viewport.

##### Returns

`number`

Viewport aspect ratio

***

***

### camera

#### Get Signature

> **get** **camera**(): [`Camera2D`](../../../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../../../Camera/namespaces/Core/classes/AController.md)

Defined in: [src/display/view/core/ViewTransform.ts:65](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L65)

Gets or sets the camera or controller connected to the current view.

##### Returns

[`Camera2D`](../../../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../../../Camera/namespaces/Core/classes/AController.md)

Connected camera or controller instance

#### Set Signature

> **set** **camera**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:69](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L69)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`Camera2D`](../../../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../../Camera/classes/OrthographicCamera.md) \| [`AController`](../../../../Camera/namespaces/Core/classes/AController.md) |

##### Returns

`void`

***

***

### frustumPlanes

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **frustumPlanes**(): `number`[][]

Defined in: [src/display/view/core/ViewTransform.ts:208](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L208)

Returns the array of 6 view frustum planes calculated from the current projection and view matrices.

##### Returns

`number`[][]

Frustum planes array

***

***

### frustumPlanesFlat

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **frustumPlanesFlat**(): `Float32Array`

Defined in: [src/display/view/core/ViewTransform.ts:221](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L221)

Returns the 1D flattened frustum planes buffer (`Float32Array(24)`) calculated from the current projection and view matrices.

##### Returns

`Float32Array`

1D frustum planes buffer of 24 floats

***

***

### height

#### Get Signature

> **get** **height**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:134](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L134)

Gets or sets the height (pixels or percentage string) of the view.

##### Returns

`string` \| `number`

Height of the view

#### Set Signature

> **set** **height**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:138](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L138)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` \| `number` |

##### Returns

`void`

***

***

### inverseProjectionMatrix

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **inverseProjectionMatrix**(): [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:321](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L321)

Computes and returns the inverse of the current projection matrix.

##### Returns

[`mat4`](../../../../Math/type-aliases/mat4.md)

Inverse projection matrix

***

***

### jitterOffset

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **jitterOffset**(): \[`number`, `number`\]

Defined in: [src/display/view/core/ViewTransform.ts:333](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L333)

Returns the currently applied pixel jitter offset (`[offsetX, offsetY]`).

##### Returns

\[`number`, `number`\]

Jitter offset tuple

***

***

### noneJitterProjectionMatrix

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **noneJitterProjectionMatrix**(): [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:246](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L246)

Returns the original projection matrix without TAA jitter applied.

##### Returns

[`mat4`](../../../../Math/type-aliases/mat4.md)

Projection matrix without jitter

***

***

### pixelRectArray

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pixelRectArray**(): \[`number`, `number`, `number`, `number`\]

Defined in: [src/display/view/core/ViewTransform.ts:150](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L150)

Returns the rectangle array in physical pixels (`[x, y, width, height]`).

##### Returns

\[`number`, `number`, `number`, `number`\]

Physical pixel rectangle array

***

***

### pixelRectObject

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **pixelRectObject**(): `object`

Defined in: [src/display/view/core/ViewTransform.ts:162](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L162)

Returns the rectangle information object in physical pixels (`{ x, y, width, height }`).

##### Returns

`object`

Physical pixel rectangle object

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [src/display/view/core/ViewTransform.ts:167](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L167) |
| `width` | `number` | [src/display/view/core/ViewTransform.ts:166](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L166) |
| `x` | `number` | [src/display/view/core/ViewTransform.ts:164](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L164) |
| `y` | `number` | [src/display/view/core/ViewTransform.ts:165](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L165) |

***

***

### projectionMatrix

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **projectionMatrix**(): [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/view/core/ViewTransform.ts:295](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L295)

Returns the final projection matrix reflecting the jitter offset depending on whether TAA is enabled.

##### Returns

[`mat4`](../../../../Math/type-aliases/mat4.md)

Final projection matrix

***

***

### rawCamera

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **rawCamera**(): [`Camera2D`](../../../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../../Camera/classes/OrthographicCamera.md)

Defined in: [src/display/view/core/ViewTransform.ts:234](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L234)

Returns the raw camera instance used for actual rendering. (Returns the controlled camera if an `AController` is connected)

##### Returns

[`Camera2D`](../../../../Camera/classes/Camera2D.md) \| [`PerspectiveCamera`](../../../../Camera/classes/PerspectiveCamera.md) \| [`OrthographicCamera`](../../../../Camera/classes/OrthographicCamera.md)

Raw camera instance

***

***

### screenRectObject

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **screenRectObject**(): `object`

Defined in: [src/display/view/core/ViewTransform.ts:179](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L179)

Returns the CSS screen-relative rectangle information object scaled by `devicePixelRatio`.

##### Returns

`object`

Screen-relative rectangle object

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `height` | `number` | [src/display/view/core/ViewTransform.ts:184](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L184) |
| `width` | `number` | [src/display/view/core/ViewTransform.ts:183](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L183) |
| `x` | `number` | [src/display/view/core/ViewTransform.ts:181](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L181) |
| `y` | `number` | [src/display/view/core/ViewTransform.ts:182](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L182) |

***

***

### width

#### Get Signature

> **get** **width**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:118](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L118)

Gets or sets the width (pixels or percentage string) of the view.

##### Returns

`string` \| `number`

Width of the view

#### Set Signature

> **set** **width**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:122](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L122)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` \| `number` |

##### Returns

`void`

***

***

### x

#### Get Signature

> **get** **x**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:86](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L86)

Gets or sets the X coordinate (pixels or percentage string) of the view.

##### Returns

`string` \| `number`

X coordinate of the view

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:90](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L90)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` \| `number` |

##### Returns

`void`

***

***

### y

#### Get Signature

> **get** **y**(): `string` \| `number`

Defined in: [src/display/view/core/ViewTransform.ts:102](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L102)

Gets or sets the Y coordinate (pixels or percentage string) of the view.

##### Returns

`string` \| `number`

Y coordinate of the view

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:106](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L106)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` \| `number` |

##### Returns

`void`

## Methods



***

### clearJitterOffset()

> **clearJitterOffset**(): `void`

Defined in: [src/display/view/core/ViewTransform.ts:357](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L357)

Resets the jitter offset to `[0, 0]`.

#### Returns

`void`

***

***

### setJitterOffset()

> **setJitterOffset**(`offsetX`, `offsetY`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:348](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L348)

Sets the sub-pixel jitter offset for TAA calculations.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `offsetX` | `number` | X-axis jitter offset |
| `offsetY` | `number` | Y-axis jitter offset |

#### Returns

`void`

***

***

### setPosition()

> **setPosition**(`x?`, `y?`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:380](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L380)

Sets the position (X, Y) of the view and updates the physical pixel rectangle coordinates.

#### Example
```typescript
// Set view position in pixels or percentage
view.setPosition(100, '50%');
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x?` | `string` \| `number` | X coordinate (pixel number or percentage string) |
| `y?` | `string` \| `number` | Y coordinate (pixel number or percentage string) |

#### Returns

`void`

***

***

### setSize()

> **setSize**(`w?`, `h?`): `void`

Defined in: [src/display/view/core/ViewTransform.ts:411](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/view/core/ViewTransform.ts#L411)

Sets the size (width, height) of the view, updates the physical pixel rectangle, and invokes the `onResize` callback if registered.

#### Example
```typescript
// Set view size in pixels or percentage
view.setSize('100%', '100%');
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `w?` | `string` \| `number` | Width (pixel number or percentage string) |
| `h?` | `string` \| `number` | Height (pixel number or percentage string) |

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
