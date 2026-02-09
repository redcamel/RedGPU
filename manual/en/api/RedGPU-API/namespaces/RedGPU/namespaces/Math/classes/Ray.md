[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / Ray

# Class: Ray

Defined in: [src/math/Ray.ts:17](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/math/Ray.ts#L17)


Class representing a ray with an origin and direction in 3D space.


This class provides mathematical operations (box, triangle, etc.) for intersection tests.

### Example
```typescript
const ray = new RedGPU.math.Ray([0, 0, 0], [0, 0, -1]);
```

## Constructors

### Constructor

> **new Ray**(`origin`, `direction`): `Ray`

Defined in: [src/math/Ray.ts:45](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/math/Ray.ts#L45)


Creates a Ray instance.

### Example
```typescript
const ray = new RedGPU.math.Ray([0, 0, 0], [0, 0, 1]);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `origin` | [`vec3`](../type-aliases/vec3.md) | Origin |
| `direction` | [`vec3`](../type-aliases/vec3.md) | Direction |

#### Returns

`Ray`

## Properties

### direction

> **direction**: [`vec3`](../type-aliases/vec3.md)

Defined in: [src/math/Ray.ts:27](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/math/Ray.ts#L27)


Direction vector of the ray (normalization recommended)

***

### origin

> **origin**: [`vec3`](../type-aliases/vec3.md)

Defined in: [src/math/Ray.ts:22](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/math/Ray.ts#L22)


Origin of the ray

## Methods

### applyMatrix4()

> **applyMatrix4**(`matrix`): `Ray`

Defined in: [src/math/Ray.ts:92](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/math/Ray.ts#L92)


Transforms the ray using a matrix.

::: warning

This method modifies the instance directly (in-place). If you need to preserve the original ray state, use it with `.clone()`.
:::

### Example
```typescript
// 원본 수정 (In-place)
ray.applyMatrix4(matrix);

// 원본 보존 (Preserve original)
const transformedRay = ray.clone().applyMatrix4(matrix);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `matrix` | [`mat4`](../type-aliases/mat4.md) | 4x4 transformation matrix |

#### Returns

`Ray`


The transformed self

***

### clone()

> **clone**(): `Ray`

Defined in: [src/math/Ray.ts:63](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/math/Ray.ts#L63)


Clones the current Ray instance.

### Example
```typescript
const clonedRay = ray.clone();
```

#### Returns

`Ray`


Cloned Ray instance

***

### intersectBox()

> **intersectBox**(`aabb`): `boolean`

Defined in: [src/math/Ray.ts:120](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/math/Ray.ts#L120)


Determines intersection with an AABB box (Slabs algorithm).

### Example
```typescript
const intersects = ray.intersectBox(aabb);
```

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `aabb` | [`AABB`](../../Bound/classes/AABB.md) | Target AABB box |

#### Returns

`boolean`


Whether it intersects

***

### intersectTriangle()

> **intersectTriangle**(`v0`, `v1`, `v2`, `backfaceCulling`): [`vec3`](../type-aliases/vec3.md)

Defined in: [src/math/Ray.ts:170](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/math/Ray.ts#L170)


Calculates the intersection point with a triangle (Möller-Trumbore algorithm).

### Example
```typescript
const point = ray.intersectTriangle(v0, v1, v2);
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `v0` | [`vec3`](../type-aliases/vec3.md) | `undefined` | Vertex 0 |
| `v1` | [`vec3`](../type-aliases/vec3.md) | `undefined` | Vertex 1 |
| `v2` | [`vec3`](../type-aliases/vec3.md) | `undefined` | Vertex 2 |
| `backfaceCulling` | `boolean` | `true` | Whether to use backface culling |

#### Returns

[`vec3`](../type-aliases/vec3.md)


Intersection point (vec3) or null

***

### intersectTriangleBarycentric()

> **intersectTriangleBarycentric**(`v0`, `v1`, `v2`, `backfaceCulling`): `object`

Defined in: [src/math/Ray.ts:238](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/math/Ray.ts#L238)


Calculates the intersection point and barycentric coordinates with a triangle.

### Example
```typescript
const result = ray.intersectTriangleBarycentric(v0, v1, v2);
if (result) {
    console.log(result.point, result.u, result.v);
}
```

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `v0` | [`vec3`](../type-aliases/vec3.md) | `undefined` | Vertex 0 |
| `v1` | [`vec3`](../type-aliases/vec3.md) | `undefined` | Vertex 1 |
| `v2` | [`vec3`](../type-aliases/vec3.md) | `undefined` | Vertex 2 |
| `backfaceCulling` | `boolean` | `true` | Whether to use backface culling |

#### Returns

`object`


Intersection info ({point, t, u, v}) or null

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `point` | [`vec3`](../type-aliases/vec3.md) | [src/math/Ray.ts:238](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/math/Ray.ts#L238) |
| `t` | `number` | [src/math/Ray.ts:238](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/math/Ray.ts#L238) |
| `u` | `number` | [src/math/Ray.ts:238](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/math/Ray.ts#L238) |
| `v` | `number` | [src/math/Ray.ts:238](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/math/Ray.ts#L238) |
