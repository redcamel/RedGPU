[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Math](../../../README.md) / [vec3](../README.md) / transformQuat

# Function: transformQuat()

> **transformQuat**(`out`, `a`, `q`): [`vec3`](../../../type-aliases/vec3.md)

Defined in: node\_modules/gl-matrix/index.d.ts:1786

Transforms the vec3 with a quat
Can also be used for dual quaternions. (Multiply it with the real part)

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out` | [`vec3`](../../../type-aliases/vec3.md) | the receiving vector |
| `a` | `ReadonlyVec3` | the vector to transform |
| `q` | `ReadonlyQuat` | normalized quaternion to transform with |

## Returns

[`vec3`](../../../type-aliases/vec3.md)

out
