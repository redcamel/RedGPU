[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [RuntimeChecker](../README.md) / isHexColor

# Function: isHexColor()

> **isHexColor**(`hex`): `boolean`

Defined in: [src/runtimeChecker/isFunc/isHexColor.ts:19](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/runtimeChecker/isFunc/isHexColor.ts#L19)

Checks if the given value is a valid hexadecimal (Hex) color format. Supports 3/6-digit strings with '#' prefix or integers in the range 0 to 0xFFFFFF.

### Example
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
