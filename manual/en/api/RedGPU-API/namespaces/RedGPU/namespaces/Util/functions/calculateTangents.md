[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / calculateTangents

# Function: calculateTangents()

> **calculateTangents**(`vertices`, `normals`, `uvs`, `indices`, `existingTangents?`): `number`[]

Defined in: [src/utils/math/calculateTangents.ts:30](https://github.com/redcamel/RedGPU/blob/63b6c0b28961b0dbe9fddafb11b9ffeb0ec23759/src/utils/math/calculateTangents.ts#L30)


Calculates vertex tangent vectors using MikkTSpace algorithm.

* ### Example
```typescript
const tangents = RedGPU.Util.calculateTangents(vertices, normals, uvs, indices);
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
