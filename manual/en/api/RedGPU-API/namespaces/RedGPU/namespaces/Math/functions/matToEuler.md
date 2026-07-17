[**RedGPU API v4.3.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / matToEuler

# Function: matToEuler()

> **matToEuler**(`mat`, `dest`, `order?`): `any`

Defined in: [src/math/mat4ToEuler.ts:24](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/math/mat4ToEuler.ts#L24)

Extracts Euler angles from a 4x4 matrix.

### Example
```typescript
const euler = RedGPU.math.matToEuler(matrix, [0, 0, 0], 'XYZ');
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
