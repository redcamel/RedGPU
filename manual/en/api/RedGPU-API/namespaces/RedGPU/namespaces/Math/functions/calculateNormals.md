[**RedGPU API v4.6.0**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / calculateNormals

# Function: calculateNormals()

> **calculateNormals**(`vertexArray`, `indexArray`): `Float32Array`

Defined in: [src/math/calculateNormals.ts:21](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/math/calculateNormals.ts#L21)

Calculates a normalized vertex normal vector array from vertex position and triangle index arrays.

### Example
```typescript
const normals = RedGPU.Math.calculateNormals(vertices, indices);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `vertexArray` | `number`[] \| `Float32Array`\<`ArrayBufferLike`\> | Vertex position array (`[x, y, z, ...]`) |
| `indexArray` | `number`[] \| `Uint16Array`\<`ArrayBufferLike`\> \| `Uint32Array`\<`ArrayBufferLike`\> | Triangle vertex index array (processed in vertex order if empty) |

## Returns

`Float32Array`

Normalized vertex normal vector array (`Float32Array`, `[nx, ny, nz, ...]`)
