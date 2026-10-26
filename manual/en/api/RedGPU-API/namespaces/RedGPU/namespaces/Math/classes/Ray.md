[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / Ray

# Class: Ray

Defined in: [src/math/Ray.ts:16](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/Ray.ts#L16)

Ray class with a 3D `origin` and `direction` vector that performs intersection tests against AABBs and triangles.

### Example
```typescript
const ray = new RedGPU.Math.Ray([0, 0, 0], [0, 0, -1]);
```

## See

[Mouse Event Raycasting example](https://redcamel.github.io/RedGPU/examples/3d/interaction/mouseEvent/raycasting/)

## Constructors

### Constructor

> **new Ray**(`origin?`, `direction?`): `Ray`

Defined in: [src/math/Ray.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/Ray.ts#L44)

Creates a `Ray` instance with the specified origin and direction vector.

#### Example
```typescript
const ray = new RedGPU.Math.Ray([0, 0, 0], [0, 0, -1]);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `origin?` | [`vec3`](../type-aliases/vec3.md) | Origin of the ray (default: `[0, 0, 0]`) |
| `direction?` | [`vec3`](../type-aliases/vec3.md) | Direction vector of the ray (default: `[0, 0, -1]`) |

#### Returns

`Ray`

## Properties

### direction

> **direction**: [`vec3`](../type-aliases/vec3.md)

Defined in: [src/math/Ray.ts:26](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/Ray.ts#L26)

Normalized direction vector of the ray (`vec3`)

***

### origin

> **origin**: [`vec3`](../type-aliases/vec3.md)

Defined in: [src/math/Ray.ts:21](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/Ray.ts#L21)

Origin coordinates of the ray (`vec3`)

## Methods

### applyMatrix4()

> **applyMatrix4**(`matrix`): `Ray`

Defined in: [src/math/Ray.ts:93](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/Ray.ts#L93)

Applies a 4x4 transformation matrix to the ray's origin and direction vector in-place and normalizes the direction vector.

::: warning
This method modifies the instance in-place. Use with `clone()` if the original ray must be preserved.
:::

#### Example
```typescript
// Transform original ray in-place
ray.applyMatrix4(matrix);

// Preserve original and transform clone
const transformedRay = ray.clone().applyMatrix4(matrix);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `matrix` | [`mat4`](../type-aliases/mat4.md) | 4x4 transformation matrix to apply (`mat4`) |

#### Returns

`Ray`

The transformed current `Ray` instance (`this`)

***

### clone()

> **clone**(): `Ray`

Defined in: [src/math/Ray.ts:62](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/Ray.ts#L62)

Returns a new `Ray` instance with copied origin and direction.

#### Example
```typescript
const clonedRay = ray.clone();
```

#### Returns

`Ray`

Cloned `Ray` instance

***

### intersectBox()

> **intersectBox**(`aabb`): `boolean`

Defined in: [src/math/Ray.ts:120](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/Ray.ts#L120)

Determines whether the ray intersects an `AABB` bounding box using the Slabs algorithm.

#### Example
```typescript
const isHit = ray.intersectBox(aabb);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `aabb` | [`AABB`](../../Bound/classes/AABB.md) | Target `AABB` instance to test for intersection |

#### Returns

`boolean`

Whether the ray intersects the box (`boolean`)

***

### intersectTriangle()

> **intersectTriangle**(`v0`, `v1`, `v2`, `backfaceCulling?`): [`vec3`](../type-aliases/vec3.md)

Defined in: [src/math/Ray.ts:170](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/Ray.ts#L170)

Calculates the intersection point between the ray and a triangle using the Möller-Trumbore algorithm.

#### Example
```typescript
const hitPoint = ray.intersectTriangle(v0, v1, v2, true);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `v0` | [`vec3`](../type-aliases/vec3.md) | `undefined` | First vertex of the triangle (`vec3`) |
| `v1` | [`vec3`](../type-aliases/vec3.md) | `undefined` | Second vertex of the triangle (`vec3`) |
| `v2` | [`vec3`](../type-aliases/vec3.md) | `undefined` | Third vertex of the triangle (`vec3`) |
| `backfaceCulling?` | `boolean` | `true` | Whether to apply backface culling (default: `true`) |

#### Returns

[`vec3`](../type-aliases/vec3.md)

Intersection point coordinates (`vec3`) or `null` if no intersection

***

### intersectTriangleBarycentric()

> **intersectTriangleBarycentric**(`v0`, `v1`, `v2`, `backfaceCulling?`): `object`

Defined in: [src/math/Ray.ts:238](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/Ray.ts#L238)

Calculates the intersection point, distance (`t`), and barycentric coordinates (`u`, `v`) between the ray and a triangle.

#### Example
```typescript
const hit = ray.intersectTriangleBarycentric(v0, v1, v2);
if (hit) {
    console.log(hit.point, hit.t, hit.u, hit.v);
}
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `v0` | [`vec3`](../type-aliases/vec3.md) | `undefined` | First vertex of the triangle (`vec3`) |
| `v1` | [`vec3`](../type-aliases/vec3.md) | `undefined` | Second vertex of the triangle (`vec3`) |
| `v2` | [`vec3`](../type-aliases/vec3.md) | `undefined` | Third vertex of the triangle (`vec3`) |
| `backfaceCulling?` | `boolean` | `true` | Whether to apply backface culling (default: `true`) |

#### Returns

`object`

Intersection info object (`{ point: vec3, t: number, u: number, v: number }`) or `null` if no intersection

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `point` | [`vec3`](../type-aliases/vec3.md) | [src/math/Ray.ts:239](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/Ray.ts#L239) |
| `t` | `number` | [src/math/Ray.ts:240](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/Ray.ts#L240) |
| `u` | `number` | [src/math/Ray.ts:241](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/Ray.ts#L241) |
| `v` | `number` | [src/math/Ray.ts:242](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/Ray.ts#L242) |
