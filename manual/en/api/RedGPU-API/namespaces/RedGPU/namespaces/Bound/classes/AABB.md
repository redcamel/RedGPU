[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Bound](../README.md) / AABB

# Class: AABB

Defined in: [src/bound/AABB.ts:18](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L18)

3D Axis-Aligned Bounding Box (AABB) class.

Calculates the center, size, and radius of a bounding volume based on min/max coordinates along each axis, and tests for intersection and point containment.

### Example
```typescript
const aabb = new RedGPU.Bound.AABB(-1, 1, -1, 1, -1, 1);
const intersects = aabb.intersects(otherAABB);
```

## Constructors

### Constructor

> **new AABB**(`minX?`, `maxX?`, `minY?`, `maxY?`, `minZ?`, `maxZ?`): `AABB`

Defined in: [src/bound/AABB.ts:113](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L113)

Creates an `AABB` instance.

#### Example
```typescript
const aabb = new RedGPU.Bound.AABB(-5, 5, -5, 5, -5, 5);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `minX?` | `number` | `0` | Minimum X value (default: `0`) |
| `maxX?` | `number` | `0` | Maximum X value (default: `0`) |
| `minY?` | `number` | `0` | Minimum Y value (default: `0`) |
| `maxY?` | `number` | `0` | Maximum Y value (default: `0`) |
| `minZ?` | `number` | `0` | Minimum Z value (default: `0`) |
| `maxZ?` | `number` | `0` | Maximum Z value (default: `0`) |

#### Returns

`AABB`

## Properties

### centerX

> <span class="readonly-badge">readonly</span> **centerX**: `number`

Defined in: [src/bound/AABB.ts:53](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L53)

Center X coordinate.

***

### centerY

> <span class="readonly-badge">readonly</span> **centerY**: `number`

Defined in: [src/bound/AABB.ts:58](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L58)

Center Y coordinate.

***

### centerZ

> <span class="readonly-badge">readonly</span> **centerZ**: `number`

Defined in: [src/bound/AABB.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L63)

Center Z coordinate.

***

### geometryRadius

> <span class="readonly-badge">readonly</span> **geometryRadius**: `number`

Defined in: [src/bound/AABB.ts:83](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L83)

Euclidean distance from the center of the bounding box to a corner vertex (bounding sphere radius).

***

### maxX

> <span class="readonly-badge">readonly</span> **maxX**: `number`

Defined in: [src/bound/AABB.ts:28](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L28)

Maximum X coordinate.

***

### maxY

> <span class="readonly-badge">readonly</span> **maxY**: `number`

Defined in: [src/bound/AABB.ts:38](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L38)

Maximum Y coordinate.

***

### maxZ

> <span class="readonly-badge">readonly</span> **maxZ**: `number`

Defined in: [src/bound/AABB.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L48)

Maximum Z coordinate.

***

### minX

> <span class="readonly-badge">readonly</span> **minX**: `number`

Defined in: [src/bound/AABB.ts:23](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L23)

Minimum X coordinate.

***

### minY

> <span class="readonly-badge">readonly</span> **minY**: `number`

Defined in: [src/bound/AABB.ts:33](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L33)

Minimum Y coordinate.

***

### minZ

> <span class="readonly-badge">readonly</span> **minZ**: `number`

Defined in: [src/bound/AABB.ts:43](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L43)

Minimum Z coordinate.

***

### xSize

> <span class="readonly-badge">readonly</span> **xSize**: `number`

Defined in: [src/bound/AABB.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L68)

Total size along the X-axis (`maxX - minX`).

***

### ySize

> <span class="readonly-badge">readonly</span> **ySize**: `number`

Defined in: [src/bound/AABB.ts:73](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L73)

Total size along the Y-axis (`maxY - minY`).

***

### zSize

> <span class="readonly-badge">readonly</span> **zSize**: `number`

Defined in: [src/bound/AABB.ts:78](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L78)

Total size along the Z-axis (`maxZ - minZ`).

## Methods

### clone()

> **clone**(): `AABB`

Defined in: [src/bound/AABB.ts:279](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L279)

Clones and returns a new `AABB` instance with the same bounding values as the current `AABB`.

#### Example
```typescript
const clonedAABB = aabb.clone();
```

#### Returns

`AABB`

Cloned `AABB` instance

***

### contains()

> **contains**(`pointOrX`, `y?`, `z?`): `boolean`

Defined in: [src/bound/AABB.ts:253](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L253)

Checks whether the specified 3D coordinate or point is contained within the `AABB`.

#### Example
```typescript
const isInside = aabb.contains(0, 0, 0);
const isPointInside = aabb.contains([0, 0, 0]);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pointOrX` | `number` \| \[`number`, `number`, `number`\] | `[x, y, z]` coordinate tuple array or X-axis coordinate |
| `y?` | `number` | Y-axis coordinate (used when `pointOrX` is a number) |
| `z?` | `number` | Z-axis coordinate (used when `pointOrX` is a number) |

#### Returns

`boolean`

`true` if contained, otherwise `false`

***

### copy()

> **copy**(`other`): `this`

Defined in: [src/bound/AABB.ts:201](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L201)

Copies the bounding values of another `AABB` instance into the current instance.

#### Example
```typescript
aabb.copy(otherAABB);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `other` | `AABB` | Source `AABB` instance to copy from |

#### Returns

`this`

Updated current `AABB` instance

***

### intersects()

> **intersects**(`other`): `boolean`

Defined in: [src/bound/AABB.ts:221](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L221)

Determines whether this box intersects with another `AABB` instance.

#### Example
```typescript
const isIntersecting = aabb.intersects(otherAABB);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `other` | `AABB` | Target `AABB` instance to test for intersection |

#### Returns

`boolean`

`true` if intersecting, otherwise `false`

***

### set()

> **set**(`minX`, `maxX`, `minY`, `maxY`, `minZ`, `maxZ`): `this`

Defined in: [src/bound/AABB.ts:155](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/AABB.ts#L155)

Updates the bounding coordinates and derived properties of the current `AABB` instance in-place.

#### Example
```typescript
aabb.set(-10, 10, -10, 10, -10, 10);
```

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

`this`

Updated current `AABB` instance
