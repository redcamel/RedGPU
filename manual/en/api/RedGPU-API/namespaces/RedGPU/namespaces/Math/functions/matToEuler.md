[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / matToEuler

# Function: matToEuler()

> **matToEuler**(`mat`, `dest`, `order?`): `any`

Defined in: [src/math/mat4ToEuler.ts:24](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/math/mat4ToEuler.ts#L24)

Extracts Euler angles in radians from the upper 3x3 components of a column-major 4x4 rotation matrix.

### Example
```typescript
const euler = RedGPU.Math.matToEuler(matrix, [0, 0, 0], 'XYZ');
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `mat` | `any` | Unscaled 4x4 rotation matrix (column-major) |
| `dest` | `any` | Destination array to store the result (default: `[0, 0, 0]`) |
| `order?` | `any` | Rotation axis order (`'XYZ'`, `'YXZ'`, `'ZXY'`, `'ZYX'`, `'YZX'`, `'XZY'`, default: `'XYZ'`) |

## Returns

`any`

Euler rotation angle array in radians (`[x, y, z]`)
