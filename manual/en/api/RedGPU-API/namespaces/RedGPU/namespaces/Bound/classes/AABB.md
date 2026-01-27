[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Bound](../README.md) / AABB

# Class: AABB

Defined in: [src/bound/AABB.ts:18](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/bound/AABB.ts#L18)


3D Axis-Aligned Bounding Box (AABB) class.


Defines a bounding box parallel to each axis and provides intersection and containment tests.

* ### Example
```typescript
const aabb = new RedGPU.Bound.AABB(-1, 1, -1, 1, -1, 1);
const intersects = aabb.intersects(otherAABB);
```

## Constructors

### Constructor

> **new AABB**(`minX`, `maxX`, `minY`, `maxY`, `minZ`, `maxZ`): `AABB`

Defined in: [src/bound/AABB.ts:108](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/bound/AABB.ts#L108)


Creates an AABB instance.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `minX` | `number` | Minimum X value |
| `maxX` | `number` | Maximum X value |
| `minY` | `number` | Minimum Y value |
| `maxY` | `number` | Maximum Y value |
| `minZ` | `number` | Minimum Z value |
| `maxZ` | `number` | Maximum Z value |

#### Returns

`AABB`

## Properties

### centerX

> `readonly` **centerX**: `number`

Defined in: [src/bound/AABB.ts:53](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/bound/AABB.ts#L53)


Center X coordinate

***

### centerY

> `readonly` **centerY**: `number`

Defined in: [src/bound/AABB.ts:58](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/bound/AABB.ts#L58)


Center Y coordinate

***

### centerZ

> `readonly` **centerZ**: `number`

Defined in: [src/bound/AABB.ts:63](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/bound/AABB.ts#L63)


Center Z coordinate

***

### geometryRadius

> `readonly` **geometryRadius**: `number`

Defined in: [src/bound/AABB.ts:83](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/bound/AABB.ts#L83)


Distance from center to vertex (radius)

***

### maxX

> `readonly` **maxX**: `number`

Defined in: [src/bound/AABB.ts:28](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/bound/AABB.ts#L28)


Maximum X value

***

### maxY

> `readonly` **maxY**: `number`

Defined in: [src/bound/AABB.ts:38](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/bound/AABB.ts#L38)


Maximum Y value

***

### maxZ

> `readonly` **maxZ**: `number`

Defined in: [src/bound/AABB.ts:48](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/bound/AABB.ts#L48)


Maximum Z value

***

### minX

> `readonly` **minX**: `number`

Defined in: [src/bound/AABB.ts:23](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/bound/AABB.ts#L23)


Minimum X value

***

### minY

> `readonly` **minY**: `number`

Defined in: [src/bound/AABB.ts:33](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/bound/AABB.ts#L33)


Minimum Y value

***

### minZ

> `readonly` **minZ**: `number`

Defined in: [src/bound/AABB.ts:43](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/bound/AABB.ts#L43)


Minimum Z value

***

### xSize

> `readonly` **xSize**: `number`

Defined in: [src/bound/AABB.ts:68](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/bound/AABB.ts#L68)


X size

***

### ySize

> `readonly` **ySize**: `number`

Defined in: [src/bound/AABB.ts:73](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/bound/AABB.ts#L73)


Y size

***

### zSize

> `readonly` **zSize**: `number`

Defined in: [src/bound/AABB.ts:78](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/bound/AABB.ts#L78)


Z size

## Methods

### clone()

> **clone**(): `AABB`

Defined in: [src/bound/AABB.ts:189](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/bound/AABB.ts#L189)


Clones the AABB instance.

#### Returns

`AABB`


Cloned AABB instance

***

### contains()

> **contains**(`pointOrX`, `y?`, `z?`): `boolean`

Defined in: [src/bound/AABB.ts:168](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/bound/AABB.ts#L168)


Returns whether a point or coordinate is contained within the AABB.

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

Defined in: [src/bound/AABB.ts:142](https://github.com/redcamel/RedGPU/blob/087135bb59cb0a419d28cd53f7eaeb5c0e6a15bd/src/bound/AABB.ts#L142)


Returns whether it intersects with another AABB.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `other` | `AABB` | AABB instance to check for intersection |

#### Returns

`boolean`


True if intersecting, otherwise false
