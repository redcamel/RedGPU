[**RedGPU API v4.0.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / OrthographicCamera

# Class: OrthographicCamera

Defined in: [src/camera/camera/OrthographicCamera.ts:23](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/OrthographicCamera.ts#L23)


Camera that uses orthographic projection.


In this projection mode, an object's size stays constant regardless of its distance from the camera. It is primarily used for implementing orthographic views such as 2D viewports or blueprints.

### Example
```typescript
const camera = new RedGPU.OrthographicCamera();
camera.top = 10;
camera.bottom = -10;
camera.left = -20;
camera.right = 20;
```

## Extends

- [`PerspectiveCamera`](PerspectiveCamera.md)

## Constructors

### Constructor

> **new OrthographicCamera**(): `OrthographicCamera`

Defined in: [src/camera/camera/OrthographicCamera.ts:87](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/OrthographicCamera.ts#L87)


Creates an instance of OrthographicCamera.

### Example
```typescript
const camera = new RedGPU.OrthographicCamera();
```

#### Returns

`OrthographicCamera`

#### Overrides

[`PerspectiveCamera`](PerspectiveCamera.md).[`constructor`](PerspectiveCamera.md#constructor)

## Accessors

### bottom

#### Get Signature

> **get** **bottom**(): `number`

Defined in: [src/camera/camera/OrthographicCamera.ts:126](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/OrthographicCamera.ts#L126)


Returns the projection bottom value.

##### Returns

`number`


Projection bottom value

#### Set Signature

> **set** **bottom**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:138](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/OrthographicCamera.ts#L138)


Sets the projection bottom value.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Bottom value to set |

##### Returns

`void`

***

### farClipping

#### Get Signature

> **get** **farClipping**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:245](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/PerspectiveCamera.ts#L245)


Returns the far clipping distance.

##### Returns

`number`


Far clipping distance

#### Set Signature

> **set** **farClipping**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:257](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/PerspectiveCamera.ts#L257)


Sets the far clipping distance.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Far clipping distance to set |

##### Returns

`void`

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`farClipping`](PerspectiveCamera.md#farclipping)

***

### fieldOfView

#### Get Signature

> **get** **fieldOfView**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:195](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/PerspectiveCamera.ts#L195)


Returns the field of view. (degrees)

##### Returns

`number`


Field of view

#### Set Signature

> **set** **fieldOfView**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:207](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/PerspectiveCamera.ts#L207)


Sets the field of view. (degrees)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Field of view to set |

##### Returns

`void`

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`fieldOfView`](PerspectiveCamera.md#fieldofview)

***

### left

#### Get Signature

> **get** **left**(): `number`

Defined in: [src/camera/camera/OrthographicCamera.ts:151](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/OrthographicCamera.ts#L151)


Returns the projection left value.

##### Returns

`number`


Projection left value

#### Set Signature

> **set** **left**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:163](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/OrthographicCamera.ts#L163)


Sets the projection left value.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Left value to set |

##### Returns

`void`

***

### maxZoom

#### Get Signature

> **get** **maxZoom**(): `number`

Defined in: [src/camera/camera/OrthographicCamera.ts:251](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/OrthographicCamera.ts#L251)


Returns the maximum zoom level.

##### Returns

`number`


Maximum zoom level

#### Set Signature

> **set** **maxZoom**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:263](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/OrthographicCamera.ts#L263)


Sets the maximum zoom level.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Maximum zoom to set (min 0.01) |

##### Returns

`void`

***

### minZoom

#### Get Signature

> **get** **minZoom**(): `number`

Defined in: [src/camera/camera/OrthographicCamera.ts:226](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/OrthographicCamera.ts#L226)


Returns the minimum zoom level.

##### Returns

`number`


Minimum zoom level

#### Set Signature

> **set** **minZoom**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:238](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/OrthographicCamera.ts#L238)


Sets the minimum zoom level.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Minimum zoom to set (min 0.01) |

##### Returns

`void`

***

### modelMatrix

#### Get Signature

> **get** **modelMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/camera/camera/PerspectiveCamera.ts:295](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/PerspectiveCamera.ts#L295)


Returns the model matrix.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)


Model matrix

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`modelMatrix`](PerspectiveCamera.md#modelmatrix)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/camera/camera/OrthographicCamera.ts:276](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/OrthographicCamera.ts#L276)


Returns the camera name.

##### Returns

`string`


Camera name

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:289](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/OrthographicCamera.ts#L289)


Sets the camera name.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name to set |

##### Returns

`void`

#### Overrides

[`PerspectiveCamera`](PerspectiveCamera.md).[`name`](PerspectiveCamera.md#name)

***

### nearClipping

#### Get Signature

> **get** **nearClipping**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:220](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/PerspectiveCamera.ts#L220)


Returns the near clipping distance.

##### Returns

`number`


Near clipping distance

#### Set Signature

> **set** **nearClipping**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:232](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/PerspectiveCamera.ts#L232)


Sets the near clipping distance.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Near clipping distance to set |

##### Returns

`void`

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`nearClipping`](PerspectiveCamera.md#nearclipping)

***

### position

#### Get Signature

> **get** **position**(): \[`number`, `number`, `number`\]

Defined in: [src/camera/camera/PerspectiveCamera.ts:382](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/PerspectiveCamera.ts#L382)


Returns the camera position (x, y, z).

##### Returns

\[`number`, `number`, `number`\]


[x, y, z] coordinate array

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`position`](PerspectiveCamera.md#position)

***

### right

#### Get Signature

> **get** **right**(): `number`

Defined in: [src/camera/camera/OrthographicCamera.ts:176](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/OrthographicCamera.ts#L176)


Returns the projection right value.

##### Returns

`number`


Projection right value

#### Set Signature

> **set** **right**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:188](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/OrthographicCamera.ts#L188)


Sets the projection right value.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Right value to set |

##### Returns

`void`

***

### rotationX

#### Get Signature

> **get** **rotationX**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:123](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/PerspectiveCamera.ts#L123)


Returns the X rotation value. (radians)

##### Returns

`number`


X rotation value

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:135](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/PerspectiveCamera.ts#L135)


Sets the X rotation value. (radians)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Rotation value to set |

##### Returns

`void`

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`rotationX`](PerspectiveCamera.md#rotationx)

***

### rotationY

#### Get Signature

> **get** **rotationY**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:147](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/PerspectiveCamera.ts#L147)


Returns the Y rotation value. (radians)

##### Returns

`number`


Y rotation value

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:159](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/PerspectiveCamera.ts#L159)


Sets the Y rotation value. (radians)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Rotation value to set |

##### Returns

`void`

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`rotationY`](PerspectiveCamera.md#rotationy)

***

### rotationZ

#### Get Signature

> **get** **rotationZ**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:171](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/PerspectiveCamera.ts#L171)


Returns the Z rotation value. (radians)

##### Returns

`number`


Z rotation value

#### Set Signature

> **set** **rotationZ**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:183](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/PerspectiveCamera.ts#L183)


Sets the Z rotation value. (radians)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Rotation value to set |

##### Returns

`void`

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`rotationZ`](PerspectiveCamera.md#rotationz)

***

### top

#### Get Signature

> **get** **top**(): `number`

Defined in: [src/camera/camera/OrthographicCamera.ts:101](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/OrthographicCamera.ts#L101)


Returns the projection top value.

##### Returns

`number`


Projection top value

#### Set Signature

> **set** **top**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:113](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/OrthographicCamera.ts#L113)


Sets the projection top value.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Top value to set |

##### Returns

`void`

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:307](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/PerspectiveCamera.ts#L307)


Returns the X coordinate.

##### Returns

`number`


X coordinate

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:319](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/PerspectiveCamera.ts#L319)


Sets the X coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | X coordinate to set |

##### Returns

`void`

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`x`](PerspectiveCamera.md#x)

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:332](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/PerspectiveCamera.ts#L332)


Returns the Y coordinate.

##### Returns

`number`


Y coordinate

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:344](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/PerspectiveCamera.ts#L344)


Sets the Y coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Y coordinate to set |

##### Returns

`void`

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`y`](PerspectiveCamera.md#y)

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/camera/camera/PerspectiveCamera.ts:357](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/PerspectiveCamera.ts#L357)


Returns the Z coordinate.

##### Returns

`number`


Z coordinate

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:369](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/PerspectiveCamera.ts#L369)


Sets the Z coordinate.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Z coordinate to set |

##### Returns

`void`

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`z`](PerspectiveCamera.md#z)

***

### zoom

#### Get Signature

> **get** **zoom**(): `number`

Defined in: [src/camera/camera/OrthographicCamera.ts:201](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/OrthographicCamera.ts#L201)


Returns the zoom level.

##### Returns

`number`


Zoom level

#### Set Signature

> **set** **zoom**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:213](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/OrthographicCamera.ts#L213)


Sets the zoom level.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` | Zoom level to set (minZoom ~ maxZoom) |

##### Returns

`void`

## Methods

### lookAt()

> **lookAt**(`x`, `y`, `z`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:436](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/PerspectiveCamera.ts#L436)


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

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`lookAt`](PerspectiveCamera.md#lookat)

***

### setPosition()

> **setPosition**(`x`, `y?`, `z?`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:406](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/PerspectiveCamera.ts#L406)


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

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`setPosition`](PerspectiveCamera.md#setposition)

***

### setZoom()

> **setZoom**(`zoom`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:306](https://github.com/redcamel/RedGPU/blob/99ddf64d120603e3ffe2c0b760ce7ce2feed3965/src/camera/camera/OrthographicCamera.ts#L306)


Sets the zoom level.

### Example
```typescript
camera.setZoom(2.0);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `zoom` | `number` | Zoom level (0.1 ~ 10) |

#### Returns

`void`
