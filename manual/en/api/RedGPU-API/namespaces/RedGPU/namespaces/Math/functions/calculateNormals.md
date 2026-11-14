[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / calculateNormals

# Function: calculateNormals()

> **calculateNormals**(`vertexArray`, `indexArray`): `number`[]

Defined in: [src/math/calculateNormals.ts:21](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/math/calculateNormals.ts#L21)

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
