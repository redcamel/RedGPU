[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / calculateTangents

# Function: calculateTangents()

> **calculateTangents**(`vertices`, `normals`, `uvs`, `indices`, `existingTangents?`): `number`[]

Defined in: [src/math/calculateTangents.ts:30](https://github.com/redcamel/RedGPU/blob/679a4dd32b59905529e39631a371e5e3eb5fce15/src/math/calculateTangents.ts#L30)


Calculates vertex tangent vectors using MikkTSpace algorithm.

### Example
```typescript
const tangents = RedGPU.math.calculateTangents(vertices, normals, uvs, indices);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `vertices` | `number`[] | Vertex position array |
| `normals` | `number`[] | Normal vector array |
| `uvs` | `number`[] | UV coordinate array |
| `indices` | `number`[] | Index array |
| `existingTangents?` | `number`[] | Existing tangent array (optional) |

## Returns

`number`[]


Calculated tangent array [x, y, z, w, ...]
