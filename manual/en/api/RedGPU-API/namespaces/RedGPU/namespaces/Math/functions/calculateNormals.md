[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / calculateNormals

# Function: calculateNormals()

> **calculateNormals**(`vertexArray`, `indexArray`): `number`[]

Defined in: [src/math/calculateNormals.ts:24](https://github.com/redcamel/RedGPU/blob/3f2479cb923d5cf594209ed38cdda688909e57d0/src/math/calculateNormals.ts#L24)

Calculates vertex normals from vertex and index arrays.

Calculates face normals, then returns averaged and normalized vertex normals.

### Example
```typescript
const normals = RedGPU.math.calculateNormals(vertices, indices);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `vertexArray` | `number`[] | Vertex position array (x, y, z order) |
| `indexArray` | `number`[] | Vertex index array defining triangles |

## Returns

`number`[]

Calculated vertex normal array
