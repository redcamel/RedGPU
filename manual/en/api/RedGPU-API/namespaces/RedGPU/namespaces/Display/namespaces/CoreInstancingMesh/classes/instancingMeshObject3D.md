[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreInstancingMesh](../README.md) / instancingMeshObject3D

# Class: instancingMeshObject3D

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:31](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L31)

Class for controlling individual instances of an instanced mesh.

Manages the individual transform states, such as position, rotation, scale, and opacity of a single instance within an InstancingMesh, updating and writing its model matrix dynamically to the GPU Storage Buffer.

## Constructors

### Constructor

> **new instancingMeshObject3D**(`redGPUContext`, `location`, `instancingMesh`): `InstancingMeshObject3D`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:81](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L81)

Creates an instance of InstancingMeshObject3D.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | RedGPUContext instance |
| `location` | `number` | Index location within the instanced mesh |
| `instancingMesh` | [`InstancingMesh`](../../../classes/InstancingMesh.md) | Parent InstancingMesh object |

#### Returns

`InstancingMeshObject3D`

## Properties

### localMatrix

> **localMatrix**: [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:41](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L41)

Local matrix of the instance

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:36](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L36)

Model matrix of the instance

***

### normalModelMatrix

> **normalModelMatrix**: [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:46](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L46)

Normal model matrix of the instance

## Accessors

### opacity

#### Get Signature

> **get** **opacity**(): `number`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:93](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L93)

Gets or sets the opacity of the instance. The allowed range is from 0.0 to 1.0.

##### Returns

`number`

#### Set Signature

> **set** **opacity**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:97](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L97)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### position

#### Get Signature

> **get** **position**(): `number`[]

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:146](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L146)

Gets the position array [x, y, z] of the instance, or sets the position on all axes to the same single value.

##### Returns

`number`[]

#### Set Signature

> **set** **position**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:150](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L150)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### rotation

#### Get Signature

> **get** **rotation**(): `number`[]

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:254](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L254)

Gets the rotation array [rotationX, rotationY, rotationZ] of the instance, or sets the rotation on all axes to the same single value.

##### Returns

`number`[]

#### Set Signature

> **set** **rotation**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:258](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L258)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### rotationX

#### Get Signature

> **get** **rotationX**(): `number`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:215](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L215)

Gets or sets the rotation angle (in degrees) around the X-axis of the instance.

##### Returns

`number`

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:219](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L219)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### rotationY

#### Get Signature

> **get** **rotationY**(): `number`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:228](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L228)

Gets or sets the rotation angle (in degrees) around the Y-axis of the instance.

##### Returns

`number`

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:232](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L232)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### rotationZ

#### Get Signature

> **get** **rotationZ**(): `number`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:241](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L241)

Gets or sets the rotation angle (in degrees) around the Z-axis of the instance.

##### Returns

`number`

#### Set Signature

> **set** **rotationZ**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:245](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L245)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### scale

#### Get Signature

> **get** **scale**(): `number`[]

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:200](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L200)

Gets the scale array [scaleX, scaleY, scaleZ] of the instance, or sets the scale on all axes to the same single value.

##### Returns

`number`[]

#### Set Signature

> **set** **scale**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:204](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L204)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### scaleX

#### Get Signature

> **get** **scaleX**(): `number`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:161](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L161)

Gets or sets the X-axis scale of the instance.

##### Returns

`number`

#### Set Signature

> **set** **scaleX**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:165](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L165)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### scaleY

#### Get Signature

> **get** **scaleY**(): `number`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:174](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L174)

Gets or sets the Y-axis scale of the instance.

##### Returns

`number`

#### Set Signature

> **set** **scaleY**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:178](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L178)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### scaleZ

#### Get Signature

> **get** **scaleZ**(): `number`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:187](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L187)

Gets or sets the Z-axis scale of the instance.

##### Returns

`number`

#### Set Signature

> **set** **scaleZ**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:191](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L191)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### x

#### Get Signature

> **get** **x**(): `number`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:107](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L107)

Gets or sets the X-axis position of the instance.

##### Returns

`number`

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:111](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L111)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### y

#### Get Signature

> **get** **y**(): `number`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:120](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L120)

Gets or sets the Y-axis position of the instance.

##### Returns

`number`

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:124](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L124)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### z

#### Get Signature

> **get** **z**(): `number`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:133](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L133)

Gets or sets the Z-axis position of the instance.

##### Returns

`number`

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:137](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L137)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

## Methods

### setPosition()

> **setPosition**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:301](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L301)

Sets the position of the object along the X, Y, and Z axes. If Y and Z are omitted, they default to the value of X.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X coordinate of the position |
| `y?` | `number` | Y coordinate of the position (optional, default: x) |
| `z?` | `number` | Z coordinate of the position (optional, default: x) |

#### Returns

`void`

***

### setRotation()

> **setRotation**(`rotationX`, `rotationY?`, `rotationZ?`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:324](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L324)

Sets the rotation of the object around the X, Y, and Z axes in degrees. If Y and Z are omitted, they default to the value of X.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rotationX` | `number` | Rotation angle around the X-axis (in degrees) |
| `rotationY?` | `number` | Rotation angle around the Y-axis (in degrees, optional, default: rotationX) |
| `rotationZ?` | `number` | Rotation angle around the Z-axis (in degrees, optional, default: rotationX) |

#### Returns

`void`

***

### setScale()

> **setScale**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:278](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L278)

Sets the scale of the object along the X, Y, and Z axes. If Y and Z are omitted, they default to the value of X (uniform scaling).

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | Scale factor along the X-axis |
| `y?` | `number` | Scale factor along the Y-axis (optional, default: x) |
| `z?` | `number` | Scale factor along the Z-axis (optional, default: x) |

#### Returns

`void`
