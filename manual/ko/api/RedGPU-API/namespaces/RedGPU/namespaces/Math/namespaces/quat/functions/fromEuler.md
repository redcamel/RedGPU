[**RedGPU API v4.0.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Math](../../../README.md) / [quat](../README.md) / fromEuler

# Function: fromEuler()

> **fromEuler**(`out`, `x`, `y`, `z`, `order?`): [`quat`](../../../type-aliases/quat.md)

Defined in: node\_modules/gl-matrix/index.d.ts:2429

**`Function`**

Creates a quaternion from the given euler angle x, y, z using the provided intrinsic order for the conversion.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `out` | [`quat`](../../../type-aliases/quat.md) | the receiving quaternion |
| `x` | `number` | Angle to rotate around X axis in degrees. |
| `y` | `number` | Angle to rotate around Y axis in degrees. |
| `z` | `number` | Angle to rotate around Z axis in degrees. |
| `order?` | `"xyz"` \| `"xzy"` \| `"yxz"` \| `"yzx"` \| `"zxy"` \| `"zyx"` | Intrinsic order for conversion, default is zyx. |

## Returns

[`quat`](../../../type-aliases/quat.md)

out
