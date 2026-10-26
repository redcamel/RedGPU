[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Bound](../README.md) / OBB

# Class: OBB

Defined in: [src/bound/OBB.ts:19](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/OBB.ts#L19)

3D Oriented Bounding Box (OBB) class.

Defines an oriented bounding box using center coordinates, half-extents along three axes, and an orientation matrix (`mat4`), providing Separating Axis Theorem (SAT) intersection and point containment tests.

### Example
```typescript
const obb = new RedGPU.Bound.OBB([0, 0, 0], [1, 1, 1], orientationMatrix);
const intersects = obb.intersects(otherOBB);
```

## Constructors

### Constructor

> **new OBB**(`center`, `halfExtents`, `orientation`): `OBB`

Defined in: [src/bound/OBB.ts:90](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/OBB.ts#L90)

Creates an `OBB` instance.

#### Example
```typescript
const obb = new RedGPU.Bound.OBB([0, 0, 0], [1, 2, 1], orientationMatrix);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `center` | \[`number`, `number`, `number`\] | Center coordinates `[x, y, z]` |
| `halfExtents` | \[`number`, `number`, `number`\] | Half extents `[x, y, z]` along each axis |
| `orientation` | [`mat4`](../../Math/type-aliases/mat4.md) | 4x4 orientation matrix (`mat4`) |

#### Returns

`OBB`

## Properties

### center

> <span class="readonly-badge">readonly</span> **center**: \[`number`, `number`, `number`\]

Defined in: [src/bound/OBB.ts:59](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/OBB.ts#L59)

Center coordinates `[x, y, z]` tuple of the bounding box.

***

### centerX

> <span class="readonly-badge">readonly</span> **centerX**: `number`

Defined in: [src/bound/OBB.ts:24](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/OBB.ts#L24)

Center X coordinate.

***

### centerY

> <span class="readonly-badge">readonly</span> **centerY**: `number`

Defined in: [src/bound/OBB.ts:29](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/OBB.ts#L29)

Center Y coordinate.

***

### centerZ

> <span class="readonly-badge">readonly</span> **centerZ**: `number`

Defined in: [src/bound/OBB.ts:34](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/OBB.ts#L34)

Center Z coordinate.

***

### geometryRadius

> <span class="readonly-badge">readonly</span> **geometryRadius**: `number`

Defined in: [src/bound/OBB.ts:69](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/OBB.ts#L69)

Euclidean distance from the center of the bounding box to a corner vertex (bounding sphere radius).

***

### halfExtents

> <span class="readonly-badge">readonly</span> **halfExtents**: \[`number`, `number`, `number`\]

Defined in: [src/bound/OBB.ts:64](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/OBB.ts#L64)

Half extents `[x, y, z]` tuple along the three axes of the bounding box.

***

### halfExtentX

> <span class="readonly-badge">readonly</span> **halfExtentX**: `number`

Defined in: [src/bound/OBB.ts:39](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/OBB.ts#L39)

Half extent along the local X-axis.

***

### halfExtentY

> <span class="readonly-badge">readonly</span> **halfExtentY**: `number`

Defined in: [src/bound/OBB.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/OBB.ts#L44)

Half extent along the local Y-axis.

***

### halfExtentZ

> <span class="readonly-badge">readonly</span> **halfExtentZ**: `number`

Defined in: [src/bound/OBB.ts:49](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/OBB.ts#L49)

Half extent along the local Z-axis.

***

### orientation

> <span class="readonly-badge">readonly</span> **orientation**: [`mat4`](../../Math/type-aliases/mat4.md)

Defined in: [src/bound/OBB.ts:54](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/OBB.ts#L54)

4x4 matrix (`mat4`) representing the rotational orientation of the bounding box.

## Methods

### clone()

> **clone**(): `OBB`

Defined in: [src/bound/OBB.ts:204](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/OBB.ts#L204)

Clones and returns a new `OBB` instance with the same properties as the current `OBB`.

#### Example
```typescript
const clonedOBB = obb.clone();
```

#### Returns

`OBB`

Cloned `OBB` instance

***

### contains()

> **contains**(`pointOrX`, `y?`, `z?`): `boolean`

Defined in: [src/bound/OBB.ts:173](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/OBB.ts#L173)

Checks whether the specified 3D coordinate or point is contained within the `OBB`.

#### Example
```typescript
const isInside = obb.contains(0, 0, 0);
const isPointInside = obb.contains([0, 0, 0]);
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

### intersects()

> **intersects**(`other`): `boolean`

Defined in: [src/bound/OBB.ts:127](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/bound/OBB.ts#L127)

Determines whether this box intersects with another `OBB` instance using the Separating Axis Theorem (SAT).

#### Example
```typescript
const isIntersecting = obb.intersects(otherOBB);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `other` | `OBB` | Target `OBB` instance to test for intersection |

#### Returns

`boolean`

`true` if intersecting, otherwise `false`
