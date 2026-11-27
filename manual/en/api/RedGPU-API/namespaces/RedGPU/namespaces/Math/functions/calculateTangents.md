[**RedGPU API v4.6.0**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / calculateTangents

# Function: calculateTangents()

> **calculateTangents**(`vertices`, `normals`, `uvs`, `indices`): `Float32Array`

Defined in: [src/math/calculateTangents.ts:166](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/math/calculateTangents.ts#L166)

Calculates and returns vertex tangent vectors (`Float32Array`) based on the MikkTSpace algorithm from vertex position, normal, UV, and index arrays.

### Example
```typescript
const tangents = RedGPU.Math.calculateTangents(vertices, normals, uvs, indices);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `vertices` | `number`[] \| `Float32Array`\<`ArrayBufferLike`\> | Vertex position array (`[x, y, z, ...]`) |
| `normals` | `number`[] \| `Float32Array`\<`ArrayBufferLike`\> | Vertex normal vector array (`[nx, ny, nz, ...]`) |
| `uvs` | `number`[] \| `Float32Array`\<`ArrayBufferLike`\> | UV texture coordinate array (`[u, v, ...]`) |
| `indices` | `number`[] \| `Uint32Array`\<`ArrayBufferLike`\> | Triangle vertex index array |

## Returns

`Float32Array`

Calculated vertex tangent array (`Float32Array`, `[tx, ty, tz, w, ...]`)
