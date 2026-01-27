[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / calculateNormals

# Function: calculateNormals()

> **calculateNormals**(`vertexArray`, `indexArray`): `number`[]

Defined in: [src/utils/math/calculateNormals.ts:24](https://github.com/redcamel/RedGPU/blob/a5ea77ed71610f8cfa1c2a662d1aad95bee20f8b/src/utils/math/calculateNormals.ts#L24)


Calculates vertex normals from vertex and index arrays.


Calculates face normals, then returns averaged and normalized vertex normals.

* ### Example
```typescript
const normals = RedGPU.Util.calculateNormals(vertices, indices);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `vertexArray` | `number`[] | Vertex position array (x, y, z order) |
| `indexArray` | `number`[] | Vertex index array defining triangles |

## Returns

`number`[]


Calculated vertex normal array
