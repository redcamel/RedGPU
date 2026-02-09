[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Math](../README.md) / quaternionToRotationMat4

# Function: quaternionToRotationMat4()

> **quaternionToRotationMat4**(`q`, `m`): `any`

Defined in: [src/math/quaternionToRotationMat4.ts:21](https://github.com/redcamel/RedGPU/blob/53d960064b98622dd416b4a8f7a962ba471077f1/src/math/quaternionToRotationMat4.ts#L21)


Converts a quaternion to a rotation matrix.

### Example
```typescript
RedGPU.math.quaternionToRotationMat4([0, 0, 0, 1], outMatrix);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `q` | `any` | Quaternion [x, y, z, w] |
| `m` | `any` | Destination 4x4 matrix |

## Returns

`any`


Converted rotation matrix
