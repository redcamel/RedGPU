[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Bound](../README.md) / OBB

# Class: OBB

Defined in: [src/bound/OBB.ts:19](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/bound/OBB.ts#L19)


3D Oriented Bounding Box (OBB) class.


Defines a bounding box with arbitrary orientation and provides SAT-based intersection and containment tests.

* ### Example
```typescript
const obb = new RedGPU.Bound.OBB([0, 0, 0], [1, 1, 1], orientationMatrix);
const intersects = obb.intersects(otherOBB);
```

## Constructors

### Constructor

> **new OBB**(`center`, `halfExtents`, `orientation`): `OBB`

Defined in: [src/bound/OBB.ts:85](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/bound/OBB.ts#L85)


Creates an OBB instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `center` | \[`number`, `number`, `number`\] | Center coordinates [x, y, z] |
| `halfExtents` | \[`number`, `number`, `number`\] | Half extents [x, y, z] |
| `orientation` | [`mat4`](../../Math/type-aliases/mat4.md) | Orientation matrix (mat4) |

#### Returns

`OBB`

## Properties

### center

> `readonly` **center**: \[`number`, `number`, `number`\]

Defined in: [src/bound/OBB.ts:59](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/bound/OBB.ts#L59)


Center coordinates [x, y, z]

***

### centerX

> `readonly` **centerX**: `number`

Defined in: [src/bound/OBB.ts:24](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/bound/OBB.ts#L24)


Center X coordinate

***

### centerY

> `readonly` **centerY**: `number`

Defined in: [src/bound/OBB.ts:29](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/bound/OBB.ts#L29)


Center Y coordinate

***

### centerZ

> `readonly` **centerZ**: `number`

Defined in: [src/bound/OBB.ts:34](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/bound/OBB.ts#L34)


Center Z coordinate

***

### geometryRadius

> `readonly` **geometryRadius**: `number`

Defined in: [src/bound/OBB.ts:69](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/bound/OBB.ts#L69)


Distance from center to vertex (radius)

***

### halfExtents

> `readonly` **halfExtents**: \[`number`, `number`, `number`\]

Defined in: [src/bound/OBB.ts:64](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/bound/OBB.ts#L64)


Half extents [x, y, z]

***

### halfExtentX

> `readonly` **halfExtentX**: `number`

Defined in: [src/bound/OBB.ts:39](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/bound/OBB.ts#L39)


X half extent

***

### halfExtentY

> `readonly` **halfExtentY**: `number`

Defined in: [src/bound/OBB.ts:44](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/bound/OBB.ts#L44)


Y half extent

***

### halfExtentZ

> `readonly` **halfExtentZ**: `number`

Defined in: [src/bound/OBB.ts:49](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/bound/OBB.ts#L49)


Z half extent

***

### orientation

> `readonly` **orientation**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/bound/OBB.ts:54](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/bound/OBB.ts#L54)


Orientation matrix (mat4)

## Methods

### clone()

> **clone**(): `OBB`

Defined in: [src/bound/OBB.ts:186](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/bound/OBB.ts#L186)


Clones the OBB instance.

#### Returns

`OBB`


Cloned OBB instance

***

### contains()

> **contains**(`pointOrX`, `y?`, `z?`): `boolean`

Defined in: [src/bound/OBB.ts:160](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/bound/OBB.ts#L160)


Returns whether a point or coordinate is contained within the OBB.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pointOrX` | `number` \| \[`number`, `number`, `number`\] | [x, y, z] array or x coordinate |
| `y?` | `number` | y coordinate |
| `z?` | `number` | z coordinate |

#### Returns

`boolean`


True if contained, otherwise false

***

### intersects()

> **intersects**(`other`): `boolean`

Defined in: [src/bound/OBB.ts:117](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/bound/OBB.ts#L117)


Returns whether it intersects with another OBB.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `other` | `OBB` | OBB instance to check for intersection |

#### Returns

`boolean`


True if intersecting, otherwise false
