[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / calculateTangents

# Function: calculateTangents()

> **calculateTangents**(`vertices`, `normals`, `uvs`, `indices`): `Float32Array`

Defined in: [src/math/calculateTangents.ts:166](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/math/calculateTangents.ts#L166)

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
