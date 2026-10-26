[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / OrthographicCamera

# Class: OrthographicCamera

Defined in: [src/camera/camera/OrthographicCamera.ts:21](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/OrthographicCamera.ts#L21)

Orthographic projection camera class that renders objects at a constant size without distance-based perspective distortion.

***

### Example
```typescript
const camera = new RedGPU.Camera.OrthographicCamera();
camera.top = 10;
camera.bottom = -10;
camera.left = -20;
camera.right = 20;
```

## See

[IsometricController example](https://redcamel.github.io/RedGPU/examples/3d/controller/isometricController/)

## Extends

- [`PerspectiveCamera`](PerspectiveCamera.md)

## Constructors



***

### Constructor

> **new OrthographicCamera**(): `OrthographicCamera`

Defined in: [src/camera/camera/OrthographicCamera.ts:39](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/OrthographicCamera.ts#L39)

Creates an OrthographicCamera instance.

#### Example
```typescript
const camera = new RedGPU.Camera.OrthographicCamera();
```

#### Returns

`OrthographicCamera`

#### Overrides

[`PerspectiveCamera`](PerspectiveCamera.md).[`constructor`](PerspectiveCamera.md#constructor)

## Accessors



***

### bottom

#### Get Signature

> **get** **bottom**(): `number`

Defined in: [src/camera/camera/OrthographicCamera.ts:70](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/OrthographicCamera.ts#L70)

Gets or sets the bottom boundary value of the orthographic projection volume.

##### Returns

`number`

Bottom boundary value (default: `-1`)

#### Set Signature

> **set** **bottom**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:74](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/OrthographicCamera.ts#L74)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### left

#### Get Signature

> **get** **left**(): `number`

Defined in: [src/camera/camera/OrthographicCamera.ts:87](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/OrthographicCamera.ts#L87)

Gets or sets the left boundary value of the orthographic projection volume.

##### Returns

`number`

Left boundary value (default: `-1`)

#### Set Signature

> **set** **left**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:91](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/OrthographicCamera.ts#L91)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### maxZoom

#### Get Signature

> **get** **maxZoom**(): `number`

Defined in: [src/camera/camera/OrthographicCamera.ts:155](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/OrthographicCamera.ts#L155)

Gets or sets the maximum zoom scale. (`0.01` or greater)

##### Returns

`number`

Maximum zoom scale (default: `10`)

#### Set Signature

> **set** **maxZoom**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:159](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/OrthographicCamera.ts#L159)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### minZoom

#### Get Signature

> **get** **minZoom**(): `number`

Defined in: [src/camera/camera/OrthographicCamera.ts:138](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/OrthographicCamera.ts#L138)

Gets or sets the minimum zoom scale. (`0.01` or greater)

##### Returns

`number`

Minimum zoom scale (default: `0.1`)

#### Set Signature

> **set** **minZoom**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:142](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/OrthographicCamera.ts#L142)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### right

#### Get Signature

> **get** **right**(): `number`

Defined in: [src/camera/camera/OrthographicCamera.ts:104](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/OrthographicCamera.ts#L104)

Gets or sets the right boundary value of the orthographic projection volume.

##### Returns

`number`

Right boundary value (default: `1`)

#### Set Signature

> **set** **right**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:108](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/OrthographicCamera.ts#L108)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### top

#### Get Signature

> **get** **top**(): `number`

Defined in: [src/camera/camera/OrthographicCamera.ts:53](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/OrthographicCamera.ts#L53)

Gets or sets the top boundary value of the orthographic projection volume.

##### Returns

`number`

Top boundary value (default: `1`)

#### Set Signature

> **set** **top**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:57](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/OrthographicCamera.ts#L57)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

***

### zoom

#### Get Signature

> **get** **zoom**(): `number`

Defined in: [src/camera/camera/OrthographicCamera.ts:121](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/OrthographicCamera.ts#L121)

Gets or sets the zoom scale. (`minZoom` ~ `maxZoom`)

##### Returns

`number`

Zoom scale (default: `1`)

#### Set Signature

> **set** **zoom**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:125](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/OrthographicCamera.ts#L125)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

## Methods



***

### setZoom()

> **setZoom**(`zoom`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:177](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/camera/OrthographicCamera.ts#L177)

Sets the camera's zoom scale.

#### Example
```typescript
camera.setZoom(2.0);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `zoom` | `number` | Zoom scale to set (`minZoom` ~ `maxZoom`) |

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

[`PerspectiveCamera`](PerspectiveCamera.md).[`aperture`](PerspectiveCamera.md#aperture)

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

[`PerspectiveCamera`](PerspectiveCamera.md).[`ev100`](PerspectiveCamera.md#ev100)

***

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

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`farClipping`](PerspectiveCamera.md#farclipping)

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

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`fieldOfView`](PerspectiveCamera.md#fieldofview)

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

[`PerspectiveCamera`](PerspectiveCamera.md).[`instanceId`](PerspectiveCamera.md#instanceid)

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

[`PerspectiveCamera`](PerspectiveCamera.md).[`iso`](PerspectiveCamera.md#iso)

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

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`nearClipping`](PerspectiveCamera.md#nearclipping)

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

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`position`](PerspectiveCamera.md#position)

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

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`rotationX`](PerspectiveCamera.md#rotationx)

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

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`rotationY`](PerspectiveCamera.md#rotationy)

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

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`rotationZ`](PerspectiveCamera.md#rotationz)

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

[`PerspectiveCamera`](PerspectiveCamera.md).[`shutterSpeed`](PerspectiveCamera.md#shutterspeed)

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

[`PerspectiveCamera`](PerspectiveCamera.md).[`useAutoExposure`](PerspectiveCamera.md#useautoexposure)

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

[`PerspectiveCamera`](PerspectiveCamera.md).[`uuid`](PerspectiveCamera.md#uuid)

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

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`viewMatrix`](PerspectiveCamera.md#viewmatrix)

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

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`x`](PerspectiveCamera.md#x)

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

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`y`](PerspectiveCamera.md#y)

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

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`z`](PerspectiveCamera.md#z)

***

</details>


***

## Inherited Methods

<details>
<summary>View inherited methods (Click to expand)</summary>

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

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`lookAt`](PerspectiveCamera.md#lookat)

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

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`setPosition`](PerspectiveCamera.md#setposition)

***

***

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

[`PerspectiveCamera`](PerspectiveCamera.md).[`updateExposure`](PerspectiveCamera.md#updateexposure)

</details>
