[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / OrthographicCamera

# Class: OrthographicCamera

Defined in: [src/camera/camera/OrthographicCamera.ts:23](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/OrthographicCamera.ts#L23)


Camera that uses orthographic projection.


In this projection mode, an object's size stays constant regardless of its distance from the camera. It is primarily used for implementing orthographic views such as 2D viewports or blueprints.

* ### Example
```typescript
const camera = new RedGPU.Camera.OrthographicCamera();
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

Defined in: [src/camera/camera/OrthographicCamera.ts:82](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/OrthographicCamera.ts#L82)


Creates an instance of OrthographicCamera.

#### Returns

`OrthographicCamera`

#### Overrides

[`PerspectiveCamera`](PerspectiveCamera.md).[`constructor`](PerspectiveCamera.md#constructor)

## Accessors

### bottom

#### Get Signature

> **get** **bottom**(): `number`

Defined in: [src/camera/camera/OrthographicCamera.ts:121](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/OrthographicCamera.ts#L121)


Returns the projection bottom value.

##### Returns

`number`


Projection bottom value

#### Set Signature

> **set** **bottom**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:133](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/OrthographicCamera.ts#L133)


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

Defined in: [src/camera/camera/PerspectiveCamera.ts:240](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/PerspectiveCamera.ts#L240)


Returns the far clipping distance.

##### Returns

`number`


Far clipping distance

#### Set Signature

> **set** **farClipping**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:252](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/PerspectiveCamera.ts#L252)


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

Defined in: [src/camera/camera/PerspectiveCamera.ts:190](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/PerspectiveCamera.ts#L190)


Returns the field of view. (degrees)

##### Returns

`number`


Field of view

#### Set Signature

> **set** **fieldOfView**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:202](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/PerspectiveCamera.ts#L202)


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

Defined in: [src/camera/camera/OrthographicCamera.ts:146](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/OrthographicCamera.ts#L146)


Returns the projection left value.

##### Returns

`number`


Projection left value

#### Set Signature

> **set** **left**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:158](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/OrthographicCamera.ts#L158)


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

Defined in: [src/camera/camera/OrthographicCamera.ts:246](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/OrthographicCamera.ts#L246)


Returns the maximum zoom level.

##### Returns

`number`


Maximum zoom level

#### Set Signature

> **set** **maxZoom**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:258](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/OrthographicCamera.ts#L258)


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

Defined in: [src/camera/camera/OrthographicCamera.ts:221](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/OrthographicCamera.ts#L221)


Returns the minimum zoom level.

##### Returns

`number`


Minimum zoom level

#### Set Signature

> **set** **minZoom**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:233](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/OrthographicCamera.ts#L233)


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

> **get** **modelMatrix**(): [`mat4`](../../../type-aliases/mat4.md)

Defined in: [src/camera/camera/PerspectiveCamera.ts:290](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/PerspectiveCamera.ts#L290)


Returns the model matrix.

##### Returns

[`mat4`](../../../type-aliases/mat4.md)


Model matrix

#### Inherited from

[`PerspectiveCamera`](PerspectiveCamera.md).[`modelMatrix`](PerspectiveCamera.md#modelmatrix)

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/camera/camera/OrthographicCamera.ts:271](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/OrthographicCamera.ts#L271)


Returns the camera name.

##### Returns

`string`


Camera name

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:284](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/OrthographicCamera.ts#L284)


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

Defined in: [src/camera/camera/PerspectiveCamera.ts:215](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/PerspectiveCamera.ts#L215)


Returns the near clipping distance.

##### Returns

`number`


Near clipping distance

#### Set Signature

> **set** **nearClipping**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:227](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/PerspectiveCamera.ts#L227)


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

Defined in: [src/camera/camera/PerspectiveCamera.ts:377](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/PerspectiveCamera.ts#L377)


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

Defined in: [src/camera/camera/OrthographicCamera.ts:171](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/OrthographicCamera.ts#L171)


Returns the projection right value.

##### Returns

`number`


Projection right value

#### Set Signature

> **set** **right**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:183](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/OrthographicCamera.ts#L183)


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

Defined in: [src/camera/camera/PerspectiveCamera.ts:118](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/PerspectiveCamera.ts#L118)


Returns the X rotation value. (radians)

##### Returns

`number`


X rotation value

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:130](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/PerspectiveCamera.ts#L130)


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

Defined in: [src/camera/camera/PerspectiveCamera.ts:142](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/PerspectiveCamera.ts#L142)


Returns the Y rotation value. (radians)

##### Returns

`number`


Y rotation value

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:154](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/PerspectiveCamera.ts#L154)


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

Defined in: [src/camera/camera/PerspectiveCamera.ts:166](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/PerspectiveCamera.ts#L166)


Returns the Z rotation value. (radians)

##### Returns

`number`


Z rotation value

#### Set Signature

> **set** **rotationZ**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:178](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/PerspectiveCamera.ts#L178)


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

Defined in: [src/camera/camera/OrthographicCamera.ts:96](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/OrthographicCamera.ts#L96)


Returns the projection top value.

##### Returns

`number`


Projection top value

#### Set Signature

> **set** **top**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:108](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/OrthographicCamera.ts#L108)


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

Defined in: [src/camera/camera/PerspectiveCamera.ts:302](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/PerspectiveCamera.ts#L302)


Returns the X coordinate.

##### Returns

`number`


X coordinate

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:314](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/PerspectiveCamera.ts#L314)


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

Defined in: [src/camera/camera/PerspectiveCamera.ts:327](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/PerspectiveCamera.ts#L327)


Returns the Y coordinate.

##### Returns

`number`


Y coordinate

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:339](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/PerspectiveCamera.ts#L339)


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

Defined in: [src/camera/camera/PerspectiveCamera.ts:352](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/PerspectiveCamera.ts#L352)


Returns the Z coordinate.

##### Returns

`number`


Z coordinate

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/camera/camera/PerspectiveCamera.ts:364](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/PerspectiveCamera.ts#L364)


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

Defined in: [src/camera/camera/OrthographicCamera.ts:196](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/OrthographicCamera.ts#L196)


Returns the zoom level.

##### Returns

`number`


Zoom level

#### Set Signature

> **set** **zoom**(`value`): `void`

Defined in: [src/camera/camera/OrthographicCamera.ts:208](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/OrthographicCamera.ts#L208)


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

Defined in: [src/camera/camera/PerspectiveCamera.ts:420](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/PerspectiveCamera.ts#L420)


Rotates the camera to look at a specific coordinate.

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

Defined in: [src/camera/camera/PerspectiveCamera.ts:395](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/PerspectiveCamera.ts#L395)


Sets the camera position.

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

Defined in: [src/camera/camera/OrthographicCamera.ts:296](https://github.com/redcamel/RedGPU/blob/721925ec71d511dd28533d65d64c5dbfc2f58dd3/src/camera/camera/OrthographicCamera.ts#L296)


Sets the zoom level.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `zoom` | `number` | Zoom level (0.1 ~ 10) |

#### Returns

`void`
