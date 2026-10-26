[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreInstancingMesh](../README.md) / instancingMeshObject3D

# Class: instancingMeshObject3D

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:35](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L35)

Class that controls the transform and opacity of an individual instance in an instanced mesh.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

### Example
```typescript
// Correct access method
const instance = instancingMesh.instanceChildren[0];
instance.setPosition(10, 0, 0);
```

## Constructors

### Constructor

> **new instancingMeshObject3D**(`redGPUContext`, `location`, `instancingMesh`): `InstancingMeshObject3D`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:86](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L86)

Creates an InstancingMeshObject3D instance.

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

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:45](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L45)

Local matrix of the instance

***

### modelMatrix

> **modelMatrix**: [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:40](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L40)

Model matrix of the instance

***

### normalModelMatrix

> **normalModelMatrix**: [`mat4`](../../../../Math/type-aliases/mat4.md)

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:50](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L50)

Normal model matrix of the instance

## Accessors

### opacity

#### Get Signature

> **get** **opacity**(): `number`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:102](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L102)

Gets or sets the opacity (0.0 to 1.0) of the instance.

##### Returns

`number`

Opacity value

#### Set Signature

> **set** **opacity**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:106](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L106)

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

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:171](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L171)

Gets the position array (`[x, y, z]`) of the instance or sets all axes to a single value.

##### Returns

`number`[]

Position array (`[x, y, z]`)

#### Set Signature

> **set** **position**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:175](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L175)

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

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:311](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L311)

Gets the rotation angle array (`[rotationX, rotationY, rotationZ]`) of the instance or sets all axes to a single value.

##### Returns

`number`[]

Rotation angle array (`[rotationX, rotationY, rotationZ]`)

#### Set Signature

> **set** **rotation**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:315](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L315)

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

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:260](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L260)

Gets or sets the X-axis rotation angle (in degrees) of the instance.

##### Returns

`number`

X-axis rotation angle (in degrees)

#### Set Signature

> **set** **rotationX**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:264](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L264)

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

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:277](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L277)

Gets or sets the Y-axis rotation angle (in degrees) of the instance.

##### Returns

`number`

Y-axis rotation angle (in degrees)

#### Set Signature

> **set** **rotationY**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:281](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L281)

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

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:294](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L294)

Gets or sets the Z-axis rotation angle (in degrees) of the instance.

##### Returns

`number`

Z-axis rotation angle (in degrees)

#### Set Signature

> **set** **rotationZ**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:298](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L298)

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

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:241](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L241)

Gets the scale array (`[scaleX, scaleY, scaleZ]`) of the instance or sets all axes to a single value.

##### Returns

`number`[]

Scale array (`[scaleX, scaleY, scaleZ]`)

#### Set Signature

> **set** **scale**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:245](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L245)

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

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:190](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L190)

Gets or sets the X-axis scale of the instance.

##### Returns

`number`

X-axis scale

#### Set Signature

> **set** **scaleX**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:194](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L194)

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

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:207](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L207)

Gets or sets the Y-axis scale of the instance.

##### Returns

`number`

Y-axis scale

#### Set Signature

> **set** **scaleY**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:211](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L211)

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

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:224](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L224)

Gets or sets the Z-axis scale of the instance.

##### Returns

`number`

Z-axis scale

#### Set Signature

> **set** **scaleZ**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:228](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L228)

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

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:120](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L120)

Gets or sets the X-axis position of the instance.

##### Returns

`number`

X-axis coordinate

#### Set Signature

> **set** **x**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:124](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L124)

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

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:137](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L137)

Gets or sets the Y-axis position of the instance.

##### Returns

`number`

Y-axis coordinate

#### Set Signature

> **set** **y**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:141](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L141)

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

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:154](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L154)

Gets or sets the Z-axis position of the instance.

##### Returns

`number`

Z-axis coordinate

#### Set Signature

> **set** **z**(`value`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:158](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L158)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

## Methods

### destroy()

> **destroy**(): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:413](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L413)

Releases internal references of the instance.

#### Returns

`void`

***

### setPosition()

> **setPosition**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:370](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L370)

Sets the X, Y, and Z-axis position of the instance. If `y` and `z` are omitted, they default to `x`.

#### Example
```typescript
instance.setPosition(10, 20, 30);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X-axis coordinate |
| `y?` | `number` | Y-axis coordinate (optional, default: `x`) |
| `z?` | `number` | Z-axis coordinate (optional, default: `x`) |

#### Returns

`void`

***

### setRotation()

> **setRotation**(`rotationX`, `rotationY?`, `rotationZ?`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:399](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L399)

Sets the X, Y, and Z-axis rotation angles (in degrees) of the instance. If `rotationY` and `rotationZ` are omitted, they default to `rotationX`.

#### Example
```typescript
instance.setRotation(45, 90, 0);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rotationX` | `number` | X-axis rotation angle (in degrees) |
| `rotationY?` | `number` | Y-axis rotation angle (in degrees, optional, default: `rotationX`) |
| `rotationZ?` | `number` | Z-axis rotation angle (in degrees, optional, default: `rotationX`) |

#### Returns

`void`

***

### setScale()

> **setScale**(`x`, `y?`, `z?`): `void`

Defined in: [src/display/instancingMesh/core/InstancingMeshObject3D.ts:341](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/instancingMesh/core/InstancingMeshObject3D.ts#L341)

Sets the X, Y, and Z-axis scale of the instance. If `y` and `z` are omitted, they default to `x`.

#### Example
```typescript
instance.setScale(2, 2, 2);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `x` | `number` | X-axis scale |
| `y?` | `number` | Y-axis scale (optional, default: `x`) |
| `z?` | `number` | Z-axis scale (optional, default: `x`) |

#### Returns

`void`
