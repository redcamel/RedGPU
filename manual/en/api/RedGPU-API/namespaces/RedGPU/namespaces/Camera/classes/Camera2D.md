[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / Camera2D

# Class: Camera2D

Defined in: [src/camera/camera/Camera2D.ts:26](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/Camera2D.ts#L26)

Camera class that renders objects based on a 2D planar coordinate system. Automatically created internally when `View2D` is instantiated.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

***

### Example
```typescript
// Correct access method
const view = new RedGPU.Display.View2D(redGPUContext, scene);
const camera = view.camera;
camera.setPosition(100, 50);
```

## See

[MultiView with 2D/3D example](https://redcamel.github.io/RedGPU/examples/2d/view/multiViewWith3D/)

## Extends

- [`ACamera`](../namespaces/Core/classes/ACamera.md)

## Constructors



***

### Constructor

> **new Camera2D**(): `Camera2D`

Defined in: [src/camera/camera/Camera2D.ts:37](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/Camera2D.ts#L37)

Creates a Camera2D instance.

#### Returns

`Camera2D`

#### Overrides

[`ACamera`](../namespaces/Core/classes/ACamera.md).[`constructor`](../namespaces/Core/classes/ACamera.md#constructor)

## Accessors



***

### position

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **position**(): \[`number`, `number`\]

Defined in: [src/camera/camera/Camera2D.ts:109](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/Camera2D.ts#L109)

Returns the camera's 2D position coordinates.

##### Returns

\[`number`, `number`\]

`[x, y]` coordinate tuple

***

***

### viewMatrix

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **viewMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/camera/camera/Camera2D.ts:49](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/Camera2D.ts#L49)

Returns the view matrix.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

View matrix (`mat4`)

***

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/camera/camera/Camera2D.ts:73](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/Camera2D.ts#L73)

Gets or sets the camera's X-axis coordinate.

##### Returns

`number`

X-axis coordinate (default: `0`)

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/camera/camera/Camera2D.ts:77](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/Camera2D.ts#L77)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/camera/camera/Camera2D.ts:91](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/Camera2D.ts#L91)

Gets or sets the camera's Y-axis coordinate.

##### Returns

`number`

Y-axis coordinate (default: `0`)

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/camera/camera/Camera2D.ts:95](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/Camera2D.ts#L95)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### z

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **z**(): `number`

Defined in: [src/camera/camera/Camera2D.ts:61](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/Camera2D.ts#L61)

Returns the camera's Z-axis coordinate. (Always maintained at `0` in a 2D environment)

##### Returns

`number`

Z-axis coordinate (`0`)

## Methods



***

### setPosition()

> **setPosition**(`x`, `y?`): `void`

Defined in: [src/camera/camera/Camera2D.ts:132](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/Camera2D.ts#L132)

Sets the camera's 2D position.

#### Example
```typescript
camera.setPosition(100, 200);
camera.setPosition([100, 200, 0]);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` \| \[`number`, `number`, `number`\] | X-axis coordinate or `[x, y, z]` array |
| `y?` | `number` | Y-axis coordinate (ignored if `x` is an array) |

#### Returns

`void`

***

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### aperture

#### Get Signature

> **get** **aperture**(): `number`

Defined in: [src/camera/core/ACamera.ts:86](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/ACamera.ts#L86)

Gets or sets the aperture (f-stop) value. (Positive number, Default: `16.0`)

##### Returns

`number`

Aperture (f-stop) value

#### Set Signature

> **set** **aperture**(`value`): `void`

Defined in: [src/camera/core/ACamera.ts:90](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/ACamera.ts#L90)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ACamera`](../namespaces/Core/classes/ACamera.md).[`aperture`](../namespaces/Core/classes/ACamera.md#aperture)

***

***

### ev100

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **ev100**(): `number`

Defined in: [src/camera/core/ACamera.ts:73](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/ACamera.ts#L73)

Returns the physical exposure value at ISO 100 (EV100).

##### Returns

`number`

EV100 value

#### Inherited from

[`ACamera`](../namespaces/Core/classes/ACamera.md).[`ev100`](../namespaces/Core/classes/ACamera.md#ev100)

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

[`ACamera`](../namespaces/Core/classes/ACamera.md).[`instanceId`](../namespaces/Core/classes/ACamera.md#instanceid)

***

***

### iso

#### Get Signature

> **get** **iso**(): `number`

Defined in: [src/camera/core/ACamera.ts:124](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/ACamera.ts#L124)

Gets or sets the sensor sensitivity (ISO). (Positive number, Default: `100`)

##### Returns

`number`

ISO sensitivity value

#### Set Signature

> **set** **iso**(`value`): `void`

Defined in: [src/camera/core/ACamera.ts:128](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/ACamera.ts#L128)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ACamera`](../namespaces/Core/classes/ACamera.md).[`iso`](../namespaces/Core/classes/ACamera.md#iso)

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

[`LakeWaveSimulator`](../../Water/namespaces/LakeCore/namespaces/Interaction/classes/LakeWaveSimulator.md).[`name`](../../Water/namespaces/LakeCore/namespaces/Interaction/classes/LakeWaveSimulator.md#name)

***

***

### shutterSpeed

#### Get Signature

> **get** **shutterSpeed**(): `number`

Defined in: [src/camera/core/ACamera.ts:105](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/ACamera.ts#L105)

Gets or sets the shutter speed in seconds. (Positive number, Default: `1 / 3200`)

##### Returns

`number`

Shutter speed in seconds

#### Set Signature

> **set** **shutterSpeed**(`value`): `void`

Defined in: [src/camera/core/ACamera.ts:109](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/ACamera.ts#L109)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ACamera`](../namespaces/Core/classes/ACamera.md).[`shutterSpeed`](../namespaces/Core/classes/ACamera.md#shutterspeed)

***

***

### useAutoExposure

#### Get Signature

> **get** **useAutoExposure**(): `boolean`

Defined in: [src/camera/core/ACamera.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/ACamera.ts#L36)

Gets or sets whether auto exposure is enabled. When switched to `false`, fixes ISO to 100 and snaps shutter speed to the nearest standard stop to preserve the current EV100. (Default: `true`)

##### Returns

`boolean`

Whether auto exposure is enabled

#### Set Signature

> **set** **useAutoExposure**(`value`): `void`

Defined in: [src/camera/core/ACamera.ts:40](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/ACamera.ts#L40)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

#### Inherited from

[`ACamera`](../namespaces/Core/classes/ACamera.md).[`useAutoExposure`](../namespaces/Core/classes/ACamera.md#useautoexposure)

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

[`ACamera`](../namespaces/Core/classes/ACamera.md).[`uuid`](../namespaces/Core/classes/ACamera.md#uuid)

***

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

### updateExposure()

> **updateExposure**(`view?`): `void`

Defined in: [src/camera/core/ACamera.ts:143](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/ACamera.ts#L143)

Updates the `ev100` value based on auto exposure results or manual physical parameters (`aperture`, `shutterSpeed`, `iso`).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view?` | [`View3D`](../../Display/classes/View3D.md) | Optional `View3D` instance from which to read adapted auto exposure |

#### Returns

`void`

#### Inherited from

[`ACamera`](../namespaces/Core/classes/ACamera.md).[`updateExposure`](../namespaces/Core/classes/ACamera.md#updateexposure)

</details>
