[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RuntimeChecker](../README.md) / isHexColor

# Function: isHexColor()

> **isHexColor**(`hex`): `boolean`

Defined in: [src/runtimeChecker/isFunc/isHexColor.ts:21](https://github.com/redcamel/RedGPU/blob/3905c89e71c3a0a3e943b9c120a292fc0c103b90/src/runtimeChecker/isFunc/isHexColor.ts#L21)


Checks if the given string is a valid hexadecimal (Hex) color format.


Supports 3-digit or 6-digit hex color strings with '#' or '0x' prefixes.

* ### Example
```typescript
const isValid = RedGPU.RuntimeChecker.isHexColor('#FF0000');
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `hex` | `string` | String to check |

## Returns

`boolean`


True if it is a valid hex color, otherwise false
