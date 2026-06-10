[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Color](../README.md) / convertHexToRgb

# Function: convertHexToRgb()

## Call Signature

> **convertHexToRgb**(`hex`, `returnArrayYn`): \[`number`, `number`, `number`\]

Defined in: [src/color/convertHexToRgb.ts:30](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/color/convertHexToRgb.ts#L30)

Converts a hexadecimal (Hex) color value to an RGB color.

Receives hexadecimal data in string or number format and extracts each color channel (R, G, B).

* ### Example
```typescript
const rgb = RedGPU.Color.convertHexToRgb('#ff0000'); // { r: 255, g: 0, b: 0 }
const rgbArray = RedGPU.Color.convertHexToRgb(0x00ff00, true); // [0, 255, 0]
```

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hex` | `string` \| `number` | Hexadecimal color data to convert (e.g., '#ff0000', 'ff0', 0xff0000) |
| `returnArrayYn` | `true` | Whether to return RGB values in an array format (Default: false) |

### Returns

\[`number`, `number`, `number`\]

Converted RGB color data. Returns an [r, g, b] array if returnArrayYn is true, otherwise an {r, g, b} object.

### Throws

Throws Error if the input value is not a valid hexadecimal color format

## Call Signature

> **convertHexToRgb**(`hex`, `returnArrayYn?`): `object`

Defined in: [src/color/convertHexToRgb.ts:31](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/color/convertHexToRgb.ts#L31)

Converts a hexadecimal (Hex) color value to an RGB color.

Receives hexadecimal data in string or number format and extracts each color channel (R, G, B).

* ### Example
```typescript
const rgb = RedGPU.Color.convertHexToRgb('#ff0000'); // { r: 255, g: 0, b: 0 }
const rgbArray = RedGPU.Color.convertHexToRgb(0x00ff00, true); // [0, 255, 0]
```

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hex` | `string` \| `number` | Hexadecimal color data to convert (e.g., '#ff0000', 'ff0', 0xff0000) |
| `returnArrayYn?` | `false` | Whether to return RGB values in an array format (Default: false) |

### Returns

`object`

Converted RGB color data. Returns an [r, g, b] array if returnArrayYn is true, otherwise an {r, g, b} object.

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `b` | `number` | [src/color/convertHexToRgb.ts:31](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/color/convertHexToRgb.ts#L31) |
| `g` | `number` | [src/color/convertHexToRgb.ts:31](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/color/convertHexToRgb.ts#L31) |
| `r` | `number` | [src/color/convertHexToRgb.ts:31](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/color/convertHexToRgb.ts#L31) |

### Throws

Throws Error if the input value is not a valid hexadecimal color format

## Call Signature

> **convertHexToRgb**(`hex`, `returnArrayYn?`): \[`number`, `number`, `number`\] \| \{ `b`: `number`; `g`: `number`; `r`: `number`; \}

Defined in: [src/color/convertHexToRgb.ts:32](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/color/convertHexToRgb.ts#L32)

Converts a hexadecimal (Hex) color value to an RGB color.

Receives hexadecimal data in string or number format and extracts each color channel (R, G, B).

* ### Example
```typescript
const rgb = RedGPU.Color.convertHexToRgb('#ff0000'); // { r: 255, g: 0, b: 0 }
const rgbArray = RedGPU.Color.convertHexToRgb(0x00ff00, true); // [0, 255, 0]
```

### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hex` | `string` \| `number` | Hexadecimal color data to convert (e.g., '#ff0000', 'ff0', 0xff0000) |
| `returnArrayYn?` | `boolean` | Whether to return RGB values in an array format (Default: false) |

### Returns

\[`number`, `number`, `number`\] \| \{ `b`: `number`; `g`: `number`; `r`: `number`; \}

Converted RGB color data. Returns an [r, g, b] array if returnArrayYn is true, otherwise an {r, g, b} object.

### Throws

Throws Error if the input value is not a valid hexadecimal color format
