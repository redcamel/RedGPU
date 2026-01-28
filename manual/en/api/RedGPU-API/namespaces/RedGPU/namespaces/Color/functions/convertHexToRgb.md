[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Color](../README.md) / convertHexToRgb

# Function: convertHexToRgb()

> **convertHexToRgb**(`hex`, `returnArrayYn`): `any`

Defined in: [src/color/convertHexToRgb.ts:30](https://github.com/redcamel/RedGPU/blob/00cd5cecbc002066ec39f118ae442e3c339db347/src/color/convertHexToRgb.ts#L30)


Converts a hexadecimal (Hex) color value to an RGB color.


Receives hexadecimal data in string or number format and extracts each color channel (R, G, B).

* ### Example
```typescript
const rgb = RedGPU.Color.convertHexToRgb('#ff0000'); // { r: 255, g: 0, b: 0 }
const rgbArray = RedGPU.Color.convertHexToRgb(0x00ff00, true); // [0, 255, 0]
```

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `hex` | `string` \| `number` | `undefined` | Hexadecimal color data to convert (e.g., '#ff0000', 'ff0', 0xff0000) |
| `returnArrayYn` | `boolean` | `false` | Whether to return RGB values in an array format (Default: false) |

## Returns

`any`


Converted RGB color data

## Throws


Throws Error if the input value is not a valid hexadecimal color format
