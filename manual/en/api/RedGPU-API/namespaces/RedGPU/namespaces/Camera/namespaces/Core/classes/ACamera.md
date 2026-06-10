[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Camera](../../../README.md) / [Core](../README.md) / ACamera

# Abstract Class: ACamera

Defined in: [src/camera/core/ACamera.ts:11](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/ACamera.ts#L11)

Abstract base class for all cameras. Manages physical camera properties and common metadata.

## Extends

- [`BaseObject`](../../../../BaseObject/classes/BaseObject.md)

## Extended by

- [`PerspectiveCamera`](../../../classes/PerspectiveCamera.md)
- [`Camera2D`](../../../classes/Camera2D.md)

## Constructors

### Constructor

> `protected` **new ACamera**(): `ACamera`

Defined in: [src/base/BaseObject.ts:34](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/BaseObject.ts#L34)

BaseObject constructor. (Abstract class, cannot be instantiated directly)

#### Returns

`ACamera`

#### Inherited from

[`BaseObject`](../../../../BaseObject/classes/BaseObject.md).[`constructor`](../../../../BaseObject/classes/BaseObject.md#constructor)

## Properties

### CALIBRATION\_CONSTANT

> `readonly` `static` **CALIBRATION\_CONSTANT**: `number` = `12.5`

Defined in: [src/camera/core/ACamera.ts:19](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/ACamera.ts#L19)

Calibration constant (K)

#### Description

Unreal Engine 5 and photographic standard (K = 12.5 based on ISO 2720)

## Accessors

### aperture

#### Get Signature

> **get** **aperture**(): `number`

Defined in: [src/camera/core/ACamera.ts:123](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/ACamera.ts#L123)

Returns the aperture (f-stop) value.

##### Returns

`number`

Aperture value

#### Set Signature

> **set** **aperture**(`value`): `void`

Defined in: [src/camera/core/ACamera.ts:135](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/ACamera.ts#L135)

Sets the aperture (f-stop) value.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Aperture value to set |

##### Returns

`void`

***

### ev100

#### Get Signature

> **get** **ev100**(): `number`

Defined in: [src/camera/core/ACamera.ts:110](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/ACamera.ts#L110)

Returns the physical exposure value (EV100).

##### Returns

`number`

EV100 value

***

### iso

#### Get Signature

> **get** **iso**(): `number`

Defined in: [src/camera/core/ACamera.ts:177](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/ACamera.ts#L177)

Returns the sensor sensitivity (ISO).

##### Returns

`number`

ISO sensitivity

#### Set Signature

> **set** **iso**(`value`): `void`

Defined in: [src/camera/core/ACamera.ts:189](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/ACamera.ts#L189)

Sets the sensor sensitivity (ISO).

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | ISO sensitivity to set |

##### Returns

`void`

***

### shutterSpeed

#### Get Signature

> **get** **shutterSpeed**(): `number`

Defined in: [src/camera/core/ACamera.ts:150](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/ACamera.ts#L150)

Returns the shutter speed (in seconds).

##### Returns

`number`

Shutter speed

#### Set Signature

> **set** **shutterSpeed**(`value`): `void`

Defined in: [src/camera/core/ACamera.ts:162](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/ACamera.ts#L162)

Sets the shutter speed (in seconds).

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Shutter speed to set |

##### Returns

`void`

***

### useAutoExposure

#### Get Signature

> **get** **useAutoExposure**(): `boolean`

Defined in: [src/camera/core/ACamera.ts:61](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/ACamera.ts#L61)

Returns whether to use auto exposure.

##### Returns

`boolean`

Whether auto exposure is enabled

#### Set Signature

> **set** **useAutoExposure**(`value`): `void`

Defined in: [src/camera/core/ACamera.ts:73](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/ACamera.ts#L73)

Sets whether to use auto exposure.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `boolean` | Whether to enable auto exposure to set |

##### Returns

`void`

***

### updateExposure()

> **updateExposure**(`view?`): `void`

Defined in: [src/camera/core/ACamera.ts:204](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/camera/core/ACamera.ts#L204)

Updates the exposure value.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view?` | [`View3D`](../../../../Display/classes/View3D.md) | View3D instance (optional) |

#### Returns

`void`


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/BaseObject.ts#L58)

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/BaseObject.ts#L71)

Sets the name of the object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name of the object to set |

##### Returns

`void`

#### Inherited from

[`PostEffectTexturePool`](../../../../PostEffect/namespaces/Core/classes/PostEffectTexturePool.md).[`name`](../../../../PostEffect/namespaces/Core/classes/PostEffectTexturePool.md#name)

***

### uuid

#### Get Signature

> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/base/BaseObject.ts#L46)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

[`BaseObject`](../../../../BaseObject/classes/BaseObject.md).[`uuid`](../../../../BaseObject/classes/BaseObject.md#uuid)

## Methods


</details>
