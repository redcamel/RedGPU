[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Camera](../README.md) / Camera2D

# Class: Camera2D

Defined in: [src/camera/camera/Camera2D.ts:20](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/camera/camera/Camera2D.ts#L20)


Camera for observing objects in a 2D environment.


Controls position based on a flat 2D coordinate system, primarily used for rendering UI or 2D game elements.

### Example
```typescript
const camera = new RedGPU.Camera2D();
camera.x = 100;
camera.y = 50;
camera.setPosition(200, 100);
```

## Constructors

### Constructor

> **new Camera2D**(): `Camera2D`

Defined in: [src/camera/camera/Camera2D.ts:66](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/camera/camera/Camera2D.ts#L66)


Creates an instance of Camera2D.

### Example
```typescript
const camera = new RedGPU.Camera2D();
```

#### Returns

`Camera2D`

## Accessors

### modelMatrix

#### Get Signature

> **get** **modelMatrix**(): [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/camera/camera/Camera2D.ts:102](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/camera/camera/Camera2D.ts#L102)


Returns the model matrix.

##### Returns

[`mat4`](../../Math/type-aliases/mat4.md)


Model matrix

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/camera/camera/Camera2D.ts:77](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/camera/camera/Camera2D.ts#L77)


Returns the camera name.

##### Returns

`string`


Camera name

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/camera/camera/Camera2D.ts:90](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/camera/camera/Camera2D.ts#L90)


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

Defined in: [src/camera/camera/Camera2D.ts:176](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/camera/camera/Camera2D.ts#L176)


Returns the camera position (x, y).

##### Returns

\[`number`, `number`\]


[x, y] coordinate array

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/camera/camera/Camera2D.ts:126](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/camera/camera/Camera2D.ts#L126)


Returns the X coordinate.

##### Returns

`number`


X coordinate

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/camera/camera/Camera2D.ts:138](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/camera/camera/Camera2D.ts#L138)


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

Defined in: [src/camera/camera/Camera2D.ts:151](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/camera/camera/Camera2D.ts#L151)


Returns the Y coordinate.

##### Returns

`number`


Y coordinate

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/camera/camera/Camera2D.ts:163](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/camera/camera/Camera2D.ts#L163)


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

Defined in: [src/camera/camera/Camera2D.ts:114](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/camera/camera/Camera2D.ts#L114)


Returns the Z coordinate. (Unused)

##### Returns

`number`


Z coordinate

## Methods

### setPosition()

> **setPosition**(`x`, `y?`): `void`

Defined in: [src/camera/camera/Camera2D.ts:197](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/camera/camera/Camera2D.ts#L197)


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
