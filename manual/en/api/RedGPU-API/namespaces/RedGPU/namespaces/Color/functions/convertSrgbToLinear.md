[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Color](../README.md) / convertSrgbToLinear

# Function: convertSrgbToLinear()

> **convertSrgbToLinear**(`channel`): `number`

Defined in: [src/color/convertSrgbToLinear.ts:31](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/color/convertSrgbToLinear.ts#L31)

Converts an sRGB channel value in the 0~255 range to a linear value in the 0~1 range using the IEC 61966-2-1 standard sRGB transfer function (EOTF).

Uses the same piecewise function as GPU `-srgb` texture decoding and the shader `srgbToLinearVec3` instead of the simple `pow(x, 2.2)` approximation, so texture colors and uniform colors match even in dark regions. Uses a precomputed lookup table, so it has no computation or heap allocation cost even in hot paths.

### Example
```typescript
const linear = RedGPU.Color.convertSrgbToLinear(128); // 0.2158605...
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `channel` | `number` | sRGB channel value (integer 0~255). No range validation is performed, so the caller must guarantee a valid range. |

## Returns

`number`

Linear value in the 0~1 range
