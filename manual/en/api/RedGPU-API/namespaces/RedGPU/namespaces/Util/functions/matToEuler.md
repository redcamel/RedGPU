[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / matToEuler

# Function: matToEuler()

> **matToEuler**(`mat`, `dest`, `order?`): `any`

Defined in: [src/utils/math/mat4ToEuler.ts:24](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/utils/math/mat4ToEuler.ts#L24)


Extracts Euler angles from a 4x4 matrix.

* ### Example
```typescript
const euler = RedGPU.Util.matToEuler(matrix, [0, 0, 0], 'XYZ');
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `mat` | `any` | 4x4 matrix |
| `dest` | `any` | Destination array to store result |
| `order?` | `any` | Rotation order (Default: 'XYZ') |

## Returns

`any`


Array containing Euler angles [x, y, z]
