[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / Camera2D

# Class: Camera2D

Defined in: [src/camera/camera/Camera2D.ts:20](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/camera/camera/Camera2D.ts#L20)


Camera for observing objects in a 2D environment.


Controls position based on a flat 2D coordinate system, primarily used for rendering UI or 2D game elements.

* ### Example
```typescript
const camera = new RedGPU.Camera.Camera2D();
camera.x = 100;
camera.y = 50;
camera.setPosition(200, 100);
```

## Constructors

### Constructor

> **new Camera2D**(): `Camera2D`

Defined in: [src/camera/camera/Camera2D.ts:61](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/camera/camera/Camera2D.ts#L61)


Creates an instance of Camera2D.

#### Returns

`Camera2D`

## Accessors

### modelMatrix

#### Get Signature

> **get** **modelMatrix**(): [`mat4`](../../../type-aliases/mat4.md)

Defined in: [src/camera/camera/Camera2D.ts:97](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/camera/camera/Camera2D.ts#L97)


Returns the model matrix.

##### Returns

[`mat4`](../../../type-aliases/mat4.md)


Model matrix

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/camera/camera/Camera2D.ts:72](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/camera/camera/Camera2D.ts#L72)


Returns the camera name.

##### Returns

`string`


Camera name

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/camera/camera/Camera2D.ts:85](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/camera/camera/Camera2D.ts#L85)


Sets the camera name.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `string` | Name to set |

##### Returns

`void`

***

### position

#### Get Signature

> **get** **position**(): \[`number`, `number`\]

Defined in: [src/camera/camera/Camera2D.ts:171](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/camera/camera/Camera2D.ts#L171)


Returns the camera position (x, y).

##### Returns

\[`number`, `number`\]


[x, y] coordinate array

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/camera/camera/Camera2D.ts:121](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/camera/camera/Camera2D.ts#L121)


Returns the X coordinate.

##### Returns

`number`


X coordinate

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/camera/camera/Camera2D.ts:133](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/camera/camera/Camera2D.ts#L133)


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

Defined in: [src/camera/camera/Camera2D.ts:146](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/camera/camera/Camera2D.ts#L146)


Returns the Y coordinate.

##### Returns

`number`


Y coordinate

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/camera/camera/Camera2D.ts:158](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/camera/camera/Camera2D.ts#L158)


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

Defined in: [src/camera/camera/Camera2D.ts:109](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/camera/camera/Camera2D.ts#L109)


Returns the Z coordinate. (Unused)

##### Returns

`number`


Z coordinate

## Methods

### setPosition()

> **setPosition**(`x`, `y?`): `void`

Defined in: [src/camera/camera/Camera2D.ts:186](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/camera/camera/Camera2D.ts#L186)


Sets the camera position.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` \| \[`number`, `number`, `number`\] | X coordinate or [x, y, z] array |
| `y?` | `number` | Y coordinate (ignored if x is an array) |

#### Returns

`void`
