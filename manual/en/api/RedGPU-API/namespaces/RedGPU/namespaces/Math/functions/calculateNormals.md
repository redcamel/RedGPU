[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / calculateNormals

# Function: calculateNormals()

> **calculateNormals**(`vertexArray`, `indexArray`): `number`[]

Defined in: [src/math/calculateNormals.ts:21](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/math/calculateNormals.ts#L21)

Calculates a normalized vertex normal vector array from vertex position and triangle index arrays.

### Example
```typescript
const normals = RedGPU.Math.calculateNormals(vertices, indices);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `vertexArray` | `number`[] | Vertex position array (`[x, y, z, ...]`) |
| `indexArray` | `number`[] | Triangle vertex index array (processed in vertex order if empty) |

## Returns

`number`[]

Normalized vertex normal vector array (`[nx, ny, nz, ...]`)
