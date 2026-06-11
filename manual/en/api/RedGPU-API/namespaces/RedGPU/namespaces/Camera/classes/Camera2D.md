[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / Camera2D

# Class: Camera2D

Defined in: [src/camera/camera/Camera2D.ts:20](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/camera/camera/Camera2D.ts#L20)

Camera for observing objects in a 2D environment.

Controls position based on a flat 2D coordinate system, primarily used for rendering UI or 2D game elements.

### Example
```typescript
const camera = new RedGPU.Camera2D();
camera.x = 100;
camera.y = 50;
camera.setPosition(200, 100);
```

## Extends

- [`ACamera`](../namespaces/Core/classes/ACamera.md)

## Constructors

### Constructor

> **new Camera2D**(): `Camera2D`

Defined in: [src/camera/camera/Camera2D.ts:54](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/camera/camera/Camera2D.ts#L54)

Creates an instance of Camera2D.

### Example
```typescript
const camera = new RedGPU.Camera2D();
```

#### Returns

`Camera2D`

#### Overrides

[`ACamera`](../namespaces/Core/classes/ACamera.md).[`constructor`](../namespaces/Core/classes/ACamera.md#constructor)

## Properties

### position

#### Get Signature

> **get** **position**(): \[`number`, `number`\]

Defined in: [src/camera/camera/Camera2D.ts:140](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/camera/camera/Camera2D.ts#L140)

Returns the camera position (x, y).

##### Returns

\[`number`, `number`\]

[x, y] coordinate array

***

### viewMatrix

#### Get Signature

> **get** **viewMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/camera/camera/Camera2D.ts:66](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/camera/camera/Camera2D.ts#L66)

Returns the model matrix.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)

Model matrix

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/camera/camera/Camera2D.ts:90](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/camera/camera/Camera2D.ts#L90)

Returns the X coordinate.

##### Returns

`number`

X coordinate

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/camera/camera/Camera2D.ts:102](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/camera/camera/Camera2D.ts#L102)

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

Defined in: [src/camera/camera/Camera2D.ts:115](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/camera/camera/Camera2D.ts#L115)

Returns the Y coordinate.

##### Returns

`number`

Y coordinate

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/camera/camera/Camera2D.ts:127](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/camera/camera/Camera2D.ts#L127)

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

Defined in: [src/camera/camera/Camera2D.ts:78](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/camera/camera/Camera2D.ts#L78)

Returns the Z coordinate. (Unused)

##### Returns

`number`

Z coordinate

## Methods

### setPosition()

> **setPosition**(`x`, `y?`): `void`

Defined in: [src/camera/camera/Camera2D.ts:161](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/camera/camera/Camera2D.ts#L161)

Sets the camera position.

### Example
```typescript
camera.setPosition(100, 200);
camera.setPosition([100, 200, 0]);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` \| \[`number`, `number`, `number`\] | X coordinate or [x, y, z] array |
| `y?` | `number` | Y coordinate (ignored if x is an array) |

#### Returns

`void`

***


***

## Inherited Members

<details>
<summary>View inherited properties and methods (Click to expand)</summary>

### CALIBRATION\_CONSTANT

> `readonly` `static` **CALIBRATION\_CONSTANT**: `number` = `12.5`

Defined in: [src/camera/core/ACamera.ts:19](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/camera/core/ACamera.ts#L19)

Calibration constant (K)

#### Description

Unreal Engine 5 and photographic standard (K = 12.5 based on ISO 2720)

#### Inherited from

[`ACamera`](../namespaces/Core/classes/ACamera.md).[`CALIBRATION_CONSTANT`](../namespaces/Core/classes/ACamera.md#calibration_constant)

## Accessors

### aperture

#### Get Signature

> **get** **aperture**(): `number`

Defined in: [src/camera/core/ACamera.ts:123](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/camera/core/ACamera.ts#L123)

Returns the aperture (f-stop) value.

##### Returns

`number`

Aperture value

#### Set Signature

> **set** **aperture**(`value`): `void`

Defined in: [src/camera/core/ACamera.ts:135](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/camera/core/ACamera.ts#L135)

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

Defined in: [src/camera/core/ACamera.ts:110](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/camera/core/ACamera.ts#L110)

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

Defined in: [src/camera/core/ACamera.ts:177](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/camera/core/ACamera.ts#L177)

Returns the sensor sensitivity (ISO).

##### Returns

`number`

ISO sensitivity

#### Set Signature

> **set** **iso**(`value`): `void`

Defined in: [src/camera/core/ACamera.ts:189](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/camera/core/ACamera.ts#L189)

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

Defined in: [src/base/BaseObject.ts:58](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/BaseObject.ts#L58)

Returns the name of the object. If no name is set, it is automatically generated by combining the class name and instance ID.

##### Returns

`string`

Name of the object

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:71](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/BaseObject.ts#L71)

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

Defined in: [src/camera/core/ACamera.ts:150](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/camera/core/ACamera.ts#L150)

Returns the shutter speed (in seconds).

##### Returns

`number`

Shutter speed

#### Set Signature

> **set** **shutterSpeed**(`value`): `void`

Defined in: [src/camera/core/ACamera.ts:162](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/camera/core/ACamera.ts#L162)

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

Defined in: [src/camera/core/ACamera.ts:61](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/camera/core/ACamera.ts#L61)

Returns whether to use auto exposure.

##### Returns

`boolean`

Whether auto exposure is enabled

#### Set Signature

> **set** **useAutoExposure**(`value`): `void`

Defined in: [src/camera/core/ACamera.ts:73](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/camera/core/ACamera.ts#L73)

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

Defined in: [src/base/BaseObject.ts:46](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/base/BaseObject.ts#L46)

Returns the universally unique identifier (UUID) of the object.

##### Returns

`string`

UUID string

#### Inherited from

[`ACamera`](../namespaces/Core/classes/ACamera.md).[`uuid`](../namespaces/Core/classes/ACamera.md#uuid)

***

### updateExposure()

> **updateExposure**(`view?`): `void`

Defined in: [src/camera/core/ACamera.ts:204](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/camera/core/ACamera.ts#L204)

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
