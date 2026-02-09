[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Color](../README.md) / convertRgbToHex

# Function: convertRgbToHex()

> **convertRgbToHex**(`r`, `g`, `b`): `string`

Defined in: [src/color/convertRgbToHex.ts:32](https://github.com/redcamel/RedGPU/blob/9bfdef0c694e55fcb123b3a85e1533dc988b5344/src/color/convertRgbToHex.ts#L32)


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
