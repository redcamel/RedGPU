[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / PerspectiveCamera

# Class: PerspectiveCamera

Defined in: [src/camera/camera/PerspectiveCamera.ts:24](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/PerspectiveCamera.ts#L24)

Perspective projection camera class that renders 3D scenes with distance-based depth perception.

***

### Example
```typescript
const camera = new RedGPU.Camera.PerspectiveCamera();
camera.setPosition(10, 5, 20);
camera.fieldOfView = 60;
camera.lookAt(0, 0, 0);
```

## See

[SingleView example](https://redcamel.github.io/RedGPU/examples/3d/view/singleView/)

## Extends

- [`ACamera`](../namespaces/Core/classes/ACamera.md)

## Extended by

- [`OrthographicCamera`](OrthographicCamera.md)

## Constructors



***

### Constructor

> **new PerspectiveCamera**(): `PerspectiveCamera`

Defined in: [src/camera/camera/PerspectiveCamera.ts:47](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/PerspectiveCamera.ts#L47)

Creates a PerspectiveCamera instance.

#### Example
```typescript
const camera = new RedGPU.Camera.PerspectiveCamera();
```

#### Returns

`PerspectiveCamera`

#### Overrides

[`ACamera`](../namespaces/Core/classes/ACamera.md).[`constructor`](../namespaces/Core/classes/ACamera.md#constructor)

## Accessors



***

### farClipping

#### Get Signature

> **get** **farClipping**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:144](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/PerspectiveCamera.ts#L144)

Gets or sets the far clipping plane distance.

##### Returns

`number`

Far clipping plane distance (default: `50000`)

#### Set Signature

> **set** **farClipping**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:148](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/PerspectiveCamera.ts#L148)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### fieldOfView

#### Get Signature

> **get** **fieldOfView**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:110](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/PerspectiveCamera.ts#L110)

Gets or sets the vertical field of view (FOV). (Unit: degrees)

##### Returns

`number`

Field of view (default: `60`)

#### Set Signature

> **set** **fieldOfView**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:114](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/PerspectiveCamera.ts#L114)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### nearClipping

#### Get Signature

> **get** **nearClipping**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:127](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/PerspectiveCamera.ts#L127)

Gets or sets the near clipping plane distance.

##### Returns

`number`

Near clipping plane distance (default: `0.1`)

#### Set Signature

> **set** **nearClipping**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:131](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/PerspectiveCamera.ts#L131)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### position

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **position**(): \[`number`, `number`, `number`\]

Defined in: [src/camera/camera/PerspectiveCamera.ts:227](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/PerspectiveCamera.ts#L227)

Returns the camera's 3D position coordinates.

##### Returns

\[`number`, `number`, `number`\]

`[x, y, z]` coordinate tuple

***

***

### rotationX

#### Get Signature

> **get** **rotationX**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:59](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/PerspectiveCamera.ts#L59)

Gets or sets the camera's X-axis rotation angle. (Unit: degrees)

##### Returns

`number`

X-axis rotation angle (default: `0`)

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:63](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/PerspectiveCamera.ts#L63)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### rotationY

#### Get Signature

> **get** **rotationY**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:76](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/PerspectiveCamera.ts#L76)

Gets or sets the camera's Y-axis rotation angle. (Unit: degrees)

##### Returns

`number`

Y-axis rotation angle (default: `0`)

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:80](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/PerspectiveCamera.ts#L80)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### rotationZ

#### Get Signature

> **get** **rotationZ**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:93](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/PerspectiveCamera.ts#L93)

Gets or sets the camera's Z-axis rotation angle. (Unit: degrees)

##### Returns

`number`

Z-axis rotation angle (default: `0`)

#### Set Signature

> **set** **rotationZ**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:97](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/PerspectiveCamera.ts#L97)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### viewMatrix

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **viewMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/camera/camera/PerspectiveCamera.ts:161](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/PerspectiveCamera.ts#L161)

Returns the view matrix.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

View matrix (`mat4`)

***

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:173](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/PerspectiveCamera.ts#L173)

Gets or sets the camera's X-axis coordinate.

##### Returns

`number`

X-axis coordinate (default: `0`)

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:177](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/PerspectiveCamera.ts#L177)

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

Defined in: [src/camera/camera/PerspectiveCamera.ts:191](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/PerspectiveCamera.ts#L191)

Gets or sets the camera's Y-axis coordinate.

##### Returns

`number`

Y-axis coordinate (default: `0`)

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:195](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/PerspectiveCamera.ts#L195)

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

> **get** **z**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:209](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/PerspectiveCamera.ts#L209)

Gets or sets the camera's Z-axis coordinate.

##### Returns

`number`

Z-axis coordinate (default: `0`)

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:213](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/PerspectiveCamera.ts#L213)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

## Methods



***

### lookAt()

> **lookAt**(`x`, `y`, `z`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:294](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/PerspectiveCamera.ts#L294)

Updates the view matrix so the camera looks at the specified world coordinates.

#### Example
```typescript
camera.lookAt(0, 0, 0);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | Target X-axis coordinate to look at |
| `y` | `number` | Target Y-axis coordinate to look at |
| `z` | `number` | Target Z-axis coordinate to look at |

#### Returns

`void`

***

***

### setPosition()

> **setPosition**(`x`, `y?`, `z?`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:254](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/PerspectiveCamera.ts#L254)

Sets the camera's 3D position.

#### Example
```typescript
camera.setPosition(10, 5, 20);
camera.setPosition([10, 5, 20]);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` \| \[`number`, `number`, `number`\] | X-axis coordinate or `[x, y, z]` array |
| `y?` | `number` | Y-axis coordinate (ignored if `x` is an array) |
| `z?` | `number` | Z-axis coordinate (ignored if `x` is an array) |

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
