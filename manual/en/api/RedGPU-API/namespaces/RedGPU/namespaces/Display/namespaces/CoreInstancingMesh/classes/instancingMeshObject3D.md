[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreInstancingMesh](../README.md) / instancingMeshObject3D

# Class: instancingMeshObject3D

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:45](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L45)


Class representing an individual instance of an instanced mesh.


Manages individual transform information such as position, rotation, and scale for each instance within an InstancingMesh.

## Constructors

### Constructor

> **new instancingMeshObject3D**(`redGPUContext`, `location`, `instancingMesh`): `InstancingMeshObject3D`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:77](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L77)

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../RedGPUContext/classes/RedGPUContext.md) | The RedGPUContext of the instance. |
| `location` | `number` | The location of the instance. |
| `instancingMesh` | [`InstancingMesh`](../../../classes/InstancingMesh.md) | The InstancingMesh of the instance. |

#### Returns

`InstancingMeshObject3D`

## Properties

### localMatrix

> **localMatrix**: [`mat4`](../../../../../type-aliases/mat4.md)

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:47](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L47)

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../../../../type-aliases/mat4.md)

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:46](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L46)

***

### normalModelMatrix

> **normalModelMatrix**: [`mat4`](../../../../../type-aliases/mat4.md)

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:48](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L48)

## Accessors

### opacity

#### Get Signature

> **get** **opacity**(): `number`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:85](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L85)

##### Returns

`number`

#### Set Signature

> **set** **opacity**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:89](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L89)

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

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:122](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L122)

##### Returns

`number`[]

#### Set Signature

> **set** **position**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:126](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L126)

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

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:198](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L198)

##### Returns

`number`[]

#### Set Signature

> **set** **rotation**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:202](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L202)

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

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:171](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L171)

##### Returns

`number`

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:175](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L175)

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

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:180](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L180)

##### Returns

`number`

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:184](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L184)

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

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:189](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L189)

##### Returns

`number`

#### Set Signature

> **set** **rotationZ**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:193](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L193)

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

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:160](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L160)

##### Returns

`number`[]

#### Set Signature

> **set** **scale**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:164](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L164)

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

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:133](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L133)

##### Returns

`number`

#### Set Signature

> **set** **scaleX**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:137](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L137)

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

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:142](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L142)

##### Returns

`number`

#### Set Signature

> **set** **scaleY**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:146](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L146)

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

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:151](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L151)

##### Returns

`number`

#### Set Signature

> **set** **scaleZ**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:155](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L155)

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

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:95](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L95)

##### Returns

`number`

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:99](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L99)

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

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:104](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L104)

##### Returns

`number`

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:108](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L108)

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

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:113](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L113)

##### Returns

`number`

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:117](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L117)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

## Methods

### setPosition()

> **setPosition**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:236](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L236)

Sets the position of the object.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | The x coordinate of the position. |
| `y?` | `number` | The y coordinate of the position, defaults to x if not provided. |
| `z?` | `number` | The z coordinate of the position, defaults to x if not provided. |

#### Returns

`void`

***

### setRotation()

> **setRotation**(`rotationX`, `rotationY?`, `rotationZ?`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:253](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L253)

Sets the rotation of an object in three-dimensional space.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rotationX` | `number` | The rotation around the x-axis, in degrees. |
| `rotationY?` | `number` | The rotation around the y-axis, in degrees. Defaults to rotationX if not provided. |
| `rotationZ?` | `number` | The rotation around the z-axis, in degrees. Defaults to rotationX if not provided. |

#### Returns

`void`

***

### setScale()

> **setScale**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:217](https://github.com/redcamel/RedGPU/blob/2b377a61d3b95ffff57af9f6d71652c384383b56/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L217)

Set the scale of the object along the x, y, and z axes.
If only the x parameter is provided, the object is uniformly scaled along all axes.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | The scale factor along the x-axis. |
| `y?` | `number` | The scale factor along the y-axis. Defaults to the value of x. |
| `z?` | `number` | The scale factor along the z-axis. Defaults to the value of x. |

#### Returns

`void`
