[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / PerspectiveCamera

# Class: PerspectiveCamera

Defined in: [src/camera/camera/PerspectiveCamera.ts:24](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/camera/PerspectiveCamera.ts#L24)


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

## Extended by

- [`OrthographicCamera`](OrthographicCamera.md)

## Constructors

### Constructor

> **new PerspectiveCamera**(): `PerspectiveCamera`

Defined in: [src/camera/camera/PerspectiveCamera.ts:112](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/camera/PerspectiveCamera.ts#L112)


Creates an instance of PerspectiveCamera.

### Example
```typescript
const camera = new RedGPU.PerspectiveCamera();
```

#### Returns

`PerspectiveCamera`

## Accessors

### farClipping

#### Get Signature

> **get** **farClipping**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:245](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/camera/PerspectiveCamera.ts#L245)


Returns the far clipping distance.

##### Returns

`number`


Far clipping distance

#### Set Signature

> **set** **farClipping**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:257](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/camera/PerspectiveCamera.ts#L257)


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

Defined in: [src/camera/camera/PerspectiveCamera.ts:195](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/camera/PerspectiveCamera.ts#L195)


Returns the field of view. (degrees)

##### Returns

`number`


Field of view

#### Set Signature

> **set** **fieldOfView**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:207](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/camera/PerspectiveCamera.ts#L207)


Sets the field of view. (degrees)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Field of view to set |

##### Returns

`void`

***

### modelMatrix

#### Get Signature

> **get** **modelMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/camera/camera/PerspectiveCamera.ts:295](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/camera/PerspectiveCamera.ts#L295)


Returns the model matrix.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)


Model matrix

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/camera/camera/PerspectiveCamera.ts:270](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/camera/PerspectiveCamera.ts#L270)


Returns the camera name.

##### Returns

`string`


Camera name

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:283](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/camera/PerspectiveCamera.ts#L283)


Sets the camera name.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name to set |

##### Returns

`void`

***

### nearClipping

#### Get Signature

> **get** **nearClipping**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:220](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/camera/PerspectiveCamera.ts#L220)


Returns the near clipping distance.

##### Returns

`number`


Near clipping distance

#### Set Signature

> **set** **nearClipping**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:232](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/camera/PerspectiveCamera.ts#L232)


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

Defined in: [src/camera/camera/PerspectiveCamera.ts:382](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/camera/PerspectiveCamera.ts#L382)


Returns the camera position (x, y, z).

##### Returns

\[`number`, `number`, `number`\]


[x, y, z] coordinate array

***

### rotationX

#### Get Signature

> **get** **rotationX**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:123](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/camera/PerspectiveCamera.ts#L123)


Returns the X rotation value. (radians)

##### Returns

`number`


X rotation value

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:135](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/camera/PerspectiveCamera.ts#L135)


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

Defined in: [src/camera/camera/PerspectiveCamera.ts:147](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/camera/PerspectiveCamera.ts#L147)


Returns the Y rotation value. (radians)

##### Returns

`number`


Y rotation value

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:159](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/camera/PerspectiveCamera.ts#L159)


Sets the Y rotation value. (radians)

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

Defined in: [src/camera/camera/PerspectiveCamera.ts:171](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/camera/PerspectiveCamera.ts#L171)


Returns the Z rotation value. (radians)

##### Returns

`number`


Z rotation value

#### Set Signature

> **set** **rotationZ**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:183](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/camera/PerspectiveCamera.ts#L183)


Sets the Z rotation value. (radians)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Rotation value to set |

##### Returns

`void`

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:307](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/camera/PerspectiveCamera.ts#L307)


Returns the X coordinate.

##### Returns

`number`


X coordinate

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:319](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/camera/PerspectiveCamera.ts#L319)


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

Defined in: [src/camera/camera/PerspectiveCamera.ts:332](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/camera/PerspectiveCamera.ts#L332)


Returns the Y coordinate.

##### Returns

`number`


Y coordinate

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:344](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/camera/PerspectiveCamera.ts#L344)


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

Defined in: [src/camera/camera/PerspectiveCamera.ts:357](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/camera/PerspectiveCamera.ts#L357)


Returns the Z coordinate.

##### Returns

`number`


Z coordinate

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:369](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/camera/PerspectiveCamera.ts#L369)


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

Defined in: [src/camera/camera/PerspectiveCamera.ts:436](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/camera/PerspectiveCamera.ts#L436)


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

Defined in: [src/camera/camera/PerspectiveCamera.ts:406](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/camera/camera/PerspectiveCamera.ts#L406)


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
