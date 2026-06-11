[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / calculateTangents

# Function: calculateTangents()

> **calculateTangents**(`vertices`, `normals`, `uvs`, `indices`): `Float32Array`

Defined in: [src/math/calculateTangents.ts:131](https://github.com/redcamel/RedGPU/blob/3d0e87c793f11123b8dcd1969f9b5adb42f2200e/src/math/calculateTangents.ts#L131)

Calculates vertex tangent vectors and returns them as a new array. (Pure math utility)

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `vertices` | `number`[] \| `Float32Array`\<`ArrayBufferLike`\> | Vertex position array |
| `normals` | `number`[] \| `Float32Array`\<`ArrayBufferLike`\> | Normal vector array |
| `uvs` | `number`[] \| `Float32Array`\<`ArrayBufferLike`\> | UV coordinate array |
| `indices` | `number`[] \| `Uint32Array`\<`ArrayBufferLike`\> | Index data |

## Returns

`Float32Array`

Calculated tangent array [x, y, z, w, ...]
