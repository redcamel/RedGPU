[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Camera](../../../README.md) / [Core](../README.md) / ACamera

# Abstract Class: ACamera

Defined in: [src/camera/core/ACamera.ts:20](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/ACamera.ts#L20)

Abstract base class for all cameras, managing physical exposure (EV100) calculations based on aperture, shutter speed, and ISO.

::: warning
This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
:::

## Extends

- [`BaseObject`](../../../../BaseObject/classes/BaseObject.md)

## Extended by

- [`PerspectiveCamera`](../../../classes/PerspectiveCamera.md)
- [`Camera2D`](../../../classes/Camera2D.md)

## Constructors



***

### Constructor

> **new ACamera**(): `ACamera`

Defined in: [src/base/BaseObject.ts:24](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L24)

Initializes a new BaseObject instance and assigns a per-class unique `instanceId`.

#### Returns

`ACamera`

#### Inherited from

[`BaseObject`](../../../../BaseObject/classes/BaseObject.md).[`constructor`](../../../../BaseObject/classes/BaseObject.md#constructor)

## Accessors



***

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

***

## Methods



***

### updateExposure()

> **updateExposure**(`view?`): `void`

Defined in: [src/camera/core/ACamera.ts:143](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/camera/core/ACamera.ts#L143)

Updates the `ev100` value based on auto exposure results or manual physical parameters (`aperture`, `shutterSpeed`, `iso`).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view?` | [`View3D`](../../../../Display/classes/View3D.md) | Optional `View3D` instance from which to read adapted auto exposure |

#### Returns

`void`

***

## Inherited Properties

<details>
<summary>View inherited properties (Click to expand)</summary>

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/base/BaseObject.ts#L36)

Returns the unique sequential instance ID assigned per class.

##### Returns

`number`

Per-class unique instance ID

#### Inherited from

[`BaseObject`](../../../../BaseObject/classes/BaseObject.md).[`instanceId`](../../../../BaseObject/classes/BaseObject.md#instanceid)

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

[`LakeWaveSimulator`](../../../../Water/namespaces/LakeCore/namespaces/Interaction/classes/LakeWaveSimulator.md).[`name`](../../../../Water/namespaces/LakeCore/namespaces/Interaction/classes/LakeWaveSimulator.md#name)

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

[`BaseObject`](../../../../BaseObject/classes/BaseObject.md).[`uuid`](../../../../BaseObject/classes/BaseObject.md#uuid)

</details>
