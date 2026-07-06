[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / PerspectiveCamera

# Class: PerspectiveCamera

Defined in: [src/camera/camera/PerspectiveCamera.ts:23](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/camera/PerspectiveCamera.ts#L23)

Camera that uses perspective projection.

Provides perspective where object sizes vary based on distance, similar to the human eye or a camera lens. It is used by default for rendering depth-filled scenes in a 3D environment.

### Example
```typescript
const camera = new RedGPU.PerspectiveCamera();
camera.x = 10;
camera.y = 5;
camera.z = 20;
camera.fieldOfView = 75;
camera.lookAt(0, 0, 0);
```

## Extends

- [`ACamera`](../namespaces/Core/classes/ACamera.md)

## Extended by

- [`OrthographicCamera`](OrthographicCamera.md)

## Constructors

### Constructor

> **new PerspectiveCamera**(): `PerspectiveCamera`

Defined in: [src/camera/camera/PerspectiveCamera.ts:99](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/camera/PerspectiveCamera.ts#L99)

Creates an instance of PerspectiveCamera.

### Example
```typescript
const camera = new RedGPU.PerspectiveCamera();
```

#### Returns

`PerspectiveCamera`

#### Overrides

[`ACamera`](../namespaces/Core/classes/ACamera.md).[`constructor`](../namespaces/Core/classes/ACamera.md#constructor)

## Properties

### farClipping

#### Get Signature

> **get** **farClipping**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:233](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/camera/PerspectiveCamera.ts#L233)

Returns the far clipping distance.

##### Returns

`number`

Far clipping distance

#### Set Signature

> **set** **farClipping**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:245](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/camera/PerspectiveCamera.ts#L245)

Sets the far clipping distance.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Far clipping distance to set |

##### Returns

`void`

***

### fieldOfView

#### Get Signature

> **get** **fieldOfView**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:183](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/camera/PerspectiveCamera.ts#L183)

Returns the field of view. (degrees)

##### Returns

`number`

Field of view

#### Set Signature

> **set** **fieldOfView**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:195](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/camera/PerspectiveCamera.ts#L195)

Sets the field of view. (degrees)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Field of view to set |

##### Returns

`void`

***

### nearClipping

#### Get Signature

> **get** **nearClipping**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:208](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/camera/PerspectiveCamera.ts#L208)

Returns the near clipping distance.

##### Returns

`number`

Near clipping distance

#### Set Signature

> **set** **nearClipping**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:220](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/camera/PerspectiveCamera.ts#L220)

Sets the near clipping distance.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Near clipping distance to set |

##### Returns

`void`

***

### position

#### Get Signature

> **get** **position**(): \[`number`, `number`, `number`\]

Defined in: [src/camera/camera/PerspectiveCamera.ts:345](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/camera/PerspectiveCamera.ts#L345)

Returns the camera position (x, y, z).

##### Returns

\[`number`, `number`, `number`\]

[x, y, z] coordinate array

***

### rotationX

#### Get Signature

> **get** **rotationX**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:111](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/camera/PerspectiveCamera.ts#L111)

Returns the X rotation value. (radians)

##### Returns

`number`

X rotation value

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:123](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/camera/PerspectiveCamera.ts#L123)

Sets the X rotation value. (radians)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Rotation value to set |

##### Returns

`void`

***

### rotationY

#### Get Signature

> **get** **rotationY**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:135](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/camera/PerspectiveCamera.ts#L135)

Returns the Y rotation value. (radians)

##### Returns

`number`

Y rotation value

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:147](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/camera/PerspectiveCamera.ts#L147)

Sets the X rotation value. (radians)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Rotation value to set |

##### Returns

`void`

***

### rotationZ

#### Get Signature

> **get** **rotationZ**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:159](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/camera/PerspectiveCamera.ts#L159)

Returns the Z rotation value. (radians)

##### Returns

`number`

Z rotation value

#### Set Signature

> **set** **rotationZ**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:171](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/camera/PerspectiveCamera.ts#L171)

Sets the X rotation value. (radians)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Rotation value to set |

##### Returns

`void`

***

### viewMatrix

#### Get Signature

> **get** **viewMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/camera/camera/PerspectiveCamera.ts:258](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/camera/PerspectiveCamera.ts#L258)

Returns the model matrix.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

Model matrix

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:270](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/camera/PerspectiveCamera.ts#L270)

Returns the X coordinate.

##### Returns

`number`

X coordinate

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:282](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/camera/PerspectiveCamera.ts#L282)

Sets the X coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | X coordinate to set |

##### Returns

`void`

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:295](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/camera/PerspectiveCamera.ts#L295)

Returns the Y coordinate.

##### Returns

`number`

Y coordinate

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:307](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/camera/PerspectiveCamera.ts#L307)

Sets the Y coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Y coordinate to set |

##### Returns

`void`

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:320](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/camera/PerspectiveCamera.ts#L320)

Returns the Z coordinate.

##### Returns

`number`

Z coordinate

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:332](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/camera/PerspectiveCamera.ts#L332)

Sets the Z coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Z coordinate to set |

##### Returns

`void`

## Methods

### lookAt()

> **lookAt**(`x`, `y`, `z`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:399](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/camera/PerspectiveCamera.ts#L399)

Rotates the camera to look at a specific coordinate.

### Example
```typescript
camera.lookAt(0, 0, 0);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | Target X coordinate to look at |
| `y` | `number` | Target Y coordinate to look at |
| `z` | `number` | Target Z coordinate to look at |

#### Returns

`void`

***

### setPosition()

> **setPosition**(`x`, `y?`, `z?`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:369](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/camera/PerspectiveCamera.ts#L369)

Sets the camera position.

### Example
```typescript
camera.setPosition(10, 5, 20);
camera.setPosition([10, 5, 20]);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` \| \[`number`, `number`, `number`\] | X coordinate or [x, y, z] array |
| `y?` | `number` | Y coordinate (ignored if x is an array) |
| `z?` | `number` | Z coordinate (ignored if x is an array) |

#### Returns

`void`

***


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### instanceId

> `readonly` **instanceId**: `number`

Defined in: [src/base/BaseObject.ts:18](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L18)

Instance sequence ID per class

#### Inherited from

[`ACamera`](../namespaces/Core/classes/ACamera.md).[`instanceId`](../namespaces/Core/classes/ACamera.md#instanceid)

***

### CALIBRATION\_CONSTANT

> `readonly` `static` **CALIBRATION\_CONSTANT**: `number` = `12.5`

Defined in: [src/camera/core/ACamera.ts:19](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/ACamera.ts#L19)

Calibration constant (K)

#### Description

Unreal Engine 5 and photographic standard (K = 12.5 based on ISO 2720)

#### Inherited from

[`ACamera`](../namespaces/Core/classes/ACamera.md).[`CALIBRATION_CONSTANT`](../namespaces/Core/classes/ACamera.md#calibration_constant)

## Accessors

### aperture

#### Get Signature

> **get** **aperture**(): `number`

Defined in: [src/camera/core/ACamera.ts:123](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/ACamera.ts#L123)

Returns the aperture (f-stop) value.

##### Returns

`number`

Aperture value

#### Set Signature

> **set** **aperture**(`value`): `void`

Defined in: [src/camera/core/ACamera.ts:135](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/ACamera.ts#L135)

Sets the aperture (f-stop) value.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Aperture value to set |

##### Returns

`void`

#### Inherited from

[`ACamera`](../namespaces/Core/classes/ACamera.md).[`aperture`](../namespaces/Core/classes/ACamera.md#aperture)

***

### ev100

#### Get Signature

> **get** **ev100**(): `number`

Defined in: [src/camera/core/ACamera.ts:110](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/ACamera.ts#L110)

Returns the physical exposure value (EV100).

##### Returns

`number`

EV100 value

#### Inherited from

[`ACamera`](../namespaces/Core/classes/ACamera.md).[`ev100`](../namespaces/Core/classes/ACamera.md#ev100)

***

### iso

#### Get Signature

> **get** **iso**(): `number`

Defined in: [src/camera/core/ACamera.ts:177](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/ACamera.ts#L177)

Returns the sensor sensitivity (ISO).

##### Returns

`number`

ISO sensitivity

#### Set Signature

> **set** **iso**(`value`): `void`

Defined in: [src/camera/core/ACamera.ts:189](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/ACamera.ts#L189)

Sets the sensor sensitivity (ISO).

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | ISO sensitivity to set |

##### Returns

`void`

#### Inherited from

[`ACamera`](../namespaces/Core/classes/ACamera.md).[`iso`](../namespaces/Core/classes/ACamera.md#iso)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L58)

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L70)

Sets the name of the object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name of the object to set |

##### Returns

`void`

#### Inherited from

[`PostEffectTexturePool`](../../PostEffect/namespaces/Core/classes/PostEffectTexturePool.md).[`name`](../../PostEffect/namespaces/Core/classes/PostEffectTexturePool.md#name)

***

### shutterSpeed

#### Get Signature

> **get** **shutterSpeed**(): `number`

Defined in: [src/camera/core/ACamera.ts:150](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/ACamera.ts#L150)

Returns the shutter speed (in seconds).

##### Returns

`number`

Shutter speed

#### Set Signature

> **set** **shutterSpeed**(`value`): `void`

Defined in: [src/camera/core/ACamera.ts:162](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/ACamera.ts#L162)

Sets the shutter speed (in seconds).

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Shutter speed to set |

##### Returns

`void`

#### Inherited from

[`ACamera`](../namespaces/Core/classes/ACamera.md).[`shutterSpeed`](../namespaces/Core/classes/ACamera.md#shutterspeed)

***

### useAutoExposure

#### Get Signature

> **get** **useAutoExposure**(): `boolean`

Defined in: [src/camera/core/ACamera.ts:61](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/ACamera.ts#L61)

Returns whether to use auto exposure.

##### Returns

`boolean`

Whether auto exposure is enabled

#### Set Signature

> **set** **useAutoExposure**(`value`): `void`

Defined in: [src/camera/core/ACamera.ts:73](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/ACamera.ts#L73)

Sets whether to use auto exposure.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Whether to enable auto exposure to set |

##### Returns

`void`

#### Inherited from

[`ACamera`](../namespaces/Core/classes/ACamera.md).[`useAutoExposure`](../namespaces/Core/classes/ACamera.md#useautoexposure)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/base/BaseObject.ts#L46)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

[`ACamera`](../namespaces/Core/classes/ACamera.md).[`uuid`](../namespaces/Core/classes/ACamera.md#uuid)

***

### updateExposure()

> **updateExposure**(`view?`): `void`

Defined in: [src/camera/core/ACamera.ts:204](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/camera/core/ACamera.ts#L204)

Updates the exposure value.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view?` | [`View3D`](../../Display/classes/View3D.md) | View3D instance (optional) |

#### Returns

`void`

#### Inherited from

[`ACamera`](../namespaces/Core/classes/ACamera.md).[`updateExposure`](../namespaces/Core/classes/ACamera.md#updateexposure)


</details>
