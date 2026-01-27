[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Util](../README.md) / quaternionToRotationMat4

# Function: quaternionToRotationMat4()

> **quaternionToRotationMat4**(`q`, `m`): `any`

Defined in: [src/utils/math/quaternionToRotationMat4.ts:21](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/utils/math/quaternionToRotationMat4.ts#L21)


Converts a quaternion to a rotation matrix.

* ### Example
```typescript
RedGPU.Util.quaternionToRotationMat4([0, 0, 0, 1], outMatrix);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `q` | `any` | Quaternion [x, y, z, w] |
| `m` | `any` | Destination 4x4 matrix |

## Returns

`any`


Converted rotation matrix
