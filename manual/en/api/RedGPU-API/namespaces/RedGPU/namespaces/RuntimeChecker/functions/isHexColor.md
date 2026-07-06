[**RedGPU API v4.2.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RuntimeChecker](../README.md) / isHexColor

# Function: isHexColor()

> **isHexColor**(`hex`): `boolean`

Defined in: [src/runtimeChecker/isFunc/isHexColor.ts:22](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/runtimeChecker/isFunc/isHexColor.ts#L22)

Checks if the given value is a valid hexadecimal (Hex) color format.

Supports 3-digit or 6-digit hex color strings with '#' prefix or integers between 0 and 0xFFFFFF.

* ### Example
```typescript
const isValidStr = RedGPU.RuntimeChecker.isHexColor('#FF0000');
const isValidNum = RedGPU.RuntimeChecker.isHexColor(0xFF0000);
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hex` | `any` | Value to check (string or number) |

## Returns

`boolean`

True if it is a valid hex color, otherwise false
