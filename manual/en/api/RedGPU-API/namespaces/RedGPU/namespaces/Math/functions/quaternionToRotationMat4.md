[**RedGPU API v4.6.0**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / quaternionToRotationMat4

# Function: quaternionToRotationMat4()

> **quaternionToRotationMat4**(`q`, `m`): `any`

Defined in: [src/math/quaternionToRotationMat4.ts:21](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/math/quaternionToRotationMat4.ts#L21)

Converts a quaternion (`[x, y, z, w]`) into a column-major 4x4 rotation matrix.

### Example
```typescript
RedGPU.Math.quaternionToRotationMat4([0, 0, 0, 1], outMatrix);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `q` | `any` | Quaternion array (`[x, y, z, w]`) |
| `m` | `any` | Target 4x4 matrix buffer to store the result |

## Returns

`any`

Converted 4x4 rotation matrix (`m`)
