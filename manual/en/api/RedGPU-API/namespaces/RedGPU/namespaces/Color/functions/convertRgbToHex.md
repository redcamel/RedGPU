[**RedGPU API v4.3.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Color](../README.md) / convertRgbToHex

# Function: convertRgbToHex()

> **convertRgbToHex**(`r`, `g`, `b`): `string`

Defined in: [src/color/convertRgbToHex.ts:32](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/color/convertRgbToHex.ts#L32)

Converts RGB values to a hexadecimal (Hex) color code.

Converts each channel (R, G, B) into a 2-digit uppercase hexadecimal string ('#RRGGBB').

* ### Example
```typescript
const hex = RedGPU.Color.convertRgbToHex(255, 0, 0); // '#FF0000'
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `r` | `number` | Red component (0~255) |
| `g` | `number` | Green component (0~255) |
| `b` | `number` | Blue component (0~255) |

## Returns

`string`

Converted hexadecimal color code string

## Throws

Throws Error if any color component is out of the 0~255 range
